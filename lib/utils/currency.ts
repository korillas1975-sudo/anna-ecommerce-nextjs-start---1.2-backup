export const formatTHB = (value: number, options?: { fractionDigits?: number }) => {
  const minimumFractionDigits = options?.fractionDigits ?? 0
  const maximumFractionDigits = options?.fractionDigits ?? 0
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value)
}

