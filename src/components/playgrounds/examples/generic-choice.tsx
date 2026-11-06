import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BrokenCustomSelect, QualityPanel, short, type PatternMeta } from './shared';

function ChoiceUi({ patternId, meta, good = false }: { patternId: string; meta: PatternMeta; good?: boolean }) {
  if (!good) {
    if (patternId === "spinbutton") {
      return (
        <div className="bad-ui-sample spinbutton-bad-ui">
          <strong>Account ID</strong>
          <div className="spinbutton-control">
            <button type="button" className="spinbutton-button" aria-label="Decrease account ID">-</button>
            <input className="spinbutton-value" value="10045678" readOnly aria-label="Account ID as stepper" />
            <button type="button" className="spinbutton-button" aria-label="Increase account ID">+</button>
          </div>
          <p className="demo-status">A non-incrementable identifier is exposed as something users can accidentally step.</p>
        </div>
      );
    }

    if (patternId === "range-slider") {
      return (
        <div className="bad-ui-sample range-slider-bad-ui">
          <strong>Travel dates</strong>
          <div className="range-slider-rail" style={{ "--range-start": "30%", "--range-end": "62%" } as CSSProperties}>
            <span className="range-slider-band" />
            <span className="range-slider-thumb is-min" />
            <span className="range-slider-thumb is-max" />
          </div>
          <p className="demo-status">A date range is represented as numbers on a rail instead of calendar dates.</p>
        </div>
      );
    }

    if (patternId === "slider") {
      return (
        <div className="bad-ui-sample slider-bad-ui">
          <span className="slider-bad-label">?</span>
          <input type="range" min="0" max="1" step="1" value="1" readOnly aria-label="Unknown binary slider" />
          <p className="demo-status">A binary choice is hidden inside an unlabeled two-stop slider.</p>
        </div>
      );
    }

    if (patternId === "toggle-switch") {
      return (
        <div className="bad-ui-sample toggle-switch-bad-ui">
          <button type="button" className="toggle-switch-track bad" aria-label="Misused delete switch" aria-pressed="false">
            <span className="toggle-switch-thumb" />
          </button>
          <strong>Delete account</strong>
          <p className="demo-status">A switch is being used for a destructive action that needs confirmation.</p>
        </div>
      );
    }

    if (patternId === "segmented-control") {
      return (
        <div className="bad-ui-sample">
          <div className="bad-choice-row segmented-overflow" aria-label="Too many cramped segments">
            {["List", "Board", "Calendar", "Timeline", "Map", "Chart"].map((item) => (
              <button key={item} type="button">{short(item)}</button>
            ))}
          </div>
          <p className="demo-status">Too many segments; state is hard to scan.</p>
        </div>
      );
    }

    if (patternId === "listbox") {
      return (
        <div className="bad-ui-sample listbox-bad-ui">
          <strong>Role options</strong>
          <div className="listbox-list bad" aria-label="Broken role options">
            <div className="listbox-option bad">
              <span>United Kingdom office role - Analyst</span>
              <button type="button" className="demo-button small">Edit</button>
            </div>
            <div className="listbox-option bad">
              <span>United Kingdom office role - Support</span>
              <button type="button" className="demo-button small danger">Delete</button>
            </div>
          </div>
          <p className="demo-status">Nested buttons and repeated prefixes make these rows unsuitable as listbox options.</p>
        </div>
      );
    }

    if (patternId === "transfer-list") return <TransferListBadUi />;
    if (patternId === "tree-selection") return <TreeSelectionBadUi />;
    if (patternId === "object-picker") return <ObjectPickerBadUi />;
    if (patternId === "chip-selection") return <ChipSelectionBadUi />;
    if (patternId === "button-group") return <ButtonGroupBadUi />;
    if (patternId === "action-menu") return <ActionMenuBadUi />;
    if (patternId === "action-sheet") return <ActionSheetBadUi />;

    return (
      <div className="bad-ui-sample">
        <span>{short(meta.field)}</span>
        <div className="bad-choice-row">
          {meta.options.slice(0, 3).map((item) => (
            <button key={item} type="button">{short(item)}</button>
          ))}
        </div>
      </div>
    );
  }

  if (patternId === "select") {
    return (
      <div className="quality-example">
        <label htmlFor="quality-select-preview">
          <span>{meta.field}</span>
        </label>
        <p className="demo-status" id="quality-select-preview-hint">Choose one region from the known service list.</p>
        <select id="quality-select-preview" value={meta.options[3]} onChange={() => undefined} aria-describedby="quality-select-preview-hint">
          {meta.options.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
    );
  }

  if (patternId === "toggle-switch") {
    return (
      <div className="quality-example toggle-switch-demo">
        <div className="toggle-switch-row">
          <div>
            <strong>{meta.field}</strong>
            <span>Immediate account setting</span>
          </div>
          <button type="button" className="toggle-switch-track is-on" role="switch" aria-checked="true" aria-label={meta.field}>
            <span className="toggle-switch-thumb" />
          </button>
          <em>On</em>
        </div>
        <p className="demo-status">The setting label stays stable while the on/off state changes.</p>
      </div>
    );
  }

  if (patternId === "slider") {
    return (
      <div className="quality-example slider-demo">
        <div className="slider-field">
          <div className="slider-label-row">
            <strong>{meta.field}</strong>
            <output>60%</output>
          </div>
          <input type="range" min="0" max="100" step="5" value="60" readOnly aria-label={meta.field} aria-describedby="slider-ui-scale" />
          <div className="slider-scale" id="slider-ui-scale">
            <span>Dim</span>
            <span>Bright</span>
          </div>
        </div>
        <p className="demo-status">The label, current value, min/max scale, and thumb position all describe one adjustable setting.</p>
      </div>
    );
  }

  if (patternId === "range-slider") {
    return (
      <div className="quality-example range-slider-demo">
        <div className="range-slider-field">
          <div className="slider-label-row">
            <strong>{meta.field}</strong>
            <output>$120 to $280</output>
          </div>
          <div className="range-slider-rail" style={{ "--range-start": "24%", "--range-end": "56%" } as CSSProperties}>
            <span className="range-slider-band" />
            <input type="range" min="0" max="500" step="20" value="120" readOnly aria-label="Minimum nightly price" />
            <input type="range" min="0" max="500" step="20" value="280" readOnly aria-label="Maximum nightly price" />
          </div>
          <div className="slider-scale">
            <span>$0</span>
            <span>$500+</span>
          </div>
        </div>
        <p className="demo-status">Two labeled thumbs define a lower and upper boundary on one numeric filter.</p>
      </div>
    );
  }

  if (patternId === "spinbutton") {
    return (
      <div className="quality-example spinbutton-demo">
        <div className="spinbutton-field">
          <span className="spinbutton-label-row">
            <strong id="spinbutton-ui-preview-label">{meta.field}</strong>
            <em>0 to 9</em>
          </span>
          <span className="spinbutton-control">
            <button type="button" className="spinbutton-button" aria-label="Decrease guests">-</button>
            <input
              id="spinbutton-ui-preview"
              className="spinbutton-value"
              type="number"
              min="0"
              max="9"
              step="1"
              value="2"
              readOnly
              aria-labelledby="spinbutton-ui-preview-label"
              aria-describedby="spinbutton-ui-preview-help"
            />
            <button type="button" className="spinbutton-button" aria-label="Increase guests">+</button>
          </span>
        </div>
        <p className="demo-status" id="spinbutton-ui-preview-help">The current value can be typed or adjusted by one guest at a time within clear bounds.</p>
      </div>
    );
  }

  if (patternId === "multi-select") {
    return (
      <div className="quality-example">
        <label htmlFor="quality-multi-preview">
          <span>{meta.field}</span>
        </label>
        <div className="demo-chips" aria-label="Selected assignees preview">
          <button type="button" className="demo-chip">Mina Patel x</button>
          <button type="button" className="demo-chip">Priya Shah x</button>
        </div>
        <input id="quality-multi-preview" value="pr" readOnly aria-describedby="quality-multi-preview-hint" />
        <p className="demo-status" id="quality-multi-preview-hint">Filter a longer list and keep selected people visible.</p>
        <div className="mini-result-list" role="listbox" aria-label="Filtered assignees" aria-multiselectable="true">
          <button type="button" className="pattern-row is-selected" role="option" aria-selected="true">Priya Shah</button>
          <button type="button" className="pattern-row" role="option" aria-selected="false">Oscar Reed</button>
        </div>
      </div>
    );
  }

  if (patternId === "listbox") {
    return (
      <div className="quality-example listbox-demo">
        <span className="demo-status" id="listbox-ui-label">Choose one role</span>
        <div className="listbox-list" role="listbox" aria-labelledby="listbox-ui-label" aria-activedescendant="listbox-ui-support" tabIndex={0}>
          {[
            ["Analyst", "Reads reports"],
            ["Designer", "Updates prototypes"],
            ["Developer", "Ships changes"],
            ["Support", "Handles queue"],
            ["Manager", "Approves access"]
          ].map(([role, detail]) => (
            <div
              className={role === "Support" ? "listbox-option is-active" : role === "Designer" ? "listbox-option is-selected" : "listbox-option"}
              role="option"
              aria-selected={role === "Designer"}
              id={role === "Support" ? "listbox-ui-support" : undefined}
              key={role}
            >
              <span>{role}</span>
              <em>{detail}</em>
            </div>
          ))}
        </div>
        <p className="demo-status">Active option is Support; selected option is Designer.</p>
      </div>
    );
  }

  if (patternId === "transfer-list") return <TransferListGoodUi />;
  if (patternId === "tree-selection") return <TreeSelectionGoodUi />;
  if (patternId === "object-picker") return <ObjectPickerGoodUi />;
  if (patternId === "chip-selection") return <ChipSelectionGoodUi />;
  if (patternId === "button-group") return <ButtonGroupGoodUi />;
  if (patternId === "action-menu") return <ActionMenuGoodUi />;
  if (patternId === "action-sheet") return <ActionSheetGoodUi />;

  if (patternId === "segmented-control") {
    return (
      <div className="quality-example segmented-demo">
        <span className="demo-status" id="segmented-preview-label">View</span>
        <div className="segmented-control" role="group" aria-labelledby="segmented-preview-label">
          {meta.options.map((item, index) => (
            <button
              type="button"
              key={item}
              className={index === 0 ? "segment-button is-selected" : "segment-button"}
              aria-pressed={index === 0}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="segmented-content-preview" aria-label="Preview content">
          <strong>{meta.options[0]} view</strong>
          <span>Same data set, compact presentation switch.</span>
        </div>
      </div>
    );
  }

  return (
    <fieldset className="quality-fieldset">
      <legend>{meta.field}</legend>
      {meta.options.slice(0, patternId === "multi-select" ? 4 : 3).map((item, index) => (
        <label className="checkbox-label" key={item}>
          <input
            type={patternId === "checkbox-group" || patternId === "multi-select" ? "checkbox" : "radio"}
            checked={index === 0}
            readOnly
          />
          {item}
        </label>
      ))}
    </fieldset>
  );
}

function ChoiceGoodUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  if (patternId === "spinbutton") {
    const [value, setValue] = useState("2");
    const [disabled, setDisabled] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [message, setMessage] = useState("Two guests selected. Use buttons, arrow keys, or typing to change the count.");
    const [tone, setTone] = useState<"ready" | "warning" | "error" | "disabled" | "exact">("ready");
    const min = 0;
    const max = 9;
    const step = 1;
    const currentNumber = Number(value || min);
    const parsedValue = Number(value);
    const hasInvalidValue = value.trim() === "" || !Number.isFinite(parsedValue) || parsedValue < min || parsedValue > max;
    const displayValue = value === "" ? "empty" : value;
    const commitValue = (next: number, nextMessage?: string, nextTone: typeof tone = "ready") => {
      if (disabled) {
        setTone("disabled");
        setMessage("Guest count is unavailable while the room is sold out.");
        return;
      }
      if (readOnly) {
        setTone("disabled");
        setMessage("This reservation is read only; the count can be reviewed but not changed.");
        return;
      }
      const rounded = Math.round(next / step) * step;
      const clamped = Math.min(max, Math.max(min, rounded));
      setValue(String(clamped));
      setTone(nextTone);
      setMessage(nextMessage ?? `${clamped} ${clamped === 1 ? "guest" : "guests"} selected.`);
    };
    const typeValue = (next: string) => {
      if (disabled || readOnly) {
        setMessage(disabled ? "Guest count is unavailable while the room is sold out." : "This reservation is read only; the count cannot be edited.");
        setTone("disabled");
        return;
      }
      setValue(next);
      if (next.trim() === "") {
        setTone("error");
        setMessage("Enter the number of guests before continuing.");
        return;
      }
      const parsed = Number(next);
      if (!Number.isFinite(parsed)) {
        setTone("error");
        setMessage("Guest count must be a whole number.");
        return;
      }
      if (parsed < min) {
        commitValue(min, "Negative guests were repaired to the minimum of 0.", "error");
        return;
      }
      if (parsed > max) {
        commitValue(max, "Guest count was above capacity and was repaired to 9.", "error");
        return;
      }
      commitValue(parsed, `Typed value accepted: ${Math.round(parsed)} guests.`, "exact");
    };
    const keyAdjust = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "PageUp") {
        event.preventDefault();
        commitValue(currentNumber + 5, "Page Up moved the value by five guests.", "ready");
      }
      if (event.key === "PageDown") {
        event.preventDefault();
        commitValue(currentNumber - 5, "Page Down moved the value by five guests.", "ready");
      }
    };

    return (
      <div className="quality-example spinbutton-demo">
        <div className={`slider-status is-${tone}`} role={tone === "error" ? "alert" : "status"} aria-live="polite">
          <strong>{disabled ? "Unavailable" : readOnly ? "Read only" : tone === "error" ? "Needs repair" : tone === "exact" ? "Typed value" : "Selected"}</strong>
          <span>{message}</span>
        </div>
        <div className={disabled || readOnly ? "spinbutton-field is-disabled" : "spinbutton-field"}>
          <span className="spinbutton-label-row">
            <strong id="guest-count-stepper-label">{meta.field}</strong>
            <em>Whole guests, {min}-{max}</em>
          </span>
          <span className="spinbutton-control">
            <button
              type="button"
              className="spinbutton-button"
              aria-label="Decrease guests"
              disabled={disabled || readOnly || value === "" || currentNumber <= min}
              onClick={() => commitValue(currentNumber - step)}
            >
              -
            </button>
            <input
              id="guest-count-stepper"
              className="spinbutton-value"
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              disabled={disabled}
              readOnly={readOnly}
              aria-labelledby="guest-count-stepper-label"
              aria-describedby="guest-count-help guest-count-status"
              aria-invalid={hasInvalidValue}
              onChange={(event) => typeValue(event.target.value)}
              onKeyDown={keyAdjust}
            />
            <button
              type="button"
              className="spinbutton-button"
              aria-label="Increase guests"
              disabled={disabled || readOnly || value === "" || currentNumber >= max}
              onClick={() => commitValue(currentNumber + step)}
            >
              +
            </button>
          </span>
        </div>
        <p className="demo-status" id="guest-count-help">Use for small count changes. The field remains editable for direct entry and repairs values outside the allowed capacity.</p>
        <div className="demo-row slider-actions">
          <button type="button" className="demo-button small" onClick={() => commitValue(currentNumber + step)}>Add one</button>
          <button type="button" className="demo-button small" onClick={() => commitValue(currentNumber - step)}>Remove one</button>
          <button type="button" className="demo-button small" onClick={() => typeValue("7")}>Type 7</button>
          <button type="button" className="demo-button small" onClick={() => commitValue(currentNumber + 5, "Large step moved by five guests.", "ready")}>Page step</button>
          <button type="button" className="demo-button small" onClick={() => typeValue("")}>Clear required</button>
          <button type="button" className="demo-button small" onClick={() => typeValue("-3")}>Clamp below min</button>
          <button type="button" className="demo-button small" onClick={() => { setDisabled(true); setReadOnly(false); setTone("disabled"); setMessage("Sold-out rooms disable guest-count changes and explain why."); }}>Disable sold out</button>
          <button type="button" className="demo-button small" onClick={() => { setReadOnly(true); setDisabled(false); setTone("disabled"); setMessage("Confirmed booking is read only but remains visible for review."); }}>Read-only review</button>
          <button type="button" className="demo-button small primary" onClick={() => { setValue("2"); setDisabled(false); setReadOnly(false); setTone("ready"); setMessage("Guest count restored to two."); }}>Restore</button>
        </div>
        <p className="demo-status" id="guest-count-status">Current value: {displayValue}; increment: {step}; bounds: {min} to {max}.</p>
      </div>
    );
  }

  if (patternId === "range-slider") {
    const [minValue, setMinValue] = useState(120);
    const [maxValue, setMaxValue] = useState(280);
    const [disabled, setDisabled] = useState(false);
    const [message, setMessage] = useState("Showing hotel results between $120 and $280 per night.");
    const [tone, setTone] = useState<"ready" | "warning" | "error" | "disabled" | "exact">("ready");
    const minLimit = 0;
    const maxLimit = 500;
    const step = 20;
    const gap = 40;
    const start = (minValue / maxLimit) * 100;
    const end = (maxValue / maxLimit) * 100;
    const formatRange = (low = minValue, high = maxValue) => `$${low} to $${high}`;
    const clampToStep = (next: number) => Math.min(maxLimit, Math.max(minLimit, Math.round(next / step) * step));
    const updateMin = (next: number, nextTone: typeof tone = "ready", nextMessage?: string) => {
      if (disabled) {
        setTone("disabled");
        setMessage("Price filters are locked while corporate policy pricing is active.");
        return;
      }
      const clamped = Math.min(clampToStep(next), maxValue - gap);
      setMinValue(clamped);
      setTone(nextTone);
      setMessage(nextMessage ?? `Minimum price changed. Showing ${formatRange(clamped, maxValue)} per night.`);
    };
    const updateMax = (next: number, nextTone: typeof tone = "ready", nextMessage?: string) => {
      if (disabled) {
        setTone("disabled");
        setMessage("Price filters are locked while corporate policy pricing is active.");
        return;
      }
      const clamped = Math.max(clampToStep(next), minValue + gap);
      setMaxValue(clamped);
      setTone(nextTone);
      setMessage(nextMessage ?? `Maximum price changed. Showing ${formatRange(minValue, clamped)} per night.`);
    };
    const repairCrossedRange = () => {
      setMinValue(220);
      setMaxValue(260);
      setTone("error");
      setMessage("Crossed endpoints were repaired: minimum must stay at least $40 below maximum.");
    };
    const showFewResults = () => {
      setMinValue(180);
      setMaxValue(220);
      setTone("warning");
      setMessage("Only two hotels match this narrow range. Widen the endpoints to see more results.");
    };
    const setExactRange = () => {
      setMinValue(140);
      setMaxValue(360);
      setTone("exact");
      setMessage("Typed endpoints synchronized with both range handles.");
    };

    return (
      <div className="quality-example range-slider-demo">
        <div className={`slider-status is-${tone}`} role={tone === "error" ? "alert" : "status"} aria-live="polite">
          <strong>{disabled ? "Locked" : tone === "error" ? "Repaired" : tone === "warning" ? "Few results" : tone === "exact" ? "Exact endpoints" : "Applied range"}</strong>
          <span>{message}</span>
        </div>
        <div className={disabled ? "range-slider-field is-disabled" : "range-slider-field"}>
          <div className="slider-label-row">
            <strong id="range-slider-label">{meta.field}</strong>
            <output>{formatRange()}</output>
          </div>
          <div
            className="range-slider-rail"
            style={{ "--range-start": `${start}%`, "--range-end": `${end}%` } as CSSProperties}
            aria-describedby="range-slider-help range-slider-status"
          >
            <span className="range-slider-band" />
            <input
              type="range"
              min={minLimit}
              max={maxValue - gap}
              step={step}
              value={minValue}
              disabled={disabled}
              aria-label="Minimum nightly price"
              aria-valuetext={`Minimum ${minValue} dollars`}
              onChange={(event) => updateMin(Number(event.target.value))}
            />
            <input
              type="range"
              min={minValue + gap}
              max={maxLimit}
              step={step}
              value={maxValue}
              disabled={disabled}
              aria-label="Maximum nightly price"
              aria-valuetext={`Maximum ${maxValue} dollars`}
              onChange={(event) => updateMax(Number(event.target.value))}
            />
          </div>
          <div className="slider-scale">
            <span>$0</span>
            <span>$500+</span>
          </div>
        </div>
        <p className="demo-status" id="range-slider-help">Tab order stays minimum then maximum even as the handles move. Endpoints cannot cross.</p>
        <div className="range-slider-number-grid" aria-label="Exact price endpoints">
          <label htmlFor="range-min-price">
            <span>Minimum</span>
            <input id="range-min-price" type="number" min={minLimit} max={maxValue - gap} step={step} value={minValue} disabled={disabled} onChange={(event) => updateMin(Number(event.target.value), "exact", "Typed minimum synchronized with the lower handle.")} />
          </label>
          <label htmlFor="range-max-price">
            <span>Maximum</span>
            <input id="range-max-price" type="number" min={minValue + gap} max={maxLimit} step={step} value={maxValue} disabled={disabled} onChange={(event) => updateMax(Number(event.target.value), "exact", "Typed maximum synchronized with the upper handle.")} />
          </label>
        </div>
        <div className="demo-row slider-actions">
          <button type="button" className="demo-button small" onClick={() => updateMin(minValue + step)}>Raise minimum</button>
          <button type="button" className="demo-button small" onClick={() => updateMax(maxValue - step)}>Lower maximum</button>
          <button type="button" className="demo-button small" onClick={setExactRange}>Type exact endpoints</button>
          <button type="button" className="demo-button small" onClick={showFewResults}>Narrow to few results</button>
          <button type="button" className="demo-button small" onClick={repairCrossedRange}>Repair crossed range</button>
          <button type="button" className="demo-button small" onClick={() => { setDisabled(true); setTone("disabled"); setMessage("Corporate policy pricing locked the endpoints."); }}>Disable dependency</button>
          <button type="button" className="demo-button small primary" onClick={() => { setDisabled(false); setTone("ready"); setMessage(`Restored editing for ${formatRange()} per night.`); }}>Restore</button>
        </div>
        <p className="demo-status" id="range-slider-status">Current filter: {formatRange()} per night; minimum gap: ${gap}.</p>
      </div>
    );
  }

  if (patternId === "slider") {
    const [value, setValue] = useState(55);
    const [disabled, setDisabled] = useState(false);
    const [message, setMessage] = useState("Brightness is set to a comfortable mid-range value.");
    const [tone, setTone] = useState<"ready" | "warning" | "error" | "disabled" | "exact">("ready");
    const percent = `${value}%`;
    const clampValue = (next: number) => Math.min(100, Math.max(0, Math.round(next / 5) * 5));
    const updateValue = (next: number, nextMessage?: string, nextTone: typeof tone = "ready") => {
      if (disabled) {
        setMessage("Brightness is locked while battery saver is active.");
        setTone("disabled");
        return;
      }
      const clamped = clampValue(next);
      setValue(clamped);
      setTone(nextTone);
      setMessage(nextMessage ?? `Brightness changed to ${clamped}%.`);
    };
    const keyAdjust = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "PageUp") {
        event.preventDefault();
        updateValue(value + 20, "Page Up moved brightness by a larger step.");
      }
      if (event.key === "PageDown") {
        event.preventDefault();
        updateValue(value - 20, "Page Down moved brightness by a larger step.");
      }
    };

    return (
      <div className="quality-example slider-demo">
        <div className={`slider-status is-${tone}`} role={tone === "error" ? "alert" : "status"} aria-live="polite">
          <strong>{disabled ? "Locked" : tone === "error" ? "Out of range" : tone === "warning" ? "Warning" : tone === "exact" ? "Exact value" : "Selected"}</strong>
          <span>{message}</span>
        </div>
        <div className={disabled ? "slider-field is-disabled" : "slider-field"}>
          <div className="slider-label-row">
            <strong id="slider-brightness-label">{meta.field}</strong>
            <output htmlFor="slider-brightness">{percent}</output>
          </div>
          <input
            id="slider-brightness"
            type="range"
            min="0"
            max="100"
            step="5"
            value={value}
            disabled={disabled}
            aria-labelledby="slider-brightness-label"
            aria-describedby="slider-brightness-help slider-brightness-scale slider-brightness-status"
            onChange={(event) => updateValue(Number(event.target.value))}
            onKeyDown={keyAdjust}
          />
          <div className="slider-scale" id="slider-brightness-scale">
            <span>Dim 0%</span>
            <span>Bright 100%</span>
          </div>
        </div>
        <p className="demo-status" id="slider-brightness-help">Use the slider for approximate display intensity. Use the number box for an exact accessible value.</p>
        <label className="slider-number-field" htmlFor="slider-brightness-number">
          <span>Exact brightness</span>
          <input
            id="slider-brightness-number"
            type="number"
            min="0"
            max="100"
            step="5"
            value={value}
            disabled={disabled}
            onChange={(event) => updateValue(Number(event.target.value), "Typed value synchronized with the slider thumb.", "exact")}
          />
        </label>
        <div className="demo-row slider-actions">
          <button type="button" className="demo-button small" onClick={() => updateValue(value - 5)}>Decrease 5%</button>
          <button type="button" className="demo-button small" onClick={() => updateValue(value + 5)}>Increase 5%</button>
          <button type="button" className="demo-button small" onClick={() => updateValue(95, "High brightness may reduce battery life.", "warning")}>High warning</button>
          <button type="button" className="demo-button small" onClick={() => { setValue(100); setTone("error"); setMessage("The typed value was above the allowed maximum and was clamped to 100%."); }}>Out-of-range repair</button>
          <button type="button" className="demo-button small" onClick={() => { setDisabled(true); setTone("disabled"); setMessage("Battery saver locked brightness changes."); }}>Disable dependency</button>
          <button type="button" className="demo-button small primary" onClick={() => { setDisabled(false); setTone("ready"); setMessage(`Brightness remains at ${value}%.`); }}>Restore</button>
        </div>
        <p className="demo-status" id="slider-brightness-status">Current value: {percent}; step size: 5%.</p>
      </div>
    );
  }

  if (patternId === "toggle-switch") {
    const [enabled, setEnabled] = useState(false);
    const [pending, setPending] = useState(false);
    const [locked, setLocked] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const [message, setMessage] = useState("Email notifications are off. Changes apply immediately and can be reversed.");
    const status = pending ? "Pending" : locked ? "Unavailable" : readOnly ? "Read only" : enabled ? "On" : "Off";

    const toggle = () => {
      if (locked) {
        setMessage("Email notifications are unavailable until the verified email setting is enabled.");
        return;
      }
      if (readOnly) {
        setMessage("This account is read only; users can review the setting but not change it.");
        return;
      }
      const next = !enabled;
      setEnabled(next);
      setPending(false);
      setMessage(`Email notifications are now ${next ? "on" : "off"}. The label did not change; only the state changed.`);
    };

    const delayedApply = () => {
      if (locked || readOnly) {
        setMessage("Resolve the dependency or read-only state before changing this setting.");
        return;
      }
      setEnabled(true);
      setPending(true);
      setMessage("Email notifications are turning on. A pending state explains the delay before the service is online.");
    };

    const lockDependency = () => {
      setLocked(true);
      setPending(false);
      setMessage("Dependency disabled: verify an email address before this switch can be changed.");
    };

    const restoreDependency = () => {
      setLocked(false);
      setReadOnly(false);
      setPending(false);
      setMessage(`Dependency restored. Email notifications remain ${enabled ? "on" : "off"}.`);
    };

    const reviewOnly = () => {
      setReadOnly(true);
      setPending(false);
      setMessage("Read-only state keeps the setting understandable without pretending it can be changed.");
    };

    return (
      <div className="quality-example toggle-switch-demo">
        <div className={`toggle-switch-summary ${pending ? "is-pending" : locked ? "is-locked" : enabled ? "is-on" : "is-off"}`} role="status" aria-live="polite">
          <strong>{status}</strong>
          <span>{message}</span>
        </div>
        <div className="toggle-switch-row">
          <div>
            <strong id="toggle-switch-label">{meta.field}</strong>
            <span id="toggle-switch-description">Send account activity alerts by email. The setting applies immediately.</span>
          </div>
          <button
            type="button"
            className={`${enabled ? "toggle-switch-track is-on" : "toggle-switch-track"}${pending ? " is-pending" : ""}`}
            role="switch"
            aria-checked={enabled}
            aria-labelledby="toggle-switch-label"
            aria-describedby="toggle-switch-description toggle-switch-state"
            aria-disabled={locked || readOnly}
            onClick={toggle}
          >
            <span className="toggle-switch-thumb" />
          </button>
          <em id="toggle-switch-state">{status}</em>
        </div>
        <div className="toggle-switch-effect" aria-live="polite">
          <span>Applied effect</span>
          <strong>{enabled ? "Future account activity emails will be sent." : "No account activity emails will be sent."}</strong>
        </div>
        <div className="demo-row toggle-switch-actions">
          <button type="button" className="demo-button small" onClick={toggle}>Toggle setting</button>
          <button type="button" className="demo-button small" onClick={delayedApply}>Delayed apply</button>
          <button type="button" className="demo-button small" onClick={lockDependency}>Disable dependency</button>
          <button type="button" className="demo-button small" onClick={restoreDependency}>Restore dependency</button>
          <button type="button" className="demo-button small primary" onClick={reviewOnly}>Read-only state</button>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "select") {
    const [value, setValue] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const invalid = submitted && !value;

    return (
      <div className="quality-example">
        <label htmlFor="quality-select-live">
          <span>{meta.field}</span>
        </label>
        <p className="demo-status" id="quality-select-live-hint">Choose one region. The selection is reviewed before continuing.</p>
        {invalid && <p className="demo-error compact" id="quality-select-live-error">Choose a region before continuing.</p>}
        <select
          id="quality-select-live"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            if (submitted) setSubmitted(false);
          }}
          aria-invalid={invalid}
          aria-describedby={invalid ? "quality-select-live-hint quality-select-live-error" : "quality-select-live-hint"}
          className={invalid ? "field-invalid" : undefined}
        >
          <option value="">Select a region</option>
          {meta.options.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <div className="demo-row">
          <button type="button" className="demo-button small primary" onClick={() => setSubmitted(true)}>Continue</button>
          <button type="button" className="demo-button small" onClick={() => { setValue("South East"); setSubmitted(false); }}>Choose South East</button>
        </div>
        <p className="demo-status">Selected: {value || "none"}</p>
      </div>
    );
  }

  if (patternId === "listbox") return <ListboxGoodUx meta={meta} />;
  if (patternId === "transfer-list") return <TransferListGoodUx />;
  if (patternId === "tree-selection") return <TreeSelectionGoodUx />;
  if (patternId === "object-picker") return <ObjectPickerGoodUx />;
  if (patternId === "chip-selection") return <ChipSelectionGoodUx />;
  if (patternId === "button-group") return <ButtonGroupGoodUx />;
  if (patternId === "action-menu") return <ActionMenuGoodUx />;
  if (patternId === "action-sheet") return <ActionSheetGoodUx meta={meta} />;

  if (patternId === "radio-group") {
    const [choice, setChoice] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const invalid = submitted && !choice;

    return (
      <div className="quality-example">
        <fieldset className="quality-fieldset radio-choice-fieldset" aria-describedby={invalid ? "radio-choice-error radio-choice-hint" : "radio-choice-hint"}>
          <legend>{meta.field}</legend>
          <p className="demo-status" id="radio-choice-hint">Select one plan. You can compare all options before choosing.</p>
          {invalid && <p className="demo-error compact" id="radio-choice-error">Choose one plan before continuing.</p>}
          {meta.options.map((item) => (
            <label className="checkbox-label radio-choice-label" key={item}>
              <input
                type="radio"
                name="quality-radio-plan"
                value={item}
                checked={choice === item}
                onChange={() => setChoice(item)}
                aria-invalid={invalid}
              />
              <span>
                <strong>{item}</strong>
                <small>{item === "Starter" ? "For individual setup" : item === "Team" ? "For shared workspaces" : "For managed controls"}</small>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="demo-row">
          <button type="button" className="demo-button small primary" onClick={() => setSubmitted(true)}>Continue</button>
          <button type="button" className="demo-button small" onClick={() => { setChoice("Team"); setSubmitted(false); }}>Choose Team</button>
        </div>
        <p className="demo-status">Selected: {choice || "none"}</p>
      </div>
    );
  }

  if (patternId === "checkbox-group") {
    const [selected, setSelected] = useState([meta.options[0]]);
    const [submitted, setSubmitted] = useState(false);
    const invalid = submitted && selected.length === 0;
    const toggle = (item: string) => {
      setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
      if (submitted) setSubmitted(false);
    };

    return (
      <div className="quality-example">
        <fieldset className="quality-fieldset" aria-describedby={invalid ? "checkbox-choice-hint checkbox-choice-error" : "checkbox-choice-hint"}>
          <legend>{meta.field}</legend>
          <p className="demo-status" id="checkbox-choice-hint">Select all channels that should receive alerts.</p>
          {invalid && <p className="demo-error compact" id="checkbox-choice-error">Choose at least one alert channel.</p>}
          {meta.options.map((item) => (
            <label className="checkbox-label" key={item}>
              <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} aria-invalid={invalid} />
              {item}
            </label>
          ))}
        </fieldset>
        <div className="demo-row">
          <button type="button" className="demo-button small" onClick={() => { setSelected(meta.options); setSubmitted(false); }}>Select all</button>
          <button type="button" className="demo-button small" onClick={() => { setSelected([]); setSubmitted(false); }}>Clear</button>
          <button type="button" className="demo-button small primary" onClick={() => setSubmitted(true)}>Save</button>
        </div>
        <p className="demo-status">Selected: {selected.length > 0 ? selected.join(", ") : "none"}</p>
      </div>
    );
  }

  if (patternId === "multi-select") {
    const [selected, setSelected] = useState([meta.options[0], meta.options[2]]);
    const [query, setQuery] = useState("a");
    const [submitted, setSubmitted] = useState(false);
    const invalid = submitted && selected.length === 0;
    const filtered = meta.options.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
    const toggle = (item: string) => {
      setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
      if (submitted) setSubmitted(false);
    };
    const remove = (item: string) => {
      setSelected((current) => current.filter((value) => value !== item));
      if (submitted) setSubmitted(false);
    };

    return (
      <div className="quality-example">
        <label htmlFor="multi-select-filter">
          <span>{meta.field}</span>
        </label>
        <div className="demo-chips" aria-label="Selected assignees">
          {selected.length === 0 ? (
            <span className="demo-status">No assignees selected</span>
          ) : (
            selected.map((item) => (
              <button type="button" className="demo-chip" key={item} onClick={() => remove(item)} aria-label={`Remove ${item}`}>
                {item} x
              </button>
            ))
          )}
        </div>
        <input
          id="multi-select-filter"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-describedby={invalid ? "multi-select-hint multi-select-error" : "multi-select-hint"}
          aria-controls="multi-select-options"
        />
        <p className="demo-status" id="multi-select-hint">Type to filter, then toggle several people without closing the list.</p>
        {invalid && <p className="demo-error compact" id="multi-select-error">Choose at least one assignee.</p>}
        <div className="mini-result-list" id="multi-select-options" role="listbox" aria-label="Filtered assignees" aria-multiselectable="true">
          {filtered.length === 0 ? (
            <p className="demo-status">No matching assignees.</p>
          ) : (
            filtered.map((item) => {
              const isSelected = selected.includes(item);
              return (
                <button
                  type="button"
                  className={isSelected ? "pattern-row is-selected" : "pattern-row"}
                  key={item}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggle(item)}
                >
                  {isSelected ? "Selected: " : "Add: "}{item}
                </button>
              );
            })
          )}
        </div>
        <div className="demo-row">
          <button type="button" className="demo-button small" onClick={() => { setSelected(meta.options); setSubmitted(false); }}>Select all</button>
          <button type="button" className="demo-button small" onClick={() => { setSelected([]); setSubmitted(false); }}>Clear all</button>
          <button type="button" className="demo-button small primary" onClick={() => setSubmitted(true)}>Save</button>
        </div>
        <p className="demo-status">{selected.length} selected</p>
      </div>
    );
  }

  if (patternId === "segmented-control") {
    const [choice, setChoice] = useState(meta.options[0]);
    const [focused, setFocused] = useState(meta.options[0]);
    const [showOverflow, setShowOverflow] = useState(false);
    const focusedIndex = meta.options.indexOf(focused);
    const choiceIndex = meta.options.indexOf(choice);
    const records = [
      { name: "Design review", kind: "Workshop", date: "Today" },
      { name: "Prototype QA", kind: "Checklist", date: "Tomorrow" },
      { name: "Research readout", kind: "Meeting", date: "Friday" }
    ];
    const moveFocus = (direction: 1 | -1) => {
      const nextIndex = (focusedIndex + direction + meta.options.length) % meta.options.length;
      const next = meta.options[nextIndex];
      setFocused(next);
      requestAnimationFrame(() => document.getElementById(`segmented-live-${next.toLowerCase()}`)?.focus());
    };
    const activate = (item: string) => {
      setFocused(item);
      setChoice(item);
    };

    return (
      <div className="quality-example segmented-demo">
        <span className="demo-status" id="segmented-live-label">View schedule as</span>
        <div
          className="segmented-control"
          role="group"
          aria-labelledby="segmented-live-label"
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
              activate(focused);
            }
          }}
        >
          {meta.options.map((item) => {
            const selected = choice === item;
            const isFocused = focused === item;
            return (
              <button
                type="button"
                key={item}
                id={`segmented-live-${item.toLowerCase()}`}
                className={`${selected ? "segment-button is-selected" : "segment-button"}${isFocused && !selected ? " is-focused" : ""}`}
                aria-pressed={selected}
                tabIndex={isFocused ? 0 : -1}
                onFocus={() => setFocused(item)}
                onClick={() => activate(item)}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className={`segmented-content-preview ${choice.toLowerCase()}`} aria-live="polite">
          <strong>{choice} view</strong>
          {choice === "List" && records.map((record) => (
            <span key={record.name}>{record.name} - {record.date}</span>
          ))}
          {choice === "Board" && (
            <div className="segmented-board" aria-label="Board columns">
              <span>Now: 1</span>
              <span>Next: 2</span>
            </div>
          )}
          {choice === "Calendar" && (
            <div className="segmented-calendar" aria-label="Calendar density">
              <span>Mon</span><span>Tue</span><span>Wed</span>
              <strong>Fri</strong>
            </div>
          )}
        </div>
        <button type="button" className="demo-button small" onClick={() => setShowOverflow(!showOverflow)}>
          Try too many segments
        </button>
        {showOverflow && (
          <p className="demo-error compact">Six choices would wrap or scroll; use tabs, chips, or filters instead.</p>
        )}
        <p className="demo-status">Focused segment {focusedIndex + 1}; selected view {choiceIndex + 1}.</p>
      </div>
    );
  }

  const [choice, setChoice] = useState(meta.options[0]);
  return (
    <div className="quality-example">
      <div className="demo-row" role={patternId === "radio-group" ? "radiogroup" : "group"} aria-label={meta.field}>
        {meta.options.map((item) => (
          <button
            type="button"
            key={item}
            role={patternId === "radio-group" ? "radio" : undefined}
            aria-checked={patternId === "radio-group" ? choice === item : undefined}
            aria-pressed={patternId === "segmented-control" ? choice === item : undefined}
            className={choice === item ? "demo-button small primary" : "demo-button small"}
            onClick={() => setChoice(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="demo-status">Selected: {choice}</p>
    </div>
  );
}

function ListboxGoodUx({ meta }: { meta: PatternMeta }) {
  const options = [
    { id: "analyst", label: "Analyst", detail: "Reads reports" },
    { id: "designer", label: "Designer", detail: "Updates prototypes" },
    { id: "developer", label: "Developer", detail: "Ships changes" },
    { id: "support", label: "Support", detail: "Handles queue" },
    { id: "manager", label: "Manager", detail: "Approves access" },
    { id: "auditor", label: "Auditor", detail: "Reviews logs" }
  ];
  const [activeIndex, setActiveIndex] = useState(1);
  const [selectedId, setSelectedId] = useState("designer");
  const [selectionFollowsFocus, setSelectionFollowsFocus] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("Designer is selected; focus is on Designer.");
  const activeOption = options[activeIndex];
  const selectedOption = options.find((option) => option.id === selectedId);
  const invalid = submitted && !selectedId;

  const moveTo = (nextIndex: number, reason: string) => {
    const clamped = Math.max(0, Math.min(options.length - 1, nextIndex));
    const next = options[clamped];
    setActiveIndex(clamped);
    if (selectionFollowsFocus) {
      setSelectedId(next.id);
      setSubmitted(false);
      setMessage(`${reason}; ${next.label} became active and selected because selection follows focus.`);
    } else {
      setMessage(`${reason}; ${next.label} is active but ${selectedOption?.label ?? "nothing"} remains selected.`);
    }
  };

  const selectActive = () => {
    setSelectedId(activeOption.id);
    setSubmitted(false);
    setMessage(`${activeOption.label} selected from the active option.`);
  };

  const typeaheadSupport = () => {
    const nextIndex = options.findIndex((option) => option.label.toLowerCase().startsWith("s"));
    moveTo(nextIndex, "Typeahead S matched Support");
  };

  return (
    <div className="quality-example listbox-demo">
      <span className="demo-status" id="listbox-demo-label">{meta.field}</span>
      {invalid && <p className="demo-error compact" id="listbox-demo-error">Select one role before saving.</p>}
      <div
        className="listbox-list"
        role="listbox"
        tabIndex={0}
        aria-labelledby="listbox-demo-label"
        aria-describedby={invalid ? "listbox-demo-help listbox-demo-error" : "listbox-demo-help"}
        aria-activedescendant={`listbox-demo-${activeOption.id}`}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            moveTo(activeIndex + 1, "Down Arrow moved focus");
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            moveTo(activeIndex - 1, "Up Arrow moved focus");
          }
          if (event.key === "Home") {
            event.preventDefault();
            moveTo(0, "Home moved to the first option");
          }
          if (event.key === "End") {
            event.preventDefault();
            moveTo(options.length - 1, "End moved to the last option");
          }
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            selectActive();
          }
          if (event.key.toLowerCase() === "s") {
            event.preventDefault();
            typeaheadSupport();
          }
        }}
      >
        {options.map((option, index) => (
          <div
            id={`listbox-demo-${option.id}`}
            className={`${index === activeIndex ? "listbox-option is-active" : "listbox-option"}${option.id === selectedId ? " is-selected" : ""}`}
            role="option"
            aria-selected={option.id === selectedId}
            onClick={() => {
              setActiveIndex(index);
              if (selectionFollowsFocus) {
                setSelectedId(option.id);
                setMessage(`${option.label} clicked and selected because selection follows focus.`);
              } else {
                setMessage(`${option.label} is active; use Select active option to commit it.`);
              }
              setSubmitted(false);
            }}
            key={option.id}
          >
            <span>{option.label}</span>
            <em>{option.detail}</em>
          </div>
        ))}
      </div>
      <p className="demo-status" id="listbox-demo-help">Arrow keys move the active option. Selection changes only when explicitly selected unless the policy toggle is on.</p>
      <div className="demo-row listbox-actions">
        <button type="button" className="demo-button small" onClick={() => moveTo(activeIndex + 1, "Button moved focus")}>Move focus</button>
        <button type="button" className="demo-button small primary" onClick={selectActive}>Select active option</button>
        <button type="button" className="demo-button small" onClick={() => moveTo(0, "Home moved to the first option")}>Home</button>
        <button type="button" className="demo-button small" onClick={() => moveTo(options.length - 1, "End moved to the last option")}>End</button>
        <button type="button" className="demo-button small" onClick={typeaheadSupport}>Type S</button>
        <button
          type="button"
          className="demo-button small"
          aria-pressed={selectionFollowsFocus}
          onClick={() => {
            setSelectionFollowsFocus((current) => !current);
            setMessage(selectionFollowsFocus ? "Selection follows focus is off; focus movement previews only." : "Selection follows focus is on; moving focus also changes selection.");
          }}
        >
          {selectionFollowsFocus ? "Follows focus" : "Preview focus"}
        </button>
        <button type="button" className="demo-button small" onClick={() => { setSelectedId(""); setSubmitted(false); setMessage("Selection cleared; required validation can now be tested."); }}>Clear selection</button>
        <button type="button" className="demo-button small" onClick={() => { setSubmitted(true); setMessage(selectedId ? `${selectedOption?.label} is ready to save.` : "Validation stopped the empty listbox selection."); }}>Validate</button>
      </div>
      <div className="listbox-status-card" aria-live="polite">
        <strong>Active: {activeOption.label}</strong>
        <span>Selected: {selectedOption?.label ?? "none"}</span>
        <em>{message}</em>
      </div>
    </div>
  );
}

function ListboxBadUx() {
  const [mode, setMode] = useState<"actions" | "prefix" | "autocommit" | "stale">("actions");
  const copy = {
    actions: {
      title: "Interactive controls inside options",
      detail: "Rows include Edit and Delete buttons, but the listbox model exposes each row as one selectable option."
    },
    prefix: {
      title: "Repeated option prefixes",
      detail: "Each option starts with the same long office phrase before the unique word is announced."
    },
    autocommit: {
      title: "Focus commits the value",
      detail: "Arrowing through a high-risk access list immediately saves roles the user was only previewing."
    },
    stale: {
      title: "Stale active descendant",
      detail: "The visible active row changed, but aria-activedescendant still points to an option that is no longer present."
    }
  }[mode];

  const options = mode === "prefix"
    ? ["United Kingdom office role - Analyst", "United Kingdom office role - Designer", "United Kingdom office role - Support"]
    : ["Analyst", "Designer", "Support"];

  return (
    <div className="quality-example listbox-demo">
      <div className="listbox-list bad" role={mode === "stale" ? "listbox" : undefined} aria-activedescendant={mode === "stale" ? "removed-option" : undefined}>
        {options.map((option, index) => (
          <div className={index === 1 ? "listbox-option bad is-active" : "listbox-option bad"} key={option}>
            <span>{option}</span>
            {mode === "actions" && (
              <span className="listbox-row-actions">
                <button type="button" className="demo-button small">Edit</button>
                <button type="button" className="demo-button small danger">Delete</button>
              </span>
            )}
            {mode === "autocommit" && index === 1 && <em>saved on focus</em>}
          </div>
        ))}
      </div>
      <div className="demo-row listbox-actions">
        <button type="button" className="demo-button small" onClick={() => setMode("actions")}>Nested actions</button>
        <button type="button" className="demo-button small" onClick={() => setMode("prefix")}>Long prefixes</button>
        <button type="button" className="demo-button small" onClick={() => setMode("autocommit")}>Auto-save focus</button>
        <button type="button" className="demo-button small" onClick={() => setMode("stale")}>Stale focus</button>
      </div>
      <div className="listbox-status-card bad" aria-live="polite">
        <strong>{copy.title}</strong>
        <span>{copy.detail}</span>
      </div>
    </div>
  );
}

type TransferListItem = {
  id: string;
  label: string;
  detail: string;
  locked?: boolean;
};

const transferListItems: TransferListItem[] = [
  { id: "view-reports", label: "View reports", detail: "Read dashboards" },
  { id: "edit-users", label: "Edit users", detail: "Update team access" },
  { id: "billing-admin", label: "Billing admin", detail: "Manage invoices" },
  { id: "audit-logs", label: "Audit logs", detail: "Review events" },
  { id: "export-data", label: "Export data", detail: "Download records" },
  { id: "manage-team", label: "Manage team", detail: "Invite members" },
  { id: "security-review", label: "Security review", detail: "Required permission", locked: true }
];

function transferById(id: string) {
  return transferListItems.find((item) => item.id === id) ?? transferListItems[0];
}

function TransferListPane({
  label,
  idBase,
  itemIds,
  selectedIds,
  emptyText,
  onToggle,
  describedBy
}: {
  label: string;
  idBase: string;
  itemIds: string[];
  selectedIds: string[];
  emptyText: string;
  onToggle: (id: string) => void;
  describedBy?: string;
}) {
  const labelId = `${idBase}-label`;
  return (
    <section className="transfer-pane" aria-labelledby={labelId}>
      <div className="transfer-pane-header">
        <strong id={labelId}>{label}</strong>
        <span>{selectedIds.length}/{itemIds.length} selected</span>
      </div>
      <div
        className="transfer-listbox"
        role="listbox"
        aria-multiselectable="true"
        aria-label={label}
        aria-describedby={describedBy}
      >
        {itemIds.length === 0 ? (
          <p className="demo-status transfer-empty">{emptyText}</p>
        ) : (
          itemIds.map((id, index) => {
            const item = transferById(id);
            const selected = selectedIds.includes(id);
            return (
              <button
                type="button"
                className={`${selected ? "transfer-option is-selected" : "transfer-option"}${item.locked ? " is-locked" : ""}`}
                role="option"
                aria-selected={selected}
                key={id}
                onClick={() => onToggle(id)}
              >
                <span>
                  <strong>{item.label}</strong>
                  {item.locked && <em>Locked</em>}
                </span>
                <small>{item.detail}</small>
                <small>Position {index + 1}</small>
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

function TransferListGoodUi() {
  const availableIds = ["view-reports", "edit-users", "billing-admin", "audit-logs"];
  const chosenIds = ["manage-team", "security-review"];

  return (
    <div className="quality-example transfer-list-demo" aria-label="Transfer list preview">
      <TransferListPane
        label="Available permissions"
        idBase="transfer-ui-available"
        itemIds={availableIds}
        selectedIds={["billing-admin"]}
        emptyText="No available permissions"
        onToggle={() => undefined}
      />
      <div className="transfer-controls" aria-label="Transfer controls">
        <button type="button" className="demo-button small primary" aria-label="Add selected permissions">Add -&gt;</button>
        <button type="button" className="demo-button small" aria-label="Remove selected permissions" disabled>&lt;- Remove</button>
        <button type="button" className="demo-button small" aria-label="Add all permissions">Add all</button>
        <button type="button" className="demo-button small" aria-label="Remove all permissions" disabled>Remove all</button>
      </div>
      <TransferListPane
        label="Selected permissions"
        idBase="transfer-ui-selected"
        itemIds={chosenIds}
        selectedIds={[]}
        emptyText="No selected permissions"
        onToggle={() => undefined}
      />
      <div className="transfer-reorder-preview" aria-label="Selected permission order controls">
        <button type="button" className="demo-button small" disabled>Move up</button>
        <button type="button" className="demo-button small">Move down</button>
      </div>
      <p className="demo-status">Two labelled panes, counts, disabled controls, locked required item, and ordering controls make the submitted set inspectable.</p>
    </div>
  );
}

function TransferListBadUi() {
  return (
    <div className="bad-ui-sample transfer-list-bad-ui">
      <strong>Permissions</strong>
      <div className="transfer-bad-single-list">
        {["View reports", "Edit users", "Billing admin", "Audit logs", "Export data"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="transfer-bad-arrows" aria-hidden="true">
        <button type="button">&gt;</button>
        <button type="button">&lt;</button>
      </div>
      <p className="demo-status">The selected set is hidden behind arrows and a count; users cannot review, reorder, or understand disabled move state.</p>
    </div>
  );
}

function TransferListGoodUx() {
  const [availableIds, setAvailableIds] = useState(["view-reports", "edit-users", "billing-admin", "audit-logs", "export-data"]);
  const [chosenIds, setChosenIds] = useState(["manage-team", "security-review"]);
  const [availableSelected, setAvailableSelected] = useState(["billing-admin"]);
  const [chosenSelected, setChosenSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("Billing admin is selected in Available permissions; Add is ready.");
  const minimum = 2;
  const invalid = submitted && chosenIds.length < minimum;
  const firstChosenSelection = chosenSelected[0];
  const selectedChosenIndex = firstChosenSelection ? chosenIds.indexOf(firstChosenSelection) : -1;
  const canAdd = availableSelected.length > 0;
  const canRemove = chosenSelected.some((id) => !transferById(id).locked);
  const canMoveUp = selectedChosenIndex > 0 && Boolean(firstChosenSelection);
  const canMoveDown = selectedChosenIndex >= 0 && selectedChosenIndex < chosenIds.length - 1;

  const toggle = (id: string, side: "available" | "chosen") => {
    const setter = side === "available" ? setAvailableSelected : setChosenSelected;
    setter((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);
    setSubmitted(false);
  };

  const addSelected = () => {
    if (!canAdd) {
      setMessage("Choose at least one available permission before adding.");
      return;
    }
    const moving = availableSelected;
    setChosenIds((current) => [...current, ...moving]);
    setAvailableIds((current) => current.filter((id) => !moving.includes(id)));
    setAvailableSelected([]);
    setChosenSelected(moving);
    setSubmitted(false);
    setMessage(`${moving.map((id) => transferById(id).label).join(", ")} moved to Selected permissions.`);
  };

  const removeSelected = () => {
    const locked = chosenSelected.filter((id) => transferById(id).locked);
    const moving = chosenSelected.filter((id) => !transferById(id).locked);
    if (moving.length === 0) {
      setMessage(locked.length > 0 ? "Security review is locked and cannot be removed." : "Choose a selected permission before removing.");
      return;
    }
    setAvailableIds((current) => [...current, ...moving]);
    setChosenIds((current) => current.filter((id) => !moving.includes(id)));
    setAvailableSelected(moving);
    setChosenSelected(locked);
    setSubmitted(false);
    setMessage(`${moving.map((id) => transferById(id).label).join(", ")} moved back to Available permissions.`);
  };

  const moveChosen = (direction: -1 | 1) => {
    if (!firstChosenSelection) {
      setMessage("Choose one selected permission before reordering.");
      return;
    }
    const currentIndex = chosenIds.indexOf(firstChosenSelection);
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= chosenIds.length) {
      setMessage(`${transferById(firstChosenSelection).label} is already at that boundary.`);
      return;
    }
    const nextOrder = [...chosenIds];
    const [moved] = nextOrder.splice(currentIndex, 1);
    nextOrder.splice(nextIndex, 0, moved);
    setChosenIds(nextOrder);
    setMessage(`${transferById(firstChosenSelection).label} moved to position ${nextIndex + 1} of ${nextOrder.length}.`);
  };

  const validate = () => {
    setSubmitted(true);
    setMessage(chosenIds.length >= minimum ? `${chosenIds.length} permissions are ready to save.` : `Select at least ${minimum} permissions before saving.`);
  };

  return (
    <div className="quality-example transfer-list-demo">
      {invalid && <p className="demo-error compact" id="transfer-list-error">Select at least {minimum} permissions before saving.</p>}
      <TransferListPane
        label="Available permissions"
        idBase="transfer-live-available"
        itemIds={availableIds}
        selectedIds={availableSelected}
        emptyText="All permissions have been selected."
        onToggle={(id) => toggle(id, "available")}
        describedBy={invalid ? "transfer-list-status transfer-list-error" : "transfer-list-status"}
      />
      <div className="transfer-controls" aria-label="Transfer controls">
        <button type="button" className="demo-button small primary" onClick={addSelected} disabled={!canAdd}>Add -&gt;</button>
        <button type="button" className="demo-button small" onClick={removeSelected} disabled={!canRemove}>&lt;- Remove</button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            setChosenIds((current) => [...current, ...availableIds]);
            setChosenSelected(availableIds);
            setAvailableIds([]);
            setAvailableSelected([]);
            setSubmitted(false);
            setMessage("All available permissions moved to Selected permissions.");
          }}
          disabled={availableIds.length === 0}
        >
          Add all
        </button>
        <button
          type="button"
          className="demo-button small"
          onClick={() => {
            const removable = chosenIds.filter((id) => !transferById(id).locked);
            setAvailableIds((current) => [...current, ...removable]);
            setChosenIds((current) => current.filter((id) => transferById(id).locked));
            setAvailableSelected(removable);
            setChosenSelected(["security-review"]);
            setSubmitted(false);
            setMessage("Optional permissions removed; locked Security review stayed selected.");
          }}
          disabled={chosenIds.every((id) => transferById(id).locked)}
        >
          Remove optional
        </button>
      </div>
      <TransferListPane
        label="Selected permissions"
        idBase="transfer-live-selected"
        itemIds={chosenIds}
        selectedIds={chosenSelected}
        emptyText="No permissions selected."
        onToggle={(id) => toggle(id, "chosen")}
        describedBy={invalid ? "transfer-list-status transfer-list-error" : "transfer-list-status"}
      />
      <div className="transfer-reorder-preview" aria-label="Selected permission order controls">
        <button type="button" className="demo-button small" onClick={() => moveChosen(-1)} disabled={!canMoveUp}>Move up</button>
        <button type="button" className="demo-button small" onClick={() => moveChosen(1)} disabled={!canMoveDown}>Move down</button>
        <button type="button" className="demo-button small primary" onClick={validate}>Save</button>
      </div>
      <p className="demo-status" id="transfer-list-status" aria-live="polite">
        {message} Selected count: {chosenIds.length}.
      </p>
    </div>
  );
}

function TransferListBadUx() {
  const [mode, setMode] = useState<"hidden" | "enabled" | "drag" | "filter">("hidden");
  const copy = {
    hidden: "Selected permissions are hidden behind a count, so users cannot review what will be saved.",
    enabled: "Move buttons stay enabled with no selected item and only produce silent no-op clicks.",
    drag: "Ordering requires pointer drag; keyboard users cannot move Export data above Billing admin.",
    filter: "Filtering available permissions also clears selected permissions from the submitted set."
  }[mode];

  return (
    <div className="quality-example transfer-list-demo transfer-list-bad-ux">
      <div className="transfer-pane bad">
        <div className="transfer-pane-header">
          <strong>Available</strong>
          <span>{mode === "filter" ? "1 result" : "5 items"}</span>
        </div>
        <div className="transfer-listbox bad">
          {(mode === "filter" ? ["Audit logs"] : ["View reports", "Edit users", "Billing admin"]).map((item) => (
            <span className="transfer-option bad" key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="transfer-controls bad" aria-label="Broken transfer controls">
        <button type="button" className="demo-button small danger">&gt;</button>
        <button type="button" className="demo-button small danger">&lt;</button>
        <button type="button" className="demo-button small danger">Drag only</button>
      </div>
      <div className="transfer-pane bad">
        <div className="transfer-pane-header">
          <strong>{mode === "hidden" ? "Selected count" : "Selected"}</strong>
          <span>{mode === "filter" ? "0 selected" : "2 selected"}</span>
        </div>
        <div className="transfer-listbox bad">
          {mode === "hidden" ? (
            <span className="transfer-option bad">Values hidden until save</span>
          ) : (
            ["Billing admin", "Export data"].map((item) => <span className="transfer-option bad" key={item}>{item}</span>)
          )}
        </div>
      </div>
      <div className="demo-row listbox-actions">
        <button type="button" className="demo-button small" onClick={() => setMode("hidden")}>Hide chosen</button>
        <button type="button" className="demo-button small" onClick={() => setMode("enabled")}>No-op buttons</button>
        <button type="button" className="demo-button small" onClick={() => setMode("drag")}>Drag-only order</button>
        <button type="button" className="demo-button small" onClick={() => setMode("filter")}>Filter loses values</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy}</p>
    </div>
  );
}

type TreeNode = {
  id: string;
  label: string;
  detail: string;
  children?: TreeNode[];
  selectable?: boolean;
};

type FlatTreeNode = TreeNode & {
  level: number;
  parentId?: string;
};

const treeSelectionNodes: TreeNode[] = [
  {
    id: "workspace",
    label: "Workspace",
    detail: "All workspace permissions",
    children: [
      {
        id: "reports",
        label: "Reports",
        detail: "Dashboards and exports",
        children: [
          { id: "monthly", label: "Monthly revenue", detail: "View revenue reports" },
          { id: "exports", label: "Exports", detail: "Download report data" }
        ]
      },
      {
        id: "billing",
        label: "Billing",
        detail: "Invoices and payment settings",
        children: [
          { id: "invoices", label: "Invoices", detail: "View and send invoices" },
          { id: "plans", label: "Plans", detail: "Change subscription plan" }
        ]
      },
      {
        id: "security",
        label: "Security",
        detail: "Audit and access controls",
        children: [
          { id: "audit", label: "Audit logs", detail: "Review security events" },
          { id: "sso", label: "Single sign-on", detail: "Configure identity provider" }
        ]
      }
    ]
  },
  {
    id: "archive",
    label: "Archive",
    detail: "Historical records",
    children: [
      { id: "legacy", label: "Legacy reports", detail: "Read-only archive" }
    ]
  }
];

function findTreeNode(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const child = node.children ? findTreeNode(node.children, id) : undefined;
    if (child) return child;
  }
  return undefined;
}

function flattenTree(nodes: TreeNode[], expanded: Set<string>, level = 1, parentId?: string): FlatTreeNode[] {
  return nodes.flatMap((node) => {
    const current = { ...node, level, parentId };
    if (!node.children || !expanded.has(node.id)) return [current];
    return [current, ...flattenTree(node.children, expanded, level + 1, node.id)];
  });
}

function collectDescendantIds(node: TreeNode): string[] {
  return node.children?.flatMap((child) => [child.id, ...collectDescendantIds(child)]) ?? [];
}

function treeSelectionState(node: TreeNode, selected: Set<string>): "true" | "false" | "mixed" {
  const ids = [node.id, ...collectDescendantIds(node)];
  const selectedCount = ids.filter((id) => selected.has(id)).length;
  if (selectedCount === 0) return "false";
  if (selectedCount === ids.length) return "true";
  return "mixed";
}

function TreeSelectionRow({
  node,
  active,
  expanded,
  selected,
  onActivate,
  onToggleExpand,
  onToggleSelection
}: {
  node: FlatTreeNode;
  active: boolean;
  expanded: boolean;
  selected: Set<string>;
  onActivate: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onToggleSelection: (id: string) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const state = treeSelectionState(node, selected);
  const hiddenSelected = hasChildren && !expanded && collectDescendantIds(node).some((id) => selected.has(id));
  return (
    <button
      type="button"
      id={`tree-selection-node-${node.id}`}
      className={`${active ? "tree-selection-row is-active" : "tree-selection-row"}${state === "true" ? " is-selected" : ""}${state === "mixed" ? " is-mixed" : ""}`}
      role="treeitem"
      aria-level={node.level}
      aria-expanded={hasChildren ? expanded : undefined}
      aria-checked={state}
      tabIndex={active ? 0 : -1}
      style={{ "--tree-level": node.level } as CSSProperties}
      onClick={() => onActivate(node.id)}
      onDoubleClick={() => {
        if (hasChildren) onToggleExpand(node.id);
      }}
    >
      <span className="tree-selection-label">
        <span className="tree-selection-twisty" aria-hidden="true">{hasChildren ? (expanded ? "v" : ">") : ""}</span>
        <span className="tree-selection-check" aria-hidden="true">{state === "mixed" ? "-" : state === "true" ? "OK" : ""}</span>
        <strong>{node.label}</strong>
        {hiddenSelected && <em>{collectDescendantIds(node).filter((id) => selected.has(id)).length} selected inside</em>}
      </span>
      <small>{node.detail}</small>
      <span className="tree-selection-inline-actions" aria-hidden="true">
        {hasChildren && <span onClick={(event) => { event.stopPropagation(); onToggleExpand(node.id); }}>{expanded ? "Collapse" : "Expand"}</span>}
        <span onClick={(event) => { event.stopPropagation(); onToggleSelection(node.id); }}>Toggle</span>
      </span>
    </button>
  );
}

function TreeSelectionGoodUi() {
  const expanded = new Set(["workspace", "reports", "security"]);
  const selected = new Set(["monthly", "exports", "audit"]);
  const visible = flattenTree(treeSelectionNodes, expanded);

  return (
    <div className="quality-example tree-selection-demo">
      <span className="demo-status" id="tree-selection-ui-label">Workspace permission tree</span>
      <div className="tree-selection-tree" role="tree" aria-labelledby="tree-selection-ui-label" aria-multiselectable="true">
        {visible.slice(0, 8).map((node) => (
          <TreeSelectionRow
            key={node.id}
            node={node}
            active={node.id === "exports"}
            expanded={expanded.has(node.id)}
            selected={selected}
            onActivate={() => undefined}
            onToggleExpand={() => undefined}
            onToggleSelection={() => undefined}
          />
        ))}
      </div>
      <p className="demo-status">Expanded branches, active focus, selected leaves, mixed parent state, and selected-descendant indicators are all visible.</p>
    </div>
  );
}

function TreeSelectionBadUi() {
  return (
    <div className="bad-ui-sample tree-selection-bad-ui">
      <strong>Permissions</strong>
      <div className="tree-selection-fake-list">
        <label><input type="checkbox" readOnly /> Workspace</label>
        <label className="indent"><input type="checkbox" readOnly /> Reports</label>
        <label className="indent2"><input type="checkbox" readOnly /> Monthly revenue</label>
        <label className="indent2"><input type="checkbox" readOnly /> Exports</label>
        <label className="indent"><input type="checkbox" readOnly /> Security</label>
      </div>
      <p className="demo-status">Indented checkboxes imitate a tree but expose no active treeitem, expanded branch state, selected-descendant summary, or Arrow-key tree navigation.</p>
    </div>
  );
}

function TreeSelectionGoodUx() {
  const [expandedIds, setExpandedIds] = useState(new Set(["workspace", "reports"]));
  const [selectedIds, setSelectedIds] = useState(new Set(["monthly"]));
  const [activeId, setActiveId] = useState("reports");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("Reports is focused; Monthly revenue is selected.");
  const visible = flattenTree(treeSelectionNodes, expandedIds);
  const activeIndex = Math.max(0, visible.findIndex((node) => node.id === activeId));
  const activeNode = visible[activeIndex] ?? visible[0];
  const invalid = submitted && selectedIds.size === 0;

  const setExpanded = (next: Set<string>, status: string) => {
    setExpandedIds(next);
    setMessage(status);
  };

  const toggleExpand = (id = activeId) => {
    const node = findTreeNode(treeSelectionNodes, id);
    if (!node?.children?.length) {
      setMessage(`${node?.label ?? "Leaf node"} is a leaf and does not expose expanded state.`);
      return;
    }
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
      setExpanded(next, `${node.label} collapsed; selected descendants stay selected.`);
    } else {
      next.add(id);
      setExpanded(next, `${node.label} expanded; child treeitems are now visible.`);
    }
  };

  const moveFocus = (nextIndex: number, reason: string) => {
    const clamped = Math.max(0, Math.min(visible.length - 1, nextIndex));
    const next = visible[clamped];
    setActiveId(next.id);
    setMessage(`${reason}; focus is on ${next.label}, selection is unchanged.`);
  };

  const toggleSelection = (id = activeId) => {
    const node = findTreeNode(treeSelectionNodes, id);
    if (!node) return;
    const affected = node.children?.length ? [node.id, ...collectDescendantIds(node)] : [node.id];
    const currentState = treeSelectionState(node, selectedIds);
    const next = new Set(selectedIds);
    if (currentState === "true") {
      affected.forEach((item) => next.delete(item));
      setMessage(`${node.label} and its descendants were unselected.`);
    } else {
      affected.forEach((item) => next.add(item));
      setMessage(node.children?.length ? `${node.label} descendants selected; parent state is now selected.` : `${node.label} selected.`);
    }
    setSelectedIds(next);
    setSubmitted(false);
  };

  const typeaheadAudit = () => {
    const target = "audit";
    const needsSecurityOpen = !visible.some((node) => node.id === target);
    if (needsSecurityOpen) {
      const nextExpanded = new Set(expandedIds);
      nextExpanded.add("workspace");
      nextExpanded.add("security");
      setExpandedIds(nextExpanded);
    }
    setActiveId(target);
    setMessage("Typeahead A matched Audit logs without changing selected nodes.");
  };

  const rightArrow = () => {
    if (!activeNode.children?.length) {
      setMessage(`${activeNode.label} is a leaf; Right Arrow does nothing.`);
      return;
    }
    if (!expandedIds.has(activeNode.id)) {
      toggleExpand(activeNode.id);
      return;
    }
    moveFocus(activeIndex + 1, "Right Arrow moved to first child");
  };

  const leftArrow = () => {
    if (activeNode.children?.length && expandedIds.has(activeNode.id)) {
      toggleExpand(activeNode.id);
      return;
    }
    if (activeNode.parentId) {
      setActiveId(activeNode.parentId);
      const parent = findTreeNode(treeSelectionNodes, activeNode.parentId);
      setMessage(`Left Arrow moved focus to parent ${parent?.label ?? activeNode.parentId}.`);
      return;
    }
    setMessage(`${activeNode.label} is a root node; Left Arrow does nothing.`);
  };

  const collapseReportsForScreenshot = () => {
    const next = new Set(expandedIds);
    next.delete("reports");
    next.add("workspace");
    setExpandedIds(next);
    setActiveId("reports");
    setMessage("Reports collapsed while selected descendants remain summarized on the parent.");
  };

  return (
    <div className="quality-example tree-selection-demo">
      <span className="demo-status" id="tree-selection-live-label">Permission tree</span>
      {invalid && <p className="demo-error compact" id="tree-selection-error">Select at least one permission before saving.</p>}
      <div
        className="tree-selection-tree"
        role="tree"
        aria-labelledby="tree-selection-live-label"
        aria-describedby={invalid ? "tree-selection-help tree-selection-error" : "tree-selection-help"}
        aria-multiselectable="true"
        aria-activedescendant={`tree-selection-node-${activeNode.id}`}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            moveFocus(activeIndex + 1, "Down Arrow moved focus");
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            moveFocus(activeIndex - 1, "Up Arrow moved focus");
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            rightArrow();
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            leftArrow();
          }
          if (event.key === "Home") {
            event.preventDefault();
            moveFocus(0, "Home moved to the first visible node");
          }
          if (event.key === "End") {
            event.preventDefault();
            moveFocus(visible.length - 1, "End moved to the last visible node");
          }
          if (event.key === " ") {
            event.preventDefault();
            toggleSelection(activeId);
          }
          if (event.key.toLowerCase() === "a") {
            event.preventDefault();
            typeaheadAudit();
          }
        }}
      >
        {visible.map((node) => (
          <TreeSelectionRow
            key={node.id}
            node={node}
            active={node.id === activeId}
            expanded={expandedIds.has(node.id)}
            selected={selectedIds}
            onActivate={(id) => {
              setActiveId(id);
              setMessage(`${findTreeNode(treeSelectionNodes, id)?.label ?? id} focused; selected set is unchanged.`);
            }}
            onToggleExpand={toggleExpand}
            onToggleSelection={toggleSelection}
          />
        ))}
      </div>
      <p className="demo-status" id="tree-selection-help">Arrow keys move through visible treeitems. Space toggles the focused node; focus and selection are separate.</p>
      <div className="demo-row listbox-actions">
        <button type="button" className="demo-button small" onClick={rightArrow}>Right Arrow</button>
        <button type="button" className="demo-button small" onClick={leftArrow}>Left Arrow</button>
        <button type="button" className="demo-button small" onClick={() => moveFocus(activeIndex + 1, "Button moved focus")}>Move focus</button>
        <button type="button" className="demo-button small primary" onClick={() => toggleSelection(activeId)}>Space toggle</button>
        <button type="button" className="demo-button small" onClick={() => toggleSelection("reports")}>Select Reports branch</button>
        <button type="button" className="demo-button small" onClick={typeaheadAudit}>Type A</button>
        <button type="button" className="demo-button small" onClick={collapseReportsForScreenshot}>Collapse selected branch</button>
        <button type="button" className="demo-button small" onClick={() => { setSelectedIds(new Set()); setSubmitted(false); setMessage("Selection cleared; validation can now be tested."); }}>Clear</button>
        <button type="button" className="demo-button small" onClick={() => { setSubmitted(true); setMessage(selectedIds.size > 0 ? `${selectedIds.size} tree nodes ready to save.` : "Validation stopped the empty tree selection."); }}>Save</button>
      </div>
      <div className="tree-selection-status" aria-live="polite">
        <strong>Focused: {activeNode.label}</strong>
        <span>Selected nodes: {selectedIds.size}</span>
        <em>{message}</em>
      </div>
    </div>
  );
}

function TreeSelectionBadUx() {
  const [mode, setMode] = useState<"hidden" | "focus" | "leaf" | "lazy">("hidden");
  const copy = {
    hidden: "A collapsed parent hides selected children with no mixed or selected-descendant indicator.",
    focus: "Arrowing through the tree changes selected permissions, so exploration becomes a destructive action.",
    leaf: "Leaf nodes announce as expandable because aria-expanded is applied to every row.",
    lazy: "A lazy-loaded branch inserts children with no loading status, level, set size, or position metadata."
  }[mode];

  return (
    <div className="quality-example tree-selection-demo tree-selection-bad-ux">
      <div className="tree-selection-tree bad" role={mode === "leaf" ? "tree" : undefined} aria-label="Broken permission tree">
        <button type="button" className="tree-selection-row bad is-active" role={mode === "leaf" ? "treeitem" : undefined} aria-expanded={mode === "leaf" ? "false" : undefined}>
          <span className="tree-selection-label"><span className="tree-selection-twisty">&gt;</span><strong>Reports</strong></span>
          <small>{mode === "hidden" ? "2 selected children hidden" : "Focus also selects this branch"}</small>
        </button>
        <button type="button" className="tree-selection-row bad" role={mode === "leaf" ? "treeitem" : undefined} aria-expanded={mode === "leaf" ? "false" : undefined}>
          <span className="tree-selection-label"><span className="tree-selection-twisty">&gt;</span><strong>Billing admin</strong></span>
          <small>{mode === "lazy" ? "Loaded without position metadata" : "Leaf row marked expandable"}</small>
        </button>
        <button type="button" className="tree-selection-row bad" role={mode === "leaf" ? "treeitem" : undefined} aria-expanded={mode === "leaf" ? "false" : undefined}>
          <span className="tree-selection-label"><span className="tree-selection-twisty">&gt;</span><strong>Audit logs</strong></span>
          <small>{mode === "focus" ? "Selected by focus movement" : "No selected state exposed"}</small>
        </button>
      </div>
      <div className="demo-row listbox-actions">
        <button type="button" className="demo-button small" onClick={() => setMode("hidden")}>Hide children</button>
        <button type="button" className="demo-button small" onClick={() => setMode("focus")}>Selection follows focus</button>
        <button type="button" className="demo-button small" onClick={() => setMode("leaf")}>Expandable leaves</button>
        <button type="button" className="demo-button small" onClick={() => setMode("lazy")}>Unannounced lazy load</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy}</p>
    </div>
  );
}

type ObjectPickerRecord = {
  id: string;
  name: string;
  type: string;
  detail: string;
  meta: string;
  status: "Active" | "Archived" | "External";
};

const objectPickerRecords: ObjectPickerRecord[] = [
  {
    id: "acct-1042",
    name: "Acme Retail",
    type: "Account",
    detail: "EMEA customer account",
    meta: "Owner Priya Shah - Active contract",
    status: "Active"
  },
  {
    id: "acct-4811",
    name: "Acme Retail",
    type: "Account",
    detail: "APAC supplier account",
    meta: "Owner Omar Reed - Archived",
    status: "Archived"
  },
  {
    id: "proj-2380",
    name: "Acme rollout",
    type: "Project",
    detail: "Implementation workspace",
    meta: "Owner Mina Patel - Active",
    status: "Active"
  },
  {
    id: "user-5521",
    name: "Ada Lovelace",
    type: "Person",
    detail: "Data platform lead",
    meta: "ada@example.com - Engineering",
    status: "Active"
  },
  {
    id: "file-9007",
    name: "Archive import",
    type: "File",
    detail: "CSV import package",
    meta: "External storage - Needs review",
    status: "External"
  }
];

function objectPickerInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ObjectPickerRow({
  record,
  active = false,
  selected = false,
  onClick
}: {
  record: ObjectPickerRecord;
  active?: boolean;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`${active ? "object-picker-row is-active" : "object-picker-row"}${selected ? " is-selected" : ""}`}
      role="option"
      aria-selected={selected}
      onClick={onClick}
    >
      <span className="object-picker-avatar" aria-hidden="true">{objectPickerInitials(record.name)}</span>
      <span className="object-picker-main">
        <strong>{record.name}</strong>
        <small>{record.type} - {record.detail}</small>
      </span>
      <span className={`object-picker-status status-${record.status.toLowerCase()}`}>{record.status}</span>
      <code>{record.id}</code>
    </button>
  );
}

function ObjectPickerPreview({ record }: { record: ObjectPickerRecord }) {
  return (
    <div className="object-picker-preview" aria-label={`Selected ${record.type} ${record.name}`}>
      <span className="object-picker-avatar" aria-hidden="true">{objectPickerInitials(record.name)}</span>
      <span>
        <strong>{record.name}</strong>
        <small>{record.type} - {record.meta}</small>
      </span>
      <code>{record.id}</code>
    </div>
  );
}

function ObjectPickerGoodUi() {
  const selected = objectPickerRecords[0];
  return (
    <div className="quality-example object-picker-demo">
      <label htmlFor="object-picker-ui-input">
        <span>Related account</span>
      </label>
      <div className="object-picker-scope" aria-label="Lookup scope">
        <span className="object-picker-scope-chip">Active accounts</span>
        <span>Existing objects only</span>
      </div>
      <input
        id="object-picker-ui-input"
        value="Acme"
        readOnly
        role="combobox"
        aria-expanded="true"
        aria-controls="object-picker-ui-results"
        aria-activedescendant="object-picker-ui-acme"
        aria-describedby="object-picker-ui-help"
      />
      <p className="demo-status" id="object-picker-ui-help">Search results include object type, status, owner, and ID so duplicate names can be distinguished.</p>
      <div className="object-picker-results" id="object-picker-ui-results" role="listbox" aria-label="Matching objects">
        <ObjectPickerRow record={selected} active selected />
        <ObjectPickerRow record={objectPickerRecords[1]} />
        <ObjectPickerRow record={objectPickerRecords[2]} />
      </div>
      <ObjectPickerPreview record={selected} />
    </div>
  );
}

function ObjectPickerBadUi() {
  return (
    <div className="bad-ui-sample object-picker-bad-ui">
      <label htmlFor="object-picker-bad-field">Related account</label>
      <input id="object-picker-bad-field" value="Acme Retail" readOnly />
      <div className="object-picker-bad-results" aria-label="Undifferentiated results">
        <button type="button">Acme Retail</button>
        <button type="button">Acme Retail</button>
        <button type="button">Acme Retail</button>
      </div>
      <p className="demo-status">Same labels, no object type, no owner, no status, no ID, and no selected-object preview.</p>
    </div>
  );
}

function ObjectPickerGoodUx() {
  const [inputValue, setInputValue] = useState("Acme");
  const [scope, setScope] = useState<"active" | "all">("active");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedId, setSelectedId] = useState("acct-1042");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("Selected Acme Retail acct-1042 after comparing duplicate record metadata.");
  const filtered = objectPickerRecords.filter((record) => {
    const inScope = scope === "all" || record.status === "Active";
    const query = inputValue.toLowerCase();
    return inScope && [record.name, record.type, record.detail, record.meta, record.id].some((value) => value.toLowerCase().includes(query));
  });
  const activeRecord = filtered[Math.min(activeIndex, Math.max(filtered.length - 1, 0))];
  const selectedRecord = objectPickerRecords.find((record) => record.id === selectedId);
  const invalid = submitted && !selectedRecord;

  const searchAcme = () => {
    setInputValue("Acme");
    setActiveIndex(0);
    setSubmitted(false);
    setMessage("Two Acme-labelled objects can be compared by type, status, owner, and ID before selection.");
  };
  const moveActive = () => {
    if (filtered.length === 0) return;
    const nextIndex = (activeIndex + 1) % filtered.length;
    setActiveIndex(nextIndex);
    setMessage(`${filtered[nextIndex].name} ${filtered[nextIndex].id} is active; selection is unchanged until Choose object is pressed.`);
  };
  const chooseActive = () => {
    if (!activeRecord) {
      setSelectedId("");
      setMessage("No object is active, so nothing was selected.");
      return;
    }
    setSelectedId(activeRecord.id);
    setInputValue(activeRecord.name);
    setSubmitted(false);
    setMessage(`${activeRecord.name} ${activeRecord.id} was selected and is now shown in the preview.`);
  };
  const toggleScope = () => {
    const next = scope === "active" ? "all" : "active";
    setScope(next);
    setActiveIndex(0);
    setSubmitted(false);
    setMessage(next === "all" ? "Archived and external objects are now labelled in the result list." : "Results are limited back to active objects.");
  };
  const editAfterSelect = () => {
    setInputValue("Acme Retail edited");
    setSelectedId("");
    setSubmitted(false);
    setMessage("Editing the visible label cleared the committed object ID until another result is chosen.");
  };
  const save = () => {
    setSubmitted(true);
    setMessage(selectedRecord ? `${selectedRecord.name} ${selectedRecord.id} is ready to link.` : "Validation stopped unresolved text because no existing object is selected.");
  };

  return (
    <div className="quality-example object-picker-demo">
      <label htmlFor="object-picker-live-input">
        <span>Related object</span>
      </label>
      <div className="object-picker-scope" aria-label="Current lookup scope">
        <span className="object-picker-scope-chip">{scope === "active" ? "Active objects" : "All visible objects"}</span>
        <span>{filtered.length} result{filtered.length === 1 ? "" : "s"}</span>
      </div>
      <input
        id="object-picker-live-input"
        value={inputValue}
        onChange={(event) => {
          setInputValue(event.target.value);
          setSelectedId("");
          setSubmitted(false);
          setActiveIndex(0);
          setMessage("Typing changed the visible label, so the committed object ID was cleared.");
        }}
        role="combobox"
        aria-expanded="true"
        aria-controls="object-picker-live-results"
        aria-activedescendant={activeRecord ? `object-picker-live-${activeRecord.id}` : undefined}
        aria-invalid={invalid}
        aria-describedby={invalid ? "object-picker-live-help object-picker-live-error" : "object-picker-live-help"}
      />
      <p className="demo-status" id="object-picker-live-help">Choose an existing object; typed text alone is not a valid record reference.</p>
      {invalid && <p className="demo-error compact" id="object-picker-live-error">Select an existing object before saving.</p>}
      <div className="object-picker-results" id="object-picker-live-results" role="listbox" aria-label="Object lookup results">
        {filtered.length === 0 ? (
          <p className="demo-status">No matching objects in this scope.</p>
        ) : (
          filtered.map((record, index) => (
            <ObjectPickerRow
              key={record.id}
              record={record}
              active={record.id === activeRecord?.id}
              selected={record.id === selectedId}
              onClick={() => {
                setActiveIndex(index);
                setSelectedId(record.id);
                setInputValue(record.name);
                setSubmitted(false);
                setMessage(`${record.name} ${record.id} selected from the result list.`);
              }}
            />
          ))
        )}
      </div>
      {selectedRecord ? <ObjectPickerPreview record={selectedRecord} /> : <p className="object-picker-unresolved">No committed object ID.</p>}
      <div className="demo-row object-picker-actions">
        <button type="button" className="demo-button small" onClick={searchAcme}>Search Acme</button>
        <button type="button" className="demo-button small" onClick={moveActive}>Move active result</button>
        <button type="button" className="demo-button small primary" onClick={chooseActive}>Choose object</button>
        <button type="button" className="demo-button small" onClick={toggleScope}>{scope === "active" ? "Include archived" : "Active only"}</button>
        <button type="button" className="demo-button small" onClick={editAfterSelect}>Edit label</button>
        <button type="button" className="demo-button small" onClick={() => { setSelectedId(""); setInputValue(""); setSubmitted(false); setMessage("Object cleared from the field and submitted ID."); }}>Clear</button>
        <button type="button" className="demo-button small primary" onClick={save}>Save link</button>
      </div>
      <p className="object-picker-status-line" aria-live="polite">{message}</p>
    </div>
  );
}

function ObjectPickerBadUx() {
  const [mode, setMode] = useState<"stale" | "duplicate" | "scope" | "freeText">("stale");
  const copy = {
    stale: "The visible label changed, but the hidden ID would still submit acct-4811.",
    duplicate: "Three Acme rows have the same label, so the first result is a guess.",
    scope: "Archived and external records are mixed into an active-account task with no warning.",
    freeText: "Typed text is accepted even though the workflow needs an existing object ID."
  }[mode];

  return (
    <div className="quality-example object-picker-demo object-picker-bad-ux">
      <div className="object-picker-broken-field">
        <strong>{mode === "freeText" ? "Free text accepted" : "Acme Retail"}</strong>
        <small>{mode === "stale" ? "Hidden ID: acct-4811" : mode === "scope" ? "Scope: every object" : "No metadata shown"}</small>
      </div>
      <div className="object-picker-bad-results" aria-label="Broken object picker examples">
        <button type="button">Acme Retail</button>
        <button type="button">Acme Retail</button>
        <button type="button">Acme Retail</button>
      </div>
      <div className="demo-row object-picker-actions">
        <button type="button" className="demo-button small" onClick={() => setMode("stale")}>Stale ID</button>
        <button type="button" className="demo-button small" onClick={() => setMode("duplicate")}>Duplicate names</button>
        <button type="button" className="demo-button small" onClick={() => setMode("scope")}>Broad scope</button>
        <button type="button" className="demo-button small" onClick={() => setMode("freeText")}>Free text</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy}</p>
    </div>
  );
}

function ActionSheetGoodUi() {
  return (
    <div className="quality-example action-sheet-static-preview" aria-label="Action sheet preview">
      <div className="action-sheet-phone">
        <div className="action-sheet-page">
          <strong>Message draft 18</strong>
          <span>Unsaved reply to Marina</span>
          <button type="button" className="demo-button small primary">Cancel draft</button>
        </div>
        <section className="action-sheet-surface" aria-labelledby="action-sheet-ui-title" aria-describedby="action-sheet-ui-desc">
          <div className="action-sheet-heading">
            <h3 id="action-sheet-ui-title">Save this draft?</h3>
            <p id="action-sheet-ui-desc">Choose what happens to Message draft 18 before leaving the composer.</p>
          </div>
          <div className="action-sheet-choice-group">
            <button type="button">Save draft</button>
            <button type="button" className="danger">Discard draft</button>
          </div>
          <button type="button" className="action-sheet-cancel">Keep editing</button>
        </section>
      </div>
      <p className="demo-status">The sheet appears after an initiated Cancel action, offers a few task-related choices, separates the destructive option, and keeps a clear safe escape.</p>
    </div>
  );
}

function ActionSheetBadUi() {
  return (
    <div className="bad-ui-sample action-sheet-static-preview bad" aria-label="Broken action sheet preview">
      <div className="action-sheet-phone bad">
        <div className="action-sheet-page">
          <strong>Inbox</strong>
          <span>No initiated action is visible.</span>
        </div>
        <div className="action-sheet-surface bad">
          <strong>Options</strong>
          <p>A scrollable bottom overlay mixes navigation, filters, previews, settings, and a destructive command.</p>
          <div className="action-sheet-overload-list">
            <button type="button">Home</button>
            <button type="button">Filter unread</button>
            <input aria-label="Search inside action sheet" value="draft" readOnly />
            <button type="button">Preview message</button>
            <button type="button">Delete</button>
          </div>
        </div>
      </div>
      <p className="demo-status">The surface has no source action, no cancel choice, too much content, and no destructive-role separation.</p>
    </div>
  );
}

function ActionSheetGoodUx({ meta }: { meta: PatternMeta }) {
  type Mode = "draft" | "share";
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("draft");
  const [result, setResult] = useState("Composer is open with an unsaved message draft.");
  const [review, setReview] = useState(false);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const firstChoiceRef = useRef<HTMLButtonElement | null>(null);
  const safeLabel = mode === "draft" ? "Save draft" : "Copy link";
  const dangerLabel = mode === "draft" ? "Discard draft" : "Report image";
  const cancelLabel = mode === "draft" ? "Keep editing" : "Cancel";
  const title = mode === "draft" ? "Save this draft?" : "Photo actions";
  const description = mode === "draft"
    ? "Choose what happens to Message draft 18 before leaving the composer."
    : "Choose one immediate action for Photo 42.";

  const openSheet = (nextMode: Mode, message: string) => {
    setMode(nextMode);
    setOpen(true);
    setReview(false);
    setResult(message);
    window.setTimeout(() => firstChoiceRef.current?.focus(), 0);
  };

  const closeSheet = (message: string) => {
    setOpen(false);
    setReview(false);
    setResult(`${message}; focus returned to ${mode === "draft" ? meta.field : "Photo actions"}.`);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  };

  const activateSafe = () => {
    closeSheet(mode === "draft" ? "Draft saved for later editing" : "Photo link copied");
  };

  const activateDanger = () => {
    if (mode === "share") {
      setReview(true);
      setResult("Report image moved to review before commitment.");
      return;
    }
    setOpen(false);
    setReview(false);
    setResult("Message draft 18 discarded after the destructive sheet choice; composer closed.");
    window.setTimeout(() => openerRef.current?.focus(), 0);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeSheet("Dismissed with Escape");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, mode]);

  return (
    <div className="quality-example action-sheet-demo">
      <div className="action-sheet-phone live">
        <div className="action-sheet-page">
          <strong>{mode === "draft" ? meta.subject : "Photo 42"}</strong>
          <span>{mode === "draft" ? "Unsaved reply to Marina" : "Selected image in the album"}</span>
          <button
            ref={openerRef}
            type="button"
            className="demo-button small primary"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => openSheet("draft", "Cancel draft opened an action sheet for Message draft 18.")}
          >
            {meta.field}
          </button>
        </div>
        {open && (
          <div className="action-sheet-backdrop">
            <section className="action-sheet-surface live" role="dialog" aria-modal="true" aria-labelledby="action-sheet-live-title" aria-describedby="action-sheet-live-desc">
              <div className="action-sheet-heading">
                <h3 id="action-sheet-live-title">{title}</h3>
                <p id="action-sheet-live-desc">{description}</p>
              </div>
              <div className="action-sheet-choice-group">
                <button ref={firstChoiceRef} type="button" onClick={activateSafe}>{safeLabel}</button>
                {mode === "share" && <button type="button" onClick={() => closeSheet("Shared image through system share choices")}>Share image</button>}
                <button type="button" className="danger" onClick={activateDanger}>{dangerLabel}</button>
              </div>
              <button type="button" className="action-sheet-cancel" onClick={() => closeSheet(`${cancelLabel} selected`)}>
                {cancelLabel}
              </button>
            </section>
          </div>
        )}
      </div>
      {review && (
        <div className="action-sheet-review" role="alert">
          <strong>Review report for Photo 42</strong>
          <span>The action sheet routed a higher-risk choice to review instead of committing immediately.</span>
          <button type="button" className="demo-button small" onClick={() => closeSheet("Report review cancelled")}>Cancel report</button>
        </div>
      )}
      <div className="demo-row action-sheet-controls">
        <button type="button" className="demo-button small" onClick={() => openSheet("draft", "Cancel draft opened an action sheet for Message draft 18.")}>Cancel draft</button>
        <button type="button" className="demo-button small" onClick={activateSafe}>Save draft</button>
        <button type="button" className="demo-button small" onClick={activateDanger}>Discard draft</button>
        <button type="button" className="demo-button small" onClick={() => closeSheet("Keep editing selected")}>Keep editing</button>
        <button type="button" className="demo-button small" onClick={() => openSheet("share", "Photo actions opened from the Action button for a selected image.")}>Share choices</button>
        <button type="button" className="demo-button small primary" onClick={() => {
          openSheet("share", "Photo actions opened from the Action button for a selected image.");
          window.setTimeout(() => {
            setReview(true);
            setResult("Report image moved to review before commitment.");
          }, 0);
        }}>Report review</button>
      </div>
      <p className="demo-status" aria-live="polite">{result}</p>
    </div>
  );
}

function ActionSheetBadUx() {
  type Mode = "unsolicited" | "tooMany" | "noCancel" | "hiddenDanger" | "richContent" | "focusLoss";
  const [mode, setMode] = useState<Mode>("unsolicited");
  const copy: Record<Mode, string> = {
    unsolicited: "The sheet appears on page load without any user-initiated action.",
    tooMany: "Nine choices force the sheet to scroll, increasing accidental-tap risk.",
    noCancel: "The sheet offers destructive and save choices but no explicit way to keep editing.",
    hiddenDanger: "Discard draft is styled like a safe choice and placed between harmless actions.",
    richContent: "Search, filters, preview content, and settings were packed into an immediate-choice sheet.",
    focusLoss: "Dismissal closes the sheet but sends focus to the page header instead of the initiating action."
  };

  return (
    <div className={`quality-example action-sheet-bad-ux is-${mode}`}>
      <div className="action-sheet-phone bad">
        <div className="action-sheet-page">
          <strong>{mode === "unsolicited" ? "Inbox" : "Message draft 18"}</strong>
          <span>{mode === "focusLoss" ? "Focus will not return here" : "Action context is unclear"}</span>
        </div>
        <div className="action-sheet-surface bad">
          <strong>{mode === "richContent" ? "Manage" : mode === "unsolicited" ? "Try this" : "Options"}</strong>
          <p>{copy[mode]}</p>
          <div className={mode === "tooMany" || mode === "richContent" ? "action-sheet-overload-list" : "action-sheet-choice-group"}>
            {(mode === "tooMany"
              ? ["Save", "Share", "Copy", "Move", "Archive", "Pin", "Mute", "Report", "Delete"]
              : ["Save draft", "Discard draft", "Share"]).map((item) => (
              <button key={item} type="button" className={item.includes("Discard") && mode !== "hiddenDanger" ? "danger" : ""}>{item}</button>
            ))}
            {mode === "richContent" && <input aria-label="Filter choices" value="draft" readOnly />}
            {mode === "richContent" && <span className="action-sheet-preview-card">Message preview and settings link</span>}
          </div>
          {mode !== "noCancel" && mode !== "unsolicited" && <button type="button" className="action-sheet-cancel">Cancel</button>}
        </div>
      </div>
      <div className="demo-row action-sheet-controls">
        <button type="button" className={mode === "unsolicited" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("unsolicited")}>Unsolicited</button>
        <button type="button" className={mode === "tooMany" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("tooMany")}>Too many options</button>
        <button type="button" className={mode === "noCancel" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("noCancel")}>No cancel</button>
        <button type="button" className={mode === "hiddenDanger" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("hiddenDanger")}>Hidden danger</button>
        <button type="button" className={mode === "richContent" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("richContent")}>Rich content</button>
        <button type="button" className={mode === "focusLoss" ? "demo-button small primary" : "demo-button small"} onClick={() => setMode("focusLoss")}>Focus loss</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy[mode]}</p>
    </div>
  );
}

function ActionMenuGoodUi() {
  return (
    <div className="quality-example action-menu-demo">
      <span className="demo-status" id="action-menu-ui-label">Customer actions for Acme Retail</span>
      <div className="action-menu-surface" role="menu" aria-labelledby="action-menu-ui-label">
        <div className="action-menu-section" role="group" aria-label="Manage customer">
          <strong>Manage customer</strong>
          <button type="button" role="menuitem">Edit Acme Retail</button>
          <button type="button" role="menuitem">Duplicate customer</button>
          <button type="button" role="menuitem">Merge customer</button>
        </div>
        <div className="action-menu-section" role="group" aria-label="Data requests">
          <strong>Data requests</strong>
          <button type="button" role="menuitem" aria-disabled="true" className="is-disabled">
            Request data export
            <small>Privacy permission required</small>
          </button>
        </div>
        <div className="action-menu-section danger" role="group" aria-label="Account risk">
          <button type="button" role="menuitem" className="is-danger">Delete customer</button>
        </div>
      </div>
      <p className="action-menu-status">Sections separate management, data access, and destructive account risk.</p>
    </div>
  );
}

function ActionMenuBadUi() {
  return (
    <div className="bad-ui-sample action-menu-bad-ui">
      <strong>More</strong>
      <div className="action-menu-bad-list" aria-label="Mixed action menu roles">
        <button type="button">Open</button>
        <button type="button">Delete</button>
        <a href="#bad-action-link">Settings</a>
        <label>
          Owner
          <input value="Ada" readOnly />
        </label>
        <button type="button">Filter paid</button>
      </div>
      <p className="demo-status">Commands, links, filters, and form fields are flattened into one unexplained menu.</p>
    </div>
  );
}

function ActionMenuGoodUx() {
  const [scope, setScope] = useState<"single" | "bulk">("single");
  const [message, setMessage] = useState("One customer selected. Menu labels name the affected record.");
  const [reviewingDelete, setReviewingDelete] = useState(false);
  const isBulk = scope === "bulk";
  const scopeLabel = isBulk ? "3 selected customers" : "Acme Retail";
  const menuLabel = isBulk ? "Actions for 3 selected customers" : "Customer actions for Acme Retail";

  const runAction = (action: string) => {
    setReviewingDelete(false);
    setMessage(`${action} ran for ${scopeLabel}. The result names the affected scope.`);
  };

  const tryDisabledExport = () => {
    setReviewingDelete(false);
    setMessage("Request data export is unavailable because privacy permission is required.");
  };

  const deleteHandoff = () => {
    setReviewingDelete(true);
    setMessage(`Delete ${isBulk ? "3 selected customers" : "Acme Retail"} moved to review instead of running from the compact menu.`);
  };

  const changeScope = (next: "single" | "bulk") => {
    setScope(next);
    setReviewingDelete(false);
    setMessage(next === "bulk" ? "Three customers selected. Single-customer commands are relabelled or disabled." : "One customer selected. Menu labels name the affected record.");
  };

  return (
    <div className="quality-example action-menu-demo">
      <div className={`action-menu-result ${reviewingDelete ? "is-danger" : isBulk ? "is-bulk" : ""}`} role="status" aria-live="polite">
        <strong>{reviewingDelete ? "Review required" : isBulk ? "Bulk scope" : "Single record"}</strong>
        <span>{message}</span>
      </div>
      <span className="demo-status" id="action-menu-live-label">{menuLabel}</span>
      <div className="action-menu-surface" role="menu" aria-labelledby="action-menu-live-label" aria-describedby="action-menu-live-status">
        <div className="action-menu-section" role="group" aria-label="Manage customer">
          <strong>{isBulk ? "Manage selected customers" : "Manage customer"}</strong>
          <button type="button" role="menuitem" onClick={() => runAction(isBulk ? "Edit selected customers" : "Edit Acme Retail")}>
            {isBulk ? "Edit 3 selected customers" : "Edit Acme Retail"}
          </button>
          <button type="button" role="menuitem" onClick={() => runAction(isBulk ? "Duplicate selected customers" : "Duplicate customer")}>
            {isBulk ? "Duplicate 3 customers" : "Duplicate customer"}
          </button>
          <button
            type="button"
            role="menuitem"
            className={isBulk ? "is-disabled" : undefined}
            aria-disabled={isBulk}
            onClick={isBulk ? () => setMessage("Merge is disabled because it requires exactly one selected customer.") : () => runAction("Merge customer")}
          >
            Merge customer
            {isBulk && <small>Requires one selected customer</small>}
          </button>
        </div>
        <div className="action-menu-section" role="group" aria-label="Data requests">
          <strong>Data requests</strong>
          <button type="button" role="menuitem" className="is-disabled" aria-disabled="true" onClick={tryDisabledExport}>
            {isBulk ? "Request data export for 3 customers" : "Request data export"}
            <small>Privacy permission required</small>
          </button>
          <button type="button" role="menuitem" onClick={() => runAction(isBulk ? "Download selected summaries" : "Download customer summary")}>
            {isBulk ? "Download selected summaries" : "Download customer summary"}
          </button>
        </div>
        <div className="action-menu-section danger" role="group" aria-label="Account risk">
          <button type="button" role="menuitem" className="is-danger" onClick={deleteHandoff}>
            {isBulk ? "Delete 3 selected customers" : "Delete customer"}
          </button>
        </div>
      </div>
      {reviewingDelete && (
        <div className="action-menu-review" role="alert">
          <strong>{isBulk ? "Delete 3 selected customers?" : "Delete Acme Retail?"}</strong>
          <span>Review opens with the affected scope before the destructive command can commit.</span>
        </div>
      )}
      <p className="action-menu-status" id="action-menu-live-status">{isBulk ? "Bulk selection changes labels and disabled rules." : "Single-record menu names Acme Retail."}</p>
      <div className="demo-row action-menu-controls">
        <button type="button" className="demo-button small" onClick={() => changeScope("single")}>One customer</button>
        <button type="button" className="demo-button small" onClick={() => changeScope("bulk")}>Three selected</button>
        <button type="button" className="demo-button small" onClick={() => runAction(isBulk ? "Duplicate selected customers" : "Duplicate customer")}>Run duplicate</button>
        <button type="button" className="demo-button small" onClick={tryDisabledExport}>Try disabled export</button>
        <button type="button" className="demo-button small primary" onClick={deleteHandoff}>Delete handoff</button>
      </div>
    </div>
  );
}

function ActionMenuBadUx() {
  const [mode, setMode] = useState<"vague" | "mixed" | "disabled" | "danger">("vague");
  const copy = {
    vague: "Repeated row menus use Open and Delete without naming which customer will change.",
    mixed: "The menu mixes commands, filters, navigation, owner editing, and settings in one list.",
    disabled: "Export is disabled with no reason, so users cannot tell whether permission or state blocks it.",
    danger: "Delete appears between safe commands and runs without review or recovery."
  }[mode];

  return (
    <div className="quality-example action-menu-bad-ux">
      <div className="action-menu-bad-list" aria-label="Broken action menu behavior">
        <button type="button">Open</button>
        <button type="button" className={mode === "disabled" ? "is-disabled" : ""}>Export</button>
        <button type="button" className={mode === "danger" ? "is-danger" : ""}>Delete</button>
        <a href="#bad-action-settings">Settings</a>
        {mode === "mixed" && <label>Owner <input value="Ada" readOnly /></label>}
      </div>
      <div className="demo-row action-menu-controls">
        <button type="button" className="demo-button small" onClick={() => setMode("vague")}>Vague labels</button>
        <button type="button" className="demo-button small" onClick={() => setMode("mixed")}>Mixed roles</button>
        <button type="button" className="demo-button small" onClick={() => setMode("disabled")}>Hidden reason</button>
        <button type="button" className="demo-button small" onClick={() => setMode("danger")}>Danger middle</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy}</p>
    </div>
  );
}

