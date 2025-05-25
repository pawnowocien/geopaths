import { SVGPolygon } from "./svg-polygon.js";
import { getColor, isStatic, setCoords, handleClick, handleClickPoly, handleHoverMiddle, handleHoverEnd } from "./board-state.js";
export class SVGPolygonSubboard extends SVGPolygon {
    constructor(x, y, radius, sides, row, col, rotation, board) {
        super(x, y, radius, sides, row, col, rotation);
        this.board = board;
        this.point_color = getColor(row, col);
        setCoords(row, col, x, y);
    }
    polyStatic() {
        return isStatic(this.row, this.col);
    }
    draw() {
        const xmlns = 'http://www.w3.org/2000/svg';
        let radius = this.radius * 0.5;
        if (!this.polyStatic()) {
            radius *= 0.5;
        }
        const group = document.createElementNS(xmlns, 'g');
        const polygon = super.draw();
        const circle = document.createElementNS(xmlns, 'circle');
        circle.setAttribute('cx', this.x.toString());
        circle.setAttribute('cy', this.y.toString());
        circle.setAttribute('r', (radius).toString());
        if (this.point_color === "") {
            circle.style.display = 'none';
        }
        else {
            circle.setAttribute('fill', this.point_color);
            circle.style.display = 'block';
            circle.style.cursor = 'pointer';
            circle.addEventListener('click', () => {
                handleClick(this.row, this.col);
            });
            circle.addEventListener('mouseenter', () => {
                handleHoverEnd(this.row, this.col);
            });
        }
        group.addEventListener('click', () => {
            handleClickPoly(this.row, this.col);
        });
        group.addEventListener('mouseenter', () => {
            handleHoverMiddle(this.row, this.col);
        });
        group.appendChild(polygon);
        group.appendChild(circle);
        return group;
    }
}
//# sourceMappingURL=svg-polygon-subboard.js.map