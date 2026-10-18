import {
  createTheme,
  darken,
  rgba,
  type AlertProps,
  type CSSVariablesResolver,
  type MantineColorsTuple,
  type MantineTheme,
  type NotificationProps,
} from '@mantine/core';

const brand: MantineColorsTuple = [
  '#EEF3FF', '#DCE6FF', '#C0D2FF', '#9DB8FF', '#7396FB',
  '#5B82F8', '#4071F4', '#3562D8', '#2C53B9', '#234493',
];

const dark: MantineColorsTuple = [
  '#C9CDD4', '#B4B9C1', '#9AA0A9', '#6B7280', '#3D4450',
  '#333A45', '#2D333B', '#282D35', '#22272E', '#1C2128',
];

const success: MantineColorsTuple = [
  '#ECFDF3', '#D8FBE4', '#B1F4C8', '#83E6A6', '#58D488',
  '#34C26F', '#25AB5E', '#18854A', '#106739', '#0A4B2A',
];

const info: MantineColorsTuple = [
  '#EEF4FF', '#DDE8FF', '#B8D0FF', '#8FB3FF', '#6492FF',
  '#4478FF', '#2F66F0', '#2453CA', '#1E45A3', '#193A81',
];

const warning: MantineColorsTuple = [
  '#FFF8E8', '#FDEFCB', '#F9DB97', '#F3C15F', '#E9A62D',
  '#DD8F14', '#C7780B', '#A25F07', '#814A09', '#693D0C',
];

const error: MantineColorsTuple = [
  '#FFF1F2', '#FFE1E3', '#FFC7CC', '#FFA0A8', '#FF7580',
  '#F04F5D', '#D83A4B', '#B42B3E', '#8F2334', '#6E1B29',
];

type SeverityTone = {
  background: string;
  border: string;
  text: string;
  title: string;
  icon: string;
};

const DARK_SEVERITY_TONES: Record<string, SeverityTone> = {
  red: {
    background: rgba(error[9], 0.88),
    border: rgba(error[4], 0.78),
    text: error[0],
    title: '#FFFFFF',
    icon: error[2],
  },
  error: {
    background: rgba(error[9], 0.88),
    border: rgba(error[4], 0.78),
    text: error[0],
    title: '#FFFFFF',
    icon: error[2],
  },
  orange: {
    background: rgba(warning[9], 0.9),
    border: rgba(warning[4], 0.72),
    text: warning[0],
    title: '#FFFFFF',
    icon: warning[2],
  },
  yellow: {
    background: rgba(warning[9], 0.9),
    border: rgba(warning[4], 0.72),
    text: warning[0],
    title: '#FFF7E6',
    icon: warning[2],
  },
  warning: {
    background: rgba(warning[9], 0.9),
    border: rgba(warning[4], 0.72),
    text: warning[0],
    title: '#FFF7E6',
    icon: warning[2],
  },
  green: {
    background: rgba(success[9], 0.88),
    border: rgba(success[4], 0.72),
    text: success[0],
    title: '#FFFFFF',
    icon: success[2],
  },
  success: {
    background: rgba(success[9], 0.88),
    border: rgba(success[4], 0.72),
    text: success[0],
    title: '#FFFFFF',
    icon: success[2],
  },
  blue: {
    background: rgba(info[9], 0.88),
    border: rgba(info[4], 0.74),
    text: info[0],
    title: '#FFFFFF',
    icon: info[2],
  },
  info: {
    background: rgba(info[9], 0.88),
    border: rgba(info[4], 0.74),
    text: info[0],
    title: '#FFFFFF',
    icon: info[2],
  },
};

function resolveSeverityTone(color?: string): SeverityTone | null {
  if (!color) {
    return null;
  }

  return DARK_SEVERITY_TONES[color] ?? null;
}

