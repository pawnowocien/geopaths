import { generateBoardSVG } from "./board-gen.js";
import { setColor } from "./color-state.js"; // <-- Import state functions
const colorBoxes = document.querySelectorAll('.color');
console.log('Color boxes:', colorBoxes[0]);
const SELECTED_CLASSES = ['border-2', 'border-blue-600', 'inset-ring-2', 'inset-ring-white'];
function clearSelection() {
    colorBoxes.forEach(box => {
        box.classList.remove(...SELECTED_CLASSES);
    });
}
colorBoxes.forEach(box => {
    box.addEventListener('click', () => {
        const color = box.getAttribute('color');
        if (color) {
            setColor(color);
        }
        else {
            setColor('');
        }
        clearSelection();
        box.classList.add(...SELECTED_CLASSES);
        // console.log('Selected color:', getColor());
    });
});
const eraserBox = document.getElementById('eraser');
if (eraserBox) {
    eraserBox.classList.add(...SELECTED_CLASSES);
}
const gridElement = document.querySelector('#grid');
const scriptTag1 = document.getElementById('board-data');
const scriptTag2 = document.getElementById('board-points');
if (scriptTag1 && scriptTag1.textContent && scriptTag2 && scriptTag2.textContent && gridElement) {
    const boardData = JSON.parse(scriptTag1.textContent);
    const boardPoints = JSON.parse(scriptTag2.textContent);
    // console.log(boardData);
    // console.log(boardPoints)
    // console.log('Width:', boardData.width);
    // console.log('Height:', boardData.height);
    // console.log('Shape:', boardData.type);
    let points = [];
    ;
    for (const point of boardPoints) {
        points.push({
            row: point.row,
            col: point.col,
            id: point.id,
            color: point.color,
        });
    }
    generateBoardSVG(boardData.width, boardData.height, boardData.type, gridElement, boardData.id, points);
}
else {
    console.error('Board data script tag not found or empty');
}
//# sourceMappingURL=board-edit.js.map