"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/Button";

function applyTheme(next: "light" | "dark") {
  document.documentElement.classList.toggle("dark", next === "dark");
  localStorage.setItem("theme", next);
}

export function ThemeToggle() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => applyTheme("light")}
      >
        <Sun className="size-4" />
        Light
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => applyTheme("dark")}
      >
        <Moon className="size-4" />
        Dark
      </Button>
    </div>
  );
}