// Mantine 8 dropped Emotion; component `styles` are applied as React inline
// styles, which don't support nested CSS selectors. Define per-color CSS
// variables here and switch their values in dark mode via the resolver so the
// component styles can stay flat.
export const themeVarsResolver: CSSVariablesResolver = () => {
  const light: Record<string, string> = {
    // Content accents deliberately use the platform palette instead of
    // tenant-overridable primary variables. Tenant colours still own filled
    // actions, while links and informational icons keep dependable contrast.
    '--uv-content-link-color': brand[6],
    '--uv-content-link-hover-color': brand[7],
    '--uv-accent-icon-color': brand[6],
    '--uv-surface-neutral': 'var(--mantine-color-gray-0)',
    '--uv-surface-neutral-border': 'var(--mantine-color-gray-3)',
    '--uv-surface-accent': rgba(brand[6], 0.08),
    '--uv-surface-accent-strong': rgba(brand[6], 0.14),
    '--uv-surface-accent-border': rgba(brand[6], 0.34),
    '--uv-surface-accent-foreground': 'var(--mantine-color-gray-9)',
    '--uv-field-border': 'var(--mantine-color-gray-4)',
    '--uv-field-border-hover': brand[5],
    '--uv-field-border-focus': brand[6],
    '--uv-field-border-disabled': 'var(--mantine-color-gray-3)',
  };
  const dark: Record<string, string> = {
    '--uv-content-link-color': brand[2],
    '--uv-content-link-hover-color': brand[1],
    '--uv-accent-icon-color': brand[2],
    '--uv-surface-neutral': 'var(--mantine-color-dark-7)',
    '--uv-surface-neutral-border': 'var(--mantine-color-dark-4)',
    '--uv-surface-accent': rgba(brand[3], 0.13),
    '--uv-surface-accent-strong': rgba(brand[3], 0.2),
    '--uv-surface-accent-border': rgba(brand[2], 0.48),
    '--uv-surface-accent-foreground': 'var(--mantine-color-dark-0)',
    '--uv-field-border': 'var(--mantine-color-dark-3)',
    '--uv-field-border-hover': brand[3],
    '--uv-field-border-focus': brand[2],
    '--uv-field-border-disabled': 'var(--mantine-color-dark-5)',
  };

  for (const [color, tone] of Object.entries(DARK_SEVERITY_TONES)) {
    // Light mode: delegate to Mantine's built-in colour-light variables so the
    // component looks identical to the Mantine default.
    light[`--uv-tone-${color}-bg`] = `var(--mantine-color-${color}-light)`;
    light[`--uv-tone-${color}-color`] = `var(--mantine-color-${color}-light-color)`;
    light[`--uv-tone-${color}-title-color`] = `var(--mantine-color-${color}-light-color)`;
    light[`--uv-tone-${color}-icon-color`] = `var(--mantine-color-${color}-filled)`;
    light[`--uv-tone-${color}-border`] = 'none';
    light[`--uv-tone-${color}-shadow`] = 'none';

    // Dark mode: custom high-contrast tones.
    dark[`--uv-tone-${color}-bg`] = tone.background;
    dark[`--uv-tone-${color}-color`] = tone.text;
    dark[`--uv-tone-${color}-title-color`] = tone.title;
    dark[`--uv-tone-${color}-icon-color`] = tone.icon;
    dark[`--uv-tone-${color}-border`] = `1px solid ${tone.border}`;
    dark[`--uv-tone-${color}-shadow`] =
      `0 10px 24px ${rgba(darken(tone.background, 0.25), 0.18)}`;
  }

  return { variables: {}, light, dark };
};

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 6, dark: 8 },
  autoContrast: true,
  luminanceThreshold: 0.3,

  colors: {
    brand,
    dark,
    success,
    info,
    warning,
    error,
  },

  fontFamily: "var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontFamilyMonospace: "Geist Mono, Menlo, Monaco, Consolas, 'Courier New', monospace",

  // Design-token font weights. Consumed via theme.other.fontWeights.*
  // — Mantine's root theme type has no dedicated `fontWeights` slot, so we
  // carry it on `other` (the documented escape hatch).
  other: {
    fontWeights: {
      regular: 400,
      medium: 500,
      bold: 600,
    },
  },

  headings: {
    fontFamily: "var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '1.875rem', lineHeight: '1.2' },
      h2: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.3' },
      h3: { fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.4' },
      h4: { fontSize: '1.125rem', fontWeight: '600', lineHeight: '1.4' },
    },
  },

  defaultRadius: 'md',
  radius: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '2rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },

  shadows: {
    xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
    sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
  },

  focusRing: 'auto',
  cursorType: 'pointer',
  respectReducedMotion: true,
  defaultGradient: { from: '#4071F4', to: '#5B82F8', deg: 180 },

  components: {
    Button: {
      defaultProps: { radius: 'md', variant: 'default' },
      styles: {
        root: {
          position: 'relative',
        },
        // Mantine positions the loader with left: 50%; top: 50%; but no
        // centering translate, so the spinner's top-left sits at button
        // centre — making it appear shifted right and down. Add the
        // missing translate to truly centre it.
        loader: {
          transform: 'translate(-50%, -50%)',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
        padding: 'lg',
        withBorder: true,
      },
    },
    TextInput: {
      defaultProps: { radius: 'md', size: 'md' },
    },
    PasswordInput: {
      defaultProps: { radius: 'md', size: 'md' },
    },
    Select: {
      defaultProps: { radius: 'md', size: 'md', comboboxProps: { withinPortal: true } },
    },
    MultiSelect: {
      defaultProps: { radius: 'md', size: 'md', comboboxProps: { withinPortal: true } },
    },
    TagsInput: {
      defaultProps: { radius: 'md', size: 'md', comboboxProps: { withinPortal: true } },
    },
    Textarea: {
      defaultProps: { radius: 'md', size: 'md' },
    },
    NumberInput: {
      defaultProps: { radius: 'md', size: 'md' },
    },
    DatePickerInput: {
      defaultProps: { radius: 'md', size: 'md' },
    },
    Badge: {
      defaultProps: { radius: 'xl', variant: 'light', size: 'sm' },
    },
    Modal: {
      defaultProps: {
        radius: 'md',
        padding: 'lg',
        centered: true,
        overlayProps: { backgroundOpacity: 0.8, blur: 2 },
      },
    },
    Drawer: {
      defaultProps: {
        padding: 'lg',
        overlayProps: { backgroundOpacity: 0.8, blur: 2 },
      },
    },
    Pagination: {
      defaultProps: { color: 'brand', radius: 'md', size: 'sm' },
    },
    Avatar: {
      defaultProps: { radius: 'xl' },
    },
    Tooltip: {
      defaultProps: { radius: 'sm', withArrow: true },
    },
    Tabs: {
      defaultProps: { radius: 'md' },
    },
    Table: {
      defaultProps: {
        highlightOnHover: true,
        withTableBorder: false,
        withColumnBorders: false,
      },
    },
    Alert: {
      defaultProps: { radius: 'md', variant: 'light' },
      styles: (theme: MantineTheme, props: AlertProps) => {
        const color = typeof props.color === 'string' ? props.color : undefined;
        if (!color || !resolveSeverityTone(color) || props.variant !== 'light') return {};
        return {
          root: {
            backgroundColor: `var(--uv-tone-${color}-bg)`,
            border: `var(--uv-tone-${color}-border)`,
            color: `var(--uv-tone-${color}-color)`,
            boxShadow: `var(--uv-tone-${color}-shadow)`,
          },
          wrapper: { gap: theme.spacing.sm },
          icon: { color: `var(--uv-tone-${color}-icon-color)` },
          title: { color: `var(--uv-tone-${color}-title-color)`, fontWeight: 600 },
          label: { color: `var(--uv-tone-${color}-color)` },
          message: { color: `var(--uv-tone-${color}-color)` },
        };
      },
    },
    Notification: {
      defaultProps: { radius: 'md' },
      styles: (_theme: MantineTheme, props: NotificationProps) => {
        const color = typeof props.color === 'string' ? props.color : undefined;
        if (!color || !resolveSeverityTone(color)) return {};
        return {
          root: {
            backgroundColor: `var(--uv-tone-${color}-bg)`,
            border: `var(--uv-tone-${color}-border)`,
            color: `var(--uv-tone-${color}-color)`,
            boxShadow: `var(--uv-tone-${color}-shadow)`,
          },
          icon: { color: `var(--uv-tone-${color}-icon-color)` },
          title: { color: `var(--uv-tone-${color}-title-color)`, fontWeight: 600 },
          description: { color: `var(--uv-tone-${color}-color)` },
          closeButton: { color: `var(--uv-tone-${color}-color)` },
        };
      },
    },
    Skeleton: {
      defaultProps: { radius: 'md' },
      styles: {
        root: {
          '--skeleton-radius': 'calc(var(--mantine-radius-md) * 1.618)',
          borderRadius: 'var(--skeleton-radius)',
        },
      },
    },
  },
});
