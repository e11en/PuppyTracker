"""Database migrations for Puppy Tracker.

List of (version, sql) tuples. Each migration runs once, in order.
Pre-release: the whole schema lives in one initial migration.
"""

MIGRATIONS: list[tuple[int, str]] = [
    (
        1,
        """
        -- Single puppy profile (one row for now, kept generic).
        CREATE TABLE IF NOT EXISTS puppy (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            birth_date DATE,
            homecoming_date DATE,
            notes TEXT DEFAULT '',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- A protocol is an ordered set of steps with relative day-offsets.
        -- anchor = birthdate | homecoming | fixed. start_date is the concrete
        -- resolved date the offsets count from (recomputed on anchor changes).
        CREATE TABLE IF NOT EXISTS protocols (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'algemeen',
            anchor TEXT NOT NULL DEFAULT 'fixed',
            start_date DATE,
            status TEXT NOT NULL DEFAULT 'active',
            notes TEXT DEFAULT '',
            seed_key TEXT,                -- set for auto-seeded protocols (idempotent)
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Steps belong to a protocol. Effective date = protocol.start_date + day_offset.
        -- check_mode = daily | milestone. Cascade-defer shifts day_offset of this
        -- step and every later step in the same protocol by the same delta.
        CREATE TABLE IF NOT EXISTS protocol_steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            protocol_id INTEGER NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
            seq INTEGER NOT NULL,
            day_offset INTEGER NOT NULL DEFAULT 0,
            title TEXT NOT NULL,
            category TEXT DEFAULT '',      -- e.g. socialization category
            notes TEXT DEFAULT '',
            check_mode TEXT NOT NULL DEFAULT 'milestone',
            done_at DATETIME
        );

        -- One-off tasks (e.g. vet visit). Not part of a schedule.
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'algemeen',
            date DATE,
            notes TEXT DEFAULT '',
            done_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Per-day checkbox state for the daily checklist / 24h schedule.
        -- "Reset" = query by today's date; "clear today" = delete today's rows.
        CREATE TABLE IF NOT EXISTS daily_checks (
            date DATE NOT NULL,
            item_key TEXT NOT NULL,
            done_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (date, item_key)
        );

        CREATE INDEX IF NOT EXISTS idx_steps_protocol ON protocol_steps(protocol_id, seq);
        CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_checks(date);
        """,
    ),
    (
        2,
        """
        -- Optional puppy photo (URL or /local path) shown in the hero card.
        ALTER TABLE puppy ADD COLUMN photo_url TEXT DEFAULT '';

        -- Small key/value store for app state (e.g. the next-pee anchor).
        CREATE TABLE IF NOT EXISTS app_state (
            key TEXT PRIMARY KEY,
            value TEXT
        );
        """,
    ),
]
