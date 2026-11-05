"use strict";
/* ================= 규칙 ================= */
const MISSION_XP = 10;   // 둘 다 끝낸 미션 1개당 아기양 성장
const CARE_XP = 2;       // 한 사람의 돌봄 1번당 아기양 성장 (하루에 돌봄 종류마다 1번)
const STAGES = [
  {xp:0,   name:'갓 태어난 아기양', scale:.62},
  {xp:120, name:'꼬마 양',          scale:.74},
  {xp:360, name:'어린 양',          scale:.86},
  {xp:800, name:'의젓한 양',        scale:.98}
];
const VERSES = [
 ['요한복음 3:16','하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망치 않고 영생을 얻게 하려 하심이니라'],
 ['고린도전서 13:4','사랑은 오래 참고 사랑은 온유하며 투기하는 자가 되지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며'],
 ['고린도전서 13:13','그런즉 믿음, 소망, 사랑, 이 세가지는 항상 있을 것인데 그 중에 제일은 사랑이라'],
 ['빌립보서 4:13','내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라'],
 ['빌립보서 4:6','아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라'],
 ['잠언 3:5-6','너는 마음을 다하여 여호와를 의뢰하고 네 명철을 의지하지 말라 너는 범사에 그를 인정하라 그리하면 네 길을 지도하시리라'],
 ['시편 23:1','여호와는 나의 목자시니 내가 부족함이 없으리로다'],
 ['이사야 41:10','두려워 말라 내가 너와 함께 함이니라 놀라지 말라 나는 네 하나님이 됨이니라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라 참으로 나의 의로운 오른손으로 너를 붙들리라'],
 ['로마서 8:28','우리가 알거니와 하나님을 사랑하는 자 곧 그 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라'],
 ['전도서 4:12','한 사람이면 패하겠거니와 두 사람이면 능히 당하나니 삼겹줄은 쉽게 끊어지지 아니하느니라'],
 ['전도서 4:9','두 사람이 한 사람보다 나음은 저희가 수고함으로 좋은 상을 얻을 것임이라'],
 ['요한일서 4:19','우리가 사랑함은 그가 먼저 우리를 사랑하셨음이라'],
 ['요한일서 4:7','사랑하는 자들아 우리가 서로 사랑하자 사랑은 하나님께 속한 것이니 사랑하는 자마다 하나님께로 나서 하나님을 알고'],
 ['에베소서 4:2','모든 겸손과 온유로 하고 오래 참음으로 사랑 가운데서 서로 용납하고'],
 ['에베소서 4:32','서로 인자하게 하며 불쌍히 여기며 서로 용서하기를 하나님이 그리스도 안에서 너희를 용서하심과 같이 하라'],
 ['골로새서 3:14','이 모든 것 위에 사랑을 더하라 이는 온전하게 매는 띠니라'],
 ['데살로니가전서 5:16-18','항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라'],
 ['마태복음 6:33','너희는 먼저 그의 나라와 그의 의를 구하라 그리하면 이 모든 것을 너희에게 더하시리라'],
 ['마태복음 11:28','수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라'],
 ['시편 119:105','주의 말씀은 내 발에 등이요 내 길에 빛이니이다'],
 ['예레미야 29:11','여호와의 말씀이니라 너희를 향한 나의 생각은 내가 아나니 평안이요 재앙이 아니니라 너희 장래에 소망을 주려 하는 생각이라'],
 ['이사야 40:31','오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요 달음박질하여도 곤비치 아니하겠고 걸어가도 피곤치 아니하리로다'],
 ['시편 37:5','너의 길을 여호와께 맡기라 저를 의지하면 저가 이루시고'],
 ['갈라디아서 6:2','너희가 짐을 서로 지라 그리하여 그리스도의 법을 성취하라'],
 ['갈라디아서 5:22-23','오직 성령의 열매는 사랑과 희락과 화평과 오래 참음과 자비와 양선과 충성과 온유와 절제니 이같은 것을 금지할 법이 없느니라'],
 ['요한복음 15:12','내 계명은 곧 내가 너희를 사랑한 것같이 너희도 서로 사랑하라 하는 이것이니라'],
 ['요한복음 14:27','평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라 내가 너희에게 주는 것은 세상이 주는 것 같지 아니하니라 너희는 마음에 근심하지도 말고 두려워하지도 말라'],
 ['히브리서 10:24','서로 돌아보아 사랑과 선행을 격려하며'],
 ['베드로전서 4:8','무엇보다도 열심으로 서로 사랑할지니 사랑은 허다한 죄를 덮느니라'],
 ['시편 133:1','보라 형제가 연합하여 동거함이 어찌 그리 선하고 아름다운고'],
 ['로마서 12:12','소망 중에 즐거워하며 환난 중에 참으며 기도에 항상 힘쓰며'],
 ['여호수아 1:9','내가 네게 명한 것이 아니냐 마음을 강하게 하고 담대히 하라 두려워 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라']
];
const QUESTIONS = [
 '하나님은 내 삶에 어떤 분이신가요?','내가 제일 좋아하는 음식은?','우리가 처음 만난 날, 첫인상은 어땠나요?','요즘 가장 감사한 일 한 가지는?',
 '가장 좋아하는 성경 인물과 그 이유는?','상대에게 가장 고마웠던 순간은?','함께 꼭 가보고 싶은 여행지는?','힘들 때 힘이 되었던 말씀이 있나요?',
 '우리 커플의 장점 세 가지는?','어릴 때 꿈은 무엇이었나요?','요즘 나를 웃게 하는 것은?','상대의 기도제목 중 기억에 남는 것은?',
 '10년 뒤 우리는 어떤 모습일까요?','가장 좋아하는 찬양은?','데이트 중 최고의 하루는 언제였나요?','스트레스 받을 때 나만의 회복법은?',
 '믿음이 자랐다고 느낀 순간은?','상대에게 배우고 싶은 점은?','이번 주에 꼭 해보고 싶은 것은?','좋아하는 계절과 이유는?',
 '우리 가정에서 지키고 싶은 신앙 습관은?','사랑을 가장 크게 느끼는 표현 방식은? (말, 선물, 시간, 스킨십, 섬김)','최근 마음에 남은 설교 한 줄은?','내 인생 영화나 책은?',
 '서운함을 느낄 때 상대가 어떻게 해주면 좋을까요?','교회에서 함께 섬기고 싶은 사역은?','상대의 웃음이 가장 예뻤던 순간은?','오늘 하루를 한 단어로 표현하면?',
 '하나님께 가장 묻고 싶은 질문은?','함께 이루고 싶은 올해의 목표는?','나만 아는 상대의 귀여운 습관은?','기도 응답을 경험한 이야기가 있나요?',
 '주말에 가장 하고 싶은 데이트는?','부모님께 배운 가장 소중한 가치는?','상대를 위해 요즘 어떤 기도를 하나요?','우리만의 기념일을 하나 만든다면?'
];

