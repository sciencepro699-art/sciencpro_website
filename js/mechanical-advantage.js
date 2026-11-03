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

/* Mechanical Advantage in Action — Class 10 Physics, Chapter 7 */
function g(n){return Math.round(n*100)/100}
/* ---------- Lab 1: lever ---------- */
var T=1,L=60,LA=20,EA=40,E=30;
var ORD=["","First order lever (fulcrum between load and effort)","Second order lever (load between fulcrum and effort)","Third order lever (effort between fulcrum and load)"];
function fix(){if(T===2&&LA>=EA){if(EA<=5){EA=10;}LA=Math.max(5,EA-5)}if(T===3&&EA>=LA){if(LA<=5){LA=10;}EA=Math.max(5,LA-5)}
  $("lvLAs").value=LA;$("lvEAs").value=EA}
function drawLever(){
  var c=$("lvCanvas"),f=fit(c,240),x=f.x,w=f.w;x.clearRect(0,0,w,240);x.fillStyle="#0A1128";x.fillRect(0,0,w,240);
  var m=44,py=150,fx,lx,ex,s;
  if(T===1){s=(w-2*m)/(LA+EA);fx=m+LA*s;lx=m;ex=fx+EA*s}
  else if(T===2){s=(w-2*m)/EA;fx=m;lx=m+LA*s;ex=m+EA*s}
  else{s=(w-2*m)/LA;fx=m;ex=m+EA*s;lx=m+LA*s}
  var tl=E*EA,tr=L*LA,mx=Math.max(tl,tr,1),th=Math.max(-1,Math.min(1,(tl-tr)/mx))*0.2*(T===1?1:-1);
  var x0=Math.min(fx,lx,ex),x1=Math.max(fx,lx,ex);
  /* fulcrum */
  x.fillStyle="#fbbf24";x.beginPath();x.moveTo(fx,py);x.lineTo(fx-16,py+34);x.lineTo(fx+16,py+34);x.closePath();x.fill();
  x.fillStyle="#fbbf24";x.font="600 11px Inter,sans-serif";x.textAlign="center";x.fillText("Fulcrum",fx,py+50);
  x.fillStyle="rgba(255,255,255,.25)";x.fillRect(8,py+34,w-16,2);
  x.save();x.translate(fx,py);x.rotate(th);
  x.fillStyle="#e2e8f0";x.fillRect(x0-fx-8,-5,x1-x0+16,10);
  /* load: weight hanging down */
  var lw=18+L/6,lxr=lx-fx;
  x.fillStyle="#f43f5e";x.fillRect(lxr-lw/2,6,lw,lw);x.fillStyle="#fff";x.font="700 11px Inter,sans-serif";x.textBaseline="middle";x.fillText("L",lxr,6+lw/2);
  x.strokeStyle="#f43f5e";x.lineWidth=2;x.beginPath();x.moveTo(lxr,-5);x.lineTo(lxr,6);x.stroke();
  /* effort arrow */
  var exr=ex-fx,len=14+E/6;
  x.strokeStyle="#38bdf8";x.fillStyle="#38bdf8";x.lineWidth=4;x.beginPath();
  if(T===1){x.moveTo(exr,-6-len);x.lineTo(exr,-6);x.stroke();x.beginPath();x.moveTo(exr,-2);x.lineTo(exr-7,-12);x.lineTo(exr+7,-12);x.fill()}
  else{x.moveTo(exr,6+len);x.lineTo(exr,6);x.stroke();x.beginPath();x.moveTo(exr,2);x.lineTo(exr-7,12);x.lineTo(exr+7,12);x.fill()}
  x.restore();
  x.textBaseline="alphabetic";x.textAlign="left";x.fillStyle="#fb7185";x.font="600 11px Inter,sans-serif";x.fillText("Load arm = "+LA+" cm",10,20);
  x.fillStyle="#38bdf8";x.fillText("Effort arm = "+EA+" cm",10,38);
}
function upL(){
  fix();
  $("lvL").textContent=L+" N";$("lvLA").textContent=LA+" cm";$("lvEA").textContent=EA+" cm";$("lvE").textContent=E+" N";
  var req=L*LA/EA,ma=EA/LA,d=E*EA-L*LA;
  rows($("lvResult"),[
    [ORD[T]],
    ["Load × load arm = "+L+" × "+LA+" = "+g(L*LA)],
    ["Effort × effort arm = "+E+" × "+EA+" = "+g(E*EA)],
    ["Effort needed to balance: E = "+g(req)+" N","found"],
    ["Mechanical advantage = EA ÷ LA = "+EA+" ÷ "+LA+" = "+g(ma)+(ma>1?" (more than 1)":ma<1?" (less than 1)":" (equal to 1)"),"found"]]);
  $("lvNote").textContent=d===0?"Balanced! The turning effects are equal.":d>0?"The effort wins. The load goes up.":"The load wins. Push harder or use a longer effort arm.";
  drawLever();
}
$("lvLs").addEventListener("input",function(){L=+this.value;upL()});
$("lvLAs").addEventListener("input",function(){LA=+this.value;upL()});
$("lvEAs").addEventListener("input",function(){EA=+this.value;upL()});
$("lvEs").addEventListener("input",function(){E=+this.value;upL()});
$("lvBal").addEventListener("click",function(){E=Math.min(300,Math.round(L*LA/EA));$("lvEs").value=E;upL()});
Array.prototype.forEach.call($("lvTabs").querySelectorAll(".tab"),function(b){b.addEventListener("click",function(){T=+b.dataset.t;Array.prototype.forEach.call($("lvTabs").querySelectorAll(".tab"),function(o){o.classList.toggle("on",o===b)});
  if(T===1){LA=20;EA=40}else if(T===2){LA=20;EA=60}else{LA=60;EA=20}
  E=Math.min(300,Math.round(L*LA/EA));$("lvEs").value=E;upL()})});
