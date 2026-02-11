"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { THEMES } from "@/lib/themes"

const RADIUS_OPTIONS = ["reto", "extra-discreto", "discreto", "moderno", "amigavel", "organico", "capsula"];
const SIDEBAR_OPTIONS = ["default", "dark", "light"];
const CONTAINER_STYLES = ["moderno", "glass", "deep", "flat", "glow", "geometrico"];
const TEXTURE_OPTIONS = ["none", "dots", "grid", "lines"];
const INTENSITY_OPTIONS = ["minima", "equilibrada", "impactante", "neon"];
const FONT_OPTIONS = ["moderno", "classico", "mono", "arredondado", "industrial", "futurista"];
const ANIMATION_OPTIONS = ["instantaneo", "sutil", "atmosferico", "cinematografico"];

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
  containerStyle: string;
  setContainerStyle: (s: string) => void;
  backgroundTexture: string;
  setBackgroundTexture: (t: string) => void;
  colorIntensity: string;
  setColorIntensity: (i: string) => void;
  animationStyle: string;
  setAnimationStyle: (a: string) => void;
  fontStyle: string;
  setFontStyle: (f: string) => void;
  statusColors: Record<string, string>;
  setStatusColors: (colors: Record<string, string>) => void;
} | undefined>(undefined);


function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = React.useState('padrão');
  const [radius, setRadiusState] = React.useState('moderno');
  const [sidebarStyle, setSidebarStyleState] = React.useState('default');
  const [containerStyle, setContainerStyleState] = React.useState('moderno');
  const [backgroundTexture, setBackgroundTextureState] = React.useState('none');
  const [colorIntensity, setColorIntensityState] = React.useState('equilibrada');
  const [animationStyle, setAnimationStyleState] = React.useState('sutil');
  const [fontStyle, setFontStyleState] = React.useState('moderno');
  const [statusColors, setStatusColorsState] = React.useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = React.useState(false);
  const { resolvedTheme } = useNextTheme();

  React.useEffect(() => {
    setIsMounted(true);
    const getSaved = (key: string, def: string) => {
        if (typeof window === 'undefined') return def;
        return localStorage.getItem(key) || def;
    };

    setColorThemeState(getSaved("lk-color-theme", "padrão"));
    setRadiusState(getSaved("lk-radius-theme", "moderno"));
    setSidebarStyleState(getSaved("lk-sidebar-theme", "default"));
    setContainerStyleState(getSaved("lk-container-style", "moderno"));
    setBackgroundTextureState(getSaved("lk-texture-theme", "none"));
    setColorIntensityState(getSaved("lk-intensity-theme", "equilibrada"));
    setAnimationStyleState(getSaved("lk-animation-theme", "sutil"));
    setFontStyleState(getSaved("lk-font-theme", "moderno"));
    
    const savedStatusColors = localStorage.getItem("lk-status-colors");
    if (savedStatusColors) {
        try { setStatusColorsState(JSON.parse(savedStatusColors)); } catch(e) {}
    }
  }, []);

  React.useLayoutEffect(() => {
    if (isMounted) {
      const root = document.documentElement;
      
      const activeTheme = THEMES.find(t => t.name === colorTheme) || THEMES[0];
      const primaryValue = resolvedTheme === 'dark' ? activeTheme.dark : activeTheme.light;
      root.style.setProperty('--primary', primaryValue);
      localStorage.setItem("lk-color-theme", colorTheme);

      const clearAndAdd = (list: string[], prefix: string, current: string) => {
          root.classList.remove(...list.map(item => `${prefix}-${item}`));
          root.classList.add(`${prefix}-${current}`);
          localStorage.setItem(`lk-${prefix}-theme`, current);
      };

      clearAndAdd(RADIUS_OPTIONS, "radius", radius);
      clearAndAdd(CONTAINER_STYLES, "style", containerStyle);
      clearAndAdd(TEXTURE_OPTIONS, "texture", backgroundTexture);
      clearAndAdd(INTENSITY_OPTIONS, "intensity", colorIntensity);
      clearAndAdd(ANIMATION_OPTIONS, "anim", animationStyle);
      
      root.classList.remove(...FONT_OPTIONS.map(f => `font-${f}`));
      root.classList.add(`font-${fontStyle}`);
      localStorage.setItem("lk-font-theme", fontStyle);

      localStorage.setItem("lk-status-colors", JSON.stringify(statusColors));
    }
  }, [colorTheme, radius, sidebarStyle, containerStyle, backgroundTexture, colorIntensity, animationStyle, fontStyle, statusColors, isMounted, resolvedTheme]);

  const value = React.useMemo(() => ({
    colorTheme,
    setColorTheme: (theme: string) => setColorThemeState(theme),
    radius,
    setRadius: (r: string) => setRadiusState(r),
    sidebarStyle,
    setSidebarStyle: (s: string) => setSidebarStyleState(s),
    containerStyle,
    setContainerStyle: (s: string) => setContainerStyleState(s),
    backgroundTexture,
    setBackgroundTexture: (t: string) => setBackgroundTextureState(t),
    colorIntensity,
    setColorIntensity: (i: string) => setColorIntensityState(i),
    animationStyle,
    setAnimationStyle: (a: string) => setAnimationStyleState(a),
    fontStyle,
    setFontStyle: (f: string) => setFontStyleState(f),
    statusColors,
    setStatusColors: (colors: Record<string, string>) => setStatusColorsState(colors)
  }), [colorTheme, radius, sidebarStyle, containerStyle, backgroundTexture, colorIntensity, animationStyle, fontStyle, statusColors]);

  return (
    <ColorThemeContext.Provider value={value}>
      {children}
    </ColorThemeContext.Provider>
  );
}


export function ThemeProvider({ children, ...props }: CustomThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ColorThemeProvider>
        {children}
      </ColorThemeProvider>
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
        containerStyle: colorThemeContext.containerStyle,
        setContainerStyle: colorThemeContext.setContainerStyle,
        backgroundTexture: colorThemeContext.backgroundTexture,
        setBackgroundTexture: colorThemeContext.setBackgroundTexture,
        colorIntensity: colorThemeContext.colorIntensity,
        setColorIntensity: colorThemeContext.setColorIntensity,
        animationStyle: colorThemeContext.animationStyle,
        setAnimationStyle: colorThemeContext.setAnimationStyle,
        fontStyle: colorThemeContext.fontStyle,
        setFontStyle: colorThemeContext.setFontStyle,
        statusColors: colorThemeContext.statusColors,
        setStatusColors: colorThemeContext.setStatusColors,
    };
}