import { CURRENT_LOCALE } from '../config/variables';

// Numbers are shown without thousands separators: IDs, codes and years are stored as numbers too
const plainFormat = new Intl.NumberFormat(CURRENT_LOCALE, { useGrouping: false, maximumFractionDigits: 20 });
const statFormat = new Intl.NumberFormat(CURRENT_LOCALE, {
  useGrouping: false,
  minimumFractionDigits: 1,
  maximumFractionDigits: 3,
});

export const decimalSeparator = plainFormat.formatToParts(1.5).find((part) => part.type === 'decimal')?.value ?? '.';

// Intl prints negative zero as "-0"; String() and toFixed() never did
function withoutNegativeZero(n: number): number {
  return Object.is(n, -0) ? 0 : n;
}

/** Formats a number in the current locale, keeping all its digits */
export function formatNumber(n: number): string {
  return plainFormat.format(withoutNegativeZero(n));
}

/** Formats a computed statistic in the current locale with 1 to 3 decimals: 28.0, 44.375 */
export function formatStat(n: number): string {
  return statFormat.format(withoutNegativeZero(n));
}

/** Rounds a number to the given count of decimals */
export function roundNumber(n: number, digits = 3): number {
  return parseFloat(n.toFixed(digits));
}

/** Parses a number typed with either a comma or a dot as the decimal separator */
export function parseNumber(text: string): number | undefined {
  const n = parseFloat(text.replace(/−/g, '-').replace(/,/g, '.'));
  return isNaN(n) ? undefined : n;
}

/** Keeps only a valid number in user input and shows the current locale's decimal separator */
export function sanitizeNumberInput(text: string): string {
  let separatorCount = 0;
  return text
    .replace(/−/g, '-')
    .replace(/,/g, '.')
    .replace(/[^0-9.-]/g, '')
    .replace(/(.)-/g, '$1')
    .replace(/\./g, () => (separatorCount++ === 0 ? '.' : ''))
    .replace(/^\./, '')
    .replace('.', decimalSeparator);
}
