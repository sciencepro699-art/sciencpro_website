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

/* Magnetic Effect of Electric Current — Class 10 Physics, Chapter 4 */
function fmt(n){return String(Math.round(n*100)/100)}
function arrow(x,x1,y1,x2,y2,col){x.strokeStyle=col;x.fillStyle=col;x.lineWidth=3;x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke();var a=Math.atan2(y2-y1,x2-x1);x.beginPath();x.moveTo(x2,y2);x.lineTo(x2-9*Math.cos(a-.4),y2-9*Math.sin(a-.4));x.lineTo(x2-9*Math.cos(a+.4),y2-9*Math.sin(a+.4));x.fill()}
/* ---- Lab 1: wire ---- */
var wI=3,wD=1;
function drawWR(){
  var c=$("wrCanvas"),f=fit(c,230),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,230);
  var cx=w/2,cy=115;
  for(var k=1;k<=3;k++){x.strokeStyle="rgba(148,163,184,"+(0.5-k*0.1)+")";x.lineWidth=1;x.beginPath();x.arc(cx,cy,k*32,0,6.283);x.stroke()}
  x.fillStyle="#fbbf24";x.beginPath();x.arc(cx,cy,10,0,6.283);x.fill();
  x.fillStyle="#0A1128";x.font="700 14px Inter,sans-serif";x.textAlign="center";x.textBaseline="middle";x.fillText(wD>0?"×":"•",cx,cy+1);
  for(var i=0;i<8;i++){var a=i*Math.PI/4+0.3,r=(i%2?64:96),px=cx+Math.cos(a)*r,py=cy+Math.sin(a)*r;
    var t=a+Math.PI/2*(wD>0?1:-1);var ang=wI===0?-Math.PI/2:t;
    var dx=Math.cos(ang)*12,dy=Math.sin(ang)*12;
    x.strokeStyle="#ef4444";x.lineWidth=5;x.beginPath();x.moveTo(px,py);x.lineTo(px+dx,py+dy);x.stroke();
    x.strokeStyle="#e2e8f0";x.beginPath();x.moveTo(px,py);x.lineTo(px-dx,py-dy);x.stroke()}
  x.textBaseline="alphabetic";x.fillStyle="#cbd5e1";x.font="600 11px Inter,sans-serif";x.fillText("Wire seen from above · red tip = north pole of needle",cx,222);
}
function upWR(){
  $("wrI").textContent=wI+" A";
  var r=[["Current: "+(wI?wI+" A "+(wD>0?"into the page (×)":"out of the page (•)"):"off")]];
  r.push(wI?["Field: "+(wD>0?"clockwise":"anticlockwise")+" circles around the wire","found"]:["No current, so no field: needles point north"]);
  r.push(["Closer to the wire and more current: a stronger field"]);
  rows($("wrResult"),r);drawWR();
}
$("wrIs").addEventListener("input",function(){wI=+this.value;upWR()});
$("wrDir").addEventListener("click",function(){wD=-wD;upWR()});
/* ---- Lab 2: solenoid ---- */
var sN=10,sI=2,sD=1,core=false;
function drawSL(){
  var c=$("slCanvas"),f=fit(c,200),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,200);
  var l=w*0.2,r=w*0.8,cy=100,h=36;
  if(core){x.fillStyle="#64748b";x.fillRect(l-6,cy-h+8,r-l+12,2*h-16)}
  x.lineWidth=3;x.strokeStyle="#fbbf24";
  for(var i=0;i<sN;i++){var px=l+(r-l)*i/(sN-1);x.beginPath();x.ellipse(px,cy,6,h,0,0,6.283);x.stroke()}
  /* poles: sD=1 => right end N */
  var rightN=sD>0,s=sI*(core?4:1)*sN/10;
  x.font="800 18px Inter,sans-serif";x.textAlign="center";
  x.fillStyle=rightN?"#3b82f6":"#ef4444";x.fillText(rightN?"S":"N",l-22,cy+6);
  x.fillStyle=rightN?"#ef4444":"#3b82f6";x.fillText(rightN?"N":"S",r+22,cy+6);
  /* field lines count */
  var k=Math.min(4,1+Math.floor(s/3));x.strokeStyle="rgba(125,211,252,.6)";x.lineWidth=1.5;
  for(var j=1;j<=k;j++){var d=h+j*14;x.beginPath();x.moveTo(l,cy-h);x.bezierCurveTo(l-30,cy-d-30,r+30,cy-d-30,r,cy-h);x.stroke();x.beginPath();x.moveTo(l,cy+h);x.bezierCurveTo(l-30,cy+d+30,r+30,cy+d+30,r,cy+h);x.stroke()}
  x.fillStyle="#cbd5e1";x.font="600 11px Inter,sans-serif";x.fillText("Strength: "+(s<3?"weak":s<8?"medium":"strong"),w/2,192);
}
function upSL(){
  $("slN").textContent=sN;$("slI").textContent=sI+" A";$("slCore").textContent="Soft iron core: "+(core?"ON":"OFF");
  var s=sI*(core?4:1)*sN/10;
  rows($("slResult"),[["Turns: "+sN+" · Current: "+sI+" A · Core: "+(core?"soft iron":"air")],["Right end: "+(sD>0?"north (current anticlockwise)":"south (current clockwise)"),"found"],["Magnetic strength: "+(s<3?"weak":s<8?"medium":"strong")]]);
  $("slNote").textContent="More turns per unit length, more current or a soft iron core make a stronger electromagnet.";
  drawSL();
}
$("slNs").addEventListener("input",function(){sN=+this.value;upSL()});
$("slIs").addEventListener("input",function(){sI=+this.value;upSL()});
$("slCore").addEventListener("click",function(){core=!core;upSL()});
$("slDir").addEventListener("click",function(){sD=-sD;upSL()});
/* ---- Lab 3: Fleming ---- */
var fN=true,fIn=true,fI=2;
function drawFL(){
  var c=$("flCanvas"),f=fit(c,230),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,230);
  var cx=w/2,cy=115;
  x.fillStyle="#ef4444";x.fillRect(cx-60,fN?10:190,120,26);x.fillStyle="#3b82f6";x.fillRect(cx-60,fN?190:10,120,26);
  x.fillStyle="#fff";x.font="800 14px Inter,sans-serif";x.textAlign="center";x.fillText(fN?"N":"S",cx,fN?28:208);x.fillText(fN?"S":"N",cx,fN?208:28);
  /* field arrow N->S */
  arrow(x,22,fN?50:176,22,fN?176:50,"#a3e635");x.fillStyle="#a3e635";x.font="700 11px Inter,sans-serif";x.textAlign="left";x.fillText("B",30,cy);x.textAlign="center";
  x.fillStyle="#fbbf24";x.beginPath();x.arc(cx,cy,11,0,6.283);x.fill();x.fillStyle="#0A1128";x.font="700 15px Inter,sans-serif";x.fillText(fIn?"×":"•",cx,cy+5);
  /* force: F = I x B. field down(N top)=-y... into page + field down => force left/right */
  var dir=(fN===fIn)?-1:1; /* F=IxB: field down + into page => left */
  var len=14*fI+16;arrow(x,cx+dir*14,cy,cx+dir*(14+len),cy,"#f43f5e");
  x.fillStyle="#f43f5e";x.textAlign="center";x.fillText("Force",cx+dir*(14+len/2),cy-12);
}
function dirF(){return (fN===fIn)?"to the left":"to the right"}
function upFL(){
  $("flField").textContent="Field: "+(fN?"North on top":"South on top");$("flCur").textContent="Current: "+(fIn?"into the page":"out of the page");$("flI").textContent=fI+" A";
  rows($("flResult"),[["First finger (field): points from N to S, "+(fN?"downwards":"upwards")],["Second finger (current): "+(fIn?"into the page":"out of the page")],["Thumb (force/motion): "+dirF(),"found"],["Force is bigger for more current or a stronger field. Reverse either one and the force reverses.","note"]]);
  drawFL();
}
$("flField").addEventListener("click",function(){fN=!fN;upFL()});
$("flCur").addEventListener("click",function(){fIn=!fIn;upFL()});
$("flIs").addEventListener("input",function(){fI=+this.value;upFL()});
upWR();upSL();upFL();
window.addEventListener("resize",function(){drawWR();drawSL();drawFL()});
SPQuiz.init({questions:[
{q:"Who discovered that a current produces a magnetic field?",options:["Oersted","Faraday","Joule","Newton"],answer:0,explain:"Oersted saw a compass needle deflect near a wire carrying current."},
{q:"What does the right-hand thumb rule give?",options:["Direction of the field around a current","Direction of force on a wire","Strength of a magnet","Resistance of a wire"],answer:0,explain:"The thumb is along the current and the curled fingers show the field direction."},
{q:"One end of a solenoid has the current flowing clockwise. That end is the:",options:["North pole","Neutral","South pole","Both poles"],answer:2,explain:"Clockwise current gives a south pole. Anticlockwise gives a north pole."},
{q:"Which change does NOT make a stronger electromagnet?",options:["More current","More turns per unit length","A soft iron core","Fewer turns per unit length"],answer:3,explain:"Fewer turns weakens it. The other three strengthen it."},
{q:"In Fleming's left-hand rule the thumb shows the:",options:["Current","Field","Direction of force (motion)","Voltage"],answer:2,explain:"First finger is the field, second finger is the current and the thumb is the motion."},
{q:"A wire in a magnetic field carries a current. When is the force largest?",options:["Wire parallel to the field","Wire at right angles to the field","Wire at 45°","No current"],answer:1,explain:"The force is greatest when the wire is perpendicular to the field. It is zero when parallel."},
{q:"What does an electric motor change?",options:["Mechanical to electrical","Electrical to mechanical","Heat to electrical","Sound to electrical"],answer:1,explain:"A motor changes electric energy into mechanical energy."},
{q:"What is the use of the split-ring commutator in a DC motor?",options:["To store charge","To reverse the current every half turn","To stop the coil","To increase the resistance"],answer:1,explain:"It reverses the current every half turn so the coil keeps turning in the same direction."},
{q:"Why is soft iron used as the core of an electromagnet?",options:["It is cheap","It loses magnetism when the current stops","It conducts heat","It is heavy"],answer:1,explain:"Soft iron is magnetised easily and demagnetised when the current is switched off."},
{q:"In a moving-coil loudspeaker, what moves the cone?",options:["A coil carrying a varying current in a magnetic field","A heated wire","A battery","A fuse"],answer:0,explain:"The varying current gives a varying force, so the coil and cone vibrate and make sound."}
]});

})();