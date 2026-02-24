export const detectVoiceAI = async (file) => {
  const formData = new FormData();
  formData.append("audio", file);

  const response = await fetch("/api/detect-voice", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Detection failed");

  return await response.json();
};