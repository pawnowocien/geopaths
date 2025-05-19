import { generateBoardSVG } from "./board-gen.js";
import { BoardPoint } from "./data-models.js";
import { setPaintColor } from "./color-state.js";
import { setDim, setColor } from "./board-state.js";



const colorBoxes = document.querySelectorAll<HTMLDivElement>('.color');

console.log('Color boxes:', colorBoxes[0]);

const UNSELECTED_CLASSES = ['border-black']
const SELECTED_CLASSES = ['border-blue-300'];

function clearSelection() {
    colorBoxes.forEach(box => {
        box.classList.remove(...SELECTED_CLASSES);
        box.classList.add(...UNSELECTED_CLASSES);
    });
}

colorBoxes.forEach(box => {
    box.addEventListener('click', () => {
        const color = box.getAttribute('color');
        if (color) {
            setPaintColor(color);
        } else {
            setPaintColor('');
        }

        clearSelection();
        box.classList.remove(...UNSELECTED_CLASSES);
        box.classList.add(...SELECTED_CLASSES);
    });
});

const eraserBox = document.getElementById('eraser');
if (eraserBox) {
  eraserBox.classList.remove(...UNSELECTED_CLASSES);
  eraserBox.classList.add(...SELECTED_CLASSES);
}



const gridElement = document.querySelector<SVGSVGElement>('#grid');

const scriptTag1 = document.getElementById('board-data');
const scriptTag2 = document.getElementById('board-points');

if (scriptTag1 && scriptTag1.textContent && scriptTag2 && scriptTag2.textContent && gridElement) {
    const boardData = JSON.parse(scriptTag1.textContent);
    const boardPoints = JSON.parse(scriptTag2.textContent);
    
    setDim(boardData.height, boardData.width)
    if (boardPoints !== undefined) {
        for (const point of boardPoints || []) {
            setColor(point.row, point.col, point.color)
        }
    }
    generateBoardSVG(boardData.width, boardData.height, boardData.type, gridElement, boardData.id);
} else {
    console.error('Board data script tag not found or empty');
}