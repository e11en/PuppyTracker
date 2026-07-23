"""Sensor entities: age in weeks, active phase, next pee break."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import PuppyCoordinator


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator: PuppyCoordinator = hass.data[DOMAIN][entry.entry_id]["coordinator"]
    name = entry.data.get("name", "Puppy")
    async_add_entities(
        [
            PuppyAgeSensor(coordinator, entry, name),
            PuppyPhaseSensor(coordinator, entry, name),
            PuppyNextPeeSensor(coordinator, entry, name),
        ]
    )


class _BasePuppySensor(CoordinatorEntity[PuppyCoordinator], SensorEntity):
    """Shared base for puppy sensors."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: PuppyCoordinator, entry: ConfigEntry, name: str) -> None:
        super().__init__(coordinator)
        self._entry = entry
        self._puppy_name = name
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Puppy Tracker",
            manufacturer="Puppy Tracker",
            model=name,
        )


class PuppyAgeSensor(_BasePuppySensor):
    _attr_icon = "mdi:calendar-clock"
    _attr_translation_key = "age_weeks"

    def __init__(self, coordinator, entry, name) -> None:
        super().__init__(coordinator, entry, name)
        self._attr_unique_id = f"{entry.entry_id}_age_weeks"

    @property
    def native_value(self) -> int | None:
        return self.coordinator.data.get("age_weeks")

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        d = self.coordinator.data
        puppy = d.get("puppy") or {}
        return {
            "age_days": d.get("age_days"),
            "birth_date": puppy.get("birth_date"),
            "homecoming_date": puppy.get("homecoming_date"),
        }


class PuppyPhaseSensor(_BasePuppySensor):
    _attr_icon = "mdi:dog"
    _attr_translation_key = "phase"

    def __init__(self, coordinator, entry, name) -> None:
        super().__init__(coordinator, entry, name)
        self._attr_unique_id = f"{entry.entry_id}_phase"

    @property
    def native_value(self) -> str | None:
        phase = self.coordinator.data.get("phase")
        return phase["title"] if phase else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        phase = self.coordinator.data.get("phase")
        if not phase:
            return {}
        return {
            "key": phase["key"],
            "week_start": phase["week_start"],
            "week_end": phase["week_end"],
            "pee_interval_hours": phase["pee_interval_hours"],
            "focus": phase["focus"],
            "in_fear_period": self.coordinator.data.get("in_fear_period"),
        }


class PuppyNextPeeSensor(_BasePuppySensor):
    _attr_icon = "mdi:water"
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_translation_key = "next_pee"

    def __init__(self, coordinator, entry, name) -> None:
        super().__init__(coordinator, entry, name)
        self._attr_unique_id = f"{entry.entry_id}_next_pee"

    @property
    def native_value(self):
        np = self.coordinator.data.get("next_pee")
        return np["at"] if np else None

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        np = self.coordinator.data.get("next_pee")
        if not np:
            return {}
        return {
            "seconds_until": np["seconds"],
            "interval_hours": np["interval_hours"],
        }
