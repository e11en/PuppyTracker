"""Pure date/age logic for Puppy Tracker (no HA imports, easy to unit-test)."""

from __future__ import annotations

from datetime import date, datetime, time, timedelta


def parse_date(value: str | None) -> date | None:
    if not value:
        return None
    try:
        return date.fromisoformat(value[:10])
    except (ValueError, TypeError):
        return None


def age_in_days(birth_date: str | None, today: date) -> int | None:
    bd = parse_date(birth_date)
    if bd is None:
        return None
    return (today - bd).days


def age_in_weeks(birth_date: str | None, today: date) -> int | None:
    days = age_in_days(birth_date, today)
    if days is None:
        return None
    return days // 7


def next_pee(
    now: datetime, interval_hours: int, wake: time = time(7, 0)
) -> tuple[datetime, int]:
    """Return (next_pee_datetime, seconds_until) using `wake` as the daily anchor.

    Pee moments fall at wake + k * interval. Returns the first one strictly after now.
    """
    anchor = datetime.combine(now.date(), wake, tzinfo=now.tzinfo)
    if now < anchor:
        nxt = anchor
    else:
        step = timedelta(hours=interval_hours)
        elapsed = now - anchor
        k = int(elapsed // step) + 1
        nxt = anchor + k * step
    seconds = int((nxt - now).total_seconds())
    return nxt, max(seconds, 0)


def resolve_anchor_date(
    anchor: str, birth_date: str | None, homecoming_date: str | None
) -> str | None:
    """Resolve a protocol anchor to a concrete ISO date string."""
    if anchor == "birthdate":
        return (birth_date or None) and birth_date[:10]
    if anchor == "homecoming":
        return (homecoming_date or None) and homecoming_date[:10]
    return None
