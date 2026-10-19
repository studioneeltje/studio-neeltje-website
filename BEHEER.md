# Je website beheren

## Waar doe je wat?

- **Pagina’s en blokken:** https://studioneeltje.github.io/studio-neeltje-website/beheer/
- **Reportages, Journal, foto’s, menu, footer en huisstijl:** https://studioneeltje.github.io/studio-neeltje-website/cms/
- **Website bekijken:** https://studioneeltje.github.io/studio-neeltje-website/

Puck bepaalt de opbouw en de eigen teksten van een pagina. Sveltia beheert de
reportages, artikelen en algemene instellingen. De blokken voor reportages en
Journal lezen die inhoud vanzelf uit Sveltia. De mediagegevens staan maar op één
plek; beide omgevingen gebruiken dezelfde bibliotheek.

## Inloggen bij het websitebeheer

Deze eerste versie gebruikt rechtstreeks GitHub, zonder betaald CMS-abonnement
of extra inlogserver. Je hebt een **fine-grained personal access token** nodig:

1. Open https://github.com/settings/personal-access-tokens/new.
2. Geef hem een herkenbare naam en een beperkte looptijd.
3. Kies bij **Repository access** alleen `studio-neeltje-website`.
4. Kies onder **Repository permissions**: **Contents: Read and write**,
   **Pull requests: Read and write**, **Actions: Read-only**.
5. Maak de sleutel aan en voer hem zelf in op het **inlogscherm** van Puck. Alleen het GitHub-account `studioneeltje` wordt toegelaten.
   In Sveltia kies je **Sign In Using Token** en voer je dezelfde sleutel in.

De editor toont vóór inloggen geen pagina-overzicht of bouwstenen. De beheerinhoud wordt pas geladen na controle van je GitHub-account en schrijfrechten. Met **Uitloggen** sluit je de editor direct af.

Dit is een toegangspoort in de browser. GitHub Pages kan de statische beheerbestanden en de openbare repository niet privé maken. Volledige afscherming van bestanden vereist later hosting met toegangscontrole. De website-inhoud is openbaar portfolio-materiaal; zet hier geen privé klantgegevens in.

Deel de sleutel niet in de chat of in de repository. Puck bewaart hem alleen in
het geheugen: na sluiten of vernieuwen verbind je opnieuw. Sveltia beheert zijn
eigen browsersessie; meld je daar af op een gedeelde computer.

## Een pagina aanpassen

1. Kies een pagina in Puck.
2. Klik een blok aan om teksten, knoppen en foto’s te wijzigen.
3. Voeg blokken toe of verander hun volgorde. Er zijn ook losse Foto-, Video-
   en Tekstblokken. Nieuwe landingspagina’s maak je op het startscherm.
4. **Voorvertoning** toont het huidige concept met de animaties en bediening;
   schakel tussen desktop en mobiel.
5. **Concept opslaan** bewaart de wijziging in GitHub, los van de openbare site.
6. Wacht op de automatische verwerking. Bij **Verwerkingscontrole** zie je
   de voortgang; daar is ook een downloadbare versie van het gebouwde concept.
7. Bekijk de laatste versie en klik **Publiceer gecontroleerd concept**.
   De openbare testsite wijzigt zodra de publicatiestap klaar is.

Een concept blijft ook lokaal op je apparaat bewaard. Via **Reservekopie** kun
je de pagina-instellingen downloaden. Nieuwe bronbestanden worden tijdelijk in
de browser bewaard totdat je een paginaconcept opslaat; deze reservekopie bevat
geen bronbestanden. Wis de browseropslag daarom niet voor je online hebt opgeslagen.
Via **GitHub-concept laden** haal je een reeds opgeslagen concept terug.

## Foto’s, focus en uitsneden

Upload via **Media** in Puck of via **Foto’s & video’s** in Sveltia. In Sveltia
maak je eerst een media-item met een unieke naam, titel, type en bronbestand.
Een bestand alleen in de algemene uploadlijst zetten maakt nog geen media-item.

- Een foto heeft één standaardfocuspunt. Klik in de bronfoto of gebruik de
  schuifjes; pijltjestoetsen werken ook.
- In ieder fotoblok kun je **Eigen uitsnede voor desktop** of **mobiel** kiezen.
- Pas focus en zoom aan en bekijk het brede, vierkante of staande voorbeeld.
- Geen eigen mobiele uitsnede? Dan volgt mobiel de desktopuitsnede.
- Geen eigen uitsnede? Dan geldt de standaardfocus van de foto.
- Het originele bestand wordt nooit overschreven. De website snijdt het vlak
  visueel bij; de grote fotoweergave gebruikt weer de volledige verhouding.
