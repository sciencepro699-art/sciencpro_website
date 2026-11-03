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
{q:"Which enzyme is the 'genetic scissors' in recombinant DNA technology?",options:["Restriction endonuclease","Ligase","Cas9 only","Amylase"],answer:0,explain:"Restriction endonuclease cuts a specific gene. Ligase joins DNA pieces."},
{q:"The role of a plasmid in making insulin is to act as a:",options:["Vector","Host","Enzyme","Hormone"],answer:0,explain:"The plasmid carries the human insulin gene into the bacterial cell."},
{q:"In CRISPR, which part finds the DNA segment to be cut?",options:["Guide RNA","Cas9","Ligase","Plasmid"],answer:0,explain:"Guide RNA identifies the target. Cas9 cuts it."},
{q:"Bt cotton is an example of a plant with:",options:["Pest resistance","Weedicide resistance","Virus resistance","Extra nutrients"],answer:0,explain:"Soya bean has weedicide resistance and golden rice is nutrient-enriched."},
{q:"Technology used to find the location of a gene in DNA is:",options:["Gene mapping","DNA fingerprinting","Gene therapy","Cryopreservation"],answer:0,explain:"Gene mapping helped the Human Genome Project."},
{q:"About how much of the human genome is functional genes?",options:["1 to 2%","50%","90%","99%"],answer:0,explain:"The remaining bulk is called junk DNA."},
{q:"Gene therapy that is passed on to the next generation is:",options:["Germline gene therapy","Somatic gene therapy","Stem cell therapy","Cryotherapy"],answer:0,explain:"Genes are put into reproductive cells, which raises ethical questions."},
{q:"DNA fingerprinting depends on differences in about what part of DNA?",options:["0.1%","50%","99.9%","All of it"],answer:0,explain:"99.9% of DNA is the same in all humans."},
{q:"Preserving cells and tissues at about −196 °C is called:",options:["Cryopreservation","Bioremediation","Gene mapping","Fermentation"],answer:0,explain:"It is used for long-term storage in medicine, agriculture and research."},
{q:"Which technology uses microorganisms and plants to remove pollutants?",options:["Bioremediation","Cryopreservation","3D printing","Sequencing"],answer:0,explain:"Pollutants are changed into harmless compounds."}
];
QS.forEach(function(q,i){var k=(i*3+1)%4,o=q.options,n=o.slice(k).concat(o.slice(0,k));q.answer=(q.answer-k+4)%4;q.options=n});
SPQuiz.init({questions:QS});

})();