# Bouwplan nieuwe website Studio Neeltje

GitHub Pages is de testomgeving. De uiteindelijke website komt op
studioneeltje.com bij een nog te kiezen hostingprovider.

## Eerste bouwstap

- [x] De stijlkeuzes verwijderen; alleen Living Canvas gebruiken.
- [x] Het menu van de homepage op alle subpagina's gebruiken.
- [x] Desktop- en mobiel menu controleren voordat de testsite wordt bijgewerkt.
- [x] Publicatie van deze gecontroleerde versie expliciet goedgekeurd op
      18 oktober 2026: 'bouw en publiceer de testsite'.

De hoofdbranch `main` wordt gebruikt voor de GitHub Pages-testomgeving.

## Beheeromgeving

- [x] Sveltia gekozen als CMS. Eigen beheer en lage kosten hebben prioriteit.
      Een overstap wordt pas overwogen als er later concrete beperkingen zijn.
- [x] Puck gebruiken voor de visuele opbouw met herbruikbare bouwstenen.
- [x] Sveltia aansluiten voor content, reportages en algemene instellingen.
- [x] Vastleggen welke velden in Puck bewerkt worden en welke in het CMS,
      zodat dezelfde tekst of instelling maar één bron heeft.
- [x] Bestaande homepageblokken omzetten in bewerkbare componenten met behoud
      van vormgeving en animaties.
- [x] Teksten, afbeeldingen, reportages, menu en algemene instellingen
      zelfstandig kunnen beheren; met concepten en een controle voor publicatie.

## Foto-uitsneden — bouw aangevraagd 18 oktober 2026

Gebouwd: gedeelde focusinstelling en afzonderlijke desktop- en mobiele uitsneden.

- [x] Een standaard focuspunt per foto kunnen kiezen, zodat belangrijke
      onderwerpen bij het bijsnijden in beeld blijven.
- [x] De uitsnede voor een specifieke toepassing of een specifiek blok kunnen
      aanpassen zonder andere toepassingen van dezelfde foto te wijzigen.
- [x] Een aparte mobiele uitsnede kunnen instellen waar nodig.
- [x] De daadwerkelijke weergave in het gekozen vlak visueel kunnen bekijken
      en aanpassen, waaronder brede, vierkante en staande vlakken.
- [x] Bronbestand intact laten; uitsneden en focuspunten als instellingen bewaren.
- [x] Instellingen vanuit de media-invoer en Puck kunnen gebruiken, met één bron
      per instelling en een bruikbare standaard als geen uitsnede is gekozen.

## Automatische optimalisatie van foto's en video's — toegevoegd 18 oktober 2026

- [x] Media één keer kunnen uploaden en vervolgens automatisch laten verwerken.
- [x] Foto's verkleinen en comprimeren met behoud van verhouding en aandacht
      voor fotografische kwaliteit; nooit automatisch vergroten of bijsnijden.
- [x] Meerdere afbeeldingsformaten in pixels genereren voor onder meer mobiel,
      desktop en grote weergave; de browser kiest de passende webversie op basis
      van weergavegrootte en schermdichtheid.
- [x] Moderne fotoformaten toepassen en afbeeldingen buiten het eerste scherm
      pas laden wanneer ze nodig zijn; essentiële headerbeelden direct laden.
- [x] Originele bronbestanden en afgeleide webversies onderscheiden, zodat
      latere verwerking mogelijk blijft zonder de bron te overschrijven.
- [x] Video's automatisch omzetten naar gecomprimeerde webversies voor mobiel
      en desktop, met een passende voorbeeldafbeelding en zuinig laadgedrag.
- [x] Videogebruik vastgesteld: sfeerclips en video's waarin Neeltje vertelt.
- [ ] Gebruikelijke aantallen en lengte van video’s verder afstemmen.
      De eerste verwerking staat op maximaal 45 MB en 15 minuten per bestand;
      bronnen in GitHub, verwerking in GitHub Actions, webversies in Pages.
- [x] Vertelvideo's met geluid via bewuste afspeelactie tonen, met toegankelijke
      bediening en ondersteuning voor ondertiteling. Sfeerclips kunnen waar
      passend stil afspelen; rekening houden met bewegingsvoorkeuren.