function ButtonGroupGoodUi() {
  return (
    <div className="quality-example button-group-demo">
      <span className="demo-status" id="button-group-ui-label">Application actions</span>
      <p className="demo-status" id="button-group-ui-help">Visible related commands share one footer scope; Continue is primary, Save draft is secondary, and Reset changes is separated as risky.</p>
      <div className="button-group-shell" role="group" aria-labelledby="button-group-ui-label" aria-describedby="button-group-ui-help">
        <div className="button-group-actions">
          <button type="button" className="button-group-button secondary">Save draft</button>
          <button type="button" className="button-group-button primary">Continue</button>
          <button type="button" className="button-group-button ghost">Cancel</button>
        </div>
        <div className="button-group-danger" aria-label="Risky application actions">
          <button type="button" className="button-group-button danger">Reset changes</button>
        </div>
      </div>
      <p className="button-group-status">One primary action, lower-emphasis alternatives, and a separated danger command.</p>
    </div>
  );
}

function ButtonGroupBadUi() {
  return (
    <div className="bad-ui-sample button-group-bad-ui">
      <strong>Actions</strong>
      <div className="button-group-bad-row" aria-label="Mixed unrelated actions">
        <button type="button">Save</button>
        <button type="button">Continue</button>
        <button type="button">Delete</button>
        <button type="button">Help</button>
        <button type="button">Settings</button>
      </div>
      <p className="demo-status">Unrelated scopes, two high-emphasis commands, and a destructive action all appear as equal peers.</p>
    </div>
  );
}

