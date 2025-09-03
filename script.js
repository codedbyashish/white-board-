// ===== Initial references =====
let canvas = document.getElementById("paint");
let context = canvas.getContext("2d"); // moved UP so context is available everywhere

let colorsRef = document.getElementsByClassName("colors");
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
let shapeMode = null; // "line", "rect", "circle"

// ===== Font change =====
fontSelect.addEventListener("change", () => {
    context.font = `${pensize.value}px ${fontSelect.value}`;
});

document.getElementById("button-text").addEventListener("click", () => {
    textMode = true;
    tooltype.innerHTML = "Text";
});

canvas.addEventListener("click", (e) => {
    if (textMode) {
        let text = prompt("Enter your text:");
        if (text) {
            context.fillText(text, e.offsetX, e.offsetY);
            saveState();
        }
    }
});

// ===== Mouse coordinates =====
let mouseX = 0;
let mouseY = 0;
let rectLeft = canvas.getBoundingClientRect().left;
let rectTOP = canvas.getBoundingClientRect().top;

const getXy = (e) => {
    mouseX = (!touch() ? e.pageX : e.touches?.[0].pageX) - rectLeft;
    mouseY = (!touch() ? e.pageY : e.touches?.[0].pageY) - rectTOP;
};

// ===== Init =====
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
    pen.innerText = context.strokeStyle;
    saveState();
};

// ===== Touch detection =====
const touch = () => {
    try {
        document.createEvent("TouchEvent");
        return true;
    } catch (e) {
        return false;
    }
};

// ===== Drawing control =====
const stopDrawing = () => {
    context.beginPath();
    draw_boolean = false;
};

const stratdrawing = (e) => {
    draw_boolean = true;
    getXy(e);
    context.beginPath();
    context.moveTo(mouseX, mouseY);
};

// ===== Pen & Eraser =====
pen.addEventListener("click", () => {
    tooltype.innerHTML = "Pen";
    erase_boolean = false;
    shapeMode = null;
});

erasebutton.addEventListener("click", () => {
    erase_boolean = true;
    tooltype.innerHTML = "Eraser";
    shapeMode = null;
});

clearbutton.addEventListener("click", () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor = backgroundbutton.value;
    saveState();
});

// ===== Dark Mode =====
let darkModeBtn = document.getElementById("toggle-darkmode");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    darkModeBtn.textContent = "Light Mode";
}

darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    darkModeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ===== Undo/Redo =====
function saveState() {
    undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > 50) undoStack.shift(); // prevent memory overflow
}

document.getElementById("button-undo").addEventListener("click", () => {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        let restore = undoStack[undoStack.length - 1];
        context.putImageData(restore, 0, 0);
    }
});

document.getElementById("button-redo").addEventListener("click", () => {
    if (redoStack.length > 0) {
        let restore = redoStack.pop();
        undoStack.push(restore);
        context.putImageData(restore, 0, 0);
    }
});

// ===== Draw function =====
const draw = (e) => {
    if (!draw_boolean || shapeMode) return;
    getXy(e);

    context.lineWidth = pensize.value || 2;
    context.lineCap = "round";
    context.lineJoin = "round";

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

// ===== Shape Tools =====
document.getElementById("button-rect").addEventListener("click", () => {
    shapeMode = "rect";
    tooltype.innerHTML = "Rectangle";
});

document.getElementById("button-circle").addEventListener("click", () => {
    shapeMode = "circle";
    tooltype.innerHTML = "Circle";
});

let startX, startY;

canvas.addEventListener("mousedown", (e) => {
    if (shapeMode) {
        getXy(e);
        startX = mouseX;
        startY = mouseY;
        draw_boolean = true;
    } else {
        stratdrawing(e);
    }
});

canvas.addEventListener("mouseup", (e) => {
    if (shapeMode && draw_boolean) {
        getXy(e);
        let w = mouseX - startX;
        let h = mouseY - startY;

        context.lineWidth = pensize.value;
        context.strokeStyle = colourbutton.value;

        if (shapeMode === "rect") {
            context.strokeRect(startX, startY, w, h);
        } else if (shapeMode === "circle") {
            let r = Math.sqrt(w * w + h * h);
            context.beginPath();
            context.arc(startX, startY, r, 0, Math.PI * 2);
            context.stroke();
        }
        draw_boolean = false;
        saveState();
    } else {
        stopDrawing();
    }
});

// ===== Events =====
canvas.addEventListener("mousedown", stratdrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

canvas.addEventListener("touchstart", stratdrawing, { passive: false });
canvas.addEventListener("touchmove", draw, { passive: false });
canvas.addEventListener("touchend", stopDrawing);

// ===== On Load =====
window.onload = init;
