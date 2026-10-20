# Blogs, collage en kaarten beheren

## Sveltia → Journal

Open een artikel of maak een nieuw artikel.

- Vul een titel, onderwerp en introductie in.
- Voeg bij **Voor de snelle lezer** de kernpunten toe. Bestaande artikelen zonder kernpunten gebruiken tijdelijk de introductie als samenvatting.
- Vul de echte publicatiedatum in; een ontbrekende datum wordt niet verzonnen. Bijgewerkt op is optioneel.
- De leestijd wordt automatisch berekend uit de introductie, samenvatting en artikelblokken. De oude handmatige leestijd wordt niet meer gebruikt, ook niet op overzichtskaarten.
- Gebruik de bestaande artikeltekst en/of **Artikelblokken**. Blokken kun je verslepen: tekst, één foto, twee foto's, foto naast tekst, tip of checklist.
- Een artikel kan helemaal zonder foto's. Kies voor beelden een bestand uit de mediabibliotheek; de publicatie maakt passende geoptimaliseerde webversies.
- De inhoudsopgave verschijnt automatisch bij minimaal drie tussenkoppen (kop 2 en kop 3). Je kunt hem per artikel uitzetten.
- Gerelateerde artikelen worden automatisch gekozen uit gepubliceerde artikelen, met voorkeur voor hetzelfde onderwerp. Je kunt ze zelf selecteren.
- De uitnodiging onderaan is optioneel en aanpasbaar. De knop verschijnt alleen als tekst én link ingevuld zijn.
- De leesvoortgang loopt tot het einde van het artikel; de footer en leestips tellen niet mee.

De bestaande drie artikelen bevatten nog korte tijdelijke teksten. Vul je eigen artikelinhoud en samenvattingen in. De opmaak verzint geen inhoud of publicatiedatums.

## Sveltia → Algemene instellingen → Informatiekaarten & reviews

**Volop beleven, mooi bewaren:** twee losse kaarten met eigen teksten, optionele foto, kenmerken en knop. Een lege knoptekst of lege link verbergt de knop.

**Losse reviewkaarten:** een lijst met minimaal twee kaarten. De foto is optioneel. Quotes gebruiken Host Grotesk Regular, namen Playfair Display Italic. Twee kaarten staan naast elkaar; vanaf drie maximaal drie op desktop met pijlen wanneer er meer zijn dan passen. Op mobiel één kaart per keer met pijlen.

De eerste twee kaarten zijn fragmenten van dezelfde bestaande review van Jeroen en Martine, als zodanig aangeduid. Voeg je volgende echte review toe of vervang het tweede fragment. Er zijn geen nieuwe klantbeoordelingen verzonnen.

## Puck → pagina kiezen

- **Redactionele collage-header:** titel, sierlijke titelregel, introductie, drie foto's en uitsneden. Er staat geen extra quote op of onder de foto's.
- **Twee informatiekaarten uit Sveltia** en **Losse reviewkaarten uit Sveltia:** plaatsing, kop en achtergrond in Puck. De kaartinhoud heeft één beheerplek in Sveltia.
- **Reportages uit Sveltia:** de oorspronkelijke lijst met scheidingslijnen en zwevende foto bij aanwijzen. Op mobiel blijven de rijen direct aanklikbaar. Titels en foto's komen uit Trouwreportages; uitsneden pas je per blok in Puck aan.

Dezelfde renderer en stylesheet worden gebruikt door de editor en de gepubliceerde pagina. **Gepubliceerde versie laden** bewaart eerst een herstelpunt van je huidige bewerking. Nieuwe vormgeving of een nieuwe editor betekent niet dat je je eigen concept moet vervangen.

## Nieuw: stappenbalk, auteur en bevestigingen

Sveltia → Algemene instellingen → **Stappen, auteur & bevestigingen**:

- Drie stappen, teksten en optionele knop van de compacte stappenbalk.
- Auteursfoto, naam, korte introductie en link naar Over Neeltje. De foto is optioneel. Per artikel kun je het auteursblok uitzetten via **Persoonlijk auteursblok tonen**. Het profiel van Neeltje wordt alleen getoond bij artikelen van Neeltje.
- De teksten van de vier bevestigingspagina's: contact, datumaanvraag, nieuwsbrief en checklist.

