export const checkPhishingLink = async (url) => {
  const res = await fetch("/api/check-phishing", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) throw new Error("Phishing API failed");

  return res.json();
};