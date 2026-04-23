import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TossScreen.css';

const PHASES = {
  CHOOSE: 'choose',   // pick heads/tails
  FLIPPING: 'flip',  // coin spinning
  RESULT: 'result',  // who won toss
  DECISION: 'decision', // bat or bowl
};

export default function TossScreen() {
  const navigate = useNavigate();
  const team1 = JSON.parse(localStorage.getItem('team1') || '{}');
  const team2 = JSON.parse(localStorage.getItem('team2') || '{}');

  const [phase, setPhase] = useState(PHASES.CHOOSE);
  const [callerTeam, setCallerTeam] = useState(null); // which team calls
  const [call, setCall] = useState(null);              // 'heads' | 'tails'
  const [coinResult, setCoinResult] = useState(null);  // 'heads' | 'tails'
  const [tossWinner, setTossWinner] = useState(null);  // team object

  function handleCall(team, side) {
    setCallerTeam(team);
    setCall(side);
    setPhase(PHASES.FLIPPING);

    setTimeout(() => {
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      setCoinResult(result);
      // Compare by name to avoid object reference mismatch
      const otherTeam = team.name === team1.name ? team2 : team1;
      const winner = result === side ? team : otherTeam;
      setTossWinner(winner);
      setPhase(PHASES.RESULT);
    }, 2200);
  }

  function handleDecision(choice) {
    // choice: 'bat' | 'bowl'
    // Compare by name — object reference comparison fails across state updates
    const otherTeam = tossWinner.name === team1.name ? team2 : team1;
    let battingFirst, bowlingFirst;
    if (choice === 'bat') {
      battingFirst = tossWinner;
      bowlingFirst = otherTeam;
    } else {
      bowlingFirst = tossWinner;
      battingFirst = otherTeam;
    }

    const tossResult = {
      tossWinner: tossWinner.name,
      choice,
      battingFirst: battingFirst.name,
      bowlingFirst: bowlingFirst.name,
    };
    localStorage.setItem('tossResult', JSON.stringify(tossResult));

    // Re-order: team batting first = "team1" for scoring purposes
    // We store battingFirst as the "inning1" team
    localStorage.setItem('inning1Team', JSON.stringify(battingFirst));
    localStorage.setItem('inning2Team', JSON.stringify(bowlingFirst));

    navigate('/playing');
  }

  return (
    <div className="toss-screen">
      <div className="toss-header">
        <h1 className="toss-title">🪙 Toss Time</h1>
        <p className="toss-sub">{team1.name} vs {team2.name}</p>
      </div>

      {/* CHOOSE phase */}
      {phase === PHASES.CHOOSE && (
        <div className="toss-card">
          <p className="toss-instruction">Which team calls the toss?</p>
          <div className="team-select-row">
            <button className="team-select-btn" onClick={() => setCallerTeam(team1)}>
              <span className="tsb-icon">🏏</span>
              <span>{team1.name}</span>
            </button>
            <div className="vs-badge">VS</div>
            <button className="team-select-btn" onClick={() => setCallerTeam(team2)}>
              <span className="tsb-icon">🏏</span>
              <span>{team2.name}</span>
            </button>
          </div>

          {callerTeam && (
            <div className="call-section">
              <p className="toss-instruction">
                <strong style={{ color: '#ffd600' }}>{callerTeam.name}</strong> calls:
              </p>
              <div className="coin-call-row">
                <button
                  className={`coin-call-btn ${call === 'heads' ? 'selected' : ''}`}
                  onClick={() => handleCall(callerTeam, 'heads')}
                >
                  <span className="coin-face">👑</span>
                  <span>Heads</span>
                </button>
                <button
                  className={`coin-call-btn ${call === 'tails' ? 'selected' : ''}`}
                  onClick={() => handleCall(callerTeam, 'tails')}
                >
                  <span className="coin-face">🦅</span>
                  <span>Tails</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FLIPPING phase */}
      {phase === PHASES.FLIPPING && (
        <div className="toss-card center">
          <div className="coin-flip-wrap">
            <div className="coin flipping">
              <div className="coin-front">👑</div>
              <div className="coin-back">🦅</div>
            </div>
          </div>
          <p className="flip-text">Flipping coin…</p>
          <p className="flip-sub">{callerTeam?.name} called <strong>{call}</strong></p>
        </div>
      )}

      {/* RESULT phase */}
      {phase === PHASES.RESULT && (
        <div className="toss-card center">
          <div className="coin-result-icon">
            {coinResult === 'heads' ? '👑' : '🦅'}
          </div>
          <div className="result-label">{coinResult?.toUpperCase()}</div>
          <div className="toss-winner-banner">
            <span className="tw-emoji">🎉</span>
            <div>
              <div className="tw-name">{tossWinner?.name}</div>
              <div className="tw-sub">won the toss!</div>
            </div>
          </div>

          <p className="toss-instruction" style={{ marginTop: 20 }}>
            What does <strong style={{ color: '#ffd600' }}>{tossWinner?.name}</strong> choose?
          </p>
          <div className="decision-row">
            <button className="decision-btn bat" onClick={() => handleDecision('bat')}>
              <span>🏏</span>
              <span>Bat First</span>
            </button>
            <button className="decision-btn bowl" onClick={() => handleDecision('bowl')}>
              <span>⚾</span>
              <span>Bowl First</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
