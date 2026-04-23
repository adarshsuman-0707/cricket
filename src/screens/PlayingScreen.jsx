import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlayingScreen.css';

/* ─── helpers ─── */
function overStr(o, b) { return `${o}.${b}`; }

function initState() {
  return {
    runs: 0, wickets: 0, balls: 0, overs: 0, ballsInOver: 0,
    extras: 0, ballLog: [],
    isAllOut: false, isOversComplete: false,
    strikerId: null, nonStrikerId: null, bowlerId: null,
  };
}

const DISMISSALS = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Retired Out'];

/* ─── Modals ─── */
// isBowlerSelect=true hone pe batting.out check skip karo
function SelectPlayerModal({ title, players, onSelect, excludeIds = [], isBowlerSelect = false }) {
  const available = players.filter(p =>
    (isBowlerSelect || !p.batting.out) && !excludeIds.includes(p.id)
  );
  return (
    <div className="modal-overlay">
      <div className="modal-card sel-modal">
        <h3 className="sel-title">{title}</h3>
        <div className="sel-list">
          {available.length === 0 && (
            <p style={{ color: '#a0aec0', textAlign: 'center', padding: 16 }}>No players available</p>
          )}
          {available.map(p => (
            <button key={p.id} className="sel-player-btn" onClick={() => onSelect(p.id)}>
              <span className="sel-num">{p.id + 1}</span>
              <span className="sel-name">{p.name}</span>
              {isBowlerSelect
                ? <span className="sel-stats">{p.bowling.overs}.{p.bowling.ballsRem ?? 0}-{p.bowling.runs}-{p.bowling.wickets}</span>
                : <span className="sel-stats">{p.batting.runs} ({p.batting.balls})</span>
              }
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function WicketModal({ batsman, bowler, onConfirm, onCancel }) {
  const [dismissal, setDismissal] = useState('Bowled');
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card ot-modal" onClick={e => e.stopPropagation()}>
        <div className="ot-header">
          <span className="ot-icon">🏏</span>
          <h3>Wicket!</h3>
          <p><strong style={{ color: '#fff' }}>{batsman?.name}</strong> is out</p>
        </div>
        <div className="dismissal-grid">
          {DISMISSALS.map(d => (
            <button key={d} className={`dismissal-btn ${dismissal === d ? 'selected' : ''}`}
              onClick={() => setDismissal(d)}>{d}</button>
          ))}
        </div>
        <div className="ot-actions">
          <button className="btn-ghost ot-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-primary ot-confirm" onClick={() => onConfirm(dismissal)}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function OverthrowModal({ baseRuns, onConfirm, onCancel }) {
  const [extra, setExtra] = useState(0);
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card ot-modal" onClick={e => e.stopPropagation()}>
        <div className="ot-header">
          <span className="ot-icon">🔄</span>
          <h3>Extra Run?</h3>
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

function UndoModal({ lastBall, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card undo-modal" onClick={e => e.stopPropagation()}>
        <span style={{ fontSize: 40 }}>↩️</span>
        <h3>Undo Last Ball?</h3>
        <p style={{ color: '#a0aec0', fontSize: 14 }}>Last: <strong style={{ color: '#fff' }}>{lastBall?.label}</strong></p>
        <div className="ot-actions">
          <button className="btn-ghost ot-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-primary ot-confirm" onClick={onConfirm}>Undo</button>
        </div>
      </div>
    </div>
  );
}

function ExtraRunsModal({ extraType, onConfirm, onCancel }) {
  const [runs, setRuns] = useState(0);
  const label = extraType === 'wide' ? 'Wide' : 'No Ball';
  const icon  = extraType === 'wide' ? '↔️' : '🚫';
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card ot-modal" onClick={e => e.stopPropagation()}>
        <div className="ot-header">
          <span className="ot-icon">{icon}</span>
          <h3>{label}</h3>
          <p>1 penalty run + any extra runs scored:</p>
        </div>
        <div className="ot-options">
          {[0,1,2,3,4].map(n => (
            <button key={n} className={`ot-btn ${runs === n ? 'selected' : ''}`}
              onClick={() => setRuns(n)}>{n === 0 ? '0' : `+${n}`}</button>
          ))}
        </div>
        <div className="ot-total">Total: <strong>{1 + runs}</strong> run{1 + runs !== 1 ? 's' : ''}</div>
        <div className="ot-actions">
          <button className="btn-ghost ot-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-primary ot-confirm" onClick={() => onConfirm(runs)}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function PlayingScreen() {
  const navigate = useNavigate();

  const inning1Team = JSON.parse(localStorage.getItem('inning1Team') || localStorage.getItem('team1') || '{}');
  const maxOvers   = parseInt(inning1Team.overs) || 5;
  const maxWickets = Math.max(1, parseInt(inning1Team.players) - 1) || 10;

  // Players — inning1Team is batting first
  // Figure out which team's players to use
  const team1Raw = JSON.parse(localStorage.getItem('team1') || '{}');
  const isTeam1Batting = inning1Team.name === team1Raw.name;
  const battingPlayersKey = isTeam1Batting ? 'team1Players' : 'team2Players';
  const bowlingPlayersKey = isTeam1Batting ? 'team2Players' : 'team1Players';

  const [battingPlayers, setBattingPlayers] = useState(() =>
    JSON.parse(localStorage.getItem(battingPlayersKey) || '[]')
  );
  const [bowlingPlayers, setBowlingPlayers] = useState(() =>
    JSON.parse(localStorage.getItem(bowlingPlayersKey) || '[]')
  );
  // Ref to always have latest bowlingPlayers in callbacks (avoids stale closure)
  const bowlingPlayersRef = { current: bowlingPlayers };

  function updateBowler(id, updater) {
    setBowlingPlayers(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, bowling: updater(p.bowling) } : p);
      bowlingPlayersRef.current = updated;
      localStorage.setItem(bowlingPlayersKey, JSON.stringify(updated));
      return updated;
    });
  }

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('team1Score');
    return saved ? JSON.parse(saved) : initState();
  });

  const [showGameOver, setShowGameOver] = useState(false);
  const [flashType, setFlashType]       = useState(null);
  const [overthrowFor, setOverthrowFor] = useState(null);
  const [showUndo, setShowUndo]         = useState(false);
  const [extraFor, setExtraFor]         = useState(null); // {type:'wide'|'noball'}

  // Modals for player selection
  const [needStriker, setNeedStriker]       = useState(false);
  const [needNonStriker, setNeedNonStriker] = useState(false);
  const [needBowler, setNeedBowler]         = useState(false);
  const [wicketPending, setWicketPending]   = useState(false); // waiting for dismissal type

  // On mount: if no striker set, ask for opening batsmen + bowler
  useEffect(() => {
    if (state.strikerId === null && battingPlayers.length > 0) {
      setNeedStriker(true);
    }
  }, []);

  // persist state
  useEffect(() => {
    localStorage.setItem('team1Score', JSON.stringify(state));
  }, [state]);

  // game over
  useEffect(() => {
    if ((state.isAllOut || state.isOversComplete) && !showGameOver) {
      setTimeout(() => setShowGameOver(true), 400);
    }
  }, [state.isAllOut, state.isOversComplete]);

  /* ─── Player helpers ─── */
  function getPlayer(players, id) {
    return players.find(p => p.id === id) || null;
  }

  function updateBatter(id, updater) {
    setBattingPlayers(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, batting: updater(p.batting) } : p);
      localStorage.setItem(battingPlayersKey, JSON.stringify(updated));
      return updated;
    });
  }

  // updateBowler defined above with ref

  /* ─── Core ball logic ─── */
  const commitBall = useCallback((type, extraRuns = 0, dismissalType = '') => {
    setState(prev => {
      if (prev.isAllOut || prev.isOversComplete) return prev;

      const ns = { ...prev, ballLog: [...prev.ballLog] };
      const isExtra = type === 'wide' || type === 'noball';
      const entry = {
        type, over: prev.overs, ballInOver: prev.ballsInOver, isExtra,
        batsmanId: prev.strikerId, bowlerId: prev.bowlerId,
      };

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

        if (type === 'wicket') {
          ns.wickets += 1;
          entry.dismissal = dismissalType;
        }

        entry.runs  = total;
        entry.label = type === 'wicket'
          ? (extraRuns ? `W+${extraRuns}` : 'W')
          : total === 0 ? '0'
          : extraRuns > 0 ? `${base}+${extraRuns}`
          : String(total);

        if (ns.ballsInOver === 6) {
          ns.overs      += 1;
          ns.ballsInOver = 0;
        }
      }

      ns.ballLog.push(entry);

      if (ns.wickets >= maxWickets)  ns.isAllOut        = true;
      if (ns.overs   >= maxOvers)    ns.isOversComplete = true;

      return ns;
    });

    setFlashType(type);
    setTimeout(() => setFlashType(null), 500);
  }, [maxOvers, maxWickets]);

  /* ─── Update player stats after ball ─── */
  function applyBallStats(type, extraRuns, strikerId, bowlerId, dismissalType) {
    const isExtra = type === 'wide' || type === 'noball';
    const baseMap = { dot:0, one:1, two:2, three:3, four:4, six:6, wicket:0 };
    const base  = baseMap[type] ?? 0;
    const total = base + extraRuns;

    if (!isExtra && strikerId !== null) {
      updateBatter(strikerId, b => ({
        ...b,
        runs:  b.runs  + total,
        balls: b.balls + 1,
        fours: b.fours + (type === 'four' ? 1 : 0),
        sixes: b.sixes + (type === 'six'  ? 1 : 0),
        out:   type === 'wicket' ? true : b.out,
        outDesc: type === 'wicket' ? `${dismissalType} b ${getPlayer(bowlingPlayers, bowlerId)?.name || ''}` : b.outDesc,
      }));
    }

    if (bowlerId !== null) {
      updateBowler(bowlerId, b => {
        const newBalls = isExtra ? b.balls : b.balls + 1;
        const newOvers = Math.floor(newBalls / 6);
        const remBalls = newBalls % 6;
        return {
          ...b,
          runs:    b.runs    + (isExtra ? 1 + extraRuns : total),
          balls:   newBalls,
          overs:   newOvers,
          ballsRem: remBalls,
          wickets: b.wickets + (type === 'wicket' && dismissalType !== 'Run Out' ? 1 : 0),
        };
      });
    }
  }

  /* ─── Handle ball tap ─── */
  function handleBallTap(type) {
    if (state.strikerId === null) { setNeedStriker(true); return; }
    if (state.bowlerId  === null) { setNeedBowler(true);  return; }

    if (type === 'wicket') {
      setWicketPending(true);
      return;
    }

    const canOverthrow = ['one','two','three','four','six'].includes(type);
    if (canOverthrow) {
      setOverthrowFor({ baseRuns: { one:1,two:2,three:3,four:4,six:6 }[type], ballType: type });
    } else {
      finalizeBall(type, 0, '');
    }
  }

  function finalizeBall(type, extraRuns, dismissalType) {
    const { strikerId, nonStrikerId, bowlerId, ballsInOver, overs } = state;
    applyBallStats(type, extraRuns, strikerId, bowlerId, dismissalType);
    commitBall(type, extraRuns, dismissalType);

    const isExtra = type === 'wide' || type === 'noball';
    const newBallsInOver = isExtra ? ballsInOver : (ballsInOver + 1) % 6;
    const overComplete   = !isExtra && ballsInOver === 5;

    // Rotate strike on odd runs (1,3,5...) for non-extras
    if (!isExtra) {
      const baseMap = { dot:0, one:1, two:2, three:3, four:4, six:6, wicket:0 };
      const base = baseMap[type] ?? 0;
      const total = base + extraRuns;
      const isOdd = total % 2 === 1;

      if (type !== 'wicket' && isOdd) {
        // swap striker and non-striker
        setState(prev => ({ ...prev, strikerId: prev.nonStrikerId, nonStrikerId: prev.strikerId }));
      }
    }

    // Over complete → rotate strike + ask for new bowler
    if (overComplete) {
      setState(prev => ({ ...prev, strikerId: prev.nonStrikerId, nonStrikerId: prev.strikerId }));
      setTimeout(() => setNeedBowler(true), 300);
    }

    // Wicket → ask for new batsman
    if (type === 'wicket') {
      setTimeout(() => setNeedStriker(true), 300);
    }
  }

  function confirmOverthrow(extra) {
    finalizeBall(overthrowFor.ballType, extra, '');
    setOverthrowFor(null);
  }
  function cancelOverthrow() {
    finalizeBall(overthrowFor.ballType, 0, '');
    setOverthrowFor(null);
  }

  function confirmWicket(dismissalType) {
    setWicketPending(false);
    const canOverthrow = false; // wicket + overthrow is rare, skip for simplicity
    finalizeBall('wicket', 0, dismissalType);
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

      if (last.isExtra) {
        ns.extras -= last.runs;
      } else {
        ns.balls       -= 1;
        ns.ballsInOver -= 1;
        if (ns.ballsInOver < 0) { ns.overs -= 1; ns.ballsInOver = 5; }
        if (last.type === 'wicket') ns.wickets -= 1;
      }
      return ns;
    });
    setShowUndo(false);
    setShowGameOver(false);
  }

  /* ─── Derived ─── */
  const rr = state.balls > 0 ? ((state.runs / state.balls) * 6).toFixed(2) : '0.00';
  const ballsLeft = maxOvers * 6 - state.balls;
  const displayOver = state.ballsInOver === 0 && state.overs > 0 ? state.overs - 1 : state.overs;
  // All balls in current over in chronological order (legal + extras together)
  const thisOverAllBalls = state.ballLog.filter(b => b.over === displayOver);
  const tossResult = JSON.parse(localStorage.getItem('tossResult') || '{}');

  const striker    = getPlayer(battingPlayers, state.strikerId);
  const nonStriker = getPlayer(battingPlayers, state.nonStrikerId);
  const bowler     = getPlayer(bowlingPlayers, state.bowlerId);

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
        <div className="over-balls">
          <span className="over-label">This over</span>
          <div className="balls-row">
            {thisOverAllBalls.map((b, i) => (
              <div key={i} className={`ball-chip ${chipClass(b.type, b.isExtra)}`}>{b.label}</div>
            ))}
            {/* Empty slots to fill up to 6 legal balls */}
            {Array.from({ length: Math.max(0, 6 - thisOverAllBalls.filter(b => !b.isExtra).length) }).map((_, i) => (
              <div key={`empty-${i}`} className="ball-chip empty" />
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-section">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill"
            style={{ width: `${Math.min((state.overs * 6 + state.ballsInOver) / (maxOvers * 6) * 100, 100)}%` }} />
        </div>
        <div className="progress-labels"><span>0</span><span>{maxOvers} overs</span></div>
      </div>

      {/* Live Batsmen & Bowler */}
      {battingPlayers.length > 0 && (
        <div className="live-players">
          <div className="lp-batting">
            <div className="lp-label">🏏 Batting</div>
            <div className="lp-row striker">
              <span className="lp-name">{striker?.name || '—'} <span className="strike-marker">*</span></span>
              <span className="lp-stat">{striker?.batting.runs ?? '—'} ({striker?.batting.balls ?? '—'})</span>
            </div>
            <div className="lp-row">
              <span className="lp-name">{nonStriker?.name || '—'}</span>
              <span className="lp-stat">{nonStriker?.batting.runs ?? '—'} ({nonStriker?.batting.balls ?? '—'})</span>
            </div>
          </div>
          <div className="lp-divider" />
          <div className="lp-bowling">
            <div className="lp-label">⚾ Bowling</div>
            <div className="lp-row">
              <span className="lp-name">{bowler?.name || '—'}</span>
              <span className="lp-stat">
                {bowler ? `${bowler.bowling.overs}.${bowler.bowling.ballsRem ?? 0}-${bowler.bowling.runs}-${bowler.bowling.wickets}` : '—'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scoring Buttons */}
      <div className="scoring-section">
        <div className="scoring-header">
          <span className="scoring-title">Tap to Score</span>
          <button className="undo-btn" onClick={() => state.ballLog.length && setShowUndo(true)} disabled={!state.ballLog.length}>
            ↩ Undo
          </button>
        </div>
        <div className="scoring-grid">
          {SCORE_BTNS.map(btn => (
            <button key={btn.type}
              className={`score-btn ${btn.cls} ${flashType === btn.type ? 'pressed' : ''}`}
              onClick={() => handleBallTap(btn.type)}
              disabled={state.isAllOut || state.isOversComplete}>
              {btn.label}
            </button>
          ))}
        </div>
        <div className="extra-btns">
          <button className={`score-btn btn-extra ${flashType === 'wide' ? 'pressed' : ''}`}
            onClick={() => setExtraFor({ type: 'wide' })}
            disabled={state.isAllOut || state.isOversComplete}>Wide</button>
          <button className={`score-btn btn-extra ${flashType === 'noball' ? 'pressed' : ''}`}
            onClick={() => setExtraFor({ type: 'noball' })}
            disabled={state.isAllOut || state.isOversComplete}>No Ball</button>
        </div>
      </div>

      {/* Modals */}
      {needStriker && !needNonStriker && (
        <SelectPlayerModal
          title={state.nonStrikerId === null ? 'Select Opening Striker' : 'Select New Batsman'}
          players={battingPlayers}
          excludeIds={state.nonStrikerId !== null ? [state.nonStrikerId] : []}
          onSelect={id => {
            setState(prev => ({ ...prev, strikerId: id }));
            setNeedStriker(false);
            if (state.nonStrikerId === null) setNeedNonStriker(true);
            else if (state.bowlerId === null) setNeedBowler(true);
          }}
        />
      )}

      {needNonStriker && (
        <SelectPlayerModal
          title="Select Non-Striker"
          players={battingPlayers}
          excludeIds={[state.strikerId]}
          onSelect={id => {
            setState(prev => ({ ...prev, nonStrikerId: id }));
            setNeedNonStriker(false);
            setNeedBowler(true);
          }}
        />
      )}

      {needBowler && (
        <SelectPlayerModal
          title="Select Bowler"
          players={bowlingPlayers}
          excludeIds={[]}
          isBowlerSelect={true}
          onSelect={id => {
            setState(prev => ({ ...prev, bowlerId: id }));
            setNeedBowler(false);
          }}
        />
      )}

      {wicketPending && (
        <WicketModal
          batsman={striker}
          bowler={bowler}
          onConfirm={confirmWicket}
          onCancel={() => setWicketPending(false)}
        />
      )}

      {overthrowFor && (
        <OverthrowModal baseRuns={overthrowFor.baseRuns} onConfirm={confirmOverthrow} onCancel={cancelOverthrow} />
      )}

      {extraFor && (
        <ExtraRunsModal
          extraType={extraFor.type}
          onConfirm={extraRuns => { finalizeBall(extraFor.type, extraRuns, ''); setExtraFor(null); }}
          onCancel={() => { finalizeBall(extraFor.type, 0, ''); setExtraFor(null); }}
        />
      )}

      {showUndo && (
        <UndoModal lastBall={state.ballLog[state.ballLog.length - 1]} onConfirm={undoLast} onCancel={() => setShowUndo(false)} />
      )}

      {/* Game Over Modal */}
      {showGameOver && (
        <div className="modal-overlay">
          <div className="modal-card innings-over">
            <div className="modal-icon">🏏</div>
            <h2 className="modal-title">Innings Over!</h2>
            <div className="modal-team">{inning1Team.name}</div>
            <div className="modal-score">{state.runs}/{state.wickets}</div>
            <div className="modal-meta">{overStr(state.overs, state.ballsInOver)} overs · RR {rr}</div>
            {state.isAllOut && <div className="modal-reason">All Out</div>}
            {state.isOversComplete && !state.isAllOut && <div className="modal-reason">Overs Complete</div>}
            <button className="btn-primary modal-btn" onClick={() => navigate('/team2')}>2nd Innings →</button>
            <button className="btn-ghost modal-btn-ghost" onClick={() => navigate('/')}>New Match</button>
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
      <span className="meta-val">{val}</span>
      <span className="meta-label">{label}</span>
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
