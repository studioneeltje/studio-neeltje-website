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

## Achtergrondkeuze per bouwsteen — bouw goedgekeurd

- [x] Eén klik in Puck voor wit, blauw, roze of donkerrood.
- [x] Donkerrode tekst op lichte achtergronden en roze tekst op donkerrood.
- [x] De bestaande rood-oranje accentkleur behouden.
- [x] Knoppen en zelfstandige kaarten/formulieren met passende contrasten tonen.
- [x] Kleurkeuze opslaan op het blok, met dezelfde weergave in builder en publicatie.

## Collageheader — gebouwd na expliciet ‘bouw’ (19 oktober 2026)

- [x] De drie foto's rechts in de reportage/collageheader continu subtiel laten zweven.
- [x] Elke foto beweegt 4–8 pixels omhoog en omlaag, met maximaal 1 graad extra kanteling bovenop de vaste collagehoek.
- [x] Verschillende vloeiende cycli van 8–14 seconden gebruiken, zonder zichtbare pauze of sprong.
- [x] De foto's volledig zichtbaar houden; bestaande uitsneden en klikbediening behouden.
- [x] Bij de toegankelijkheidsinstelling ‘minder beweging’ blijven de foto's stil.

Uitvoering goedgekeurd met ‘bouw’ op 19 oktober 2026; geïmplementeerd met behoud van de collagehoeken en ondersteuning voor minder beweging.

## Puck-concept laden — reparatie gebouwd 19 oktober 2026

- [x] Bij ‘GitHub-concept laden’ het bewerkvlak werkelijk verversen met het geladen concept. De voorvertoning toont het nieuwe concept, terwijl Puck intern de vorige versie vasthoudt.
- [x] Hetzelfde vernieuwingsprobleem bij ‘Gepubliceerde versie laden’ oplossen.
- [x] Voorkomen dat een oud bewerkvlak een nieuw geladen concept weer overschrijft.
- [x] Geladen concept en bijbehorende mediagegevens veilig bewaren; geen concept publiceren of vervangen tijdens de diagnose.

Waargenomen op /beheer/?pagina=over: melding ‘Online concept geladen’, donkerrode header in de voorvertoning; bewerkvlak toont de oude versie. Code gebruikt dezelfde Puck-key per pagina en een tijdelijke wissel via queueMicrotask, waardoor een nieuwe initialisatie niet betrouwbaar plaatsvindt.
Uitvoering goedgekeurd met ‘bouw’. De editor krijgt bij een bronwissel een nieuwe instantie; callbacks van de oude instantie worden genegeerd.

## Aanvullingen en visuele afwerking — aangevraagd 19 oktober 2026

Neeltje wil onderstaande onderdelen in de eigen huisstijl en met een uitgesproken, verzorgde visuele uitwerking. Uitvoering op 19 oktober 2026 expliciet goedgekeurd met ‘bouw’.

- [x] Persoonlijk auteursblok onder blogartikelen: optionele foto van Neeltje, korte bewerkbare introductie, sierlijke naam en optionele knop naar Over Neeltje. Rustige teksthiërarchie met Host Grotesk Regular 17 px, donkerrood en lichte merkvlakken; vierkante fotohoeken.
- [x] Compacte stappenbalk: Kennismaken → jullie dag → de foto's ontvangen. Redactionele nummering, verfijnde verbindingslijn en rustige overgangen bij aanwijzen; op mobiel logisch onder elkaar. Bewerkbare teksten en optionele link naar de uitgebreide werkwijze. Herbruikbaar in Puck, dezelfde weergave in voorvertoning en publicatie.
- [x] Verzorgde bedankpagina's of passende bevestigingsweergaven na contact-, nieuwsbrief- en checklistaanvragen. Duidelijke bevestiging, bewerkbare vervolgstap en alleen een reactietermijn als die daadwerkelijk is afgesproken. Grafische typografie en subtiele merkdetails; geen decoratieve bollen. Geen succes tonen zolang de aanvraag niet werkelijk is verwerkt.
- [x] De eerder vastgestelde Puck-conceptfout herstellen voordat verder op het geladen concept wordt gewerkt.
- [ ] Formulieren echt aansluiten op verwerking en bezorging — op 19 oktober 2026 door Neeltje uitgesteld: ‘Verzending later aansluiten’. Info@studioneeltje.com is opgegeven als ontvangstadres. Foutmeldingen, verzendstatus en bescherming tegen dubbel verzenden zijn voorbereid; alle verzendschakelaars blijven uit. Huidige formulieren zijn demo's. Voor uitvoering vaststellen welke ontvangstadressen, nieuwsbriefdienst en checklistlevering bedoeld zijn; geen accounts, abonnementen of externe diensten zonder passende toestemming aanmaken. GitHub Pages heeft hiervoor een externe verwerkingsdienst of apart backend nodig.
- [x] Alles toegankelijk uitwerken: duidelijke knoppen, toetsenbordfocus, leesbare contrasten, geen informatie afhankelijk van animatie, bewegingsvoorkeur respecteren.

De gekozen subtiele zweefanimatie van de drie collagefoto's is meegenomen in deze bouwstap.

## Gratis trouwchecklist — bouw aangevraagd 19 oktober 2026

