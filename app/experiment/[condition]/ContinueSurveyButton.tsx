"use client";

import { useState } from "react";

export default function ContinueSurveyButton() {
  const [finished, setFinished] = useState(false);

  if (finished) {
    return (
      <div style={{ textAlign: "center", padding: "24px" }}>
        <h2>Thank you</h2>
        <p>
          Please return to the survey tab in your browser to continue
          the questionnaire.
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setFinished(true)}
      className="w-full rounded-lg bg-black px-6 py-3 text-white"
    >
      Continue survey
    </button>
  );
}
