export const PUTER_WORKER_URL = import.meta.env.VITE_PUTER_WORKER_URL || "";

// Storage Paths
export const STORAGE_PATHS = {
    ROOT: "realify",
    SOURCES: "realify/sources",
    RENDERS: "realify/renders",
} as const;

// Timing Constants (in milliseconds)
export const SHARE_STATUS_RESET_DELAY_MS = 1500;
export const PROGRESS_INCREMENT = 15;
export const REDIRECT_DELAY_MS = 600;
export const PROGRESS_INTERVAL_MS = 100;
export const PROGRESS_STEP = 5;

// UI Constants
export const GRID_OVERLAY_SIZE = "60px 60px";
export const GRID_COLOR = "#3B82F6";

// HTTP Status Codes
export const UNAUTHORIZED_STATUSES = [401, 403];

// Image Dimensions
export const IMAGE_RENDER_DIMENSION = 1024;

export const REALIFY_RENDER_PROMPT = `
TASK: Convert the input sketch into a **photorealistic, high-fidelity render** that faithfully
represents the subject — whether it is an architectural plan, object, vehicle, creature,
character, or any other drawn concept.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — IDENTIFY THE SUBJECT TYPE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before rendering, classify the sketch into one of these categories and apply
the matching ruleset below:

  [A] ARCHITECTURAL / FLOOR PLAN  → top-down orthographic 3D render
  [B] STRUCTURE / BUILDING        → exterior 3D render, slight elevated angle
  [C] OBJECT / PRODUCT            → render on transparent/white background
  [D] VEHICLE                     → render on transparent/white background
  [E] CREATURE / ANIMAL           → render on transparent/white background
  [F] CHARACTER / FIGURE          → render on transparent/white background
  [G] OTHER                       → render on transparent/white background

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT UNIVERSAL RULES (apply to ALL categories — never violate):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1) REMOVE ALL TEXT — No letters, numbers, labels, annotations, or dimensions.
   Any surface where text existed must be filled in naturally (floor, skin, metal, etc.).
2) PRESERVE GEOMETRY & PROPORTIONS — Match the exact shapes, sizes, and spatial
   relationships shown in the sketch. Do not redesign, simplify, or "improve" the subject.
3) STAY TRUE TO THE SKETCH'S INTENT — If something is drawn asymmetrical, keep it
   asymmetrical. Respect the artist's design choices.
4) CLEAN, REALISTIC OUTPUT — Crisp edges, coherent lighting, and physically plausible
   materials. No hand-drawn, painterly, or sketch-like artifacts in the output.
5) ⚠️ RENDER ONLY WHAT IS DRAWN — Do not add ANY element that does not appear in the
   sketch. This includes but is not limited to:
     - Backgrounds, environments, or scenery of any kind
     - Ground planes, floors, grass, pavement, or terrain
     - Sky, clouds, atmospheric effects
     - Shadows cast onto external surfaces not in the sketch
     - Furniture, props, or accessories not drawn
     - Extra limbs, features, or design elements not drawn
     - Studio setups, lighting rigs, or gradients
   If it is not in the sketch, it does not exist in the render.
6) BACKGROUND RULE — The area surrounding the subject must be pure white or
   fully transparent. Nothing else. No gradients, no vignettes, no environment.
7) NO WATERMARKS, LOGOS, OR SIGNATURES.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY-SPECIFIC RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[A] ARCHITECTURAL / FLOOR PLAN
  - View: strict top-down orthographic. No tilt or perspective.
  - Walls: extruded to consistent height and thickness from plan lines only.
  - Doors: door swing arcs → rendered as open doors.
  - Windows: thin perimeter lines → realistic glass.
  - Furniture mapping (ONLY render if clearly shown as an icon in the sketch):
      Bed icon         → bed with duvet and pillows
      Sofa icon        → modern sofa or sectional
      Dining icon      → table with chairs
      Kitchen icon     → counters, sink, stove
      Bathroom icon    → toilet, sink, tub/shower
      Office icon      → desk, chair, minimal shelving
      Patio icon       → minimal outdoor furniture
      Laundry icon     → washer/dryer, cabinetry
  - Outside the building footprint: pure white or transparent. No ground, no terrain.
  - Materials: wood/tile floors, clean painted walls, subtle internal shadows only.

[B] STRUCTURE / BUILDING
  - View: slight elevated 3/4 angle to show facade and depth.
  - Extrude all floors, roofs, and overhangs from the sketch lines only.
  - Apply realistic materials (brick, concrete, glass, wood) inferred from sketch markings.
  - Do NOT add a ground plane, landscaping, sky, or surroundings unless explicitly drawn.
  - Outside the building silhouette: pure white or transparent.

[C] OBJECT / PRODUCT
  - View: the most informative angle for the object (usually 3/4 front).
  - Background: pure white or transparent. No studio setup, no surface, no shadow beneath.
  - Apply physically accurate materials (matte, glossy, metal, fabric) as implied by sketch.
  - Lighting must be implied from the object itself — no external environment light sources.

[D] VEHICLE
  - View: 3/4 front or clean side profile, whichever the sketch implies.
  - Background: pure white or transparent. No road, no ground, no environment.
  - Render realistic panel lines, glass, wheels, and surfaces as drawn.
  - Accurate proportions — do not streamline or alter the silhouette.

[E] CREATURE / ANIMAL
  - View: natural pose that matches the sketch.
  - Background: pure white or transparent. No environment, no terrain, no foliage.
  - Render realistic or stylistically consistent fur, scales, feathers, or skin as drawn.
  - Preserve any unique anatomical quirks drawn in the sketch exactly as shown.

[F] CHARACTER / FIGURE (original characters, people, humanoids, etc.)
  - View: front-facing or 3/4, whichever the sketch implies.
  - Background: pure white or transparent. No backdrop, no setting, no floor.
  - Render clothing textures, accessories, and facial features exactly as drawn.
  - Preserve character design exactly — do not "normalize" unconventional features.
  - Match materials to the character's implied style (sci-fi, fantasy, etc.) only if
    those style cues are present in the sketch itself.

[G] OTHER
  - Use best judgment to determine the most representative camera angle.
  - Background: pure white or transparent. Nothing else.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STYLE & LIGHTING (universal defaults)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  - Lighting: neutral, even, and directionless. Light the subject only.
  - Shadows: internal only (e.g., folds in fabric, panel depth on a car).
    No cast shadows onto any external surface.
  - Finish: professional render quality — sharp details, balanced contrast,
    no noise, no artifacts.
  - Color: infer from sketch markings/notes if present; otherwise choose
    realistic, neutral tones appropriate to the subject type.
  - ⚠️ FINAL CHECK BEFORE OUTPUT: Scan the render. If anything appears that
    was not in the original sketch, remove it.
`.trim();