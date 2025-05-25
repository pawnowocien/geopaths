import { Tile, Path } from "./path.js"


let point_map: string[][] = [[]];
let static_map: boolean[][] = [[]];
let path_map: boolean[][] = [[]]
let sides: number = 4;
let board_id: number = -1;
let radius: number = -1

export class Coords {
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
    path_map = Array.from({ length: rows }, () => Array(cols).fill(false));
    coord_map = Array.from({ length: rows }, () => Array(cols).fill(new Coords(0,0)))
}

export function getColor(row: number, col: number): string {
    return point_map[row][col];
}

export function setColor(row: number, col: number, color: string): void {
    point_map[row][col] = color;
}

export function getColorMap(): string[][] {
    return point_map
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

export function getCoords(tile: Tile): Coords {
    return coord_map[tile.row][tile.col];
}

export function setSides(s: number) {
    sides = s;
}

export function setId(id: number) {
    board_id = id;
}

export function setRad(rad: number) {
    radius = rad / 3
}

export function getBoardId(): number {
    return board_id;
}

export const eraseMaps = (tiles: Tile[]): void => {
    tiles.forEach(tile => {
        if (!isStatic(tile.row, tile.col)) {
            setColor(tile.row, tile.col, "");
        }
        path_map[tile.row][tile.col] = false;
    });
};


export let lines_overlay: SVGElement | undefined = undefined;

export function setOverlay(grid: SVGElement) {
    lines_overlay = grid;
}

function areNeighbors(row1: number, col1: number, row2: number, col2: number): Boolean {
    switch(sides) {
        case 3:
            if (Math.abs(col2 - col1) === 1 && row2 == row1) return true;
            if (col2 == col1) {
                if ((row1 + col1) % 2 === 0 && row2 === row1 - 1) return true;
                if ((row1 + col1) % 2 === 1 && row2 === row1 + 1) return true;
            }
            return false;
        case 4:
            return (Math.abs(row2 - row1) + Math.abs(col2 - col1) === 1);
        case 6:
            if (row2 === row1 && Math.abs(col2 - col1) === 1) return true;
            if (Math.abs(row2 - row1) === 1) {
                if (row1 % 2 === 0) {
                    if (col2 === col1 - 1 || col2 === col1) return true;
                } else {
                    if (col2 === col1 || col2 === col1 + 1) return true;
                }
            }
            return false;
        default:
            return false;
    }
}


export function createPath(color: string, points: [number, number][]): void {
    const tiles: Tile[] = points.map(([x, y]) => new Tile(x, y));

    for (const point of points) {
        setColor(point[0], point[1], color)
        path_map[point[0]][point[1]] = true;
    }

    new Path(tiles, color, radius, true);
}

let curr_path: Path | null = null;

export function resetCurrPath(): void {
    if (curr_path === null) return;

    eraseMaps(curr_path.tiles);
    curr_path = null;
}

function get_last_tile(): Tile {
    if (curr_path === null) return new Tile(-10, -10);
    return curr_path.get_last_tile();
}

export function handleClick(row: number, col: number): void {
    if (path_map[row][col]) {
        return;
    }

    // Start of the path
    if (curr_path === null && isStatic(row, col)) {
        curr_path = new Path([new Tile(row, col)], getColor(row, col), radius, false);
        path_map[row][col] = true;
        return;
    }
    // Next tile
    if (curr_path !== null && areNeighbors(get_last_tile().row, get_last_tile().col, row, col) && getColor(row, col) === "") {
        curr_path.add_point(new Tile(row, col));
        path_map[row][col] = true;
        setColor(row, col, curr_path.color);
        return;
    }
    // Last tile
    if (curr_path !== null && areNeighbors(get_last_tile().row, get_last_tile().col, row, col) && isStatic(row, col) && getColor(row, col) === curr_path.color) {
        curr_path.finish(new Tile(row, col))
        path_map[row][col] = true;

        // reset_path();
        curr_path = null;
        return;
    }
    console.log("e");
}

export function handleClickPoly(row: number, col:number): void {
    if (curr_path !== null) {
        handleClick(row, col)
        if (curr_path.tiles.length >= 2)
            curr_path.check_to_remove(row, col);
    }
}

export function handleHoverEnd(row: number, col: number): void {
    if (path_map[row][col]) {
        return;
    }

    if (curr_path !== null && areNeighbors(get_last_tile().row, get_last_tile().col, row, col) && isStatic(row, col) && getColor(row, col) === curr_path.color) {
        curr_path.finish(new Tile(row, col))
        path_map[row][col] = true;
        curr_path = null;
        return;
    }
}

export function handleHoverMiddle(row: number, col: number): void {
    if (curr_path === null) return;

    curr_path.check_to_remove(row, col)

    if (path_map[row][col]) {
        return;
    }
    if (curr_path !== null && areNeighbors(get_last_tile().row, get_last_tile().col, row, col) && getColor(row, col) === "") {
        curr_path.add_point(new Tile(row, col));
        path_map[row][col] = true;
        setColor(row, col, curr_path.color);
        return;
    }
}