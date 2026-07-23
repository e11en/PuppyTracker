"""Developmental phases for the puppy, keyed by age in weeks — bilingual (nl/en).

CONTENT NOTE: phase focus areas, pee intervals and info-card text are based on
the owner's specification plus well-established puppy-development guidance
(socialization window, first fear period ~8-11 wk, the 5-minute exercise rule,
large-breed growth-plate caution). Review the wording before relying on it.

A phase is active when: week_start <= age_in_weeks < week_end.
"""

from __future__ import annotations

from typing import Any

from .content import _L, _t

PHASES: list[dict[str, Any]] = [
    {
        "key": "aankomst",
        "title": _L("Aankomst & socialisatie", "Arrival & socialization"),
        "week_start": 7,
        "week_end": 10,
        "pee_interval_hours": 3,
        "focus": [
            _L("Zindelijkheid", "House-training"),
            _L("Socialisatie (geluiden, plekken, dieren, objecten, mensen)",
               "Socialization (sounds, places, animals, objects, people)"),
            _L("Basis obedience: zit, hier", "Basic obedience: sit, come"),
            _L("Wennen aan bench en alleen-zijn", "Getting used to the crate and being alone"),
        ],
        "info_cards": [
            {
                "title": _L("Plaspauzes", "Potty breaks"),
                "icon": "mdi:water",
                "items": [
                    _L("Overdag elke ~3 uur uitlaten, plus na slapen, eten en spelen.",
                       "Out every ~3 hours during the day, plus after sleeping, eating and play."),
                    _L("'s Nachts 1-2 rondes; direct terug naar de bench, geen spel.",
                       "1-2 rounds at night; straight back to the crate, no play."),
                ],
            },
            {
                "title": _L("Angstperiode", "Fear period"),
                "icon": "mdi:alert-outline",
                "items": [
                    _L("Eerste angstperiode valt ~8-11 weken: nieuwe dingen positief en rustig opbouwen.",
                       "The first fear period is ~8-11 weeks: build up new things positively and calmly."),
                    _L("Nooit forceren. Een nare ervaring beklijft nu sterk.",
                       "Never force it. A bad experience sticks strongly now."),
                    _L("Met 1 enting: vermijd risicoplekken, draag of kies schone omgevingen.",
                       "With only 1 vaccination: avoid risky spots, carry or choose clean areas."),
                ],
            },
            {
                "title": _L("Slaap & rust", "Sleep & rest"),
                "icon": "mdi:sleep",
                "items": [
                    _L("Pup slaapt ~18-20 uur; bouw bewust rustmomenten in.",
                       "Pup sleeps ~18-20 hours; build in deliberate rest."),
                    _L("Overprikkeling voorkomen: korte sessies, veel slaap.",
                       "Prevent overstimulation: short sessions, lots of sleep."),
                ],
            },
        ],
    },
    {
        "key": "socialisatie",
        "title": _L("Socialisatie & basis", "Socialization & basics"),
        "week_start": 10,
        "week_end": 12,
        "pee_interval_hours": 4,
        "focus": [
            _L("Zindelijkheid", "House-training"),
            _L("Socialisatie blijven uitbreiden", "Keep expanding socialization"),
            _L("Basis obedience: zit, blijf, vrij, hier, naast",
               "Basic obedience: sit, stay, free, come, heel"),
        ],
        "info_cards": [
            {
                "title": _L("Plaspauzes", "Potty breaks"),
                "icon": "mdi:water",
                "items": [
                    _L("Overdag richting elke ~4 uur; nog steeds na slapen/eten/spelen.",
                       "Toward every ~4 hours during the day; still after sleep/food/play."),
                ],
            },
            {
                "title": _L("Beweging", "Exercise"),
                "icon": "mdi:walk",
                "items": [
                    _L("5-minutenregel: leeftijd in maanden x 5 min, aan de ondergrens.",
                       "5-minute rule: age in months x 5 min, at the low end."),
                    _L("Geen springen, trap alleen aangelijnd/rustig (groeischijven).",
                       "No jumping, stairs only on-leash/calm (growth plates)."),
                ],
            },
        ],
    },
    {
        "key": "uitbreiding",
        "title": _L("Groei & uitbreiding", "Growth & expansion"),
        "week_start": 12,
        "week_end": 16,
        "pee_interval_hours": 6,
        "focus": [
            _L("Obedience uitbreiden: plaats (ga naar je mand), los, weg",
               "Expand obedience: place (go to your bed), release, away"),
            _L("Doorgaande socialisatie (na 2e enting meer mogelijk)",
               "Ongoing socialization (more possible after the 2nd vaccination)"),
            _L("Zelfbeheersing en impulscontrole", "Self-control and impulse control"),
        ],
        "info_cards": [
            {
                "title": _L("Plaspauzes", "Potty breaks"),
                "icon": "mdi:water",
                "items": [
                    _L("Overdag richting elke ~6 uur; blaascontrole neemt toe.",
                       "Toward every ~6 hours during the day; bladder control improves."),
                ],
            },
            {
                "title": _L("Voeding", "Feeding"),
                "icon": "mdi:bowl-mix",
                "items": [
                    _L("Afbouw van 4 naar 3 maaltijden wanneer de pup dat aankan.",
                       "Taper from 4 to 3 meals when the pup can handle it."),
                ],
            },
            {
                "title": _L("Vacht", "Coat"),
                "icon": "mdi:content-cut",
                "items": [
                    _L("Dagelijks kort borstelen als vast, positief momentje.",
                       "A short daily brush as a fixed, positive moment."),
                ],
            },
        ],
    },
    {
        "key": "jeugd",
        "title": _L("Jonge hond", "Young dog"),
        "week_start": 16,
        "week_end": 27,
        "pee_interval_hours": 8,
        "focus": [
            _L("Commando's bestendigen in meer afleiding",
               "Reinforce commands with more distraction"),
            _L("Rustige opbouw beweging (blijf onder de 5-minutenregel)",
               "Calm exercise build-up (stay under the 5-minute rule)"),
            _L("Groeischijven dicht rond 15-18 maanden: geen zware belasting",
               "Growth plates close around 15-18 months: no heavy loading"),
        ],
        "info_cards": [
            {
                "title": _L("Beweging (Berner)", "Exercise (Bernese)"),
                "icon": "mdi:dog-side",
                "items": [
                    _L("Grote/zware rassen: voorzichtig met duur en impact.",
                       "Large/heavy breeds: careful with duration and impact."),
                    _L("HD/ED-preventie: geen springen, geen wilde trap, glad-vloer beperken.",
                       "HD/ED prevention: no jumping, no wild stairs, limit slippery floors."),
                ],
            },
        ],
    },
]

