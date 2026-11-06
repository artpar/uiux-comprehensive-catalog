import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type CalendarEvent = {
  id: string;
  day: number;
  title: string;
  time: string;
  end: string;
  status: "Confirmed" | "Tentative" | "Cancelled" | "Conflict" | "All day";
  calendar: string;
  location: string;
  notes: string;
};

const calendarEvents: CalendarEvent[] = [
  {
    id: "cal-101",
    day: 11,
    title: "Intake clinic",
    time: "09:00",
    end: "10:30",
    status: "Confirmed",
    calendar: "Room 2",
    location: "North wing",
    notes: "Two interpreters assigned; starts after morning handoff."
  },
  {
    id: "cal-102",
    day: 11,
    title: "Follow-up call",
    time: "10:00",
    end: "10:45",
    status: "Conflict",
    calendar: "Room 2",
    location: "Phone",
    notes: "Overlaps Intake clinic by 30 minutes and needs conflict review."
  },
  {
    id: "cal-103",
    day: 11,
    title: "Team cover",
    time: "All day",
    end: "All day",
    status: "All day",
    calendar: "Staff rota",
    location: "All sites",
    notes: "All-day cover shown apart from timed appointments."
  },
  {
    id: "cal-104",
    day: 12,
    title: "Assessment slot",
    time: "13:00",
    end: "14:00",
    status: "Tentative",
    calendar: "Room 4",
    location: "Video",
    notes: "Tentative hold pending patient confirmation."
  },
  {
    id: "cal-105",
    day: 14,
    title: "Cancelled review",
    time: "15:30",
    end: "16:00",
    status: "Cancelled",
    calendar: "Room 1",
    location: "South wing",
    notes: "Cancelled state remains visible so the slot history is clear."
  },
  {
    id: "cal-106",
    day: 18,
    title: "Recurring therapy group",
    time: "11:00",
    end: "12:00",
    status: "Confirmed",
    calendar: "Group room",
    location: "Community suite",
    notes: "Repeats every Thursday; exception on public holiday week."
  }
];

const calendarDays = Array.from({ length: 28 }, (_, index) => index + 1);

const calendarWeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const calendarTimes = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

function eventsForDay(day: number) {
  return calendarEvents.filter((event) => event.day === day);
}

