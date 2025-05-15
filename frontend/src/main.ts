const sliderWidth = document.getElementById('sliderWidth') as HTMLInputElement;
const sliderHeight = document.getElementById('sliderHeight') as HTMLInputElement;
const sliderWidthValue = document.getElementById('sliderWidthValue') as HTMLSpanElement;
const sliderHeightValue = document.getElementById('sliderHeightValue') as HTMLSpanElement;

const svgElement = document.querySelector<SVGElement>('#grid');

if (svgElement) {
    svgElement.setAttribute('shape-rendering', 'crispEdges'); // Sharp rendering
}
class Polygon {
    x: number;
    y: number;
    radius: number;
    sides: number;
    rotation: number;

    constructor(x: number, y: number, radius: number, sides: number, rotation: number = 0) {
        if (![3, 4, 6].includes(sides)) {
            throw new Error("Wrong polygon");
        }
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sides = sides;
        this.rotation = rotation;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const angleStep: number = (Math.PI * 2) / this.sides;

        ctx.beginPath();
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
            if (i === 0) {
                ctx.moveTo(vx, vy);
            } else {
                ctx.lineTo(vx, vy);
            }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
    }
}

function generateGrid() {
    if (!sliderWidth || !sliderHeight || !sliderWidthValue || !sliderHeightValue || !svgElement) {
        console.error('One or more HTML elements not found. Check your IDs.');
        return;
    }

    const width = parseInt(sliderWidth.value);
    const height = parseInt(sliderHeight.value);

    sliderWidthValue.textContent = width.toString();
    sliderHeightValue.textContent = height.toString();

    svgElement.innerHTML = '';

    const viewBoxWidth = 400;
    const viewBoxHeight = 400;
    svgElement.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`);

    const squareWidth = viewBoxWidth / width;
    const squareHeight = viewBoxHeight / height;

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const x = Math.round(col * squareWidth) + 0.5;
            const y = Math.round(row * squareHeight) + 0.5;

            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x.toFixed(1));
            rect.setAttribute('y', y.toFixed(1));
            rect.setAttribute('width', Math.floor(squareWidth - 1).toString());
            rect.setAttribute('height', Math.floor(squareHeight - 1).toString());
            rect.setAttribute('fill', 'none');
            rect.setAttribute('stroke', '#333');
            rect.setAttribute('stroke-width', '1');

            svgElement.appendChild(rect);
        }
    }
}

if (sliderWidth && sliderHeight) {
    sliderWidth.addEventListener('input', generateGrid);
    sliderHeight.addEventListener('input', generateGrid);

    document.addEventListener('DOMContentLoaded', () => {
        generateGrid();
    });
} else {
    console.error('Slider elements not found, cannot attach event listeners.');
}

const selectShape = document.getElementById('select_shape') as HTMLSpanElement;

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const radius = 50;

function generateBoard() {
    const selectedShape = (selectShape as HTMLSelectElement).value;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cols = parseInt(sliderWidth.value);
    const rows = parseInt(sliderHeight.value);

    let width = canvas.width;
    let height = canvas.height;

    let sides = 0;
    let offset = 1;
    let size = 40;
    let spacing = 0;
    let x_dist = 0;
    let y_dist = 0;

    switch (selectedShape) {
        case 'triangle':
            sides = 3;
            spacing = Math.min(width / cols, height / rows);
            break;
        case 'square':
            sides = 4;
            spacing = Math.min(width / cols, height / rows);
            size = spacing - offset;
            break;
        case 'hexagon':
            sides = 6;
            break;
        default:
            ctx.fillStyle = 'black';
            break;
    }

    x_dist = size + offset;
    y_dist = size + offset;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = (size + 1) / 2 + col * x_dist;
            const y = (size + 1) / 2 + row * y_dist;
            let rot = 0;
            let shape: Polygon;
            if (selectedShape == 'triangle') {
                const x = (size + 1) / 2 + col * x_dist;
                const y = (size + 1) / 2 + Math.floor(row / 2) * y_dist;
                if (row % 2 == 0 && selectedShape == 'triangle') {
                    rot = Math.PI;
                    shape = new Polygon(x, y, size / 2, sides, rot);
                } else {
                    shape = new Polygon(x + size / 2, y + size / 3, size / 2, sides);
                }
            } else {
                
                shape = new Polygon(x, y, size / 2, sides, rot);
            }
            shape.draw(ctx);
        }
    }
}

sliderWidth.addEventListener('input', generateBoard);
sliderHeight.addEventListener('input', generateBoard);
selectShape.addEventListener('change', generateBoard);

// Call once on page load
generateBoard();