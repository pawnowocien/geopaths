let selectedColorState: string = 'eraser';

export function getColor(): string {
  return selectedColorState;
}

export function setColor(color: string): void {
  selectedColorState = color;
}