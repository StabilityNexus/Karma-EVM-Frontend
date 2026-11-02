"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const [mounted, setMounted] = React.useState(false);
    const { setTheme, resolvedTheme } = useTheme();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button
                size="icon"
                className="mode-toggle-button mode-toggle-button-light"
                aria-label="Toggle theme"
            >
                <Sun className="mode-toggle-icon" />
            </Button>
        );
    }

    return (
        <Button
            size="icon"
            className={`mode-toggle-button ${resolvedTheme === "dark"
                    ? "mode-toggle-button-dark"
                    : "mode-toggle-button-light"
                }`}
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {resolvedTheme === "dark" ? (
                <Moon className="mode-toggle-icon" />
            ) : (
                <Sun className="mode-toggle-icon" />
            )}
        </Button>
    );
}
