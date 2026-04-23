import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultScreen.css';

export default function ResultScreen() {
  const navigate  = useNavigate();
  const result    = JSON.parse(localStorage.getItem('matchResult') || '{}');
  // team1Score = inning1 (batting first), team2Score = inning2 (batting second)
  const t1Score   = JSON.parse(localStorage.getItem('team1Score')  || '{}');
  const t2Score   = JSON.parse(localStorage.getItem('team2Score')  || '{}');
  const toss      = JSON.parse(localStorage.getItem('tossResult')  || '{}');
  // inning1Team / inning2Team are set by TossScreen
  const inning1   = JSON.parse(localStorage.getItem('inning1Team') || '{}');
  const inning2   = JSON.parse(localStorage.getItem('inning2Team') || '{}');

  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  if (!result.winner) {
    return (
      <div className="result-screen">
        <p style={{ color: '#a0aec0', textAlign: 'center', marginTop: 80 }}>
          No match data found.
        </p>
        <button className="btn-primary" style={{ margin: '24px 16px' }} onClick={() => navigate('/')}>
          New Match
        </button>
      </div>
    );
  }

  const team1Log = t1Score.ballLog || [];
  const team2Log = t2Score.ballLog || [];

  function countType(log, type) {
    return log.filter(b => b.type === type).length;
  }

  function totalExtras(log) {
    return log.filter(b => b.isExtra).reduce((s, b) => s + b.runs, 0);
  }

  return (
    <div className="result-screen">

      {/* Trophy section */}
      <div className={`trophy-section ${show ? 'visible' : ''}`}>
        <div className="confetti-row">
          {['🎊','🎉','🏆','🎉','🎊'].map((e,i) => (
            <span key={i} className="confetti-item" style={{ animationDelay: `${i * 0.1}s` }}>{e}</span>
          ))}
        </div>
        <div className="trophy-icon">🏆</div>
        <h1 className="winner-name">{result.winner}</h1>
        <p className="winner-desc">{result.desc}</p>
      </div>

      {/* Scorecard */}
      <div className="scorecard">
        <div className="sc-header">
          <span className="sc-title">Match Scorecard</span>
          {toss.tossWinner && (
            <span className="sc-toss">🪙 {toss.tossWinner} won toss</span>
          )}
        </div>

        {/* Team 1 (batting first = inning1) */}
        <InningsCard
          teamName={inning1.name || result.team1}
          score={result.team1Score}
          overs={result.team1Overs}
          fours={countType(team1Log, 'four')}
          sixes={countType(team1Log, 'six')}
          wickets={countType(team1Log, 'wicket')}
          extras={totalExtras(team1Log)}
          log={team1Log}
          isFirst
        />

        {/* VS divider */}
        <div className="vs-row">
          <div className="vs-line" /><span className="vs-text">VS</span><div className="vs-line" />
        </div>

        {/* Team 2 (batting second = inning2) */}
        <InningsCard
          teamName={inning2.name || result.team2}
          score={result.team2Score}
          overs={result.team2Overs}
          fours={countType(team2Log, 'four')}
          sixes={countType(team2Log, 'six')}
          wickets={countType(team2Log, 'wicket')}
          extras={totalExtras(team2Log)}
          log={team2Log}
          target={(t1Score.runs || 0) + 1}
        />
      </div>

      {/* Over-by-over summary */}
      <OverSummary label={`${inning1.name || result.team1} — Over Summary`} log={team1Log} />
      <OverSummary label={`${inning2.name || result.team2} — Over Summary`} log={team2Log} />

      {/* Actions */}
      <div className="result-actions">
        <button className="btn-primary" onClick={() => {
          localStorage.removeItem('team1Score');
          localStorage.removeItem('team2Score');
          localStorage.removeItem('matchResult');
          localStorage.removeItem('tossResult');
          localStorage.removeItem('inning1Team');
          localStorage.removeItem('inning2Team');
          navigate('/');
        }}>
          🏏 New Match
        </button>
        <button className="btn-ghost" onClick={() => navigate('/team2')}>
          ← Back to Scoresheet
        </button>
      </div>
    </div>
  );
}

/* ─── Innings Card ─── */
function InningsCard({ teamName, score, overs, fours, sixes, wickets, extras, log, isFirst, target }) {
  const runs = parseInt(score?.split('/')[0]) || 0;
  const wkts = parseInt(score?.split('/')[1]) || 0;
  const totalBalls = log.filter(b => !b.isExtra).length;
  const rr = totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(2) : '0.00';

  return (
    <div className={`innings-card ${isFirst ? 'first' : 'second'}`}>
      <div className="ic-top">
        <div>
          <div className="ic-team">{teamName}</div>
          {!isFirst && target && (
            <div className="ic-target">Target: {target}</div>
          )}
        </div>
        <div className="ic-score-big">{score}</div>
      </div>

      <div className="ic-overs">({overs} overs)</div>

      <div className="ic-stats">
        <StatChip icon="4️⃣" val={fours}   label="Fours"   color="green" />
        <StatChip icon="6️⃣" val={sixes}   label="Sixes"   color="gold"  />
        <StatChip icon="🏏" val={wickets} label="Wickets" color="red"   />
        <StatChip icon="➕" val={extras}  label="Extras"  color="purple"/>
        <StatChip icon="📊" val={rr}      label="Run Rate" color="blue" />
      </div>
    </div>
  );
}

function StatChip({ icon, val, label, color }) {
  return (
    <div className={`stat-chip sc-${color}`}>
      <span className="sc-icon">{icon}</span>
      <span className="sc-val">{val}</span>
      <span className="sc-lbl">{label}</span>
    </div>
  );
}

/* ─── Over Summary ─── */
function OverSummary({ label, log }) {
  if (!log.length) return null;

  // Group by over number
  const overs = {};
  log.forEach(b => {
    const key = b.over ?? 0;
    if (!overs[key]) overs[key] = [];
    overs[key].push(b);
  });

  return (
    <div className="over-summary">
      <div className="os-label">{label}</div>
      <div className="os-overs">
        {Object.entries(overs).map(([ov, balls]) => {
          const runs = balls.reduce((s, b) => s + (b.runs || 0), 0);
          return (
            <div key={ov} className="os-over-row">
              <span className="os-ov-num">Ov {parseInt(ov)+1}</span>
              <div className="os-balls">
                {balls.map((b, i) => (
                  <div key={i} className={`ball-chip ${chipClass(b.type, b.isExtra)}`}>
                    {b.label}
                  </div>
                ))}
              </div>
              <span className="os-runs">{runs}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function chipClass(type, isExtra) {
  if (isExtra)         return 'ball-extra';
  if (type === 'wicket') return 'ball-wicket';
  if (type === 'four')   return 'ball-four';
  if (type === 'six')    return 'ball-six';
  if (type === 'dot')    return 'ball-dot';
  return 'ball-run';
}
