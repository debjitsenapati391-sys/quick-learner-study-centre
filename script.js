// ================== LOCK SYSTEM ==================
document.body.classList.add("locked");

function showAdmin(){
document.getElementById("adminLogin").style.display = "block";
}

function checkAdmin(){
const pass = document.getElementById("adminPass").value;

if(pass === "admin@12345"){
unlockSite(true);
}else{
alert("Wrong Password");
}
}

function enterStudent(){
unlockSite(false);
}

function unlockSite(isAdmin){
document.getElementById("entryScreen").style.display = "none";
document.body.classList.remove("locked");

// show content
document.getElementById("classes").classList.remove("hidden");

if(isAdmin){
document.getElementById("dropArea").style.display = "block";
document.getElementById("fileInput").style.display = "block";
}else{
document.getElementById("dropArea").style.display = "none";
document.getElementById("fileInput").style.display = "none";
}
}


// ================== TYPING EFFECT ==================
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


// ================== SLIDER ==================
const slider = document.getElementById("slider");

if(slider){
setInterval(()=>{
slider.scrollLeft += 1;

if(slider.scrollLeft >= slider.scrollWidth - slider.clientWidth){
slider.scrollLeft = 0;
}
},20);
}


// ================== CLASS OPEN ==================
function openClass(cls){
document.getElementById("classContent").classList.remove("hidden");
document.getElementById("classTitle").innerText = "Class " + cls;
}


// ================== FIREBASE PDF UPLOAD ==================


const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");

if(dropArea && fileInput){

dropArea.addEventListener("dragover",(e)=>e.preventDefault());

dropArea.addEventListener("drop",(e)=>{
e.preventDefault();
handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener("change",(e)=>{
handleFile(e.target.files[0]);
});

}

function handleFile(file){
if(!file) return;

const storageRef = ref(window.storage, 'pdfs/' + file.name);

uploadBytes(storageRef, file).then(() => {
getDownloadURL(storageRef).then((url) => {
document.getElementById('pdfViewer').innerHTML =
`<iframe src="${url}" width="100%" height="500px"></iframe>`;
});
});
}


// ================== GOOGLE FORM ==================
function openForm(){
const link = document.getElementById("formLink").value;
if(link){
window.open(link,"_blank");
}
}


// ================== CONTACT SAVE ==================
function saveLinks(){
localStorage.setItem("fb",document.getElementById("fb").value);
localStorage.setItem("ig",document.getElementById("ig").value);
localStorage.setItem("wa",document.getElementById("wa").value);
alert("Saved!");
}


// ================== TAB SWITCH ==================
function showTab(tab){
document.getElementById('notesTab').classList.add('hidden');
document.getElementById('mockTab').classList.add('hidden');

if(tab === 'notes'){
document.getElementById('notesTab').classList.remove('hidden');
}else{
document.getElementById('mockTab').classList.remove('hidden');
}
}