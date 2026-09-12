"use client";

export default function ContinueSurveyButton() {
  const returnToSurvey = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    if (document.referrer) {
      window.location.href = document.referrer;
    }
  };

  return (
    <button
      type="button"
      onClick={returnToSurvey}
      className="w-full rounded-xl bg-slate-900 px-5 py-4 font-medium text-white"
    >
      Continue survey
    </button>
  );
}