/* ---------- Lab 2: machines ---------- */
var M="pulley",pN=4,pL=600,pH=2,rH=2,rL=8,rW=600,wR=30,wr=5,wL=600;
function drawM(){
  var c=$("mcCanvas"),H=(M==="pulley"?292:230),f=fit(c,H),x=f.x,w=f.w;x.clearRect(0,0,w,H);x.fillStyle="#0A1128";x.fillRect(0,0,w,H);
  x.textAlign="center";x.font="600 11px Inter,sans-serif";
  if(M==="pulley"){
    var n=pN,sp=Math.min(34,(w-150)/Math.max(n-1,1)),r=sp/2,yt=74,yb=148,x0=Math.max(30,(w-((n-1)*sp+sp+60))/2+10);
    var xs=[];for(var i=0;i<n;i++)xs.push(x0+i*sp);
    var gx=xs[n-1]+sp,xmin=xs[0],xmax=xs[n-1];
    /* ceiling */
    x.fillStyle="#475569";x.fillRect(10,10,w-20,10);x.strokeStyle="#64748b";x.lineWidth=2;
    for(var h=14;h<w-14;h+=14){x.beginPath();x.moveTo(h,10);x.lineTo(h-6,4);x.stroke()}
    /* fixed block plate + hangers */
    var fpx0=xmin-10,fpx1=gx+r+10;
    x.strokeStyle="#94a3b8";x.lineWidth=3;x.beginPath();x.moveTo(fpx0+6,20);x.lineTo(fpx0+6,yt-r-8);x.moveTo(fpx1-6,20);x.lineTo(fpx1-6,yt-r-8);x.stroke();
    x.fillStyle="#334155";x.fillRect(fpx0,yt-r-8,fpx1-fpx0,8);
    /* movable block plate */
    var mpx0=xmin-12,mpx1=xmax+12;
    x.fillStyle="#334155";x.fillRect(mpx0,yb+r+2,mpx1-mpx0,8);
    /* wheels */
    function wheel(cx,cy){x.fillStyle="#1e293b";x.strokeStyle="#94a3b8";x.lineWidth=2;x.beginPath();x.arc(cx,cy,r,0,6.283);x.fill();x.stroke();x.fillStyle="#94a3b8";x.beginPath();x.arc(cx,cy,2.5,0,6.283);x.fill()}
    for(i=0;i<n-1;i++){var up=(n%2===1)?(i%2===0):(i%2===1);var mid=(xs[i]+xs[i+1])/2;if(up)wheel(mid,yt);else wheel(mid,yb)}
    wheel((xmax+gx)/2,yt);
    /* rope */
    x.strokeStyle="#fbbf24";x.lineWidth=3;x.lineCap="round";x.beginPath();
    var startUp=(n%2===1);
    x.moveTo(xs[0],startUp?yb+r+2:yt-r-8);x.lineTo(xs[0],startUp?yt:yb);
    var dirUp=startUp;
    for(i=0;i<n-1;i++){var mx2=(xs[i]+xs[i+1])/2;
      if(dirUp){x.arc(mx2,yt,r,Math.PI,0,false);x.lineTo(xs[i+1],yb)}else{x.arc(mx2,yb,r,Math.PI,0,true);x.lineTo(xs[i+1],yt)}
      dirUp=!dirUp}
    /* last segment ends at top: go over guide wheel and down to the effort end */
    x.arc((xmax+gx)/2,yt,r,Math.PI,0,false);x.lineTo(gx,yb+54);x.stroke();
    /* segment numbers */
    x.fillStyle="#fde047";x.font="700 11px Inter,sans-serif";x.textAlign="center";
    for(i=0;i<n;i++)x.fillText(String(i+1),xs[i]+(i===n-1?-8:0)+(i<n-1?0:0),(yt+yb)/2+4+(i%2?10:-10)*0);
    /* load */
    var lx=(mpx0+mpx1)/2;x.strokeStyle="#94a3b8";x.lineWidth=3;x.beginPath();x.moveTo(lx,yb+r+10);x.lineTo(lx,yb+r+22);x.stroke();
    var bw=44+pL/60;x.fillStyle="#f43f5e";x.fillRect(lx-bw/2,yb+r+22,bw,30);x.fillStyle="#fff";x.font="700 11px Inter,sans-serif";x.fillText(pL+" N",lx,yb+r+41);
    /* effort */
    x.strokeStyle="#38bdf8";x.fillStyle="#38bdf8";x.lineWidth=4;x.beginPath();x.moveTo(gx,yb+54);x.lineTo(gx,yb+84);x.stroke();x.beginPath();x.moveTo(gx,yb+96);x.lineTo(gx-7,yb+82);x.lineTo(gx+7,yb+82);x.fill();
    x.font="700 12px Inter,sans-serif";x.textAlign="center";x.fillText("Pull "+g(pL/pN)+" N",Math.min(gx,w-45),yb+108);
    x.fillStyle="#cbd5e1";x.font="600 11px Inter,sans-serif";x.fillText("Fixed on top · movable with the load",w/2,H-8);
  }else if(M==="ramp"){
    var bw2=w-60,hh=130,sx=Math.min(bw2/rL,60),sw=rL*sx,sh=Math.min(hh,rH*sx*(hh/ (4*sx))),hx=30,hy=190;
    var rh=rH/4*130; sw=Math.min(w-60,rL*(w-60)/12);
    x.fillStyle="#1e293b";x.beginPath();x.moveTo(hx,hy);x.lineTo(hx+sw,hy);x.lineTo(hx+sw,hy-rh);x.closePath();x.fill();
    x.strokeStyle="#fbbf24";x.lineWidth=3;x.beginPath();x.moveTo(hx,hy);x.lineTo(hx+sw,hy-rh);x.stroke();
    var a=Math.atan2(rh,sw),bxp=hx+sw*0.55,byp=hy-rh*0.55;x.save();x.translate(bxp,byp);x.rotate(-a);x.fillStyle="#f43f5e";x.fillRect(-16,-26,32,26);x.fillStyle="#fff";x.fillText("L",0,-9);
    x.strokeStyle="#38bdf8";x.fillStyle="#38bdf8";x.lineWidth=4;x.beginPath();x.moveTo(0,-13);x.lineTo(54,-13);x.stroke();x.beginPath();x.moveTo(60,-13);x.lineTo(50,-19);x.lineTo(50,-7);x.fill();x.restore();
    x.fillStyle="#fb923c";x.fillText("h = "+rH+" m",hx+sw+(sw<w-100?26:-34),hy-rh/2);x.fillStyle="#cbd5e1";x.fillText("length l = "+rL+" m",hx+sw/2,hy+18);
  }else{
    var cy=116,R=Math.min(95,60+wR,w/2-30),cx2=w/2,r2=Math.max(10,wr*3.2);
    x.fillStyle="#334155";x.beginPath();x.arc(cx2,cy,R,0,6.283);x.fill();x.strokeStyle="#94a3b8";x.lineWidth=3;x.stroke();
    x.fillStyle="#fbbf24";x.beginPath();x.arc(cx2,cy,r2,0,6.283);x.fill();
    x.strokeStyle="#38bdf8";x.lineWidth=4;x.beginPath();x.moveTo(cx2-R,cy);x.lineTo(cx2-R,cy+60);x.stroke();x.fillStyle="#38bdf8";x.beginPath();x.moveTo(cx2-R,cy+70);x.lineTo(cx2-R-6,cy+58);x.lineTo(cx2-R+6,cy+58);x.fill();
    x.fillText("Effort",cx2-R+14,cy+88);
    x.strokeStyle="#f43f5e";x.lineWidth=3;x.beginPath();x.moveTo(cx2+r2,cy);x.lineTo(cx2+r2,cy+50);x.stroke();x.fillStyle="#f43f5e";x.fillRect(cx2+r2-14,cy+50,28,26);x.fillStyle="#fff";x.fillText("L",cx2+r2,cy+68);
    x.fillStyle="#cbd5e1";x.fillText("R = "+wR+" cm",cx2,cy-R-8);x.fillText("r = "+wr+" cm",cx2+r2+34,cy-6);
  }
}
function upM(){
  var rs,note;
  $("pPanel").hidden=M!=="pulley";$("rPanel").hidden=M!=="ramp";$("wPanel").hidden=M!=="wheel";
  if(M==="pulley"){
    $("pN").textContent=pN;$("pL").textContent=pL+" N";$("pH").textContent=pH+" m";
    var E1=pL/pN,s=pN*pH;
    rs=[["Mechanical advantage = number of segments = "+pN],["Effort = Load ÷ MA = "+pL+" ÷ "+pN+" = "+g(E1)+" N","found"],
        ["To raise the load by "+pH+" m you pull the rope "+s+" m"],["Work by effort = "+g(E1)+" × "+s+" = "+g(E1*s)+" J"],["Work on load = "+pL+" × "+pH+" = "+(pL*pH)+" J","found"]];
    note=pN===1?"A fixed pulley has MA = 1. It only changes the direction of the force.":"Less effort, but a longer pull. The two works are equal, so there is no gain in work.";
  }else if(M==="ramp"){
    if(rL<rH)rL=rH;$("rLs").value=rL;
    $("rH").textContent=rH+" m";$("rLn").textContent=rL+" m";$("rW").textContent=rW+" N";
    var ma=rL/rH,E2=rW/ma;
    rs=[["Mechanical advantage = l ÷ h = "+rL+" ÷ "+rH+" = "+g(ma)],["Effort = Load ÷ MA = "+rW+" ÷ "+g(ma)+" = "+g(E2)+" N","found"],
        ["Work by effort = "+g(E2)+" × "+rL+" = "+g(E2*rL)+" J"],["Work on load = "+rW+" × "+rH+" = "+(rW*rH)+" J","found"]];
    note="A longer slope needs less effort. That is why hill roads have hairpin bends. Work in = work out.";
  }else{
    $("wR").textContent=wR+" cm";$("wr").textContent=wr+" cm";$("wL").textContent=wL+" N";
    var ma3=wR/wr,E3=wL/ma3;
    rs=[["Mechanical advantage = R ÷ r = "+wR+" ÷ "+wr+" = "+g(ma3)],["Effort = Load ÷ MA = "+wL+" ÷ "+g(ma3)+" = "+g(E3)+" N","found"],
        ["One turn: effort moves 2πR, load moves 2πr"],["Effort × 2πR = Load × 2πr (work is equal)","note"]];
    note="Make the wheel bigger or the axle thinner to get a bigger mechanical advantage.";
  }
  rows($("mcResult"),rs);$("mcNote").textContent=note;drawM();
}
[["pNs","pN"],["pLs","pL"],["pHs","pH"],["rHs","rH"],["rLs","rL"],["rWs","rW"],["wRs","wR"],["wrs","wr"],["wLs","wL"]].forEach(function(p){
  $(p[0]).addEventListener("input",function(){var v=+this.value;if(p[1]==="pN")pN=v;if(p[1]==="pL")pL=v;if(p[1]==="pH")pH=v;if(p[1]==="rH")rH=v;if(p[1]==="rL")rL=v;if(p[1]==="rW")rW=v;if(p[1]==="wR")wR=v;if(p[1]==="wr")wr=v;if(p[1]==="wL")wL=v;upM()})});
