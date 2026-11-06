import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type BookingStage = "service" | "slot" | "capacity" | "intake" | "policy" | "verify" | "payment" | "hold" | "confirmed" | "cancel" | "reschedule" | "waitlist" | "stale";

function BookingFrame({
  stage = "service",
  status = "Selecting",
  slot = "Thu 14:30",
  idSuffix = "demo"
}: {
  stage?: BookingStage;
  status?: string;
  slot?: string;
  idSuffix?: string;
}) {
  const title: Record<BookingStage, string> = {
    service: "Haircut with Zara",
    slot: "Available slot selected",
    capacity: "Party size checked",
    intake: "Client details ready",
    policy: "Policy accepted",
    verify: "Email PIN verified",
    payment: "Deposit authorized",
    hold: "Slot held while confirming",
    confirmed: "Booking confirmed",
    cancel: "Booking canceled",
    reschedule: "Booking rescheduled",
    waitlist: "Class waitlist offered",
    stale: "Slot no longer available"
  };
  const message: Record<BookingStage, string> = {
    service: "The customer sees the service, staff, duration, venue, price, and timezone before choosing a slot.",
    slot: "Only bookable times are active; closed hours and full slots explain why they cannot be picked.",
    capacity: "Party size is checked before confirmation so capacity is not exceeded.",
    intake: "Phone, notes, accessibility needs, and consent are collected before holding the slot.",
    policy: "Late-cancel and refund policy are accepted before deposit or confirmation.",
    verify: "A PIN check proves the customer email before the slot is committed.",
    payment: "A $20 deposit authorizes after the slot is rechecked and before confirmation.",
    hold: "The selected slot is temporarily held while payment and availability finish.",
    confirmed: "The reference, calendar link, staff, venue time, and manage-booking links are durable.",
    cancel: "Cancel releases the slot, notifies the customer, and explains refund handling.",
    reschedule: "Reschedule moves the same reference and preserves customer details.",
    waitlist: "When the class is full, waitlist keeps the customer in line without overbooking.",
    stale: "A stale slot is blocked and equivalent alternatives are offered without clearing customer details."
  };
  const rows = [
    { label: "Service", value: "Haircut", state: "45 min" },
    { label: "Staff", value: "Zara", state: stage === "slot" || stage === "stale" ? "Rechecked" : "Available" },
    { label: "When", value: slot, state: stage === "stale" ? "Taken" : stage === "hold" ? "Held" : "Venue time" },
    { label: "Capacity", value: stage === "waitlist" ? "0 seats" : stage === "capacity" ? "2 left" : "1 client", state: stage === "waitlist" ? "Waitlist" : "Fits" },
    { label: "Policy", value: "$20 deposit", state: stage === "policy" || stage === "payment" || stage === "confirmed" ? "Accepted" : "Required" },
    { label: "Contact", value: "mina@example.com", state: stage === "verify" || stage === "confirmed" ? "Verified" : "Needed" }
  ];
  const slots = [
    { label: "10:00", state: "closed" },
    { label: "14:30", state: stage === "stale" ? "taken" : stage === "hold" || stage === "confirmed" ? "held" : "open" },
    { label: "16:00", state: "open" },
    { label: "17:30", state: stage === "waitlist" ? "full" : "open" }
  ];
  return (
    <div className={`booking-frame is-${stage}`}>
      <section className="booking-panel" aria-labelledby={`booking-title-${idSuffix}`}>
        <div className="booking-heading">
          <span>Booking</span>
          <strong>{status}</strong>
        </div>
        <h4 id={`booking-title-${idSuffix}`}>{title[stage]}</h4>
        <p>{message[stage]}</p>
        <div className="booking-fields">
          {rows.map((row) => (
            <div className={row.state === "Taken" || row.state === "Required" || row.state === "Needed" ? "needs-action" : row.state === "Accepted" || row.state === "Verified" || row.state === "Held" ? "is-complete" : ""} key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <em>{row.state}</em>
            </div>
          ))}
        </div>
      </section>
      <aside className="booking-slots-panel" aria-label="Bookable slots">
        <strong>{stage === "waitlist" ? "Yoga class capacity" : "Venue time America/New_York"}</strong>
        <div className="booking-slot-list">
          {slots.map((item) => (
            <button type="button" className={`booking-slot is-${item.state}`} key={item.label}>
              <span>{item.label}</span>
              <em>{item.state === "open" ? "Open" : item.state === "held" ? "Held" : item.state === "full" ? "Full" : item.state === "taken" ? "Taken" : "Closed"}</em>
            </button>
          ))}
        </div>
        <p>{stage === "payment" ? "Deposit is collected only after the slot is available." : stage === "cancel" ? "Cancellation releases Thu 14:30 back to the booking page." : stage === "reschedule" ? "Same reference moved from Thu 14:30 to Fri 11:00." : "Closed, full, and taken states explain unavailable choices before commit."}</p>
      </aside>
    </div>
  );
}

function BookingGoodUi() {
  return (
    <div className="quality-example booking-demo">
      <BookingFrame />
      <p className="demo-status">The booking surface shows service, staff, slot, capacity, venue timezone, intake, policy, deposit, verification, and confirmation consequences before reserving.</p>
    </div>
  );
}

