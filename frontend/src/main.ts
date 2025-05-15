// Select HTML elements
const sliderWidth = document.getElementById('sliderWidth') as HTMLInputElement;
const sliderHeight = document.getElementById('sliderHeight') as HTMLInputElement;
const sliderWidthValue = document.getElementById('sliderWidthValue') as HTMLSpanElement;
const sliderHeightValue = document.getElementById('sliderHeightValue') as HTMLSpanElement;

// Corrected: Use document.querySelector<SVGElement> for better type safety
// This tells TypeScript to expect an SVGElement or null if not found.
const svgElement = document.querySelector<SVGElement>('#grid');

// Function to generate the grid based on the current slider values
function generateGrid() {
    // Ensure all elements are found before proceeding
    if (!sliderWidth || !sliderHeight || !sliderWidthValue || !sliderHeightValue || !svgElement) {
        console.error('One or more HTML elements not found. Check your IDs.');
        return; // Exit early if any element is null
    }

    // Get slider values
    const width = parseInt(sliderWidth.value);
    const height = parseInt(sliderHeight.value);

    // Update the value labels next to sliders
    sliderWidthValue.textContent = width.toString();
    sliderHeightValue.textContent = height.toString();

    // Clear existing SVG content
    svgElement.innerHTML = '';

    // Define the grid dimensions (fixed viewBox size for the SVG)
    // The SVG will scale to its container, but the internal coordinate system is fixed.
    const viewBoxWidth = 400;
    const viewBoxHeight = 400;
    svgElement.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`);


    // Define the size of each square based on the sliders and viewBox dimensions
    const squareWidth = viewBoxWidth / width;
    const squareHeight = viewBoxHeight / height;

    // Generate grid squares
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const x = col * squareWidth;
            const y = row * squareHeight;

            // Create the rectangle (square) element
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', x.toString());
            rect.setAttribute('y', y.toString());
            rect.setAttribute('width', squareWidth.toString());
            rect.setAttribute('height', squareHeight.toString());
            rect.setAttribute('fill', 'none'); // Transparent fill
            rect.setAttribute('stroke', '#333'); // Darker stroke for better visibility
            rect.setAttribute('stroke-width', '1'); // Stroke width
            
            svgElement.appendChild(rect);
        }
    }
}

// Add event listeners only if elements exist
if (sliderWidth && sliderHeight) {
    sliderWidth.addEventListener('input', generateGrid);
    sliderHeight.addEventListener('input', generateGrid);
    
    // Initial grid generation on script load
    // Ensure the DOM is fully loaded if this script is in the <head>
    // If it's at the end of <body>, this is fine.
    // For robustness, you might wrap this in DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        generateGrid();
    });
} else {
    console.error('Slider elements not found, cannot attach event listeners.');
}