function ButtonGroupGoodUx() {
  const [saved, setSaved] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [reset, setReset] = useState(false);
  const [message, setMessage] = useState("Continue is unavailable until the draft is saved.");

  const saveDraft = () => {
    setProcessing(true);
    setReset(false);
    setMessage("Saving draft. Duplicate activation is blocked while the command runs.");
    window.setTimeout(() => {
      setSaved(true);
      setProcessing(false);
      setMessage("Draft saved. Continue is now available and remains the primary next action.");
    }, 350);
  };

  const continueFlow = () => {
    if (!saved) {
      setMessage("Save the draft first; this visible reason explains why Continue is blocked.");
      return;
    }
    setMessage("Continuing to review. The grouped commands kept the same source order.");
  };

  const resetChanges = () => {
    setSaved(false);
    setReset(true);
    setProcessing(false);
    setMessage("Changes reset. The danger action was separated from the safe forward action.");
  };

  const restore = () => {
    setSaved(false);
    setReset(false);
    setProcessing(false);
    setMessage("Action group restored. Continue is unavailable until Save draft runs again.");
  };

  return (
    <div className="quality-example button-group-demo">
      <div className={`button-group-result ${reset ? "is-danger" : saved ? "is-ready" : "is-blocked"}`} role="status" aria-live="polite">
        <strong>{processing ? "Saving" : reset ? "Reset" : saved ? "Ready" : "Blocked"}</strong>
        <span>{message}</span>
      </div>
      <span className="demo-status" id="button-group-live-label">Application actions</span>
      <div className="button-group-shell" role="group" aria-labelledby="button-group-live-label" aria-describedby="button-group-live-status">
        <div className="button-group-actions">
          <button type="button" className="button-group-button secondary" disabled={processing} onClick={saveDraft}>
            {processing ? "Saving..." : "Save draft"}
          </button>
          <button
            type="button"
            className="button-group-button primary"
            disabled={!saved || processing}
            aria-describedby={!saved ? "button-group-live-status" : undefined}
            onClick={continueFlow}
          >
            Continue
          </button>
          <button type="button" className="button-group-button ghost" disabled={processing} onClick={() => setMessage("Cancel stays visible but lower emphasis than the recommended forward action.")}>
            Cancel
          </button>
        </div>
        <div className="button-group-danger" aria-label="Risky application actions">
          <button type="button" className="button-group-button danger" disabled={processing} onClick={resetChanges}>Reset changes</button>
        </div>
      </div>
      <p className="button-group-status" id="button-group-live-status">{saved ? "Draft saved; Continue can run." : "Save draft before continuing."}</p>
      <div className="demo-row button-group-controls">
        <button type="button" className="demo-button small" onClick={saveDraft}>Save draft</button>
        <button type="button" className="demo-button small" onClick={continueFlow}>Try Continue</button>
        <button type="button" className="demo-button small" onClick={resetChanges}>Reset changes</button>
        <button type="button" className="demo-button small primary" onClick={restore}>Restore group</button>
      </div>
    </div>
  );
}

