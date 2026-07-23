"""Database query functions for Puppy Tracker.

All functions take an aiosqlite connection and return plain dicts/lists so the
websocket layer can serialize them directly.
"""

from __future__ import annotations

from typing import Any

import aiosqlite


def _rows(cursor_rows: list[aiosqlite.Row]) -> list[dict[str, Any]]:
    return [dict(r) for r in cursor_rows]


# ---------------------------------------------------------------------------
# Puppy profile (single row)
# ---------------------------------------------------------------------------

async def get_puppy(conn: aiosqlite.Connection) -> dict[str, Any] | None:
    cur = await conn.execute("SELECT * FROM puppy ORDER BY id LIMIT 1")
    row = await cur.fetchone()
    return dict(row) if row else None


async def upsert_puppy(
    conn: aiosqlite.Connection,
    name: str,
    birth_date: str | None,
    homecoming_date: str | None,
    notes: str = "",
    photo_url: str | None = None,
) -> dict[str, Any]:
    """Insert or update the single puppy row. photo_url=None keeps the existing value."""
    existing = await get_puppy(conn)
    if existing:
        photo = existing.get("photo_url", "") if photo_url is None else photo_url
        await conn.execute(
            "UPDATE puppy SET name=?, birth_date=?, homecoming_date=?, notes=?, photo_url=? WHERE id=?",
            (name, birth_date, homecoming_date, notes, photo, existing["id"]),
        )
    else:
        await conn.execute(
            "INSERT INTO puppy (name, birth_date, homecoming_date, notes, photo_url) VALUES (?, ?, ?, ?, ?)",
            (name, birth_date, homecoming_date, notes, photo_url or ""),
        )
    await conn.commit()
    return await get_puppy(conn)  # type: ignore[return-value]


# ---------------------------------------------------------------------------
# App state (small key/value store)
# ---------------------------------------------------------------------------

async def get_app_state(conn: aiosqlite.Connection, key: str) -> str | None:
    cur = await conn.execute("SELECT value FROM app_state WHERE key=?", (key,))
    row = await cur.fetchone()
    return row["value"] if row else None


async def set_app_state(conn: aiosqlite.Connection, key: str, value: str) -> None:
    await conn.execute(
        "INSERT INTO app_state (key, value) VALUES (?, ?) "
        "ON CONFLICT(key) DO UPDATE SET value=excluded.value",
        (key, value),
    )
    await conn.commit()


# ---------------------------------------------------------------------------
# Protocols + steps
# ---------------------------------------------------------------------------

async def get_all_protocols(conn: aiosqlite.Connection) -> list[dict[str, Any]]:
    cur = await conn.execute("SELECT * FROM protocols ORDER BY created_at, id")
    return _rows(await cur.fetchall())


async def get_protocol(conn: aiosqlite.Connection, protocol_id: int) -> dict[str, Any] | None:
    cur = await conn.execute("SELECT * FROM protocols WHERE id=?", (protocol_id,))
    row = await cur.fetchone()
    return dict(row) if row else None


async def get_protocol_by_seed(conn: aiosqlite.Connection, seed_key: str) -> dict[str, Any] | None:
    cur = await conn.execute("SELECT * FROM protocols WHERE seed_key=?", (seed_key,))
    row = await cur.fetchone()
    return dict(row) if row else None


async def get_steps(conn: aiosqlite.Connection, protocol_id: int) -> list[dict[str, Any]]:
    """Return steps with the effective date resolved from protocol.start_date + day_offset."""
    cur = await conn.execute(
        """
        SELECT s.*,
               CASE WHEN p.start_date IS NOT NULL
                    THEN date(p.start_date, '+' || s.day_offset || ' days')
                    ELSE NULL END AS effective_date
        FROM protocol_steps s
        JOIN protocols p ON p.id = s.protocol_id
        WHERE s.protocol_id = ?
        ORDER BY s.seq, s.day_offset, s.id
        """,
        (protocol_id,),
    )
    return _rows(await cur.fetchall())


async def get_protocols_with_steps(conn: aiosqlite.Connection) -> list[dict[str, Any]]:
    protocols = await get_all_protocols(conn)
    for p in protocols:
        p["steps"] = await get_steps(conn, p["id"])
    return protocols


