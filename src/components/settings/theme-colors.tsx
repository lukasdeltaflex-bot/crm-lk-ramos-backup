"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

const themes = [
    { name: "padrão", label: "Padrão", light: "hsl(217 33% 25%)", dark: "hsl(217 33% 30%)" },
    { name: "zinc", label: "Cinza", light: "hsl(240 5.9% 10%)", dark: "hsl(240 5.9% 90%)" },
    { name: "slate", label: "Ardósia", light: "hsl(215 25% 27%)", dark: "hsl(215 25% 67%)" },
    { name: "blue", label: "Azul", light: "hsl(217.2 91.2% 59.8%)", dark: "hsl(217.2 91.2% 59.8%)" },
    { name: "sky-blue", label: "Azul Céu", light: "hsl(199 89% 48%)", dark: "hsl(199 89% 53%)" },
    { name: "green", label: "Verde", light: "hsl(142.1 76.2% 36.3%)", dark: "hsl(142.1 76.2% 41.3%)" },
    { name: "emerald", label: "Esmeralda", light: "hsl(158 78% 41%)", dark: "hsl(158 78% 46%)" },
    { name: "mint", label: "Menta", light: "hsl(168, 86%, 44%)", dark: "hsl(168 86% 49%)" },
    { name: "cyan", label: "Ciano", light: "hsl(184 90% 41%)", dark: "hsl(184 90% 46%)" },
    { name: "yellow", label: "Amarelo", light: "hsl(45 93% 47%)", dark: "hsl(45 93% 52%)" },
    { name: "orange", label: "Laranja", light: "hsl(24.6 95% 53.1%)", dark: "hsl(24.6 95% 58.1%)" },
    { name: "burnt-orange", label: "Laranja Queimado", light: "hsl(16 84% 44%)", dark: "hsl(16 84% 49%)" },
    { name: "peach", label: "Pêssego", light: "hsl(29, 100%, 65%)", dark: "hsl(29, 100%, 70%)" },
    { name: "red", label: "Vermelho", light: "hsl(0 72.2% 50.6%)", dark: "hsl(0 72.2% 55.6%)" },
    { name: "rose", label: "Rosa", light: "hsl(346.8 77.2% 49.8%)", dark: "hsl(346.8 77.2% 54.8%)" },
    { name: "pink", label: "Pink", light: "hsl(336 82% 54%)", dark: "hsl(336 82% 59%)" },
    { name: "magenta", label: "Magenta", light: "hsl(322 84% 50%)", dark: "hsl(322 84% 55%)" },
    { name: "purple", label: "Roxo", light: "hsl(282 78% 51%)", dark: "hsl(282 78% 56%)" },
    { name: "violet", label: "Violeta", light: "hsl(262.1 83.3% 57.8%)", dark: "hsl(262.1 83.3% 62.8%)" },
    { name: "lavender", label: "Lavanda", light: "hsl(250, 60%, 60%)", dark: "hsl(250, 60%, 65%)" },
    { name: "gray", label: "Grafite", light: "hsl(220 9% 46%)", dark: "hsl(220 9% 51%)" },
];


export function ThemeColors() {
  const { setColorTheme, colorTheme, resolvedTheme } = useTheme()

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Cor do Tema</h4>
      <div className="flex flex-wrap items-center gap-2">
        {themes.map((theme) => {
          const isActive = colorTheme === theme.name
          const color = resolvedTheme === 'dark' ? theme.dark : theme.light
          return (
            <button
              key={theme.name}
              onClick={() => setColorTheme(theme.name)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 text-white",
                isActive ? "border-primary" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
              aria-label={`Mudar tema para ${theme.label}`}
            >
              {isActive && <Check className="h-5 w-5" />}
              <span className="sr-only">{theme.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
