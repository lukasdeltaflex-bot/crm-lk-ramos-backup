"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

const themes = [
    { name: "padrão", label: "Padrão", light: "hsl(217 33% 25%)", dark: "hsl(217 33% 30%)" },
    { name: "zinc", label: "Cinza", light: "hsl(240 5.9% 10%)", dark: "hsl(240 5.9% 90%)" },
    { name: "midnight", label: "Meia-Noite", light: "hsl(222 47% 11%)", dark: "hsl(222 47% 11%)" },
    { name: "charcoal", label: "Carvão", light: "hsl(210 10% 20%)", dark: "hsl(210 10% 20%)" },
    { name: "slate", label: "Ardósia", light: "hsl(215 25% 27%)", dark: "hsl(215 25% 67%)" },
    { name: "blue", label: "Azul", light: "hsl(217.2 91.2% 59.8%)", dark: "hsl(217.2 91.2% 59.8%)" },
    { name: "sky-blue", label: "Azul Céu", light: "hsl(199 89% 48%)", dark: "hsl(199 89% 53%)" },
    { name: "indigo", label: "Índigo", light: "hsl(243 75% 59%)", dark: "hsl(243 75% 59%)" },
    { name: "purple", label: "Roxo", light: "hsl(282 78% 51%)", dark: "hsl(282 78% 56%)" },
    { name: "violet", label: "Violeta", light: "hsl(262.1 83.3% 57.8%)", dark: "hsl(262.1 83.3% 62.8%)" },
    { name: "lavender", label: "Lavanda", light: "hsl(250, 60%, 60%)", dark: "hsl(250, 60%, 65%)" },
    { name: "pink", label: "Pink", light: "hsl(336 82% 54%)", dark: "hsl(336 82% 59%)" },
    { name: "magenta", label: "Magenta", light: "hsl(322 84% 50%)", dark: "hsl(322 84% 55%)" },
    { name: "rose", label: "Rosa", light: "hsl(346.8 77.2% 49.8%)", dark: "hsl(346.8 77.2% 54.8%)" },
    { name: "wine", label: "Vinho", light: "hsl(345 60% 25%)", dark: "hsl(345 60% 25%)" },
    { name: "red", label: "Vermelho", light: "hsl(0 72.2% 50.6%)", dark: "hsl(0 72.2% 55.6%)" },
    { name: "burnt-orange", label: "Burnt", light: "hsl(16 84% 44%)", dark: "hsl(16 84% 49%)" },
    { name: "orange", label: "Laranja", light: "hsl(24.6 95% 53.1%)", dark: "hsl(24.6 95% 58.1%)" },
    { name: "amber", label: "Âmbar", light: "hsl(38 92% 50%)", dark: "hsl(38 92% 50%)" },
    { name: "yellow", label: "Amarelo", light: "hsl(45 93% 47%)", dark: "hsl(45 93% 52%)" },
    { name: "gold", label: "Ouro", light: "hsl(45 80% 40%)", dark: "hsl(45 80% 40%)" },
    { name: "coffee", label: "Café", light: "hsl(25 30% 20%)", dark: "hsl(25 30% 20%)" },
    { name: "bronze", label: "Bronze", light: "hsl(30 40% 40%)", dark: "hsl(30 40% 40%)" },
    { name: "peach", label: "Pêssego", light: "hsl(29, 100%, 65%)", dark: "hsl(29, 100%, 70%)" },
    { name: "green", label: "Verde", light: "hsl(142.1 76.2% 36.3%)", dark: "hsl(142.1 76.2% 41.3%)" },
    { name: "forest", label: "Floresta", light: "hsl(145 63% 22%)", dark: "hsl(145 63% 22%)" },
    { name: "emerald", label: "Esmeralda", light: "hsl(158 78% 41%)", dark: "hsl(158 78% 46%)" },
    { name: "mint", label: "Menta", light: "hsl(168, 86%, 44%)", dark: "hsl(168 86% 49%)" },
    { name: "teal", label: "Teal", light: "hsl(173 80% 40%)", dark: "hsl(173 80% 40%)" },
    { name: "cyan", label: "Ciano", light: "hsl(184 90% 41%)", dark: "hsl(184 90% 46%)" },
    { name: "gray", label: "Grafite", light: "hsl(220 9% 46%)", dark: "hsl(220 9% 51%)" },
];


export function ThemeColors() {
  const { setColorTheme, colorTheme, resolvedTheme } = useTheme()

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Paleta de Cores Premium</h4>
        <p className="text-[10px] text-muted-foreground font-medium">Escolha a cor primária da sua marca.</p>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
        {themes.map((theme) => {
          const isActive = colorTheme === theme.name
          const color = resolvedTheme === 'dark' ? theme.dark : theme.light
          return (
            <button
              key={theme.name}
              onClick={() => setColorTheme(theme.name)}
              className={cn(
                "group relative flex h-10 w-full items-center justify-center rounded-lg border-2 transition-all hover:scale-110 active:scale-95",
                isActive ? "border-primary shadow-md" : "border-transparent"
              )}
              style={{ backgroundColor: color }}
              title={theme.label}
            >
              {isActive && <Check className="h-5 w-5 text-white drop-shadow-md" />}
              <span className="sr-only">{theme.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}