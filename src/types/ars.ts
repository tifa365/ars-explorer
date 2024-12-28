/**
 * Represents a single Administrative Region (ARS) entry
 * containing both the code and name of the region
 */
export interface ARSEntry {
  /** The unique ARS code identifier (e.g., "08212") */
  ars: string;
  
  /** The human-readable name of the region (e.g., "Karlsruhe") */
  name: string;
}

/**
 * Represents the shape styling options for the map
 * Used to style the GeoJSON polygons on the map
 */
export interface ShapeStyle {
  /** The color of the shape border in hex format */
  color: string;
  
  /** The thickness of the shape border in pixels */
  weight: number;
  
  /** The opacity of the shape (0-1) */
  opacity: number;
}

/**
 * Represents the complete map state
 * Used in the map store to track current visualization state
 */
export interface MapState {
  /** The current GeoJSON features being displayed */
  currentShape: any | null;
  
  /** The styling applied to the shapes */
  shapeStyle: ShapeStyle;
}

/**
 * Represents the search state
 * Used in the search store to manage search functionality
 */
export interface SearchState {
  /** Dictionary mapping ARS codes to region names */
  arsMap: Record<string, string>;
  
  /** Current search results */
  searchResults: ARSEntry[];
  
  /** Current search query */
  currentQuery: string;
  
  /** Pagination offset */
  offset: number;
  
  /** Number of items per page */
  pageSize: number;
}