function CalendarEventPill({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  return (
    <button type="button" className={`calendar-event-pill is-${event.status.toLowerCase().replaceAll(" ", "-")}`} aria-label={`${event.title}, ${event.time} to ${event.end}, ${event.status}, ${event.calendar}`}>
      <span>{event.time}</span>
      <strong>{event.title}</strong>
      {!compact ? <em>{event.calendar}</em> : null}
    </button>
  );
}

function CalendarMonthGrid({
  selectedDay,
  showOverflow = true,
  compact = false
}: {
  selectedDay: number;
  showOverflow?: boolean;
  compact?: boolean;
}) {
  return (
    <div className="calendar-month-grid" role="grid" aria-label="June 2026 clinic calendar">
      {calendarWeekDays.map((day) => (
        <span key={day} className="calendar-weekday" role="columnheader">{day}</span>
      ))}
      {calendarDays.map((day) => {
        const events = eventsForDay(day);
        const visibleEvents = showOverflow ? events.slice(0, 2) : events.slice(0, 1);
        const hidden = events.length - visibleEvents.length;
        return (
          <section key={day} className={`calendar-day${day === selectedDay ? " is-selected" : ""}${day === 11 ? " is-today" : ""}`} role="gridcell" aria-label={`June ${day}, ${events.length} events`}>
            <div className="calendar-day-head">
              <span>{day}</span>
              {day === 11 ? <em>Today</em> : null}
            </div>
            <div className="calendar-day-events">
              {visibleEvents.map((event) => <CalendarEventPill event={event} compact={compact} key={event.id} />)}
              {hidden > 0 && showOverflow ? <button type="button" className="calendar-more">+{hidden} more</button> : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function CalendarWeekGrid({ conflictPreview = false }: { conflictPreview?: boolean }) {
  return (
    <div className="calendar-week-grid" aria-label="Week of June 8 clinic schedule">
      <div className="calendar-time-axis" aria-hidden="true">
        <span />
        {calendarTimes.map((time) => <span key={time}>{time}</span>)}
      </div>
      <div className="calendar-week-columns">
        {[8, 9, 10, 11, 12].map((day, index) => {
          const dayEvents = eventsForDay(day);
          return (
            <section className="calendar-week-column" key={day} aria-label={`${calendarWeekDays[index]} June ${day}`}>
              <strong>{calendarWeekDays[index]} {day}</strong>
              {calendarTimes.map((time) => <span key={time} className="calendar-slot" aria-hidden="true" />)}
              {dayEvents.map((event) => <CalendarEventPill event={event} key={event.id} />)}
              {conflictPreview && day === 11 ? (
                <div className="calendar-conflict-preview" role="status">Move blocked: overlaps Intake clinic by 30 minutes.</div>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function CalendarAgenda({ selectedDay, hiddenCalendars = false }: { selectedDay: number; hiddenCalendars?: boolean }) {
  const events = eventsForDay(selectedDay);
  return (
    <div className="calendar-agenda" aria-label={`Agenda for June ${selectedDay}`}>
      <strong>June {selectedDay} agenda</strong>
      {hiddenCalendars ? <span className="calendar-warning">1 shared calendar hidden by permission</span> : null}
      {events.length ? events.map((event) => (
        <article className={`calendar-agenda-item is-${event.status.toLowerCase().replaceAll(" ", "-")}`} key={event.id}>
          <time>{event.time} - {event.end}</time>
          <div>
            <strong>{event.title}</strong>
            <span>{event.status} / {event.calendar} / {event.location}</span>
            <p>{event.notes}</p>
          </div>
        </article>
      )) : (
        <p className="demo-status">No visible events for this date. Hidden calendars and permissions are still stated before users assume availability.</p>
      )}
    </div>
  );
}

function CalendarViewGoodUi() {
  return (
    <div className="quality-example calendar-view-demo">
      <div className="calendar-toolbar" id="calendar-ui-label">
        <strong>Clinic schedule</strong>
        <span>June 2026</span>
        <span>Month</span>
        <span>UTC+05:30</span>
        <span>6 events</span>
      </div>
      <CalendarMonthGrid selectedDay={11} />
      <CalendarAgenda selectedDay={11} />
      <p className="demo-status">The calendar shows visible range, weekday grid, today, selected date, event times, all-day item, conflict status, overflow, and selected-day detail.</p>
    </div>
  );
}

function CalendarViewBadUi() {
  return (
    <div className="bad-ui-sample calendar-view-bad-demo is-dotsOnly">
      <div className="calendar-broken" aria-label="Broken calendar view">
        {calendarDays.slice(0, 21).map((day) => (
          <span key={day} className={day === 11 || day === 12 || day === 14 ? "has-dot" : ""}>{day}</span>
        ))}
      </div>
      <p className="demo-status">The broken calendar uses dots without titles, times, timezone, overflow, selected-day detail, or availability meaning.</p>
    </div>
  );
}

function CalendarViewGoodUx() {
  type ViewMode = "month" | "week" | "agenda";
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDay, setSelectedDay] = useState(11);
  const [timezone, setTimezone] = useState<"UTC+05:30" | "UTC">("UTC+05:30");
  const [conflictPreview, setConflictPreview] = useState(false);
  const [hiddenCalendars, setHiddenCalendars] = useState(false);
  const [message, setMessage] = useState("June 2026 month view shows selected day, today, overflow, and timezone before editing.");

  return (
    <div className="quality-example calendar-view-demo">
      <div className="calendar-toolbar" id="calendar-ux-label">
        <strong>Clinic schedule</strong>
        <span>June {selectedDay}, 2026</span>
        <span>{viewMode}</span>
        <span>{timezone}</span>
        <span>{hiddenCalendars ? "1 hidden calendar" : "All calendars visible"}</span>
      </div>
      {viewMode === "month" ? <CalendarMonthGrid selectedDay={selectedDay} /> : null}
      {viewMode === "week" ? <CalendarWeekGrid conflictPreview={conflictPreview} /> : null}
      {viewMode === "agenda" ? <CalendarAgenda selectedDay={selectedDay} hiddenCalendars={hiddenCalendars} /> : null}
      <div className="demo-row calendar-controls" aria-label="Calendar view exercise controls">
        <button type="button" className={viewMode === "month" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setViewMode("month");
          setMessage("Month view restored with the same selected date and visible overflow count.");
        }}>Month view</button>
        <button type="button" className={viewMode === "week" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setViewMode("week");
          setMessage("Week view shows timed placement, all-day events, overlap, and conflict preview space.");
        }}>Week view</button>
        <button type="button" className={viewMode === "agenda" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setViewMode("agenda");
          setMessage("Agenda view keeps event identity readable for the selected date.");
        }}>Agenda view</button>
        <button type="button" className="demo-button small" onClick={() => {
          setSelectedDay(11);
          setViewMode("agenda");
          setMessage("Crowded June 11 opened as selected-day agenda with all hidden month-cell events visible.");
        }}>Open +more</button>
        <button type="button" className={conflictPreview ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setViewMode("week");
          setConflictPreview((value) => !value);
          setMessage(!conflictPreview ? "Conflict preview blocks the move before save and keeps the original event recoverable." : "Conflict preview cleared; the original schedule remains unchanged.");
        }}>Preview conflict</button>
        <button type="button" className={timezone === "UTC" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTimezone((value) => value === "UTC+05:30" ? "UTC" : "UTC+05:30");
          setMessage(timezone === "UTC+05:30" ? "Timezone switched to UTC and is named beside the visible range." : "Timezone switched back to UTC+05:30 without moving the selected day.");
        }}>Toggle timezone</button>
        <button type="button" className={hiddenCalendars ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setHiddenCalendars((value) => !value);
          setViewMode("agenda");
          setMessage(!hiddenCalendars ? "Hidden calendar warning appears before users assume the day is fully available." : "All visible calendars restored.");
        }}>Hidden calendars</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CalendarViewBadUx() {
  type Mode = "dotsOnly" | "clippedOverflow" | "timezoneShift" | "conflictDrag" | "mobileCrush" | "datePickerMisuse";
  const [mode, setMode] = useState<Mode>("dotsOnly");
  const copy: Record<Mode, string> = {
    dotsOnly: "Dots imply something exists but hide event title, time, duration, calendar, and status.",
    clippedOverflow: "A crowded day clips extra events with no count, popover, or selected-day drill-in.",
    timezoneShift: "The visible calendar uses local time while reminders and export use UTC.",
    conflictDrag: "Dragging an appointment over an existing room booking saves without conflict warning or undo.",
    mobileCrush: "The month grid shrinks until event titles and focus targets are unreadable.",
    datePickerMisuse: "A full event calendar is used when the task is only to choose one remembered date."
  };

  return (
    <div className={`quality-example calendar-view-bad-demo is-${mode}`}>
      <div className="calendar-broken" aria-label="Broken calendar behavior">
        {calendarDays.slice(0, mode === "mobileCrush" ? 28 : 21).map((day) => (
          <span key={day} className={day === 11 || day === 12 || day === 14 ? "has-dot" : ""}>
            {mode === "datePickerMisuse" && day === 11 ? "Birth date?" : day}
          </span>
        ))}
      </div>
      <div className="demo-row calendar-controls">
        <button type="button" className={mode === "dotsOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dotsOnly")}>Dots only</button>
        <button type="button" className={mode === "clippedOverflow" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("clippedOverflow")}>Clipped overflow</button>
        <button type="button" className={mode === "timezoneShift" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("timezoneShift")}>Timezone shift</button>
        <button type="button" className={mode === "conflictDrag" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("conflictDrag")}>Conflict drag</button>
        <button type="button" className={mode === "mobileCrush" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mobileCrush")}>Mobile crush</button>
        <button type="button" className={mode === "datePickerMisuse" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("datePickerMisuse")}>Date picker misuse</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CalendarViewGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CalendarViewBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CalendarViewGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CalendarViewBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
