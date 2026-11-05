const enc = new TextEncoder();
const dec = new TextDecoder();
const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64urlText = s => b64url(enc.encode(s));
function b64urlBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s), out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

let JWKS = null, JWKS_EXP = 0, ACCESS = null, ACCESS_EXP = 0;

async function verifyIdToken(token, projectId) {
  const parts = (token || '').split('.');
  if (parts.length !== 3) throw new Error('format');
  const [h, p, s] = parts;
  const header = JSON.parse(dec.decode(b64urlBytes(h)));
  const payload = JSON.parse(dec.decode(b64urlBytes(p)));
  const now = Date.now() / 1000;
  if (header.alg !== 'RS256') throw new Error('alg');
  if (payload.aud !== projectId || payload.iss !== 'https://securetoken.google.com/' + projectId) throw new Error('aud');
  if (!payload.sub || payload.exp < now || payload.iat > now + 300) throw new Error('time');
  if (!JWKS || Date.now() > JWKS_EXP) {
    const r = await fetch('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com');
    JWKS = (await r.json()).keys || [];
    JWKS_EXP = Date.now() + 3600e3;
  }
  const jwk = JWKS.find(k => k.kid === header.kid);
  if (!jwk) throw new Error('kid');
  const key = await crypto.subtle.importKey('jwk', { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true }, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlBytes(s), enc.encode(h + '.' + p));
  if (!ok) throw new Error('signature');
  return payload.sub;
}

async function accessToken(sa) {
  if (ACCESS && Date.now() < ACCESS_EXP) return ACCESS;
  const now = Math.floor(Date.now() / 1000);
  const head = b64urlText(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64urlText(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600
  }));
  const pem = sa.private_key.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const der = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, enc.encode(head + '.' + claim));
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + head + '.' + claim + '.' + b64url(sig)
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('access-token: ' + (j.error_description || j.error || r.status));
  ACCESS = j.access_token;
  ACCESS_EXP = Date.now() + 50 * 60e3;
  return ACCESS;
}

export async function onRequestPost({ request, env }) {
  try {
    if (!env.FIREBASE_SA) return json({ error: 'not-configured' }, 503);
    const sa = JSON.parse(env.FIREBASE_SA);
    const pid = sa.project_id;

    let uid;
    try {
      uid = await verifyIdToken((request.headers.get('authorization') || '').replace(/^Bearer\s+/i, ''), pid);
    } catch (e) {
      return json({ error: 'unauthorized' }, 401);
    }

    const b = await request.json();
    const cid = String(b.cid || '');
    if (!/^[A-Za-z0-9]+_[A-Za-z0-9]+$/.test(cid)) return json({ error: 'bad-request' }, 400);
    const title = String(b.title || '세겹줄').slice(0, 60);
    const body = String(b.body || '').slice(0, 200);
    const tag = String(b.tag || 'segyeopjul').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40) || 'segyeopjul';
    const url = String(b.url || '/').startsWith('/') ? String(b.url || '/').slice(0, 100) : '/';

    const at = await accessToken(sa);
    const base = `https://firestore.googleapis.com/v1/projects/${pid}/databases/(default)/documents/`;
    const cr = await fetch(base + 'couples/' + cid, { headers: { authorization: 'Bearer ' + at } });
    if (!cr.ok) return json({ error: 'no-couple' }, 404);
    const cdoc = await cr.json();
    const members = (((cdoc.fields || {}).members || {}).arrayValue || {}).values || [];
    const ids = members.map(v => v.stringValue);
    if (!ids.includes(uid)) return json({ error: 'forbidden' }, 403);
    const to = ids.find(x => x !== uid);

    const ur = await fetch(base + 'users/' + to, { headers: { authorization: 'Bearer ' + at } });
    if (!ur.ok) return json({ sent: 0 });
    const udoc = await ur.json();
    const push = ((((udoc.fields || {}).push || {}).mapValue || {}).fields) || {};
    const tokens = Object.values(push).map(v => v.stringValue).filter(Boolean).slice(0, 5);

    let sent = 0;
    for (const t of tokens) {
      const r = await fetch(`https://fcm.googleapis.com/v1/projects/${pid}/messages:send`, {
        method: 'POST',
        headers: { authorization: 'Bearer ' + at, 'content-type': 'application/json' },
        body: JSON.stringify({ message: { token: t, data: { title, body, tag, url }, webpush: { headers: { Urgency: 'high', TTL: '86400' } } } })
      });
      if (r.ok) sent++;
    }
    return json({ sent });
  } catch (e) {
    return json({ error: String(e && e.message || e) }, 500);
  }
}

export async function onRequestGet({ env }) {
  return json({ ok: true, configured: !!env.FIREBASE_SA });
}
