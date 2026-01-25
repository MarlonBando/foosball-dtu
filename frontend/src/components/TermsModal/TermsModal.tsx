import React, { useState } from 'react';
import './TermsModal.css';

interface TermsModalProps {
  onAccept: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ onAccept }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="terms-modal-overlay">
      <div className="terms-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="terms-modal-header">
          <div className="terms-icon">⚖️</div>
          <h2 className="terms-modal-title">Terms & Conditions</h2>
        </div>

        <div className="terms-modal-body">
          <p className="terms-intro">
            Welcome to Foosball DTU! Please read and accept our terms before continuing.
          </p>

          <div className="terms-content-box">
            <div className="terms-item">
              <span className="terms-emoji">🎯</span>
              <span className="terms-text">
                <strong>Purpose</strong>
                This is a fun project created for the DTU community to track foosball matches and rankings.
              </span>
            </div>

            <div className="terms-item">
              <span className="terms-emoji">🔒</span>
              <span className="terms-text">
                <strong>Data Collection</strong>
                We only collect your username, nationality, and game statistics. No personal identifiable information (PII) is required or stored.
              </span>
            </div>

            <div className="terms-item">
              <span className="terms-emoji">🛡️</span>
              <span className="terms-text">
                <strong>Privacy & GDPR</strong>
                Your data is protected and used solely for this application. You can request data deletion at any time by contacting Bando.
              </span>
            </div>

            <div className="terms-item">
              <span className="terms-emoji">🔐</span>
              <span className="terms-text">
                <strong>Account Security</strong>
                Please use a unique password for your account. We recommend not reusing passwords from other services.
              </span>
            </div>

            <div className="terms-item">
              <span className="terms-emoji">⚠️</span>
              <span className="terms-text">
                <strong>Beta Software</strong>
                This application is in beta. You may encounter bugs or unexpected behavior. We appreciate your understanding!
              </span>
            </div>

            <div className="terms-item">
              <span className="terms-emoji">🎓</span>
              <span className="terms-text">
                <strong>DTU Community</strong>
                This service is intended for use by the DTU community. Please be respectful and have fun!
              </span>
            </div>
          </div>

          <div className="terms-checkbox-container">
            <label className="terms-checkbox-label">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="terms-checkbox"
              />
              <span>I have read and agree to the terms and conditions</span>
            </label>
          </div>
        </div>

        <button
          className="terms-modal-button"
          onClick={onAccept}
          disabled={!agreedToTerms}
        >
          {agreedToTerms ? "Let me cook!👨‍🍳 " : "Please accept the terms to continue"}
        </button>
      </div>
    </div>
  );
};

export default TermsModal;
