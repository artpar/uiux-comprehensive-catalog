import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type SchedulingStage = "people" | "availability" | "suggested" | "room" | "timezone" | "recurrence" | "reminder" | "save" | "send" | "responses" | "reschedule" | "cancel" | "stale" | "series";

function SchedulingFrame({
  stage = "people",
  time = "Tue 11:30 AM",
  timezone = "America/New_York",
  status = "Draft",
  idSuffix = "demo"
}: {
  stage?: SchedulingStage;
  time?: string;
  timezone?: string;
  status?: string;
  idSuffix?: string;
}) {
  const title: Record<SchedulingStage, string> = {
    people: "Product review meeting",
    availability: "Free/busy check loaded",
    suggested: "Suggested time selected",
    room: "Room conflict resolved",
    timezone: "Timezone clarified",
    recurrence: "Weekly series configured",
    reminder: "Reminder and video link ready",
    save: "Saved to calendar only",
    send: "Invitations sent",
    responses: "Attendee responses pending",
    reschedule: "Meeting rescheduled",
    cancel: "Event canceled",
    stale: "Availability changed",
    series: "Edit occurrence or series"
  };
  const message: Record<SchedulingStage, string> = {
    people: "Required and optional attendees are resolved before availability is checked.",
    availability: "Free/busy bars show Priya is busy at 10:00 and the Magnolia room is unavailable.",
    suggested: "11:30 is available for required attendees and the selected room.",
    room: "The room conflict moves the meeting to Magnolia 4 instead of hiding the issue.",
    timezone: "The organizer sees Eastern time while Omar sees the equivalent London time.",
    recurrence: "The weekly series uses one timezone and an end date so recurrences expand predictably.",
    reminder: "A 10-minute reminder and Meet link are included before invitations are sent.",
    save: "Save keeps the event on Maya's calendar but does not notify attendees.",
    send: "Send invitations reserves calendar time and notifies required and optional attendees.",
    responses: "Responses show Priya accepted, Omar tentative, and Lee pending.",
    reschedule: "Rescheduling preserves attendees, agenda, room, reminders, and response history.",
    cancel: "Cancel releases the room and sends cancellation notices.",
    stale: "A stale suggested time is blocked because another event claimed the slot.",
    series: "The editor must choose this occurrence, future occurrences, or the full series."
  };
  const rows = [
    { label: "Required", value: "Maya, Priya, Omar", state: stage === "availability" ? "1 busy" : stage === "responses" ? "2 replied" : "Resolved" },
    { label: "When", value: time, state: stage === "timezone" ? "Dual timezone" : stage === "stale" ? "Stale" : "Selected" },
    { label: "Room", value: stage === "room" ? "Magnolia 4" : "Magnolia 3", state: stage === "room" ? "Changed" : stage === "availability" ? "Busy at 10:00" : "Available" },
    { label: "Outcome", value: status, state: stage === "save" ? "No invites" : stage === "send" ? "Invites sent" : stage === "cancel" ? "Released" : "Editable" }
  ];
  const availability = [
    { person: "Maya", slots: ["free", "free", "free"] },
    { person: "Priya", slots: ["busy", "free", "free"] },
    { person: "Omar", slots: ["free", "tentative", "free"] }
  ];
  return (
    <div className={`scheduling-frame is-${stage}`}>
      <section className="scheduling-panel" aria-labelledby={`scheduling-title-${idSuffix}`}>
        <div className="scheduling-heading">
          <span>Scheduling</span>
          <strong>{status}</strong>
        </div>
        <h4 id={`scheduling-title-${idSuffix}`}>{title[stage]}</h4>
        <p>{message[stage]}</p>
        <div className="scheduling-fields">
          {rows.map((row) => (
            <div className={row.state === "1 busy" || row.state === "Busy at 10:00" || row.state === "Stale" ? "needs-action" : row.state === "Invites sent" || row.state === "Released" ? "is-complete" : ""} key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <em>{row.state}</em>
            </div>
          ))}
        </div>
      </section>
      <aside className="scheduling-availability" aria-label="Availability preview">
        <strong>{stage === "suggested" ? "Suggested times" : stage === "recurrence" ? "Series rule" : "Free/busy"}</strong>
        <div className="scheduling-slots" aria-label="Attendee availability grid">
          <span>10:00</span>
          <span>11:30</span>
          <span>14:00</span>
          {availability.map((row) => (
            <div key={row.person}>
              <b>{row.person}</b>
              {row.slots.map((slot, index) => <i className={`is-${slot}`} key={`${row.person}-${slot}-${index}`}>{slot}</i>)}
            </div>
          ))}
        </div>
        <p>{stage === "recurrence" ? `Weekly until Aug 25 in ${timezone}.` : stage === "timezone" ? `Shown in ${timezone}; attendees see local equivalents.` : "11:30 keeps required attendees free and avoids the room conflict."}</p>
      </aside>
    </div>
  );
}

function SchedulingGoodUi() {
  return (
    <div className="quality-example scheduling-demo">
      <SchedulingFrame />
      <p className="demo-status">The scheduling surface shows people, availability, room, time, timezone, recurrence, reminders, and save/send consequences before committing.</p>
    </div>
  );
}

