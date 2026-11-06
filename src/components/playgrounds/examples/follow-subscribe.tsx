import { useState } from "react";
import type { PatternMeta } from './shared';
import { QualityPanel } from './shared';

type FollowSubscribeMode = "notFollowing" | "following" | "thread" | "parentScope" | "autoFollow" | "delivery" | "digest" | "muted" | "permission" | "closed" | "bulk";

const followSubscribeCopy: Record<FollowSubscribeMode, {
  title: string;
  state: string;
  scope: string;
  reason: string;
  delivery: string;
  detail: string;
}> = {
  notFollowing: {
    title: "Incident refund thread",
    state: "Not following",
    scope: "Thread replies only",
    reason: "No subscription yet",
    delivery: "No future updates",
    detail: "The control names the exact target before the user opts into future replies."
  },
  following: {
    title: "Incident refund thread",
    state: "Following",
    scope: "Thread replies only",
    reason: "Manual follow",
    delivery: "Activity feed and email digest",
    detail: "Future replies will be delivered without making the thread a bookmark or a mention."
  },
  thread: {
    title: "Incident refund thread",
    state: "Following thread",
    scope: "One thread",
    reason: "Manual follow",
    delivery: "Followed threads list",
    detail: "Thread scope avoids subscribing the user to the whole channel."
  },
  parentScope: {
    title: "Refund operations space",
    state: "Watching space",
    scope: "All pages in this space",
    reason: "Parent-scope watch",
    delivery: "Immediate in-app plus daily email digest",
    detail: "A broader parent watch is shown differently from an item-level follow."
  },
  autoFollow: {
    title: "Pull request #742",
    state: "Auto-followed",
    scope: "Issue and pull request comments",
    reason: "You replied yesterday",
    delivery: "Notification center",
    detail: "The reason explains why updates arrive even though the user did not press Follow."
  },
  delivery: {
    title: "Platform incidents saved view",
    state: "Subscribed",
    scope: "New matching items",
    reason: "Saved-view subscription",
    delivery: "Activity feed, banner for blockers, weekly email",
    detail: "Delivery is separated from the saved view so users know what will notify them."
  },
  digest: {
    title: "Release notes page",
    state: "Watching page",
    scope: "Page edits and comments",
    reason: "Manual watch",
    delivery: "Daily digest at 09:00",
    detail: "Digest timing is visible so delayed updates are expected rather than mysterious."
  },
  muted: {
    title: "Customer chatter channel",
    state: "Muted subscription",
    scope: "All new posts",
    reason: "Channel follow kept, delivery muted",
    delivery: "No banners; unread badge only",
    detail: "Muting reduces interruption while preserving an explainable subscription record."
  },
  permission: {
    title: "Partner escalation page",
    state: "Access limited",
    scope: "Former page watch",
    reason: "Permission changed",
    delivery: "Updates paused",
    detail: "The UI stops dead links and explains that future delivery is paused until access returns."
  },
  closed: {
    title: "Incident #1287",
    state: "Closed target",
    scope: "Closed issue comments",
    reason: "Incident resolved",
    delivery: "No new updates unless reopened",
    detail: "Closed targets keep history visible while preventing noisy stale subscriptions."
  },
  bulk: {
    title: "Manage subscriptions",
    state: "3 selected",
    scope: "Thread, page, and repository",
    reason: "Bulk cleanup",
    delivery: "Preview before unsubscribe",
    detail: "Bulk changes show target scope before removing broad watches."
  }
};

