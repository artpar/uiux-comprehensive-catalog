import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type ProfileCreationStage = "display" | "avatar" | "visibility" | "managed" | "preview" | "saved";

function ProfileCreationFrame({
  stage = "display",
  avatar = "initials",
  visibility = "Team",
  managed = false,
  saved = false
}: {
  stage?: ProfileCreationStage;
  avatar?: "initials" | "photo";
  visibility?: "Only me" | "Team" | "Organization" | "Public";
  managed?: boolean;
  saved?: boolean;
}) {
  const stageText: Record<ProfileCreationStage, string> = {
    display: "Create your team profile",
    avatar: "Choose how you appear",
    visibility: "Choose who can see each field",
    managed: "Review managed details",
    preview: "Preview your profile card",
    saved: "Profile saved"
  };
  return (
    <div className={`profile-create-frame is-${stage}`}>
      <section className="profile-create-form" aria-labelledby="profile-create-title">
        <span className="profile-create-kicker">{saved ? "Saved profile" : "Visible identity"}</span>
        <h4 id="profile-create-title">{stageText[stage]}</h4>
        <p>
          {stage === "display"
            ? "This profile appears in mentions, assignments, comments, and the team directory."
            : stage === "avatar"
              ? "A photo is optional. Initials are used until you upload one."
              : stage === "visibility"
                ? "Each profile field keeps the audience shown next to it after save."
                : stage === "managed"
                  ? "Job title is synced from the company directory and has a request-change route."
                  : stage === "preview"
                    ? "Preview matches the card teammates see before the profile is published."
                    : "The saved profile returns to the team directory with edit-later controls."}
        </p>
        <div className="profile-create-fields">
          <label>
            <span>Display name <em>Required</em></span>
            <input value="Maya Rivera" readOnly />
          </label>
          <label>
            <span>Pronouns <em>Optional</em></span>
            <input value="she/her" readOnly />
          </label>
          <label className={managed ? "is-managed" : ""}>
            <span>Job title <em>{managed ? "Managed" : "Optional"}</em></span>
            <input value="Permit coordinator" readOnly />
          </label>
          <label>
            <span>Location <em>{visibility}</em></span>
            <input value="Pune" readOnly />
          </label>
        </div>
        {managed && <p className="profile-create-managed">Synced from Okta. Request title changes through People Ops.</p>}
      </section>
      <aside className="profile-create-preview" aria-label="Profile preview">
        <div className={avatar === "photo" ? "profile-create-avatar has-photo" : "profile-create-avatar"} aria-hidden="true">{avatar === "photo" ? "" : "MR"}</div>
        <strong>Maya Rivera</strong>
        <span>@maya</span>
        <p>Permit coordinator helping teams unblock application reviews.</p>
        <div className="profile-create-visibility">
          <span>Location</span>
          <strong>{visibility}</strong>
        </div>
        <div className="profile-create-visibility">
          <span>Profile card</span>
          <strong>{saved ? "Saved" : "Preview only"}</strong>
        </div>
      </aside>
    </div>
  );
}

function CreateUserProfileGoodUi() {
  return (
    <div className="quality-example profile-create-demo">
      <ProfileCreationFrame />
      <p className="demo-status">The profile form separates required display identity from optional details, keeps photo optional, labels visibility, and previews the card before saving.</p>
    </div>
  );
}

