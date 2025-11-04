import React from 'react';
import './BetaWarningModal.css';

interface BetaWarningModalProps {
  onClose: () => void;
}

const BetaWarningModal: React.FC<BetaWarningModalProps> = ({ onClose }) => {
  return (
    <div className="beta-modal-overlay" onClick={onClose}>
      <div className="beta-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="beta-modal-header">
          <div className="beta-icon">🛡️✨</div>
          <h2 className="beta-modal-title">Welcome to Beta! 🎉</h2>
        </div>

        <div className="beta-modal-body">
          <p className="beta-intro">
            Hey there! This is a beta. That means that you will find bugs and things will not work sometimes! Morevore there might be safety vulnerabilities so read carefully below!
          </p>

          <div className="beta-warning-box">
            <div className="warning-item">
              <span className="warning-emoji">🔐</span>
              <span className="warning-text">
                <strong>Safety first!</strong> Please use a unique password you don't use elsewhere
              </span>
            </div>

            <div className="warning-item">
              <span className="warning-emoji">📧</span>
              <span className="warning-text">
                <strong>Fake email?</strong> No problem! You can use a temporary email if you prefer
              </span>
            </div>

            <div className="warning-item">
              <span className="warning-emoji">💚</span>
              <span className="warning-text">
                <strong>We protect your data</strong>, but being extra cautious never hurts!
              </span>
            </div>
          </div>

          <p className="beta-footer-text">
            This is a beta version, so things might change. Your understanding means the world to us! 🌟
          </p>
        </div>

        <button className="beta-modal-button" onClick={onClose}>
          Got it! Let me cook!🧑‍🍳
        </button>
      </div>
    </div>
  );
};

export default BetaWarningModal;
