/**
 * CarbonSphere AI - Specialized Design Tokens
 * For programmatic usage in React/Canvas/SVG
 */

export const BREAKPOINT_TOKENS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
} as const;

export const RESPONSIVE_GRID_TOKENS = {
  columns: {
    mobile: 4,
    tablet: 8,
    desktop: 12,
  },
  gap: {
    mobile: 16, // px
    tablet: 24, // px
    desktop: 24, // px
  },
  margin: {
    mobile: 16, // px
    tablet: 32, // px
    desktop: 40, // px
  }
} as const;

export const DATA_TABLE_TOKENS = {
  rowHeights: {
    compact: 32,    // High data density
    standard: 48,   // Standard reading
    comfortable: 64 // Contains avatars/complex data
  },
  headerHeight: 40,
  cellPadding: {
    x: 16,
    y: 12,
  },
  stickyOffsets: {
    firstColumn: 0,
    actionColumn: 0,
  }
} as const;

export const FORM_LAYOUT_TOKENS = {
  spacing: {
    fieldGap: 24,          // Spacing between different input groups
    labelMarginBottom: 8,  // Spacing between label and input
    errorMarginTop: 6,     // Spacing between input and error message
    groupGap: 32,          // Spacing between logical form sections
  },
  validation: {
    iconSize: 16,          // Size of success/error icons inside inputs
    shakeAnimationX: 4,    // Pixels to shake on invalid submit
  }
} as const;

export const CHART_TOKENS = {
  colors: {
    primaryLine: "#00E599",     // Eco Emerald
    secondaryLine: "#00B8FF",   // Bioluminescent Blue
    benchmarkDashed: "#A1A1AA", // Gray 400
    gridLinesLight: "#E4E4E7",  // Gray 200
    gridLinesDark: "#27272A",   // Gray 800
    axisText: "#71717A",        // Gray 500
  },
  gradients: {
    areaPrimary: {
      start: "rgba(0, 229, 153, 0.4)",
      end: "rgba(0, 229, 153, 0.0)"
    }
  },
  tooltip: {
    bgLight: "#18181B",         // Gray 900
    textLight: "#FFFFFF",
    bgDark: "#FAFAFA",
    textDark: "#18181B",
    borderRadius: "6px",
  }
} as const;

export const AI_ASSISTANT_TOKENS = {
  avatar: {
    gradientStart: "#00E599",
    gradientEnd: "#00B8FF",
    pulseShadow: "rgba(0, 184, 255, 0.4)",
  },
  chat: {
    userBgLight: "#F4F4F5",
    userBgDark: "#27272A",
    aiBorderLight: "#00B8FF",
    aiBorderDark: "#00B8FF",
    aiBgLight: "rgba(0, 184, 255, 0.05)",
    aiBgDark: "rgba(0, 184, 255, 0.1)",
  },
  thinkingState: {
    dotColor: "#00B8FF",
    animation: "spring",
  }
} as const;

export const GAMIFICATION_TOKENS = {
  badges: {
    bronze: "linear-gradient(135deg, #D4D4D8 0%, #A1A1AA 100%)",
    silver: "linear-gradient(135deg, #F4F4F5 0%, #D4D4D8 100%)",
    gold: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
    platinum: "linear-gradient(135deg, #00E599 0%, #00B8FF 100%)", // Aurora
  },
  streak: {
    activeLight: "#F97316", // Terra Cotta
    activeDark: "#F97316",
    inactive: "#A1A1AA",
    glowColor: "rgba(249, 115, 22, 0.4)",
  }
} as const;

export const SUSTAINABILITY_SCORE_TOKENS = {
  thresholds: {
    poor: { min: 0, max: 399 },
    average: { min: 400, max: 699 },
    excellent: { min: 700, max: 1000 },
  },
  colors: {
    poor: "#F97316",      // Terra Cotta
    average: "#FBBF24",   // Solar Yellow
    excellent: "#00E599", // Eco Emerald
    trackBgLight: "#E4E4E7",
    trackBgDark: "#27272A",
  },
  typography: {
    numberFont: "Inter Display, sans-serif",
    fontWeight: 700,
  },
  trends: {
    upward: "#10B981",    // Canopy Green
    downward: "#EF4444",  // Error Red
    neutral: "#A1A1AA",   // Gray 400
  }
} as const;

export type ScoreThresholdType = keyof typeof SUSTAINABILITY_SCORE_TOKENS.thresholds;
