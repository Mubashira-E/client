"use client";

import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState } from "react";

export function FullScreenToggle() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
    else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange, { signal: abortController.signal });

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleFullScreen}
        className="hidden rounded-full bg-primary-100 p-2 text-gray-800 transition-colors hover:bg-primary-200 md:block"
        aria-label={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
      >
        {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>
    </div>
  );
}
