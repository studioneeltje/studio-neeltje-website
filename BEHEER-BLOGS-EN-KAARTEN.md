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

Dezelfde renderer en stylesheet worden gebruikt door de editor en de gepubliceerde pagina. Heb je een oud lokaal concept open, kies dan **Gepubliceerde versie laden** om de nieuwe pagina-indeling op te halen. Dat vervangt dat lokale paginaconcept; bewaar het eerst als je eigen wijzigingen wilt houden.

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

Na vernieuwen van de beheeromgeving moet je opnieuw inloggen. Kies de juiste pagina en **GitHub-concept laden**. Het bewerkvlak wordt nu opnieuw opgebouwd met dat concept. De versie wordt lokaal bewaard. Je bestaande GitHub-concept wordt niet automatisch gepubliceerd of aangepast door deze reparatie.
