"""Unit tests for the cascade-defer logic and effective-date resolution.

Run: python -m pytest tests/ -q   (needs aiosqlite, pytest, pytest-asyncio)
"""

import asyncio
from pathlib import Path

import aiosqlite
import pytest

# Import the query module directly from the integration package.
import importlib.util

QUERIES_PATH = (
    Path(__file__).parent.parent
    / "custom_components"
    / "puppy_tracker"
    / "db"
    / "queries.py"
)
MIGRATIONS_PATH = QUERIES_PATH.parent / "migrations.py"


def _load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


migrations = _load("pt_migrations", MIGRATIONS_PATH)
queries = _load("pt_queries", QUERIES_PATH)


async def _fresh_db():
    conn = await aiosqlite.connect(":memory:")
    conn.row_factory = aiosqlite.Row
    await conn.execute("PRAGMA foreign_keys=ON")
    for _version, sql in migrations.MIGRATIONS:
        await conn.executescript(sql)
    return conn


def test_cascade_defer_shifts_this_and_later_steps():
    async def run():
        conn = await _fresh_db()
        pid = await queries.add_protocol(
            conn, name="Bench", anchor="fixed", start_date="2026-07-26"
        )
        # 5 daily steps at offsets 0..4
        step_ids = []
        for i in range(5):
            step_ids.append(
                await queries.add_step(conn, pid, seq=i, day_offset=i, title=f"nacht {i}")
            )

        # Another protocol that must stay untouched.
        other = await queries.add_protocol(
            conn, name="Other", anchor="fixed", start_date="2026-07-26"
        )
        await queries.add_step(conn, other, seq=0, day_offset=0, title="x")

        # Defer step index 2 (seq 2) by +2 days.
        await queries.defer_step(conn, step_ids[2], 2)

        steps = await queries.get_steps(conn, pid)
        offsets = [s["day_offset"] for s in steps]
        assert offsets == [0, 1, 4, 5, 6], offsets

        # Effective dates resolved from start_date + offset.
        eff = {s["day_offset"]: s["effective_date"] for s in steps}
        assert eff[0] == "2026-07-26"
        assert eff[4] == "2026-07-30"

        # Other protocol untouched.
        other_steps = await queries.get_steps(conn, other)
        assert other_steps[0]["day_offset"] == 0

        await conn.close()

    asyncio.run(run())


def test_negative_defer_pulls_forward():
    async def run():
        conn = await _fresh_db()
        pid = await queries.add_protocol(
            conn, name="P", anchor="fixed", start_date="2026-07-26"
        )
        ids = [
            await queries.add_step(conn, pid, seq=i, day_offset=i * 2, title=str(i))
            for i in range(3)
        ]
        await queries.defer_step(conn, ids[1], -1)
        steps = await queries.get_steps(conn, pid)
        assert [s["day_offset"] for s in steps] == [0, 1, 3]
        await conn.close()

    asyncio.run(run())


if __name__ == "__main__":
    import sys

    sys.exit(pytest.main([__file__, "-q"]))