- [x] Verkoopblok ‘Wat je in de trouwchecklist vindt’ uitvoeren als **Papier & overzicht**.
      Op 19 oktober 2026 gekozen door Neeltje: tastbare checklistpreview met rechte hoeken,
      drie overzichtelijke voordelen en een duidelijke knop naar het aparte formulier.
      Referentie: trouwchecklist-drie-ontwerpen.html, variant ‘Papier & overzicht’.
      Bouw goedgekeurd op 19 oktober 2026: ‘over gaat op bouwen’.
- [x] Het blok ‘Voor wie is deze trouwchecklist?’ opnieuw vormgeven in dezelfde huisstijl.
      Alle vijf herkenningspunten behouden. Neeltje kiest zowel **Persoonlijk & herkenbaar**
      als **Rustig & redactioneel**. Beide bouwen als kiesbare varianten van één component,
      met één inhoudsbron en behoud van de vijf punten bij wisselen van vormgeving.
      Geen groene emoji-vinkjes; donkerrood, roze, blauw en rood-oranje gebruiken.
      Bouw goedgekeurd op 19 oktober 2026. Persoonlijk & herkenbaar standaard op de landingspagina.
- [x] Vaste ontwerpregel toepassen: visueel uitgewerkte opsommingen hebben **3, 5 of 7**
      onderdelen, altijd oneven en nooit meer dan 7. Gewone tekst blijft helder en rustig.

De drie opmaken zijn gebouwd. Puck kiest plaatsing, stijl en achtergrond; Sveltia beheert één gedeelde inhoudsbron. Oudere checklistconcepten worden eenmalig aangevuld met behoud van alle bestaande blokken. De verzendkoppeling blijft uitgesteld.

## Veilig conceptbeheer en checklistherstel — bouw en publicatie goedgekeurd

- [x] De checklistbewerking uit de reservekopie van 19 oktober 21:57 terugzetten als online concept, met behoud van de nieuwe verkoopblokken.
- [x] Opslaan zonder verplicht een ouder concept over het huidige werk te laden; bij gelijktijdige wijzigingen beide versies eerst vergelijken.
- [x] Automatische herstelpunten, versiegeschiedenis en het terugzetten van een JSON-reservekopie toevoegen. Vóór iedere bronwissel de huidige bewerking veilig bewaren.

Neeltje heeft op 19 oktober 2026 expliciet toestemming gegeven: ‘Bouw en publiceer de reparatie’. Het herstelde paginaconcept blijft een concept; alleen de reparatie van het beheer wordt op de testsite gepubliceerd.

## Portfolio als verhaal per project — gebouwd 21 oktober 2026

### SEO en inhoud — richting bevestigd door Neeltje

De individuele portfolio’s zijn volwaardige SEO-landingspagina’s met substantieel eigen verhaal én uitgebreide fotografie. Neeltje geeft haar bestaande Bordeaux-pagina als inhoudelijke inspiratie: https://www.studioneeltje.com/destination-wedding-fotograaf-bordeaux-frankrijk. Pagina gelezen: duidelijke bestemmingstitel, introductie over Mark & Rooa, kennismaking/pre-wedding, meerdaags trouwweekend, locatie Domaine de Perrotin, afwisselende tekst/foto’s/galerijen, echte review, contact, leveranciers en gerelateerde bruiloft.

Het nieuwe portfolio moet verplaatsbare en herhaalbare teksthoofdstukken met echte koppen en alinea’s combineren met losse foto’s en galerijen van bijvoorbeeld 20 beelden. Geen vaste beperking tot intro plus fotogalerij en geen verplichte hoeveelheid teksthoofdstukken. Bestaande aangeleverde tekst als uitgangspunt behouden; geen gefingeerde locaties, ervaringen of reviews toevoegen.

SEO-inhoud per project: eigen paginatitel en metabeschrijving, bewerkbare korte URL, één duidelijke H1, logische H2/H3-hoofdstukken, beschrijvende alt-teksten, relevante interne links en tekst die als HTML leesbaar blijft. Geen zoekwoorden proppen of positiegaranties. Bij latere verhuizing naar studioneeltje.com rekening houden met bestaande URL’s en gerichte doorverwijzingen. Wix en het huidige domein blijven tijdens deze voorbereiding ongemoeid.

Bouw en publicatie expliciet goedgekeurd op 21 oktober 2026 met de opdracht de rest van de todo te bouwen en direct te publiceren.

Aanvulling bij het bekijken van Mark & Rooa in Bordeaux: Neeltje wil tussen verhaalhoofdstukken ook volledige galerijen kunnen plaatsen, bijvoorbeeld circa 20 foto's per galerij, om te laten zien wat zij oplevert. De bestaande galerij aan het eind ondersteunt meervoudige selectie, maar de huidige vaste reportage-template heeft nog geen verplaatsbare galerijen tussen tekstonderdelen. Dit hoort bij deze nog ongebouwde portfolio-uitbreiding.

- [x] Een herhaalbaar galerijonderdeel tussen verhaalhoofdstukken, met selectie van veel foto's tegelijk uit dezelfde mediabibliotheek, eigen volgorde en uitsneden, mobiel passende weergave en de bestaande transparante vergroting met pijltjes en sluiten door klikken. Geen beperking tot één foto, drie foto's of zeven foto's; de regel voor visuele tekstopsommingen beperkt deze fotogalerijen niet.

