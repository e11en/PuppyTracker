"""Seed default content (phases, day schedule, socialization program, bench)
into the DB, language-aware.

Idempotent: keyed on existing rows / protocols.seed_key. On every run it
(re)anchors the start_date of anchored protocols to the current puppy dates,
but never touches day_offsets (so cascade-defer edits survive re-anchoring).

`async_reseed_defaults` wipes and recreates the seeded defaults in a chosen
language (used by the "reload defaults" action after switching language).
"""

from __future__ import annotations

import logging

import aiosqlite

from . import content
from .const import ANCHOR_HOMECOMING, CHECK_MILESTONE, DEFAULT_LANGUAGE
from .db import queries
from .logic import resolve_anchor_date
from .phases import phases_seed

_LOGGER = logging.getLogger(__name__)

SEED_SOCIALIZATION = "socialization"
SEED_BENCH = "bench"

# Bench-moving protocol: one step per night, each +1 day, deferrable with cascade.
_BENCH_STEPS = [
    ("Bench naast bed (nacht 1)", "Crate next to the bed (night 1)"),
    ("Bench naast bed (nacht 2)", "Crate next to the bed (night 2)"),
    ("Bench iets verder van bed", "Crate a bit further from the bed"),
    ("Bench verder richting deur", "Crate further toward the door"),
    ("Bench bij de slaapkamerdeur", "Crate by the bedroom door"),
    ("Bench net buiten de slaapkamer", "Crate just outside the bedroom"),
    ("Bench op de gang", "Crate in the hallway"),
    ("Bench naar de gewenste vaste plek", "Crate to its permanent spot"),
]


async def _language(conn: aiosqlite.Connection) -> str:
    return (await queries.get_app_state(conn, "language")) or DEFAULT_LANGUAGE


async def async_seed_defaults(conn: aiosqlite.Connection) -> None:
    """Create seeded content if missing and re-anchor protocol start dates."""
    lang = await _language(conn)
    puppy = await queries.get_puppy(conn)
    birth = puppy.get("birth_date") if puppy else None
    home = puppy.get("homecoming_date") if puppy else None
    home_date = resolve_anchor_date(ANCHOR_HOMECOMING, birth, home)

    await _seed_phases(conn, lang)
    await _seed_socialization(conn, lang, home_date)
    await _seed_bench(conn, lang, home_date)
    await _seed_schedules(conn, lang)


async def _seed_phases(conn: aiosqlite.Connection, lang: str) -> None:
    if await queries.phases_count(conn) > 0:
        return
    for i, phase in enumerate(phases_seed(lang)):
        await queries.add_phase(
            conn,
            key=phase["key"],
            seq=i,
            title=phase["title"],
            week_start=phase["week_start"],
            week_end=phase["week_end"],
            pee_interval_hours=phase["pee_interval_hours"],
            focus=phase["focus"],
            info_cards=phase["info_cards"],
        )
    _LOGGER.info("Seeded phases (%s)", lang)


async def _seed_socialization(conn: aiosqlite.Connection, lang: str, home_date: str | None) -> None:
    existing = await queries.get_protocol_by_seed(conn, SEED_SOCIALIZATION)
    if existing is None:
        name = "Socialisatieprogramma (7-12 weken)" if lang == "nl" else "Socialization program (7-12 weeks)"
        notes = ("35 dagen vanaf thuiskomst. Mijlpalen blijven staan."
                 if lang == "nl" else "35 days from homecoming. Milestones stay checked.")
        pid = await queries.add_protocol(
            conn, name=name, category="socialisatie", anchor=ANCHOR_HOMECOMING,
            start_date=home_date, notes=notes, seed_key=SEED_SOCIALIZATION,
        )
        for i, item in enumerate(content.socialization_program(lang)):
            await queries.add_step(
                conn, protocol_id=pid, seq=i, day_offset=item["day"],
                title=item["activity"], category=item["category"],
                notes=item["note"], check_mode=CHECK_MILESTONE,
            )
        _LOGGER.info("Seeded socialization program (%s)", lang)
    else:
        await queries.update_protocol(conn, existing["id"], start_date=home_date)


async def _seed_bench(conn: aiosqlite.Connection, lang: str, home_date: str | None) -> None:
    existing = await queries.get_protocol_by_seed(conn, SEED_BENCH)
    if existing is None:
        name = "Bench verplaatsen" if lang == "nl" else "Move the crate"
        notes = ("Elke 2 nachten iets verder van bed. Uitstellen schuift de rest mee."
                 if lang == "nl" else "A bit further from the bed every 2 nights. Deferring shifts the rest.")
        first_note = ("Geen licht, geen spel, geen praten." if lang == "nl" else "No light, no play, no talking.")
        pid = await queries.add_protocol(
            conn, name=name, category="nacht", anchor=ANCHOR_HOMECOMING,
            start_date=home_date, notes=notes, seed_key=SEED_BENCH,
        )
        for i, (nl, en) in enumerate(_BENCH_STEPS):
            await queries.add_step(
                conn, protocol_id=pid, seq=i, day_offset=i * 2,  # move every 2 days
                title=(nl if lang == "nl" else en), category="nacht",
                notes=first_note if i == 0 else "", check_mode=CHECK_MILESTONE,
            )
        _LOGGER.info("Seeded bench protocol (%s)", lang)
    else:
        await queries.update_protocol(conn, existing["id"], start_date=home_date)


async def _seed_schedules(conn: aiosqlite.Connection, lang: str) -> None:
    for phase in phases_seed(lang):
        key = phase["key"]
        if await queries.count_schedule_items(conn, key) > 0:
            continue
        for i, it in enumerate(content.daily_schedule(lang)):
            await queries.add_schedule_item(
                conn, phase_key=key, time=it["time"], type=it["type"],
                label=it["label"], notes=it.get("note", ""), seq=i,
            )
    _LOGGER.info("Seeded per-phase day schedules (%s)", lang)


async def async_reseed_defaults(conn: aiosqlite.Connection, lang: str) -> None:
    """Wipe the seeded defaults and recreate them in `lang`.

    Removes phases, schedule items and the seeded protocols (socialization,
    bench) with their steps. User-created protocols and one-off tasks are kept.
    """
    await queries.set_app_state(conn, "language", lang)
    await queries.clear_seeded_defaults(conn, [SEED_SOCIALIZATION, SEED_BENCH])
    await async_seed_defaults(conn)
    _LOGGER.info("Reseeded defaults in %s", lang)
