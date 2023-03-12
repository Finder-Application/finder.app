/*
 * Map related config variables
 */
export const MANHATTAN_DEGREES = 29;

// Limit view to NYC
export const DEFAULT_EXTENT = {
  ne: [-8278869.8963, 4928600.7599],
  sw: [-8190340.9601, 5008083.1539],
};

// Manhattan vertically aligned
export const DEFAULT_ROTATION = (-MANHATTAN_DEGREES * Math.PI) / 180;

// Centered on downtown Manhattan/Dumbo
// Separate coordinates for Phone to ensure Manhattan is centered in viewframe (due to different zoom & aspect ratio)
export const DEFAULT_LAT = 40.7436;
export const DEFAULT_LON = -73.9909;
