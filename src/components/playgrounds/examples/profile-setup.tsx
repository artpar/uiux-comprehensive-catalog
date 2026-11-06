import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ProfileSetupStage = "current" | "required" | "recommended" | "visibility" | "managed" | "partial" | "return";

function ProfileSetupFrame({
  stage = "current",
  completion = 64,
  skipped = false,
  managed = false,
  saved = false,
  returned = false,
  idSuffix = "default"
}: {
  stage?: ProfileSetupStage;
  completion?: number;
  skipped?: boolean;
  managed?: boolean;
  saved?: boolean;
  returned?: boolean;
  idSuffix?: string;
}) {
  const title: Record<ProfileSetupStage, string> = {
    current: "Review profile readiness",
    required: "Add required scheduling detail",
    recommended: "Choose recommended profile details",
    visibility: "Confirm who can see each field",
    managed: "Review synced organization fields",
    partial: "Profile progress saved",
    return: "Back to project invitation"
  };
  const profileRows = [
    { label: "Display name", value: "Maya Rivera", state: "Complete" },
    { label: "Time zone", value: stage === "required" || saved ? "Asia/Kolkata" : "Missing", state: "Required" },
    { label: "Photo", value: skipped ? "Initials used" : "Add later", state: "Optional" },
    { label: "Job title", value: "Permit coordinator", state: managed ? "Synced" : "Managed" }
  ];

  return (
    <div className={`profile-setup-frame is-${stage}`}>
      <section className="profile-setup-main" aria-labelledby={`profile-setup-title-${idSuffix}`}>
        <div className="profile-setup-heading">
          <span>{saved ? "Saved readiness" : "Existing profile"}</span>
          <strong>{completion}% ready</strong>
        </div>
        <h4 id={`profile-setup-title-${idSuffix}`}>{title[stage]}</h4>
        <p>
          {stage === "current"
            ? "This profile already works. Setup only asks for details that improve team recognition and scheduling."
            : stage === "required"
              ? "Time zone is required because invitations schedule review sessions across teams."
              : stage === "recommended"
                ? "Photo, short bio, and languages are recommended, not required, and can be skipped."
                : stage === "visibility"
                  ? "Location is Team only, bio is Organization, and public profile remains off."
                  : stage === "managed"
                    ? "Department and title are synced from Okta, with a request-change route instead of editable fields."
                    : stage === "partial"
                      ? "Skipped details are remembered so the prompt does not block every page."
                      : "The saved setup returns to the project invitation that launched it."}
        </p>
        <div className="profile-setup-meter" aria-label={`Profile readiness ${completion}%`}>
          <span style={{ width: `${completion}%` }} />
        </div>
        <div className="profile-setup-list">
          {profileRows.map((row) => (
            <div className={row.state === "Required" && row.value === "Missing" ? "needs-action" : row.state === "Synced" || row.state === "Managed" ? "is-managed" : ""} key={row.label}>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
              <em>{row.state}</em>
            </div>
          ))}
        </div>
      </section>
      <aside className="profile-setup-preview" aria-label="Profile setup preview">
        <div className="profile-setup-avatar" aria-hidden="true">MR</div>
        <strong>Maya Rivera</strong>
        <span>Permit coordinator</span>
        <p>Preview for team directory, mentions, and invitation cards.</p>
        <dl>
          <div>
            <dt>Location</dt>
            <dd>Team only</dd>
          </div>
          <div>
            <dt>Public profile</dt>
            <dd>Off</dd>
          </div>
          <div>
            <dt>Next step</dt>
            <dd>{returned ? "Project invite" : saved ? "Return available" : "Save or skip"}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function ProfileSetupGoodUi() {
  return (
    <div className="quality-example profile-setup-demo">
      <ProfileSetupFrame idSuffix="good-ui" />
      <p className="demo-status">The setup surface starts from an existing profile, separates required, recommended, optional, and managed fields, shows visibility, and keeps return-to-task visible.</p>
    </div>
  );
}

function ProfileSetupBadUi() {
  return (
    <div className="bad-ui-sample profile-setup-bad-demo is-meterPressure">
      <strong>Complete your profile: 21%</strong>
      <div className="profile-setup-bad-grid">
        {["Photo required", "Birthday required", "Phone required", "Home city public", "Edit synced title", "No skip"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">A disclosure-pressure checklist treats optional details as mandatory, hides audience labels, and blocks the user's actual work.</p>
    </div>
  );
}

function ProfileSetupGoodUx() {
  const [stage, setStage] = useState<ProfileSetupStage>("current");
  const [completion, setCompletion] = useState(64);
  const [skipped, setSkipped] = useState(false);
  const [managed, setManaged] = useState(false);
  const [saved, setSaved] = useState(false);
  const [returned, setReturned] = useState(false);
  const [message, setMessage] = useState("Profile setup opens from the current saved profile and explains what is missing.");

  function choose(nextStage: ProfileSetupStage, nextCompletion: number, nextMessage: string) {
    setStage(nextStage);
    setCompletion(nextCompletion);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example profile-setup-demo">
      <ProfileSetupFrame stage={stage} completion={completion} skipped={skipped} managed={managed} saved={saved} returned={returned} idSuffix="good-ux" />
      <div className="demo-row profile-setup-controls" aria-label="Profile setup exercise controls">
        <button type="button" className={stage === "current" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("current", 64, "Current values are shown first, so setup does not feel like a new account or new profile flow.")}>Current</button>
        <button type="button" className={stage === "required" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("required", 78, "The required time zone has a specific scheduling reason and does not make photo or bio mandatory.")}>Required</button>
        <button type="button" className={skipped ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSkipped(true);
          choose("recommended", 78, "Recommended fields can be skipped intentionally and the setup remembers that choice.");
        }}>Skip optional</button>
        <button type="button" className={stage === "visibility" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("visibility", 82, "Audience labels show Team only, Organization, and Public off before profile details are saved.")}>Visibility</button>
        <button type="button" className={managed ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setManaged(true);
          choose("managed", 82, "Synced fields stay read-only and point to the organization correction route.");
        }}>Synced field</button>
        <button type="button" className={saved ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSaved(true);
          choose("partial", 82, "Partial save keeps edits and skipped details without repeatedly blocking unrelated product pages.");
        }}>Save partial</button>
        <button type="button" className={returned ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setReturned(true);
          choose("return", 82, "Return sends the user back to the project invitation that launched profile setup.");
        }}>Return</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ProfileSetupBadUx() {
  type Mode = "meterPressure" | "publicDefault" | "syncedEdit" | "noSkip" | "mixedSettings" | "repeatedNag";
  const [mode, setMode] = useState<Mode>("meterPressure");
  const copy: Record<Mode, string> = {
    meterPressure: "The percentage meter pressures disclosure of birthday, phone, and photo even though none are needed for the current task.",
    publicDefault: "Location, bio, and photo become externally visible without audience labels or a profile preview.",
    syncedEdit: "The user edits a synced department field, saves it, and the directory overwrites it later with no correction route.",
    noSkip: "The project invitation remains blocked until every recommended profile detail is filled.",
    mixedSettings: "Security, notifications, marketing consent, billing, and profile fields are mixed into one ambiguous setup page.",
    repeatedNag: "The same optional photo prompt returns on every page after the user intentionally skipped it."
  };
  const labels: Record<Mode, string[]> = {
    meterPressure: ["21% complete", "Birthday missing", "Phone missing"],
    publicDefault: ["Location Public", "Bio Public", "No preview"],
    syncedEdit: ["Edit title", "Save appears OK", "Sync overwrites"],
    noSkip: ["Invite blocked", "Photo missing", "No later path"],
    mixedSettings: ["MFA", "Newsletter", "Billing", "Photo"],
    repeatedNag: ["Skipped photo", "Prompt returns", "Task covered"]
  };
  return (
    <div className={`quality-example profile-setup-bad-demo is-${mode}`}>
      <strong>{mode === "publicDefault" ? "Public by default" : mode === "mixedSettings" ? "Account setup" : "Complete your profile"}</strong>
      <div className="profile-setup-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row profile-setup-controls">
        <button type="button" className={mode === "meterPressure" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("meterPressure")}>Meter pressure</button>
        <button type="button" className={mode === "publicDefault" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("publicDefault")}>Public default</button>
        <button type="button" className={mode === "syncedEdit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("syncedEdit")}>Synced edit</button>
        <button type="button" className={mode === "noSkip" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noSkip")}>No skip</button>
        <button type="button" className={mode === "mixedSettings" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedSettings")}>Mixed settings</button>
        <button type="button" className={mode === "repeatedNag" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("repeatedNag")}>Repeated prompt</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ProfileSetupGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ProfileSetupBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ProfileSetupGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <ProfileSetupBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