function ButtonGroupBadUx() {
  const [mode, setMode] = useState<"twoPrimary" | "mixedScope" | "hiddenReason" | "dangerAdjacent">("twoPrimary");
  const copy = {
    twoPrimary: "Save and Continue both look primary, so the recommended next action is unclear.",
    mixedScope: "The group combines form submission, account settings, help, and export commands under one false relationship.",
    hiddenReason: "Continue is disabled with no visible requirement, so the blocked path becomes trial and error.",
    dangerAdjacent: "Delete sits beside Continue with matching emphasis and no review or recovery path."
  }[mode];

  return (
    <div className="quality-example button-group-bad-ux">
      <div className="button-group-bad-row" aria-label="Broken button group behavior">
        <button type="button" className={mode === "twoPrimary" ? "bad-primary" : ""}>Save</button>
        <button type="button" className={mode !== "hiddenReason" ? "bad-primary" : ""} disabled={mode === "hiddenReason"}>Continue</button>
        <button type="button">Settings</button>
        <button type="button" className={mode === "dangerAdjacent" ? "bad-danger" : ""}>Delete</button>
      </div>
      <div className="demo-row button-group-controls">
        <button type="button" className="demo-button small" onClick={() => setMode("twoPrimary")}>Two primary</button>
        <button type="button" className="demo-button small" onClick={() => setMode("mixedScope")}>Mixed scope</button>
        <button type="button" className="demo-button small" onClick={() => setMode("hiddenReason")}>Hidden reason</button>
        <button type="button" className="demo-button small" onClick={() => setMode("dangerAdjacent")}>Danger beside Continue</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy}</p>
    </div>
  );
}

