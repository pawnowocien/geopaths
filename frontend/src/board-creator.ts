import { generateBoardSVG } from "./board-gen.js";

const sliderWidth = document.getElementById('sliderWidth') as HTMLInputElement;
const sliderWidthValue = document.getElementById('sliderWidthValue') as HTMLElement;
const sliderHeight = document.getElementById('sliderHeight') as HTMLInputElement;
const sliderHeightValue = document.getElementById('sliderHeightValue') as HTMLElement;
const selectShape = document.getElementById('select_shape') as HTMLSelectElement;
const gridElement = document.querySelector<SVGSVGElement>('#grid');

if (sliderWidth && sliderHeight && selectShape && gridElement) {
    sliderWidthValue.textContent = sliderWidth.value;
    sliderHeightValue.textContent = sliderHeight.value;
    sliderWidth.addEventListener('input', () => {
    sliderWidthValue.textContent = sliderWidth.value;
    });

    sliderHeight.addEventListener('input', () => {
    sliderHeightValue.textContent = sliderHeight.value;
    });
    const updateBoard = () => {
        generateBoardSVG(
            parseInt(sliderWidth.value),
            parseInt(sliderHeight.value),
            parseInt((selectShape as HTMLSelectElement).value),
            gridElement
        );
    };

    sliderWidth.addEventListener('input', updateBoard);
    sliderHeight.addEventListener('input', updateBoard);
    selectShape.addEventListener('change', updateBoard);

    document.addEventListener('DOMContentLoaded', () => {
        updateBoard();
    });
} else {
    console.error('Slider or SVG grid elements not found, cannot attach event listeners.');
}