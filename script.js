
let canvas = document.getElementById("paint");
let context = canvas.getContext("2d");

let backgroundbutton = document.getElementById("color-background");
let colourbutton = document.getElementById("color");
let clearbutton = document.getElementById("button-clear");
let erasebutton = document.getElementById("button-erase");
let pen = document.getElementById("button-pen");
let pensize = document.getElementById("pen-slidearea");
let tooltype = document.getElementById("tool-type");
let fontSelect = document.getElementById("font-select");
let undoStack = [];
let redoStack = [];

let textMode = false;
let erase_boolean = false;
let draw_boolean = false;


fontSelect.addEventListener("change", () => {
    context.font = `${pensize.value}px ${fontSelect.value}`;
});

document.getElementById("button-text").addEventListener("click", () => {
    textMode = true;
    tooltype.innerHTML = "Text";
});
// text function 
canvas.addEventListener("click", (e) => {
    if (textMode) {
        let text = prompt("Enter your text:");
        if (text) {
            context.fillText(text, e.offsetX, e.offsetY);
            saveState();
        }
    }
});

let mouseX = 0;
let mouseY = 0;
let rectLeft = canvas.getBoundingClientRect().left;
let rectTOP = canvas.getBoundingClientRect().top;

const getXy = (e) => {
    mouseX = (!touch() ? e.pageX : e.touches?.[0].pageX) - rectLeft;
    mouseY = (!touch() ? e.pageY : e.touches?.[0].pageY) - rectTOP;
};
// init function 


const init = () => {
    context.strokeStyle = "black";
    context.lineWidth = 1;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    tooltype.innerHTML = "Pen";
    canvas.style.backgroundColor = "#ffff";
    backgroundbutton.value = "#ffffff";
    saveState();
};

// touch detcting
const touch = () => {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};

// control drawing
const stopDrawing = () => {
    context.beginPath();
    draw_boolean = false;
};

const startDrawing = (e) => {
    draw_boolean = true;
    getXy(e);
    context.beginPath();
    context.moveTo(mouseX, mouseY);
};

// pen and erser function evemt
pen.addEventListener("click", () => {
    tooltype.innerHTML = "Pen";
    erase_boolean = false;
    textMode = false;
});

erasebutton.addEventListener("click", () => {
    erase_boolean = true;
    tooltype.innerHTML = "Eraser";
    textMode = false;
});

clearbutton.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor = backgroundbutton.value;
    saveState();
});

// dark mode function
let darkModeBtn = document.getElementById("toggle-darkmode");

function setDarkMode(isDark) {
    document.body.classList.toggle("dark", isDark);
    if (isDark) {
        darkModeBtn.textContent = "Light Mode";
        canvas.style.backgroundColor = "#121212"; 
        backgroundbutton.value = "#121212"; 
    } else {
        darkModeBtn.textContent = "🌙 Dark Mode";
        canvas.style.backgroundColor = "#ffffff"; 
        backgroundbutton.value = "#ffffff"; 
    }
    // save the theme to local storage
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Check for the user's saved preference on load
const savedTheme = localStorage.getItem("theme");
const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === "dark" || (savedTheme === null && isSystemDark)) {
    setDarkMode(true);
} else {
    setDarkMode(false);
}

// Add event listener to the button
darkModeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark");
    setDarkMode(!isDark);
});

// undo and redo function
function saveState() {
    undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > 50) undoStack.shift(); // prevent memory overflow
}
// undo button function
document.getElementById("button-undo").addEventListener("click", () => {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        let restore = undoStack[undoStack.length - 1];
        context.putImageData(restore, 0, 0);
    }
});
// redo button function
document.getElementById("button-redo").addEventListener("click", () => {
    if (redoStack.length > 0) {
        let restore = redoStack.pop();
        undoStack.push(restore);
        context.putImageData(restore, 0, 0);
    }
});

// mobile function 
const draw = (e) => {
    if (!draw_boolean) return;
    getXy(e);
// pen size
    context.lineWidth = pensize.value || 2;
    context.lineCap = "round";
    context.lineJoin = "round";
// erase function 
    if (erase_boolean) {
        context.globalCompositeOperation = "destination-out";
        context.strokeStyle = "rgba(0,0,0,1)";
    } else {
        context.globalCompositeOperation = "source-over";
        context.strokeStyle = colourbutton.value || "black";
    }

    context.lineTo(mouseX, mouseY);
    context.stroke();
    context.beginPath();
    context.moveTo(mouseX, mouseY);
};

// events function
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

canvas.addEventListener("touchstart", startDrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDrawing);

// mobile touch detection
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startDrawing(e);
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    draw(e);
}, { passive: false });

canvas.addEventListener("touchend", stopDrawing);


// ===== On Load =====
window.onload = init;
