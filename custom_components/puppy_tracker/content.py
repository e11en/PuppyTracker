"""Static content: category colors, the 24h schedule template and the
socialization program template — bilingual (nl/en).

CONTENT NOTE: this is a proposed template based on the owner's specification
(paarden 3x, schapen 2x, herders van de ouders 3x, bouwmarkt 2x, puppycursus 2x,
6 rustdagen) plus general socialization guidance. It is editable in the UI once
seeded as a protocol, so treat the day-by-day ordering as a starting point.
English is provided so a fresh install can seed defaults in either language.
"""

from __future__ import annotations

from typing import Any


def _L(nl: str, en: str) -> dict[str, str]:
    return {"nl": nl, "en": en}


def _t(value: Any, lang: str) -> Any:
    """Resolve a bilingual dict to the given language (fallback nl)."""
    if isinstance(value, dict) and "nl" in value and "en" in value:
        return value.get(lang) or value["nl"]
    return value


# ---------------------------------------------------------------------------
# Categories (socialization) and schedule item types
# ---------------------------------------------------------------------------

_SOCIALIZATION_CATEGORIES: dict[str, dict[str, Any]] = {
    "dieren": {"label": _L("Dieren", "Animals"), "color": "#c8863b", "icon": "mdi:paw"},
    "mensen": {"label": _L("Mensen", "People"), "color": "#3b82c8", "icon": "mdi:account-group"},
    "omgeving": {"label": _L("Omgeving", "Environment"), "color": "#4c9a5a", "icon": "mdi:home-city"},
    "hanteren": {"label": _L("Hanteren", "Handling"), "color": "#a05ac0", "icon": "mdi:hand-back-right"},
}

_SCHEDULE_TYPES: dict[str, dict[str, Any]] = {
    "plassen": {"label": _L("Plassen", "Potty"), "color": "#e0b23b", "icon": "mdi:water"},
    "eten": {"label": _L("Eten", "Food"), "color": "#4c9a5a", "icon": "mdi:bowl-mix"},
    "rust": {"label": _L("Rust", "Rest"), "color": "#6b7280", "icon": "mdi:sleep"},
    "beweging": {"label": _L("Beweging", "Exercise"), "color": "#3b82c8", "icon": "mdi:walk"},
    "verzorging": {"label": _L("Verzorging", "Grooming"), "color": "#a05ac0", "icon": "mdi:content-cut"},
}


def categories(lang: str) -> dict[str, dict[str, str]]:
    return {
        k: {"label": _t(v["label"], lang), "color": v["color"], "icon": v["icon"]}
        for k, v in _SOCIALIZATION_CATEGORIES.items()
    }


def schedule_types(lang: str) -> dict[str, dict[str, str]]:
    return {
        k: {"label": _t(v["label"], lang), "color": v["color"], "icon": v["icon"]}
        for k, v in _SCHEDULE_TYPES.items()
    }


NIGHT_START = "22:00"
NIGHT_END = "06:00"

# ---------------------------------------------------------------------------
# 24-hour schedule template (07:00 -> 06:00). Phase-1 rhythm (~3-hourly pees).
# ---------------------------------------------------------------------------

