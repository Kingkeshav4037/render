import i18n from '../i18n';

// Protect React virtual DOM against Node manipulation by Google Translate
function patchDOMForTranslation() {
  if (typeof window === 'undefined' || typeof Node === 'undefined' || !Node.prototype) return;
  const anyNode = Node.prototype as any;
  if (anyNode.__patchedForTranslation) return;
  anyNode.__patchedForTranslation = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child) as T;
      }
      return child;
    }
    return originalRemoveChild.apply(this, [child]) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (referenceNode.parentNode) {
        return referenceNode.parentNode.insertBefore(newNode, referenceNode) as T;
      }
      return this.appendChild(newNode) as T;
    }
    return originalInsertBefore.apply(this, [newNode, referenceNode]) as T;
  };
}

// Apply DOM patch immediately on module load
patchDOMForTranslation();

const COOKIE_NAME = 'googtrans';

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/;`;

  const host = window.location.hostname;
  if (host && host !== 'localhost' && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    document.cookie = `${name}=${value}${expires}; path=/; domain=.${host};`;
    const parts = host.split('.');
    if (parts.length > 2) {
      const parentDomain = parts.slice(-2).join('.');
      document.cookie = `${name}=${value}${expires}; path=/; domain=.${parentDomain};`;
    }
  }
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  const expires = '; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = `${name}=${expires}`;
  
  const host = window.location.hostname;
  if (host && host !== 'localhost' && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
    document.cookie = `${name}=${expires} domain=.${host};`;
    const parts = host.split('.');
    if (parts.length > 2) {
      const parentDomain = parts.slice(-2).join('.');
      document.cookie = `${name}=${expires} domain=.${parentDomain};`;
    }
  }
}

class LanguageService {
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;
    patchDOMForTranslation();

    const savedLang = this.getSavedLanguage();
    document.documentElement.lang = savedLang;

    if (savedLang !== 'en') {
      setCookie(COOKIE_NAME, `/en/${savedLang}`);
      // Give initial page load a moment to render then apply translation
      setTimeout(() => {
        this.triggerCombo(savedLang);
      }, 500);
    } else {
      clearCookie(COOKIE_NAME);
    }

    // Ensure Google Translate script is loaded if not already in document
    this.ensureGoogleTranslateScript();
  }

  public getSavedLanguage(): string {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('norway_preferred_lang');
      if (saved && ['en', 'no', 'de', 'es', 'fr', 'hi'].includes(saved.toLowerCase())) {
        return saved.toLowerCase();
      }
    }
    return 'en';
  }

  public setLanguage(langCode: string) {
    const code = langCode.toLowerCase();
    const prevLang = this.getSavedLanguage();

    if (typeof window !== 'undefined') {
      localStorage.setItem('norway_preferred_lang', code);
      document.documentElement.lang = code;
    }

    // 1. Update i18next
    i18n.changeLanguage(code);

    // 2. Dispatch custom event for reactive listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('norway_language_change', { detail: { language: code } }));
    }

    // 3. Handle English reset vs Foreign language
    if (code === 'en') {
      clearCookie(COOKIE_NAME);
      if (prevLang !== 'en') {
        // If switching from a translated language back to English, reset combo and reload for pure English DOM
        this.triggerCombo('');
        setTimeout(() => {
          window.location.reload();
        }, 100);
        return;
      }
    } else {
      setCookie(COOKIE_NAME, `/en/${code}`);
      this.triggerCombo(code);
    }
  }

  /**
   * Sync translation across page navigations in the SPA.
   */
  public syncPageTranslation(targetLang?: string) {
    const lang = targetLang || this.getSavedLanguage();
    if (lang === 'en') return;

    // Retry triggering the combo after newly mounted route components settle
    setTimeout(() => {
      this.triggerCombo(lang);
    }, 200);

    setTimeout(() => {
      this.triggerCombo(lang);
    }, 600);
  }

  private triggerCombo(langCode: string, attempts = 0) {
    if (typeof document === 'undefined') return;

    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      if (select.value !== langCode) {
        select.value = langCode;
      }
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    // If combo isn't in DOM yet, poll up to 30 times (3 seconds)
    if (attempts < 30) {
      setTimeout(() => {
        this.triggerCombo(langCode, attempts + 1);
      }, 100);
    }
  }

  private ensureGoogleTranslateScript() {
    if (typeof document === 'undefined') return;

    // Ensure mount div exists
    if (!document.getElementById('google_translate_element')) {
      const div = document.createElement('div');
      div.id = 'google_translate_element';
      div.setAttribute('aria-hidden', 'true');
      document.body.appendChild(div);
    }

    // Ensure global init callback exists
    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google?.translate?.TranslateElement) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,no,de,es,fr,hi',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      };
    }

    // Check if script already appended
    const existing = document.querySelector('script[src*="translate.google.com"]');
    if (!existing) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }
}

export const languageService = new LanguageService();
