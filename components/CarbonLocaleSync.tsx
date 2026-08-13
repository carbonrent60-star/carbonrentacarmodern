"use client";

import { useEffect } from "react";

export default function CarbonLocaleSync() {
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === "CARBON_LOCALE") {
        window.location.reload();
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return null;
}
