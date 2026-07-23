"""Puppy Tracker — developmental phases, daily checklist and shiftable care schedules."""

from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import (
    CONF_BIRTH_DATE,
    CONF_HOMECOMING_DATE,
    CONF_NAME,
    DEFAULT_NAME,
    DOMAIN,
    PLATFORMS,
)
from .coordinator import PuppyCoordinator
from .db import PuppyTrackerDB, queries
from .seeder import async_seed_defaults

_LOGGER = logging.getLogger(__name__)

type PuppyConfigEntry = ConfigEntry


async def async_setup_entry(hass: HomeAssistant, entry: PuppyConfigEntry) -> bool:
    """Set up Puppy Tracker from a config entry."""
    db = PuppyTrackerDB(hass)
    await db.async_setup()

    # Seed the puppy profile row from the config entry if the DB is empty.
    existing = await queries.get_puppy(db.conn)
    if existing is None:
        await queries.upsert_puppy(
            db.conn,
            name=entry.data.get(CONF_NAME, DEFAULT_NAME),
            birth_date=entry.data.get(CONF_BIRTH_DATE),
            homecoming_date=entry.data.get(CONF_HOMECOMING_DATE),
        )

    # Seed default protocols (socialization, bench) and re-anchor their dates.
    await async_seed_defaults(db.conn)

    coordinator = PuppyCoordinator(hass, db)
    await coordinator.async_config_entry_first_refresh()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = {"db": db, "coordinator": coordinator}

    # Register WS commands, static frontend and the sidebar panel once.
    if len(hass.data[DOMAIN]) == 1:
        from .websocket_api import async_register_commands

        async_register_commands(hass)

        from .panel import async_register_panel_frontend

        await async_register_panel_frontend(hass)

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    entry.async_on_unload(entry.add_update_listener(_async_reload_on_update))

    _LOGGER.info("Puppy Tracker loaded")
    return True


async def _async_reload_on_update(hass: HomeAssistant, entry: PuppyConfigEntry) -> None:
    """Reload the entry when options change (e.g. renamed puppy)."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: PuppyConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unload_ok:
        data = hass.data[DOMAIN].pop(entry.entry_id)
        await data["db"].async_close()
    return unload_ok
