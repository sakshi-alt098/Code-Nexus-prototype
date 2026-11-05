// Client-Side Canvas Dominant Color Extractor & Brand Palette Matcher
// Uses HTML5 Canvas ImageData and Euclidean RGB Distance

import { OFFICIAL_BRAND_PALETTE } from '../data/mockGuidelines';

export interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  percentage: number;
  nearestBrandColor: {
    name: string;
    hex: string;
    distance: number;
    isMatch: boolean;
  };
}

export interface ImageAuditResult {
  dominantColors: ExtractedColor[];
  brandAdherenceScore: number; // 0 to 100%
  nonBrandColorCount: number;
  warnings: string[];
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const h = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return h.length === 1 ? '0' + h : h;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

function colorDistance(c1: [number, number, number], c2: [number, number, number]): number {
  // Weighted Euclidean RGB distance for human perceptual sensitivity
  const rDiff = c1[0] - c2[0];
  const gDiff = c1[1] - c2[1];
  const bDiff = c1[2] - c2[2];
  return Math.sqrt(0.3 * rDiff * rDiff + 0.59 * gDiff * gDiff + 0.11 * bDiff * bDiff);
}

export function extractDominantColorsFromImage(
  imageElement: HTMLImageElement,
  maxColors = 5
): ImageAuditResult {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return {
      dominantColors: [],
      brandAdherenceScore: 0,
      nonBrandColorCount: 0,
      warnings: ['Canvas 2D context unavailable']
    };
  }

  // Downsample to 100x100 for fast, responsive processing
  const width = 100;
  const height = 100;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(imageElement, 0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height).data;
  const colorBuckets = new Map<string, { count: number; rgb: [number, number, number] }>();
  let totalValidPixels = 0;

  // Sample every 2nd pixel
  for (let i = 0; i < imgData.length; i += 8) {
    const a = imgData[i + 3];
    if (a < 128) continue; // Skip transparent pixels

    const r = Math.round(imgData[i] / 16) * 16;
    const g = Math.round(imgData[i + 1] / 16) * 16;
    const b = Math.round(imgData[i + 2] / 16) * 16;

    const key = `${r},${g},${b}`;
    const existing = colorBuckets.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      colorBuckets.set(key, { count: 1, rgb: [r, g, b] });
    }
    totalValidPixels++;
  }

  // Sort buckets by frequency
  const sorted = Array.from(colorBuckets.values()).sort((a, b) => b.count - a.count);

  // Group similar colors to get distinct palette
  const distinctColors: { rgb: [number, number, number]; count: number }[] = [];
  for (const item of sorted) {
    if (distinctColors.length >= maxColors) break;
    const isTooClose = distinctColors.some(d => colorDistance(d.rgb, item.rgb) < 32);
    if (!isTooClose) {
      distinctColors.push(item);
    }
  }

  // Fallback if image is solid
  if (distinctColors.length === 0 && sorted.length > 0) {
    distinctColors.push(sorted[0]);
  }

  const brandRgbList = OFFICIAL_BRAND_PALETTE.map(b => ({
    name: b.name,
    hex: b.hex,
    rgb: hexToRgb(b.hex)
  }));

  let brandMatchPixelCount = 0;
  const warnings: string[] = [];

  const dominantColors: ExtractedColor[] = distinctColors.map(c => {
    const hex = rgbToHex(c.rgb[0], c.rgb[1], c.rgb[2]);
    const percentage = totalValidPixels > 0 ? Math.round((c.count / totalValidPixels) * 100) : 0;

    // Find closest official brand color
    let closestBrand = brandRgbList[0];
    let minDistance = colorDistance(c.rgb, closestBrand.rgb);

    for (let i = 1; i < brandRgbList.length; i++) {
      const dist = colorDistance(c.rgb, brandRgbList[i].rgb);
      if (dist < minDistance) {
        minDistance = dist;
        closestBrand = brandRgbList[i];
      }
    }

    // Distance threshold of 45 indicates visual harmony with brand token
    const isMatch = minDistance <= 45;
    if (isMatch) {
      brandMatchPixelCount += c.count;
    }

    return {
      hex,
      rgb: c.rgb,
      percentage,
      nearestBrandColor: {
        name: closestBrand.name,
        hex: closestBrand.hex,
        distance: Math.round(minDistance),
        isMatch
      }
    };
  });

  const adherenceScore = totalValidPixels > 0 
    ? Math.min(100, Math.round((brandMatchPixelCount / (totalValidPixels * 0.7)) * 100))
    : 85;

  const nonBrandColors = dominantColors.filter(c => !c.nearestBrandColor.isMatch);
  if (nonBrandColors.length > 0) {
    warnings.push(`${nonBrandColors.length} extracted tone(s) deviate from the 5 approved Inkloom brand tokens.`);
  }

  return {
    dominantColors,
    brandAdherenceScore: Math.max(20, adherenceScore),
    nonBrandColorCount: nonBrandColors.length,
    warnings
  };
}
