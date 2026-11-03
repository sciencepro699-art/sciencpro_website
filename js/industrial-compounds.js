(function(){"use strict";
/* Science Pro Chemistry — shared helpers (quiz + canvas) kept inside each chapter file */
var SPQuiz={init:function(o){var shell=document.getElementById("quizShell");if(!shell)return;var qs=o.questions,cur=0,score=0,done=false;
var back="subject.html?class=10&subject=chemistry";var msgs=["Nice start. Play with the lab above and try again.","Good work. One more go and you've got it.","Excellent!"];
function ask(){done=false;var q=qs[cur],n=qs.length;shell.innerHTML='<div class="game-shell-header"><span class="score-pill">Question '+(cur+1)+' / '+n+'</span><div class="progress-track"><div class="progress-fill" style="width:'+Math.round(cur/n*100)+'%"></div></div><span class="score-pill">Score: '+score+'</span></div><div class="quiz-question"></div><div class="quiz-options"></div><div class="quiz-feedback"></div><div class="quiz-next"></div>';
shell.querySelector(".quiz-question").textContent=q.q;var w=shell.querySelector(".quiz-options");
q.options.forEach(function(t,i){var b=document.createElement("button");b.className="quiz-option";b.textContent=t;b.addEventListener("click",function(){pick(i)});w.appendChild(b)})}
function pick(i){if(done)return;done=true;var q=qs[cur],bs=shell.querySelectorAll(".quiz-option");bs.forEach(function(b){b.disabled=true});
if(i===q.answer){score++;bs[i].classList.add("correct")}else{bs[i].classList.add("wrong");bs[q.answer].classList.add("correct")}
var fb=shell.querySelector(".quiz-feedback");fb.textContent=q.explain;fb.classList.add("show");var last=cur===qs.length-1,nb=document.createElement("button");
nb.className="btn btn-primary";nb.textContent=last?"See results":"Next question →";nb.addEventListener("click",function(){cur++;if(cur>=qs.length)end();else ask()});shell.querySelector(".quiz-next").appendChild(nb)}
function end(){var n=qs.length,p=Math.round(score/n*100),v=p>=80?msgs[2]:p>=50?msgs[1]:msgs[0];
shell.innerHTML='<div class="result-screen"><span class="eyebrow" style="justify-content:center;">RESULTS</span><div class="big-score">'+score+' / '+n+'</div><p>'+v+'</p><div class="result-actions"><button class="btn btn-primary" id="retryBtn">Try again</button><a class="btn btn-dark" href="'+back+'">Back to Chemistry chapters</a></div></div>';
document.getElementById("retryBtn").addEventListener("click",function(){cur=0;score=0;ask()})}ask()}};
function $(id){return document.getElementById(id)}
function fit(c,h){var w=c.clientWidth||320;c.width=w*2;c.height=h*2;var x=c.getContext("2d");x.setTransform(2,0,0,2,0,0);return{x:x,w:w,h:h}}
function rows(el,arr){el.innerHTML=arr.map(function(l){return'<div class="line'+(l[1]?" "+l[1]:"")+'">'+l[0]+'</div>'}).join("")}

/* Compounds of Industrial Importance — Class 10 Chemistry, Chapter 7 */
var t=0;
function dot(x,px,py,r,col){if(typeof r==="string"){var tmp=r;r=col;col=tmp}x.fillStyle=col;x.beginPath();x.arc(px,py,r,0,6.283);x.fill()}
/* ---- Lab 1: rates meet ---- */
var ep=0,eRun=false;
function curve(x,u,sign){ /* u in 0..1 */ return sign>0?1-0.5*(1-Math.exp(-4*u)):0.5*(1-Math.exp(-4*u))}
function drawEQ(){
  var c=$("eqCanvas"),f=fit(c,220),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,220);
  if(eRun&&ep<1)ep=Math.min(1,ep+0.004);
  var gx=44,gy=16,gw=w-gx-16,gh=160;
  x.strokeStyle="#64748b";x.lineWidth=2;x.beginPath();x.moveTo(gx,gy);x.lineTo(gx,gy+gh);x.lineTo(gx+gw,gy+gh);x.stroke();
  x.fillStyle="#94a3b8";x.font="700 10px Inter,sans-serif";x.textAlign="center";x.fillText("Time →",gx+gw/2,gy+gh+16);
  x.save();x.translate(14,gy+gh/2);x.rotate(-Math.PI/2);x.fillText("Rate of reaction",0,0);x.restore();
  /* equal level dashed */
  var ly=gy+gh*(1-0.5*0.95);x.setLineDash([4,4]);x.strokeStyle="rgba(255,255,255,.25)";x.beginPath();x.moveTo(gx,ly);x.lineTo(gx+gw,ly);x.stroke();x.setLineDash([]);
  var defs=[["Forward","#22c55e",1],["Backward","#f97316",-1]];
  defs.forEach(function(d){x.strokeStyle=d[1];x.lineWidth=3;x.beginPath();
    for(var i=0;i<=100;i++){var u=i/100;if(u>ep)break;var px=gx+u*gw,py=gy+gh*(1-0.95*curve(0,u,d[2]));i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();
    var py2=gy+gh*(1-0.95*curve(0,ep,d[2]));dot(x,gx+ep*gw,py2,5,d[1])});
  x.textAlign="right";x.font="800 11px Inter,sans-serif";x.fillStyle="#22c55e";x.fillText("forward →",gx+gw,gy+12);x.fillStyle="#f97316";x.fillText("backward ←",gx+gw,gy+gh-8);
  if(ep>=0.55){var ax=gx+0.6*gw;x.fillStyle="#fde047";x.font="800 13px Inter,sans-serif";x.textAlign="center";x.fillText("A: equal rates",Math.min(gx+gw-60,ax),ly-30)}
}
function upEQ(){
  if(!eRun)rows($("eqResult"),[["Tap Start to begin the reaction"]]);
  else if(ep<0.55)rows($("eqResult"),[["Reaction is running","found"],["Forward is fast. Backward is slow"]]);
  else rows($("eqResult"),[["Equilibrium reached at A","found"],["Forward rate = backward rate"],["The amounts stop changing, but both reactions still go on"]]);
}
$("eqGo").addEventListener("click",function(){eRun=true;ep=0;upEQ()});
/* ---- Lab 2: balance ---- */
var SXD=[
 {l:3,r:3,a:0,n:"Normal conditions",e:["Same amount on both sides","This is the balance at equilibrium"]},
 {l:2,r:4,a:1,n:"More pressure: more NH₃",e:["4 molecules on the left, 2 on the right","High pressure moves the reaction to the side with fewer molecules"]},
 {l:4,r:2,a:-1,n:"More heat: less NH₃",e:["The forward reaction gives out heat","Extra heat moves the reaction backward"]},
 {l:2,r:4,a:1,n:"Remove NH₃: more NH₃ is made",e:["The reaction makes more NH₃ to replace it","So the balance moves forward"]}];
var sx=0,sang=0;
function drawSX(){
  var c=$("sxCanvas"),f=fit(c,220),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,220);
  var D=SXD[sx],target=D.a*0.22;sang+=(target-sang)*0.12;
  var cx=w/2,cy=100,L=Math.min(100,w/2-46);
  x.strokeStyle="#cbd5e1";x.lineWidth=4;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx,190);x.moveTo(cx-24,190);x.lineTo(cx+24,190);x.stroke();
  var ex=cx-Math.cos(sang)*L,ey=cy+Math.sin(sang)*(-L)*-1; /* left end */
  var lx=cx-Math.cos(sang)*L,ly=cy+Math.sin(sang)*(-L)*(-1)*(-1);
  /* positive sang => right end down */
  lx=cx-Math.cos(sang)*L;ly=cy-Math.sin(sang)*L;var rx=cx+Math.cos(sang)*L,ry=cy+Math.sin(sang)*L;
  x.strokeStyle="#fbbf24";x.lineWidth=6;x.lineCap="round";x.beginPath();x.moveTo(lx,ly);x.lineTo(rx,ry);x.stroke();x.lineCap="butt";
  dot(x,cx,cy,7,"#fbbf24");
  function pan(px,py,n,cols,label){x.strokeStyle="#94a3b8";x.lineWidth=2;x.beginPath();x.moveTo(px-34,py+4);x.lineTo(px+34,py+4);x.stroke();
    for(var i=0;i<n;i++){dot(x,px-22+i*(44/Math.max(1,n-1)||0),py-8,7,cols[i%cols.length])}
    x.fillStyle="#fff";x.font="800 12px Inter,sans-serif";x.textAlign="center";x.fillText(label,px,py+24)}
  pan(lx,ly-6,D.l,["#38bdf8","#a78bfa","#a78bfa","#a78bfa"],"N₂ + H₂");pan(rx,ry-6,D.r,["#22c55e"],"NH₃");
  x.fillStyle="#fde047";x.font="800 13px Inter,sans-serif";x.textAlign="center";x.fillText(D.a>0?"→ forward":(D.a<0?"← backward":"balanced"),cx,30);
}
function upSX(){var D=SXD[sx];rows($("sxResult"),[[D.n,"found"]].concat(D.e.map(function(s){return[s]})));
  Array.prototype.forEach.call(document.querySelectorAll("[data-x]"),function(b){b.classList.toggle("on",+b.dataset.x===sx)})}
