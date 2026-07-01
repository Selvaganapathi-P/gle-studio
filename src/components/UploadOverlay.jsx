import React from 'react';

/**
 * UploadOverlay
 * ─────────────────────────────────────────────────────────────
 * Renders a full-screen luxury loading overlay while an upload
 * is in progress. Mount it conditionally:
 *
 *   {uploading && <UploadOverlay />}
 *
 * The animated gold ring + progress bar give visual feedback
 * during the 4-5 second Supabase upload window.
 */
export default function UploadOverlay({ message = 'Uploading…', sub = 'Please wait' }) {
  return (
    <div className="upload-overlay" role="status" aria-live="polite" aria-label={message}>
      <div className="upload-spinner" />
      <div className="upload-overlay-title">{message}</div>
      <div className="upload-progress-bar">
        <div className="upload-progress-fill" />
      </div>
      <div className="upload-overlay-sub">{sub}</div>
    </div>
  );
}