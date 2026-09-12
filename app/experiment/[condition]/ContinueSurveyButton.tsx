"use client";

import { useState } from "react";

export default function ContinueSurveyButton() {
  const [showMessage, setShowMessage] = useState(false);

  const handleContinue = () => {
    if (window.opener && !window.opener.closed) {
      window.opener.focus();
      window.close();
      setTimeout(() => setShowMessage(true), 250);
      return;
    }

    setShowMessage(true);
  };

  if (showMessage) {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-center">
        <p className="font-medium text-slate-900">Return to your survey</p>
        <p className="mt-1 text-sm text-slate-600">
          Please switch back to the Qualtrics survey tab and click Next to continue.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleContinue}
      className="w-full rounded-xl bg-slate-900 px-5 py-4 font-medium text-white"
    >
      Continue survey
    </button>
  );
}
