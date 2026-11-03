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

/* Colours and Vision — Class 10 Physics, Chapter 3 */
var NAMES=["Black","Red","Green","Yellow","Blue","Magenta","Cyan","White"]; /* index = r + 2g + 4b with r=1,g=2,b=4: 0..7 */
function nm(r,g,b){return NAMES[(r?1:0)+(g?2:0)+(b?4:0)]}
function nmc(i){return NAMES[i]}
var HEX={Black:"#000",Red:"#ff2a2a",Green:"#22e05a",Yellow:"#ffe92a",Blue:"#3a4cff",Magenta:"#ff2aff",Cyan:"#22e5ff",White:"#fff"};
/* ---- Lab 1 ---- */
var on={r:true,g:true,b:true};
function drawMX(){
  var c=$("mxCanvas"),f=fit(c,230),x=f.x,w=f.w;x.fillStyle="#000";x.fillRect(0,0,w,230);
  var cx=w/2,R=62,P=[[cx-34,100,"r","#f00"],[cx+34,100,"g","#0f0"],[cx,158,"b","#00f"]];
  x.globalCompositeOperation="lighter";
  P.forEach(function(p){if(on[p[2]]){x.fillStyle=p[3];x.beginPath();x.arc(p[0],p[1],R,0,6.283);x.fill()}});
  x.globalCompositeOperation="source-over";
}
function upMX(){
  [["r","mxR","Red"],["g","mxG","Green"],["b","mxB","Blue"]].forEach(function(a){$(a[1]).textContent=a[2]+": "+(on[a[0]]?"ON":"OFF");$(a[1]).setAttribute("aria-pressed",on[a[0]])});
  var r=on.r,g=on.g,b=on.b,n=r+g+b,res=nm(r,g,b);
  rows($("mxResult"),[["Lights on: "+(n?[r&&"red",g&&"green",b&&"blue"].filter(Boolean).join(" + "):"none")],["Colour seen where they overlap: "+(n?res.toLowerCase():"dark (black)"),"found"]]);
  $("mxNote").textContent=n===3?"Red + green + blue = white light.":n===2?"Two primary colours of light make a secondary colour.":n===1?"A single primary colour of light.":"No light, so nothing is seen.";
  drawMX();
}
["r","g","b"].forEach(function(k){$("mx"+k.toUpperCase()).addEventListener("click",function(){on[k]=!on[k];upMX()})});
/* ---- Lab 2 ---- */
var OBJ=[0,1,2,3,4,5,6,7],LIG=["White","Red","Green","Blue","Yellow","Cyan","Magenta"];
var LC={White:[1,1,1],Red:[1,0,0],Green:[0,1,0],Blue:[0,0,1],Yellow:[1,1,0],Cyan:[0,1,1],Magenta:[1,0,1]};
function bits(i){return [i&1?1:0,i&2?1:0,i&4?1:0]}
var oi=1,li=0;
function seen(){var o=bits(oi),l=LC[LIG[li]];return nm(o[0]&&l[0],o[1]&&l[1],o[2]&&l[2])}
function drawOB(){
  var c=$("obCanvas"),f=fit(c,190),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,190);
  var L=LIG[li],s=seen();
  var g=x.createRadialGradient(60,40,4,60,40,200);g.addColorStop(0,HEX[L]);g.addColorStop(1,"rgba(0,0,0,0)");
  x.globalAlpha=.55;x.fillStyle=g;x.beginPath();x.moveTo(60,40);x.lineTo(w-20,170);x.lineTo(w-20,30);x.fill();x.globalAlpha=1;
  x.fillStyle=HEX[L];x.beginPath();x.arc(60,40,14,0,6.283);x.fill();x.fillStyle="#cbd5e1";x.font="600 11px Inter,sans-serif";x.textAlign="center";x.fillText(L+" light",60,72);
  var cx=w*0.68,cy=105;x.fillStyle=HEX[s];x.strokeStyle="#64748b";x.lineWidth=2;x.beginPath();x.arc(cx,cy,40,0,6.283);x.fill();x.stroke();
  x.fillStyle=s==="Black"?"#94a3b8":"#000";x.font="700 12px Inter,sans-serif";x.fillText(s,cx,cy+4);
  x.fillStyle="#cbd5e1";x.font="600 11px Inter,sans-serif";x.fillText("Object looks "+s.toLowerCase(),cx,172);
}
function upOB(){
  var on_=nmc(oi),L=LIG[li],s=seen();
  $("obOn").textContent=on_;$("obLn").textContent=L;
  rows($("obResult"),[["Object colour: "+on_.toLowerCase()],["Light: "+L.toLowerCase()],["It looks: "+s.toLowerCase(),"found"]]);
  $("obNote").textContent=s==="Black"&&on_!=="Black"?"The object absorbs this light, so no light comes back and it looks black.":on_==="White"?"A white object reflects every colour, so it takes the colour of the light.":on_===s?"The object reflects this colour, so it looks its own colour.":"It reflects only the colours it has that are present in the light.";
  drawOB();
}
$("obOs").addEventListener("input",function(){oi=+this.value;upOB()});
$("obLs").addEventListener("input",function(){li=+this.value;upOB()});
/* ---- Lab 3: prism ---- */
var pa=60;
var SPEC=[["Red","#ff2a2a",0],["Orange","#ff9a2a",.18],["Yellow","#ffe92a",.36],["Green","#22e05a",.54],["Blue","#3a6bff",.72],["Indigo","#5a2aff",.86],["Violet","#a02aff",1]];
function drawPZ(){
  var c=$("pzCanvas"),f=fit(c,230),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,230);
  var cx=w*0.42,cy=125,h=110,half=h/2*Math.tan(pa*Math.PI/360)*1.6;half=Math.max(30,Math.min(half,70));
  x.fillStyle="rgba(180,220,255,.25)";x.strokeStyle="#9bd";x.lineWidth=2;x.beginPath();x.moveTo(cx,cy-h/2);x.lineTo(cx+half,cy+h/2);x.lineTo(cx-half,cy+h/2);x.closePath();x.fill();x.stroke();
  x.strokeStyle="#fff";x.lineWidth=3;x.beginPath();x.moveTo(10,cy+20);x.lineTo(cx-8,cy+2);x.stroke();
  var spread=pa*0.9,ex=cx+half*0.5,ey=cy+2;
  SPEC.forEach(function(s){var ang=(18+s[2]*spread*0.5)*Math.PI/180;x.strokeStyle=s[1];x.lineWidth=3;x.beginPath();x.moveTo(ex,ey);x.lineTo(w-8,ey+Math.tan(ang)*(w-8-ex));x.stroke()});
  x.fillStyle="#cbd5e1";x.font="600 11px Inter,sans-serif";x.textAlign="right";x.fillText("Violet (bends most)",w-10,222);x.fillText("Red (bends least)",w-10,18);
  x.textAlign="left";x.fillText("White light",10,cy+42);
}
function upPZ(){
  $("pzA").textContent=pa+"°";
  rows($("pzResult"),[["Bends least: red (longest wavelength)","found"],["Bends most: violet (shortest wavelength)","found"],["Order: V I B G Y O R"],["Bigger prism angle: wider spread of colours","note"]]);
  drawPZ();
}
$("pzAs").addEventListener("input",function(){pa=+this.value;upPZ()});
/* ---- Lab 4: eye ---- */
var ET=["Normal","Myopia","Hypermetropia"],et=0,near=false,lens=0; /* lens 0 none,1 concave,2 convex */
function offset(){
  var b=0;
  if(et===1&&!near)b=-1;if(et===2&&near)b=1;
  var c=lens===1?1:lens===2?-1:0;
  return Math.max(-2,Math.min(2,b+c));
}
function drawEY(){
  var c=$("eyCanvas"),f=fit(c,220),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,220);
  var ex=w*0.62,cy=110,rx=Math.min(95,w*0.3),ry=70,ret=ex+rx-6;
  x.fillStyle="#f1f5f9";x.beginPath();x.ellipse(ex,cy,rx,ry,0,0,6.283);x.fill();
  x.strokeStyle="#ef4444";x.lineWidth=4;x.beginPath();x.ellipse(ex,cy,rx,ry,0,-1.1,1.1);x.stroke();
  x.fillStyle="#334155";x.font="600 10px Inter,sans-serif";x.textAlign="center";x.fillText("retina",ret-10,cy-ry-6);
  var lx=ex-rx+14;x.fillStyle="rgba(125,211,252,.7)";x.beginPath();x.ellipse(lx,cy,8,30,0,0,6.283);x.fill();
  var off=offset(),fx=ret+off*26,sx=near?6:8,spread=near?30:0;
  /* correcting lens */
  var cx=lx-40;
  if(lens){x.strokeStyle="#fbbf24";x.lineWidth=3;x.beginPath();if(lens===2){x.ellipse(cx,cy,9,34,0,0,6.283)}else{x.moveTo(cx-10,cy-34);x.quadraticCurveTo(cx,cy,cx-10,cy+34);x.moveTo(cx+10,cy-34);x.quadraticCurveTo(cx,cy,cx+10,cy+34)}x.stroke()}
  [-1,0,1].forEach(function(k){var y0=cy+k*(near?14:22);x.strokeStyle="#fde047";x.lineWidth=2;x.beginPath();x.moveTo(sx,near?cy+k*4:y0);x.lineTo(lx,y0);x.lineTo(fx,cy);x.stroke()});
  x.fillStyle=Math.abs(off)<0.1?"#22c55e":"#f43f5e";x.beginPath();x.arc(fx,cy,5,0,6.283);x.fill();
  x.fillStyle="#cbd5e1";x.textAlign="left";x.fillText(near?"Object 25 cm away":"Far object",8,cy+60);
}
function upEY(){
  $("eyType").textContent="Eye: "+ET[et];$("eyDist").textContent="Object: "+(near?"Near (25 cm)":"Far away");$("eyLens").textContent="Lens: "+["None","Concave","Convex"][lens];
  var off=offset(),pos=off<0?"in front of the retina":off>0?"behind the retina":"on the retina";
  rows($("eyResult"),[["Image forms "+pos,off?"":"found"],[off?"The image looks blurred":"The image is sharp","found"]]);
  var n="";
  if(et===1)n="Myopia (short sight): far objects are blurred. The far point is nearer than infinity. Use a concave lens.";
  else if(et===2)n="Hypermetropia (long sight): near objects are blurred. The near point is more than 25 cm. Use a convex lens.";
  else n="A normal eye adjusts its lens (accommodation) and sees near and far objects clearly. The near point is 25 cm.";
  $("eyNote").textContent=n;drawEY();
}
$("eyType").addEventListener("click",function(){et=(et+1)%3;upEY()});
$("eyDist").addEventListener("click",function(){near=!near;upEY()});
$("eyLens").addEventListener("click",function(){lens=(lens+1)%3;upEY()});
upMX();upOB();upPZ();upEY();
window.addEventListener("resize",function(){drawMX();drawOB();drawPZ();drawEY()});
var QS=[
{q:"Which colour of light bends the least in a prism?",options:["Red","Violet","Green","Blue"],answer:0,explain:"Red has the longest wavelength and deviates the least. Violet deviates the most."},
{q:"What do red and green lights make when they are added?",options:["Yellow","Cyan","Magenta","White"],answer:0,explain:"Red + green = yellow. Green + blue = cyan. Red + blue = magenta."},
{q:"Which pair is a complementary pair of colours?",options:["Blue and yellow","Red and green","Green and blue","Red and magenta"],answer:0,explain:"Blue + yellow gives white light, so they are complementary."},
{q:"A red object is seen in green light. It looks:",options:["Black","Red","Green","White"],answer:0,explain:"A red object reflects only red. There is no red in green light, so nothing is reflected and it looks black."},
{q:"Why is the sky blue?",options:["Blue light is scattered the most by the air","Blue light is absorbed","The sea reflects blue","Red light is scattered the most"],answer:0,explain:"Air molecules scatter shorter wavelengths more, so blue is scattered most."},
{q:"Why does the Sun look red at sunset?",options:["The blue light is scattered away over the long path","Red light is scattered most","The Sun gets cooler","The sky reflects red"],answer:0,explain:"The light travels a long path through air. Blue is scattered away and mostly red reaches the eye."},
{q:"In myopia the image of a far object forms:",options:["In front of the retina","Behind the retina","On the retina","On the lens"],answer:0,explain:"A myopic eye is too long or too strong, so the image forms in front of the retina."},
{q:"Which lens corrects hypermetropia?",options:["Convex lens","Concave lens","Plane mirror","Cylindrical lens"],answer:0,explain:"A convex lens adds converging power so the image moves forward onto the retina."},
{q:"A prescription says −1.25 D. What does it mean?",options:["A concave lens, used for myopia","A convex lens, used for myopia","A convex lens, used for hypermetropia","A concave lens, used for hypermetropia"],answer:0,explain:"A negative power means a concave lens, which corrects myopia."},
{q:"A Newton's disc looks white when it spins fast because of:",options:["Persistence of vision","Dispersion","Scattering","Refraction"],answer:0,explain:"The eye keeps each colour image for about 1/16 s, so the colours blend into white."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();