import { useState, useEffect, useMemo } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Browser detection
  const browserInfo = useMemo(() => {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const isAndroid = /Android/.test(ua);
    const isChrome = /Chrome/.test(ua) && !/Edge|Edg|OPR/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    const isSamsung = /SamsungBrowser/.test(ua);
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    const isEdge = /Edge|Edg/.test(ua);
    const isOpera = /OPR/.test(ua);

    let browserName = "Browser";
    if (isChrome) browserName = "Chrome";
    else if (isFirefox) browserName = "Firefox";
    else if (isSamsung) browserName = "Samsung Internet";
    else if (isSafari) browserName = "Safari";
    else if (isEdge) browserName = "Edge";
    else if (isOpera) browserName = "Opera";

    return {
      isIOS,
      isAndroid,
      isChrome,
      isFirefox,
      isSamsung,
      isSafari,
      isEdge,
      isOpera,
      browserName,
    };
  }, []);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check for iOS standalone
    if ((navigator as any).standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error prompting install:", error);
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    promptInstall,
    ...browserInfo,
  };
}