function SchedulingBadUi() {
  return (
    <div className="bad-ui-sample scheduling-bad-demo is-dateOnly">
      <strong>New event</strong>
      <div className="scheduling-bad-grid">
        {["Date", "Time", "Title", "Save", "No guests", "No conflicts"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken surface treats scheduling as plain date and time entry, with no attendees, availability, timezone, recurrence, reminders, or send state.</p>
    </div>
  );
}

function SchedulingGoodUx() {
  const [stage, setStage] = useState<SchedulingStage>("people");
  const [time, setTime] = useState("Tue 11:30 AM");
  const [timezone, setTimezone] = useState("America/New_York");
  const [status, setStatus] = useState("Draft");
  const [message, setMessage] = useState("The scheduler starts by resolving required and optional attendees before checking availability.");

  function choose(nextStage: SchedulingStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example scheduling-demo">
      <SchedulingFrame stage={stage} time={time} timezone={timezone} status={status} idSuffix="good-ux" />
      <div className="demo-row scheduling-controls" aria-label="Scheduling exercise controls">
        <button type="button" className={stage === "people" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Draft");
          choose("people", "Attendee chips separate required and optional people before any invitations are sent.");
        }}>People</button>
        <button type="button" className={stage === "availability" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("availability", "Free/busy loading finds Priya and Magnolia 3 are unavailable at 10:00.")}>Availability</button>
        <button type="button" className={stage === "suggested" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTime("Tue 11:30 AM");
          choose("suggested", "The 11:30 suggested time is free for required attendees and the room.");
        }}>Suggested</button>
        <button type="button" className={stage === "room" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("room", "Room conflict recovery changes from Magnolia 3 to Magnolia 4 before send.")}>Room</button>
        <button type="button" className={stage === "timezone" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTimezone("America/New_York + Europe/London");
          choose("timezone", "Dual timezone text prevents Maya and Omar from reading 11:30 as different moments.");
        }}>Timezone</button>
        <button type="button" className={stage === "recurrence" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("recurrence", "The weekly recurrence has an end date, timezone, and series scope before saving.")}>Recurrence</button>
        <button type="button" className={stage === "reminder" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("reminder", "Reminder and Meet link are included before invitations are sent.")}>Reminder</button>
        <button type="button" className={stage === "save" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Saved");
          choose("save", "Save keeps a draft calendar event and clearly says no invitations were sent.");
        }}>Save only</button>
        <button type="button" className={stage === "send" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Sent");
          choose("send", "Send invitations notifies attendees, reserves calendar time, and changes response state to pending.");
        }}>Send</button>
        <button type="button" className={stage === "responses" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Responses");
          choose("responses", "The meeting tracks accepted, tentative, and pending attendee responses.");
        }}>Responses</button>
        <button type="button" className={stage === "reschedule" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setTime("Wed 14:00");
          setStatus("Updated");
          choose("reschedule", "Reschedule preserves attendees, room, agenda, reminders, and response history.");
        }}>Reschedule</button>
        <button type="button" className={stage === "cancel" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Canceled");
          choose("cancel", "Cancel releases the room and sends cancellation notices to attendees.");
        }}>Cancel</button>
        <button type="button" className={stage === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setStatus("Stale");
          choose("stale", "Stale availability blocks sending after another event claims the suggested slot.");
        }}>Stale</button>
        <button type="button" className={stage === "series" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("series", "Editing a recurring meeting requires this occurrence, future occurrences, or entire series scope.")}>Series scope</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function SchedulingBadUx() {
  type Mode = "dateOnly" | "hiddenConflict" | "timezoneShift" | "seriesMistake" | "noSendState" | "staleSlot";
  const [mode, setMode] = useState<Mode>("dateOnly");
  const copy: Record<Mode, string> = {
    dateOnly: "The form collects only date and time, so scheduling consequences are invisible.",
    hiddenConflict: "A required attendee and the selected room are busy, but the conflict appears only after sending.",
    timezoneShift: "11:30 silently shifts for a remote attendee because timezone text is hidden.",
    seriesMistake: "Moving one weekly event changes the entire series without asking scope.",
    noSendState: "The event says saved, but attendees were not invited and the organizer cannot tell.",
    staleSlot: "A suggested time is sent after another meeting claimed the slot."
  };
  const labels: Record<Mode, string[]> = {
    dateOnly: ["Date", "Time", "Save"],
    hiddenConflict: ["Priya busy", "Room busy", "Sent"],
    timezoneShift: ["11:30", "London?", "Shifted"],
    seriesMistake: ["This week", "All weeks", "Changed"],
    noSendState: ["Saved", "No invites", "No status"],
    staleSlot: ["Suggested", "Taken", "Sent"]
  };
  return (
    <div className={`quality-example scheduling-bad-demo is-${mode}`}>
      <strong>{mode === "timezoneShift" ? "Remote meeting" : mode === "seriesMistake" ? "Recurring edit" : "Schedule event"}</strong>
      <div className="scheduling-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row scheduling-controls">
        <button type="button" className={mode === "dateOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dateOnly")}>Date only</button>
        <button type="button" className={mode === "hiddenConflict" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenConflict")}>Hidden conflict</button>
        <button type="button" className={mode === "timezoneShift" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("timezoneShift")}>Timezone shift</button>
        <button type="button" className={mode === "seriesMistake" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("seriesMistake")}>Series mistake</button>
        <button type="button" className={mode === "noSendState" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noSendState")}>No send state</button>
        <button type="button" className={mode === "staleSlot" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleSlot")}>Stale slot</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SchedulingGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SchedulingBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SchedulingGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <SchedulingBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
