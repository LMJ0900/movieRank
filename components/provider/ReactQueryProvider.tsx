'use client';

import React from 'react';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

export default function ReactQueryProvider({ children }: Props) {
  const queryClient = new QueryClient({});

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