Referentie van Neeltje: https://www.studioneeltje.com/trouwfotograaf-kasteel-keukenhof-lisse. De bestaande Keukenhof-pagina wisselt het verhaal, informatie over de locatie, losse foto's en galerijen af. Op de nieuwe site moet iedere reportage een eigen verhaal kunnen worden, in de nieuwe huisstijl.

- [x] Een projectheader met titel, namen van het bruidspaar, locatie en gekozen headerbeeld(en).
- [x] Losse, verschuifbare verhaalhoofdstukken met eigen tussenkoppen en teksten, bijvoorbeeld voorbereidingen, ceremonie en avondfeest. Geen verplichte vaste hoeveelheid hoofdstukken.
- [x] Afwisselende beeldonderdelen: tekst naast foto, losse brede foto, twee foto's en een galerij. Foto's en uitsneden per onderdeel kiezen; bestaande optimalisatie en vergroting behouden.
- [x] Een optionele review van het bruidspaar met eigen quote, naam en optionele foto. Alleen tonen als een echte review is ingevuld; geen leeg vlak, verzonnen review of beoordeling tonen.
- [x] Optionele projectinformatie over locatie, bijzonderheden en leveranciers met links, zodat elk project eigen inhoud krijgt.
- [x] SEO per project uitbreiden met eigen zoekmachinetitel, metabeschrijving en duidelijke URL; semantische koppen en de bestaande alt-teksten behouden. Geen resultaatgaranties of verplicht zoekwoordenveld suggereren.
- [x] Passende afsluiting met optionele contactknop en gerelateerde reportages; koppeling aan het Portfolio-overzicht vanuit dezelfde projectbron.

Voorgestelde beheeropzet: projectinhoud, review en SEO hebben één vaste plek in Sveltia. De projectpagina's ook visueel toegankelijk maken in Puck voor plaatsing en volgorde van de onderdelen, zonder teksten op twee plekken te kopiëren. Gebouwd met herhaalbare Verhaalonderdelen in Sveltia en de Puck-bouwsteen Portfolio — verhaal per project. Dezelfde bron voedt de reportagepagina, Puck en de voorvertoning in Sveltia. Puck toont gepubliceerde reportages als eigen bewerkbare projectpagina; de inhoud blijft in Sveltia. Geen bestaande verhaalteksten of online concepten vervangen.

## Losse review met uitklapbare tekst — gebouwd na expliciet ‘bouw’

Neeltje vraagt de oorspronkelijke zelfstandige review terug: ‘De mooiste dag van je dromen … daar wil je Neeltje bij hebben!’ met ‘Lees de volledige review +’. De bron staat nog in site/source-home.html als .truus-review met details.review-more. Deze is bij de omzetting van Review naar ‘Losse reviewkaarten uit Sveltia’ uit de beschikbare bouwstenen verdwenen.

- [x] Deze grote losse review terugbrengen als eigen Puck-bouwsteen ‘Losse review met lees meer’, naast de bestaande reviewkaarten.
- [x] Een zichtbare korte quote en een optionele uitklapbare volledige review, met naam en optionele foto van het bruidspaar. Zonder lange tekst geen uitklapknop; alleen echte ingevulde inhoud tonen.
- [x] Het onderdeel op gewone Puck-pagina's kunnen plaatsen, met één inhoudsbron en de bestaande huisstijl- en achtergrondkeuzes. De gedeelde renderer is herbruikbaar voor de toekomstige projectopbouw; die portfolio-uitbreiding blijft apart op de todo. De huidige reviewkaarten en persoonlijke quote blijven beschikbaar.

Gebouwd en op 20 oktober 2026 gepubliceerd na expliciet ‘Publiceer beide op de testsite’, via PR #12, main 999849d812cc3183e57ce4f8b66898a22dd5db81.

## Aanvulling tijdens deze bouwstap — fotomuur

- [x] Een foto/lijst op de fotomuur aanklikbaar maken en groot openen met een doorzichtige achtergrond.
- [x] Een klik op de foto of op een willekeurige plek eromheen sluit de grote weergave. Kruisje, Escape en pijltjestoetsen blijven beschikbaar.
- [x] De kaders en uitsneden van de fotomuur behouden, inclusief bediening met het toetsenbord.

Toegevoegd door Neeltje tijdens de actieve bouwstap voor de losse review. Daarna expliciet goedgekeurd en samen met de review gepubliceerd op de testsite op 20 oktober 2026.

## Mediabeheer voor veel fotografie — gebouwd 20 oktober 2026

Aangevraagd door Neeltje op 20 oktober 2026. Ook foto's die op pagina's worden gebruikt mogen uit de mediabibliotheek worden verwijderd. Daarnaast wil zij veel foto's tegelijk uploaden en foto's visueel kunnen kiezen bij het vullen van blokken en galerijen.

