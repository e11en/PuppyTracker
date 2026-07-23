"""Constants for the Puppy Tracker integration."""

from __future__ import annotations

DOMAIN = "puppy_tracker"
VERSION = "1.0.0"

DB_FILENAME = "puppy_tracker.db"

PLATFORMS = ["sensor", "todo"]

# Config entry data keys
CONF_NAME = "name"
CONF_BIRTH_DATE = "birth_date"
CONF_HOMECOMING_DATE = "homecoming_date"

DEFAULT_NAME = "Puppy"
DEFAULT_LANGUAGE = "nl"
SUPPORTED_LANGUAGES = ["nl", "en"]

# Frontend
PANEL_URL_PATH = "puppy-tracker"
PANEL_STATIC_URL = "/puppy_tracker_panel"
PANEL_FILENAME = "puppy-tracker-panel.js"

# Anchors for protocols (relative start reference)
ANCHOR_BIRTHDATE = "birthdate"
ANCHOR_HOMECOMING = "homecoming"
ANCHOR_FIXED = "fixed"

# Check modes for protocol steps
CHECK_DAILY = "daily"
CHECK_MILESTONE = "milestone"
