import { register, init, getLocaleFromNavigator, locale as $locale, locale } from 'svelte-i18n';

import { setCookie, getCookie } from './modules/cookie.js';

const INIT_OPTIONS = {
  fallbackLocale: 'en-US',
  initialLocale: 'de-DE',
  loadingDelay: 200,
  formats: {},
  warnOnMissingMessages: true,
};

let currentLocale = null;

register('en-US', () => import('../messages/en-US.json'));
register('de-DE', () => import('../messages/de-DE.json'));

$locale.subscribe((value) => {
  if (value == null) return;

  currentLocale = value;

  // if running in the client, save the language preference in a cookie
  if (typeof window !== 'undefined') {
    setCookie('locale', value);
  }
});

// initialize the i18n library in client
export function startClient() {
  init({
    ...INIT_OPTIONS,
    initialLocale: getCookie('locale') || getLocaleFromNavigator(),
  });
}

// init only for routes (urls with no extensions such as .js, .css, etc) and for service worker
const DOCUMENT_REGEX = /(^([^.?#@]+)?([?#](.+)?)?|service-worker.*?\.html)$/;
// initialize the i18n library in the server and returns its middleware
export function i18nMiddleware() {
  // initialLocale will be set by the middleware
  init(INIT_OPTIONS);

  return (req, res, next) => {
    const isDocument = DOCUMENT_REGEX.test(req.originalUrl);
    // get the initial locale only for a document request
    if (!isDocument) {
      next();
      return;
    }

    console.log('i18nMiddleware', req)
    let locale = getCookie('locale', req.headers.cookie);

    // no cookie, let's get the first accepted language
    if (locale == null) {
      if (req.headers['accept-language']) {
        const headerLang = req.headers['accept-language'].split(',')[0].trim();
        if (headerLang.length > 1) {
          locale = headerLang;
        }
      } else {
        locale = INIT_OPTIONS.initialLocale || INIT_OPTIONS.fallbackLocale;
      }
    }

    if (locale != null && locale !== currentLocale) {
      $locale.set(locale);
    }

    next();
  };
}
