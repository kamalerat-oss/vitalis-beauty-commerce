'use client';

import { useEffect } from 'react';
import { initializeStore } from '@/lib/localStorage';

export default function StoreInitializer() {
  useEffect(() => {
    initializeStore();
  }, []);
  return null;
}
