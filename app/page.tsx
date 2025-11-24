"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Pencil, Trash2, Download } from 'lucide-react'
import { ThemeModal } from "@/components/theme-modal"
import { ExportTailwindModal } from "@/components/export-tailwind-modal"
import { useDebounce } from "@/hooks/use-debounce"
import { VariableResolution } from "@/components/variable-resolution"
import { SettingsMenu } from "@/components/settings-menu"
import { useLocale } from "@/hooks/use-locale"

export interface Theme {
  nome: string
  variaveis: Record<string, string>
}

export default function Home() {
  const [temas, setTemas] = useState<Theme[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null)
  const { t } = useLocale()

  const debouncedSearch = useDebounce(searchQuery, 300)

  useEffect(() => {
    const stored = localStorage.getItem("css-themes")
    if (stored) {
      try {
        setTemas(JSON.parse(stored))
      } catch (e) {
        console.error("Erro ao carregar temas:", e)
      }
    } else {
      const initialThemes: Theme[] = [
        {
          nome: "Tema Claro",
          variaveis: {
            "--bg": "#ffffff",
            "--text": "#000000",
            "--color-primary": "#3b82f6",
          },
        },
        {
          nome: "Tema Escuro",
          variaveis: {
            "--bg": "#000000",
            "--text": "#ffffff",
            "--color-primary": "#60a5fa",
          },
        },
      ]
      setTemas(initialThemes)
      localStorage.setItem("css-themes", JSON.stringify(initialThemes))
    }
  }, [])

  useEffect(() => {
    if (temas.length > 0) {
      localStorage.setItem("css-themes", JSON.stringify(temas))
    }
  }, [temas])

  const handleSaveTheme = (theme: Theme) => {
    if (editingTheme) {
      setTemas(temas.map((t) => (t.nome === editingTheme.nome ? theme : t)))
    } else {
      setTemas([...temas, theme])
    }
    setIsModalOpen(false)
    setEditingTheme(null)
  }

  const handleEditTheme = (theme: Theme) => {
    setEditingTheme(theme)
    setIsModalOpen(true)
  }

  const handleDeleteTheme = (themeName: string) => {
    if (confirm(`${t.deleteConfirm} "${themeName}"?`)) {
      setTemas(temas.filter((t) => t.nome !== themeName))
    }
  }

  const handleNewTheme = () => {
    setEditingTheme(null)
    setIsModalOpen(true)
  }

  // Cache de resolução de variáveis para evitar recálculos
  const resolutionCache = useRef<Map<string, string[]>>(new Map())

  // Limpa cache quando temas mudam
  useEffect(() => {
    resolutionCache.current.clear()
  }, [temas])

  // Cria índice de busca otimizado (apenas quando temas mudam)
  const variableIndex = useMemo(() => {
    const index = new Map<string, Array<{ tema: string; variable: string }>>()
    
    temas.forEach((tema) => {
      Object.keys(tema.variaveis).forEach((varName) => {
        const cleanVar = varName.toLowerCase()
        
        // Indexa por partes da variável para busca parcial rápida
        const parts = cleanVar.replace(/^--/, '').split('-')
        parts.forEach((part) => {
          if (!index.has(part)) {
            index.set(part, [])
          }
          index.get(part)!.push({ tema: tema.nome, variable: varName })
        })
        
        // Indexa variável completa para busca exata
        if (!index.has(cleanVar)) {
          index.set(cleanVar, [])
        }
        index.get(cleanVar)!.push({ tema: tema.nome, variable: varName })
      })
    })
    
    return index
  }, [temas])

  // Mapa de temas para acesso O(1)
  const themeMap = useMemo(() => {
    return new Map(temas.map(t => [t.nome, t]))
  }, [temas])

  const resolveVariable = useCallback((
    value: string,
    themeName: string,
    visited = new Set<string>(),
  ): string[] => {
    // Verifica cache
    const cacheKey = `${themeName}:${value}:${Array.from(visited).join(',')}`
    const cached = resolutionCache.current.get(cacheKey)
    if (cached) return cached

    const chain: string[] = [value]

    const varMatch = value.match(/var\((--.+?)\)/)
    if (!varMatch) {
      resolutionCache.current.set(cacheKey, chain)
      return chain
    }

    const referencedVar = varMatch[1]

    if (visited.has(referencedVar)) {
      chain.push(`[Referência circular: ${referencedVar}]`)
      resolutionCache.current.set(cacheKey, chain)
      return chain
    }

    visited.add(referencedVar)

    const currentTheme = themeMap.get(themeName)
    if (!currentTheme) {
      chain.push(`[Tema não encontrado: ${themeName}]`)
      resolutionCache.current.set(cacheKey, chain)
      return chain
    }

    const referencedValue = currentTheme.variaveis[referencedVar]
    if (referencedValue) {
      if (referencedValue.includes(" | ")) {
        const valores = referencedValue.split(" | ")
        const allResolved: string[] = []
        valores.forEach((v, index) => {
          const resolvedChain = resolveVariable(v, themeName, new Set(visited))
          allResolved.push(...resolvedChain)
          if (index < valores.length - 1) {
            allResolved.push("---SEPARATOR---")
          }
        })
        const result = [...chain, ...allResolved]
        resolutionCache.current.set(cacheKey, result)
        return result
      } else {
        const resolvedChain = resolveVariable(referencedValue, themeName, visited)
        const result = [...chain, ...resolvedChain]
        resolutionCache.current.set(cacheKey, result)
        return result
      }
    } else {
      chain.push(`[Variável não encontrada: ${referencedVar}]`)
    }

    resolutionCache.current.set(cacheKey, chain)
    return chain
  }, [themeMap])

  const searchResults = useMemo(() => {
    if (!debouncedSearch.trim()) return null

    // Verifica se é busca parcial (com *) ou exata
    const isPartialSearch = debouncedSearch.trim().startsWith("*")
    
    let searchTerm = debouncedSearch.trim()
    let exactVariable = ""
    
    if (isPartialSearch) {
      // Remove o * e normaliza para busca parcial
      searchTerm = searchTerm.slice(1).toLowerCase()
      if (searchTerm.startsWith("--")) {
        searchTerm = searchTerm.slice(2)
      }
    } else {
      // Busca exata: normaliza adicionando -- se necessário
      exactVariable = searchTerm.startsWith("--") ? searchTerm : `--${searchTerm}`
    }

    const results: Array<{
      tema: string
      variavel: string
      valor: string
      chain: string[] | null
      isDuplicate: boolean
    }> = []

    if (isPartialSearch) {
      // Busca parcial otimizada usando o índice
      const matchedVars = new Map<string, Set<string>>()
      
      // Busca no índice
      temas.forEach((tema) => {
        const themeMatches = new Set<string>()
        Object.keys(tema.variaveis).forEach((varName) => {
          const cleanVarName = varName.toLowerCase().replace(/^--/, '')
          if (cleanVarName.includes(searchTerm)) {
            themeMatches.add(varName)
          }
        })
        
        if (themeMatches.size > 0) {
          matchedVars.set(tema.nome, themeMatches)
        }
      })

      // Se nenhuma variável foi encontrada, adiciona linha de "não encontrado" para cada tema
      if (matchedVars.size === 0) {
        temas.forEach((tema) => {
          results.push({
            tema: tema.nome,
            variavel: `*${searchTerm}`,
            valor: "—",
            chain: null,
            isDuplicate: false,
          })
        })
      } else {
        // Processa variáveis encontradas
        matchedVars.forEach((variables, themeName) => {
          const tema = themeMap.get(themeName)!
          
          variables.forEach((variable) => {
            const valor = tema.variaveis[variable]

            if (valor.includes(" | ")) {
              const valores = valor.split(" | ")
              valores.forEach((v, index) => {
                const chain = resolveVariable(v, themeName)
                results.push({
                  tema: `${themeName} (${index + 1})`,
                  variavel: variable,
                  valor: v,
                  chain,
                  isDuplicate: true,
                })
              })
            } else {
              const chain = resolveVariable(valor, themeName)
              results.push({
                tema: themeName,
                variavel: variable,
                valor,
                chain,
                isDuplicate: false,
              })
            }
          })
        })
        
        // Adiciona temas que não têm a variável
        temas.forEach((tema) => {
          if (!matchedVars.has(tema.nome)) {
            results.push({
              tema: tema.nome,
              variavel: `*${searchTerm}`,
              valor: "—",
              chain: null,
              isDuplicate: false,
            })
          }
        })
      }
    } else {
      // Busca exata - mais simples e rápida
      temas.forEach((tema) => {
        const valor = tema.variaveis[exactVariable]
        
        if (!valor) {
          results.push({
            tema: tema.nome,
            variavel: exactVariable,
            valor: "—",
            chain: null,
            isDuplicate: false,
          })
          return
        }

        if (valor.includes(" | ")) {
          const valores = valor.split(" | ")
          valores.forEach((v, index) => {
            const chain = resolveVariable(v, tema.nome)
            results.push({
              tema: `${tema.nome} (${index + 1})`,
              variavel: exactVariable,
              valor: v,
              chain,
              isDuplicate: true,
            })
          })
        } else {
          const chain = resolveVariable(valor, tema.nome)
          results.push({
            tema: tema.nome,
            variavel: exactVariable,
            valor,
            chain,
            isDuplicate: false,
          })
        }
      })
    }

    return { searchTerm: isPartialSearch ? searchTerm : exactVariable, results, isPartialSearch }
  }, [debouncedSearch, temas, themeMap, resolveVariable, variableIndex])

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
          <SettingsMenu />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              {t.searchVariable}
            </CardTitle>
            <CardDescription>
              {t.searchPlaceholder}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2">
              <Input
                placeholder={t.searchInputPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">
                💡 {t.searchHelp}
              </p>
            </div>

            {searchResults && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">{t.theme}</th>
                      <th className="text-left py-3 px-4 font-semibold">Variável</th>
                      <th className="text-left py-3 px-4 font-semibold">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.results.map((result, index) => {
                      // Destaca o termo pesquisado na variável apenas em busca parcial
                      const highlightedVariable = () => {
                        const varName = result.variavel
                        
                        // Se não for busca parcial, não destaca
                        if (!searchResults.isPartialSearch) {
                          return <code className="text-sm text-muted-foreground">{varName}</code>
                        }
                        
                        const searchTerm = searchResults.searchTerm.toLowerCase()
                        const lowerVarName = varName.toLowerCase()
                        const startIndex = lowerVarName.indexOf(searchTerm)
                        
                        if (startIndex === -1) {
                          return <code className="text-sm text-muted-foreground">{varName}</code>
                        }
                        
                        const before = varName.slice(0, startIndex)
                        const match = varName.slice(startIndex, startIndex + searchTerm.length)
                        const after = varName.slice(startIndex + searchTerm.length)
                        
                        return (
                          <code className="text-sm text-muted-foreground">
                            {before}
                            <span className="bg-yellow-300 dark:bg-yellow-600 text-foreground font-semibold">{match}</span>
                            {after}
                          </code>
                        )
                      }
                      
                      return (
                        <tr key={index} className={`border-t ${result.isDuplicate ? "bg-amber-50 dark:bg-amber-950/20" : ""}`}>
                          <td className="py-3 px-4 font-medium">{result.tema}</td>
                          <td className="py-3 px-4">
                            {highlightedVariable()}
                          </td>
                          <td className="py-3 px-4">
                            <VariableResolution valor={result.valor} chain={result.chain} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t.registeredThemes}</h2>
          <div className="flex gap-2">
            <Button onClick={() => setIsExportModalOpen(true)} variant="outline" disabled={temas.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              {t.exportToTailwind}
            </Button>
            <Button onClick={handleNewTheme}>
              <Plus className="w-4 h-4 mr-2" />
              {t.newTheme}
            </Button>
          </div>
        </div>

        {temas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">{t.noThemesYet}</p>
              <Button onClick={handleNewTheme}>
                <Plus className="w-4 h-4 mr-2" />
                {t.createFirstTheme}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {temas.map((tema) => (
              <Card key={tema.nome}>
                <CardHeader>
                  <CardTitle className="text-lg">{tema.nome}</CardTitle>
                  <CardDescription>{Object.keys(tema.variaveis).length} {t.variables}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {Object.entries(tema.variaveis)
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <code className="text-muted-foreground">{key}</code>
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-0.5 rounded text-xs">{value}</code>
                            {value.startsWith("#") && (
                              <div className="w-4 h-4 rounded border" style={{ backgroundColor: value }} />
                            )}
                          </div>
                        </div>
                      ))}
                    {Object.keys(tema.variaveis).length > 3 && (
                      <p className="text-xs text-muted-foreground">+{Object.keys(tema.variaveis).length - 3} {t.variables}...</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleEditTheme(tema)}
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      {t.edit}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleDeleteTheme(tema.nome)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      {t.delete}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ThemeModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTheme(null)
          }}
          onSave={handleSaveTheme}
          editingTheme={editingTheme}
          existingThemeNames={temas.map((t) => t.nome).filter((name) => name !== editingTheme?.nome)}
        />

        <ExportTailwindModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          themes={temas}
        />
      </div>
    </div>
  )
}