- [x] **Foto's verwijderen, ook wanneer ze in gebruik zijn.** Gebruik op een pagina mag verwijderen niet blokkeren. De foto verdwijnt uit de actieve bibliotheek; op iedere gebruikte plek verschijnt een duidelijk vormgegeven vlak ‘Foto ontbreekt — kies een nieuwe foto’, met behoud van de afmetingen en opmaak. Dit werkt in Puck, voorvertoning en gepubliceerde pagina's, ook voor omslagen, galerijen, de fotomuur en foto's uit instellingen. Geen kapotte afbeeldingen, ongewenste automatische vervangfoto of blokkerende bouwfout bij bewust verwijderde media. Verwijderen herstelbaar maken via een prullenbak en zichtbaar maken waar een vervangende foto nodig is. In deze taak worden nog geen foto's daadwerkelijk verwijderd.
- [x] **Bulk uploaden.** Meerdere bestanden tegelijk kiezen of in één keer slepen, met een wachtrij, voortgang per foto en voor de hele reeks, duidelijke geslaagde/mislukte uploads en opnieuw proberen van alleen mislukte bestanden. Grote reeksen beheerst verwerken zonder voor iedere foto een bewerkvenster te openen; tussentijdse opslag en de bestaande automatische optimalisatie en bronbehoud blijven behouden. De mediaveranderingen zelfstandig kunnen opslaan als er nog geen pagina geopend is.
- [x] **Visuele fotokiezer.** Een overzicht met miniaturen bij het kiezen van een afbeelding in Puck, met grotere voorvertoning, zoeken/filteren en duidelijke geselecteerde foto. Een titel blijft aanvullende informatie; kiezen gebeurt door op het beeld te klikken. Ook toepassen bij foto- en galerijkeuzes in Sveltia voor reportages en blogs, met selectie van meerdere foto's waar een galerij wordt gevuld. De bestaande standaardfocus en aparte desktop-/mobiele uitsneden blijven beschikbaar. Met toetsenbord en schermlezer bedienbaar houden.

De oude editor verwerkte één bestand per upload en gebruikte titelkeuzelijsten. Verwijderde of ontbrekende foto's hebben nu een vast fotovlak; verwerking slaat prullenbakbestanden over. Originelen blijven bewaard voor herstel. Na expliciet ‘bouw’ op 20 oktober 2026 gebouwd: herstelbare verwijdering, een lokale uploadwachtrij met afzonderlijk opnieuw proberen, hervatbare online opslag, zelfstandig mediaconcept en visuele selectie in Puck en Sveltia. De bestaande media-inhoud en paginaconcepten zijn niet gewijzigd. Op 20 oktober 2026 expliciet goedgekeurd met ‘Publiceer op de testsite’. Gepubliceerd via PR #13, main ee79ad6cf8726556cf619507f4a965ef95a9ddb0; GitHub Actions-run 39390478843 is geslaagd.

## Reviewkaarten — kleuren en aanhalingsteken gebouwd 20 oktober 2026

Aangevraagd door Neeltje op 20 oktober 2026 voor de twee losse kaarten bij ‘Wat zij ervan vinden’. Met ‘hetzelfde quote’ bedoelt zij expliciet hetzelfde aanhalingsteken als in de enkele review met uitklapgedeelte, niet dezelfde reviewtekst.

- [x] De kleurvlakken van de reviewkaarten automatisch afstemmen op de gekozen sectieachtergrond: wit, blauw, roze of donkerrood. Beide kaarten blijven duidelijk zichtbaar ten opzichte van hun omgeving; quote, naam, bijschrift, accenten en bediening krijgen passende leesbare kleuren in de huisstijl.
- [x] Het sierlijke aanhalingsteken optisch gelijk maken aan dat van ‘Losse review met lees meer’: dezelfde vorm, lettertypebehandeling, kleur en passende verhoudingen binnen de kleinere kaart. De bestaande reviewteksten behouden.
- [x] De twee losse kaarten, optionele foto's, hoverbeweging en bestaande navigatie behouden. De kleurkeuze en quote-tekens moeten hetzelfde worden weergegeven in Puck, voorvertoning en op de website.

Gebouwd na expliciet ‘bouw’ op 20 oktober 2026. De twee reviewteksten zijn behouden. Beide reviewbouwstenen delen één stijlregel voor de aanhalingstekens; kaartvlakken volgen de vier sectiekleuren. De lokale bouw is geslaagd. Op 20 oktober 2026 gepubliceerd na expliciete toestemming, via PR #13, main ee79ad6cf8726556cf619507f4a965ef95a9ddb0. De gepubliceerde kaarten zijn visueel vastgelegd.

## Kantelkaart — gebouwd na expliciet ‘bouw’ op 20 oktober 2026

Neeltje wil een klein, uitgesproken onderdeel voor een kort tekstje met één knop. Het aangeleverde voorbeeld met prijzen en twee losse knoppen vindt zij te saai. Op 20 oktober 2026 drie losse visuele voorstellen gemaakt, buiten de website: **De uitschuiver**, **Het entreeticket** en **De kantelkaart**.

- [x] Een herbruikbare Puck-bouwsteen maken met bewerkbare korte tekst en optionele knoptekst/link. Alleen een knop tonen als zowel tekst als link zijn ingevuld.
- [x] De bestaande vier achtergrondkeuzes, passende tekstkleuren, Host Grotesk, Playfair Display Italic en merkkleuren gebruiken. Leesbare bediening, vierkante kaartvlakken en mobiele opmaak behouden.
- [x] De gekozen beweging bij aanwijzen en toetsenbordfocus uitwerken, met respect voor minder beweging. Neeltje kiest De kantelkaart en geeft expliciet ‘bouw’.

