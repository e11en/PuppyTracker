"""WebSocket API for the Puppy Tracker panel."""

from __future__ import annotations

import logging
from datetime import timedelta
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant
import homeassistant.util.dt as dt_util

from . import content
from .const import DEFAULT_LANGUAGE, DOMAIN, SUPPORTED_LANGUAGES
from .coordinator import PuppyCoordinator
from .db import PuppyTrackerDB, queries
from .seeder import async_reseed_defaults, async_seed_defaults

_LOGGER = logging.getLogger(__name__)


def async_register_commands(hass: HomeAssistant) -> None:
    """Register all Puppy Tracker WS commands."""
    for cmd in (
        ws_get_state,
        ws_update_puppy,
        ws_mark_pee,
        ws_snooze_pee,
        ws_toggle_daily_check,
        ws_clear_daily_checks,
        ws_add_schedule_item,
        ws_update_schedule_item,
        ws_remove_schedule_item,
        ws_update_phase,
        ws_set_language,
        ws_reseed_defaults,
        ws_add_task,
        ws_update_task,
        ws_remove_task,
        ws_set_task_done,
        ws_add_protocol,
        ws_update_protocol,
        ws_remove_protocol,
        ws_add_step,
        ws_update_step,
        ws_remove_step,
        ws_set_step_done,
        ws_defer_step,
        ws_shift_protocol,
    ):
        websocket_api.async_register_command(hass, cmd)


def _entry(hass: HomeAssistant) -> tuple[PuppyTrackerDB, PuppyCoordinator] | None:
    entries = hass.data.get(DOMAIN, {})
    if not entries:
        return None
    data = entries[next(iter(entries))]
    return data["db"], data["coordinator"]


def _today() -> str:
    return dt_util.now().date().isoformat()


async def _full_state(db: PuppyTrackerDB, coordinator: PuppyCoordinator) -> dict[str, Any]:
    data = coordinator.data or {}
    next_pee = data.get("next_pee")
    next_pee_out = None
    if next_pee:
        next_pee_out = {
            "at": next_pee["at"].isoformat(),
            "seconds": next_pee["seconds"],
            "interval_hours": next_pee["interval_hours"],
        }
    today = _today()
    lang = (await queries.get_app_state(db.conn, "language")) or DEFAULT_LANGUAGE
    return {
        "puppy": await queries.get_puppy(db.conn),
        "today": today,
        "language": lang,
        "age_weeks": data.get("age_weeks"),
        "age_days": data.get("age_days"),
        "age_months": data.get("age_months"),
        "walk_minutes": data.get("walk_minutes"),
        "phase": data.get("phase"),
        "in_fear_period": data.get("in_fear_period"),
        "next_pee": next_pee_out,
        "phases": await queries.get_phases(db.conn),
        "schedules": await queries.get_all_schedules(db.conn),
        "schedule_types": content.schedule_types(lang),
        "night": {"start": content.NIGHT_START, "end": content.NIGHT_END},
        "socialization_categories": content.categories(lang),
        "daily_checks": await queries.get_checks_for_date(db.conn, today),
        "protocols": await queries.get_protocols_with_steps(db.conn),
        "tasks": await queries.get_all_tasks(db.conn),
    }


@websocket_api.websocket_command({vol.Required("type"): "puppy_tracker/get_state"})
@websocket_api.async_response
async def ws_get_state(hass, connection, msg):
    e = _entry(hass)
    if not e:
        connection.send_result(msg["id"], {})
        return
    connection.send_result(msg["id"], await _full_state(*e))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/update_puppy",
        vol.Optional("name"): str,
        vol.Optional("birth_date"): vol.Any(str, None),
        vol.Optional("homecoming_date"): vol.Any(str, None),
        vol.Optional("notes"): str,
        vol.Optional("photo_url"): str,
    }
)
@websocket_api.async_response
async def ws_update_puppy(hass, connection, msg):
    e = _entry(hass)
    if not e:
        connection.send_result(msg["id"], {})
        return
    db, coordinator = e
    current = await queries.get_puppy(db.conn) or {}
    await queries.upsert_puppy(
        db.conn,
        name=msg.get("name", current.get("name", "Beer")),
        birth_date=msg.get("birth_date", current.get("birth_date")),
        homecoming_date=msg.get("homecoming_date", current.get("homecoming_date")),
        notes=msg.get("notes", current.get("notes", "")),
        photo_url=msg.get("photo_url"),
    )
    # Re-anchor seeded protocols to the (possibly) new dates.
    await async_seed_defaults(db.conn)
    await coordinator.async_request_refresh()
    connection.send_result(msg["id"], await _full_state(db, coordinator))


