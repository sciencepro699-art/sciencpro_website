/* Science Pro Club: landing + contact page scripts. No libraries. */
(function(){"use strict";
/* ====== EDIT THESE ====== */
var CONFIG={
  JOIN_URL:"",            // leave empty until the Pro Club website is live. Then put its link here, e.g. "https://club.sciencepros.in"
  PHONE:"919747471053",               // your call number with country code, digits only, e.g. "919876543210"
  WHATSAPP:"919747471053",            // your WhatsApp number with country code, digits only, e.g. "919876543210"
  EMAIL:""                // optional: your email, e.g. "hello@sciencepros.in" (leave empty to hide the email card)
};
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function $(s,r){return(r||document).querySelector(s)}function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function toast(t){var o=$(".toast");if(o)o.remove();var e=document.createElement("div");e.className="toast";e.setAttribute("role","status");e.textContent=t;document.body.appendChild(e);setTimeout(function(){e.remove()},3200)}
/* join links */
$$("[data-join]").forEach(function(a){if(CONFIG.JOIN_URL){a.href=CONFIG.JOIN_URL;a.target="_blank";a.rel="noopener";a.textContent="👑 Join Pro Club · ₹99 ›"}else if(CONFIG.WHATSAPP){a.href="https://wa.me/"+String(CONFIG.WHATSAPP).replace(/\D/g,"")+"?text="+encodeURIComponent("Hello Science Pro, I want to join the Pro Club that starts on 1 December.");a.target="_blank";a.rel="noopener"}});
/* scroll progress + sticky cta */
var prog=$("#prog"),sticky=$(".sticky");
function onScroll(){var h=document.documentElement,p=h.scrollTop/(h.scrollHeight-h.clientHeight||1);if(prog)prog.style.width=(p*100)+"%";if(sticky)sticky.classList.toggle("show",h.scrollTop>500)}
window.addEventListener("scroll",onScroll,{passive:true});onScroll();
/* reveal on scroll */
var io="IntersectionObserver" in window?new IntersectionObserver(function(es){es.forEach(function(x){if(!x.isIntersecting)return;var t=x.target;t.classList.add("in");io.unobserve(t);
  $$("[data-w]",t).forEach(function(b){b.style.width=b.getAttribute("data-w")+"%"});if(t.hasAttribute("data-count"))count(t)})},{threshold:.15}):null;
$$(".rv,.stat").forEach(function(e,i){if(!e.style.getPropertyValue("--d"))e.style.setProperty("--d",(i%4)*.08+"s");if(io)io.observe(e);else{e.classList.add("in");$$("[data-w]",e).forEach(function(b){b.style.width=b.getAttribute("data-w")+"%"})}});
function count(el){var n=el.querySelector("b"),to=+el.getAttribute("data-count"),suf=el.getAttribute("data-suf")||"",pre=el.getAttribute("data-pre")||"";if(reduce){n.textContent=pre+to+suf;return}var t0=performance.now();(function f(t){var k=Math.min(1,(t-t0)/1400),e=1-Math.pow(1-k,3);n.textContent=pre+Math.round(to*e)+suf;if(k<1)requestAnimationFrame(f)})(t0)}
/* hero headline words */
var h1=$("[data-words]");if(h1){var out=[];h1.childNodes.forEach(function(nd){var cls=nd.nodeType===1?nd.className:"";String(nd.textContent).split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){out.push(document.createTextNode(" "));return}var s=document.createElement("span");s.className="w "+cls;s.textContent=w;out.push(s)})});h1.textContent="";out.forEach(function(n,i){if(n.style)n.style.animationDelay=(.15+i*.12)+"s";h1.appendChild(n)})}
/* embers canvas */
var cv=$("#embers");if(cv&&!reduce){var cx=cv.getContext("2d"),W,H,P=[],run=true,dpr=Math.min(2,window.devicePixelRatio||1);
 function size(){var r=cv.getBoundingClientRect();W=cv.width=r.width*dpr;H=cv.height=r.height*dpr}size();window.addEventListener("resize",size);
 function mk(init){return{x:Math.random()*W,y:init?Math.random()*H:H+10,r:(Math.random()*2.2+.6)*dpr,vy:(Math.random()*.6+.25)*dpr,vx:(Math.random()-.5)*.3*dpr,a:Math.random()*.7+.2,ph:Math.random()*6}}
 var N=W<700*dpr?36:70;for(var i=0;i<N;i++)P.push(mk(true));
 (function loop(t){if(run){cx.clearRect(0,0,W,H);P.forEach(function(p,i){p.y-=p.vy;p.x+=p.vx+Math.sin(t/900+p.ph)*.25*dpr;if(p.y<-10)P[i]=mk(false);var g=cx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*4);g.addColorStop(0,"rgba(255,176,58,"+p.a+")");g.addColorStop(1,"rgba(255,122,41,0)");cx.fillStyle=g;cx.beginPath();cx.arc(p.x,p.y,p.r*4,0,6.3);cx.fill()})}requestAnimationFrame(loop)})(0);
 if(io){new IntersectionObserver(function(e){run=e[0].isIntersecting}).observe(cv)}}
