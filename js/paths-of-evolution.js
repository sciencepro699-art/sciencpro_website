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
{q:"According to Lamarck, the long neck of the giraffe came from:",options:["Stretching the neck and inheriting it","Natural selection of long necks","A mutation in bacteria","Fossil formation"],answer:0,explain:"Lamarck's idea: acquired characters are inherited. Later this was shown to be wrong."},
{q:"Which is NOT a step of Darwin's natural selection?",options:["Inheritance of acquired characters","Over-production","Struggle for existence","Survival of the fittest"],answer:0,explain:"Inheritance of acquired characters belongs to Lamarckism."},
{q:"Darwin got his main ideas by studying the beaks of:",options:["Finches of the Galapagos Islands","Giraffes in Africa","Eagles in Asia","Parrots in India"],answer:0,explain:"Different beaks suited different foods on the Galapagos Islands."},
{q:"The beta chain of haemoglobin differs from humans by 0 amino acids in:",options:["Chimpanzee","Gorilla","Rat","Cat"],answer:0,explain:"Fewer differences mean a closer evolutionary relationship. Chimpanzee is closest."},
{q:"Archaeopteryx is a fossil connecting link between:",options:["Reptiles and birds","Fish and amphibians","Apes and humans","Birds and mammals"],answer:0,explain:"It has features of both reptiles and birds."},
{q:"Which ancestor had the largest cranial capacity?",options:["Homo neanderthalensis","Homo sapiens","Homo erectus","Homo habilis"],answer:0,explain:"Neanderthals had about 1450 cm³, slightly more than Homo sapiens (1350 cm³)."},
{q:"The fibre that carries impulses away from the cell body is the:",options:["Axon","Dendrite","Dendron","Synaptic cleft"],answer:0,explain:"The axon is the longest fibre and ends in the synaptic knob."},
{q:"Which part of the brain maintains body balance?",options:["Cerebellum","Cerebrum","Thalamus","Pons"],answer:0,explain:"The cerebellum coordinates muscular activity and equilibrium."},
{q:"At a synapse, the message crosses the gap using:",options:["Neurotransmitters","Myelin","Cerebrospinal fluid","Hormones from the thyroid"],answer:0,explain:"The synaptic knob releases neurotransmitters such as acetylcholine."},
{q:"In a reflex arc the neuron that carries the message to the muscle is the:",options:["Motor neuron","Sensory neuron","Neuroglial cell","Receptor"],answer:0,explain:"Motor neurons carry instructions from the central nervous system to muscles and glands."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();