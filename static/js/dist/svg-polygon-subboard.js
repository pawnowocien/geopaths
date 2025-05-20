import { SVGPolygon } from "./svg-polygon.js";
import { getColor, isStatic, setCoords, handleClick, handleHover } from "./board-state.js";
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
        const darkRed = '#420D09';
        const width = String(radius / 4);
        const circle = document.createElementNS(xmlns, 'circle');
        circle.setAttribute('cx', this.x.toString());
        circle.setAttribute('cy', this.y.toString());
        circle.setAttribute('r', (radius).toString());
        const line1 = document.createElementNS(xmlns, 'line');
        line1.setAttribute('x1', (this.x - radius * 0.5).toString());
        line1.setAttribute('y1', (this.y - radius * 0.5).toString());
        line1.setAttribute('x2', (this.x + radius * 0.5).toString());
        line1.setAttribute('y2', (this.y + radius * 0.5).toString());
        line1.setAttribute('stroke', darkRed);
        line1.setAttribute('stroke-width', width);
        const line2 = document.createElementNS(xmlns, 'line');
        line2.setAttribute('x1', (this.x + radius * 0.5).toString());
        line2.setAttribute('y1', (this.y - radius * 0.5).toString());
        line2.setAttribute('x2', (this.x - radius * 0.5).toString());
        line2.setAttribute('y2', (this.y + radius * 0.5).toString());
        line2.setAttribute('stroke', darkRed);
        line2.setAttribute('stroke-width', width);
        line1.style.display = 'none';
        line2.style.display = 'none';
        function set_hover_color() {
            circle.setAttribute('fill', 'red');
            circle.setAttribute('opacity', '0.5');
        }
        function set_static_color(color) {
            circle.setAttribute('fill', color);
            circle.setAttribute('opacity', '1');
        }
        if (this.point_color === "") {
            set_hover_color();
            circle.style.display = 'none';
        }
        else {
            set_static_color(this.point_color);
            circle.style.display = 'block';
        }
        group.addEventListener('click', () => {
            handleClick(this.row, this.col);
        });
        group.addEventListener('mouseenter', () => {
            handleHover(this.row, this.col);
        });
        group.appendChild(polygon);
        group.appendChild(circle);
        group.appendChild(line1);
        group.appendChild(line2);
        return group;
    }
}
//# sourceMappingURL=svg-polygon-subboard.js.map