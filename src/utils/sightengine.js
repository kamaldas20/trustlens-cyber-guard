export async function detectAIImage(file) {
  const form = new FormData();
  form.append("media", file);
  form.append("models", "genai"); // AI detection model
  form.append("api_user", "1379819895");
  form.append("api_secret", "RdTu75gsg5MYbkDsKb3aucizTywXfgr6");

  const res = await fetch("https://api.sightengine.com/1.0/check.json", {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  console.log("Sightengine response:", data);
  return data;
}