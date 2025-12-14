import { CardStyles } from '../models/dashboard.models';

/**
 * Convert CardStyles to CSS style object for inline styles
 * Appends !important to ensure overrides work against hover states
 */
export function getCardStyles(styles?: CardStyles): Record<string, string> {
  if (!styles) return {};

  const styleObject: Record<string, string> = {};

  // Helper to add important
  const add = (prop: string, value: string | undefined) => {
    if (value) {
      styleObject[prop] = `${value} !important`;
    }
  };

  // Container styles
  add('background-color', styles.backgroundColor);
  add('background', styles.backgroundGradient);
  add('border-color', styles.borderColor);
  add('border-width', styles.borderWidth);
  add('border-radius', styles.borderRadius);
  add('padding', styles.padding);
  add('margin', styles.margin);
  add('box-shadow', styles.boxShadow);
  add('min-height', styles.minHeight);
  add('max-height', styles.maxHeight);
  add('width', styles.width);

  // Typography - Global
  add('font-family', styles.fontFamily);
  add('color', styles.fontColor);

  // Apply custom CSS if provided
  if (styles.customCSS) {
    Object.assign(styleObject, styles.customCSS);
  }

  return styleObject;
}

/**
 * Get title-specific styles
 */
export function getTitleStyles(styles?: CardStyles): Record<string, string> {
  if (!styles) return {};

  const styleObject: Record<string, string> = {};
  const add = (prop: string, value: string | undefined) => {
    if (value) styleObject[prop] = `${value} !important`;
  };

  add('font-size', styles.titleFontSize);
  add('font-weight', styles.titleFontWeight);
  add('color', styles.titleFontColor);
  add('line-height', styles.titleLineHeight);
  add('margin', styles.titleMargin);

  return styleObject;
}

/**
 * Get value/content-specific styles
 */
export function getValueStyles(styles?: CardStyles): Record<string, string> {
  if (!styles) return {};

  const styleObject: Record<string, string> = {};
  const add = (prop: string, value: string | undefined) => {
    if (value) styleObject[prop] = `${value} !important`;
  };

  add('font-size', styles.valueFontSize);
  add('font-weight', styles.valueFontWeight);
  add('color', styles.valueFontColor);
  add('line-height', styles.valueLineHeight);

  return styleObject;
}

/**
 * Get label/secondary text-specific styles
 */
export function getLabelStyles(styles?: CardStyles): Record<string, string> {
  if (!styles) return {};

  const styleObject: Record<string, string> = {};
  const add = (prop: string, value: string | undefined) => {
    if (value) styleObject[prop] = `${value} !important`;
  };

  add('font-size', styles.labelFontSize);
  add('font-weight', styles.labelFontWeight);
  add('color', styles.labelFontColor);

  return styleObject;
}
