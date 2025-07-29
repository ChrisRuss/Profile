export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { name, email, message, company } = req.body || {};
    if (company) return res.status(200).json({ message: 'OK' });
    if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' });
    const html = `<h2>New inquiry from christianruss.ai</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${(message||'').replace(/\n/g,'<br/>')}</p>`;
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'website@christianruss.ai',
        to: [process.env.RESEND_TO || 'info@christianruss.ai'],
        subject: 'New website inquiry',
        html
      })
    });
    if (!resp.ok) return res.status(500).json({ message: 'Email service error' });
    return res.status(200).json({ message: 'Danke! Ihre Nachricht wurde versendet.' });
  } catch (e) { return res.status(500).json({ message: 'Internal error' }); }
};
