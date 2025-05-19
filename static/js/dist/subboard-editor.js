import { setDim, setColor, setStatic } from "./board-state.js";
import { generateBoardSVG } from "./board-gen.js";
const gridElement = document.querySelector('#grid');
const scriptTag1 = document.getElementById('board-data');
const scriptTag2 = document.getElementById('board-points');
if (scriptTag1 && scriptTag1.textContent && scriptTag2 && scriptTag2.textContent && gridElement) {
    const boardData = JSON.parse(scriptTag1.textContent);
    const boardPoints = JSON.parse(scriptTag2.textContent);
    setDim(boardData.height, boardData.width);
    for (const point of boardPoints) {
        setColor(point.row, point.col, point.color);
        setStatic(point.row, point.col);
    }
    generateBoardSVG(boardData.width, boardData.height, boardData.type, gridElement, -2);
}
else {
    console.error('Board data script tag not found or empty');
}
//# sourceMappingURL=subboard-editor.js.map