/* card tilt (mouse devices) */
if(!reduce&&window.matchMedia("(hover:hover)").matches){$$(".card.tilt").forEach(function(c){c.addEventListener("pointermove",function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform="perspective(700px) rotateY("+x*8+"deg) rotateX("+(-y*8)+"deg) translateY(-4px)"});c.addEventListener("pointerleave",function(){c.style.transform=""})})}
/* live leaderboard demo (sample data) */
var list=$("#list");if(list){var RH=66,S=[{n:"Aarav Nair",d:"Kottayam",i:"AN",c:"#FFC83D",s:96},{n:"Meera Warrier",d:"Thrissur",i:"MW",c:"#C9D1E8",s:94},{n:"Riya George",d:"Ernakulam",i:"RG",c:"#E59A59",s:91},{n:"Kavya Nair",d:"Kozhikode",i:"KN",c:"#9B7BFF",s:88},{n:"Irfan Menon",d:"Malappuram",i:"IM",c:"#34D399",s:85}],els=[],prev={};
 list.style.height=S.length*RH+"px";
 S.forEach(function(s,i){var r=document.createElement("div");r.className="row";r.innerHTML='<div class="rk"></div><div class="av"></div><div class="nm"></div><div class="sc"></div><div class="mv eq">–</div>';r.querySelector(".av").style.background=s.c;r.querySelector(".av").textContent=s.i;var nm=r.querySelector(".nm");nm.textContent=s.n;var sm=document.createElement("small");sm.textContent="📍 "+s.d;nm.appendChild(sm);list.appendChild(r);els.push(r);s.el=r;prev[s.n]=i});
 function draw(first){var o=S.slice().sort(function(a,b){return b.s-a.s});o.forEach(function(s,i){var r=s.el,old=prev[s.n],d=old-i;r.style.transform="translateY("+i*RH+"px)";r.className="row"+(i<3?" p"+(i+1):"");r.querySelector(".rk").textContent=i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1;r.querySelector(".sc").textContent=s.s;var m=r.querySelector(".mv");if(!first&&d!==0){m.className="mv pop "+(d>0?"up":"dn");m.textContent=(d>0?"▲":"▼")+Math.abs(d)}else if(first){m.className="mv eq";m.textContent="–"}prev[s.n]=i})}
 draw(true);
 if(!reduce){setInterval(function(){var a=S[Math.floor(Math.random()*S.length)];a.s=Math.max(60,Math.min(99,a.s+Math.round(Math.random()*8-2)));S.forEach(function(s){if(s!==a&&Math.random()<.3)s.s=Math.max(60,Math.min(99,s.s+Math.round(Math.random()*4-2)))});draw(false)},3200)}}
/* quote rotator */
var qb=$("#q");if(qb){var Q=["Discipline is doing what must be done, even when you do not feel like it.","Small steps every day beat big jumps once a month.","Do not compare yourself to others. Beat who you were yesterday.","Champions are made on the days nobody is watching.","Hard work in silence. Let your rank make the noise.","One more question. One more page. One more day.","You do not rise to your goals. You rise to your daily habits."],qi=Math.floor(Date.now()/864e5)%Q.length,dots=$("#dots");
 Q.forEach(function(_,i){var d=document.createElement("i");dots.appendChild(d)});
 function show(){qb.textContent="“"+Q[qi]+"”";$$("i",dots).forEach(function(d,i){d.className=i===qi?"on":""})}show();
 if(!reduce)setInterval(function(){qb.classList.add("out");setTimeout(function(){qi=(qi+1)%Q.length;show();qb.classList.remove("out")},500)},5500)}
/* contact buttons (no form, nothing is collected) */
function digits(v){return String(v||"").replace(/\D/g,"")}
var ph=digits(CONFIG.PHONE),wa=digits(CONFIG.WHATSAPP);
$$("[data-call]").forEach(function(a){if(ph)a.href="tel:+"+ph;else a.style.display="none"});
$$("[data-wa]").forEach(function(a){if(wa){a.href="https://wa.me/"+wa+"?text="+encodeURIComponent("Hello Science Pro, I want to know about the Pro Club.");a.target="_blank";a.rel="noopener"}else a.style.display="none"});
})();