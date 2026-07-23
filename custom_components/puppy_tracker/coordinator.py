"""Data coordinator computing age, active phase and next pee break."""

from __future__ import annotations

from datetime import timedelta
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
import homeassistant.util.dt as dt_util

from .db import PuppyTrackerDB, queries
from .logic import age_in_days, age_in_weeks, next_pee
from .phases import FEAR_PERIOD_WEEKS, phase_for_age_weeks

_LOGGER = logging.getLogger(__name__)


class PuppyCoordinator(DataUpdateCoordinator[dict[str, Any]]):
    """Refreshes derived puppy data (age/phase/next pee) periodically."""

    def __init__(self, hass: HomeAssistant, db: PuppyTrackerDB) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name="Puppy Tracker",
            update_interval=timedelta(seconds=60),
        )
        self._db = db

    async def _async_update_data(self) -> dict[str, Any]:
        now = dt_util.now()
        today = now.date()

        puppy = await queries.get_puppy(self._db.conn)
        birth = puppy.get("birth_date") if puppy else None

        weeks = age_in_weeks(birth, today)
        days = age_in_days(birth, today)
        db_phases = await queries.get_phases(self._db.conn)
        phase = phase_for_age_weeks(weeks, db_phases)

        # 5-minute rule: age in months * 5 min, at the lower bound of the range.
        age_months = round(days / 30.44, 1) if days is not None else None
        walk_minutes = int(round(days / 30.44)) * 5 if days is not None else None

        next_pee_data: dict[str, Any] | None = None
        if phase is not None:
            interval = int(phase["pee_interval_hours"])
            stored = await queries.get_app_state(self._db.conn, "next_pee_at")
            anchored = dt_util.parse_datetime(stored) if stored else None
            if anchored is not None and anchored > now:
                at, seconds = anchored, int((anchored - now).total_seconds())
            else:
                at, seconds = next_pee(now, interval)
            next_pee_data = {"at": at, "seconds": seconds, "interval_hours": interval}

        in_fear_period = weeks is not None and FEAR_PERIOD_WEEKS[0] <= weeks <= FEAR_PERIOD_WEEKS[1]

        return {
            "puppy": puppy,
            "age_weeks": weeks,
            "age_days": days,
            "age_months": age_months,
            "walk_minutes": walk_minutes,
            "phase": phase,
            "next_pee": next_pee_data,
            "in_fear_period": in_fear_period,
        }
