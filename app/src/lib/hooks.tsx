import { ReactNode, createContext, useContext } from 'react';
import { AppData } from './content';

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ data, children }: { data: AppData; children: ReactNode }) {
  return <AppDataContext.Provider value={data}>{children}</AppDataContext.Provider>;
}

function useAppData() {
  const data = useContext(AppDataContext);
  if (!data) {
    throw new Error('App data context is unavailable. Ensure AppDataProvider wraps the app root.');
  }
  return data;
}

export function useSiteContent() {
  return useAppData().siteContent;
}

export function useEntries() {
  return useAppData().entries;
}

export function useEntryHtml(slug: string) {
  return useAppData().entryHtmlBySlug[slug] ?? null;
}
