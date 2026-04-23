import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultScreen.css';

export default function ResultScreen() {
  const navigate = useNavigate();
  const result   = JSON.parse(localStorage.getItem('matchResult') || '{}');
  const t1Score  = JSON.parse(localStorage.getItem('team1Score')  || '{}');
  const t2Score  = JSON.parse(localStorage.getItem('team2Score')  || '{}');
  const toss     = JSON.parse(localStorage.getItem('tossResult')  || '{}');
  const inning1  = JSON.parse(localStorage.getItem('inning1Team') || '{}');
  const inning2  = JSON.parse(localStorage.getItem('inning2Team') || '{}');

  // Players: inning1 batted first, inning2 batted second
  const team1Raw = JSON.parse(localStorage.getItem('team1') || '{}');
  const inning1IsTeam1 = inning1.name === team1Raw.name;
  const inning1BatKey  = inning1IsTeam1 ? 'team1Players' : 'team2Players';
  const inning1BowlKey = inning1IsTeam1 ? 'team2Players' : 'team1Players';
  const inning2BatKey  = inning1IsTeam1 ? 'team2Players' : 'team1Players';
  const inning2BowlKey = inning1IsTeam1 ? 'team1Players' : 'team2Players';

  const inn1Batters = JSON.parse(localStorage.getItem(inning1BatKey)  || '[]');
  const inn1Bowlers = JSON.parse(localStorage.getItem(inning1BowlKey) || '[]');
  const inn2Batters = JSON.parse(localStorage.getItem(inning2BatKey)  || '[]');
  const inn2Bowlers = JSON.parse(localStorage.getItem(inning2BowlKey) || '[]');

  const [show, setShow] = useState(false);
  const [tab, setTab]   = useState('batting'); // 'batting' | 'bowling' | 'overs'
  const [inn, setInn]   = useState(1);         // 1 or 2

  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  if (!result.winner) {
    return (
      <div className="result-screen">
        <p style={{ color: '#a0aec0', textAlign: 'center', marginTop: 80 }}>No match data found.</p>
        <button className="btn-primary" style={{ margin: '24px 16px' }} onClick={() => navigate('/')}>New Match</button>
      </div>
    );
  }

  const team1Log = t1Score.ballLog || [];
  const team2Log = t2Score.ballLog || [];

  function clearAll() {
    ['team1Score','team2Score','matchResult','tossResult','inning1Team','inning2Team',
     'team1Players','team2Players'].forEach(k => localStorage.removeItem(k));
    navigate('/');
  }

  const curBatters = inn === 1 ? inn1Batters : inn2Batters;
  const curBowlers = inn === 1 ? inn1Bowlers : inn2Bowlers;
  const curLog     = inn === 1 ? team1Log    : team2Log;
  const curTeam    = inn === 1 ? inning1     : inning2;
  const curScore   = inn === 1 ? result.team1Score : result.team2Score;
  const curOvers   = inn === 1 ? result.team1Overs : result.team2Overs;

  return (
    <div className="result-screen">

      {/* Trophy */}
      <div className={`trophy-section ${show ? 'visible' : ''}`}>
        <div className="confetti-row">
          {['🎊','🎉','🏆','🎉','🎊'].map((e,i) => (
            <span key={i} className="confetti-item" style={{ animationDelay: `${i*0.1}s` }}>{e}</span>
          ))}
        </div>
        <div className="trophy-icon">🏆</div>
        <h1 className="winner-name">{result.winner}</h1>
        <p className="winner-desc">{result.desc}</p>
      </div>

      {/* Mini scorecard */}
      <div className="mini-scorecard">
        {toss.tossWinner && <div className="ms-toss">🪙 {toss.tossWinner} won toss · {toss.battingFirst} batted first</div>}
        <div className="ms-row">
          <span className="ms-team">{inning1.name}</span>
          <span className="ms-score">{result.team1Score}</span>
          <span className="ms-overs">({result.team1Overs} ov)</span>
        </div>
        <div className="ms-row">
          <span className="ms-team">{inning2.name}</span>
          <span className="ms-score">{result.team2Score}</span>
          <span className="ms-overs">({result.team2Overs} ov)</span>
        </div>
      </div>

      {/* Innings selector */}
      <div className="inn-selector">
        <button className={`inn-btn ${inn === 1 ? 'active' : ''}`} onClick={() => setInn(1)}>
          {inning1.name} <span className="inn-score-sm">{result.team1Score}</span>
        </button>
        <button className={`inn-btn ${inn === 2 ? 'active' : ''}`} onClick={() => setInn(2)}>
          {inning2.name} <span className="inn-score-sm">{result.team2Score}</span>
        </button>
      </div>

      {/* Tab selector */}
      <div className="tab-selector">
        {['batting','bowling','overs'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'batting' ? '🏏 Batting' : t === 'bowling' ? '⚾ Bowling' : '📋 Overs'}
          </button>
        ))}
      </div>

      {/* Batting Scorecard */}
      {tab === 'batting' && (
        <div className="scorecard-table">
          <div className="sct-header">
            <span className="sct-name">Batsman</span>
            <span className="sct-col">R</span>
            <span className="sct-col">B</span>
            <span className="sct-col">4s</span>
            <span className="sct-col">6s</span>
            <span className="sct-col">SR</span>
          </div>
          {curBatters.length === 0 && <NoDataRow />}
          {curBatters.map(p => {
            const b = p.batting;
            const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(0) : '—';
            const played = b.balls > 0 || b.out;
            if (!played) return null;
            return (
              <div key={p.id} className={`sct-row ${b.out ? '' : 'not-out'}`}>
                <div className="sct-name-col">
                  <span className="sct-pname">{p.name}</span>
                  {b.out
                    ? <span className="sct-dismiss">{b.outDesc || 'out'}</span>
                    : <span className="sct-notout">not out</span>
                  }
                </div>
                <span className={`sct-col bold ${b.runs >= 50 ? 'gold' : ''}`}>{b.runs}</span>
                <span className="sct-col">{b.balls}</span>
                <span className="sct-col green">{b.fours}</span>
                <span className="sct-col gold">{b.sixes}</span>
                <span className="sct-col">{sr}</span>
              </div>
            );
          })}
          {/* Extras & Total */}
          <div className="sct-extras">
            <span>Extras</span>
            <span>{(inn === 1 ? t1Score : t2Score).extras || 0}</span>
          </div>
          <div className="sct-total">
            <span>Total</span>
            <span className="sct-total-score">{curScore} ({curOvers} ov)</span>
          </div>
        </div>
      )}

      {/* Bowling Scorecard */}
      {tab === 'bowling' && (
        <div className="scorecard-table">
          <div className="sct-header">
            <span className="sct-name">Bowler</span>
            <span className="sct-col">O</span>
            <span className="sct-col">R</span>
            <span className="sct-col">W</span>
            <span className="sct-col">Eco</span>
          </div>
          {curBowlers.length === 0 && <NoDataRow />}
          {curBowlers.map(p => {
            const b = p.bowling;
            if (b.balls === 0 && b.overs === 0) return null;
            const totalBalls = b.overs * 6 + (b.ballsRem ?? 0);
            const eco = totalBalls > 0 ? ((b.runs / totalBalls) * 6).toFixed(1) : '—';
            const overDisp = `${b.overs}.${b.ballsRem ?? 0}`;
            return (
              <div key={p.id} className="sct-row">
                <div className="sct-name-col">
                  <span className="sct-pname">{p.name}</span>
                </div>
                <span className="sct-col">{overDisp}</span>
                <span className="sct-col">{b.runs}</span>
                <span className={`sct-col bold ${b.wickets > 0 ? 'red' : ''}`}>{b.wickets}</span>
                <span className="sct-col">{eco}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Over Summary */}
      {tab === 'overs' && <OverSummary log={curLog} teamName={curTeam.name} bowlers={curBowlers} />}

      {/* Actions */}
      <div className="result-actions">
        <button className="btn-primary" onClick={clearAll}>🏏 New Match</button>
        <button className="btn-ghost" onClick={() => navigate('/team2')}>← Back to Match</button>
      </div>
    </div>
  );
}

function NoDataRow() {
  return <div style={{ color: '#4a5568', textAlign: 'center', padding: '16px', fontSize: 13 }}>No data recorded</div>;
}

function OverSummary({ log, teamName, bowlers = [] }) {
  if (!log.length) return <NoDataRow />;

  // Group by over number
  const overs = {};
  log.forEach(b => {
    const key = b.over ?? 0;
    if (!overs[key]) overs[key] = [];
    overs[key].push(b);
  });

  function getBowlerName(overBalls) {
    // Find the bowlerId used in this over (first legal ball)
    const ball = overBalls.find(b => b.bowlerId !== undefined && b.bowlerId !== null);
    if (!ball) return null;
    const bowler = bowlers.find(p => p.id === ball.bowlerId);
    return bowler?.name || null;
  }

  return (
    <div className="over-summary">
      <div className="os-label">{teamName} — Over by Over</div>
      <div className="os-overs">
        {Object.entries(overs).map(([ov, balls]) => {
          const runs = balls.reduce((s, b) => s + (b.runs || 0), 0);
          const bowlerName = getBowlerName(balls);
          return (
            <div key={ov} className="os-over-block">
              <div className="os-over-meta">
                <span className="os-ov-num">Over {parseInt(ov) + 1}</span>
                {bowlerName && <span className="os-bowler-name">⚾ {bowlerName}</span>}
                <span className="os-runs-badge">{runs} runs</span>
              </div>
              <div className="os-balls">
                {balls.map((b, i) => (
                  <div key={i} className={`ball-chip ${chipClass(b.type, b.isExtra)}`}>{b.label}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function chipClass(type, isExtra) {
  if (isExtra)           return 'ball-extra';
  if (type === 'wicket') return 'ball-wicket';
  if (type === 'four')   return 'ball-four';
  if (type === 'six')    return 'ball-six';
  if (type === 'dot')    return 'ball-dot';
  return 'ball-run';
}
