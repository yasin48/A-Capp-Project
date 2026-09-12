<button
  onClick={() => {
    window.close();

    setTimeout(() => {
      document.body.innerHTML = `
        <div style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;">
          <h2>Thank you</h2>
          <p>Please return to the survey tab to continue.</p>
        </div>
      `;
    }, 300);
  }}
>
  Continue survey
</button>
