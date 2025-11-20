"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getColorConversions, type ColorValue } from "@/lib/color-utils"
import { getSizeConversions, type SizeValue } from "@/lib/size-utils"
import { toast } from "sonner"
import { useLocale } from "@/hooks/use-locale"

interface ValueDisplayProps {
  value: string
}

export function ValueDisplay({ value }: ValueDisplayProps) {
  const [copied, setCopied] = useState(false)
  const { t } = useLocale()
  
  // Verifica se é uma cor
  const colorConversions = getColorConversions(value)
  const [selectedColor, setSelectedColor] = useState<ColorValue | null>(
    colorConversions ? colorConversions[0] : null
  )

  // Verifica se é um tamanho
  const sizeConversions = getSizeConversions(value)
  const [selectedSize, setSelectedSize] = useState<SizeValue | null>(
    sizeConversions ? sizeConversions[0] : null
  )

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      toast.success(t.copiedToClipboard || "Copiado para a área de transferência!")
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Se for uma cor
  if (colorConversions && selectedColor) {
    return (
      <div className="flex items-center gap-2">
        {/* Preview da cor */}
        <div
          className="w-6 h-6 rounded border border-border shrink-0"
          style={{ backgroundColor: selectedColor.value }}
          title={selectedColor.value}
        />
        
        {/* Valor clicável para copiar */}
        <button
          onClick={() => handleCopy(selectedColor.value)}
          className="font-mono text-sm bg-muted px-2 py-1 rounded hover:bg-muted/80 transition-colors flex items-center gap-1 min-w-0"
          title={t.clickToCopy || "Clique para copiar"}
        >
          <span className="truncate">{selectedColor.value}</span>
          {copied ? (
            <Check className="w-3 h-3 text-green-500 shrink-0" />
          ) : (
            <Copy className="w-3 h-3 opacity-50 shrink-0" />
          )}
        </button>

        {/* Select para trocar formato */}
        <Select
          value={selectedColor.format}
          onValueChange={(format) => {
            const conversion = colorConversions.find((c) => c.format === format)
            if (conversion) setSelectedColor(conversion)
          }}
        >
          <SelectTrigger className="w-[100px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colorConversions.map((conversion) => (
              <SelectItem key={conversion.format} value={conversion.format} className="text-xs">
                {conversion.format.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  }

  // Se for um tamanho
  if (sizeConversions && selectedSize) {
    return (
      <div className="flex items-center gap-2">
        {/* Valor clicável para copiar */}
        <button
          onClick={() => handleCopy(selectedSize.value)}
          className="font-mono text-sm bg-muted px-2 py-1 rounded hover:bg-muted/80 transition-colors flex items-center gap-1"
          title={t.clickToCopy || "Clique para copiar"}
        >
          <span>{selectedSize.value}</span>
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3 opacity-50" />
          )}
        </button>

        {/* Select para trocar unidade (apenas se houver mais de uma opção) */}
        {sizeConversions.length > 1 && (
          <Select
            value={selectedSize.unit}
            onValueChange={(unit) => {
              const conversion = sizeConversions.find((c) => c.unit === unit)
              if (conversion) setSelectedSize(conversion)
            }}
          >
            <SelectTrigger className="w-[80px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizeConversions.map((conversion) => (
                <SelectItem key={conversion.unit} value={conversion.unit} className="text-xs">
                  {conversion.unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    )
  }

  // Valor padrão (não é cor nem tamanho)
  return (
    <button
      onClick={() => handleCopy(value)}
      className="font-mono text-sm bg-muted px-2 py-1 rounded hover:bg-muted/80 transition-colors flex items-center gap-1"
      title={t.clickToCopy || "Clique para copiar"}
    >
      <span className="truncate max-w-[200px]">{value}</span>
      {copied ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <Copy className="w-3 h-3 opacity-50" />
      )}
    </button>
  )
}
