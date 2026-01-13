"use client";

import { useSite } from "@/context/site-context";
import { useEffect } from "react";

export default function ThemeProvider() {
  const { currentSite } = useSite();

  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--color-primary', currentSite.theme.mainColor);
    root.style.setProperty('--color-secondary', currentSite.theme.secondColor);
    root.style.setProperty('--color-shadow', currentSite.theme.boxShadowColor);
    root.style.setProperty('--color-aside', currentSite.theme.asideColor);
    root.style.setProperty('--color-border', currentSite.theme.borderColor);
    root.style.setProperty('--color-background', currentSite.theme.backgroundColor);
    root.style.setProperty('--color-background-body', currentSite.theme.backgroundBody);

    root.style.setProperty('--sidebar-width-collapsed', '5rem');
    root.style.setProperty('--sidebar-width-expanded', '20rem');
  }, [currentSite]);

  return null;
}