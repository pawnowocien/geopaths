import { SVGPolygon } from "./svg-polygon.js";
import { getPaintColor, setCurrentTile, getLastTile, setPaintColor, setCurrentCoords } from "./color-state.js";
import { getColor, isStatic, drawLine, setCoords } from "./board-state.js";
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
    isNeigh(row, col) {
        switch (this.sides) {
            case 3:
                if (Math.abs(col - this.col) === 1 && row == this.row)
                    return true;
                if (col == this.col) {
                    if ((this.row + this.col) % 2 === 0 && row === this.row - 1)
                        return true;
                    if ((this.row + this.col) % 2 === 1 && row === this.row + 1)
                        return true;
                }
                return false;
            case 4:
                return (Math.abs(row - this.row) + Math.abs(col - this.col) === 1);
            case 6:
                if (row === this.row && Math.abs(col - this.col) === 1)
                    return true;
                if (Math.abs(row - this.row) === 1) {
                    if (this.row % 2 === 0) {
                        if (col === this.col - 1 || col === this.col)
                            return true;
                    }
                    else {
                        if (col === this.col || col === this.col + 1)
                            return true;
                    }
                }
                return false;
            default:
                return false;
        }
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
            if (getPaintColor() !== "" && this.isNeigh(...getLastTile()) && this.point_color === "") {
                circle.setAttribute('fill', getPaintColor());
                circle.setAttribute('opacity', '1.0');
                circle.style.display = 'block';
                this.point_color = getPaintColor();
                let [row, col] = getLastTile();
                setCurrentTile(this.row, this.col);
                drawLine(row, col, this.row, this.col, radius * 2);
            }
            if (this.polyStatic()) {
                setCurrentTile(this.row, this.col);
                setCurrentCoords(this.x, this.y);
                setPaintColor(this.point_color);
            }
        });
        group.appendChild(polygon);
        group.appendChild(circle);
        group.appendChild(line1);
        group.appendChild(line2);
        return group;
    }
}
//# sourceMappingURL=svg-polygon-subboard.js.map