import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayerSetupScreen.css';

export default function PlayerSetupScreen() {
  const navigate = useNavigate();
  const team1 = JSON.parse(localStorage.getItem('team1') || '{}');
  const team2 = JSON.parse(localStorage.getItem('team2') || '{}');
  const count = parseInt(team1.players) || 11;

  const makeNames = () => Array.from({ length: count }, (_, i) => `Player ${i + 1}`);

  const [activeTeam, setActiveTeam] = useState(1); // 1 or 2
  const [t1Names, setT1Names] = useState(makeNames);
  const [t2Names, setT2Names] = useState(makeNames);
  const [errors, setErrors] = useState({});

  function validate(names) {
    const e = {};
    names.forEach((n, i) => {
      if (!n.trim()) e[i] = 'Required';
    });
    return e;
  }

  function handleNext() {
    const names = activeTeam === 1 ? t1Names : t2Names;
    const errs = validate(names);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});

    if (activeTeam === 1) {
      setActiveTeam(2);
    } else {
      // Save player lists
      const t1Players = t1Names.map((name, i) => ({ id: i, name: name.trim(), batting: { runs: 0, balls: 0, fours: 0, sixes: 0, out: false, outDesc: '' }, bowling: { overs: 0, balls: 0, runs: 0, wickets: 0 } }));
      const t2Players = t2Names.map((name, i) => ({ id: i, name: name.trim(), batting: { runs: 0, balls: 0, fours: 0, sixes: 0, out: false, outDesc: '' }, bowling: { overs: 0, balls: 0, runs: 0, wickets: 0 } }));
      localStorage.setItem('team1Players', JSON.stringify(t1Players));
      localStorage.setItem('team2Players', JSON.stringify(t2Players));
      navigate('/toss');
    }
  }

  const names = activeTeam === 1 ? t1Names : t2Names;
  const setNames = activeTeam === 1 ? setT1Names : setT2Names;
  const teamObj = activeTeam === 1 ? team1 : team2;

  return (
    <div className="psetup-screen">
      {/* Header */}
      <div className="psetup-header">
        <div className="ball-icon-sm">
          <div className="bi-seam s1" /><div className="bi-seam s2" />
        </div>
        <h1 className="psetup-title">Squad Setup</h1>
        <p className="psetup-sub">Add player names</p>
      </div>

      {/* Step indicator */}
      <div className="step-indicator">
        <StepDot n={1} active={activeTeam >= 1} label="Team 1" />
        <div className={`step-line ${activeTeam >= 2 ? 'active' : ''}`} />
        <StepDot n={2} active={activeTeam >= 2} label="Team 2" />
      </div>

      {/* Team badge */}
      <div className="psetup-team-badge">
        <span className="ptb-dot" />
        <span className="ptb-name">{teamObj.name}</span>
        <span className="ptb-count">{count} players</span>
      </div>

      {/* Player list */}
      <div className="player-list">
        {names.map((name, i) => (
          <div key={i} className="player-row">
            <div className="player-num">{i + 1}</div>
            <div className={`player-input-wrap ${errors[i] ? 'err-border' : ''}`}>
              <input
                type="text"
                value={name}
                maxLength={20}
                placeholder={`Player ${i + 1}`}
                onChange={e => {
                  const updated = [...names];
                  updated[i] = e.target.value;
                  setNames(updated);
                  if (errors[i]) {
                    const newErr = { ...errors };
                    delete newErr[i];
                    setErrors(newErr);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="psetup-actions">
        <button className="btn-primary" onClick={handleNext}>
          {activeTeam === 1 ? `Next: ${team2.name} Squad →` : '🪙 Proceed to Toss'}
        </button>
        {activeTeam === 2 && (
          <button className="btn-ghost" onClick={() => { setActiveTeam(1); setErrors({}); }}>
            ← Back
          </button>
        )}
        <button className="btn-ghost" onClick={() => navigate('/toss')}>
          Skip (use defaults)
        </button>
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
