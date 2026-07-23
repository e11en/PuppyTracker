import { LitElement, html, css, PropertyValues, nothing, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";

interface PhaseDraft {
  title: string;
  week_start: number;
  week_end: number;
  pee_interval_hours: number;
  focusText: string;
  cards: { title: string; icon: string; itemsText: string }[];
}

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
  id: number;
  phase_key: string;
  seq: number;
  time: string;
  type: string;
  label: string;
  notes: string;
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
  schedules: Record<string, ScheduleItem[]>;
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
const NL_DAY = new Intl.DateTimeFormat("nl-NL", { weekday: "short", day: "numeric" });

// Day-view timeline geometry. The day runs from DAY_START_HOUR for 24h.
const DAY_START_HOUR = 7;
const HOUR_H = 60; // px per hour (keep in sync with CSS night-band height)

function minsFromStart(h: number, m: number): number {
  let mins = h * 60 + m - DAY_START_HOUR * 60;
  if (mins < 0) mins += 24 * 60;
  return mins;
}

function timeToMins(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return minsFromStart(h, m);
}

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
  @state() private _editStep?: number;
  @state() private _editProto?: number;
  @state() private _schedForm?: string; // phase key we're adding an item to
  @state() private _editSched?: number; // schedule item id being edited
  @state() private _socAddWeek?: number; // socialization week index we're adding to
  @state() private _editPhase?: string; // phase key being edited
  @state() private _phaseDraft?: PhaseDraft;
  @state() private _confirm?: { kind: "task" | "protocol" | "step"; id: number };

  private _timer?: number;
  private _loaded = false;
  private _didScroll = false;

  connectedCallback(): void {
    super.connectedCallback();
    this._timer = window.setInterval(() => this.requestUpdate(), 1000);
    const saved = localStorage.getItem("pt-tab") as Tab | null;
    if (saved && TABS.some((t) => t.id === saved)) this._tab = saved;
  }

  private _selectTab(id: Tab): void {
    this._tab = id;
    if (id === "vandaag") this._didScroll = false;
    try {
      localStorage.setItem("pt-tab", id);
    } catch {
      /* ignore storage errors */
    }
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
    if (this._tab === "vandaag" && this._state && !this._didScroll) {
      const el = this.renderRoot.querySelector(".timeline-scroll") as HTMLElement | null;
      if (el && el.clientHeight > 0) {
        const now = new Date();
        const top = (minsFromStart(now.getHours(), now.getMinutes()) / 60) * HOUR_H;
        el.scrollTop = Math.max(0, top - el.clientHeight / 2);
        this._didScroll = true;
      }
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
    const q = (id: string) => (this.renderRoot.querySelector(id) as HTMLInputElement)?.value ?? "";
    const name = q("#np-name").trim();
    if (!name) return;
    this._protoForm = false;
    const r = await this._ws<{ protocols: Protocol[] }>("add_protocol", {
      name,
      anchor: "fixed",
      start_date: q("#np-start") || null,
      notes: q("#np-notes"),
    });
    if (r) this._merge({ protocols: r.protocols });
  }

  private async _submitProtoEdit(p: Protocol): Promise<void> {
    const q = (id: string) => (this.renderRoot.querySelector(id) as HTMLInputElement)?.value ?? "";
    const name = q("#ep-name").trim();
    if (!name) return;
    this._editProto = undefined;
    const r = await this._ws<{ protocols: Protocol[] }>("update_protocol", {
      protocol_id: p.id,
      name,
      start_date: q("#ep-start") || null,
      notes: q("#ep-notes"),
    });
    if (r) this._merge({ protocols: r.protocols });
  }

  private async _submitStep(p: Protocol): Promise<void> {
    const title = (this.renderRoot.querySelector("#ns-title") as HTMLInputElement)?.value.trim();
    const dateStr = (this.renderRoot.querySelector("#ns-date") as HTMLInputElement)?.value;
    if (!title) return;
    this._stepForm = undefined;
    const off = this._dateToOffset(p.start_date, dateStr);
    const r = await this._ws<{ protocols: Protocol[] }>("add_step", {
      protocol_id: p.id,
      title,
      day_offset: off ?? 0,
    });
    if (r) this._merge({ protocols: r.protocols });
  }

  private async _removeProtocol(id: number): Promise<void> {
    this._confirm = undefined;
    const r = await this._ws<{ protocols: Protocol[] }>("remove_protocol", { protocol_id: id });
    if (r) this._merge({ protocols: r.protocols });
  }

  private _isoLocal(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  private _nextStepDate(p: Protocol, today: string): string {
    const last = p.steps.length ? p.steps[p.steps.length - 1].effective_date : null;
    if (last) {
      const d = new Date(last + "T00:00:00");
      d.setDate(d.getDate() + 1);
      return this._isoLocal(d);
    }
    return p.start_date ?? today;
  }

  private _dateToOffset(startDate: string | null, dateStr: string): number | null {
    if (!startDate || !dateStr) return null;
    const s = new Date(startDate + "T00:00:00").getTime();
    const d = new Date(dateStr + "T00:00:00").getTime();
    return Math.round((d - s) / 86400000);
  }

  private async _submitStepEdit(step: Step, protocol: Protocol): Promise<void> {
    const title = (this.renderRoot.querySelector("#es-title") as HTMLInputElement)?.value.trim();
    const dateStr = (this.renderRoot.querySelector("#es-date") as HTMLInputElement)?.value;
    const notes = (this.renderRoot.querySelector("#es-notes") as HTMLInputElement)?.value ?? "";
    const catEl = this.renderRoot.querySelector("#es-cat") as HTMLSelectElement | null;
    const dayEl = this.renderRoot.querySelector("#es-day") as HTMLSelectElement | null;
    if (!title) return;
    const off = this._dateToOffset(protocol.start_date, dateStr);
    this._editStep = undefined;
    const payload: Record<string, unknown> = { step_id: step.id, title, notes };
    if (dayEl) payload.day_offset = parseInt(dayEl.value, 10);
    else if (off !== null) payload.day_offset = off;
    if (catEl) payload.category = catEl.value;
    const r = await this._ws<{ protocols: Protocol[] }>("update_step", payload);
    if (r) this._merge({ protocols: r.protocols });
  }

  private _socCatOptions(s: State, selected: string) {
    return Object.entries(s.socialization_categories).map(
      ([key, c]) => html`<option value=${key} ?selected=${key === selected}>${c.label}</option>`,
    );
  }

  private _dateForOffset(startDate: string | null, offset: number): string | null {
    if (!startDate) return null;
    const d = new Date(startDate + "T00:00:00");
    d.setDate(d.getDate() + offset);
    return this._isoLocal(d);
  }

  private _weekDayOptions(proto: Protocol, weekIndex: number, selectedOffset: number) {
    return Array.from({ length: 7 }, (_, d) => {
      const off = weekIndex * 7 + d;
      const date = this._dateForOffset(proto.start_date, off);
      const label = date ? this._dayLabel(date) : `Dag ${d + 1}`;
      return html`<option value=${off} ?selected=${off === selectedOffset}>${label}</option>`;
    });
  }

  private async _submitSocAdd(proto: Protocol, weekIndex: number): Promise<void> {
    const title = (this.renderRoot.querySelector("#sa-title") as HTMLInputElement)?.value.trim();
    const cat = (this.renderRoot.querySelector("#sa-cat") as HTMLSelectElement)?.value ?? "omgeving";
    const dayEl = this.renderRoot.querySelector("#sa-day") as HTMLSelectElement | null;
    if (!title) return;
    this._socAddWeek = undefined;
    const r = await this._ws<{ protocols: Protocol[] }>("add_step", {
      protocol_id: proto.id,
      title,
      category: cat,
      day_offset: dayEl ? parseInt(dayEl.value, 10) : weekIndex * 7,
      check_mode: "milestone",
    });
    if (r) this._merge({ protocols: r.protocols });
  }

  private async _submitSchedItem(phaseKey: string): Promise<void> {
    const q = (id: string) => (this.renderRoot.querySelector(id) as HTMLInputElement)?.value ?? "";
    const time = q("#sc-time");
    const label = q("#sc-label").trim();
    if (!time || !label) return;
    this._schedForm = undefined;
    const r = await this._ws<{ schedules: Record<string, ScheduleItem[]> }>("add_schedule_item", {
      phase_key: phaseKey,
      time,
      label,
      item_type: q("#sc-type") || "rust",
      notes: q("#sc-notes"),
    });
    if (r) this._merge({ schedules: r.schedules });
  }

  private async _submitSchedEdit(item: ScheduleItem): Promise<void> {
    const q = (id: string) => (this.renderRoot.querySelector(id) as HTMLInputElement)?.value ?? "";
    const label = q("#se-label").trim();
    const time = q("#se-time");
    if (!time || !label) return;
    this._editSched = undefined;
    const r = await this._ws<{ schedules: Record<string, ScheduleItem[]> }>("update_schedule_item", {
      item_id: item.id,
      time,
      label,
      item_type: q("#se-type"),
      notes: q("#se-notes"),
    });
    if (r) this._merge({ schedules: r.schedules });
  }

  private async _removeSchedItem(id: number): Promise<void> {
    const r = await this._ws<{ schedules: Record<string, ScheduleItem[]> }>("remove_schedule_item", { item_id: id });
    if (r) this._merge({ schedules: r.schedules });
  }

  private async _saveConfig(): Promise<void> {
    const q = (id: string) => (this.renderRoot.querySelector(id) as HTMLInputElement)?.value ?? "";
    // photo_url is omitted so the backend keeps the existing photo.
    const s = await this._ws<State>("update_puppy", {
      name: q("#name"),
      birth_date: q("#birth") || null,
      homecoming_date: q("#home") || null,
    });
    if (s && s.puppy !== undefined) this._state = s;
  }

  private async _savePhoto(dataUrl: string): Promise<void> {
    const s = await this._ws<State>("update_puppy", { photo_url: dataUrl });
    if (s && s.puppy !== undefined) this._state = s;
  }

  private _onPhotoFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 400;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        void this._savePhoto(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    input.value = "";
  }

  // ---- Derived helpers ---------------------------------------------------

  private _fmt(date: string | null): string {
    if (!date) return "";
    return NL_DATE.format(new Date(date + "T00:00:00"));
  }

  private _dayLabel(date: string | null): string {
    if (!date) return "";
    return NL_DAY.format(new Date(date + "T00:00:00"));
  }

  private _isToday(d: string | null): boolean {
    return !!d && d === this._state?.today;
  }

  private _ageText(): string {
    const days = this._state?.age_days;
    if (days == null) return "leeftijd onbekend";
    const w = Math.floor(days / 7);
    const d = days % 7;
    return `${w} ${w === 1 ? "week" : "weken"} & ${d} ${d === 1 ? "dag" : "dagen"} oud`;
  }

  private _countdownTo(at: Date): string {
    const secs = Math.max(0, Math.round((at.getTime() - Date.now()) / 1000));
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return h > 0 ? `over ${h} u ${m} min` : `over ${m} min`;
  }

  /** Next pee = the first 'plassen' item in the active-phase schedule after now. */
  private _nextPee(s: State): { time: string; at: Date } | null {
    const sched = (s.phase && s.schedules[s.phase.key]) || [];
    const pees = sched.filter((it) => it.type === "plassen");
    if (!pees.length) return null;
    const now = new Date();
    const nowMins = minsFromStart(now.getHours(), now.getMinutes());
    const sorted = pees.map((p) => ({ p, mins: timeToMins(p.time) })).sort((a, b) => a.mins - b.mins);
    let pick = sorted.find((x) => x.mins > nowMins);
    let extra = 0;
    if (!pick) {
      pick = sorted[0];
      extra = 1440; // wrap to the next day's first pee
    }
    const anchor = new Date(now);
    anchor.setHours(DAY_START_HOUR, 0, 0, 0);
    if (now.getHours() < DAY_START_HOUR) anchor.setDate(anchor.getDate() - 1);
    const at = new Date(anchor.getTime() + (pick.mins + extra) * 60000);
    return { time: pick.p.time, at };
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
          (t) => html`<button class="tab ${this._tab === t.id ? "active" : ""}" @click=${() => this._selectTab(t.id)}>${t.label}</button>`,
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
          ${s.in_fear_period ? html`<div class="hero-fear">⚠ Angstperiode: nieuwe prikkels positief en rustig opbouwen.</div>` : nothing}
          ${(() => {
            const np = this._nextPee(s);
            return html`
              <div class="pee">
                <span class="pee-text">
                  Volgende plaspauze:
                  <strong>${np ? np.time : "—"}</strong>
                  ${np ? html`<em>${this._countdownTo(np.at)}</em>` : nothing}
                </span>
              </div>
            `;
          })()}
        </div>
      </div>
    `;
  }

  private _renderDaySchedule(s: State) {
    const done = new Set(s.daily_checks);
    const rest = this._restToday();
    const steps = this._todaySteps();
    const tasks = this._todayTasks();

    const totalH = 24 * HOUR_H;
    const now = new Date();
    const nowTop = (minsFromStart(now.getHours(), now.getMinutes()) / 60) * HOUR_H;

    // Schedule for the active phase (falls back to empty if no phase yet).
    const schedule = (s.phase && s.schedules[s.phase.key]) || [];

    // Place items by exact time, pushing down to avoid overlap when clustered.
    const ITEM_H = 26;
    const sorted = [...schedule].sort((a, b) => timeToMins(a.time) - timeToMins(b.time));
    let lastBottom = -100;
    const placed = sorted.map((it) => {
      let top = (timeToMins(it.time) / 60) * HOUR_H;
      if (top < lastBottom + 2) top = lastBottom + 2;
      lastBottom = top + ITEM_H;
      return { it, top };
    });

    const hours = Array.from({ length: 24 }, (_, i) => {
      const hour = (DAY_START_HOUR + i) % 24;
      return { hour, night: hour >= 22 || hour < 6, top: i * HOUR_H };
    });

    return html`
      <section>
        <div class="sec-head">
          <h2><ha-icon icon="mdi:clock-outline"></ha-icon> Dagschema & taken (vandaag)</h2>
          <button class="ghost" @click=${this._clearToday}>Wis vandaag</button>
        </div>
        ${rest ? html`<div class="rest-banner">💥 Rustdag — ${rest.title}</div>` : nothing}
        <div class="timeline-scroll">
          <div class="timeline" style="height:${totalH}px">
            ${hours.map(
              (h) => html`
                <div class="hour-line ${h.night ? "night" : ""}" style="top:${h.top}px">
                  <span class="hour-label">${String(h.hour).padStart(2, "0")}:00</span>
                </div>
              `,
            )}
            ${placed.map(({ it, top }) => {
              const t = s.schedule_types[it.type];
              const key = String(it.id);
              const checked = done.has(key);
              return html`
                <div class="tl-item ${checked ? "checked" : ""}" style="top:${top}px;--rc:${t?.color ?? "#888"}" title=${it.notes || it.label}>
                  <span class="tl-time">${it.time}</span>
                  <span class="tl-label">${it.label}</span>
                  <input type="checkbox" .checked=${checked}
                    @change=${(e: Event) => this._toggleDaily(key, (e.target as HTMLInputElement).checked)} />
                </div>
              `;
            })}
            <div class="now-line" style="top:${nowTop}px">
              <span class="now-dot"></span>
              <span class="now-time">${now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
          </div>
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
                ${this._editPhase === p.key
                  ? this._renderPhaseEditForm(p)
                  : html`
                      <div class="phase-toolbar">
                        <button class="icon-link" title="Fase bewerken" @click=${() => this._startPhaseEdit(p)}>
                          <ha-icon icon="mdi:pencil"></ha-icon><span class="lbl">Fase bewerken</span>
                        </button>
                      </div>
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
                    `}
                ${this._renderPhaseSchedule(s, p)}
              </div>
            </details>
          `;
        })}
      </section>
    `;
  }

  private _startPhaseEdit(p: Phase): void {
    this._editPhase = p.key;
    this._phaseDraft = {
      title: p.title,
      week_start: p.week_start,
      week_end: p.week_end,
      pee_interval_hours: p.pee_interval_hours,
      focusText: (p.focus ?? []).join("\n"),
      cards: (p.info_cards ?? []).map((c) => ({
        title: c.title,
        icon: c.icon,
        itemsText: (c.items ?? []).join("\n"),
      })),
    };
  }

  private _pd(patch: Partial<PhaseDraft>): void {
    this._phaseDraft = { ...this._phaseDraft!, ...patch };
  }

  private _pdCard(i: number, patch: Partial<{ title: string; icon: string; itemsText: string }>): void {
    const cards = [...this._phaseDraft!.cards];
    cards[i] = { ...cards[i], ...patch };
    this._phaseDraft = { ...this._phaseDraft!, cards };
  }

  private _pdAddCard(): void {
    this._phaseDraft = {
      ...this._phaseDraft!,
      cards: [...this._phaseDraft!.cards, { title: "", icon: "mdi:information-outline", itemsText: "" }],
    };
  }

  private _pdRemoveCard(i: number): void {
    this._phaseDraft = {
      ...this._phaseDraft!,
      cards: this._phaseDraft!.cards.filter((_, j) => j !== i),
    };
  }

  private async _submitPhaseEdit(key: string): Promise<void> {
    const d = this._phaseDraft;
    if (!d) return;
    const focus = d.focusText.split("\n").map((t) => t.trim()).filter(Boolean);
    const info_cards = d.cards
      .map((c) => ({
        title: c.title.trim(),
        icon: c.icon.trim() || "mdi:information-outline",
        items: c.itemsText.split("\n").map((t) => t.trim()).filter(Boolean),
      }))
      .filter((c) => c.title || c.items.length);
    this._editPhase = undefined;
    this._phaseDraft = undefined;
    const st = await this._ws<State>("update_phase", {
      key,
      title: d.title,
      week_start: d.week_start,
      week_end: d.week_end,
      pee_interval_hours: d.pee_interval_hours,
      focus,
      info_cards,
    });
    if (st && st.puppy !== undefined) this._state = st;
  }

  private _renderPhaseEditForm(p: Phase) {
    const d = this._phaseDraft;
    if (!d) return nothing;
    const val = (e: Event) => (e.target as HTMLInputElement).value;
    return html`
      <div class="phase-edit">
        <label class="fld grow">Titel
          <input type="text" .value=${live(d.title)} @input=${(e: Event) => this._pd({ title: val(e) })} />
        </label>
        <div class="row3">
          <label class="fld">Vanaf (wk)
            <input type="number" .value=${live(String(d.week_start))} @input=${(e: Event) => this._pd({ week_start: parseInt(val(e), 10) || 0 })} />
          </label>
          <label class="fld">Tot (wk)
            <input type="number" .value=${live(String(d.week_end))} @input=${(e: Event) => this._pd({ week_end: parseInt(val(e), 10) || 0 })} />
          </label>
          <label class="fld">Plas-interval (u)
            <input type="number" .value=${live(String(d.pee_interval_hours))} @input=${(e: Event) => this._pd({ pee_interval_hours: parseInt(val(e), 10) || 1 })} />
          </label>
        </div>
        <label class="fld grow">Focuspunten (één per regel)
          <textarea rows="4" .value=${live(d.focusText)} @input=${(e: Event) => this._pd({ focusText: (e.target as HTMLTextAreaElement).value })}></textarea>
        </label>
        <div class="cards-edit">
          <div class="ce-head"><strong>Info-kaarten</strong><button class="link" @click=${this._pdAddCard}>+ kaart</button></div>
          ${d.cards.map(
            (c, i) => html`
              <div class="ce-card">
                <div class="ce-row">
                  <input type="text" placeholder="Titel" .value=${live(c.title)} @input=${(e: Event) => this._pdCard(i, { title: val(e) })} />
                  <input type="text" placeholder="Icoon (mdi:...)" .value=${live(c.icon)} @input=${(e: Event) => this._pdCard(i, { icon: val(e) })} />
                  <button class="icon-link danger" title="Kaart verwijderen" @click=${() => this._pdRemoveCard(i)}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                </div>
                <textarea rows="3" placeholder="Punten (één per regel)" .value=${live(c.itemsText)} @input=${(e: Event) => this._pdCard(i, { itemsText: (e.target as HTMLTextAreaElement).value })}></textarea>
              </div>
            `,
          )}
        </div>
        <div class="phase-edit-actions">
          <button class="primary" @click=${() => this._submitPhaseEdit(p.key)}>Opslaan</button>
          <button class="link" @click=${() => { this._editPhase = undefined; this._phaseDraft = undefined; }}>Annuleer</button>
        </div>
      </div>
    `;
  }

  private _typeOptions(s: State, selected: string) {
    return Object.entries(s.schedule_types).map(
      ([key, c]) => html`<option value=${key} ?selected=${key === selected}>${c.label}</option>`,
    );
  }

  private _renderPhaseSchedule(s: State, p: Phase) {
    const items = [...(s.schedules[p.key] ?? [])].sort((a, b) => (a.time < b.time ? -1 : 1));
    return html`
      <details class="phase-sched">
        <summary>
          <span class="ps-summary">
            <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
            <ha-icon icon="mdi:clock-outline"></ha-icon> Dagschema voor deze fase
          </span>
          <small class="muted">${items.length} items</small>
        </summary>
        <div class="ps-actions">
          <button class="link" @click=${() => (this._schedForm = this._schedForm === p.key ? undefined : p.key)}>+ Item</button>
        </div>
        ${this._schedForm === p.key
          ? html`<div class="inline-form">
              <label class="fld">Tijd<input id="sc-time" type="time" value="12:00" /></label>
              <label class="fld grow">Label<input id="sc-label" type="text" placeholder="bv. Plaspauze" /></label>
              <label class="fld">Type<select id="sc-type">${this._typeOptions(s, "rust")}</select></label>
              <label class="fld grow">Notitie<input id="sc-notes" type="text" placeholder="uitvoering (optioneel)" /></label>
              <button class="primary" @click=${() => this._submitSchedItem(p.key)}>Toevoegen</button>
              <button class="link" @click=${() => (this._schedForm = undefined)}>Annuleer</button>
            </div>`
          : nothing}
        <div class="ps-list">
          ${items.length === 0 ? html`<div class="muted small">Nog geen items voor deze fase.</div>` : nothing}
          ${items.map((it) =>
            this._editSched === it.id
              ? html`<div class="ps-item editing">
                  <input id="se-time" type="time" .value=${it.time} />
                  <input id="se-label" type="text" .value=${it.label} />
                  <select id="se-type">${this._typeOptions(s, it.type)}</select>
                  <input id="se-notes" type="text" .value=${it.notes} placeholder="notitie" />
                  <button class="primary" @click=${() => this._submitSchedEdit(it)}>Opslaan</button>
                  <button class="link" @click=${() => (this._editSched = undefined)}>Annuleer</button>
                </div>`
              : html`<div class="ps-item">
                  <span class="ps-time">${it.time}</span>
                  <span class="cat-dot" style="background:${s.schedule_types[it.type]?.color ?? "#888"}" title=${s.schedule_types[it.type]?.label ?? ""}></span>
                  <span class="ps-main">
                    <span>${it.label}</span>
                    ${it.notes ? html`<span class="ps-note">${it.notes}</span>` : nothing}
                  </span>
                  <button class="icon-link" title="Bewerken" @click=${() => (this._editSched = it.id)}><ha-icon icon="mdi:pencil"></ha-icon></button>
                  <button class="icon-link danger" title="Verwijderen" @click=${() => this._removeSchedItem(it.id)}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                </div>`,
          )}
        </div>
      </details>
    `;
  }

  // ---- Tab: Socialisatie -------------------------------------------------

  private async _removeStep(id: number): Promise<void> {
    this._confirm = undefined;
    const r = await this._ws<{ protocols: Protocol[] }>("remove_step", { step_id: id });
    if (r) this._merge({ protocols: r.protocols });
  }

  private _stepDelete(st: Step) {
    return this._confirm?.kind === "step" && this._confirm.id === st.id
      ? html`<span class="confirm">Verwijderen?
          <button class="link danger" @click=${() => this._removeStep(st.id)}>Ja</button>
          <button class="link" @click=${() => (this._confirm = undefined)}>Nee</button></span>`
      : html`<button class="link danger" title="Verwijderen" @click=${() => (this._confirm = { kind: "step", id: st.id })}>×</button>`;
  }

  private async _moveStepWeek(step: Step, deltaWeeks: number): Promise<void> {
    const r = await this._ws<{ protocols: Protocol[] }>("update_step", {
      step_id: step.id,
      day_offset: step.day_offset + deltaWeeks * 7,
    });
    if (r) this._merge({ protocols: r.protocols });
  }

  private _currentSocWeek(proto: Protocol): number | null {
    if (!proto.start_date || !this._state) return null;
    const start = new Date(proto.start_date + "T00:00:00").getTime();
    const today = new Date(this._state.today + "T00:00:00").getTime();
    if (today < start) return -1; // programma nog niet begonnen
    return Math.floor((today - start) / (7 * 86400000));
  }

  private _renderSocialization(s: State) {
    const proto = s.protocols.find((p) => p.seed_key === "socialization");
    if (!proto) return html`<section><p class="muted">Geen socialisatieprogramma. Stel een thuiskomstdatum in.</p></section>`;

    const WEEKS = 5; // 7-12 weken = 5 weken vanaf thuiskomst
    const currentWeek = this._currentSocWeek(proto);
    const byWeek: Step[][] = Array.from({ length: WEEKS }, () => []);
    for (const st of proto.steps) {
      const w = Math.min(WEEKS - 1, Math.max(0, Math.floor(st.day_offset / 7)));
      byWeek[w].push(st);
    }

    return html`
      <section>
        <div class="sec-head">
          <h2>Socialisatie <small class="muted">(7-12 weken · weekchecklist)</small></h2>
        </div>
        <div class="legend">
          ${Object.entries(s.socialization_categories).map(
            ([, c]) => html`<span class="tag"><span class="dot" style="background:${c.color}"></span>${c.label}</span>`,
          )}
        </div>
        <div class="weeks">
          ${byWeek.map((items, i) => this._renderSocWeek(s, proto, items, i, currentWeek, WEEKS))}
        </div>
      </section>
    `;
  }

  private _renderSocWeek(s: State, proto: Protocol, items: Step[], i: number, currentWeek: number | null, weeks: number) {
    const done = items.filter((st) => st.done_at).length;
    const isCurrent = currentWeek === i;
    const ordered = [...items].sort((a, b) => a.day_offset - b.day_offset || a.id - b.id);
    return html`
      <div class="week-card ${isCurrent ? "current" : ""}">
        <div class="week-head">
          <div>
            <strong>Week ${i + 1}</strong>
            <small class="muted">${7 + i}-${8 + i} wk</small>
            ${isCurrent ? html`<span class="badge">Nu</span>` : nothing}
          </div>
          <span class="week-progress">${done}/${items.length}</span>
        </div>
        <div class="week-items">
          ${ordered.length === 0 ? html`<div class="muted small">Geen activiteiten deze week.</div>` : nothing}
          ${ordered.map((st) => this._renderSocItem(s, proto, st, i, weeks))}
        </div>
        ${this._socAddWeek === i
          ? html`<div class="inline-form">
              <label class="fld grow">Activiteit<input id="sa-title" type="text" placeholder="bv. Trein horen" /></label>
              <label class="fld">Dag<select id="sa-day">${this._weekDayOptions(proto, i, i * 7)}</select></label>
              <label class="fld">Categorie<select id="sa-cat">${this._socCatOptions(s, "omgeving")}</select></label>
              <button class="primary" @click=${() => this._submitSocAdd(proto, i)}>Toevoegen</button>
              <button class="link" @click=${() => (this._socAddWeek = undefined)}>Annuleer</button>
            </div>`
          : html`<button class="link add-week" @click=${() => (this._socAddWeek = i)}>+ activiteit</button>`}
      </div>
    `;
  }

  private _renderSocItem(s: State, proto: Protocol, st: Step, weekIndex: number, weeks: number) {
    const cat = s.socialization_categories[st.category];
    if (this._editStep === st.id) {
      return html`
        <div class="soc-item editing">
          <input id="es-title" type="text" .value=${st.title} placeholder="activiteit" />
          <input id="es-notes" type="text" .value=${st.notes} placeholder="notitie (optioneel)" />
          <input id="es-date" type="hidden" .value=${st.effective_date ?? ""} />
          <label class="fld">Dag<select id="es-day">${this._weekDayOptions(proto, Math.floor(st.day_offset / 7), st.day_offset)}</select></label>
          <label class="fld">Categorie<select id="es-cat">${this._socCatOptions(s, st.category)}</select></label>
          <div class="soc-edit-row">
            <span class="wk-move">
              Week:
              <button class="iconbtn" title="Vorige week" ?disabled=${weekIndex === 0} @click=${() => this._moveStepWeek(st, -1)}>←</button>
              <button class="iconbtn" title="Volgende week" ?disabled=${weekIndex === weeks - 1} @click=${() => this._moveStepWeek(st, 1)}>→</button>
            </span>
            <span class="spacer"></span>
            <button class="link danger" @click=${() => this._removeStep(st.id)}>Verwijderen</button>
            <button class="primary" @click=${() => this._submitStepEdit(st, proto)}>Opslaan</button>
            <button class="link" @click=${() => (this._editStep = undefined)}>Annuleer</button>
          </div>
        </div>
      `;
    }
    return html`
      <div class="soc-item ${st.done_at ? "done" : ""}" style="--rc:${cat?.color ?? "#888"}">
        <input type="checkbox" .checked=${!!st.done_at} @change=${() => this._toggleStep(st)} />
        <span class="day-chip" title=${this._fmt(st.effective_date)}>${this._dayLabel(st.effective_date)}</span>
        <span class="cat-dot" style="background:${cat?.color ?? "#888"}" title=${cat?.label ?? ""}></span>
        <span class="soc-item-main">
          <span class="soc-item-title">${st.title}</span>
          ${st.notes ? html`<span class="soc-item-note">${st.notes}</span>` : nothing}
        </span>
        <button class="icon-link edit-btn" title="Bewerken" @click=${() => (this._editStep = st.id)}><ha-icon icon="mdi:pencil"></ha-icon></button>
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
              <label class="fld grow">Naam<input id="np-name" type="text" placeholder="bv. Bench verplaatsen" /></label>
              <label class="fld">Startdatum<input id="np-start" type="date" .value=${s.today} /></label>
              <label class="fld grow">Omschrijving (optioneel)<input id="np-notes" type="text" placeholder="Waar gaat dit schema over?" /></label>
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
              ${this._editProto === p.id
                ? html`<div class="inline-form">
                    <label class="fld grow">Naam<input id="ep-name" type="text" .value=${p.name} /></label>
                    <label class="fld">Startdatum<input id="ep-start" type="date" .value=${p.start_date ?? ""} /></label>
                    <label class="fld grow">Omschrijving<input id="ep-notes" type="text" .value=${p.notes} placeholder="Waar gaat dit schema over?" /></label>
                    <button class="primary" @click=${() => this._submitProtoEdit(p)}>Opslaan</button>
                    <button class="link" @click=${() => (this._editProto = undefined)}>Annuleer</button>
                  </div>`
                : html`
                    <div class="proto-head">
                      <strong>${p.name}</strong>
                      <span>
                        <button class="icon-link" title="Bewerken" @click=${() => (this._editProto = p.id)}><ha-icon icon="mdi:pencil"></ha-icon></button>
                        <button class="link" @click=${() => { this._stepForm = this._stepForm === p.id ? undefined : p.id; }}>+ Stap</button>
                        ${this._confirm?.kind === "protocol" && this._confirm.id === p.id
                          ? html`<span class="confirm">Zeker?
                              <button class="link danger" @click=${() => this._removeProtocol(p.id)}>Ja</button>
                              <button class="link" @click=${() => (this._confirm = undefined)}>Nee</button></span>`
                          : html`<button class="link danger" @click=${() => (this._confirm = { kind: "protocol", id: p.id })}>Verwijderen</button>`}
                      </span>
                    </div>
                    ${p.notes ? html`<div class="proto-note">${p.notes}</div>` : nothing}
                  `}
              ${this._stepForm === p.id
                ? html`<div class="inline-form">
                    <label class="fld grow">Titel<input id="ns-title" type="text" placeholder="Titel van de stap" /></label>
                    <label class="fld">Datum<input id="ns-date" type="date" .value=${this._nextStepDate(p, s.today)} /></label>
                    <button class="primary" @click=${() => this._submitStep(p)}>Toevoegen</button>
                    <button class="link" @click=${() => (this._stepForm = undefined)}>Annuleer</button>
                  </div>`
                : nothing}
              <div class="steps">
                ${p.steps.map((st) =>
                  this._editStep === st.id
                    ? html`
                        <div class="step editing">
                          <input id="es-title" type="text" .value=${st.title} placeholder="titel" />
                          <input id="es-date" type="date" .value=${st.effective_date ?? ""} />
                          <input id="es-notes" type="text" .value=${st.notes} placeholder="notitie (optioneel)" />
                          <button class="primary" @click=${() => this._submitStepEdit(st, p)}>Opslaan</button>
                          <button class="link" @click=${() => (this._editStep = undefined)}>Annuleer</button>
                        </div>
                      `
                    : html`
                        <div class="step ${this._isToday(st.effective_date) ? "today" : ""} ${st.done_at ? "done" : ""}">
                          <input type="checkbox" .checked=${!!st.done_at} @change=${() => this._toggleStep(st)} />
                          <span class="step-date">${this._fmt(st.effective_date)}</span>
                          <span class="step-title">${st.title}</span>
                          <button class="icon-link" title="Bewerken" @click=${() => (this._editStep = st.id)}><ha-icon icon="mdi:pencil"></ha-icon></button>
                          ${this._deferControls(st)}
                          ${this._stepDelete(st)}
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
          <div class="photo-field">
            <div class="photo-preview">
              ${p?.photo_url ? html`<img src=${p.photo_url} alt="foto van ${p.name}" />` : html`<ha-icon icon="mdi:dog"></ha-icon>`}
            </div>
            <div class="photo-actions">
              <label class="filebtn">
                Foto kiezen…
                <input type="file" accept="image/*" @change=${this._onPhotoFile} hidden />
              </label>
              ${p?.photo_url ? html`<button class="link danger" @click=${() => this._savePhoto("")}>Verwijderen</button>` : nothing}
              <div class="muted small">Wordt automatisch verkleind en opgeslagen.</div>
            </div>
          </div>
          <label>Naam<input type="text" id="name" .value=${p?.name ?? ""} /></label>
          <label>Geboortedatum<input type="date" id="birth" .value=${p?.birth_date ?? ""} /></label>
          <label>Thuiskomstdatum<input type="date" id="home" .value=${p?.homecoming_date ?? ""} /></label>
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
    .icon-link { background: none; border: none; cursor: pointer; color: var(--secondary-text-color, var(--primary-color)); padding: 2px; display: inline-flex; align-items: center; border-radius: 6px; flex: 0 0 auto; }
    .icon-link:hover { color: var(--primary-color); background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
    .icon-link.danger { color: var(--secondary-text-color, #888); }
    .icon-link.danger:hover { color: var(--error-color, #b00020); }
    .icon-link ha-icon { --mdc-icon-size: 18px; width: 18px; height: 18px; }
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

    /* Day-view timeline */
    .timeline-scroll { position: relative; max-height: 620px; overflow-y: auto; border: 1px solid var(--divider-color, #eee); border-radius: 10px; padding: 4px 0; }
    .timeline { position: relative; margin-left: 54px; margin-right: 8px; }
    .hour-line { position: absolute; left: -54px; right: 0; height: 0; border-top: 1px solid var(--divider-color, #eee); }
    .hour-line.night::before { content: ""; position: absolute; left: 0; right: 0; top: 0; height: 60px; background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); z-index: 0; pointer-events: none; }
    .hour-label { position: absolute; left: 0; top: -8px; width: 46px; text-align: right; font-size: .72rem; opacity: .6; font-variant-numeric: tabular-nums; }
    .tl-item { position: absolute; left: 4px; right: 4px; height: 24px; display: flex; align-items: center; gap: 8px; padding: 0 8px; border-radius: 6px; box-sizing: border-box; z-index: 1; background: color-mix(in srgb, var(--rc) 20%, var(--card-background-color)); border-left: 3px solid var(--rc); }
    .tl-item.checked { opacity: .5; }
    .tl-item.checked .tl-label { text-decoration: line-through; }
    .tl-time { font-size: .72rem; opacity: .8; font-variant-numeric: tabular-nums; flex: 0 0 auto; }
    .tl-label { flex: 1; font-size: .82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tl-item input { width: 16px; height: 16px; flex: 0 0 auto; }
    .now-line { position: absolute; left: -54px; right: 0; height: 0; border-top: 2px solid var(--error-color, #d33); z-index: 3; pointer-events: none; }
    .now-dot { position: absolute; left: -4px; top: -5px; width: 9px; height: 9px; border-radius: 50%; background: var(--error-color, #d33); }
    .now-time { position: absolute; left: 6px; top: -18px; font-size: .68rem; font-weight: 600; color: var(--error-color, #d33); background: var(--card-background-color); padding: 0 3px; border-radius: 3px; }

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
    .phase-toolbar { display: flex; justify-content: flex-end; margin-bottom: 4px; }
    .phase-toolbar .icon-link { gap: 4px; padding: 4px 8px; }
    .phase-toolbar .lbl { font-size: .8rem; }
    .phase-edit { display: flex; flex-direction: column; gap: 10px; }
    .phase-edit .fld { display: flex; flex-direction: column; gap: 3px; font-size: .74rem; opacity: .9; }
    .phase-edit input, .phase-edit textarea { padding: 8px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit; box-sizing: border-box; width: 100%; }
    .phase-edit textarea { resize: vertical; }
    .phase-edit .row3 { display: flex; gap: 10px; flex-wrap: wrap; }
    .phase-edit .row3 .fld { flex: 1 1 90px; }
    .cards-edit { display: flex; flex-direction: column; gap: 8px; }
    .ce-head { display: flex; align-items: center; justify-content: space-between; }
    .ce-card { border: 1px solid var(--divider-color, #ddd); border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 6px; }
    .ce-row { display: flex; gap: 6px; align-items: center; }
    .ce-row input:first-child { flex: 2; }
    .ce-row input:nth-child(2) { flex: 1; }
    .phase-edit-actions { display: flex; gap: 8px; }

    .phase-sched { margin-top: 14px; border-top: 1px solid var(--divider-color, #eee); padding-top: 10px; }
    .phase-sched > summary { font-size: .92rem; }
    .ps-summary { display: inline-flex; align-items: center; gap: 6px; }
    .chev { --mdc-icon-size: 18px; width: 18px; height: 18px; opacity: .6; transition: transform .15s; }
    details.phase-sched[open] > summary .chev { transform: rotate(90deg); }
    .ps-actions { margin: 8px 0 4px; }
    .add-week { margin-top: 6px; }
    .soc-item.editing select, .fld select { padding: 6px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit; }
    .ps-head { display: flex; align-items: center; justify-content: space-between; }
    .ps-head h4 { margin: 0; }
    .ps-list { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; }
    .ps-item { display: flex; align-items: center; gap: 8px; padding: 5px 6px; border-radius: 8px; }
    .ps-item:hover { background: color-mix(in srgb, var(--primary-text-color) 5%, transparent); }
    .ps-time { font-variant-numeric: tabular-nums; width: 44px; font-size: .82rem; opacity: .85; flex: 0 0 auto; }
    .ps-main { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .ps-note { font-size: .74rem; opacity: .65; }
    .ps-item.editing { flex-wrap: wrap; }
    .ps-item.editing input[type="text"] { flex: 1 1 140px; }
    .ps-item select, .inline-form select, .ps-item input, .inline-form .fld select {
      padding: 6px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit;
    }

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

    /* Socialization week checklist */
    .weeks { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
    .week-card { border: 1px solid var(--divider-color, #ddd); border-radius: 12px; padding: 10px 12px; background: color-mix(in srgb, var(--primary-text-color) 3%, transparent); }
    .week-card.current { border-color: var(--primary-color); box-shadow: 0 0 0 1px var(--primary-color) inset; }
    .week-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .week-head .badge { margin-left: 6px; }
    .week-progress { font-size: .8rem; opacity: .7; font-variant-numeric: tabular-nums; }
    .week-items { display: flex; flex-direction: column; gap: 4px; }
    .soc-item { display: flex; align-items: center; gap: 8px; padding: 6px 4px; border-radius: 8px; }
    .soc-item.done .soc-item-title { text-decoration: line-through; opacity: .5; }
    .cat-dot { width: 9px; height: 9px; border-radius: 50%; flex: 0 0 auto; }
    .soc-item-main { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .soc-item-title { font-size: .88rem; }
    .soc-item-note { font-size: .74rem; opacity: .65; }
    .soc-item-actions { display: flex; align-items: center; gap: 4px; flex: 0 0 auto; }
    .day-chip { font-size: .72rem; opacity: .7; flex: 0 0 auto; min-width: 40px; font-variant-numeric: tabular-nums; }
    .soc-item .edit-btn { flex: 0 0 auto; }
    .soc-edit-row { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 8px; width: 100%; }
    .soc-edit-row .spacer { flex: 1; }
    .wk-move { display: inline-flex; align-items: center; gap: 4px; font-size: .78rem; opacity: .8; }
    .iconbtn { background: transparent; border: 1px solid var(--divider-color, #ccc); border-radius: 6px; width: 24px; height: 24px; padding: 0; cursor: pointer; color: inherit; line-height: 1; }
    .iconbtn:disabled { opacity: .3; cursor: default; }
    .soc-item.editing { flex-wrap: wrap; gap: 6px; }
    .soc-item.editing input[type="text"] { flex: 1 1 140px; padding: 6px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit; }

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

    .defer-inline { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 2px 6px; }
    .defer-inline input { width: 48px; padding: 4px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; }
    .defer-inline .dagen { font-size: .78rem; opacity: .7; }

    .soc-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 10px; margin-top: 8px; }
    .soc-actions .defer-inline { flex-basis: 100%; }
    .soc-day.editing { display: flex; flex-direction: column; gap: 6px; }
    .soc-day.editing input { padding: 6px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit; }
    .step.editing { flex-wrap: wrap; gap: 6px; padding: 8px 6px; }
    .step.editing input[type="text"] { flex: 1 1 160px; }
    .step.editing input { padding: 6px; border-radius: 6px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; font: inherit; }
    .confirm { font-size: .8rem; display: inline-flex; align-items: center; gap: 4px; }
    .inline-form { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0; padding: 10px; border: 1px dashed var(--divider-color, #ccc); border-radius: 10px; }
    .inline-form input[type="text"] { flex: 1; min-width: 160px; }
    .inline-form input { padding: 8px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; }
    .inline-form .fld { display: flex; flex-direction: column; gap: 3px; font-size: .72rem; opacity: .85; }
    .inline-form .fld.grow { flex: 1 1 160px; }
    .inline-form .fld input { width: 100%; box-sizing: border-box; }

    /* Config */
    .settings { display: flex; flex-direction: column; gap: 10px; max-width: 360px; }
    .settings label { display: flex; flex-direction: column; font-size: .85rem; gap: 4px; }
    .settings input { padding: 8px; border-radius: 8px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color); color: inherit; }
    .photo-field { display: flex; gap: 14px; align-items: center; }
    .photo-preview { width: 96px; height: 96px; border-radius: 12px; overflow: hidden; flex: 0 0 auto; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 40%, #000)); color: #fff; }
    .photo-preview img { width: 100%; height: 100%; object-fit: cover; }
    .photo-preview ha-icon { --mdc-icon-size: 48px; }
    .photo-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }
    .filebtn { display: inline-block; cursor: pointer; background: transparent; border: 1px solid var(--primary-color); color: var(--primary-color); border-radius: 8px; padding: 8px 14px; font-size: .9rem; }
    .small { font-size: .78rem; }
  `;
}
