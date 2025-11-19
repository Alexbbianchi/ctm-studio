"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { ThemeModal } from "@/components/theme-modal"
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

  const resolveVariable = (
    value: string,
    allThemes: Theme[],
    themeName: string,
    visited = new Set<string>(),
  ): string[] => {
    const chain: string[] = [value]

    const varMatch = value.match(/var\((--.+?)\)/)
    if (!varMatch) {
      return chain
    }

    const referencedVar = varMatch[1]

    if (visited.has(referencedVar)) {
      chain.push(`[Referência circular: ${referencedVar}]`)
      return chain
    }

    visited.add(referencedVar)

    const currentTheme = allThemes.find((t) => t.nome === themeName)
    if (!currentTheme) {
      chain.push(`[Tema não encontrado: ${themeName}]`)
      return chain
    }

    const referencedValue = currentTheme.variaveis[referencedVar]
    if (referencedValue) {
      if (referencedValue.includes(" | ")) {
        const valores = referencedValue.split(" | ")
        const allResolved: string[] = []
        valores.forEach((v, index) => {
          const resolvedChain = resolveVariable(v, allThemes, themeName, new Set(visited))
          allResolved.push(...resolvedChain)
          if (index < valores.length - 1) {
            allResolved.push("---SEPARATOR---")
          }
        })
        return [...chain, ...allResolved]
      } else {
        const resolvedChain = resolveVariable(referencedValue, allThemes, themeName, visited)
        return [...chain, ...resolvedChain]
      }
    } else {
      chain.push(`[Variável não encontrada: ${referencedVar}]`)
    }

    return chain
  }

  const searchResults = useMemo(() => {
    if (!debouncedSearch.trim()) return null

    // Normaliza a busca: adiciona -- se não tiver
    let variable = debouncedSearch.trim()
    if (!variable.startsWith("--")) {
      variable = `--${variable}`
    }

    const results: Array<{
      tema: string
      valor: string
      chain: string[] | null
      isDuplicate: boolean
    }> = []

    temas.forEach((tema) => {
      const valor = tema.variaveis[variable]

      if (!valor) {
        results.push({
          tema: tema.nome,
          valor: "—",
          chain: null,
          isDuplicate: false,
        })
        return
      }

      if (valor.includes(" | ")) {
        const valores = valor.split(" | ")
        valores.forEach((v, index) => {
          const chain = resolveVariable(v, temas, tema.nome)
          results.push({
            tema: `${tema.nome} (${index + 1})`,
            valor: v,
            chain,
            isDuplicate: true,
          })
        })
      } else {
        const chain = resolveVariable(valor, temas, tema.nome)
        results.push({
          tema: tema.nome,
          valor,
          chain,
          isDuplicate: false,
        })
      }
    })

    return { variable, results }
  }, [debouncedSearch, temas])

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
            <Input
              placeholder={t.searchInputPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />

            {searchResults && (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">{t.theme}</th>
                      <th className="text-left py-3 px-4 font-semibold">{t.value} {searchResults.variable}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.results.map((result, index) => (
                      <tr key={index} className={`border-t ${result.isDuplicate ? "bg-amber-50 dark:bg-amber-950/20" : ""}`}>
                        <td className="py-3 px-4 font-medium">{result.tema}</td>
                        <td className="py-3 px-4">
                          <VariableResolution valor={result.valor} chain={result.chain} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{t.registeredThemes}</h2>
          <Button onClick={handleNewTheme}>
            <Plus className="w-4 h-4 mr-2" />
            {t.newTheme}
          </Button>
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
      </div>
    </div>
  )
}
