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

/* Electrochemistry — Class 10 Chemistry, Chapter 5 */
var MT=[["Mg",2,-2.37,"#cbd5e1","rgba(190,220,255,.22)"],["Al",3,-1.66,"#e2e8f0","rgba(190,220,255,.22)"],["Zn",2,-0.76,"#a5b4c4","rgba(190,220,255,.22)"],["Fe",2,-0.44,"#94a3b8","rgba(150,210,150,.4)"],["Cu",2,0.34,"#d97706","rgba(60,130,255,.6)"],["Ag",1,0.80,"#e5e7eb","rgba(190,220,255,.22)"]];
var SUP="⁰¹²³⁴⁵⁶⁷⁸⁹";
function ion(i){var n=MT[i][1];return MT[i][0]+(n>1?SUP[n]:"")+"⁺"}
function gcd(a,b){return b?gcd(b,a%b):a}
function overall(a,b){ /* a oxidised (anode metal), b ion reduced */
  var n1=MT[a][1],n2=MT[b][1],L=n1*n2/gcd(n1,n2),x=L/n1,y=L/n2;
  function c(k,s){return(k>1?k:"")+s}
  return c(x,MT[a][0])+" + "+c(y,ion(b))+" → "+c(x,ion(a))+" + "+c(y,MT[b][0]);
}
var t=0;
/* ---- Lab 1 ---- */
var ga=2,gb=4;
function drawGC(){
  var c=$("gcCanvas"),f=fit(c,260),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,260);
  var same=ga===gb,an=MT[ga][2]<MT[gb][2]?ga:gb,ca=an===ga?gb:ga;
  var bw=Math.min(112,(w-60)/2-6),lx=w/2-bw-14,rx=w/2+14,by=130,bh=100;
  function beaker(px,i){x.fillStyle=MT[i][4];x.fillRect(px,by,bw,bh);x.strokeStyle="#94a3b8";x.lineWidth=3;x.strokeRect(px,by,bw,bh);
    var isAn=!same&&i===an&&px===(an===ga?lx:rx),th=same?14:(i===an?(px===lx&&an===ga?9:9):18);
    var thin=!same&&((px===lx)===(an===ga)),tw=thin?9:(same?14:20);
    x.fillStyle=MT[i][3];x.fillRect(px+bw/2-tw/2,by-52,tw,52+bh*0.7);
    x.fillStyle="#fff";x.font="700 12px Inter,sans-serif";x.textAlign="center";x.fillText(ion(i),px+bw/2,by+bh-8)}
  beaker(lx,ga);beaker(rx,gb);
  /* salt bridge */
  x.strokeStyle="#fde047";x.lineWidth=7;x.beginPath();x.moveTo(lx+bw*0.8,by+20);x.lineTo(lx+bw*0.8,by-14);x.lineTo(rx+bw*0.2,by-14);x.lineTo(rx+bw*0.2,by+20);x.stroke();
  x.fillStyle="#fde047";x.font="600 10px Inter,sans-serif";x.fillText("salt bridge",w/2,by-22);
  /* wire */
  var y0=30,lw=lx+bw/2,rw=rx+bw/2;
  x.strokeStyle="#fbbf24";x.lineWidth=3;x.beginPath();x.moveTo(lw,by-52);x.lineTo(lw,y0);x.lineTo(w/2-26,y0);x.moveTo(w/2+26,y0);x.lineTo(rw,y0);x.lineTo(rw,by-52);x.stroke();
  /* voltmeter */
  var V=same?0:Math.abs(MT[ga][2]-MT[gb][2]);
  x.fillStyle="#111a3a";x.strokeStyle="#cbd5e1";x.lineWidth=2;x.beginPath();x.arc(w/2,y0,26,0,6.283);x.fill();x.stroke();
  x.fillStyle=V?"#22c55e":"#94a3b8";x.font="800 12px Inter,sans-serif";x.fillText(V.toFixed(2)+" V",w/2,y0+4);
  /* electrons */
  if(!same){var from=an===ga?lw:rw,to=an===ga?rw:lw,dir=to>from?1:-1;
    for(var k=0;k<5;k++){var u=((t*0.012+k/5)%1);
      var segA=(by-52-y0),tot=segA*2+Math.abs(to-from)-52;var d=u*tot,px,py;
      if(d<segA){px=from;py=by-52-d}else if(d<segA+Math.abs(to-from)-52){px=from+dir*(d-segA+(dir>0?0:0));py=y0}else{px=to;py=y0+(d-segA-Math.abs(to-from)+52)}
      /* skip drawing over the voltmeter */
      if(Math.abs(px-w/2)<28&&py===y0)continue;
      x.fillStyle="#38bdf8";x.beginPath();x.arc(px,py,4,0,6.283);x.fill()}
    x.fillStyle="#38bdf8";x.font="700 10px Inter,sans-serif";x.fillText("e⁻",w/2+dir*44,y0-8);
    x.fillStyle="#ef4444";x.font="800 13px Inter,sans-serif";x.fillText("− anode",an===ga?lw:rw,by+bh+18);
    x.fillStyle="#22c55e";x.fillText("+ cathode",ca===ga?lw:rw,by+bh+18)}
}
function upGC(){
  $("gcA").textContent="Left: "+MT[ga][0];$("gcB").textContent="Right: "+MT[gb][0];
  var same=ga===gb;
  if(same){rows($("gcResult"),[["Same metal on both sides: no voltage, no current","found"]])}
  else{var an=MT[ga][2]<MT[gb][2]?ga:gb,ca=an===ga?gb:ga,V=Math.abs(MT[ga][2]-MT[gb][2]);
    rows($("gcResult"),[["Anode (−), oxidation: "+MT[an][0]+" → "+ion(an)+" + "+MT[an][1]+"e⁻"],["Cathode (+), reduction: "+ion(ca)+" + "+MT[ca][1]+"e⁻ → "+MT[ca][0]],["Cell reaction: "+overall(an,ca),"found"],["Voltage: "+V.toFixed(2)+" V · electrons flow from "+MT[an][0]+" to "+MT[ca][0]]])}
}
$("gcA").addEventListener("click",function(){ga=(ga+1)%MT.length;upGC()});
$("gcB").addEventListener("click",function(){gb=(gb+1)%MT.length;upGC()});
/* ---- Lab 2 ---- */
var da=2,db=4;
function drawDP(){
  var c=$("dpCanvas"),f=fit(c,230),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,230);
  var rx=MT[da][2]<MT[db][2]&&da!==db,bw=Math.min(150,w-80),bx=(w-bw)/2,by=70,bh=130;
  x.fillStyle=rx&&db===4?"rgba(190,220,255,.22)":MT[db][4];x.fillRect(bx,by,bw,bh);
  x.strokeStyle="#94a3b8";x.lineWidth=3;x.strokeRect(bx,by,bw,bh);
  var sw=24;x.fillStyle=MT[da][3];x.fillRect(w/2-sw/2,20,sw,by+bh-30);
  if(rx){x.fillStyle=MT[db][3];x.fillRect(w/2-sw/2-3,by+4,sw+6,bh-34);
    for(var i=0;i<6;i++){x.fillStyle=MT[db][3];x.beginPath();x.arc(w/2-30+i*12,by+bh-14-((t*0.02+i*13)%1)*8,2.5,0,6.283);x.fill()}}
  x.fillStyle="#fff";x.font="700 12px Inter,sans-serif";x.textAlign="center";x.fillText(ion(db)+" solution",w/2,by+bh+18);
  x.fillStyle="#cbd5e1";x.fillText(MT[da][0]+" strip",w/2+sw+30,40);
  if(rx){x.fillStyle="#fde047";x.fillText(MT[db][0]+" deposits on the strip",w/2,by-8)}
}
function upDP(){
  $("dpA").textContent="Strip: "+MT[da][0];$("dpB").textContent="Solution: "+ion(db);
  var rx=MT[da][2]<MT[db][2]&&da!==db,r;
  if(rx)r=[[MT[da][0]+" is more reactive than "+MT[db][0]+": it displaces it","found"],[overall(da,db)],["Oxidising agent: "+ion(db)+" · Reducing agent: "+MT[da][0]]];
  else if(da===db)r=[["Same metal: nothing happens","found"]];
  else r=[[MT[da][0]+" is less reactive than "+MT[db][0]+": no reaction","found"],["A less reactive metal cannot displace a more reactive one"]];
  rows($("dpResult"),r);
}
$("dpA").addEventListener("click",function(){da=(da+1)%MT.length;upDP()});
$("dpB").addEventListener("click",function(){db=(db+1)%MT.length;upDP()});
/* ---- Lab 3 ---- */
var em=0;
var EXP=[
 {liq:"rgba(255,160,80,.45)",cath:"Silvery sodium forms",an:"Chlorine gas (pale green)",ar:["Anode (+), oxidation: 2Cl⁻ → Cl₂ + 2e⁻","Cathode (−), reduction: Na⁺ + e⁻ → Na","Products: sodium metal and chlorine gas"],aCol:"#bef264",cCol:"#e5e7eb",ca:"graphite",cb:"graphite"},
 {liq:"rgba(190,220,255,.3)",cath:"H₂ gas, solution turns pink",an:"Cl₂ gas",ar:["Anode (+): 2Cl⁻ → Cl₂ + 2e⁻","Cathode (−): 2H₂O + 2e⁻ → H₂ + 2OH⁻","Products: H₂, Cl₂ and NaOH solution"],aCol:"#bef264",cCol:"#e2e8f0",ca:"Pt",cb:"Pt"},
 {liq:"rgba(60,130,255,.5)",cath:"Copper coats the iron ring",an:"Copper dissolves",ar:["Anode (+), copper plate: Cu → Cu²⁺ + 2e⁻","Cathode (−), iron ring: Cu²⁺ + 2e⁻ → Cu","The iron ring gets a layer of copper"],aCol:"#d97706",cCol:"#d97706",ca:"Cu plate",cb:"iron ring"}];
