"""Seed default protocols (socialization program, bench-moving) into the DB.

Idempotent: keyed on protocols.seed_key. On every run it (re)anchors the
start_date of anchored protocols to the current puppy dates, but never touches
day_offsets (so a user's cascade-defer edits survive re-anchoring).
"""

from __future__ import annotations

import logging

import aiosqlite

from . import content
from .const import ANCHOR_HOMECOMING, CHECK_MILESTONE
from .db import queries
from .logic import resolve_anchor_date

_LOGGER = logging.getLogger(__name__)

SEED_SOCIALIZATION = "socialization"
SEED_BENCH = "bench"

# Bench-moving protocol: one step per night, each +1 day, deferrable with cascade.
BENCH_STEPS = [
    "Bench naast bed (nacht 1)",
    "Bench naast bed (nacht 2)",
    "Bench iets verder van bed",
    "Bench verder richting deur",
    "Bench bij de slaapkamerdeur",
    "Bench net buiten de slaapkamer",
    "Bench op de gang",
    "Bench naar de gewenste vaste plek",
]


async def async_seed_defaults(conn: aiosqlite.Connection) -> None:
    """Create seeded protocols if missing and re-anchor their start dates."""
    puppy = await queries.get_puppy(conn)
    birth = puppy.get("birth_date") if puppy else None
    home = puppy.get("homecoming_date") if puppy else None
    home_date = resolve_anchor_date(ANCHOR_HOMECOMING, birth, home)

    await _seed_socialization(conn, home_date)
    await _seed_bench(conn, home_date)


async def _seed_socialization(conn: aiosqlite.Connection, home_date: str | None) -> None:
    existing = await queries.get_protocol_by_seed(conn, SEED_SOCIALIZATION)
    if existing is None:
        pid = await queries.add_protocol(
            conn,
            name="Socialisatieprogramma (7-12 weken)",
            category="socialisatie",
            anchor=ANCHOR_HOMECOMING,
            start_date=home_date,
            notes="35 dagen vanaf thuiskomst. Mijlpalen blijven staan.",
            seed_key=SEED_SOCIALIZATION,
        )
        for i, item in enumerate(content.SOCIALIZATION_PROGRAM):
            await queries.add_step(
                conn,
                protocol_id=pid,
                seq=i,
                day_offset=item["day"],
                title=item["activity"],
                category=item["category"],
                notes=item["note"],
                check_mode=CHECK_MILESTONE,
            )
        _LOGGER.info("Seeded socialization program (%d steps)", len(content.SOCIALIZATION_PROGRAM))
    else:
        await queries.update_protocol(conn, existing["id"], start_date=home_date)


async def _seed_bench(conn: aiosqlite.Connection, home_date: str | None) -> None:
    existing = await queries.get_protocol_by_seed(conn, SEED_BENCH)
    if existing is None:
        pid = await queries.add_protocol(
            conn,
            name="Bench verplaatsen",
            category="nacht",
            anchor=ANCHOR_HOMECOMING,
            start_date=home_date,
            notes="Elke nacht iets verder van bed. Uitstellen schuift de rest mee.",
            seed_key=SEED_BENCH,
        )
        for i, title in enumerate(BENCH_STEPS):
            await queries.add_step(
                conn,
                protocol_id=pid,
                seq=i,
                day_offset=i,
                title=title,
                category="nacht",
                notes="Geen licht, geen spel, geen praten." if i == 0 else "",
                check_mode=CHECK_MILESTONE,
            )
        _LOGGER.info("Seeded bench protocol (%d steps)", len(BENCH_STEPS))
    else:
        await queries.update_protocol(conn, existing["id"], start_date=home_date)