Array.prototype.forEach.call(document.querySelectorAll("[data-n]"),function(b){b.addEventListener("click",function(){pN=+b.dataset.n;$("pNs").value=pN;upM()})});
Array.prototype.forEach.call($("mcTabs").querySelectorAll(".tab"),function(b){b.addEventListener("click",function(){M=b.dataset.t;Array.prototype.forEach.call($("mcTabs").querySelectorAll(".tab"),function(o){o.classList.toggle("on",o===b)});upM()})});
upL();upM();
window.addEventListener("resize",function(){drawLever();drawM()});
/* ---------- Quiz ---------- */
SPQuiz.init({questions:[
{q:"A lever has an effort arm of 60 cm and a load arm of 20 cm. What is its mechanical advantage?",options:["1/3","1","3","40"],answer:2,explain:"MA of a lever = effort arm ÷ load arm = 60 ÷ 20 = 3."},
{q:"In which order of lever is the mechanical advantage always greater than one?",options:["First order","Second order","Third order","All orders"],answer:1,explain:"In a second order lever the load is between the fulcrum and the effort, so the effort arm is always longer than the load arm."},
{q:"A 400 N load is 10 cm from the fulcrum of a lever. The effort acts 50 cm from the fulcrum. What effort balances it?",options:["80 N","2000 N","40 N","200 N"],answer:0,explain:"L × LA = E × EA gives 400 × 10 = E × 50, so E = 4000 ÷ 50 = 80 N."},
{q:"What is the mechanical advantage of a fixed pulley, and what is it used for?",options:["2, to reduce the effort","1, to change the direction of the force","1, to reduce the effort","Less than 1, to save work"],answer:1,explain:"A fixed pulley has MA = 1. It does not reduce the effort, but it changes the direction of the force."},
{q:"What is the mechanical advantage of a system with 3 movable pulleys?",options:["3","6","8","9"],answer:2,explain:"With n movable pulleys, MA = 2ⁿ. For n = 3, MA = 2³ = 8."},
{q:"A rope is pulled 8 m with a force of 300 N and it lifts a 600 N load by 4 m. What does this show?",options:["Work done by the effort is more than the work on the load","Work done by the effort is less than the work on the load","Both works are 2400 J, so there is no gain in work","Machines save work"],answer:2,explain:"Work by the effort = 300 × 8 = 2400 J. Work on the load = 600 × 4 = 2400 J. A simple machine never gives a gain in work."},
{q:"A 600 kgwt load is raised 4 m using a slope 8 m long. What effort is needed along the slope?",options:["1200 kgwt","600 kgwt","300 kgwt","150 kgwt"],answer:2,explain:"MA = l ÷ h = 8 ÷ 4 = 2. Effort = Load ÷ MA = 600 ÷ 2 = 300 kgwt."},
{q:"The wheel of a wheel and axle has radius 20 cm and the axle has radius 2 cm. What is its mechanical advantage?",options:["10","40","0.1","22"],answer:0,explain:"MA = R ÷ r = 20 ÷ 2 = 10."},
{q:"A vehicle climbs a steep hill. The toothed wheel on its engine should be connected to which wheel?",options:["A small toothed wheel, for more speed","A large toothed wheel, for more turning force","No wheel","Any wheel; it makes no difference"],answer:1,explain:"A large toothed wheel gives more turning force but less speed. That is what a vehicle needs to climb a hill."},
{q:"Forceps and tongs are third order levers. Why are they useful although their mechanical advantage is less than one?",options:["They give a large force","They save work","They help handle objects safely and easily","They have a long load arm and a short effort arm only"],answer:2,explain:"In a third order lever the effort is between the fulcrum and the load, so the effort is more than the load. The benefit is that objects can be handled safely and easily."}
]});

})();