import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with size limits for import/export
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Initialize Google Gen AI
  // Falls back gracefully if no key is supplied to avoid server crash
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
      console.log("Gemini API successfully initialized on server.");
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI client:", err);
    }
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not configured or uses a placeholder. AI features will fallback to client-side automated generation.");
  }

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      aiEnabled: !!ai,
      message: "ANJAB-ABK Backend is running smoothly."
    });
  });

  // Intellegent ANJAB generation route based on PermenPAN No 1 Tahun 2020
  app.post("/api/generate-anjab", async (req, res) => {
    const { namaJabatan, unitKerja } = req.body;
    if (!namaJabatan) {
      return res.status(400).json({ error: "Nama jabatan wajib diisi." });
    }

    if (!ai) {
      return res.status(200).json({
        isPlaceholder: true,
        error: "Fitur AI membutuhkan GEMINI_API_KEY yang valid. Gunakan templat standar.",
        message: "Gemini API key not configured."
      });
    }

    try {
      const prompt = `Anda adalah konsultan profesional untuk kepegawaian Aparatur Sipil Negara (ASN) di lingkungan Pemerintah Indonesia.
Buatlah data Analisis Jabatan (ANJAB) terstruktur sesuai Peraturan Menteri Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PermenPAN-RB) Nomor 1 Tahun 2020.

INFORMASI JABATAN:
Nama Jabatan: "${namaJabatan}"
Unit Kerja: "${unitKerja || 'Instansi Pemerintah'}"

Persyaratan respon JSON:
Kembalikan data harus berupa objek JSON VALID utuh dan TANPA teks penjelasan pembuat, gunakan persis struktur kunci di bawah ini (Bahasa Indonesia):
{
  "iktisar": "Deskripsi singkat ikhtisar jabatan dalam 2-3 kalimat aktif yang merangkum tugas pokok jabatan.",
  "kelasJabatan": 7, // Estimasi level kelas jabatan (bisa berkisar antara 5 s.d 15)
  "kualifikasi": {
    "pendidikanMinimal": "S1 (Strata-1) / D4 (Diploma-IV)",
    "jurusan": ["Ilmu Komputer", "Sistem Informasi", "Teknik Informatika"], // contoh jurusan relevan minimal 3
    "pelatihan": "Diklat Teknis bidang terkait atau Diklat Kepemimpinan jika relevan",
    "pengalaman": "Minimal 1-2 tahun di bidang relevan"
  },
  "uraianTugas": [
    {
      "uraian": "Mengumpulkan materi dan data penyusunan program kerja instansi sesuai instruksi atasan",
      "hasilKerja": "Dokumen", // Satuan: Dokumen, Laporan, Kegiatan, data, dsb.
      "waktuPenyelesaian": 120 // Estimasi waktu penyelesaian rata-rata PER SATUAN hasil kerja dalam menit (integer sehat, misal 60 s.d 240)
    },
    {
      "uraian": "Menganalisis data teknis operasional untuk penyusunan laporan evaluasi unit kerja",
      "hasilKerja": "Laporan",
      "waktuPenyelesaian": 180
    }
    // Sertakan 4 hingga 6 butir uraian tugas pokok fungsional/teknis yang spesifik dan realistis untuk jabatan ini
  ],
  "syaratJabatan": {
    "pangkatGolongan": "Penata Muda, III/a",
    "bakatKerja": ["G (Inteligensia)", "V (Bakat Verbal)", "Q (Ketelitian)"],
    "temperamenKerja": ["R (Repetitive and Continuous)", "T (Set of Limits/Tolerance)"],
    "minatKerja": ["Konvensional", "Investigatif", "Realistik"],
    "upayaFisik": ["Duduk", "Berbicara", "Melihat"],
    "kondisiFisik": "Sehat fisik dan mental, mampu bekerja dengan laptop dalam jangka waktu lama."
  }
}

Hasilkan data JSON di atas seakurat mungkin, sesuaikan dengan nomenklatur standar jabatan fungsional atau pelaksana ASN saat ini di Indonesia.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.15,
        }
      });

      const responseText = response.text || "{}";
      const cleanedText = responseText.replace(/```json\s?/g, "").replace(/```\s?/g, "").trim();
      const jobData = JSON.parse(cleanedText);

      return res.json(jobData);

    } catch (apiError: any) {
      console.error("Gemini Generation Error:", apiError);
      return res.status(500).json({
        error: "Gagal memproses pembuatan ANJAB menggunakan AI.",
        details: apiError.message || apiError
      });
    }
  });

  // Integrate Vite for dev mode, or express static files in production
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development server middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production built files from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ANJAB-ABK application server is running successfully on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("FATA L: Server failed to start:", error);
});
