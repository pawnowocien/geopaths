import { generateBoardSVG } from "./board-gen.js";
import { SVGPolygonExtended } from "./svg-polygon-ext.js";
const gridElement = document.querySelector('#grid');
const boardConfig = document.getElementById('board-config');
if (boardConfig && gridElement) {
    const width = parseInt(boardConfig.getAttribute('data-width'));
    const height = parseInt(boardConfig.getAttribute('data-height'));
    const shape = parseInt(boardConfig.getAttribute('data-shape'));
    console.log('Width:', width);
    console.log('Height:', height);
    console.log('Shape:', shape);
    generateBoardSVG(width, height, shape, gridElement, SVGPolygonExtended);
}
else {
    console.error('Board config or SVG grid not found.');
}
//# sourceMappingURL=board-edit.js.map