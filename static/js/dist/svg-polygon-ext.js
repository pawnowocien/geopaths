import { SVGPolygon } from "./svg-polygon.js";
import { getCSRFToken } from "./csrf.js";
import { getPaintColor } from "./color-state.js";
import { getColor } from "./board-state.js";
export class SVGPolygonExtended extends SVGPolygon {
    constructor(x, y, radius, sides, row, col, rotation, board) {
        super(x, y, radius, sides, row, col, rotation);
        this.board = board;
        this.point_color = getColor(row, col);
    }
    draw() {
        const xmlns = 'http://www.w3.org/2000/svg';
        const radius = this.radius * 0.5;
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
        group.addEventListener('mouseenter', () => {
            // New circle / replace a different color circle
            if (getPaintColor() !== "") {
                if (this.point_color !== getPaintColor()) {
                    group.style.cursor = 'pointer';
                    circle.setAttribute('fill', getPaintColor());
                    circle.setAttribute('opacity', '0.5');
                    circle.style.display = 'block';
                }
            } // Eraser
            else {
                if (this.point_color !== "") {
                    group.style.cursor = 'pointer';
                    circle.setAttribute('opacity', '0.3');
                    line1.style.display = 'block';
                    line2.style.display = 'block';
                }
            }
        });
        group.addEventListener('mouseleave', () => {
            if (this.point_color === "") {
                group.style.cursor = 'default';
                circle.style.display = 'none';
            }
            else {
                group.style.cursor = 'default';
                circle.setAttribute('fill', this.point_color);
                circle.setAttribute('opacity', '1');
                circle.style.display = 'block';
            }
            line1.style.display = 'none';
            line2.style.display = 'none';
        });
        group.addEventListener('click', () => {
            this.point_color = getPaintColor();
            if (getPaintColor() === "") {
                circle.style.display = 'none';
                line1.style.display = 'none';
                line2.style.display = 'none';
                group.style.cursor = 'default';
            }
            else {
                circle.setAttribute('opacity', '1');
                circle.style.display = 'block';
                group.style.cursor = 'default';
            }
            fetch('/update_board_cell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({
                    row: this.row,
                    col: this.col,
                    board: this.board,
                    color: this.point_color,
                })
            })
                .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
                .then(data => {
                console.log('Success:', data);
            })
                .catch(error => {
                console.error('Error sending data:', error);
            });
        });
        group.appendChild(polygon);
        group.appendChild(circle);
        group.appendChild(line1);
        group.appendChild(line2);
        return group;
    }
}
//# sourceMappingURL=svg-polygon-ext.js.map