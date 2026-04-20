// Typing Effect
const texts = ["Let's Study", "Build Your Future", "Best Coaching Centre"];
let i = 0, j = 0, current = "", deleting = false;

function typeEffect(){
current = texts[i];

if(!deleting){
document.getElementById("typing").innerHTML = current.substring(0,j++);
if(j > current.length){
deleting = true;
setTimeout(typeEffect,1000);
return;
}
}else{
document.getElementById("typing").innerHTML = current.substring(0,j--);
if(j < 0){
deleting = false;
i = (i+1)%texts.length;
}
}

setTimeout(typeEffect,100);
}
typeEffect();


// Slider Auto Scroll
const slider = document.getElementById("slider");

setInterval(()=>{
slider.scrollLeft += 1;

if(slider.scrollLeft >= slider.scrollWidth - slider.clientWidth){
slider.scrollLeft = 0;
}
},20);


// Open Class
function openClass(cls){
document.getElementById("classContent").classList.remove("hidden");
document.getElementById("classTitle").innerText = "Class " + cls;
}


// PDF Upload
const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");

dropArea.addEventListener("dragover",(e)=>e.preventDefault());

dropArea.addEventListener("drop",(e)=>{
e.preventDefault();
handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener("change",(e)=>{
handleFile(e.target.files[0]);
});

function handleFile(file){
const url = URL.createObjectURL(file);
document.getElementById("pdfViewer").innerHTML =
`<iframe src="${url}"></iframe>`;
}


// Google Form
function openForm(){
const link = document.getElementById("formLink").value;
window.open(link,"_blank");
}


// Save Contact Links
function saveLinks(){
localStorage.setItem("fb",fb.value);
localStorage.setItem("ig",ig.value);
localStorage.setItem("wa",wa.value);
alert("Saved!");
}function showTab(tab){
document.getElementById('notesTab').classList.add('hidden');
document.getElementById('mockTab').classList.add('hidden');

if(tab === 'notes'){
document.getElementById('notesTab').classList.remove('hidden');
}else{
document.getElementById('mockTab').classList.remove('hidden');
}
}function showTab(tab){
document.getElementById('notesTab').classList.add('hidden');
document.getElementById('mockTab').classList.add('hidden');

if(tab === 'notes'){
document.getElementById('notesTab').classList.remove('hidden');
}else{
document.getElementById('mockTab').classList.remove('hidden');
}
}