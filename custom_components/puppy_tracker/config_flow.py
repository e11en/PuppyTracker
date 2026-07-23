"""Config flow for Puppy Tracker."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.helpers.selector import (
    DateSelector,
    TextSelector,
)

from .const import (
    CONF_BIRTH_DATE,
    CONF_HOMECOMING_DATE,
    CONF_NAME,
    DOMAIN,
)


class PuppyTrackerConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle the initial onboarding for Puppy Tracker."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(
                title=user_input[CONF_NAME],
                data=user_input,
            )

        schema = vol.Schema(
            {
                vol.Required(CONF_NAME): TextSelector(),
                vol.Optional(CONF_BIRTH_DATE): DateSelector(),
                vol.Optional(CONF_HOMECOMING_DATE): DateSelector(),
            }
        )
        return self.async_show_form(step_id="user", data_schema=schema)