In Puck staat **Samen op weg — compacte stappenbalk** bij Plannen en contact. De stappenbalk is ook op de homepage geplaatst. De bevestigingspagina's staan tussen de pagina's. Kies daar **Voorvertoning** om de bedoelde bevestiging als duidelijk gemarkeerd voorbeeld te bekijken. Rechtstreeks via de publieke URL wordt zonder geslaagde verzending geen verzendbevestiging geclaimd. Een link met `?voorbeeld=1` toont een expliciet gemarkeerd voorbeeld.

### Verzending bewust nog uitgeschakeld

Op verzoek van Neeltje: **Verzending later aansluiten**. Contact- en datumaanvragen zijn bestemd voor **info@studioneeltje.com**. De website toont nu dit adres als alternatief. De formulierknoppen zijn uitgeschakeld zolang geen verwerkingsdienst is gekoppeld; formulieren tonen geen nepbevestiging. Nieuwsbriefdienst en checklistbestand zijn nog niet gekozen.

De instellingen staan in Sveltia → Algemene instellingen → **Formulierkoppelingen (nog uitgeschakeld)**. Daar horen alleen openbare formulier-endpoints; nooit wachtwoorden, toegangstokens of geheime API-sleutels. Het voorbereide endpoint-contract is HTTPS met CORS, POST JSON, veld `form` als formulierdoel en een antwoord met `{ "success": true }` na daadwerkelijke verwerking. Het backend moet zelf e-mailvalidatie, spambeveiliging, limieten, bezorging en eventuele nieuwsbriefbevestiging afhandelen. Alleen een geactiveerde aansluiting maakt de knop bruikbaar. Preview verstuurt nooit gegevens. Na een bevestigde verwerking gaat de gebruiker naar de passende bedankpagina.

### GitHub-concept in Puck

Na vernieuwen van de beheeromgeving moet je opnieuw inloggen. Kies de juiste pagina; je lokale bewerking blijft het uitgangspunt. **Concept opslaan** bewaart die online. Staat daar een andere versie, dan krijg je een vergelijking met de optie **Mijn bewerking als nieuwe versie opslaan**. Een oudere versie laden is nooit verplicht.

**Online concept vergelijken** toont eerst de bouwstenen van beide versies. Alleen **Deze andere versie overnemen** vervangt het bewerkvlak. Eerst wordt een herstelpunt opgeslagen; als dat mislukt, blijft de huidige bewerking staan. Een pagina die tijdens het ophalen wordt gewijzigd, wordt niet stilzwijgend vervangen.

**Versiegeschiedenis** geeft toegang tot maximaal 30 recente herstelpunten per pagina op dit apparaat, online GitHub-versies en **Reservekopie terugzetten** voor een JSON-bestand. Lokale herstelpunten worden automatisch gemaakt en vóór bronwissels extra vastgelegd. Herstelpunten bevatten pagina-inhoud en mediagegevens, geen toegangstoken. Een ander apparaat heeft zijn eigen lokale geschiedenis; online versies blijven in GitHub. Terugzetten publiceert niets.

Voor de trouwchecklist is op 19 oktober 2026 de geëxporteerde bewerking van 21:57 teruggezet in het bestaande online concept. Die bevat de eigen checklistkop, Waarom deze checklist?, quote, Wat de meeste checklists je niet vertellen en contactoproep. De nieuwe verkoopblokken en het losse formulier zijn toegevoegd. Latere, niet opgeslagen wijzigingen zijn niet in deze reservekopie aanwezig.


## Trouwchecklist: Papier & overzicht en Voor wie

In Puck → **Plannen en contact** staan:

- **Trouwchecklist — Papier & overzicht**: de checklist als gelaagde, rechte cover met drie voordelen en een knop naar het losse aanvraagformulier. De coverfoto en desktop-/mobiele uitsnede zijn per blok te kiezen.
- **Voor wie — twee stijlen**: kies bij **Vormgeving** voor **Persoonlijk & herkenbaar** of **Rustig & redactioneel**. De eerste gebruikt de vijf herkenningspunten met sterren; de tweede toont dezelfde punten als een uitklapbare redactionele lijst.
- De bestaande losse formulierbouwsteen blijft apart. De actieknop verwijst naar het eerste checklistformulier op de pagina. Verzending blijft uitgesteld.

Alle teksten, vijf herkenningspunten, drie voordelen, covergegevens en optionele knop staan op één plek: **Sveltia → Algemene instellingen → Trouwchecklist: verkoopblokken**. Een lege knoptekst of lege link verbergt de knop. De lijstlengte moet 3, 5 of 7 zijn; andere aantallen houden publicatie tegen met een melding.