Array.prototype.forEach.call(document.querySelectorAll("[data-x]"),function(b){b.addEventListener("click",function(){sx=+b.dataset.x;upSX()})});
/* ---- Lab 3 ---- */
var SU=[{n:"Sugar",f:"C₁₂H₂₂O₁₁",o:"Sugar turns black and a carbon column rises",q:"C₁₂H₂₂O₁₁ → 12C + 11H₂O"},
 {n:"Blue vitriol",f:"CuSO₄·5H₂O",o:"Blue crystals turn white",q:"CuSO₄·5H₂O → CuSO₄ + 5H₂O"}];
var si=-1,sp=0;
function drawSU(){
  var c=$("suCanvas"),f=fit(c,210),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,210);
  var cx=w/2,bw=120,by=110,bh=84,i;
  x.strokeStyle="#94a3b8";x.lineWidth=3;x.strokeRect(cx-bw/2,by,bw,bh);
  if(si>=0&&sp<1)sp=Math.min(1,sp+0.005);
  var s2=Math.max(0,(sp-0.12)/0.88);
  if(si!==1){
    x.fillStyle="#f1f5f9";x.fillRect(cx-bw/2+3,by+bh-24,bw-6,21);
    if(s2>0){var colh=s2*100;x.fillStyle="#111827";x.fillRect(cx-24,by+bh-24-colh,48,colh+21);
      for(i=0;i<5;i++){var q=((t*0.01+i/5)%1);dot(x,cx-20+i*10,by+bh-24-colh-q*40,4+q*4,"rgba(255,255,255,"+(0.5-q*0.5)+")")}}
  }else{
    var r=Math.round(59+s2*186),g=Math.round(130+s2*115),b=Math.round(246-s2*1);
    x.fillStyle="rgb("+r+","+g+","+b+")";
    for(i=0;i<7;i++)x.fillRect(cx-42+i*12,by+bh-20-(i%3)*8,9,9+(i%3)*8);x.fillRect(cx-46,by+bh-12,92,9);
    if(s2>0&&s2<1)for(i=0;i<4;i++){var q2=((t*0.012+i/4)%1);dot(x,cx-24+i*16,by+bh-20-q2*40,3+q2*3,"rgba(200,230,255,"+(0.5-q2*0.5)+")")}
  }
  /* dropper pours acid at the start */
  if(si>=0&&sp<0.12){var dy=36+sp/0.12*50;x.fillStyle="#fbbf24";x.beginPath();x.moveTo(cx,dy-24);x.lineTo(cx-9,dy);x.lineTo(cx+9,dy);x.closePath();x.fill();dot(x,cx,dy+10,4,"#fbbf24")}
  x.fillStyle="#fde047";x.font="700 11px Inter,sans-serif";x.textAlign="center";
  x.fillText(si<0?"Choose a substance":(sp<0.12?"adding conc. H₂SO₄":SU[si].n),cx,by+bh+16>205?205:by-12);
}
function upSU(){
  if(si<0)rows($("suResult"),[["Tap Sugar or Blue vitriol"]]);
  else rows($("suResult"),[[SU[si].o,"found"],[SU[si].q],["Conc. H₂SO₄ is a dehydrating agent"]]);
  Array.prototype.forEach.call(document.querySelectorAll("[data-s]"),function(b){b.classList.toggle("on",+b.dataset.s===si)})}
