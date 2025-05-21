import { SVGPolygon } from "./svg-polygon.js";
import { SVGPolygonExtended } from "./svg-polygon-ext.js";
import { BoardPoint } from "./data-models.js";
import { SVGPolygonStatic } from "./svg-polygon-static.js"
import { SVGPolygonSubboard } from "./svg-polygon-subboard.js"
import { setOverlay, setSides, setRad } from "./board-state.js"

export function generateBoardSVG(width: number, height: number, sides: number, gridElement: SVGSVGElement, 
                                boardId?: number): void {

    function newPolygon(x: number, y: number, radius: number, sides: number, row: number, col: number, rotation: number = 0) : SVGPolygon {
        if (boardId === undefined) {
            return new SVGPolygon(x, y, radius, sides, row, col, rotation);
        } else if (boardId === -1) {
            return new SVGPolygonStatic(x, y, radius, sides, row, col, rotation)
        } else if (boardId === -2) {
            return new SVGPolygonSubboard(x, y, radius, sides, row, col, rotation, boardId)
        } else {
            return new SVGPolygonExtended(x, y, radius, sides, row, col, rotation, boardId);
        }
    }

    gridElement.innerHTML = ''; // Clear previous SVG elements
    
    setSides(sides)

    const cols = width;
    const rows = height;

    const svgWidth = gridElement.clientWidth;
    const svgHeight = gridElement.clientHeight;

    let space_between = 1;
    let rad = -1;

    let a;
    let max_w = 0;
    let max_h = 0;
    let x_offset;

    switch (sides) {
        case 3:
            max_w = 2 * (svgWidth - space_between) / (cols + 1) - space_between;
            max_h = (svgHeight - space_between) / rows - 2 * space_between; // I'm too tired to figure out the actual math, so this approximation will do
            max_h *= 2 / Math.sqrt(3);
            a = Math.min(max_w, max_h);
            rad = a / Math.sqrt(3);

            x_offset = (svgWidth - (a / 2 + space_between + (space_between + a) * cols / 2)) / 2

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    let shape: SVGPolygon;
                    const x = x_offset + a / 2 + space_between + (space_between + a) * col / 2;
                    let y = rad / 2 + space_between + row * (3 * rad / 2 + 2 * space_between);

                    if ((row + col) % 2 === 0) {
                        shape = newPolygon(x, y, rad, sides, row, col, Math.PI);
                    } else {
                        y += rad / 2 + space_between;
                        shape = newPolygon(x, y, rad, sides, row, col);
                    }
                    gridElement.appendChild(shape.draw());
                }
            }
            break;


        case 4:
            max_w = (svgWidth - space_between) / cols;
            max_h = (svgHeight - space_between) / rows;
            let spacing = Math.min(max_w, max_h);

            a = spacing - space_between;
            rad = Math.sqrt(2) * a / 2;

            x_offset = (svgWidth - (spacing * cols + space_between)) / 2

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = x_offset + a / 2 + spacing * col + space_between;
                    const y = a / 2 + spacing * row + space_between;
                    const shape = newPolygon(x, y, rad, sides, row, col);
                    gridElement.appendChild(shape.draw());
                }
            }
            break;
        case 6:
            max_w = (svgWidth - space_between * (cols + 1)) / (1 + 2 * cols);
            max_h = 2 * (svgHeight - space_between - space_between * rows) / (3 * rows + 1);
            max_h *= Math.sqrt(3) / 2;
            let s_r = Math.min(max_w, max_h);
            rad = 2 * s_r / Math.sqrt(3);

            x_offset = (svgWidth - (s_r + (2 * s_r + space_between) * cols + space_between)) / 2
            console.log(x_offset)

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = x_offset + s_r + (2 * s_r + space_between) * col + space_between;
                    const y = rad + (3 * rad / 2 + space_between) * row + space_between;

                    let shape: SVGPolygon;
                    if (row % 2 === 0) {
                        shape = newPolygon(x, y, rad, sides, row, col, Math.PI / 2);
                    } else {
                        shape = newPolygon(x + s_r + space_between / 2, y, rad, sides, row, col, Math.PI / 2);
                    }
                    gridElement.appendChild(shape.draw());
                }
            }
            break;
        default:
            break;
    }
    setRad(rad)

    if (boardId === -2) {
        const lines = document.createElementNS("http://www.w3.org/2000/svg", "g");
        gridElement.appendChild(lines);
        setOverlay(lines)
    }
}