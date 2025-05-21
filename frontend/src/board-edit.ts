import { generateBoardSVG } from "./board-gen.js";
import { setPaintColor } from "./color-state.js";
import { setDim, setColor, getColorMap } from "./board-state.js";
import { getCSRFToken } from "./csrf.js";

const UNSELECTED_CLASSES = ['border-black']
const SELECTED_CLASSES = ['border-blue-300'];

function clearSelection() {
    document.querySelectorAll<HTMLDivElement>('.color').forEach(box => {
        box.classList.remove(...SELECTED_CLASSES);
        box.classList.add(...UNSELECTED_CLASSES);
    });
}

const colorBoxes = document.querySelectorAll<HTMLDivElement>('.color');
colorBoxes.forEach(box => {
    box.addEventListener('click', () => {
        const color = box.getAttribute('color');
        if (color) {
            setPaintColor(color);
        } else {
            setPaintColor('');
        }

        clearSelection();
        box.classList.remove(...UNSELECTED_CLASSES);
        box.classList.add(...SELECTED_CLASSES);
    });
});

const eraserBox = document.getElementById('eraser');
if (eraserBox) {
  eraserBox.classList.remove(...UNSELECTED_CLASSES);
  eraserBox.classList.add(...SELECTED_CLASSES);
}



const gridElement = document.querySelector<SVGSVGElement>('#grid');

const scriptTag1 = document.getElementById('board-data');
const scriptTag2 = document.getElementById('board-points');

if (scriptTag1 && scriptTag1.textContent && scriptTag2 && scriptTag2.textContent && gridElement) {
    const boardData = JSON.parse(scriptTag1.textContent);
    const boardPoints = JSON.parse(scriptTag2.textContent);
    
    setDim(boardData.height, boardData.width)
    if (boardPoints !== undefined) {
        for (const point of boardPoints || []) {
            setColor(point.row, point.col, point.color)
        }
    }
    generateBoardSVG(boardData.width, boardData.height, boardData.type, gridElement, boardData.id);




    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', () => {            
            fetch('/update_board_cell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({
                    board: boardData.id,
                    color_map: getColorMap()
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
                if (data.status === 'failure' && data.message) {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });
        });
    }

} else {
    console.error('Board data script tag not found or empty');
}


const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
const addColorButton = document.getElementById('addColorButton');

function createColorBox(color: string): HTMLDivElement {
    const outerDiv = document.createElement('div');
    outerDiv.className = 'color h-12 border-3 border-black border-double p-3 hover:cursor-pointer flex items-center justify-center';
    outerDiv.setAttribute('color', color);

    const innerDiv = document.createElement('div');
    innerDiv.className = 'h-full w-15';
    innerDiv.style.backgroundColor = color;

    outerDiv.appendChild(innerDiv);

    outerDiv.addEventListener('click', () => {
        setPaintColor(color);
        clearSelection();
        outerDiv.classList.remove(...UNSELECTED_CLASSES);
        outerDiv.classList.add(...SELECTED_CLASSES);
    });

    return outerDiv;
}

const colorGrid = document.getElementById('colorGrid');

if (addColorButton && colorPicker && colorGrid) {
    addColorButton.addEventListener('click', () => {
        const pickedColor = colorPicker.value;
        const newBox = createColorBox(pickedColor);
        colorGrid.appendChild(newBox);
    });
}