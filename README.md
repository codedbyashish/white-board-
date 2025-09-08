Canvas Drawing App 🎨🖌️

A simple, modern whiteboard/canvas web app built with HTML, CSS, and JavaScript. Designed for drawing, sketching, and quick notes — includes a control panel with pen settings, color pickers, background controls, text insertion, and a dark mode. Screenshots provided by the project owner were used as reference.

🚀 Demo / Overview

This app provides a large drawing surface and a bottom control panel with tools and options. It supports mouse and (partially) touch interactions for drawing freehand strokes.

📸 Screenshots:

Light Mode ✨

<img width="650" height="650" alt="image" src="https://github.com/user-attachments/assets/b9075a38-f7df-4927-8bd6-4fd4fa414bba" />



Dark Mode 🌙



<img width="650" height="650" alt="image" src="https://github.com/user-attachments/assets/0396c56b-bd1c-46f1-a337-2d1af5050408" />


Drawing Example 🖊️





Color Picker 🎨

<img width="650" height="650" alt="image" src="https://github.com/user-attachments/assets/023a64f6-c9f8-4fb4-a879-d838f5b7a76c" />


✨ Features

🖊️ Pen tool — draw freehand on the canvas.

🎛️ Pen size slider — change stroke thickness with a range input.

🎨 Color picker — open color palette to pick any color for pen.

🧽 Eraser — switch to eraser mode to remove strokes.

⤴️ Undo — undo the last drawing action.

⤵️ Redo — redo an undone action.

🧹 Clear — clear the entire canvas.

✍️ Text mode — add editable text to the canvas, with font selection.

🖼️ Background color — change the canvas background color.

🌗 Dark / Light Mode toggle — whole UI switches theme.

🖱️ Mouse & Touch support — works with mouse; touch listeners added for touchstart/touchmove/touchend (basic support).

🔁 Responsive layout — UI adapts to wide screens; control panel fixed at bottom.


🗂️ Project Structure

canvas-drawing-app/
├─ index.html # main HTML file
├─ styles.css # all app styles (light/dark themes + layout)
├─ script.js # canvas logic, drawing, undo/redo, color picker hooks
├─ screenshots/ # UI screenshots
└─ README.md # this file

🛠️ Implementation Details
HTML

A full-width <canvas> element inside a container.

Bottom control panel with labeled controls: pen size, color button/input, undo/redo/clear buttons, pen/erase/text toggles, font <select>, and a background color control.

A toggle button for dark/light mode placed at the top-right.


CSS

Dark theme uses deep navy/dark purple background for the control panel and borders.

Rounded buttons, pill-shaped controls, and subtle shadows for a modern look.

Responsive spacing so the toolbar stays usable on wide screens.


JavaScript

Setup canvas with canvas.width/canvas.height sized to the viewport or container and handle window resize.

Mouse events: mousedown, mousemove, mouseup, mouseout to draw strokes.

Touch events: touchstart, touchmove, touchend with e.preventDefault() for smooth drawing on touch devices.

Stroke drawing uses ctx.beginPath(), ctx.moveTo(), ctx.lineTo() and ctx.strokeStyle / ctx.lineWidth.

Undo/Redo implemented by saving canvas snapshots (toDataURL() or getImageData) into stacks.

Color picker uses native <input type="color"> or a custom color palette popup.

Text insertion: draw text on canvas using ctx.fillText() at click coordinates; optionally support an overlay input for editable text.
