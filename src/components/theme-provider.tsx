"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

const COLOR_THEMES = [
  "padrão", "zinc", "blue", "green", "violet", "orange", "red", "rose", "gray", 
  "yellow", "cyan", "purple", "magenta", "emerald", "burnt-orange", "sky-blue", "pink",
  "mint", "lavender", "peach", "slate", "midnight", "forest", "charcoal", "wine", 
  "coffee", "gold", "indigo", "amber", "teal", "bronze"
];

const RADIUS_OPTIONS = ["executivo", "moderno", "suave"];
const SIDEBAR_OPTIONS = ["default", "dark", "light"];

type CustomThemeProviderProps = ThemeProviderProps & {
  children: React.ReactNode;
};

const ColorThemeContext = React.createContext<{
  colorTheme: string;
  setColorTheme: (theme: string) => void;
  radius: string;
  setRadius: (r: string) => void;
  sidebarStyle: string;
  setSidebarStyle: (s: string) => void;
} | undefined>(undefined);


function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = React.useState('padrão');
  const [radius, setRadiusState] = React.useState('moderno');
  const [sidebarStyle, setSidebarStyleState] = React.useState('default');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const savedColor = localStorage.getItem("color-theme");
    if (savedColor && COLOR_THEMES.includes(savedColor)) {
        setColorThemeState(savedColor);
    }
    const savedRadius = localStorage.getItem("radius-theme");
    if (savedRadius && RADIUS_OPTIONS.includes(savedRadius)) {
        setRadiusState(savedRadius);
    }
    const savedSidebar = localStorage.getItem("sidebar-theme");
    if (savedSidebar && SIDEBAR_OPTIONS.includes(savedSidebar)) {
        setSidebarStyleState(savedSidebar);
    }
  }, []);

  React.useEffect(() => {
    if (isMounted) {
      // Manage Colors
      document.documentElement.classList.remove(...COLOR_THEMES.map(t => `theme-${t}`));
      document.documentElement.classList.add(`theme-${colorTheme}`);
      localStorage.setItem("color-theme", colorTheme);

      // Manage Radius
      document.documentElement.classList.remove(...RADIUS_OPTIONS.map(r => `radius-${r}`));
      document.documentElement.classList.add(`radius-${radius}`);
      localStorage.setItem("radius-theme", radius);

      // Manage Sidebar
      document.documentElement.classList.remove(...SIDEBAR_OPTIONS.map(s => `sidebar-${s}`));
      if (sidebarStyle !== 'default') {
        document.documentElement.classList.add(`sidebar-${sidebarStyle}`);
      }
      localStorage.setItem("sidebar-theme", sidebarStyle);
    }
  }, [colorTheme, radius, sidebarStyle, isMounted]);

  const value = {
    colorTheme,
    setColorTheme: (theme: string) => {
      if (COLOR_THEMES.includes(theme)) {
        setColorThemeState(theme);
      }
    },
    radius,
    setRadius: (r: string) => {
        if (RADIUS_OPTIONS.includes(r)) {
            setRadiusState(r);
        }
    },
    sidebarStyle,
    setSidebarStyle: (s: string) => {
        if (SIDEBAR_OPTIONS.includes(s)) {
            setSidebarStyleState(s);
        }
    }
  };

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
}


export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ColorThemeProvider>{children}</ColorThemeProvider>
    </NextThemesProvider>
  )
}

export function useTheme() {
    const nextThemeContext = useNextTheme();
    const colorThemeContext = React.useContext(ColorThemeContext);

    if (nextThemeContext === undefined || colorThemeContext === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return {
        ...nextThemeContext,
        colorTheme: colorThemeContext.colorTheme,
        setColorTheme: colorThemeContext.setColorTheme,
        radius: colorThemeContext.radius,
        setRadius: colorThemeContext.setRadius,
        sidebarStyle: colorThemeContext.sidebarStyle,
        setSidebarStyle: colorThemeContext.setSidebarStyle,
    };
}