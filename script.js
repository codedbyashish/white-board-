// initial refernence

let colorsRef=document.getElementsByClassName("colors")
let canvas=document.getElementById("canvas")
let backgroundbutton=document.getElementById("color-background")
let colourbutton=document.getElementById("color-input")
let clearbutton=document.getElementById("button-clear")
let erasebutton=document.getElementById("button-erase")
let pen=document.getElementById("button-pen")
let pensize=document.getElementById("pen-slidearea")
let tooltype=document.getElementById("tool-type")

// when using not using both  earse or drwing 
let ease_boolean=false
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
const init =()=>{
context.strokeStyle="black"
context.lineWidth=1;
canvas.style.width=  "100%" 
canvas.style.height="100%"
canvas.width=canvas.offsetWidth;
canvas.height=canvas.offsetHeight;
// range of pen tittle 
tooltype.innerHTML=" Pen"
canvas.style.backgroundColor="#ffff"
backgroundbutton.value="#ffffff";
buttonPen.innerText = context.strokeStyle;

}


window.onload=init();