- [x] Foto- en video-optimalisatie laten werken vanuit dezelfde media-invoer,
      ongeacht of de bestanden via Sveltia of een Puck-component worden gekozen.
- [x] Verwerking en publicatie op elkaar afstemmen: geen verwijzingen naar
      varianten publiceren die nog niet klaar zijn; fouten zichtbaar melden.

De ingebouwde uploadcompressie van Sveltia staat uit. De gezamenlijke publicatiestap
maakt AVIF- en WebP-foto's (480–2560 px) en MP4-video's (640/1280 px), met behoud
van de bronbestanden en geluid. Ondertiteling via VTT. Verwerken gebeurt voordat
de website wordt gepubliceerd. Deze opzet vraagt geen extra betaald mediaplatform;
grote videovolumes vragen later een passende opslagdienst.

## Eerste ingebruikname

- [ ] Neeltje verbindt Puck en Sveltia met haar eigen beperkte GitHub-sleutel.
- [ ] Eerste echte wijziging opslaan, voorvertonen en publiceren met Neeltje.
- [ ] Gebruikelijke videobestanden van Neeltje beoordelen op kwaliteit en omvang.

## Functies en productieomgeving — later specificeren

- [ ] Beschikbaarheid: bepalen of het een aanvraag of echte agendaweergave wordt.
- [ ] Contactformulieren en nieuwsbrief koppelen aan te kiezen diensten.
- [ ] Chat: gewenste werking en dienst bepalen.
- [ ] Opslag en snelle weergave van grote hoeveelheden openbare portfoliofoto's.
- [ ] Hosting kiezen die past bij de volledige functieomvang; daar een
      testomgeving maken voor de definitieve controles.
- [ ] Domein, bestaande pagina-URL's, doorverwijzingen en vindbaarheid meenemen
      bij de overstap van Wix.

Pic-Time blijft volledig los van deze website en valt buiten dit bouwplan.

Nieuwe wensen komen eerst op deze lijst. Bouwen gebeurt pas na een expliciete
bouwwens van Neeltje. Deze eerste bouwstap is op 18 oktober 2026 aangevraagd.

## Verbindingsfout GitHub — 18 oktober 2026

- [x] De extra slash achter de repository-URL bij het koppelen verwijderen.
      De route met slash geeft bij de browsercontrole HTTP 404; zonder slash
      geeft GitHub HTTP 204 met de vereiste toegangsheaders. Hierdoor verschijnt
      nu “Failed to fetch” voordat de token wordt gecontroleerd.
- [x] Een begrijpelijke melding tonen bij een verbindingsprobleem.
- [x] De reparatie publiceren na het expliciete “bouw” van Neeltje.

## Inloggen vóór websitebeheer — bouw aangevraagd 18 oktober 2026

- [x] Eerst een inlogscherm tonen, ook bij een rechtstreekse paginalink.
- [x] Alleen het GitHub-account studioneeltje met schrijfrechten toelaten.
- [x] Pagina-inhoud en lokale uploads pas na inloggen laden.
- [x] Uitloggen sluit de editor en verwijdert de token uit het geheugen.
- [ ] Volledige afscherming van beheerbestanden bij de toekomstige hosting regelen.
      GitHub Pages ondersteunt geen servercontrole voor deze bestanden.

## Fotomuur en beeldweergave in Puck — bouw goedgekeurd 18 oktober 2026

- [x] Oorspronkelijke positioneringsklassen op de zes fotomuurfoto’s herstellen.
- [x] Foto’s binnen hun blok begrenzen zodat ze niet voorbij de footer doorlopen.
- [x] Absolute mediapaden gebruiken in Puck, uitsnedevelden en conceptvoorvertoning.
- [x] Ook responsive bronvarianten, grote weergave, posters en ondertiteling vanuit de juiste map laden.

## Visuele verfijning — bouw goedgekeurd 18 oktober 2026

- [x] Gedeelde inhoudsbreedte van maximaal 1200 px met gecentreerde uitlijning;
      achtergronden en de hero blijven beeldvullend.
