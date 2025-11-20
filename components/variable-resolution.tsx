"use client"

import { useLocale } from "@/hooks/use-locale"
import { ValueDisplay } from "@/components/value-display"

interface VariableResolutionProps {
  valor: string
  chain: string[] | null
}

export function VariableResolution({ valor, chain }: VariableResolutionProps) {
  const { t } = useLocale()
  
  if (chain && chain.length > 1) {
    const finalValue = chain[chain.length - 1]

    return (
      <div className="space-y-2">
        {/* Valor final resolvido */}
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-foreground">{t.finalValue}</div>
          <ValueDisplay value={finalValue} />
        </div>

        {/* Cadeia de resolução - mostra todas as camadas */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">{t.resolutionChain}</div>
          <div className="flex flex-col gap-1 pl-2">
            {chain.map((value, index) => {
              const isLastItem = index === chain.length - 1

              return (
                <div key={index} className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground min-w-[1.5rem]">{index + 1}.</div>
                  <div className={`flex-1 ${isLastItem ? "font-semibold" : ""}`}>
                    <ValueDisplay value={value} />
                  </div>
                  {!isLastItem && <span className="text-xs text-muted-foreground ml-1">→</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <ValueDisplay value={valor} />
    </div>
  )
}
