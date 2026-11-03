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

/* Electric Energy: Consumption and Conservation — Class 10 Physics, Chapter 5 */
function fmt(n,d){return String(Math.round(n*Math.pow(10,d||0))/Math.pow(10,d||0))}
function g(n){return Math.round(n*100)/100}
/* ---------- Lab 1: Joule heating ---------- */
var jV=230,jR=50,jT=10;
function drawJ(){
  var c=$("jCanvas"),f=fit(c,230),x=f.x,w=f.w;
  var I=jV/jR,P=jV*jV/jR,H=P*jT*60,s=Math.min(1,Math.sqrt(P/5290));
  x.clearRect(0,0,w,230);
  x.fillStyle="#0A1128";x.fillRect(0,0,w,230);
  /* coil */
  var cx0=w*0.12,cx1=w*0.88,cy=62,n=14,amp=18;
  var r=Math.round(80+175*s),gg=Math.round(80+(s>.5?(s-.5)*2*160:0)-(s<.5?0:0)),b=Math.round(90-60*s);
  var col="rgb("+r+","+Math.round(70+s*60)+","+b+")";
  x.strokeStyle="#8a93a8";x.lineWidth=3;x.beginPath();x.moveTo(8,cy);x.lineTo(cx0,cy);x.moveTo(cx1,cy);x.lineTo(w-8,cy);x.stroke();
  x.save();x.shadowColor="rgba(255,120,30,"+(0.9*s)+")";x.shadowBlur=30*s;x.strokeStyle=col;x.lineWidth=5;x.lineJoin="round";x.beginPath();
  for(var i=0;i<=n*2;i++){var px=cx0+(cx1-cx0)*i/(n*2),py=cy+(i%2?-amp:amp);if(i)x.lineTo(px,py);else x.moveTo(px,cy+amp)}
  x.stroke();x.restore();
  /* heat waves */
  var k=Math.round(s*6);x.strokeStyle="rgba(255,160,80,.55)";x.lineWidth=2;
  for(i=0;i<k;i++){var hx=cx0+(cx1-cx0)*(i+.5)/Math.max(k,1);x.beginPath();x.moveTo(hx,cy-26);x.bezierCurveTo(hx-8,cy-36,hx+8,cy-44,hx,cy-54);x.stroke()}
  /* bars */
  function bar(y,label,val,max,color,txt){var bw=w-24,bh=22;x.fillStyle="rgba(255,255,255,.08)";x.fillRect(12,y,bw,bh);
    x.fillStyle=color;x.fillRect(12,y,Math.max(3,bw*Math.min(1,val/max)),bh);
    x.fillStyle="#fff";x.font="600 12px Inter,sans-serif";x.textBaseline="middle";x.textAlign="left";x.fillText(label+" = "+txt,20,y+bh/2)}
  bar(112,"Current I",I,23,"#38bdf8",g(I)+" A");
  bar(146,"Power P",P,5290,"#fb923c",fmt(P)+" W");
  bar(180,"Heat H",H,5290*1800,"#f43f5e",fmt(H)+" J");
}
function upJ(){
  $("jV").textContent=jV+" V";$("jR").textContent=jR+" Ω";$("jT").textContent=jT+" min";
  var I=jV/jR,P=jV*jV/jR,t=jT*60,H=P*t,kwh=P/1000*jT/60;
  rows($("jResult"),[
    ["Current: I = V ÷ R = "+jV+" ÷ "+jR+" = "+g(I)+" A"],
    ["Power: P = V × I = "+jV+" × "+g(I)+" = "+fmt(P)+" W"],
    ["Heat in "+jT+" min: H = P × t = "+fmt(P)+" × "+t+" = "+fmt(H)+" J","found"],
    ["Energy: "+g(P/1000)+" kW × "+g(jT/60)+" h = "+(Math.round(kwh*1000)/1000)+" unit (kWh)","note"]]);
  var h2=(jV*jV/(jR/2))*t;
  $("jNote").textContent="If the resistance were halved ("+jR/2+" Ω), the current would double to "+g(2*I)+" A and the heat in the same time would be "+fmt(h2)+" J, which is 2 times as much.";
  drawJ();
}
$("jVs").addEventListener("input",function(){jV=+this.value;upJ()});
$("jRs").addEventListener("input",function(){jR=+this.value;upJ()});
$("jTs").addEventListener("input",function(){jT=+this.value;upJ()});
Array.prototype.forEach.call(document.querySelectorAll("[data-v]"),function(b){b.addEventListener("click",function(){jV=+b.dataset.v;jR=+b.dataset.r;$("jVs").value=jV;$("jRs").value=jR;upJ()})});
/* ---------- Lab 2: bill ---------- */
var BASE=[["LED bulb",9,5,5],["Ceiling fan",60,3,8],["Television",100,1,4],["Refrigerator",150,1,10],["Iron box",1000,1,0.5],["Mixie",500,1,0.25],["Water heater",1500,1,0.5]];
var A=[];
function reset(fan){A=BASE.map(function(r){return{n:r[0],w:r[1],c:r[2],h:r[3]}});if(fan)A[1].w=24;build()}
function bill(u){
  var sl=[[50,3.35,50],[100,4.25,85],[150,5.35,105],[200,7.2,140],[250,8.5,160]],i;
  if(u<=0)return{e:0,f:0};
  if(u<=250){var prev=0,e=0,fx=0;for(i=0;i<sl.length;i++){if(u>prev){e+=(Math.min(u,sl[i][0])-prev)*sl[i][1];fx=sl[i][2]}prev=sl[i][0]}return{e:e,f:fx}}
  var bd=[[300,6.75,220],[350,7.6,240],[400,7.95,260],[500,8.25,286],[1e9,9.2,310]];
  for(i=0;i<bd.length;i++)if(u<=bd[i][0])return{e:u*bd[i][1],f:bd[i][2]};
}
function build(){
  var h="";
  A.forEach(function(a,i){
    h+='<div class="app-row" style="display:flex;flex-wrap:wrap;gap:6px 12px;align-items:flex-end;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--c-cream-dim)"><div style="flex-basis:100%;font-weight:600">'+a.n+' <span style="font-family:var(--f-mono);font-weight:500;color:var(--c-ink-soft);font-size:.8rem">'+a.w+' W</span></div>'+
    '<div><div style="font-size:.7rem;color:var(--c-ink-soft);font-family:var(--f-mono)">NUMBER</div><div class="stepper"><button type="button" data-i="'+i+'" data-k="c" data-d="-1" aria-label="Fewer '+a.n+'">−</button><output id="c'+i+'" aria-label="'+a.n+' number">'+a.c+'</output><button type="button" data-i="'+i+'" data-k="c" data-d="1" aria-label="More '+a.n+'">+</button></div></div>'+
    '<div><div style="font-size:.7rem;color:var(--c-ink-soft);font-family:var(--f-mono)">HOURS A DAY</div><div class="stepper"><button type="button" data-i="'+i+'" data-k="h" data-d="-.5" aria-label="Fewer hours for '+a.n+'">−</button><output id="h'+i+'" aria-label="'+a.n+' hours per day">'+a.h+'</output><button type="button" data-i="'+i+'" data-k="h" data-d=".5" aria-label="More hours for '+a.n+'">+</button></div></div></div>';
  });
  $("apps").innerHTML=h;
  Array.prototype.forEach.call($("apps").querySelectorAll("button"),function(b){b.addEventListener("click",function(){
    var a=A[+b.dataset.i],k=b.dataset.k,d=+b.dataset.d;a[k]=Math.max(0,Math.min(k==="c"?20:24,Math.round((a[k]+d)*100)/100));
    $("c"+b.dataset.i).textContent=a.c;$("h"+b.dataset.i).textContent=a.h;calc()})});
  calc();
}
function calc(){
  var day=0,top=null,topv=0;
  A.forEach(function(a){var e=a.w*a.c*a.h/1000;day+=e;if(e>topv){topv=e;top=a}});
  var mo=day*30,b=bill(mo),tot=b.e+b.f;
  rows($("bResult"),[
    ["Energy per day: Σ (watt × number × hours) ÷ 1000 = "+g(day)+" units"],
    ["Energy per month (30 days): "+g(day)+" × 30 = "+g(mo)+" units","found"],
    ["Energy charge: ₹"+fmt(b.e,0)+"   Fixed charge: ₹"+fmt(b.f,0)],
    ["Estimated bill: ₹"+fmt(tot,0)+" a month","found"]]);
  $("bNote").textContent=top&&topv>0?"Biggest user: "+top.n+" — "+g(topv*30)+" units a month ("+Math.round(topv/day*100)+"% of the total). A short-running heavy appliance can use more than many small ones.":"Switch on some appliances to see the bill.";
}
$("aTypical").addEventListener("click",function(){reset(false)});
$("aSaver").addEventListener("click",function(){reset(true)});
reset(false);
upJ();
window.addEventListener("resize",drawJ);
$("bNote").insertAdjacentHTML("afterend",'<p style="font-size:.78rem;color:var(--c-ink-soft);margin:10px 0 0">The bill uses the Kerala domestic tariff table in your textbook (single phase). Tariffs change, so treat it as an estimate.</p>');
/* ---------- Quiz ---------- */
SPQuiz.init({questions:[
{q:"A current of 2 A flows through a 100 Ω resistor for 10 minutes. How much heat is produced?",options:["2000 J","20000 J","240000 J","120000 J"],answer:2,explain:"H = I²Rt = 2 × 2 × 100 × 600 = 240000 J. Remember to change minutes to seconds."},
{q:"A heater at 230 V draws 2 A. What is its resistance and power?",options:["115 Ω and 460 W","460 Ω and 115 W","115 Ω and 230 W","230 Ω and 460 W"],answer:0,explain:"R = V ÷ I = 230 ÷ 2 = 115 Ω. P = VI = 230 × 2 = 460 W."},
{q:"The current through a resistor is doubled. The resistance and time stay the same. What happens to the heat?",options:["It doubles","It becomes 4 times","It becomes half","It stays the same"],answer:1,explain:"H = I²Rt. Heat depends on the square of the current, so doubling I gives 4 times the heat."},
{q:"How many joules are there in one unit (1 kWh) of electric energy?",options:["1000 J","3600 J","36 × 10⁴ J","3.6 × 10⁶ J"],answer:3,explain:"1 kWh = 1000 W × 3600 s = 3600000 J = 3.6 × 10⁶ J."},
{q:"A 500 W iron works for 1 hour, two 40 W fans for 8 hours and five 12 W LED bulbs for 10 hours. What is the energy used in units?",options:["1.74","17.4","0.174","2.4"],answer:0,explain:"Iron: 0.5 unit. Fans: 2 × 40 × 8 = 640 Wh = 0.64 unit. LEDs: 5 × 12 × 10 = 600 Wh = 0.6 unit. Total = 1.74 units."},
{q:"Which is a good property for the material of a heating element?",options:["Low melting point and low resistivity","High resistivity and high melting point","High resistivity and low melting point","Low oxidation resistance"],answer:1,explain:"A heating element needs a high resistivity, a high melting point and good oxidation resistance. Nichrome has all these."},
{q:"An appliance is marked 800 W, 240 V. At what voltage will its power be 200 W?",options:["60 V","120 V","160 V","180 V"],answer:1,explain:"P = V²/R, so the power is proportional to V². To get one quarter of the power, the voltage must be half: 120 V."},
{q:"A 40 W bulb and a 60 W bulb (both for 230 V) are connected in series to 230 V. Which one glows brighter?",options:["The 60 W bulb","The 40 W bulb","Both equally","Neither glows"],answer:1,explain:"The 40 W bulb has the larger resistance. In series the same current flows, and H = I²R, so more heat and light come from the larger resistance."},
{q:"How many units does a 60 W bulb use if it works for 5 hours?",options:["0.3","3","30","0.03"],answer:0,explain:"Energy = 60 W × 5 h = 300 Wh = 0.3 kWh = 0.3 unit."},
{q:"At a fixed voltage the resistance of a heater is halved. What happens to the heat produced in the same time?",options:["It becomes half","It becomes 4 times","It doubles","It does not change"],answer:2,explain:"H = V²t/R. If V and t stay the same and R is halved, the heat doubles."}
]});

})();