// Utility function to lighten a hex color
export const lightenHexColor = (hex: string, percent: number) => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, '');

  // Parse the r, g, b values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Increase each channel by the specified percentage
  r = Math.min(255, r + Math.round((255 - r) * percent));
  g = Math.min(255, g + Math.round((255 - g) * percent));
  b = Math.min(255, b + Math.round((255 - b) * percent));

  // Convert back to hex and return
  const rgbToHex = (r: any, g: any, b: any) =>
    '#' +
    [r, g, b]
      .map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('');

  return rgbToHex(r, g, b);
};
