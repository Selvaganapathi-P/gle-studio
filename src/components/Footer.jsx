import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">GLE <span>Studio</span></div>
            <div className="footer-tagline">Capturing Your Golden Moments</div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 280 }}>
              Professional photography studio in Tirupattur, Tamil Nadu. Weddings, portraits, events & commercial photography.
            </p>
          </div>
          <div>
            <div className="footer-heading">Quick Links</div>
            {[['Home','/'],[' Services','/services'],['Gallery','/gallery'],['Frames & Prints','/frames'],['Book a Session','/booking']].map(([l,p]) => (
              <button key={p} className="footer-link" onClick={() => navigate(p)}>{l}</button>
            ))}
          </div>
          <div>
            <div className="footer-heading">Services</div>
            {['Wedding Photography','Portrait Sessions','Events Coverage','Commercial Shoots','Pre-Wedding Shoot'].map(s => (
              <span key={s} className="footer-link" onClick={() => navigate('/services')}>{s}</span>
            ))}
          </div>
          <div>
            <div className="footer-heading">Contact</div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 2 }}>
              📍 Golden legacy events, Periyagaram<br />
              Tirupattur 635901<br />
              📞 +91 6382748663<br />
              ✉️ tirupattur.gle2024@gmail.com<br />
              🕐 Mon–Sat: 9AM – 7PM
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} GLE Studio. All rights reserved.</span>
          <span>Made with ❤️ in DS solutions, Tamil Nadu</span>
        </div>
      </div>
    </footer>
  );
}
