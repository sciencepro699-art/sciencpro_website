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
{q:"A cell in which a hormone acts is called a:",options:["Target cell","Non-target cell","Gland cell","Receptor cell"],answer:0,explain:"The target cell has receptors that fit the hormone."},
{q:"Which plant hormone keeps seeds dormant until conditions are favourable?",options:["Abscisic acid","Gibberellin","Auxin","Cytokinin"],answer:0,explain:"Abscisic acid maintains dormancy. Gibberellin breaks it."},
{q:"Which hormone lowers the calcium level of the blood?",options:["Calcitonin","Parathormone","Thyroxine","Insulin"],answer:0,explain:"Calcitonin comes from the thyroid gland. Parathormone raises calcium."},
{q:"Insulin is made by the:",options:["Beta cells of the islets of Langerhans","Alpha cells of the pancreas","Adrenal medulla","Thyroid gland"],answer:0,explain:"Beta cells make insulin. Alpha cells make glucagon."},
{q:"Which part is called the master controller of hormone production?",options:["Hypothalamus","Thymus","Pineal gland","Thyroid"],answer:0,explain:"The hypothalamus controls the anterior pituitary through releasing and inhibitory hormones."},
{q:"Which hormones prepare the body for an emergency?",options:["Epinephrine and norepinephrine","Insulin and glucagon","Melatonin and thymosin","Estrogen and progesterone"],answer:0,explain:"They are secreted by the adrenal medulla along with the sympathetic system."},
{q:"Too much somatotropin after the growth phase causes:",options:["Acromegaly","Gigantism","Dwarfism","Goitre"],answer:0,explain:"Palms, feet and jaw grow too much."},
{q:"In summer the production of ADH:",options:["Increases, so urine becomes less","Decreases, so urine becomes more","Stops completely","Does not change"],answer:0,explain:"Sweating causes dehydration, so the kidneys take back more water."},
{q:"Which pheromone helps ants walk in a line?",options:["Trail pheromone","Alarm pheromone","Sex pheromone","Territorial pheromone"],answer:0,explain:"Trail pheromones mark the path."},
{q:"Which hormone controls sleep and wakefulness?",options:["Melatonin","Thymosin","Thyroxine","Cortisol"],answer:0,explain:"The pineal gland makes melatonin. It is the biological clock."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();