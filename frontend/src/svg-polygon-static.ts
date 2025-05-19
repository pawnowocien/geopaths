import { SVGPolygon } from "./svg-polygon.js";
import { getColor } from "./board-state.js";

export class SVGPolygonStatic extends SVGPolygon {
    point_color: string

    constructor(x: number, y: number, radius: number, sides: number, row: number,
        col: number, rotation: number) {
        super(x, y, radius, sides, row, col, rotation);
        this.point_color = getColor(row, col)
    }

    draw(): SVGGElement {
        const xmlns = 'http://www.w3.org/2000/svg';

        const radius = this.radius * 0.5;

        const group = document.createElementNS(xmlns, 'g');
        const polygon = super.draw();
        group.appendChild(polygon);

        if (this.point_color !== "") {
            const circle = document.createElementNS(xmlns, 'circle');
            circle.setAttribute('cx', this.x.toString());
            circle.setAttribute('cy', this.y.toString());
            circle.setAttribute('r', (radius).toString());
            circle.setAttribute('fill', this.point_color);
            circle.style.display = 'block';

            group.appendChild(circle);
        }

        return group;
    }
}
