import { BandStatus, CareerLevel, CountryCode, CurrencyCode } from '../types/salary';
import { COUNTRIES } from '../server/seedData';

export function formatCurrency(amount: number, currency: CurrencyCode = 'USD', compact: boolean = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '$0';

  if (compact) {
    if (Math.abs(amount) >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(2)}B`;
    }
    if (Math.abs(amount) >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `${(amount / 1_000).toFixed(0)}k`;
    }
  }

  const symbolMap: Record<CurrencyCode, string> = {
    USD: '$',
    GBP: '£',
    EUR: '€',
    INR: '₹',
    SGD: 'S$',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    BRL: 'R$',
    PLN: 'zł ',
  };

  const symbol = symbolMap[currency] || '$';

  if (currency === 'INR') {
    // Indian numbering format (e.g. ₹12,50,000)
    const formatted = amount.toLocaleString('en-IN');
    return `${symbol}${formatted}`;
  }

  const formatted = Math.round(amount).toLocaleString('en-US');
  return `${symbol}${formatted}`;
}

export function formatUSD(amount: number, compact: boolean = false): string {
  return formatCurrency(amount, 'USD', compact);
}

export function getCompaRatioColor(compaRatio: number): {
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  label: string;
} {
  if (compaRatio < 0.80) {
    return {
      badgeBg: 'bg-rose-500/15 text-rose-400',
      badgeText: 'text-rose-400',
      borderColor: 'border-rose-500/30',
      label: 'Underpaid (< 0.80)',
    };
  }
  if (compaRatio < 0.90) {
    return {
      badgeBg: 'bg-amber-500/15 text-amber-400',
      badgeText: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      label: 'Low Band (0.80 - 0.89)',
    };
  }
  if (compaRatio <= 1.10) {
    return {
      badgeBg: 'bg-emerald-500/15 text-emerald-400',
      badgeText: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      label: 'Target Band (0.90 - 1.10)',
    };
  }
  if (compaRatio <= 1.20) {
    return {
      badgeBg: 'bg-sky-500/15 text-sky-400',
      badgeText: 'text-sky-400',
      borderColor: 'border-sky-500/30',
      label: 'Upper Band (1.11 - 1.20)',
    };
  }
  return {
    badgeBg: 'bg-purple-500/15 text-purple-400',
    badgeText: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    label: 'Overpaid (> 1.20)',
  };
}

export function getBandStatusBadge(status: BandStatus): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  switch (status) {
    case 'BELOW_BAND':
      return {
        bg: 'bg-red-500/15',
        text: 'text-red-400',
        border: 'border-red-500/30',
        label: 'Below Min Band',
      };
    case 'ABOVE_BAND':
      return {
        bg: 'bg-purple-500/15',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        label: 'Above Max Band',
      };
    case 'IN_BAND':
    default:
      return {
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        label: 'Within Band',
      };
  }
}

export function getLevelBadge(level: CareerLevel): string {
  const map: Record<CareerLevel, string> = {
    L1: 'bg-slate-700 text-slate-200 border-slate-600',
    L2: 'bg-blue-900/50 text-blue-300 border-blue-700/50',
    L3: 'bg-cyan-900/50 text-cyan-300 border-cyan-700/50',
    L4: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
    L5: 'bg-amber-900/50 text-amber-300 border-amber-700/50',
    L6: 'bg-purple-900/50 text-purple-300 border-purple-700/50',
    L7: 'bg-rose-900/50 text-rose-300 border-rose-700/50',
  };
  return map[level] || 'bg-slate-700 text-slate-200';
}

export function getCountryFlag(country: CountryCode): string {
  const map: Record<CountryCode, string> = {
    US: '🇺🇸',
    GB: '🇬🇧',
    DE: '🇩🇪',
    FR: '🇫🇷',
    IN: '🇮🇳',
    SG: '🇸🇬',
    JP: '🇯🇵',
    AU: '🇦🇺',
    CA: '🇨🇦',
    BR: '🇧🇷',
    NL: '🇳🇱',
    PL: '🇵🇱',
  };
  return map[country] || '🌐';
}
