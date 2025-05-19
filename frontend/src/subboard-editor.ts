import { setDim, setColor, setStatic, setId, createPath } from "./board-state.js"
import { generateBoardSVG } from "./board-gen.js";

const gridElement = document.querySelector<SVGSVGElement>('#grid');
const scriptTag1 = document.getElementById('board-data');
const scriptTag2 = document.getElementById('board-points');
const scriptTag3 = document.getElementById('subboard-data');
const scriptTag4 = document.getElementById('paths-data');


if (scriptTag1 && scriptTag1.textContent && scriptTag2 && scriptTag2.textContent && scriptTag3 && scriptTag3.textContent && scriptTag4 && scriptTag4.textContent && gridElement) {
    const boardData = JSON.parse(scriptTag1.textContent);
    const boardPoints = JSON.parse(scriptTag2.textContent);
    const subboardData = JSON.parse(scriptTag3.textContent);
    const pathData = JSON.parse(scriptTag4.textContent)
    
    console.log(pathData)

    setDim(boardData.height, boardData.width);
    setId(subboardData.id)
    for (const point of boardPoints) {
        setColor(point.row, point.col, point.color)
        setStatic(point.row, point.col)
    }
    
    generateBoardSVG(boardData.width, boardData.height, boardData.type, gridElement, -2);
    for (const path of pathData) {
        createPath(path.color, path.points);
    }

} else {
    console.error('Board data script tag not found or empty');
}