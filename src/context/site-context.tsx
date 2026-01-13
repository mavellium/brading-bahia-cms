"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteConfig } from '@/types/config';
import { GlobalConfig } from '@/config/config';

interface SiteContextType {
  currentSite: SiteConfig;
  setCurrentSite: (site: SiteConfig) => void;
  sites: SiteConfig[];
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [currentSite, setCurrentSiteState] = useState<SiteConfig>(() => {
    const defaultSite = GlobalConfig.sites.find(site => site.id === GlobalConfig.defaultSiteId);
    return defaultSite || GlobalConfig.sites[0];
  });

  useEffect(() => {
    const savedSiteId = localStorage.getItem('currentSiteId');
    if (savedSiteId) {
      const site = GlobalConfig.sites.find(s => s.id === savedSiteId);
      if (site) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentSiteState(site);
      }
    }
  }, []);

  const setCurrentSite = (site: SiteConfig) => {
    setCurrentSiteState(site);
    localStorage.setItem('currentSiteId', site.id);
  };

  return (
    <SiteContext.Provider value={{ 
      currentSite, 
      setCurrentSite, 
      sites: GlobalConfig.sites 
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}