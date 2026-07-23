import { LitElement, html, css, PropertyValues, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

// ---- Types ---------------------------------------------------------------

interface Hass {
  connection: {
    sendMessagePromise<T = unknown>(msg: Record<string, unknown>): Promise<T>;
  };
}

interface Step {
  id: number;
  protocol_id: number;
  seq: number;
  day_offset: number;
  title: string;
  category: string;
  notes: string;
  check_mode: string;
  done_at: string | null;
  effective_date: string | null;
}

interface Protocol {
  id: number;
  name: string;
  category: string;
  anchor: string;
  start_date: string | null;
  status: string;
  notes: string;
  seed_key: string | null;
  steps: Step[];
}

interface Task {
  id: number;
  title: string;
  category: string;
  date: string | null;
  notes: string;
  done_at: string | null;
}

interface Phase {
  key: string;
  title: string;
  week_start: number;
  week_end: number;
  pee_interval_hours: number;
  focus: string[];
  info_cards: { title: string; icon: string; items: string[] }[];
}

interface ScheduleItem {
  key: string;
  time: string;
  type: string;
  label: string;
  note: string;
}

type CatMap = Record<string, { label: string; color: string; icon: string }>;

interface State {
  puppy: { name: string; birth_date: string | null; homecoming_date: string | null; notes: string; photo_url?: string } | null;
  today: string;
  age_weeks: number | null;
  age_days: number | null;
  age_months: number | null;
  walk_minutes: number | null;
  phase: Phase | null;
  in_fear_period: boolean;
  next_pee: { at: string; seconds: number; interval_hours: number } | null;
  phases: Phase[];
  daily_schedule: ScheduleItem[];
  schedule_types: CatMap;
  night: { start: string; end: string };
  socialization_categories: CatMap;
  daily_checks: string[];
  protocols: Protocol[];
  tasks: Task[];
}

type Tab = "vandaag" | "fases" | "socialisatie" | "schemas" | "config";

const TABS: { id: Tab; label: string }[] = [
  { id: "vandaag", label: "Vandaag" },
  { id: "fases", label: "Fases" },
  { id: "socialisatie", label: "Socialisatie" },
  { id: "schemas", label: "Schema's" },
  { id: "config", label: "Configuratie" },
];

const NL_DATE = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric", month: "short" });
const NL_WEEKDAY = new Intl.DateTimeFormat("nl-NL", { weekday: "long", day: "numeric", month: "short" });

@customElement("puppy-tracker-panel")
export class PuppyTrackerPanel extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) narrow = false;

  @state() private _state?: State;
  @state() private _error = "";
  @state() private _tab: Tab = "vandaag";
  @state() private _defer?: { stepId: number; days: number };
  @state() private _taskForm = false;
  @state() private _protoForm = false;
  @state() private _stepForm?: number;
  @state() private _confirm?: { kind: "task" | "protocol"; id: number };

  private _timer?: number;
  private _loaded = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._timer = window.setInterval(() => this.requestUpdate(), 1000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timer) window.clearInterval(this._timer);
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass && !this._loaded) {
      this._loaded = true;
      void this._load();
    }
  }

  private async _ws<T = unknown>(type: string, payload: Record<string, unknown> = {}): Promise<T | undefined> {
    if (!this.hass) return undefined;
    try {
      return await this.hass.connection.sendMessagePromise<T>({ type: `puppy_tracker/${type}`, ...payload });
    } catch (e) {
      this._error = String((e as { message?: string })?.message ?? e);
      return undefined;
    }
  }

  private async _load(): Promise<void> {
    const s = await this._ws<State>("get_state");
    if (s && s.puppy !== undefined) this._state = s;
  }

  private _merge(partial: Partial<State> | undefined): void {
    if (!partial || !this._state) return;
    this._state = { ...this._state, ...partial };
  }

  // ---- Actions -----------------------------------------------------------

  private _toggleMenu(): void {
    this.dispatchEvent(new CustomEvent("hass-toggle-menu", { bubbles: true, composed: true }));
  }

  private async _markPee(): Promise<void> {
    const s = await this._ws<State>("mark_pee");
    if (s && s.puppy !== undefined) this._state = s;
  }

  private async _snoozePee(): Promise<void> {
    const s = await this._ws<State>("snooze_pee", { minutes: 30 });
    if (s && s.puppy !== undefined) this._state = s;
  }

  private async _toggleDaily(key: string, done: boolean): Promise<void> {
    const r = await this._ws<{ daily_checks: string[] }>("toggle_daily_check", { item_key: key, done });
    if (r) this._merge({ daily_checks: r.daily_checks });
  }

  private async _clearToday(): Promise<void> {
    const r = await this._ws<{ daily_checks: string[] }>("clear_daily_checks");
    if (r) this._merge({ daily_checks: r.daily_checks });
  }

  private async _toggleStep(step: Step): Promise<void> {
    const r = await this._ws<{ protocols: Protocol[] }>("set_step_done", { step_id: step.id, done: !step.done_at });
    if (r) this._merge({ protocols: r.protocols });
  }

  private async _applyDefer(): Promise<void> {
    if (!this._defer || this._defer.days === 0) {
      this._defer = undefined;
      return;
    }
    const { stepId, days } = this._defer;
    this._defer = undefined;
    const r = await this._ws<{ protocols: Protocol[] }>("defer_step", { step_id: stepId, days });
    if (r) this._merge({ protocols: r.protocols });
  }

  private async _toggleTask(task: Task): Promise<void> {
    const r = await this._ws<{ tasks: Task[] }>("set_task_done", { task_id: task.id, done: !task.done_at });
    if (r) this._merge({ tasks: r.tasks });
  }

  private async _removeTask(id: number): Promise<void> {
    this._confirm = undefined;
    const r = await this._ws<{ tasks: Task[] }>("remove_task", { task_id: id });
    if (r) this._merge({ tasks: r.tasks });
  }

  private async _submitTask(): Promise<void> {
    const title = (this.renderRoot.querySelector("#nt-title") as HTMLInputElement)?.value.trim();
    const date = (this.renderRoot.querySelector("#nt-date") as HTMLInputElement)?.value;
    if (!title) return;
    this._taskForm = false;
    const r = await this._ws<{ tasks: Task[] }>("add_task", { title, date: date || null });
    if (r) this._merge({ tasks: r.tasks });
  }

  private async _submitProtocol(): Promise<void> {
    const name = (this.renderRoot.querySelector("#np-name") as HTMLInputElement)?.value.trim();
    const start = (this.renderRoot.querySelector("#np-start") as HTMLInputElement)?.value;
    if (!name) return;
    this._protoForm = false;
    const r = await this._ws<{ protocols: Protocol[] }>("add_protocol", { name, anchor: "fixed", start_date: start || null });
    if (r) this._merge({ protocols: r.protocols });
  }

  private async _submitStep(pid: number): Promise<void> {
    const title = (this.renderRoot.querySelector("#ns-title") as HTMLInputElement)?.value.trim();
    const off = (this.renderRoot.querySelector("#ns-off") as HTMLInputElement)?.value;
    if (!title) return;
    this._stepForm = undefined;
    const r = await this._ws<{ protocols: Protocol[] }>("add_step", { protocol_id: pid, title, day_offset: parseInt(off || "0", 10) || 0 });
    if (r) this._merge({ protocols: r.protocols });
  }

  private async _removeProtocol(id: number): Promise<void> {
    this._confirm = undefined;
    const r = await this._ws<{ protocols: Protocol[] }>("remove_protocol", { protocol_id: id });
    if (r) this._merge({ protocols: r.protocols });
  }

  private async _saveConfig(): Promise<void> {
    const q = (id: string) => (this.renderRoot.querySelector(id) as HTMLInputElement)?.value ?? "";
    const s = await this._ws<State>("update_puppy", {
      name: q("#name"),
      birth_date: q("#birth") || null,
      homecoming_date: q("#home") || null,
      photo_url: q("#photo"),
    });
    if (s && s.puppy !== undefined) this._state = s;
  }

  // ---- Derived helpers ---------------------------------------------------

  private _fmt(date: string | null): string {
    if (!date) return "";
    return NL_DATE.format(new Date(date + "T00:00:00"));
  }

  private _isToday(d: string | null): boolean {
    return !!d && d === this._state?.today;
  }

  private _isPast(d: string | null): boolean {
    return !!d && !!this._state && d < this._state.today;
  }

  private _isNight(time: string): boolean {
    const s = this._state!;
    return time >= s.night.start || time < s.night.end;
  }

  private _ageText(): string {
    const days = this._state?.age_days;
    if (days == null) return "leeftijd onbekend";
    const w = Math.floor(days / 7);
    const d = days % 7;
    return `${w} ${w === 1 ? "week" : "weken"} & ${d} ${d === 1 ? "dag" : "dagen"} oud`;
  }

  private _countdown(): string {
    const np = this._state?.next_pee;
    if (!np) return "";
    const secs = Math.max(0, Math.round((new Date(np.at).getTime() - Date.now()) / 1000));
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `over ${h} u ${m} min` : `over ${m} min`;
  }

  private _restToday(): Step | undefined {
    const soc = this._state?.protocols.find((p) => p.seed_key === "socialization");
    return soc?.steps.find((st) => this._isToday(st.effective_date) && st.category === "rust");
  }

  private _todaySteps(): { protocol: Protocol; step: Step }[] {
    const out: { protocol: Protocol; step: Step }[] = [];
    for (const p of this._state?.protocols ?? []) {
      for (const st of p.steps) if (this._isToday(st.effective_date)) out.push({ protocol: p, step: st });
    }
    return out;
  }

  private _todayTasks(): Task[] {
    return (this._state?.tasks ?? []).filter((t) => this._isToday(t.date));
  }

  private _upcoming(): { date: string; color: string; icon: string; title: string; step?: Step }[] {
    const s = this._state;
    if (!s) return [];
    const end = new Date(s.today + "T00:00:00");
    end.setDate(end.getDate() + 7);
    const endStr = end.toISOString().slice(0, 10);
    const inRange = (d: string | null) => !!d && d >= s.today && d < endStr;
    const rows: { date: string; color: string; icon: string; title: string; step?: Step }[] = [];
    for (const t of s.tasks) {
      if (inRange(t.date)) rows.push({ date: t.date!, color: "var(--primary-color)", icon: "mdi:calendar-check", title: t.title });
    }
    for (const p of s.protocols) {
      for (const st of p.steps) {
        if (!inRange(st.effective_date)) continue;
        const cat = s.socialization_categories[st.category];
        rows.push({
          date: st.effective_date!,
          color: cat?.color ?? "var(--primary-color)",
          icon: cat?.icon ?? "mdi:flag-outline",
          title: p.seed_key === "socialization" ? st.title : `${st.title} — ${p.name}`,
          step: st,
        });
      }
    }
    rows.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    return rows;
  }

  private _deferControls(step: Step) {
    if (this._defer?.stepId === step.id) {
      return html`
        <span class="defer-inline">
          <input type="number" .value=${String(this._defer.days)}
            @input=${(e: Event) => (this._defer = { stepId: step.id, days: parseInt((e.target as HTMLInputElement).value, 10) || 0 })} />
          <span class="dagen">dagen</span>
          <button class="link" @click=${this._applyDefer}>Toepassen</button>
          <button class="link" @click=${() => (this._defer = undefined)}>Annuleer</button>
        </span>
      `;
    }
    return html`<button class="link" @click=${() => (this._defer = { stepId: step.id, days: 1 })}>Uitstellen…</button>`;
  }

  // ---- Render ------------------------------------------------------------

  render() {
    const s = this._state;
    return html`
      <div class="app">
        ${this._renderHeader()}
        ${this._error ? html`<div class="err">${this._error}</div>` : nothing}
        <div class="content">
          ${!s ? html`<div class="loading">Laden…</div>` : this._renderTab(s)}
        </div>
      </div>
    `;
  }

  private _renderHeader() {
    return html`
      <div class="topbar">
        <ha-icon-button class="menu" @click=${this._toggleMenu} title="Menu">
          <ha-icon icon="mdi:menu"></ha-icon>
        </ha-icon-button>
        <div class="title">Puppy Tracker</div>
      </div>
      <div class="tabs">
        ${TABS.map(
          (t) => html`<button class="tab ${this._tab === t.id ? "active" : ""}" @click=${() => (this._tab = t.id)}>${t.label}</button>`,
        )}
      </div>
    `;
  }

  private _renderTab(s: State): TemplateResult {
    switch (this._tab) {
      case "fases":
        return this._renderPhases(s);
      case "socialisatie":
        return this._renderSocialization(s);
      case "schemas":
        return this._renderSchedules(s);
      case "config":
        return this._renderConfig(s);
      default:
        return this._renderToday(s);
    }
  }

  // ---- Tab: Vandaag ------------------------------------------------------

  private _renderToday(s: State) {
    return html`
      ${this._renderHero(s)}
      <div class="cols ${this.narrow ? "narrow" : ""}">
        <div class="col-main">${this._renderDaySchedule(s)}</div>
        <div class="col-side">${this._renderUpcoming()}</div>
      </div>
    `;
  }

  private _renderHero(s: State) {
    const phase = s.phase;
    const photo = s.puppy?.photo_url;
    return html`
      <div class="hero">
        <div class="hero-photo">
          ${photo ? html`<img src=${photo} alt="foto" />` : html`<ha-icon icon="mdi:dog"></ha-icon>`}
        </div>
        <div class="hero-body">
          <div class="hero-name">${s.puppy?.name ?? "Puppy"}</div>
          <div class="hero-age">${this._ageText()}</div>
          ${phase
            ? html`
                <div class="hero-phase">
                  <span class="dot green"></span>
                  <strong>${phase.title}</strong>
                  <small>(${phase.week_start}-${phase.week_end} wkn)</small>
                </div>
                <div class="hero-focus">Focus: ${phase.focus.join(" · ")}</div>
              `
            : html`<div class="hero-focus">Stel een geboortedatum in bij Configuratie.</div>`}
          ${s.walk_minutes != null
            ? html`<div class="hero-rule">🐾 Berner-regel: 5-minutenregel — richtlijn ~${s.walk_minutes} min wandelen.</div>`
            : nothing}
          ${s.in_fear_period ? html`<div class="hero-fear">⚠ Angstperiode: nieuwe prikkels positief en rustig opbouwen.</div>` : nothing}
          <div class="pee">
            <span class="pee-text">
              Volgende plaspauze:
              <strong>${s.next_pee ? new Date(s.next_pee.at).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }) : "—"}</strong>
              ${s.next_pee ? html`<em>${this._countdown()} · ${s.next_pee.interval_hours}u interval</em>` : nothing}
            </span>
            <span class="pee-btns">
              <button class="chip" @click=${this._markPee}>Nu geplast</button>
              <button class="chip ghost" @click=${this._snoozePee}>+30 min</button>
            </span>
          </div>
        </div>
      </div>
    `;
  }

  private _renderDaySchedule(s: State) {
    const done = new Set(s.daily_checks);
    const rest = this._restToday();
    const steps = this._todaySteps();
    const tasks = this._todayTasks();
    return html`
      <section>
        <div class="sec-head">
          <h2><ha-icon icon="mdi:clock-outline"></ha-icon> Dagschema & taken (vandaag)</h2>
          <button class="ghost" @click=${this._clearToday}>Wis vandaag</button>
        </div>
        ${rest ? html`<div class="rest-banner">💥 Rustdag — ${rest.title}</div>` : nothing}
        <div class="schedule">
          ${s.daily_schedule.map((it) => {
            const t = s.schedule_types[it.type];
            const night = this._isNight(it.time);
            const checked = done.has(it.key);
            return html`
              <label class="row ${night ? "night" : ""} ${checked ? "checked" : ""}" style="--rc:${t?.color ?? "#888"}">
                <span class="time">${it.time}</span>
                <span class="bar"></span>
                <span class="row-main">
                  <span class="row-title">${it.label}</span>
                  ${it.note ? html`<span class="row-note">${it.note}</span>` : nothing}
                </span>
                <input type="checkbox" .checked=${checked}
                  @change=${(e: Event) => this._toggleDaily(it.key, (e.target as HTMLInputElement).checked)} />
              </label>
            `;
          })}
        </div>

        ${steps.length || tasks.length
          ? html`
              <div class="subhead">Taken & schema-stappen vandaag</div>
              <div class="today-items">
                ${tasks.map(
                  (t) => html`
                    <label class="row ${t.done_at ? "checked" : ""}" style="--rc:var(--primary-color)">
                      <ha-icon icon="mdi:calendar-check"></ha-icon>
                      <span class="row-main"><span class="row-title">${t.title}</span></span>
                      <input type="checkbox" .checked=${!!t.done_at} @change=${() => this._toggleTask(t)} />
                    </label>
                  `,
                )}
                ${steps.map(
                  ({ protocol, step }) => html`
                    <label class="row ${step.done_at ? "checked" : ""}" style="--rc:#a05ac0">
                      <ha-icon icon="mdi:flag-outline"></ha-icon>
                      <span class="row-main">
                        <span class="row-title">${step.title}</span>
                        <span class="row-note">${protocol.name}</span>
                      </span>
                      ${this._deferControls(step)}
                      <input type="checkbox" .checked=${!!step.done_at} @change=${() => this._toggleStep(step)} />
                    </label>
                  `,
                )}
              </div>
            `
          : nothing}
      </section>
    `;
  }

  private _renderUpcoming() {
    const rows = this._upcoming();
    let lastDate = "";
    return html`
      <section>
        <h2><ha-icon icon="mdi:calendar-star"></ha-icon> Belangrijke gebeurtenissen (deze week)</h2>
        ${rows.length === 0 ? html`<p class="muted">Niets gepland deze week.</p>` : nothing}
        <div class="events">
          ${rows.map((r) => {
            const header = r.date !== lastDate;
            lastDate = r.date;
            return html`
              ${header ? html`<div class="ev-date">${NL_WEEKDAY.format(new Date(r.date + "T00:00:00"))}</div>` : nothing}
              <div class="ev">
                <span class="dot" style="background:${r.color}"></span>
                <ha-icon icon=${r.icon}></ha-icon>
                <span class="ev-title">${r.title}</span>
              </div>
            `;
          })}
        </div>
      </section>
    `;
  }

  // ---- Tab: Fases --------------------------------------------------------

  private _renderPhases(s: State) {
    return html`
      <section>
        <h2>Fases</h2>
        ${s.phases.map((p) => {
          const active = s.phase?.key === p.key;
          return html`
            <details class="phase" ?open=${active}>
              <summary>
                <span>${p.title} <small>(${p.week_start}-${p.week_end} wkn)</small></span>
                ${active ? html`<span class="badge">Nu</span>` : nothing}
              </summary>
              <div class="phase-body">
                <ul class="focus">${p.focus.map((f) => html`<li>${f}</li>`)}</ul>
                <div class="cards">
                  ${p.info_cards.map(
                    (c) => html`
                      <div class="info-card">
                        <h4><ha-icon icon=${c.icon}></ha-icon> ${c.title}</h4>
                        <ul>${c.items.map((i) => html`<li>${i}</li>`)}</ul>
                      </div>
                    `,
                  )}
                </div>
              </div>
            </details>
          `;
        })}
      </section>
    `;
  }

  // ---- Tab: Socialisatie -------------------------------------------------

  private _renderSocialization(s: State) {
    const proto = s.protocols.find((p) => p.seed_key === "socialization");
    if (!proto) return html`<section><p class="muted">Geen socialisatieprogramma. Stel een thuiskomstdatum in.</p></section>`;
    return html`
      <section>
        <h2>Socialisatie <small class="muted">(7-12 weken · vanaf thuiskomst)</small></h2>
        <div class="legend">
          ${Object.entries(s.socialization_categories).map(
            ([, c]) => html`<span class="tag"><span class="dot" style="background:${c.color}"></span>${c.label}</span>`,
          )}
        </div>
        <div class="socia">${proto.steps.map((st) => this._renderSocDay(s, st))}</div>
      </section>
    `;
  }

  private _renderSocDay(s: State, st: Step) {
    const cat = s.socialization_categories[st.category];
    const today = this._isToday(st.effective_date);
    const past = this._isPast(st.effective_date);
    return html`
      <div class="soc-day ${today ? "today" : ""} ${past ? "past" : ""} ${st.done_at ? "done" : ""}"
        style="border-left-color:${cat?.color ?? "#888"}">
        <div class="soc-top">
          <span class="soc-date">${this._fmt(st.effective_date)}</span>
          <input type="checkbox" .checked=${!!st.done_at} @change=${() => this._toggleStep(st)} />
        </div>
        <div class="soc-act">${st.title}</div>
        ${st.notes ? html`<div class="soc-note">${st.notes}</div>` : nothing}
        ${this._deferControls(st)}
      </div>
    `;
  }

  // ---- Tab: Schema's -----------------------------------------------------

  private _renderSchedules(s: State) {
    const protos = s.protocols.filter((p) => p.seed_key !== "socialization");
    return html`
      <section>
        <div class="sec-head">
          <h2>Schema's & taken</h2>
          <span>
            <button class="ghost" @click=${() => { this._taskForm = !this._taskForm; this._protoForm = false; }}>+ Taak</button>
            <button class="ghost" @click=${() => { this._protoForm = !this._protoForm; this._taskForm = false; }}>+ Schema</button>
          </span>
        </div>

        ${this._taskForm
          ? html`<div class="inline-form">
              <input id="nt-title" type="text" placeholder="Titel (bv. Dierenarts)" />
              <input id="nt-date" type="date" .value=${s.today} />
              <button class="primary" @click=${this._submitTask}>Toevoegen</button>
              <button class="link" @click=${() => (this._taskForm = false)}>Annuleer</button>
            </div>`
          : nothing}
        ${this._protoForm
          ? html`<div class="inline-form">
              <input id="np-name" type="text" placeholder="Naam schema" />
              <input id="np-start" type="date" .value=${s.today} />
              <button class="primary" @click=${this._submitProtocol}>Toevoegen</button>
              <button class="link" @click=${() => (this._protoForm = false)}>Annuleer</button>
            </div>`
          : nothing}

        ${s.tasks.length
          ? html`<div class="tasks">
              ${s.tasks.map(
                (t) => html`
                  <div class="task ${t.done_at ? "done" : ""}">
                    <input type="checkbox" .checked=${!!t.done_at} @change=${() => this._toggleTask(t)} />
                    <span class="task-main">
                      <span class="task-title">${t.title}</span>
                      ${t.date ? html`<span class="task-date">${this._fmt(t.date)}</span>` : nothing}
                    </span>
                    ${this._confirm?.kind === "task" && this._confirm.id === t.id
                      ? html`<span class="confirm">Zeker?
                          <button class="link danger" @click=${() => this._removeTask(t.id)}>Ja</button>
                          <button class="link" @click=${() => (this._confirm = undefined)}>Nee</button></span>`
                      : html`<button class="link danger" @click=${() => (this._confirm = { kind: "task", id: t.id })}>×</button>`}
                  </div>
                `,
              )}
            </div>`
          : nothing}

        ${protos.map(
          (p) => html`
            <div class="proto">
              <div class="proto-head">
                <strong>${p.name}</strong>
                <span>
                  <button class="link" @click=${() => (this._stepForm = this._stepForm === p.id ? undefined : p.id)}>+ Stap</button>
                  ${this._confirm?.kind === "protocol" && this._confirm.id === p.id
                    ? html`<span class="confirm">Zeker?
                        <button class="link danger" @click=${() => this._removeProtocol(p.id)}>Ja</button>
                        <button class="link" @click=${() => (this._confirm = undefined)}>Nee</button></span>`
                    : html`<button class="link danger" @click=${() => (this._confirm = { kind: "protocol", id: p.id })}>Verwijderen</button>`}
                </span>
              </div>
              ${p.notes ? html`<div class="proto-note">${p.notes}</div>` : nothing}
              ${this._stepForm === p.id
                ? html`<div class="inline-form">
                    <input id="ns-title" type="text" placeholder="Titel van de stap" />
                    <input id="ns-off" type="number" placeholder="dag-offset" .value=${String(p.steps.length)} />
                    <button class="primary" @click=${() => this._submitStep(p.id)}>Toevoegen</button>
                    <button class="link" @click=${() => (this._stepForm = undefined)}>Annuleer</button>
                  </div>`
                : nothing}
              <div class="steps">
                ${p.steps.map(
                  (st) => html`
                    <div class="step ${this._isToday(st.effective_date) ? "today" : ""} ${st.done_at ? "done" : ""}">
                      <input type="checkbox" .checked=${!!st.done_at} @change=${() => this._toggleStep(st)} />
                      <span class="step-date">${this._fmt(st.effective_date)}</span>
                      <span class="step-title">${st.title}</span>
                      ${this._deferControls(st)}
                    </div>
                  `,
                )}
              </div>
            </div>
          `,
        )}
      </section>
    `;
  }

  // ---- Tab: Configuratie -------------------------------------------------

  private _renderConfig(s: State) {
    const p = s.puppy;
    return html`
      <section>
        <h2>Configuratie</h2>
        <div class="settings">
          <label>Naam<input type="text" id="name" .value=${p?.name ?? ""} /></label>
          <label>Geboortedatum<input type="date" id="birth" .value=${p?.birth_date ?? ""} /></label>
          <label>Thuiskomstdatum<input type="date" id="home" .value=${p?.homecoming_date ?? ""} /></label>
          <label>Foto-URL (optioneel)<input type="text" id="photo" placeholder="https://… of /local/beer.jpg" .value=${p?.photo_url ?? ""} /></label>
          <button class="primary" @click=${this._saveConfig}>Opslaan</button>
          <p class="muted">Bij het wijzigen van de thuiskomstdatum schuift het socialisatie- en benchschema automatisch mee.</p>
        </div>
      </section>
    `;
  }

  static styles = css`
    :host { display: block; color: var(--primary-text-color); background: var(--primary-background-color); min-height: 100vh; }
    .app { display: flex; flex-direction: column; min-height: 100vh; }

    .topbar { display: flex; align-items: center; gap: 8px; height: 56px; padding: 0 12px; background: var(--app-header-background-color, var(--primary-color)); color: var(--app-header-text-color, var(--text-primary-color, #fff)); }
    .topbar .title { font-size: 1.2rem; font-weight: 500; }
    .menu { --mdc-icon-button-size: 40px; color: inherit; background: none; border: none; cursor: pointer; }

    .tabs { display: flex; gap: 4px; background: var(--app-header-background-color, var(--primary-color)); padding: 0 8px; overflow-x: auto; }
    .tab { background: none; border: none; color: var(--app-header-text-color, #fff); opacity: .8; padding: 12px 16px; cursor: pointer; font: inherit; border-bottom: 3px solid transparent; white-space: nowrap; }
    .tab.active { opacity: 1; border-bottom-color: var(--app-header-text-color, #fff); font-weight: 600; }

    .content { padding: 16px; max-width: 1100px; width: 100%; margin: 0 auto; box-sizing: border-box; }
    .loading { padding: 40px; text-align: center; opacity: .6; }
    .err { background: var(--error-color, #b00020); color: #fff; padding: 8px 12px; }
    .muted { opacity: .6; }

    section { background: var(--card-background-color); border-radius: 14px; padding: 14px 16px; margin-bottom: 14px; box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,.1)); }
    .sec-head { display: flex; align-items: center; justify-content: space-between; }
    h2 { font-size: 1.05rem; margin: 0 0 10px; display: flex; align-items: center; gap: 6px; }
    h4 { margin: 0 0 6px; font-size: .9rem; display: flex; align-items: center; gap: 6px; }
    .subhead { font-weight: 600; margin: 14px 0 6px; opacity: .85; }

    button { font: inherit; cursor: pointer; border-radius: 8px; border: none; padding: 6px 10px; }
    button.ghost { background: transparent; border: 1px solid var(--divider-color, #ccc); color: inherit; }
    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    button.link { background: none; border: none; color: var(--primary-color); padding: 2px 4px; font-size: .8rem; }
    button.link.danger { color: var(--error-color, #b00020); }
    .chip { border-radius: 999px; padding: 6px 14px; background: var(--primary-color); color: var(--text-primary-color, #fff); border: none; }
    .chip.ghost { background: transparent; border: 1px solid var(--primary-color); color: var(--primary-color); }

    /* Hero */
    .hero { display: flex; gap: 16px; background: var(--card-background-color); border-radius: 14px; padding: 16px; margin-bottom: 14px; box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0,0,0,.12)); }
    .hero-photo { flex: 0 0 auto; width: 128px; height: 128px; border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 40%, #000)); color: #fff; }
    .hero-photo img { width: 100%; height: 100%; object-fit: cover; }
    .hero-photo ha-icon { --mdc-icon-size: 64px; }
    .hero-body { flex: 1; min-width: 0; }
    .hero-name { font-size: 1.5rem; font-weight: 700; }
    .hero-age { opacity: .7; margin-bottom: 8px; }
    .hero-phase { display: flex; align-items: center; gap: 6px; }
    .hero-phase small { opacity: .6; }
    .hero-focus { font-size: .9rem; opacity: .85; margin: 2px 0; }
    .hero-rule { font-size: .85rem; margin-top: 6px; }
    .hero-fear { font-size: .85rem; color: var(--warning-color, #ffa600); margin-top: 4px; }
    .pee { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--divider-color, #eee); }
    .pee-text em { font-style: normal; opacity: .7; font-size: .85rem; margin-left: 6px; }
    .pee-btns { display: flex; gap: 8px; }

    .dot { width: 10px; height: 10px; border-radius: 50%; flex: 0 0 auto; display: inline-block; }
    .dot.green { background: #43a047; }

    /* Two columns */
    .cols { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; align-items: start; }
    .cols.narrow { grid-template-columns: 1fr; }

    /* Schedule rows */
    .schedule, .today-items { display: flex; flex-direction: column; gap: 2px; }
    .row { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 8px; border-left: 4px solid var(--rc, #888); }
    .row.night { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
    .row.checked .row-title { text-decoration: line-through; opacity: .5; }
    .row .time { font-variant-numeric: tabular-nums; width: 44px; opacity: .8; font-size: .9rem; }
    .row .bar { display: none; }
    .row-main { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .row-title { font-weight: 500; }
    .row-note { font-size: .78rem; opacity: .65; }
    input[type="checkbox"] { width: 20px; height: 20px; accent-color: var(--primary-color); flex: 0 0 auto; }
    .rest-banner { background: color-mix(in srgb, #c8863b 22%, transparent); border-radius: 8px; padding: 8px 12px; font-weight: 600; margin-bottom: 8px; }

    /* Events */
    .events { display: flex; flex-direction: column; gap: 4px; }
    .ev-date { font-weight: 600; margin-top: 10px; font-size: .85rem; text-transform: capitalize; }
    .ev { display: flex; align-items: center; gap: 8px; padding: 4px 2px; }
    .ev-title { font-size: .9rem; }

    /* Phases */
    details.phase, details { margin-bottom: 8px; }
    summary { cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-weight: 600; padding: 6px 0; list-style: none; }
    summary::-webkit-details-marker { display: none; }
    summary small { font-weight: 400; opacity: .6; }
    .badge { background: var(--primary-color); color: var(--text-primary-color, #fff); border-radius: 999px; font-size: .7rem; padding: 2px 8px; }
    .focus { margin: 4px 0 10px; padding-left: 18px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; }
    .info-card { background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); border-radius: 10px; padding: 10px 12px; }
    .info-card ul { margin: 0; padding-left: 16px; font-size: .82rem; }

    /* Socialization */
    .legend { display: flex; flex-wrap: wrap; gap: 10px; margin: 6px 0 10px; font-size: .78rem; }
    .tag { display: inline-flex; align-items: center; gap: 5px; }
    .socia { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; }
    .soc-day { border-left: 4px solid #888; background: color-mix(in srgb, var(--primary-text-color) 4%, transparent); border-radius: 8px; padding: 8px 10px; }
    .soc-day.past { opacity: .5; }
    .soc-day.today { outline: 2px solid var(--error-color, #d33); }
    .soc-day.done .soc-act { text-decoration: line-through; }
    .soc-top { display: flex; justify-content: space-between; align-items: center; }
    .soc-date { font-size: .75rem; opacity: .7; }
    .soc-act { font-weight: 600; font-size: .85rem; margin: 2px 0; }
    .soc-note { font-size: .75rem; opacity: .7; }

    /* Schedules */
    .tasks { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
    .task, .step { display: flex; align-items: center; gap: 8px; padding: 4px 6px; border-radius: 8px; }
    .task.done .task-title, .step.done .step-title { text-decoration: line-through; opacity: .5; }
    .task-main { display: flex; gap: 8px; align-items: baseline; flex: 1; }
    .task-date, .step-date { font-size: .75rem; opacity: .7; font-variant-numeric: tabular-nums; }
    .step-title { flex: 1; }
    .step.today { background: color-mix(in srgb, var(--error-color, #d33) 12%, transparent); }
    .proto { border: 1px solid var(--divider-color, #ddd); border-radius: 10px; padding: 10px; margin-top: 10px; }
    .proto-head { display: flex; justify-content: space-between; align-items: center; }
    .proto-note { font-size: .8rem; opacity: .7; margin: 4px 0; }
    .steps { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; }

    .defer-inline { display: inline-flex; align-items: center; gap: 4px; }
    .defer-inline input { width: 56px; padding: 4px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; }
    .defer-inline .dagen { font-size: .78rem; opacity: .7; }
    .confirm { font-size: .8rem; display: inline-flex; align-items: center; gap: 4px; }
    .inline-form { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0; padding: 10px; border: 1px dashed var(--divider-color, #ccc); border-radius: 10px; }
    .inline-form input[type="text"] { flex: 1; min-width: 160px; }
    .inline-form input { padding: 8px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; }

    /* Config */
    .settings { display: flex; flex-direction: column; gap: 10px; max-width: 360px; }
    .settings label { display: flex; flex-direction: column; font-size: .85rem; gap: 4px; }
    .settings input { padding: 8px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; }
  `;
}
