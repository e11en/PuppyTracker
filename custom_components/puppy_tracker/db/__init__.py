"""Database layer for Puppy Tracker using SQLite via aiosqlite."""

from __future__ import annotations

import logging
from pathlib import Path

import aiosqlite

from homeassistant.core import HomeAssistant

from ..const import DB_FILENAME
from .migrations import MIGRATIONS

_LOGGER = logging.getLogger(__name__)


class PuppyTrackerDB:
    """Async SQLite database manager for Puppy Tracker."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the database manager."""
        self._hass = hass
        self._db_path = Path(hass.config.path(DB_FILENAME))
        self._conn: aiosqlite.Connection | None = None

    async def async_setup(self) -> None:
        """Open the database and run migrations."""
        self._conn = await aiosqlite.connect(str(self._db_path))
        self._conn.row_factory = aiosqlite.Row
        await self._conn.execute("PRAGMA journal_mode=WAL")
        await self._conn.execute("PRAGMA foreign_keys=ON")
        await self._run_migrations()
        _LOGGER.info("Puppy Tracker database ready at %s", self._db_path)

    async def async_close(self) -> None:
        """Close the database connection."""
        if self._conn:
            await self._conn.close()
            self._conn = None

    @property
    def conn(self) -> aiosqlite.Connection:
        """Return the database connection."""
        if self._conn is None:
            raise RuntimeError("Database not initialized")
        return self._conn

    async def _run_migrations(self) -> None:
        """Run pending database migrations."""
        await self.conn.execute(
            "CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY)"
        )
        cursor = await self.conn.execute(
            "SELECT COALESCE(MAX(version), 0) FROM schema_migrations"
        )
        row = await cursor.fetchone()
        current_version = row[0] if row else 0

        for version, sql in MIGRATIONS:
            if version > current_version:
                _LOGGER.info("Running Puppy Tracker migration %d", version)
                await self.conn.executescript(sql)
                await self.conn.execute(
                    "INSERT INTO schema_migrations (version) VALUES (?)", (version,)
                )
                await self.conn.commit()

        _LOGGER.debug(
            "Puppy Tracker database at version %d",
            max((v for v, _ in MIGRATIONS), default=0),
        )
