# CLAUDE.md — PuppyTracker

Guidance for Claude / contributors working in this repo.

## What this is

A Home Assistant **custom integration** that tracks a puppy's first months:
developmental phases, a daily 24h schedule, a socialization program, and
shiftable care schedules (defer a step and the rest of that schedule cascades).
It ships its own **sidebar panel** (Lit) — there is no add-on and no separate
backend service.

Built originally for Beer, a Bernese Mountain Dog.

## Architecture

- **Integration** (`custom_components/puppy_tracker/`, domain `puppy_tracker`):
  Python, single config entry. Owns a SQLite DB (aiosqlite) in the HA config dir
  (`puppy_tracker.db`).
- **Sidebar panel** (`cards/`, Lit + TypeScript, bundled with Vite): one
  self-contained ES module served by the integration and registered via
  `panel_custom`. All data flows over the HA **WebSocket API**
  (`puppy_tracker/*` commands) — the panel is a WS client of the integration.
- **Native entities**: `sensor.*` (age in weeks, active phase, next pee break)
  via a `DataUpdateCoordinator`, and `todo.<name>_vandaag` (today's checklist).

### Data model (SQLite, `db/migrations.py`)

- `puppy` — single profile row (name, birth_date, homecoming_date, photo_url).
- `phases` — editable phase content (title, week range, pee interval, focus[],
  info_cards[] as JSON), seeded from `phases.py`.
- `protocols` + `protocol_steps` — a protocol is an ordered set of steps with
  **relative day-offsets**; effective date = `start_date + day_offset`.
  **Cascade-defer** shifts a step and all later steps (same `seq` order) by N days.
  Seeded protocols: socialization program + bench (keyed by `seed_key`).
- `tasks` — one-off tasks (e.g. vet visit).
- `daily_checks` — per-day checkbox state (resets by querying today's date).
- `schedule_items` — per-phase 24h day schedule (time/type/label/notes).
- `app_state` — key/value (e.g. `language`, `next_pee_at`).

### Key backend files

| File | Purpose |
|------|---------|
| `__init__.py` | setup entry, seed defaults, register panel + WS |
| `coordinator.py` | age / active phase / next pee (reads DB phases) |
| `db/queries.py` | all SQL; `defer_step` is the cascade core |
| `phases.py` / `content.py` | bilingual (nl/en) seed content + getters |
| `seeder.py` | language-aware seeding + `async_reseed_defaults` |
| `websocket_api.py` | all `puppy_tracker/*` WS commands |
| `todo.py` / `sensor.py` | native entities |

### Frontend

`cards/src/main.ts` is the whole panel (one Lit element `puppy-tracker-panel`).
Two tabs: **Vandaag** (hero + 24h day-view timeline + upcoming) and
**Configuratie** (collapsible groups: puppy settings, phases, socialization
week-checklist, schedules & tasks). UI strings live in the `I18N` map + `t()`;
content strings are translated server-side.

## i18n

- Interface: `I18N` dict (nl/en) + `t(key, subs?)` in `main.ts`, driven by
  `state.language`.
- Content: `content.py` / `phases.py` hold both languages; getters resolve per
  language. Seeding uses the stored language (defaults to HA's language on first
  run). "Reload default content" (`reseed_defaults`) re-seeds the defaults in the
  chosen language; user-created tasks/protocols are kept.

## Dev workflow

```bash
docker compose up -d           # HA at http://localhost:8123 (integration mounted)
cd cards && npm install
cd cards && npm run build       # builds + copies the bundle into custom_components/.../frontend/
cd cards && npm run typecheck
python -m pytest tests/         # cascade-defer unit tests (needs aiosqlite, pytest)
docker compose restart          # after Python changes OR to refresh the panel bundle URL
```

**Panel cache**: the panel `module_url` is cache-busted on the bundle's mtime,
read at panel registration. After rebuilding the cards, **restart HA** (or hard-
reload the browser) so a normal reload fetches the new bundle.

**No blocking dialogs**: never use `window.alert/confirm/prompt` in the panel —
they freeze the browser automation and are poor UX. Use inline controls.

## Deploy to a live HAOS instance

The integration is copied to `/config/custom_components/puppy_tracker/`. On HAOS,
transfer via the guest agent with **base64** to preserve non-ASCII (Dutch) text:

```
tar czf - custom_components/puppy_tracker | base64 | \
  ssh root@<pve> "qm guest exec <vmid> --pass-stdin -- sh -c 'base64 -d | tar xzf - -C /config'"
ha core check && ha core restart
```

(Adjust to your setup; HACS install is the normal path for end users.)

## Branding / integration icon

Since Home Assistant **2026.3**, a custom integration ships its own brand images
in a `brand/` folder inside the integration — no PR to home-assistant/brands is
needed (that repo now rejects custom-integration icons). HA serves them via
`/api/brands/integration/<domain>/<image>` and local images take priority over
the CDN, with no extra config.

Assets live in [`custom_components/puppy_tracker/brand/`](custom_components/puppy_tracker/brand/):
`icon.png` (256²), `icon@2x.png` (512²), `logo.png` / `logo@2x.png` (landscape),
all transparent + trimmed. Optional `dark_*` variants are supported. On HA older
than 2026.3 the integrations-list logo simply falls back to "icon not available".
(The sidebar panel icon is separate and set to `mdi:dog`.)

## Conventions

- Code and comments in English; default UI content is Dutch with English seed.
- Content (phase texts, socialization, schedules) is **user-editable in the UI**;
  don't hardcode it in the panel — it comes from the DB via WS.
- Commit the built bundle in `custom_components/puppy_tracker/frontend/` (HACS
  needs it); do not commit `ha-config/`, `node_modules/`, `cards/dist/`, `.venv/`.
- Bump `manifest.json` version on releases.