FEAR_PERIOD_WEEKS = (8, 11)


def phases_seed(lang: str) -> list[dict[str, Any]]:
    """Phase defaults resolved to a single language, for seeding the DB."""
    out: list[dict[str, Any]] = []
    for p in PHASES:
        out.append({
            "key": p["key"],
            "title": _t(p["title"], lang),
            "week_start": p["week_start"],
            "week_end": p["week_end"],
            "pee_interval_hours": p["pee_interval_hours"],
            "focus": [_t(f, lang) for f in p["focus"]],
            "info_cards": [
                {"title": _t(c["title"], lang), "icon": c["icon"],
                 "items": [_t(i, lang) for i in c["items"]]}
                for c in p["info_cards"]
            ],
        })
    return out


def phase_for_age_weeks(
    weeks: int | None, phases: list[dict[str, Any]] | None = None
) -> dict[str, Any] | None:
    """Return the active phase for an age in weeks, or None if unknown.

    Pass the DB-backed list (resolved strings) for lookups; the code-constant
    fallback is only used before the DB is seeded and is read for week ranges.
    """
    if weeks is None:
        return None
    plist = phases if phases is not None else PHASES
    if not plist:
        return None
    ordered = sorted(plist, key=lambda p: p["week_start"])
    for phase in ordered:
        if phase["week_start"] <= weeks < phase["week_end"]:
            return phase
    if weeks >= ordered[-1]["week_end"]:
        return ordered[-1]
    return None
