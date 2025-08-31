// initial refernence
// all event picked
let canvas = document.getElementById("paint");
let colorsRef=document.getElementsByClassName("colors")
let backgroundbutton=document.getElementById("color-background")
let colourbutton=document.getElementById("color")
let clearbutton=document.getElementById("button-clear")
let erasebutton=document.getElementById("button-erase")
let pen=document.getElementById("button-pen")
let pensize=document.getElementById("pen-slidearea")
let tooltype=document.getElementById("tool-type")
let fontSelect = document.getElementById("font-select");
let undoStack = [];
let redoStack = [];

fontSelect.addEventListener("change", () => {
    context.font = `${pensize.value}px ${fontSelect.value}`;
});
let textMode = false;

document.getElementById("button-text").addEventListener("click", () => {
    textMode = true;
    tooltype.innerHTML = "Text";
});

canvas.addEventListener("click", (e) => {
    if (textMode) {
        let text = prompt("Enter your text:");
        if (text) {
            context.fillText(text, e.offsetX, e.offsetY);
        }
    }
});

// when using not using both  earse or drwing 
let erase_boolean=false
let draw_boolean=false

// canavs work
let context=canvas.getContext("2d")

//  intialy mouse  x=0, y=0 cordiantes afteer the real time cordition
let mouseX=0;
let mouseY=0;

//  make the break user canoot go outside canvas 
let rectLeft=canvas.getBoundingClientRect().left;

let rectTOP=canvas.getBoundingClientRect().top;

// intial feautres 
const init = ()=>{
    context.strokeStyle="black"
    context.lineWidth=1;
    canvas.style.width= "100%" 
    canvas.style.height="100%"
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    tooltype.innerHTML=" Pen"
    canvas.style.backgroundColor="#ffff"
    backgroundbutton.value="#ffffff";
    pen.innerText = context.strokeStyle;
}
//  detect the touch device 
const touch= ()=>{
    try{
        //  create the touch event 
     document.createEvent("TouchEvent");
     return true
    }
    catch(e){
        return false
    }
}

// tracking the mouse activity x y coridnates 

const getXy=(e)=>{
    mouseX=(!touch() ? e.pageX : e.touch?.[0].pageX)-rectLeft;
    mouseY=(!touch() ? e.pageY : e.touch?.[0] .pageY)-rectTOP
}
const stopDrawing=()=>{
    context.beginPath();
    draw_boolean=false

}
// drwing working 

const stratdrawing=(e)=>{
    draw_boolean=true
    getXy(e);
    context.beginPath();
    context.moveTo(mouseX,mouseY);
}

// mouse when click works the pen only after stop begon new patch 

canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("touchend", stopDrawing);


// mouse is stoped clicked 
canvas.addEventListener("mouseleave", stopDrawing);

// button pen for mode 

pen.addEventListener("click", ()=>{
    tooltype.innerHTML="Pen"
    erase_boolean=false
})
// button fo erasr mode
erasebutton.addEventListener("click", ()=>{
    erase_boolean=true
    tooltype.innerHTML="Eraser"
})
clearbutton.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor = backgroundbutton.value;
});

// toggle button working  
let darkModeBtn = document.getElementById("toggle-darkmode");

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    darkModeBtn.textContent = document.body.classList.contains("dark") 
        ? " 💡Light Mode" 
        : "🌙 Dark Mode";
});
// togglr button condition 
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "Light Mode";
}
// even of toogle button
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  toggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function saveState() {
  let canvas = document.getElementById("paint");
  let ctx = canvas.getContext("2d");
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}
// function for undo button
document.getElementById("button-undo").addEventListener("click", () => {
  if (undoStack.length > 0) {
    let canvas = document.getElementById("paint");
    let ctx = canvas.getContext("2d");
    redoStack.push(undoStack.pop());
    let restore = undoStack[undoStack.length - 1];
    if (restore) ctx.putImageData(restore, 0, 0);
  }
});

// redo button function 

document.getElementById("button-redo").addEventListener("click", () => {
  if (redoStack.length > 0) {
    let canvas = document.getElementById("paint");
    let ctx = canvas.getContext("2d");
    let restore = redoStack.pop();
    if (restore) {
      undoStack.push(restore);
      ctx.putImageData(restore, 0, 0);
    }
  }
});

// draw function

// ===== Draw function =====
const draw = (e) => {
    if (!draw_boolean) return; // agar pen dabaya nahi hai to kuch mat karo
    getXy(e); // mouse/touch position nikalna

    context.lineWidth = pensize.value || 2; // slider se size
    context.lineCap = "round";
    context.lineJoin = "round";

    if (erase_boolean) {
        // Eraser mode
        context.globalCompositeOperation = "destination-out";
        context.strokeStyle = "rgba(0,0,0,1)";
    } else {
        // Pen mode
        context.globalCompositeOperation = "source-over";
        context.strokeStyle = colourbutton.value || "black";
    }

    context.lineTo(mouseX, mouseY);
    context.stroke();
    context.beginPath();
    context.moveTo(mouseX, mouseY);
};

// ===== Bind events =====
canvas.addEventListener("mousedown", stratdrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("touchstart", stratdrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });





window.onload = init;