- [x] Lopende tekst maximaal 650 px breed, Host Grotesk Regular 17 px.
- [x] Consistente zijruimte: minimaal 32 px op tablet/desktop en 24 px op mobiel.
- [x] Vast ritme voor secties (96/80/64 px), koppen en kaartafstanden (24 px).
- [x] Rustigere ondersteunende koppen en een duidelijke hiërarchie per blok.
- [x] Knoppen, secundaire links, labels en galerijbediening beter leesbaar maken.
- [x] Meer contrast voor primaire acties en ruimere aanraakvlakken en velden.
- [x] Formulieren, FAQ, checklist, prijskaarten en footer op dezelfde grid zetten.
- [x] Rustige witte basis voor tekst/FAQ en fotogalerij; merkkleuren behouden.
- [x] Toetsenbordfocus, snelkoppeling naar inhoud en verminderde beweging meenemen.
- [x] Dezelfde vormgeving laden in Puck en conceptvoorvertoningen.

## Links, hover en prijskaarten — bouw goedgekeurd

- [x] Extra onderste lijn bij ‘Lees het artikel’ verwijderen; alleen de tekst onderstrepen.
- [x] Meer ruimte tussen Instagram-intro en volgknop (32 px).
- [x] Alleen het woord Instagram onderstrepen, niet het losse pijltje.
- [x] Prijskaarten compacter en gelijk uitlijnen, met duidelijke keuzeacties en vrijblijvende kennismaking.
- [x] 9 uur aanmerken als ‘Meest gekozen’, ook op mobiel als eerste tonen.
- [x] Duidelijke hoverfeedback voor knoppen: kleur, lift en bewegend pijltje.
- [x] Menu-items een herkenbare hover en actuele-paginastijl geven.
- [x] Feedback bij toetsenbord en aanraken behouden, animatie bij verminderde beweging uitschakelen.

## Fotografie-effecten en openstaande opmaak — bouw goedgekeurd

- [x] De drie teksten boven de draaiende fotogalerij verwijderen.
- [x] De fotomuurkop naar het formaat van andere sectiekoppen brengen.
- [x] Nummer/categorielabels uit de blogafbeeldingen verwijderen.
- [x] Gratis trouwchecklist en Contact zichtbaar houden buiten het uitklapmenu.
- [x] Foto's rustig onthullen bij het binnenkomen in beeld, met behoud van hun afmetingen.
- [x] Reportagekaarten met zichtbare cover en tweede hoverfoto uit dezelfde reportage.
      Tweede foto instelbaar in Sveltia; anders eerste andere galerijfoto.
      Bij slechts één foto wordt geen ander bruidspaar als tweede beeld gebruikt.
- [x] Subtiele, eenmalige zoom in de header; de tekst blijft stil.
- [x] Foto's zichtbaar houden zonder JavaScript en met verminderde beweging.
- [x] Aangeleverd SVG-logo volledig en scherp gebruiken, zonder PNG-uitsnede.
- [x] Nieuwe versies van opmaak en scripts automatisch van een inhoudsgebonden versienummer voorzien.
- [ ] Tweede foto's bij de juiste reportages kiezen. Michelle en Tristan horen hier niet bij.

## Fotolabel ‘Wat er echt gebeurt’ — bouw goedgekeurd

- [x] Alleen de foto onthullen, zodat het roze label niet door het fotomasker wordt afgesneden.
- [x] Label veilig binnen de foto plaatsen, zonder negatieve verschuiving.
- [x] In Sveltia labeltekst, aan/uit en plaatsing op/onder de foto kunnen instellen.
- [x] Het label één beheerbron in Sveltia geven; geen dubbel bewerkbaar tekstveld in Puck.

## Compacte menuknoppen en Instagramstijl — bouw goedgekeurd

- [x] Checklist en Contact dezelfde hoogte (44 px), lettergrootte en compacte padding als Menu + geven.
- [x] Het socialblok als vier Instagramachtige posts opmaken, met profielregel, foto, pictogrammen en bijschrift.
- [x] Bestaande foto's, bijschriften en links bewerkbaar houden in Puck.
- [x] Op mobiel een horizontaal veegbare reeks posts gebruiken.
- [x] Geen verzonnen likes, reacties of live-feedkoppeling tonen; pictogrammen zijn decoratief.
- [x] Socialposts compacter maken: maximaal vier naast elkaar vanaf 901 px, twee op tablet en kleinere veegkaarten op mobiel.
