"use client"

import { useLocale } from "@/hooks/use-locale"

interface VariableResolutionProps {
  valor: string
  chain: string[] | null
}

export function VariableResolution({ valor, chain }: VariableResolutionProps) {
  const { t } = useLocale()
  
  if (chain && chain.length > 1) {
    const finalValue = chain[chain.length - 1]
    const isColor = finalValue.match(/^#[0-9A-Fa-f]{3,8}$/)

    return (
      <div className="space-y-2">
        {/* Valor final resolvido */}
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-foreground">{t.finalValue}</div>
          <code className="text-sm bg-primary/10 px-2 py-1 rounded font-semibold">{finalValue}</code>
          {isColor && <div className="w-6 h-6 rounded border" style={{ backgroundColor: finalValue }} />}
        </div>

        {/* Cadeia de resolução - mostra todas as camadas */}
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">{t.resolutionChain}</div>
          <div className="flex flex-col gap-1 pl-2">
            {chain.map((value, index) => {
              const isLastItem = index === chain.length - 1
              const itemIsColor = value.match(/^#[0-9A-Fa-f]{3,8}$/)

              return (
                <div key={index} className="flex items-center gap-2">
                  <div className="text-xs text-muted-foreground min-w-[1.5rem]">{index + 1}.</div>
                  <code
                    className={`text-xs px-2 py-0.5 rounded flex-1 ${
                      isLastItem ? "bg-primary/10 font-semibold" : "bg-muted/50"
                    }`}
                  >
                    {value}
                  </code>
                  {itemIsColor && (
                    <div className="w-5 h-5 rounded border flex-shrink-0" style={{ backgroundColor: value }} />
                  )}
                  {!isLastItem && <span className="text-xs text-muted-foreground ml-1">→</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const isColor = valor.match(/^#[0-9A-Fa-f]{3,8}$/)

  return (
    <div className="flex items-center gap-2">
      <code className="text-sm bg-muted px-2 py-1 rounded">{valor}</code>
      {isColor && <div className="w-6 h-6 rounded border" style={{ backgroundColor: valor }} />}
    </div>
  )
}
