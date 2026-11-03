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

/* Reactions of Organic Compounds — Class 10 Chemistry, Chapter 2 */
var t=0;
function chip(x,cx,cy,s,col,a){x.globalAlpha=a;x.font="800 15px Inter,sans-serif";var w=x.measureText(s).width+20;
  x.fillStyle="#111a3a";x.strokeStyle=col;x.lineWidth=2;x.beginPath();x.roundRect?x.roundRect(cx-w/2,cy-17,w,34,10):x.rect(cx-w/2,cy-17,w,34);x.fill();x.stroke();
  x.fillStyle="#fff";x.textAlign="center";x.fillText(s,cx,cy+5);x.globalAlpha=1}
/* ---- Lab 1 ---- */
var RX=[
 {n:"Substitution",l:["CH₄","Cl₂"],r:["CH₃Cl","HCl"],c:"sunlight",k:"One atom is replaced by another",e:"CH₄ + Cl₂ → CH₃Cl + HCl"},
 {n:"Addition",l:["CH₂=CH₂","H₂"],r:["CH₃–CH₃"],c:"Ni catalyst",k:"The double bond opens and atoms add on. One product only",e:"CH₂=CH₂ + H₂ → CH₃–CH₃"},
 {n:"Combustion",l:["CH₄","2 O₂"],r:["CO₂","2 H₂O","heat"],c:"burn",k:"Burning in oxygen gives CO₂, water and heat",e:"CH₄ + 2O₂ → CO₂ + 2H₂O"},
 {n:"Thermal cracking",l:["C₃H₈"],r:["CH₄","CH₂=CH₂"],c:"heat",k:"A large molecule breaks into smaller ones",e:"C₃H₈ → CH₄ + CH₂=CH₂"}];
var ri=0,rp=0;
function drawRX(){
  var c=$("rxCanvas"),f=fit(c,200),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,200);
  var R=RX[ri],p=rp/100,L=R.l,P=R.r;
  var mid=w/2;
  /* arrow */
  x.strokeStyle="#fbbf24";x.lineWidth=3;x.beginPath();x.moveTo(mid-26,100);x.lineTo(mid+26,100);x.moveTo(mid+18,93);x.lineTo(mid+27,100);x.lineTo(mid+18,107);x.stroke();
  x.fillStyle="#fde047";x.font="700 11px Inter,sans-serif";x.textAlign="center";x.fillText(R.c,mid,84);
  function col(i,list){return list[i]==="heat"?"#f97316":"#38bdf8"}
  L.forEach(function(s,i){var ty=L.length>1?(i?140:60):100,sx=Math.max(54,w*0.2),ex=mid-w*0.04;
    var cx=sx+(ex-sx)*p*0.6,cy=ty+(100-ty)*p*0.6;chip(x,cx,cy,s,"#38bdf8",1-p)});
  P.forEach(function(s,i){var n=P.length,ty=n>1?(60+i*(n>2?40:80)):100,ex=Math.min(w-54,w*0.8),sx=mid+w*0.04;
    var cx=sx+(ex-sx)*p,cy=100+(ty-100)*p;chip(x,cx,cy,s,s==="heat"?"#f97316":"#22c55e",p)});
}
function upRX(){
  var R=RX[ri];
  rows($("rxResult"),[[R.e],["Type: "+R.n,"found"],[R.k]]);
  Array.prototype.forEach.call(document.querySelectorAll("[data-r]"),function(b){b.classList.toggle("on",+b.dataset.r===ri)});
}
Array.prototype.forEach.call(document.querySelectorAll("[data-r]"),function(b){b.addEventListener("click",function(){ri=+b.dataset.r;rp=0;$("rxS").value=0;upRX();drawRX()})});
$("rxS").addEventListener("input",function(){rp=+this.value;drawRX()});
/* ---- Lab 2 ---- */
var MO=[
 {n:"Ethene",p:"Polythene",u:"carry bags, bottles, films",s:["H","H","H","H"],q:"(CH₂–CH₂)ₙ"},
 {n:"Vinyl chloride",p:"PVC",u:"pipes, cable covering, rain coats",s:["H","H","H","Cl"],q:"(CH₂–CHCl)ₙ"},
 {n:"Tetrafluoroethene",p:"Teflon",u:"non-stick cookware",s:["F","F","F","F"],q:"(CF₂–CF₂)ₙ"},
 {n:"Acrylonitrile",p:"Orlon",u:"woollen-like fibres, blankets",s:["H","H","H","CN"],q:"(CH₂–CHCN)ₙ"}];
