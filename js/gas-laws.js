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

/* Gas Laws and Mole Concept — Class 10 Chemistry, Chapter 4 */
function fmt(n){return String(Math.round(n*100)/100)}
/* Lab 1 */
var P=1;
function drawBY(){
  var c=$("byCanvas"),f=fit(c,240),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,240);
  var cw=Math.min(180,w-120),cx=(w-cw)/2,top=24,bot=220,V=24/P;
  var py=bot-(bot-top-30)*(V/24);
  x.strokeStyle="#94a3b8";x.lineWidth=4;x.beginPath();x.moveTo(cx,top);x.lineTo(cx,bot);x.lineTo(cx+cw,bot);x.lineTo(cx+cw,top);x.stroke();
  x.fillStyle="rgba(156,204,60,.18)";x.fillRect(cx+2,py,cw-4,bot-py-2);
  var n=24,seed=7;for(var i=0;i<n;i++){seed=(seed*9301+49297)%233280;var rx=seed/233280;seed=(seed*9301+49297)%233280;var ry=seed/233280;
    x.fillStyle="#9CCC3C";x.beginPath();x.arc(cx+8+rx*(cw-16),py+8+ry*(bot-py-18),3.5,0,6.283);x.fill()}
  x.fillStyle="#cbd5e1";x.fillRect(cx+2,py-10,cw-4,10);x.fillRect(cx+cw/2-4,top-4,8,py-top-6);
  x.fillStyle="#f43f5e";x.fillRect(cx+cw/2-26,top-12,52,10);
  x.fillStyle="#cbd5e1";x.font="700 12px Inter,sans-serif";x.textAlign="left";x.fillText(fmt(V)+" L",cx+cw+10,(py+bot)/2);
  x.textAlign="center";x.fillText("↓ "+P+" atm",cx+cw/2,12);
}
function upBY(){
  $("byP").textContent=P+" atm";
  rows($("byResult"),[["Pressure: "+P+" atm · Volume: "+fmt(24/P)+" L"],["P × V = "+P+" × "+fmt(24/P)+" = 24","found"],["More pressure, less volume. P × V stays constant.","note"]]);
  drawBY();
}
$("byPs").addEventListener("input",function(){P=+this.value;upBY()});
/* Lab 2 */
var T=300;
function drawCH(){
  var c=$("chCanvas"),f=fit(c,230),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,230);
  var V=3*T/300,r=14+Math.sqrt(V)*22,cx=w*0.45,cy=110;
  x.fillStyle="rgba(244,63,94,.7)";x.beginPath();x.arc(cx,cy,r,0,6.283);x.fill();
  x.strokeStyle="#fb7185";x.lineWidth=3;x.stroke();
  x.strokeStyle="#cbd5e1";x.lineWidth=2;x.beginPath();x.moveTo(cx,cy+r);x.lineTo(cx,cy+r+22);x.stroke();
  x.fillStyle="#fff";x.font="700 13px Inter,sans-serif";x.textAlign="center";x.fillText(fmt(V)+" L",cx,cy+4);
  /* thermometer */
  var tx=w-44,th=170,fh=th*(T-150)/300;
  x.strokeStyle="#94a3b8";x.lineWidth=3;x.strokeRect(tx-6,20,12,th);x.fillStyle="#ef4444";x.fillRect(tx-4,20+th-fh,8,fh);
  x.fillStyle="#cbd5e1";x.font="700 11px Inter,sans-serif";x.fillText(T+" K",tx,th+38);
}
function upCH(){
  $("chT").textContent=T+" K";var V=3*T/300;
  rows($("chResult"),[["Temperature: "+T+" K ("+(T-273)+" °C)"],["Volume: "+fmt(V)+" L"],["V ÷ T = "+fmt(V)+" ÷ "+T+" = 0.01","found"],["More temperature, more volume. V ÷ T stays constant.","note"]]);
  drawCH();
}
$("chTs").addEventListener("input",function(){T=+this.value;upCH()});
/* Lab 3 */
var SUB=[["CO₂",44,true],["H₂O",18,false],["NH₃",17,true],["O₂",32,true],["N₂",28,true],["CH₄",16,true],["NaCl",58.5,false],["C₆H₁₂O₆",180,false]];
var si=0,mass=88;
function sci(n){if(n===0)return "0";var e=Math.floor(Math.log10(n)),m=n/Math.pow(10,e);return fmt(m)+" × 10"+String(e).split("").map(function(d){return d==="-"?"⁻":"⁰¹²³⁴⁵⁶⁷⁸⁹"[+d]}).join("")}
function drawML(){
  var c=$("mlCanvas"),f=fit(c,170),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,170);
  var s=SUB[si],mol=mass/s[1],xs=[w*0.14,w*0.38,w*0.62,w*0.86],lab=["Mass","Moles","Molecules","Volume at STP"];
  var val=[fmt(mass)+" g",fmt(mol)+" mol",sci(mol*6.022e23),s[2]?fmt(mol*22.4)+" L":"gas only"];
  var col=["#fbbf24","#9CCC3C","#38bdf8","#f43f5e"];
  for(var i=0;i<4;i++){x.fillStyle=col[i];x.beginPath();x.arc(xs[i],70,Math.min(36,w/9),0,6.283);x.fill();
    x.fillStyle="#0A1128";x.font="800 "+(w<340?9:11)+"px Inter,sans-serif";x.textAlign="center";x.fillText(i===0?"g":i===1?"mol":i===2?"N":"L",xs[i],74);
    x.fillStyle="#cbd5e1";x.font="600 10px Inter,sans-serif";x.fillText(lab[i],xs[i],122);x.fillStyle="#fff";x.font="700 10px Inter,sans-serif";x.fillText(val[i],xs[i],140)}
  x.fillStyle="#94a3b8";x.font="700 14px Inter,sans-serif";for(i=0;i<3;i++)x.fillText("→",(xs[i]+xs[i+1])/2,74);
}
function upML(){
  var s=SUB[si],mol=mass/s[1];
  $("mlName").textContent=s[0]+" (molar mass "+s[1]+" g)";$("mlM").textContent=mass+" g";
  var r=[["Moles = "+mass+" ÷ "+s[1]+" = "+fmt(mol),"found"],["Molecules = "+fmt(mol)+" × 6.022 × 10²³"]];
  r.push(s[2]?["Volume at STP = "+fmt(mol)+" × 22.4 = "+fmt(mol*22.4)+" L","found"]:["Volume at STP applies to gases only. "+s[0]+" is not a gas at STP.","note"]);
  rows($("mlResult"),r);drawML();
}
$("mlMs").addEventListener("input",function(){mass=+this.value;upML()});
$("mlPrev").addEventListener("click",function(){si=(si+SUB.length-1)%SUB.length;upML()});
$("mlNext").addEventListener("click",function(){si=(si+1)%SUB.length;upML()});
upBY();upCH();upML();
window.addEventListener("resize",function(){drawBY();drawCH();drawML()});
var QS=[
{q:"The volume of a gas is 6 L at 2 atm. What is its volume at 4 atm and constant temperature?",options:["3 L","12 L","6 L","1.5 L"],answer:0,explain:"P₁V₁ = P₂V₂, so 2 × 6 = 4 × V₂ and V₂ = 3 L."},
{q:"Which graph shows Boyle's law?",options:["P against 1/V is a straight line","V against P is a straight line","V against T (°C) is a circle","P against T is a curve through zero"],answer:0,explain:"P × V is constant, so P is proportional to 1/V and P against 1/V is a straight line."},
{q:"Charles's law relates which two quantities at constant pressure?",options:["Volume and temperature in kelvin","Pressure and volume","Mass and volume","Pressure and moles"],answer:0,explain:"At constant pressure, V is directly proportional to T in kelvin."},
{q:"What is 27 °C in kelvin?",options:["300 K","246 K","27 K","273 K"],answer:0,explain:"K = °C + 273 = 27 + 273 = 300 K."},
{q:"A gas has a volume of 2 L at 300 K. What is its volume at 600 K and constant pressure?",options:["4 L","1 L","2 L","8 L"],answer:0,explain:"V₁/T₁ = V₂/T₂, so V₂ = 2 × 600/300 = 4 L."},
{q:"How many molecules are in 1 mole of any substance?",options:["6.022 × 10²³","6.022 × 10²²","22.4","3.011 × 10²³"],answer:0,explain:"One mole contains 6.022 × 10²³ particles (Avogadro's number)."},
{q:"How many moles are in 88 g of CO₂? (C = 12, O = 16)",options:["2","4","0.5","1"],answer:0,explain:"Molar mass of CO₂ = 44 g. Moles = 88 ÷ 44 = 2."},
{q:"What is the volume of 2 moles of any gas at STP?",options:["44.8 L","22.4 L","11.2 L","67.2 L"],answer:0,explain:"One mole occupies 22.4 L at STP, so 2 moles occupy 44.8 L."},
{q:"What is the mass of 11.2 L of oxygen at STP? (O = 16)",options:["16 g","32 g","8 g","22.4 g"],answer:0,explain:"11.2 L is 0.5 mole. Mass = 0.5 × 32 = 16 g."},
{q:"In N₂ + 3H₂ → 2NH₃, how many moles of hydrogen react with 2 moles of nitrogen?",options:["6","3","2","4"],answer:0,explain:"1 mol N₂ needs 3 mol H₂, so 2 mol N₂ needs 6 mol H₂."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();