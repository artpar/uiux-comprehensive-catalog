import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from "react";
import { QualityPanel, type PatternMeta } from './shared';

function DialogUi({ patternId, meta, good = false }: { patternId: string; meta: PatternMeta; good?: boolean }) {
  if (!good) {
    if (patternId === "menu-button") {
      return (
        <div className="bad-ui-sample menu-button-preview bad" aria-label="Broken menu button preview">
          <button type="button" className="mystery-icon-button">...</button>
          <div className="menu-button-menu bad-menu" aria-label="Unstructured report actions">
            <button type="button">Archive</button>
            <label><input type="checkbox" readOnly /> Notify team</label>
            <a href="#bad-menu-content">Details page</a>
            <button type="button">Rename</button>
          </div>
          <p className="demo-status">Trigger is unnamed, expanded state is absent, and the popup mixes commands, form controls, and navigation.</p>
        </div>
      );
    }

    if (patternId === "confirmation-dialog") {
      return (
        <div className="bad-ui-sample">
          <div className="fake-modal">
            <strong>Are you sure?</strong>
            <p>No object, scope, or recovery detail.</p>
            <button type="button">OK</button>
          </div>
        </div>
      );
    }

    if (patternId === "confirmation-fatigue") return <ConfirmationFatigueBadUi />;

    if (patternId === "destructive-action-confirmation") {
      return (
        <div className="bad-ui-sample destructive-confirm-preview bad" aria-label="Broken destructive confirmation preview">
          <div className="fake-modal destructive-confirm-modal bad">
            <strong>Are you sure?</strong>
            <p>This cannot be undone.</p>
            <div className="destructive-confirm-actions">
              <button type="button">Cancel</button>
              <button type="button">OK</button>
            </div>
          </div>
          <p className="demo-status">The prompt hides the project name, affected records, shared links, dependencies, and final destructive verb.</p>
        </div>
      );
    }

    if (patternId === "typed-confirmation") {
      return (
        <div className="bad-ui-sample typed-confirm-preview bad" aria-label="Broken typed confirmation preview">
          <div className="typed-confirm-modal bad">
            <strong>Delete repository?</strong>
            <p>Type DELETE to continue.</p>
            <label>
              <span>Confirmation</span>
              <input type="password" value="DELETE" readOnly />
            </label>
            <button type="button">Delete</button>
          </div>
          <p className="demo-status">The UI asks for a ritual word, masks visible target text, and does not verify the repository path.</p>
        </div>
      );
    }

    if (patternId === "modal-for-nonblocking-content") return <ModalForNonblockingContentBadUi />;

    if (patternId === "modal-dialog") {
      return (
        <div className="bad-ui-sample fake-modal-background">
          <button type="button">Navigate</button>
          <div className="fake-modal">
            <strong>Popup</strong>
            <p>No title, background still active.</p>
            <button type="button">OK</button>
          </div>
          <button type="button">Delete</button>
        </div>
      );
    }

    if (patternId === "alert-dialog") {
      return (
        <div className="bad-ui-sample alert-dialog-static-preview bad">
          <button type="button">Keep editing</button>
          <div className="fake-modal alert-dialog-panel bad">
            <strong>Warning</strong>
            <p>Something changed. Press OK.</p>
            <button type="button">OK</button>
          </div>
          <button type="button">Delete draft</button>
          <p className="demo-status">The interruption uses vague copy, one unlabeled response, and active controls behind it.</p>
        </div>
      );
    }

    if (patternId === "drawer-with-no-close-or-return-path") return <DrawerNoCloseReturnBadUi />;

    if (patternId === "drawer") {
      return (
        <div className="bad-ui-sample drawer-static-preview bad">
          <div className="drawer-table-preview" aria-hidden="true">
            <span>Claim C-1042</span>
            <span>High risk</span>
          </div>
          <div className="drawer-panel-preview bad">
            <strong>Details</strong>
            <p>No selected object, no close control, and the panel covers the row being inspected.</p>
            <button type="button">Save</button>
          </div>
          <p className="demo-status">The panel hides context, lacks a close path, and looks like a drawer without preserving object identity.</p>
        </div>
      );
    }

    if (patternId === "details-panel") {
      return (
        <div className="bad-ui-sample details-panel-static-preview bad" aria-label="Broken details panel preview">
          <div className="details-panel-list bad" aria-label="Broken ticket list">
            <button type="button" className="details-panel-row is-selected"><span>TCK-2048</span><small>Selected</small></button>
            <button type="button" className="details-panel-row"><span>TCK-2049</span><small>Newer update</small></button>
          </div>
          <div className="details-panel-pane bad">
            <strong>Details</strong>
            <p>Shows yesterday's ticket, global filters, delete actions, and account settings with no selected-object match.</p>
            <button type="button">Delete</button>
            <button type="button">Settings</button>
          </div>
          <p className="demo-status">The panel title is generic, content is stale, and actions do not clearly belong to the selected ticket.</p>
        </div>
      );
    }

    if (patternId === "preview-panel") {
      return (
        <div className="bad-ui-sample preview-panel-static-preview bad" aria-label="Broken preview panel preview">
          <div className="preview-panel-list bad" aria-label="Broken file list">
            <button type="button" className="preview-panel-row"><span>Forecast.pdf</span><small>Previously viewed</small></button>
            <button type="button" className="preview-panel-row is-selected"><span>Receipt.png</span><small>Selected now</small></button>
          </div>
          <div className="preview-panel-pane bad">
            <strong>Preview</strong>
            <div className="preview-panel-canvas bad">
              <div className="preview-panel-page">
                <span>Forecast Q4 page 1</span>
                <i></i>
                <i></i>
              </div>
            </div>
            <p>Still renders the previous PDF, has no page or zoom controls, and gives no warning for unsupported or risky files.</p>
          </div>
          <p className="demo-status">The selected row and rendered content disagree, so users could approve the wrong file.</p>
        </div>
      );
    }

    if (patternId === "sheet") {
      return (
        <div className="bad-ui-sample sheet-static-preview bad">
          <div className="sheet-parent-card" aria-hidden="true">
            <strong>Claim C-1042</strong>
            <span>Follow-up needed</span>
            <button type="button">Change queue</button>
          </div>
          <div className="sheet-surface bad">
            <strong>Sheet</strong>
            <p>Three fields changed, but swiping or pressing Escape closes immediately.</p>
            <div className="sheet-hidden-actions">
              <span>Actions below scroll</span>
              <button type="button">OK</button>
            </div>
          </div>
          <p className="demo-status">The sheet has a vague title, active parent controls, hidden actions, and no dirty-state dismissal review.</p>
        </div>
      );
    }

    if (patternId === "bottom-sheet") {
      return (
        <div className="bad-ui-sample bottom-sheet-static-preview bad">
          <div className="bottom-sheet-phone bad" aria-label="Broken bottom sheet preview">
            <div className="bottom-sheet-map">
              <span className="bottom-sheet-pin">A</span>
              <span className="bottom-sheet-route"></span>
            </div>
            <div className="bottom-sheet-panel bad is-full">
              <strong>Menu</strong>
              <p>Full-height panel hides the selected pin and mixes navigation, settings, and route actions.</p>
              <button type="button">Dashboard</button>
              <button type="button">Settings</button>
            </div>
          </div>
          <p className="demo-status">The panel behaves like a full takeover, has no useful peek state, and blocks the map context bottom sheets are meant to preserve.</p>
        </div>
      );
    }

    if (patternId === "popover") {
      return (
        <div className="bad-ui-sample popover-static-preview bad">
          <div className="popover-task-row bad">
            <span>
              <strong>Quarter close checklist</strong>
              <small>Due date unknown</small>
            </span>
            <button type="button">?</button>
          </div>
          <div className="popover-surface bad detached">
            <strong>Info</strong>
            <p>Required instructions, a text field, menu commands, and navigation are mixed into a floating box that is not tied to the Due date trigger.</p>
            <input aria-label="Hidden due date" value="Tomorrow" readOnly />
            <button type="button">OK</button>
          </div>
          <p className="demo-status">The layer is detached from its anchor, hides required task help, and mixes popover, menu, and modal behavior.</p>
        </div>
      );
    }

    if (patternId === "tooltip-only-required-information") return <TooltipOnlyRequiredInfoBadUi />;

    if (patternId === "tooltip") {
      return (
        <div className="bad-ui-sample tooltip-static-preview bad">
          <div className="tooltip-toolbar bad" aria-label="Broken compact toolbar">
            <button type="button">?</button>
            <button type="button">?</button>
            <button type="button">?</button>
          </div>
          <div className="tooltip-bubble bad wide">
            <strong>Instructions</strong>
            <p>This hover-only layer contains required filing rules, a link, and a button, but keyboard focus cannot enter it.</p>
            <button type="button">Learn more</button>
          </div>
          <p className="demo-status">The tooltip replaces action names, hides required content, and contains controls that cannot receive focus.</p>
        </div>
      );
    }

    if (patternId === "hover-card") {
      return (
        <div className="bad-ui-sample hover-card-static-preview bad" aria-label="Broken hover card preview">
          <div className="hover-card-doc-row bad">
            <button type="button" className="hover-card-trigger">@Maya Chen</button>
            <span>approved the forecast note.</span>
          </div>
          <div className="hover-card-panel bad detached">
            <strong>Someone</strong>
            <p>Required approval rules, Delete person, a text field, and stale activity are mixed into one disappearing card.</p>
            <input aria-label="Edit owner inside hover card" value="Maya" readOnly />
            <button type="button" className="danger">Delete</button>
          </div>
          <p className="demo-status">The card is stale, interactive, required for the task, and likely to disappear before users can inspect it.</p>
        </div>
      );
    }

    if (patternId === "context-menu") {
      return (
        <div className="bad-ui-sample context-menu-static-preview bad">
          <div className="context-menu-file-list bad" aria-label="Broken file list">
            <button type="button" className="context-menu-file-row is-selected"><span>Forecast.xlsx</span><small>Focused</small></button>
            <button type="button" className="context-menu-file-row"><span>Budget.csv</span><small>Previously selected</small></button>
          </div>
          <div className="context-menu-surface bad detached">
            <strong>Actions</strong>
            <button type="button">Open previous file</button>
            <input aria-label="Search actions" value="delete" readOnly />
            <button type="button">Delete</button>
          </div>
          <p className="demo-status">The menu is detached from the invoked row, uses stale scope, and mixes commands with an input field.</p>
        </div>
      );
    }

    return (
      <div className="bad-ui-sample">
        <div className="fake-modal">
          <strong>{patternId === "confirmation-dialog" ? "Are you sure?" : "Popup"}</strong>
          <button type="button">OK</button>
        </div>
      </div>
    );
  }

  if (patternId === "modal-for-nonblocking-content") return <ModalForNonblockingContentGoodUi />;

  if (patternId === "alert-dialog") {
    return (
      <div className="modal-layer-stack alert-dialog-static-preview" aria-label="Alert dialog preview">
        <div className="modal-page-context" aria-hidden="true">
          <span>Claims editor</span>
          <button type="button" tabIndex={-1}>Submit claim</button>
        </div>
        <div className="demo-dialog compact inline-dialog-preview alert-dialog-panel" role="alertdialog" aria-modal="true" aria-labelledby="alert-dialog-preview-title" aria-describedby="alert-dialog-preview-desc">
          <h3 id="alert-dialog-preview-title">Session locked for security review</h3>
          <p id="alert-dialog-preview-desc">Editing is paused because this account was opened from another location. Choose how to continue before returning to the editor.</p>
          <div className="alert-dialog-response-row">
            <button type="button" className="demo-button small">Review warning</button>
            <button type="button" className="demo-button small primary">Stay signed in</button>
            <button type="button" className="demo-button small">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "drawer-with-no-close-or-return-path") return <DrawerNoCloseReturnGoodUi />;

  if (patternId === "drawer") {
    return (
      <div className="quality-example drawer-static-preview" aria-label="Drawer preview">
        <div className="drawer-table-preview">
          <span>Claim C-1042</span>
          <span>High risk</span>
          <button type="button" className="demo-button small">Open details</button>
        </div>
        <div className="drawer-panel-preview" role="region" aria-labelledby="drawer-preview-title">
          <button type="button" className="drawer-close-button" aria-label="Close Claim C-1042 details">x</button>
          <h3 id="drawer-preview-title">Claim C-1042</h3>
          <p>Supplemental case detail stays beside the queue so reviewers can compare status, owner, and timeline.</p>
          <div className="drawer-fact-grid">
            <span><strong>Status</strong> Needs review</span>
            <span><strong>Owner</strong> A. Patel</span>
          </div>
        </div>
        <p className="demo-status">The drawer names the selected case, keeps the queue visible, and provides a clear close path.</p>
      </div>
    );
  }

  if (patternId === "sheet") {
    return (
      <div className="quality-example sheet-static-preview" aria-label="Sheet preview">
        <div className="sheet-parent-card" aria-hidden="true">
          <strong>Claim C-1042</strong>
          <span>Reviewer queue remains visible for orientation</span>
          <button type="button" tabIndex={-1}>Schedule follow-up</button>
        </div>
        <section className="sheet-surface" role="dialog" aria-modal="true" aria-labelledby="sheet-preview-title" aria-describedby="sheet-preview-desc">
          <div className="sheet-grabber" aria-hidden="true"></div>
          <div className="sheet-header">
            <div>
              <h3 id="sheet-preview-title">Schedule follow-up for Claim C-1042</h3>
              <p id="sheet-preview-desc">Temporary child task with protected dismissal.</p>
            </div>
            <button type="button" className="sheet-close-button" aria-label="Close follow-up sheet">x</button>
          </div>
          <label>
            <span>Reviewer note</span>
            <textarea value="Call claimant before payout approval." readOnly />
          </label>
          <div className="sheet-action-row">
            <button type="button" className="demo-button small">Cancel</button>
            <button type="button" className="demo-button small primary">Save follow-up</button>
          </div>
        </section>
        <p className="demo-status">The sheet names the child task, keeps actions reachable, and uses modal semantics while protecting unsaved work.</p>
      </div>
    );
  }

  if (patternId === "bottom-sheet") {
    return (
      <div className="quality-example bottom-sheet-static-preview" aria-label="Bottom sheet preview">
        <div className="bottom-sheet-phone">
          <div className="bottom-sheet-map">
            <span className="bottom-sheet-pin is-selected">A</span>
            <span className="bottom-sheet-pin secondary">B</span>
            <span className="bottom-sheet-route"></span>
          </div>
          <section className="bottom-sheet-panel is-half" aria-labelledby="bottom-sheet-preview-title">
            <div className="bottom-sheet-handle" aria-hidden="true"></div>
            <div className="bottom-sheet-heading">
              <div>
                <h3 id="bottom-sheet-preview-title">Harbor station</h3>
                <p>4 min walk - next train 6 min</p>
              </div>
              <button type="button" className="bottom-sheet-icon-button" aria-label="Close Harbor station sheet">x</button>
            </div>
            <div className="bottom-sheet-action-strip">
              <button type="button" className="demo-button small primary">Route</button>
              <button type="button" className="demo-button small">Departures</button>
            </div>
          </section>
        </div>
        <p className="demo-status">The bottom sheet starts from the lower edge, keeps the selected map pin visible, and exposes useful half-height controls.</p>
      </div>
    );
  }

  if (patternId === "details-panel") {
    return (
      <div className="quality-example details-panel-static-preview" aria-label="Details panel preview">
        <div className="details-panel-list" aria-label="Ticket list">
          <button type="button" className="details-panel-row is-selected"><span>TCK-2048</span><small>Payment exception</small></button>
          <button type="button" className="details-panel-row"><span>TCK-2049</span><small>Address update</small></button>
        </div>
        <section className="details-panel-pane" aria-labelledby="details-panel-preview-title">
          <div className="details-panel-heading">
            <div>
              <h3 id="details-panel-preview-title">TCK-2048 Payment exception</h3>
              <p>Selected ticket details remain beside the queue.</p>
            </div>
            <span className="details-panel-status">SLA 42m</span>
          </div>
          <div className="details-panel-meta">
            <span><strong>Requester</strong> Maya Chen</span>
            <span><strong>Owner</strong> Finance support</span>
            <span><strong>Latest</strong> Receipt upload failed</span>
          </div>
          <button type="button" className="demo-button small primary">Open full ticket</button>
        </section>
        <p className="demo-status">The selected row and panel heading name the same ticket, with inspection fields and a full-ticket route.</p>
      </div>
    );
  }

  if (patternId === "preview-panel") {
    return (
      <div className="quality-example preview-panel-static-preview" aria-label="Preview panel preview">
        <div className="preview-panel-list" aria-label="Project file list">
          <button type="button" className="preview-panel-row is-selected"><span>Forecast.pdf</span><small>PDF - 6 pages</small></button>
          <button type="button" className="preview-panel-row"><span>Receipt.png</span><small>Image - 1.2 MB</small></button>
        </div>
        <section className="preview-panel-pane" aria-labelledby="preview-panel-preview-title">
          <div className="preview-panel-toolbar">
            <div>
              <h3 id="preview-panel-preview-title">Forecast.pdf</h3>
              <p>Page 2 of 6 - 100% - fit width available</p>
            </div>
            <button type="button" className="demo-button small primary">Open full preview</button>
          </div>
          <div className="preview-panel-canvas">
            <div className="preview-panel-page">
              <span>Forecast Q4</span>
              <i></i>
              <i></i>
              <i></i>
            </div>
          </div>
        </section>
        <p className="demo-status">The highlighted file, preview heading, rendered page, and full-preview route all describe the same document.</p>
      </div>
    );
  }

  if (patternId === "popover") {
    return (
      <div className="quality-example popover-static-preview" aria-label="Popover preview">
        <div className="popover-task-row">
          <span>
            <strong>Quarter close checklist</strong>
            <small>Due date: Tomorrow</small>
          </span>
          <button type="button" className="demo-button small primary" aria-expanded="true" aria-controls="popover-preview">Due date</button>
        </div>
        <section id="popover-preview" className="popover-surface" aria-labelledby="popover-preview-title">
          <div className="popover-arrow" aria-hidden="true"></div>
          <div className="popover-heading">
            <div>
              <h3 id="popover-preview-title">Set due date</h3>
              <p>Anchored to the Due date trigger.</p>
            </div>
            <button type="button" className="popover-close-button" aria-label="Close due date popover">x</button>
          </div>
          <div className="popover-choice-grid">
            <button type="button" className="demo-button small">Today</button>
            <button type="button" className="demo-button small primary">Tomorrow</button>
            <button type="button" className="demo-button small">Friday</button>
          </div>
        </section>
        <p className="demo-status">The popover is small, anchored, dismissible, and updates only the local due-date field.</p>
      </div>
    );
  }

  if (patternId === "tooltip-only-required-information") return <TooltipOnlyRequiredInfoGoodUi />;

  if (patternId === "tooltip") {
    return (
      <div className="quality-example tooltip-static-preview" aria-label="Tooltip preview">
        <div className="tooltip-toolbar" aria-label="Document toolbar">
          <button type="button" aria-describedby="tooltip-preview-archive">Archive</button>
          <button type="button">Share</button>
          <button type="button">Copy link</button>
        </div>
        <div id="tooltip-preview-archive" className="tooltip-bubble" role="tooltip">
          Moves this report to archived reports.
        </div>
        <p className="demo-status">The trigger keeps its own name, the tooltip is short text, and focus remains on the toolbar button.</p>
      </div>
    );
  }

  if (patternId === "hover-card") {
    return (
      <div className="quality-example hover-card-static-preview" aria-label="Hover card preview">
        <div className="hover-card-doc-row">
          <span>Reviewed by</span>
          <button type="button" className="hover-card-trigger" aria-describedby="hover-card-preview"> @Maya Chen</button>
          <span>2 hours ago</span>
        </div>
        <section id="hover-card-preview" className="hover-card-panel" aria-labelledby="hover-card-preview-title">
          <div className="hover-card-avatar" aria-hidden="true">MC</div>
          <div>
            <h3 id="hover-card-preview-title">Maya Chen</h3>
            <p>Design systems lead - local time 09:45 - active in Forecast workspace.</p>
          </div>
          <div className="hover-card-meta-grid">
            <span><strong>Recent</strong> Approved Q3 forecast</span>
            <span><strong>Route</strong> View profile</span>
          </div>
        </section>
        <p className="demo-status">The card previews the mentioned person, stays compact, and points to the full profile route.</p>
      </div>
    );
  }

  if (patternId === "context-menu") {
    return (
      <div className="quality-example context-menu-static-preview" aria-label="Context menu preview">
        <div className="context-menu-file-list">
          <button type="button" className="context-menu-file-row is-selected">
            <span>Forecast.xlsx</span>
            <small>Right click or Shift+F10</small>
          </button>
          <button type="button" className="context-menu-file-row">
            <span>Budget.csv</span>
            <small>No menu open</small>
          </button>
        </div>
        <div className="context-menu-surface" role="menu" aria-label="Context menu for Forecast.xlsx">
          <button type="button" role="menuitem">Open Forecast.xlsx</button>
          <button type="button" role="menuitem">Rename</button>
          <button type="button" role="menuitem" aria-disabled="true">Export unavailable - syncing</button>
          <span className="context-menu-separator" aria-hidden="true"></span>
          <button type="button" role="menuitem" className="danger">Delete file...</button>
        </div>
        <p className="demo-status">The menu is anchored to the invoked file and keeps the selected row visibly scoped.</p>
      </div>
    );
  }

  if (patternId === "menu-button") {
    return (
      <div className="quality-example menu-button-preview" aria-label="Accessible menu button preview">
        <button
          type="button"
          id="menu-button-preview-trigger"
          className="demo-button small menu-button-trigger"
          aria-haspopup="menu"
          aria-expanded="true"
          aria-controls="menu-button-preview-menu"
        >
          {meta.field}
          <span aria-hidden="true">v</span>
        </button>
        <div
          id="menu-button-preview-menu"
          className="menu-button-menu"
          role="menu"
          aria-labelledby="menu-button-preview-trigger"
        >
          <button type="button" role="menuitem" className="menu-button-item is-active">Open report</button>
          <button type="button" role="menuitem" className="menu-button-item">Rename report</button>
          <button type="button" role="menuitem" className="menu-button-item">Duplicate report</button>
          <div role="separator" className="menu-button-separator"></div>
          <button type="button" role="menuitem" aria-disabled="true" className="menu-button-item is-disabled">Archive report unavailable</button>
        </div>
        <p className="demo-status">Focus starts on a menu item, Escape returns to the trigger, and danger waits for a review step.</p>
      </div>
    );
  }

  if (patternId === "modal-dialog") {
    return (
      <div className="modal-layer-stack" aria-label="Modal dialog preview">
        <div className="modal-page-context" aria-hidden="true">
          <span>Account page</span>
          <button type="button" tabIndex={-1}>Change plan</button>
        </div>
        <div className="demo-dialog compact inline-dialog-preview" role="dialog" aria-modal="true" aria-labelledby="modal-preview-title" aria-describedby="modal-preview-desc">
          <button type="button" className="modal-inline-close" aria-label="Close display name dialog">x</button>
          <h3 id="modal-preview-title">Edit display name</h3>
          <p id="modal-preview-desc">Change the name shown to teammates, then return to account settings.</p>
          <label>
            <span>{meta.field}</span>
            <input value="Art" readOnly />
          </label>
          <div className="demo-actions">
            <button type="button" className="demo-button primary">Save name</button>
            <button type="button" className="demo-button">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  if (patternId === "destructive-action-confirmation") {
    return (
      <div className="quality-example destructive-confirm-preview" aria-label="Destructive confirmation preview">
        <div className="destructive-confirm-modal compact" role="alertdialog" aria-modal="true" aria-labelledby="destructive-preview-title" aria-describedby="destructive-preview-desc">
          <h3 id="destructive-preview-title">Delete Payments project?</h3>
          <p id="destructive-preview-desc">This permanently removes the project and breaks connected delivery workflows.</p>
          <div className="destructive-loss-grid">
            <div><span>Dashboards</span><strong>4</strong></div>
            <div><span>Saved views</span><strong>12</strong></div>
            <div><span>Shared links</span><strong>8</strong></div>
            <div><span>Webhooks</span><strong>3</strong></div>
          </div>
          <label className="destructive-acknowledge">
            <input type="checkbox" readOnly />
            <span>I understand this project and connected workflows will be deleted.</span>
          </label>
          <div className="destructive-confirm-actions">
            <button type="button" className="demo-button">Keep project</button>
            <button type="button" className="demo-button danger" disabled>Delete Payments project</button>
          </div>
        </div>
        <p className="demo-status">The preview names the object, inventories loss, keeps a safe path visible, and blocks commit until acknowledgement.</p>
      </div>
    );
  }

  if (patternId === "confirmation-fatigue") return <ConfirmationFatigueGoodUi />;

  if (patternId === "typed-confirmation") {
    return (
      <div className="quality-example typed-confirm-preview" aria-label="Typed confirmation preview">
        <div className="typed-confirm-modal compact" role="alertdialog" aria-modal="true" aria-labelledby="typed-preview-title" aria-describedby="typed-preview-desc">
          <h3 id="typed-preview-title">Delete repository acme/payments-api?</h3>
          <p id="typed-preview-desc">Type <strong>acme/payments-api</strong> to verify the target repository before deletion.</p>
          <label>
            <span>Repository path</span>
            <input type="text" value="" readOnly placeholder="acme/payments-api" />
          </label>
          <div className="typed-confirm-status mismatch">No match. Delete repository remains disabled.</div>
          <div className="destructive-confirm-actions">
            <button type="button" className="demo-button">Keep repository</button>
            <button type="button" className="demo-button danger" disabled>Delete acme/payments-api</button>
          </div>
        </div>
        <p className="demo-status">The preview uses visible target text and disables the final action until the repository path matches.</p>
      </div>
    );
  }

  return (
    <div className="demo-dialog compact inline-dialog-preview" role={patternId === "confirmation-dialog" ? "alertdialog" : undefined} aria-modal={patternId === "confirmation-dialog" ? "true" : undefined}>
      <h3>{patternId === "confirmation-dialog" ? `Delete ${meta.subject}?` : meta.subject}</h3>
      <p>{patternId === "confirmation-dialog" ? "This permanently removes 14 notes and shared links." : "Focused task with clear exits."}</p>
      {patternId === "confirmation-dialog" && (
        <label>
          <span>Type DELETE</span>
          <input value="" readOnly aria-describedby="confirmation-preview-hint" />
          <small id="confirmation-preview-hint">Required before Delete archive is enabled.</small>
        </label>
      )}
      <div className="demo-actions">
        <button type="button" className="demo-button">{patternId === "confirmation-dialog" ? "Keep archive" : "Cancel"}</button>
        <button type="button" className={patternId === "confirmation-dialog" ? "demo-button danger" : "demo-button primary"} disabled={patternId === "confirmation-dialog"}>{patternId === "confirmation-dialog" ? "Delete archive" : "Save"}</button>
      </div>
    </div>
  );
}

function MenuButtonGoodUx({ meta }: { meta: PatternMeta }) {
  const actions = [
    { id: "open", label: meta.options[0], detail: "Opens the current report.", danger: false, disabled: false },
    { id: "rename", label: meta.options[1], detail: "Starts a reversible rename flow.", danger: false, disabled: false },
    { id: "duplicate", label: meta.options[2], detail: "Creates a copy in this workspace.", danger: false, disabled: false },
    { id: "archive", label: meta.options[3], detail: "Requires confirmation before the report moves.", danger: true, disabled: false },
    { id: "export", label: "Export report", detail: "Unavailable until the report finishes processing.", danger: false, disabled: true }
  ];
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState("Menu closed; focus is on the named trigger.");
  const [history, setHistory] = useState<string[]>(["No action selected"]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function firstEnabledIndex() {
    return actions.findIndex((item) => !item.disabled);
  }

  function lastEnabledIndex() {
    for (let index = actions.length - 1; index >= 0; index -= 1) {
      if (!actions[index].disabled) return index;
    }
    return 0;
  }

  function moveActive(delta: number) {
    setOpen(true);
    setActiveIndex((current) => {
      let next = current;
      for (let step = 0; step < actions.length; step += 1) {
        next = (next + delta + actions.length) % actions.length;
        if (!actions[next].disabled) return next;
      }
      return current;
    });
  }

  function openMenu(index = firstEnabledIndex()) {
    const next = index < 0 ? 0 : index;
    setOpen(true);
    setActiveIndex(next);
    setStatus(`Menu opened; focus moved to ${actions[next].label}.`);
  }

  function closeMenu(message: string) {
    setOpen(false);
    setStatus(`${message}; focus returned to ${meta.field}.`);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }

  function activate(index = activeIndex) {
    const action = actions[index];
    if (!action || action.disabled) {
      setStatus("Export report is visible but unavailable, so activation is blocked.");
      return;
    }
    if (action.danger) {
      setHistory([`${action.label} selected; confirmation dialog should review consequence before moving the report.`]);
      closeMenu(`${action.label} handed off to confirmation`);
      return;
    }
    setHistory([`${action.label} completed for ${meta.subject}`]);
    closeMenu(`${action.label} activated`);
  }

  useEffect(() => {
    if (!open) return;
    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex, open]);

  function handleTriggerKey(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenu(firstEnabledIndex());
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(firstEnabledIndex());
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(lastEnabledIndex());
    }
  }

  function handleMenuKey(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(firstEnabledIndex());
    } else if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(lastEnabledIndex());
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeMenu("Dismissed with Escape");
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    } else if (event.key.length === 1) {
      const next = actions.findIndex((item) => !item.disabled && item.label.toLowerCase().startsWith(event.key.toLowerCase()));
      if (next >= 0) {
        event.preventDefault();
        setActiveIndex(next);
        setStatus(`Typeahead moved to ${actions[next].label}.`);
      }
    }
  }

  return (
    <div className="quality-example menu-button-demo">
      <div className="menu-button-shell">
        <button
          ref={triggerRef}
          type="button"
          id="menu-button-live-trigger"
          className="demo-button small primary menu-button-trigger"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="menu-button-live-menu"
          onClick={() => open ? closeMenu("Menu closed") : openMenu()}
          onKeyDown={handleTriggerKey}
        >
          {meta.field}
          <span aria-hidden="true">v</span>
        </button>
        {open && (
          <div
            id="menu-button-live-menu"
            className="menu-button-menu live-menu"
            role="menu"
            aria-labelledby="menu-button-live-trigger"
            onKeyDown={handleMenuKey}
          >
            {actions.map((action, index) => (
              <button
                key={action.id}
                ref={(node) => { itemRefs.current[index] = node; }}
                type="button"
                role="menuitem"
                tabIndex={index === activeIndex ? 0 : -1}
                aria-disabled={action.disabled ? "true" : undefined}
                className={[
                  "menu-button-item",
                  index === activeIndex ? "is-active" : "",
                  action.danger ? "is-danger" : "",
                  action.disabled ? "is-disabled" : ""
                ].filter(Boolean).join(" ")}
                onClick={() => activate(index)}
              >
                <span>{action.label}</span>
                <small>{action.detail}</small>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="demo-row">
        <button type="button" className="demo-button small" onClick={() => openMenu(firstEnabledIndex())}>Open menu</button>
        <button type="button" className="demo-button small" onClick={() => moveActive(1)}>Move down</button>
        <button type="button" className="demo-button small" onClick={() => moveActive(-1)}>Move up</button>
        <button type="button" className="demo-button small" onClick={() => activate()}>Activate active item</button>
        <button type="button" className="demo-button small" onClick={() => closeMenu("Dismissed with Escape")}>Escape close</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
      <ol className="state-history menu-button-history" aria-label="Menu button action history">
        {history.map((entry) => <li key={entry}>{entry}</li>)}
      </ol>
    </div>
  );
}

function MenuButtonBadUx({ meta }: { meta: PatternMeta }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("A mystery control hides report actions.");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="quality-example menu-button-bad-demo">
      <div className="menu-button-bad-strip">
        <span>{meta.subject}</span>
        <button
          type="button"
          className="mystery-icon-button"
          aria-label="More"
          aria-expanded={expanded}
          onMouseEnter={() => {
            setOpen(true);
            setExpanded(false);
            setStatus("Hover opened a panel while aria-expanded still says false.");
          }}
          onClick={() => {
            setOpen((current) => !current);
            setStatus("Click toggled an unlabeled action list with no focus target.");
          }}
        >
          ...
        </button>
      </div>
      {open && (
        <div className="menu-button-menu bad-menu" aria-label="Broken report actions">
          <button type="button" onClick={() => setStatus("Deleted from the menu with no confirmation or undo.")}>Delete</button>
          <input aria-label="Rename hidden inside menu" value="Q2 risk report" onChange={() => setStatus("A text field inside the menu stole composite focus.")} />
          <a href="#bad-menu-navigation" onClick={(event) => { event.preventDefault(); setStatus("Navigation link mixed with local commands."); }}>Settings page</a>
          <button type="button" disabled>Export</button>
        </div>
      )}
      <div className="demo-row">
        <button type="button" className="demo-button small" onClick={() => setStatus("Arrow keys do nothing because no active menu item is tracked.")}>Try ArrowDown</button>
        <button type="button" className="demo-button small" onClick={() => { setOpen(false); setStatus("Escape closed the panel but focus was not returned to the trigger."); }}>Try Escape</button>
        <button type="button" className="demo-button small" onClick={() => { setExpanded(true); setStatus("Expanded state changed without showing a controlled menu."); }}>Stale expanded</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function AlertDialogGoodUx({ meta }: { meta: PatternMeta }) {
  type FocusTarget = "review" | "stay" | "signout";
  const [open, setOpen] = useState(false);
  const [focusTarget, setFocusTarget] = useState<FocusTarget>("review");
  const [status, setStatus] = useState("Session editor is active.");
  const [outcome, setOutcome] = useState("No security response chosen.");
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const reviewRef = useRef<HTMLButtonElement | null>(null);
  const stayRef = useRef<HTMLButtonElement | null>(null);
  const signOutRef = useRef<HTMLButtonElement | null>(null);
  const focusOrder: FocusTarget[] = ["review", "stay", "signout"];
  const focusRefs: Record<FocusTarget, RefObject<HTMLButtonElement | null>> = {
    review: reviewRef,
    stay: stayRef,
    signout: signOutRef
  };

  const focusButton = (target: FocusTarget) => {
    setFocusTarget(target);
    window.setTimeout(() => focusRefs[target].current?.focus(), 0);
  };

  const openAlert = () => {
    setOpen(true);
    setStatus("Alert dialog opened; background editor controls are unavailable.");
    setOutcome("Response required before editing continues.");
    focusButton("review");
  };

  const closeAlert = (message: string, nextOutcome: string) => {
    setOpen(false);
    setStatus(`${message}; focus returned to ${meta.field}.`);
    setOutcome(nextOutcome);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  };

  const cycleFocus = (direction: 1 | -1) => {
    if (!open) {
      setStatus("Open the alert dialog before cycling focus.");
      return;
    }
    const current = focusOrder.indexOf(focusTarget);
    const next = focusOrder[(current + direction + focusOrder.length) % focusOrder.length];
    focusButton(next);
    setStatus(`Focus moved to ${next === "review" ? "Review warning" : next === "stay" ? "Stay signed in" : "Sign out"} and stayed inside the dialog.`);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeAlert("Cancelled with Escape", "Editor remains paused until the session is reviewed again.");
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        cycleFocus(event.shiftKey ? -1 : 1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [focusTarget, open]);

  return (
    <div className="quality-example alert-dialog-demo">
      <div className="alert-dialog-workspace">
        <div>
          <strong>Claims editor</strong>
          <span>{open ? "Paused by session security" : "Ready for editing"}</span>
        </div>
        <button type="button" className="demo-button small" disabled={open}>Submit claim</button>
        <button type="button" className="demo-button small" disabled={open}>Attach file</button>
      </div>
      <button ref={openerRef} type="button" className="demo-button small primary" onClick={openAlert}>{meta.field}</button>
      <div className="demo-row alert-dialog-controls" aria-label="Alert dialog controls">
        <button type="button" className="demo-button small" onClick={openAlert}>Open alert dialog</button>
        <button type="button" className="demo-button small" onClick={() => setStatus(open ? "Background action blocked while the alert dialog is open." : "Background action is available because no alert dialog is open.")}>Try background action</button>
        <button type="button" className="demo-button small" onClick={() => cycleFocus(1)}>Tab forward</button>
        <button type="button" className="demo-button small" onClick={() => cycleFocus(-1)}>Shift Tab</button>
        <button type="button" className="demo-button small" onClick={() => open ? closeAlert("Cancelled with Escape", "Editor remains paused until the session is reviewed again.") : setStatus("Open the alert dialog before using Escape.")}>Escape cancel</button>
        <button type="button" className="demo-button small" onClick={() => open ? closeAlert("Stayed signed in", "Editing resumed after security response.") : setStatus("Open the alert dialog before choosing Stay signed in.")}>Stay signed in</button>
        <button type="button" className="demo-button small" onClick={() => open ? closeAlert("Signed out", "User moved to signed-out recovery state.") : setStatus("Open the alert dialog before choosing Sign out.")}>Sign out</button>
      </div>
      {open && (
        <div className="demo-backdrop is-open quality-backdrop alert-dialog-backdrop">
          <div
            ref={dialogRef}
            className="demo-dialog alert-dialog-panel"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="alert-dialog-good-title"
            aria-describedby="alert-dialog-good-desc"
          >
            <h3 id="alert-dialog-good-title">Session locked for security review</h3>
            <p id="alert-dialog-good-desc">We paused editing because this account was opened from another location. Choose how to continue before returning to the editor.</p>
            <div className="alert-dialog-detail" role="note">
              <strong>Current workflow</strong>
              <span>Draft claim C-1042 is kept locally until you choose a session response.</span>
            </div>
            <div className="alert-dialog-response-row">
              <button
                ref={reviewRef}
                type="button"
                className={focusTarget === "review" ? "demo-button small primary" : "demo-button small"}
                onClick={() => {
                  focusButton("review");
                  setStatus("Warning reviewed: only one signed-in browser can edit this claim.");
                }}
              >
                Review warning
              </button>
              <button
                ref={stayRef}
                type="button"
                className={focusTarget === "stay" ? "demo-button small primary" : "demo-button small"}
                onClick={() => closeAlert("Stayed signed in", "Editing resumed after security response.")}
              >
                Stay signed in
              </button>
              <button
                ref={signOutRef}
                type="button"
                className={focusTarget === "signout" ? "demo-button small primary" : "demo-button small"}
                onClick={() => closeAlert("Signed out", "User moved to signed-out recovery state.")}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
      <p className="demo-status" aria-live="polite">{status}</p>
      <p className="demo-status">{outcome}</p>
    </div>
  );
}

function AlertDialogBadUx() {
  type Mode = "nonModalAlert" | "ordinaryModal" | "vagueOk" | "focusLeak" | "autoOpen" | "noResponse";
  const [mode, setMode] = useState<Mode>("nonModalAlert");
  const copy = {
    nonModalAlert: "The page asks for a security response but leaves editing controls active.",
    ordinaryModal: "A normal settings dialog hides that the session condition is urgent and blocking.",
    vagueOk: "OK-only copy gives no consequence, safe response, or next step.",
    focusLeak: "Keyboard and pointer can still reach background controls while the dialog is visible.",
    autoOpen: "The interruption appears on load without a current blocking condition.",
    noResponse: "The message says the situation is critical but offers no way to respond."
  }[mode];

  return (
    <div className={`quality-example alert-dialog-bad-ux is-${mode}`}>
      <div className="alert-dialog-workspace bad">
        <div>
          <strong>Claims editor</strong>
          <span>{mode === "focusLeak" || mode === "nonModalAlert" ? "Still editable behind warning" : "Interruption state unclear"}</span>
        </div>
        <button type="button" className="demo-button small" onClick={() => setMode("focusLeak")}>Submit anyway</button>
        <button type="button" className="demo-button small danger">Delete draft</button>
      </div>
      {mode === "nonModalAlert" ? (
        <div className="alert-dialog-inline-alert" role="alert">
          <strong>Session problem</strong>
          <span>Choose what to do, but the editor remains active.</span>
        </div>
      ) : (
        <div className="fake-modal alert-dialog-panel bad">
          <strong>{mode === "ordinaryModal" ? "Account settings" : mode === "autoOpen" ? "Welcome back" : mode === "noResponse" ? "Critical security issue" : "Warning"}</strong>
          <p>{mode === "ordinaryModal" ? "Edit your profile before continuing." : mode === "vagueOk" ? "Something changed." : mode === "focusLeak" ? "This appears blocking, but focus and clicks can leave it." : mode === "autoOpen" ? "This opens every visit before the user does anything." : mode === "noResponse" ? "You cannot continue, but no action is available." : "Press OK."}</p>
          {mode !== "noResponse" && <button type="button">{mode === "ordinaryModal" ? "Save" : "OK"}</button>}
        </div>
      )}
      <div className="demo-row alert-dialog-controls">
        <button type="button" className={mode === "nonModalAlert" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("nonModalAlert")}>Non-modal alert</button>
        <button type="button" className={mode === "ordinaryModal" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("ordinaryModal")}>Ordinary modal</button>
        <button type="button" className={mode === "vagueOk" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vagueOk")}>Vague OK</button>
        <button type="button" className={mode === "focusLeak" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("focusLeak")}>Focus leak</button>
        <button type="button" className={mode === "autoOpen" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("autoOpen")}>Auto-open</button>
        <button type="button" className={mode === "noResponse" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noResponse")}>No response</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy}</p>
    </div>
  );
}

function PreviewPanelGoodUx({ meta }: { meta: PatternMeta }) {
  type FileKey = "forecast" | "receipt" | "contract" | "blocked";
  const files: Record<FileKey, { name: string; type: string; detail: string; pages: number; kind: "pdf" | "image" | "doc" | "blocked" }> = {
    forecast: { name: "Forecast.pdf", type: "PDF", detail: "6 pages - finance review", pages: 6, kind: "pdf" },
    receipt: { name: "Receipt.png", type: "Image", detail: "1.2 MB - expense evidence", pages: 1, kind: "image" },
    contract: { name: "Contract.docx", type: "Document", detail: "12 pages - legal draft", pages: 12, kind: "doc" },
    blocked: { name: "Vendor-link.html", type: "Blocked", detail: "Downloaded from internet", pages: 1, kind: "blocked" }
  };
  const [selected, setSelected] = useState<FileKey>("forecast");
  const [page, setPage] = useState(2);
  const [zoom, setZoom] = useState(100);
  const [fitWidth, setFitWidth] = useState(true);
  const [status, setStatus] = useState(`${meta.field} selected; preview renders page 2 beside the file list.`);
  const rowRefs = useRef<Record<FileKey, HTMLButtonElement | null>>({ forecast: null, receipt: null, contract: null, blocked: null });
  const current = files[selected];
  const effectivePage = Math.min(page, current.pages);
  const scaleStyle = { "--preview-scale": String(zoom / 100) } as CSSProperties;

  const selectFile = (file: FileKey, reason: string) => {
    const next = files[file];
    setSelected(file);
    setPage(next.pages > 1 ? 1 : 1);
    setZoom(100);
    setFitWidth(true);
    setStatus(`${reason}; ${next.name} is highlighted and the preview panel title, content state, and controls updated together.`);
    window.setTimeout(() => rowRefs.current[file]?.focus(), 0);
  };

  const nextPage = () => {
    if (current.kind === "blocked") {
      setStatus(`${current.name} is blocked; page controls are unavailable until a safer preview route is chosen.`);
      return;
    }
    if (current.pages === 1) {
      setStatus(`${current.name} has one page; preview remains on the current rendered content.`);
      return;
    }
    const next = effectivePage >= current.pages ? 1 : effectivePage + 1;
    setPage(next);
    setStatus(`${current.name} moved to page ${next} of ${current.pages}; focus stays on the page control.`);
  };

  const zoomIn = () => {
    if (current.kind === "blocked") {
      setStatus(`${current.name} is blocked; zoom is not available for risky content.`);
      return;
    }
    const next = Math.min(160, zoom + 20);
    setZoom(next);
    setFitWidth(false);
    setStatus(`${current.name} zoom changed to ${next} percent; source selection remains visible.`);
  };

  const fitPreview = () => {
    if (current.kind === "blocked") {
      setStatus(`${current.name} remains blocked; fit width does not render unsafe content.`);
      return;
    }
    setZoom(100);
    setFitWidth(true);
    setStatus(`${current.name} fit to the panel width; rendered content and selected row still match.`);
  };

  const openFullPreview = () => {
    setStatus(`${current.name} opened in the full preview route with the same selected file identity.`);
    window.setTimeout(() => rowRefs.current[selected]?.focus(), 0);
  };

  return (
    <div className="quality-example preview-panel-demo">
      <div className="preview-panel-workspace">
        <div className="preview-panel-list" role="listbox" aria-label={meta.subject} aria-activedescendant={`preview-panel-${selected}`}>
          {(Object.keys(files) as FileKey[]).map((file) => {
            const item = files[file];
            const active = file === selected;
            return (
              <button
                key={file}
                id={`preview-panel-${file}`}
                ref={(node) => { rowRefs.current[file] = node; }}
                type="button"
                role="option"
                aria-selected={active}
                className={active ? "preview-panel-row is-selected" : "preview-panel-row"}
                onClick={() => selectFile(file, "File row selected")}
              >
                <span>{item.name}</span>
                <small>{item.type} - {item.detail}</small>
              </button>
            );
          })}
        </div>
        <section className={current.kind === "blocked" ? "preview-panel-pane is-blocked" : "preview-panel-pane"} aria-labelledby="preview-panel-live-title">
          <div className="preview-panel-toolbar">
            <div>
              <h3 id="preview-panel-live-title">{current.name}</h3>
              <p>{current.kind === "blocked" ? "Inline preview blocked for safety." : `${current.type} preview - page ${effectivePage} of ${current.pages} - ${fitWidth ? "fit width" : `${zoom}%`}`}</p>
            </div>
            <button type="button" className="demo-button small primary" onClick={openFullPreview}>Open full preview</button>
          </div>
          {current.kind === "blocked" ? (
            <div className="preview-panel-blocked" role="status">
              <strong>Preview disabled</strong>
              <span>{current.name} was downloaded from the internet. Use Open full preview or download after review.</span>
              <button type="button" className="demo-button small" onClick={openFullPreview}>Review safe options</button>
            </div>
          ) : (
            <div className="preview-panel-canvas" style={scaleStyle}>
              {current.kind === "image" ? (
                <div className="preview-panel-image" aria-label="Receipt image preview">
                  <span>Receipt.png</span>
                  <i></i>
                </div>
              ) : (
                <div className={current.kind === "doc" ? "preview-panel-page doc" : "preview-panel-page"} aria-label={`${current.name} rendered preview`}>
                  <span>{current.name.replace(/\..+$/, "")}</span>
                  <small>Page {effectivePage}</small>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              )}
            </div>
          )}
          <div className="preview-panel-meta">
            <span><strong>Type</strong> {current.type}</span>
            <span><strong>Selected</strong> {current.name}</span>
            <span><strong>State</strong> {current.kind === "blocked" ? "Blocked" : "Rendered"}</span>
          </div>
        </section>
      </div>
      <div className="demo-row preview-panel-controls">
        <button type="button" className="demo-button small" onClick={() => selectFile("forecast", "Keyboard moved to Forecast.pdf")}>Select PDF</button>
        <button type="button" className="demo-button small" onClick={() => selectFile("receipt", "Keyboard moved to Receipt.png")}>Select image</button>
        <button type="button" className="demo-button small" onClick={nextPage}>Next page</button>
        <button type="button" className="demo-button small" onClick={zoomIn}>Zoom in</button>
        <button type="button" className="demo-button small" onClick={fitPreview}>Fit width</button>
        <button type="button" className="demo-button small" onClick={() => selectFile("blocked", "Blocked file selected")}>Blocked file</button>
        <button type="button" className="demo-button small primary" onClick={openFullPreview}>Open full preview</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function PreviewPanelBadUx() {
  type Mode = "stalePreview" | "metadataOnly" | "noFallback" | "unsafeRender" | "tinyPane" | "focusTrap";
  const [mode, setMode] = useState<Mode>("stalePreview");
  const copy: Record<Mode, string> = {
    stalePreview: "The selected row is Receipt.png, but the pane still renders Forecast.pdf.",
    metadataOnly: "The pane lists owner, date, and size while hiding the content users need to inspect.",
    noFallback: "Unsupported files produce a blank pane with no reason, download, or full-preview route.",
    unsafeRender: "A downloaded HTML file renders inline content that should be blocked before preview.",
    tinyPane: "The pane is too narrow to read, and there is no larger preview route.",
    focusTrap: "Every row movement moves focus into preview controls, slowing rapid file review."
  };

  return (
    <div className={`quality-example preview-panel-bad-ux is-${mode}`}>
      <div className="preview-panel-workspace bad">
        <div className="preview-panel-list bad" aria-label="Broken project file list">
          <button type="button" className={mode === "focusTrap" ? "preview-panel-row" : "preview-panel-row is-selected"}><span>{mode === "stalePreview" ? "Receipt.png" : "Forecast.pdf"}</span><small>{mode === "metadataOnly" ? "Needs body review" : "Selected row"}</small></button>
          <button type="button" className="preview-panel-row"><span>Vendor-link.html</span><small>Downloaded file</small></button>
        </div>
        <section className="preview-panel-pane bad" aria-label="Broken preview panel">
          <strong>{mode === "metadataOnly" ? "File info" : mode === "noFallback" ? "No preview" : mode === "unsafeRender" ? "Vendor-link.html" : "Preview"}</strong>
          <div className={mode === "tinyPane" ? "preview-panel-canvas bad tiny" : "preview-panel-canvas bad"}>
            {mode === "metadataOnly" ? (
              <div className="preview-panel-info-only">
                <span>Owner: Finance</span>
                <span>Modified: Yesterday</span>
                <span>Size: 4.2 MB</span>
              </div>
            ) : mode === "noFallback" ? (
              <div className="preview-panel-blank"></div>
            ) : (
              <div className={mode === "unsafeRender" ? "preview-panel-page unsafe" : "preview-panel-page"}>
                <span>{mode === "stalePreview" ? "Forecast.pdf" : mode === "unsafeRender" ? "Remote HTML" : "Unreadable page"}</span>
                <i></i>
                <i></i>
              </div>
            )}
          </div>
          <p>{copy[mode]}</p>
          {mode === "focusTrap" && <button type="button" className="demo-button small">Preview stole focus</button>}
        </section>
      </div>
      <div className="demo-row preview-panel-controls">
        <button type="button" className={mode === "stalePreview" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stalePreview")}>Stale preview</button>
        <button type="button" className={mode === "metadataOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("metadataOnly")}>Metadata only</button>
        <button type="button" className={mode === "noFallback" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noFallback")}>No fallback</button>
        <button type="button" className={mode === "unsafeRender" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unsafeRender")}>Unsafe render</button>
        <button type="button" className={mode === "tinyPane" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tinyPane")}>Tiny pane</button>
        <button type="button" className={mode === "focusTrap" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("focusTrap")}>Focus trap</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function DetailsPanelGoodUx({ meta }: { meta: PatternMeta }) {
  type TicketKey = "tck2048" | "tck2049" | "tck2050";
  const tickets: Record<TicketKey, { id: string; title: string; requester: string; severity: string; sla: string; latest: string; owner: string }> = {
    tck2048: { id: "TCK-2048", title: "Payment exception", requester: "Maya Chen", severity: "High", sla: "42m", latest: "Receipt upload failed", owner: "Finance support" },
    tck2049: { id: "TCK-2049", title: "Address update", requester: "Priya Shah", severity: "Medium", sla: "4h", latest: "Customer changed postal code", owner: "Account ops" },
    tck2050: { id: "TCK-2050", title: "Refund review", requester: "Noah Kim", severity: "Low", sla: "1d", latest: "Refund note added", owner: "Billing review" }
  };
  const [selected, setSelected] = useState<TicketKey>("tck2048");
  const [collapsed, setCollapsed] = useState(false);
  const [selectionCleared, setSelectionCleared] = useState(false);
  const [status, setStatus] = useState(`Selected ${meta.field}; details panel is synchronized with the queue.`);
  const rowRefs = useRef<Record<TicketKey, HTMLButtonElement | null>>({ tck2048: null, tck2049: null, tck2050: null });
  const current = tickets[selected];

  const selectTicket = (ticket: TicketKey, reason: string) => {
    setSelected(ticket);
    setCollapsed(false);
    setSelectionCleared(false);
    setStatus(`${reason}; ${tickets[ticket].id} remains selected and the details panel updated without moving focus into it.`);
    window.setTimeout(() => rowRefs.current[ticket]?.focus(), 0);
  };

  const filterSelectedAway = () => {
    setSelectionCleared(true);
    setCollapsed(false);
    setStatus(`${current.id} was filtered out; the panel changed to an empty selection state instead of showing stale details.`);
  };

  const restoreSelection = () => {
    setSelectionCleared(false);
    setStatus(`${current.id} restored; details panel again matches the highlighted queue row.`);
    window.setTimeout(() => rowRefs.current[selected]?.focus(), 0);
  };

  const openFullTicket = () => {
    if (selectionCleared) {
      setStatus("Select a ticket before opening the full ticket route.");
      return;
    }
    setStatus(`Open full ticket selected for ${current.id}; the route uses the same selected object.`);
    window.setTimeout(() => rowRefs.current[selected]?.focus(), 0);
  };

  return (
    <div className="quality-example details-panel-demo">
      <div className={collapsed ? "details-panel-workspace is-collapsed" : "details-panel-workspace"}>
        <div className="details-panel-list" role="listbox" aria-label={meta.subject} aria-activedescendant={selectionCleared ? undefined : `details-panel-${selected}`}>
          {(Object.keys(tickets) as TicketKey[]).map((ticket) => {
            const item = tickets[ticket];
            const active = ticket === selected && !selectionCleared;
            return (
              <button
                key={ticket}
                id={`details-panel-${ticket}`}
                ref={(node) => { rowRefs.current[ticket] = node; }}
                type="button"
                role="option"
                aria-selected={active}
                className={active ? "details-panel-row is-selected" : "details-panel-row"}
                onClick={() => selectTicket(ticket, "Queue row selected")}
              >
                <span>{item.id}</span>
                <small>{item.title} - {item.severity}</small>
              </button>
            );
          })}
        </div>
        {collapsed ? (
          <button type="button" className="details-panel-rail" onClick={() => { setCollapsed(false); setStatus(`${current.id} details panel restored beside the queue.`); }}>
            Details
          </button>
        ) : (
          <section className={selectionCleared ? "details-panel-pane is-empty" : "details-panel-pane"} aria-labelledby="details-panel-live-title">
            {selectionCleared ? (
              <>
                <h3 id="details-panel-live-title">Select a ticket</h3>
                <p>The filtered queue no longer contains {current.id}. Choose another ticket or clear the filter.</p>
                <button type="button" className="demo-button small" onClick={restoreSelection}>Clear filter</button>
              </>
            ) : (
              <>
                <div className="details-panel-heading">
                  <div>
                    <h3 id="details-panel-live-title">{`${current.id} ${current.title}`}</h3>
                    <p>Selected ticket details remain beside the queue.</p>
                  </div>
                  <span className="details-panel-status">SLA {current.sla}</span>
                </div>
                <div className="details-panel-meta">
                  <span><strong>Requester</strong> {current.requester}</span>
                  <span><strong>Owner</strong> {current.owner}</span>
                  <span><strong>Severity</strong> {current.severity}</span>
                  <span><strong>Latest</strong> {current.latest}</span>
                </div>
                <div className="details-panel-actions">
                  <button type="button" className="demo-button small primary" onClick={openFullTicket}>Open full ticket</button>
                  <button type="button" className="demo-button small" onClick={() => { setCollapsed(true); setStatus(`${current.id} details collapsed; selection remains visible in the queue.`); }}>Collapse details</button>
                </div>
              </>
            )}
          </section>
        )}
      </div>
      <div className="demo-row details-panel-controls">
        <button type="button" className="demo-button small" onClick={() => selectTicket("tck2048", "Keyboard moved to TCK-2048")}>Select TCK-2048</button>
        <button type="button" className="demo-button small" onClick={() => selectTicket("tck2049", "Arrow down moved to TCK-2049")}>Move to TCK-2049</button>
        <button type="button" className="demo-button small" onClick={() => selectTicket("tck2050", "Arrow down moved to TCK-2050")}>Move to TCK-2050</button>
        <button type="button" className="demo-button small" onClick={filterSelectedAway}>Filter selected away</button>
        <button type="button" className="demo-button small" onClick={() => { setCollapsed(!collapsed); setStatus(collapsed ? `${current.id} details panel restored beside the queue.` : `${current.id} details collapsed; selection remains visible in the queue.`); }}>{collapsed ? "Restore panel" : "Collapse panel"}</button>
        <button type="button" className="demo-button small primary" onClick={openFullTicket}>Open full ticket</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function DetailsPanelBadUx() {
  type Mode = "staleDetail" | "genericTitle" | "focusSteal" | "mixedPurpose" | "hiddenSelection" | "noEmptyState";
  const [mode, setMode] = useState<Mode>("staleDetail");
  const copy: Record<Mode, string> = {
    staleDetail: "The selected row is TCK-2049, but the panel still shows TCK-2048 details.",
    genericTitle: "A generic Details title forces users to infer which object the panel describes.",
    focusSteal: "Every row movement sends focus into the panel, slowing keyboard review through the queue.",
    mixedPurpose: "The panel mixes ticket details with filters, navigation, settings, and destructive actions.",
    hiddenSelection: "The list hides selection state, so users cannot match panel content to a source object.",
    noEmptyState: "After filtering removes the selected ticket, the panel keeps showing unrelated previous content."
  };

  return (
    <div className={`quality-example details-panel-bad-ux is-${mode}`}>
      <div className="details-panel-workspace bad">
        <div className="details-panel-list bad" aria-label="Broken ticket list">
          <button type="button" className={mode === "hiddenSelection" ? "details-panel-row" : "details-panel-row is-selected"}><span>{mode === "staleDetail" ? "TCK-2049" : "TCK-2048"}</span><small>{mode === "noEmptyState" ? "Filtered out" : "Selected row"}</small></button>
          <button type="button" className="details-panel-row"><span>TCK-2050</span><small>Nearby ticket</small></button>
        </div>
        <section className="details-panel-pane bad" aria-label="Broken details panel">
          <strong>{mode === "genericTitle" ? "Details" : mode === "noEmptyState" ? "Old selection" : "TCK-2048 Payment exception"}</strong>
          <p>{copy[mode]}</p>
          {mode === "mixedPurpose" && (
            <div className="details-panel-bad-actions">
              <button type="button">Filter queue</button>
              <button type="button">Settings</button>
              <button type="button" className="danger">Delete account</button>
            </div>
          )}
          {mode === "focusSteal" && <button type="button" className="demo-button small">Panel stole focus</button>}
        </section>
      </div>
      <div className="demo-row details-panel-controls">
        <button type="button" className={mode === "staleDetail" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleDetail")}>Stale detail</button>
        <button type="button" className={mode === "genericTitle" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("genericTitle")}>Generic title</button>
        <button type="button" className={mode === "focusSteal" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("focusSteal")}>Focus steal</button>
        <button type="button" className={mode === "mixedPurpose" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedPurpose")}>Mixed purpose</button>
        <button type="button" className={mode === "hiddenSelection" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenSelection")}>Hidden selection</button>
        <button type="button" className={mode === "noEmptyState" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noEmptyState")}>No empty state</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

type DrawerNoCloseReturnMode =
  | "closeButton"
  | "escapeClose"
  | "browserBack"
  | "scrimClose"
  | "focusReturn"
  | "selectionSwitch"
  | "dirtyReview"
  | "mobileBack"
  | "stickyHeader"
  | "statePreserved"
  | "gestureEquivalent"
  | "commitLock";

type DrawerNoCloseReturnBadMode =
  | "noClose"
  | "escapeDead"
  | "backNavigatesAway"
  | "lostFocus"
  | "stateReset"
  | "mobileNoBack"
  | "gestureOnly"
  | "dirtyTrap";

const drawerNoCloseGoodModes: Array<{ mode: DrawerNoCloseReturnMode; label: string }> = [
  { mode: "closeButton", label: "Close button" },
  { mode: "escapeClose", label: "Escape close" },
  { mode: "browserBack", label: "Browser back" },
  { mode: "scrimClose", label: "Scrim close" },
  { mode: "focusReturn", label: "Focus return" },
  { mode: "selectionSwitch", label: "Selection switch" },
  { mode: "dirtyReview", label: "Dirty review" },
  { mode: "mobileBack", label: "Mobile back" },
  { mode: "stickyHeader", label: "Sticky header" },
  { mode: "statePreserved", label: "State preserved" },
  { mode: "gestureEquivalent", label: "Gesture equivalent" },
  { mode: "commitLock", label: "Commit lock" }
];

const drawerNoCloseBadModes: Array<{ mode: DrawerNoCloseReturnBadMode; label: string }> = [
  { mode: "noClose", label: "No close" },
  { mode: "escapeDead", label: "Dead Escape" },
  { mode: "backNavigatesAway", label: "Bad back" },
  { mode: "lostFocus", label: "Lost focus" },
  { mode: "stateReset", label: "Reset state" },
  { mode: "mobileNoBack", label: "Mobile no back" },
  { mode: "gestureOnly", label: "Gesture only" },
  { mode: "dirtyTrap", label: "Dirty trap" }
];

function DrawerNoCloseReturnGoodUi() {
  return (
    <div className="quality-example drawer-return-static" aria-label="Drawer close and return preview">
      <DrawerNoCloseReturnPanel mode="focusReturn" idSuffix="good-ui" />
      <p className="demo-status">The drawer names the selected claim, exposes close, handles dismissal routes, and returns focus to the selected row.</p>
    </div>
  );
}

function DrawerNoCloseReturnBadUi() {
  return (
    <div className="bad-ui-sample drawer-return-static bad" aria-label="Broken drawer close preview">
      <DrawerNoCloseReturnBadPanel mode="noClose" idSuffix="bad-ui" />
      <p className="demo-status">The drawer opens over the queue with no visible close, no Escape path, and no reliable return target.</p>
    </div>
  );
}

function DrawerNoCloseReturnPanel({ mode, idSuffix }: { mode: DrawerNoCloseReturnMode; idSuffix: string }) {
  const selected = mode === "selectionSwitch" ? "Claim C-1043" : "Claim C-1042";
  const dirty = mode === "dirtyReview";
  const mobile = mode === "mobileBack";
  const commitLock = mode === "commitLock";
  const note = {
    closeButton: "Close button: a labelled header control is always visible and reachable.",
    escapeClose: "Escape close: keyboard dismissal uses the same cleanup as the close button.",
    browserBack: "Browser back: the first Back closes the temporary drawer and keeps the queue route.",
    scrimClose: "Scrim close: clicking the scrim dismisses this clean temporary drawer.",
    focusReturn: "Focus return: after close, focus lands on the selected claim row.",
    selectionSwitch: "Selection switch: the return target updates when Claim C-1043 becomes selected.",
    dirtyReview: "Dirty review: closing opens a discard decision instead of trapping the user.",
    mobileBack: "Mobile back: full-screen drawer has Back to queue and preserves the filter.",
    stickyHeader: "Sticky header: close and title remain visible while drawer content scrolls.",
    statePreserved: "State preserved: urgent filter, row selection, and scroll position survive close.",
    gestureEquivalent: "Gesture equivalent: swipe dismissal has Close, Escape, and Back equivalents.",
    commitLock: "Commit lock: close is temporarily disabled only while saving, with clear status."
  }[mode];

  return (
    <div className={`drawer-return-shell is-${mode}`}>
      <div className="drawer-return-queue" aria-label="Claims review queue">
        <div className="drawer-return-toolbar">
          <div>
            <strong>Claims review queue</strong>
            <span>Filter: urgent claims - Scroll kept at row 24</span>
          </div>
          <button type="button" className="demo-button small">Change filter</button>
        </div>
        <button type="button" className={selected === "Claim C-1042" ? "drawer-return-row is-selected" : "drawer-return-row"}>
          <span><strong>Claim C-1042</strong><small>Original opener and return target</small></span>
          <em>High</em>
        </button>
        <button type="button" className={selected === "Claim C-1043" ? "drawer-return-row is-selected" : "drawer-return-row"}>
          <span><strong>Claim C-1043</strong><small>{selected === "Claim C-1043" ? "New selected return target" : "Nearby case"}</small></span>
          <em>Med</em>
        </button>
      </div>
      {mobile && <div className="drawer-return-mobile-back">Mobile full-screen state: Back to queue is visible.</div>}
      <aside className={mobile ? "drawer-return-panel is-mobile" : "drawer-return-panel"} aria-labelledby={`drawer-return-title-${idSuffix}`}>
        <div className={mode === "stickyHeader" ? "drawer-return-header is-sticky" : "drawer-return-header"}>
          <div>
            <h3 id={`drawer-return-title-${idSuffix}`}>{selected} details</h3>
            <span>{mobile ? "Full-screen drawer with Back to queue" : "Temporary details drawer"}</span>
          </div>
          <button type="button" className="drawer-return-close" aria-label={`Close ${selected} details`} disabled={commitLock}>
            {mobile ? "Back" : "Close"}
          </button>
        </div>
        <p>{note}</p>
        <div className="drawer-return-exit-grid" aria-label="Drawer exit contract">
          <span><strong>Escape</strong> {dirty ? "opens discard review" : "closes drawer"}</span>
          <span><strong>Back</strong> closes drawer once</span>
          <span><strong>Focus</strong> returns to {selected}</span>
          <span><strong>State</strong> urgent filter preserved</span>
        </div>
        {dirty && (
          <div className="drawer-return-discard" role="alert">
            <strong>Discard unsaved drawer note?</strong>
            <span>Keep editing returns to the note. Discard closes and returns to the selected row.</span>
            <div className="drawer-return-actions">
              <button type="button" className="demo-button small primary">Keep editing</button>
              <button type="button" className="demo-button small">Discard and close</button>
            </div>
          </div>
        )}
        {commitLock && <div className="drawer-return-lock" role="status">Saving selected evidence. Close re-enables when the commit finishes.</div>}
      </aside>
    </div>
  );
}

function DrawerNoCloseReturnBadPanel({ mode, idSuffix }: { mode: DrawerNoCloseReturnBadMode; idSuffix: string }) {
  const copy: Record<DrawerNoCloseReturnBadMode, { title: string; body: string; tag: string }> = {
    noClose: {
      title: "Claim details",
      body: "No close control is visible, Escape does nothing, and users cannot tell how to return to the queue.",
      tag: "No close"
    },
    escapeDead: {
      title: "Keyboard trap",
      body: "Escape is ignored and Tab cycles through drawer controls without a reachable exit.",
      tag: "Dead Escape"
    },
    backNavigatesAway: {
      title: "Back leaves page",
      body: "Browser back navigates away from the queue instead of closing the temporary drawer first.",
      tag: "Bad back"
    },
    lostFocus: {
      title: "Focus lost",
      body: "The drawer closes visually, then focus jumps to the page header instead of the selected row.",
      tag: "Lost focus"
    },
    stateReset: {
      title: "State reset",
      body: "Closing clears urgent filters, row selection, and scroll position.",
      tag: "Reset state"
    },
    mobileNoBack: {
      title: "Full-screen panel",
      body: "The mobile drawer covers the queue and has no Back, Close, or route recovery.",
      tag: "Mobile no back"
    },
    gestureOnly: {
      title: "Swipe to close",
      body: "The only dismissal route is a swipe gesture with no button, keyboard, or screen reader equivalent.",
      tag: "Gesture only"
    },
    dirtyTrap: {
      title: "Unsaved note",
      body: "Close is removed because the note is dirty instead of offering Keep editing, Discard, or Save.",
      tag: "Dirty trap"
    }
  };
  const current = copy[mode];

  return (
    <div className={`drawer-return-shell bad is-${mode}`}>
      <div className="drawer-return-queue" aria-hidden="true">
        <div className="drawer-return-toolbar">
          <div>
            <strong>Claims review queue</strong>
            <span>{mode === "stateReset" ? "Filter will be cleared" : "Filter: urgent claims"}</span>
          </div>
          <button type="button" className="demo-button small" tabIndex={-1}>Change filter</button>
        </div>
        <div className={mode === "lostFocus" || mode === "stateReset" ? "drawer-return-row" : "drawer-return-row is-selected"}>
          <span><strong>Claim C-1042</strong><small>{mode === "lostFocus" ? "Focus will not return here" : "Selected row"}</small></span>
          <em>{current.tag}</em>
        </div>
      </div>
      <aside className="drawer-return-panel bad" aria-labelledby={`drawer-return-bad-title-${idSuffix}`}>
        <div className="drawer-return-header">
          <div>
            <h3 id={`drawer-return-bad-title-${idSuffix}`}>{current.title}</h3>
            <span>Return path broken</span>
          </div>
          {mode !== "noClose" && mode !== "dirtyTrap" && mode !== "mobileNoBack" && (
            <button type="button" className="drawer-return-close">OK</button>
          )}
        </div>
        <p>{current.body}</p>
        <div className="drawer-return-exit-grid bad" aria-label="Broken drawer exit contract">
          <span><strong>Escape</strong> {mode === "escapeDead" ? "ignored" : "undefined"}</span>
          <span><strong>Back</strong> {mode === "backNavigatesAway" ? "leaves page" : "not wired"}</span>
          <span><strong>Focus</strong> {mode === "lostFocus" ? "page header" : "unknown"}</span>
          <span><strong>State</strong> {mode === "stateReset" ? "cleared" : "untracked"}</span>
        </div>
      </aside>
    </div>
  );
}

function DrawerNoCloseReturnGoodUx() {
  const [mode, setMode] = useState<DrawerNoCloseReturnMode>("closeButton");
  const [open, setOpen] = useState(true);
  const [status, setStatus] = useState("Drawer opened from Claim C-1042; close routes are available.");
  const selected = mode === "selectionSwitch" ? "Claim C-1043" : "Claim C-1042";
  const rowRef = useRef<HTMLButtonElement | null>(null);

  const chooseMode = (next: DrawerNoCloseReturnMode) => {
    setMode(next);
    setOpen(true);
    setStatus({
      closeButton: "Close button is visible in the drawer header.",
      escapeClose: "Escape closes the clean drawer and returns focus to the selected row.",
      browserBack: "Browser back first closes the drawer route and keeps the queue visible.",
      scrimClose: "Scrim close uses the same cleanup as the close button.",
      focusReturn: "Close returns focus to the current selected row.",
      selectionSwitch: "Selection changed to Claim C-1043 and the return target updated.",
      dirtyReview: "Dirty drawer close opens a discard review instead of removing close.",
      mobileBack: "Mobile full-screen drawer includes Back to queue.",
      stickyHeader: "Sticky header keeps Close reachable while content scrolls.",
      statePreserved: "Urgent filter, selected row, and scroll position are preserved.",
      gestureEquivalent: "Swipe has Close, Escape, and Back equivalents.",
      commitLock: "Close is temporarily disabled only during a saving commit and status explains why."
    }[next]);
  };

  const closeDrawer = (message: string) => {
    setOpen(false);
    setStatus(`${message}; focus returned to ${selected}.`);
    window.setTimeout(() => rowRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (mode === "dirtyReview") {
          setStatus("Escape opened the dirty-state discard review instead of trapping the drawer.");
          return;
        }
        closeDrawer("Closed with Escape");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mode, open, selected]);

  return (
    <div className="quality-example drawer-return-demo">
      <div className="drawer-return-live-row">
        <button ref={rowRef} type="button" className="demo-button small primary" onClick={() => {
          setOpen(true);
          setStatus(`Drawer reopened from ${selected}.`);
        }}>Open selected drawer</button>
        <button type="button" className="demo-button small" onClick={() => closeDrawer("Closed with visible close button")}>Close now</button>
        <button type="button" className="demo-button small" onClick={() => chooseMode("browserBack")}>Browser back route</button>
      </div>
      {open ? <DrawerNoCloseReturnPanel mode={mode} idSuffix="good-ux" /> : (
        <div className="drawer-return-closed-state">
          <strong>{selected} row focused</strong>
          <span>Drawer closed. Urgent filter, scroll position, and selected row remain intact.</span>
        </div>
      )}
      <div className="demo-row drawer-return-controls">
        {drawerNoCloseGoodModes.map((item) => (
          <button
            key={item.mode}
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => chooseMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function DrawerNoCloseReturnBadUx() {
  const [mode, setMode] = useState<DrawerNoCloseReturnBadMode>("noClose");
  const copy: Record<DrawerNoCloseReturnBadMode, string> = {
    noClose: "No close control or Escape path leaves users stuck in the drawer.",
    escapeDead: "Escape does nothing, creating a keyboard trap.",
    backNavigatesAway: "Browser back leaves the workspace instead of closing the drawer first.",
    lostFocus: "After visual close, focus drops to the page header instead of the selected row.",
    stateReset: "Closing resets filters, scroll position, and selected object.",
    mobileNoBack: "Mobile full-screen drawer has no Back or Close route to the queue.",
    gestureOnly: "Swipe-only dismissal excludes keyboard, pointer, and assistive technology users.",
    dirtyTrap: "Dirty state removes close instead of offering Keep editing, Save, or Discard."
  };

  return (
    <div className={`quality-example drawer-return-bad-ux is-${mode}`}>
      <DrawerNoCloseReturnBadPanel mode={mode} idSuffix="bad-ux" />
      <div className="demo-row drawer-return-controls">
        {drawerNoCloseBadModes.map((item) => (
          <button
            key={item.mode}
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function DrawerGoodUx({ meta }: { meta: PatternMeta }) {
  type ClaimKey = "c1042" | "c1043";
  const claims: Record<ClaimKey, { id: string; risk: string; owner: string; age: string; note: string }> = {
    c1042: {
      id: "Claim C-1042",
      risk: "High risk",
      owner: "A. Patel",
      age: "2h old",
      note: "Address mismatch and uploaded evidence need a second reviewer."
    },
    c1043: {
      id: "Claim C-1043",
      risk: "Medium risk",
      owner: "M. Chen",
      age: "18m old",
      note: "Employer name was corrected; payout amount still needs review."
    }
  };
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [selected, setSelected] = useState<ClaimKey>("c1042");
  const [status, setStatus] = useState("Select a claim to open its drawer without leaving the queue.");
  const rowRefs = useRef<Record<ClaimKey, HTMLButtonElement | null>>({ c1042: null, c1043: null });
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const selectedClaim = claims[selected];

  const openDrawer = (claim: ClaimKey) => {
    setSelected(claim);
    setOpen(true);
    setStatus(`${claims[claim].id} opened in the drawer; queue filters and row context stay visible.`);
    window.setTimeout(() => closeRef.current?.focus(), 0);
  };

  const closeDrawer = (message: string) => {
    setOpen(false);
    setStatus(`${message}; focus returned to ${claims[selected].id}.`);
    window.setTimeout(() => rowRefs.current[selected]?.focus(), 0);
  };

  const switchClaim = (claim: ClaimKey) => {
    setSelected(claim);
    setOpen(true);
    setStatus(`${claims[claim].id} selected; drawer title, detail, and status updated without stale content.`);
    window.setTimeout(() => closeRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer("Closed with Escape");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, selected]);

  return (
    <div className={pinned ? "quality-example drawer-demo is-pinned" : "quality-example drawer-demo"}>
      <div className="drawer-workbench">
        <div className="drawer-queue" aria-label={meta.subject}>
          <div className="drawer-queue-header">
            <strong>{meta.subject}</strong>
            <span>Filtered: urgent claims</span>
          </div>
          {(Object.keys(claims) as ClaimKey[]).map((claimKey) => {
            const claim = claims[claimKey];
            const active = selected === claimKey && open;
            return (
              <button
                key={claimKey}
                ref={(node) => { rowRefs.current[claimKey] = node; }}
                type="button"
                className={active ? "drawer-row is-selected" : "drawer-row"}
                aria-pressed={active}
                onClick={() => openDrawer(claimKey)}
              >
                <span>
                  <strong>{claim.id}</strong>
                  <small>{claim.owner} - {claim.age}</small>
                </span>
                <em>{claim.risk}</em>
              </button>
            );
          })}
        </div>
        {open && (
          <aside className={pinned ? "drawer-panel live is-pinned" : "drawer-panel live"} aria-labelledby="drawer-good-title">
            <div className="drawer-panel-header">
              <div>
                <h3 id="drawer-good-title">{selectedClaim.id}</h3>
                <span>{selectedClaim.risk} - {selectedClaim.owner}</span>
              </div>
              <button ref={closeRef} type="button" className="drawer-close-button" aria-label={`Close ${selectedClaim.id} details`} onClick={() => closeDrawer("Closed drawer")}>x</button>
            </div>
            <p>{selectedClaim.note}</p>
            <div className="drawer-fact-grid">
              <span><strong>Status</strong> Needs review</span>
              <span><strong>Queue age</strong> {selectedClaim.age}</span>
              <span><strong>Mode</strong> {pinned ? "Pinned" : "Temporary"}</span>
              <span><strong>Context</strong> Queue visible</span>
            </div>
            <div className="drawer-action-row">
              <button type="button" className="demo-button small primary" onClick={() => {
                setPinned((current) => !current);
                setStatus(!pinned ? "Drawer pinned side-by-side for comparison." : "Drawer unpinned as a temporary edge panel.");
              }}>{pinned ? "Unpin drawer" : "Pin drawer"}</button>
              <button type="button" className="demo-button small" onClick={() => switchClaim(selected === "c1042" ? "c1043" : "c1042")}>Next claim</button>
              <button type="button" className="demo-button small" onClick={() => closeDrawer("Closed drawer")}>Close drawer</button>
            </div>
          </aside>
        )}
      </div>
      <div className="demo-row drawer-controls">
        <button type="button" className="demo-button small" onClick={() => openDrawer("c1042")}>Open C-1042</button>
        <button type="button" className="demo-button small" onClick={() => switchClaim("c1043")}>Switch to C-1043</button>
        <button type="button" className={pinned ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPinned((current) => !current);
          setOpen(true);
          setStatus(!pinned ? "Drawer pinned side-by-side for comparison." : "Drawer returned to temporary edge mode.");
        }}>Pin drawer</button>
        <button type="button" className="demo-button small" onClick={() => closeDrawer("Closed with Escape")}>Escape close</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function DrawerBadUx() {
  type Mode = "noClose" | "staleDetail" | "navigationMix" | "modalBlocking" | "stateLoss" | "overstuffed";
  const [mode, setMode] = useState<Mode>("noClose");
  const copy: Record<Mode, string> = {
    noClose: "No close control or Escape path leaves users stuck beside the queue.",
    staleDetail: "The selected row changed, but the drawer still shows the previous claim.",
    navigationMix: "The panel mixes page destinations with contextual detail, so users cannot tell whether it is navigation or inspection.",
    modalBlocking: "The drawer blocks the whole page even though reviewers need to compare the row behind it.",
    stateLoss: "Opening the drawer clears the active urgent-claims filter and loses queue context.",
    overstuffed: "A long workflow with scheduling, upload, reassignment, and approval has outgrown a narrow drawer."
  };

  return (
    <div className={`quality-example drawer-bad-ux is-${mode}`}>
      <div className="drawer-workbench bad">
        <div className="drawer-queue">
          <div className="drawer-queue-header">
            <strong>Claims review queue</strong>
            <span>{mode === "stateLoss" ? "Filter cleared unexpectedly" : "Filtered: urgent claims"}</span>
          </div>
          <button type="button" className={mode === "staleDetail" ? "drawer-row is-selected" : "drawer-row"}>
            <span><strong>{mode === "staleDetail" ? "Claim C-1043" : "Claim C-1042"}</strong><small>Selected row</small></span>
            <em>{mode === "stateLoss" ? "All risks" : "High risk"}</em>
          </button>
        </div>
        <div className="drawer-panel bad">
          <strong>{mode === "navigationMix" ? "Menu" : mode === "modalBlocking" ? "Blocking drawer" : mode === "overstuffed" ? "Complete claim workflow" : "Details"}</strong>
          <p>{mode === "staleDetail" ? "Showing Claim C-1042 even though Claim C-1043 is selected." : copy[mode]}</p>
          {mode === "navigationMix" && (
            <div className="drawer-bad-list">
              <span>Dashboard</span>
              <span>Claims</span>
              <span>Settings</span>
              <span>Delete account</span>
            </div>
          )}
          {mode === "overstuffed" && (
            <div className="drawer-bad-list">
              <span>Upload evidence</span>
              <span>Book review call</span>
              <span>Assign approver</span>
              <span>Submit final decision</span>
            </div>
          )}
          {mode !== "noClose" && <button type="button" className="demo-button small">OK</button>}
        </div>
      </div>
      <div className="demo-row drawer-controls">
        <button type="button" className={mode === "noClose" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noClose")}>No close</button>
        <button type="button" className={mode === "staleDetail" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleDetail")}>Stale detail</button>
        <button type="button" className={mode === "navigationMix" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("navigationMix")}>Navigation mix</button>
        <button type="button" className={mode === "modalBlocking" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("modalBlocking")}>Modal blocking</button>
        <button type="button" className={mode === "stateLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stateLoss")}>State loss</button>
        <button type="button" className={mode === "overstuffed" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overstuffed")}>Overstuffed</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function SheetGoodUx({ meta }: { meta: PatternMeta }) {
  type SheetSize = "compact" | "expanded";
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<SheetSize>("compact");
  const [note, setNote] = useState("Call claimant before payout approval.");
  const [dirty, setDirty] = useState(false);
  const [reviewDismissal, setReviewDismissal] = useState(false);
  const [status, setStatus] = useState("Open the follow-up sheet from the claim row.");
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const firstFieldRef = useRef<HTMLTextAreaElement | null>(null);
  const keepEditingRef = useRef<HTMLButtonElement | null>(null);

  const openSheet = () => {
    setOpen(true);
    setReviewDismissal(false);
    setStatus("Sheet opened as a temporary child task for Claim C-1042.");
    window.setTimeout(() => firstFieldRef.current?.focus(), 0);
  };

  const closeSheet = (message: string, resetDraft = false) => {
    setOpen(false);
    setReviewDismissal(false);
    if (resetDraft) {
      setNote("Call claimant before payout approval.");
      setDirty(false);
      setSize("compact");
    }
    setStatus(`${message}; focus returned to the claim row.`);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  };

  const requestDismiss = (route: string) => {
    if (dirty) {
      setReviewDismissal(true);
      setStatus(`${route} requested while the sheet has unsaved edits; discard review is shown.`);
      window.setTimeout(() => keepEditingRef.current?.focus(), 0);
      return;
    }
    closeSheet(`${route} closed the clean sheet`);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestDismiss("Escape");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dirty, open]);

  return (
    <div className="quality-example sheet-demo">
      <div className="sheet-parent-workspace" aria-hidden={open ? "true" : undefined}>
        <button
          ref={openerRef}
          type="button"
          className="sheet-claim-row"
          onClick={openSheet}
          disabled={open}
        >
          <span>
            <strong>{meta.subject}</strong>
            <small>Evidence received - follow-up needed</small>
          </span>
          <em>Schedule</em>
        </button>
        <button type="button" className="demo-button small" disabled={open}>Change queue filter</button>
      </div>
      <div className="demo-row sheet-controls">
        <button type="button" className="demo-button small" onClick={openSheet}>Open sheet</button>
        <button type="button" className="demo-button small" onClick={() => {
          setOpen(true);
          setNote("Call claimant before payout approval. Ask for revised bank statement.");
          setDirty(true);
          setStatus("Reviewer note edited; every dismissal route now requires a decision.");
        }}>Edit note</button>
        <button type="button" className={size === "expanded" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setOpen(true);
          setSize((current) => current === "compact" ? "expanded" : "compact");
          setStatus(size === "compact" ? "Sheet expanded while preserving the typed note." : "Sheet compacted while preserving the typed note.");
        }}>{size === "expanded" ? "Compact sheet" : "Expand sheet"}</button>
        <button type="button" className="demo-button small" onClick={() => requestDismiss("Escape")}>Escape close</button>
      </div>
      {open && (
        <div className="sheet-backdrop">
          <section className={`sheet-surface live is-${size}`} role="dialog" aria-modal="true" aria-labelledby="sheet-good-title" aria-describedby="sheet-good-desc">
            <div className="sheet-grabber" aria-hidden="true"></div>
            <div className="sheet-header">
              <div>
                <h3 id="sheet-good-title">Schedule follow-up for Claim C-1042</h3>
                <p id="sheet-good-desc">{size === "expanded" ? "Expanded sheet: more scheduling context is visible." : "Compact sheet: task actions remain reachable."}</p>
              </div>
              <button type="button" className="sheet-close-button" aria-label="Close follow-up sheet" onClick={() => requestDismiss("Close button")}>x</button>
            </div>
            <div className="sheet-context-strip">
              <span><strong>Parent</strong> Claims review queue</span>
              <span><strong>Mode</strong> Modal sheet</span>
              <span><strong>Draft</strong> {dirty ? "Unsaved" : "Clean"}</span>
            </div>
            <label>
              <span>Reviewer note</span>
              <textarea
                ref={firstFieldRef}
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                  setDirty(true);
                  setStatus("Reviewer note changed; close paths now guard unsaved work.");
                }}
              />
            </label>
            {size === "expanded" && (
              <div className="sheet-extra-fields">
                <label>
                  <span>Follow-up window</span>
                  <select defaultValue="today">
                    <option value="today">Today before payout</option>
                    <option value="tomorrow">Tomorrow morning</option>
                  </select>
                </label>
                <label>
                  <span>Reason</span>
                  <select defaultValue="evidence">
                    <option value="evidence">Verify evidence</option>
                    <option value="bank">Confirm bank details</option>
                  </select>
                </label>
              </div>
            )}
            {reviewDismissal && (
              <div className="sheet-discard-review" role="alert">
                <strong>Discard unsaved follow-up note?</strong>
                <span>Close, Escape, back, outside click, and drag dismissal all use this decision.</span>
                <div className="sheet-action-row">
                  <button ref={keepEditingRef} type="button" className="demo-button small primary" onClick={() => {
                    setReviewDismissal(false);
                    setStatus("Kept editing; the sheet remains open with the draft intact.");
                    window.setTimeout(() => firstFieldRef.current?.focus(), 0);
                  }}>Keep editing</button>
                  <button type="button" className="demo-button small" onClick={() => closeSheet("Discarded sheet draft", true)}>Discard changes</button>
                </div>
              </div>
            )}
            <div className="sheet-action-row">
              <button type="button" className="demo-button" onClick={() => requestDismiss("Cancel")}>Cancel</button>
              <button type="button" className="demo-button primary" onClick={() => {
                setDirty(false);
                closeSheet("Saved follow-up task");
              }}>Save follow-up</button>
            </div>
          </section>
        </div>
      )}
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function SheetBadUx() {
  type Mode = "noTitle" | "silentDiscard" | "backgroundEdit" | "wrongSurface" | "hiddenActions" | "stackedSheet";
  const [mode, setMode] = useState<Mode>("noTitle");
  const copy: Record<Mode, string> = {
    noTitle: "The sheet title does not name the child task or parent claim.",
    silentDiscard: "Swipe, Escape, and outside click discard the edited note without a decision point.",
    backgroundEdit: "Parent controls remain active behind a modal-looking sheet, creating conflicting state.",
    wrongSurface: "A destination menu and global settings were put in a sheet instead of navigation or settings surfaces.",
    hiddenActions: "Primary actions are buried below the scroll boundary, so users cannot finish confidently.",
    stackedSheet: "A second sheet opens over the first, making close order and focus return unclear."
  };

  return (
    <div className={`quality-example sheet-bad-ux is-${mode}`}>
      <div className="sheet-parent-workspace bad">
        <button type="button" className="sheet-claim-row">
          <span>
            <strong>Claim C-1042</strong>
            <small>{mode === "backgroundEdit" ? "Queue changed behind sheet" : "Follow-up needed"}</small>
          </span>
          <em>{mode === "backgroundEdit" ? "Edited" : "Open"}</em>
        </button>
        {mode === "backgroundEdit" && <button type="button" className="demo-button small primary">Filter changed behind sheet</button>}
      </div>
      <div className="sheet-surface bad">
        <div className="sheet-header">
          <strong>{mode === "noTitle" ? "Sheet" : mode === "wrongSurface" ? "Menu" : mode === "stackedSheet" ? "Follow-up + confirm" : "Follow-up"}</strong>
          {mode !== "silentDiscard" && <button type="button" className="sheet-close-button">x</button>}
        </div>
        <p>{copy[mode]}</p>
        {mode === "wrongSurface" && (
          <div className="sheet-bad-list">
            <span>Dashboard</span>
            <span>All claims</span>
            <span>Account settings</span>
            <span>Delete account</span>
          </div>
        )}
        {mode === "hiddenActions" && (
          <div className="sheet-scroll-trap">
            <span>Long note field</span>
            <span>More fields</span>
            <span>More fields</span>
            <span>Save button below hidden scroll</span>
          </div>
        )}
        {mode === "stackedSheet" && (
          <div className="sheet-nested-card">
            <strong>Discard changes?</strong>
            <button type="button">OK</button>
          </div>
        )}
      </div>
      <div className="demo-row sheet-controls">
        <button type="button" className={mode === "noTitle" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noTitle")}>No title</button>
        <button type="button" className={mode === "silentDiscard" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("silentDiscard")}>Silent discard</button>
        <button type="button" className={mode === "backgroundEdit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("backgroundEdit")}>Background edit</button>
        <button type="button" className={mode === "wrongSurface" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("wrongSurface")}>Wrong surface</button>
        <button type="button" className={mode === "hiddenActions" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenActions")}>Hidden actions</button>
        <button type="button" className={mode === "stackedSheet" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stackedSheet")}>Stacked sheet</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function BottomSheetGoodUx({ meta }: { meta: PatternMeta }) {
  type Detent = "closed" | "peek" | "half" | "full";
  const [detent, setDetent] = useState<Detent>("closed");
  const [selectedDeparture, setSelectedDeparture] = useState("Blue line - 6 min");
  const [status, setStatus] = useState("Select Harbor station to open the bottom sheet.");
  const pinRef = useRef<HTMLButtonElement | null>(null);
  const routeRef = useRef<HTMLButtonElement | null>(null);
  const open = detent !== "closed";

  const setSheetDetent = (next: Detent) => {
    setDetent(next);
    if (next === "closed") {
      setStatus("Bottom sheet closed; focus returned to the selected map pin.");
      window.setTimeout(() => pinRef.current?.focus(), 0);
      return;
    }
    setStatus(
      next === "peek"
        ? "Peek shows station identity and the next departure without hiding the map."
        : next === "half"
          ? "Half detent exposes primary route controls while Harbor station stays visible."
          : "Full detent gives the departure list more room; the map remains as the task origin."
    );
    window.setTimeout(() => routeRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setSheetDetent("closed");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="quality-example bottom-sheet-demo">
      <div className="bottom-sheet-phone live">
        <div className="bottom-sheet-map" aria-label={meta.subject}>
          <button
            ref={pinRef}
            type="button"
            className="bottom-sheet-pin is-selected"
            aria-pressed={open}
            onClick={() => setSheetDetent("peek")}
          >
            A
          </button>
          <button type="button" className="bottom-sheet-pin secondary" onClick={() => {
            setStatus("Second station selected on the map; Harbor sheet stays closed.");
            setDetent("closed");
          }}>B</button>
          <span className="bottom-sheet-route"></span>
          <span className="bottom-sheet-map-label">Harbor line map</span>
        </div>
        {open && (
          <section className={`bottom-sheet-panel live is-${detent}`} aria-labelledby="bottom-sheet-good-title">
            <button type="button" className="bottom-sheet-handle" aria-label="Drag handle; cycle bottom sheet height" onClick={() => {
              setSheetDetent(detent === "peek" ? "half" : detent === "half" ? "full" : "peek");
            }}></button>
            <div className="bottom-sheet-heading">
              <div>
                <h3 id="bottom-sheet-good-title">Harbor station</h3>
                <p>{detent === "peek" ? "Next train 6 min" : "4 min walk - Zone 2 - accessible entrance"}</p>
              </div>
              <button type="button" className="bottom-sheet-icon-button" aria-label="Close Harbor station bottom sheet" onClick={() => setSheetDetent("closed")}>x</button>
            </div>
            <div className="bottom-sheet-action-strip">
              <button ref={routeRef} type="button" className="demo-button small primary" onClick={() => {
                setSelectedDeparture("Route to Harbor station");
                setStatus("Route action selected from the reachable half-sheet controls.");
              }}>Route</button>
              <button type="button" className="demo-button small" onClick={() => setSheetDetent("half")}>Departures</button>
              <button type="button" className="demo-button small" onClick={() => setSheetDetent("closed")}>Close</button>
            </div>
            {detent !== "peek" && (
              <div className="bottom-sheet-departures" aria-label="Next departures">
                {["Blue line - 6 min", "Blue line - 14 min", "Ferry shuttle - 19 min"].map((departure) => (
                  <button
                    key={departure}
                    type="button"
                    className={selectedDeparture === departure ? "bottom-sheet-departure is-selected" : "bottom-sheet-departure"}
                    onClick={() => {
                      setSelectedDeparture(departure);
                      setStatus(`${departure} selected; sheet detent and map pin remain stable.`);
                    }}
                  >
                    <span>{departure}</span>
                    <small>{departure.includes("Ferry") ? "Pier B" : "Platform 2"}</small>
                  </button>
                ))}
              </div>
            )}
            {detent === "full" && (
              <div className="bottom-sheet-scroll-note">
                <strong>Gesture rule</strong>
                <span>Handle drag changes detent; dragging the departure list scrolls the list at full height.</span>
              </div>
            )}
          </section>
        )}
      </div>
      <div className="demo-row bottom-sheet-controls">
        <button type="button" className="demo-button small" onClick={() => setSheetDetent("peek")}>Open sheet</button>
        <button type="button" className={detent === "peek" ? "demo-button small primary" : "demo-button small"} onClick={() => setSheetDetent("peek")}>Peek</button>
        <button type="button" className={detent === "half" ? "demo-button small primary" : "demo-button small"} onClick={() => setSheetDetent("half")}>Half</button>
        <button type="button" className={detent === "full" ? "demo-button small primary" : "demo-button small"} onClick={() => setSheetDetent("full")}>Full</button>
        <button type="button" className="demo-button small" onClick={() => setSheetDetent("closed")}>Escape close</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function BottomSheetBadUx() {
  type Mode = "noPeek" | "scrollConflict" | "coversContext" | "navMix" | "safeArea" | "gestureOnly";
  const [mode, setMode] = useState<Mode>("noPeek");
  const copy: Record<Mode, string> = {
    noPeek: "The peek state exposes only a handle, so users must expand before understanding the sheet.",
    scrollConflict: "Dragging a departure row sometimes scrolls the list and sometimes dismisses the whole sheet.",
    coversContext: "The sheet starts at full height and hides the map pin it is supposed to explain.",
    navMix: "Global destinations are hidden in the bottom sheet instead of persistent navigation.",
    safeArea: "The primary action sits under the home indicator and competes with bottom navigation.",
    gestureOnly: "Users can resize or close only by swiping; no accessible controls are provided."
  };

  return (
    <div className={`quality-example bottom-sheet-bad-ux is-${mode}`}>
      <div className="bottom-sheet-phone bad">
        <div className="bottom-sheet-map">
          <span className="bottom-sheet-pin is-selected">A</span>
          <span className="bottom-sheet-route"></span>
          {mode === "safeArea" && <div className="bottom-sheet-bottom-nav">Home Search Saved</div>}
        </div>
        <div className={`bottom-sheet-panel bad ${mode === "coversContext" || mode === "navMix" ? "is-full" : "is-half"}`}>
          {mode !== "gestureOnly" && <div className="bottom-sheet-handle" aria-hidden="true"></div>}
          <div className="bottom-sheet-heading">
            <strong>{mode === "navMix" ? "Destinations" : mode === "noPeek" ? "" : "Station"}</strong>
            {mode !== "gestureOnly" && <button type="button" className="bottom-sheet-icon-button">x</button>}
          </div>
          <p>{copy[mode]}</p>
          {mode === "navMix" && (
            <div className="bottom-sheet-bad-list">
              <span>Home</span>
              <span>Search</span>
              <span>Saved</span>
              <span>Profile</span>
            </div>
          )}
          {mode === "scrollConflict" && (
            <div className="bottom-sheet-bad-list">
              <span>Blue line - 6 min</span>
              <span>Blue line - 14 min</span>
              <span>Ferry shuttle - 19 min</span>
            </div>
          )}
          {mode === "safeArea" && <button type="button" className="demo-button small primary">Start route</button>}
        </div>
      </div>
      <div className="demo-row bottom-sheet-controls">
        <button type="button" className={mode === "noPeek" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noPeek")}>No peek content</button>
        <button type="button" className={mode === "scrollConflict" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("scrollConflict")}>Scroll conflict</button>
        <button type="button" className={mode === "coversContext" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("coversContext")}>Covers context</button>
        <button type="button" className={mode === "navMix" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("navMix")}>Nav mix</button>
        <button type="button" className={mode === "safeArea" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("safeArea")}>Safe-area block</button>
        <button type="button" className={mode === "gestureOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("gestureOnly")}>Gesture only</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function PopoverGoodUx({ meta }: { meta: PatternMeta }) {
  type Placement = "below" | "above";
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>("below");
  const [dueDate, setDueDate] = useState("No due date set");
  const [customDate, setCustomDate] = useState("2026-06-12");
  const [status, setStatus] = useState("Open the due-date popover from the task row.");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const firstChoiceRef = useRef<HTMLButtonElement | null>(null);

  const openPopover = (message = "Popover opened beside the Due date trigger.") => {
    setOpen(true);
    setStatus(message);
    window.setTimeout(() => firstChoiceRef.current?.focus(), 0);
  };

  const closePopover = (message: string) => {
    setOpen(false);
    setStatus(`${message}; focus returned to the Due date trigger.`);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const applyDate = (value: string) => {
    setDueDate(value);
    closePopover(`${value} applied to the task row`);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePopover("Closed with Escape");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={`quality-example popover-demo is-${placement}`}>
      <div className="popover-workspace">
        <div className={placement === "above" ? "popover-task-row is-edge" : "popover-task-row"}>
          <span>
            <strong>Quarter close checklist</strong>
            <small>{dueDate}</small>
          </span>
          <button
            ref={triggerRef}
            type="button"
            className="demo-button small primary"
            aria-expanded={open}
            aria-controls="due-date-popover"
            onClick={() => {
              if (open) {
                closePopover("Trigger toggled the popover closed");
              } else {
                openPopover();
              }
            }}
          >
            {meta.field}
          </button>
        </div>
        {open && (
          <section id="due-date-popover" className={`popover-surface live is-${placement}`} aria-labelledby="due-date-popover-title">
            <div className="popover-arrow" aria-hidden="true"></div>
            <div className="popover-heading">
              <div>
                <h3 id="due-date-popover-title">Set due date</h3>
                <p>{placement === "above" ? "Flipped above to avoid the viewport edge." : "Anchored below the Due date trigger."}</p>
              </div>
              <button type="button" className="popover-close-button" aria-label="Close due date popover" onClick={() => closePopover("Closed with close button")}>x</button>
            </div>
            <div className="popover-choice-grid" aria-label="Suggested dates">
              <button ref={firstChoiceRef} type="button" className="demo-button small" onClick={() => applyDate("Due today")}>Today</button>
              <button type="button" className="demo-button small primary" onClick={() => applyDate("Due tomorrow")}>Tomorrow</button>
              <button type="button" className="demo-button small" onClick={() => applyDate("Due Friday")}>Friday</button>
            </div>
            <label className="popover-custom-date">
              <span>Custom date</span>
              <input
                type="date"
                value={customDate}
                onChange={(event) => {
                  setCustomDate(event.target.value);
                  setStatus("Custom date changed inside the popover; no value applies until Apply is pressed.");
                }}
              />
            </label>
            <div className="popover-action-row">
              <button type="button" className="demo-button small" onClick={() => closePopover("Dismissed clean popover")}>Cancel</button>
              <button type="button" className="demo-button small primary" onClick={() => applyDate(`Due ${customDate}`)}>Apply</button>
            </div>
          </section>
        )}
      </div>
      <div className="demo-row popover-controls">
        <button type="button" className="demo-button small" onClick={() => openPopover()}>Open popover</button>
        <button type="button" className="demo-button small" onClick={() => {
          openPopover("Popover opened and the first date option received focus.");
          applyDate("Due tomorrow");
        }}>Choose Tomorrow</button>
        <button type="button" className={placement === "above" ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setPlacement((current) => current === "below" ? "above" : "below");
          setOpen(true);
          setStatus(placement === "below" ? "Anchor moved near the lower edge; popover flipped above it." : "Anchor returned to the roomy area; popover can sit below it.");
          window.setTimeout(() => firstChoiceRef.current?.focus(), 0);
        }}>Move near edge</button>
        <button type="button" className="demo-button small" onClick={() => open ? closePopover("Outside click dismissed the clean popover") : setStatus("Open the popover before testing outside dismissal.")}>Outside click</button>
        <button type="button" className="demo-button small" onClick={() => open ? closePopover("Closed with Escape") : setStatus("Open the popover before pressing Escape.")}>Escape close</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function PopoverBadUx() {
  type Mode = "hoverOnly" | "detached" | "focusLoss" | "overstuffed" | "modalMask" | "menuRoles";
  const [mode, setMode] = useState<Mode>("hoverOnly");
  const copy: Record<Mode, string> = {
    hoverOnly: "Required due-date instructions appear only on hover, so touch and keyboard users cannot reliably open or keep them.",
    detached: "The surface floats away from the Due date trigger after scrolling, so the anchor relationship is unclear.",
    focusLoss: "Escape closes the layer but focus jumps to the document start instead of returning to Due date.",
    overstuffed: "A long workflow with notes, assignment, recurrence, and approval does not fit a compact popover.",
    modalMask: "The page is blocked by a mask even though the user only needed local date context.",
    menuRoles: "Menu roles are applied to mixed text, links, inputs, and buttons, creating the wrong keyboard model."
  };

  return (
    <div className={`quality-example popover-bad-ux is-${mode}`}>
      <div className="popover-workspace bad">
        <div className="popover-task-row bad">
          <span>
            <strong>Quarter close checklist</strong>
            <small>{mode === "focusLoss" ? "Focus will not return here" : "Due date unset"}</small>
          </span>
          <button type="button" className="demo-button small">{mode === "hoverOnly" ? "?" : "Due date"}</button>
        </div>
        {mode === "modalMask" && <div className="popover-mask" aria-hidden="true"></div>}
        <div className={`popover-surface bad ${mode === "detached" ? "detached" : ""}`} role={mode === "menuRoles" ? "menu" : undefined}>
          <strong>{mode === "menuRoles" ? "Due date menu" : mode === "modalMask" ? "Blocking date layer" : "Due date"}</strong>
          <p>{copy[mode]}</p>
          {mode === "overstuffed" && (
            <div className="popover-bad-grid">
              <span>Assign reviewer</span>
              <span>Schedule recurrence</span>
              <span>Approval chain</span>
              <span>Long notes</span>
            </div>
          )}
          {mode === "menuRoles" && (
            <>
              <input aria-label="Date inside menu" value="Tomorrow" readOnly />
              <a href="#mixed-popover-menu" onClick={(event) => event.preventDefault()}>Learn policy</a>
            </>
          )}
          {mode !== "hoverOnly" && <button type="button" className="demo-button small">OK</button>}
        </div>
      </div>
      <div className="demo-row popover-controls">
        <button type="button" className={mode === "hoverOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hoverOnly")}>Hover only</button>
        <button type="button" className={mode === "detached" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("detached")}>Detached</button>
        <button type="button" className={mode === "focusLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("focusLoss")}>Focus loss</button>
        <button type="button" className={mode === "overstuffed" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("overstuffed")}>Overstuffed</button>
        <button type="button" className={mode === "modalMask" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("modalMask")}>Modal mask</button>
        <button type="button" className={mode === "menuRoles" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("menuRoles")}>Menu roles</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

type TooltipOnlyRequiredInfoMode =
  | "visibleHelp"
  | "supplementalTooltip"
  | "tooltipDismissed"
  | "validationRecovery"
  | "disabledReason"
  | "touchRoute"
  | "screenReaderText"
  | "detailsExample"
  | "popoverExample"
  | "deadlineConsequence"
  | "legalConsequence"
  | "zoomWrap"
  | "mobileTask";

type TooltipOnlyRequiredInfoBadMode =
  | "hoverOnlyFormat"
  | "titleOnlyHelp"
  | "disabledTooltip"
  | "lostOnBlur"
  | "legalTooltip"
  | "passwordRules"
  | "clippedTooltip"
  | "mobileNoHover";

const tooltipOnlyRequiredGoodModes: Array<{ mode: TooltipOnlyRequiredInfoMode; label: string }> = [
  { mode: "visibleHelp", label: "Visible help" },
  { mode: "supplementalTooltip", label: "Supplemental tooltip" },
  { mode: "tooltipDismissed", label: "Tooltip dismissed" },
  { mode: "validationRecovery", label: "Validation" },
  { mode: "disabledReason", label: "Disabled reason" },
  { mode: "touchRoute", label: "Touch route" },
  { mode: "screenReaderText", label: "Screen reader" },
  { mode: "detailsExample", label: "Details example" },
  { mode: "popoverExample", label: "Popover example" },
  { mode: "deadlineConsequence", label: "Deadline consequence" },
  { mode: "legalConsequence", label: "Legal consequence" },
  { mode: "zoomWrap", label: "High zoom" },
  { mode: "mobileTask", label: "Mobile task" }
];

const tooltipOnlyRequiredBadModes: Array<{ mode: TooltipOnlyRequiredInfoBadMode; label: string }> = [
  { mode: "hoverOnlyFormat", label: "Hover-only format" },
  { mode: "titleOnlyHelp", label: "Title-only help" },
  { mode: "disabledTooltip", label: "Disabled tooltip" },
  { mode: "lostOnBlur", label: "Lost on blur" },
  { mode: "legalTooltip", label: "Legal tooltip" },
  { mode: "passwordRules", label: "Password rules" },
  { mode: "clippedTooltip", label: "Clipped tooltip" },
  { mode: "mobileNoHover", label: "Mobile no hover" }
];

function TooltipOnlyRequiredInfoPanel({ mode, idSuffix = "main" }: { mode: TooltipOnlyRequiredInfoMode; idSuffix?: string }) {
  const showTooltip = mode === "supplementalTooltip";
  const showValidation = mode === "validationRecovery";
  const showDetails = mode === "detailsExample";
  const showPopover = mode === "popoverExample";
  const compact = mode === "mobileTask";
  const requirement = mode === "deadlineConsequence"
    ? "Submit by 5 PM Friday or the application moves to next month's review."
    : mode === "legalConsequence"
      ? "By submitting, you confirm the tax details are accurate and may be audited."
      : "Enter 9 digits from your tax notice. Do not include spaces or dashes.";
  const status = {
    visibleHelp: "Required format help is visible before typing, so the field does not depend on hover or focus timing.",
    supplementalTooltip: "The tooltip repeats where to find the number, but the required format stays visible beside the field.",
    tooltipDismissed: "Tooltip dismissed; required information remains visible and the task is still completable.",
    validationRecovery: "Validation repeats the exact missing requirement and keeps it visible while the user fixes the field.",
    disabledReason: "The blocked Continue action has adjacent recovery text instead of a tooltip on an unfocusable disabled button.",
    touchRoute: "Touch users get the same requirement through visible helper text and an explicit details control.",
    screenReaderText: "Screen reader users can revisit the requirement in normal reading order, not just a temporary description.",
    detailsExample: "Longer examples stay in an opened details section while the user compares the field.",
    popoverExample: "Richer anchored help is intentionally opened and can remain available while users inspect examples.",
    deadlineConsequence: "The deadline consequence is visible as task guidance, not hidden inside a hover bubble.",
    legalConsequence: "Legal consequence copy is part of the form, not tooltip-only consent scope.",
    zoomWrap: "At high zoom, required helper text wraps under the field without overlapping controls.",
    mobileTask: "The compact mobile state keeps required information visible above the action."
  }[mode];

  return (
    <div className={`tooltip-required-shell ${compact ? "is-mobile" : ""} is-${mode}`}>
      <div className="tooltip-required-form">
        <div className="tooltip-required-heading">
          <strong>Tax credit application</strong>
          <span>{mode === "disabledReason" ? "Proof of address missing" : "Step 2 of 4"}</span>
        </div>
        <label className="tooltip-required-field" htmlFor={`tooltip-required-tax-id-${idSuffix}`}>
          <span>Tax ID</span>
          <input
            id={`tooltip-required-tax-id-${idSuffix}`}
            value={mode === "validationRecovery" ? "12-AB" : "123456789"}
            readOnly
            aria-describedby={`tooltip-required-help-${idSuffix}${showValidation ? ` tooltip-required-error-${idSuffix}` : ""}`}
          />
        </label>
        <p id={`tooltip-required-help-${idSuffix}`} className="tooltip-required-help">
          {requirement}
        </p>
        {showTooltip && (
          <div className="tooltip-required-tip" role="tooltip">
            Find this number on the top-right corner of your tax notice.
          </div>
        )}
        {showValidation && (
          <div id={`tooltip-required-error-${idSuffix}`} className="tooltip-required-error" role="alert">
            Tax ID must be 9 digits with no spaces or dashes.
          </div>
        )}
        {showDetails && (
          <details className="tooltip-required-details" open>
            <summary>Accepted tax ID examples</summary>
            <p>Use 123456789 from a tax notice. Do not use the account suffix after the dash.</p>
          </details>
        )}
        {showPopover && (
          <div className="tooltip-required-popover" role="dialog" aria-label="Where to find your tax ID">
            <strong>Where to find it</strong>
            <span>The ID appears on tax notices and annual statements. Keep this help open while checking the document.</span>
          </div>
        )}
        <div className="tooltip-required-actions">
          <button type="button" className="demo-button small primary" disabled={mode === "disabledReason"}>Continue</button>
          <span>{mode === "disabledReason" ? "Add proof of address before continuing." : "Required help remains available after tooltip dismissal."}</span>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function TooltipOnlyRequiredInfoBadPanel({ mode }: { mode: TooltipOnlyRequiredInfoBadMode }) {
  const copy = {
    hoverOnlyFormat: "The accepted format exists only in a hover tooltip, so users must memorize it before typing.",
    titleOnlyHelp: "The required rule is stored in a title attribute that touch and many assistive paths cannot inspect.",
    disabledTooltip: "Continue is disabled and the only missing-document explanation is a tooltip on an unfocusable control.",
    lostOnBlur: "The field-focus tooltip disappears as soon as users tab to the next field that needs the instruction.",
    legalTooltip: "The legal consequence of checking the declaration is hidden in a temporary help bubble.",
    passwordRules: "Password rules are only visible during focus, then validation fails after the list disappears.",
    clippedTooltip: "The required tooltip clips at high zoom and covers the field users must edit.",
    mobileNoHover: "The mobile flow uses hover-only help, so touch users never see the required instruction."
  }[mode];
  const bubble = mode === "passwordRules"
    ? "Use 12 characters, a number, and a symbol."
    : mode === "legalTooltip"
      ? "False details may lead to audit or penalty."
      : mode === "disabledTooltip"
        ? "Upload proof of address first."
        : "Use 9 digits, no spaces or dashes.";

  return (
    <div className={`tooltip-required-shell bad is-${mode}`}>
      <div className="tooltip-required-form bad">
        <div className="tooltip-required-heading">
          <strong>{mode === "passwordRules" ? "Create account" : "Tax credit application"}</strong>
          <span>{mode === "mobileNoHover" ? "Mobile view" : "Required help hidden"}</span>
        </div>
        <label className="tooltip-required-field">
          <span>{mode === "passwordRules" ? "Password" : "Tax ID"} <button type="button" className="tooltip-required-icon" title={bubble}>?</button></span>
          <input name={`tooltip-required-bad-${mode}`} value={mode === "passwordRules" ? "winter" : "12-AB"} readOnly />
        </label>
        <div className={`tooltip-required-tip bad ${mode === "clippedTooltip" ? "is-clipped" : ""}`} role="tooltip">
          {bubble}
        </div>
        {mode === "legalTooltip" && (
          <label className="tooltip-required-check">
            <input type="checkbox" name="tooltip-required-legal-confirmation" />
            I confirm these details.
          </label>
        )}
        <div className="tooltip-required-actions">
          <button type="button" className="demo-button small primary" disabled={mode === "disabledTooltip"}>Continue</button>
          <span>No visible required information remains after the tooltip closes.</span>
        </div>
      </div>
      <p className="demo-status" aria-live="polite">{copy}</p>
    </div>
  );
}

function TooltipOnlyRequiredInfoGoodUi() {
  return (
    <div className="tooltip-required-demo">
      <TooltipOnlyRequiredInfoPanel mode="visibleHelp" idSuffix="good-ui" />
    </div>
  );
}

function TooltipOnlyRequiredInfoBadUi() {
  return (
    <div className="tooltip-required-bad-ui">
      <TooltipOnlyRequiredInfoBadPanel mode="hoverOnlyFormat" />
    </div>
  );
}

function TooltipOnlyRequiredInfoGoodUx() {
  const [mode, setMode] = useState<TooltipOnlyRequiredInfoMode>("visibleHelp");
  return (
    <div className="quality-example tooltip-required-demo">
      <TooltipOnlyRequiredInfoPanel mode={mode} idSuffix="good-ux" />
      <div className="demo-row tooltip-required-controls">
        {tooltipOnlyRequiredGoodModes.map((item) => (
          <button
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            key={item.mode}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">
        {mode}: visible or intentionally openable required information survives tooltip dismissal.
      </p>
    </div>
  );
}

function TooltipOnlyRequiredInfoBadUx() {
  const [mode, setMode] = useState<TooltipOnlyRequiredInfoBadMode>("hoverOnlyFormat");
  return (
    <div className="quality-example tooltip-required-bad-ux">
      <TooltipOnlyRequiredInfoBadPanel mode={mode} />
      <div className="demo-row tooltip-required-controls">
        {tooltipOnlyRequiredBadModes.map((item) => (
          <button
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            key={item.mode}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">
        {mode}: required information is hidden in temporary tooltip-only treatment.
      </p>
    </div>
  );
}

function TooltipGoodUx({ meta }: { meta: PatternMeta }) {
  type Tool = "archive" | "share" | "copy";
  type Trigger = "focus" | "hover";
  const tips: Record<Tool, { label: string; text: string }> = {
    archive: { label: "Archive", text: "Moves this report to archived reports." },
    share: { label: "Share", text: "Invite teammates to view this report." },
    copy: { label: "Copy link", text: "Copies a private report link." }
  };
  const [visible, setVisible] = useState<Tool | null>(null);
  const [trigger, setTrigger] = useState<Trigger>("focus");
  const [status, setStatus] = useState("Focus Archive to show its short description.");
  const buttonRefs = useRef<Record<Tool, HTMLButtonElement | null>>({ archive: null, share: null, copy: null });

  const showTip = (tool: Tool, nextTrigger: Trigger) => {
    setVisible(tool);
    setTrigger(nextTrigger);
    setStatus(`${tips[tool].label} tooltip shown by ${nextTrigger}; focus stays on the ${tips[tool].label} button.`);
    if (nextTrigger === "focus") {
      window.setTimeout(() => buttonRefs.current[tool]?.focus(), 0);
    }
  };

  const hideTip = (message: string) => {
    const target = visible;
    setVisible(null);
    setStatus(message);
    if (target) window.setTimeout(() => buttonRefs.current[target]?.focus(), 0);
  };

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        hideTip(`Escape hid the ${tips[visible].label} tooltip; focus remained on the trigger.`);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  return (
    <div className="quality-example tooltip-demo">
      <div className="tooltip-workspace">
        <div className="tooltip-toolbar" aria-label={meta.subject}>
          {(Object.keys(tips) as Tool[]).map((tool) => (
            <button
              key={tool}
              ref={(node) => { buttonRefs.current[tool] = node; }}
              type="button"
              className={visible === tool ? "tooltip-tool is-active" : "tooltip-tool"}
              aria-describedby={visible === tool ? `tooltip-${tool}` : undefined}
              onFocus={() => showTip(tool, "focus")}
              onMouseEnter={() => showTip(tool, "hover")}
              onMouseLeave={() => {
                if (trigger === "hover" && visible === tool) {
                  setVisible(null);
                  setStatus(`${tips[tool].label} tooltip hidden on pointer out.`);
                }
              }}
              onClick={() => setStatus(`${tips[tool].label} action is available; the tooltip did not activate anything.`)}
            >
              {tips[tool].label}
            </button>
          ))}
        </div>
        {visible && (
          <div id={`tooltip-${visible}`} className={`tooltip-bubble live is-${visible}`} role="tooltip">
            {tips[visible].text}
          </div>
        )}
        <div className="tooltip-report-card">
          <strong>Q2 forecast report</strong>
          <span>Every toolbar control has a name before its tooltip appears.</span>
        </div>
      </div>
      <div className="demo-row tooltip-controls">
        <button type="button" className="demo-button small" onClick={() => showTip("archive", "focus")}>Focus Archive</button>
        <button type="button" className="demo-button small" onClick={() => showTip("share", "focus")}>Tab to Share</button>
        <button type="button" className="demo-button small" onClick={() => showTip("copy", "hover")}>Pointer hover</button>
        <button type="button" className="demo-button small" onClick={() => visible ? hideTip(`Escape hid the ${tips[visible].label} tooltip; focus remained on the trigger.`) : setStatus("Show a tooltip before pressing Escape.")}>Escape</button>
        <button type="button" className="demo-button small" onClick={() => visible ? hideTip("Pointer out hid the tooltip without changing the report.") : setStatus("Show a tooltip before testing pointer out.")}>Pointer out</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function TooltipBadUx() {
  type Mode = "hoverOnly" | "labelReplacement" | "interactiveContent" | "requiredInfo" | "disabledTarget" | "clipping";
  const [mode, setMode] = useState<Mode>("hoverOnly");
  const copy: Record<Mode, string> = {
    hoverOnly: "The description appears only on pointer hover, so keyboard and touch users miss it.",
    labelReplacement: "Mystery icons depend on tooltip text as their only action name.",
    interactiveContent: "The tooltip contains controls, but focus stays on the trigger and cannot enter them.",
    requiredInfo: "Required filing rules disappear as soon as the user tabs to the field that needs them.",
    disabledTarget: "The disabled native button cannot receive keyboard focus, so its tooltip is unreachable.",
    clipping: "The tooltip clips under the toolbar edge and covers nearby controls."
  };

  return (
    <div className={`quality-example tooltip-bad-ux is-${mode}`}>
      <div className="tooltip-workspace bad">
        <div className="tooltip-toolbar bad" aria-label="Broken toolbar">
          <button type="button">{mode === "labelReplacement" ? "?" : "Archive"}</button>
          <button type="button" disabled={mode === "disabledTarget"}>{mode === "disabledTarget" ? "Export" : "Share"}</button>
          <button type="button">{mode === "labelReplacement" ? "?" : "Copy"}</button>
        </div>
        <div className={`tooltip-bubble bad ${mode === "clipping" ? "clipped" : ""} ${mode === "interactiveContent" || mode === "requiredInfo" ? "wide" : ""}`} role="tooltip">
          <strong>{mode === "requiredInfo" ? "Filing rules" : mode === "disabledTarget" ? "Export unavailable" : "Tooltip"}</strong>
          <p>{copy[mode]}</p>
          {mode === "interactiveContent" && (
            <div className="tooltip-bad-actions">
              <button type="button">Undo</button>
              <a href="#tooltip-bad-link" onClick={(event) => event.preventDefault()}>Learn more</a>
            </div>
          )}
          {mode === "requiredInfo" && <input aria-label="Required code" value="FIN-2026" readOnly />}
        </div>
      </div>
      <div className="demo-row tooltip-controls">
        <button type="button" className={mode === "hoverOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hoverOnly")}>Hover only</button>
        <button type="button" className={mode === "labelReplacement" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("labelReplacement")}>Label replacement</button>
        <button type="button" className={mode === "interactiveContent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("interactiveContent")}>Interactive content</button>
        <button type="button" className={mode === "requiredInfo" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("requiredInfo")}>Required info</button>
        <button type="button" className={mode === "disabledTarget" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("disabledTarget")}>Disabled target</button>
        <button type="button" className={mode === "clipping" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("clipping")}>Clipping</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function HoverCardGoodUx({ meta }: { meta: PatternMeta }) {
  type Target = "person" | "file";
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<Target>("person");
  const [insideCard, setInsideCard] = useState(false);
  const [status, setStatus] = useState("Focus or hover @Maya Chen to preview the referenced object.");
  const personRef = useRef<HTMLButtonElement | null>(null);
  const fileRef = useRef<HTMLButtonElement | null>(null);
  const routeRef = useRef<HTMLButtonElement | null>(null);
  const suppressNextFocusOpenRef = useRef(false);
  const currentRef = target === "person" ? personRef : fileRef;
  const title = target === "person" ? "Maya Chen" : "Forecast.xlsx";
  const summary = target === "person"
    ? "Design systems lead - local time 09:45 - active in Forecast workspace."
    : "Owner Finance team - modified 18 min ago - sync complete.";
  const recent = target === "person" ? "Approved Q3 forecast" : "Updated revenue assumptions";
  const route = target === "person" ? "View profile" : "Open file";

  const openCard = (next: Target, reason: string) => {
    setTarget(next);
    setOpen(true);
    setInsideCard(false);
    setStatus(`${reason}; hover card previews ${next === "person" ? "@Maya Chen" : "Forecast.xlsx"}.`);
  };

  const closeCard = (reason: string) => {
    setOpen(false);
    setInsideCard(false);
    setStatus(`${reason}; focus returned to ${target === "person" ? "@Maya Chen" : "Forecast.xlsx"}.`);
    suppressNextFocusOpenRef.current = true;
    window.setTimeout(() => currentRef.current?.focus(), 0);
  };

  const openFromFocus = (next: Target) => {
    if (suppressNextFocusOpenRef.current) {
      suppressNextFocusOpenRef.current = false;
      return;
    }
    openCard(next, "Keyboard focus opened after a short delay");
  };

  const moveIntoCard = () => {
    if (!open) {
      setStatus("Open a hover card before moving into it.");
      return;
    }
    setInsideCard(true);
    setStatus(`Pointer moved into the ${title} card; close delay keeps the preview persistent.`);
    window.setTimeout(() => routeRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCard("Dismissed with Escape");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, target]);

  return (
    <div className="quality-example hover-card-demo">
      <div className="hover-card-document">
        <p>
          Reviewed by
          <button
            ref={personRef}
            type="button"
            className={target === "person" && open ? "hover-card-trigger is-active" : "hover-card-trigger"}
            aria-expanded={open && target === "person"}
            onFocus={() => openFromFocus("person")}
            onMouseEnter={() => openCard("person", "Pointer hover opened after a short delay")}
          >
            {meta.field}
          </button>
          and attached
          <button
            ref={fileRef}
            type="button"
            className={target === "file" && open ? "hover-card-trigger is-active" : "hover-card-trigger"}
            aria-expanded={open && target === "file"}
            onFocus={() => openFromFocus("file")}
            onMouseEnter={() => openCard("file", "Pointer hover opened after a short delay")}
          >
            Forecast.xlsx
          </button>
          to the planning note.
        </p>
        {open && (
          <section
            className={insideCard ? "hover-card-panel live is-inside" : "hover-card-panel live"}
            aria-labelledby="hover-card-live-title"
            onMouseEnter={moveIntoCard}
          >
            <div className="hover-card-avatar" aria-hidden="true">{target === "person" ? "MC" : "XL"}</div>
            <div>
              <h3 id="hover-card-live-title">{title}</h3>
              <p>{summary}</p>
            </div>
            <div className="hover-card-meta-grid">
              <span><strong>Recent</strong> {recent}</span>
              <span><strong>Status</strong> {target === "person" ? "Available" : "Synced"}</span>
            </div>
            <button ref={routeRef} type="button" className="demo-button small primary" onClick={() => closeCard(`${route} selected`)}>
              {route}
            </button>
          </section>
        )}
      </div>
      <div className="demo-row hover-card-controls">
        <button type="button" className="demo-button small" onClick={() => openCard("person", "Pointer hover opened after a short delay")}>Hover Maya</button>
        <button type="button" className="demo-button small" onClick={() => openCard("person", "Keyboard focus opened after a short delay")}>Focus Maya</button>
        <button type="button" className="demo-button small" onClick={moveIntoCard}>Move into card</button>
        <button type="button" className="demo-button small" onClick={() => openCard("file", "File reference focused")}>File preview</button>
        <button type="button" className="demo-button small" onClick={() => closeCard("Dismissed with Escape")}>Escape</button>
        <button type="button" className="demo-button small primary" onClick={() => open ? closeCard(`${route} selected`) : setStatus("Open a hover card before following its full-object route.")}>Open route</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function HoverCardBadUx() {
  type Mode = "hoverOnly" | "pointerGap" | "staleObject" | "requiredInfo" | "interactiveTrap" | "focusLoss";
  const [mode, setMode] = useState<Mode>("hoverOnly");
  const copy: Record<Mode, string> = {
    hoverOnly: "The profile preview appears only on mouse hover, with no keyboard or touch route.",
    pointerGap: "The card closes while the pointer crosses the gap from mention to preview.",
    staleObject: "The card still shows Maya Chen after the row changed to Priya Shah.",
    requiredInfo: "Eligibility rules needed to approve the note are hidden in the transient card.",
    interactiveTrap: "The hover card contains edit fields and destructive buttons but has no stable focus model.",
    focusLoss: "Escape dismisses the card and drops focus at the page header instead of the mention."
  };

  return (
    <div className={`quality-example hover-card-bad-ux is-${mode}`}>
      <div className="hover-card-document bad">
        <p>
          Reviewed by
          <button type="button" className="hover-card-trigger">{mode === "staleObject" ? "@Priya Shah" : "@Maya Chen"}</button>
          <span>in Forecast workspace.</span>
        </p>
        <div className={`hover-card-panel bad ${mode === "pointerGap" ? "is-gap" : ""}`}>
          <strong>{mode === "staleObject" ? "Maya Chen" : mode === "requiredInfo" ? "Approval rules" : "Profile"}</strong>
          <p>{copy[mode]}</p>
          {mode === "interactiveTrap" && <input aria-label="Edit role inside hover card" value="Approver" readOnly />}
          {mode === "interactiveTrap" && <button type="button" className="danger">Remove approver</button>}
          {mode === "requiredInfo" && <span className="hover-card-required">Must verify budget owner before approval.</span>}
        </div>
      </div>
      <div className="demo-row hover-card-controls">
        <button type="button" className={mode === "hoverOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hoverOnly")}>Hover only</button>
        <button type="button" className={mode === "pointerGap" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("pointerGap")}>Pointer gap</button>
        <button type="button" className={mode === "staleObject" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleObject")}>Stale object</button>
        <button type="button" className={mode === "requiredInfo" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("requiredInfo")}>Required info</button>
        <button type="button" className={mode === "interactiveTrap" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("interactiveTrap")}>Interactive trap</button>
        <button type="button" className={mode === "focusLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("focusLoss")}>Focus loss</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function ContextMenuGoodUx({ meta }: { meta: PatternMeta }) {
  type FileKey = "forecast" | "budget";
  type MenuSource = "pointer" | "keyboard";
  type MenuItem = "open" | "rename" | "export" | "delete";
  const files: Record<FileKey, { name: string; status: string; exportReady: boolean }> = {
    forecast: { name: "Forecast.xlsx", status: "Syncing", exportReady: false },
    budget: { name: "Budget.csv", status: "Ready", exportReady: true }
  };
  const itemOrder: MenuItem[] = ["open", "rename", "export", "delete"];
  const [selected, setSelected] = useState<FileKey>("forecast");
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<MenuSource>("pointer");
  const [activeItem, setActiveItem] = useState<MenuItem>("open");
  const [reviewDelete, setReviewDelete] = useState(false);
  const [status, setStatus] = useState("Invoke the context menu on Forecast.xlsx.");
  const rowRefs = useRef<Record<FileKey, HTMLButtonElement | null>>({ forecast: null, budget: null });
  const menuRef = useRef<HTMLDivElement | null>(null);
  const selectedFile = files[selected];

  const openMenu = (file: FileKey, nextSource: MenuSource) => {
    setSelected(file);
    setSource(nextSource);
    setOpen(true);
    setReviewDelete(false);
    setActiveItem("open");
    setStatus(`${nextSource === "pointer" ? "Right click" : "Shift+F10"} opened commands for ${files[file].name}; target remains selected.`);
    window.setTimeout(() => menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus(), 0);
  };

  const closeMenu = (message: string) => {
    setOpen(false);
    setReviewDelete(false);
    setStatus(`${message}; focus returned to ${selectedFile.name}.`);
    window.setTimeout(() => rowRefs.current[selected]?.focus(), 0);
  };

  const moveActive = (direction: 1 | -1) => {
    if (!open) {
      setStatus("Open the context menu before moving through commands.");
      return;
    }
    const current = itemOrder.indexOf(activeItem);
    const next = itemOrder[(current + direction + itemOrder.length) % itemOrder.length];
    setActiveItem(next);
    setStatus(`Active command moved to ${next === "open" ? "Open" : next === "rename" ? "Rename" : next === "export" ? "Export" : "Delete"} for ${selectedFile.name}.`);
  };

  const activate = (item: MenuItem) => {
    setActiveItem(item);
    if (item === "export" && !selectedFile.exportReady) {
      setStatus(`Export unavailable for ${selectedFile.name}: wait until sync completes.`);
      return;
    }
    if (item === "delete") {
      setReviewDelete(true);
      setStatus(`Delete selected for ${selectedFile.name}; review is shown before commitment.`);
      return;
    }
    closeMenu(`${item === "open" ? "Opened" : item === "rename" ? "Rename started for" : "Export started for"} ${selectedFile.name}`);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu("Escape dismissed the context menu");
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(1);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeItem, open, selected]);

  return (
    <div className={`quality-example context-menu-demo is-${source}`}>
      <div className="context-menu-workspace">
        <div className="context-menu-file-list" aria-label={meta.subject}>
          {(Object.keys(files) as FileKey[]).map((fileKey) => (
            <button
              key={fileKey}
              ref={(node) => { rowRefs.current[fileKey] = node; }}
              type="button"
              className={selected === fileKey ? "context-menu-file-row is-selected" : "context-menu-file-row"}
              aria-pressed={selected === fileKey}
              onClick={() => setSelected(fileKey)}
              onContextMenu={(event) => {
                event.preventDefault();
                openMenu(fileKey, "pointer");
              }}
            >
              <span>{files[fileKey].name}</span>
              <small>{files[fileKey].status}</small>
            </button>
          ))}
        </div>
        {open && (
          <div ref={menuRef} className={`context-menu-surface live is-${selected} is-${source}`} role="menu" aria-label={`Context menu for ${selectedFile.name}`}>
            <button type="button" role="menuitem" className={activeItem === "open" ? "is-active" : ""} onClick={() => activate("open")}>Open {selectedFile.name}</button>
            <button type="button" role="menuitem" className={activeItem === "rename" ? "is-active" : ""} onClick={() => activate("rename")}>Rename</button>
            <button type="button" role="menuitem" aria-disabled={!selectedFile.exportReady} className={activeItem === "export" ? "is-active" : ""} onClick={() => activate("export")}>
              {selectedFile.exportReady ? "Export CSV" : "Export unavailable - syncing"}
            </button>
            <span className="context-menu-separator" aria-hidden="true"></span>
            <button type="button" role="menuitem" className={activeItem === "delete" ? "danger is-active" : "danger"} onClick={() => activate("delete")}>Delete file...</button>
            {reviewDelete && (
              <div className="context-menu-review" role="alert">
                <strong>Delete {selectedFile.name}?</strong>
                <span>Review opens outside the menu before the destructive command commits.</span>
                <button type="button" className="demo-button small" onClick={() => closeMenu(`Kept ${selectedFile.name}`)}>Keep file</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="demo-row context-menu-controls">
        <button type="button" className="demo-button small" onClick={() => openMenu("forecast", "pointer")}>Right click Forecast</button>
        <button type="button" className="demo-button small" onClick={() => openMenu(selected, "keyboard")}>Shift+F10</button>
        <button type="button" className="demo-button small" onClick={() => moveActive(1)}>Arrow down</button>
        <button type="button" className="demo-button small" onClick={() => activate("export")}>Try export</button>
        <button type="button" className="demo-button small" onClick={() => activate("delete")}>Delete review</button>
        <button type="button" className="demo-button small" onClick={() => open ? closeMenu("Escape dismissed the context menu") : setStatus("Open the context menu before pressing Escape.")}>Escape</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function ContextMenuBadUx() {
  type Mode = "staleTarget" | "keyboardCorner" | "hiddenPrimary" | "mixedContent" | "mismatch" | "focusLoss";
  const [mode, setMode] = useState<Mode>("staleTarget");
  const copy: Record<Mode, string> = {
    staleTarget: "Right click on Forecast.xlsx opens commands for Budget.csv, the previously selected row.",
    keyboardCorner: "Shift+F10 opens the menu in the viewport corner instead of beside the focused file.",
    hiddenPrimary: "The only way to submit or save is hidden behind a secondary context-menu gesture.",
    mixedContent: "The menu contains a filter input, preview card, and commands in one broken surface.",
    mismatch: "Right click and keyboard invocation expose different commands for the same file.",
    focusLoss: "Escape closes the menu and focus jumps to the page header instead of returning to the file."
  };

  return (
    <div className={`quality-example context-menu-bad-ux is-${mode}`}>
      <div className="context-menu-workspace bad">
        <div className="context-menu-file-list bad">
          <button type="button" className={mode === "staleTarget" ? "context-menu-file-row is-selected" : "context-menu-file-row"}>
            <span>Forecast.xlsx</span>
            <small>{mode === "focusLoss" ? "Focus lost after close" : "Invoked target"}</small>
          </button>
          <button type="button" className={mode === "staleTarget" ? "context-menu-file-row" : "context-menu-file-row is-selected"}>
            <span>Budget.csv</span>
            <small>{mode === "staleTarget" ? "Stale command scope" : "Selected"}</small>
          </button>
        </div>
        <div className={`context-menu-surface bad ${mode === "keyboardCorner" ? "corner" : ""}`}>
          <strong>{mode === "hiddenPrimary" ? "Primary actions" : mode === "mismatch" ? "Keyboard-only actions" : "Actions"}</strong>
          <p>{copy[mode]}</p>
          {mode === "mixedContent" && <input aria-label="Filter commands" value="delete" readOnly />}
          <button type="button">{mode === "staleTarget" ? "Delete Budget.csv" : mode === "hiddenPrimary" ? "Submit project" : "Open"}</button>
          <button type="button" className="danger">Delete</button>
        </div>
      </div>
      <div className="demo-row context-menu-controls">
        <button type="button" className={mode === "staleTarget" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("staleTarget")}>Stale target</button>
        <button type="button" className={mode === "keyboardCorner" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("keyboardCorner")}>Keyboard corner</button>
        <button type="button" className={mode === "hiddenPrimary" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenPrimary")}>Hidden primary</button>
        <button type="button" className={mode === "mixedContent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedContent")}>Mixed content</button>
        <button type="button" className={mode === "mismatch" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mismatch")}>Pointer mismatch</button>
        <button type="button" className={mode === "focusLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("focusLoss")}>Focus loss</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

type ModalForNonblockingMode =
  | "inlineNote"
  | "popoverHelp"
  | "drawerDetail"
  | "bannerStatus"
  | "sidePreview"
  | "backgroundUsable"
  | "dismissNote"
  | "keyboardFlow"
  | "mobileInline"
  | "highZoom"
  | "optionalDisclosure"
  | "toastSafe";

type ModalForNonblockingBadMode =
  | "infoModal"
  | "helpModal"
  | "statusModal"
  | "previewModal"
  | "okTrap"
  | "repeatedModal"
  | "newsletterModal"
  | "mobileBlock";

const modalForNonblockingGoodModes: Array<{ mode: ModalForNonblockingMode; label: string }> = [
  { mode: "inlineNote", label: "Inline note" },
  { mode: "popoverHelp", label: "Popover help" },
  { mode: "drawerDetail", label: "Drawer detail" },
  { mode: "bannerStatus", label: "Banner status" },
  { mode: "sidePreview", label: "Side preview" },
  { mode: "backgroundUsable", label: "Background usable" },
  { mode: "dismissNote", label: "Dismiss note" },
  { mode: "keyboardFlow", label: "Keyboard flow" },
  { mode: "mobileInline", label: "Mobile inline" },
  { mode: "highZoom", label: "High zoom" },
  { mode: "optionalDisclosure", label: "Optional disclosure" },
  { mode: "toastSafe", label: "Toast safe" }
];

const modalForNonblockingBadModes: Array<{ mode: ModalForNonblockingBadMode; label: string }> = [
  { mode: "infoModal", label: "Info modal" },
  { mode: "helpModal", label: "Help modal" },
  { mode: "statusModal", label: "Status modal" },
  { mode: "previewModal", label: "Preview modal" },
  { mode: "okTrap", label: "OK trap" },
  { mode: "repeatedModal", label: "Repeated modal" },
  { mode: "newsletterModal", label: "Newsletter modal" },
  { mode: "mobileBlock", label: "Mobile block" }
];

function ModalForNonblockingContentGoodUi() {
  return (
    <div className="quality-example nonblocking-modal-static" aria-label="Nonblocking information preview">
      <ModalForNonblockingContentPanel mode="sidePreview" idSuffix="good-ui" />
      <p className="demo-status">Information sits inline, in a popover, drawer, banner, or side preview while the review workspace remains usable.</p>
    </div>
  );
}

function ModalForNonblockingContentBadUi() {
  return (
    <div className="bad-ui-sample nonblocking-modal-static bad" aria-label="Broken informational modal preview">
      <ModalForNonblockingContentBadPanel mode="infoModal" idSuffix="bad-ui" />
      <p className="demo-status">A read-only update blocks the page and asks for OK even though no decision is required.</p>
    </div>
  );
}

function ModalForNonblockingContentPanel({ mode, idSuffix }: { mode: ModalForNonblockingMode; idSuffix: string }) {
  const showBanner = mode === "bannerStatus" || mode === "backgroundUsable";
  const showInline = mode === "inlineNote" || mode === "mobileInline" || mode === "highZoom" || mode === "keyboardFlow" || mode === "dismissNote";
  const showPopover = mode === "popoverHelp";
  const showDrawer = mode === "drawerDetail";
  const showPreview = mode === "sidePreview";
  const showDetails = mode === "optionalDisclosure";
  const showToast = mode === "toastSafe";
  const inlineText = mode === "dismissNote"
    ? "Dismissed note: the case still shows a compact history link, so the information is recoverable."
    : mode === "keyboardFlow"
      ? "Keyboard flow: Escape closes the local help and focus returns to What changed, not to a trapped modal."
      : mode === "mobileInline"
        ? "Mobile inline: the update wraps under the selected case instead of covering the whole viewport."
        : mode === "highZoom"
          ? "High zoom: long nonblocking guidance wraps in flow without hiding filters, fields, or actions."
          : "Inline note: a policy refresh changed the review reason; continue scanning cases while reading it.";

  return (
    <div className={`nonblocking-modal-shell is-${mode}`}>
      {showBanner && (
        <div className="nonblocking-modal-banner" role="status">
          Banner status: 3 cases refreshed in the background. Filters and review actions stay available.
        </div>
      )}
      <div className="nonblocking-modal-topbar">
        <div>
          <strong>Case review workspace</strong>
          <span>Nonblocking case update stays close to the work.</span>
        </div>
        <button type="button" className="demo-button small">Continue review</button>
      </div>
      <div className="nonblocking-modal-main">
        <div className="nonblocking-modal-list" aria-label="Cases">
          <button type="button" className="nonblocking-modal-case is-selected">
            <span>
              <strong>Case C-1042</strong>
              <small>Selected - payout review</small>
            </span>
            <em>Review</em>
          </button>
          <button type="button" className="nonblocking-modal-case">
            <span>
              <strong>Case C-1043</strong>
              <small>Address exception</small>
            </span>
            <em>Open</em>
          </button>
          {showInline && <div className="nonblocking-modal-note">{inlineText}</div>}
          {showDetails && (
            <details className="nonblocking-modal-details" open>
              <summary>Optional disclosure: why this changed</summary>
              <p>The update is explanatory only. Reviewers can keep the queue, filters, and selected row in view.</p>
            </details>
          )}
          <div className="nonblocking-modal-actions">
            <button type="button" className="demo-button small primary">Approve case</button>
            <button type="button" className="demo-button small">Request evidence</button>
            <button type="button" className="demo-button small">Change filter</button>
          </div>
        </div>
        <div className="nonblocking-modal-side" aria-label="Selected case detail">
          <div className="nonblocking-modal-field">
            <span>Status</span>
            <strong>Ready for review</strong>
          </div>
          <button
            type="button"
            className="demo-button small"
            aria-expanded={showPopover}
            aria-controls={`nonblocking-help-${idSuffix}`}
          >
            What changed?
          </button>
          {showPopover && (
            <section id={`nonblocking-help-${idSuffix}`} className="nonblocking-modal-popover" aria-label="Popover help">
              <strong>Popover help</strong>
              <p>Anchored help explains the score update. The case list, fields, and actions remain available behind it.</p>
            </section>
          )}
          {(showDrawer || showPreview) && (
            <section className="nonblocking-modal-drawer" aria-label={showDrawer ? "Drawer detail" : "Side preview"}>
              <div>
                <strong>{showDrawer ? "Drawer detail" : "Side preview"}</strong>
                <button type="button" aria-label="Close nonblocking detail">x</button>
              </div>
              <p>{showDrawer ? "Supplemental timeline opens beside the queue instead of blocking it." : "Document preview sits beside the selected case for side-by-side review."}</p>
            </section>
          )}
          {showToast && (
            <div className="nonblocking-modal-toast" role="status">
              Toast safe: saved. Details remain in activity history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalForNonblockingContentBadPanel({ mode, idSuffix }: { mode: ModalForNonblockingBadMode; idSuffix: string }) {
  const copy: Record<ModalForNonblockingBadMode, { title: string; body: string; button: string }> = {
    infoModal: {
      title: "Information",
      body: "The selected case changed. Press OK before reviewing anything else.",
      button: "OK"
    },
    helpModal: {
      title: "Help",
      body: "This explains the score field while hiding the score field behind a modal trap.",
      button: "Got it"
    },
    statusModal: {
      title: "Saved successfully",
      body: "A routine success message blocks filters, rows, and the next review action.",
      button: "OK"
    },
    previewModal: {
      title: "Preview",
      body: "A read-only preview covers the neighboring cases needed for comparison.",
      button: "Close"
    },
    okTrap: {
      title: "Notice",
      body: "The only control is OK, so users must acknowledge content that required no choice.",
      button: "OK"
    },
    repeatedModal: {
      title: "Update again",
      body: "The same release note appears every visit instead of moving to notification history.",
      button: "Dismiss"
    },
    newsletterModal: {
      title: "Join our newsletter",
      body: "A promotion interrupts the case workflow before the primary task is complete.",
      button: "Maybe later"
    },
    mobileBlock: {
      title: "Tip",
      body: "On mobile this full-screen information dialog hides the field it tries to explain.",
      button: "Close"
    }
  };
  const current = copy[mode];

  return (
    <div className={`nonblocking-modal-shell bad is-${mode}`}>
      <div className="nonblocking-modal-topbar" aria-hidden="true">
        <div>
          <strong>Case review workspace</strong>
          <span>Blocked by nonblocking modal content.</span>
        </div>
        <button type="button" className="demo-button small" tabIndex={-1}>Continue review</button>
      </div>
      <div className="nonblocking-modal-main" aria-hidden="true">
        <div className="nonblocking-modal-list">
          <div className="nonblocking-modal-case is-selected">
            <span>
              <strong>Case C-1042</strong>
              <small>Selected row hidden behind interruption</small>
            </span>
            <em>Blocked</em>
          </div>
          <div className="nonblocking-modal-note">The background has the context needed to understand this message.</div>
        </div>
        <div className="nonblocking-modal-side">
          <div className="nonblocking-modal-field">
            <span>Status</span>
            <strong>Unavailable until OK</strong>
          </div>
        </div>
      </div>
      <div className="nonblocking-modal-backdrop" aria-hidden="true"></div>
      <section
        className="nonblocking-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`nonblocking-bad-title-${idSuffix}`}
      >
        <h3 id={`nonblocking-bad-title-${idSuffix}`}>{current.title}</h3>
        <p>{current.body}</p>
        <button type="button" className="demo-button small primary">{current.button}</button>
      </section>
    </div>
  );
}

function ModalForNonblockingContentGoodUx() {
  const [mode, setMode] = useState<ModalForNonblockingMode>("inlineNote");
  const messages: Record<ModalForNonblockingMode, string> = {
    inlineNote: "Inline note keeps the case update visible without blocking the queue.",
    popoverHelp: "Popover help opens near What changed and can close with Escape.",
    drawerDetail: "Drawer detail preserves the selected row and neighboring cases for comparison.",
    bannerStatus: "Banner status announces a workspace update while actions remain available.",
    sidePreview: "Side preview supports side-by-side inspection without modal interruption.",
    backgroundUsable: "Background usable state proves filters, rows, and actions remain reachable.",
    dismissNote: "Dismiss note leaves a recoverable history route instead of a lost modal.",
    keyboardFlow: "Keyboard flow returns focus locally instead of trapping users in read-only content.",
    mobileInline: "Mobile inline keeps the explanation near the affected case in the same task flow.",
    highZoom: "High zoom wraps the content without covering the control it explains.",
    optionalDisclosure: "Optional disclosure stays in page flow after users intentionally open it.",
    toastSafe: "Toast safe gives routine success feedback with a durable activity-history path."
  };

  return (
    <div className="quality-example nonblocking-modal-demo">
      <ModalForNonblockingContentPanel mode={mode} idSuffix="good-ux" />
      <div className="demo-row nonblocking-modal-controls">
        {modalForNonblockingGoodModes.map((item) => (
          <button
            key={item.mode}
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{messages[mode]}</p>
    </div>
  );
}

function ModalForNonblockingContentBadUx() {
  const [mode, setMode] = useState<ModalForNonblockingBadMode>("infoModal");
  const messages: Record<ModalForNonblockingBadMode, string> = {
    infoModal: "Info modal blocks routine read-only content that could stay inline.",
    helpModal: "Help modal hides the field and context that the help explains.",
    statusModal: "Status modal forces OK for success feedback that should be a banner or toast.",
    previewModal: "Preview modal prevents side-by-side comparison with the list.",
    okTrap: "OK trap trains users to dismiss messages without reading them.",
    repeatedModal: "Repeated modal should move to notification history or release notes.",
    newsletterModal: "Newsletter modal interrupts the primary task for nonessential content.",
    mobileBlock: "Mobile block consumes the viewport for an informational tip."
  };

  return (
    <div className={`quality-example nonblocking-modal-bad-ux is-${mode}`}>
      <ModalForNonblockingContentBadPanel mode={mode} idSuffix="bad-ux" />
      <div className="demo-row nonblocking-modal-controls">
        {modalForNonblockingBadModes.map((item) => (
          <button
            key={item.mode}
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{messages[mode]}</p>
    </div>
  );
}

type ConfirmationFatigueGoodMode =
  | "inventory"
  | "undoAlternative"
  | "meaningfulConfirm"
  | "suppressionRule"
  | "escalation"
  | "specificCopy"
  | "telemetry"
  | "keyboardBurden";

type ConfirmationFatigueBadMode =
  | "spamPrompts"
  | "genericCopy"
  | "doubleProtection"
  | "falseSafety"
  | "postCommit"
  | "severeLost"
  | "promptChain"
  | "fastDismiss";

const confirmationFatigueGoodModes: Array<{ mode: ConfirmationFatigueGoodMode; label: string }> = [
  { mode: "inventory", label: "Prompt inventory" },
  { mode: "undoAlternative", label: "Undo alternative" },
  { mode: "meaningfulConfirm", label: "Meaningful confirmation" },
  { mode: "suppressionRule", label: "Suppression rule" },
  { mode: "escalation", label: "Escalation" },
  { mode: "specificCopy", label: "Specific copy" },
  { mode: "telemetry", label: "Telemetry" },
  { mode: "keyboardBurden", label: "Keyboard burden" }
];

const confirmationFatigueBadModes: Array<{ mode: ConfirmationFatigueBadMode; label: string }> = [
  { mode: "spamPrompts", label: "Spam prompts" },
  { mode: "genericCopy", label: "Generic copy" },
  { mode: "doubleProtection", label: "Double protection" },
  { mode: "falseSafety", label: "False safety" },
  { mode: "postCommit", label: "Post-commit prompt" },
  { mode: "severeLost", label: "Severe prompt lost" },
  { mode: "promptChain", label: "Prompt chain" },
  { mode: "fastDismiss", label: "Fast dismiss" }
];

const confirmationFatigueGoodCopy: Record<ConfirmationFatigueGoodMode, string> = {
  inventory: "Prompt inventory classifies each action by frequency, reversibility, consequence, and recovery before deciding whether confirmation is justified.",
  undoAlternative: "Undo alternative lets the routine archive complete with a named recovery control instead of another modal.",
  meaningfulConfirm: "Meaningful confirmation is rare, specific, and names the workspace, loss, safe action, and final destructive action.",
  suppressionRule: "Suppression rule removes prompts from repeated low-risk actions while preserving visible status and recovery.",
  escalation: "Escalation sends permanent workspace deletion to destructive review and typed confirmation only when the risk warrants it.",
  specificCopy: "Specific copy separates Archive message, Delete workspace, and Send external invite so users can tell which consequence matters.",
  telemetry: "Telemetry watches fast OK clicks, prompt chains, cancellation, undo use, and support incidents instead of assuming prompts are read.",
  keyboardBurden: "Keyboard burden check keeps routine actions in the working surface and reserves focus traps for genuine high-risk decisions."
};

const confirmationFatigueBadCopy: Record<ConfirmationFatigueBadMode, string> = {
  spamPrompts: "Spam prompts block Save, Close, Filter, Archive, and Dismiss even though the actions are routine or reversible.",
  genericCopy: "Generic copy uses the same Are you sure and OK labels for harmless archive and permanent workspace deletion.",
  doubleProtection: "Double protection stacks warning, confirmation, typed phrase, and undo on one low-risk action.",
  falseSafety: "False safety keeps a prompt even though the action already committed and the UI cannot stop or restore it.",
  postCommit: "Post-commit prompt appears after the destructive request has already started, so it cannot prevent the harm.",
  severeLost: "Severe prompt lost treats account closure like every routine OK prompt, so users dismiss it automatically.",
  promptChain: "Prompt chain forces several confirmations for one command without adding new consequence information.",
  fastDismiss: "Fast dismiss telemetry shows users clicking OK in under a second, but the team still counts the prompt as protection."
};

function ConfirmationFatigueGoodUi() {
  return (
    <div className="quality-example confirmation-fatigue-static" aria-label="Prompt policy preview">
      <div className="confirmation-fatigue-policy">
        <div className="confirmation-fatigue-policy-header">
          <strong>Prompt policy</strong>
          <span>Confirm only when consequence can change the decision.</span>
        </div>
        <div className="confirmation-fatigue-action-grid">
          <div>
            <span>Archive message</span>
            <strong>Feedback + undo</strong>
            <small>Frequent, reversible, local.</small>
          </div>
          <div>
            <span>Filter inbox</span>
            <strong>No modal</strong>
            <small>Low risk, instant reset.</small>
          </div>
          <div>
            <span>Delete workspace</span>
            <strong>Destructive review</strong>
            <small>Rare, broad, irreversible.</small>
          </div>
        </div>
        <div className="confirmation-fatigue-undo" role="status">
          Message archived. <button type="button">Undo archive</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmationFatigueBadUi() {
  return (
    <div className="bad-ui-sample confirmation-fatigue-static bad" aria-label="Confirmation spam preview">
      <div className="confirmation-fatigue-stack">
        {["Save changes", "Close panel", "Archive message"].map((action) => (
          <div className="confirmation-fatigue-modal bad" key={action}>
            <strong>Are you sure?</strong>
            <span>{action}</span>
            <button type="button">OK</button>
          </div>
        ))}
      </div>
      <p className="demo-status">The same modal protects routine actions and trains users to dismiss the real risk prompt.</p>
    </div>
  );
}

function ConfirmationFatigueGoodPanel({ mode }: { mode: ConfirmationFatigueGoodMode }) {
  const showConfirm = mode === "meaningfulConfirm" || mode === "escalation" || mode === "specificCopy";
  return (
    <section className={`confirmation-fatigue-panel is-${mode}`} aria-label="Confirmation fatigue corrected behavior">
      <div className="confirmation-fatigue-policy-header">
        <strong>{mode === "undoAlternative" ? "Routine action recovered after commit" : mode === "meaningfulConfirm" ? "One rare confirmation" : mode === "escalation" ? "Risk-based escalation" : "Confirmation policy"}</strong>
        <span>{confirmationFatigueGoodCopy[mode]}</span>
      </div>
      {mode === "inventory" || mode === "suppressionRule" || mode === "telemetry" || mode === "keyboardBurden" ? (
        <div className="confirmation-fatigue-action-grid">
          <div>
            <span>Save draft</span>
            <strong>No prompt</strong>
            <small>High frequency, local, recoverable.</small>
          </div>
          <div>
            <span>Archive 1 message</span>
            <strong>Undo</strong>
            <small>Prior state captured for recovery.</small>
          </div>
          <div>
            <span>Delete workspace</span>
            <strong>Confirm</strong>
            <small>Broad scope, no faithful undo.</small>
          </div>
          <div>
            <span>Prompt health</span>
            <strong>{mode === "telemetry" ? "12% fast OK" : mode === "keyboardBurden" ? "4 fewer focus traps" : "Suppressed"}</strong>
            <small>{mode === "telemetry" ? "Measured with undo use and incidents." : "Routine confirmations removed."}</small>
          </div>
        </div>
      ) : null}
      {mode === "undoAlternative" ? (
        <div className="confirmation-fatigue-workspace">
          <div className="confirmation-fatigue-message-row">
            <span>message-418 archived</span>
            <strong>Recoverable for 30 seconds</strong>
          </div>
          <div className="confirmation-fatigue-undo" role="status">
            Message archived. <button type="button">Undo archive</button>
          </div>
        </div>
      ) : null}
      {showConfirm ? (
        <div className="confirmation-fatigue-review" role="alertdialog" aria-modal="true" aria-labelledby={`confirmation-fatigue-${mode}-title`}>
          <h3 id={`confirmation-fatigue-${mode}-title`}>{mode === "specificCopy" ? "Delete workspace Atlas Ops?" : "Delete workspace?"}</h3>
          <p>{mode === "escalation" ? "This broad irreversible action requires destructive review because undo cannot restore members, billing, or audit links." : "This permanently removes 18 members, 42 projects, billing history links, and shared reports."}</p>
          <div className="confirmation-fatigue-review-actions">
            <button type="button" className="demo-button">Keep workspace</button>
            <button type="button" className="demo-button danger" disabled>Delete Atlas Ops workspace</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ConfirmationFatigueGoodUx() {
  const [mode, setMode] = useState<ConfirmationFatigueGoodMode>("inventory");
  return (
    <div className="quality-example confirmation-fatigue-demo">
      <ConfirmationFatigueGoodPanel mode={mode} />
      <div className="demo-row confirmation-fatigue-controls">
        {confirmationFatigueGoodModes.map((item) => (
          <button
            key={item.mode}
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{confirmationFatigueGoodCopy[mode]}</p>
    </div>
  );
}

function ConfirmationFatigueBadPanel({ mode }: { mode: ConfirmationFatigueBadMode }) {
  const labels: Record<ConfirmationFatigueBadMode, string[]> = {
    spamPrompts: ["Save", "Close", "Filter", "Archive"],
    genericCopy: ["Archive message", "Delete workspace"],
    doubleProtection: ["Warning", "Are you sure?", "Type DELETE", "Undo"],
    falseSafety: ["Already committed", "Cannot restore"],
    postCommit: ["Deleted first", "Asked later"],
    severeLost: ["Dismiss tip", "Hide banner", "Close account"],
    promptChain: ["Continue?", "Are you sure?", "Really continue?"],
    fastDismiss: ["0.6s OK", "0.8s OK", "0.5s OK"]
  };
  return (
    <section className={`confirmation-fatigue-bad-panel is-${mode}`} aria-label="Confirmation fatigue failure">
      <strong>{mode === "severeLost" ? "Real risk looks routine" : mode === "fastDismiss" ? "Unread prompt telemetry" : "Confirmation overload"}</strong>
      <div className="confirmation-fatigue-stack">
        {labels[mode].map((label) => (
          <div className="confirmation-fatigue-modal bad" key={label}>
            <span>{label}</span>
            <p>{mode === "genericCopy" || mode === "severeLost" ? "Are you sure?" : mode === "doubleProtection" ? "Extra safeguard with no new information." : "Click OK to continue."}</p>
            <button type="button">OK</button>
          </div>
        ))}
      </div>
      <div className="confirmation-fatigue-metrics">
        <div><span>Prompt value</span><strong>{mode === "fastDismiss" ? "Unproven" : "Low"}</strong></div>
        <div><span>Recovery</span><strong>{mode === "falseSafety" || mode === "postCommit" ? "None" : "Hidden"}</strong></div>
        <div><span>Attention</span><strong>{mode === "severeLost" ? "Trained away" : "Split"}</strong></div>
      </div>
    </section>
  );
}

function ConfirmationFatigueBadUx() {
  const [mode, setMode] = useState<ConfirmationFatigueBadMode>("spamPrompts");
  return (
    <div className={`quality-example confirmation-fatigue-bad-demo is-${mode}`}>
      <ConfirmationFatigueBadPanel mode={mode} />
      <div className="demo-row confirmation-fatigue-controls">
        {confirmationFatigueBadModes.map((item) => (
          <button
            key={item.mode}
            type="button"
            className={mode === item.mode ? "demo-button small primary" : "demo-button small"}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{confirmationFatigueBadCopy[mode]}</p>
    </div>
  );
}

function DialogGoodUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "menu-button") return <MenuButtonGoodUx meta={meta} />;
  if (patternId === "alert-dialog") return <AlertDialogGoodUx meta={meta} />;
  if (patternId === "drawer") return <DrawerGoodUx meta={meta} />;
  if (patternId === "drawer-with-no-close-or-return-path") return <DrawerNoCloseReturnGoodUx />;
  if (patternId === "details-panel") return <DetailsPanelGoodUx meta={meta} />;
  if (patternId === "preview-panel") return <PreviewPanelGoodUx meta={meta} />;
  if (patternId === "sheet") return <SheetGoodUx meta={meta} />;
  if (patternId === "bottom-sheet") return <BottomSheetGoodUx meta={meta} />;
  if (patternId === "popover") return <PopoverGoodUx meta={meta} />;
  if (patternId === "modal-for-nonblocking-content") return <ModalForNonblockingContentGoodUx />;
  if (patternId === "tooltip-only-required-information") return <TooltipOnlyRequiredInfoGoodUx />;
  if (patternId === "tooltip") return <TooltipGoodUx meta={meta} />;
  if (patternId === "hover-card") return <HoverCardGoodUx meta={meta} />;
  if (patternId === "context-menu") return <ContextMenuGoodUx meta={meta} />;
  if (patternId === "destructive-action-confirmation") return <DestructiveConfirmationGoodUx meta={meta} />;
  if (patternId === "typed-confirmation") return <TypedConfirmationGoodUx />;
  if (patternId === "confirmation-fatigue") return <ConfirmationFatigueGoodUx />;

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Art");
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState("Ready");
  const [backgroundAction, setBackgroundAction] = useState("Background ready");
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const isConfirm = patternId === "confirmation-dialog";

  const closeDialog = (message: string) => {
    setOpen(false);
    if (isConfirm) setTyped("");
    setStatus(`${message}; focus returned to opener`);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!open) return;
    const focusables = () => Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"
      ) ?? []
    );
    const firstFocusable = isConfirm
      ? focusables()[0]
      : dialogRef.current?.querySelector<HTMLInputElement>("input") ?? focusables()[0];
    firstFocusable?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog("Cancelled with Escape");
        return;
      }

      if (event.key === "Tab") {
        const available = focusables();
        if (available.length === 0) return;
        const first = available[0];
        const last = available[available.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isConfirm, open]);

  return (
    <div className="quality-example">
      {!isConfirm && (
        <div className="modal-background-controls" aria-hidden={open ? "true" : undefined}>
          <button
            type="button"
            className="demo-button small"
            disabled={open}
            onClick={() => setBackgroundAction("Background plan control changed")}
          >
            Change plan
          </button>
          <button
            type="button"
            className="demo-button small"
            disabled={open}
            onClick={() => setBackgroundAction("Background billing control changed")}
          >
            Billing
          </button>
        </div>
      )}
      <button
        ref={openerRef}
        type="button"
        className={isConfirm ? "demo-button small danger" : "demo-button small primary"}
        onClick={() => {
          if (isConfirm) setTyped("");
          setOpen(true);
        }}
      >
        {isConfirm ? "Delete archive" : "Open dialog"}
      </button>
      <p className="demo-status" aria-live="polite">{status}</p>
      {!isConfirm && <p className="demo-status modal-inert-note">{open ? "Background controls are unavailable while the modal is open." : backgroundAction}</p>}
      {open && (
        <div className="demo-backdrop is-open quality-backdrop">
          <div
            ref={dialogRef}
            className="demo-dialog compact"
            role={isConfirm ? "alertdialog" : "dialog"}
            aria-modal="true"
            aria-labelledby={`${patternId}-dialog-title`}
            aria-describedby={`${patternId}-dialog-desc`}
          >
            {!isConfirm && (
              <button type="button" className="modal-inline-close" aria-label="Close dialog" onClick={() => closeDialog("Closed")}>x</button>
            )}
            <h3 id={`${patternId}-dialog-title`}>{isConfirm ? `Delete ${meta.subject}?` : "Edit display name"}</h3>
            <p id={`${patternId}-dialog-desc`}>
              {isConfirm ? "This permanently removes 14 notes and shared links. This cannot be undone." : "Change the name shown to teammates, then return to account settings."}
            </p>
            {isConfirm ? (
              <label>
                <span>Type DELETE</span>
                <input value={typed} onChange={(event) => setTyped(event.target.value)} />
              </label>
            ) : (
              <label>
                <span>{meta.field}</span>
                <input value={name} onChange={(event) => setName(event.target.value)} />
              </label>
            )}
            <div className="demo-actions">
              <button
                type="button"
                className={isConfirm ? "demo-button danger" : "demo-button primary"}
                disabled={isConfirm && typed !== "DELETE"}
                onClick={() => {
                  closeDialog(isConfirm ? "Deleted archive after typed confirmation" : `Saved ${name}`);
                }}
              >
                {isConfirm ? "Delete archive" : "Save name"}
              </button>
              <button type="button" className="demo-button" onClick={() => closeDialog(isConfirm ? "Kept archive" : "Cancelled")}>{isConfirm ? "Keep archive" : "Cancel"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TypedConfirmationGoodUx() {
  type Target = "payments" | "billing";
  const targets = {
    payments: {
      label: "acme/payments-api",
      title: "Payments API repository",
      loss: "Issues, team permissions, Actions secrets, and private forks are affected."
    },
    billing: {
      label: "acme/billing-api",
      title: "Billing API repository",
      loss: "Deploy keys, branch rules, package links, and environments are affected."
    }
  } as const;
  const [target, setTarget] = useState<Target>("payments");
  const [typed, setTyped] = useState("");
  const [blocked, setBlocked] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [status, setStatus] = useState("Type the repository path to verify the target");
  const phrase = targets[target].label;
  const normalizedTyped = typed.trim();
  const exact = normalizedTyped === phrase;
  const canDelete = exact && !blocked && !deleted;

  const changeTarget = (next: Target) => {
    setTarget(next);
    setTyped("");
    setDeleted(false);
    setStatus(`Target changed to ${targets[next].label}; typed text cleared`);
  };

  const setExample = (value: string, message: string) => {
    setTyped(value);
    setStatus(message);
  };

  return (
    <div className="quality-example typed-confirm-demo">
      <div className="typed-target-switcher" role="group" aria-label="Repository target">
        <button type="button" className={target === "payments" ? "demo-button small primary" : "demo-button small"} onClick={() => changeTarget("payments")}>Payments repo</button>
        <button type="button" className={target === "billing" ? "demo-button small primary" : "demo-button small"} onClick={() => changeTarget("billing")}>Billing repo</button>
      </div>
      <div className="typed-confirm-modal">
        <h3>Delete repository {phrase}?</h3>
        <p>{targets[target].loss}</p>
        <div className="typed-required-phrase">
          <span>Required phrase</span>
          <strong>{phrase}</strong>
        </div>
        <label>
          <span>Type repository path</span>
          <input
            type="text"
            value={typed}
            autoComplete="off"
            onChange={(event) => {
              setTyped(event.target.value);
              setStatus(event.target.value.trim() === phrase ? "Exact repository path matched" : "Typed text does not match the current target");
            }}
            placeholder={phrase}
          />
        </label>
        <div className={exact ? "typed-confirm-status exact" : "typed-confirm-status mismatch"} role="status" aria-live="polite">
          {exact ? "Exact match. Final delete can enable after blockers clear." : typed ? `No match for ${phrase}.` : "No typed target yet."}
        </div>
        <div className={blocked ? "destructive-blocker is-blocked" : "destructive-blocker"}>
          <strong>{blocked ? "Dependency blocker" : "Dependency clear"}</strong>
          <span>{blocked ? "One protected branch rule must be removed before deletion." : "No branch rule blocks this repository deletion."}</span>
        </div>
        <div className="destructive-confirm-actions">
          <button type="button" className="demo-button" onClick={() => {
            setTyped("");
            setStatus("Kept repository; typed text cleared");
          }}>Keep repository</button>
          <button type="button" className="demo-button danger" disabled={!canDelete} onClick={() => {
            setDeleted(true);
            setStatus(`${phrase} deleted after exact typed confirmation`);
          }}>Delete {phrase}</button>
        </div>
      </div>
      <div className="demo-row typed-confirm-controls">
        <button type="button" className="demo-button small" onClick={() => setExample("wrong/path", "Wrong path entered; final action remains disabled")}>Wrong path</button>
        <button type="button" className="demo-button small" onClick={() => setExample(`${phrase}  `, "Pasted path with trailing spaces; trimmed match is accepted")}>Paste with spaces</button>
        <button type="button" className="demo-button small" onClick={() => setExample(phrase.toUpperCase(), "Wrong case entered; exact path is still required")}>Wrong case</button>
        <button type="button" className={blocked ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setBlocked(true);
          setStatus("Dependency blocker restored; exact text alone is not enough");
        }}>Blocker on</button>
        <button type="button" className={!blocked ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setBlocked(false);
          setStatus("Dependency blocker cleared; exact match can enable deletion");
        }}>Clear blocker</button>
        <button type="button" className="demo-button small" onClick={() => {
          setTyped("");
          setBlocked(true);
          setDeleted(false);
          setStatus("Reset typed confirmation to empty input and active blocker");
        }}>Reset</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function DestructiveConfirmationGoodUx({ meta }: { meta: PatternMeta }) {
  const [open, setOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [jobsStopped, setJobsStopped] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [status, setStatus] = useState("Ready to review destructive action");
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const blocked = !jobsStopped;
  const canDelete = acknowledged && jobsStopped && !committing;

  const openReview = () => {
    setOpen(true);
    setAcknowledged(false);
    setCommitting(false);
    setDeleted(false);
    setStatus("Delete review opened with object scope and loss inventory");
  };

  const closeReview = (message: string) => {
    setOpen(false);
    setCommitting(false);
    setStatus(`${message}; project remains unchanged`);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!open) return;
    const first = dialogRef.current?.querySelector<HTMLElement>("button, input");
    first?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && !committing) {
        event.preventDefault();
        closeReview("Cancelled with Escape");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [committing, open]);

  const commitDelete = () => {
    if (!canDelete) return;
    setCommitting(true);
    setStatus("Deleting Payments project once; duplicate submissions disabled");
    window.setTimeout(() => {
      setOpen(false);
      setCommitting(false);
      setDeleted(true);
      setStatus("Payments project deleted; 4 dashboards, 12 views, 8 links, and 3 webhooks removed");
    }, 250);
  };

  return (
    <div className="quality-example destructive-confirm-demo">
      <div className="destructive-project-row">
        <div>
          <strong>{meta.subject}</strong>
          <span>{deleted ? "Deleted" : jobsStopped ? "Ready for final review" : "2 export jobs still running"}</span>
        </div>
        <button ref={openerRef} type="button" className="demo-button small danger" onClick={openReview}>Delete project</button>
      </div>
      <div className="demo-row destructive-confirm-controls">
        <button type="button" className={jobsStopped ? "demo-button small" : "demo-button small primary"} onClick={() => {
          setJobsStopped(false);
          setStatus("Dependency block restored: running jobs must stop before deletion");
        }}>Show dependency block</button>
        <button type="button" className={jobsStopped ? "demo-button small primary" : "demo-button small"} onClick={() => {
          setJobsStopped(true);
          setStatus("Dependencies resolved: destructive commit can be reviewed");
        }}>Stop running jobs</button>
        <button type="button" className="demo-button small" onClick={() => {
          setDeleted(false);
          setJobsStopped(false);
          setAcknowledged(false);
          setOpen(false);
          setStatus("Reset to undeleted project with running jobs");
        }}>Reset</button>
      </div>
      {open && (
        <div className="demo-backdrop is-open quality-backdrop">
          <div
            ref={dialogRef}
            className="demo-dialog destructive-confirm-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="destructive-good-title"
            aria-describedby="destructive-good-desc"
          >
            <h3 id="destructive-good-title">Delete Payments project?</h3>
            <p id="destructive-good-desc">This permanently removes the project and connected delivery workflows.</p>
            <div className="destructive-loss-grid" aria-label="Loss inventory">
              <div><span>Dashboards</span><strong>4</strong></div>
              <div><span>Saved views</span><strong>12</strong></div>
              <div><span>Shared links</span><strong>8</strong></div>
              <div><span>Webhooks</span><strong>3</strong></div>
            </div>
            <div className={blocked ? "destructive-blocker is-blocked" : "destructive-blocker"}>
              <strong>{blocked ? "Deletion blocked" : "Dependencies clear"}</strong>
              <span>{blocked ? "Stop 2 export jobs before deleting this project." : "No running jobs block this destructive action."}</span>
              {blocked ? <button type="button" className="demo-button small" onClick={() => {
                setJobsStopped(true);
                setStatus("Running jobs stopped from inside the confirmation");
              }}>Stop jobs</button> : null}
            </div>
            <label className="destructive-acknowledge">
              <input type="checkbox" checked={acknowledged} onChange={(event) => {
                setAcknowledged(event.target.checked);
                setStatus(event.target.checked ? "Permanent loss acknowledged; final delete can enable after dependencies clear" : "Acknowledgement removed; final delete disabled");
              }} />
              <span>I understand this permanently deletes Payments project and connected workflows.</span>
            </label>
            <div className="destructive-confirm-actions">
              <button type="button" className="demo-button" disabled={committing} onClick={() => closeReview("Kept Payments project")}>Keep project</button>
              <button type="button" className="demo-button danger" disabled={!canDelete} onClick={commitDelete}>{committing ? "Deleting..." : "Delete Payments project"}</button>
            </div>
          </div>
        </div>
      )}
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function DialogBadUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "menu-button") return <MenuButtonBadUx meta={meta} />;
  if (patternId === "alert-dialog") return <AlertDialogBadUx />;
  if (patternId === "drawer") return <DrawerBadUx />;
  if (patternId === "drawer-with-no-close-or-return-path") return <DrawerNoCloseReturnBadUx />;
  if (patternId === "details-panel") return <DetailsPanelBadUx />;
  if (patternId === "preview-panel") return <PreviewPanelBadUx />;
  if (patternId === "sheet") return <SheetBadUx />;
  if (patternId === "bottom-sheet") return <BottomSheetBadUx />;
  if (patternId === "popover") return <PopoverBadUx />;
  if (patternId === "modal-for-nonblocking-content") return <ModalForNonblockingContentBadUx />;
  if (patternId === "tooltip-only-required-information") return <TooltipOnlyRequiredInfoBadUx />;
  if (patternId === "tooltip") return <TooltipBadUx />;
  if (patternId === "hover-card") return <HoverCardBadUx />;
  if (patternId === "context-menu") return <ContextMenuBadUx />;
  if (patternId === "destructive-action-confirmation") return <DestructiveConfirmationBadUx />;
  if (patternId === "typed-confirmation") return <TypedConfirmationBadUx />;
  if (patternId === "confirmation-fatigue") return <ConfirmationFatigueBadUx />;

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [behind, setBehind] = useState("Background still accepts input");

  if (patternId === "modal-dialog") {
    return (
      <div className="quality-example">
        <div className="modal-background-controls">
          <button type="button" className="demo-button small" onClick={() => setBehind("Background changed while popup stayed open")}>Change plan</button>
          <button type="button" className="demo-button small" onClick={() => setBehind("Billing opened behind popup")}>Billing</button>
        </div>
        <button type="button" className="demo-button small" onClick={() => setOpen(true)}>Open popup</button>
        {open && (
          <div className="fake-modal">
            <strong>Popup</strong>
            <button type="button" onClick={() => { setOpen(false); setStatus("Closed without focus return"); }}>OK</button>
          </div>
        )}
        <p className="demo-status">{status}</p>
        <p className="demo-status">{behind}</p>
      </div>
    );
  }

  return (
    <div className="quality-example">
      <button type="button" className="demo-button small" onClick={() => setOpen(true)}>Open</button>
      {open && (
        <div className="fake-modal">
          <strong>{patternId === "confirmation-dialog" ? "Are you sure?" : meta.subject}</strong>
          {patternId === "confirmation-dialog" && <p>No object, scope, or recovery detail.</p>}
          <button type="button" onClick={() => { setOpen(false); setStatus(patternId === "confirmation-dialog" ? "Deleted without consequence detail" : "Closed"); }}>OK</button>
        </div>
      )}
      <p className="demo-status">{status}</p>
    </div>
  );
}

function TypedConfirmationBadUx() {
  const [mode, setMode] = useState<"yesOnly" | "masked" | "partial" | "stale" | "impossible" | "logging">("yesOnly");
  const copy = {
    yesOnly: "Typing YES proves the user learned the ritual, not that they verified the repository target.",
    masked: "Masking visible target text prevents users from checking the phrase they typed.",
    partial: "Partial-match gates can enable deletion for the wrong repository or namespace.",
    stale: "Stale typed text from a previous target can enable the new destructive action.",
    impossible: "Invisible characters and awkward punctuation make legitimate confirmation fail on mobile.",
    logging: "Recording typed private object names in analytics or replay creates privacy risk."
  }[mode];
  const fieldType = mode === "masked" ? "password" : "text";
  const required = mode === "yesOnly" ? "YES" : mode === "partial" ? "payments" : mode === "stale" ? "acme/old-repo" : mode === "impossible" ? "acme/payments-api\u00a0" : "acme/private-client-api";
  const entered = mode === "partial" ? "payments-api-copy" : mode === "stale" ? "acme/old-repo" : required;

  return (
    <div className={`quality-example typed-confirm-bad-ux is-${mode}`}>
      <div className="typed-confirm-modal bad">
        <h3>{mode === "stale" ? "Delete acme/new-repo?" : "Delete repository?"}</h3>
        <p>{mode === "logging" ? "Session replay captures typed private repository names." : "Type the phrase below to continue."}</p>
        <div className="typed-required-phrase bad">
          <span>Required</span>
          <strong>{required}</strong>
        </div>
        <label>
          <span>Confirmation</span>
          <input type={fieldType} value={entered} readOnly />
        </label>
        <div className="typed-confirm-status mismatch">{mode === "partial" || mode === "stale" ? "Delete enabled from unsafe match." : "Risky typed gate."}</div>
        <div className="destructive-confirm-actions">
          <button type="button" className="demo-button">Cancel</button>
          <button type="button" className="demo-button danger">Delete</button>
        </div>
      </div>
      <div className="demo-row typed-confirm-controls">
        <button type="button" className={mode === "yesOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("yesOnly")}>YES only</button>
        <button type="button" className={mode === "masked" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("masked")}>Masked field</button>
        <button type="button" className={mode === "partial" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("partial")}>Partial match</button>
        <button type="button" className={mode === "stale" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stale")}>Stale target</button>
        <button type="button" className={mode === "impossible" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("impossible")}>Hard to type</button>
        <button type="button" className={mode === "logging" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("logging")}>Logging risk</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy}</p>
    </div>
  );
}

function DestructiveConfirmationBadUx() {
  const [mode, setMode] = useState<"vague" | "defaultDanger" | "reversible" | "hiddenScope" | "postCommit" | "doubleSubmit">("vague");
  const copy = {
    vague: "Vague copy makes users infer the object, scope, and loss from memory.",
    defaultDanger: "Putting focus and Enter behavior on the destructive action raises accidental-commit risk.",
    reversible: "A reversible archive action should use undo or restore instead of a severe destructive block.",
    hiddenScope: "Hidden scope omits dashboards, shared links, and webhooks that could change the decision.",
    postCommit: "Post-commit confirmation appears after deletion has already started, so it cannot prevent harm.",
    doubleSubmit: "Duplicate submit allows the destructive request to run twice while the first commit is in progress."
  }[mode];

  return (
    <div className={`quality-example destructive-confirm-bad-ux is-${mode}`}>
      <div className="fake-modal destructive-confirm-modal bad">
        <strong>{mode === "reversible" ? "Archive project?" : mode === "postCommit" ? "Project deleted" : "Are you sure?"}</strong>
        <p>{mode === "hiddenScope" ? "This will delete the project." : mode === "defaultDanger" ? "Press Enter to continue." : mode === "reversible" ? "Archive moves the project out of the list and can be restored." : mode === "postCommit" ? "The project was deleted before this message appeared." : mode === "doubleSubmit" ? "Deleting project. Button still active." : "This cannot be undone."}</p>
        <div className="destructive-confirm-actions">
          <button type="button">{mode === "defaultDanger" ? "Cancel" : "No"}</button>
          <button type="button" className="danger">{mode === "reversible" ? "Archive" : mode === "postCommit" ? "OK" : "Yes"}</button>
        </div>
      </div>
      <div className="destructive-loss-grid bad" aria-label="Missing or misleading scope">
        <div><span>Object named</span><strong>{mode === "vague" ? "No" : "Partial"}</strong></div>
        <div><span>Loss listed</span><strong>{mode === "hiddenScope" ? "Hidden" : "No"}</strong></div>
        <div><span>Safe path</span><strong>{mode === "defaultDanger" ? "Harder" : "Unclear"}</strong></div>
        <div><span>Commit timing</span><strong>{mode === "postCommit" ? "Too late" : "Uncontrolled"}</strong></div>
      </div>
      <div className="demo-row destructive-confirm-controls">
        <button type="button" className={mode === "vague" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vague")}>Vague prompt</button>
        <button type="button" className={mode === "defaultDanger" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("defaultDanger")}>Default danger</button>
        <button type="button" className={mode === "reversible" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("reversible")}>Reversible action</button>
        <button type="button" className={mode === "hiddenScope" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenScope")}>Hidden scope</button>
        <button type="button" className={mode === "postCommit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("postCommit")}>Post-commit</button>
        <button type="button" className={mode === "doubleSubmit" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("doubleSubmit")}>Double submit</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy}</p>
    </div>
  );
}

function GoodUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <DialogUi patternId={patternId} meta={meta} good />;
}

function BadUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <DialogUi patternId={patternId} meta={meta} />;
}

function GoodUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <DialogGoodUx patternId={patternId} meta={meta} />;
}

function BadUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <DialogBadUx patternId={patternId} meta={meta} />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
