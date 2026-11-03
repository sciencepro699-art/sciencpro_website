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

/* Metals — Class 10 Chemistry, Chapter 6 */
var t=0;
/* ---- Lab 1 ---- */
var OR=[
 {n:"Haematite (Fe₂O₃)",m:"Hydraulic washing",why:"The ore is denser than the gangue, so a stream of water carries the light gangue away",oc:"#b91c1c",gc:"#cbd5e1",ol:"ore (dense)",gl:"gangue (light)"},
 {n:"Tinstone (SnO₂)",m:"Magnetic separation",why:"The ore is non-magnetic but the gangue (wolframite) is magnetic",oc:"#facc15",gc:"#92400e",ol:"ore (non-magnetic)",gl:"gangue (magnetic)"},
 {n:"Zinc blende (ZnS)",m:"Froth flotation",why:"Sulphide ores are wetted by oil, so air bubbles lift them into the froth. Gangue sinks",oc:"#fbbf24",gc:"#94a3b8",ol:"ore (sulphide)",gl:"gangue"},
 {n:"Bauxite (Al₂O₃·2H₂O)",m:"Leaching",why:"Hot NaOH solution dissolves the ore. The insoluble gangue is filtered off",oc:"#fb923c",gc:"#64748b",ol:"ore (dissolves)",gl:"gangue (insoluble)"}];
