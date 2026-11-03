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

/* Periodic Table and Electron Configuration — Class 10 Chemistry, Chapter 3 */
var EL=["H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca","Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr"];
var NM=["Hydrogen","Helium","Lithium","Beryllium","Boron","Carbon","Nitrogen","Oxygen","Fluorine","Neon","Sodium","Magnesium","Aluminium","Silicon","Phosphorus","Sulphur","Chlorine","Argon","Potassium","Calcium","Scandium","Titanium","Vanadium","Chromium","Manganese","Iron","Cobalt","Nickel","Copper","Zinc","Gallium","Germanium","Arsenic","Selenium","Bromine","Krypton"];
var ORD=[["1s",1,0],["2s",2,0],["2p",2,1],["3s",3,0],["3p",3,1],["4s",4,0],["3d",3,2],["4p",4,1]];
var CAP={0:2,1:6,2:10};
var SUP="⁰¹²³⁴⁵⁶⁷⁸⁹";
function sup(n){return String(n).split("").map(function(d){return SUP[+d]}).join("")}
function fill(z){
  var c={},left=z;
  ORD.forEach(function(o){var k=Math.min(left,CAP[o[2]]);c[o[0]]=k;left-=k});
  if(z===24){c["4s"]=1;c["3d"]=5}
  if(z===29){c["4s"]=1;c["3d"]=10}
  return c;
}
function lastSub(z){ /* subshell that receives the last electron */
  if(z===24||z===29)return "3d";
  var left=z,last="1s";ORD.forEach(function(o){if(left>0){last=o[0];left-=CAP[o[2]]}});return last;
}
var Z=11;
function drawEC(){
  var c=$("ecCanvas"),f=fit(c,330),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,330);
  var cfg=fill(Z),rowH=38,bx=84,bs=Math.min(34,(w-bx-14)/5-4);
  for(var i=0;i<ORD.length;i++){
    var o=ORD[ORD.length-1-i],name=o[0],l=o[2],y=12+i*rowH,nb=2*l+1,cnt=cfg[name]||0;
    x.fillStyle="#cbd5e1";x.font="700 13px Inter,sans-serif";x.textAlign="left";x.fillText(name,10,y+bs*0.7);
    x.fillStyle="#64748b";x.font="600 10px Inter,sans-serif";x.fillText("("+(o[1]+l)+")",42,y+bs*0.7);
    /* fill singly first then pair */
    var up=[],dn=[];for(var b=0;b<nb;b++){up.push(0);dn.push(0)}
    for(var e=0;e<cnt;e++){if(e<nb)up[e]=1;else dn[e-nb]=1}
    for(b=0;b<nb;b++){var px=bx+b*(bs+4);
      x.strokeStyle=(up[b]||dn[b])?"#9CCC3C":"#475569";x.lineWidth=2;x.strokeRect(px,y,bs,bs);
      x.fillStyle="#fde047";x.font="700 "+Math.round(bs*0.6)+"px Inter,sans-serif";x.textAlign="center";
      if(up[b])x.fillText("↑",px+bs*0.32,y+bs*0.72);if(dn[b])x.fillText("↓",px+bs*0.7,y+bs*0.72)}
  }
  x.fillStyle="#64748b";x.font="600 10px Inter,sans-serif";x.textAlign="left";x.fillText("higher energy ↑",w-100,326);
}
function upEC(){
  $("ecZ").textContent=Z;$("ecZs").value=Z;
  var cfg=fill(Z);
  var order=["1s","2s","2p","3s","3p","3d","4s","4p"],s="";
  order.forEach(function(k){if(cfg[k])s+=k+sup(cfg[k])+" "});
  var shells=[0,0,0,0];order.forEach(function(k){shells[+k[0]-1]+=cfg[k]||0});
  var sh=shells.filter(function(v){return v>0}).join(", ");
  var last=lastSub(Z),block=last.slice(-1),period=0;order.forEach(function(k){if(cfg[k])period=Math.max(period,+k[0])});
  var group;
  if(Z===2)group=18;
  else if(block==="s"){group=cfg[last]}
  else if(block==="p"){group=10+(cfg[last[0]+"s"]||0)+cfg[last]}
  else{group=(cfg["4s"]||0)+(cfg["3d"]||0)}
  rows($("ecResult"),[[NM[Z-1]+" ("+EL[Z-1]+") · atomic number "+Z,"found"],["Shell-wise: "+sh],["Subshell-wise: "+s],["Block: "+block+" · Period: "+period+" · Group: "+group]]);
  drawEC();
}
$("ecZs").addEventListener("input",function(){Z=+this.value;upEC()});
$("ecUp").addEventListener("click",function(){Z=Math.min(36,Z+1);upEC()});
$("ecDn").addEventListener("click",function(){Z=Math.max(1,Z-1);upEC()});
Array.prototype.forEach.call(document.querySelectorAll("[data-z]"),function(b){b.addEventListener("click",function(){Z=+b.dataset.z;upEC()})});
/* ---- Lab 2 ---- */
var SN=3,LN=["s","p","d","f"];
function drawSH(){
  var c=$("shCanvas"),f=fit(c,220),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,220);
  var bs=Math.min(26,(w-90)/8-4);
  for(var l=0;l<SN;l++){var y=14+l*46,nb=2*l+1;
    x.fillStyle="#cbd5e1";x.font="700 14px Inter,sans-serif";x.textAlign="left";x.fillText(SN+LN[l],10,y+bs*0.75);
    for(var b=0;b<nb;b++){var px=56+b*(bs+4);x.strokeStyle="#9CCC3C";x.lineWidth=2;x.strokeRect(px,y,bs,bs);x.fillStyle="#fde047";x.font="700 "+Math.round(bs*.55)+"px Inter,sans-serif";x.textAlign="center";x.fillText("↑↓",px+bs/2,y+bs*0.68)}
    x.fillStyle="#94a3b8";x.font="600 10px Inter,sans-serif";x.textAlign="left";x.fillText(nb+(nb>1?" orbitals":" orbital")+" · "+nb*2+" e⁻",56,y+bs+12);
  }
}
function upSH(){
  var parts=[];for(var l=0;l<SN;l++)parts.push(SN+LN[l]);
  rows($("shResult"),[["Shell n = "+SN+" has "+SN+" subshells: "+parts.join(", ")],["Orbitals in the shell: n² = "+SN*SN,"found"],["Electrons it can hold: 2n² = "+2*SN*SN,"found"],["Each orbital holds at most 2 electrons","note"]]);
  drawSH();
}
Array.prototype.forEach.call(document.querySelectorAll("[data-n]"),function(b){b.addEventListener("click",function(){SN=+b.dataset.n;upSH()})});
/* ---- Lab 3 ---- */
var IEP=[["Li",520],["Be",900],["B",801],["C",1086],["N",1402],["O",1314],["F",1681],["Ne",2081]];
var IEG=[["Li",520],["Na",496],["K",419],["Rb",403],["Cs",376]];
var ieMode="p";
function drawIE(){
  var c=$("ieCanvas"),f=fit(c,230),x=f.x,w=f.w;x.fillStyle="#0A1128";x.fillRect(0,0,w,230);
  var D=ieMode==="p"?IEP:IEG,n=D.length,bw=(w-40)/n-8,max=2200;
  D.forEach(function(d,i){var h=d[1]/max*150,px=20+i*(bw+8);x.fillStyle=ieMode==="p"?"#9CCC3C":"#38bdf8";x.fillRect(px,190-h,bw,h);x.fillStyle="#e2e8f0";x.font="700 12px Inter,sans-serif";x.textAlign="center";x.fillText(d[0],px+bw/2,208);x.font="600 10px Inter,sans-serif";x.fillStyle="#cbd5e1";x.fillText(d[1],px+bw/2,184-h)});
  x.fillStyle="#94a3b8";x.font="600 10px Inter,sans-serif";x.textAlign="left";x.fillText("kJ per mole",8,14);
}
function upIE(){
  rows($("ieResult"),ieMode==="p"?[["Along a period: the nuclear charge grows but the number of shells stays the same","note"],["The nucleus pulls the outer electrons harder, so ionisation enthalpy generally increases","found"]]:[["Down a group: more shells, so the outer electron is farther from the nucleus","note"],["It is easier to remove, so ionisation enthalpy decreases","found"]]);
  drawIE();
}
$("ieP").addEventListener("click",function(){ieMode="p";upIE()});
$("ieG").addEventListener("click",function(){ieMode="g";upIE()});
upEC();upSH();upIE();
window.addEventListener("resize",function(){drawEC();drawSH();drawIE()});
var QS=[
{q:"What is the maximum number of electrons in the M shell (n = 3)?",options:["18","8","9","32"],answer:0,explain:"A shell holds 2n² electrons. For n = 3 that is 2 × 9 = 18."},
{q:"How many orbitals are in a d subshell?",options:["5","3","7","1"],answer:0,explain:"A subshell has 2l + 1 orbitals. For d, l = 2, so there are 5 orbitals."},
{q:"Which subshell has more energy, 3d or 4s?",options:["3d","4s","Both are equal","Cannot say"],answer:0,explain:"(n + l) for 3d is 5 and for 4s is 4. So 4s has less energy and fills first."},
{q:"What is the subshell electron configuration of sodium (Z = 11)?",options:["1s² 2s² 2p⁶ 3s¹","1s² 2s² 2p⁵ 3s²","1s² 2s² 2p⁶ 3p¹","1s² 2s² 3s² 3p⁵"],answer:0,explain:"Fill in order 1s, 2s, 2p, 3s. The last electron goes to 3s, so sodium is 1s² 2s² 2p⁶ 3s¹ or [Ne] 3s¹."},
{q:"Which is the correct stable configuration of chromium (Z = 24)?",options:["[Ar] 3d⁵ 4s¹","[Ar] 3d⁴ 4s²","[Ar] 3d⁶","[Ar] 4s²"],answer:0,explain:"A half filled d subshell (d⁵) is extra stable, so one 4s electron moves to 3d."},
{q:"An element has the configuration 1s² 2s² 2p⁶ 3s² 3p⁵. Its block and group are:",options:["p block, group 17","s block, group 7","p block, group 15","d block, group 7"],answer:0,explain:"The last electron goes to p, so it is p block. Group = 10 + outer electrons (2 + 5 = 7) = 17."},
{q:"To which period does an element with 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² belong?",options:["4","2","3","6"],answer:0,explain:"The period number is the highest shell number. Here it is 4."},
{q:"How does ionisation enthalpy change down a group?",options:["Decreases","Increases","Stays the same","First increases then decreases"],answer:0,explain:"The number of shells increases, so the outer electron is farther from the nucleus and easier to remove."},
{q:"Which oxidation states do s block elements of group 1 and 2 show?",options:["+1 and +2","−1 and −2","Both + and −","Variable states"],answer:0,explain:"Group 1 elements lose one electron (+1) and group 2 elements lose two (+2)."},
{q:"Why does iron show two oxidation states, Fe²⁺ and Fe³⁺?",options:["The 4s and 3d subshells have almost the same energy","It has no d electrons","It has only one electron","It is a p block element"],answer:0,explain:"The energies of 4s and 3d are close, so after the 4s electrons, a 3d electron can also be lost."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();