Array.prototype.forEach.call(document.querySelectorAll("[data-s]"),function(b){b.addEventListener("click",function(){si=+b.dataset.s;sp=0.001;upSU()})});
/* ---- Lab 4 ---- */
var HY=[
 {n:"MgSO₄",sol:"#dbeafe",pc:"#f8fafc",pn:"white"},
 {n:"CuSO₄",sol:"#93c5fd",pc:"#2563eb",pn:"blue"},
 {n:"FeSO₄",sol:"#d9f99d",pc:"#65a30d",pn:"green"},
 {n:"FeCl₃",sol:"#fde68a",pc:"#b45309",pn:"brown"}];
var hs=0,hp=0;
function drawHY(){
  var c=$("hyCanvas"),f=fit(c,230),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,230);
  var target=hs===1?1:0;hp+=(target-hp)*0.05;if(Math.abs(target-hp)<0.003)hp=target;
  var n=4,tw=Math.min(44,(w-40)/n-14),gap=(w-n*tw)/(n+1),top=30,bot=176;
  for(var i=0;i<n;i++){var H=HY[i],tx=gap+i*(tw+gap)+tw/2;
    x.fillStyle=H.sol;x.globalAlpha=0.6;x.fillRect(tx-tw/2+3,top+40,tw-6,bot-top-42);x.globalAlpha=1;
    if(hp>0){var ph=(bot-top-42)*0.5*hp;x.fillStyle=H.pc;x.globalAlpha=Math.min(1,hp*1.5);x.fillRect(tx-tw/2+3,bot-2-ph,tw-6,ph);x.globalAlpha=1}
    x.strokeStyle="#94a3b8";x.lineWidth=3;x.beginPath();x.moveTo(tx-tw/2,top);x.lineTo(tx-tw/2,bot-12);x.arc(tx,bot-12,tw/2,Math.PI,0,true);x.lineTo(tx+tw/2,top);x.stroke();
    x.fillStyle="#fff";x.font="800 11px Inter,sans-serif";x.textAlign="center";x.fillText(H.n,tx,top-8);
    x.fillStyle=hs===1?(H.pc==="#f8fafc"?"#e5e7eb":H.pc):"#64748b";x.fillText(hs===1?H.pn:(hs===2?"dissolved":""),tx,bot+22)}
}
function upHY(){
  if(hs===0)rows($("hyResult"),[["Four salt solutions"],["Tap Add NaOH"]]);
  else if(hs===1)rows($("hyResult"),[["Each metal gives its own coloured hydroxide precipitate","found"],["Mg(OH)₂ white · Cu(OH)₂ blue · Fe(OH)₂ green · Fe(OH)₃ brown"],["Tap Add HCl next"]]);
  else rows($("hyResult"),[["The precipitates dissolve in HCl","found"],["Metal hydroxides are bases. They react with acids"]]);
}
$("hyNa").addEventListener("click",function(){hs=1;upHY()});
$("hyHcl").addEventListener("click",function(){if(hs===1){hs=2;hp=0.999;upHY()}});
$("hyRe").addEventListener("click",function(){hs=0;hp=0;upHY()});
upEQ();upSX();upSU();upHY();
function loop(){t++;if(!document.hidden){var pe=ep;drawEQ();if(eRun&&((pe<0.55)!==(ep<0.55)))upEQ();drawSX();drawSU();drawHY()}requestAnimationFrame(loop)}
loop();
var QS=[
{q:"Which catalyst is used in the Haber process?",options:["Iron","Vanadium pentoxide","Nickel","Platinum"],answer:0,explain:"Iron is the catalyst for N₂ + 3H₂ ⇌ 2NH₃."},
{q:"What is the ratio of nitrogen to hydrogen in the Haber process?",options:["1 : 3","3 : 1","1 : 1","2 : 3"],answer:0,explain:"N₂ + 3H₂ ⇌ 2NH₃ needs 1 part nitrogen to 3 parts hydrogen."},
{q:"At equilibrium, the rate of the forward reaction is:",options:["Equal to the rate of the backward reaction","Higher than the backward rate","Zero","Lower than the backward rate"],answer:0,explain:"Both reactions go on at the same rate, so the amounts stay constant."},
{q:"Increasing the pressure in N₂ + 3H₂ ⇌ 2NH₃ gives:",options:["More NH₃","Less NH₃","No change","More N₂"],answer:0,explain:"The equilibrium shifts towards the side with fewer gas molecules (2 instead of 4)."},
{q:"Raising the temperature in 2SO₂ + O₂ ⇌ 2SO₃ + heat gives:",options:["Less SO₃","More SO₃","No change","Only O₂"],answer:0,explain:"The forward reaction releases heat, so heating shifts the equilibrium backward."},
{q:"Which catalyst is used in the contact process?",options:["V₂O₅","Fe","Ni","MnO₂"],answer:0,explain:"Vanadium pentoxide at about 450 °C converts SO₂ into SO₃."},
{q:"Which is the drying agent for ammonia gas?",options:["Quicklime (CaO)","Conc. H₂SO₄","Anhydrous CaCl₂","P₂O₅"],answer:0,explain:"Ammonia is basic, so it is dried with the basic oxide CaO. Acidic drying agents react with it."},
{q:"When conc. H₂SO₄ is added to sugar, a black mass forms. Which property is shown?",options:["Dehydrating property","Oxidising property","Acidic property","Basic property"],answer:0,explain:"The acid removes water from sugar and leaves carbon."},
{q:"When NaOH is added to MgSO₄ solution, you get:",options:["A white precipitate","A blue precipitate","No change","A brown precipitate"],answer:0,explain:"Mg(OH)₂ is a white precipitate."},
{q:"The basicity of sulphuric acid is:",options:["2","1","3","4"],answer:0,explain:"H₂SO₄ gives two H⁺ ions per molecule, so it is dibasic."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();