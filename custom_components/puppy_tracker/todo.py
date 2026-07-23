"""A todo entity exposing today's daily checklist (resets each day)."""

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
from .content import DAILY_SCHEDULE
from .db import PuppyTrackerDB, queries


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    db: PuppyTrackerDB = hass.data[DOMAIN][entry.entry_id]["db"]
    name = entry.data.get("name", "Beer")
    async_add_entities([DailyChecklistTodo(db, entry, name)])


class DailyChecklistTodo(TodoListEntity):
    """Today's schedule items as a checkable, self-resetting todo list."""

    _attr_supported_features = TodoListEntityFeature.UPDATE_TODO_ITEM
    _attr_should_poll = True

    def __init__(self, db: PuppyTrackerDB, entry: ConfigEntry, name: str) -> None:
        self._db = db
        self._entry = entry
        self._attr_name = f"{name} vandaag"
        self._attr_unique_id = f"{entry.entry_id}_daily_todo"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name=f"Puppy Tracker ({name})",
            manufacturer="Puppy Tracker",
        )
        self._done: set[str] = set()

    @property
    def todo_items(self) -> list[TodoItem]:
        items: list[TodoItem] = []
        for entry in DAILY_SCHEDULE:
            status = (
                TodoItemStatus.COMPLETED
                if entry["key"] in self._done
                else TodoItemStatus.NEEDS_ACTION
            )
            items.append(
                TodoItem(
                    uid=entry["key"],
                    summary=f"{entry['time']} {entry['label']}",
                    status=status,
                )
            )
        return items

    async def async_update(self) -> None:
        today = dt_util.now().date().isoformat()
        self._done = set(await queries.get_checks_for_date(self._db.conn, today))

    async def async_update_todo_item(self, item: TodoItem) -> None:
        today = dt_util.now().date().isoformat()
        done = item.status == TodoItemStatus.COMPLETED
        await queries.set_daily_check(self._db.conn, today, item.uid, done)
        await self.async_update()
        self.async_write_ha_state()