const chipSelectionOptions = ["Design", "Data", "Research", "AI", "Accessibility", "Mobile"];

function ChipButton({
  label,
  selected,
  disabled = false,
  onClick
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`${selected ? "chip-selection-chip is-selected" : "chip-selection-chip"}${disabled ? " is-disabled" : ""}`}
      aria-pressed={selected}
      aria-disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <span aria-hidden="true">{selected ? "OK" : ""}</span>
      {label}
    </button>
  );
}

function ChipSelectionGoodUi() {
  const selected = new Set(["Design", "Data"]);
  return (
    <div className="quality-example chip-selection-demo">
      <span className="demo-status" id="chip-selection-ui-label">Choose up to 3 interests</span>
      <p className="demo-status" id="chip-selection-ui-help">Short selectable chips answer this onboarding question; selected state is shown with text, checkmark, and pressed styling.</p>
      <div className="chip-selection-set" role="group" aria-labelledby="chip-selection-ui-label" aria-describedby="chip-selection-ui-help">
        {chipSelectionOptions.map((item) => (
          <ChipButton key={item} label={item} selected={selected.has(item)} />
        ))}
      </div>
      <p className="chip-selection-count">2 of 3 selected</p>
    </div>
  );
}

function ChipSelectionBadUi() {
  return (
    <div className="bad-ui-sample chip-selection-bad-ui">
      <strong>Choose interests</strong>
      <div className="chip-selection-bad-set" aria-label="Mixed chip roles">
        <button type="button">Design</button>
        <button type="button">Filter: AI</button>
        <button type="button">Research x</button>
        <a href="#bad-chip-link">Mobile</a>
        <span>New</span>
      </div>
      <p className="demo-status">Selectable answers, filters, removable tags, links, and badges all look alike.</p>
    </div>
  );
}

