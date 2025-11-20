// Conversões de tamanhos

export type SizeUnit = 'px' | 'rem' | 'em' | 'pt' | 'vh' | 'vw' | '%'

export interface SizeValue {
  unit: SizeUnit
  value: string
}

const BASE_FONT_SIZE = 16 // Tamanho base padrão do navegador

// Converte rem para px
export function remToPx(rem: number): number {
  return rem * BASE_FONT_SIZE
}

// Converte px para rem
export function pxToRem(px: number): number {
  return px / BASE_FONT_SIZE
}

// Converte em para px (assumindo base 16px)
export function emToPx(em: number): number {
  return em * BASE_FONT_SIZE
}

// Converte px para em
export function pxToEm(px: number): number {
  return px / BASE_FONT_SIZE
}

// Converte pt para px
export function ptToPx(pt: number): number {
  return pt * 1.333333
}

// Converte px para pt
export function pxToPt(px: number): number {
  return px / 1.333333
}

// Detecta o formato do tamanho e retorna todas as conversões possíveis
export function getSizeConversions(size: string): SizeValue[] | null {
  const trimmed = size.trim()

  // Tenta extrair número e unidade
  const match = trimmed.match(/^([\d.]+)(px|rem|em|pt|vh|vw|%)?$/)
  if (!match) return null

  const numValue = parseFloat(match[1])
  const unit = (match[2] || 'px') as SizeUnit

  const conversions: SizeValue[] = []

  // Conversões apenas para unidades absolutas (px, rem, em, pt)
  if (['px', 'rem', 'em', 'pt'].includes(unit)) {
    let pxValue: number

    // Converte tudo para px primeiro
    switch (unit) {
      case 'px':
        pxValue = numValue
        break
      case 'rem':
        pxValue = remToPx(numValue)
        break
      case 'em':
        pxValue = emToPx(numValue)
        break
      case 'pt':
        pxValue = ptToPx(numValue)
        break
      default:
        pxValue = numValue
    }

    // Gera todas as conversões
    conversions.push(
      { unit: 'px', value: `${Math.round(pxValue * 100) / 100}px` },
      { unit: 'rem', value: `${Math.round(pxToRem(pxValue) * 1000) / 1000}rem` },
      { unit: 'em', value: `${Math.round(pxToEm(pxValue) * 1000) / 1000}em` },
      { unit: 'pt', value: `${Math.round(pxToPt(pxValue) * 100) / 100}pt` }
    )
  } else {
    // Para unidades relativas (vh, vw, %), apenas mostra o valor original
    conversions.push({ unit, value: trimmed })
  }

  return conversions
}
