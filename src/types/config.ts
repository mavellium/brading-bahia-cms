export interface SiteConfig {
  id: string;
  siteName: string;
  description: string;
  planType: "basic" | "pro";
  logoUrl: string;
  devAuthor: string;
  theme: {
    mainColor: string;
    secondColor: string;
    boxShadowColor: string;
    asideColor: string;
    borderColor: string;
    backgroundColor: string;
    backgroundBody: string;
  };
  menuItems: MenuItem[];
}

export interface MenuItem {
  name: string;
  icon: string; // Nome do ícone
  href: string;
}

export interface GlobalConfigType {
  sites: SiteConfig[];
  defaultSiteId: string;
}