Bij het eerste openen met de nieuwe editor krijgen oudere lokale checklistconcepten en GitHub-concepten de twee nieuwe bouwstenen erbij, zonder bestaande teksten te vervangen. Deze eenmalige aanvulling wordt op het concept gemarkeerd; later bewust verwijderde blokken worden niet opnieuw toegevoegd. Ontbreekt het checklistformulier, dan wordt de losse formulierbouwsteen toegevoegd.

**Bewaar eigen lokale wijzigingen met Concept opslaan.** Je hoeft daarvoor geen ouder GitHub-concept over je huidige bewerking te laden. Opslaan maakt een nieuwe versie in het bestaande concept en behoudt de geschiedenis. Is het online concept intussen elders gewijzigd, dan krijg je een vergelijking en kun je jouw huidige bewerking als nieuwe versie opslaan. De opslag blijft beveiligd tegen wijzigingen tijdens het verzenden. Publicatie blijft een aparte stap na het bekijken van de voorvertoning.

## Losse review met lees meer

In Puck → **Verhalen → Losse review met lees meer** staat de grote zelfstandige quote met een uitklapbare volledige review. Dit is een aparte bouwsteen naast de reviewkaarten en de persoonlijke quote met handtekening.

- Kies de gewenste review in Puck. Achtergrond en tekstkleur volgen de vier bestaande huisstijlkeuzes.
- Bewerk de korte quote, naam, onderschrift, optionele foto en optionele volledige tekst in **Sveltia → Algemene instellingen → Informatiekaarten & reviews → Reviews voor kaarten en losse quote**. De korte naam van een review verbindt de inhoud met de bouwsteen; wijzig deze niet nadat hij op een pagina is gekozen.
- Zonder volledige tekst of bestaand gekoppeld vervolg verschijnt geen uitklapknop. Zonder zichtbare quote en naam verschijnt de bouwsteen niet op de website. Een foto is nooit verplicht; met foto kun je in Puck de desktop- en mobiele uitsnede aanpassen.

De twee bestaande fragmenten van Jeroen & Martine blijven als kaarten behouden. De losse quote gebruikt het tweede fragment als vervolg, zodat die bestaande tekst niet op twee plekken bewerkt hoeft te worden. Een ingevulde volledige tekst bij de eerste review krijgt voorrang.

Bij **Losse reviewkaarten uit Sveltia** passen de twee kaartvlakken zich aan de
sectieachtergrond aan: roze en blauw op wit, wit en roze op blauw, wit en blauw op
roze, en wit en roze op donkerrood. De tekst op de kaarten blijft donkerrood.
Beide reviewbouwstenen gebruiken dezelfde sierlijke aanhalingstekens; de quote
blijft Host Grotesk en de naam Playfair Display Italic. De achtergrond kies je in Puck.

Foto's in de **Fotomuur** openen in de grote galerijweergave met een volledig transparante achtergrond. Klik op de foto of eromheen om te sluiten. Kruisje en Escape sluiten ook; pijltjes wisselen tussen de foto's. Het bewerkvlak van Puck blijft bedoeld om blokken te selecteren; interactie bekijk je via **Voorvertoning**.

## Kantelkaart — kort tekstje met knop

Voeg in Puck onder **Plannen en contact** de bouwsteen **Kantelkaart — kort tekstje met knop** toe. Je kiest zelf de plaats op de pagina. De licht gekantelde kaart en het oranje vel erachter bewegen bij aanwijzen of toetsenbordfocus.

- **Tekst op het label (Bewaar dit gevoel)** is vrij te wijzigen. Maak dit veld leeg om het label weg te laten. Ook de bovenregel, titel, sierlijke titeltekst en korte tekst zijn per kaart bewerkbaar.
- Vul **Knoptekst** en **Knoplink** beide in om één knop te tonen. Zonder tekst of zonder geldige link verschijnt er geen knop. De kaart kan ook als los tekstje zonder knop worden gebruikt.
- **Achtergrond & tekstkleur** kiest de kaartkleur: wit, blauw, roze of donkerrood. **Beweging bij aanwijzen** kan uit; de systeemvoorkeur voor minder beweging wordt altijd gerespecteerd.