@websocket_api.websocket_command({vol.Required("type"): "puppy_tracker/mark_pee"})
@websocket_api.async_response
async def ws_mark_pee(hass, connection, msg):
    """Record that the puppy just peed: next pee = now + phase interval."""
    e = _entry(hass)
    if not e:
        connection.send_result(msg["id"], {})
        return
    db, coordinator = e
    phase = (coordinator.data or {}).get("phase")
    interval = int(phase["pee_interval_hours"]) if phase else 3
    nxt = dt_util.now() + timedelta(hours=interval)
    await queries.set_app_state(db.conn, "next_pee_at", nxt.isoformat())
    await coordinator.async_request_refresh()
    connection.send_result(msg["id"], await _full_state(db, coordinator))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/snooze_pee",
        vol.Optional("minutes"): int,
    }
)
@websocket_api.async_response
async def ws_snooze_pee(hass, connection, msg):
    """Push the next pee break later by N minutes (default 30)."""
    e = _entry(hass)
    if not e:
        connection.send_result(msg["id"], {})
        return
    db, coordinator = e
    minutes = msg.get("minutes", 30)
    current = (coordinator.data or {}).get("next_pee")
    base = current["at"] if current else dt_util.now()
    nxt = base + timedelta(minutes=minutes)
    await queries.set_app_state(db.conn, "next_pee_at", nxt.isoformat())
    await coordinator.async_request_refresh()
    connection.send_result(msg["id"], await _full_state(db, coordinator))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/toggle_daily_check",
        vol.Required("item_key"): str,
        vol.Required("done"): bool,
        vol.Optional("date"): str,
    }
)
@websocket_api.async_response
async def ws_toggle_daily_check(hass, connection, msg):
    e = _entry(hass)
    if not e:
        connection.send_result(msg["id"], {})
        return
    db, _ = e
    date = msg.get("date", _today())
    await queries.set_daily_check(db.conn, date, msg["item_key"], msg["done"])
    connection.send_result(
        msg["id"], {"daily_checks": await queries.get_checks_for_date(db.conn, date)}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/clear_daily_checks",
        vol.Optional("date"): str,
    }
)
@websocket_api.async_response
async def ws_clear_daily_checks(hass, connection, msg):
    e = _entry(hass)
    if not e:
        connection.send_result(msg["id"], {})
        return
    db, _ = e
    date = msg.get("date", _today())
    await queries.clear_daily_checks(db.conn, date)
    connection.send_result(msg["id"], {"daily_checks": []})


# --- Per-phase day schedule ---------------------------------------------

@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/add_schedule_item",
        vol.Required("phase_key"): str,
        vol.Required("time"): str,
        vol.Required("label"): str,
        vol.Optional("item_type"): str,
        vol.Optional("notes"): str,
    }
)
@websocket_api.async_response
async def ws_add_schedule_item(hass, connection, msg):
    db, _ = _entry(hass)
    await queries.add_schedule_item(
        db.conn,
        phase_key=msg["phase_key"],
        time=msg["time"],
        type=msg.get("item_type", "rust"),
        label=msg["label"],
        notes=msg.get("notes", ""),
    )
    connection.send_result(msg["id"], {"schedules": await queries.get_all_schedules(db.conn)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/update_schedule_item",
        vol.Required("item_id"): int,
        vol.Optional("time"): str,
        vol.Optional("item_type"): str,
        vol.Optional("label"): str,
        vol.Optional("notes"): str,
    }
)
@websocket_api.async_response
async def ws_update_schedule_item(hass, connection, msg):
    db, _ = _entry(hass)
    fields: dict[str, Any] = {}
    if "time" in msg:
        fields["time"] = msg["time"]
    if "item_type" in msg:
        fields["type"] = msg["item_type"]
    if "label" in msg:
        fields["label"] = msg["label"]
    if "notes" in msg:
        fields["notes"] = msg["notes"]
    await queries.update_schedule_item(db.conn, msg["item_id"], **fields)
    connection.send_result(msg["id"], {"schedules": await queries.get_all_schedules(db.conn)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/remove_schedule_item",
        vol.Required("item_id"): int,
    }
)
@websocket_api.async_response
async def ws_remove_schedule_item(hass, connection, msg):
    db, _ = _entry(hass)
    await queries.remove_schedule_item(db.conn, msg["item_id"])
    connection.send_result(msg["id"], {"schedules": await queries.get_all_schedules(db.conn)})


# --- Editable phase content ---------------------------------------------

