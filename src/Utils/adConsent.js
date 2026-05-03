import { useEffect, useState } from 'react';

export const AD_CONSENT_STORAGE_KEY = 'imagetopdfnow-ad-consent';
export const ADSENSE_CLIENT_ID = 'ca-pub-5792545548472697';
export const REQUIRE_CERTIFIED_CMP = process.env.REACT_APP_REQUIRE_GOOGLE_CMP === 'true';

const AD_CONSENT_CHANGE_EVENT = 'imagetopdfnow-ad-consent-change';
const ADSENSE_SCRIPT_ID = 'imagetopdfnow-adsense-script';
const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;

let adSenseScriptPromise = null;

export function hasCmpSignal() {
  if (typeof window === 'undefined') {
    return false;
  }

  const hasIabTcfApi = typeof window.__tcfapi === 'function';
  const hasFundingChoices = Boolean(window.googlefc);
  return hasIabTcfApi || hasFundingChoices;
}

export function canServeAdsWithCurrentSetup(adConsent) {
  if (adConsent !== 'accepted') {
    return false;
  }

  if (!REQUIRE_CERTIFIED_CMP) {
    return true;
  }

  return hasCmpSignal();
}

export function getAdConsent() {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(AD_CONSENT_STORAGE_KEY);
  return storedValue === 'accepted' || storedValue === 'rejected' ? storedValue : null;
}

export function setAdConsent(status) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AD_CONSENT_STORAGE_KEY, status);
  window.dispatchEvent(new CustomEvent(AD_CONSENT_CHANGE_EVENT, { detail: status }));
}

export function resetAdConsent() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AD_CONSENT_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(AD_CONSENT_CHANGE_EVENT, { detail: null }));
}

export function useAdConsent() {
  const [adConsent, setAdConsentState] = useState(() => getAdConsent());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncConsent = (event) => {
      if (event?.type === 'storage' && event.key && event.key !== AD_CONSENT_STORAGE_KEY) {
        return;
      }

      setAdConsentState(getAdConsent());
    };

    window.addEventListener(AD_CONSENT_CHANGE_EVENT, syncConsent);
    window.addEventListener('storage', syncConsent);

    return () => {
      window.removeEventListener(AD_CONSENT_CHANGE_EVENT, syncConsent);
      window.removeEventListener('storage', syncConsent);
    };
  }, []);

  return adConsent;
}

export function loadAdSenseScript() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  const existingScript = document.getElementById(ADSENSE_SCRIPT_ID);
  if (existingScript && window.adsbygoogle) {
    return Promise.resolve(true);
  }

  if (adSenseScriptPromise) {
    return adSenseScriptPromise;
  }

  adSenseScriptPromise = new Promise((resolve) => {
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.src = ADSENSE_SCRIPT_SRC;
    script.crossOrigin = 'anonymous';
    script.addEventListener('load', () => resolve(true), { once: true });
    script.addEventListener('error', () => resolve(false), { once: true });
    document.head.appendChild(script);
  });

  return adSenseScriptPromise;
}