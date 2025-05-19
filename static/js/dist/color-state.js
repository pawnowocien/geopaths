let selectedColorState = '';
export function getPaintColor() {
    return selectedColorState;
}
export function setPaintColor(color) {
    selectedColorState = color;
}
let glob_row = -10, glob_col = -10;
let last_x = -10, last_y = -10;
export function setCurrentTile(row, col) {
    glob_row = row;
    glob_col = col;
}
export function setCurrentCoords(x, y) {
    last_x = x;
    last_y = y;
}
export function resetTile() {
    setCurrentTile(-10, -10);
    setCurrentCoords(-10, -10);
}
export function getLastTile() {
    return [glob_row, glob_col];
}
export function getLastCoords() {
    return [last_x, last_y];
}
//# sourceMappingURL=color-state.js.map