@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/update_phase",
        vol.Required("key"): str,
        vol.Optional("title"): str,
        vol.Optional("week_start"): int,
        vol.Optional("week_end"): int,
        vol.Optional("pee_interval_hours"): int,
        vol.Optional("focus"): [str],
        vol.Optional("info_cards"): list,
    }
)
@websocket_api.async_response
async def ws_update_phase(hass, connection, msg):
    e = _entry(hass)
    if not e:
        connection.send_result(msg["id"], {})
        return
    db, coordinator = e
    fields = {
        k: msg[k]
        for k in ("title", "week_start", "week_end", "pee_interval_hours", "focus", "info_cards")
        if k in msg
    }
    await queries.update_phase(db.conn, msg["key"], **fields)
    await coordinator.async_request_refresh()
    connection.send_result(msg["id"], await _full_state(db, coordinator))


# --- Language ------------------------------------------------------------

@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/set_language",
        vol.Required("language"): str,
    }
)
@websocket_api.async_response
async def ws_set_language(hass, connection, msg):
    e = _entry(hass)
    if not e:
        connection.send_result(msg["id"], {})
        return
    db, coordinator = e
    lang = msg["language"] if msg["language"] in SUPPORTED_LANGUAGES else DEFAULT_LANGUAGE
    await queries.set_app_state(db.conn, "language", lang)
    connection.send_result(msg["id"], await _full_state(db, coordinator))


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/reseed_defaults",
        vol.Optional("language"): str,
    }
)
@websocket_api.async_response
async def ws_reseed_defaults(hass, connection, msg):
    e = _entry(hass)
    if not e:
        connection.send_result(msg["id"], {})
        return
    db, coordinator = e
    current = (await queries.get_app_state(db.conn, "language")) or DEFAULT_LANGUAGE
    lang = msg.get("language", current)
    if lang not in SUPPORTED_LANGUAGES:
        lang = DEFAULT_LANGUAGE
    await async_reseed_defaults(db.conn, lang)
    await coordinator.async_request_refresh()
    connection.send_result(msg["id"], await _full_state(db, coordinator))


# --- Tasks ---------------------------------------------------------------

@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/add_task",
        vol.Required("title"): str,
        vol.Optional("category"): str,
        vol.Optional("date"): vol.Any(str, None),
        vol.Optional("notes"): str,
    }
)
@websocket_api.async_response
async def ws_add_task(hass, connection, msg):
    db, _ = _entry(hass)
    await queries.add_task(
        db.conn,
        title=msg["title"],
        category=msg.get("category", "algemeen"),
        date=msg.get("date"),
        notes=msg.get("notes", ""),
    )
    connection.send_result(msg["id"], {"tasks": await queries.get_all_tasks(db.conn)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/update_task",
        vol.Required("task_id"): int,
        vol.Optional("title"): str,
        vol.Optional("category"): str,
        vol.Optional("date"): vol.Any(str, None),
        vol.Optional("notes"): str,
    }
)
@websocket_api.async_response
async def ws_update_task(hass, connection, msg):
    db, _ = _entry(hass)
    fields = {k: msg[k] for k in ("title", "category", "date", "notes") if k in msg}
    await queries.update_task(db.conn, msg["task_id"], **fields)
    connection.send_result(msg["id"], {"tasks": await queries.get_all_tasks(db.conn)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/remove_task",
        vol.Required("task_id"): int,
    }
)
@websocket_api.async_response
async def ws_remove_task(hass, connection, msg):
    db, _ = _entry(hass)
    await queries.remove_task(db.conn, msg["task_id"])
    connection.send_result(msg["id"], {"tasks": await queries.get_all_tasks(db.conn)})


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/set_task_done",
        vol.Required("task_id"): int,
        vol.Required("done"): bool,
    }
)
@websocket_api.async_response
async def ws_set_task_done(hass, connection, msg):
    db, _ = _entry(hass)
    await queries.set_task_done(db.conn, msg["task_id"], msg["done"])
    connection.send_result(msg["id"], {"tasks": await queries.get_all_tasks(db.conn)})


# --- Protocols + steps ---------------------------------------------------