var oi=0;
function dot(x,px,py,col,r){x.fillStyle=col;x.beginPath();x.arc(px,py,r||4,0,6.283);x.fill()}
function drawOR(){
  var c=$("orCanvas"),f=fit(c,230),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,230);
  var O=OR[oi],u=(t%300)/300,i,k;
  x.textAlign="center";
  if(oi===0){ /* sloping table with water */
    x.fillStyle="#475569";x.beginPath();x.moveTo(30,70);x.lineTo(w-30,160);x.lineTo(w-30,172);x.lineTo(30,82);x.fill();
    for(i=0;i<14;i++){var q=((u*1.2+i/14)%1);var px=30+q*(w-60),py=70+q*90-6;
      dot(x,px,py-2,"rgba(56,189,248,.5)",3);
      var heavy=i%2===0;
      if(heavy){dot(x,30+Math.min(q,0.35)*(w-60)*0.6+((i*7)%40),70+Math.min(q,0.35)*90*0.6-6,O.oc,5)}
      else dot(x,px,py-9,O.gc,4)}
    x.fillStyle="#38bdf8";x.font="700 11px Inter,sans-serif";x.fillText("water stream →",w-80,44);
    x.fillStyle=O.oc;x.fillText("ore stays",60,128);x.fillStyle=O.gc;x.fillText("gangue washed away",w-80,190)
  }else if(oi===1){ /* magnetic roller */
    x.strokeStyle="#64748b";x.lineWidth=3;x.beginPath();x.moveTo(30,70);x.lineTo(w-90,70);x.stroke();
    x.fillStyle="#ef4444";x.beginPath();x.arc(w-90,92,22,0,6.283);x.fill();x.fillStyle="#fff";x.font="800 11px Inter,sans-serif";x.fillText("magnet",w-90,96);
    for(i=0;i<12;i++){var q=((u+i/12)%1),px=30+q*(w-120),mag=i%2===0;
      if(q<0.75||mag===false&&q<1){ if(q<0.8)dot(x,px,64,mag?O.gc:O.oc,4)}
      var r=(q-0.8)/0.2;
      if(q>=0.8){var fx=w-90+(mag?18:55)*r*(mag?1:1.2),fy=70+r*(mag?80:110);dot(x,mag?w-90+Math.sin(r*3)*14:fx,fy,mag?O.gc:O.oc,4)}}
    x.fillStyle=O.gc;x.font="700 11px Inter,sans-serif";x.fillText("magnetic gangue falls near",w-110,200);x.fillStyle=O.oc;x.fillText("ore falls far",w-60,222)
  }else if(oi===2){ /* froth flotation */
    x.strokeStyle="#94a3b8";x.lineWidth=3;x.strokeRect(w/2-90,50,180,150);
    x.fillStyle="rgba(56,189,248,.18)";x.fillRect(w/2-88,70,176,128);
    x.fillStyle="rgba(255,255,255,.35)";for(i=0;i<9;i++){x.beginPath();x.arc(w/2-80+i*20,66,9,0,6.283);x.fill()}
    for(i=0;i<10;i++){var q=((u*1.3+i/10)%1),bx=w/2-76+(i*17)%152;
      x.strokeStyle="rgba(255,255,255,.5)";x.lineWidth=1.5;x.beginPath();x.arc(bx,190-q*118,5,0,6.283);x.stroke();
      if(i%2===0)dot(x,bx,190-q*118+2,O.oc,3.5)}
    for(i=0;i<8;i++)dot(x,w/2-76+(i*23)%152,190-(i%3)*4,O.gc,4);
    x.fillStyle="#fde047";x.font="700 11px Inter,sans-serif";x.fillText("ore rises with the froth",w/2,38)
  }else{ /* leaching */
    x.strokeStyle="#94a3b8";x.lineWidth=3;x.strokeRect(w/2-80,60,160,130);x.fillStyle="rgba(56,189,248,.2)";x.fillRect(w/2-78,90,156,98);
    var d=Math.min(1,u*1.6);
    for(i=0;i<10;i++){var px=w/2-64+(i*17)%130,py=170-(i%3)*8;
      dot(x,px,py,O.oc,5*(1-d)+0.001);if(d>0.1)dot(x,px,py-d*30*((i%3)+1)/2,"rgba(251,146,60,"+(0.5*d)+")",6)}
    for(i=0;i<7;i++)dot(x,w/2-60+(i*21)%120,180,O.gc,5);
    x.fillStyle="#fde047";x.font="700 11px Inter,sans-serif";x.fillText("NaOH solution",w/2,52);x.fillStyle=O.gc;x.fillText("gangue stays solid",w/2,208)}
  /* legend */
  x.font="700 10px Inter,sans-serif";dot(x,16,14,O.oc,5);x.textAlign="left";x.fillStyle="#cbd5e1";x.fillText(O.ol,26,18);dot(x,16,30,O.gc,5);x.fillText(O.gl,26,34);x.textAlign="center";
}
function upOR(){var O=OR[oi];rows($("orResult"),[["Ore: "+O.n],["Method: "+O.m,"found"],[O.why]]);
  Array.prototype.forEach.call(document.querySelectorAll("[data-o]"),function(b){b.classList.toggle("on",+b.dataset.o===oi)})}
Array.prototype.forEach.call(document.querySelectorAll("[data-o]"),function(b){b.addEventListener("click",function(){oi=+b.dataset.o;upOR()})});
/* ---- Lab 2 ---- */
var MS=["K","Na","Ca","Mg","Al","Zn","Fe","Sn","Pb","Cu","Hg","Ag","Au"];
var GR=[
 {c:"#ef4444",n:"Electrolysis of the molten compound",k:"Highly reactive. Forms very stable compounds"},
 {c:"#f59e0b",n:"Roast or calcine to the oxide, then reduce with coke or CO",k:"Moderately reactive. Found as oxides, sulphides or carbonates"},
 {c:"#22c55e",n:"Heating or occurs nearly free",k:"Less reactive. Forms less stable compounds"}];