_DAILY_SCHEDULE: list[dict[str, Any]] = [
    {"time": "07:00", "type": "plassen", "label": _L("Ochtendplas", "Morning potty"),
     "note": _L("Direct uit de bench naar buiten. Beloon buiten plassen rustig.",
                "Straight from the crate to outside. Calmly reward going outside.")},
    {"time": "07:15", "type": "eten", "label": _L("Ontbijt & training", "Breakfast & training"),
     "note": _L("Maaltijd 1. Gebruik het voer voor een korte trainingssessie.",
                "Meal 1. Use the food for a short training session.")},
    {"time": "07:45", "type": "plassen", "label": _L("Plas na eten", "Potty after eating"),
     "note": _L("Kort na de maaltijd nog even naar buiten.", "Head outside shortly after the meal.")},
    {"time": "08:00", "type": "beweging", "label": _L("Kort rondje / spel", "Short walk / play"),
     "note": _L("5-minutenregel: leeftijd in mnd x 5 min, aan de ondergrens.",
                "5-minute rule: age in months x 5 min, at the low end.")},
    {"time": "08:30", "type": "rust", "label": _L("Rust", "Rest"),
     "note": _L("Rust is leren. Laat de pup ongestoord slapen.",
                "Rest is learning. Let the pup sleep undisturbed.")},
    {"time": "10:00", "type": "plassen", "label": _L("Plaspauze", "Potty break"),
     "note": _L("Na het slaapje meteen naar buiten.", "Straight outside after the nap.")},
    {"time": "10:30", "type": "verzorging", "label": _L("Borstelen", "Brushing"),
     "note": _L("Dagelijks kort borstelen als vast, positief momentje.",
                "A short daily brush as a fixed, positive moment.")},
    {"time": "12:00", "type": "eten", "label": _L("Lunch & training", "Lunch & training"),
     "note": _L("Maaltijd 2. Gebruik het voer voor een korte trainingssessie.",
                "Meal 2. Use the food for a short training session.")},
    {"time": "12:30", "type": "plassen", "label": _L("Plas na eten", "Potty after eating"),
     "note": _L("", "")},
    {"time": "13:00", "type": "rust", "label": _L("Rust", "Rest"),
     "note": _L("", "")},
    {"time": "15:00", "type": "plassen", "label": _L("Plaspauze", "Potty break"),
     "note": _L("", "")},
    {"time": "15:30", "type": "beweging", "label": _L("Socialisatie-uitje", "Socialization outing"),
     "note": _L("Zie het socialisatieprogramma voor de activiteit van vandaag.",
                "See the socialization program for today's activity.")},
    {"time": "17:00", "type": "eten", "label": _L("Avondeten & training", "Dinner & training"),
     "note": _L("Maaltijd 3. Gebruik het voer voor een korte trainingssessie.",
                "Meal 3. Use the food for a short training session.")},
    {"time": "17:30", "type": "plassen", "label": _L("Plas na eten", "Potty after eating"),
     "note": _L("", "")},
    {"time": "19:00", "type": "rust", "label": _L("Rust", "Rest"),
     "note": _L("Rustig samen, geen wilde spelletjes meer.", "Quiet together, no more wild play.")},
    {"time": "21:00", "type": "eten", "label": _L("Kleine laatste hap", "Small last meal"),
     "note": _L("Optioneel maaltijd 4; bouw af naar 3 als de pup dat aankan.",
                "Optional meal 4; taper to 3 when the pup can handle it.")},
    {"time": "21:45", "type": "plassen", "label": _L("Laatste plas", "Last potty"),
     "note": _L("Laatste ronde voor de nacht.", "Last round before the night.")},
    {"time": "22:00", "type": "rust", "label": _L("Nacht: bench", "Night: crate"),
     "note": _L("Bench naast bed; geen licht, geen spel, geen praten.",
                "Crate next to the bed; no light, no play, no talking.")},
    {"time": "01:30", "type": "plassen", "label": _L("Nachtronde 1", "Night round 1"),
     "note": _L("Alleen uitlaten en terug. Geen licht, geen spel, geen praten.",
                "Only out and back. No light, no play, no talking.")},
    {"time": "04:30", "type": "plassen", "label": _L("Nachtronde 2", "Night round 2"),
     "note": _L("Schrap een ronde zodra de pup 's nachts droog blijft.",
                "Drop a round once the pup stays dry through the night.")},
]


def daily_schedule(lang: str) -> list[dict[str, Any]]:
    return [
        {"time": it["time"], "type": it["type"],
         "label": _t(it["label"], lang), "note": _t(it["note"], lang)}
        for it in _DAILY_SCHEDULE
    ]


# ---------------------------------------------------------------------------
# Socialization program: 35 days from homecoming (day 0 = homecoming).
# ---------------------------------------------------------------------------

def _s(day: int, category: str, nl: str, en: str, note_nl: str = "", note_en: str = "") -> dict[str, Any]:
    return {"day": day, "category": category, "activity": _L(nl, en), "note": _L(note_nl, note_en)}


