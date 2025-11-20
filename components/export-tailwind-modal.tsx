"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Upload, Save, Trash2 } from 'lucide-react'
import type { Theme } from "@/app/page"
import { useLocale } from "@/hooks/use-locale"

interface ExportTailwindModalProps {
  isOpen: boolean
  onClose: () => void
  themes: Theme[]
}

interface VariableMapping {
  [tailwindVar: string]: string // tailwind var -> css var
}

interface SavedMapping {
  name: string
  mapping: VariableMapping
}

export function ExportTailwindModal({ isOpen, onClose, themes }: ExportTailwindModalProps) {
  const [mappingJson, setMappingJson] = useState("")
  const [error, setError] = useState("")
  const [fileName, setFileName] = useState("tailwind-themes")
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [rootTheme, setRootTheme] = useState<string>("")
  const [savedMappings, setSavedMappings] = useState<SavedMapping[]>([])
  const [mappingName, setMappingName] = useState("")
  const { t } = useLocale()

  const defaultMapping = {
    "--color-primary": "--primary",
    "--color-secondary": "--secondary",
    "--color-success": "--success",
    "--color-danger": "--danger",
    "--color-warning": "--warning",
    "--color-info": "--info",
    "--background": "--bg",
    "--foreground": "--text",
  }

  // Carrega mapeamentos salvos e inicializa seleções
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem("tailwind-mappings")
      if (stored) {
        try {
          setSavedMappings(JSON.parse(stored))
        } catch (e) {
          console.error("Erro ao carregar mapeamentos:", e)
        }
      }

      // Seleciona todos os temas por padrão
      setSelectedThemes(themes.map(t => t.nome))
      
      // Define o primeiro tema como root
      if (themes.length > 0) {
        setRootTheme(themes[0].nome)
      }
      
      // Reseta nome do arquivo
      setFileName("tailwind-themes")
      setMappingName("")
      setError("")

      return
    } 

    setFileName("tailwind-themes")
    setSelectedThemes([])
    setRootTheme("")
    setMappingName("")
    setError("")
  }, [isOpen, themes])

  const handleLoadDefault = () => {
    setMappingJson(JSON.stringify(defaultMapping, null, 2))
    setError("")
  }

  const handleSaveMapping = () => {
    if (!mappingName.trim()) {
      setError(t.mappingNameRequired || "Digite um nome para o mapeamento")
      return
    }

    if (!mappingJson.trim()) {
      setError(t.mappingRequired || "Adicione o mapeamento de variáveis")
      return
    }

    try {
      const mapping = JSON.parse(mappingJson) as VariableMapping

      if (typeof mapping !== 'object' || Array.isArray(mapping)) {
        setError(t.invalidMappingFormat || "Formato de mapeamento inválido")
        return
      }

      const newMapping: SavedMapping = {
        name: mappingName.trim(),
        mapping
      }

      const updated = [...savedMappings.filter(m => m.name !== newMapping.name), newMapping]
      setSavedMappings(updated)
      localStorage.setItem("tailwind-mappings", JSON.stringify(updated))
      setMappingName("")
      setError("")
    } catch (e) {
      setError(t.invalidJson || "JSON inválido")
    }
  }

  const handleLoadMapping = (mapping: SavedMapping) => {
    setMappingJson(JSON.stringify(mapping.mapping, null, 2))
    setError("")
  }

  const handleDeleteMapping = (name: string) => {
    if (confirm(`${t.deleteConfirm} "${name}"?`)) {
      const updated = savedMappings.filter(m => m.name !== name)
      setSavedMappings(updated)
      localStorage.setItem("tailwind-mappings", JSON.stringify(updated))
    }
  }

  const toggleTheme = (themeName: string) => {
    setSelectedThemes(prev => {
      if (prev.includes(themeName)) {
        const newSelected = prev.filter(t => t !== themeName)
        // Se removeu o tema root, define o próximo disponível
        if (themeName === rootTheme && newSelected.length > 0) {
          setRootTheme(newSelected[0])
        }
        return newSelected
      } else {
        return [...prev, themeName]
      }
    })
  }

  const resolveVariable = (
    value: string,
    themeVars: Record<string, string>,
    visited = new Set<string>()
  ): string => {
    // Se não é uma variável, retorna o valor
    const varMatch = value.match(/var\((--.+?)\)/)
    if (!varMatch) return value

    const varName = varMatch[1]
    
    // Proteção contra referência circular
    if (visited.has(varName)) return value
    visited.add(varName)

    // Se não existe no tema, retorna o valor original
    const resolvedValue = themeVars[varName]
    if (!resolvedValue) return value

    // Resolve recursivamente
    return resolveVariable(resolvedValue, themeVars, visited)
  }

  const generateCssOutput = (mapping: VariableMapping): string => {
    let cssOutput = ""

    // Filtra apenas os temas selecionados
    const themesToExport = themes.filter(t => selectedThemes.includes(t.nome))
    const rootThemeData = themes.find(t => t.nome === rootTheme)

    // Gera CSS para cada tema selecionado
    themesToExport.forEach((theme) => {
      cssOutput += `/* ${theme.nome} */\n`
      cssOutput += `.theme-${theme.nome.toLowerCase().replace(/\s+/g, '-')} {\n`

      Object.entries(mapping).forEach(([tailwindVar, cssVar]) => {
        const originalValue = theme.variaveis[cssVar]
        
        if (originalValue) {
          const resolvedValue = resolveVariable(originalValue, theme.variaveis)
          cssOutput += `  ${tailwindVar}: ${resolvedValue};\n`
        } else {
          cssOutput += `  /* ${tailwindVar}: ${cssVar} não encontrada */\n`
        }
      })

      cssOutput += `}\n\n`
    })

    // Adiciona :root com o tema selecionado
    if (rootThemeData) {
      cssOutput += `:root {\n`

      Object.entries(mapping).forEach(([tailwindVar, cssVar]) => {
        const originalValue = rootThemeData.variaveis[cssVar]
        
        if (originalValue) {
          const resolvedValue = resolveVariable(originalValue, rootThemeData.variaveis)
          cssOutput += `  ${tailwindVar}: ${resolvedValue};\n`
        }
      })

      cssOutput += `}\n`
    }

    return cssOutput
  }

  const handleExport = () => {
    setError("")

    if (!mappingJson.trim()) {
      setError(t.mappingRequired || "Adicione o mapeamento de variáveis")
      return
    }

    if (selectedThemes.length === 0) {
      setError(t.selectAtLeastOneTheme || "Selecione pelo menos um tema para exportar")
      return
    }

    if (!fileName.trim()) {
      setError(t.fileNameRequired || "Digite um nome para o arquivo")
      return
    }

    try {
      const mapping = JSON.parse(mappingJson) as VariableMapping

      // Valida se é um objeto válido
      if (typeof mapping !== 'object' || Array.isArray(mapping)) {
        setError(t.invalidMappingFormat || "Formato de mapeamento inválido. Use um objeto JSON.")
        return
      }

      // Gera o CSS
      const cssContent = generateCssOutput(mapping)

      // Cria o blob e faz o download
      const blob = new Blob([cssContent], { type: 'text/css' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${fileName.trim()}.css`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Fecha o modal
      onClose()
    } catch (e) {
      setError(t.invalidJson || "JSON inválido")
    }
  }

  const handleClose = () => {
    // Limpa tudo ao fechar, exceto o JSON do mapeamento
    setFileName("tailwind-themes")
    setSelectedThemes([])
    setRootTheme("")
    setMappingName("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-5xl! sm:w-[90vw]! max-w-5xl! h-[95vh] max-h-[95vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader className="shrink-0 pb-4">
          <DialogTitle className="text-lg sm:text-xl">{t.exportToTailwind || "Exportar para Tailwind"}</DialogTitle>
          <DialogDescription className="text-sm">
            {t.exportToTailwindDescription || 
              "Configure o mapeamento de variáveis Tailwind para variáveis CSS dos seus temas"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 overflow-y-auto flex-1 pr-1">
          {/* Coluna Esquerda - Configurações */}
          <div className="space-y-3 sm:space-y-4 min-h-0">
            {/* Nome do Arquivo */}
            <div>
              <Label className="text-sm">{t.fileName || "Nome do Arquivo"}</Label>
              <Input
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="tailwind-themes"
                className="mt-1 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t.fileNameHelp || "Será salvo como .css"}
              </p>
            </div>

            {/* Seleção de Temas */}
            <div>
              <Label className="text-sm">{t.selectThemes || "Selecionar Temas para Exportar"}</Label>
              <div className="space-y-2 mt-2 border rounded-md p-2 sm:p-3 max-h-48 sm:max-h-64 overflow-y-auto">
                {themes.map((theme) => (
                  <div key={theme.nome} className="flex items-center space-x-2">
                    <Checkbox
                      id={`theme-${theme.nome}`}
                      checked={selectedThemes.includes(theme.nome)}
                      onCheckedChange={() => toggleTheme(theme.nome)}
                    />
                    <label
                      htmlFor={`theme-${theme.nome}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {theme.nome}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tema Root */}
            <div>
              <Label className="text-sm">{t.rootTheme || "Tema Padrão (:root)"}</Label>
              <Select value={rootTheme} onValueChange={setRootTheme}>
                <SelectTrigger className="mt-1 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {themes.filter(t => selectedThemes.includes(t.nome)).map((theme) => (
                    <SelectItem key={theme.nome} value={theme.nome}>
                      {theme.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {t.rootThemeHelp || "Tema usado como variáveis padrão no :root"}
              </p>
            </div>

            {/* Mapeamentos Salvos */}
            {savedMappings.length > 0 && (
              <div>
                <Label className="text-sm">{t.savedMappings || "Mapeamentos Salvos"}</Label>
                <div className="space-y-1 mt-2 border rounded-md p-2 max-h-32 sm:max-h-48 overflow-y-auto">
                  {savedMappings.map((saved) => (
                    <div key={saved.name} className="flex items-center justify-between gap-2 p-2 hover:bg-muted rounded">
                      <button
                        onClick={() => handleLoadMapping(saved)}
                        className="text-sm flex-1 text-left hover:underline"
                      >
                        {saved.name}
                      </button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMapping(saved.name)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Coluna Direita - Mapeamento */}
          <div className="space-y-3 sm:space-y-4 min-h-0 flex flex-col">
            <div className="flex-1 flex flex-col min-h-0">
              <Label className="text-sm">{t.variableMapping || "Mapeamento de Variáveis"}</Label>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                {t.mappingHelp || 
                  'Cole um JSON no formato: { "--color-primary": "--primary" }'}
              </p>
              
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLoadDefault}
                  className="text-xs sm:text-sm"
                >
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {t.loadDefaultMapping || "Padrão"}
                </Button>
              </div>

              <Textarea
                value={mappingJson}
                onChange={(e) => {
                  setMappingJson(e.target.value)
                  setError("")
                }}
                placeholder='{\n  "--color-primary": "--primary",\n  "--background": "--bg"\n}'
                rows={12}
                className="font-mono text-xs sm:text-sm flex-1 min-h-[200px]"
              />
            </div>

            {/* Salvar Mapeamento */}
            <div>
              <Label className="text-sm">{t.saveMappingAs || "Salvar Mapeamento Como"}</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={mappingName}
                  onChange={(e) => setMappingName(e.target.value)}
                  placeholder={t.mappingNamePlaceholder || "Ex: Meu Mapeamento"}
                  className="flex-1 text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveMapping}
                  size="sm"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4 shrink-0 border-t pt-3 sm:pt-4">
          {error && (
            <div className="text-xs sm:text-sm text-destructive bg-destructive/10 p-2 sm:p-3 rounded-md">{error}</div>
          )}

          <div className="bg-muted/50 p-2 sm:p-3 rounded-md">
            <p className="text-xs sm:text-sm font-semibold mb-1">{t.howItWorks || "Como funciona:"}</p>
            <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>{t.exportStep1 || "Defina o mapeamento: variável Tailwind → variável CSS do tema"}</li>
              <li>{t.exportStep2 || "O sistema busca o valor real de cada variável em cada tema"}</li>
              <li className="hidden sm:list-item">{t.exportStep3 || "Resolve referências (var(--x)) até chegar no valor final"}</li>
              <li className="hidden sm:list-item">{t.exportStep4 || "Gera um arquivo CSS no formato globals.css para download"}</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose} className="text-sm">
              {t.cancel}
            </Button>
            <Button type="button" onClick={handleExport} className="text-sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              {t.exportCss || "Exportar CSS"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
