import { PolygonConstructor } from "./svg-polygon.js"; // Import the SVGPolygon class
import { SVGPolygon } from "./svg-polygon.js"; // Import the SVGPolygon class
import { SVGPolygonExtended } from "./svg-polygon-ext.js"; // Import the SVGPolygon class
import { BoardPoint } from "./data-models.js";


export function generateBoardSVG(width: number, height: number, sides: number, gridElement: SVGSVGElement, 
                                boardId?: number, boardPoints?: BoardPoint[] | null

): void {
    function newPolygon(x: number, y: number, radius: number, sides: number, row: number, col: number, rotation: number = 0) : SVGPolygon {
        if (boardId !== undefined) {
            for (const point of boardPoints || []) {
                if (point.row === row && point.col === col) {
                    return new SVGPolygonExtended(x, y, radius, sides, row, col, rotation, boardId, "#000000");
                }
            }
            return new SVGPolygonExtended(x, y, radius, sides, row, col, rotation, boardId, "");
        } else {
            return new SVGPolygon(x, y, radius, sides, row, col, rotation);
        }
    }

    gridElement.innerHTML = ''; // Clear previous SVG elements

    const cols = width;
    const rows = height;

    const svgWidth = gridElement.clientWidth;
    const svgHeight = gridElement.clientHeight;

    let space_between = 1;
    let rad = 40;

    let a;
    let max_w = 0;
    let max_h = 0;

    switch (sides) {
        case 3:
            max_w = 2 * (svgWidth - space_between) / (cols + 1) - space_between;
            max_h = (svgHeight - space_between) / rows - 2 * space_between; // I'm too tired to figure out the actual math, so this approximation will do
            max_h *= 2 / Math.sqrt(3);
            a = Math.min(max_w, max_h);
            rad = a / Math.sqrt(3);

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    let shape: SVGPolygon;
                    const x = a / 2 + space_between + (space_between + a) * col / 2;
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

            a = (spacing - space_between);
            rad = Math.sqrt(2) * a / 2;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = a / 2 + spacing * col + space_between;
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

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = s_r + (2 * s_r + space_between) * col + space_between;
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
}