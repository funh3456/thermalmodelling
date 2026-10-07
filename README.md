# thermalmodelling

Static bilingual thermal modelling and building performance website, published with GitHub Pages at https://thermalmodelling.hu/.

- `index.html`: English page.
- `hu/index.html`: complete Hungarian page, also readable without JavaScript.
- `language.js`: automatic language selection and the HU / EN switch.

## Language selection

On the English entry page, a visitor's explicit `?lang=hu` or `?lang=en` selection, or previously saved manual preference, takes priority. Otherwise the browser requests only country-level information from `https://api.country.is/`: Hungarian IP addresses select `/hu/`; other countries retain English. Country is cached for the current browser session. The response IP is not stored, cookies and referrer data are not sent, and browser location permission is not requested.

If the lookup fails, returns invalid data, or takes more than 1.8 seconds, the browser's primary language is used (Hungarian selects HU, all other languages select EN). VPNs can affect the detected country. Manual selection remains available on both pages and is stored locally when browser storage is available. Direct `/hu/` links always display Hungarian; query parameters and section anchors survive language switching.

The two pages retain the same 52 official certification links, point labels, images and responsive design. Hungarian credit names are explanatory translations; the linked official requirements remain authoritative. Both language URLs have canonical and reciprocal `hreflang` metadata.