var mi=0,pn=3,joined=false;
function drawPM(){
  var c=$("pmCanvas"),f=fit(c,190),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,190);
  var M=MO[mi],gap=Math.min(70,(w-40)/pn),bond=26,tot=pn*gap,x0=(w-tot)/2+gap/2-bond/2-4,cy=96;
  x.textAlign="center";
  for(var i=0;i<pn;i++){
    var ux=x0+i*gap+(joined?0:0),c1=ux,c2=ux+bond;
    x.strokeStyle="#cbd5e1";x.lineWidth=3;
    x.beginPath();x.moveTo(c1,cy);x.lineTo(c2,cy);x.stroke();
    if(!joined){x.beginPath();x.moveTo(c1,cy-5);x.lineTo(c2,cy-5);x.stroke()}
    /* atoms on carbons */
    [[c1,0],[c2,2]].forEach(function(a){
      x.strokeStyle="#94a3b8";x.lineWidth=2;x.beginPath();x.moveTo(a[0],cy-6);x.lineTo(a[0],cy-26);x.moveTo(a[0],cy+6);x.lineTo(a[0],cy+26);x.stroke();
      [[M.s[a[1]],cy-36],[M.s[a[1]+1],cy+38]].forEach(function(l){
        var big=l[0]!=="H";x.fillStyle=big?"#22c55e":"#94a3b8";x.font="800 "+(big?12:11)+"px Inter,sans-serif";x.fillText(l[0],a[0],l[1])})});
    x.fillStyle="#38bdf8";[c1,c2].forEach(function(cx){x.beginPath();x.arc(cx,cy,8,0,6.283);x.fill();x.fillStyle="#0A1128";x.font="800 10px Inter,sans-serif";x.fillText("C",cx,cy+3.5);x.fillStyle="#38bdf8"});
    if(joined&&i<pn-1){x.strokeStyle="#cbd5e1";x.lineWidth=3;x.beginPath();x.moveTo(c2+8,cy);x.lineTo(c2+gap-bond-8+bond-bond,cy);x.lineTo(ux+gap-8,cy);x.stroke()}
  }
  if(joined){x.fillStyle="#fde047";x.font="800 24px Inter,sans-serif";x.fillText("[",x0-26,cy+8);x.fillText("]",x0+(pn-1)*gap+bond+26,cy+8);x.font="800 12px Inter,sans-serif";x.fillText("n",x0+(pn-1)*gap+bond+40,cy+22)}
}
function upPM(){
  var M=MO[mi];$("pmN").textContent=pn;$("pmJoin").textContent=joined?"Separate":"Join";
  if(joined)rows($("pmResult"),[["Polymer: "+M.p+" "+M.q,"found"],["Uses: "+M.u],["This is an addition polymer"]]);
  else rows($("pmResult"),[["Monomer: "+M.n],["Each monomer has a C=C double bond"],["Tap Join to make the polymer"]]);
  Array.prototype.forEach.call(document.querySelectorAll("[data-m]"),function(b){b.classList.toggle("on",+b.dataset.m===mi)});
}
Array.prototype.forEach.call(document.querySelectorAll("[data-m]"),function(b){b.addEventListener("click",function(){mi=+b.dataset.m;upPM();drawPM()})});
$("pmNs").addEventListener("input",function(){pn=+this.value;upPM();drawPM()});
$("pmJoin").addEventListener("click",function(){joined=!joined;upPM();drawPM()});
/* ---- Lab 3 ---- */
var AL=[["Methanol","CH₃OH","methyl","CH₃",1],["Ethanol","C₂H₅OH","ethyl","C₂H₅",2],["Propan-1-ol","C₃H₇OH","propyl","C₃H₇",3]];
var AC=[["Methanoic acid","HCOOH","methanoate","HCOO",1],["Ethanoic acid","CH₃COOH","ethanoate","CH₃COO",2],["Propanoic acid","C₂H₅COOH","propanoate","C₂H₅COO",3]];
var ea=1,eb=1,sm=0;
function drawES(){
  var c=$("esCanvas"),f=fit(c,170),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,170);
  var A=AL[ea],B=AC[eb],es=A[2][0].toUpperCase()+A[2].slice(1)+" "+B[2];
  var ph=(t%240)/240,mid=w/2;
  chip(x,Math.max(56,w*0.17),52,A[1],"#38bdf8",1);chip(x,Math.max(56,w*0.17),118,B[1],"#f87171",1);
  x.fillStyle="#fde047";x.font="800 22px Inter,sans-serif";x.textAlign="center";x.fillText("+",Math.max(56,w*0.17),88);
  x.strokeStyle="#fbbf24";x.lineWidth=3;x.beginPath();x.moveTo(mid-10,85);x.lineTo(mid+22,85);x.moveTo(mid+14,78);x.lineTo(mid+23,85);x.lineTo(mid+14,92);x.stroke();
  x.fillStyle="#fde047";x.font="700 10px Inter,sans-serif";x.fillText("conc. H₂SO₄",mid+4,106);
  chip(x,Math.min(w-70,w*0.8),52,B[3]+A[3],"#22c55e",1);
  chip(x,Math.min(w-70,w*0.8),118,"H₂O","#38bdf8",1);
  /* fruity scent waves */
  x.strokeStyle="rgba(34,197,94,"+(0.7-ph*0.7)+")";x.lineWidth=2;
  for(var k=0;k<2;k++){var rr=8+ph*18+k*10;x.beginPath();x.arc(Math.min(w-70,w*0.8),24,rr/2,Math.PI*1.1,Math.PI*1.9);x.stroke()}
}
function upES(){
  var A=AL[ea],B=AC[eb],es=A[2][0].toUpperCase()+A[2].slice(1)+" "+B[2];
  $("esA").textContent="Alcohol: "+A[0];$("esB").textContent="Acid: "+B[0];
  rows($("esResult"),[[B[1]+" + "+A[1]+" → "+B[3]+A[3]+" + H₂O"],["Ester name: "+es,"found"],["Name = alcohol part + acid part (“"+A[2]+"” + “"+B[2]+"”)"]]);
}
$("esA").addEventListener("click",function(){ea=(ea+1)%AL.length;upES()});
$("esB").addEventListener("click",function(){eb=(eb+1)%AC.length;upES()});
upRX();upPM();upES();drawRX();drawPM();
function loop(){t++;if(!document.hidden)drawES();requestAnimationFrame(loop)}
loop();
var QS=[
{q:"CH₄ + Cl₂ → CH₃Cl + HCl in sunlight is a:",options:["Substitution reaction","Addition reaction","Polymerisation","Cracking"],answer:0,explain:"A hydrogen atom of methane is replaced by a chlorine atom."},
{q:"Which reaction needs a nickel catalyst to add hydrogen to ethene?",options:["Hydrogenation (addition)","Substitution","Combustion","Esterification"],answer:0,explain:"Ethene adds H₂ across the double bond using Ni, giving ethane."},
{q:"Which polymer is made from the monomer isoprene?",options:["Natural rubber","Polythene","PVC","Teflon"],answer:0,explain:"Natural rubber is polyisoprene."},
{q:"Teflon is made from:",options:["Tetrafluoroethene","Vinyl chloride","Ethene","Acrylonitrile"],answer:0,explain:"Teflon is polytetrafluoroethene and is used for non-stick cookware."},
{q:"Thermal cracking of propane (C₃H₈) can give:",options:["CH₄ and CH₂=CH₂","CO₂ and H₂O","CH₃Cl and HCl","C₂H₅OH"],answer:0,explain:"Cracking breaks a larger hydrocarbon into smaller alkane and alkene molecules."},
{q:"Ethanol is made industrially by:",options:["Fermentation of molasses","Cracking of petrol","Burning methane","Hydrogenation of ethene"],answer:0,explain:"Yeast ferments the sugar in molasses to give ethanol."},
{q:"What is the strength of rectified spirit?",options:["95.6% ethanol","8–10% ethanol","100% ethanol","50% ethanol"],answer:0,explain:"Rectified spirit is 95.6% ethanol. Absolute alcohol is 100%."},
{q:"Vinegar contains:",options:["5–8% ethanoic acid","5–8% ethanol","Methanoic acid","Acetone"],answer:0,explain:"Vinegar is a 5–8% solution of ethanoic acid in water."},
{q:"Ethanol + ethanoic acid (conc. H₂SO₄) gives:",options:["Ethyl ethanoate","Methyl ethanoate","Ethyl methanoate","Propyl ethanoate"],answer:0,explain:"The ester takes the alkyl part from the alcohol (ethyl) and the acid part ethanoate."},
{q:"Which substance is the by-product of soap making?",options:["Glycerol","Ethanol","Methane","Ethanoic acid"],answer:0,explain:"Glycerol is obtained along with soap when fats are boiled with alkali."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();