De inhoud van deze bouwsteen beheer je alleen in Puck. De gedeelde renderer geeft hem dezelfde vormgeving in het bewerkvlak, de voorvertoning en de gepubliceerde pagina. Bestaande pagina's krijgen niet automatisch een extra kaart.
## Portfolio als carrousel

Open je bestaande Portfolio-pagina in Puck. Voeg **Van eerste moment tot laatste dans** toe, of selecteer het blok dat er al staat. Onder **Inhoud van de carrousel** kies je:

- **Alle gepubliceerde reportages uit Sveltia:** nieuwe gepubliceerde verhalen komen automatisch in de carrousel.
- **Zelf reportages kiezen en ordenen:** voeg je gekozen reportages toe onder Eigen selectie en volgorde, en versleep ze naar de gewenste volgorde.
- **Handmatige foto's en teksten behouden:** voor bestaande carrousels. De opgeslagen beelden, teksten en links blijven bewaard wanneer je van bron wisselt.

Foto, titel, locatie en projectlink komen uit **Sveltia → Trouwreportages**. De actieve foto en de knop openen het bijbehorende verhaal; de knop wisselt mee met de pijlen of schuifregelaar. De omslagfoto kies je in Sveltia; uitsneden voor deze carrousel kun je apart in Puck instellen. Dubbele selecties verschijnen eenmaal. Niet-gepubliceerde of verwijderde reportages verschijnen niet, zodat er geen link naar een ontbrekende projectpagina ontstaat. Een lege selectie toont in de voorvertoning een melding, geen voorbeeldreportages.

Publiceer nieuwe of gewijzigde reportages vanuit Sveltia en wacht tot de site opnieuw is opgebouwd. Bewaar open Puck-werk voordat je beheer ververst. Sla daarna je Portfolio-pagina als concept op en bekijk de voorvertoning. Concept opslaan en publiceren zijn afzonderlijke stappen. Je bestaande Portfolio-concept en het menu worden niet automatisch vervangen.


## Dezelfde Puck-foto’s kiezen in Sveltia

Upload je foto's één keer in **Puck → Media**. Kies daar **Media online opslaan**. Ga vervolgens in Sveltia naar het fotoveld en kies **Beeldbank vernieuwen**. De kiezer haalt de actuele mediaregistraties op GitHub op, inclusief online Puck- en mediaconcepten. Foto’s worden visueel getoond met hun status. Vernieuwen verandert je ingevulde selectie niet.

Foto’s die nog alleen op dit apparaat staan, kun je in dezelfde browser herkennen maar pas kiezen nadat je ze online hebt opgeslagen. Een online mediaconcept kun je alvast kiezen; publiceer de media vóór je de reportage of pagina publiceert. Webformaten worden bij de bestaande GitHub-bouw gemaakt; concepten kunnen tijdelijk het origineel tonen. Een fysiek verwijderd origineel krijgt een melding en kan niet als nieuwe foto worden gekozen. Vernieuwen herstelt geen verwijderde bestanden.

De verbinding gebruikt de openbare repository en vraagt geen extra token. Als GitHub tijdelijk aanvragen begrenst of niet bereikbaar is, verschijnt een melding; de gepubliceerde bibliotheek blijft beschikbaar. Bij gebruik in een andere browser of op een ander apparaat zijn alleen online opgeslagen bestanden beschikbaar.

## Fotovelden bij oudere paginaconcepten

Bij vaste fotoblokken blijven alle fotovakken beschikbaar, ook als een ouder concept een lege of gedeeltelijke fotolijst bevat. In de redactionele collage-header zijn dat **Foto achteraan**, **Hoofdfoto** en **Detailfoto**. Selecteer de header, klap het gewenste vak onder Foto’s en uitsneden open en kies een foto. De ontbrekende velden worden pas samen met jouw bewerking opgeslagen; je bestaande teksten en uitsneden worden niet automatisch overschreven. Een bewust leeggemaakte fotokeuze blijft leeg.

Puck toont bij fysiek ontbrekende bronbestanden een duidelijke melding, zonder kapotte miniaturen of uitsnedevoorbeeld. Die foto’s zijn niet opnieuw plaatsbaar. Een soft verwijderd beeld kan worden teruggezet als het origineel nog aanwezig is; kies anders een nieuw beeld op de gebruikte plek. De carrousel behoudt ook bij grotere aantallen reportages positieve afmetingen en geldige lagen.