function ChipSelectionGoodUx() {
  const [selected, setSelected] = useState(["Design", "Data"]);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("Two interests selected; chip order has not changed.");
  const max = 3;
  const invalid = submitted && selected.length === 0;
  const atMax = selected.length >= max;

  const toggle = (item: string) => {
    setSubmitted(false);
    setSelected((current) => {
      if (current.includes(item)) {
        setMessage(`${item} removed; remaining chips stay in the same order.`);
        return current.filter((value) => value !== item);
      }
      if (current.length >= max) {
        setMessage(`Choose no more than ${max} interests. Remove one before adding ${item}.`);
        return current;
      }
      setMessage(`${item} selected. ${current.length + 1} of ${max} interests are now selected.`);
      return [...current, item];
    });
  };

  const chooseThree = () => {
    setSelected(["Design", "Data", "Accessibility"]);
    setSubmitted(false);
    setMessage("Three interests selected; the maximum count is now reached.");
  };

  const tryFourth = () => {
    setSelected(["Design", "Data", "Accessibility"]);
    setSubmitted(false);
    setMessage("Choose no more than 3 interests. Mobile was not added.");
  };

  const clear = () => {
    setSelected([]);
    setSubmitted(false);
    setMessage("All chip selections cleared; the required state can now be tested.");
  };

  const save = () => {
    setSubmitted(true);
    setMessage(selected.length > 0 ? `${selected.length} chip answer${selected.length === 1 ? "" : "s"} ready to save.` : "Validation stopped the empty required chip group.");
  };

  return (
    <div className="quality-example chip-selection-demo">
      <span className="demo-status" id="chip-selection-live-label">Choose up to 3 interests</span>
      <p className="demo-status" id="chip-selection-live-help">Select at least one short chip. This stores onboarding preferences; it does not filter the page.</p>
      {invalid && <p className="demo-error compact" id="chip-selection-live-error">Choose at least one interest.</p>}
      <div
        className="chip-selection-set"
        role="group"
        aria-labelledby="chip-selection-live-label"
        aria-describedby={invalid ? "chip-selection-live-help chip-selection-live-error" : "chip-selection-live-help"}
      >
        {chipSelectionOptions.map((item) => {
          const isSelected = selected.includes(item);
          const blocked = !isSelected && atMax;
          return <ChipButton key={item} label={item} selected={isSelected} disabled={blocked} onClick={() => toggle(item)} />;
        })}
      </div>
      <p className="chip-selection-count" aria-live="polite">{selected.length} of {max} selected{atMax ? " - maximum reached" : ""}</p>
      <div className="demo-row chip-selection-actions">
        <button type="button" className="demo-button small" onClick={chooseThree}>Select 3</button>
        <button type="button" className="demo-button small" onClick={tryFourth}>Try fourth</button>
        <button type="button" className="demo-button small" onClick={() => toggle("Data")}>Toggle Data</button>
        <button type="button" className="demo-button small" onClick={clear}>Clear</button>
        <button type="button" className="demo-button small primary" onClick={save}>Save choices</button>
      </div>
      <p className="chip-selection-status" aria-live="polite">{message}</p>
    </div>
  );
}

