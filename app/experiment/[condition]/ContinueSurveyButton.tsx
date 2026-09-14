"use client";

import { useState } from "react";

export default function ContinueSurveyButton() {
  const [message, setMessage] = useState("");

  const handleContinue = () => {
    setMessage("Returning to survey...");

    if (document.referrer) {
      window.location.href = document.referrer;
      return;
    }

    if (window.history.length > 1) {
      window.history.go(-1);
      return;
    }

    setMessage("Please use your browser Back button to return to the survey.");
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleContinue}
        className="w-full rounded-xl bg-slate-900 px-5 py-4 font-medium text-white"
      >
        Continue survey
      </button>

      {message && (
        <p className="mt-3 text-center text-sm text-slate-600">
          {message}
        </p>
      )}
    </div>
  );
}
