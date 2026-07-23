"""A todo entity exposing today's daily checklist (resets each day).

The checklist follows the puppy's active-phase day schedule (stored in the DB).
"""

from __future__ import annotations

from homeassistant.components.todo import (
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
import homeassistant.util.dt as dt_util

from .const import DOMAIN
from .db import PuppyTrackerDB, queries
from .logic import age_in_weeks
from .phases import phase_for_age_weeks


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    db: PuppyTrackerDB = hass.data[DOMAIN][entry.entry_id]["db"]
    name = entry.data.get("name", "Puppy")
    async_add_entities([DailyChecklistTodo(db, entry, name)])


class DailyChecklistTodo(TodoListEntity):
    """Today's schedule items as a checkable, self-resetting todo list."""

    _attr_supported_features = TodoListEntityFeature.UPDATE_TODO_ITEM
    _attr_should_poll = True
    _attr_has_entity_name = True
    _attr_translation_key = "checklist"

    def __init__(self, db: PuppyTrackerDB, entry: ConfigEntry, name: str) -> None:
        self._db = db
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_daily_todo"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Puppy Tracker",
            manufacturer="Puppy Tracker",
            model=name,
        )
        self._items: list[tuple[str, str]] = []  # (uid, summary)
        self._done: set[str] = set()

    @property
    def todo_items(self) -> list[TodoItem]:
        return [
            TodoItem(
                uid=uid,
                summary=summary,
                status=(
                    TodoItemStatus.COMPLETED
                    if uid in self._done
                    else TodoItemStatus.NEEDS_ACTION
                ),
            )
            for uid, summary in self._items
        ]

    async def _active_phase_key(self) -> str | None:
        puppy = await queries.get_puppy(self._db.conn)
        weeks = age_in_weeks(puppy.get("birth_date") if puppy else None, dt_util.now().date())
        db_phases = await queries.get_phases(self._db.conn)
        phase = phase_for_age_weeks(weeks, db_phases)
        return phase["key"] if phase else None

    async def async_update(self) -> None:
        today = dt_util.now().date().isoformat()
        self._done = set(await queries.get_checks_for_date(self._db.conn, today))
        key = await self._active_phase_key()
        if key is None:
            self._items = []
            return
        rows = await queries.get_schedule_items(self._db.conn, key)
        self._items = [(str(r["id"]), f"{r['time']} {r['label']}") for r in rows]

    async def async_update_todo_item(self, item: TodoItem) -> None:
        today = dt_util.now().date().isoformat()
        done = item.status == TodoItemStatus.COMPLETED
        await queries.set_daily_check(self._db.conn, today, item.uid, done)
        await self.async_update()
        self.async_write_ha_state()
