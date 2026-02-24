export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "No URL provided" });
    }

    // Simple AI phishing simulation
    const suspiciousWords = ["login", "verify", "bank", "free", "crypto"];

    const isPhishing = suspiciousWords.some(word =>
      url.toLowerCase().includes(word)
    );

    res.json({
      unsafe: isPhishing,
      matches: isPhishing ? ["SOCIAL_ENGINEERING"] : [],
      source: "vercel-simulated"
    });

  } catch (err) {
    res.status(500).json({ error: "Phishing check failed" });
  }
}