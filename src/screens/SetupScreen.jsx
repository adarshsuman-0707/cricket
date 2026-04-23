import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SetupScreen.css';

const defaultTeam = { name: '', overs: '', players: '' };

export default function SetupScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [team1, setTeam1] = useState({ ...defaultTeam });
  const [team2, setTeam2] = useState({ ...defaultTeam });
  const [errors, setErrors] = useState({});

  function validate(team) {
    const e = {};
    if (!team.name.trim()) e.name = 'Team name required';
    if (!team.overs || +team.overs < 1 || +team.overs > 50) e.overs = '1 – 50';
    if (!team.players || +team.players < 2 || +team.players > 11) e.players = '2 – 11';
    return e;
  }

  function handleStep1(e) {
    e.preventDefault();
    const errs = validate(team1);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(2);
  }

  function handleStep2(e) {
    e.preventDefault();
    const errs = validate(team2);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    // Save both teams, clear old match data
    localStorage.setItem('team1', JSON.stringify({ ...team1, overs: +team1.overs, players: +team1.players }));
    localStorage.setItem('team2', JSON.stringify({ ...team2, overs: +team2.overs, players: +team2.players }));
    localStorage.removeItem('team1Score');
    localStorage.removeItem('team2Score');
    localStorage.removeItem('tossResult');
    navigate('/toss');
  }

  const isStep1 = step === 1;
  const cur = isStep1 ? team1 : team2;
  const setCur = isStep1 ? setTeam1 : setTeam2;
  const onSubmit = isStep1 ? handleStep1 : handleStep2;

  return (
    <div className="setup-screen">
      {/* Header */}
      <div className="setup-header">
        <div className="ball-icon">
          <div className="bi-seam s1" /><div className="bi-seam s2" />
        </div>
        <h1 className="setup-app-title">CricScore</h1>
        <p className="setup-app-sub">Setup Match</p>
      </div>

      {/* Steps */}
      <div className="step-indicator">
        <StepDot n={1} active={step >= 1} label="Team 1" />
        <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
        <StepDot n={2} active={step >= 2} label="Team 2" />
        <div className="step-line" />
        <StepDot n={3} active={false} label="Toss" />
      </div>

      {/* Card */}
      <div className="setup-card">
        <div className="setup-card-header">
          <div className="team-badge">Team {step}</div>
          <h2>{isStep1 ? 'First Team' : 'Second Team'}</h2>
          <p>Enter team details</p>
        </div>

        <form onSubmit={onSubmit} className="setup-form">
          <Field
            label="Team Name" icon="🏏" placeholder="e.g. Mumbai Indians"
            value={cur.name} maxLength={20} type="text"
            onChange={v => setCur({ ...cur, name: v })}
            error={errors.name}
          />

          <div className="form-row">
            <Field
              label="Total Overs" icon="🔢" placeholder="e.g. 20"
              value={cur.overs} type="number" min="1" max="50"
              onChange={v => setCur({ ...cur, overs: v })}
              error={errors.overs} half
            />
            <Field
              label="Players" icon="👥" placeholder="e.g. 11"
              value={cur.players} type="number" min="2" max="11"
              onChange={v => setCur({ ...cur, players: v })}
              error={errors.players} half
            />
          </div>

          {!isStep1 && (
            <div className="summary-chip">
              <span>🏏</span>
              <span>{team1.name} · {team1.overs} overs · {team1.players} players</span>
            </div>
          )}

          <button type="submit" className="btn-primary">
            {isStep1 ? 'Next: Team 2 →' : '🪙 Proceed to Toss'}
          </button>

          {!isStep1 && (
            <button type="button" className="btn-ghost" onClick={() => { setStep(1); setErrors({}); }}>
              ← Back
            </button>
          )}
        </form>
      </div>

      <div className="field-deco">
        <div className="field-circle" /><div className="field-pitch" />
      </div>
    </div>
  );
}

function StepDot({ n, active, label }) {
  return (
    <div className="step-dot-wrap">
      <div className={`step-dot ${active ? 'active' : ''}`}><span>{n}</span></div>
      <span className="step-dot-label">{label}</span>
    </div>
  );
}

function Field({ label, icon, placeholder, value, type, min, max, maxLength, onChange, error, half }) {
  return (
    <div className={`form-group ${half ? 'half' : ''}`}>
      <label>{label}</label>
      <div className="input-wrap">
        <span className="input-icon">{icon}</span>
        <input
          type={type} placeholder={placeholder} value={value}
          min={min} max={max} maxLength={maxLength}
          onChange={e => onChange(e.target.value)}
        />
      </div>
      {error && <span className="err">{error}</span>}
    </div>
  );
}
