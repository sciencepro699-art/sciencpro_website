(function(){"use strict";
/* Science Pro Biology — shared helpers (quiz + canvas) kept inside each chapter file */
var SPQuiz={init:function(o){var shell=document.getElementById("quizShell");if(!shell)return;var qs=o.questions,cur=0,score=0,done=false;
var back="subject.html?class=10&subject=biology";var msgs=["Nice start. Read the diagrams again and try once more.","Good work. One more go and you've got it.","Excellent!"];
function ask(){done=false;var q=qs[cur],n=qs.length;shell.innerHTML='<div class="game-shell-header"><span class="score-pill">Question '+(cur+1)+' / '+n+'</span><div class="progress-track"><div class="progress-fill" style="width:'+Math.round(cur/n*100)+'%"></div></div><span class="score-pill">Score: '+score+'</span></div><div class="quiz-question"></div><div class="quiz-options"></div><div class="quiz-feedback"></div><div class="quiz-next"></div>';
shell.querySelector(".quiz-question").textContent=q.q;var w=shell.querySelector(".quiz-options");
q.options.forEach(function(t,i){var b=document.createElement("button");b.className="quiz-option";b.textContent=t;b.addEventListener("click",function(){pick(i)});w.appendChild(b)})}
function pick(i){if(done)return;done=true;var q=qs[cur],bs=shell.querySelectorAll(".quiz-option");bs.forEach(function(b){b.disabled=true});
if(i===q.answer){score++;bs[i].classList.add("correct")}else{bs[i].classList.add("wrong");bs[q.answer].classList.add("correct")}
var fb=shell.querySelector(".quiz-feedback");fb.textContent=q.explain;fb.classList.add("show");var last=cur===qs.length-1,nb=document.createElement("button");
nb.className="btn btn-primary";nb.textContent=last?"See results":"Next question →";nb.addEventListener("click",function(){cur++;if(cur>=qs.length)end();else ask()});shell.querySelector(".quiz-next").appendChild(nb)}
function end(){var n=qs.length,p=Math.round(score/n*100),v=p>=80?msgs[2]:p>=50?msgs[1]:msgs[0];
shell.innerHTML='<div class="result-screen"><span class="eyebrow" style="justify-content:center;">RESULTS</span><div class="big-score">'+score+' / '+n+'</div><p>'+v+'</p><div class="result-actions"><button class="btn btn-primary" id="retryBtn">Try again</button><a class="btn btn-dark" href="'+back+'">Back to Biology chapters</a></div></div>';
document.getElementById("retryBtn").addEventListener("click",function(){cur=0;score=0;ask()})}ask()}};
function $(id){return document.getElementById(id)}
function fit(c,h){var w=c.clientWidth||320;c.width=w*2;c.height=h*2;var x=c.getContext("2d");x.setTransform(2,0,0,2,0,0);return{x:x,w:w,h:h}}
function rows(el,arr){el.innerHTML=arr.map(function(l){return'<div class="line'+(l[1]?" "+l[1]:"")+'">'+l[0]+'</div>'}).join("")}

var QS=[
{q:"Which pair of white blood cells are phagocytes?",options:["Neutrophil and monocyte","Eosinophil and basophil","Neutrophil and basophil","Monocyte and lymphocyte"],answer:0,explain:"Neutrophils and monocytes engulf and destroy pathogens."},
{q:"B lymphocytes are responsible for:",options:["Making antibodies","Killing cancer cells","Maturing in the thymus","Making heparin"],answer:0,explain:"B lymphocytes form and mature in bone marrow and produce antibodies."},
{q:"Which enzyme changes prothrombin into thrombin?",options:["Thromboplastin","Fibrin","Lysozyme","Heparin"],answer:0,explain:"Platelets and damaged tissue make thromboplastin during clotting."},
{q:"Pyrogens made by white blood cells cause:",options:["Fever","Clotting","Allergy","Antibodies"],answer:0,explain:"Pyrogens make the brain raise the body temperature, which helps phagocytes."},
{q:"Vaccines act in the body as:",options:["Antigens","Antibodies","Enzymes","Hormones"],answer:0,explain:"They stimulate the immune system to make antibodies in advance."},
{q:"HIV mainly attacks:",options:["T lymphocytes","Red blood cells","Platelets","Neutrophils"],answer:0,explain:"HIV multiplies in T lymphocytes and weakens immunity."},
{q:"Filariasis is carried by the female:",options:["Culex mosquito","Anopheles mosquito","Housefly","Rat flea"],answer:0,explain:"Anopheles carries malaria. Culex carries filarial worms."},
{q:"Which blood group has no antibodies in the plasma?",options:["AB","O","A","B"],answer:0,explain:"AB has both A and B antigens, so it has neither anti-A nor anti-B."},
{q:"Irrational use of antibiotics can cause:",options:["Antibiotic resistance","Immunity to all diseases","Faster blood clotting","Better digestion"],answer:0,explain:"Bacteria become resistant, and useful bacteria are also destroyed."},
{q:"In plants, the polysaccharide that stops pathogens from spreading is:",options:["Callose","Cellulose","Starch","Glycogen"],answer:0,explain:"Callose is formed when pathogens cross the cell wall."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();