_SOCIALIZATION_PROGRAM: list[dict[str, Any]] = [
    _s(0, "hanteren", "Wennen aan bench", "Getting used to the crate",
       "Bench als fijne rustplek: voer of kong erin, deur open. Nooit als straf gebruiken.",
       "Make the crate a nice resting spot: food or a Kong inside, door open. Never use it as punishment."),
    _s(1, "omgeving", "Huis verkennen: geluiden binnen", "Explore the house: indoor sounds",
       "Stofzuiger van afstand aan, beloon rustig gedrag.", "Vacuum on from a distance, reward calm behavior."),
    _s(2, "hanteren", "Pootjes, oren en bek kort aanraken", "Briefly touch paws, ears and mouth",
       "Kort, positief, met een beloning. Stop voor de pup het spannend vindt.",
       "Short, positive, with a reward. Stop before the pup finds it stressful."),
    _s(3, "mensen", "1-2 rustige bezoekers thuis", "1-2 calm visitors at home",
       "Laat de pup zelf benaderen; niet overladen.", "Let the pup approach on its own; don't overwhelm."),
    _s(4, "omgeving", "Auto: kort stukje meerijden", "Car: a short ride along",
       "Eerst stilstaand wennen, dan een kort ritje.", "Get used to it parked first, then a short ride."),
    _s(5, "hanteren", "Alleen-zijn oefenen (korte momenten)", "Practice being alone (short moments)",
       "Even uit het zicht; bouw op van seconden naar minuten.", "Step out of sight briefly; build from seconds to minutes."),
    _s(6, "dieren", "Paarden op afstand bekijken (1/3)", "Watch horses from a distance (1/3)",
       "Grote afstand, rustig kijken. Stoppen bij spanning.", "Large distance, calm watching. Stop if tense."),
    _s(7, "mensen", "Wandelaars/fietsers van afstand", "Walkers/cyclists from a distance",
       "Op een bankje kijken naar voorbijgangers.", "Watch passers-by from a bench."),
    _s(8, "omgeving", "Verschillende ondergronden", "Different surfaces",
       "Gras, grind, tegels, metalen rooster: laat zelf kiezen.", "Grass, gravel, tiles, metal grate: let the pup choose."),
    _s(9, "hanteren", "Wennen aan halsband/tuigje", "Getting used to collar/harness",
       "Kort omdoen, afleiden met spel, weer af.", "Put on briefly, distract with play, take off again."),
    _s(10, "dieren", "Andere dieren op afstand (1/2)", "Other animals from a distance (1/2)",
       "Ruime afstand; rustig kijken en belonen.", "Keep a good distance; watch calmly and reward."),
    _s(11, "mensen", "Mensen met bril/baard/hoed", "People with glasses/beard/hat",
       "Verschillende types mensen positief associeren.", "Positively associate different-looking people."),
    _s(12, "dieren", "Paarden dichterbij (2/3)", "Horses closer (2/3)",
       "Iets kortere afstand dan de vorige keer, als het rustig ging.",
       "A bit closer than last time, if it went calmly."),
    _s(13, "mensen", "Kinderen op afstand horen/zien", "See/hear children from a distance",
       "Speelplaats van afstand; nooit door kinderen laten bestormen.",
       "Playground from a distance; never let children swarm the pup."),
    _s(14, "omgeving", "Bouwmarkt bezoek (1/2)", "Hardware store visit (1/2)",
       "Draag de pup naar binnen (1 enting): karren, geluiden, mensen.",
       "Carry the pup inside (only 1 vaccination): carts, sounds, people."),
    _s(15, "hanteren", "Nagels bekijken + voetbadje simuleren", "Inspect nails + mock foot bath",
       "Aanraken en belonen; nog niet per se knippen.", "Touch and reward; not necessarily clipping yet."),
    _s(16, "dieren", "Andere honden (1/3)", "Other dogs (1/3)",
       "Rustige, gevaccineerde honden. Korte, positieve kennismaking.",
       "Calm, vaccinated dogs. Short, positive introduction."),
    _s(17, "omgeving", "Water: plas of beek bekijken", "Water: look at a puddle or stream",
       "Van afstand; laat zelf kiezen of hij dichterbij komt.", "From a distance; let the pup choose to come closer."),
    _s(18, "omgeving", "Dorp/straat: verkeer van afstand", "Village/street: traffic from a distance",
       "Kort, op afstand van drukke weg. Beloon rust.", "Short, away from a busy road. Reward calm."),
    _s(19, "dieren", "Andere dieren dichterbij (2/2)", "Other animals closer (2/2)",
       "Kortere afstand als het eerder goed ging.", "Shorter distance if it went well before."),
    _s(20, "mensen", "Mensen met hoed/paraplu/rollator", "People with hat/umbrella/walker",
       "Vreemde silhouetten positief associeren.", "Positively associate unusual silhouettes."),
    _s(21, "dieren", "Andere honden (2/3)", "Other dogs (2/3)",
       "Iets langere, rustige interactie.", "A slightly longer, calm interaction."),
    _s(22, "dieren", "Kippen of konijnen van afstand", "Chickens or rabbits from a distance",
       "Ander klein vee rustig bekijken.", "Calmly watch other small livestock."),
    _s(23, "omgeving", "Bouwmarkt bezoek (2/2)", "Hardware store visit (2/2)",
       "Herhaling; kijk of de pup rustiger is dan de eerste keer.",
       "Repeat; see whether the pup is calmer than the first time."),
    _s(24, "hanteren", "Dierenarts-handling oefenen", "Practice vet handling",
       "Op tafel tillen, vasthouden, belonen (mock-checkup).", "Lift onto a table, hold, reward (mock checkup)."),
    _s(25, "dieren", "Paarden dichtbij (3/3)", "Horses up close (3/3)",
       "Als het rustig blijft; anders afstand houden.", "If it stays calm; otherwise keep distance."),
    _s(26, "mensen", "Drukkere plek van afstand (terras)", "Busier place from a distance (terrace)",
       "Kijken naar reuring vanaf een rustige plek.", "Watch the bustle from a calm spot."),
    _s(27, "hanteren", "Verzorging: borstel + oren", "Grooming: brush + ears",
       "Kort, positief, met beloning.", "Short, positive, with a reward."),
    _s(28, "mensen", "Puppycursus: proefles/kennismaking (1/2)", "Puppy class: trial/intro (1/2)",
       "Na 2e enting doorgaans mogelijk; check met de school.",
       "Usually possible after the 2nd vaccination; check with the school."),
    _s(29, "dieren", "Andere honden (3/3)", "Other dogs (3/3)",
       "Ontspannen samen zijn/kort spelen.", "Relaxed time together / short play."),
    _s(30, "omgeving", "Wandeling in het bos", "Walk in the woods",
       "Nieuwe geuren, geluiden; kort en rustig.", "New smells, sounds; short and calm."),
    _s(31, "hanteren", "Volledige verzorgingsronde", "Full grooming round",
       "Borstelen, oren, pootjes, tanden bekijken.", "Brush, check ears, paws, teeth."),
    _s(32, "mensen", "Puppycursus (2/2)", "Puppy class (2/2)",
       "Tweede sessie; oefenen tussen andere pups.", "Second session; practicing among other pups."),
    _s(33, "mensen", "Mensen in uniform / hi-vis", "People in uniform / hi-vis",
       "Postbode, bezorger: positief associeren.", "Postman, courier: positively associate."),
    _s(34, "omgeving", "Terugblik + nieuwe uitdaging naar keuze", "Recap + a new challenge of your choice",
       "Wat ging goed? Kies bewust 1 nieuwe, veilige prikkel.",
       "What went well? Deliberately pick 1 new, safe stimulus."),
]


def socialization_program(lang: str) -> list[dict[str, Any]]:
    return [
        {"day": it["day"], "category": it["category"],
         "activity": _t(it["activity"], lang), "note": _t(it["note"], lang)}
        for it in _SOCIALIZATION_PROGRAM
    ]
