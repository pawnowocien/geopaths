let selectedColorState: string = '';

export function getPaintColor(): string {
    return selectedColorState;
}

export function setPaintColor(color: string): void {
    selectedColorState = color;
}


let glob_row=-10, glob_col=-10;
let last_x=-10, last_y=-10;
export function setCurrentTile(row: number, col: number): void {
    glob_row=row;
    glob_col=col;
}
export function setCurrentCoords(x: number, y: number): void {
    last_x=x;
    last_y=y;
}

export function resetTile(): void {
    setCurrentTile(-10, -10);
    setCurrentCoords(-10, -10);
}

export function getLastTile(): [number, number] {
    return [glob_row, glob_col];
}
export function getLastCoords(): [number, number] {
    return [last_x, last_y];
}