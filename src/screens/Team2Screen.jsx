import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayingScreen.css';
import './Team2Screen.css';

/* ─── helpers ─── */
function overStr(overs, ballsInOver) {
  return `${overs}.${ballsInOver}`;
}

function initState() {
  return {
    runs: 0, wickets: 0,
    balls: 0, overs: 0, ballsInOver: 0,
    extras: 0, ballLog: [],
    isAllOut: false, isOversComplete: false, hasWon: false,
  };
}

/* ─── Overthrow Modal ─── */
function OverthrowModal({ baseRuns, onConfirm, onCancel }) {
  const [extra, setExtra] = useState(0);
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card ot-modal" onClick={e => e.stopPropagation()}>
        <div className="ot-header">
          <span className="ot-icon">🔄</span>
          <h3>Overthrow?</h3>
          <p>Base: <strong>{baseRuns}</strong> runs. Add overthrow:</p>
        </div>
        <div className="ot-options">
          {[1,2,3,4].map(n => (
            <button key={n} className={`ot-btn ${extra === n ? 'selected' : ''}`}
              onClick={() => setExtra(n)}>+{n}</button>
          ))}
        </div>
        <div className="ot-total">Total: <strong>{baseRuns + extra}</strong> runs</div>
        <div className="ot-actions">
          <button className="btn-ghost ot-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-primary ot-confirm" onClick={() => onConfirm(extra)}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Undo Modal ─── */
function UndoModal({ lastBall, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card undo-modal" onClick={e => e.stopPropagation()}>
        <span style={{ fontSize: 40 }}>↩️</span>
        <h3>Undo Last Ball?</h3>
        <p style={{ color: '#a0aec0', fontSize: 14 }}>
          Last: <strong style={{ color: '#fff' }}>{lastBall?.label}</strong>
        </p>
        <div className="ot-actions">
          <button className="btn-ghost ot-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-primary ot-confirm" onClick={onConfirm}>Undo</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function Team2Screen() {
  const navigate = useNavigate();

  const inning2Team = JSON.parse(localStorage.getItem('inning2Team') || localStorage.getItem('team2') || '{}');
  const team1Score  = JSON.parse(localStorage.getItem('team1Score') || '{}');
  const target      = (team1Score.runs || 0) + 1;   // need 1 more than team1
  const maxOvers    = parseInt(inning2Team.overs) || 5;
  const maxWickets  = Math.max(1, parseInt(inning2Team.players) - 1) || 10;

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('team2Score');
    return saved ? JSON.parse(saved) : initState();
  });

  const [showGameOver, setShowGameOver] = useState(false);
  const [flashType, setFlashType]       = useState(null);
  const [overthrowFor, setOverthrowFor] = useState(null);
  const [showUndo, setShowUndo]         = useState(false);

  useEffect(() => {
    localStorage.setItem('team2Score', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if ((state.isAllOut || state.isOversComplete || state.hasWon) && !showGameOver) {
      setTimeout(() => setShowGameOver(true), 400);
    }
  }, [state.isAllOut, state.isOversComplete, state.hasWon]);

  /* ─── Core ball logic ─── */
  const commitBall = useCallback((type, extraRuns = 0) => {
    setState(prev => {
      if (prev.isAllOut || prev.isOversComplete || prev.hasWon) return prev;

      const ns = { ...prev, ballLog: [...prev.ballLog] };
      const isExtra = type === 'wide' || type === 'noball';
      let entry = { type, over: prev.overs, ballInOver: prev.ballsInOver, isExtra };

      if (isExtra) {
        const total = 1 + extraRuns;
        ns.runs   += total;
        ns.extras += total;
        entry.runs  = total;
        entry.label = (type === 'wide' ? 'Wd' : 'Nb') + (extraRuns ? `+${extraRuns}` : '');
      } else {
        const baseMap = { dot:0, one:1, two:2, three:3, four:4, six:6, wicket:0 };
        const base  = baseMap[type] ?? 0;
        const total = base + extraRuns;

        ns.runs        += total;
        ns.ballsInOver += 1;
        ns.balls       += 1;

        if (type === 'wicket') ns.wickets += 1;

        entry.runs  = total;
        entry.label = type === 'wicket'
          ? (extraRuns ? `W+${extraRuns}` : 'W')
          : total === 0 ? '0' : String(total);

        if (ns.ballsInOver === 6) {
          ns.overs      += 1;
          ns.ballsInOver = 0;
        }
      }

      ns.ballLog.push(entry);

      // End conditions
      if (ns.runs >= target)         ns.hasWon         = true;
      if (ns.wickets >= maxWickets)  ns.isAllOut       = true;
      if (ns.overs   >= maxOvers)    ns.isOversComplete = true;

      return ns;
    });

    setFlashType(type);
    setTimeout(() => setFlashType(null), 500);
  }, [maxOvers, maxWickets, target]);

  /* ─── Overthrow ─── */
  function handleBallTap(type) {
    const canOverthrow = ['one','two','three','four','six'].includes(type);
    if (canOverthrow) {
      setOverthrowFor({ baseRuns: { one:1,two:2,three:3,four:4,six:6 }[type], ballType: type });
    } else {
      commitBall(type);
    }
  }

  function confirmOverthrow(extra) {
    commitBall(overthrowFor.ballType, extra);
    setOverthrowFor(null);
  }

  function cancelOverthrow() {
    commitBall(overthrowFor.ballType, 0);
    setOverthrowFor(null);
  }

  /* ─── Undo ─── */
  function undoLast() {
    setState(prev => {
      if (!prev.ballLog.length) return prev;
      const log  = [...prev.ballLog];
      const last = log.pop();
      const ns   = { ...prev, ballLog: log };

      ns.runs    -= last.runs;
      ns.isAllOut = false;
      ns.isOversComplete = false;
      ns.hasWon  = false;

      if (last.isExtra) {
        ns.extras -= last.runs;
      } else {
        ns.balls       -= 1;
        ns.ballsInOver -= 1;
        if (ns.ballsInOver < 0) {
          ns.overs      -= 1;
          ns.ballsInOver = 5;
        }
        if (last.type === 'wicket') ns.wickets -= 1;
      }
      return ns;
    });
    setShowUndo(false);
    setShowGameOver(false);
  }

  /* ─── Derived ─── */
  const rr = state.balls > 0
    ? ((state.runs / state.balls) * 6).toFixed(2)
    : '0.00';

  const runsNeeded  = Math.max(0, target - state.runs);
  const ballsLeft   = maxOvers * 6 - state.balls;
  const rrRequired  = ballsLeft > 0
    ? ((runsNeeded / ballsLeft) * 6).toFixed(2)
    : '—';

  const displayOver = state.ballsInOver === 0 && state.overs > 0
    ? state.overs - 1
    : state.overs;
  const thisOverBalls = state.ballLog.filter(b => b.over === displayOver && !b.isExtra);

  const inning1Team = JSON.parse(localStorage.getItem('inning1Team') || localStorage.getItem('team1') || '{}');
  const tossResult  = JSON.parse(localStorage.getItem('tossResult') || '{}');

  /* ─── Result determination ─── */
  function getResult() {
    if (state.hasWon) {
      const wktsLeft = maxWickets - state.wickets;
      return { winner: inning2Team.name, desc: `won by ${wktsLeft} wicket${wktsLeft !== 1 ? 's' : ''}` };
    }
    const diff = team1Score.runs - state.runs;
    return { winner: inning1Team.name, desc: `won by ${diff} run${diff !== 1 ? 's' : ''}` };
  }

  function goToResult() {
    const result = getResult();
    localStorage.setItem('matchResult', JSON.stringify({
      ...result,
      team1: inning1Team.name,
      team2: inning2Team.name,
      team1Score: `${team1Score.runs}/${team1Score.wickets}`,
      team2Score: `${state.runs}/${state.wickets}`,
      team1Overs: overStr(team1Score.overs, team1Score.ballsInOver),
      team2Overs: overStr(state.overs, state.ballsInOver),
    }));
    navigate('/result');
  }

  return (
    <div className="playing-screen">

      {/* Top Bar */}
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="top-bar-center">
          <span className="live-dot" />
          <span className="live-text">LIVE</span>
          <span className="innings-badge">2nd Innings</span>
        </div>
        <div className="top-bar-rr">RR {rr}</div>
      </div>

      {/* Target strip */}
      <div className="target-strip">
        <div className="ts-item">
          <span className="ts-val">{target}</span>
          <span className="ts-label">Target</span>
        </div>
        <div className="ts-divider" />
        <div className="ts-item">
          <span className={`ts-val ${runsNeeded === 0 ? 'green' : 'yellow'}`}>{runsNeeded}</span>
          <span className="ts-label">Need</span>
        </div>
        <div className="ts-divider" />
        <div className="ts-item">
          <span className="ts-val">{ballsLeft}</span>
          <span className="ts-label">Balls</span>
        </div>
        <div className="ts-divider" />
        <div className="ts-item">
          <span className="ts-val req-rr">{rrRequired}</span>
          <span className="ts-label">Req RR</span>
        </div>
      </div>

      {/* Score Card */}
      <div className="score-card">
        <div className="team-name-row">
          <span className="batting-label">🏏 Batting</span>
          <span className="team-name-big">{inning2Team.name || 'Team 2'}</span>
        </div>

        <div className="main-score">
          <span className="score-runs">{state.runs}</span>
          <span className="score-sep">/</span>
          <span className="score-wickets">{state.wickets}</span>
        </div>

        <div className="score-meta">
          <MetaItem val={overStr(state.overs, state.ballsInOver)} label="Overs" />
          <div className="meta-divider" />
          <MetaItem val={maxOvers} label="Total" />
          <div className="meta-divider" />
          <MetaItem val={state.extras} label="Extras" />
          <div className="meta-divider" />
          <MetaItem val={`${inning1Team.name?.slice(0,6) || 'T1'}: ${team1Score.runs}/${team1Score.wickets}`} label="1st Inn" />
        </div>

        {/* This over */}
        <div className="over-balls">
          <span className="over-label">This over</span>
          <div className="balls-row">
            {[0,1,2,3,4,5].map(i => {
              const b = thisOverBalls[i];
              return (
                <div key={i} className={`ball-chip ${b ? chipClass(b.type) : 'empty'}`}>
                  {b ? b.label : ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-section">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill"
            style={{ width: `${Math.min(state.runs / (target) * 100, 100)}%`, background: 'linear-gradient(90deg,#f9a825,#34a853)' }}
          />
        </div>
        <div className="progress-labels">
          <span>{state.runs}</span><span>{target} (target)</span>
        </div>
      </div>

      {/* Scoring Buttons */}
      <div className="scoring-section">
        <div className="scoring-header">
          <span className="scoring-title">Tap to Score</span>
          <button className="undo-btn"
            onClick={() => state.ballLog.length && setShowUndo(true)}
            disabled={!state.ballLog.length}>
            ↩ Undo
          </button>
        </div>

        <div className="scoring-grid">
          {SCORE_BTNS.map(btn => (
            <button key={btn.type}
              className={`score-btn ${btn.cls} ${flashType === btn.type ? 'pressed' : ''}`}
              onClick={() => handleBallTap(btn.type)}
              disabled={state.isAllOut || state.isOversComplete || state.hasWon}>
              {btn.label}
            </button>
          ))}
        </div>

        <div className="extra-btns">
          <button className={`score-btn btn-extra ${flashType === 'wide' ? 'pressed' : ''}`}
            onClick={() => commitBall('wide')}
            disabled={state.isAllOut || state.isOversComplete || state.hasWon}>Wide</button>
          <button className={`score-btn btn-extra ${flashType === 'noball' ? 'pressed' : ''}`}
            onClick={() => commitBall('noball')}
            disabled={state.isAllOut || state.isOversComplete || state.hasWon}>No Ball</button>
        </div>
      </div>

      {/* Overthrow Modal */}
      {overthrowFor && (
        <OverthrowModal baseRuns={overthrowFor.baseRuns}
          onConfirm={confirmOverthrow} onCancel={cancelOverthrow} />
      )}

      {/* Undo Modal */}
      {showUndo && (
        <UndoModal lastBall={state.ballLog[state.ballLog.length - 1]}
          onConfirm={undoLast} onCancel={() => setShowUndo(false)} />
      )}

      {/* Game Over Modal */}
      {showGameOver && (
        <div className="modal-overlay">
          <div className="modal-card innings-over">
            <div className="modal-icon">{state.hasWon ? '🏆' : '🏏'}</div>
            <h2 className="modal-title">Match Over!</h2>

            {/* Mini scorecard */}
            <div className="result-mini-card">
              <div className="rmc-row">
                <span className="rmc-team">{inning1Team.name}</span>
                <span className="rmc-score">{team1Score.runs}/{team1Score.wickets}</span>
                <span className="rmc-overs">({overStr(team1Score.overs, team1Score.ballsInOver)} ov)</span>
              </div>
              <div className="rmc-row">
                <span className="rmc-team">{inning2Team.name}</span>
                <span className="rmc-score">{state.runs}/{state.wickets}</span>
                <span className="rmc-overs">({overStr(state.overs, state.ballsInOver)} ov)</span>
              </div>
            </div>

            <div className="winner-line">
              🎉 {getResult().winner} {getResult().desc}
            </div>

            <button className="btn-primary modal-btn" onClick={goToResult}>
              See Full Result →
            </button>
            <button className="btn-ghost modal-btn-ghost" onClick={() => navigate('/')}>
              New Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const SCORE_BTNS = [
  { type: 'dot',    label: '0',      cls: 'btn-dot'    },
  { type: 'one',    label: '1',      cls: 'btn-run'    },
  { type: 'two',    label: '2',      cls: 'btn-run'    },
  { type: 'three',  label: '3',      cls: 'btn-run'    },
  { type: 'four',   label: '4 ▸',    cls: 'btn-four'   },
  { type: 'six',    label: '6 ▸',    cls: 'btn-six'    },
  { type: 'wicket', label: '🏏 OUT', cls: 'btn-wicket' },
];

function MetaItem({ val, label }) {
  return (
    <div className="meta-item">
      <span className="meta-val" style={{ fontSize: String(val).length > 6 ? 12 : undefined }}>{val}</span>
      <span className="meta-label">{label}</span>
    </div>
  );
}

function chipClass(type) {
  if (type === 'wicket') return 'ball-wicket';
  if (type === 'four')   return 'ball-four';
  if (type === 'six')    return 'ball-six';
  if (type === 'dot')    return 'ball-dot';
  return 'ball-run';
}
