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
    let space_between = 4;
    let rad = 40;

    let a; 
    let max_w = 0;
    let max_h = 0;
    // let h = 0;
    switch (selectedShape) {
        case 'triangle':
            sides = 3;
            
            max_w = 2 * (width - space_between) / (cols + 1) - space_between;
            max_h = (height - space_between) / rows - 2 * space_between; // I'm too tired to figure out the actual math, so this approximation will do
            max_h *= 2/Math.sqrt(3);
            a = Math.min(max_w, max_h);
            rad = a / Math.sqrt(3);
            
            // h = Math.sqrt((rad+space_between)**2 - (space_between+a)**2 / 4) - rad/2;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    let shape: Polygon;
                    const x = a / 2 + space_between + (space_between + a) * col / 2;
                    let y = rad / 2  + space_between + row * (3 * rad / 2 + 2 * space_between);

                    if ((row + col) % 2 === 0) {
                        shape = new Polygon(x, y, rad, sides, Math.PI);
                    } else {
                        y += rad / 2 + space_between;
                        shape = new Polygon(x, y, rad, sides);
                    }

                    shape.draw(ctx);
                }
            }
            break;


        case 'square':
            sides = 4;

            max_w = (width - space_between) / cols;
            max_h = (height - space_between) / rows;
            let spacing = Math.min(max_w, max_h);

            a = (spacing - space_between);
            rad = Math.sqrt(2) * a / 2;
            
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = a / 2 + spacing * col + space_between;
                    const y = a / 2 + spacing * row + space_between;
                    const shape = new Polygon(x, y, rad, sides);
                    shape.draw(ctx);
                }
            }
            break;
        case 'hexagon':
            sides = 6;
            
            max_w = (width - space_between * (cols + 1)) / (1 + 2 * cols);
            max_h = (height - space_between) / rows - space_between;
            max_h *= Math.sqrt(3)/2;
            // spacing = Math.min((width - space_between) / cols, (height - space_between) / rows);
            let s_r = Math.min(max_w, max_h);
            rad = 2 * s_r / Math.sqrt(3);
            
            // h = Math.sqrt((rad+space_between)**2 - (space_between+s_r)**2 / 4) - rad/2;
            // let h2 = 3 * Math.sqrt(3) * s_r**2 / (4 * rad) - s_r;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = s_r + (2 * s_r + space_between) * col + space_between;
                    const y = rad + (3 * rad / 2 + space_between) * row + space_between;

                    let shape: Polygon;
                    if (row % 2 === 0) {
                        shape = new Polygon(x, y, rad, sides, Math.PI / 2);
                    } else {
                        shape = new Polygon(x + s_r + space_between / 2, y, rad, sides, Math.PI / 2);
                    }
                    shape.draw(ctx);
                }
            }
            break;
        default:
            ctx.fillStyle = 'black';
            break;
    }
    
}

sliderWidth.addEventListener('input', generateBoard);
sliderHeight.addEventListener('input', generateBoard);
selectShape.addEventListener('change', generateBoard);

// Call once on page load
generateBoard();