function grp(i){return i<=4?0:(i<=8?1:2)}
var rv=0;
function drawRV(){
  var c=$("rvCanvas"),f=fit(c,230),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,230);
  var bh=12,gy=3,x0=44,mw=w-x0-16;
  for(var i=0;i<MS.length;i++){var y=6+i*(bh+gy),len=mw*(1-i/(MS.length+1.5)),g=GR[grp(i)];
    x.globalAlpha=i===rv?1:0.45;x.fillStyle=g.c;x.fillRect(x0,y,len,bh);
    if(i===rv){x.strokeStyle="#fff";x.lineWidth=2;x.strokeRect(x0-1,y-1,len+2,bh+2)}
    x.globalAlpha=1;x.fillStyle="#fff";x.font="800 12px Inter,sans-serif";x.textAlign="right";x.fillText(MS[i],x0-8,y+bh-2)}
  x.textAlign="left";x.font="700 10px Inter,sans-serif";x.fillStyle="#94a3b8";x.fillText("more reactive ↑",x0+6,224)
}
function upRV(){var g=GR[grp(rv)];$("rvM").textContent=MS[rv];
  var extra=MS[rv]==="Hg"?"Mercury is obtained from its ore by controlled heating":(MS[rv]==="Au"||MS[rv]==="Ag"?"Found almost free. Leached with NaCN solution":(MS[rv]==="Al"?"Alumina in molten cryolite is electrolysed. Al forms at the cathode":""));
  var r=[["Method: "+g.n,"found"],[g.k]];if(extra)r.push([extra]);rows($("rvResult"),r)}
$("rvS").addEventListener("input",function(){rv=+this.value;upRV();drawRV()});
/* ---- Lab 3 ---- */
var BZ=[
 {n:"Top: the charge goes in",e:["Ore + coke + limestone are fed in","Hot gases leave at the top","Ore loses its moisture"]},
 {n:"Limestone breaks down",e:["CaCO₃ → CaO + CO₂","CaO is the flux"]},
 {n:"The ore is reduced",e:["Fe₂O₃ + 3CO → 2Fe + 3CO₂","Carbon monoxide is the reducing agent"]},
 {n:"Bottom: heat and slag",e:["C + O₂ → CO₂ then CO₂ + C → 2CO","CaO + SiO₂ → CaSiO₃ (slag)","Molten iron sinks, slag floats on it"]}];