De tekst ‘Bewaar dit gevoel’ is een vrij bewerkbaar, optioneel veld in Puck. De kaart staat onder Plannen en contact. De lokale productiebouw is geslaagd. De bouwsteen is niet automatisch op bestaande pagina’s geplaatst. Neeltje geeft op 20 oktober 2026 expliciet ‘publiceer’. Gepubliceerd via PR #15, main 04c269ad84d6af7b753221926eec42b2ef52613c; GitHub Actions-run 39398843750 is geslaagd.

## Kantelkaartvlak en gedeelde mediabibliotheek — gebouwd 21 oktober 2026

- [x] Een onafhankelijke achtergrondkeuze voor het volledige vlak rond de kantelkaart: wit, donkerrood, roze of blauw. De bestaande kaartkleur blijft apart bewerkbaar en bestaande keuzes blijven behouden.
- [x] De gedeelde Puck- en Sveltia-bibliotheek behouden; dubbele uploads zijn niet nodig. Bekende online media blijven kiesbaar na een mislukte verversing.
- [x] Bronbestanden, fotoverwijzingen en uitsneden behouden. Verversen wijzigt de open inhoud en selecties niet.

## Kleine fotogalerij — De uitwaaier, verfijnd — gebouwd 21 oktober 2026

Neeltje kiest op 20 oktober 2026 uitsluitend **De uitwaaier — verfijnd**. De plakcollage en de strakke varianten vervallen als bouwvoorstel. Referentie: fotoprints-verfijnd.html in de visualisatiemap van deze chat.

- [x] Een herbruikbare galerijbouwsteen met drie zelf te kiezen foto's, zonder zichtbare teksten, met rechte hoeken en subtiel gedraaide fotoprints.
- [x] De verfijnde individuele animatie behouden: alleen de aangewezen foto komt iets omhoog en draait recht, met zachte schaduw. Geen gezamenlijk uitwaaieren van de drie foto's bij aanwijzen. Ook bruikbaar met toetsenbord en aanraking, met respect voor minder beweging.
- [x] De vier achtergrondkleuren, een passende mobiele opmaak en selectie uit de gedeelde fotobibliotheek ondersteunen. Bestaande focuspunten en uitsneden behouden; vergroting via de bestaande transparante fotoweergave laten aansluiten.

Neeltje heeft verduidelijkt dat haar bouwopdracht ook deze gekozen uitwaaier omvat. Bouw is goedgekeurd; publicatie blijft een afzonderlijke stap.

Gebouwd als FanGallery, in Puck onder Foto’s en video → Uitwaaier — verfijnd (3 foto’s). Drie visuele fotokeuzes, aparte uitsneden, vier sectiekleuren en aan/uit voor beweging. Alleen de aangewezen of gefocuste print beweegt omhoog en recht; ontbrekende foto’s blijven lege, niet-aanklikbare vlakken. Klikbare foto’s gebruiken de bestaande transparante vergroting. Geen bestaande pagina automatisch gewijzigd.

## Ontbrekende fotovelden in contactheader — gepubliceerd

### Gerichte bugcontrole op verzoek van Neeltje

Na de melding over Contact zijn editorvelden, mediabeschikbaarheid en de carrouselcode gericht gelezen. Geen gebruikersinhoud gewijzigd of publicatie gestart. Dit is geen volledige controle van alle pagina’s, apparaten of diensten.

- [x] **Ontbrekende bronfoto’s in Puck overal herkennen.** ImagePicker, MediaLibrary en MediaDetails controleren momenteel voornamelijk deletedAt; een manifestvermelding missing:true kan toch als actieve/kiesbare foto worden behandeld. assetURL en thumbnailURL leveren dan een lege URL, met een leeg/kapot voorbeeld en misleidende beschikbaarheid als gevolg. De Sveltia-/VisualMediaPicker-controle is al uitgebreider. Gelijk trekken, zonder bewust verwijderde bestanden terug te zetten.
- [x] **Carrousel bij veel reportages begrenzen.** De schaalberekening 1 - abs(offset) * .12 wordt bij offset 9 negatief. Bij 20 reportages bereikt een achterste kaart offset 10 en schaal -0.2; daardoor kan die gespiegeld/omgekeerd verschijnen. Schaal en lagen veilig begrenzen, met dezelfde huidige uitstraling bij kleine aantallen. Dit is een latente fout, niet waargenomen op de huidige carrousel met vier reportages.
- [x] **De ontbrekende fotovelden uit de onderstaande melding generiek herstellen.** Het probleem zit in de vaste fotovelden, niet alleen in Contact; ook andere bestaande blokken met een lege of onvolledige images-array kunnen geen fotokeuzes tonen terwijl de weergave standaardbeelden gebruikt.

Neeltje heeft expliciet ‘bouw’ gezegd voor alle drie auditpunten. Gebouwd; publicatie wacht op afzonderlijke toestemming. De reeds gepubliceerde focus- en Sveltia-reparaties blijven intact.

Neeltje ziet bij de geselecteerde Redactionele collage-header op Contact alleen teksten en de mediatoelichting, zonder fotovakken. Dit is bevestigd in de open Chrome-bewerking, zonder wijzigingen of herladen. De gepubliceerde pagina heeft drie images-selecties; het online concept puck/contact bevat images: []. ImagesField rendert daardoor geen velden, terwijl de renderer wel op de drie standaardfoto’s terugvalt.

