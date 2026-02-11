"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { THEMES } from "@/lib/themes"

interface ThemeColorsProps {
    activeThemeName: string;
    onSelect: (themeName: string) => void;
}

export function ThemeColors({ activeThemeName, onSelect }: ThemeColorsProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Paleta de Cores Premium</h4>
        <p className="text-[10px] text-muted-foreground font-medium">Escolha a cor primária da sua marca (Preview Isolado).</p>
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
        {THEMES.map((theme) => {
          const isActive = activeThemeName === theme.name
          const color = resolvedTheme === 'dark' ? theme.dark : theme.light
          return (
            <button
              key={theme.name}
              onClick={() => onSelect(theme.name)}
              className={cn(
                "group relative flex h-10 w-full items-center justify-center rounded-lg border-2 transition-all hover:scale-110 active:scale-95",
                isActive ? "border-primary shadow-md ring-2 ring-primary/20" : "border-transparent"
              )}
              style={{ backgroundColor: `hsl(${color})` }}
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
