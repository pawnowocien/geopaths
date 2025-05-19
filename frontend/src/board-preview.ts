import { generateBoardSVG } from "./board-gen.js";
import { BoardPoint } from "./data-models.js";
import { setDim, setColor } from "./board-state.js";

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
    generateBoardSVG(boardData.width, boardData.height, boardData.type, gridElement, -1);
} else {
    console.error('Board data script tag not found or empty');
}