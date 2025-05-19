import { generateBoardSVG } from "./board-gen.js";
const sliderWidth = document.getElementById('sliderWidth');
const sliderWidthValue = document.getElementById('sliderWidthValue');
const sliderHeight = document.getElementById('sliderHeight');
const sliderHeightValue = document.getElementById('sliderHeightValue');
const selectShape = document.getElementById('select_shape');
const gridElement = document.querySelector('#grid');
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
        generateBoardSVG(parseInt(sliderWidth.value), parseInt(sliderHeight.value), parseInt(selectShape.value), gridElement);
    };
    sliderWidth.addEventListener('input', updateBoard);
    sliderHeight.addEventListener('input', updateBoard);
    selectShape.addEventListener('change', updateBoard);
    document.addEventListener('DOMContentLoaded', () => {
        updateBoard();
    });
}
else {
    console.error('Slider or SVG grid elements not found, cannot attach event listeners.');
}
//# sourceMappingURL=board-creator.js.map