- Bij de reportage- en Journal-blokken kies je de omslagfoto in Sveltia en kun
  je in Puck een uitsnede voor alleen die pagina instellen.

## Automatische verwerking

Foto’s worden omgezet naar AVIF en WebP in meerdere breedtes, zonder vergroten.
De browser kiest een versie passend bij scherm en resolutie. Foto’s buiten het
eerste scherm worden later geladen. De eerste headerfoto krijgt voorrang.

Video’s krijgen gecomprimeerde MP4-versies voor mobiel en desktop en een
voorbeeldafbeelding. Vertelvideo’s hebben afspeelknoppen en geluid. Sfeerclips
spelen stil af, met een pauzeknop en respect voor minder-bewegenvoorkeuren.
Ondertiteling kun je als WebVTT-bestand toevoegen.

De beginlimiet is **45 MB en 15 minuten per bronbestand**. Gebruik webexports;
ruwe cameravideo’s zijn hiervoor te groot. De limiet en kwaliteitsinstellingen
staan in Sveltia onder **Algemene instellingen → Beeldkwaliteit & verwerking**.
GitHub is in deze eerste fase de bronopslag. Grote hoeveelheden foto’s en vooral
video vragen later waarschijnlijk externe mediaopslag. In deze opzet wordt er
geen betaald mediaplatform aangeschaft.

Mislukt de verwerking, dan wordt die versie niet gepubliceerd. De vorige
succesvolle website blijft staan. Een tekstwijziging verwerkt niet alle media
opnieuw: ongewijzigde varianten worden hergebruikt.

## Concepten in Sveltia

Sveltia gebruikt de redactionele workflow: concept, controleren, publiceren.
De openbare website blijft statisch; na publicatie bouwt GitHub Actions de
pagina’s en media opnieuw. Voorvertoningen zijn concepten, geen wijzigingen aan
de live pagina. Publiceer pas nadat de controle in GitHub geslaagd is.

## Nog los aansluiten

Contactformulieren, datumaanvragen en nieuwsbriefinschrijvingen versturen in
deze testversie nog geen gegevens. Daarvoor kiezen we later de diensten.
Pic-Time blijft volledig los. Het eigen domein en de overstap van Wix volgen
pas wanneer de nieuwe website klaar is.

### Tweede foto bij een reportagekaart

Open in Sveltia **Trouwreportages**, kies de reportage en vul **Tweede foto bij
Aanwijzen** in met een ander beeld uit diezelfde bruiloft. Zonder expliciete keuze
gebruikt de site de eerste andere foto uit de galerij. Is er maar één foto, dan
blijft de omslag zichtbaar met een subtiele zoom. Op een aanraakscherm blijft de
omslag staan en opent een tik meteen de reportage. Bij toetsenbordfocus kan de
tweede foto ook zichtbaar worden. De foto's blijven altijd normaal zichtbaar
wanneer JavaScript ontbreekt of minder beweging is ingesteld.

### Roze fotolabel bij ‘Wat er echt gebeurt’

Ga naar **Sveltia → Algemene instellingen → Huisstijl, menu & footer → Fotolabel
bij Over Neeltje**. Hier kun je de tekst wijzigen, het label verbergen en kiezen
voor **Op de foto, linksonder** of **Onder de foto**. Sla op en publiceer de wijziging;
de website wordt opnieuw opgebouwd. De instelling geldt voor dit blok op alle
pagina's. Vernieuw Puck na publicatie om de nieuwe instelling daar ook te zien.
De overige blokteksten en de foto zelf blijf je in Puck aanpassen.

### Socialblok in Instagramstijl

Bewerk in Puck het blok **Social**: kies de vier foto's, pas de bijschriften aan
bij Teksten en stel via Links in waar elke foto naartoe gaat. De algemene
Instagram-link staat in Sveltia bij Algemene instellingen. Het blok toont je
zelfgekozen foto's in Instagramstijl; het is geen automatisch opgehaalde feed.
De hart-, reactie-, deel- en bewaariconen zijn decoratief, zonder fictieve aantallen.

### Achtergrond en tekstkleur per blok

Open een pagina in **Puck**, selecteer een blok en kies bovenaan bij
**Achtergrond & tekstkleur** één kleurvlak: **Wit**, **Blauw**, **Roze** of
**Donkerrood**. De tekst wordt automatisch donkerrood op lichte vlakken en roze
op donkerrood. Accenten blijven rood-oranje. Kaarten en formuliervlakken houden
hun eigen leesbare kleurcombinatie. De foto in een header blijft zichtbaar.
Bekijk je concept, sla het op en publiceer het zoals andere paginawijzigingen.
Bestaande blokken behouden hun opmaak totdat je een kleur kiest.