@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/add_protocol",
        vol.Required("name"): str,
        vol.Optional("category"): str,
        vol.Optional("anchor"): str,
        vol.Optional("start_date"): vol.Any(str, None),
        vol.Optional("notes"): str,
    }
)
@websocket_api.async_response
async def ws_add_protocol(hass, connection, msg):
    db, _ = _entry(hass)
    await queries.add_protocol(
        db.conn,
        name=msg["name"],
        category=msg.get("category", "algemeen"),
        anchor=msg.get("anchor", "fixed"),
        start_date=msg.get("start_date"),
        notes=msg.get("notes", ""),
    )
    connection.send_result(
        msg["id"], {"protocols": await queries.get_protocols_with_steps(db.conn)}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/update_protocol",
        vol.Required("protocol_id"): int,
        vol.Optional("name"): str,
        vol.Optional("category"): str,
        vol.Optional("anchor"): str,
        vol.Optional("start_date"): vol.Any(str, None),
        vol.Optional("status"): str,
        vol.Optional("notes"): str,
    }
)
@websocket_api.async_response
async def ws_update_protocol(hass, connection, msg):
    db, _ = _entry(hass)
    fields = {
        k: msg[k]
        for k in ("name", "category", "anchor", "start_date", "status", "notes")
        if k in msg
    }
    await queries.update_protocol(db.conn, msg["protocol_id"], **fields)
    connection.send_result(
        msg["id"], {"protocols": await queries.get_protocols_with_steps(db.conn)}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/remove_protocol",
        vol.Required("protocol_id"): int,
    }
)
@websocket_api.async_response
async def ws_remove_protocol(hass, connection, msg):
    db, _ = _entry(hass)
    await queries.remove_protocol(db.conn, msg["protocol_id"])
    connection.send_result(
        msg["id"], {"protocols": await queries.get_protocols_with_steps(db.conn)}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/add_step",
        vol.Required("protocol_id"): int,
        vol.Required("title"): str,
        vol.Optional("seq"): int,
        vol.Optional("day_offset"): int,
        vol.Optional("category"): str,
        vol.Optional("notes"): str,
        vol.Optional("check_mode"): str,
    }
)
@websocket_api.async_response
async def ws_add_step(hass, connection, msg):
    db, _ = _entry(hass)
    existing = await queries.get_steps(db.conn, msg["protocol_id"])
    seq = msg.get("seq", len(existing))
    await queries.add_step(
        db.conn,
        protocol_id=msg["protocol_id"],
        seq=seq,
        day_offset=msg.get("day_offset", 0),
        title=msg["title"],
        category=msg.get("category", ""),
        notes=msg.get("notes", ""),
        check_mode=msg.get("check_mode", "milestone"),
    )
    connection.send_result(
        msg["id"], {"protocols": await queries.get_protocols_with_steps(db.conn)}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/update_step",
        vol.Required("step_id"): int,
        vol.Optional("seq"): int,
        vol.Optional("day_offset"): int,
        vol.Optional("title"): str,
        vol.Optional("category"): str,
        vol.Optional("notes"): str,
        vol.Optional("check_mode"): str,
    }
)
@websocket_api.async_response
async def ws_update_step(hass, connection, msg):
    db, _ = _entry(hass)
    fields = {
        k: msg[k]
        for k in ("seq", "day_offset", "title", "category", "notes", "check_mode")
        if k in msg
    }
    await queries.update_step(db.conn, msg["step_id"], **fields)
    connection.send_result(
        msg["id"], {"protocols": await queries.get_protocols_with_steps(db.conn)}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/remove_step",
        vol.Required("step_id"): int,
    }
)
@websocket_api.async_response
async def ws_remove_step(hass, connection, msg):
    db, _ = _entry(hass)
    await queries.remove_step(db.conn, msg["step_id"])
    connection.send_result(
        msg["id"], {"protocols": await queries.get_protocols_with_steps(db.conn)}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/set_step_done",
        vol.Required("step_id"): int,
        vol.Required("done"): bool,
    }
)
@websocket_api.async_response
async def ws_set_step_done(hass, connection, msg):
    db, _ = _entry(hass)
    await queries.set_step_done(db.conn, msg["step_id"], msg["done"])
    connection.send_result(
        msg["id"], {"protocols": await queries.get_protocols_with_steps(db.conn)}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/defer_step",
        vol.Required("step_id"): int,
        vol.Required("days"): int,
    }
)
@websocket_api.async_response
async def ws_defer_step(hass, connection, msg):
    db, _ = _entry(hass)
    await queries.defer_step(db.conn, msg["step_id"], msg["days"])
    connection.send_result(
        msg["id"], {"protocols": await queries.get_protocols_with_steps(db.conn)}
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "puppy_tracker/shift_protocol",
        vol.Required("protocol_id"): int,
        vol.Required("days"): int,
    }
)
@websocket_api.async_response
async def ws_shift_protocol(hass, connection, msg):
    db, _ = _entry(hass)
    await queries.shift_protocol(db.conn, msg["protocol_id"], msg["days"])
    connection.send_result(
        msg["id"], {"protocols": await queries.get_protocols_with_steps(db.conn)}
    )
