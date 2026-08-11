"use client";

import { useEffect } from "react";
import { useAdminStore } from "@/app/admin/_components/store";

export function AppInitializer() {
  const fetchInitialData = useAdminStore((state) => state.fetchInitialData);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return null;
}
