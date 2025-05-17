import { generateBoardSVG } from "./board-gen.js";
import { BoardPoint } from "./data-models.js";

const gridElement = document.querySelector<SVGSVGElement>('#grid');

const scriptTag1 = document.getElementById('board-data');
const scriptTag2 = document.getElementById('board-points');

if (scriptTag1 && scriptTag1.textContent && scriptTag2 && scriptTag2.textContent && gridElement) {
    const boardData = JSON.parse(scriptTag1.textContent);
    const boardPoints = JSON.parse(scriptTag2.textContent);
    console.log(boardData);
    console.log(boardPoints)

    console.log('Width:', boardData.width);
    console.log('Height:', boardData.height);
    console.log('Shape:', boardData.type);

    let points: BoardPoint[] = [];;
    for (const point of boardPoints) {
        points.push({
            row: point.row,
            col: point.col,
            id: point.id,
            color: point.color,
        });
    }
    
    generateBoardSVG(boardData.width, boardData.height, boardData.type, gridElement, boardData.id, points);
} else {
    console.error('Board data script tag not found or empty');
}