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
{q:"In bright light the pupil becomes:",options:["Small","Large","Closed","Square"],answer:0,explain:"Circular muscles of the iris contract and reduce the amount of light entering the eye."},
{q:"For a near object the ciliary muscles:",options:["Contract and the lens becomes thicker","Relax and the lens becomes thinner","Stay the same","Stretch the ligaments"],answer:0,explain:"Contraction slackens the ligaments, so the lens bulges to focus a near object."},
{q:"Which cells work in dim light and give black and white vision?",options:["Rod cells","Cone cells","Ganglion cells","Bipolar cells"],answer:0,explain:"Rod cells contain rhodopsin and are sensitive to dim light."},
{q:"Retinal, a part of the visual pigments, is made from:",options:["Vitamin A","Vitamin C","Vitamin D","Iron"],answer:0,explain:"A lack of vitamin A can cause night blindness."},
{q:"Which part of the eye is the blind spot?",options:["Where the optic nerve leaves the retina","The yellow spot","The pupil","The cornea"],answer:0,explain:"There are no photoreceptor cells where the optic nerve originates."},
{q:"The three ear ossicles are:",options:["Malleus, incus and stapes","Pinna, canal and drum","Cochlea, utricle and saccule","Oval, round and basilar"],answer:0,explain:"They pass the vibrations from the eardrum to the oval window."},
{q:"The receptors for hearing are found in the:",options:["Organ of Corti","Eustachian tube","Semicircular canal","Tympanum"],answer:0,explain:"Hair cells of the organ of Corti make impulses that go to the brain through the auditory nerve."},
{q:"Which part of the inner ear senses rotation of the head?",options:["Semicircular canals","Cochlea","Tympanum","Pinna"],answer:0,explain:"Endolymph in the semicircular canals moves with the head and stimulates hair cells."},
{q:"Taste receptors are:",options:["Chemoreceptors","Photoreceptors","Pressure receptors","Hair cells of the ear"],answer:0,explain:"Substances dissolved in saliva stimulate chemoreceptors in the taste buds."},
{q:"A cloudy, opaque eye lens is called:",options:["Cataract","Glaucoma","Conjunctivitis","Night blindness"],answer:0,explain:"Cataract is the clouding of the lens."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();