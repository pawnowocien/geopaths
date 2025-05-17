export interface BoardData {
    name: string;
    width: number;
    height: number;
    shape: number;
    creator: number;
    id: number;
}

export interface BoardPoint {
    row: number;
    col: number;
    id: number;
    color: string;
}