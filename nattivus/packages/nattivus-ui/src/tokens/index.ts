/**
 * T068 + T014: Tokens de Design Nattivus
 *
 * Paleta base + extensão ERP (pipeline stages, status, severity).
 * Expostos via CSS Variables (`--ntv-*`) injetáveis por workspace.
 * Ref: _reversa_sdd/design-system/tokens.md
 */

export const nattivusTokens = {
  colors: {
    primary: {
      default: '#3b82f6', // blue-500
      hover: '#2563eb',   // blue-600
      active: '#1d4ed8',  // blue-700
      subtle: '#eff6ff',  // blue-50
    },
    neutral: {
      900: '#0f172a',
      800: '#1e293b',
      700: '#334155',
      500: '#64748b',
      300: '#cbd5e1',
      100: '#f1f5f9',
      white: '#ffffff',
    },
    semantic: {
      success: '#10b981', // green-500
      warning: '#f59e0b', // amber-500
      danger: '#ef4444',  // red-500
      info: '#0ea5e9',    // sky-500
    }
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
  },
  radii: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },

  // Tokens específicos de CRM — pipeline stages e status (T014)
  crm: {
    stage: {
      new:               '#94a3b8', // slate-400
      meetingScheduled:  '#60a5fa', // blue-400
      demoScheduled:     '#818cf8', // indigo-400
      discovery:         '#a78bfa', // violet-400
      proposalSent:      '#fb923c', // orange-400
      negotiation:       '#facc15', // yellow-400
      closedWon:         '#34d399', // emerald-400
      closedLost:        '#f87171', // red-400
    },
    icp: {
      true:  '#10b981', // ICP confirmado
      false: '#94a3b8', // ICP desconhecido
    },
  },
};

/** Converte os tokens JS em CSS Variables injetáveis no :root ou .nattivus-theme */
export function generateCssVariables(
  tokens: Record<string, unknown> = nattivusTokens,
  prefix = '--ntv',
): string {
  let css = '';
  for (const [key, value] of Object.entries(tokens)) {
    if (value !== null && typeof value === 'object') {
      css += generateCssVariables(value as Record<string, unknown>, `${prefix}-${key}`);
    } else {
      css += `${prefix}-${key}: ${String(value)};\n`;
    }
  }
  return css;
}

/**
 * Gera o bloco :root completo pronto para injetar em um <style>.
 * Útil no bootstrap do frontend Nattivus.
 */
export function generateRootBlock(tokens: Record<string, unknown> = nattivusTokens): string {
  return `:root {\n${generateCssVariables(tokens)}}`;
}
