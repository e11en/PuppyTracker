"""Static content: category colors, the 24h schedule template and the
socialization program template.

CONTENT NOTE: this is a proposed template based on the owner's specification
(paarden 3x, schapen 2x, herders van de ouders 3x, bouwmarkt 2x, puppycursus 2x,
6 rustdagen) plus general socialization guidance. It is editable in the UI once
seeded as a protocol, so treat the day-by-day ordering as a starting point.
"""

from __future__ import annotations

from typing import Any

# ---------------------------------------------------------------------------
# Categories (used by socialization program and schedule item types)
# ---------------------------------------------------------------------------

SOCIALIZATION_CATEGORIES: dict[str, dict[str, str]] = {
    "dieren": {"label": "Dieren", "color": "#c8863b", "icon": "mdi:paw"},
    "mensen": {"label": "Mensen", "color": "#3b82c8", "icon": "mdi:account-group"},
    "omgeving": {"label": "Omgeving", "color": "#4c9a5a", "icon": "mdi:home-city"},
    "hanteren": {"label": "Hanteren", "color": "#a05ac0", "icon": "mdi:hand-back-right"},
    "rust": {"label": "Rust", "color": "#8a8f98", "icon": "mdi:sleep"},
}

SCHEDULE_TYPES: dict[str, dict[str, str]] = {
    "plassen": {"label": "Plassen", "color": "#e0b23b", "icon": "mdi:water"},
    "eten": {"label": "Eten", "color": "#4c9a5a", "icon": "mdi:bowl-mix"},
    "rust": {"label": "Rust", "color": "#6b7280", "icon": "mdi:sleep"},
    "beweging": {"label": "Beweging", "color": "#3b82c8", "icon": "mdi:walk"},
    "verzorging": {"label": "Verzorging", "color": "#a05ac0", "icon": "mdi:content-cut"},
}

# ---------------------------------------------------------------------------
# 24-hour schedule template (07:00 -> 06:00). Night = 22:00-06:00 (rendered dark).
# Represents the phase-1 rhythm (~3-hourly pees); scales looser as the pup grows.
# ---------------------------------------------------------------------------

DAILY_SCHEDULE: list[dict[str, Any]] = [
    {"key": "d0700_plas", "time": "07:00", "type": "plassen", "label": "Ochtendplas",
     "note": "Direct uit de bench naar buiten. Beloon buiten plassen rustig."},
    {"key": "d0715_eten", "time": "07:15", "type": "eten", "label": "Ontbijt",
     "note": "Maaltijd 1 van de dag."},
    {"key": "d0745_plas", "time": "07:45", "type": "plassen", "label": "Plas na eten",
     "note": "Kort na de maaltijd nog even naar buiten."},
    {"key": "d0800_beweging", "time": "08:00", "type": "beweging", "label": "Kort rondje / spel",
     "note": "5-minutenregel: leeftijd in mnd x 5 min, aan de ondergrens."},
    {"key": "d0830_rust", "time": "08:30", "type": "rust", "label": "Slaapje",
     "note": "Rust is leren. Laat de pup ongestoord slapen."},
    {"key": "d1000_plas", "time": "10:00", "type": "plassen", "label": "Plaspauze",
     "note": "Na het slaapje meteen naar buiten."},
    {"key": "d1030_verzorging", "time": "10:30", "type": "verzorging", "label": "Borstelen",
     "note": "Dagelijks kort borstelen als vast, positief momentje."},
    {"key": "d1200_eten", "time": "12:00", "type": "eten", "label": "Lunch",
     "note": "Maaltijd 2 van de dag."},
    {"key": "d1230_plas", "time": "12:30", "type": "plassen", "label": "Plas na eten",
     "note": ""},
    {"key": "d1300_rust", "time": "13:00", "type": "rust", "label": "Middagslaap",
     "note": ""},
    {"key": "d1500_plas", "time": "15:00", "type": "plassen", "label": "Plaspauze",
     "note": ""},
    {"key": "d1530_beweging", "time": "15:30", "type": "beweging", "label": "Socialisatie-uitje",
     "note": "Zie het socialisatieprogramma voor de activiteit van vandaag."},
    {"key": "d1700_eten", "time": "17:00", "type": "eten", "label": "Avondeten",
     "note": "Maaltijd 3 van de dag."},
    {"key": "d1730_plas", "time": "17:30", "type": "plassen", "label": "Plas na eten",
     "note": ""},
    {"key": "d1900_rust", "time": "19:00", "type": "rust", "label": "Avondrust",
     "note": "Rustig samen, geen wilde spelletjes meer."},
    {"key": "d2100_eten", "time": "21:00", "type": "eten", "label": "Kleine laatste hap",
     "note": "Optioneel maaltijd 4; bouw af naar 3 als de pup dat aankan."},
    {"key": "d2145_plas", "time": "21:45", "type": "plassen", "label": "Laatste plas",
     "note": "Laatste ronde voor de nacht."},
    {"key": "d2200_rust", "time": "22:00", "type": "rust", "label": "Nacht: bench",
     "note": "Bench naast bed; geen licht, geen spel, geen praten."},
    {"key": "d0130_plas", "time": "01:30", "type": "plassen", "label": "Nachtronde 1",
     "note": "Alleen uitlaten en terug. Geen licht, geen spel, geen praten."},
    {"key": "d0430_plas", "time": "04:30", "type": "plassen", "label": "Nachtronde 2",
     "note": "Schrap een ronde zodra de pup 's nachts droog blijft."},
]

