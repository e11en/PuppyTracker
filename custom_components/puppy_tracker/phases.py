"""Developmental phases for the puppy, keyed by age in weeks.

CONTENT NOTE: phase focus areas, pee intervals and info-card text are based on
the owner's specification plus well-established puppy-development guidance
(socialization window, first fear period ~8-11 wk, the 5-minute exercise rule,
large-breed growth-plate caution). Review the wording before relying on it.

A phase is active when: week_start <= age_in_weeks < week_end.
"""

from __future__ import annotations

from typing import Any

PHASES: list[dict[str, Any]] = [
    {
        "key": "aankomst",
        "title": "Aankomst & socialisatie",
        "week_start": 7,
        "week_end": 10,
        "pee_interval_hours": 3,
        "focus": [
            "Zindelijkheid",
            "Socialisatie (geluiden, plekken, dieren, objecten, mensen)",
            "Basis obedience: zit, hier",
            "Wennen aan bench en alleen-zijn",
        ],
        "info_cards": [
            {
                "title": "Plaspauzes",
                "icon": "mdi:water",
                "items": [
                    "Overdag elke ~3 uur uitlaten, plus na slapen, eten en spelen.",
                    "'s Nachts 1-2 rondes; direct terug naar de bench, geen spel.",
                ],
            },
            {
                "title": "Angstperiode",
                "icon": "mdi:alert-outline",
                "items": [
                    "Eerste angstperiode valt ~8-11 weken: nieuwe dingen positief en",
                    "rustig opbouwen, nooit forceren. Een nare ervaring beklijft nu sterk.",
                    "Met 1 enting: vermijd risicoplekken, draag of kies schone omgevingen.",
                ],
            },
            {
                "title": "Slaap & rust",
                "icon": "mdi:sleep",
                "items": [
                    "Pup slaapt ~18-20 uur; bouw bewust rustmomenten in.",
                    "Overprikkeling voorkomen: korte sessies, veel slaap.",
                ],
            },
        ],
    },
    {
        "key": "socialisatie",
        "title": "Socialisatie & basis",
        "week_start": 10,
        "week_end": 12,
        "pee_interval_hours": 4,
        "focus": [
            "Zindelijkheid",
            "Socialisatie blijven uitbreiden",
            "Basis obedience: zit, blijf, vrij, hier, naast",
        ],
        "info_cards": [
            {
                "title": "Plaspauzes",
                "icon": "mdi:water",
                "items": [
                    "Overdag richting elke ~4 uur; nog steeds na slapen/eten/spelen.",
                ],
            },
            {
                "title": "Beweging",
                "icon": "mdi:walk",
                "items": [
                    "5-minutenregel: leeftijd in maanden x 5 min, aan de ondergrens.",
                    "Geen springen, trap alleen aangelijnd/rustig (groeischijven).",
                ],
            },
        ],
    },
    {
        "key": "uitbreiding",
        "title": "Groei & uitbreiding",
        "week_start": 12,
        "week_end": 16,
        "pee_interval_hours": 6,
        "focus": [
            "Obedience uitbreiden: plaats (ga naar je mand), los, weg",
            "Doorgaande socialisatie (na 2e enting meer mogelijk)",
            "Zelfbeheersing en impulscontrole",
        ],
        "info_cards": [
            {
                "title": "Plaspauzes",
                "icon": "mdi:water",
                "items": [
                    "Overdag richting elke ~6 uur; blaascontrole neemt toe.",
                ],
            },
            {
                "title": "Voeding",
                "icon": "mdi:bowl-mix",
                "items": [
                    "Afbouw van 4 naar 3 maaltijden wanneer de pup dat aankan.",
                ],
            },
            {
                "title": "Vacht",
                "icon": "mdi:content-cut",
                "items": [
                    "Dagelijks kort borstelen als vast, positief momentje.",
                ],
            },
        ],
    },
    {
        "key": "jeugd",
        "title": "Jonge hond",
        "week_start": 16,
        "week_end": 27,
        "pee_interval_hours": 8,
        "focus": [
            "Commando's bestendigen in meer afleiding",
            "Rustige opbouw beweging (blijf onder de 5-minutenregel)",
            "Groeischijven dicht rond 15-18 maanden: geen zware belasting",
        ],
        "info_cards": [
            {
                "title": "Beweging (Berner)",
                "icon": "mdi:dog-side",
                "items": [
                    "Grote/zware rassen: voorzichtig met duur en impact.",
                    "HD/ED-preventie: geen springen, geen wilde trap, glad-vloer beperken.",
                ],
            },
        ],
    },
]

FEAR_PERIOD_WEEKS = (8, 11)


def phase_for_age_weeks(
    weeks: int | None, phases: list[dict[str, Any]] | None = None
) -> dict[str, Any] | None:
    """Return the active phase for an age in weeks, or None if unknown.

    `phases` defaults to the code constants; pass the DB-backed list to use
    the user's edited phase content.
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
    # Older than the last modelled phase: return the last phase.
    if weeks >= ordered[-1]["week_end"]:
        return ordered[-1]
    return None
