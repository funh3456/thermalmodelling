/* Only country is used; no browser location permission is requested. */
(() => {
  'use strict';
  const preferenceKey = 'thermalmodelling.language';
  const countryKey = 'thermalmodelling.country';
  const current = document.documentElement.lang === 'hu' ? 'hu' : 'en';
  const valid = value => value === 'hu' || value === 'en';
  const read = (storage, key) => { try { return window[storage].getItem(key); } catch { return null; } };
  const write = (storage, key, value) => { try { window[storage].setItem(key, value); } catch { /* Storage can be disabled. */ } };
  let selected = false;
  const destination = (language, explicit = true) => {
    const url = new URL(language === 'hu' ? '/hu/' : '/', location.origin);
    url.search = location.search;
    if (explicit) url.searchParams.set('lang', language);
    else url.searchParams.delete('lang');
    url.hash = location.hash;
    return url;
  };
  const redirect = language => {
    if (language !== current) location.replace(destination(language, false));
  };
  document.querySelectorAll('[data-language]').forEach(link => {
    const language = link.dataset.language;
    const url = destination(language);
    link.href = url.href;
    link.addEventListener('click', () => {
      selected = true;
      write('localStorage', preferenceKey, language);
    });
  });
  const requested = new URLSearchParams(location.search).get('lang');
  if (valid(requested)) {
    write('localStorage', preferenceKey, requested);
    redirect(requested);
    return;
  }
  // A direct /hu/ URL always remains Hungarian, including without JavaScript.
  if (current === 'hu') return;
  const preference = read('localStorage', preferenceKey);
  if (valid(preference)) { redirect(preference); return; }
  const browserLanguage = () => {
    const first = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
    return /^hu(?:-|$)/i.test(first) ? 'hu' : 'en';
  };
  const choose = country => {
    if (selected) return;
    const saved = read('localStorage', preferenceKey);
    if (valid(saved)) { redirect(saved); return; }
    redirect(country ? (country === 'HU' ? 'hu' : 'en') : browserLanguage());
  };
  const cachedCountry = read('sessionStorage', countryKey);
  if (/^[A-Z]{2}$/.test(cachedCountry || '')) { choose(cachedCountry); return; }
  if (!window.fetch || !window.AbortController) { choose(null); return; }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1800);
  fetch('https://api.country.is/', {
    signal: controller.signal,
    credentials: 'omit',
    referrerPolicy: 'no-referrer'
  })
    .then(response => {
      if (!response.ok) throw new Error('Country lookup unavailable');
      return response.json();
    })
    .then(data => {
      const country = typeof data.country === 'string' ? data.country.toUpperCase() : '';
      if (!/^[A-Z]{2}$/.test(country)) throw new Error('Invalid country');
      write('sessionStorage', countryKey, country);
      choose(country);
    })
    .catch(() => choose(null))
    .finally(() => clearTimeout(timer));
})();