function ChipSelectionBadUx() {
  const [mode, setMode] = useState<"filter" | "lateMax" | "colorOnly" | "remove">("filter");
  const copy = {
    filter: "The chip looks like an answer but filters the page instead.",
    lateMax: "The user can select five chips before a hidden maximum error appears at final submit.",
    colorOnly: "Selected state is only a subtle color change with no checked or pressed state.",
    remove: "The x icon removes the option from the available set instead of toggling selection."
  }[mode];

  return (
    <div className="quality-example chip-selection-demo chip-selection-bad-ux">
      <div className="chip-selection-bad-set" aria-label="Broken chip selection behavior">
        {["Design", "Data", "Research", "AI", "Accessibility"].map((item, index) => (
          <button type="button" key={item} className={index < 4 ? "bad-selected" : ""}>{item}{mode === "remove" && index === 1 ? " x" : ""}</button>
        ))}
      </div>
      <div className="demo-row chip-selection-actions">
        <button type="button" className="demo-button small" onClick={() => setMode("filter")}>Acts as filter</button>
        <button type="button" className="demo-button small" onClick={() => setMode("lateMax")}>Late max error</button>
        <button type="button" className="demo-button small" onClick={() => setMode("colorOnly")}>Color only</button>
        <button type="button" className="demo-button small" onClick={() => setMode("remove")}>Remove option</button>
      </div>
      <p className="demo-status" aria-live="polite">{copy}</p>
    </div>
  );
}

