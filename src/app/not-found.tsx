'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="macos-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        .macos-wrapper {
          position: fixed;
          inset: 0;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
        }
        .macos-dialog {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 0.5px solid rgba(0, 0, 0, 0.15);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
          border-radius: 20px;
          padding: 24px;
          width: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: pop-in 0.2s cubic-bezier(0.25, 1, 0.5, 1);
        }
        @keyframes pop-in {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .app-icon {
          width: 52px;
          height: 52px;
          background: linear-gradient(180deg, #5AC8FA 0%, #007AFF 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .title {
          color: #1d1d1f;
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 4px;
          letter-spacing: -0.2px;
        }
        .desc {
          color: #86868b;
          font-size: 12px;
          line-height: 1.4;
          margin-bottom: 20px;
          padding: 0 10px;
        }
        .action-area {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .btn-blue {
          background: #007AFF;
          color: white;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 0;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .btn-blue:hover { background: #0063D1; }
        .btn-gray {
          background: rgba(0, 0, 0, 0.05);
          color: #1d1d1f;
          font-size: 13px;
          font-weight: 500;
          padding: 8px 0;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-gray:hover { background: rgba(0, 0, 0, 0.1); }
      `}} />

      <div className="macos-dialog">
        <div className="app-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>

        <h1 className="title">Page Not Found</h1>
        
        <p className="desc">
          You might have followed a broken link or the page has been moved.
        </p>

        <div className="action-area">
          <Link href="/" className="btn-blue">
            Back To Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-gray">
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}