async def add_protocol(
    conn: aiosqlite.Connection,
    name: str,
    category: str = "algemeen",
    anchor: str = "fixed",
    start_date: str | None = None,
    notes: str = "",
    seed_key: str | None = None,
) -> int:
    cur = await conn.execute(
        """INSERT INTO protocols (name, category, anchor, start_date, notes, seed_key)
           VALUES (?, ?, ?, ?, ?, ?)""",
        (name, category, anchor, start_date, notes, seed_key),
    )
    await conn.commit()
    return cur.lastrowid


async def update_protocol(conn: aiosqlite.Connection, protocol_id: int, **fields: Any) -> None:
    allowed = {"name", "category", "anchor", "start_date", "status", "notes"}
    sets = {k: v for k, v in fields.items() if k in allowed}
    if not sets:
        return
    cols = ", ".join(f"{k}=?" for k in sets)
    await conn.execute(
        f"UPDATE protocols SET {cols} WHERE id=?", (*sets.values(), protocol_id)
    )
    await conn.commit()


async def remove_protocol(conn: aiosqlite.Connection, protocol_id: int) -> None:
    await conn.execute("DELETE FROM protocols WHERE id=?", (protocol_id,))
    await conn.commit()


async def add_step(
    conn: aiosqlite.Connection,
    protocol_id: int,
    seq: int,
    day_offset: int,
    title: str,
    category: str = "",
    notes: str = "",
    check_mode: str = "milestone",
) -> int:
    cur = await conn.execute(
        """INSERT INTO protocol_steps
           (protocol_id, seq, day_offset, title, category, notes, check_mode)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (protocol_id, seq, day_offset, title, category, notes, check_mode),
    )
    await conn.commit()
    return cur.lastrowid


async def update_step(conn: aiosqlite.Connection, step_id: int, **fields: Any) -> None:
    allowed = {"seq", "day_offset", "title", "category", "notes", "check_mode"}
    sets = {k: v for k, v in fields.items() if k in allowed}
    if not sets:
        return
    cols = ", ".join(f"{k}=?" for k in sets)
    await conn.execute(
        f"UPDATE protocol_steps SET {cols} WHERE id=?", (*sets.values(), step_id)
    )
    await conn.commit()


async def remove_step(conn: aiosqlite.Connection, step_id: int) -> None:
    await conn.execute("DELETE FROM protocol_steps WHERE id=?", (step_id,))
    await conn.commit()


async def set_step_done(conn: aiosqlite.Connection, step_id: int, done: bool) -> None:
    if done:
        await conn.execute(
            "UPDATE protocol_steps SET done_at=CURRENT_TIMESTAMP WHERE id=?", (step_id,)
        )
    else:
        await conn.execute(
            "UPDATE protocol_steps SET done_at=NULL WHERE id=?", (step_id,)
        )
    await conn.commit()


async def defer_step(conn: aiosqlite.Connection, step_id: int, days: int) -> dict[str, Any] | None:
    """Cascade-defer: shift this step and all later steps in the same protocol by `days`.

    "Later" is defined by seq order. Returns the affected protocol with its steps.
    """
    cur = await conn.execute(
        "SELECT protocol_id, seq FROM protocol_steps WHERE id=?", (step_id,)
    )
    row = await cur.fetchone()
    if row is None:
        return None
    protocol_id, seq = row["protocol_id"], row["seq"]
    await conn.execute(
        """UPDATE protocol_steps
           SET day_offset = day_offset + ?
           WHERE protocol_id = ? AND seq >= ?""",
        (days, protocol_id, seq),
    )
    await conn.commit()
    protocol = await get_protocol(conn, protocol_id)
    if protocol is not None:
        protocol["steps"] = await get_steps(conn, protocol_id)
    return protocol


async def shift_protocol(conn: aiosqlite.Connection, protocol_id: int, days: int) -> None:
    """Move the whole protocol by shifting its start_date by `days`."""
    await conn.execute(
        """UPDATE protocols
           SET start_date = date(start_date, '+' || ? || ' days')
           WHERE id = ? AND start_date IS NOT NULL""",
        (days, protocol_id),
    )
    await conn.commit()


# ---------------------------------------------------------------------------
# One-off tasks
# ---------------------------------------------------------------------------

async def get_all_tasks(conn: aiosqlite.Connection) -> list[dict[str, Any]]:
    cur = await conn.execute("SELECT * FROM tasks ORDER BY date IS NULL, date, id")
    return _rows(await cur.fetchall())


async def add_task(
    conn: aiosqlite.Connection,
    title: str,
    category: str = "algemeen",
    date: str | None = None,
    notes: str = "",
) -> int:
    cur = await conn.execute(
        "INSERT INTO tasks (title, category, date, notes) VALUES (?, ?, ?, ?)",
        (title, category, date, notes),
    )
    await conn.commit()
    return cur.lastrowid


async def update_task(conn: aiosqlite.Connection, task_id: int, **fields: Any) -> None:
    allowed = {"title", "category", "date", "notes"}
    sets = {k: v for k, v in fields.items() if k in allowed}
    if not sets:
        return
    cols = ", ".join(f"{k}=?" for k in sets)
    await conn.execute(f"UPDATE tasks SET {cols} WHERE id=?", (*sets.values(), task_id))
    await conn.commit()


async def remove_task(conn: aiosqlite.Connection, task_id: int) -> None:
    await conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))
    await conn.commit()


async def set_task_done(conn: aiosqlite.Connection, task_id: int, done: bool) -> None:
    if done:
        await conn.execute(
            "UPDATE tasks SET done_at=CURRENT_TIMESTAMP WHERE id=?", (task_id,)
        )
    else:
        await conn.execute("UPDATE tasks SET done_at=NULL WHERE id=?", (task_id,))
    await conn.commit()


# ---------------------------------------------------------------------------
# Daily checks (reset per day)
# ---------------------------------------------------------------------------

async def get_checks_for_date(conn: aiosqlite.Connection, date: str) -> list[str]:
    cur = await conn.execute(
        "SELECT item_key FROM daily_checks WHERE date=?", (date,)
    )
    return [r["item_key"] for r in await cur.fetchall()]


async def set_daily_check(
    conn: aiosqlite.Connection, date: str, item_key: str, done: bool
) -> None:
    if done:
        await conn.execute(
            "INSERT OR IGNORE INTO daily_checks (date, item_key) VALUES (?, ?)",
            (date, item_key),
        )
    else:
        await conn.execute(
            "DELETE FROM daily_checks WHERE date=? AND item_key=?", (date, item_key)
        )
    await conn.commit()


async def clear_daily_checks(conn: aiosqlite.Connection, date: str) -> None:
    await conn.execute("DELETE FROM daily_checks WHERE date=?", (date,))
    await conn.commit()


# ---------------------------------------------------------------------------
# Per-phase daily schedule
# ---------------------------------------------------------------------------

async def get_schedule_items(conn: aiosqlite.Connection, phase_key: str) -> list[dict[str, Any]]:
    cur = await conn.execute(
        "SELECT * FROM schedule_items WHERE phase_key=? ORDER BY time, seq, id", (phase_key,)
    )
    return _rows(await cur.fetchall())


async def get_all_schedules(conn: aiosqlite.Connection) -> dict[str, list[dict[str, Any]]]:
    cur = await conn.execute("SELECT * FROM schedule_items ORDER BY phase_key, time, seq, id")
    out: dict[str, list[dict[str, Any]]] = {}
    for row in await cur.fetchall():
        d = dict(row)
        out.setdefault(d["phase_key"], []).append(d)
    return out


async def count_schedule_items(conn: aiosqlite.Connection, phase_key: str) -> int:
    cur = await conn.execute(
        "SELECT COUNT(*) FROM schedule_items WHERE phase_key=?", (phase_key,)
    )
    row = await cur.fetchone()
    return row[0] if row else 0


async def add_schedule_item(
    conn: aiosqlite.Connection,
    phase_key: str,
    time: str,
    type: str,
    label: str,
    notes: str = "",
    seq: int = 0,
) -> int:
    cur = await conn.execute(
        "INSERT INTO schedule_items (phase_key, seq, time, type, label, notes) VALUES (?, ?, ?, ?, ?, ?)",
        (phase_key, seq, time, type, label, notes),
    )
    await conn.commit()
    return cur.lastrowid


async def update_schedule_item(conn: aiosqlite.Connection, item_id: int, **fields: Any) -> None:
    allowed = {"time", "type", "label", "notes", "seq", "phase_key"}
    sets = {k: v for k, v in fields.items() if k in allowed}
    if not sets:
        return
    cols = ", ".join(f"{k}=?" for k in sets)
    await conn.execute(
        f"UPDATE schedule_items SET {cols} WHERE id=?", (*sets.values(), item_id)
    )
    await conn.commit()


async def remove_schedule_item(conn: aiosqlite.Connection, item_id: int) -> None:
    await conn.execute("DELETE FROM schedule_items WHERE id=?", (item_id,))
    await conn.commit()