function ChoiceBadUx({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  const [selected, setSelected] = useState<string[]>([]);

  if (patternId === "button-group") return <ButtonGroupBadUx />;
  if (patternId === "action-menu") return <ActionMenuBadUx />;
  if (patternId === "action-sheet") return <ActionSheetBadUx />;

  if (patternId === "spinbutton") {
    const [state, setState] = useState("Identifier");
    const [message, setMessage] = useState("A saved account ID is treated as an incrementable number, so arrow keys can corrupt it.");
    const value = state === "Large range" ? "48" : state === "No typing" ? "3" : state === "Hidden label" ? "2" : "10045678";

    return (
      <div className="quality-example spinbutton-demo">
        <div className="spinbutton-bad-ui">
          <div className="slider-label-row">
            <strong>{state}</strong>
            <output>{value}</output>
          </div>
          <div className="spinbutton-control">
            <button type="button" className="spinbutton-button" aria-label={state === "Hidden label" ? "minus" : `Decrease ${state}`}>-</button>
            {state === "No typing" ? (
              <span className="spinbutton-value fake" aria-label="Fixed stepper value">{value}</span>
            ) : (
              <input className="spinbutton-value" value={value} readOnly aria-label={state === "Hidden label" ? "Number" : state} />
            )}
            <button type="button" className="spinbutton-button" aria-label={state === "Hidden label" ? "plus" : `Increase ${state}`}>+</button>
          </div>
          <p className="demo-status">{message}</p>
        </div>
        <div className="demo-row slider-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Identifier");
            setMessage("A saved account ID is treated as an incrementable number, so arrow keys can corrupt it.");
          }}>Use for ID</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Large range");
            setMessage("A value from 1 to 500 would require too many clicks; users need typing or a better range control.");
          }}>Large range</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("No typing");
            setMessage("Only plus and minus buttons are provided, so users cannot enter an exact value directly.");
          }}>Remove typing</button>
          <button type="button" className="demo-button small danger" onClick={() => {
            setState("Hidden label");
            setMessage("Icon-only controls and a vague value hide what quantity is changing.");
          }}>Hide label</button>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "range-slider") {
    const [state, setState] = useState("Single handle");
    const [message, setMessage] = useState("Only one handle is available, so users cannot set both minimum and maximum.");

    return (
      <div className="quality-example range-slider-demo">
        <div className="range-slider-bad-ui">
          <div className="slider-label-row">
            <strong>{state}</strong>
            <output>{state === "Date rail" ? "Mar 4 to Mar 17" : state === "Crossed values" ? "$320 to $180" : "$260+"}</output>
          </div>
          <div className="range-slider-rail" style={{ "--range-start": state === "Crossed values" ? "64%" : "52%", "--range-end": state === "Crossed values" ? "36%" : "52%" } as CSSProperties}>
            <span className="range-slider-band" />
            <span className="range-slider-thumb is-min" />
            {state !== "Single handle" && <span className="range-slider-thumb is-max" />}
          </div>
          <p className="demo-status">{message}</p>
        </div>
        <div className="demo-row slider-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Single handle");
            setMessage("Only one handle is available, so users cannot set both minimum and maximum.");
          }}>Single handle</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Crossed values");
            setMessage("The minimum endpoint crossed above the maximum, producing an impossible filter.");
          }}>Allow crossing</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Hidden numbers");
            setMessage("No exact endpoint fields or values are shown, so users cannot review what the filter will submit.");
          }}>Hide values</button>
          <button type="button" className="demo-button small danger" onClick={() => {
            setState("Date rail");
            setMessage("Dates need calendar semantics, unavailable days, and typed date fallback, not a numeric rail.");
          }}>Use for dates</button>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "slider") {
    const [state, setState] = useState("Binary setting");
    const [message, setMessage] = useState("Wi-Fi on/off is forced into a two-stop slider instead of a switch.");

    return (
      <div className="quality-example slider-demo">
        <div className="slider-bad-ui">
          <div className="slider-label-row">
            <strong>{state}</strong>
            <output>{state === "Exact cents" ? "$812.37" : state === "Tiny range" ? "2 of 3" : "On"}</output>
          </div>
          <input
            type="range"
            min="0"
            max={state === "Exact cents" ? "100000" : state === "Tiny range" ? "3" : "1"}
            step={state === "Exact cents" ? "1" : "1"}
            value={state === "Exact cents" ? "81237" : state === "Tiny range" ? "2" : "1"}
            readOnly
            aria-label={state}
          />
          <p className="demo-status">{message}</p>
        </div>
        <div className="demo-row slider-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Binary setting");
            setMessage("Wi-Fi on/off is forced into a two-stop slider instead of a switch.");
          }}>Binary choice</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Exact cents");
            setMessage("A precise transfer amount needs a number field, not a 100,000-step slider.");
          }}>Exact cents</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Hidden limits");
            setMessage("The slider has no min, max, unit, or current-value label, so users cannot tell what changed.");
          }}>Hide limits</button>
          <button type="button" className="demo-button small danger" onClick={() => {
            setState("Tiny range");
            setMessage("Three named options are easier to compare as radio buttons or a segmented control.");
          }}>Tiny range</button>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "toggle-switch") {
    const [state, setState] = useState("Decorative");
    const [message, setMessage] = useState("The switch shape is used for jobs that are not a reversible on/off setting.");

    return (
      <div className="quality-example toggle-switch-demo">
        <div className="toggle-switch-bad-ui">
          <button type="button" className="toggle-switch-track bad" aria-label="Misused destructive switch" aria-pressed={state !== "Decorative"} onClick={() => {
            setState("Delete queued");
            setMessage("A destructive account deletion was hidden behind an instant switch with no confirmation.");
          }}>
            <span className="toggle-switch-thumb" />
          </button>
          <div>
            <strong>{state}</strong>
            <span>{message}</span>
          </div>
        </div>
        <div className="demo-row toggle-switch-actions">
          <button type="button" className="demo-button small" onClick={() => {
            setState("Requires Save");
            setMessage("The switch appears immediate but nothing changes until a distant Save button is pressed.");
          }}>Require Save</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Label changed");
            setMessage("The label changed from Enable notifications to Disable notifications, so the object being controlled moved.");
          }}>Change label</button>
          <button type="button" className="demo-button small" onClick={() => {
            setState("Three options");
            setMessage("Off, weekly, and daily are being forced into one binary switch instead of radio or segmented choices.");
          }}>Force three states</button>
          <button type="button" className="demo-button small danger" onClick={() => {
            setState("Delete queued");
            setMessage("The switch is acting as a destructive command instead of an on/off setting.");
          }}>Use for delete</button>
        </div>
        <p className="demo-status" aria-live="polite">{message}</p>
      </div>
    );
  }

  if (patternId === "select") {
    return <BrokenCustomSelect meta={meta} />;
  }

  if (patternId === "listbox") return <ListboxBadUx />;
  if (patternId === "transfer-list") return <TransferListBadUx />;
  if (patternId === "tree-selection") return <TreeSelectionBadUx />;
  if (patternId === "object-picker") return <ObjectPickerBadUx />;
  if (patternId === "chip-selection") return <ChipSelectionBadUx />;

  if (patternId === "segmented-control") {
    const [status, setStatus] = useState("No local content changed.");
    return (
      <div className="quality-example">
        <div className="bad-choice-row segmented-overflow">
          {["Add", "Edit", "Delete", "Share", "Export"].map((item) => (
            <button
              type="button"
              key={item}
              className={item === "Delete" ? "bad-choice-active" : ""}
              onClick={() => setStatus(`${item} action fired from a mode switcher.`)}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="demo-status">{status}</p>
      </div>
    );
  }

  return (
    <div className="quality-example">
      <div className="bad-choice-row">
        {meta.options.slice(0, 3).map((item) => (
          <button
            type="button"
            key={item}
            className={selected.includes(item) ? "bad-choice-active" : ""}
            onClick={() => setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])}
          >
            {short(item)}
          </button>
        ))}
      </div>
      <p className="demo-status">
        {patternId === "radio-group" ? "Multiple choices can be active." : patternId === "segmented-control" ? "State changes but content does not." : "Tiny targets; no bulk action."}
      </p>
    </div>
  );
}

function GoodUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <ChoiceUi patternId={patternId} meta={meta} good />;
}

function BadUiExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <ChoiceUi patternId={patternId} meta={meta} />;
}

function GoodUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <ChoiceGoodUx patternId={patternId} meta={meta} />;
}

function BadUxExample({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <ChoiceBadUx patternId={patternId} meta={meta} />;
}

export default function Example({ patternId, meta }: { patternId: string; meta: PatternMeta }) {
  return <div className="demo-surface quality-lab"><div className="quality-grid" aria-label={`${meta.name} UI and UX lab`}>
    <QualityPanel tone="good" label="Good UI"><GoodUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UI"><BadUiExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="good" label="Good UX"><GoodUxExample patternId={patternId} meta={meta} /></QualityPanel>
    <QualityPanel tone="bad" label="Bad UX"><BadUxExample patternId={patternId} meta={meta} /></QualityPanel>
  </div></div>;
}
