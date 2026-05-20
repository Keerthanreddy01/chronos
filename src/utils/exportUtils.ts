import LZString from 'lz-string';
import * as htmlToImage from 'html-to-image';

export interface SharedLifeData {
  birthdate: string;
  name: string;
  age: string;
  vibe: string;
  zodiac: string;
  season: string | null;
  seasonSubtitle: string;
  favorites: {
    reading: string;
    obsessed: string;
    visit: string;
    comfort: string;
    watching: string;
    thought: string;
  };
  bucketList: Array<{ id: string; text: string }>;
  tagline: string;
  settings: { lifespan: number };
}

/**
 * Encodes the state data into a compressed base64 URI component
 */
export function encodeShareData(data: SharedLifeData): string {
  try {
    const jsonStr = JSON.stringify(data);
    return LZString.compressToEncodedURIComponent(jsonStr);
  } catch (error) {
    console.error('Error compressing share link state:', error);
    return '';
  }
}

/**
 * Decodes compressed base64 state from URL query param
 */
export function decodeShareData(compressed: string): SharedLifeData | null {
  try {
    const jsonStr = LZString.decompressFromEncodedURIComponent(compressed);
    if (!jsonStr) return null;
    return JSON.parse(jsonStr) as SharedLifeData;
  } catch (error) {
    console.error('Failed to decompress share link state:', error);
    return null;
  }
}

/**
 * Generates an OG-ready PNG export of the grid canvas using html-to-image.
 * Applies a 2x pixel ratio for retina resolution and appends a premium watermark.
 */
export async function exportGridAsPng(
  gridElement: HTMLElement,
  name: string,
  age: string,
  livedWeeks: string,
  remainingWeeks: string
): Promise<string | null> {
  // 1. Create and append the elegant watermark element temporarily
  const watermark = document.createElement('div');
  watermark.id = 'export-watermark-overlay';
  watermark.style.position = 'absolute';
  watermark.style.bottom = '16px';
  watermark.style.right = '20px';
  watermark.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
  watermark.style.border = '1px solid rgba(255, 255, 255, 0.1)';
  watermark.style.padding = '12px 16px';
  watermark.style.borderRadius = '0px';
  watermark.style.color = '#e8e4dd';
  watermark.style.fontFamily = "'Inter', sans-serif";
  watermark.style.fontSize = '12px';
  watermark.style.zIndex = '99999';
  watermark.style.pointerEvents = 'none';
  watermark.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
  
  const formattedName = name ? name.trim() : 'My Life';
  watermark.innerHTML = `
    <div style="font-weight: 600; font-family: 'Playfair Display', serif; font-size: 14px; margin-bottom: 4px; color: #f5c542;">
      ${formattedName} in Weeks
    </div>
    <div style="opacity: 0.8; font-size: 11px;">
      Age ${age} &bull; ${livedWeeks} Weeks Lived &bull; ${remainingWeeks} Left
    </div>
    <div style="opacity: 0.4; font-size: 9px; margin-top: 6px; letter-spacing: 0.5px; text-transform: uppercase;">
      Each square is 168 hours.
    </div>
  `;
  
  // Ensure the grid relative positioning exists to anchor watermark
  const originalPosition = gridElement.style.position;
  gridElement.style.position = 'relative';
  gridElement.appendChild(watermark);

  try {
    // 2. Capture the element at 2x resolution
    const dataUrl = await htmlToImage.toPng(gridElement, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#0a0a0a',
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
      filter: (node) => {
        // Exclude interactive elements or tools from screenshot if any
        if (node instanceof HTMLElement && node.classList.contains('no-export')) {
          return false;
        }
        return true;
      }
    });

    // 3. Clean up watermark and restore state
    gridElement.removeChild(watermark);
    gridElement.style.position = originalPosition;
    
    return dataUrl;
  } catch (error) {
    console.error('Primary PNG export failed, attempting recovery:', error);
    
    // Clean up if error occurred
    if (gridElement.contains(watermark)) {
      gridElement.removeChild(watermark);
    }
    gridElement.style.position = originalPosition;
    
    throw error;
  }
}
