import { Tile, Path } from "./path.js";
let point_map = [[]];
let static_map = [[]];
let path_map = [[]];
let sides = 4;
let board_id = -1;
let radius = -1;
export class Coords {
    constructor(x, y) {
        this.x = x, this.y = y;
    }
}
let coord_map = [[]];
export function setDim(rows, cols) {
    point_map = Array.from({ length: rows }, () => Array(cols).fill(""));
    static_map = Array.from({ length: rows }, () => Array(cols).fill(false));
    path_map = Array.from({ length: rows }, () => Array(cols).fill(false));
    coord_map = Array.from({ length: rows }, () => Array(cols).fill(new Coords(0, 0)));
}
export function getColor(row, col) {
    return point_map[row][col];
}
export function setColor(row, col, color) {
    point_map[row][col] = color;
}
export function getColorMap() {
    return point_map;
}
export function setStatic(row, col) {
    static_map[row][col] = true;
}
export function isStatic(row, col) {
    return static_map[row][col];
}
export function getMap() {
    return point_map;
}
export function setCoords(row, col, x, y) {
    coord_map[row][col] = new Coords(x, y);
}
export function getCoords(tile) {
    return coord_map[tile.row][tile.col];
}
export function setSides(s) {
    sides = s;
}
export function setId(id) {
    board_id = id;
}
export function setRad(rad) {
    radius = rad / 3;
}
export function getBoardId() {
    return board_id;
}
export const eraseMaps = (tiles) => {
    tiles.forEach(tile => {
        if (!isStatic(tile.row, tile.col)) {
            setColor(tile.row, tile.col, "");
        }
        path_map[tile.row][tile.col] = false;
    });
};
export let lines_overlay = undefined;
export function setOverlay(grid) {
    lines_overlay = grid;
}
function areNeighbors(row1, col1, row2, col2) {
    switch (sides) {
        case 3:
            if (Math.abs(col2 - col1) === 1 && row2 == row1)
                return true;
            if (col2 == col1) {
                if ((row1 + col1) % 2 === 0 && row2 === row1 - 1)
                    return true;
                if ((row1 + col1) % 2 === 1 && row2 === row1 + 1)
                    return true;
            }
            return false;
        case 4:
            return (Math.abs(row2 - row1) + Math.abs(col2 - col1) === 1);
        case 6:
            if (row2 === row1 && Math.abs(col2 - col1) === 1)
                return true;
            if (Math.abs(row2 - row1) === 1) {
                if (row1 % 2 === 0) {
                    if (col2 === col1 - 1 || col2 === col1)
                        return true;
                }
                else {
                    if (col2 === col1 || col2 === col1 + 1)
                        return true;
                }
            }
            return false;
        default:
            return false;
    }
}
export function createPath(color, points) {
    const tiles = points.map(([x, y]) => new Tile(x, y));
    for (const point of points) {
        setColor(point[0], point[1], color);
        path_map[point[0]][point[1]] = true;
    }
    const path = new Path(tiles, color, radius, true);
}
let curr_path = null;
export function resetCurrPath() {
    if (curr_path === null)
        return;
    eraseMaps(curr_path.tiles);
    curr_path = null;
}
function get_last_tile() {
    if (curr_path === null)
        return new Tile(-10, -10);
    return curr_path.get_last_tile();
}
export function handleClick(row, col) {
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
        curr_path.finish(new Tile(row, col));
        path_map[row][col] = true;
        // reset_path();
        curr_path = null;
        return;
    }
    console.log("e");
}
export function handleClickPoly(row, col) {
    if (curr_path !== null) {
        handleClick(row, col);
        if (curr_path.tiles.length >= 2)
            curr_path.check_to_remove(row, col);
    }
}
export function handleHoverEnd(row, col) {
    if (path_map[row][col]) {
        return;
    }
    if (curr_path !== null && areNeighbors(get_last_tile().row, get_last_tile().col, row, col) && isStatic(row, col) && getColor(row, col) === curr_path.color) {
        curr_path.finish(new Tile(row, col));
        path_map[row][col] = true;
        curr_path = null;
        return;
    }
}
export function handleHoverMiddle(row, col) {
    if (curr_path === null)
        return;
    curr_path.check_to_remove(row, col);
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
//# sourceMappingURL=board-state.js.map