# Werkregels — website Studio Neeltje

Nederlandstalige website van trouwfotograaf Neeltje Meijler: statische site met Puck
(visuele pagina's) en Sveltia (inhoud en instellingen), gebouwd met Node 24 en pnpm.
Lees bij elke sessie ook `TODO.md`, `LATER.md` en `HUISSTIJL.md`.

## Taal

- Schrijf alle berichten aan de gebruiker in het Nederlands, ook korte tussenregels.
- Teksten op de site, commitberichten, PR-beschrijvingen en documentatie ook in het Nederlands.
- Code, commando's en bestandsnamen blijven zoals ze zijn.

## Werkwijze: verzamelen → bouw → publiceer

1. **Verzamelen.** Een gevraagde wijziging komt eerst op `TODO.md`, met een korte,
   concrete omschrijving. Niets bouwen of pushen. Een losse gedachte of 'misschien
   later' gaat naar `LATER.md`.
2. **"bouw".** Pas als er expliciet *bouw* wordt gezegd: werk de open punten van
   `TODO.md` af (of het genoemde deel), voer `pnpm build` en de tests uit, controleer
   het resultaat lokaal (laptop én mobiel waar het om opmaak gaat) en commit lokaal.
   Afgevinkte punten verhuizen met datum naar onderaan `ARCHIEF.md`.
3. **"publiceer".** Pas als er expliciet *publiceer* wordt gezegd: push de branch en
   open of werk een pull request bij. Nooit rechtstreeks naar `main` pushen.
4. **Samenvoegen in `main`** gebeurt alleen na uitdrukkelijk akkoord in het gesprek,
   omdat `main` automatisch de beheeromgeving bijwerkt.
5. Een toestemming geldt voor die concrete stap, niet voor latere stappen.

Uitzondering: vragen, onderzoek, uitleg en het bijhouden van de lijsten zelf mogen
altijd zonder *bouw*.

## Nooit zonder uitdrukkelijke toestemming

- Het domein studioneeltje.com verhuizen of DNS-, Wix- of mailinstellingen wijzigen.
- Iets naar de live site, de testsite (test.studioneeltje.com) of `main` zetten.
- Betaalde upgrades, nieuwe accounts of diensten.
- Echte e-mails versturen of bestaande contacten in Sender triggeren.

## Inhoud

- Geen verzonnen reviews, citaten, cijfers of resultaten. Alleen echte teksten.
- Geen foto's van Sari en Onno zolang er geen toestemming is.
- Volg `HUISSTIJL.md` voor kleur, typografie, toon en opbouw. Wijk nooit af zonder
  dat het eerst is besproken en in `HUISSTIJL.md` is vastgelegd.
- Bij ontwerpkeuzes: toon drie echt verschillende visuele opties, op laptop en waar
  nuttig op mobiel.

## Techniek

- Werkmap: `/Users/neeltje/Claude/studio-neeltje-website`. De oude ChatGPT-map in
  `Documents/Codex/portfolio-seo` is alleen een reservekopie; daar niet in werken.
- Node en pnpm staan in `~/.local/node/bin`. Zet dat zo nodig vooraan in `PATH`.
- Bouwen: `pnpm build`; tests: `node --test tests/*.mjs`.
- Kleuren en lettertypes alleen via de tokens uit `HUISSTIJL.md`, geen losse hexcodes.
- Originelen in `media/originals` nooit overschrijven of handmatig bewerken.
- Geen tokens, wachtwoorden of sleutels in bestanden, commits of het gesprek.
  Geheimen horen in GitHub Secrets of als servervariabele bij mijn.host.
- Wees eerlijk over wat lokaal, op GitHub, op de testsite of nog onbekend is.