function CreateUserProfileBadUi() {
  return (
    <div className="bad-ui-sample profile-create-bad-demo is-requiredOptional">
      <strong>Complete every profile field</strong>
      <div className="profile-create-bad-grid">
        {["Legal name", "Photo upload", "Birthday", "Phone", "Home city", "Bio", "Social links", "Public directory"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <p className="demo-status">Optional and sensitive details are required before entry, visibility is hidden, and there is no preview of where the profile appears.</p>
    </div>
  );
}

function CreateUserProfileGoodUx() {
  const [stage, setStage] = useState<ProfileCreationStage>("display");
  const [avatar, setAvatar] = useState<"initials" | "photo">("initials");
  const [visibility, setVisibility] = useState<"Only me" | "Team" | "Organization" | "Public">("Team");
  const [managed, setManaged] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("Profile creation starts with visible identity and explains where the profile appears.");

  function choose(nextStage: ProfileCreationStage, nextMessage: string) {
    setStage(nextStage);
    setMessage(nextMessage);
  }

  return (
    <div className="quality-example profile-create-demo">
      <ProfileCreationFrame stage={stage} avatar={avatar} visibility={visibility} managed={managed} saved={saved} />
      <div className="demo-row profile-create-controls" aria-label="Create user profile exercise controls">
        <button type="button" className={stage === "display" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("display", "Required display name is distinct from legal name, username, and optional profile enrichment.")}>Display name</button>
        <button type="button" className={avatar === "initials" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setAvatar("initials");
          choose("avatar", "Photo upload is optional and initials keep the profile recognizable when the user skips it.");
        }}>Skip photo</button>
        <button type="button" className={visibility !== "Public" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setVisibility(visibility === "Team" ? "Organization" : "Team");
          choose("visibility", "Visibility labels show the audience for sensitive fields before the profile is saved.");
        }}>Set visibility</button>
        <button type="button" className={managed ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setManaged(true);
          choose("managed", "Managed fields are not editable as if user-controlled and include a request-change path.");
        }}>Managed title</button>
        <button type="button" className={stage === "preview" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setAvatar("photo");
          choose("preview", "The preview shows the profile card teammates will see in mentions and the directory.");
        }}>Preview card</button>
        <button type="button" className={saved ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setSaved(true);
          choose("saved", "Saving returns to the team directory with edit-later controls and retained visibility choices.");
        }}>Save profile</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function CreateUserProfileBadUx() {
  type Mode = "forcedPhoto" | "publicDefault" | "legalNameLeak" | "managedOverwrite" | "noPreview" | "requiredOptional";
  const [mode, setMode] = useState<Mode>("forcedPhoto");
  const copy: Record<Mode, string> = {
    forcedPhoto: "Photo upload blocks entry even though initials would identify the user in mentions and cards.",
    publicDefault: "Location, bio, and photo are public by default with no audience explanation.",
    legalNameLeak: "The form copies legal name into display name and exposes it to external collaborators.",
    managedOverwrite: "The user edits job title, but directory sync silently overwrites it later.",
    noPreview: "The page saves profile details without showing the card, byline, directory result, or public view.",
    requiredOptional: "Bio, pronouns, birthday, phone, and social links are treated as required profile completion."
  };
  const labels: Record<Mode, string[]> = {
    forcedPhoto: ["Upload photo", "Crop face", "Continue disabled"],
    publicDefault: ["Photo Public", "Location Public", "Bio Public"],
    legalNameLeak: ["Legal name", "External display", "No alias"],
    managedOverwrite: ["Edit title", "Synced overnight", "Value changed"],
    noPreview: ["Display name", "Bio", "Save blindly"],
    requiredOptional: ["Birthday", "Phone", "Social links"]
  };
  return (
    <div className={`quality-example profile-create-bad-demo is-${mode}`}>
      <strong>{mode === "publicDefault" ? "Public profile setup" : mode === "forcedPhoto" ? "Upload your photo to continue" : "Profile completion"}</strong>
      <div className="profile-create-bad-grid">
        {labels[mode].map((label) => <span key={label}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row profile-create-controls">
        <button type="button" className={mode === "forcedPhoto" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("forcedPhoto")}>Forced photo</button>
        <button type="button" className={mode === "publicDefault" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("publicDefault")}>Public default</button>
        <button type="button" className={mode === "legalNameLeak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("legalNameLeak")}>Legal name leak</button>
        <button type="button" className={mode === "managedOverwrite" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("managedOverwrite")}>Managed overwrite</button>
        <button type="button" className={mode === "noPreview" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noPreview")}>No preview</button>
        <button type="button" className={mode === "requiredOptional" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("requiredOptional")}>Required extras</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CreateUserProfileGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CreateUserProfileBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CreateUserProfileGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <CreateUserProfileBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
