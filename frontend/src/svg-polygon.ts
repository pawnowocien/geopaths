export type PolygonConstructor = new (
    x: number,
    y: number,
    radius: number,
    sides: number,
    row: number,
    col: number,
    rotation?: number
) => SVGPolygon;

export class SVGPolygon {
    x: number;
    y: number;
    radius: number;
    sides: number;
    rotation: number;
    row: number;
    col: number;

    constructor(x: number, y: number, radius: number, sides: number, row: number, col: number, rotation: number = 0) {
        if (![3, 4, 6].includes(sides)) {
            throw new Error("Wrong polygon");
        }
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sides = sides;
        this.row = row;
        this.col = col;
        this.rotation = rotation;
    }

    draw(): SVGElement {
        const angleStep: number = (Math.PI * 2) / this.sides;
        let points = '';
        for (let i = 0; i <= this.sides; i++) {
            let angle = i * angleStep + this.rotation;
            switch (this.sides) {
                case 3:
                    angle -= Math.PI / 2;
                    break;
                case 4:
                    angle -= Math.PI / 4;
                    break;
            }
            const vx = this.x + this.radius * Math.cos(angle);
            const vy = this.y + this.radius * Math.sin(angle);
            points += `${vx},${vy} `;
        }
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.setAttribute('points', points.trim());
        polygon.setAttribute('fill', 'white');
        polygon.setAttribute('stroke', 'black');
        polygon.dataset.row = this.row.toString();
        polygon.dataset.col = this.col.toString();
        return polygon;
    }
}