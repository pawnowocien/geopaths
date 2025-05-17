import { SVGPolygon } from "./svg-polygon.js";
export class SVGPolygonExtended extends SVGPolygon {
    draw() {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const polygon = super.draw();
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', this.x.toString());
        circle.setAttribute('cy', this.y.toString());
        circle.setAttribute('r', (this.radius * 0.5).toString());
        circle.setAttribute('fill', 'red');
        circle.style.display = 'none';
        // ✅ Attach hover listeners to the group instead of the polygon
        group.addEventListener('mouseenter', () => {
            circle.style.display = 'block';
        });
        group.addEventListener('mouseleave', () => {
            circle.style.display = 'none';
        });
        group.addEventListener('click', () => {
            console.log(`Polygon group clicked at row ${this.row}, col ${this.col}`);
        });
        group.appendChild(polygon);
        group.appendChild(circle);
        return group;
    }
}
//# sourceMappingURL=svg-polygon-ext.js.map