# Studio Neeltje — nieuwe website

Dit is de testsite voor de nieuwe website, die uiteindelijk op studioneeltje.com
bij een nog te kiezen hostingprovider komt. GitHub Pages publiceert nu de
testversie vanuit `main`, met de hoofdmap als bron.

## Pagina's en gedeelde opmaak

- `index.html` is de homepage; `nieuwe-site.html` blijft beschikbaar als alias.
- `preview-pagina.html?pagina=reportages` en de overige `pagina`-waarden tonen
  de subpagina's. De losse reportagepagina's blijven ook beschikbaar.
- Alleen Living Canvas is actief. Oude `stijl`-links houden hun pagina en anker,
  maar kunnen geen andere ontwerpvariant meer activeren.
- `components/site-header.html` is de bron van het gedeelde menu.
- `assets/site.css` en `assets/site.js` verzorgen de gedeelde header en het
  mobiele menu. De header is al in de HTML aanwezig en hoeft niet opgehaald
  te worden tijdens het laden van een pagina.

Na wijzigingen aan de headerbron: voer `python3 scripts/sync-header.py` uit om
alle pagina's bij te werken. Voor een lokaal voorbeeld: `python3 -m http.server
4173 --bind 127.0.0.1`, open daarna http://127.0.0.1:4173/.

Alle lokale bestandsverwijzingen zijn relatief zodat ze zowel onder de
GitHub Pages-repository als op een toekomstig hoofddomein kunnen werken.
De huidige foto's verwijzen grotendeels naar Wix; de definitieve mediaopslag
moet nog worden gekozen. Bewaar de lokale afbeeldingbestanden in de hoofdmap.

## Vervolg

Zie [de todo-lijst](TODO.md). Puck is de gewenste visuele bouwer; de CMS-keuze
staat nog open. Formulierverzending, nieuwsbrief en beschikbaarheid zijn nog
geen aangesloten productiefuncties. Pic-Time staat los van dit project.