- [x] Ontbrekende of lege fotovelden in een vast fotoblok veilig aanvullen vanuit de blokdefinitie, zodat Foto achteraan, Hoofdfoto en Detailfoto weer kiesbaar zijn. Bestaande ingevulde keuzes en expliciet leeggemaakte media-ID’s behouden.
- [x] Ook gedeeltelijke oudere selecties afhandelen zonder bestaande uitsneden, teksten of conceptinhoud te vervangen; lege fotobronnen blijven duidelijke ontbrekende beelden.
- [x] In een aparte voorbeeldbewerking controleren met images: [], ontbrekende images en drie bestaande selecties. Het echte contactconcept niet automatisch overschrijven of een oudere versie laten laden. Gebouwd na expliciet ‘bouw’; afzonderlijke publicatietoestemming volgt.

Controle: productiebouw geslaagd. Gerichte controle van lege/ontbrekende/partiële fotovelden, expliciet leegmaken, uitsnedebehoud en mediabeschikbaarheid geslaagd. Schaal blijft positief voor 1, 4, 20 en 100 kaarten. In een aparte lokale voorbeeldbewerking zijn drie velden zichtbaar, ontbrekende foto’s niet kiesbaar en is een beschikbare vervangende hoofdfoto succesvol geplaatst. Het echte Contact-concept is niet aangepast.

## Focusverlies bij tekstbewerking — gepubliceerd

Neeltje meldt na publicatie van de portfolio-carrousel dat een tekstveld na één letter de focus verliest. Codeonderzoek: de nieuwe StoryCarousel.resolveFields wordt door Puck na elke inhoudswijziging aangeroepen en maakt telkens een nieuwe custom tekstveld-renderfunctie aan. Dit is de waarschijnlijke oorzaak van het opnieuw opbouwen van het invoerveld. De editorconfiguratie zelf is al met useMemo gestabiliseerd; de bestaande lokale opslag en herstelpunten zijn hiervan onafhankelijk. Geen live klantbewerking gewijzigd of pagina ververst tijdens het onderzoek.

- [x] De definitie en renderfunctie van het carrouseltekstveld stabiel maken; alleen het zichtbare veldschema aanpassen wanneer de bronkeuze verandert.
- [x] In een aparte lokale voorbeeldbewerking controleren dat doorlopend typen, spaties, verwijderen en cursorplaatsing behouden blijven, inclusief wisselen tussen handmatige inhoud en Sveltia-reportages.
- [x] Bestaande teksten, selecties, uitsneden en concepten behouden. Gebouwd na expliciet ‘bouwen’ op 20 oktober 2026. Publicatie blijft een aparte stap.

Gecontroleerd in een afzonderlijke lokale Puck-bewerking met dezelfde configuratie: een volledige zin letter voor letter typen, spaties, Backspace, cursorverplaatsing en wisselen naar handmatige inhoud behouden de invoerfocus. Geen echte paginaconcepten gewijzigd.

## Portfolio-overzicht via Van het eerste moment tot de laatste dans — bouw goedgekeurd

Neeltje kiest dit bestaande onderdeel voor haar Portfolio-overzicht, in plaats van de lijst ‘Reportages uit Sveltia’, en geeft expliciet ‘bouw’.

- [x] De bestaande carrousel laten vullen met gepubliceerde trouwreportages uit Sveltia; alle reportages automatisch of een eigen selectie en volgorde in Puck.
- [x] Foto, titel, locatie en juiste projectlink uit dezelfde reportagebron halen; de link onder de carrousel laten meewisselen en de actieve kaart aanklikbaar maken.
- [x] Bestaande handmatig gevulde carrousels en paginaconcepten behouden; bronkeuze en uitsneden beschikbaar maken en het gebruik documenteren. Geen pagina's vervangen, menu's omzetten of concepten publiceren in deze bouwstap.

Gebouwd op 20 oktober 2026. De lokale productiebouw is geslaagd. Nieuwe carrousels gebruiken standaard alle gepubliceerde reportages; bestaande blokken zonder bronkeuze behouden hun handmatige inhoud. De Portfolio-pagina en andere concepten zijn niet gewijzigd. Neeltje heeft op 20 oktober 2026 expliciet ‘publiceer’ gezegd. PR #23 is samengevoegd als 0f8af426f0724baa42b409f9c3ca99fca88ffc32. Tijdens publicatie is ook het omgaan met fysiek verwijderde bronbestanden hersteld: er verschijnt een leeg mediavlak; de verwijderde bestanden worden niet teruggezet. Gepubliceerd op de GitHub Pages-testsite; run 39446499695 is geslaagd.

## Sveltia-beeldbank vernieuwen — gepubliceerd

Neeltje geeft op 20 oktober 2026 expliciet opdracht deze reparatie samen met het focusverlies te bouwen.

- [x] De Sveltia-fotokiezer leest de actuele mediaregistraties op GitHub en de gewijzigde media uit open Puck- en mediaconcepten. Dezelfde media-ID’s blijven behouden; geen dubbele uploads of aparte kopie van de bibliotheek. Alleen concepten uit de eigen repository worden gelezen.
- [x] Vernieuwen werkt de fotokiezers bij zonder de ingevulde selecties of het formulier te vervangen. Gepubliceerde media, online conceptmedia, ontbrekende bronfoto’s en uploads op alleen dit apparaat zijn herkenbaar. Alleen lokale uploads zijn nog niet plaatsbaar; eerst in Puck online opslaan. Conceptmedia vóór de pagina publiceren.
- [x] Leesfouten en GitHub-begrenzing zichtbaar melden en de laatst gepubliceerde bibliotheek bruikbaar houden. Geen tokens uit Sveltia uitlezen of nieuwe tokens opslaan. Deze openbare GitHub Pages-repository wordt alleen-lezen benaderd. Voor een eventuele private repository is later een geauthenticeerde koppeling nodig.

