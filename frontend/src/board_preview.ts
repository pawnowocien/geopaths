import { generateBoardSVG } from "./board-gen.js";
import { SVGPolygon } from "./svg-polygon.js";

const sliderWidth = document.getElementById('sliderWidth') as HTMLInputElement;
const sliderHeight = document.getElementById('sliderHeight') as HTMLInputElement;
const selectShape = document.getElementById('select_shape') as HTMLSelectElement;
const gridElement = document.querySelector<SVGSVGElement>('#grid');

if (sliderWidth && sliderHeight && selectShape && gridElement) {
    const updateBoard = () => {
        generateBoardSVG(
            parseInt(sliderWidth.value),
            parseInt(sliderHeight.value),
            parseInt((selectShape as HTMLSelectElement).value),
            gridElement,
            SVGPolygon
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