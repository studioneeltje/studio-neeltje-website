# Studio Neeltje — nieuwe website

Living Canvas-testsite met een statische publieke website, Puck als visuele
paginabouwer en Sveltia voor inhoud en instellingen.

## Beheren

Zie [BEHEER.md](BEHEER.md) voor de Nederlandstalige handleiding en
[TODO.md](TODO.md) voor het resterende werk.

## Structuur

- `content/pages`: Puck-pagina’s en de eigen inhoud per blok.
- `content/stories`, `content/articles`: inhoud beheerd via Sveltia.
- `content/media`: gedeelde foto- en videogegevens, inclusief standaardfocus.
- `content/settings`: gedeelde huisstijl, menu, footer en beeldverwerking.
- `media/originals`: ongewijzigde bronnen; nooit handmatig overschrijven.
- `site/blocks.json`, `site/theme.css`: bestaande vormgeving en bloktemplates.
- `src/editor`: Puck, mediabeheer, uitsnede-editor en GitHub-concepten.
- `src/shared`: renderer voor website en Puck; één implementatie voor uitsneden.
- `scripts/process-media.mjs`: Sharp en FFmpeg, met herbruikbare afgeleiden.
- `scripts/build.mjs`: valideert inhoud en bouwt statische pagina’s + editors.
- `assets/blocks-runtime.js`: toegankelijke galerijen en animaties per blok.

De HTML-bestanden in de repository-root zijn de vorige statische versie ter
referentie. De publicatie gebruikt uitsluitend de gegenereerde map `dist`.
Nieuwe wijzigingen gebeuren in `content`, `site`, `src` en `assets`.

## Lokaal bouwen

Vereist Node 24 en pnpm 11.25.0. `pnpm install --frozen-lockfile`, vervolgens
`pnpm build`. Bekijk `dist` via een lokale webserver (`pnpm preview`).
`pnpm dev` is uitsluitend voor de editorcode; maak eerst de publieke databundel
met een volledige build. Open de website niet rechtstreeks als `file://`.

## Publicatie

GitHub Pages gebruikt **GitHub Actions** als bron. De workflow `website.yml`
bouwt en verwerkt media bij wijzigingen in `main`. Een mislukte build publiceert
niets. Concepten komen op branches met pull requests en krijgen een bouwcontrole
en een downloadbaar preview-artifact. De Puck-publicatieknop vereist een geslaagde
bouwcontrole van precies de opgeslagen versie.

Bronbestanden blijven bewaard. Afgeleide media worden buiten Git opgeslagen in
het publicatiepakket; `.cache/processed` wordt via Actions-cache hergebruikt.
Er staan geen sleutels in de code. Het publieke deel heeft geen CMS-login nodig.

GitHub Pages is de testomgeving. De uiteindelijke website komt op
**studioneeltje.com** bij een later te kiezen hostingprovider.

## Technische SEO en lancering

De standaard GitHub Pages-build is een **testomgeving**. De HTML-pagina's hebben
standaard `noindex,follow`. De sitemap en canonicals krijgen standaard het adres
`https://studioneeltje.github.io/studio-neeltje-website/`.

Maak voor definitieve hosting een productiebuild met het echte hoofdadres en
expliciet ingeschakelde indexering:

```bash
SITE_URL=https://www.studioneeltje.com/ SITE_INDEXABLE=1 pnpm build
```

Gebruik uitsluitend de definitief gekozen domeinvariant (met óf zonder www) en
laat de andere variant server-side naar die variant redirecten. De build maakt:

- Zelfverwijzende canonical-tags voor indexeerbare pagina's.
- `sitemap.xml` met alleen hoofd-URL's (geen bedankt- of doorverwijspagina's).
- `robots.txt` die in productie crawlen toestaat en de sitemap vermeldt.

**Let op:** GitHub Pages als projectsite kan geen eigen robots.txt aan de root van
het gehele GitHub Pages-hostdomein plaatsen; de HTML-`noindex` is daarom de
belangrijkste bescherming voor de testomgeving. Bij de definitieve hosting
moet `robots.txt` op het hostroot staan en moet de productiebuild zonder
`noindex` worden getest. Doorgestuurde HTML-bestanden zijn tijdelijke
client-side doorverwijzingen: vervang ze op de definitieve host door echte
HTTP 301-redirects. Test daarna de sitemap en canonical-URL's opnieuw.
