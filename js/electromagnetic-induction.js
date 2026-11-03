(function(){"use strict";
/* Science Pro Physics — shared helpers (quiz + canvas) kept inside each chapter file */
var SPQuiz={init:function(o){var shell=document.getElementById("quizShell");if(!shell)return;var qs=o.questions,cur=0,score=0,done=false;
var back="subject.html?class=10&subject=physics";var msgs=["Nice start. Play with the lab above and try again.","Good work. One more go and you've got it.","Excellent!"];
function ask(){done=false;var q=qs[cur],n=qs.length;shell.innerHTML='<div class="game-shell-header"><span class="score-pill">Question '+(cur+1)+' / '+n+'</span><div class="progress-track"><div class="progress-fill" style="width:'+Math.round(cur/n*100)+'%"></div></div><span class="score-pill">Score: '+score+'</span></div><div class="quiz-question"></div><div class="quiz-options"></div><div class="quiz-feedback"></div><div class="quiz-next"></div>';
shell.querySelector(".quiz-question").textContent=q.q;var w=shell.querySelector(".quiz-options");
q.options.forEach(function(t,i){var b=document.createElement("button");b.className="quiz-option";b.textContent=t;b.addEventListener("click",function(){pick(i)});w.appendChild(b)})}
function pick(i){if(done)return;done=true;var q=qs[cur],bs=shell.querySelectorAll(".quiz-option");bs.forEach(function(b){b.disabled=true});
if(i===q.answer){score++;bs[i].classList.add("correct")}else{bs[i].classList.add("wrong");bs[q.answer].classList.add("correct")}
var fb=shell.querySelector(".quiz-feedback");fb.textContent=q.explain;fb.classList.add("show");var last=cur===qs.length-1,nb=document.createElement("button");
nb.className="btn btn-primary";nb.textContent=last?"See results":"Next question →";nb.addEventListener("click",function(){cur++;if(cur>=qs.length)end();else ask()});shell.querySelector(".quiz-next").appendChild(nb)}
function end(){var n=qs.length,p=Math.round(score/n*100),v=p>=80?msgs[2]:p>=50?msgs[1]:msgs[0];
shell.innerHTML='<div class="result-screen"><span class="eyebrow" style="justify-content:center;">RESULTS</span><div class="big-score">'+score+' / '+n+'</div><p>'+v+'</p><div class="result-actions"><button class="btn btn-primary" id="retryBtn">Try again</button><a class="btn btn-dark" href="'+back+'">Back to Physics chapters</a></div></div>';
document.getElementById("retryBtn").addEventListener("click",function(){cur=0;score=0;ask()})}ask()}};
function $(id){return document.getElementById(id)}
function fit(c,h){var w=c.clientWidth||320;c.width=w*2;c.height=h*2;var x=c.getContext("2d");x.setTransform(2,0,0,2,0,0);return{x:x,w:w,h:h}}
function rows(el,arr){el.innerHTML=arr.map(function(l){return'<div class="line'+(l[1]?" "+l[1]:"")+'">'+l[0]+'</div>'}).join("")}

/* Electromagnetic Induction in Daily Life — Class 10 Physics, Chapter 6 */
function g(n){return Math.round(n*100)/100}
function fmt(n){return String(Math.round(n*100)/100)}
/* ---------- Lab 1: magnet and coil ---------- */
var N=200,B=1,flip=1,mx=60,prevPhi=0,needle=0,drag=false,motion=null,loopOn=false,lastTxt="";
function phi(m,w){var cx=w*0.66;return Math.exp(-Math.pow((m-cx)/(w*0.2),2))}
function drawEM(){
  var c=$("emCanvas"),f=fit(c,270),x=f.x,w=f.w;x.clearRect(0,0,w,270);x.fillStyle="#0A1128";x.fillRect(0,0,w,270);
  var cx=w*0.66,cy=96,gx=w/2,gy=262,gr=Math.min(78,w/2-20);
  /* coil */
  var loops=Math.min(14,Math.round(N/30)),span=Math.min(120,w*0.3);
  x.lineWidth=3;
  for(var i=0;i<loops;i++){var lx=cx-span/2+span*i/Math.max(loops-1,1);x.strokeStyle="#fbbf24";x.beginPath();x.ellipse(lx,cy,9,32,0,0,6.283);x.stroke()}
  /* wires to galvanometer */
  x.strokeStyle="#fbbf24";x.lineWidth=2;x.beginPath();x.moveTo(cx-span/2,cy+32);x.lineTo(cx-span/2,200);x.lineTo(gx-gr,200);x.lineTo(gx-gr,gy);x.moveTo(cx+span/2,cy+32);x.lineTo(cx+span/2,200);x.lineTo(gx+gr,200);x.lineTo(gx+gr,gy);x.stroke();
  /* galvanometer */
  x.fillStyle="#111a3a";x.beginPath();x.arc(gx,gy,gr,Math.PI,0);x.fill();x.strokeStyle="#64748b";x.lineWidth=2;x.stroke();
  x.fillStyle="#94a3b8";x.font="600 10px Inter,sans-serif";x.textAlign="center";x.fillText("0",gx,gy-gr+14);x.fillText("−",gx-gr*0.7,gy-gr*0.45);x.fillText("+",gx+gr*0.7,gy-gr*0.45);
  var a=-Math.PI/2+needle*1.1;x.strokeStyle="#f43f5e";x.lineWidth=3;x.beginPath();x.moveTo(gx,gy);x.lineTo(gx+Math.cos(a)*(gr-8),gy+Math.sin(a)*(gr-8));x.stroke();
  x.fillStyle="#cbd5e1";x.fillText("Galvanometer",gx,gy-gr-6);
  /* magnet */
  var mw=76,mh=26;x.fillStyle=flip>0?"#ef4444":"#3b82f6";x.fillRect(mx-mw/2,cy-mh/2,mw/2,mh);x.fillStyle=flip>0?"#3b82f6":"#ef4444";x.fillRect(mx,cy-mh/2,mw/2,mh);
  x.fillStyle="#fff";x.font="700 12px Inter,sans-serif";x.textBaseline="middle";x.fillText(flip>0?"N":"S",mx-mw/4,cy);x.fillText(flip>0?"S":"N",mx+mw/4,cy);x.textBaseline="alphabetic";
  x.fillStyle="#94a3b8";x.font="600 11px Inter,sans-serif";x.fillText(drag?"":"drag me",mx,cy-mh/2-8);
}
function loopEM(){
  var c=$("emCanvas"),w=c.clientWidth||320;
  if(motion){motion.t++;var m=motion;
    if(m.type==="in"){mx=60+(w*0.66-60)*Math.min(1,m.t/40);if(m.t>=40)motion=null}
    else if(m.type==="out"){mx=w*0.66-(w*0.66-60)*Math.min(1,m.t/40);if(m.t>=40)motion=null}
    else{mx=w*0.5+Math.sin(m.t/9)*w*0.3;if(m.t>200)motion=null}}
  var p=phi(mx,w),d=p-prevPhi;prevPhi=p;
  var tgt=Math.max(-1,Math.min(1,d*(N/200)*B*12*flip));
  needle+=(tgt-needle)*0.3;
  var moving=Math.abs(d)>0.002;
  var cur=Math.abs(needle);
  drawEM();
  if(motion||drag||cur>0.01||moving)requestAnimationFrame(loopEM);else{loopOn=false;needle=0;drawEM()}
}
function kick(){if(!loopOn){loopOn=true;requestAnimationFrame(loopEM)}}
var cv=$("emCanvas");
function px(e){var r=cv.getBoundingClientRect();return Math.max(34,Math.min(r.width-34,e.clientX-r.left))}
cv.addEventListener("pointerdown",function(e){drag=true;motion=null;try{cv.setPointerCapture(e.pointerId)}catch(_){}mx=px(e);cv.style.cursor="grabbing";kick()});
cv.addEventListener("pointermove",function(e){if(drag){mx=px(e);kick()}});
function up(){drag=false;cv.style.cursor="grab";kick()}
cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
$("emNs").addEventListener("input",function(){N=+this.value;$("emN").textContent=N;kick()});
$("emBs").addEventListener("input",function(){B=+this.value;$("emB").textContent=B+"×";kick()});
$("emIn").addEventListener("click",function(){mx=60;prevPhi=phi(mx,cv.clientWidth||320);motion={type:"in",t:0};kick()});
$("emOut").addEventListener("click",function(){var w=cv.clientWidth||320;mx=w*0.66;prevPhi=phi(mx,w);motion={type:"out",t:0};kick()});
$("emShake").addEventListener("click",function(){motion={type:"shake",t:0};kick()});
$("emFlip").addEventListener("click",function(){flip=-flip;kick();drawEM()});
/* ---------- Lab 2: transformer ---------- */
var Np=1000,Ns=50,Vp=240,P=100;
function drawTR(){
  var c=$("trCanvas"),f=fit(c,210),x=f.x,w=f.w;x.clearRect(0,0,w,210);x.fillStyle="#0A1128";x.fillRect(0,0,w,210);
  var l=w*0.22,r=w*0.78,t=48,b=170;
  x.strokeStyle="#64748b";x.lineWidth=16;x.strokeRect(l,t,r-l,b-t);
  function coil(cx,n,col){var k=Math.max(3,Math.min(18,Math.round(n/60))),h=100,top=(t+b)/2-h/2;x.strokeStyle=col;x.lineWidth=4;for(var i=0;i<k;i++){var y=top+h*i/(k-1);x.beginPath();x.moveTo(cx-17,y+4);x.lineTo(cx+17,y-4);x.stroke()}}
  coil(l,Np,"#fb923c");coil(r,Ns,"#38bdf8");
  x.font="700 12px Inter,sans-serif";x.textAlign="center";x.fillStyle="#fb923c";x.fillText("Primary",l,24);x.fillText("Np = "+Np,l,40);x.fillStyle="#38bdf8";x.fillText("Secondary",r,24);x.fillText("Ns = "+Ns,r,40);
  var Vs=Vp*Ns/Np,Ip=P/Vp,Is=P/Vs;
  x.fillStyle="#fb923c";x.fillText(Vp+" V · "+fmt(Ip)+" A",l,198);x.fillStyle="#38bdf8";x.fillText(fmt(Vs)+" V · "+fmt(Is)+" A",r,198);
  x.fillStyle="#cbd5e1";x.font="600 11px Inter,sans-serif";x.fillText("iron core",w/2,(t+b)/2+4);
}
function upTR(){
  $("trNp").textContent=Np;$("trNs").textContent=Ns;$("trVp").textContent=Vp+" V";$("trP").textContent=P+" W";
  var Vs=Vp*Ns/Np,Ip=P/Vp,Is=P/Vs,kind=Ns>Np?"Step-up transformer (Ns > Np)":Ns<Np?"Step-down transformer (Ns < Np)":"Ns = Np: the voltage does not change";
  rows($("trResult"),[[kind,"found"],["Vs ÷ Vp = Ns ÷ Np = "+Ns+" ÷ "+Np+" = "+fmt(Ns/Np)],["Secondary voltage: Vs = "+Vp+" × "+fmt(Ns/Np)+" = "+fmt(Vs)+" V","found"],
    ["Primary current: Ip = P ÷ Vp = "+P+" ÷ "+Vp+" = "+fmt(Ip)+" A"],["Secondary current: Is = P ÷ Vs = "+fmt(Is)+" A"],["Power in = Vp × Ip = "+fmt(Vp*Ip)+" W · Power out = Vs × Is = "+fmt(Vs*Is)+" W","note"]]);
  $("trNote").textContent=Ns>Np?"The voltage goes up, so the current comes down. The power does not change.":Ns<Np?"The voltage goes down, so the current goes up. The power does not change.":"Same voltage and same current.";
  drawTR();
}
[["trNps","Np"],["trNss","Ns"],["trVps","Vp"],["trPs","P"]].forEach(function(p){$(p[0]).addEventListener("input",function(){var v=+this.value;if(p[1]==="Np")Np=v;if(p[1]==="Ns")Ns=v;if(p[1]==="Vp")Vp=v;if(p[1]==="P")P=v;upTR()})});
Array.prototype.forEach.call(document.querySelectorAll("[data-np]"),function(b){b.addEventListener("click",function(){Np=+b.dataset.np;Ns=+b.dataset.ns;Vp=+b.dataset.vp;$("trNps").value=Np;$("trNss").value=Ns;$("trVps").value=Vp;upTR()})});
/* ---------- Lab 3: transmission ---------- */
var TV=11;
function upTX(){
  $("txV").textContent=TV+" kV";
  var Pw=100000,R=5,V=TV*1000,I=Pw/V,loss=I*I*R,pc=Math.min(100,loss/Pw*100);
  rows($("txResult"),[["Power sent: P = 100 kW · Line resistance R = 5 Ω"],["Current: I = P ÷ V = 100000 ÷ "+V+" = "+fmt(I)+" A"],["Heat lost in the line: I²R = "+fmt(I)+"² × 5 = "+fmt(loss)+" W","found"],["Lost: "+(pc>=100?"all of it":fmt(pc)+" % of the power"),"found"]]);
  $("txBar").style.width=Math.max(1,pc)+"%";
  $("txNote").textContent=pc>=100?"At this voltage the current is so large that all the power is lost as heat.":pc>10?"A lot of the power is wasted as heat. Raise the voltage with a step-up transformer.":"Higher voltage, smaller current, much less heat loss. This is why power stations use step-up transformers.";
}
$("txVs").addEventListener("input",function(){TV=+this.value;upTX()});
Array.prototype.forEach.call(document.querySelectorAll("[data-v]"),function(b){b.addEventListener("click",function(){TV=+b.dataset.v;$("txVs").value=TV;upTX()})});
prevPhi=phi(mx,$("emCanvas").clientWidth||320);
loopEM();upTR();upTX();
window.addEventListener("resize",function(){drawEM();drawTR()});
/* ---------- Quiz ---------- */
SPQuiz.init({questions:[
{q:"What is the working principle of a generator?",options:["Electromagnetic induction","Motor principle","Heating effect of current","Mutual induction only"],answer:0,explain:"A generator turns mechanical energy into electric energy using electromagnetic induction."},
{q:"A magnet is held still inside a coil. What does the galvanometer show?",options:["A large deflection","Deflection to the left","No deflection","Deflection to the right"],answer:2,explain:"The flux through the coil is not changing, so no emf is induced."},
{q:"Which change does NOT increase the induced emf?",options:["Using a stronger magnet","Moving the magnet faster","Using more turns in the coil","Using fewer turns in the coil"],answer:3,explain:"Induced emf increases with a stronger magnet, faster motion and more turns."},
{q:"What type of current is induced in the armature of a DC generator?",options:["DC","AC","A constant current","None"],answer:1,explain:"The armature always gives AC. The split ring commutator turns it into DC in the external circuit."},
{q:"At what voltage is electricity generated in power stations in India, and at what voltage is it supplied to homes?",options:["230 V and 11 kV","11 V and 230 V","11 kV and 230 V","110 V and 230 V"],answer:2,explain:"Power stations generate at 11 kV. It is stepped up for transmission and stepped down to 230 V for homes."},
{q:"A transformer has 600 turns in the primary and 1800 in the secondary. The secondary voltage is 450 V. What is the primary voltage?",options:["150 V","1350 V","450 V","3 V"],answer:0,explain:"Vs/Vp = Ns/Np, so Vp = Vs × Np/Ns = 450 × 600/1800 = 150 V. It is a step-up transformer."},
{q:"0.1 A flows in the primary of a transformer and 1 A flows in the secondary. If the primary voltage is 1000 V, what is the secondary voltage?",options:["10000 V","100 V","1000 V","10 V"],answer:1,explain:"Primary power = 1000 × 0.1 = 100 W. Secondary power is also 100 W, so Vs = 100 ÷ 1 = 100 V. It is a step-down transformer."},
{q:"Why is electricity transmitted at a very high voltage?",options:["To make the wires thicker","To increase the current","To reduce the current and so the heat loss I²R","To increase the resistance"],answer:2,explain:"At the same power, a higher voltage means a smaller current. The heat loss I²R in the wires falls a lot."},
{q:"Which wire colours are used for phase, neutral and earth?",options:["Red, black, green","Black, red, green","Green, black, red","Red, green, black"],answer:0,explain:"Red is the phase (live) wire, black is the neutral wire and green is the earth wire."},
{q:"What does an ELCB (or RCCB) do?",options:["It melts when the current is too high","It cuts the supply when current leaks and prevents shock","It steps down the voltage","It measures the energy used"],answer:1,explain:"An ELCB or RCCB disconnects the circuit automatically when there is a current leak, so people do not get an electric shock."}
]});

})();