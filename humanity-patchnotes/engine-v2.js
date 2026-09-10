/* Humanity Patch Notes v2. Pure, deterministic simulation. No paid randomness. */
const HP = (() => {
'use strict';
const VERSION=2, GOALS=[260,950,2900], ERA=[1,2,4];
const RULES={
 photo:{n:'인간 광합성',i:'🌱',tag:'bio',d:'자연 점수 ×1.8',color:'green'},
 immortal:{n:'죽음 삭제',i:'♾️',tag:'bio',d:'실패 피해 −7',color:'green'},
 solar:{n:'태양 충전',i:'☀️',tag:'bio',d:'성공하면 에너지 +5',color:'green'},
 tiny:{n:'인류 소형화',i:'🐜',tag:'bio',d:'에너지 비용 −5',color:'green'},
 robots:{n:'로봇 노동',i:'🤖',tag:'tech',d:'과학 점수 ×1.8',color:'blue'},
 nosleep:{n:'수면 삭제',i:'🌙',tag:'tech',d:'실험 점수 ×1.6',color:'blue'},
 hive:{n:'기억 공유',i:'🧠',tag:'tech',d:'과학 성공률 +15%p',color:'blue'},
 portal:{n:'순간 이동',i:'🌀',tag:'tech',d:'모든 점수 ×1.25',color:'blue'},
 holiday:{n:'주 3일 노동',i:'🏖️',tag:'life',d:'안전 선택 시 체력 +6',color:'pink'},
 truth:{n:'거짓말 삭제',i:'👁️',tag:'life',d:'안전 점수 ×1.7',color:'pink'},
 bliss:{n:'행복 자동화',i:'😊',tag:'life',d:'성공하면 체력 +4',color:'pink'},
 luck:{n:'행운 유전자',i:'🍀',tag:'life',d:'성공률 +10%p',color:'pink'}
};
const COMBOS=[
 {a:'photo',b:'immortal',n:'영원한 정원',i:'🌳',d:'모든 점수 ×2'},
 {a:'robots',b:'holiday',n:'월요일 멸종',i:'🎉',d:'모든 점수 ×2'},
 {a:'nosleep',b:'robots',n:'24시간 공장',i:'🏭',d:'모든 점수 ×2'},
 {a:'hive',b:'truth',n:'비밀 없는 지구',i:'🔮',d:'모든 점수 ×2'},
 {a:'photo',b:'solar',n:'인간 발전소',i:'🔋',d:'모든 점수 ×2'},
 {a:'tiny',b:'portal',n:'주머니 우주',i:'🌌',d:'모든 점수 ×2'},
 {a:'holiday',b:'bliss',n:'영원한 주말',i:'🪩',d:'모든 점수 ×2'},
 {a:'luck',b:'immortal',n:'죽지 않는 행운',i:'🦄',d:'모든 점수 ×2'},
 {a:'hive',b:'robots',n:'행성급 두뇌',i:'🛰️',d:'모든 점수 ×2'},
 {a:'tiny',b:'photo',n:'초소형 정원',i:'🌿',d:'모든 점수 ×2'}
];
// Each event is a short fictional dilemma, not medical/scientific guidance.
const EVENTS=[
 ['bio','햇빛이 남는다','☀️','저장하기','시민을 충전','전기요금이 마이너스다.','구름이 출근했다.'],
 ['bio','도시가 꽉 찼다','🏙️','공간 나누기','인류 축소','주머니에 동네가 들어갔다.','엘리베이터만 작아졌다.'],
 ['bio','식량이 부족하다','🌾','함께 나누기','초고속 재배','토마토가 빌딩을 추월했다.','잡초만 야근했다.'],
 ['bio','바다가 아프다','🌊','해변 청소','바다 리셋','고래가 감사 인사를 했다.','파도가 비밀번호를 잊었다.'],
 ['bio','인류가 늙는다','🧬','건강 챙기기','노화 삭제','생일초가 산업이 됐다.','머리카락만 불멸이다.'],
 ['bio','폭염이 왔다','🌡️','그늘 늘리기','구름 만들기','구름에 주소가 생겼다.','비가 회의실에만 내렸다.'],
 ['tech','로봇이 파업했다','🤖','휴가 주기','업무 복제','복제된 로봇이 일을 끝냈다.','파업도 복제됐다.'],
 ['tech','출근이 너무 멀다','🚆','버스 늘리기','순간 이동','오늘부터 출근은 0초.','양말만 먼저 출근했다.'],
 ['tech','전기가 부족하다','💡','절전하기','초소형 태양','퇴근 후에도 해가 떴다.','토스터가 시장이 됐다.'],
 ['tech','인터넷이 느리다','📡','회선 늘리기','두뇌 연결','검색보다 생각이 빨랐다.','흑역사가 생중계됐다.'],
 ['tech','달이 비어 있다','🌙','탐사 보내기','도시 발사','달에도 편의점이 생겼다.','편의점만 도착했다.'],
 ['tech','회의가 안 끝난다','🖥️','회의 줄이기','회의 자동화','인류에게 오전이 돌아왔다.','회의가 스스로 회의를 잡았다.'],
 ['life','월요일이 싫다','📅','오후 쉬기','월요일 삭제','화요일도 긴장하기 시작했다.','월요일이 둘이 됐다.'],
 ['life','다들 외롭다','💌','축제 열기','마음 동기화','첫사랑이 동시 접속했다.','읽씹도 공유됐다.'],
 ['life','불평이 쌓인다','📣','직접 듣기','행복 패치','거리마다 콧노래가 났다.','고장 알림도 웃고 있다.'],
 ['life','시험이 어렵다','📚','함께 공부','지식 다운로드','전교생이 서로를 가르쳤다.','모두 같은 오답을 썼다.'],
 ['life','거짓말이 퍼진다','🎭','사실 확인','진실 생중계','공약 이행률이 올라갔다.','생일 서프라이즈가 멸종했다.'],
 ['life','운이 따라주지 않는다','🍀','차근차근','행운 증폭','네잎클로버가 잡초가 됐다.','운은 잠깐 휴가 중이다.']
];
const BOSS=[['정전 위기','🌑','전력 아끼기','태양 재부팅','tech'],['자원 위기','☄️','함께 버티기','행성 복제','bio'],['문명 심사','🛸','결과 제출','우주로 확장','life']];
const copy=x=>JSON.parse(JSON.stringify(x));
const bounded=(v,a,b)=>Math.max(a,Math.min(b,v));
const level=(s,id)=>s.rules.find(r=>r.id===id)?.lv||0;
const combos=s=>COMBOS.filter(c=>level(s,c.a)&&level(s,c.b));
function rand(s){s.rng=(s.rng+0x6D2B79F5)>>>0;let t=s.rng;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;}
function sample(s,arr){return arr[Math.floor(rand(s)*arr.length)];}
function pool(s,ids){return ids.filter(id=>level(s,id)<3);}
function snapshot(s){const x=copy(s);delete x.prev;return x;}
function draft(s){let ids=pool(s,Object.keys(RULES)),a,b;const existing=s.rules.map(r=>r.id);const partners=pool(s,COMBOS.flatMap(c=>existing.includes(c.a)&&!existing.includes(c.b)?[c.b]:existing.includes(c.b)&&!existing.includes(c.a)?[c.a]:[]));
 a=sample(s,partners.length?partners:ids);b=sample(s,ids.filter(id=>id!==a));return {kind:'draft',id:`draft-${s.turn}`,ids:[a,b],recommended:partners.includes(a)};
}
function draw(s){const pos=s.turn%6;if(pos===0||pos===2)return draft(s);if(pos===5){const row=BOSS[Math.floor(s.turn/6)];return {kind:'boss',id:`boss-${s.turn}`,row};}
 const preferred=s.rules.map(r=>RULES[r.id].tag);let ids=EVENTS.map((r,i)=>i).filter(i=>!s.recent.includes(i));if(rand(s)<.7&&preferred.length){const relevant=ids.filter(i=>preferred.includes(EVENTS[i][0]));if(relevant.length)ids=relevant;}
 const idx=sample(s,ids);s.recent=[...s.recent.slice(-3),idx];return {kind:'event',id:`ev-${s.turn}-${idx}`,index:idx,row:EVENTS[idx],boost:s.turn>3&&rand(s)<.14};
}
function fresh(seed){const s={v:VERSION,seed:seed>>>0,rng:seed>>>0,turn:0,hp:70,energy:60,score:0,stageScore:0,clears:0,rules:[],recent:[],found:[],rerolls:2,undoUsed:false,phase:'choose',current:null,last:null,prev:null,log:[],peak:0};s.current=draw(s);return s;}
function preview(s,side){if(s.current.kind==='draft')return null;const isBoss=s.current.kind==='boss',row=s.current.row,tag=isBoss?row[4]:row[0],era=Math.floor(s.turn/6),risk=side===1;
 let p=risk?65:100;if(risk){p+=level(s,'luck')*10;if(tag==='tech')p+=level(s,'hive')*15;p=Math.min(95,p);}
 let base=(isBoss?(risk?110:40):(risk?90:34))*ERA[era], mult=1,steps=[];
 const add=(name,m)=>{mult*=m;steps.push({n:name,m});};
 if(tag==='bio'&&level(s,'photo'))add('🌱',1.4+level(s,'photo')*.4);
 if(tag==='tech'&&level(s,'robots'))add('🤖',1.4+level(s,'robots')*.4);
 if(risk&&level(s,'nosleep'))add('🌙',1.3+level(s,'nosleep')*.3);
 if(!risk&&level(s,'truth'))add('👁️',1.3+level(s,'truth')*.4);
 if(level(s,'portal'))add('🌀',1+level(s,'portal')*.25);
 for(const c of combos(s))add(c.i,2);
 if(s.current.boost)add('💥',2);
 const gain=Math.round(base*mult),cost=risk?Math.max(3,16-level(s,'tiny')*5):0;
 const damage=risk?Math.max(2,18+era*3-level(s,'immortal')*7):0;
 return {risk,tag,p,crit:risk?10:0,base,mult,steps,gain,cost,damage,energy:risk?-cost:13,hp:risk?0:2+level(s,'holiday')*6};
}
function choose(s,side,replace){if(s.phase!=='choose'||![0,1].includes(side))return false;
 const c=s.current;if(c.kind==='draft'){const id=c.ids[side];if(!RULES[id])return false;if(!level(s,id)&&s.rules.length===3&&!s.rules.some(r=>r.id===replace))return {replace:true,id};
 s.prev=snapshot(s);const before=combos(s).map(x=>x.n);if(level(s,id)){s.rules.find(r=>r.id===id).lv++;}else{if(s.rules.length===3)s.rules=s.rules.filter(r=>r.id!==replace);s.rules.push({id,lv:1});}
 const newCombos=combos(s).filter(x=>!before.includes(x.n));s.found=[...new Set([...s.found,...newCombos.map(x=>x.n)])];
 s.last={kind:'draft',id,upgrade:level(s,id)>1,newCombos:newCombos.map(x=>x.n),gain:0};
 }else{const pr=preview(s,side);if(s.energy<pr.cost)return false;s.prev=snapshot(s);const roll=pr.risk?Math.floor(rand(s)*100)+1:null,ok=!pr.risk||roll<=pr.p,critical=pr.risk&&roll<=pr.crit;
 const gained=ok?pr.gain*(critical?3:1):0;s.energy=bounded(s.energy+pr.energy+(ok?level(s,'solar')*5:0),0,100);s.hp=bounded(s.hp+(ok?pr.hp+level(s,'bliss')*4:-pr.damage),0,100);
 s.score+=gained;s.stageScore+=gained;s.peak=Math.max(s.peak,gained);
 let checkpoint=null;if(c.kind==='boss'){const goal=GOALS[Math.floor(s.turn/6)],pass=s.stageScore>=goal;checkpoint={pass,goal,score:s.stageScore};if(pass){s.clears++;s.hp=bounded(s.hp+10,0,100);s.energy=bounded(s.energy+15,0,100);}else s.hp=bounded(s.hp-24,0,100);}
 s.last={kind:'event',ok,critical,gain:gained,roll,pr,checkpoint,line:c.kind==='boss'?(checkpoint.pass?'인류, 또 살아남았다.':'덜 자랐지만 실험은 계속된다.'):ok?(critical?'이번 패치는 우주가 도왔다.':c.row[5]):c.row[6]};
 }
 s.log.push({turn:s.turn,card:c.id,side,gain:s.last.gain,roll:s.last.roll??null});s.phase='result';return true;
}
function advance(s){if(s.phase!=='result')return false;const boss=s.current.kind==='boss';s.turn++;if(s.hp<=0||s.turn>=18){s.phase='end';return true;}if(boss)s.stageScore=0;s.current=draw(s);s.phase='choose';return true;}
function reroll(s){if(s.phase!=='choose'||s.rerolls<=0||s.current.kind==='boss')return false;s.rerolls--;const old=s.current;if(old.kind==='draft'){const ids=pool(s,Object.keys(RULES)).filter(x=>!old.ids.includes(x));const a=sample(s,ids);const b=sample(s,ids.filter(x=>x!==a));s.current={kind:'draft',id:`reroll-${s.turn}-${s.rerolls}`,ids:[a,b],recommended:false};}else s.current=draw(s);return true;}
function undo(s){if(!s.prev||s.undoUsed)return null;const restored=copy(s.prev);restored.undoUsed=true;restored.prev=null;return restored;}
function valid(s){return s&&s.v===VERSION&&Number.isInteger(s.turn)&&s.turn>=0&&s.turn<=18&&Number.isInteger(s.rng)&&Number.isFinite(s.score)&&s.score>=0&&Number.isFinite(s.stageScore)&&s.stageScore>=0&&Number.isFinite(s.hp)&&s.hp>=0&&s.hp<=100&&Number.isFinite(s.energy)&&s.energy>=0&&s.energy<=100&&Array.isArray(s.rules)&&s.rules.length<=3&&new Set(s.rules.map(r=>r.id)).size===s.rules.length&&s.rules.every(r=>RULES[r.id]&&Number.isInteger(r.lv)&&r.lv>=1&&r.lv<=3)&&Array.isArray(s.recent)&&Array.isArray(s.found)&&s.found.every(n=>COMBOS.some(c=>c.n===n))&&Array.isArray(s.log)&&s.log.length<=18&&['choose','result','end'].includes(s.phase)&&s.current&&['draft','event','boss'].includes(s.current.kind)&&(!s.current.ids||s.current.ids.every(id=>RULES[id]))&&Number.isInteger(s.rerolls)&&s.rerolls>=0&&s.rerolls<=2;}
return {VERSION,GOALS,ERA,RULES,COMBOS,EVENTS,fresh,preview,choose,advance,reroll,undo,valid,combos,level,copy};
})();
if(typeof module!=='undefined')module.exports=HP;