NIGHT_START = "22:00"
NIGHT_END = "06:00"

# ---------------------------------------------------------------------------
# Socialization program: 35 days from homecoming (day 0 = homecoming).
# One activity per day; 6 rest days; phased build for the milestone exposures.
# Rendered as a milestone protocol (permanent checkmarks).
# ---------------------------------------------------------------------------

def _s(day: int, category: str, activity: str, note: str = "", rest: bool = False) -> dict[str, Any]:
    return {"day": day, "category": category, "activity": activity, "note": note, "rest": rest}


SOCIALIZATION_PROGRAM: list[dict[str, Any]] = [
    _s(0, "rust", "Thuiskomst: rustig laten wennen", "Alleen huis en tuin. Geen bezoek, veel rust.", rest=True),
    _s(1, "omgeving", "Huis verkennen: geluiden binnen", "Stofzuiger van afstand aan, beloon rustig gedrag."),
    _s(2, "hanteren", "Pootjes, oren en bek kort aanraken", "Kort, positief, met een beloning. Stop voor de pup het spannend vindt."),
    _s(3, "mensen", "1-2 rustige bezoekers thuis", "Laat de pup zelf benaderen; niet overladen."),
    _s(4, "omgeving", "Auto: kort stukje meerijden", "Eerst stilstaand wennen, dan een kort ritje."),
    _s(5, "rust", "Rustdag", "Verwerken. Alleen bekende routines.", rest=True),
    _s(6, "dieren", "Paarden op afstand bekijken (1/3)", "Grote afstand, rustig kijken. Stoppen bij spanning."),
    _s(7, "mensen", "Wandelaars/fietsers van afstand", "Op een bankje kijken naar voorbijgangers."),
    _s(8, "omgeving", "Verschillende ondergronden", "Gras, grind, tegels, metalen rooster: laat zelf kiezen."),
    _s(9, "hanteren", "Wennen aan halsband/tuigje", "Kort omdoen, afleiden met spel, weer af."),
    _s(10, "dieren", "Schapen op afstand (1/2)", "Ruime afstand van het hek; rustig kijken en belonen."),
    _s(11, "rust", "Rustdag", "", rest=True),
    _s(12, "dieren", "Paarden dichterbij (2/3)", "Iets kortere afstand dan de vorige keer, als het rustig ging."),
    _s(13, "mensen", "Kinderen op afstand horen/zien", "Speelplaats van afstand; nooit door kinderen laten bestormen."),
    _s(14, "omgeving", "Bouwmarkt bezoek (1/2)", "Draag de pup naar binnen (1 enting): karren, geluiden, mensen."),
    _s(15, "hanteren", "Nagels bekijken + voetbadje simuleren", "Aanraken en belonen; nog niet per se knippen."),
    _s(16, "dieren", "Herders van opa en oma (1/3)", "Rustige, gevaccineerde honden. Korte, positieve kennismaking."),
    _s(17, "rust", "Rustdag", "", rest=True),
    _s(18, "omgeving", "Dorp/straat: verkeer van afstand", "Kort, op afstand van drukke weg. Beloon rust."),
    _s(19, "dieren", "Schapen dichterbij (2/2)", "Kortere afstand als het eerder goed ging."),
    _s(20, "mensen", "Mensen met hoed/paraplu/rollator", "Vreemde silhouetten positief associeren."),
    _s(21, "dieren", "Herders van opa en oma (2/3)", "Iets langere, rustige interactie."),
    _s(22, "rust", "Rustdag", "", rest=True),
    _s(23, "omgeving", "Bouwmarkt bezoek (2/2)", "Herhaling; kijk of de pup rustiger is dan de eerste keer."),
    _s(24, "hanteren", "Dierenarts-handling oefenen", "Op tafel tillen, vasthouden, belonen (mock-checkup)."),
    _s(25, "dieren", "Paarden dichtbij (3/3)", "Als het rustig blijft; anders afstand houden."),
    _s(26, "mensen", "Drukkere plek van afstand (terras)", "Kijken naar reuring vanaf een rustige plek."),
    _s(27, "rust", "Rustdag", "", rest=True),
    _s(28, "mensen", "Puppycursus: proefles/kennismaking (1/2)", "Na 2e enting doorgaans mogelijk; check met de school."),
    _s(29, "dieren", "Herders van opa en oma (3/3)", "Ontspannen samen zijn/kort spelen."),
    _s(30, "omgeving", "Wandeling in het bos", "Nieuwe geuren, geluiden; kort en rustig."),
    _s(31, "hanteren", "Volledige verzorgingsronde", "Borstelen, oren, pootjes, tanden bekijken."),
    _s(32, "mensen", "Puppycursus (2/2)", "Tweede sessie; oefenen tussen andere pups."),
    _s(33, "rust", "Rustdag", "", rest=True),
    _s(34, "omgeving", "Terugblik + nieuwe uitdaging naar keuze", "Wat ging goed? Kies bewust 1 nieuwe, veilige prikkel."),
]
