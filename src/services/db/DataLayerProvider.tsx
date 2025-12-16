import React, { createContext, useContext } from 'react';

import type { DataLayer } from './dataLayer';

const DataLayerContext = createContext<DataLayer | null>(null);

export function DataLayerProvider({
  dataLayer,
  children,
}: {
  dataLayer: DataLayer;
  children: React.ReactNode;
}) {
  return <DataLayerContext.Provider value={dataLayer}>{children}</DataLayerContext.Provider>;
}

export function useDataLayer() {
  const ctx = useContext(DataLayerContext);
  if (!ctx) {
    throw new Error('useDataLayer must be used within a DataLayerProvider');
  }

  return ctx;
}
