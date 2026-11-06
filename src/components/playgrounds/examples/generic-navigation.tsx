import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { QualityPanel, short, type PatternMeta } from './shared';

function NavigationUi({ patternId, meta, good = false }: { patternId: string; meta: PatternMeta; good?: boolean }) {
  if (!good) {
    if (patternId === "menu-menubar") return <MenubarBadUi />;

    if (patternId === "in-page-anchor-navigation") {
      return (
        <div className="bad-ui-sample in-page-anchor-bad-ui">
          <div className="bad-nav-row in-page-anchor-bad-row">
            {["Overview", "Details", "More", "Account", "Print"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="in-page-article-preview bad">
            <strong>Requirements</strong>
            <span>Labels do not match headings and some links leave the page.</span>
          </div>
        </div>
      );
    }

    if (patternId === "back-link") {
      return (
        <div className="bad-ui-sample back-link-bad-ui">
          <nav className="breadcrumb-demo" aria-label="Breadcrumb and back mixed">
            <ol className="breadcrumb-trail">
              {["Home", "Apply", "Review"].map((item) => <li key={item}><span>{item}</span></li>)}
            </ol>
          </nav>
          <div className="back-link-actions bad">
            <button type="button">Back</button>
            <button type="button" className="demo-button small primary">Continue</button>
          </div>
          <p className="demo-status">Back, breadcrumbs, and submit controls compete in the same transaction space.</p>
        </div>
      );
    }

    if (patternId === "step-navigation") {
      return (
        <div className="bad-ui-sample step-navigation-bad-ui">
          <div className="bad-nav-row step-navigation-bad-row">
            {["Home", "1", "2", "Review", "Pay", "Help"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="step-card-preview bad">
            <strong>Contact details</strong>
            <span>Indicator says Review is active and all future items look open.</span>
          </div>
          <p className="demo-status">Hierarchy, step numbers, and utility links are mixed without current or locked states.</p>
        </div>
      );
    }

    if (patternId === "process-list") {
      return (
        <div className="bad-ui-sample process-list-bad-ui">
          <div className="bad-nav-row process-list-bad-row">
            {["Home", "Step 4", "Done", "Search", "Account", "Next"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="process-step-card bad">
            <strong>Details</strong>
            <span>Static guidance, status tags, page hierarchy, and transaction controls are mixed in one fake process.</span>
          </div>
          <p className="demo-status">No start, end, task links, cost, branch, or useful order.</p>
        </div>
      );
    }

    if (patternId === "navigation-drawer") {
      return (
        <div className="bad-ui-sample drawer-bad-ui">
          <div className="drawer-frame bad">
            <div className="drawer-sheet bad">
              {["Inbox", "Delete account", "Help", "Settings", "Sign out"].map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="drawer-page-preview">
              <strong>Inbox</strong>
              <span>No scrim, close route, grouping, or selected state.</span>
            </div>
          </div>
        </div>
      );
    }

    if (patternId === "side-navigation") {
      return (
        <div className="bad-ui-sample side-nav-bad-ui">
          <div className="bad-side-nav-row">
            {["Home", "Reports", "Security", "Sign out", "API", "Help", "Billing"].map((item) => <span key={item}>{short(item)}</span>)}
          </div>
          <p className="demo-status">Unscoped product, utility, and section links compete in one side column.</p>
        </div>
      );
    }

    if (patternId === "service-navigation") {
      return (
        <div className="bad-ui-sample service-nav-bad-ui">
          <div className="service-nav-general bad">
            <strong>GOV.UK</strong>
            <span>Topics</span>
            <span>Sign out</span>
          </div>
          <div className="bad-nav-row service-nav-bad-row">
            {["Apply", "Benefits", "Help", "Sign out", "Anchor", "Admin"].map((item) => <span key={item}>{short(item)}</span>)}
          </div>
          <p className="demo-status">GOV.UK-wide, service, utility, and page links compete in one service strip.</p>
        </div>
      );
    }

    if (patternId === "header") {
      return (
        <div className="bad-ui-sample top-app-bar-bad-ui">
          <div className="top-app-bar bad">
            <button type="button">Menu</button>
            <strong>Acme Ops</strong>
            <button type="button">Export</button>
            <button type="button">Delete</button>
            <button type="button">Sign out</button>
          </div>
          <p className="demo-status">Brand, global links, account action, and destructive command compete in one bar.</p>
        </div>
      );
    }

    if (patternId === "global-navigation") {
      return (
        <div className="bad-ui-sample global-nav-bad-ui">
          <div className="bad-nav-row">
            {["Home", "Reports", "Admin", "Help", "Sign out", "API", "Team"].map((item) => <span key={item}>{short(item)}</span>)}
          </div>
          <p className="demo-status">Crowded destinations, utilities, and account actions in one row.</p>
        </div>
      );
    }

    if (patternId === "utility-navigation") {
      return (
        <div className="bad-ui-sample utility-nav-bad-ui">
          <div className="bad-nav-row utility-nav-bad-row">
            {["Projects", "Help", "Sign out", "Alerts", "Reports", "Profile"].map((item) => <span key={item}>{short(item)}</span>)}
          </div>
          <p className="demo-status">Utilities and destinations are peers, so current section and session actions are ambiguous.</p>
        </div>
      );
    }

    if (patternId === "related-links") {
      return (
        <div className="bad-ui-sample related-links-bad-ui">
          <div className="related-links-card bad">
            <strong>More information</strong>
            {["Home", "Apply now", "Old guidance", "Click here", "Account settings", "Fees"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <p className="demo-status">Primary actions, stale content, page anchors, and vague labels are dumped together.</p>
        </div>
      );
    }

    if (patternId === "recently-viewed") {
      return (
        <div className="bad-ui-sample recently-viewed-bad-ui">
          <div className="recently-viewed-card bad">
            <strong>Recently viewed</strong>
            {["Sponsored plan", "Untitled", "Deleted record", "Aditi's claim", "Popular supplier"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <p className="demo-status">Promoted, unavailable, and another user's entries are mixed with no remove or clear controls.</p>
        </div>
      );
    }

    if (patternId === "recently-searched") {
      return (
        <div className="bad-ui-sample recent-searches-bad-ui">
          <div className="recent-search-list bad">
            <strong>Recent</strong>
            {["Sponsored claim help", "Atlas Packaging", "Saved: Open cases", "another user's health search"].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <p className="demo-status">Ads, viewed records, saved searches, and another user's query are mixed under one vague label.</p>
        </div>
      );
    }

    if (patternId === "skip-link") {
      return (
        <div className="bad-ui-sample skip-link-bad-ui">
          <div className="skip-link-shell bad">
            <span className="skip-link-broken-hidden">Skip to main content</span>
            <header className="skip-link-header bad">
              {["Logo", "Search", "Account", "Help", "Menu", "Contact"].map((item) => <span key={item}>{item}</span>)}
            </header>
            <main className="skip-link-main bad">
              <strong>Application status</strong>
              <span>Main content has no reachable target.</span>
            </main>
          </div>
          <p className="demo-status">The skip link is visually hidden but not focusable, and users must tab through repeated header controls.</p>
        </div>
      );
    }

    if (patternId === "mega-menu") {
      return (
        <div className="bad-ui-sample mega-menu-bad-ui">
          <div className="bad-nav-row mega-menu-bad-row">
            {["Products", "Help", "Sign out", "All pages", "Billing", "Blog"].map((item) => <span key={item}>{short(item)}</span>)}
          </div>
          <div className="mega-panel-preview bad">
            <strong>Everything</strong>
            <span>Utilities, account actions, marketing links, and every page are dumped into one hover panel.</span>
          </div>
          <p className="demo-status">Trigger scope and panel content do not match.</p>
        </div>
      );
    }

    if (patternId === "pagination-without-current-page") {
      return <PaginationCurrentPageBadUi />;
    }

    if (patternId === "pagination") {
      return (
        <div className="bad-ui-sample">
          <div className="bad-nav-row pagination-bad-preview">
            {["<", "1", "2", "3", "...", ">"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <p className="demo-status">No current page, range, or edge state.</p>
        </div>
      );
    }

    if (patternId === "breadcrumbs") {
      return (
        <div className="bad-ui-sample">
          <div className="bad-nav-row breadcrumb-bad-preview">
            {["Search", "Runbook", "Settings", "Back"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <p className="demo-status">Recent clicks, not hierarchy; no current page.</p>
        </div>
      );
    }

    if (patternId === "bottom-navigation") {
      return (
        <div className="bad-ui-sample bottom-nav-bad-ui">
          <div className="bad-nav-row bottom-nav-overflow-preview">
            {["H", "S", "+", "Saved", "Alerts", "More"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <p className="demo-status">Too many items, icon guesses, and a create action mixed in.</p>
        </div>
      );
    }

    if (patternId === "accordion") {
      return (
        <div className="bad-ui-sample accordion-static-preview bad">
          <div className="accordion-bad-row">
            {["+", "+", "More", "Next page"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="accordion-panel-bad">
            <strong>Hidden requirements</strong>
            <span>Rows mix icons, page navigation, and collapsed content with no heading buttons or expanded state.</span>
          </div>
          <p className="demo-status">The broken treatment hides important sections and does not expose what each control reveals.</p>
        </div>
      );
    }

    if (patternId === "tabs") {
      return (
        <div className="bad-ui-sample">
          <div className="bad-nav-row">
            {["One", "Two", "Three", "Four"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <p className="demo-status">Looks like buttons; no active tab or panel link.</p>
        </div>
      );
    }

    return (
      <div className="bad-ui-sample">
        <div className="bad-nav-row">
          {meta.options.map((item) => <span key={item}>{short(item)}</span>)}
        </div>
        <p className="demo-status">No visible current state</p>
      </div>
    );
  }

  if (patternId === "menu-menubar") return <MenubarGoodUi />;

  if (patternId === "accordion") {
    const open = ["Eligibility", "Refund timing"];
    return (
      <div className="quality-example accordion-static-preview">
        <div className="accordion-toolbar-preview">
          <strong>{meta.subject}</strong>
          <button type="button" className="demo-button small">Expand all</button>
        </div>
        <div className="accordion-list-preview">
          {meta.options.map((item) => {
            const expanded = open.includes(item);
            return (
              <section className={expanded ? "accordion-section is-open" : "accordion-section"} key={item}>
                <h4>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`accordion-preview-${item.toLowerCase().replace(/\s+/g, "-")}`}
                    aria-label={`${item}, ${expanded ? "expanded" : "collapsed"}${item === "Proof needed" ? ", 1 missing" : ""}`}
                  >
                    <span>{item}</span>
                    {item === "Proof needed" && <em>1 missing</em>}
                  </button>
                </h4>
                {expanded && (
                  <div id={`accordion-preview-${item.toLowerCase().replace(/\s+/g, "-")}`} className="accordion-panel-preview">
                    {item === "Eligibility" ? "Returns are accepted for unused items within 30 days." : "Refunds usually reach the original payment method within five working days."}
                  </div>
                )}
              </section>
            );
          })}
        </div>
        <p className="demo-status">Section heading buttons expose expanded state, keep labels visible, and summarize hidden issues.</p>
      </div>
    );
  }

  if (patternId === "in-page-anchor-navigation") {
    const active = "Fees";
    return (
      <div className="in-page-anchor-layout" aria-label="In-page navigation preview">
        <nav className="in-page-anchor-nav" aria-label="On this page">
          <strong>On this page</strong>
          {meta.options.map((item) => (
            <a
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              key={item}
              className={item === active ? "is-active" : ""}
              aria-current={item === active ? "location" : undefined}
              onClick={(event) => event.preventDefault()}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="in-page-article-preview">
          {meta.options.slice(0, 3).map((item) => (
            <section key={item} className={item === active ? "is-current-section" : ""}>
              <h4>{item}</h4>
              <p>{item === active ? "Active section is visible and linked from On this page." : "Section heading matches the anchor label."}</p>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (patternId === "back-link") {
    return (
      <div className="back-link-page-preview" aria-label="Back link preview">
        <a href="#previous-step" className="back-link-control" aria-label="Back" onClick={(event) => event.preventDefault()}>Back</a>
        <div className="back-link-form-preview">
          <span className="demo-status">Step 2 of 4</span>
          <strong>Contact details</strong>
          <label>
            <span>Email address</span>
            <input value="alex@example.gov" readOnly />
          </label>
          <button type="button" className="demo-button small primary">Continue</button>
        </div>
      </div>
    );
  }

  if (patternId === "step-navigation") {
    const current = 1;
    return (
      <div className="step-navigation-preview" aria-label="Step navigation preview">
        <ol className="step-indicator" aria-label="Application progress">
          {meta.options.map((item, index) => {
            const state = index < current ? "complete" : index === current ? "current" : "upcoming";
            return (
              <li className={`step-item ${state}`} aria-current={state === "current" ? "step" : undefined} key={item}>
                <span className="step-label">
                  <span className="step-marker">{state === "complete" ? "OK" : index + 1}</span>
                  <span>{item}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <div className="step-card-preview">
          <span className="demo-status">Step {current + 1} of {meta.options.length}</span>
          <strong>{meta.options[current]}</strong>
          <span>Completed, current, and upcoming states match the page heading.</span>
        </div>
      </div>
    );
  }

  if (patternId === "process-list") {
    const steps = meta.options.slice(0, 4);
    return (
      <div className="process-list-preview" aria-label="Process list preview">
        <p className="process-intro">Use this guide to apply for a permit from eligibility through decision tracking.</p>
        <ol className="process-list">
          {steps.map((item, index) => (
            <li className={index === 1 ? "is-expanded" : ""} key={item}>
              <div className="process-step-heading">
                <span>{index + 1}</span>
                <strong>{item}</strong>
              </div>
              {index === 1 && (
                <div className="process-step-card">
                  <a href="#upload-evidence" onClick={(event) => event.preventDefault()}>Upload evidence</a>
                  <a href="#identity-check" onClick={(event) => event.preventDefault()}>Book an identity check</a>
                  <span>Offline appointment may be required.</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (patternId === "breadcrumbs") {
    return (
      <nav className="breadcrumb-demo" aria-label="Breadcrumb preview">
        <ol className="breadcrumb-trail">
          {meta.options.map((item, index) => (
            <li key={item}>
              {index === meta.options.length - 1 ? (
                <span className="breadcrumb-current" aria-current="page">{item}</span>
              ) : (
                <a href={`#${item.toLowerCase()}`}>{item}</a>
              )}
            </li>
          ))}
        </ol>
        <p className="demo-status">Canonical path, not click history.</p>
      </nav>
    );
  }

  if (patternId === "global-navigation") {
    const active = "Projects";
    return (
      <div className="global-nav-shell" aria-label="Global navigation preview">
        <header className="global-nav-header">
          <strong>Acme Ops</strong>
          <nav aria-label="Primary sections">
            {meta.options.slice(0, 4).map((item) => (
              <button type="button" className={item === active ? "is-active" : ""} aria-current={item === active ? "page" : undefined} key={item}>{item}</button>
            ))}
            <button type="button" aria-expanded="false">More</button>
          </nav>
          <div className="global-nav-utilities" aria-label="Utilities">
            <button type="button">Help</button>
            <button type="button">Aditi</button>
          </div>
        </header>
        <div className="global-nav-content-preview">
          <strong>{active}</strong>
          <span>Current section matches content; utility actions are separate.</span>
        </div>
      </div>
    );
  }

  if (patternId === "mega-menu") {
    return (
      <div className="mega-menu-shell" aria-label="Mega menu preview">
        <header className="mega-menu-header">
          <strong>Acme Cloud</strong>
          <nav aria-label="Primary">
            {meta.options.slice(0, 4).map((item) => (
              <button type="button" className={item === "Products" ? "is-active" : ""} aria-expanded={item === "Products" ? "true" : "false"} key={item}>{item}</button>
            ))}
          </nav>
          <div className="mega-menu-utilities"><button type="button">Search</button></div>
        </header>
        <div className="mega-panel-preview">
          {["Build", "Operate", "Analyze"].map((group) => (
            <section key={group}>
              <h4>{group}</h4>
              <a href="#destination" onClick={(event) => event.preventDefault()}>{group} workspace</a>
              <a href="#destination" onClick={(event) => event.preventDefault()}>{group} templates</a>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (patternId === "utility-navigation") {
    return (
      <div className="utility-nav-shell" aria-label="Utility navigation preview">
        <header className="utility-nav-header">
          <strong>Acme Ops</strong>
          <nav aria-label="Primary destinations">
            {["Dashboard", "Projects", "Reports"].map((item) => (
              <button type="button" className={item === "Projects" ? "is-active" : ""} aria-current={item === "Projects" ? "page" : undefined} key={item}>{item}</button>
            ))}
          </nav>
          <div className="utility-nav-tools" aria-label="Utilities">
            <button type="button">Search</button>
            <button type="button">Help</button>
            <button type="button" aria-label="Notifications, 3 unread">Alerts <span>3</span></button>
            <button type="button">Aditi</button>
          </div>
        </header>
        <div className="utility-panel-preview">
          <strong>Notifications</strong>
          <span>3 unread account and workflow updates. Projects remains current.</span>
        </div>
      </div>
    );
  }

  if (patternId === "related-links") {
    return (
      <div className="related-links-demo-card" aria-label="Related links preview">
        <article className="related-article-preview">
          <strong>Renew your support claim</strong>
          <span>Guidance page is complete; optional onward links sit after the content.</span>
        </article>
        <nav className="related-links-card" aria-label="Related links">
          <strong>Related links</strong>
          <a href="#eligibility" onClick={(event) => event.preventDefault()}>Check eligibility for support</a>
          <a href="#evidence" onClick={(event) => event.preventDefault()}>Upload evidence for your claim</a>
          <a href="#calculator" onClick={(event) => event.preventDefault()}>Find an independent benefits calculator <span>external</span></a>
        </nav>
      </div>
    );
  }

  if (patternId === "recently-viewed") {
    return (
      <div className="recently-viewed-demo-card" aria-label="Recently viewed preview">
        <div className="recent-workspace-preview">
          <strong>Supplier workspace</strong>
          <span>Recent records are automatic history, separate from saved suppliers.</span>
        </div>
        <section className="recently-viewed-card" aria-label="Recently viewed supplier records">
          <strong>Recently viewed</strong>
          {[
            ["Atlas Packaging", "Supplier record", "Viewed 2 min ago"],
            ["Nile Components", "Compliance file", "Viewed 18 min ago"],
            ["Orion Health", "Contract draft", "Viewed yesterday"]
          ].map(([name, type, time]) => (
            <a href="#recent-record" onClick={(event) => event.preventDefault()} key={name}>
              <span>{name}</span>
              <em>{type} - {time}</em>
            </a>
          ))}
        </section>
      </div>
    );
  }

  if (patternId === "skip-link") {
    return (
      <div className="skip-link-demo-card" aria-label="Skip link preview">
        <a className="skip-link-control is-visible" href="#skip-preview-main" onClick={(event) => event.preventDefault()}>Skip to main content</a>
        <header className="skip-link-header" aria-label="Repeated page header">
          {["Logo", "Search", "Account", "Help", "Menu"].map((item) => <span key={item}>{item}</span>)}
        </header>
        <main id="skip-preview-main" className="skip-link-main" tabIndex={-1}>
          <strong>Application status</strong>
          <span>Main content target is present before the first form control.</span>
        </main>
      </div>
    );
  }

  if (patternId === "service-navigation") {
    const active = "Applications";
    return (
      <div className="service-nav-shell" aria-label="Service navigation preview">
        <header className="service-nav-general">
          <strong>GOV.UK</strong>
          <nav aria-label="GOV.UK-wide tools">
            <button type="button">One Login</button>
          </nav>
        </header>
        <section className="service-nav-strip" aria-label="Service information">
          <a href="#service-home" className="service-nav-name">{meta.subject}</a>
          <button type="button" className="service-nav-menu-button" aria-controls="service-preview-menu" aria-expanded="false">Menu</button>
          <nav id="service-preview-menu" aria-label="Service menu">
            {meta.options.map((item) => (
              <button type="button" key={item} className={item === active ? "is-current" : ""} aria-current={item === active ? "page" : undefined}>{item}</button>
            ))}
          </nav>
          <button type="button">Cymraeg</button>
        </section>
        <div className="service-nav-content-preview">
          <strong>{active}</strong>
          <span>Service section matches content; GOV.UK-wide tools are above.</span>
        </div>
      </div>
    );
  }

  if (patternId === "header") {
    return (
      <div className="top-app-bar-preview" aria-label="Top app bar preview">
        <header className="top-app-bar">
          <button type="button" aria-label="Back to projects">Back</button>
          <strong>Project Apollo</strong>
          <div className="top-app-bar-actions" aria-label="Project actions">
            <button type="button">Search</button>
            <button type="button">Share</button>
            <button type="button" aria-expanded="false">More</button>
          </div>
        </header>
        <div className="top-app-bar-content">
          <span>Details view</span>
          <p>Title and actions target the current project view.</p>
        </div>
      </div>
    );
  }

  if (patternId === "side-navigation") {
    return (
      <div className="side-nav-layout-preview" aria-label="Side navigation preview">
        <nav className="side-nav-panel" aria-label="Settings side navigation">
          <strong>Settings</strong>
          <button type="button">Account</button>
          <button type="button">Billing</button>
          <div className="side-nav-group">
            <button type="button" className="is-parent" aria-expanded="true">Security</button>
            <button type="button">Access keys</button>
            <button type="button" className="is-current" aria-current="page">Audit log</button>
          </div>
        </nav>
        <div className="side-nav-content-preview">
          <strong>Audit log</strong>
          <span>Current child page remains visible under Security.</span>
        </div>
      </div>
    );
  }

  if (patternId === "navigation-drawer") {
    return (
      <div className="drawer-frame" aria-label="Navigation drawer preview">
        <div className="drawer-top-bar">
          <button type="button" aria-label="Open navigation menu">Menu</button>
          <strong>Mail</strong>
        </div>
        <div className="drawer-scrim" aria-hidden="true"></div>
        <nav className="drawer-sheet" aria-label="Mail navigation">
          <strong>Mail folders</strong>
          {["Inbox", "Starred", "Sent"].map((item, index) => (
            <button type="button" className={index === 0 ? "is-current" : ""} aria-current={index === 0 ? "page" : undefined} key={item}>{item}</button>
          ))}
          <hr />
          <button type="button">Settings</button>
        </nav>
        <div className="drawer-page-preview">
          <strong>Inbox</strong>
          <span>Drawer overlays content with a scrim and visible selected item.</span>
        </div>
      </div>
    );
  }

  if (patternId === "bottom-navigation") {
    return (
      <nav className="bottom-nav-demo compact-bottom-nav bottom-nav-preview" aria-label="Bottom navigation preview">
        {meta.options.map((item, index) => (
          <button type="button" className={index === 0 ? "is-active" : ""} aria-current={index === 0 ? "page" : undefined} key={item}>
            <span className={`nav-symbol nav-symbol-${iconKeyForDestination(item)}`} aria-hidden="true"></span>
            <em>{item}</em>
            {item === "Alerts" ? <strong aria-label="2 alerts">2</strong> : null}
          </button>
        ))}
      </nav>
    );
  }

  if (patternId === "tabs") {
    const active = meta.options[1];
    return (
      <div className="tabs-demo">
        <div className="tabs-list" role="tablist" aria-label="Project sections preview">
          {meta.options.map((item) => {
            const selected = item === active;
            const id = `tabs-preview-${item.toLowerCase()}`;
            return (
              <button
                type="button"
                className={selected ? "tab-button is-selected" : "tab-button"}
                key={item}
                id={id}
                role="tab"
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={selected ? 0 : -1}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className="tab-panel-preview" role="tabpanel" id="tabs-preview-activity-panel" aria-labelledby="tabs-preview-activity">
          <strong>Activity</strong>
          <span>6 changes this week</span>
        </div>
      </div>
    );
  }

  if (patternId === "pagination-without-current-page") {
    return <PaginationCurrentPageGoodUi />;
  }

  if (patternId === "pagination") {
    const current = 2;
    const total = 8;
    return (
      <div className="pagination-demo">
        <p className="demo-status">Showing 11-20 of 78 results for "audit"</p>
        <nav className="pagination-nav-preview" aria-label="Pagination preview">
          <button type="button" className="demo-button small">Previous</button>
          {[1, 2, 3].map((page) => (
            <button
              type="button"
              key={page}
              className={page === current ? "page-button is-current" : "page-button"}
              aria-current={page === current ? "page" : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ))}
          <span className="pagination-ellipsis" aria-hidden="true">...</span>
          <button type="button" className="page-button" aria-label={`Page ${total}`}>{total}</button>
          <button type="button" className="demo-button small">Next</button>
        </nav>
      </div>
    );
  }

  return (
    <div className="demo-row" role={patternId === "tabs" ? "tablist" : "navigation"} aria-label={`${meta.name} preview`}>
      {meta.options.map((item, index) => (
        <button
          type="button"
          className={index === 0 ? "demo-button small primary" : "demo-button small"}
          key={item}
          aria-current={patternId === "pagination" && index === 0 ? "page" : undefined}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

type PaginationCurrentPageMode =
  | "currentMarker"
  | "resultRange"
  | "firstEdge"
  | "lastEdge"
  | "loadingCommit"
  | "filterReset"
  | "outOfRange"
  | "cursorRange"
  | "mobileCompact"
  | "duplicatePagination";

type PaginationCurrentPageBadMode =
  | "noCurrent"
  | "colorOnly"
  | "staleLoading"
  | "rangeMismatch"
  | "multipleCurrent"
  | "activeEdges"
  | "mobileArrowsOnly"
  | "emptyStalePage";

const paginationCurrentGoodModes: Array<{ mode: PaginationCurrentPageMode; label: string }> = [
  { mode: "currentMarker", label: "Current marker" },
  { mode: "resultRange", label: "Result range" },
  { mode: "firstEdge", label: "First edge" },
  { mode: "lastEdge", label: "Last edge" },
  { mode: "loadingCommit", label: "Loading commit" },
  { mode: "filterReset", label: "Filter reset" },
  { mode: "outOfRange", label: "Out-of-range recovery" },
  { mode: "cursorRange", label: "Cursor range" },
  { mode: "mobileCompact", label: "Mobile compact" },
  { mode: "duplicatePagination", label: "Duplicate pagination" }
];

const paginationCurrentBadModes: Array<{ mode: PaginationCurrentPageBadMode; label: string }> = [
  { mode: "noCurrent", label: "No current page" },
  { mode: "colorOnly", label: "Color-only current" },
  { mode: "staleLoading", label: "Stale loading" },
  { mode: "rangeMismatch", label: "Range mismatch" },
  { mode: "multipleCurrent", label: "Multiple current pages" },
  { mode: "activeEdges", label: "Active edge controls" },
  { mode: "mobileArrowsOnly", label: "Mobile arrows only" },
  { mode: "emptyStalePage", label: "Empty stale page" }
];

function PaginationCurrentPageGoodUi() {
  return (
    <div className="quality-example pagination-current-demo">
      <PaginationCurrentPageGoodPanel mode="currentMarker" compact={false} />
      <p className="demo-status">Page 3 is visually marked, announced as current page, and matches the 21-30 result range.</p>
    </div>
  );
}

function PaginationCurrentPageBadUi() {
  return (
    <div className="bad-ui-sample pagination-current-demo pagination-current-bad-ux">
      <PaginationCurrentPageBadPanel mode="noCurrent" />
      <p className="demo-status">The page numbers are clickable, but none identifies the current result slice.</p>
    </div>
  );
}

function PaginationCurrentPageGoodPanel({ mode, compact = false }: { mode: PaginationCurrentPageMode; compact?: boolean }) {
  const details: Record<PaginationCurrentPageMode, {
    page: number;
    totalPages: number;
    range: string;
    query: string;
    status: string;
    url: string;
    summary: string;
    disabledPrevious?: boolean;
    disabledNext?: boolean;
    cursorOnly?: boolean;
  }> = {
    currentMarker: {
      page: 3,
      totalPages: 12,
      range: "21-30 of 118",
      query: "audit",
      status: "Current page is Page 3 and previous/next are relative to that page.",
      url: "?q=audit&page=3",
      summary: "Exactly one page has aria-current=\"page\"."
    },
    resultRange: {
      page: 5,
      totalPages: 12,
      range: "41-50 of 118",
      query: "audit",
      status: "The result range, page marker, URL, and visible rows all agree.",
      url: "?q=audit&page=5",
      summary: "Range text confirms which slice is loaded."
    },
    firstEdge: {
      page: 1,
      totalPages: 12,
      range: "1-10 of 118",
      query: "audit",
      status: "Previous is unavailable because Page 1 is current.",
      url: "?q=audit&page=1",
      summary: "First-page edge state is explicit.",
      disabledPrevious: true
    },
    lastEdge: {
      page: 12,
      totalPages: 12,
      range: "111-118 of 118",
      query: "audit",
      status: "Next is unavailable because Page 12 is current.",
      url: "?q=audit&page=12",
      summary: "Last-page edge state is explicit.",
      disabledNext: true
    },
    loadingCommit: {
      page: 4,
      totalPages: 12,
      range: "31-40 of 118",
      query: "audit",
      status: "Loading Page 4 keeps the old state visible until the new current page commits.",
      url: "?q=audit&page=4",
      summary: "Loading does not leave a stale current marker."
    },
    filterReset: {
      page: 1,
      totalPages: 4,
      range: "1-10 of 34",
      query: "audit + errors",
      status: "Filter changed; pagination returned to Page 1 of the smaller result set.",
      url: "?q=audit&status=error&page=1",
      summary: "Filter reset explains the new current page."
    },
    outOfRange: {
      page: 4,
      totalPages: 4,
      range: "31-34 of 34",
      query: "audit + errors",
      status: "Stale page 9 recovered to the last available page and announced the correction.",
      url: "?q=audit&status=error&page=4",
      summary: "Out-of-range recovery lands on a valid current page."
    },
    cursorRange: {
      page: 0,
      totalPages: 0,
      range: "41-60 of many",
      query: "audit",
      status: "Cursor pagination exposes the current range because numbered pages are not available.",
      url: "?q=audit&cursor=after-40",
      summary: "Previous and next are still relative to the current range.",
      cursorOnly: true
    },
    mobileCompact: {
      page: 3,
      totalPages: 12,
      range: "21-30 of 118",
      query: "audit",
      status: "Compact controls keep Page 3 of 12 text visible between arrows.",
      url: "?q=audit&page=3",
      summary: "Mobile compact keeps position text."
    },
    duplicatePagination: {
      page: 3,
      totalPages: 12,
      range: "21-30 of 118",
      query: "audit",
      status: "Top and bottom pagination regions share the same current page and labels.",
      url: "?q=audit&page=3",
      summary: "Duplicate controls do not disagree."
    }
  };

  const info = details[mode];
  const visiblePages = info.cursorOnly ? [] : [1, 2, 3, 4, 5, info.totalPages].filter((page, index, pages) => pages.indexOf(page) === index);
  const resultRows = mode === "outOfRange"
    ? ["Audit exception 031", "Audit exception 032", "Audit exception 033", "Audit exception 034"]
    : ["Audit event 021", "Audit event 022", "Audit event 023"];

  const nav = (label: string) => (
    <nav className={compact || mode === "mobileCompact" ? "pagination-current-nav compact" : "pagination-current-nav"} aria-label={label}>
      <button type="button" className="demo-button small" disabled={info.disabledPrevious}>Previous</button>
      {info.cursorOnly ? (
        <span className="pagination-current-range-pill">Current range: {info.range}</span>
      ) : compact || mode === "mobileCompact" ? (
        <span className="pagination-current-range-pill">Page {info.page} of {info.totalPages}</span>
      ) : (
        <>
          {visiblePages.slice(0, 5).map((page) => (
            <button
              type="button"
              key={`${label}-${page}`}
              className={page === info.page ? "page-button is-current" : "page-button"}
              aria-current={page === info.page ? "page" : undefined}
              aria-label={page === info.page ? `Page ${page}, current page` : `Go to page ${page}`}
            >
              {page}
            </button>
          ))}
          <span className="pagination-ellipsis" aria-hidden="true">...</span>
          <button type="button" className={info.totalPages === info.page ? "page-button is-current" : "page-button"} aria-current={info.totalPages === info.page ? "page" : undefined} aria-label={info.totalPages === info.page ? `Page ${info.totalPages}, current page` : `Go to page ${info.totalPages}`}>
            {info.totalPages}
          </button>
        </>
      )}
      <button type="button" className="demo-button small" disabled={info.disabledNext}>Next</button>
    </nav>
  );

  return (
    <div className={mode === "mobileCompact" ? "pagination-current-shell is-compact" : "pagination-current-shell"}>
      <div className="pagination-current-summary">
        <span><strong>Query</strong>{info.query}</span>
        <span><strong>Range</strong>{info.range}</span>
        <span><strong>URL</strong>{info.url}</span>
      </div>
      {nav(mode === "duplicatePagination" ? "Top pagination" : "Pagination")}
      <section className="pagination-current-results" aria-live="polite">
        <h4>{info.range}</h4>
        <p>{info.status}</p>
        {resultRows.map((row) => (
          <button type="button" className="pattern-row" key={row}>{row} - current page state is reconstructable</button>
        ))}
      </section>
      {mode === "duplicatePagination" && nav("Bottom pagination")}
      <p className="pagination-current-note">{info.summary}</p>
    </div>
  );
}

function PaginationCurrentPageBadPanel({ mode }: { mode: PaginationCurrentPageBadMode }) {
  const details: Record<PaginationCurrentPageBadMode, {
    range: string;
    url: string;
    status: string;
    pages: string[];
    note: string;
    compact?: boolean;
    multiple?: boolean;
    activeEdges?: boolean;
  }> = {
    noCurrent: {
      range: "Showing results",
      url: "?q=audit",
      status: "Users can move, but cannot tell what page is loaded.",
      pages: ["1", "2", "3", "4", "...", "12"],
      note: "No page has current text, aria-current, or matching range."
    },
    colorOnly: {
      range: "21-30 of 118",
      url: "?q=audit&page=3",
      status: "The only current cue is a low-contrast color change.",
      pages: ["1", "2", "3", "4", "...", "12"],
      note: "Color-only current state fails for keyboard and screen reader users."
    },
    staleLoading: {
      range: "31-40 of 118",
      url: "?q=audit&page=4",
      status: "Rows changed to Page 4 while the old Page 3 marker stayed selected.",
      pages: ["1", "2", "3", "4", "...", "12"],
      note: "Async loading left current page stale."
    },
    rangeMismatch: {
      range: "41-50 of 118",
      url: "?q=audit&page=5",
      status: "The highlighted page, URL, and range disagree.",
      pages: ["1", "2", "3", "4", "...", "12"],
      note: "Users cannot know which state previous and next are relative to."
    },
    multipleCurrent: {
      range: "21-30 of 118",
      url: "?q=audit&page=3",
      status: "Two page chips look selected at once.",
      pages: ["1", "2", "3", "4", "...", "12"],
      note: "More than one current page breaks the related-set contract.",
      multiple: true
    },
    activeEdges: {
      range: "1-10 of 118",
      url: "?q=audit&page=1",
      status: "Previous appears active on the first page.",
      pages: ["1", "2", "3", "4", "...", "12"],
      note: "Edge controls look available when no previous page exists.",
      activeEdges: true
    },
    mobileArrowsOnly: {
      range: "Results",
      url: "?q=audit&page=3",
      status: "The compact mobile control removed Page 3 of 12 text.",
      pages: [],
      note: "Arrow-only pagination hides current position on narrow screens.",
      compact: true
    },
    emptyStalePage: {
      range: "0 results on page 9",
      url: "?q=audit&status=error&page=9",
      status: "Filtering created an empty stale page with no valid current-page recovery.",
      pages: ["1", "2", "3", "4"],
      note: "Page 9 of 4 is impossible, but the UI offers no correction."
    }
  };

  const info = details[mode];
  const markedCurrent = (page: string) => {
    if (mode === "colorOnly") return page === "3";
    if (mode === "staleLoading") return page === "3";
    if (mode === "rangeMismatch") return page === "2";
    if (mode === "multipleCurrent") return page === "2" || page === "3";
    if (mode === "activeEdges") return page === "1";
    return false;
  };

  return (
    <div className="pagination-current-shell bad">
      <div className="pagination-current-summary bad">
        <span><strong>Range</strong>{info.range}</span>
        <span><strong>URL</strong>{info.url}</span>
        <span><strong>Status</strong>ambiguous</span>
      </div>
      <nav className={info.compact ? "pagination-current-nav bad compact" : "pagination-current-nav bad"} aria-label="Broken pagination">
        <button type="button" className="demo-button small">Previous</button>
        {info.compact ? (
          <span className="pagination-current-arrow-gap">?</span>
        ) : (
          info.pages.map((page) => page === "..." ? (
            <span className="pagination-ellipsis" aria-hidden="true" key={page}>...</span>
          ) : (
            <button
              type="button"
              key={page}
              className={markedCurrent(page) ? "page-button is-current ambiguous" : "page-button"}
              aria-current={info.multiple && (page === "2" || page === "3") ? "page" : undefined}
            >
              {page}
            </button>
          ))
        )}
        <button type="button" className="demo-button small">Next</button>
      </nav>
      <section className="pagination-current-results bad">
        <h4>{info.range}</h4>
        <p>{info.status}</p>
        {mode === "emptyStalePage" ? (
          <div className="pagination-current-empty">No records, no page correction, no Page 1 recovery.</div>
        ) : (
          ["Audit event", "Access log", "Policy check"].map((row) => (
            <button type="button" className="pattern-row" key={row}>{row} - page ownership unclear</button>
          ))
        )}
      </section>
      <p className="pagination-current-note bad">{info.note}</p>
    </div>
  );
}

function PaginationCurrentPageGoodUx() {
  const [mode, setMode] = useState<PaginationCurrentPageMode>("currentMarker");
  const status: Record<PaginationCurrentPageMode, string> = {
    currentMarker: "Page 3 is current visually, textually, and programmatically.",
    resultRange: "Result range, URL, and current page agree.",
    firstEdge: "Previous is unavailable because Page 1 is current.",
    lastEdge: "Next is unavailable because the last page is current.",
    loadingCommit: "Loading keeps current-page ownership explicit until commit.",
    filterReset: "Filter changes return to a valid Page 1 and announce why.",
    outOfRange: "Stale page recovered to the last valid page.",
    cursorRange: "Cursor pagination exposes current range instead of pretending page numbers exist.",
    mobileCompact: "Compact mobile controls preserve Page x of y text.",
    duplicatePagination: "Top and bottom pagination controls agree on Page 3."
  };

  return (
    <div className="quality-example pagination-current-demo">
      <PaginationCurrentPageGoodPanel mode={mode} />
      <div className="pagination-current-controls" aria-label="Pagination current-page states">
        {paginationCurrentGoodModes.map((item) => (
          <button type="button" className={item.mode === mode ? "demo-button small primary" : "demo-button small"} key={item.mode} onClick={() => setMode(item.mode)}>
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{status[mode]}</p>
    </div>
  );
}

function PaginationCurrentPageBadUx() {
  const [mode, setMode] = useState<PaginationCurrentPageBadMode>("noCurrent");
  const status: Record<PaginationCurrentPageBadMode, string> = {
    noCurrent: "No current page is exposed.",
    colorOnly: "Current page relies on color only.",
    staleLoading: "Loading left a stale current marker.",
    rangeMismatch: "Range, URL, and highlighted page disagree.",
    multipleCurrent: "Multiple current pages are exposed.",
    activeEdges: "Unavailable edge controls appear active.",
    mobileArrowsOnly: "Mobile arrows hide page position.",
    emptyStalePage: "A stale empty page has no valid-page recovery."
  };

  return (
    <div className="quality-example pagination-current-demo pagination-current-bad-ux">
      <PaginationCurrentPageBadPanel mode={mode} />
      <div className="pagination-current-controls" aria-label="Broken pagination current-page states">
        {paginationCurrentBadModes.map((item) => (
          <button type="button" className={item.mode === mode ? "demo-button small primary" : "demo-button small"} key={item.mode} onClick={() => setMode(item.mode)}>
            {item.label}
          </button>
        ))}
      </div>
      <p className="demo-status" aria-live="polite">{status[mode]}</p>
    </div>
  );
}

function MenubarGoodUi() {
  return (
    <div className="quality-example menubar-demo" aria-label="Accessible application menubar preview">
      <div className="editor-canvas-preview">
        <strong>Quarterly plan.doc</strong>
        <span>Editor canvas</span>
      </div>
      <div className="app-menubar" role="menubar" aria-label="Editor commands">
        {["File", "Edit", "View", "Insert"].map((item) => (
          <button
            type="button"
            role="menuitem"
            aria-haspopup={item === "View" ? "menu" : undefined}
            aria-expanded={item === "View" ? "true" : undefined}
            className={item === "View" ? "is-active" : ""}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="menubar-submenu" role="menu" aria-label="View commands">
        <button type="button" role="menuitemcheckbox" aria-checked="true" className="menubar-menuitem is-checked">Show comments</button>
        <button type="button" role="menuitemcheckbox" aria-checked="false" className="menubar-menuitem">Show rulers</button>
        <div role="separator" className="menubar-separator"></div>
        <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="true" className="menubar-menuitem is-active">Theme</button>
        <button type="button" role="menuitem" aria-disabled="true" className="menubar-menuitem is-disabled">Enter full screen unavailable</button>
      </div>
      <div className="menubar-nested-menu" role="menu" aria-label="Theme commands">
        <button type="button" role="menuitemradio" aria-checked="true" className="menubar-menuitem is-checked">Light</button>
        <button type="button" role="menuitemradio" aria-checked="false" className="menubar-menuitem">High contrast</button>
      </div>
      <p className="demo-status">Persistent command groups, open submenu, checked state, disabled item, and nested submenu are exposed as menu items.</p>
    </div>
  );
}

function MenubarBadUi() {
  return (
    <div className="bad-ui-sample menubar-bad-ui" aria-label="Broken menubar preview">
      <div className="app-menubar bad" role="menubar" aria-label="Site links mislabeled as commands">
        {["Home", "Products", "Blog", "Pricing", "Sign out"].map((item) => <a href="#bad-menubar-link" key={item}>{item}</a>)}
      </div>
      <div className="menubar-submenu bad">
        <input aria-label="Search inside menu" placeholder="Search" />
        <label><input type="checkbox" readOnly /> Dark mode</label>
        <button type="button">Delete account</button>
        <span>Hidden submenu still receives focus</span>
      </div>
      <p className="demo-status">Site links, form controls, account actions, and stale hidden focus are presented as a desktop menubar.</p>
    </div>
  );
}

type MenubarCommand = {
  id: string;
  label: string;
  detail: string;
  disabled?: boolean;
  checked?: boolean;
  hasSubmenu?: boolean;
};

function MenubarGoodUx() {
  const topItems = ["File", "Edit", "View", "Insert", "Format"];
  const commandMap: Record<string, MenubarCommand[]> = {
    File: [
      { id: "save", label: "Save", detail: "Saves the current document." },
      { id: "rename", label: "Rename...", detail: "Opens a dialog and returns focus to File." },
      { id: "export", label: "Export PDF", detail: "Creates a downloadable PDF." }
    ],
    Edit: [
      { id: "undo", label: "Undo", detail: "Reverses the last edit." },
      { id: "paste", label: "Paste", detail: "Unavailable until clipboard content exists.", disabled: true },
      { id: "find", label: "Find in document", detail: "Moves focus to find." }
    ],
    View: [
      { id: "comments", label: "Show comments", detail: "Toggles comment visibility.", checked: true },
      { id: "rulers", label: "Show rulers", detail: "Toggles ruler display.", checked: false },
      { id: "theme", label: "Theme", detail: "Opens a nested submenu.", hasSubmenu: true },
      { id: "fullscreen", label: "Enter full screen", detail: "Unavailable in embedded preview.", disabled: true }
    ],
    Insert: [
      { id: "table", label: "Table", detail: "Inserts a table." },
      { id: "image", label: "Image", detail: "Opens file picker after activation." },
      { id: "link", label: "Link", detail: "Creates a text link." }
    ],
    Format: [
      { id: "bold", label: "Bold", detail: "Toggles bold text.", checked: false },
      { id: "italic", label: "Italic", detail: "Toggles italic text.", checked: false },
      { id: "clear", label: "Clear formatting", detail: "Removes selected formatting." }
    ]
  };
  const themeItems = ["Light", "Dark", "High contrast"];
  const [topIndex, setTopIndex] = useState(0);
  const [openMenu, setOpenMenu] = useState("File");
  const [activeIndex, setActiveIndex] = useState(0);
  const [nestedOpen, setNestedOpen] = useState(false);
  const [comments, setComments] = useState(true);
  const [theme, setTheme] = useState("Light");
  const [status, setStatus] = useState("File menu is open; focus is on Save.");
  const [history, setHistory] = useState<string[]>(["Editor canvas ready"]);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const topRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeTop = topItems[topIndex];
  const commands = commandMap[openMenu] ?? [];
  const activeCommand = commands[activeIndex] ?? commands[0];

  function focusTop(index: number) {
    window.setTimeout(() => topRefs.current[index]?.focus(), 0);
  }

  function moveTop(delta: number) {
    const next = (topIndex + delta + topItems.length) % topItems.length;
    setTopIndex(next);
    setOpenMenu(topItems[next]);
    setActiveIndex(0);
    setNestedOpen(false);
    setStatus(`${topItems[next]} focused; submenu opened at first command.`);
    focusTop(next);
  }

  function openCurrentMenu() {
    setOpenMenu(activeTop);
    setActiveIndex(0);
    setNestedOpen(false);
    setStatus(`${activeTop} submenu opened; focus moved to first command.`);
  }

  function moveCommand(delta: number) {
    setActiveIndex((current) => {
      const list = commandMap[openMenu] ?? [];
      if (list.length === 0) return current;
      const next = (current + delta + list.length) % list.length;
      setStatus(`${list[next].label} focused in ${openMenu}.`);
      return next;
    });
  }

  function activateCommand() {
    if (!activeCommand) return;
    if (activeCommand.disabled) {
      setStatus(`${activeCommand.label} is visible but disabled, so it cannot activate.`);
      setHistory([`${activeCommand.label} unavailable in current context`]);
      return;
    }
    if (activeCommand.hasSubmenu) {
      setNestedOpen(true);
      setStatus("Theme submenu opened from View.");
      setHistory(["Nested Theme submenu is open"]);
      return;
    }
    if (activeCommand.id === "comments") {
      setComments((value) => !value);
      setStatus(`Show comments ${comments ? "unchecked" : "checked"}; menu remains open.`);
      setHistory([`Show comments state is now ${comments ? "off" : "on"}`]);
      return;
    }
    setOpenMenu("");
    setNestedOpen(false);
    setStatus(`${activeCommand.label} activated; focus returned to editor canvas.`);
    setHistory([`${activeCommand.label} command executed`]);
    window.setTimeout(() => canvasRef.current?.focus(), 0);
  }

  function chooseTheme(value: string) {
    setTheme(value);
    setNestedOpen(false);
    setOpenMenu("");
    setStatus(`${value} theme selected; focus returned to editor canvas.`);
    setHistory([`Theme set to ${value}`]);
    window.setTimeout(() => canvasRef.current?.focus(), 0);
  }

  function escapeClose() {
    setNestedOpen(false);
    setOpenMenu("");
    setStatus("Escape closed all menus and returned focus to the editor canvas.");
    window.setTimeout(() => canvasRef.current?.focus(), 0);
  }

  function handleTopKey(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTop(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTop(-1);
    } else if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setTopIndex(index);
      setOpenMenu(topItems[index]);
      setActiveIndex(0);
      setStatus(`${topItems[index]} submenu opened from keyboard.`);
    } else if (event.key === "Escape") {
      event.preventDefault();
      escapeClose();
    }
  }

  return (
    <div className="quality-example menubar-demo">
      <div ref={canvasRef} className="editor-canvas-preview" tabIndex={-1}>
        <strong>Quarterly plan.doc</strong>
        <span>Theme: {theme}; comments {comments ? "visible" : "hidden"}</span>
      </div>
      <div className="app-menubar" role="menubar" aria-label="Editor commands">
        {topItems.map((item, index) => (
          <button
            ref={(node) => { topRefs.current[index] = node; }}
            type="button"
            role="menuitem"
            key={item}
            tabIndex={index === topIndex ? 0 : -1}
            aria-haspopup="menu"
            aria-expanded={openMenu === item}
            className={openMenu === item ? "is-active" : ""}
            onClick={() => {
              setTopIndex(index);
              setOpenMenu(item);
              setActiveIndex(0);
              setNestedOpen(false);
              setStatus(`${item} submenu opened from pointer.`);
            }}
            onKeyDown={(event) => handleTopKey(event, index)}
          >
            {item}
          </button>
        ))}
      </div>
      {openMenu && (
        <div className="menubar-menu-stage">
          <div className="menubar-submenu" role="menu" aria-label={`${openMenu} commands`}>
            {commands.map((command, index) => {
              const checked = command.id === "comments" ? comments : command.checked;
              const role = command.id === "comments" || command.id === "rulers" || command.id === "bold" || command.id === "italic" ? "menuitemcheckbox" : "menuitem";
              return (
                <button
                  type="button"
                  key={command.id}
                  role={role}
                  tabIndex={index === activeIndex ? 0 : -1}
                  aria-checked={role === "menuitemcheckbox" ? Boolean(checked) : undefined}
                  aria-disabled={command.disabled ? "true" : undefined}
                  aria-haspopup={command.hasSubmenu ? "menu" : undefined}
                  aria-expanded={command.hasSubmenu ? nestedOpen : undefined}
                  className={[
                    "menubar-menuitem",
                    index === activeIndex ? "is-active" : "",
                    checked ? "is-checked" : "",
                    command.disabled ? "is-disabled" : "",
                    command.hasSubmenu ? "has-submenu" : ""
                  ].filter(Boolean).join(" ")}
                  onClick={() => {
                    setActiveIndex(index);
                    window.setTimeout(activateCommand, 0);
                  }}
                >
                  <span>{command.label}</span>
                  <small>{command.detail}</small>
                </button>
              );
            })}
          </div>
          {nestedOpen && (
            <div className="menubar-nested-menu" role="menu" aria-label="Theme commands">
              {themeItems.map((item) => (
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={theme === item}
                  className={theme === item ? "menubar-menuitem is-checked" : "menubar-menuitem"}
                  key={item}
                  onClick={() => chooseTheme(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="demo-row">
        <button type="button" className="demo-button small" onClick={() => moveTop(1)}>Right Arrow</button>
        <button type="button" className="demo-button small" onClick={openCurrentMenu}>Down Arrow</button>
        <button type="button" className="demo-button small" onClick={() => moveCommand(1)}>Move command</button>
        <button type="button" className="demo-button small" onClick={activateCommand}>Activate focused</button>
        <button type="button" className="demo-button small" onClick={() => { setTopIndex(2); setOpenMenu("View"); setActiveIndex(2); setNestedOpen(true); setStatus("Theme submenu opened from View."); }}>Open Theme</button>
        <button type="button" className="demo-button small" onClick={escapeClose}>Escape</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
      <ol className="state-history menubar-history" aria-label="Menubar command history">
        {history.map((entry) => <li key={entry}>{entry}</li>)}
      </ol>
    </div>
  );
}

function MenubarBadUx() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [status, setStatus] = useState("Site navigation is mislabeled as a menubar, but Arrow keys do not manage focus.");

  return (
    <div className="quality-example menubar-bad-demo">
      <div className="app-menubar bad" role="menubar" aria-label="Broken command bar">
        {["Home", "Products", "Blog", "Pricing", "Sign out"].map((item) => (
          <a
            href="#broken-menubar"
            role="menuitem"
            key={item}
            aria-haspopup={item === "Products" ? "menu" : undefined}
            aria-expanded={item === "Products" ? expanded : undefined}
            onClick={(event) => {
              event.preventDefault();
              setOpen((value) => !value);
              setStatus(`${item} clicked like a link; command focus and submenu ownership are still undefined.`);
            }}
          >
            {item}
          </a>
        ))}
      </div>
      {open && (
        <div className="menubar-submenu bad" aria-label="Broken submenu">
          <input aria-label="Search field inside submenu" placeholder="Search products" />
          <label><input type="checkbox" readOnly /> Dark mode</label>
          <button type="button" onClick={() => setStatus("Delete account ran from a navigation submenu without consequence review.")}>Delete account</button>
          <button type="button" disabled>Export</button>
        </div>
      )}
      <div className="demo-row">
        <button type="button" className="demo-button small" onClick={() => setStatus("Right Arrow scrolls or does nothing because no roving focus is implemented.")}>Try Right Arrow</button>
        <button type="button" className="demo-button small" onClick={() => { setOpen(false); setStatus("Submenu hidden visually, but stale expanded state remains true."); }}>Hide submenu</button>
        <button type="button" className="demo-button small" onClick={() => { setExpanded(false); setStatus("aria-expanded changed without matching the visible submenu state."); }}>Desync expanded</button>
      </div>
      <p className="demo-status" aria-live="polite">{status}</p>
    </div>
  );
}

function AccordionGoodUx({ meta }: { meta: PatternMeta }) {
  const sectionCopy: Record<string, { body: string; summary: string }> = {
    Eligibility: {
      body: "Unused items can be returned within 30 days when the order number matches the receipt.",
      summary: "Applies to most unused items"
    },
    "Proof needed": {
      body: "Attach the order receipt and one photo of the packaged item before submitting the return.",
      summary: "1 missing"
    },
    "Refund timing": {
      body: "Refunds are sent to the original payment method within five working days after inspection.",
      summary: "5 working days"
    },
    Exceptions: {
      body: "Final-sale items, opened hygiene products, and custom orders need support review before return.",
      summary: "Support review"
    }
  };
  const [openSections, setOpenSections] = useState<Set<string>>(() => new Set(["Eligibility"]));
  const [focused, setFocused] = useState(0);
  const [message, setMessage] = useState("Eligibility is open. Section headings remain visible and each button exposes expanded state.");
  const [proofNote, setProofNote] = useState("Receipt image pending");
  const focusedSection = meta.options[focused] ?? meta.options[0];

  function toggleSection(section: string) {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(section)) {
        next.delete(section);
        setMessage(`${section} collapsed; its label and summary remain visible.`);
      } else {
        next.add(section);
        setMessage(`${section} expanded; content appears directly after the heading button.`);
      }
      return next;
    });
  }

  function expandAll() {
    setOpenSections(new Set(meta.options));
    setMessage("All policy sections expanded without losing field values or scroll context.");
  }

  function collapseAll() {
    setOpenSections(new Set());
    setMessage("All sections collapsed; hidden issue summaries remain on their section headers.");
  }

  function moveFocus(delta: 1 | -1) {
    setFocused((current) => {
      const next = (current + delta + meta.options.length) % meta.options.length;
      setMessage(`${meta.options[next]} header focused with arrow-key style movement.`);
      return next;
    });
  }

  function openErrorSection() {
    const section = "Proof needed";
    setFocused(meta.options.indexOf(section));
    setOpenSections((current) => new Set([...current, section]));
    setMessage("Validation link opened Proof needed and kept the missing receipt note visible.");
  }

  return (
    <div className="quality-example accordion-demo">
      <div className="accordion-toolbar-preview">
        <strong>{meta.subject}</strong>
        <div className="demo-row">
          <button type="button" className="demo-button small" onClick={expandAll}>Expand all</button>
          <button type="button" className="demo-button small" onClick={collapseAll}>Collapse all</button>
          <button type="button" className="demo-button small" onClick={openErrorSection}>Open error section</button>
        </div>
      </div>
      <div className="accordion-list-preview" aria-label={meta.field}>
        {meta.options.map((section, index) => {
          const expanded = openSections.has(section);
          const panelId = `accordion-live-${section.toLowerCase().replace(/\s+/g, "-")}`;
          const headingId = `${panelId}-button`;
          const focusedClass = focused === index ? "is-focused" : "";
          return (
            <section className={["accordion-section", expanded ? "is-open" : "", focusedClass].filter(Boolean).join(" ")} key={section}>
              <h4>
                <button
                  id={headingId}
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  aria-label={`${section}, ${expanded ? "expanded" : "collapsed"}, ${sectionCopy[section]?.summary}`}
                  onClick={() => toggleSection(section)}
                >
                  <span>{section}</span>
                  <em>{sectionCopy[section]?.summary}</em>
                </button>
              </h4>
              {expanded && (
                <div id={panelId} className="accordion-panel-preview" aria-labelledby={headingId}>
                  <p>{sectionCopy[section]?.body}</p>
                  {section === "Proof needed" && (
                    <label>
                      <span>Receipt status</span>
                      <input value={proofNote} onChange={(event) => {
                        setProofNote(event.target.value);
                        setMessage("Proof note changed and will remain when other sections open or close.");
                      }} />
                    </label>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
      <div className="demo-row accordion-controls">
        <button type="button" className="demo-button small" onClick={() => moveFocus(-1)}>Arrow up</button>
        <button type="button" className="demo-button small" onClick={() => moveFocus(1)}>Arrow down</button>
        <button type="button" className="demo-button small primary" onClick={() => toggleSection(focusedSection)}>Enter / Space toggle</button>
        <button type="button" className="demo-button small" onClick={() => {
          setFocused(0);
          setMessage("Home moved focus to the first accordion heading.");
        }}>Home</button>
        <button type="button" className="demo-button small" onClick={() => {
          setFocused(meta.options.length - 1);
          setMessage("End moved focus to the last accordion heading.");
        }}>End</button>
      </div>
      <p className="demo-status" aria-live="polite">{message}</p>
    </div>
  );
}

function AccordionBadUx({ meta }: { meta: PatternMeta }) {
  type BadMode = "iconOnly" | "hiddenError" | "singleOpenLoss" | "mixedNavigation" | "stateLoss" | "vagueLabels";
  const [mode, setMode] = useState<BadMode>("iconOnly");
  const copy: Record<BadMode, string> = {
    iconOnly: "Section controls are plus icons with no names, button semantics, or expanded state.",
    hiddenError: "The missing receipt error is inside a collapsed panel with no header summary.",
    singleOpenLoss: "Opening Refund timing closes Proof needed and drops the receipt value.",
    mixedNavigation: "Some rows expand content while another row navigates to a separate page.",
    stateLoss: "Collapsed content is removed and the user's typed note disappears.",
    vagueLabels: "Labels such as More and Details force users to open every section to understand the page."
  };
  const rows = mode === "vagueLabels"
    ? ["More", "Details", "Information", "Other"]
    : meta.options;

  return (
    <div className="quality-example accordion-bad-demo">
      <div className={`accordion-list-preview bad is-${mode}`} aria-label="Broken accordion">
        {rows.map((section, index) => (
          <section className="accordion-section bad" key={`${section}-${index}`}>
            <h4>
              <button
                type="button"
                onClick={() => setMode(index === 2 ? "singleOpenLoss" : mode)}
              >
                <span>{mode === "iconOnly" ? "+" : section}</span>
                <em>{mode === "hiddenError" && section === "Proof needed" ? "" : mode === "mixedNavigation" && section === "Exceptions" ? "opens page" : ""}</em>
              </button>
            </h4>
            {((mode === "stateLoss" && index === 0) || (mode === "mixedNavigation" && index === 3)) && (
              <div className="accordion-panel-preview bad">
                {mode === "mixedNavigation" ? "This row navigates instead of expanding like the others." : "Typed proof note cleared after collapse."}
              </div>
            )}
          </section>
        ))}
      </div>
      <div className="accordion-panel-bad">
        <strong>{mode === "hiddenError" ? "Error hidden" : mode === "stateLoss" ? "State lost" : "Broken accordion"}</strong>
        <span>{copy[mode]}</span>
      </div>
      <div className="demo-row accordion-controls">
        <button type="button" className={mode === "iconOnly" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("iconOnly")}>Icon only</button>
        <button type="button" className={mode === "hiddenError" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenError")}>Hidden error</button>
        <button type="button" className={mode === "singleOpenLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("singleOpenLoss")}>Single-open loss</button>
        <button type="button" className={mode === "mixedNavigation" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("mixedNavigation")}>Mixed navigation</button>
        <button type="button" className={mode === "stateLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("stateLoss")}>State loss</button>
        <button type="button" className={mode === "vagueLabels" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("vagueLabels")}>Vague labels</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function NavigationGoodUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  const [active, setActive] = useState(meta.options[0]);
  const [focused, setFocused] = useState(meta.options[0]);

  if (patternId === "menu-menubar") return <MenubarGoodUx />;
  if (patternId === "accordion") return <AccordionGoodUx meta={meta} />;

  if (patternId === "in-page-anchor-navigation") {
    const [hash, setHash] = useState(`#${meta.options[0].toLowerCase().replace(/\s+/g, "-")}`);
    const headingRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
    const jumpToSection = (item: string) => {
      setActive(item);
      setFocused(item);
      setHash(`#${item.toLowerCase().replace(/\s+/g, "-")}`);
      window.requestAnimationFrame(() => {
        headingRefs.current[item]?.focus();
      });
    };

    return (
      <div className="quality-example in-page-anchor-demo">
        <div className="in-page-anchor-layout">
          <nav className="in-page-anchor-nav" aria-label="On this page">
            <strong>On this page</strong>
            {meta.options.map((item) => {
              const selected = active === item;
              return (
                <a
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  key={item}
                  className={selected ? "is-active" : ""}
                  aria-current={selected ? "location" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    jumpToSection(item);
                  }}
                >
                  {item}
                </a>
              );
            })}
          </nav>
          <div className="in-page-article-preview" aria-label="Long page sections">
            {meta.options.map((item) => (
              <section key={item} className={active === item ? "is-current-section" : ""}>
                <h4
                  ref={(node) => {
                    headingRefs.current[item] = node;
                  }}
                  tabIndex={-1}
                >
                  {item}
                </h4>
                <p>
                  {active === item
                    ? `${item} is the active section; focus marker moved to this heading.`
                    : "This section remains on the same page and can be reached from the contents list."}
                </p>
              </section>
            ))}
          </div>
        </div>
        <p className="demo-status" aria-live="polite">Hash {hash}; focus target: {focused} heading.</p>
      </div>
    );
  }

  if (patternId === "back-link") {
    const [stepIndex, setStepIndex] = useState(1);
    const [answers, setAnswers] = useState<Record<string, string>>({
      Eligibility: "Lives in England",
      "Contact details": "alex@example.gov",
      "Review answers": "Ready to check"
    });
    const [status, setStatus] = useState("Contact details restored with the email already entered.");
    const step = meta.options[stepIndex] ?? meta.options[0];
    const previousStep = meta.options[Math.max(0, stepIndex - 1)];
    const value = answers[step] ?? "";
    const canGoBack = stepIndex > 0;
    const goBack = () => {
      if (!canGoBack) return;
      const targetIndex = stepIndex - 1;
      const target = meta.options[targetIndex];
      setStepIndex(targetIndex);
      setStatus(`${target} restored in its last-seen state: ${answers[target] || "no answer yet"}.`);
    };
    const goForward = () => {
      const nextIndex = Math.min(meta.options.length - 1, stepIndex + 1);
      const next = meta.options[nextIndex];
      setStepIndex(nextIndex);
      setStatus(`${next} opened; Back will return to ${step}.`);
    };

    return (
      <div className="quality-example back-link-demo">
        <div className="back-link-page-preview">
          {canGoBack ? (
            <a
              href={`#${previousStep.toLowerCase().replace(/\s+/g, "-")}`}
              className="back-link-control"
              aria-label={stepIndex > 2 ? `Back to ${previousStep}` : "Back"}
              onClick={(event) => {
                event.preventDefault();
                goBack();
              }}
            >
              {stepIndex > 2 ? `Back to ${previousStep}` : "Back"}
            </a>
          ) : (
            <span className="back-link-placeholder">No previous step</span>
          )}
          <div className="back-link-form-preview">
            <span className="demo-status">Step {stepIndex + 1} of {meta.options.length}</span>
            <strong>{step}</strong>
            <label>
              <span>{step === "Eligibility" ? "Eligibility answer" : step === "Contact details" ? "Email address" : "Saved answer"}</span>
              <input
                value={value}
                onChange={(event) => setAnswers((current) => ({ ...current, [step]: event.target.value }))}
              />
            </label>
            <div className="demo-row">
              <button type="button" className="demo-button small primary" onClick={goForward}>Continue</button>
              <button
                type="button"
                className="demo-button small"
                onClick={() => setAnswers((current) => ({ ...current, [step]: `${value} updated`.trim() }))}
              >
                Update answer
              </button>
            </div>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{status}</p>
      </div>
    );
  }

  if (patternId === "step-navigation") {
    const [stepIndex, setStepIndex] = useState(0);
    const [completed, setCompleted] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({
      Eligibility: "Eligible for support",
      "Contact details": "alex@example.gov",
      Documents: "Passport uploaded",
      Review: "Ready to review",
      Submit: "Not submitted yet"
    });
    const [message, setMessage] = useState("Eligibility is current. Future steps are locked until prerequisites are valid.");
    const currentStep = meta.options[stepIndex];
    const maxAllowed = Math.min(meta.options.length - 1, completed.length);
    const currentAnswer = answers[currentStep] ?? "";
    const goToStep = (index: number) => {
      const step = meta.options[index];
      if (index > maxAllowed) {
        setMessage(`${step} is locked until earlier required steps are complete.`);
        return;
      }
      setStepIndex(index);
      setErrors((current) => current.filter((item) => item !== step));
      setMessage(`${step} reopened with saved answer: ${answers[step] || "none yet"}.`);
    };
    const continueFromStep = () => {
      if (currentAnswer.trim().length < 3) {
        setErrors((current) => Array.from(new Set([...current, currentStep])));
        setMessage(`${currentStep} needs a valid answer before the next step unlocks.`);
        return;
      }
      setCompleted((current) => Array.from(new Set([...current, currentStep])));
      setErrors((current) => current.filter((item) => item !== currentStep));
      if (stepIndex < meta.options.length - 1) {
        const nextStep = meta.options[stepIndex + 1];
        setStepIndex(stepIndex + 1);
        setMessage(`${currentStep} is complete. ${nextStep} is now current.`);
      } else {
        setMessage("All steps are validated and ready to submit.");
      }
    };

    return (
      <div className="quality-example step-navigation-demo">
        <div className="step-navigation-preview">
          <ol className="step-indicator interactive" aria-label="Application progress">
            {meta.options.map((item, index) => {
              const state = errors.includes(item)
                ? "error"
                : index === stepIndex
                  ? "current"
                  : completed.includes(item)
                    ? "complete"
                    : "upcoming";
              const locked = index > maxAllowed;
              return (
                <li className={`step-item ${state} ${locked ? "locked" : ""}`} key={item}>
                  <button
                    type="button"
                    aria-current={state === "current" ? "step" : undefined}
                    aria-disabled={locked}
                    onClick={() => goToStep(index)}
                  >
                    <span className="step-marker">{state === "complete" ? "OK" : index + 1}</span>
                    <span>{item}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="step-card-preview">
            <span className="demo-status">Step {stepIndex + 1} of {meta.options.length}</span>
            <strong>{currentStep}</strong>
            <label>
              <span>{errors.includes(currentStep) ? "Required answer - fix before continuing" : "Saved answer"}</span>
              <input
                value={currentAnswer}
                aria-invalid={errors.includes(currentStep) ? "true" : undefined}
                onChange={(event) => setAnswers((current) => ({ ...current, [currentStep]: event.target.value }))}
              />
            </label>
            <div className="demo-row">
              <button type="button" className="demo-button small primary" onClick={continueFromStep}>Continue</button>
              <button
                type="button"
                className="demo-button small"
                onClick={() => {
                  setAnswers((current) => ({ ...current, [currentStep]: "" }));
                  setMessage(`${currentStep} answer cleared; Continue should show an error instead of completing the step.`);
                }}
              >
                Clear answer
              </button>
            </div>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "process-list") {
    const [openStep, setOpenStep] = useState(0);
    const [view, setView] = useState("standalone overview");
    const [message, setMessage] = useState("Standalone process overview shows a clear start, end, and ordered task links.");
    const detailByStep: Record<string, Array<{ label: string; note: string }>> = {
      "Check eligibility": [
        { label: "Check if this permit applies to you", note: "Guidance" },
        { label: "Choose the resident or business route", note: "or branch" }
      ],
      "Prepare documents": [
        { label: "Upload proof of address", note: "Online task" },
        { label: "Book an identity check", note: "Offline appointment" }
      ],
      "Submit application": [
        { label: "Start the application form", note: "Transaction" },
        { label: "Review evidence rules", note: "Guidance" }
      ],
      "Pay the fee": [
        { label: "Pay the application fee", note: "$50 cost" },
        { label: "Request a fee waiver", note: "or branch" }
      ],
      "Track the decision": [
        { label: "Check decision times", note: "Guidance" },
        { label: "Contact permit support", note: "External service" }
      ]
    };
    const openCurrentPage = () => {
      setView(`${meta.options[openStep]} content page`);
      setMessage(`Opened a related content page; a link returns to the standalone process overview without claiming progress.`);
    };

    return (
      <div className="quality-example process-list-demo">
        <div className="process-list-preview">
          <div className="process-context-bar">
            <strong>{view}</strong>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setView("standalone overview");
                setMessage("Returned to the standalone process overview.");
              }}
            >
              Process overview
            </button>
          </div>
          <p className="process-intro">Apply for a permit from eligibility through decision tracking. Some steps include offline or alternative routes.</p>
          <ol className="process-list">
            {meta.options.map((item, index) => {
              const expanded = openStep === index;
              return (
                <li className={expanded ? "is-expanded" : ""} key={item}>
                  <button
                    type="button"
                    className="process-step-heading"
                    aria-expanded={expanded}
                    onClick={() => {
                      setOpenStep(index);
                      setMessage(`${item} expanded; task links explain what to do without marking the process complete.`);
                    }}
                  >
                    <span>{index + 1}</span>
                    <strong>{item}</strong>
                  </button>
                  {expanded && (
                    <div className="process-step-card">
                      {(detailByStep[item] ?? []).map((detail) => (
                        <button
                          type="button"
                          key={detail.label}
                          onClick={() => {
                            setView(`${item} task`);
                            setMessage(`${detail.label} opened as ${detail.note.toLowerCase()}; the process list remains journey guidance.`);
                          }}
                        >
                          <span>{detail.label}</span>
                          <em>{detail.note}</em>
                        </button>
                      ))}
                      <button type="button" className="demo-button small" onClick={openCurrentPage}>Open related content page</button>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "navigation-drawer") {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [status, setStatus] = useState("Drawer closed. Focus starts on the menu button.");
    const [visits, setVisits] = useState<Record<string, number>>({
      Inbox: 12,
      Starred: 3,
      Sent: 5,
      Drafts: 2,
      Settings: 1
    });
    const closeDrawer = (message: string) => {
      setDrawerOpen(false);
      setStatus(message);
    };
    const selectDestination = (item: string) => {
      setActive(item);
      setVisits((current) => ({ ...current, [item]: (current[item] ?? 0) + 1 }));
      closeDrawer(`${item} selected; drawer closed and content is visible.`);
    };

    return (
      <div className="quality-example drawer-demo">
        <div className={drawerOpen ? "drawer-frame is-open" : "drawer-frame"}>
          <div className="drawer-top-bar">
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
              onClick={() => {
                setDrawerOpen(true);
                setStatus("Drawer opened; focus moves into the navigation sheet.");
              }}
            >
              Menu
            </button>
            <strong>Mail</strong>
          </div>
          {drawerOpen && <button type="button" className="drawer-scrim" aria-label="Close navigation drawer" onClick={() => closeDrawer("Drawer dismissed with scrim; focus returns to menu.")}></button>}
          {drawerOpen && (
            <nav className="drawer-sheet" aria-label="Mail navigation">
              <strong>Mail folders</strong>
              {meta.options.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={active === item ? "is-current" : ""}
                  aria-current={active === item ? "page" : undefined}
                  onClick={() => selectDestination(item)}
                >
                  {item}
                </button>
              ))}
              <hr />
              <button type="button" onClick={() => closeDrawer("Drawer closed without changing destination.")}>Close drawer</button>
            </nav>
          )}
          <div className="drawer-page-preview">
            <strong>{active}</strong>
            <span>{active} preserved count: {visits[active] ?? 0}</span>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{status}</p>
      </div>
    );
  }

  if (patternId === "side-navigation") {
    const [expanded, setExpanded] = useState(true);
    const [visitCounts, setVisitCounts] = useState<Record<string, number>>({
      Account: 1,
      Billing: 2,
      "Access keys": 4,
      "Audit log": 7
    });
    const isSecurityChild = active === "Audit log" || active === "Access keys";
    const hiddenCurrent = isSecurityChild && !expanded;
    const selectPage = (item: string) => {
      setActive(item);
      if (item === "Audit log" || item === "Access keys") setExpanded(true);
      setVisitCounts((current) => ({ ...current, [item]: (current[item] ?? 0) + 1 }));
    };

    return (
      <div className="quality-example side-nav-demo">
        <div className="side-nav-layout-preview">
          <nav className="side-nav-panel" aria-label="Settings side navigation">
            <strong>Settings</strong>
            {["Account", "Billing"].map((item) => (
              <button
                type="button"
                key={item}
                className={active === item ? "is-current" : ""}
                aria-current={active === item ? "page" : undefined}
                onClick={() => selectPage(item)}
              >
                {item}
              </button>
            ))}
            <div className="side-nav-group">
              <button
                type="button"
                className={isSecurityChild ? "is-parent is-active-parent" : "is-parent"}
                aria-expanded={expanded}
                onClick={() => setExpanded((open) => !open)}
              >
                Security
              </button>
              {expanded && ["Access keys", "Audit log"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={active === item ? "is-current" : ""}
                  aria-current={active === item ? "page" : undefined}
                  onClick={() => selectPage(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>
          <div className="side-nav-content-preview">
            <strong>{active}</strong>
            <span>{active} visits preserved: {visitCounts[active] ?? 0}</span>
            <button type="button" className="demo-button small" onClick={() => selectPage("Audit log")}>Deep link to Audit log</button>
          </div>
        </div>
        <p className={hiddenCurrent ? "demo-error compact" : "demo-status"} aria-live="polite">
          {hiddenCurrent ? `${active} is current but hidden; reopen Security to restore orientation.` : `${active} is current and its side-nav context is visible.`}
        </p>
      </div>
    );
  }

  if (patternId === "header") {
    const [overflowOpen, setOverflowOpen] = useState(false);
    const [selectionMode, setSelectionMode] = useState(false);
    const actionByView: Record<string, string> = {
      Details: "Share",
      Files: "Upload",
      Activity: "Filter"
    };
    const action = actionByView[active] ?? "Share";

    return (
      <div className="quality-example top-app-bar-demo">
        <div className="top-app-bar-preview">
          <header className={selectionMode ? "top-app-bar contextual" : "top-app-bar"}>
            <button type="button" aria-label={selectionMode ? "Clear selection" : "Back to projects"} onClick={() => selectionMode ? setSelectionMode(false) : setActive("Details")}>
              {selectionMode ? "Clear" : "Back"}
            </button>
            <strong>{selectionMode ? "3 selected" : `Project Apollo: ${active}`}</strong>
            <div className="top-app-bar-actions" aria-label={selectionMode ? "Selection actions" : `${active} actions`}>
              {selectionMode ? (
                <>
                  <button type="button">Archive</button>
                  <button type="button">Move</button>
                </>
              ) : (
                <>
                  <button type="button">{action}</button>
                  <button type="button" aria-expanded={overflowOpen} onClick={() => setOverflowOpen((open) => !open)}>More</button>
                </>
              )}
            </div>
          </header>
          {overflowOpen && !selectionMode && (
            <div className="top-app-bar-overflow" role="menu" aria-label={`${active} secondary actions`}>
              <button type="button" role="menuitem" onClick={() => setOverflowOpen(false)}>Copy link</button>
              <button type="button" role="menuitem" onClick={() => setOverflowOpen(false)}>View history</button>
              <button type="button" role="menuitem" onClick={() => setOverflowOpen(false)}>Print summary</button>
            </div>
          )}
          <div className="top-app-bar-content">
            <div className="demo-row">
              {meta.options.map((item) => (
                <button
                  type="button"
                  className={active === item ? "demo-button small primary" : "demo-button small"}
                  key={item}
                  onClick={() => {
                    setActive(item);
                    setOverflowOpen(false);
                    setSelectionMode(false);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            <p>{active} view uses {action} as its primary action.</p>
            <button type="button" className="demo-button small" onClick={() => {
              setSelectionMode(true);
              setOverflowOpen(false);
            }}>
              Select 3 files
            </button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">
          {selectionMode ? "Contextual bar is active; selection commands replaced view actions." : `${active} title and ${action} action are synchronized.`}
        </p>
      </div>
    );
  }

  if (patternId === "global-navigation") {
    const [sectionState, setSectionState] = useState<Record<string, number>>({
      Dashboard: 3,
      Projects: 2,
      Reports: 5,
      Billing: 1,
      Admin: 0
    });
    const [overflowOpen, setOverflowOpen] = useState(false);
    const visibleItems = meta.options.slice(0, 4);
    const overflowItems = meta.options.slice(4);
    const selectedState = sectionState[active] ?? 0;
    const selectSection = (item: string) => {
      setActive(item);
      setOverflowOpen(false);
    };

    return (
      <div className="quality-example global-nav-demo">
        <div className="global-nav-shell">
          <header className="global-nav-header">
            <strong>Acme Ops</strong>
            <nav aria-label="Primary sections">
              {visibleItems.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={active === item ? "is-active" : ""}
                  aria-current={active === item ? "page" : undefined}
                  onClick={() => selectSection(item)}
                >
                  {item}
                </button>
              ))}
              <button type="button" aria-expanded={overflowOpen} onClick={() => setOverflowOpen((open) => !open)}>More</button>
            </nav>
            <div className="global-nav-utilities" aria-label="Utilities">
              <button type="button">Help</button>
              <button type="button">Aditi</button>
            </div>
          </header>
          {overflowOpen && (
            <div className="global-nav-overflow" role="menu" aria-label="More primary sections">
              {overflowItems.map((item) => (
                <button type="button" role="menuitem" key={item} onClick={() => selectSection(item)}>{item}</button>
              ))}
            </div>
          )}
          <div className="global-nav-content-preview">
            <strong>{active}</strong>
            <span>{active} draft/filter state: {selectedState}</span>
            <button
              type="button"
              className="demo-button small"
              onClick={() => setSectionState((current) => ({ ...current, [active]: (current[active] ?? 0) + 1 }))}
            >
              Change local state
            </button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{active} selected; global current state matches content and local state is preserved.</p>
      </div>
    );
  }

  if (patternId === "mega-menu") {
    const [panelOpen, setPanelOpen] = useState(true);
    const [selected, setSelected] = useState("Data pipeline");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [message, setMessage] = useState("Products mega panel is open with grouped destinations.");
    const groups: Record<string, string[]> = {
      Build: ["Data pipeline", "App templates", "Developer tools"],
      Operate: ["Runtime monitoring", "Incident response", "Access control"],
      Analyze: ["Dashboards", "Usage reports", "Forecasting"]
    };
    const closePanel = (reason: string) => {
      setPanelOpen(false);
      setMessage(reason);
    };

    return (
      <div className="quality-example mega-menu-demo">
        <div className="mega-menu-shell">
          <header className="mega-menu-header">
            <strong>Acme Cloud</strong>
            <nav aria-label="Primary">
              {meta.options.slice(0, 4).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={item === "Products" && panelOpen ? "is-active" : ""}
                  aria-expanded={item === "Products" ? panelOpen : undefined}
                  onClick={() => {
                    if (item === "Products") {
                      setPanelOpen((current) => !current);
                      setMessage(panelOpen ? "Products panel closed from its trigger." : "Products panel opened from its trigger.");
                    } else {
                      setPanelOpen(false);
                      setSelected(item);
                      setMessage(`${item} selected as a top-level destination; no mega panel needed.`);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      closePanel("Escape closed the Products panel and focus remains on the trigger.");
                    }
                  }}
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="mega-menu-utilities">
              <button type="button">Search</button>
              <button type="button">Aditi</button>
            </div>
          </header>
          {panelOpen && (
            <div className="mega-panel-preview" role="group" aria-label="Products destinations">
              {Object.entries(groups).map(([group, links]) => (
                <section key={group}>
                  <h4>{group}</h4>
                  {links.map((link) => (
                    <button
                      type="button"
                      key={link}
                      className={selected === link ? "is-selected" : ""}
                      onClick={() => {
                        setSelected(link);
                        closePanel(`${link} selected; the panel closed and destination state updated.`);
                      }}
                    >
                      {link}
                    </button>
                  ))}
                </section>
              ))}
            </div>
          )}
          <div className="mega-mobile-preview">
            <button
              type="button"
              className="demo-button small"
              aria-expanded={mobileOpen}
              onClick={() => {
                setMobileOpen((current) => !current);
                setMessage(mobileOpen ? "Mobile destination groups collapsed." : "Mobile fallback exposes the same Products groups.");
              }}
            >
              Mobile Products
            </button>
            {mobileOpen && (
              <div>
                {Object.keys(groups).map((group) => <span key={group}>{group}</span>)}
              </div>
            )}
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message} Current destination: {selected}.</p>
      </div>
    );
  }

  if (patternId === "utility-navigation") {
    const [section, setSection] = useState("Projects");
    const [openUtility, setOpenUtility] = useState("");
    const [unread, setUnread] = useState(3);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [signedOut, setSignedOut] = useState(false);
    const [message, setMessage] = useState("Utilities are separated from primary destinations; Notifications has 3 unread items.");
    const utilities = ["Search", "Help", "Notifications", "Account"];
    const closeUtility = (reason: string) => {
      setOpenUtility("");
      setMessage(reason);
    };
    const openUtilityPanel = (utility: string) => {
      setOpenUtility(utility);
      setSignedOut(false);
      if (utility === "Notifications") {
        setUnread(0);
        setMessage("Notifications inspected; unread badge cleared and Projects stayed current.");
      } else if (utility === "Account") {
        setMessage("Account utility opened with profile and sign-out actions separated from destinations.");
      } else if (utility === "Search") {
        setMessage("Search utility opened as a tray without changing the current section.");
      } else {
        setMessage("Help utility opened as support content without becoming a primary destination.");
      }
    };

    return (
      <div className="quality-example utility-nav-demo">
        <div className="utility-nav-shell">
          <header className="utility-nav-header">
            <strong>Acme Ops</strong>
            <nav aria-label="Primary destinations">
              {["Dashboard", "Projects", "Reports"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={section === item ? "is-active" : ""}
                  aria-current={section === item ? "page" : undefined}
                  onClick={() => {
                    setSection(item);
                    setOpenUtility("");
                    setMessage(`${item} selected as a primary destination; utility state remains separate.`);
                  }}
                >
                  {item}
                </button>
              ))}
            </nav>
            <div className="utility-nav-tools" aria-label="Utilities">
              {utilities.map((utility) => (
                <button
                  type="button"
                  key={utility}
                  className={openUtility === utility ? "is-open" : ""}
                  aria-expanded={openUtility === utility}
                  aria-label={utility === "Notifications" ? `Notifications, ${unread} unread` : utility}
                  onClick={() => openUtilityPanel(utility)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      closeUtility(`${utility} utility closed with Escape; focus remains on its trigger.`);
                    }
                  }}
                >
                  {utility === "Notifications" ? "Alerts" : utility}
                  {utility === "Notifications" && unread > 0 && <span>{unread}</span>}
                </button>
              ))}
              <button
                type="button"
                className={mobileOpen ? "is-open" : ""}
                aria-expanded={mobileOpen}
                onClick={() => {
                  setMobileOpen((open) => !open);
                  setMessage(mobileOpen ? "Mobile utility overflow collapsed." : "Mobile utility overflow exposes the same utility labels.");
                }}
              >
                Utilities
              </button>
            </div>
          </header>
          {openUtility && (
            <div className="utility-panel-preview" role="region" aria-label={`${openUtility} utility panel`}>
              <strong>{openUtility}</strong>
              {openUtility === "Notifications" && <span>No unread notifications remain. Recent: Approval due, billing receipt, export ready.</span>}
              {openUtility === "Account" && (
                <>
                  <span>Aditi Rao signed in. Manage sign-in details or end the session.</span>
                  <button
                    type="button"
                    className="demo-button small"
                    onClick={() => {
                      setSignedOut(true);
                      setOpenUtility("");
                      setMessage("Sign out confirmed; session ended from the account utility, not primary navigation.");
                    }}
                  >
                    Confirm sign out
                  </button>
                </>
              )}
              {openUtility === "Search" && <span>Search tray opens here while {section} remains selected.</span>}
              {openUtility === "Help" && <span>Support links and contact options are available without changing section state.</span>}
            </div>
          )}
          {mobileOpen && (
            <div className="utility-mobile-preview" aria-label="Mobile utilities">
              {meta.options.map((item) => <span key={item}>{item}</span>)}
            </div>
          )}
          <div className={signedOut ? "utility-session-state signed-out" : "utility-session-state"}>
            <strong>{section}</strong>
            <span>{signedOut ? "Signed out state is explicit." : "Primary destination remains selected while utilities open."}</span>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "related-links") {
    const relatedItems = [
      {
        label: "Check eligibility for support",
        relation: "Service page",
        detail: "Confirms whether the current renewal guidance applies before users start a new claim."
      },
      {
        label: "Upload evidence for your claim",
        relation: "Follow-up task",
        detail: "Moves users to the evidence service only after they understand what documents are needed."
      },
      {
        label: "Find an independent benefits calculator",
        relation: "External",
        detail: "External calculator is labelled before navigation so users know they are leaving the service."
      },
      {
        label: "Download appeal guidance [PDF, 220KB]",
        relation: "PDF",
        detail: "File type and size are visible before users choose the document."
      }
    ];
    const [selected, setSelected] = useState(relatedItems[0]);
    const [reviewed, setReviewed] = useState<string[]>([]);
    const [message, setMessage] = useState("Related links are curated after the claim renewal guidance.");
    const chooseRelated = (item: (typeof relatedItems)[number]) => {
      setSelected(item);
      setReviewed((current) => current.includes(item.label) ? current : [...current, item.label]);
      setMessage(`${item.label} selected; relation and destination context are visible before navigation.`);
    };

    return (
      <div className="quality-example related-links-demo">
        <div className="related-links-demo-card">
          <article className="related-article-preview">
            <strong>Renew your support claim</strong>
            <span>Primary action stays in the article. Related links support optional next destinations.</span>
            <button type="button" className="demo-button small primary">Continue renewal</button>
          </article>
          <nav className="related-links-card" aria-label="Related links">
            <strong>Related links</strong>
            {relatedItems.map((item) => (
              <button
                type="button"
                key={item.label}
                className={selected.label === item.label ? "is-selected" : ""}
                onClick={() => chooseRelated(item)}
              >
                <span>{item.label}</span>
                <em>{item.relation}{reviewed.includes(item.label) ? " - reviewed" : ""}</em>
              </button>
            ))}
          </nav>
          <div className="related-link-preview" aria-live="polite">
            <strong>{selected.relation}</strong>
            <span>{selected.detail}</span>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "recently-viewed") {
    type RecentItem = {
      id: string;
      label: string;
      type: string;
      status: string;
      time: string;
      detail: string;
    };
    const seedItems: RecentItem[] = [
      {
        id: "atlas",
        label: "Atlas Packaging",
        type: "Supplier record",
        status: "Approved",
        time: "2 min ago",
        detail: "Opened supplier record from contract review."
      },
      {
        id: "nile",
        label: "Nile Components",
        type: "Compliance file",
        status: "Expires soon",
        time: "18 min ago",
        detail: "Viewed due diligence documents in this workspace."
      },
      {
        id: "orion",
        label: "Orion Health",
        type: "Contract draft",
        status: "Permission changed",
        time: "Yesterday",
        detail: "Entry stays visible with a status before navigation."
      }
    ];
    const [items, setItems] = useState<RecentItem[]>(seedItems);
    const [activeId, setActiveId] = useState(seedItems[0].id);
    const [message, setMessage] = useState("Recently viewed shows records this account actually opened, newest first.");
    const activeItem = items.find((item) => item.id === activeId) ?? items[0];
    const openItem = (item: RecentItem) => {
      setItems((current) => [item, ...current.filter((entry) => entry.id !== item.id)]);
      setActiveId(item.id);
      setMessage(`${item.label} opened and moved to the top without duplicating the record.`);
    };
    const removeItem = (item: RecentItem) => {
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setMessage(`${item.label} was removed from recently viewed only; the supplier record was not deleted.`);
      if (activeId === item.id) {
        const nextItem = items.find((entry) => entry.id !== item.id);
        if (nextItem) setActiveId(nextItem.id);
      }
    };
    const clearAll = () => {
      setItems([]);
      setMessage("Recent history cleared for this workspace. Favorites and saved suppliers remain separate.");
    };

    return (
      <div className="quality-example recently-viewed-demo">
        <div className="recently-viewed-demo-card">
          <div className="recent-workspace-preview">
            <strong>Supplier workspace</strong>
            <span>Scope: signed-in account on this workspace. Saved suppliers are separate.</span>
            <button type="button" className="demo-button small primary" onClick={() => setItems(seedItems)}>Restore sample history</button>
          </div>
          {items.length > 0 ? (
            <section className="recently-viewed-card" aria-label="Recently viewed supplier records">
              <div className="recently-viewed-header">
                <strong>Recently viewed</strong>
                <button type="button" className="demo-button small" onClick={clearAll}>Clear history</button>
              </div>
              {items.map((item) => (
                <div className={item.id === activeId ? "recent-record-card is-active" : "recent-record-card"} key={item.id}>
                  <button type="button" onClick={() => openItem(item)}>
                    <span>{item.label}</span>
                    <em>{item.type} - {item.status} - {item.time}</em>
                  </button>
                  <button type="button" className="remove-recent-button" onClick={() => removeItem(item)} aria-label={`Remove ${item.label} from recently viewed`}>
                    Remove
                  </button>
                </div>
              ))}
            </section>
          ) : (
            <section className="recently-viewed-empty" aria-label="Recently viewed empty">
              <strong>No recently viewed records</strong>
              <span>The section is hidden in production until this account opens a qualifying item.</span>
            </section>
          )}
          {activeItem && (
            <div className="recent-preview" aria-live="polite">
              <strong>{activeItem.label}</strong>
              <span>{activeItem.detail}</span>
            </div>
          )}
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "skip-link") {
    const [stage, setStage] = useState<"start" | "focused" | "main">("start");
    const [message, setMessage] = useState("Focus starts before the repeated header. Press Tab to reveal the skip link.");
    const skippedControls = ["Logo", "Search", "Account", "Help", "Menu", "Breadcrumbs"];
    const focusSkip = () => {
      setStage("focused");
      setMessage("First Tab revealed the skip link before repeated navigation.");
    };
    const activateSkip = () => {
      setStage("main");
      setMessage("Skip link activated; focus moved to the main content target before the page form.");
    };

    return (
      <div className="quality-example skip-link-demo">
        <div className="skip-link-demo-card">
          <a
            className={stage === "start" ? "skip-link-control" : "skip-link-control is-visible"}
            href="#skip-demo-main"
            onClick={(event) => {
              event.preventDefault();
              activateSkip();
            }}
          >
            Skip to main content
          </a>
          <header className="skip-link-header" aria-label="Repeated page header">
            {skippedControls.map((item) => <span key={item}>{item}</span>)}
          </header>
          <main id="skip-demo-main" className={stage === "main" ? "skip-link-main is-focused" : "skip-link-main"} tabIndex={-1}>
            <strong>Application status</strong>
            <span>{stage === "main" ? "Focus is now at the H1/main target." : "Main content target waits after repeated navigation."}</span>
            <button type="button" className="demo-button small primary">Start application</button>
          </main>
          <div className="skip-link-actions">
            <button type="button" className="demo-button small" onClick={focusSkip}>Tab to first control</button>
            <button type="button" className="demo-button small" onClick={activateSkip}>Activate skip link</button>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setStage("start");
                setMessage("Focus starts before the repeated header. Press Tab to reveal the skip link.");
              }}
            >
              Reset focus
            </button>
          </div>
          <div className="skip-link-meter" aria-live="polite">
            <strong>{stage === "main" ? `${skippedControls.length} controls bypassed` : "0 controls bypassed"}</strong>
            <span>{stage === "main" ? "Next Tab continues inside main content." : "Without activation, Tab enters the repeated header."}</span>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "service-navigation") {
    const [serviceState, setServiceState] = useState<Record<string, number>>({
      Overview: 1,
      Applications: 4,
      Messages: 2,
      Contact: 0
    });
    const [menuOpen, setMenuOpen] = useState(false);
    const [notice, setNotice] = useState("Service navigation is expanded on desktop; Menu controls the same links on mobile.");
    const selectedState = serviceState[active] ?? 0;
    const selectSection = (item: string) => {
      setActive(item);
      setMenuOpen(false);
      setNotice(`${item} selected; service state and content are synchronized.`);
    };

    return (
      <div className="quality-example service-nav-demo">
        <div className="service-nav-shell">
          <header className="service-nav-general">
            <strong>GOV.UK</strong>
            <nav aria-label="GOV.UK-wide tools">
              <button type="button">One Login</button>
            </nav>
          </header>
          <section className="service-nav-strip" aria-label="Service information">
            <a
              href="#service-home"
              className="service-nav-name"
              onClick={(event) => {
                event.preventDefault();
                selectSection("Overview");
              }}
            >
              {meta.subject}
            </a>
            <button
              type="button"
              className="service-nav-menu-button"
              aria-controls="service-demo-menu"
              aria-expanded={menuOpen}
              onClick={() => {
                setMenuOpen((open) => !open);
                setNotice(menuOpen ? "Service menu closed; service identity remains visible." : "Service menu opened with the same service links.");
              }}
            >
              Menu
            </button>
            <nav id="service-demo-menu" className={menuOpen ? "is-open" : ""} aria-label="Service menu">
              {meta.options.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={active === item ? "is-current" : ""}
                  aria-current={active === item ? "page" : undefined}
                  onClick={() => selectSection(item)}
                >
                  {item}
                </button>
              ))}
            </nav>
            <button
              type="button"
              onClick={() => setNotice("Cymraeg changed a service-level tool without changing the current section.")}
            >
              Cymraeg
            </button>
          </section>
          <div className="service-nav-content-preview">
            <strong>{active}</strong>
            <span>{active} saved service state: {selectedState}</span>
            <button
              type="button"
              className="demo-button small"
              onClick={() => setServiceState((current) => ({ ...current, [active]: (current[active] ?? 0) + 1 }))}
            >
              Advance service state
            </button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{notice}</p>
      </div>
    );
  }

  if (patternId === "bottom-navigation") {
    const [sectionState, setSectionState] = useState<Record<string, number>>({
      Home: 42,
      Search: 3,
      Saved: 8,
      Alerts: 2,
      Settings: 1
    });
    const stateValue = sectionState[active] ?? 0;
    const status = active === "Alerts" ? "Alerts selected; badge cleared only after visiting the destination." : `${active} selected; section state preserved.`;

    return (
      <div className="quality-example">
        <div className="phone-frame bottom-nav-phone">
          <div className="phone-content bottom-nav-content">
            <span className="demo-status">Compact mobile shell</span>
            <h3>{active}</h3>
            <p>{status}</p>
            <button
              type="button"
              className="demo-button small"
              onClick={() => setSectionState((current) => ({ ...current, [active]: (current[active] ?? 0) + 1 }))}
            >
              Advance {active} state
            </button>
            <p className="demo-status" aria-live="polite">Saved state for {active}: {stateValue}</p>
          </div>
          <nav className="bottom-nav-demo" aria-label="Primary destinations">
            {meta.options.map((item) => {
              const selected = active === item;
              return (
                <button
                  type="button"
                  className={selected ? "is-active" : ""}
                  aria-current={selected ? "page" : undefined}
                  key={item}
                  onClick={() => setActive(item)}
                >
                  <span className={`nav-symbol nav-symbol-${iconKeyForDestination(item)}`} aria-hidden="true"></span>
                  <em>{item}</em>
                  {item === "Alerts" ? <strong aria-label={`${sectionState.Alerts} alerts`}>{sectionState.Alerts}</strong> : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    );
  }

  if (patternId === "breadcrumbs") {
    const [level, setLevel] = useState(meta.options.length - 1);
    const [message, setMessage] = useState("Opened saved Runbook link; full hierarchy is visible.");
    const crumbs = meta.options.slice(0, level + 1);
    const current = crumbs[crumbs.length - 1];
    const parent = crumbs[crumbs.length - 2];
    return (
      <div className="quality-example breadcrumb-demo">
        <nav aria-label="Breadcrumb">
          <ol className="breadcrumb-trail">
            {crumbs.map((item, index) => (
              <li key={item}>
                {index < crumbs.length - 1 ? (
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={(event) => {
                      event.preventDefault();
                      setLevel(index);
                      setMessage(`Moved up to ${item}; descendants are no longer shown as ancestors.`);
                    }}
                  >
                    {item}
                  </a>
                ) : (
                  <span className="breadcrumb-current" aria-current="page">{item}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="breadcrumb-page-preview">
          <strong>{current}</strong>
          <span>{parent ? `Parent: ${parent}` : "Top-level destination"}</span>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
        <div className="demo-row">
          <button
            type="button"
            className="demo-button small"
            disabled={level === 0}
            onClick={() => {
              const next = Math.max(0, level - 1);
              setLevel(next);
              setMessage(`Used breadcrumb navigation to move up to ${meta.options[next]}.`);
            }}
          >
            Go to parent
          </button>
          <button
            type="button"
            className="demo-button small"
            disabled={level === meta.options.length - 1}
            onClick={() => {
              setLevel(meta.options.length - 1);
              setMessage("Opened saved Runbook link; the same hierarchy returned.");
            }}
          >
            Open saved deep link
          </button>
        </div>
      </div>
    );
  }

  if (patternId === "pagination-without-current-page") {
    return <PaginationCurrentPageGoodUx />;
  }

  if (patternId === "pagination") {
    const [query, setQuery] = useState("audit");
    const [sort, setSort] = useState("Newest");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Filters preserved.");
    const page = Number(active);
    const pageSize = 5;
    const totalItems = 18;
    const totalPages = Math.ceil(totalItems / pageSize);
    const records = Array.from({ length: totalItems }, (_, index) => ({
      title: `${query || "record"} result ${index + 1}`,
      meta: index % 2 === 0 ? "Policy" : "Evidence"
    }));
    const start = (page - 1) * pageSize;
    const visibleRecords = records.slice(start, start + pageSize);
    const goToPage = (nextPage: number) => {
      if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
      setLoading(true);
      setMessage(`Loading page ${nextPage} with query "${query || "all"}" and ${sort.toLowerCase()} sort.`);
      setTimeout(() => {
        setActive(String(nextPage));
        setLoading(false);
        setMessage(`Showing page ${nextPage}; query and sort preserved.`);
      }, 180);
    };

    return (
      <div className="quality-example pagination-demo">
        <div className="demo-row">
          <label>
            <span>Query</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); setActive("1"); setMessage("Query changed; returned to page 1."); }} />
          </label>
          <label>
            <span>Sort</span>
            <select value={sort} onChange={(event) => { setSort(event.target.value); setActive("1"); setMessage("Sort changed; returned to page 1."); }}>
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </label>
        </div>
        <p className="demo-status" aria-live="polite">
          {loading ? message : `Showing ${start + 1}-${Math.min(start + pageSize, totalItems)} of ${totalItems} results. ${message}`}
        </p>
        <div className="mini-result-list" aria-busy={loading}>
          {visibleRecords.map((record) => (
            <button type="button" className="pattern-row" key={record.title}>
              {record.title} - {record.meta}
            </button>
          ))}
        </div>
        <nav className="pagination-nav-preview" aria-label="Pagination">
          <button type="button" className="demo-button small" disabled={page === 1 || loading} onClick={() => goToPage(page - 1)}>Previous</button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
            <button
              type="button"
              key={item}
              className={item === page ? "page-button is-current" : "page-button"}
              aria-current={item === page ? "page" : undefined}
              aria-label={item === page ? `Page ${item}, current page` : `Page ${item}`}
              disabled={loading}
              onClick={() => goToPage(item)}
            >
              {item}
            </button>
          ))}
          <button type="button" className="demo-button small" disabled={page === totalPages || loading} onClick={() => goToPage(page + 1)}>Next</button>
        </nav>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setActive(String(totalPages));
            setMessage("Recovered from an out-of-range request by showing the last available page.");
          }}
        >
          Recover page 99
        </button>
      </div>
    );
  }

  if (patternId === "tabs") {
    const [notes, setNotes] = useState<Record<string, string>>({
      Overview: "Scope and owners confirmed",
      Activity: "Waiting on design review",
      Settings: "Notifications stay weekly"
    });
    const activeIndex = meta.options.indexOf(active);
    const focusedIndex = meta.options.indexOf(focused);
    const focusedTabId = `tabs-live-${focused.toLowerCase()}`;
    const activeTabId = `tabs-live-${active.toLowerCase()}`;

    const moveFocus = (direction: 1 | -1) => {
      const nextIndex = (focusedIndex + direction + meta.options.length) % meta.options.length;
      const next = meta.options[nextIndex];
      setFocused(next);
      requestAnimationFrame(() => document.getElementById(`tabs-live-${next.toLowerCase()}`)?.focus());
    };

    return (
      <div className="quality-example tabs-demo">
        <div
          className="tabs-list"
          role="tablist"
          aria-label={meta.field}
          aria-activedescendant={focusedTabId}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              moveFocus(1);
            }
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              moveFocus(-1);
            }
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setActive(focused);
            }
          }}
        >
          {meta.options.map((item) => {
            const selected = active === item;
            const isFocused = focused === item;
            const id = `tabs-live-${item.toLowerCase()}`;
            return (
              <button
                type="button"
                key={item}
                id={id}
                role="tab"
                aria-selected={selected}
                aria-controls={`${id}-panel`}
                tabIndex={isFocused ? 0 : -1}
                className={`${selected ? "tab-button is-selected" : "tab-button"}${isFocused && !selected ? " is-focused" : ""}`}
                onFocus={() => setFocused(item)}
                onClick={() => {
                  setFocused(item);
                  setActive(item);
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className="tab-panel-preview" role="tabpanel" id={`${activeTabId}-panel`} aria-labelledby={activeTabId} tabIndex={0}>
          <strong>{active}</strong>
          <span>{active === "Overview" ? "Summary, owner, and project health." : active === "Activity" ? "Recent comments, decisions, and changes." : "Project defaults and notifications."}</span>
          <label>
            <span>Panel note</span>
            <input
              value={notes[active] ?? ""}
              onChange={(event) => setNotes((current) => ({ ...current, [active]: event.target.value }))}
            />
          </label>
        </div>
        <p className="demo-status" aria-live="polite">
          Focused tab {focusedIndex + 1}; selected panel {activeIndex + 1}. Use Arrow keys, then Enter.
        </p>
      </div>
    );
  }

  return (
    <div className="quality-example">
      <div className={patternId === "bottom-navigation" ? "bottom-nav-demo compact-bottom-nav" : "demo-row"} role={patternId === "tabs" ? "tablist" : "navigation"} aria-label={meta.field}>
        {meta.options.map((item) => (
          <button
            type="button"
            key={item}
            role={patternId === "tabs" ? "tab" : undefined}
            aria-selected={patternId === "tabs" ? active === item : undefined}
            aria-current={patternId === "bottom-navigation" && active === item ? "page" : undefined}
            className={active === item ? "demo-button small primary is-active" : "demo-button small"}
            onClick={() => setActive(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="demo-message" role="tabpanel">
        <strong>{active}</strong>
        <span>{meta.subject}</span>
      </div>
    </div>
  );
}

function NavigationBadUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  const [status, setStatus] = useState("No current panel.");

  if (patternId === "menu-menubar") return <MenubarBadUx />;
  if (patternId === "accordion") return <AccordionBadUx meta={meta} />;

  if (patternId === "in-page-anchor-navigation") {
    const [label, setLabel] = useState("Overview");
    const [message, setMessage] = useState("Visible heading: Fees. Active link still says Overview.");
    return (
      <div className="quality-example in-page-anchor-demo">
        <div className="in-page-anchor-layout bad">
          <div className="bad-nav-row in-page-anchor-bad-row">
            {["Overview", "Details", "More", "Account"].map((item) => (
              <span
                key={item}
                className={label === item ? "is-current" : ""}
                onClick={() => {
                  setLabel(item);
                  setMessage(item === "Account" ? "Account opened as if it were a same-page section." : `Clicked ${item}; focus stayed in the contents list.`);
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="in-page-article-preview bad">
            <section className="is-current-section">
              <h4>Fees</h4>
              <p>Highlighted link: {label}. The heading and link label do not agree.</p>
            </section>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "back-link") {
    const [page, setPage] = useState("Review answers");
    const [answer, setAnswer] = useState("alex@example.gov");
    const [message, setMessage] = useState("Review page loaded from Contact details.");
    return (
      <div className="quality-example back-link-demo">
        <div className="back-link-page-preview bad">
          <button
            type="button"
            className="back-link-control bad"
            aria-label="Back"
            onClick={() => {
              setPage("Marketing landing page");
              setAnswer("");
              setMessage("Back used browser history, left the service, and cleared the saved answer.");
            }}
          >
            Back
          </button>
          <div className="back-link-form-preview">
            <span className="demo-status">Mixed navigation</span>
            <strong>{page}</strong>
            <label>
              <span>Restored email</span>
              <input value={answer} readOnly placeholder="blank after back" />
            </label>
            <div className="bad-nav-row">
              {["Home", "Apply", "Review"].map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "step-navigation") {
    const [visualStep, setVisualStep] = useState("Review");
    const [page, setPage] = useState("Contact details");
    const [answer, setAnswer] = useState("alex@example.gov");
    const [message, setMessage] = useState("Indicator claims Review is current, but Contact details is still the page.");
    return (
      <div className="quality-example step-navigation-demo">
        <div className="step-navigation-preview bad">
          <div className="bad-nav-row step-navigation-bad-row">
            {meta.options.map((item) => (
              <span
                key={item}
                className={visualStep === item ? "is-current" : ""}
                onClick={() => {
                  setVisualStep(item);
                  setPage(item);
                  if (item === "Review" || item === "Submit") {
                    setAnswer("");
                    setMessage(`${item} opened before Documents were valid, and the saved contact answer was lost.`);
                  } else {
                    setMessage(`${item} opened, but the indicator still does not show validated completion.`);
                  }
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="step-card-preview bad">
            <span className="demo-status">Shown as current: {visualStep}</span>
            <strong>{page}</strong>
            <label>
              <span>Contact answer</span>
              <input value={answer} readOnly placeholder="lost after skipped step" />
            </label>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "process-list") {
    const [active, setActive] = useState("Step 4");
    const [message, setMessage] = useState("The page starts in the middle of a supposed process with no standalone overview.");
    const [status, setStatus] = useState("Completed");
    return (
      <div className="quality-example process-list-demo">
        <div className="process-list-preview bad">
          <div className="bad-nav-row process-list-bad-row">
            {["Home", "Step 4", "Search", "Pay", "Loop back"].map((item) => (
              <span
                key={item}
                className={active === item ? "is-current" : ""}
                onClick={() => {
                  setActive(item);
                  if (item === "Loop back") {
                    setMessage("Loop back opened another step-by-step page that sends users back here.");
                  } else if (item === "Pay") {
                    setStatus("Completed");
                    setMessage("Pay was marked completed without any service-owned completion proof.");
                  } else {
                    setMessage(`${item} clicked, but the content is still static guidance mixed with navigation.`);
                  }
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="process-step-card bad">
            <strong>{active}</strong>
            <span>Status: {status}</span>
            <span>Next: Continue in form</span>
            <span>Related: Account settings, Help, Search results</span>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "mega-menu") {
    const [panelLabel, setPanelLabel] = useState("Everything");
    const [message, setMessage] = useState("Hover-only panel is open and mixes utilities with unrelated destinations.");
    const [hiddenFocus, setHiddenFocus] = useState(false);
    return (
      <div className="quality-example mega-menu-demo">
        <div className="mega-menu-shell bad">
          <div className="bad-nav-row mega-menu-bad-row">
            {["Products", "Help", "Sign out", "All pages", "Billing"].map((item) => (
              <span
                key={item}
                className={panelLabel === item ? "is-current" : ""}
                onClick={() => {
                  setPanelLabel(item);
                  if (item === "All pages") {
                    setMessage("All pages opened as a site map, not a scoped Products panel.");
                  } else if (item === "Sign out") {
                    setMessage("Sign out appears inside navigation destinations instead of utility controls.");
                  } else {
                    setMessage(`${item} changed the panel label, but content scope is still mixed.`);
                  }
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mega-panel-preview bad">
            <strong>{panelLabel}</strong>
            <span>Hidden links are still focusable: {hiddenFocus ? "yes" : "not checked"}</span>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setHiddenFocus(true);
                setMessage("Keyboard moved into closed-panel links because the bad menu only hides them visually.");
              }}
            >
              Tab hidden links
            </button>
            <span>Products, account, help, billing, blog, and every page are mixed together.</span>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "utility-navigation") {
    const [current, setCurrent] = useState("Help");
    const [badge, setBadge] = useState("3");
    const [message, setMessage] = useState("Help is highlighted as if it were a product destination.");
    return (
      <div className="quality-example utility-nav-demo">
        <div className="utility-nav-shell bad">
          <div className="bad-nav-row utility-nav-bad-row">
            {["Projects", "Help", "Sign out", "Alerts", "Reports", "Profile"].map((item) => (
              <span
                key={item}
                className={current === item ? "is-current" : ""}
                onClick={() => {
                  setCurrent(item);
                  if (item === "Alerts") {
                    setMessage("Alerts looked selected, but the unread badge did not clear or open a useful panel.");
                  } else if (item === "Sign out") {
                    setMessage("Sign out is placed as a navigation destination and ends work without account context.");
                  } else {
                    setMessage(`${item} is highlighted, but destination and utility scope are still mixed.`);
                  }
                }}
              >
                {item}{item === "Alerts" ? ` ${badge}` : ""}
              </span>
            ))}
          </div>
          <div className="utility-panel-preview bad">
            <strong>{current}</strong>
            <span>Primary link, account action, support link, and notification state share one current marker.</span>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setBadge("3");
                setMessage("Badge stayed at 3 after inspection, so users cannot tell whether Alerts was handled.");
              }}
            >
              Inspect stale badge
            </button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "related-links") {
    const [selected, setSelected] = useState("Click here");
    const [message, setMessage] = useState("A vague generated link is highlighted even though it does not explain the destination.");
    const [stale, setStale] = useState(true);
    return (
      <div className="quality-example related-links-demo">
        <div className="related-links-demo-card bad">
          <div className="related-links-card bad">
            <strong>More information</strong>
            {["Home", "Apply now", "Old 2018 guidance", "Click here", "Account settings", "Fees"].map((item) => (
              <button
                type="button"
                key={item}
                className={selected === item ? "is-selected" : ""}
                onClick={() => {
                  setSelected(item);
                  if (item === "Apply now") {
                    setMessage("The primary task action was buried in Related links instead of staying in the main content.");
                  } else if (item === "Fees") {
                    setMessage("Fees is a same-page anchor, but the related-link block gives no jump-link warning.");
                  } else {
                    setMessage(`${item} is selected, but the block does not explain why it belongs on this page.`);
                  }
                }}
              >
                <span>{item}</span>
                {item === "Old 2018 guidance" && stale && <em>stale</em>}
              </button>
            ))}
          </div>
          <div className="related-link-preview bad">
            <strong>{selected}</strong>
            <span>Generated from loose tags; no relation, destination type, or maintenance owner.</span>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setStale(true);
                setMessage("Stale link remains because the generated list was never reviewed by a content owner.");
              }}
            >
              Review generated list
            </button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "recently-viewed") {
    const [selected, setSelected] = useState("Sponsored plan");
    const [message, setMessage] = useState("The section title says recently viewed, but the first item was never opened by this user.");
    const [synced, setSynced] = useState(false);
    const badItems = synced
      ? ["Sponsored plan", "Aditi's health claim", "Deleted record", "Old laptop file", "Popular supplier"]
      : ["Sponsored plan", "Aditi's health claim", "Deleted record", "Popular supplier"];
    return (
      <div className="quality-example recently-viewed-demo">
        <div className="recently-viewed-demo-card bad">
          <div className="recently-viewed-card bad">
            <strong>Recently viewed</strong>
            {badItems.map((item) => (
              <button
                type="button"
                key={item}
                className={selected === item ? "is-selected" : ""}
                onClick={() => {
                  setSelected(item);
                  if (item === "Aditi's health claim") {
                    setMessage("Another user's sensitive record is visible because account and device scope were not explained.");
                  } else if (item === "Deleted record") {
                    setMessage("The recent entry points to an unavailable record with no status or recovery.");
                  } else if (item === "Sponsored plan" || item === "Popular supplier") {
                    setMessage(`${item} is promoted content, not an item the user opened.`);
                  } else {
                    setMessage(`${item} came from an old synced device with no way to remove it.`);
                  }
                }}
              >
                <span>{item}</span>
                {(item === "Deleted record" || item === "Old laptop file") && <em>stale</em>}
              </button>
            ))}
          </div>
          <div className="recent-preview bad">
            <strong>{selected}</strong>
            <span>No remove control, no clear-all control, no scope label, and no distinction from saved or promoted items.</span>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setSynced(true);
                setSelected("Old laptop file");
                setMessage("An old synced item appeared unexpectedly; the list still gives no removal or scope control.");
              }}
            >
              Sync old device
            </button>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "skip-link") {
    const [tabCount, setTabCount] = useState(0);
    const [message, setMessage] = useState("The link was hidden with display none, so the first Tab lands inside the header.");
    const headerItems = ["Logo", "Search", "Account", "Help", "Menu", "Contact"];
    return (
      <div className="quality-example skip-link-demo">
        <div className="skip-link-demo-card bad">
          <span className="skip-link-broken-hidden">Skip to main content</span>
          <header className="skip-link-header bad" aria-label="Repeated page header">
            {headerItems.map((item, index) => (
              <button
                type="button"
                key={item}
                className={tabCount === index + 1 ? "is-selected" : ""}
                onClick={() => {
                  setTabCount(index + 1);
                  setMessage(`${item} received focus before content; users are still inside repeated navigation.`);
                }}
              >
                {item}
              </button>
            ))}
          </header>
          <main className="skip-link-main bad">
            <strong>Application status</strong>
            <span>Target ID is missing, so activation cannot move focus here.</span>
            <button
              type="button"
              className="demo-button small"
              onClick={() => {
                setTabCount(headerItems.length);
                setMessage("Trying the hidden skip link did nothing: it was removed from keyboard focus and had no target.");
              }}
            >
              Try hidden skip link
            </button>
          </main>
          <div className="skip-link-meter bad" aria-live="polite">
            <strong>{tabCount} header stops visited</strong>
            <span>Main content is still after repeated navigation.</span>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "navigation-drawer") {
    const [activeLabel, setActiveLabel] = useState("Inbox");
    const [message, setMessage] = useState("Drawer is open and blocks Inbox.");
    return (
      <div className="quality-example">
        <div className="drawer-frame bad interactive">
          <div className="drawer-sheet bad">
            {["Inbox", "Sent", "Delete", "Settings"].map((item) => (
              <button
                type="button"
                key={item}
                className={activeLabel === item ? "is-current" : ""}
                onClick={() => {
                  setActiveLabel(item);
                  setMessage(`${item} selected, but the drawer stayed open over the changed page.`);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="drawer-page-preview">
            <strong>{activeLabel}</strong>
            <span>No scrim or reliable close/focus recovery.</span>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "side-navigation") {
    const [label, setLabel] = useState("Settings");
    const [message, setMessage] = useState("Page heading: Audit log. Highlighted item is Settings.");
    return (
      <div className="quality-example">
        <div className="side-nav-layout-preview bad">
          <div className="side-nav-panel bad" aria-label="Mixed side navigation">
            {["Dashboard", "Settings", "Help", "Sign out", "Billing"].map((item) => (
              <button
                type="button"
                key={item}
                className={label === item ? "is-current" : ""}
                onClick={() => {
                  setLabel(item);
                  setMessage(item === "Help" ? "Opened a utility page from local navigation." : `Highlighted ${item}; content still says Audit log.`);
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="side-nav-content-preview">
            <strong>Audit log</strong>
            <span>Highlighted item: {label}</span>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "header") {
    const [title, setTitle] = useState("Reports");
    const [message, setMessage] = useState("Content view: Project files. Primary action still exports reports.");
    return (
      <div className="quality-example">
        <div className="top-app-bar bad interactive">
          <button type="button" onClick={() => setMessage("Menu opened instead of going back.")}>Back</button>
          <strong>{title}</strong>
          <button type="button" onClick={() => setMessage("Exported the previous Reports screen.")}>Export</button>
          <button type="button" onClick={() => {
            setTitle("Settings");
            setMessage("Title changed to Settings, but content stayed on Project files.");
          }}>
            More
          </button>
        </div>
        <div className="demo-message">
          <strong>Project files</strong>
          <span>Visible title: {title}</span>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "global-navigation") {
    const [activeLabel, setActiveLabel] = useState("Dashboard");
    const [draft, setDraft] = useState("Project filter saved: overdue");
    return (
      <div className="quality-example">
        <div className="bad-nav-row global-nav-bad-row">
          {["Dashboard", "Reports", "Help", "Sign out", "Admin"].map((item) => (
            <span
              key={item}
              onClick={() => {
                setActiveLabel(item);
                setDraft(item === "Projects" ? draft : "Local state reset without warning.");
              }}
            >
              {short(item)}
            </span>
          ))}
        </div>
        <div className="demo-message">
          <strong>Projects</strong>
          <span>Active label: {activeLabel}</span>
        </div>
        <p className="demo-status">{draft}</p>
      </div>
    );
  }

  if (patternId === "service-navigation") {
    const [activeLabel, setActiveLabel] = useState("Overview");
    const [message, setMessage] = useState("Page heading: Applications. Highlighted service link is Overview.");
    return (
      <div className="quality-example">
        <div className="service-nav-shell bad interactive">
          <header className="service-nav-general bad">
            <strong>GOV.UK</strong>
            <button type="button" onClick={() => setMessage("Topic menu opened and took the user away from the service.")}>Topics</button>
          </header>
          <div className="bad-nav-row service-nav-bad-row">
            {["Overview", "Messages", "Help", "Sign out", "Admin"].map((item) => (
              <span
                key={item}
                className={activeLabel === item ? "is-current" : ""}
                onClick={() => {
                  setActiveLabel(item);
                  setMessage(item === "Help" ? "Opened a utility as if it were a service section." : `Highlighted ${item}; content still says Applications.`);
                }}
              >
                {short(item)}
              </span>
            ))}
          </div>
          <div className="service-nav-content-preview">
            <strong>Applications</strong>
            <span>Highlighted service link: {activeLabel}</span>
          </div>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "bottom-navigation") {
    const [message, setMessage] = useState("Home feed position saved: 42.");
    return (
      <div className="quality-example">
        <div className="bad-nav-row bottom-nav-overflow-preview">
          {["Home", "Search", "+", "Saved", "Alerts", "Settings"].map((item) => (
            <span
              key={item}
              onClick={() => setMessage(item === "+" ? "Create action opened from a navigation slot." : `${item} selected; previous section state reset.`)}
            >
              {item}
            </span>
          ))}
        </div>
        <p className="demo-status">{message}</p>
      </div>
    );
  }

  if (patternId === "breadcrumbs") {
    const [trail, setTrail] = useState(["Search", "Migration", "Settings", "Runbook"]);
    return (
      <div className="quality-example">
        <div className="bad-nav-row breadcrumb-bad-preview">
          {trail.map((item) => (
            <span
              key={item}
              onClick={() => {
                setTrail((current) => [...current.slice(1), item]);
              }}
            >
              {item}
            </span>
          ))}
        </div>
        <p className="demo-status">Trail follows clicks, so the same page can show a different path.</p>
      </div>
    );
  }

  if (patternId === "pagination-without-current-page") {
    return <PaginationCurrentPageBadUx />;
  }

  if (patternId === "pagination") {
    const [page, setPage] = useState(2);
    const [filter, setFilter] = useState("audit only");
    return (
      <div className="quality-example">
        <p className="demo-status">Filter: {filter}; page {page}</p>
        <div className="bad-nav-row">
          {["1", "2", "3", "Next"].map((item) => (
            <span
              key={item}
              onClick={() => {
                setPage(item === "Next" ? page + 1 : Number(item));
                setFilter("reset");
              }}
            >
              {item}
            </span>
          ))}
        </div>
        <p className="demo-status">Page click resets filters and gives no range.</p>
      </div>
    );
  }

  if (patternId === "tabs") {
    const [panel, setPanel] = useState("Unrelated billing page opened.");
    return (
      <div className="quality-example">
        <div className="bad-nav-row">
          {["Billing", "Team", "Danger"].map((item) => (
            <span key={item} onClick={() => setPanel(`${item} route loaded; previous panel draft lost.`)}>{item}</span>
          ))}
        </div>
        <p className="demo-status">{panel}</p>
      </div>
    );
  }

  return (
    <div className="quality-example">
      <div className="bad-nav-row">
        {meta.options.slice(0, patternId === "bottom-navigation" ? 6 : 4).map((item) => (
          <span key={item} onClick={() => setStatus(`${item} clicked, content unchanged.`)}>{short(item)}</span>
        ))}
      </div>
      <p className="demo-status">{status}</p>
    </div>
  );
}

function iconKeyForDestination(item: string) {
  const key = item.toLowerCase();
  if (key.includes("home")) return "home";
  if (key.includes("search")) return "search";
  if (key.includes("saved")) return "saved";
  if (key.includes("alert")) return "alerts";
  if (key.includes("setting")) return "settings";
  return "more";
}

function GoodUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <NavigationUi patternId={patternId} meta={meta} good />;
}

function BadUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <NavigationUi patternId={patternId} meta={meta} />;
}

function GoodUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <NavigationGoodUx patternId={patternId} meta={meta} />;
}

function BadUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <NavigationBadUx patternId={patternId} meta={meta} />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
