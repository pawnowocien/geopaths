import { getPaintColor } from "./color-state.js"

let point_map: string[][] = [[]];

let static_map: boolean[][] = [[]];

class Coords {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x, this.y = y;
    }
}

let coord_map: Coords[][] = [[]]

export function setDim(rows: number, cols: number): void {
    point_map = Array.from({ length: rows }, () => Array(cols).fill(""));
    static_map = Array.from({ length: rows }, () => Array(cols).fill(false));
    coord_map = Array.from({ length: rows }, () => Array(cols).fill(new Coords(0,0)))
}

export function getColor(row: number, col: number): string {
    return point_map[row][col];
}

export function setColor(row: number, col: number, color: string): void {
    point_map[row][col] = color;
}

export function setStatic(row: number, col: number) {
    static_map[row][col] = true;
}

export function isStatic(row: number, col: number) {
    return static_map[row][col]
}

export function getMap(): string[][]{
    return point_map;
}

export function setCoords(row: number, col: number, x: number, y:number): void {
    coord_map[row][col] = new Coords(x, y);
}


let lines_overlay: SVGElement | undefined = undefined;

export function setOverlay(grid: SVGElement) {
    lines_overlay = grid;
}

export function drawLine(row1: number, col1: number, row2: number, col2:number, width:number) {
    if (lines_overlay === undefined) return;

    const line_between = document.createElementNS('http://www.w3.org/2000/svg', 'line');


    let x1_str = coord_map[row1][col1].x.toString();
    let y1_str = coord_map[row1][col1].y.toString();
    let x2_str = coord_map[row2][col2].x.toString();
    let y2_str = coord_map[row2][col2].y.toString();


    console.log(x1_str, y1_str, x2_str, y2_str)

    line_between.setAttribute('x1', x1_str);
    line_between.setAttribute('y1', y1_str);
    line_between.setAttribute('x2', x2_str);
    line_between.setAttribute('y2', y2_str);
    line_between.setAttribute('stroke', getPaintColor())
    line_between.setAttribute('stroke-width', String(width));

    line_between.style.display = 'block';
    lines_overlay.appendChild(line_between)
}