function FollowSubscribeFrame({
  mode = "following",
  idSuffix = "demo"
}: {
  mode?: FollowSubscribeMode;
  idSuffix?: string;
}) {
  const copy = followSubscribeCopy[mode];
  const titleId = `follow-subscribe-title-${idSuffix}`;
  const isFollowing = mode !== "notFollowing" && mode !== "permission" && mode !== "closed";
  const rows = [
    ["Scope", copy.scope],
    ["Reason", copy.reason],
    ["Delivery", copy.delivery]
  ];
  return (
    <div className={`follow-subscribe-frame is-${mode}`}>
      <section className="follow-subscribe-target" aria-labelledby={titleId}>
        <div className="follow-subscribe-head">
          <span>{copy.state}</span>
          <strong>{isFollowing ? "Future updates on" : "Future updates off"}</strong>
        </div>
        <h4 id={titleId}>{copy.title}</h4>
        <p>{copy.detail}</p>
        <div className="follow-subscribe-actions">
          <button type="button" className={isFollowing ? "follow-subscribe-toggle is-on" : "follow-subscribe-toggle"} aria-pressed={isFollowing}>{isFollowing ? "Following" : "Follow"}</button>
          <button type="button" className="follow-subscribe-secondary">{isFollowing ? "Unfollow" : "Choose delivery"}</button>
        </div>
      </section>
      <aside className="follow-subscribe-detail" aria-label="Subscription details">
        {rows.map(([label, value]) => (
          <div className="follow-subscribe-row" key={`${label}-${value}`}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
        <div className={mode === "permission" || mode === "closed" ? "follow-subscribe-note is-warning" : "follow-subscribe-note"}>
          <span>{mode === "bulk" ? "Bulk unsubscribe previews broad parent watches before removal." : "Users can inspect scope, delivery, and why updates arrive."}</span>
        </div>
      </aside>
    </div>
  );
}

function FollowSubscribeGoodUi() {
  return (
    <div className="quality-example follow-subscribe-demo">
      <FollowSubscribeFrame />
      <p className="demo-status">The control names the target, current state, scope, delivery destination, reason, and same-context unfollow path.</p>
    </div>
  );
}

function FollowSubscribeBadUi() {
  return (
    <div className="bad-ui-sample follow-subscribe-bad-demo is-vagueScope">
      <strong>Subscribed</strong>
      <div className="follow-subscribe-bad-grid">
        {["Bell on", "Some emails", "Maybe all posts", "No unsubscribe"].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <p className="demo-status">The broken control hides whether the user subscribed to one thread, a parent space, all email, or a saved view.</p>
    </div>
  );
}

function FollowSubscribeGoodUx() {
  const [mode, setMode] = useState<FollowSubscribeMode>("following");
  const [message, setMessage] = useState("Following one thread sends future replies to the followed-threads list and digest without subscribing to the whole channel.");
  function choose(nextMode: FollowSubscribeMode, nextMessage: string) {
    setMode(nextMode);
    setMessage(nextMessage);
  }
  return (
    <div className="quality-example follow-subscribe-demo">
      <FollowSubscribeFrame mode={mode} idSuffix="good-ux" />
      <div className="demo-row follow-subscribe-controls" aria-label="Follow and subscribe exercise controls">
        <button type="button" className={mode === "notFollowing" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("notFollowing", "The not-following state names the thread before asking users to opt into future updates.")}>Not following</button>
        <button type="button" className={mode === "following" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("following", "Following one thread sends future replies to the followed-threads list and digest without subscribing to the whole channel.")}>Follow</button>
        <button type="button" className={mode === "thread" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("thread", "Thread scope is explicit, so the user does not receive all channel posts.")}>Thread scope</button>
        <button type="button" className={mode === "parentScope" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("parentScope", "Parent-scope watches are shown as broader than item-level follows.")}>Parent scope</button>
        <button type="button" className={mode === "autoFollow" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("autoFollow", "Auto-followed state explains that the user is receiving updates because they replied.")}>Auto-follow</button>
        <button type="button" className={mode === "delivery" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("delivery", "Delivery settings separate Activity feed, banner, and email outcomes from the saved view itself.")}>Delivery</button>
        <button type="button" className={mode === "digest" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("digest", "Digest timing is visible so delayed updates are expected.")}>Digest</button>
        <button type="button" className={mode === "muted" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("muted", "Muted delivery keeps the subscription explainable while reducing interruption.")}>Muted</button>
        <button type="button" className={mode === "permission" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("permission", "Permission loss pauses future updates and prevents dead notification links.")}>Permission</button>
        <button type="button" className={mode === "closed" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("closed", "Closed targets keep history visible while stopping routine future updates.")}>Closed</button>
        <button type="button" className={mode === "bulk" ? "demo-button small primary" : "demo-button small"} onClick={() => choose("bulk", "Bulk unsubscribe previews each target and broad parent scope before removal.")}>Bulk cleanup</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function FollowSubscribeBadUx() {
  type Mode = "vagueScope" | "hiddenUnfollow" | "surpriseEmail" | "duplicateDelivery" | "staleAccess" | "fakeBookmark";
  const [mode, setMode] = useState<Mode>("vagueScope");
  const copy: Record<Mode, string> = {
    vagueScope: "Subscribed does not say whether updates come from one thread, the whole space, or every matching item.",
    hiddenUnfollow: "Users must leave the object, open global settings, and search a long list to stop one noisy page.",
    surpriseEmail: "Following a channel silently enables email, push, banners, and digest delivery.",
    duplicateDelivery: "The same page edit arrives from page watch, space watch, mention, and digest with no deduplication.",
    staleAccess: "A subscription keeps sending links after the user loses access to the target.",
    fakeBookmark: "Follow only saves a shortcut and never delivers future updates, contradicting the label."
  };
  const labels: Record<Mode, string[]> = {
    vagueScope: ["Subscribed", "Scope unknown", "All updates?"],
    hiddenUnfollow: ["Global settings", "82 subscriptions", "No object link"],
    surpriseEmail: ["Email on", "Push on", "Banner on"],
    duplicateDelivery: ["Page watch", "Space watch", "Mention copy"],
    staleAccess: ["Access denied", "Still followed", "Dead link"],
    fakeBookmark: ["Saved shortcut", "No updates", "Mislabelled"]
  };
  return (
    <div className={`quality-example follow-subscribe-bad-demo is-${mode}`}>
      <strong>{mode === "surpriseEmail" ? "Surprise delivery" : mode === "fakeBookmark" ? "Fake follow" : "Broken subscription"}</strong>
      <div className="follow-subscribe-bad-grid">
        {labels[mode].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <p>{copy[mode]}</p>
      <div className="demo-row follow-subscribe-controls">
        <button type="button" className={mode === "vagueScope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vagueScope")}>Vague scope</button>
        <button type="button" className={mode === "hiddenUnfollow" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenUnfollow")}>Hidden unfollow</button>
        <button type="button" className={mode === "surpriseEmail" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("surpriseEmail")}>Surprise email</button>
        <button type="button" className={mode === "duplicateDelivery" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("duplicateDelivery")}>Duplicate delivery</button>
        <button type="button" className={mode === "staleAccess" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleAccess")}>Stale access</button>
        <button type="button" className={mode === "fakeBookmark" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("fakeBookmark")}>Fake bookmark</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function GoodUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FollowSubscribeGoodUi />;
}

function BadUiExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FollowSubscribeBadUi />;
}

function GoodUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FollowSubscribeGoodUx />;
}

function BadUxExample(_props: { patternId: string; meta: PatternMeta }) {
  return <FollowSubscribeBadUx />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
