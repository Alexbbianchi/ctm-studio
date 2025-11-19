"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Upload } from 'lucide-react'
import type { Theme } from "@/app/page"
import { useLocale } from "@/hooks/use-locale"

interface ThemeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (theme: Theme) => void
  editingTheme: Theme | null
  existingThemeNames: string[]
}

interface Variable {
  key: string
  value: string
  isDuplicate?: boolean
}

export function ThemeModal({ isOpen, onClose, onSave, editingTheme, existingThemeNames }: ThemeModalProps) {
  const [themeName, setThemeName] = useState("")
  const [variables, setVariables] = useState<Variable[]>([{ key: "", value: "" }])
  const [jsonInput, setJsonInput] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<string>("manual")
  const { t } = useLocale()

  useEffect(() => {
    if (editingTheme) {
      setThemeName(editingTheme.nome)
      const vars = Object.entries(editingTheme.variaveis).map(([key, value]) => ({ key, value }))
      setVariables(vars.length > 0 ? vars : [{ key: "", value: "" }])
      setActiveTab("manual")
    } else {
      setThemeName("")
      setVariables([{ key: "", value: "" }])
      setJsonInput("")
      setActiveTab("manual")
    }
    setError("")
  }, [editingTheme, isOpen])

  const addVariable = () => {
    setVariables([...variables, { key: "", value: "" }])
  }

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index))
  }

  const updateVariable = (index: number, field: "key" | "value", value: string) => {
    const updated = [...variables]
    updated[index][field] = value
    setVariables(updated)
  }

  const handleImportJson = () => {
    setError("")

    try {
      const parsed = JSON.parse(jsonInput)

      if (parsed.nome && parsed.variaveis) {
        setThemeName(parsed.nome)
        const vars = Object.entries(parsed.variaveis as Record<string, string>).map(([key, value]) => ({
          key,
          value,
        }))

        setVariables(vars.length > 0 ? vars : [{ key: "", value: "" }])
        setActiveTab("manual")
      } else {
        setError(t.invalidJson)
      }
    } catch (e) {
      try {
        const cssVariables = parseCssVariables(jsonInput)
        if (cssVariables.length > 0) {
          setVariables(cssVariables)
          setActiveTab("manual")
        } else {
          setError(t.noValidVariables)
        }
      } catch (cssError) {
        setError(t.invalidFormat)
      }
    }
  }

  const findDuplicates = (vars: Variable[]): string[] => {
    const keys = vars.map((v) => v.key.trim()).filter((k) => k !== "")
    const duplicates: string[] = []
    const seen = new Set<string>()

    keys.forEach((key) => {
      if (seen.has(key) && !duplicates.includes(key)) {
        duplicates.push(key)
      }
      seen.add(key)
    })

    return duplicates
  }

  const parseCssVariables = (cssText: string): Variable[] => {
    const variables: Variable[] = []
    const regex = /(--[\w-]+)\s*:\s*([^;]+);/g
    let match

    while ((match = regex.exec(cssText)) !== null) {
      const key = match[1].trim()
      const value = match[2].trim()
      variables.push({ key, value })
    }

    return variables
  }

  const handleSave = () => {
    setError("")

    if (!themeName.trim()) {
      setError(t.themeNameRequired)
      return
    }

    if (existingThemeNames.includes(themeName.trim())) {
      setError(t.themeExists)
      return
    }

    const validVariables = variables.filter((v) => v.key.trim() && v.value.trim())

    if (validVariables.length === 0) {
      setError(t.atLeastOneVariable)
      return
    }

    const variablesObj: Record<string, string[]> = {}
    validVariables.forEach((v) => {
      const key = v.key.trim()
      const value = v.value.trim()
      if (!variablesObj[key]) {
        variablesObj[key] = []
      }
      variablesObj[key].push(value)
    })

    const finalVariables: Record<string, string> = {}
    Object.entries(variablesObj).forEach(([key, values]) => {
      finalVariables[key] = values.length === 1 ? values[0] : values.join(" | ")
    })

    onSave({
      nome: themeName.trim(),
      variaveis: finalVariables,
    })

    setThemeName("")
    setVariables([{ key: "", value: "" }])
    setJsonInput("")
    setError("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingTheme ? t.editTheme : t.createTheme}</DialogTitle>
          <DialogDescription>
            {editingTheme ? t.editDescription : t.createDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="theme-name">{t.themeName}</Label>
            <Input
              id="theme-name"
              placeholder={t.themeNamePlaceholder}
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">{t.manual}</TabsTrigger>
              <TabsTrigger value="json">{t.importJsonCss}</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <Label>{t.cssVariables}</Label>
                <Button type="button" size="sm" variant="outline" onClick={addVariable}>
                  <Plus className="w-4 h-4 mr-1" />
                  {t.addVariable}
                </Button>
              </div>

              <div className="space-y-3">
                {variables.map((variable, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 items-start ${variable.isDuplicate ? "p-2 bg-red-50 dark:bg-red-950/20 border-2 border-red-500 rounded-md" : ""}`}
                  >
                    <div className="flex-1">
                      <Input
                        placeholder={t.namePlaceholder}
                        value={variable.key}
                        onChange={(e) => updateVariable(index, "key", e.target.value)}
                        className={variable.isDuplicate ? "border-red-500" : ""}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder={t.valuePlaceholder}
                        value={variable.value}
                        onChange={(e) => updateVariable(index, "value", e.target.value)}
                        className={variable.isDuplicate ? "border-red-500" : ""}
                      />
                    </div>
                    {variable.value.startsWith("#") && (
                      <div
                        className="w-10 h-10 rounded border flex-shrink-0"
                        style={{ backgroundColor: variable.value }}
                      />
                    )}
                    {variables.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariable(index)}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="json" className="space-y-2 mt-4">
              <Label htmlFor="json-input">{t.pasteJsonCss}</Label>
              <Textarea
                id="json-input"
                placeholder={t.jsonPlaceholder}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              <Button type="button" onClick={handleImportJson} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                {t.importVariables}
              </Button>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm font-medium border border-destructive/20">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button onClick={handleSave}>{editingTheme ? t.saveChanges : t.createTheme}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
