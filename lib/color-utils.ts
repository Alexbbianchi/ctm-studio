// Conversões de cores

export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla'

export interface ColorValue {
  format: ColorFormat
  value: string
}

// Converte HEX para RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// Converte RGB para HEX
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

// Converte RGB para HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

// Converte HSL para RGB
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360
  s /= 100
  l /= 100

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

// Detecta o formato da cor e retorna todas as conversões possíveis
export function getColorConversions(color: string): ColorValue[] | null {
  const trimmed = color.trim().toUpperCase()

  // HEX
  if (/^#([a-f\d]{3}|[a-f\d]{6})$/i.test(trimmed)) {
    let hex = trimmed
    // Converte shorthand (#fff) para full (#ffffff)
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
    }
    
    const rgb = hexToRgb(hex)
    if (!rgb) return null

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

    return [
      { format: 'hex', value: hex.toUpperCase() },
      { format: 'rgb', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
      { format: 'rgba', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
      { format: 'hsl', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      { format: 'hsla', value: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)` },
    ]
  }

  // RGB / RGBA
  const rgbMatch = trimmed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1])
    const g = parseInt(rgbMatch[2])
    const b = parseInt(rgbMatch[3])
    const a = rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1

    const hex = rgbToHex(r, g, b)
    const hsl = rgbToHsl(r, g, b)

    return [
      { format: 'hex', value: hex.toUpperCase() },
      { format: 'rgb', value: `rgb(${r}, ${g}, ${b})` },
      { format: 'rgba', value: `rgba(${r}, ${g}, ${b}, ${a})` },
      { format: 'hsl', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      { format: 'hsla', value: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})` },
    ]
  }

  // HSL / HSLA
  const hslMatch = trimmed.match(/hsla?\((\d+),\s*(\d+)%?,\s*(\d+)%?(?:,\s*([\d.]+))?\)/)
  if (hslMatch) {
    const h = parseInt(hslMatch[1])
    const s = parseInt(hslMatch[2])
    const l = parseInt(hslMatch[3])
    const a = hslMatch[4] ? parseFloat(hslMatch[4]) : 1

    const rgb = hslToRgb(h, s, l)
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b)

    return [
      { format: 'hex', value: hex.toUpperCase() },
      { format: 'rgb', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
      { format: 'rgba', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})` },
      { format: 'hsl', value: `hsl(${h}, ${s}%, ${l}%)` },
      { format: 'hsla', value: `hsla(${h}, ${s}%, ${l}%, ${a})` },
    ]
  }

  return null
}