const LAMB_LINES=['매에~','오늘도 같이 와줘서 고마워요','{a}랑 {b} 둘 다 좋아요','풀 냄새가 좋아요','말씀 같이 읽어요!','쓰다듬어 줄래요?','배가 조금 고파요','하나님이 우리를 지켜주세요','오늘 기도제목은 뭐예요?','폭신폭신 매~'];
const POSE={sit:'00',sleep:'01',walk:'02',yawn:'10',roll:'11',peek:'12',yum:'20',graze:'21',back:'22'};
const EVERY=['read','daisy','flower','back','yawn'];   // 기본 화면에서 잠깐씩 보여줄 일상 행동
const lambImg=p=>`lamb-${POSE[p]||p}.png`;
const LAMB_W={sit:196,sleep:246,walk:201,yawn:213,roll:245,peek:134,yum:186,graze:257,back:171,wave:182,pray:186,read:171,daisy:173,flower:218};
const LAMB_K={daisy:1.08};   // 그림마다 양 몸 크기가 같아 보이도록 보정
const CYCLE_MS=15000, SHOW_MS=5000;  // 15초마다 5초 동안 다른 행동, 그 뒤 앉은 모습으로
const CARE=[['feed','풀 주기','graze'],['pet','쓰다듬기','roll'],['sleep','재우기','sleep']];
const MISSIONS=[['verse','말씀 묵상'],['prayer','기도제목'],['question','오늘의 질문'],['photo','사진 기록']];
/* ================= Firebase 연결 ================= */
const CFG=(window.DC_CONFIG||{}).firebase||{};
const CONFIGURED=!!(CFG.apiKey&&CFG.projectId&&CFG.authDomain);
let auth=null,db=null,FV=null,FP=null;
if(CONFIGURED&&window.firebase){
  firebase.initializeApp(CFG);auth=firebase.auth();db=firebase.firestore();
  FV=firebase.firestore.FieldValue;FP=firebase.firestore.FieldPath;
  try{db.enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}
}
/* 화면이 쓰는 상태: 로그인한 사람, 내 정보, 커플 문서, 날짜별 기록, 사진 */
const ST={ready:false,user:null,profile:null,couple:null,coupleChecked:false,days:{},photos:{},unsub:[],photoUnsub:null,photoDay:null};
const UI={tab:'home',dayOpen:{}};
const pad=n=>String(n).padStart(2,'0');
function dkey(d=new Date()){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function dnum(k){return Math.floor(Date.parse(k+'T00:00:00Z')/864e5)}
const josa=(w,a,b)=>{const c=String(w).charCodeAt(String(w).length-1);return w+((c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28)?a:b)};
const esc=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S={get session(){return ST.user?ST.user.uid:null},get accounts(){return (ST.couple&&ST.couple.people)||{}}};
function me(){
  if(!ST.user)return null;const p=ST.profile||{},c=ST.couple;
  return {uid:ST.user.uid,name:p.name||ST.user.displayName||'나',email:ST.user.email||'',code:p.code||'',
    coupleId:c?c.id:null,introSeen:!!p.introSeen,seen:p.seen||{},lambName:c&&c.names?c.names[ST.user.uid]||null:null};
}
function couple(){const c=ST.couple;if(!c)return null;return Object.assign({lamb:{name:null,born:null}},c,{days:ST.days})}
function partner(){const c=ST.couple;if(!c)return null;const u=c.a===ST.user.uid?c.b:c.a;return {uid:u,name:((c.people||{})[u]||{}).name||'상대'}}
function newCode(){const A='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from({length:6},()=>A[Math.floor(Math.random()*A.length)]).join('')}

const userRef=()=>db.collection('users').doc(ST.user.uid);
const coupleRef=()=>db.collection('couples').doc(ST.couple.id);
const dayRef=d=>coupleRef().collection('days').doc(d);
const photoRef=id=>coupleRef().collection('photos').doc(id);
const photoSrcRef=id=>coupleRef().collection('photoSrc').doc(id);
function fail(e){console.error(e);toast(e&&e.code==='permission-denied'?'저장할 권한이 없어요. Firestore 규칙을 게시했는지 확인해 주세요.':'저장하지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.')}
function onErr(e){console.error(e);if(e&&e.code==='permission-denied')toast('데이터를 읽을 권한이 없어요. Firestore 규칙을 게시했는지 확인해 주세요.')}
function setUser(patch){ST.profile=Object.assign({},ST.profile,patch);return userRef().set(Object.assign({},patch,{updatedAt:FV.serverTimestamp()}),{merge:true}).catch(fail)}

/* 로그인 */
const INAPP=/KAKAOTALK|Instagram|FBAN|FBAV|FB_IAB|Line\/|NAVER\(|DaumApps|everytimeApp|BAND\//i.test(navigator.userAgent);
async function signIn(){
  if(INAPP){toast('앱 안의 브라우저에서는 Google 로그인이 막혀 있어요. Safari나 Chrome으로 열어 주세요.');return}
  const pr=new firebase.auth.GoogleAuthProvider();pr.setCustomParameters({prompt:'select_account'});
  try{await auth.signInWithPopup(pr)}
  catch(e){
    if(e&&(e.code==='auth/popup-blocked'||e.code==='auth/operation-not-supported-in-this-environment')){try{await auth.signInWithRedirect(pr)}catch(e2){signInError(e2)}}
    else signInError(e);
  }
}
function signInError(e){
  const c=(e&&e.code)||'';if(!c||c==='auth/popup-closed-by-user'||c==='auth/cancelled-popup-request')return;
  if(c==='auth/unauthorized-domain')toast('이 주소가 Firebase 승인된 도메인에 없어요. 배포 안내의 Firebase 로그인 설정을 확인해 주세요.');
  else if(c==='auth/network-request-failed')toast('인터넷 연결을 확인하고 다시 시도해 주세요.');
  else toast('로그인하지 못했어요 ('+c+'). 잠시 뒤 다시 시도해 주세요.');
}
function stopAll(){ST.unsub.forEach(f=>{try{f()}catch(e){}});ST.unsub=[];if(ST.photoUnsub){ST.photoUnsub();ST.photoUnsub=null}}
function startAuth(){
  if(!CONFIGURED){ST.ready=true;render();return}
  auth.getRedirectResult().catch(signInError);
  auth.onAuthStateChanged(async u=>{
    stopAll();Object.assign(ST,{user:u,profile:null,couple:null,coupleChecked:false,days:{},photos:{},photoDay:null});
    UI.tab='home';UI.introShown=UI.revealShown=false;UI.waitFor=null;LAMB=null;closeSheet();PE=null;
    if(!u){ST.ready=true;render();return}
    ST.ready=false;render();
    try{await ensureProfile(u)}catch(e){fail(e)}
    ST.unsub.push(userRef().onSnapshot(s=>{if(s.exists){ST.profile=s.data()}render()},onErr));
    ST.unsub.push(db.collection('couples').where('members','array-contains',u.uid).limit(1).onSnapshot(qs=>{
      const doc=qs.docs[0],prev=ST.couple&&ST.couple.id;
      ST.couple=doc?Object.assign({id:doc.id},doc.data()):null;ST.coupleChecked=true;
      if(ST.couple&&prev!==ST.couple.id)onCoupled();
      ST.ready=true;render();
    },e=>{onErr(e);ST.coupleChecked=true;ST.ready=true;render()}));
  });
}
async function ensureProfile(u){
  const ref=db.collection('users').doc(u.uid),s=await ref.get();
  const p=s.exists?Object.assign({},s.data()):{name:(u.displayName||(u.email||'').split('@')[0]||'나').slice(0,20),email:u.email||'',introSeen:false,seen:{}};
  for(let i=0;i<6&&!p.code;i++){
    const code=newCode(),cr=db.collection('codes').doc(code);
    const ok=await db.runTransaction(async tx=>{const x=await tx.get(cr);if(x.exists)return false;tx.set(cr,{uid:u.uid,name:p.name});return true});
    if(ok)p.code=code;
  }
  ST.profile=p;
  if(!s.exists||!s.data().code)await ref.set(Object.assign({},p,{updatedAt:FV.serverTimestamp()}),{merge:true});
}
function onCoupled(){
  const code=(ST.profile||{}).code;
  if(code)db.collection('codes').doc(code).set({coupleId:ST.couple.id},{merge:true}).catch(()=>{});
  ST.unsub.push(coupleRef().collection('days').onSnapshot(qs=>{const o={};qs.forEach(d=>{o[d.id]=d.data()});ST.days=o;render()},onErr));
  watchTodayPhotos();
}
/* 오늘 사진은 실시간으로, 지난 사진은 펼칠 때만 불러옴 */
function watchTodayPhotos(){
  const d=dkey();if(ST.photoDay===d&&ST.photoUnsub)return;
  if(ST.photoUnsub)ST.photoUnsub();ST.photoDay=d;
  ST.photoUnsub=coupleRef().collection('photos').where('date','==',d).onSnapshot(qs=>{
    qs.docChanges().forEach(ch=>{if(ch.type==='removed')delete ST.photos[ch.doc.id];else ST.photos[ch.doc.id]=ch.doc.data()});render();
  },onErr);
}
const PH_PENDING={};
function needPhoto(id){
  if(ST.photos[id]||PH_PENDING[id]||!ST.couple)return;PH_PENDING[id]=1;
  photoRef(id).get().then(s=>{delete PH_PENDING[id];if(!s.exists)return;ST.photos[id]=s.data();
    document.querySelectorAll(`img[data-pid="${id}"]`).forEach(i=>{i.src=ST.photos[id].img;i.classList.remove('loading')})}).catch(e=>{delete PH_PENDING[id];onErr(e)});
}
function photoImg(d,u,alt){const id=d+'_'+u,p=ST.photos[id];return `<img data-pid="${id}" class="${p?'':'loading'}" ${p?`src="${p.img}"`:''} alt="${esc(alt||'')}">`}
function fillPhotos(root){root.querySelectorAll('img.loading[data-pid]').forEach(i=>{const det=i.closest('details');if(!det||det.open)needPhoto(i.dataset.pid)})}

/* 커플 연결: 상대 코드 → 같은 커플 문서를 한 번만 만듦 */
async function connectByCode(code){
  const m=me();if(!/^[A-Z0-9]{6}$/.test(code))return toast('코드는 영문과 숫자 6자리예요');
  if(code===m.code)return toast('내 코드예요. 상대방의 코드를 입력해 주세요');
  let o;try{const s=await db.collection('codes').doc(code).get();if(!s.exists)return toast('코드를 찾지 못했어요. 다시 확인해 주세요');o=s.data()}catch(e){return fail(e)}
  if(o.coupleId)return toast('이미 다른 사람과 연결된 코드예요');
  const members=[m.uid,o.uid].sort(),cid=members.join('_'),ref=db.collection('couples').doc(cid);
  try{
    await db.runTransaction(async tx=>{const s=await tx.get(ref);if(s.exists)return;
      tx.set(ref,{members,a:members[0],b:members[1],viaCode:code,since:dkey(),people:{[m.uid]:{name:m.name},[o.uid]:{name:o.name}},names:{},lamb:{name:null,born:null},createdAt:FV.serverTimestamp()})});
    toast(`${o.name}님과 연결됐어요!`);
  }catch(e){fail(e)}
}
/* 두 사람 이름이 모두 모이면 한쪽 기기가 랜덤으로 한 번만 정함 */
let lambBusy=false;
function ensureLamb(c){
  if((c.lamb&&c.lamb.name)||lambBusy)return;const n=c.names||{};if(!(n[c.a]&&n[c.b]))return;lambBusy=true;
  db.runTransaction(async tx=>{const s=await tx.get(coupleRef()),x=s.data();if(x.lamb&&x.lamb.name)return;const nn=x.names||{};if(!(nn[x.a]&&nn[x.b]))return;
    const cands=[{uid:x.a,name:nn[x.a]},{uid:x.b,name:nn[x.b]}],pick=Math.random()<.5?0:1;
    tx.update(coupleRef(),{lamb:{name:cands[pick].name,born:dkey(),cands,pick}})}).catch(fail).finally(()=>{lambBusy=false});
}


/* ================= 미션·성장 계산 ================= */
const did=(c,d,k,u)=>!!(c.days[d]&&c.days[d][k]&&c.days[d][k][u]);
const clear=(c,d,k)=>did(c,d,k,c.a)&&did(c,d,k,c.b);
const cared=(c,d,k,u)=>!!(c.days[d]&&c.days[d].care&&c.days[d].care[k]&&c.days[d].care[k][u]);
const readCount=c=>Object.keys(c.days).filter(d=>clear(c,d,'verse')).length;
function xpOf(c){let x=0;for(const d of Object.keys(c.days)){for(const [k] of MISSIONS)if(clear(c,d,k))x+=MISSION_XP;const cr=c.days[d].care||{};for(const k in cr)x+=Object.keys(cr[k]).length*CARE_XP}return x}
function stageOf(xp){let i=0;STAGES.forEach((s,n)=>{if(xp>=s.xp)i=n});const cur=STAGES[i],next=STAGES[i+1];return {i,cur,next,pct:next?(xp-cur.xp)/(next.xp-cur.xp):1}}
const verseOf=d=>VERSES[((dnum(d)%VERSES.length)+VERSES.length)%VERSES.length];
const questionOf=d=>QUESTIONS[(((dnum(d)*7)%QUESTIONS.length)+QUESTIONS.length)%QUESTIONS.length];
function announce(){
  const m=me(),c=couple();if(!m||!c||!c.lamb||!c.lamb.name||!ST.profile)return;const add={};let n=0;
  for(const d of Object.keys(c.days))for(const [k] of MISSIONS){const key=d+':'+k;if(clear(c,d,k)&&!m.seen[key]){add[key]=1;n++}}
  if(n){ST.profile.seen=Object.assign({},m.seen,add);setUser({seen:add});setTimeout(()=>toast(`미션 클리어! ${c.lamb.name} +${n*MISSION_XP} 성장`),300)}
}
/* ================= 공통 UI ================= */
let tT;function toast(t){const e=document.getElementById('toast');e.textContent=t;e.classList.add('on');clearTimeout(tT);tT=setTimeout(()=>e.classList.remove('on'),2400)}
function sheet(html){document.getElementById('sheetRoot').innerHTML=`<div class="sheetBg" data-act="closeSheet"><div class="sheet" role="dialog" aria-modal="true">${html}</div></div>`}
function closeSheet(){document.getElementById('sheetRoot').innerHTML=''}
const initial=a=>`<span class="initial" aria-hidden="true">${esc((a.name||'?').slice(0,1))}</span>`;
/* ================= 렌더링 ================= */
function keepInputs(app){const o={};app.querySelectorAll('textarea[id],input[id]').forEach(el=>{if(el.type!=='file'&&el.value)o[el.id]=el.value});const f=document.activeElement;return {o,focus:f&&f.id&&app.contains(f)?f.id:null,sel:f&&f.selectionStart}}
function restoreInputs(k){for(const id in k.o){const el=document.getElementById(id);if(el&&!el.value)el.value=k.o[id]}if(k.focus){const el=document.getElementById(k.focus);if(el){el.focus();try{if(k.sel!=null)el.setSelectionRange(k.sel,k.sel)}catch(e){}}}}
function render(){
  stopScene();
  const app=document.getElementById('app'),keep=keepInputs(app),m=me();
  app.className='app noNav';
  const done=html=>{app.innerHTML=html;restoreInputs(keep);fillPhotos(app)};
  if(!CONFIGURED)return done(viewSetup());
  if(!ST.ready)return done(viewSplash());
  if(!m)return done(viewLogin());
  if(!ST.coupleChecked||!ST.profile)return done(viewSplash());
  if(!m.coupleId){done(viewConnect());if(!m.introSeen&&!UI.introShown){UI.introShown=true;sheetIntro()}return}
  if(!m.lambName)return done(viewName());
  const c=couple();ensureLamb(c);
  if(!c.lamb||!c.lamb.name){done(viewWait());if(UI.waitFor!==m.uid){UI.waitFor=m.uid;sheetWait()}return}
  if(ST.photoDay!==dkey())watchTodayPhotos();
  announce();
  app.className='app';
  done(viewTop()+({home:viewHome,today:viewToday,diary:viewDiary,me:viewMe}[UI.tab])()+viewNav());
  if(UI.tab==='home')startScene();
  if(!(m.seen&&m.seen.reveal)&&!UI.revealShown){UI.revealShown=true;sheetReveal()}
}
function viewSplash(){return `<section class="login"><div class="hero2" aria-hidden="true"><div class="sky"></div><img src="${lambImg('sleep')}" alt=""></div><p class="tag">불러오는 중이에요…</p></section>`}
function viewSetup(){return `<section class="login"><div><h1 class="wordmark">Threefold Cord</h1><div class="wordsub">세겹줄</div></div><p class="tag">아직 Firebase 설정값이 없어요.<br>dc-config.js에 Firebase 웹 앱 설정값을 넣고 다시 올려 주세요.</p></section>`}

function viewTop(){
  const m=me(),p=partner(),c=couple();
  const days=dnum(dkey())-dnum(c.since)+1;
  return `<header class="top"><div class="who"><div class="dday">D+${days}</div><div class="names">${esc(m.name)} ♥ ${esc(p.name)}</div></div></header>`;
}
function viewNav(){
  const c=couple(),d=dkey();const pending=MISSIONS.some(([k])=>!did(c,d,k,S.session));
  const t=[['home','아기양'],['today','오늘'],['diary','기록'],['me','계정']];
  return `<nav class="nav"><div class="in">${t.map(([k,n])=>`<button data-act="tab" data-v="${k}" ${UI.tab===k?'aria-current="page"':''}>${k==='today'&&pending?'<span class="dot" aria-label="할 일 있음"></span>':''}${n}</button>`).join('')}</div></nav>`;
}

/* ---- 로그인 ---- */
function viewLogin(){
  return `<section class="login">
   <div class="hero2" aria-hidden="true"><div class="sky"></div><img src="${lambImg('sit')}" alt=""></div>
   <div><h1 class="wordmark">Threefold Cord</h1><div class="wordsub">세겹줄</div><p class="tag" style="margin-top:14px">둘이 함께 말씀 읽고 기도하며<br>아기양 한 마리를 키워가는 크리스천 커플앱</p></div>
   <div class="stack">
    <button class="gbtn" data-act="google"><b>G</b>Google 계정으로 시작하기</button>
   </div>
   ${INAPP?`<p class="inappNote">카카오톡·인스타그램 같은 앱 안에서 열면 Google 로그인이 막혀요. 오른쪽 위 메뉴에서 <b>다른 브라우저로 열기</b>(Safari·Chrome)를 눌러 주세요.</p>`:''}
  </section>`;
}
function sheetIntro(){
  sheet(`<div class="stack" style="gap:14px;text-align:center"><div class="eyebrow" style="justify-content:center">Welcome</div>
   <img src="${lambImg('peek')}" alt="" style="height:120px;align-self:center">
   <h2>커플 연결이 필요해요</h2>
   <p class="muted" style="margin:0">세겹줄은 두 사람이 코드로 연결된 뒤에 쓸 수 있어요. 서로의 고유 코드를 입력해 연결하면 각자 아기양 이름을 하나씩 짓고, 두 이름 중 하나가 랜덤으로 정해져요.</p>
   <button class="btn wide" data-act="introOk">알겠어요</button></div>`);
}
function sheetWait(){
  const p=partner();
  sheet(`<div class="stack" style="gap:14px;text-align:center"><div class="eyebrow" style="justify-content:center">Waiting</div>
   <img src="${lambImg('sleep')}" alt="" style="height:110px;align-self:center">
   <h2>${esc(p.name)}님의 접속을 기다리고 있어요</h2>
   <p class="muted" style="margin:0">${esc(p.name)}님이 접속해서 아기양 이름을 지으면, 두 이름 중 하나로 아기양이 태어나요.</p>
   <button class="btn wide" data-act="closeSheet2">확인</button></div>`);
}

function sheetReveal(){
  const c=couple();const cs=c.lamb.cands;
  const nm=u=>esc((S.accounts[u]||{}).name||'');
  const same=cs&&cs[0].name===cs[1].name,win=cs&&cs[c.lamb.pick];
  const born=c.lamb.born===dkey();
  sheet(`<div class="stack" style="gap:12px;text-align:center"><div class="eyebrow" style="justify-content:center">${born?'A New Lamb':'Our Lamb'}</div>
   <img src="${lambImg('yawn')}" alt="" style="height:140px;align-self:center">
   <p style="margin:0;color:var(--ink-strong)">${cs?(same?'두 사람이 똑같은 이름을 지었어요':`${nm(win.uid)}님이 지은 이름이 채택됐어요`):'아기양 이름'}</p>
   <h2 style="font-size:30px">${esc(c.lamb.name)}</h2>
   ${cs&&!same?`<div class="pickRow">${cs.map((x,i)=>`<div class="${i===c.lamb.pick?'won':''}"><span>${nm(x.uid)}</span><b>${esc(x.name)}</b>${i===c.lamb.pick?'<em>채택</em>':''}</div>`).join('')}</div><p class="small muted" style="margin:0">두 이름 중에서 랜덤으로 뽑혔어요.</p>`:''}
   <button class="btn wide" data-act="revealOk">${esc(c.lamb.name)} 만나러 가기</button></div>`);
}

/* ---- 아기양 이름 짓기 (연결 전, 각자) ---- */
function viewName(){
  const p=partner();
  return `<section class="stack" style="padding-block:32px">
   <div class="row" style="justify-content:space-between"><div class="eyebrow" style="flex:1">A Name for Our Lamb</div><button class="linkBtn" data-act="accounts">계정</button></div>
   <h1 style="font-size:26px">${esc(josa(p.name,'과','와'))} 연결됐어요.<br>아기양 이름을 지어 주세요</h1>
   <div class="nameHero"><img src="${lambImg('sleep')}" alt="곧 태어날 아기양"></div>
   <p class="muted" style="margin:0">${esc(p.name)}님도 각자 이름을 하나 지어요. 두 이름 중 하나가 랜덤으로 정해져요.</p>
   <form id="nameForm" class="stack"><input id="lambName" class="field" maxlength="8" required placeholder="예: 몽글이"><button class="btn wide" type="submit">이 이름으로 정하기</button></form>
  </section>`;
}

/* ---- 커플 연결 ---- */
function viewConnect(){
  const m=me();
  return `<section class="stack" style="padding-block:24px;gap:0">
   <div class="row" style="justify-content:space-between;padding-bottom:16px"><div class="stack" style="gap:2px"><span class="label">CONNECT</span><h1 style="font-size:26px">커플 연결</h1></div><button class="linkBtn" data-act="accounts">계정</button></div>
   <div class="peekWrap"><p>코드로 연결하면<br>두 사람만의 아기양이 태어나요.</p><img src="${lambImg('peek')}" alt=""></div>
   <div class="sec stack" style="gap:4px;text-align:center"><div class="eyebrow">My Code</div><div class="code">${m.code}</div><button class="btn soft sm" data-act="copyCode" style="align-self:center">코드 복사</button></div>
   <form id="linkForm" class="sec stack"><label class="stack" style="gap:6px"><span class="label">상대방 코드</span><input id="pcode" class="field codeIn" maxlength="6" autocomplete="off" placeholder="ABC123" required></label><button class="btn wide" type="submit">연결하기</button></form>
   <p class="small muted" style="margin:14px 0 0">두 사람 중 한 명만 상대 코드를 입력하면 둘 다 연결돼요.</p>
  </section>`;
}

function viewWait(){
  const p=partner(),m=me();
  return `<section class="stack" style="padding-block:32px">
   <div class="row" style="justify-content:space-between"><div class="eyebrow" style="flex:1">Waiting</div><button class="linkBtn" data-act="accounts">계정</button></div>
   <h1 style="font-size:26px">${esc(p.name)}님의 접속을<br>기다리고 있어요</h1>
   <div class="nameHero"><img src="${lambImg('sleep')}" alt=""></div>
   <p class="muted" style="margin:0">내가 지은 이름은 '${esc(m.lambName)}'예요. ${esc(p.name)}님이 이름을 지으면 둘 중 하나로 아기양이 태어나요.</p>
   <button class="btn ghost sm" data-act="renameProp" style="align-self:flex-start">지은 이름 바꾸기</button>
  </section>`;
}

/* ---- 아기양 (메인, 한 화면) ---- */
function viewHome(){
  const c=couple(),m=me(),p=partner(),d=dkey(),xp=xpOf(c),st=stageOf(xp);
  const age=dnum(d)-dnum(c.lamb.born)+1;
  return `<main class="homeScreen">
   <div class="meadow" id="scene" aria-label="${esc(c.lamb.name)}가 노는 곳"></div>
   <section class="homeInfo">
     <div class="stageRow"><h2 class="lambName">${esc(c.lamb.name)}</h2><span class="small muted">태어난 지 ${age}일 · ${st.cur.name}</span></div>
     <div class="meter" role="progressbar" aria-label="다음 단계까지 자란 정도" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(st.pct*100)}"><i style="width:${Math.round(st.pct*100)}%"></i></div>
   </section>
   <section class="careGrid" aria-label="오늘의 돌봄">${CARE.map(([k,n,pose])=>{const mine=cared(c,d,k,m.uid),his=cared(c,d,k,p.uid);return `<button class="careBtn" data-act="care" data-v="${k}" ${mine?'aria-disabled="true"':''}><img src="${lambImg(pose)}" alt=""><b>${n}</b><span class="who"><span class="${mine?'ok':''}">${esc(m.name)}</span><span class="${his?'ok':''}">${esc(p.name)}</span></span></button>`}).join('')}</section>
  </main>`;
}
/* ---- 풀밭 장면과 아기양 움직임 ---- */
let RAF=null,LAMB=null,last=0;
const isNight=()=>{const h=new Date().getHours();return h>=22||h<6};
function startScene(){
  const sc=document.getElementById('scene');if(!sc)return;
  const c=couple(),st=stageOf(xpOf(c)),night=isNight();
  let h=`<div class="sky"></div><div class="ground"></div>`;
  sc.innerHTML=h;
  const el=document.createElement('div');el.className='lamb';
  el.innerHTML=`<img alt="${esc(c.lamb.name)}">`;
  sc.insertAdjacentHTML('beforeend',`<span class="groundShadow" style="width:${(42*st.cur.scale*.72).toFixed(1)}%"></span>`);
  sc.appendChild(el);
  ['sit','sleep','graze','yum','roll','yawn',...EVERY].forEach(preload);
  const base=42*st.cur.scale,prev=(LAMB&&LAMB.cid===c.id&&LAMB.base===base)?LAMB:null;   // 데이터가 바뀌어 다시 그려도 하던 동작은 이어서
  LAMB={el,img:el.querySelector('img'),x:50,y:88,state:prev?prev.state:'idle',until:prev?prev.until:0,next:prev?prev.next:null,pose:null,face:false,base,bag:prev?prev.bag:[],last:prev?prev.last:null,cid:c.id};
  if(prev)setPose(prev.pose||'sit');else{setPose(night?'sleep':'sit');LAMB.until=performance.now()+(night?1e9:CYCLE_MS-SHOW_MS)}place();
  el.addEventListener('click',tapLamb);
  last=performance.now();
  const loop=t=>{const dt=Math.min(.05,(t-last)/1000);last=t;tick(dt,t);RAF=requestAnimationFrame(loop)};RAF=requestAnimationFrame(loop);
}
function stopScene(){if(RAF)cancelAnimationFrame(RAF);RAF=null}
function place(){const L=LAMB;L.el.style.left=L.x+'%';L.el.style.top=L.y+'%';L.el.classList.toggle('faceR',L.face)}
const PRE={};function preload(p){if(!PRE[p]){const i=new Image();i.src=lambImg(p);PRE[p]=(i.decode?i.decode():Promise.resolve()).catch(()=>{}).then(()=>i)}return PRE[p]}
function applyPose(L,p){L.img.src=lambImg(p);L.el.style.width=(L.base*(LAMB_W[p]||196)*(LAMB_K[p]||1)/196)+'%'}
function setPose(p){const L=LAMB;if(L.pose===p)return;L.pose=p;
  preload(p).then(()=>{if(LAMB===L&&L.pose===p)applyPose(L,p)});   // 이미지가 준비된 뒤에 크기와 그림을 한 번에 바꿈
  L.el.classList.toggle('hop',p==='walk');
  L.el.querySelector('.zz')?.remove();if(p==='sleep'){const z=document.createElement('span');z.className='zz';z.textContent='z z';L.el.appendChild(z)}}
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function act(pose,ms,next){const L=LAMB;if(!L)return;L.state='act';setPose(pose);L.until=performance.now()+ms;L.next=next||null}
function tick(dt,t){
  const L=LAMB;if(!L)return;
  if(L.state==='walk'){
    const sp=7*dt,dx=L.tx-L.x,dy=(L.ty-L.y)*1.3,d=Math.hypot(dx,dy);
    if(Math.abs(dx)>.3){L.face=dx>0}
    if(d<=sp){L.x=L.tx;L.y=L.ty;L.state='idle';const r=Math.random();setPose(r<.4?'sit':r<.7?'graze':r<.9?'back':'yawn');L.until=t+2200+Math.random()*3800}
    else{L.x+=dx/d*sp;L.y+=dy/d*sp/1.3}
    place();return;
  }
  if(t<L.until)return;
  if(L.state==='act'&&L.next){const n=L.next;L.next=null;act(n[0],n[1],n[2]);return}
  if(isNight()){L.state='idle';setPose('sleep');L.until=t+1e9;return}
  L.state='idle';
  if(L.pose!=='sit'){setPose('sit');L.until=t+CYCLE_MS-SHOW_MS;return}
  if(!L.bag.length){L.bag=EVERY.slice().sort(()=>Math.random()-.5);if(L.bag[0]===L.last)L.bag.push(L.bag.shift())}
  const p=L.bag.shift();L.last=p;setPose(p);L.until=t+SHOW_MS;
}
function say(text){const L=LAMB;L.el.querySelector('.bubble')?.remove();const b=document.createElement('div');b.className='bubble';b.textContent=text;L.el.appendChild(b);setTimeout(()=>b.remove(),2600)}
function hearts(n=3){for(let i=0;i<n;i++){const h=document.createElement('span');h.className='heart';h.textContent='♥';h.style.setProperty('--dx',(i-1)*18+'px');h.style.animationDelay=i*.12+'s';LAMB.el.appendChild(h);setTimeout(()=>h.remove(),1700)}}
function tapLamb(){
  const L=LAMB,m=me(),p=partner();
  if(L.pose==='sleep'){say('쿨쿨…');if(!isNight()&&Math.random()<.5)act('yawn',1600,['sit',2500]);return}
  say(LAMB_LINES[Math.floor(Math.random()*LAMB_LINES.length)].replace('{a}',m.name).replace('{b}',p.name));hearts(2);
}
/* ---- 오늘 ---- */
function viewToday(){
  const c=couple(),m=me(),p=partner(),d=dkey(),rec=c.days[d]||{};
  const [ref,txt]=verseOf(d);const q=questionOf(d);
  const nDone=MISSIONS.filter(([k])=>clear(c,d,k)).length;
  const dt=new Date();const wd='일월화수목금토'[dt.getDay()];
  const EN={verse:'Meditation',prayer:'Prayer',question:'Question',photo:'Photo Diary'};
  const pills=k=>`<div class="pills"><span class="pill ${did(c,d,k,m.uid)?'ok':''}">${esc(m.name)} ${did(c,d,k,m.uid)?'완료':'대기'}</span><span class="pill ${did(c,d,k,p.uid)?'ok':''}">${esc(p.name)} ${did(c,d,k,p.uid)?'완료':'대기'}</span></div>`;
  const head=(k,t)=>`<div class="eyebrow">${EN[k]}</div><div class="hd"><h3>${t}</h3>${clear(c,d,k)?`<span class="stamp">Clear +${MISSION_XP}</span>`:`<span class="rw">함께 하면 ${esc(c.lamb.name)} +${MISSION_XP}</span>`}</div>${pills(k)}`;
  const answers=(k,label)=>{const mine=rec[k]&&rec[k][m.uid],his=rec[k]&&rec[k][p.uid];let s='';
    if(mine) s+=`<div class="ans"><span class="by">${esc(m.name)}</span>${esc(mine.text)}</div>`;
    if(his) s+=mine?`<div class="ans"><span class="by">${esc(p.name)}</span>${esc(his.text)}</div>`:`<div class="ans muted small">${esc(p.name)}님이 ${label}을 남겼어요. 나도 쓰면 볼 수 있어요.</div>`;
    return s};
  const form=(k,ph)=>did(c,d,k,m.uid)?'':`<form class="stack" data-form="${k}" style="gap:8px"><textarea id="t_${k}" class="field" rows="3" required maxlength="500" placeholder="${ph}"></textarea><button class="btn sm" type="submit" style="align-self:flex-end">남겨 두기</button></form>`;
  const ph=rec.photo||{};const myP=ph[m.uid],pP=ph[p.uid];
  return `<main class="stack">
   <div class="dateHead"><div class="en">Today · ${nDone} / 4</div><h2>${dt.getMonth()+1}월 ${dt.getDate()}일 ${wd}요일</h2></div>
   <section class="verseCard"><div class="eyebrow">Today's Word</div><blockquote>${txt}</blockquote><div class="ref">${ref}</div><div class="ver">개역한글</div></section>
   <section class="card mis">${head('verse','말씀 묵상 나누기')}${answers('verse','묵상')}${form('verse','이 말씀이 오늘 내게 주는 의미를 적어 보세요')}</section>
   <section class="card mis">${head('prayer','오늘의 기도제목')}${answers('prayer','기도제목')}${form('prayer','서로를 위해 기도할 제목을 나눠 주세요')}</section>
   <section class="card mis">${head('question','오늘의 질문')}<div class="qText">${esc(q)}</div>${answers('question','답')}${form('question','나의 대답')}</section>
   <section class="card mis">${head('photo','사진 기록')}
     <div class="photos"><div class="polar"><div class="ph">${myP?photoImg(d,m.uid,m.name+'의 사진'):'아직 사진이 없어요'}</div><span>${esc(m.name)}</span></div><div class="polar"><div class="ph">${pP?(myP?photoImg(d,p.uid,p.name+'의 사진'):'올렸어요! 나도 올리면 보여요'):'기다리는 중'}</div><span>${esc(p.name)}</span></div></div>
     <div class="synergy">${clear(c,d,'photo')?'둘 다 올려서 오늘의 사진 기록 완성! 기록 탭에 남았어요.':'둘 다 올려야 미션이 깨져요. 같은 시간, 다른 장소의 하루를 남겨 보세요.'}</div>
     ${myP?`<div class="phActs"><button class="linkBtn" data-act="phEdit">수정</button><label class="linkBtn" style="cursor:pointer">사진 바꾸기<input id="photoIn" type="file" accept="image/*" hidden></label><button class="linkBtn" data-act="phDelete" style="color:var(--danger);border-color:var(--danger)">삭제</button></div>`:`<label class="btn soft sm" style="align-self:flex-start;cursor:pointer">사진 올리기<input id="photoIn" type="file" accept="image/*" hidden></label>`}
   </section>
  </main>`;
}

/* ---- 기록 ---- */
function dayDetails(c,d,open){
  if(d in UI.dayOpen)open=UI.dayOpen[d];
  const r=c.days[d],[ref,txt]=verseOf(d),cl=MISSIONS.filter(([k])=>clear(c,d,k)).map(([,n])=>n);
  const nm=u=>esc((S.accounts[u]||{}).name||'');
  const block=(k,label)=>r[k]?Object.entries(r[k]).map(([u,v])=>`<div class="ans"><span class="by">${nm(u)} · ${label}</span>${esc(v.text)}</div>`).join(''):'';
  const pics=r.photo?Object.entries(r.photo):[];
  const dt=new Date(d+'T00:00:00');const wd='일월화수목금토'[dt.getDay()];
  return `<details class="day" data-day="${d}" ${open?'open':''}><summary><span class="d">${d.slice(5).replace('-',' . ')} <small>${wd}</small></span><span class="miniChips">${cl.map(n=>`<span>${n}</span>`).join('')||'<span class="pend">진행 중</span>'}</span></summary>
    <div class="body"><div class="dayVerse"><b>${ref}</b>${txt}</div>${block('verse','묵상')}${block('prayer','기도제목')}${r.question?`<div class="small muted">Q. ${esc(questionOf(d))}</div>`+block('question','답'):''}
    ${pics.length?`<div class="photos">${pics.map(([u])=>`<div class="polar"><div class="ph">${photoImg(d,u,'')}</div><span>${nm(u)}</span></div>`).join('')}</div>`:''}</div></details>`;
}
const hasRec=(c,d)=>MISSIONS.some(([k])=>c.days[d][k]&&Object.keys(c.days[d][k]).length);
const FILE_ICON='<svg class="fileIco" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 15.5h6M9 19h4"/></svg>';
function viewDiary(){
  const c=couple(),xp=xpOf(c),st=stageOf(xp),today=dkey();
  const all=Object.keys(c.days).filter(d=>hasRec(c,d)).sort().reverse();
  const v=UI.diary||'recent';
  if(v==='archive'){
    const [sy,sm]=c.since.split('-').map(Number),now=new Date();const months=[];
    for(let y=sy,mo=sm;y<now.getFullYear()||(y===now.getFullYear()&&mo<=now.getMonth()+1);mo===12?(y++,mo=1):mo++)months.push(`${y}-${pad(mo)}`);
    const years=[...new Set(months.map(x=>x.slice(0,4)))];
    return `<main class="stack">
     <div class="subHead"><button class="linkBtn" data-act="diary" data-v="recent">‹ 기록</button></div>
     <div class="pageHead"><div class="en">Archive</div><h2>지난 기록</h2><span class="small muted">${c.since.slice(0,7).replace('-','년 ')}월부터 달마다 한 파일로 모았어요</span></div>
     ${years.map(y=>`<div class="yearHead">${y}</div>${months.filter(x=>x.startsWith(y)).map(ym=>{const ds=all.filter(d=>d.startsWith(ym));const ph=ds.reduce((n,d)=>n+(c.days[d].photo?Object.keys(c.days[d].photo).length:0),0);
       return `<button class="fileRow" data-act="diary" data-v="m:${ym}">${FILE_ICON}<span class="fn"><b>${Number(ym.slice(5))}월 기록</b><span>${ds.length?`${ds.length}일 기록 · 사진 ${ph}장`:'기록 없음'}</span></span><span class="chev">›</span></button>`}).join('')}`).join('')}
    </main>`;
  }
  if(v.startsWith('m:')){
    const ym=v.slice(2),ds=all.filter(d=>d.startsWith(ym));
    return `<main class="stack">
     <div class="subHead"><button class="linkBtn" data-act="diary" data-v="archive">‹ 지난 기록</button></div>
     <div class="pageHead"><div class="en">${ym.replace('-',' . ')}</div><h2>${ym.slice(0,4)}년 ${Number(ym.slice(5))}월</h2><span class="small muted">${ds.length}일의 기록</span></div>
     ${ds.length?ds.map(d=>dayDetails(c,d,false)).join(''):`<p class="muted small">이 달에는 남긴 기록이 없어요.</p>`}
    </main>`;
  }
  const recent=all.filter(d=>dnum(today)-dnum(d)<7);
  const photos=Object.values(c.days).reduce((n,r)=>n+(r.photo?Object.keys(r.photo).length:0),0);
  return `<main class="stack">
   <div class="pageHead"><div class="en">Our Days</div><h2>우리의 기록</h2><span class="small muted">최근 7일의 기록이에요</span></div>
   <div class="statGrid">
     <div class="stat"><div class="n">${readCount(c)}</div><div class="t">함께 말씀 읽은 날</div></div>
     <div class="stat"><div class="n">${xp}</div><div class="t">${esc(c.lamb.name)} 성장 · ${st.cur.name}</div></div>
     <div class="stat"><div class="n">${all.length}</div><div class="t">기록이 있는 날</div></div>
     <div class="stat"><div class="n">${photos}</div><div class="t">함께 남긴 사진</div></div>
   </div>
   ${recent.length?recent.map((d,i)=>dayDetails(c,d,i===0)).join(''):`<p class="muted small" style="padding-top:16px">최근 7일 동안 남긴 기록이 없어요. 오늘 탭에서 첫 묵상을 남겨 보세요.</p>`}
   <button class="moreRow" data-act="diary" data-v="archive"><span>지난 기록 더보기</span><span class="small muted">${c.since.slice(0,7).replace('-','.')}부터 · 달별 파일</span><span class="chev">›</span></button>
  </main>`;
}
/* ---- 계정 ---- */
function accountActions(){
  return `<button class="btn ghost wide" data-act="logout">로그아웃</button>`;
}
function sheetAccounts(){
  const m=me();
  sheet(`<h2>계정</h2><p class="small muted" style="margin:0 0 12px">${esc(m.name)} · ${esc(m.email)}</p><div class="stack">${accountActions()}</div>`);
}
function viewMe(){
  const m=me(),p=partner(),c=couple(),d=dkey();
  const days=dnum(d)-dnum(c.since)+1,age=dnum(d)-dnum(c.lamb.born)+1;
  const mine=c.lamb.cands?c.lamb.cands.find(x=>x.uid===m.uid):null,his=c.lamb.cands?c.lamb.cands.find(x=>x.uid===p.uid):null;
  const row=(k,v)=>`<div class="kv"><span>${k}</span><b>${v}</b></div>`;
  return `<main class="stack" style="gap:0">
   <div class="meHead">${initial(m)}<div><h2>${esc(m.name)}</h2><span class="small muted">${esc(m.email)}</span></div></div>
   <section class="sec"><div class="eyebrow">Couple</div>${row('상대',esc(p.name))}${row('함께한 날',`D+${days} · ${c.since.replaceAll('-','.')}부터`)}${row('내 고유 코드',m.code)}</section>
   <section class="sec"><div class="eyebrow">Our Lamb</div>${row('이름',esc(c.lamb.name))}${row('태어난 날',`${c.lamb.born.replaceAll('-','.')} · ${age}일째`)}${mine?row('내가 지은 이름',esc(mine.name)+(c.lamb.cands[c.lamb.pick]===mine?' · 채택':'')):''}${his?row(`${esc(p.name)}님이 지은 이름`,esc(his.name)+(c.lamb.cands[c.lamb.pick]===his?' · 채택':'')):''}</section>
   <section class="sec stack">${accountActions()}</section>
  </main>`;
}
/* ---- 사진: 고르기 → 편집(자르기·확대·회전·밝기·필터) → 저장 / 수정 / 바꾸기 / 삭제 ---- */
const PH_OUT=480, PH_SRC=800;
const PH_FILTERS=[['none','원본'],['warm','따뜻하게'],['soft','부드럽게'],['mono','흑백'],['film','필름']];
let PE=null;
function readFile(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
function loadImage(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src})}
async function shrink(dataUrl){
  const img=await loadImage(dataUrl);const s=Math.min(1,PH_SRC/Math.max(img.width,img.height));
  const cv=document.createElement('canvas');cv.width=Math.round(img.width*s);cv.height=Math.round(img.height*s);
  cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height);
  const out=cv.toDataURL('image/jpeg',.8);return {src:out,img:await loadImage(out)};
}
async function openEditor(file,existing,id){
  try{
    let src,img,ed={rot:0,zoom:1,ox:0,oy:0,bright:0,filter:'none'};
    if(file){({src,img}=await shrink(await readFile(file)))}
    else{let s=null;try{const x=await photoSrcRef(id).get();if(x.exists)s=x.data().src}catch(e){}
      src=s||existing.img;img=await loadImage(src);if(existing.edit)ed={...ed,...existing.edit}}
    PE={src,img,...ed,isNew:!existing||!!file};
    sheetEditor();
  }catch(e){toast('이 사진은 읽을 수 없어요. JPG나 PNG 사진을 골라 주세요.')}
}
function sheetEditor(){
  sheet(`<div class="stack" style="gap:14px">
   <div class="row" style="justify-content:space-between"><h2 style="margin:0">사진 편집</h2><button class="linkBtn" data-act="phCancel">취소</button></div>
   <div class="phStage" id="phStage"><canvas id="phCanvas" width="${PH_OUT}" height="${PH_OUT}"></canvas><div class="phGrid" aria-hidden="true"></div></div>
   <p class="small muted" style="margin:-4px 0 0;text-align:center">사진을 끌어서 위치를 맞춰요</p>
   <label class="phRow"><span>확대</span><input id="phZoom" type="range" min="1" max="3" step="0.01" value="${PE.zoom}"></label>
   <label class="phRow"><span>밝기</span><input id="phBright" type="range" min="-40" max="40" step="1" value="${PE.bright}"></label>
   <div class="chips" id="phFilters">${PH_FILTERS.map(([k,n])=>`<button class="chip" data-act="phFilter" data-v="${k}" aria-pressed="${PE.filter===k}">${n}</button>`).join('')}</div>
   <div class="row"><button class="btn ghost sm" data-act="phRotate">↻ 돌리기</button><button class="btn ghost sm" data-act="phReset">처음으로</button><label class="btn ghost sm" style="cursor:pointer">다른 사진<input id="photoIn" type="file" accept="image/*" hidden></label></div>
   <button class="btn wide" data-act="phSave">${PE.isNew?'이 사진 올리기':'수정 저장'}</button></div>`);
  bindEditor();drawEditor();
}
function coverScale(S){const r=PE.rot%180!==0,w=r?PE.img.height:PE.img.width,h=r?PE.img.width:PE.img.height;return {w,h,s:Math.max(S/w,S/h)*PE.zoom}}
function clampPan(){const {w,h,s}=coverScale(1);const mx=Math.max(0,(w*s-1)/2),my=Math.max(0,(h*s-1)/2);PE.ox=Math.max(-mx,Math.min(mx,PE.ox));PE.oy=Math.max(-my,Math.min(my,PE.oy))}
function renderPhoto(cv,S){
  const x=cv.getContext('2d',{willReadFrequently:true});const {s}=coverScale(S);
  x.save();x.fillStyle='#fff';x.fillRect(0,0,S,S);x.translate(S/2+PE.ox*S,S/2+PE.oy*S);x.rotate(PE.rot*Math.PI/180);x.scale(s,s);
  x.drawImage(PE.img,-PE.img.width/2,-PE.img.height/2);x.restore();
  if(PE.bright===0&&PE.filter==='none')return;
  const d=x.getImageData(0,0,S,S),p=d.data,b=1+PE.bright/100,f=PE.filter;
  for(let i=0;i<p.length;i+=4){
    let r=p[i]*b,g=p[i+1]*b,bl=p[i+2]*b;
    if(f==='mono'){const l=.3*r+.59*g+.11*bl;r=g=bl=l}
    else if(f==='warm'){r=r*1.08+6;g=g*1.02+2;bl=bl*.9}
    else if(f==='soft'){r=r*.88+26;g=g*.88+26;bl=bl*.88+28}
    else if(f==='film'){const sr=.393*r+.769*g+.189*bl,sg=.349*r+.686*g+.168*bl,sb=.272*r+.534*g+.131*bl;r=r*.55+sr*.45;g=g*.55+sg*.45;bl=bl*.55+sb*.45;r=r*.92+14;g=g*.92+12;bl=bl*.92+10}
    p[i]=r>255?255:r;p[i+1]=g>255?255:g;p[i+2]=bl>255?255:bl;
  }
  x.putImageData(d,0,0);
}
let peRaf=0;function drawEditor(){cancelAnimationFrame(peRaf);peRaf=requestAnimationFrame(()=>{const cv=document.getElementById('phCanvas');if(cv&&PE)renderPhoto(cv,PH_OUT)})}
function bindEditor(){
  const st=document.getElementById('phStage');let drag=null;
  st.addEventListener('pointerdown',e=>{e.preventDefault();st.setPointerCapture(e.pointerId);drag={x:e.clientX,y:e.clientY,ox:PE.ox,oy:PE.oy,w:st.clientWidth}});
  st.addEventListener('pointermove',e=>{if(!drag)return;PE.ox=drag.ox+(e.clientX-drag.x)/drag.w;PE.oy=drag.oy+(e.clientY-drag.y)/drag.w;clampPan();drawEditor()});
  const end=()=>{drag=null};st.addEventListener('pointerup',end);st.addEventListener('pointercancel',end);
  document.getElementById('phZoom').addEventListener('input',e=>{PE.zoom=+e.target.value;clampPan();drawEditor()});
  document.getElementById('phBright').addEventListener('input',e=>{PE.bright=+e.target.value;drawEditor()});
}
function savePhoto(){
  const cv=document.createElement('canvas');cv.width=cv.height=PH_OUT;renderPhoto(cv,PH_OUT);
  const m=me(),c=couple(),d=dkey(),id=d+'_'+m.uid,had=!!(c.days[d]&&c.days[d].photo&&c.days[d].photo[m.uid]),partnerHas=did(c,d,'photo',partner().uid);
  const data={img:cv.toDataURL('image/jpeg',.8),edit:{rot:PE.rot,zoom:PE.zoom,ox:PE.ox,oy:PE.oy,bright:PE.bright,filter:PE.filter},at:Date.now(),date:d,uid:m.uid};
  const src=PE.src;PE=null;closeSheet();ST.photos[id]=data;
  Promise.all([photoRef(id).set(data),photoSrcRef(id).set({src}),dayRef(d).set({photo:{[m.uid]:{at:data.at}}},{merge:true})]).catch(fail);
  render();
  if(had)toast('사진을 바꿨어요');else if(!partnerHas)toast('사진을 올렸어요. 상대도 올리면 미션 클리어!');
}
function sheetPhotoDelete(){
  const c=couple(),d=dkey(),both=clear(c,d,'photo');
  sheet(`<div class="stack" style="gap:14px;text-align:center"><h2>오늘 올린 사진을 삭제할까요?</h2>
   <p class="muted" style="margin:0">${both?`삭제하면 사진 기록 미션이 다시 대기로 바뀌고, ${esc(c.lamb.name)}의 성장도 그만큼 줄어요. 새 사진을 올리면 다시 채워져요.`:'삭제한 사진은 되돌릴 수 없어요.'}</p>
   <div class="row" style="justify-content:center"><button class="btn ghost" data-act="closeSheet2" style="flex:1">취소</button><button class="btn" data-act="phDeleteOk" style="flex:1;background:var(--danger);border-color:var(--danger)">삭제</button></div></div>`);
}
function deletePhoto(){
  const m=me(),d=dkey(),id=d+'_'+m.uid;closeSheet();
  Promise.all([photoRef(id).delete(),photoSrcRef(id).delete(),dayRef(d).update(new FP('photo',m.uid),FV.delete()),userRef().update(new FP('seen',d+':photo'),FV.delete())]).catch(fail);
  delete ST.photos[id];render();toast('사진을 삭제했어요');
}

/* ================= 동작 ================= */
function doCare(k){
  const c=couple(),m=me(),d=dkey(),[,name]=CARE.find(x=>x[0]===k);
  if(cared(c,d,k,m.uid)){toast(`오늘은 이미 ${name}를 했어요. 내일 또 해 주세요`);if(LAMB)hearts(1);return}
  const both=cared(c,d,k,partner().uid);
  dayRef(d).set({care:{[k]:{[m.uid]:Date.now()}}},{merge:true}).catch(fail);
  if(k==='feed')act('graze',3200,['yum',2200,['sit',2000]]);
  if(k==='pet'){act('roll',3000,['sit',2000]);setTimeout(()=>{if(LAMB){say('헤헤, 간지러워요');hearts(3)}},200)}
  if(k==='sleep'){act('sleep',9000,['yawn',1600,['sit',2000]]);setTimeout(()=>LAMB&&say('잘 자요…'),200)}
  toast(both?`둘 다 ${name} 완료! ${c.lamb.name} +${CARE_XP} 성장`:`${c.lamb.name} +${CARE_XP} 성장`);
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]');if(!t)return;
  const a=t.dataset.act,v=t.dataset.v;
  if(a==='closeSheet'){if(e.target===t)closeSheet();return}
  const m=me();
  switch(a){
    case 'google':signIn();break;
    case 'accounts':sheetAccounts();break;
    case 'logout':closeSheet();auth.signOut();break;
    case 'closeSheet2':closeSheet();break;
    case 'introOk':setUser({introSeen:true});closeSheet();break;
    case 'revealOk':setUser({seen:{reveal:1}});closeSheet();break;
    case 'renameProp':coupleRef().update(new FP('names',m.uid),FV.delete()).catch(fail);break;
    case 'copyCode':try{navigator.clipboard.writeText(m.code).then(()=>toast('코드를 복사했어요'),()=>toast('코드: '+m.code))}catch(_){toast('코드: '+m.code)}break;
    case 'tab':UI.tab=v;if(v==='diary')UI.diary='recent';render();scrollTo(0,0);break;
    case 'diary':UI.diary=v;render();scrollTo(0,0);break;
    case 'care':doCare(v);break;
    case 'phEdit':{const id=dkey()+'_'+m.uid;if(ST.photos[id])openEditor(null,ST.photos[id],id);break}
    case 'phDelete':sheetPhotoDelete();break;
    case 'phDeleteOk':deletePhoto();break;
    case 'phCancel':PE=null;closeSheet();break;
    case 'phSave':if(PE)savePhoto();break;
    case 'phRotate':if(PE){PE.rot=(PE.rot+90)%360;clampPan();drawEditor()}break;
    case 'phFilter':if(PE){PE.filter=v;document.querySelectorAll('#phFilters .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===v));drawEditor()}break;
    case 'phReset':if(PE){Object.assign(PE,{rot:0,zoom:1,ox:0,oy:0,bright:0,filter:'none'});document.getElementById('phZoom').value=1;document.getElementById('phBright').value=0;document.querySelectorAll('#phFilters .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v==='none'));drawEditor()}break;
  }
});
document.addEventListener('submit',e=>{
  e.preventDefault();const f=e.target,m=me();
  if(f.id==='linkForm'){connectByCode(document.getElementById('pcode').value.trim().toUpperCase());return}
  if(f.id==='nameForm'){const n=document.getElementById('lambName').value.trim();if(!n)return;
    coupleRef().update(new FP('names',m.uid),n.slice(0,8)).catch(fail);document.getElementById('lambName').value='';return}
  const k=f.dataset.form;if(k){const ta=document.getElementById('t_'+k),t=ta.value.trim();if(!t)return;
    const c=couple(),d=dkey(),partnerDid=did(c,d,k,partner().uid);ta.value='';
    dayRef(d).set({[k]:{[m.uid]:{text:t.slice(0,500),at:Date.now()}}},{merge:true}).catch(fail);
    if(!partnerDid)toast('남겨 두었어요. 상대도 남기면 미션 클리어!');}
});
document.addEventListener('toggle',e=>{const d=e.target;if(d.matches&&d.matches('details.day')){UI.dayOpen[d.dataset.day]=d.open;if(d.open)fillPhotos(d)}},true);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&ST.couple&&ST.photoDay!==dkey())render()});
document.addEventListener('gesturestart',e=>e.preventDefault());
document.addEventListener('touchmove',e=>{if(e.touches&&e.touches.length>1)e.preventDefault()},{passive:false});
let lastTouch=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-lastTouch<300&&!e.target.closest('input,textarea'))e.preventDefault();lastTouch=n},{passive:false});
document.addEventListener('change',e=>{if(e.target.id==='photoIn'&&e.target.files[0]){const f=e.target.files[0];e.target.value='';openEditor(f,null)}});
startAuth();
