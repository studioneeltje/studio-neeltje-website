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

## Portfolio als verhaal per project — op de todo, nog niet bouwen

Referentie van Neeltje: https://www.studioneeltje.com/trouwfotograaf-kasteel-keukenhof-lisse. De bestaande Keukenhof-pagina wisselt het verhaal, informatie over de locatie, losse foto's en galerijen af. Op de nieuwe site moet iedere reportage een eigen verhaal kunnen worden, in de nieuwe huisstijl.

- [ ] Een projectheader met titel, namen van het bruidspaar, locatie en gekozen headerbeeld(en).
- [ ] Losse, verschuifbare verhaalhoofdstukken met eigen tussenkoppen en teksten, bijvoorbeeld voorbereidingen, ceremonie en avondfeest. Geen verplichte vaste hoeveelheid hoofdstukken.
- [ ] Afwisselende beeldonderdelen: tekst naast foto, losse brede foto, twee foto's en een galerij. Foto's en uitsneden per onderdeel kiezen; bestaande optimalisatie en vergroting behouden.
- [ ] Een optionele review van het bruidspaar met eigen quote, naam en optionele foto. Alleen tonen als een echte review is ingevuld; geen leeg vlak, verzonnen review of beoordeling tonen.
- [ ] Optionele projectinformatie over locatie, bijzonderheden en leveranciers met links, zodat elk project eigen inhoud krijgt.
- [ ] SEO per project uitbreiden met eigen zoekmachinetitel, metabeschrijving en duidelijke URL; semantische koppen en de bestaande alt-teksten behouden. Geen resultaatgaranties of verplicht zoekwoordenveld suggereren.
- [ ] Passende afsluiting met optionele contactknop en gerelateerde reportages; koppeling aan het Portfolio-overzicht vanuit dezelfde projectbron.

Voorgestelde beheeropzet: projectinhoud, review en SEO hebben één vaste plek in Sveltia. De projectpagina's ook visueel toegankelijk maken in Puck voor plaatsing en volgorde van de onderdelen, zonder teksten op twee plekken te kopiëren. Dit vereist uitbreiding van de huidige vaste reportage-template en is nog niet gebouwd. Wachten op expliciet ‘bouw’ en passende publicatietoestemming.

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

## Kantelkaartvlak en gedeelde mediabibliotheek — op de todo, nog niet bouwen

Aanvullende melding: ‘Beeldbank vernieuwen’ in Sveltia levert de verwachte Puck-foto’s niet op. Codeonderzoek bevestigt dat deze knop alleen de gepubliceerde content/bundle.json opnieuw ophaalt; hij synchroniseert geen lokale uploads of online mediaconcepten. De tekst onder het veld moet dit duidelijker uitleggen. Ook ontbrekende bronbestanden moeten als ontbrekend herkenbaar zijn in de fotokiezer, zonder kapotte miniaturen of een niet-helpende vernieuwinstructie. De volledige gedeelde bibliotheek is nog niet gebouwd.

Aangevraagd op 20 oktober 2026. Neeltje bevestigt dat de grotere fotobibliotheek in **Puck → Media** staat. De bestaande kantelkaartkeuze kleurt alleen de kaart; het omringende vlak blijft de paginakleur overnemen. De Sveltia-fotokiezer leest momenteel alleen de gepubliceerde mediabundel.

- [ ] Een onafhankelijke achtergrondkeuze voor het volledige vlak rond de kantelkaart toevoegen: wit, donkerrood, roze of blauw. De bestaande kaartkleur apart bewerkbaar houden, met passende tekst- en accentkleuren en behoud van opgeslagen instellingen.
- [ ] Puck → Media en de visuele fotokiezer in Sveltia dezelfde mediabibliotheek laten gebruiken, zodat opnieuw uploaden niet nodig is. Ook veilig omgaan met opgeslagen mediaconcepten en duidelijk aangeven welke foto's nog niet gepubliceerd zijn; lokale uploads eerst veilig online opslaan voordat ze elders beschikbaar worden.
- [ ] Bestaande fotoverwijzingen, bronbestanden, focuspunten, uitsneden en herstelbare verwijderingen behouden. Verversen vanuit Sveltia mogelijk maken zonder open bewerkingen kwijt te raken of dubbele bestanden aan te maken.

Dit is opgenomen als verzoek; implementatie wacht conform afspraak op expliciet ‘bouw’. Publicatie blijft een afzonderlijke stap.

## Kleine fotogalerij — De uitwaaier, verfijnd — gekozen, nog niet bouwen

Neeltje kiest op 20 oktober 2026 uitsluitend **De uitwaaier — verfijnd**. De plakcollage en de strakke varianten vervallen als bouwvoorstel. Referentie: fotoprints-verfijnd.html in de visualisatiemap van deze chat.

- [ ] Een herbruikbare galerijbouwsteen met drie zelf te kiezen foto's, zonder zichtbare teksten, met rechte hoeken en subtiel gedraaide fotoprints.
- [ ] De verfijnde individuele animatie behouden: alleen de aangewezen foto komt iets omhoog en draait recht, met zachte schaduw. Geen gezamenlijk uitwaaieren van de drie foto's bij aanwijzen. Ook bruikbaar met toetsenbord en aanraking, met respect voor minder beweging.
- [ ] De vier achtergrondkleuren, een passende mobiele opmaak en selectie uit de gedeelde fotobibliotheek ondersteunen. Bestaande focuspunten en uitsneden behouden; vergroting via de bestaande transparante fotoweergave laten aansluiten.

Dit is een ontwerpkeuze; bouwen wacht op expliciet ‘bouw’, publiceren op afzonderlijke toestemming.

## Focusverlies bij tekstbewerking — gebouwd, nog niet gepubliceerd

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

## Sveltia-beeldbank vernieuwen — gebouwd, nog niet gepubliceerd

Neeltje geeft op 20 oktober 2026 expliciet opdracht deze reparatie samen met het focusverlies te bouwen.

- [x] De Sveltia-fotokiezer leest de actuele mediaregistraties op GitHub en de gewijzigde media uit open Puck- en mediaconcepten. Dezelfde media-ID’s blijven behouden; geen dubbele uploads of aparte kopie van de bibliotheek. Alleen concepten uit de eigen repository worden gelezen.
- [x] Vernieuwen werkt de fotokiezers bij zonder de ingevulde selecties of het formulier te vervangen. Gepubliceerde media, online conceptmedia, ontbrekende bronfoto’s en uploads op alleen dit apparaat zijn herkenbaar. Alleen lokale uploads zijn nog niet plaatsbaar; eerst in Puck online opslaan. Conceptmedia vóór de pagina publiceren.
- [x] Leesfouten en GitHub-begrenzing zichtbaar melden en de laatst gepubliceerde bibliotheek bruikbaar houden. Geen tokens uit Sveltia uitlezen of nieuwe tokens opslaan. Deze openbare GitHub Pages-repository wordt alleen-lezen benaderd. Voor een eventuele private repository is later een geauthenticeerde koppeling nodig.

De productiebouw is geslaagd. Gerichte controle met nagebootste GitHub-antwoorden bevestigt dat een online mediaconcept verschijnt, een verwijderd origineel herkenbaar blijft, lokale uploads een eigen status krijgen en media niet dubbel voorkomen. Een echte upload/publicatie vanuit het account is niet uitgevoerd.