function drawEL(){
  var c=$("elCanvas"),f=fit(c,260),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,260);
  var E=EXP[em],bw=Math.min(190,w-70),bx=(w-bw)/2,by=100,bh=120;
  x.fillStyle=E.liq;x.fillRect(bx,by,bw,bh);x.strokeStyle="#94a3b8";x.lineWidth=3;x.strokeRect(bx,by,bw,bh);
  var ax=bx+bw*0.75,cx=bx+bw*0.25;
  x.fillStyle="#475569";x.fillRect(cx-6,by-40,12,bh*0.9+40);x.fillRect(ax-6,by-40,12,bh*0.9+40);
  if(em===2){x.fillStyle="#d97706";x.fillRect(ax-8,by-40,16,bh*0.9+40);x.strokeStyle="#d97706";x.lineWidth=5;x.beginPath();x.ellipse(cx,by+bh*0.5,15,10,0,0,6.283);x.stroke()}
  /* battery */
  var wy=24;x.strokeStyle="#fbbf24";x.lineWidth=3;x.beginPath();x.moveTo(cx,by-40);x.lineTo(cx,wy);x.lineTo(w/2-24,wy);x.moveTo(w/2+24,wy);x.lineTo(ax,wy);x.lineTo(ax,by-40);x.stroke();
  x.fillStyle="#1e293b";x.strokeStyle="#cbd5e1";x.lineWidth=2;x.fillRect(w/2-24,wy-12,48,24);x.strokeRect(w/2-24,wy-12,48,24);
  x.fillStyle="#ef4444";x.font="800 14px Inter,sans-serif";x.textAlign="center";x.fillText("−",w/2-14,wy+5);x.fillStyle="#22c55e";x.fillText("+",w/2+14,wy+5);
  x.fillStyle="#38bdf8";x.font="700 11px Inter,sans-serif";x.fillText("Cathode (−)",cx,by+bh+16);x.fillStyle="#f87171";x.fillText("Anode (+)",ax,by+bh+16);
  x.fillStyle="#cbd5e1";x.font="600 10px Inter,sans-serif";x.fillText(E.cb,cx,by+bh+30);x.fillText(E.ca,ax,by+bh+30);
  /* bubbles / deposit */
  for(var i=0;i<6;i++){var u=(t*0.015+i/6)%1;
    if(em<2){x.fillStyle=em===0?"#e5e7eb":"#e2e8f0";x.beginPath();x.arc(cx+(i%3-1)*6,by+bh*0.8-u*bh*0.8,3,0,6.283);x.fill();
      x.fillStyle=E.aCol;x.beginPath();x.arc(ax+(i%3-1)*6,by+bh*0.8-u*bh*0.8,3.5,0,6.283);x.fill()}}
  if(em===1){x.fillStyle="rgba(244,114,182,.35)";x.fillRect(cx-22,by+2,44,bh*0.5)}
}
function upEL(){
  var E=EXP[em];
  rows($("elResult"),[[E.ar[0]],[E.ar[1]],[E.ar[2],"found"]]);
  Array.prototype.forEach.call(document.querySelectorAll("[data-e]"),function(b){b.classList.toggle("on",+b.dataset.e===em)});
}
Array.prototype.forEach.call(document.querySelectorAll("[data-e]"),function(b){b.addEventListener("click",function(){em=+b.dataset.e;upEL()})});
upGC();upDP();upEL();
function loop(){t++;if(!document.hidden){drawGC();drawDP();drawEL()}requestAnimationFrame(loop)}
loop();
var QS=[
{q:"In a galvanic cell, which electrode is the anode?",options:["Negative, where oxidation occurs","Positive, where oxidation occurs","Negative, where reduction occurs","Positive, where reduction occurs"],answer:0,explain:"In a galvanic cell the anode is the negative electrode and oxidation takes place there."},
{q:"In a Zn–Cu Daniell cell, electrons flow:",options:["From zinc to copper through the wire","From copper to zinc through the wire","Through the salt bridge","From the solution to the wire"],answer:0,explain:"Zinc is more reactive, so it is oxidised and the electrons flow through the wire to copper."},
{q:"What is the function of the salt bridge?",options:["It completes the circuit and keeps the solutions neutral","It makes the solutions mix","It produces electrons","It increases the voltage"],answer:0,explain:"The salt bridge joins the two solutions electrically so ions can move, without letting the solutions mix."},
{q:"Which of these can displace copper from copper sulphate solution?",options:["Zinc","Silver","Gold","Mercury"],answer:0,explain:"Only a metal more reactive than copper displaces it. Zinc is above copper in the reactivity series."},
{q:"Why can silver nitrate solution not be stored in a copper vessel?",options:["Copper displaces silver","Silver displaces copper","Copper dissolves in water","Silver is a gas"],answer:0,explain:"Copper is more reactive than silver, so it displaces silver and the vessel is damaged."},
{q:"In Mg + CuSO₄ → MgSO₄ + Cu, the reducing agent is:",options:["Mg","Cu²⁺","SO₄²⁻","Cu"],answer:0,explain:"Magnesium is oxidised and it reduces Cu²⁺, so Mg is the reducing agent."},
{q:"Which metal does NOT displace hydrogen from dilute hydrochloric acid?",options:["Copper","Zinc","Magnesium","Iron"],answer:0,explain:"Copper is below hydrogen in the reactivity series, so it cannot displace hydrogen."},
{q:"In an electrolytic cell the cathode is:",options:["Negative, where reduction occurs","Positive, where reduction occurs","Negative, where oxidation occurs","Positive, where oxidation occurs"],answer:0,explain:"In an electrolytic cell the cathode is connected to the negative terminal and reduction takes place there."},
{q:"What are the products of electrolysis of molten sodium chloride?",options:["Sodium and chlorine","Hydrogen and chlorine","Sodium and oxygen","Hydrogen and NaOH"],answer:0,explain:"Na⁺ is reduced to sodium at the cathode and Cl⁻ is oxidised to chlorine at the anode."},
{q:"In electroplating an iron ring with copper, the iron ring is connected to:",options:["The negative terminal (cathode)","The positive terminal (anode)","Neither terminal","A salt bridge"],answer:0,explain:"The object to be plated is the cathode. The copper plate is the anode."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();