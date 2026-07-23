"""Register the Puppy Tracker panel in the HA sidebar."""

from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.components.panel_custom import async_register_panel
from homeassistant.core import HomeAssistant

from .const import (
    DOMAIN,
    PANEL_FILENAME,
    PANEL_STATIC_URL,
    PANEL_URL_PATH,
    VERSION,
)

_LOGGER = logging.getLogger(__name__)

PANEL_PATH = Path(__file__).parent / "frontend" / PANEL_FILENAME


async def async_register_panel_frontend(hass: HomeAssistant) -> None:
    """Serve the panel bundle and register the sidebar panel."""
    if not PANEL_PATH.is_file():
        _LOGGER.warning(
            "Panel bundle not found at %s — skipping panel registration", PANEL_PATH
        )
        return

    try:
        await hass.http.async_register_static_paths(
            [
                StaticPathConfig(
                    PANEL_STATIC_URL + "/entrypoint.js",
                    str(PANEL_PATH),
                    cache_headers=False,
                )
            ]
        )
    except RuntimeError:
        _LOGGER.debug("Static path already registered, skipping")

    # Cache-bust on the bundle's mtime so a browser reload always fetches the
    # latest build after a restart/redeploy (the ?v param changes with the file).
    try:
        mtime = int(PANEL_PATH.stat().st_mtime)
    except OSError:
        mtime = 0

    try:
        await async_register_panel(
            hass,
            frontend_url_path=PANEL_URL_PATH,
            webcomponent_name="puppy-tracker-panel",
            sidebar_title="Puppy Tracker",
            sidebar_icon="mdi:dog",
            module_url=PANEL_STATIC_URL + f"/entrypoint.js?v={VERSION}-{mtime}",
            require_admin=False,
            config_panel_domain=DOMAIN,
        )
        _LOGGER.debug("Puppy Tracker panel registered")
    except ValueError:
        _LOGGER.debug("Panel already registered, skipping")
