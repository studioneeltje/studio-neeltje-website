# Studio Neeltje — nieuwe website

Living Canvas-testsite met een statische publieke website, Puck als visuele
paginabouwer en Sveltia voor inhoud en instellingen.

## Beheren

Zie [BEHEER.md](BEHEER.md) voor de Nederlandstalige handleiding.

Werkafspraken en lijsten:
- [CLAUDE.md](CLAUDE.md) — werkregels (verzamelen → bouw → publiceer).
- [TODO.md](TODO.md) — open taken voor het volgende *bouw*.
- [LATER.md](LATER.md) — ideeën voor later.
- [HUISSTIJL.md](HUISSTIJL.md) — kleur, typografie, beeld en toon.
- [ARCHIEF.md](ARCHIEF.md) — afgeronde bouwstappen.

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
referentie. De huidige GitHub Pages-bouw gebruikt `dist`. Voor een verhuistest
en de definitieve publicatie worden aparte openbare pakketten gemaakt.
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
standaard `noindex,follow` en de sitemap is leeg. De canonicals gebruiken
standaard het GitHub Pages-adres van deze testomgeving.

Maak voor definitieve hosting een productiebuild met het echte hoofdadres en
expliciet ingeschakelde indexering:

```bash
SITE_URL=https://www.studioneeltje.com/ SITE_INDEXABLE=1 pnpm build
```

Deze productiebuild schrijft naar `dist-production`. Een verhuistest met
dezelfde pagina-adressen en doorverwijzingen kan in `dist-staging` worden gebouwd:

```bash
SITE_URL=http://127.0.0.1:4195/ SITE_STAGING=1 pnpm build
```

Serveer beide pakketten via een webserver die adressen zonder `.html` en de
regels in `_redirects` ondersteunt. Gebruik `404.html` met HTTP-status 404 als
een adres niet bestaat. De verhuistest heeft een lege sitemap, `noindex` en
uitgeschakelde formulieren en Analytics. Beveilig een eventueel online testadres
ook met toegangscontrole.

Voor mijn.host bevatten beide openbare pakketten ook een gegenereerde
`.htaccess` met dezelfde permanente doorverwijzingen en de regels voor URL’s
zonder `.html`. Neem dit verborgen bestand mee bij het uploaden. Stel de
wachtwoordbeveiliging voor het testadres in via DirectAdmin en behoud de regels
die DirectAdmin daarvoor toevoegt. Controleer de toegang via HTTPS voordat het
testadres wordt gedeeld.

De twee openbare pakketten bevatten alleen media waar de gebouwde site naar
verwijst. De volledige beeldbank, concepten en Puck- en Sveltia-beheerbestanden
worden alleen in de beheerbouw `dist` opgenomen.

Gebruik uitsluitend de definitief gekozen domeinvariant (met óf zonder www) en
laat de andere variant server-side naar die variant redirecten. De build maakt:

- Zelfverwijzende canonical-tags voor indexeerbare pagina's.
- `sitemap.xml` met alleen hoofd-URL's (geen bedankt- of doorverwijspagina's).
- `robots.txt` die in productie crawlen toestaat en de sitemap vermeldt.

**Let op:** GitHub Pages als projectsite kan geen eigen robots.txt aan de root van
het gehele GitHub Pages-hostdomein plaatsen; de HTML-`noindex` is daarom de
belangrijkste bescherming voor de testomgeving. Bij de definitieve hosting
moet `robots.txt` op het hostroot staan en moet de productiebuild zonder
`noindex` worden getest. De productiebuild behoudt bestaande Wix-adressen, waaronder `/over-studio-neeltje`, `/gratis-trouwchecklist`, `/investering` en de artikelen onder `/blogs/`. Serveer de bijbehorende HTML-bestanden op hun adres zonder `.html`. Pas de permanente doorverwijzingen uit `_redirects` toe op de definitieve hosting. Controleer daar de HTTP-statuscodes, HTTPS, sitemap en voorkeursadressen.

Voeg `SITE_ANALYTICS=1` toe aan de productiebuild zodra de meting bij de livegang is ingeregeld. De Google-tag laadt alleen op het ingestelde hoofddomein en na toestemming. In Google Analytics telt `generate_lead` uitsluitend voor bevestigde contact- en datumaanvragen. `contact_click` en `checklist_request_success` worden apart gemeten. Controleer een echte aanvraag in de inbox én in Analytics voordat je `generate_lead` als belangrijke gebeurtenis markeert.

### Formulieren en Sender

De lokale Sender-proef bevestigde de ontvangst van één contactmail en één
checklistmail in `info@studioneeltje.com`. De download op de bedankpagina levert
dezelfde PDF als het productiepakket. De link in de proefmail is alleen lokaal.
De productiebezorgmail verwijst naar `/downloads/trouwchecklist.pdf` op het
ingestelde HTTPS-adres.

`src/server/sender.mjs` bevat de gedeelde servercode voor de twee mails. Sluit
die op de gekozen hosting aan op een HTTPS-formulierontvanger. Bewaar een nieuwe
Sender-sleutel uitsluitend in de geheime instellingen van die server. Leg
checklisttoestemming vast en koppel de gekozen nieuwsbriefreeks afzonderlijk.
Controleer op de hosting de bezorging, de publieke download en de meting van
een geslaagde contactaanvraag. De lokale proef schrijft geen abonnees in.
