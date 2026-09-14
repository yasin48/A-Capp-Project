"use client";

export default function ContinueSurveyButton() {
  const handleContinue = () => {
    window.history.go(-1);
  };

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
