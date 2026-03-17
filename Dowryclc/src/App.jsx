import { useState, useEffect, useRef } from "react";
import "./App.css";
import brideGroomImage from "./assets/bride-groom.jpeg";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const formatPKR = (n) =>
  `PKR ${Math.round(n).toLocaleString("en-PK")}`;

// ─────────────────────────────────────────────
// BMI Preview widget
// ─────────────────────────────────────────────
function BmiPreview({ height, weight }) {
  const bmi = parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2);
  if (isNaN(bmi) || !isFinite(bmi)) return null;
  const bmiRounded = Math.round(bmi * 10) / 10;
  const { label, color } =
    bmi < 18.5  ? { label: "Underweight",    color: "#e09040" } :
    bmi <= 24.9 ? { label: "Healthy weight",  color: "#5cba7d" } :
    bmi <= 29.9 ? { label: "Overweight",      color: "#e09040" } :
                  { label: "Obese",            color: "#e05555" };
  return (
    <div className="bmi-preview" style={{ borderColor: color }}>
      <span style={{ color }}>BMI {bmiRounded} — {label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Looks color helper
// ─────────────────────────────────────────────
function looksColor(val) {
  const v = parseInt(val);
  if (v >= 8) return "#16a34a";
  if (v >= 5) return "#b5421a";
  return "#dc2626";
}

// ─────────────────────────────────────────────
// Animated Number Counter
// ─────────────────────────────────────────────
function AnimatedNumber({ target }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCurrent(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return <>{formatPKR(current)}</>;
}

// ─────────────────────────────────────────────
// Score Ring
// ─────────────────────────────────────────────
function ScoreRing({ score }) {
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);
  const offset = circ - (animated / 100) * circ;
  const color =
    score >= 75 ? "#16a34a" :
    score >= 50 ? "#1a4d2e" :
    score >= 30 ? "#d4af37" : "#dc2626";
  return (
    <div className="score-ring-wrap">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#d4af37" strokeWidth="10" />
        <circle
          cx="55" cy="55" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="score-ring-label">
        <span className="score-ring-num" style={{ color }}>{score}</span>
        <span className="score-ring-sub">/ 100</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Multi-Stage Loading Screen
// ─────────────────────────────────────────────
const LOADING_STAGES = [
  { text: "Fetching data from World Bank…", icon: "🌍" },
  { text: "Retrieving currency exchange rates…", icon: "💱" },
  { text: "Analyzing regional economic data…", icon: "📊" },
  { text: "Cross-referencing Islamic guidelines…", icon: "📿" },
  { text: "Synthesizing all factors…", icon: "🧮" },
  { text: "Generating final Haq Meher amount…", icon: "✨" },
  { text: "Creating detailed breakdown…", icon: "📋" },
];

function LoadingScreen() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => {
        if (prev < LOADING_STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const currentStage = LOADING_STAGES[stage];
  const progress = ((stage + 1) / LOADING_STAGES.length) * 100;

  return (
    <div className="fade-in center-col">
      <div className="loading-container">
        <div className="spinner" />
        <div className="loading-stage-icon">{currentStage.icon}</div>
      </div>
      <p className="loading-text">{currentStage.text}</p>
      <div className="loading-progress">
        <div className="loading-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="loading-sub">
        Stage {stage + 1} of {LOADING_STAGES.length}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Progress Steps
// ─────────────────────────────────────────────
const STEP_LABELS = ["Financial", "Career", "Personal", "Character", "Appearance", "Social"];

function StepProgress({ current }) {
  return (
    <div className="step-progress">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const done = current > num;
        const active = current === num;
        return (
          <div key={num} className="step-prog-item">
            <div className={`step-prog-dot ${active ? "active" : done ? "done" : ""}`}>
              {done ? "✓" : num}
            </div>
            <span className={`step-prog-label ${active ? "active" : ""}`}>{label}</span>
            {i < STEP_LABELS.length - 1 && (
              <div className={`step-prog-line ${done ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// Form Field Wrappers
// ─────────────────────────────────────────────
function Field({ label, hint, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {hint && <p className="field-hint">{hint}</p>}
      {children}
    </div>
  );
}

function SelectField({ label, hint, value, onChange, options }) {
  return (
    <Field label={label} hint={hint}>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

// ─────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────
const DEFAULT_INPUTS = {
  // Groom fields
  age: "", education: "bachelors", income: "middle",
  employed: "yes", profession: "private",
  familyWealth: "middle", character: "trustworthy",
  religion: "yes", stability: "yes",
  previousMarriage: "no", responsibility: "yes",
  // Bride fields
  looks: "5", nature: "balanced", isTen: "no",
  knownDuration: "1to3", bestfriend: "no", maleFriends: "none",
};

export default function HaqMeherCalculator() {
  const [step, setStep] = useState(0);   // 0=intro 1-6=form 7=loading 8=result
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState("");
  const [validErr, setValidErr] = useState("");
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  const set = (k, v) => { setInputs((p) => ({ ...p, [k]: v })); setValidErr(""); };

  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const validate = () => {
    if (step === 1) {
      if (!inputs.age) return "Please enter your age.";
      if (+inputs.age < 18 || +inputs.age > 75)          return "Age must be between 18 and 75.";
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { setValidErr(err); return; }
    setValidErr("");
    if (step < 6) { setStep((s) => s + 1); return; }
    submit();
  };

  const back = () => { setValidErr(""); setStep((s) => Math.max(1, s - 1)); };

  const submit = async () => {
    setStep(7);
    setApiError("");
    const loadingStartTime = Date.now();
    const minLoadingDuration = 9500; // 11 stages × 800ms = 8800ms, plus buffer
    
    try {
      const base = import.meta.env.VITE_API_URL ?? "";
      const res = await fetch(`${base}/api/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Calculation failed.");
      
      // Ensure loading screen shows for at least minLoadingDuration
      const elapsedTime = Date.now() - loadingStartTime;
      const remainingTime = Math.max(0, minLoadingDuration - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setResult(json.data);
      setStep(8);
    } catch (err) {
      setApiError(err.message);
      setStep(6);
    }
  };

  const reset = () => {
    setStep(0); setResult(null);
    setInputs(DEFAULT_INPUTS); setValidErr(""); setApiError(""); setCopied(false);
  };

  const copyResult = () => {
    if (!result) return;
    const text = [
      "Haq Meher Calculator Result",
      `${result.verdictEmoji}`,
      `Suggested Meher: ${formatPKR(result.total)}`,
      result.verdict,
      "(Consult with family and Islamic scholars)",
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="page">
      <div className="card" ref={cardRef}>

        {/* ── INTRO ── */}
        {step === 0 && (
          <div className="fade-in">
            <div className="disclaimer-tag">⚠ FOR INFORMATIONAL PURPOSES ONLY</div>
            <img src={brideGroomImage} alt="Bride and Groom" className="intro-image" />
            <h1 className="title">Haq Meher Calculator</h1>
            <p className="subtitle">Islamic guidance for determining the groom's gift</p>
            <p className="intro-body">
              Haq Meher (حق مهر) is the mandatory gift from the groom to the bride in Islamic marriage.
              Answer a few questions about the groom's financial situation and character to
              calculate an appropriate Meher amount — complete with a detailed breakdown and Islamic guidance.
            </p>
            <div className="intro-features">
              <div className="feat-item">📊 Multi-factor analysis</div>
              <div className="feat-item">🖥️ Real backend calculation</div>
              <div className="feat-item">📋 Detailed breakdown</div>
              <div className="feat-item">🏆 Tier verdict</div>
            </div>
            <button className="btn btn-primary" onClick={() => setStep(1)}>
              Begin Assessment →
            </button>
          </div>
        )}

        {/* ── FORM STEPS 1–6 ── */}
        {step >= 1 && step <= 6 && (
          <div className="fade-in">
            <div className="disclaimer-tag">⚠ FOR INFORMATIONAL PURPOSES ONLY</div>
            <h1 className="title">Haq Meher Calculator</h1>
            <StepProgress current={step} />

            {step === 1 && (
              <div>
                <h2 className="step-heading">Financial Details</h2>
                <div className="grid2">
                  <Field label="Age (years)">
                    <input
                      type="number" placeholder="e.g. 28" min="18" max="75"
                      value={inputs.age} onChange={(e) => set("age", e.target.value)}
                    />
                  </Field>
                  <SelectField
                    label="Education Level"
                    value={inputs.education}
                    onChange={(v) => set("education", v)}
                    options={[
                      { value: "none",      label: "No formal education" },
                      { value: "matric",    label: "Matric (Grade 10)" },
                      { value: "inter",     label: "Intermediate (Grade 12)" },
                      { value: "bachelors", label: "Bachelor's Degree" },
                      { value: "masters",   label: "Master's Degree" },
                      { value: "phd",       label: "PhD / Advanced" },
                    ]}
                  />
                </div>
                <SelectField
                  label="Monthly Income Level"
                  hint="Approximate household income range"
                  value={inputs.income}
                  onChange={(v) => set("income", v)}
                  options={[
                    { value: "low",    label: "PKR 20,000 - 50,000" },
                    { value: "lower",  label: "PKR 50,000 - 100,000" },
                    { value: "middle", label: "PKR 100,000 - 250,000" },
                    { value: "upper",  label: "PKR 250,000 - 500,000" },
                    { value: "wealthy", label: "PKR 500,000+" },
                  ]}
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="step-heading">Career & Employment</h2>
                <SelectField
                  label="Employment Status"
                  value={inputs.employed}
                  onChange={(v) => set("employed", v)}
                  options={[
                    { value: "no",  label: "Unemployed / Seeking" },
                    { value: "part", label: "Part-time" },
                    { value: "yes", label: "Fully Employed" },
                    { value: "self", label: "Self-employed / Business" },
                  ]}
                />
                <SelectField
                  label="Profession Type"
                  hint="Nature of your work"
                  value={inputs.profession}
                  onChange={(v) => set("profession", v)}
                  options={[
                    { value: "labor",     label: "Manual / Labor work" },
                    { value: "private",   label: "Private sector" },
                    { value: "govt",      label: "Government/Public sector" },
                    { value: "business",  label: "Business / Entrepreneurship" },
                    { value: "medical",   label: "Medical / Healthcare" },
                    { value: "tech",      label: "Technology / IT" },
                    { value: "military",  label: "Military / Defense" },
                  ]}
                />
                <SelectField
                  label="Job Security & Stability"
                  hint="Your employment outlook"
                  value={inputs.stability}
                  onChange={(v) => set("stability", v)}
                  options={[
                    { value: "unstable",  label: "Unstable / Uncertain" },
                    { value: "moderate",  label: "Moderate security" },
                    { value: "yes",       label: "Highly stable" },
                  ]}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="step-heading">Personal Background</h2>
                <SelectField
                  label="Family Wealth Status"
                  hint="Your family's financial position"
                  value={inputs.familyWealth}
                  onChange={(v) => set("familyWealth", v)}
                  options={[
                    { value: "lower",  label: "Lower-income family" },
                    { value: "middle", label: "Middle-class family" },
                    { value: "upper",  label: "Upper-middle-class" },
                    { value: "wealthy", label: "Wealthy family" },
                  ]}
                />
                <div className="grid2">
                  <SelectField
                    label="Religious Commitment"
                    hint="Your religious practice level"
                    value={inputs.religion}
                    onChange={(v) => set("religion", v)}
                    options={[
                      { value: "no",   label: "Minimal / Secular" },
                      { value: "moderate", label: "Moderate" },
                      { value: "yes",  label: "Practicing / Committed" },
                    ]}
                  />
                  <SelectField
                    label="Previous Marriage"
                    value={inputs.previousMarriage}
                    onChange={(v) => set("previousMarriage", v)}
                    options={[
                      { value: "no",     label: "First marriage" },
                      { value: "widowed", label: "Widowed" },
                      { value: "divorced", label: "Divorced" },
                    ]}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="step-heading">Character & Conduct</h2>
                <SelectField
                  label="Character & Trustworthiness"
                  hint="Your personal integrity and reliability"
                  value={inputs.character}
                  onChange={(v) => set("character", v)}
                  options={[
                    { value: "questionable", label: "Questionable integrity" },
                    { value: "average",     label: "Average / Mixed reputation" },
                    { value: "trustworthy", label: "Trustworthy & reliable" },
                    { value: "exemplary",   label: "Exemplary / Highly respected" },
                  ]}
                />
                <div className="grid2">
                  <SelectField
                    label="Financial Responsibility"
                    hint="Your ability to manage finances"
                    value={inputs.responsibility}
                    onChange={(v) => set("responsibility", v)}
                    options={[
                      { value: "no",  label: "Dependent / Irresponsible" },
                      { value: "moderate", label: "Moderately responsible" },
                      { value: "yes", label: "Responsible & organized" },
                    ]}
                  />
                  <SelectField
                    label="Stability Assessment"
                    hint="Overall life stability"
                    value={inputs.stability}
                    onChange={(v) => set("stability", v)}
                    options={[
                      { value: "unstable",  label: "Unstable / Uncertain" },
                      { value: "moderate",  label: "Moderate stability" },
                      { value: "yes",       label: "Highly stable" },
                    ]}
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="step-heading">Appearance & Personality</h2>
                <Field label={`Looks Rating — ${inputs.looks}/10`} hint="Be honest. The algorithm knows.">
                  <div className="slider-row">
                    <span className="slider-edge">😐</span>
                    <input
                      type="range" min="1" max="10" value={inputs.looks}
                      onChange={(e) => set("looks", e.target.value)}
                    />
                    <span className="slider-edge">😍</span>
                    <span className="looks-val">{inputs.looks}</span>
                  </div>
                  <div className="looks-bar">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`looks-pip ${i < inputs.looks ? "filled" : ""}`}
                        style={i < inputs.looks ? { background: looksColor(inputs.looks) } : {}}
                      />
                    ))}
                  </div>
                </Field>
                <SelectField
                  label="Her Personality / Nature"
                  hint="Pick the closest match"
                  value={inputs.nature}
                  onChange={(v) => set("nature", v)}
                  options={[
                    { value: "loving",      label: "❤️  Loving & caring" },
                    { value: "balanced",    label: "⚖️  Balanced & mature" },
                    { value: "nonchalant",  label: "😑  Nonchalant / indifferent" },
                    { value: "complicated", label: "💀  Complicated (God help you)" },
                  ]}
                />
                <div className="field">
                  <label>Is she a 10 out of 10? 👑</label>
                  <p className="field-hint">The ultimate override — activates a major bonus</p>
                  <div className="yesno-group">
                    <button
                      type="button"
                      className={`yesno-btn yesno-yes ${inputs.isTen === "yes" ? "active" : ""}`}
                      onClick={() => set("isTen", "yes")}
                    >
                      ✨ YES — She&apos;s perfect
                    </button>
                    <button
                      type="button"
                      className={`yesno-btn yesno-no ${inputs.isTen === "no" ? "active" : ""}`}
                      onClick={() => set("isTen", "no")}
                    >
                      😅 NO — Not quite
                    </button>
                  </div>
                </div>
              </div>
            )}

            {step === 6 && (
              <div>
                <h2 className="step-heading">Social Life</h2>
                <SelectField
                  label="How long have you known her?"
                  value={inputs.knownDuration}
                  onChange={(v) => set("knownDuration", v)}
                  options={[
                    { value: "less1", label: "Less than 1 year" },
                    { value: "1to3",  label: "1 – 3 years" },
                    { value: "3plus", label: "3+ years (trusted bond)" },
                  ]}
                />
                <div className="grid2">
                  <SelectField
                    label="Has a best friend?"
                    value={inputs.bestfriend}
                    onChange={(v) => set("bestfriend", v)}
                    options={[
                      { value: "no",  label: "No 🙏" },
                      { value: "yes", label: "Yes 😬" },
                    ]}
                  />
                  <SelectField
                    label="Male friends count?"
                    value={inputs.maleFriends}
                    onChange={(v) => set("maleFriends", v)}
                    options={[
                      { value: "none", label: "None 🙏" },
                      { value: "few",  label: "A few" },
                      { value: "many", label: "Many 💀" },
                    ]}
                  />
                </div>
              </div>
            )}

            {validErr && <div className="input-error">{validErr}</div>}
            {apiError && <div className="input-error">Server error: {apiError}</div>}

            <div className="nav-row">
              <button className="btn btn-ghost" onClick={back}>← Back</button>
              <button className="btn btn-primary" onClick={next}>
                {step < 6 ? "Next →" : "Calculate Meher"}
              </button>
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {step === 7 && (
          <LoadingScreen />
        )}

        {/* ── RESULT ── */}
        {step === 8 && result && (
          <div className="fade-in">
            <div className="disclaimer-tag">⚠ FOR INFORMATIONAL PURPOSES ONLY</div>
            <h1 className="title">Haq Meher Calculator</h1>

            <div className="result-header">
              <ScoreRing score={result.score} />
              <div className="result-header-text">
                <div className="tier-tag">{result.verdictEmoji} {result.tag}</div>
                <div className="result-total">
                  <AnimatedNumber target={result.total} />
                </div>
                <p className="verdict-text">{result.verdict}</p>
              </div>
            </div>

            <hr className="divider" />

            <p className="section-label">Detailed Breakdown</p>
            <div className="base-row">
              <span>Base value</span>
              <span className="neutral">{formatPKR(result.base)}</span>
            </div>

            {Object.entries(result.grouped).map(([cat, items]) => (
              <div key={cat} className="breakdown-group">
                <div className="breakdown-cat">{cat}</div>
                {items.map((item, i) => (
                  <div key={i} className="breakdown-item">
                    <span>{item.label}</span>
                    <span className={item.value >= 0 ? "pos" : "neg"}>
                      {item.value >= 0 ? "+" : "–"}
                      {formatPKR(Math.abs(item.value))}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            <div className="total-row">
              <span>Total</span>
              <span className="total-val">{formatPKR(result.total)}</span>
            </div>

            <p className="computed-at">
              BMI: {result.bmi} &nbsp;|&nbsp; Calculated at {new Date(result.computedAt).toLocaleTimeString()}
            </p>

            <div className="result-actions">
              <button className="btn btn-ghost" onClick={copyResult}>
                {copied ? "✓ Copied!" : "📋 Copy Result"}
              </button>
              <button className="btn btn-primary" onClick={reset}>
                Calculate Again
              </button>
            </div>
          </div>
        )}
      <div className="watermark">Zubified ✨</div>

      </div>
    </div>
  );
}