function BookingBadUi() {
  return (
    <div className="bad-ui-sample booking-bad-demo is-dateOnly">
      <strong>Book now</strong>
      <div className="booking-bad-grid">
        {["Date", "Time", "Name", "Pay", "No capacity", "No policy"].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p className="demo-status">The broken surface treats booking as date, time, and payment entry with no service, staff, capacity, timezone, policy, or stale-slot recovery.</p>
    </div>
  );
}

function BookingGoodUx() {
  const [stage, setStage] = useState<BookingStage>("service");
  const [status, setStatus] = useState("Selecting");
  const [slot, setSlot] = useState("Thu 14:30");
  const [message, setMessage] = useState("The customer starts from a real service with duration, staff, venue time, and price visible.");

  function choose(nextStage: BookingStage, nextStatus: string, nextMessage: string) {
    setStage(nextStage);
    setStatus(nextStatus);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example booking-demo">
      <BookingFrame stage={stage} status={status} slot={slot} idSuffix="good-ux" />
      <div className="demo-row booking-controls" aria-label="Booking exercise controls">
        <button type="button" className={stage === "service" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSlot("Thu 14:30");
          choose("service", "Selecting", "Service selection names Haircut, Zara, 45 minutes, SoHo studio, $80 total, and venue timezone.");
        }}>Service</button>
        <button type="button" className={stage === "slot" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("slot", "Slot picked", "Only open slots can be selected; closed and full times explain their unavailable reason.")}>Slot</button>
        <button type="button" className={stage === "capacity" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("capacity", "Capacity checked", "Party size is included in the availability check before confirmation.")}>Capacity</button>
        <button type="button" className={stage === "intake" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("intake", "Intake ready", "Phone, notes, accessibility needs, and consent are captured before the slot is held.")}>Intake</button>
        <button type="button" className={stage === "policy" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("policy", "Policy accepted", "Late cancellation, refund, and no-show terms are accepted before deposit.")}>Policy</button>
        <button type="button" className={stage === "verify" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("verify", "Email verified", "Email PIN verification succeeds before the appointment is committed.")}>Verify</button>
        <button type="button" className={stage === "payment" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("payment", "Deposit ready", "The $20 deposit is authorized after the slot is rechecked, not before availability.")}>Payment</button>
        <button type="button" className={stage === "hold" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("hold", "Held", "A temporary hold prevents another customer taking Thu 14:30 during payment and verification.")}>Hold</button>
        <button type="button" className={stage === "confirmed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("confirmed", "Confirmed", "Booking BK-4821 shows Zara, Thu 14:30, venue timezone, calendar link, receipt, cancel, and reschedule links.")}>Confirmed</button>
        <button type="button" className={stage === "cancel" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("cancel", "Canceled", "Cancel releases Thu 14:30 back to the booking page and explains refund follow-up.")}>Cancel</button>
        <button type="button" className={stage === "reschedule" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSlot("Fri 11:00");
          choose("reschedule", "Rescheduled", "Reschedule moves reference BK-4821 to Fri 11:00 and keeps customer details.");
        }}>Reschedule</button>
        <button type="button" className={stage === "waitlist" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("waitlist", "Waitlist", "Sold-out class offers a waitlist instead of overbooking the final seat.")}>Waitlist</button>
        <button type="button" className={stage === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("stale", "Slot taken", "Stale slot recovery blocks Thu 14:30 and offers 16:00 without clearing contact details.")}>Stale</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function BookingBadUx() {
  type Mode = "dateOnly" | "hiddenCapacity" | "wrongTimezone" | "payFirst" | "noPolicy" | "lostCancel";
  const [mode, setMode] = useState<Mode>("dateOnly");
  const copy: Record<Mode, string> = {
    dateOnly: "The form asks for date and time but hides service, staff, duration, capacity, and confirmation behavior.",
    hiddenCapacity: "The customer books three seats even though only two remain, so the class is over capacity.",
    wrongTimezone: "The booking uses browser time instead of venue time, so an in-person appointment lands in the wrong slot.",
    payFirst: "Payment is taken before availability is rechecked, then the chosen slot is unavailable.",
    noPolicy: "Late-cancel, refund, and no-show terms appear only after the booking is confirmed.",
    lostCancel: "Cancel removes the customer view but leaves the provider calendar blocked and no notification is sent."
  };
  const labels: Record<Mode, string[]> = {
    dateOnly: ["Date", "Time", "Book"],
    hiddenCapacity: ["3 guests", "2 seats", "Confirmed"],
    wrongTimezone: ["14:30 local", "Venue?", "Wrong slot"],
    payFirst: ["Card charged", "Slot taken", "No booking"],
    noPolicy: ["Confirmed", "Terms later", "No refund"],
    lostCancel: ["Canceled", "Slot blocked", "No email"]
  };
  return (
    <div className={`quality-example booking-bad-demo is-${mode}`}>
      <strong>{mode === "payFirst" ? "Paid booking" : mode === "lostCancel" ? "Cancel booking" : "Book appointment"}</strong>
      <div className="booking-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row booking-controls">
        <button type="button" className={mode === "dateOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("dateOnly")}>Date only</button>
        <button type="button" className={mode === "hiddenCapacity" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenCapacity")}>Hidden capacity</button>
        <button type="button" className={mode === "wrongTimezone" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongTimezone")}>Wrong timezone</button>
        <button type="button" className={mode === "payFirst" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("payFirst")}>Pay first</button>
        <button type="button" className={mode === "noPolicy" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noPolicy")}>No policy</button>
        <button type="button" className={mode === "lostCancel" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("lostCancel")}>Lost cancel</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <BookingGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <BookingBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <BookingGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <BookingBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