De productiebouw is geslaagd. Gerichte controle met nagebootste GitHub-antwoorden bevestigt dat een online mediaconcept verschijnt, een verwijderd origineel herkenbaar blijft, lokale uploads een eigen status krijgen en media niet dubbel voorkomen. Een echte upload/publicatie vanuit het account is niet uitgevoerd.

Publicatie van beide reparaties expliciet goedgekeurd op 20 oktober 2026. PR #25 is samengevoegd als 05215a36edaa7cdc86a8b6b09a2dfe8e448bcd4c. GitHub Pages-run 39474743085 is geslaagd. Open gebruikersbewerkingen zijn niet herladen of gewijzigd.

De drie auditreparaties zijn op 20 oktober 2026 expliciet goedgekeurd met ‘publiceer’ en gepubliceerd via PR #26, main 714b3e8bdb00cc786dd8b41b6ac8112ac9e4fcac. GitHub Pages-run 39477219086 is geslaagd. Het eigen Contact-concept en open gebruikersbewerkingen zijn behouden.

## Checklistaanvraag met nieuwsbriefkeuze — gebouwd, nog niet gepubliceerd

Neeltje wil de gratis checklist koppelen aan het ontvangen van nieuwsbrieven. Op 20 oktober 2026 expliciet ‘bouw’ voor deze wijziging en de verfijnde uitwaaier.

- [x] Een verplichte, nooit vooraf aangevinkte checkbox bij checklistaanvragen, met duidelijke vermelding van de checklist, nieuwsbrieven en uitschrijven op ieder moment. Andere formulieren behouden hun bestaande werking.
- [x] De tekst centraal in Sveltia bewerkbaar maken. Tegenstrijdige standaardtoelichting over alleen reageren op een bericht vervangen. Bij toekomstige verzending toestemming, gebruikte tekst en tijdstip meesturen.
- [x] De uitgestelde verzendkoppeling uitgeschakeld houden; geen nieuwsbriefabonnement, checklistdownload of werkende uitschrijfdienst suggereren voordat de echte dienst is aangesloten. De toekomstige ontvanger moet de toestemming zelf ook valideren en uitschrijven ondersteunen.

Productiebouw geslaagd. De opmaak van uitwaaier en formulier is lokaal bekeken; er zijn geen formuliergegevens verstuurd en geen abonnementen aangemaakt. Geen tests toegevoegd of uitgevoerd in deze bouwstap. Verzending en download blijven uitgeschakeld; de tekst bij toestemming is centraal in Sveltia bewerkbaar. Publicatie wacht op afzonderlijke toestemming.

## Aanvullende bouw en publicatie — expliciet goedgekeurd 21 oktober 2026

- [x] Uitwaaier uitbreiden naar keuze 3 of 5 foto’s; op smalle schermen één horizontale rij houden met vegen, pijltjes bij overloop en toetsenbordbediening. De twee extra fotokeuzes blijven bewaard bij terugschakelen naar drie.
- [x] Bij de persoonlijke quote met handtekening de markeerstifttekst leesbaar maken op donkerrood, ook vóór en tijdens het onthullen. Volledig roze markeervlak met donkerrode tekst; de omliggende tekst blijft roze.
- [x] GitHub-verzoeken voor Sveltia samenvoegen en tijdelijk hergebruiken, onveranderlijke bronversies bewaren, beperkingen respecteren en de laatst succesvol geladen online bibliotheek lokaal bewaren. Bij een fout blijft die bruikbaar. Ook een bevestigd Puck-mediaconcept uit dezelfde browser kan worden herkend zonder een nieuw GitHub-API-verzoek. Geen tokens kopiëren of nieuwe inloggegevens opslaan. Nog uitsluitend lokale uploads blijven geblokkeerd.
- [x] Statusmeldingen bij geblokkeerde foto’s op volle tekststerkte tonen; alleen de miniatuur vervaagt.
- [x] Portfolio-opbouw met verhaalhoofdstukken, grote tussengalerijen, tekst naast foto, twee foto’s, optionele echte review, locatie/leveranciers, gerelateerde reportages en optionele contactknop. SEO-titel en omschrijving per project; bestaande project-URL’s behouden. Sveltia beheert de inhoud en toont een opgemaakte conceptvoorvertoning. Puck toont eigen projectpagina’s en laat de volgorde en uitsneden aanpassen met behoud van één inhoudsbron.

De al gebouwde nieuwsbriefkeuze en uitwaaier worden meegenomen in deze publicatie. Formulierverzending, nieuwsbriefdienst, checklistbestand, hosting, agenda en chat blijven afhankelijk van nog te kiezen diensten of gegevens; er zijn geen diensten of abonnementen aangezet. De bestaande klantconcepten en de Wix-site zijn niet gepubliceerd of vervangen.

Publicatie bevestigd op 21 oktober 2026: PR #28 samengevoegd als 4a9d0e8ee1c0ea63f054d6b23a72b23e3a28d13a. GitHub Pages-run 39572181729 geslaagd. De open gebruikersconcepten zijn behouden.

