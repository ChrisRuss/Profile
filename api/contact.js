export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { name, email, message, company } = req.body || {};
    if (company) return res.status(200).json({ message: 'OK' });
    if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' });

    const API_KEY = process.env.RESEND_API_KEY;
    const TO = process.env.RESEND_TO;
    const FROM = process.env.RESEND_USE_ONBOARDING === '1'
      ? 'onboarding@resend.dev'
      : (process.env.RESEND_FROM || 'website@christianruss.ai');

    if (!API_KEY) return res.status(500).json({ message: 'Email service not configured: RESEND_API_KEY missing' });
    if (!TO) return res.status(500).json({ message: 'Email service not configured: RESEND_TO missing' });

    const payload = {
      from: FROM,
      to: [TO],
      subject: 'New website inquiry',
      html: `<h2>New inquiry from christianruss.ai</h2>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br/>${(message||'').replace(/\n/g,'<br/>')}</p>`,
      reply_to: email
    };

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await resp.text();
    if (!resp.ok) {
      let details = text; try { details = JSON.parse(text); } catch {}
      console.error('Resend error:', resp.status, details);
      const msg = (details && details.error && details.error.message) ? details.error.message
                : (details && details.message) ? details.message
                : 'Email service error';
      return res.status(502).json({ message: msg, status: resp.status });
    }
    return res.status(200).json({ message: 'Danke! Ihre Nachricht wurde versendet.' });
  } catch (e) {
    console.error('Handler error:', e);
    return res.status(500).json({ message: 'Internal error' });
  }
}
