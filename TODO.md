# Takenlijst

Open taken die bij het volgende **bouw** worden afgewerkt. Zie `CLAUDE.md` voor de
werkwijze. Afgeronde punten gaan met datum naar `ARCHIEF.md`; ideeën naar `LATER.md`.

## Nu — bouwstraat en testomgeving

- [ ] **Snellere build op GitHub.** Foto's parallel verwerken, AVIF alleen voor de
      kleinere breedtes, bij een PR een snelle controle en alleen op `main` de volledige
      fotoverwerking. Doel: een gewone wijziging binnen enkele minuten online.
- [ ] **Automatisch uitrollen naar test.studioneeltje.com.** Na een geslaagde build op
      `main` de site uploaden naar mijn.host, met de inlog in GitHub Secrets. Basic Auth,
      `.htaccess` en de Sender-ontvanger behouden.
      *Nodig van Neeltje/helper:* SSH of alleen FTP in het Starter-pakket (DirectAdmin).
- [ ] **Beheer op de testsite.** `/beheer/` en `/cms/` ook op test.studioneeltje.com
      laten werken en controleren.
- [ ] **Daarna:** repository privé zetten (handmatig, door Neeltje) en GitHub Pages uitzetten.

## Huisstijl en code opruimen

- [ ] Eén tokenbestand voor kleuren en lettertypes; `theme.css` en `design.css` laten
      verwijzen naar die tokens in plaats van ruim 800 losse hexcodes.
- [ ] Oude kopieën in de hoofdmap (`nieuwe-site.html`, `pagina-reportage-*.html` en
      dergelijke) nalopen en weghalen waar de build ze niet meer nodig heeft.
- [ ] Ongebruikte CSS uit eerdere ontwerprondes opsporen en verwijderen.

## Inhoud — keuze van Neeltje nodig

- [ ] Titel Bordeaux-pagina: *Trouwfotograaf Bordeaux | Mark & Rooa* of
      *Trouwfotograaf Bordeaux voor jullie destination wedding* (en bijbehorende SEO-tekst).
- [ ] Twee ontbrekende foto's in de blog *Trouwfotograaf kiezen* staan in media-PR #81.
- [ ] Tweede hoverfoto's bij de juiste reportages kiezen (Michelle en Tristan horen er niet bij).
- [ ] Cover, hoverfoto en galerij voor Roelof Jan en Wendy (Havixhorst) kiezen.
- [ ] De 55 Havixhorst-foto's als mediaconcept opslaan en de fotokiezer in Sveltia controleren.

## GitHub opruimen

- [ ] PR #90 (samenvoeging lokaal werk + main) beoordelen en na akkoord samenvoegen.
- [ ] Verouderde open PR's en conceptbranches nalopen (ongeveer 30), waaronder het
      dubbele Bordeaux-concept #43 en de testconcepten #88 en #89.
- [ ] In de ChatGPT-browser nagaan of daar nog lokale Puck-concepten of
      foto-aanpassingen staan die niet op GitHub staan.

## Formulieren en nieuwsbrief

- [ ] Productie-ontvanger voor contact- en datumaanvragen op mijn.host: validatie,
      spambescherming, foutmeldingen, geen dubbele inzending. Kort formulier: namen en
      telefoonnummer.
- [ ] Checklistaanvraag end-to-end: klik vanuit de bezorgmail, inschrijving met
      toestemming, uitschrijven.
- [ ] Sender: account en domein controleren, de reeks van 13 mails klaarzetten en
      testen met testcontacten (budget max. €150 per jaar excl. btw).

## Voor de livegang (pas na toestemming van Neeltje)

- [ ] SEO-controle per pagina: titel, omschrijving, één H1, canonical, sitemap, alt-teksten.
- [ ] GA4 na toestemming testen met een echte aanvraag.
- [ ] Afspraken over hosting, back-up, terugdraaien, DNS en mailrecords.
