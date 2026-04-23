import React from 'react';
import './SplashScreen.css';

export default function SplashScreen() {
  return (
    <div className="splash">
      <div className="splash-content">
        <div className="splash-ball">
          <div className="ball-seam seam1"></div>
          <div className="ball-seam seam2"></div>
        </div>
        <h1 className="splash-title">CricScore</h1>
        <p className="splash-sub">Live Cricket Scorer</p>
        <div className="splash-loader">
          <div className="loader-bar"></div>
        </div>
      </div>
    </div>
  );
}
