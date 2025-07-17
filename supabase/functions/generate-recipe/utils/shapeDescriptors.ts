/**
 * Shape descriptor mapping system for fluid, delicate dumpling descriptions
 * Converts basic shape names into poetic, flowing visual descriptions
 */

export interface ShapeDescriptor {
  name: string;
  fluidDescription: string;
  delicateQualities: string[];
  artisticModifiers: string[];
}

export const SHAPE_DESCRIPTORS: Record<string, ShapeDescriptor> = {
  organic: {
    name: "organic",
    fluidDescription: "flowing, naturally curved with soft undulating edges, like wind-shaped forms",
    delicateQualities: ["naturally flowing", "soft curves", "gentle undulations", "organic ripples"],
    artisticModifiers: ["gracefully asymmetrical", "nature-inspired", "softly irregular"]
  },
  
  bundle: {
    name: "bundle",
    fluidDescription: "gathered in delicate pleats with flowing fabric-like folds, softly clustered",
    delicateQualities: ["gentle pleating", "fabric-like folds", "soft clustering", "gathered textures"],
    artisticModifiers: ["elegantly bundled", "textile-inspired", "softly wrapped"]
  },
  
  star: {
    name: "star",
    fluidDescription: "radiating gentle points with graceful curves, like a delicate flower bloom",
    delicateQualities: ["radiating softly", "gentle pointed curves", "bloom-like extensions", "graceful rays"],
    artisticModifiers: ["florally inspired", "softly radiating", "delicately pointed"]
  },
  
  triangle: {
    name: "triangle",
    fluidDescription: "elegantly tapered with soft corners, pyramid-like but gentle and flowing",
    delicateQualities: ["soft angular curves", "gentle tapering", "rounded corners", "flowing edges"],
    artisticModifiers: ["gracefully angular", "softly geometric", "gently tapered"]
  },
  
  oval: {
    name: "oval",
    fluidDescription: "smoothly rounded with perfect curves, like a soft pearl or teardrop",
    delicateQualities: ["perfect curves", "smooth rounding", "pearl-like smoothness", "flowing contours"],
    artisticModifiers: ["perfectly curved", "pearl-inspired", "smoothly flowing"]
  }
};

/**
 * Get enhanced shape description for image generation
 */
export function getFluidShapeDescription(shapeName: string): string {
  const descriptor = SHAPE_DESCRIPTORS[shapeName.toLowerCase()];
  
  if (!descriptor) {
    // Fallback for unknown shapes - make them fluid and delicate anyway
    return `flowing and delicate ${shapeName}-inspired form with soft, graceful curves`;
  }
  
  return descriptor.fluidDescription;
}

/**
 * Get delicate qualities for enhanced prompt building
 */
export function getDelicateQualities(shapeName: string): string[] {
  const descriptor = SHAPE_DESCRIPTORS[shapeName.toLowerCase()];
  return descriptor?.delicateQualities || ["soft curves", "gentle form", "delicate structure"];
}

/**
 * Get artistic modifiers for style enhancement
 */
export function getArtisticModifiers(shapeName: string): string[] {
  const descriptor = SHAPE_DESCRIPTORS[shapeName.toLowerCase()];
  return descriptor?.artisticModifiers || ["gracefully formed", "artistically shaped"];
}

/**
 * Build complete enhanced shape prompt segment
 */
export function buildEnhancedShapePrompt(shapeName: string, additionalContext?: string): string {
  const fluidDescription = getFluidShapeDescription(shapeName);
  const qualities = getDelicateQualities(shapeName);
  const modifiers = getArtisticModifiers(shapeName);
  
  // Sample from qualities and modifiers for variety
  const selectedQuality = qualities[Math.floor(Math.random() * qualities.length)];
  const selectedModifier = modifiers[Math.floor(Math.random() * modifiers.length)];
  
  let enhancedPrompt = `dumplings ${fluidDescription}, with ${selectedQuality}, ${selectedModifier}`;
  
  if (additionalContext) {
    enhancedPrompt += `, ${additionalContext}`;
  }
  
  return enhancedPrompt;
}