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
    // Auto-fill team2 overs & players from team1 — user can only change name
    setTeam2({ name: '', overs: team1.overs, players: team1.players });
    setStep(2);
  }

  function handleStep2(e) {
    e.preventDefault();
    if (!team2.name.trim()) { setErrors({ name: 'Team name required' }); return; }
    setErrors({});
    localStorage.setItem('team1', JSON.stringify({ ...team1, overs: +team1.overs, players: +team1.players }));
    localStorage.setItem('team2', JSON.stringify({ ...team2, overs: +team1.overs, players: +team1.players }));
    localStorage.removeItem('team1Score');
    localStorage.removeItem('team2Score');
    localStorage.removeItem('tossResult');
    navigate('/toss');
  }

  const isStep1 = step === 1;
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
          <p>{isStep1 ? 'Enter team details' : 'Enter team name'}</p>
        </div>

        <form onSubmit={onSubmit} className="setup-form">

          {/* Team Name — editable for both steps */}
          <Field
            label="Team Name" icon="🏏"
            placeholder={isStep1 ? 'e.g. Mumbai Indians' : 'e.g. Chennai Super Kings'}
            value={isStep1 ? team1.name : team2.name}
            maxLength={20} type="text"
            onChange={v => isStep1
              ? setTeam1({ ...team1, name: v })
              : setTeam2({ ...team2, name: v })
            }
            error={errors.name}
          />

          {/* Overs & Players — editable only in step 1, locked in step 2 */}
          <div className="form-row">
            <LockedField
              label="Total Overs" icon="🔢"
              value={isStep1 ? team1.overs : team1.overs}
              locked={!isStep1}
              type="number" min="1" max="50"
              onChange={v => setTeam1({ ...team1, overs: v })}
              error={isStep1 ? errors.overs : null}
            />
            <LockedField
              label="Players" icon="👥"
              value={isStep1 ? team1.players : team1.players}
              locked={!isStep1}
              type="number" min="2" max="11"
              onChange={v => setTeam1({ ...team1, players: v })}
              error={isStep1 ? errors.players : null}
            />
          </div>

          {/* Step 2: info banner */}
          {!isStep1 && (
            <div className="locked-info-banner">
              <span className="lib-icon">🔒</span>
              <div>
                <div className="lib-title">Same match conditions</div>
                <div className="lib-sub">
                  {team1.overs} overs · {team1.players} players per side
                </div>
              </div>
            </div>
          )}

          {/* Step 2: team1 summary */}
          {!isStep1 && (
            <div className="summary-chip">
              <span>🏏</span>
              <span>{team1.name} (Team 1) is set</span>
            </div>
          )}

          <button type="submit" className="btn-primary">
            {isStep1 ? 'Next: Team 2 →' : '🪙 Proceed to Toss'}
          </button>

          {!isStep1 && (
            <button type="button" className="btn-ghost"
              onClick={() => { setStep(1); setErrors({}); }}>
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

/* Locked field — shows value but disabled when locked=true */
function LockedField({ label, icon, value, locked, type, min, max, onChange, error }) {
  return (
    <div className="form-group half">
      <label>{label}</label>
      <div className={`input-wrap ${locked ? 'locked' : ''}`}>
        <span className="input-icon">{locked ? '🔒' : icon}</span>
        <input
          type={type} value={value}
          min={min} max={max}
          onChange={e => onChange(e.target.value)}
          disabled={locked}
          placeholder={locked ? '' : `e.g. ${type === 'number' ? (label.includes('Over') ? '20' : '11') : ''}`}
        />
      </div>
      {error && <span className="err">{error}</span>}
    </div>
  );
}
