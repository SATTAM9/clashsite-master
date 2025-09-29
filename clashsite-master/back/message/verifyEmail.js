const verifyEmailTemplate = (userName, verifyLink) => `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>Confirm your email</title>
    <style>
      body { font-family: Arial, sans-serif; background:#f6f8fb; margin:0; padding:20px; }
      .card { max-width:600px; margin:30px auto; background:#fff; padding:24px; border-radius:10px; box-shadow:0 6px 18px rgba(0,0,0,0.06); color:#0b1220; }
      .btn { display:inline-block; padding:12px 22px; border-radius:8px; background:#2563eb; color:#fff; text-decoration:none; font-weight:700; }
      .muted { color:#6b7280; font-size:14px; }
      .code { background:#f1f5f9; padding:10px; border-radius:6px; font-family:monospace; display:block; word-break:break-all }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>Confirm your email</h2>
      <p>Hi ${userName || "user"},</p>
      <p>Click the button below to confirm your email address:</p>
      <p style="text-align:center; margin:24px 0;">
        <a class="btn" href="${verifyLink}">Confirm Email</a>
      </p>
      <p class="muted">If you didn't create a clashvip account, you can safely ignore this email.</p>
    </div>
  </body>
  </html>
`;

module.exports = { verifyEmailTemplate };
