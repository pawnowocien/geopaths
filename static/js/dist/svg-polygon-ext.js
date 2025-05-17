import { SVGPolygon } from "./svg-polygon.js";
import { getCSRFToken } from "./csrf.js";
export class SVGPolygonExtended extends SVGPolygon {
    constructor(x, y, radius, sides, row, col, rotation, board, point_color = "") {
        super(x, y, radius, sides, row, col, rotation);
        this.board = board;
        this.point_color = point_color;
        if (point_color !== "") {
            console.log(`Point color: ${point_color}`);
        }
    }
    draw() {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const polygon = super.draw();
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', this.x.toString());
        circle.setAttribute('cy', this.y.toString());
        circle.setAttribute('r', (this.radius * 0.5).toString());
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
            if (this.point_color === "") {
                circle.style.display = 'block';
            }
        });
        group.addEventListener('mouseleave', () => {
            if (this.point_color === "") {
                circle.style.display = 'none';
            }
        });
        group.addEventListener('click', () => {
            console.log(`Polygon group clicked at row ${this.row}, col ${this.col}, board ${this.board}`);
            if (this.point_color !== "") {
                this.point_color = "";
                set_hover_color();
            }
            else {
                this.point_color = "#000000";
                set_static_color(this.point_color);
            }
            fetch('/update_board_cell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken() // Make sure CSRF token is sent
                },
                body: JSON.stringify({
                    row: this.row,
                    col: this.col,
                    board: this.board,
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
        return group;
    }
}
//# sourceMappingURL=svg-polygon-ext.js.map