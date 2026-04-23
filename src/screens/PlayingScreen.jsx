import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayingScreen.css';

/* ─── helpers ─── */
function overStr(overs, ballsInOver) {
  return `${overs}.${ballsInOver}`;
}

function initState() {
  return {
    runs: 0, wickets: 0,
    balls: 0,          // legal balls
    overs: 0,          // completed overs
    ballsInOver: 0,    // 0-5
    extras: 0,
    ballLog: [],
    isAllOut: false,
    isOversComplete: false,
  };
}

/* ─── Overthrow modal ─── */
function OverthrowModal({ baseRuns, onConfirm, onCancel }) {
  const [extra, setExtra] = useState(0);
  const options = [1, 2, 3, 4];
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card ot-modal" onClick={e => e.stopPropagation()}>
        <div className="ot-header">
          <span className="ot-icon">🔄</span>
          <h3>Extra Run?</h3>
          <p>Base: <strong>{baseRuns}</strong> runs. Add Extra or Any Penalty runs:</p>
        </div>
        <div className="ot-options">
          {options.map(n => (
            <button
              key={n}
              className={`ot-btn ${extra === n ? 'selected' : ''}`}
              onClick={() => setExtra(n)}
            >+{n}</button>
          ))}
        </div>
        <div className="ot-total">
          Total: <strong>{baseRuns + extra}</strong> runs
        </div>
        <div className="ot-actions">
          <button className="btn-ghost ot-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-primary ot-confirm" onClick={() => onConfirm(extra)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Undo confirmation ─── */
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

/* ─── Main Component ─── */
export default function PlayingScreen() {
  const navigate = useNavigate();

  const inning1Team = JSON.parse(localStorage.getItem('inning1Team') || localStorage.getItem('team1') || '{}');
  const maxOvers    = parseInt(inning1Team.overs) || 5;
  const maxWickets  = Math.max(1, parseInt(inning1Team.players) - 1) || 10;

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('team1Score');
    return saved ? JSON.parse(saved) : initState();
  });

  const [showGameOver, setShowGameOver]     = useState(false);
  const [flashType, setFlashType]           = useState(null);
  const [overthrowFor, setOverthrowFor]     = useState(null); // {baseRuns, ballType}
  const [showUndo, setShowUndo]             = useState(false);

  // persist
  useEffect(() => {
    localStorage.setItem('team1Score', JSON.stringify(state));
  }, [state]);

  // game over check
  useEffect(() => {
    if ((state.isAllOut || state.isOversComplete) && !showGameOver) {
      setTimeout(() => setShowGameOver(true), 400);
    }
  }, [state.isAllOut, state.isOversComplete]);

  /* ─── Core ball logic ─── */
  const commitBall = useCallback((type, extraRuns = 0) => {
    setState(prev => {
      if (prev.isAllOut || prev.isOversComplete) return prev;

      const ns = { ...prev, ballLog: [...prev.ballLog] };
      let entry = { type, over: prev.overs, ballInOver: prev.ballsInOver };

      const isExtra = type === 'wide' || type === 'noball';

      if (isExtra) {
        const total = 1 + extraRuns;
        ns.runs    += total;
        ns.extras  += total;
        entry.runs  = total;
        entry.label = (type === 'wide' ? 'Wd' : 'Nb') + (extraRuns ? `+${extraRuns}` : '');
        entry.isExtra = true;
        // no ball count change for wide/noball
      } else {
        const baseMap = { dot: 0, one: 1, two: 2, three: 3, four: 4, six: 6, wicket: 0 };
        const base = baseMap[type] ?? 0;
        const total = base + extraRuns;

        ns.runs        += total;
        ns.ballsInOver += 1;
        ns.balls       += 1;

        if (type === 'wicket') ns.wickets += 1;

        entry.runs  = total;
        entry.label = type === 'wicket'
          ? (extraRuns ? `W+${extraRuns}` : 'W')
          : total === 0 ? '0'
          : String(total);

        // over complete
        if (ns.ballsInOver === 6) {
          ns.overs      += 1;
          ns.ballsInOver = 0;
        }
      }

      ns.ballLog.push(entry);

      if (ns.wickets >= maxWickets)  ns.isAllOut       = true;
      if (ns.overs   >= maxOvers)    ns.isOversComplete = true;

      return ns;
    });

    setFlashType(type);
    setTimeout(() => setFlashType(null), 500);
  }, [maxOvers, maxWickets]);

  /* ─── Overthrow flow ─── */
  function handleBallTap(type) {
    // 1, 2, 3, 4 can have overthrow; 6 can too (rare but possible)
    const canOverthrow = ['one','two','three','four','six'].includes(type);
    if (canOverthrow) {
      setOverthrowFor({ baseRuns: { one:1,two:2,three:3,four:4,six:6 }[type], ballType: type });
    } else {
      commitBall(type);
    }
  }

  function confirmOverthrow(extraRuns) {
    commitBall(overthrowFor.ballType, extraRuns);
    setOverthrowFor(null);
  }

  function cancelOverthrow() {
    // commit without overthrow
    commitBall(overthrowFor.ballType, 0);
    setOverthrowFor(null);
  }

  /* ─── Undo last ball ─── */
  function undoLast() {
    setState(prev => {
      if (!prev.ballLog.length) return prev;
      const log = [...prev.ballLog];
      const last = log.pop();

      const ns = { ...prev, ballLog: log };
      ns.runs     -= last.runs;
      ns.isAllOut  = false;
      ns.isOversComplete = false;

      if (last.isExtra) {
        ns.extras -= last.runs;
      } else {
        ns.balls       -= 1;
        ns.ballsInOver -= 1;

        if (ns.ballsInOver < 0) {
          // was first ball of an over — go back to previous over
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

  const ballsLeft = maxOvers * 6 - state.balls;

  // balls in current over (legal only, for display)
  // When over is complete (ballsInOver===0 and overs>0), show the last completed over
  const displayOver = state.ballsInOver === 0 && state.overs > 0
    ? state.overs - 1
    : state.overs;
  const thisOverBalls = state.ballLog.filter(
    b => b.over === displayOver && !b.isExtra
  );

  const tossResult = JSON.parse(localStorage.getItem('tossResult') || '{}');

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
          <span className="innings-badge">1st Innings</span>
        </div>
        <div className="top-bar-rr">RR {rr}</div>
      </div>

      {/* Toss info strip */}
      {tossResult.tossWinner && (
        <div className="toss-strip">
          🪙 {tossResult.tossWinner} won toss · {tossResult.battingFirst} batting
        </div>
      )}

      {/* Score Card */}
      <div className="score-card">
        <div className="team-name-row">
          <span className="batting-label">🏏 Batting</span>
          <span className="team-name-big">{inning1Team.name || 'Team 1'}</span>
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
          <MetaItem val={ballsLeft} label="Left" />
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
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min((state.overs * 6 + state.ballsInOver) / (maxOvers * 6) * 100, 100)}%` }}
          />
        </div>
        <div className="progress-labels">
          <span>0</span><span>{maxOvers} overs</span>
        </div>
      </div>

      {/* Scoring Buttons */}
      <div className="scoring-section">
        <div className="scoring-header">
          <span className="scoring-title">Tap to Score</span>
          <button
            className="undo-btn"
            onClick={() => state.ballLog.length && setShowUndo(true)}
            disabled={!state.ballLog.length}
          >
            ↩ Undo
          </button>
        </div>

        <div className="scoring-grid">
          {SCORE_BTNS.map(btn => (
            <button
              key={btn.type}
              className={`score-btn ${btn.cls} ${flashType === btn.type ? 'pressed' : ''}`}
              onClick={() => handleBallTap(btn.type)}
              disabled={state.isAllOut || state.isOversComplete}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="extra-btns">
          <button
            className={`score-btn btn-extra ${flashType === 'wide' ? 'pressed' : ''}`}
            onClick={() => commitBall('wide')}
            disabled={state.isAllOut || state.isOversComplete}
          >Wide</button>
          <button
            className={`score-btn btn-extra ${flashType === 'noball' ? 'pressed' : ''}`}
            onClick={() => commitBall('noball')}
            disabled={state.isAllOut || state.isOversComplete}
          >No Ball</button>
        </div>
      </div>

      {/* Overthrow Modal */}
      {overthrowFor && (
        <OverthrowModal
          baseRuns={overthrowFor.baseRuns}
          onConfirm={confirmOverthrow}
          onCancel={cancelOverthrow}
        />
      )}

      {/* Undo Modal */}
      {showUndo && (
        <UndoModal
          lastBall={state.ballLog[state.ballLog.length - 1]}
          onConfirm={undoLast}
          onCancel={() => setShowUndo(false)}
        />
      )}

      {/* Game Over Modal */}
      {showGameOver && (
        <div className="modal-overlay">
          <div className="modal-card innings-over">
            <div className="modal-icon">🏏</div>
            <h2 className="modal-title">Innings Over!</h2>
            <div className="modal-team">{inning1Team.name}</div>
            <div className="modal-score">{state.runs}/{state.wickets}</div>
            <div className="modal-meta">
              {overStr(state.overs, state.ballsInOver)} overs · RR {rr}
            </div>
            {state.isAllOut && <div className="modal-reason">All Out</div>}
            {state.isOversComplete && !state.isAllOut && (
              <div className="modal-reason">Overs Complete</div>
            )}
            <button className="btn-primary modal-btn" onClick={() => navigate('/team2')}>
              2nd Innings →
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

/* ─── Score button config ─── */
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
      <span className="meta-val">{val}</span>
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