## Reviewkaarten — eigen selectie per blok — aangevraagd 21 oktober 2026

- [x] Bij de reviewkaarten in Puck een keuze toevoegen tussen alle zichtbare Sveltia-reviews en een eigen selectie per blok.
- [x] Reviews visueel herkenbaar op naam en korte quote kiezen en de eigen volgorde kunnen aanpassen. De teksten en foto's blijven centraal in Sveltia; selecties op verschillende pagina's zijn onafhankelijk.
- [x] Bestaande blokken blijven alle zichtbare reviews tonen totdat een eigen selectie is ingesteld. De algemene Sveltia-instelling Tonen blijft gerespecteerd. Lege of niet-beschikbare selecties duidelijk melden in de editor, zonder automatisch andere reviews te kiezen.

Bouw en publicatie expliciet goedgekeurd door Neeltje op 21 oktober 2026: ‘bouw en publiceer’. Gebouwd met behoud van bestaande blokken en inhoud; eigen selectie en volgorde worden op ieder blok apart opgeslagen.

## Draai mee door jullie dag — achtergrondvlak volgt sectiekleur

- [x] Het vaste donkerrode vlak achter de draaiende foto's verwijderen als onafhankelijke kleur. Het vlak volgt nu de gekozen achtergrond: wit, blauw, roze of donkerrood; tekst en bediening volgen de passende sectiekleuren. Foto's, posities, animatie en opgeslagen instellingen blijven behouden.

Toegevoegd door Neeltje tijdens de goedgekeurde bouw- en publicatiestap van de reviewkeuze op 21 oktober 2026.

Tijdens de online bouw bleek de opgeslagen review van Mark en Rooa dezelfde interne naam als Chiel en Natascha te hebben. De dubbele naam is hersteld naar mark-rooa. Onbedoeld overgenomen vervolgkoppelingen naar de review van een ander bruidspaar zijn leeggemaakt; alle namen, quotes, volledige teksten en foto’s blijven behouden. De vervolgkoppeling is nu zichtbaar in Sveltia, met uitleg dat deze bij zelfstandige reviews leeg hoort te blijven.

Reviewkeuze en doorlopende galerijachtergrond gepubliceerd op 21 oktober 2026 via PR #31, main 35269c629eefc85d23318610b17cffb8cd67d515. GitHub Pages-run 39596802368 is geslaagd. De bouw controleerde de actuele vier zelfstandige reviews; de teksten en foto's zijn behouden.

## Draai mee — twaalf foto's — visueel voorstel 21 oktober 2026

- [x] De draaigalerij uitbreiden van zeven vaste fotovelden naar maximaal twaalf foto's, met behoud van de huidige ingevulde foto's en uitsneden.
- [x] Met twaalf beelden een voller geheel maken; vegen, pijltjes, vergroting en passende mobiele afmetingen behouden. De galerij volgt de gekozen sectieachtergrond.
- [x] Eerst een los interactief voorbeeld laten beoordelen; hierin wordt bestaand voorbeeldbeeldmateriaal herhaald op twaalf posities. Bouw en publicatie inmiddels expliciet goedgekeurd op 21 oktober 2026.

Neeltje kiest op 21 oktober 2026 twaalf foto's in plaats van vijftien. Het losse voorbeeld is aangepast; de website is nog niet aangepast.

## Aanvullingen tijdens bouw twaalf foto's — goedgekeurd 21 oktober 2026

- [x] Quote met eigen handtekening: rood-oranje merkkleur voor markeerstift en handtekening; het lichtroze markeervlak vervalt. Donkerrode tekst blijft over het hele rode markeervlak leesbaar.
- [x] Reviewkaarten: korte quote zichtbaar houden met een eigen uitklapbare volledige review uit hetzelfde Sveltia-record. Geen losse titel zonder toegang tot een ingevulde lange tekst. Zonder afzonderlijke lange tekst staat de hele quote zichtbaar en verschijnt geen lege uitklapknop. Native bediening met toetsenbord, onafhankelijk per kaart, bestaande keuzes en kleuren behouden.

Neeltje vraagt beide aanvullingen mee te nemen in dezelfde bouw en directe publicatie. Geen klantteksten of media automatisch ingevuld of vervangen.

## Contactcorrecties — bouw in deze chat, 30 oktober 2026

De onderstaande bouw vervangt de eerdere open bouwpunten van 30 oktober:

- [x] Kort formulier met alleen namen en telefoon; aparte verzendblokkade behouden.
- [x] Herzien gekozen ontwerp met portret naast formulier, echte uitklapbare review en drie bewerkbare fotokaarten.
- [x] Geen ‘En dan?’-blok; ook oude instellingen kunnen het niet terugbrengen.
- [x] Twinkelende headerglitters, pauze, hoverbeweging van foto/label en glans/lift op knop, met minder-bewegenondersteuning.
- [x] Eigen fotomuurselectie uit bewaarde conceptversie overgenomen; oorspronkelijke lijstmaterialen, posities en vorm behouden, nieuwe titelopmaak toegepast.
- [ ] Publicatie: alleen na afzonderlijke toestemming; deze bouw wijzigt de live website niet.

De nieuwe bouw staat in de aparte checkout contactpagina-bouw. Bestaande conceptbranches en de oude lokale projectmap blijven behouden.