var bd=0;
function drawBF(){
  var c=$("bfCanvas"),f=fit(c,260),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,260);
  var cx=w/2+10,top=24,bot=232,tw=44,mw=76,bw=52;
  function half(y){var q=(y-top)/(bot-top);return q<0.65?tw+(mw-tw)*(q/0.65):mw-(mw-bw)*((q-0.65)/0.35)}
  x.beginPath();x.moveTo(cx-tw,top);x.lineTo(cx-mw,top+0.65*(bot-top));x.lineTo(cx-bw,bot);x.lineTo(cx+bw,bot);x.lineTo(cx+mw,top+0.65*(bot-top));x.lineTo(cx+tw,top);x.closePath();
  var gr=x.createLinearGradient(0,top,0,bot);gr.addColorStop(0,"#1e293b");gr.addColorStop(0.6,"#7c2d12");gr.addColorStop(1,"#ea580c");x.fillStyle=gr;x.fill();x.strokeStyle="#94a3b8";x.lineWidth=3;x.stroke();
  /* molten pool */
  x.fillStyle="#fbbf24";x.fillRect(cx-bw+6,bot-18,2*bw-12,10);x.fillStyle="#a78bfa";x.fillRect(cx-bw+6,bot-26,2*bw-12,8);
  /* falling charge */
  var u=(t%240)/240;
  for(var i=0;i<16;i++){var q=(u+i/16)%1,y=top+q*(bot-top-34),hw=half(y)-12,px=cx-hw+((i*37)%100)/100*2*hw;
    dot(x,px,y,i%3===0?"#4b5563":(i%3===1?"#b91c1c":"#e5e7eb"),3.5)}
  /* hot air up arrows */
  x.strokeStyle="rgba(251,146,60,.8)";x.lineWidth=2;for(i=0;i<3;i++){var q2=1-((u*1.5+i/3)%1),yy=top+8+q2*(bot-top-40),xx=cx-30+i*30;x.beginPath();x.moveTo(xx,yy+8);x.lineTo(xx,yy-6);x.moveTo(xx-4,yy-2);x.lineTo(xx,yy-7);x.lineTo(xx+4,yy-2);x.stroke()}
  /* marker */
  var my=top+bd/100*(bot-top-20)+6,hw2=half(my);
  x.strokeStyle="#fff";x.lineWidth=2;x.setLineDash([5,4]);x.beginPath();x.moveTo(cx-hw2-12,my);x.lineTo(cx+hw2+12,my);x.stroke();x.setLineDash([]);
  x.fillStyle="#fff";x.beginPath();x.moveTo(cx-hw2-14,my);x.lineTo(cx-hw2-24,my-6);x.lineTo(cx-hw2-24,my+6);x.fill();
  /* legend */
  x.font="700 10px Inter,sans-serif";x.textAlign="left";dot(x,10,24,"#b91c1c",4);x.fillStyle="#cbd5e1";x.fillText("ore",18,27);dot(x,10,40,"#4b5563",4);x.fillText("coke",18,43);dot(x,10,56,"#e5e7eb",4);x.fillText("limestone",18,59);
  x.textAlign="right";x.fillStyle="#fbbf24";x.fillText("molten iron",w-8,bot-8);x.fillStyle="#a78bfa";x.fillText("slag",w-8,bot-20);x.fillStyle="#fb923c";x.fillText("hot air ↑",w-8,bot+14);x.textAlign="center"
}
function upBF(){var z=bd<25?0:(bd<50?1:(bd<75?2:3));var Z=BZ[z];rows($("bfResult"),[[Z.n,"found"]].concat(Z.e.map(function(s){return[s]})))}
$("bfS").addEventListener("input",function(){bd=+this.value;upBF();drawBF()});
upOR();upRV();upBF();drawRV();
function loop(){t++;if(!document.hidden){drawOR();drawBF()}requestAnimationFrame(loop)}
loop();
var QS=[
{q:"Which method concentrates an ore that is denser than its gangue?",options:["Hydraulic washing","Froth flotation","Leaching","Magnetic separation"],answer:0,explain:"A stream of water washes away the lighter gangue and leaves the heavy ore."},
{q:"Which method is used for sulphide ores such as zinc blende?",options:["Froth flotation","Magnetic separation","Hydraulic washing","Liquation"],answer:0,explain:"Sulphide ores are lifted by air bubbles into the froth."},
{q:"Bauxite is concentrated by:",options:["Leaching with NaOH","Magnetic separation","Froth flotation","Distillation"],answer:0,explain:"Hot NaOH dissolves alumina. The gangue remains insoluble."},
{q:"Heating a sulphide ore in excess air below its melting point is called:",options:["Roasting","Calcination","Liquation","Leaching"],answer:0,explain:"Roasting converts sulphide ores to oxides, and gives SO₂."},
{q:"Which method extracts highly reactive metals such as sodium?",options:["Electrolysis","Reduction with coke","Roasting","Controlled heating"],answer:0,explain:"Strong reducing agents are needed, so the molten compound is electrolysed."},
{q:"In the blast furnace the reducing agent for haematite is:",options:["Carbon monoxide","Limestone","Oxygen","Slag"],answer:0,explain:"Fe₂O₃ + 3CO → 2Fe + 3CO₂."},
{q:"The flux used in the blast furnace is:",options:["Limestone (CaO)","Coke","Silica","Haematite"],answer:0,explain:"CaCO₃ gives CaO, which combines with silica gangue to form slag."},
{q:"Which metal is purified by liquation?",options:["Tin","Copper","Mercury","Aluminium"],answer:0,explain:"Tin and lead have low melting points, so the pure metal melts and flows away from the impurities."},
{q:"In electrolytic refining of copper, the anode is:",options:["Impure copper","Pure copper","Platinum","Graphite"],answer:0,explain:"Impure metal dissolves at the anode and pure metal deposits on the cathode."},
{q:"Which alloy steel is used for permanent magnets?",options:["Alnico","Stainless steel","Nichrome","Brass"],answer:0,explain:"Alnico is used for magnets. Nichrome is used for heating coils."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();