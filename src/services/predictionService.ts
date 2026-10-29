import { apiRequest } from "./apiClient";
import { MaterialPrediction, Subject } from "../types";

export function adaptBackendPrediction(raw: any, subjectFallback?: Subject): MaterialPrediction {
  const subjectName = raw.subject?.name || subjectFallback?.name || "Mata Pelajaran";
  const subjectColor = raw.subject?.color || subjectFallback?.color || "#0062FF";

  let prereqs: string[] = [];
  if (Array.isArray(raw.prerequisites)) {
    prereqs = raw.prerequisites;
  } else if (typeof raw.prerequisites === "string" && raw.prerequisites.trim()) {
    prereqs = raw.prerequisites.split(",").map((s: string) => s.trim()).filter(Boolean);
  }

  return {
    id: String(raw.id),
    subject: subjectName,
    subjectColor,
    predictedTopic: raw.predicted_material || raw.predicted_topic || "Materi Baru",
    confidence: Math.round(raw.confidence || 75),
    reason: raw.reason || "Dianalisis dari riwayat materi dan kurikulum sekolah.",
    prerequisites: prereqs.length > 0 ? prereqs : [`Prasyarat dasar ${subjectName}`],
    preparationTips: raw.preparation_suggestion || raw.preparation || `Pelajari kembali ringkasan ${subjectName} sebelumnya.`,
    userFeedback: raw.user_feedback,
  };
}

export const predictionService = {
  async getPredictionsBySubject(subjectId: string | number, subject?: Subject): Promise<MaterialPrediction[]> {
    try {
      const res = await apiRequest(`/ai/material-predictions/${subjectId}`, { method: "GET" });
      const list = Array.isArray(res) ? res : res?.data || [];
      return list.map((item: any) => adaptBackendPrediction(item, subject));
    } catch {
      return [];
    }
  },

  async getAllPredictions(subjects: Subject[]): Promise<MaterialPrediction[]> {
    if (!subjects || subjects.length === 0) return [];
    try {
      const results = await Promise.all(
        subjects.map((s) => this.getPredictionsBySubject(s.id, s))
      );
      return results.flat();
    } catch {
      return [];
    }
  },

  async generatePrediction(subjectId: string | number, subject?: Subject): Promise<MaterialPrediction | null> {
    try {
      const res = await apiRequest("/ai/material-predictions/generate", {
        method: "POST",
        body: JSON.stringify({ subject_id: Number(subjectId) }),
      });
      return adaptBackendPrediction(res, subject);
    } catch (err) {
      console.warn("Gagal generate prediksi materi:", err);
      return null;
    }
  },

  async submitFeedback(predictionId: string, feedback: "accurate" | "inaccurate"): Promise<void> {
    try {
      await apiRequest(`/ai/material-predictions/${predictionId}/feedback`, {
        method: "POST",
        body: JSON.stringify({ feedback }),
      });
    } catch (err) {
      console.warn("Gagal mengirim feedback prediksi:", err);
    }
  },
};
