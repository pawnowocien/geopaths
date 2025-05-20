import { setPaintColor, getPaintColor } from "./color-state.js";
const xmlns = 'http://www.w3.org/2000/svg';
let point_map = [[]];
let static_map = [[]];
let path_map = [[]];
let sides = 4;
let board_id = -1;
let radius = -1;
class Coords {
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
export function setSides(s) {
    sides = s;
}
export function setId(id) {
    board_id = id;
}
export function setRad(rad) {
    radius = rad / 3;
}
class Tile {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    toString() {
        return this.row.toString() + "_" + this.col.toString();
    }
}
let lines_overlay = undefined;
export function setOverlay(grid) {
    lines_overlay = grid;
}
function onRightClick(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const path_id = element.getAttribute('data-path-id');
    if (path_id) {
        removePath(path_id);
        console.log('Right-click on:', path_id);
    }
}
function drawLine(row1, col1, row2, col2, path_id) {
    if (lines_overlay === undefined)
        return;
    const line_between = document.createElementNS(xmlns, 'line');
    let x1_str = coord_map[row1][col1].x.toString();
    let y1_str = coord_map[row1][col1].y.toString();
    let x2_str = coord_map[row2][col2].x.toString();
    let y2_str = coord_map[row2][col2].y.toString();
    line_between.setAttribute('x1', x1_str);
    line_between.setAttribute('y1', y1_str);
    line_between.setAttribute('x2', x2_str);
    line_between.setAttribute('y2', y2_str);
    line_between.setAttribute('stroke', getPaintColor());
    line_between.setAttribute('stroke-width', radius.toString());
    line_between.setAttribute('id', row1.toString() + '_' + col1.toString() + '_' + row2.toString() + '_' + col2.toString());
    line_between.setAttribute('data-path-id', path_id);
    line_between.addEventListener('contextmenu', onRightClick);
    line_between.style.display = 'block';
    lines_overlay.appendChild(line_between);
}
function drawCircle(row, col, path_id, big = false) {
    if (lines_overlay === undefined)
        return;
    const circle = document.createElementNS(xmlns, 'circle');
    circle.setAttribute('cx', coord_map[row][col].x.toString());
    circle.setAttribute('cy', coord_map[row][col].y.toString());
    let rad = radius / 2;
    if (big)
        rad *= 3;
    circle.setAttribute('r', (rad).toString());
    circle.setAttribute('fill', getPaintColor());
    circle.setAttribute('opacity', '1');
    circle.setAttribute('id', row.toString() + '_' + col.toString());
    circle.style.display = 'block';
    circle.setAttribute('data-path-id', path_id);
    circle.addEventListener('contextmenu', onRightClick);
    lines_overlay.appendChild(circle);
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
let paths = new Map();
paths.set("in-proc", []);
function get_path() {
    let res = paths.get("in-proc");
    if (res === undefined) {
        return [];
    }
    return res;
}
function reset_path() {
    paths.set("in-proc", []);
}
function last_tile() {
    return get_path()[get_path().length - 1];
}
function removePath(path_id) {
    console.log("Trying to delete " + path_id);
    const path_elements = document.querySelectorAll(`[data-path-id="${path_id}"]`);
    if (!paths.has(path_id))
        return;
    let path_to_del = paths.get(path_id);
    if (path_to_del === undefined)
        return;
    path_elements.forEach(el => el.remove());
    for (const tile of path_to_del) {
        path_map[tile.row][tile.col] = false;
        if (isStatic(tile.row, tile.col))
            continue;
        setColor(tile.row, tile.col, "");
    }
    if (path_id === "in-proc") {
        reset_path();
        setPaintColor("");
        return;
    }
    paths.delete(path_id);
    const first = path_to_del[0];
    const last = path_to_del[path_to_del.length - 1];
    fetch('/delete_path', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: [first.row, first.col], end: [last.row, last.col], subboard: board_id })
    })
        .then(response => {
        if (!response.ok) {
            throw new Error("Failed to delete path");
        }
        return response.json();
    })
        .then(data => {
        console.log("Path deleted:", data);
    })
        .catch(err => {
        console.error("Error deleting path:", err);
    });
}
export function createPath(color, points) {
    for (const point of points) {
        path_map[point[0]][point[1]] = true;
    }
    setPaintColor(color);
    const start = points[0][0].toString() + "_" + points[0][1].toString();
    const end = points[points.length - 1][0].toString() + "_" + points[points.length - 1][1].toString();
    const path_id = start + "|" + end;
    console.log();
    for (let i = 1; i < points.length - 1; i++) {
        const point = points[i];
        setColor(...point, color);
        drawCircle(...point, path_id);
    }
    drawCircle(...points[0], path_id, true);
    drawCircle(...points[points.length - 1], path_id, true);
    for (let i = 0; i < points.length - 1; i++) {
        const point1 = points[i];
        const point2 = points[i + 1];
        drawLine(...point1, ...point2, path_id);
    }
    let path = [];
    for (const point of points) {
        path.push(new Tile(point[0], point[1]));
    }
    paths.set(path_id, path);
}
export function handleClick(row, col) {
    if (path_map[row][col]) {
        return;
    }
    // Start of the path
    if (get_path().length === 0 && isStatic(row, col)) {
        setPaintColor(getColor(row, col));
        drawCircle(row, col, "in-proc", true);
        get_path().push(new Tile(row, col));
        path_map[row][col] = true;
        return;
    }
    // Next tile
    if (get_path().length > 0 && areNeighbors(last_tile().row, last_tile().col, row, col) && getColor(row, col) === "") {
        ;
        drawLine(last_tile().row, last_tile().col, row, col, "in-proc");
        drawCircle(row, col, "in-proc");
        get_path().push(new Tile(row, col));
        path_map[row][col] = true;
        return;
    }
    // Last tile
    if (get_path().length > 0 && areNeighbors(last_tile().row, last_tile().col, row, col) && isStatic(row, col) && getColor(row, col) === getPaintColor()) {
        drawCircle(row, col, "in-proc", true);
        drawLine(last_tile().row, last_tile().col, row, col, "in-proc");
        path_map[row][col] = true;
        get_path().push(new Tile(row, col));
        const path_id = get_path()[0].toString() + "|" + get_path()[get_path().length - 1];
        paths.set(path_id, get_path());
        const path_elements = document.querySelectorAll(`[data-path-id="in-proc"]`);
        path_elements.forEach(el => {
            el.setAttribute('data-path-id', path_id);
        });
        fetch('/create_path', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: get_path().map(t => ({ row: t.row, col: t.col })), subboard: board_id })
        })
            .then(response => {
            if (!response.ok) {
                throw new Error("Failed to submit path");
            }
            return response.json();
        })
            .then(data => {
            console.log("Path submitted:", data);
        })
            .catch(err => {
            console.error("Error submitting path:", err);
        });
        reset_path();
        setPaintColor("");
        // make a line and send it
        return;
    }
}
export function handleHover(row, col) {
    if (get_path().length > 0)
        handleClick(row, col);
}
//# sourceMappingURL=board-state.js.map