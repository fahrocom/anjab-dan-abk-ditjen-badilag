import React, { useState } from "react";
import { 
  Building2, 
  Award, 
  KeyRound, 
  Mail, 
  Users, 
  ArrowRight, 
  Cloud, 
  BookmarkCheck, 
  AlertCircle,
  Clock,
  Briefcase,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Scale
} from "lucide-react";
import { auth, saveUserData } from "../lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously
} from "firebase/auth";

interface LoginFrontpageProps {
  onLoginSuccess: (uid: string, email: string | null) => void;
  syncStatus: "connecting" | "idle" | "syncing" | "synced" | "error";
  systemName: string;
}

export default function LoginFrontpage({ onLoginSuccess, syncStatus, systemName }: LoginFrontpageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [namaInstansi, setNamaInstansi] = useState("");
  const [kelasPengadilan, setKelasPengadilan] = useState<"IA Khusus" | "IA" | "IB" | "II">("IA");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(userCredential.user.uid, userCredential.user.email);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErrorMsg("Email atau Password salah. Silakan coba lagi.");
      } else {
        setErrorMsg(err.message || "Gagal masuk. Periksa jaringan Anda.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (!namaInstansi.trim()) {
      setErrorMsg("Nama instansi wajib diisi.");
      setIsLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg("Password harus minimal 8 karakter, mengandung setidaknya satu huruf dan satu angka.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Initialize fresh settings for the registered court profile
      await saveUserData(userCredential.user.uid, {
        settings: {
          wkeTahunan: 1250, // Standard MA-RI
          namaInstansi: namaInstansi,
          alamat: "Alamat satuan kerja belum diisi.",
          kelasPengadilan: kelasPengadilan
        },
        unitKerja: [
          {
            id: "unit-pimpinan-new",
            nama: "Pimpinan / Ketua Satuan Kerja",
            kode: "PIM-01",
            kepalaNama: "Nama Pimpinan Satker",
            kepalaNip: "19700101 200001 1 001"
          }
        ],
        jabatan: [],
        jenisPerkaraList: [],
        dataPerkaraList: []
      });

      onLoginSuccess(userCredential.user.uid, userCredential.user.email);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setErrorMsg("Email sudah terdaftar. Silakan gunakan email lain.");
      } else if (err.code === "auth/weak-password") {
        setErrorMsg("Password terlalu lemah. Minimal 6 karakter.");
      } else {
        setErrorMsg(err.message || "Gagal mendaftar. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const userCredential = await signInAnonymously(auth);
      onLoginSuccess(userCredential.user.uid, null);
    } catch (err: any) {
      console.warn("Auth anonymous failed/restricted, using fallback client ID:", err);
      // Construct local fallback identifier if guest auth has restrictions
      let storedLocalUid = localStorage.getItem("sim_anjab_abk_local_uid");
      if (!storedLocalUid) {
        storedLocalUid = "client-" + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("sim_anjab_abk_local_uid", storedLocalUid);
      }
      onLoginSuccess(storedLocalUid, null);
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("admin123");
    setIsRegistering(false);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.18),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(51,65,85,0.12),transparent_40%)] pointer-events-none" />

      {/* Header Splash Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/40 relative z-10 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-sm flex items-center justify-center font-black text-white text-lg tracking-wider shadow-lg shadow-blue-950/40">
              RI
            </div>
            <div>
              <h1 className="font-sans font-black text-sm sm:text-base tracking-tight text-white leading-none">
                {systemName}
              </h1>
              <span className="text-[9px] sm:text-[10px] text-blue-400 font-extrabold tracking-widest uppercase mt-1 block">
                BADAN PERADILAN AGAMA • MAHKAMAH AGUNG RI
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">
              INTEGRITAS & YUSTISIAL
            </span>
            <span className="text-[9px] bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-2.5 py-1 rounded-sm font-extrabold uppercase tracking-wide">
              KemenPAN-RB Compliant
            </span>
          </div>
        </div>
      </header>

      {/* Main Panel grid container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-1 flex flex-col lg:flex-row gap-12 items-center justify-center relative z-10">
        
        {/* Left Side: System Showcase & Rules */}
        <div className="flex-1 space-y-8 max-w-xl lg:max-w-none text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/80 border border-blue-800/60 rounded-full text-blue-300">
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black tracking-widest uppercase">E-Goverment Portal 2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black tracking-tight text-white leading-tight">
              Sistem Analisis Jabatan & Beban Kerja Terpadu
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Platform simulasi reguler untuk perhitungan formasi aparatur, analisis butir tugas teknis yustisial, serta korelasi beban kerja berdasarkan akumulasi statistik perkara SIPP di lingkungan peradilan negeri.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-md flex gap-3.5 items-start">
              <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black tracking-wide text-slate-200 uppercase">WKE STANDAR NASIONAL</h4>
                <p className="text-[11px] text-slate-450 mt-1">Mengadopsi Waktu Kerja Efektif 1.250 Jam per Tahun sesuai SK KMA atau standar KemenPAN-RB No.1 Tahun 2020.</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-md flex gap-3.5 items-start">
              <Scale className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black tracking-wide text-slate-200 uppercase">SIPP PERKARA INTEGRATION</h4>
                <p className="text-[11px] text-slate-450 mt-1">Konversi langsung dari beban perkara gugatan dan permohonan tahunan menjadi norma waktu kerja panitera pengganti & jurusita.</p>
              </div>
            </div>
          </div>

          {/* Guidelines Badge */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-800/60 pt-6">
            <span className="font-bold">Pedoman Regulasi:</span>
            <span className="px-2 py-1 bg-slate-950/40 rounded border border-slate-800/80 text-[10px] text-slate-350">PermenPAN-RB No. 1 Tahun 2020</span>
            <span className="px-2 py-1 bg-slate-950/40 rounded border border-slate-800/80 text-[10px] text-slate-350">SK SEKMA No. 415/KMA/2019</span>
          </div>
        </div>

        {/* Right Side: Sleek Login & Register Card Wrapper */}
        <div className="w-full max-w-md shrink-0">
          <div className="bg-slate-950/90 border border-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md">
            
            {/* Design accents */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500" />
            
            <div className="mb-6">
              <h3 className="text-xl font-black text-white tracking-tight">
                {isRegistering ? "Pendaftaran Satker Baru" : "Aparatur Otentifikasi"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isRegistering 
                  ? "Daftarkan Pengadilan Anda untuk memulai dokumen ANJAB-ABK tersendiri." 
                  : "Silakan masuk menggunakan kredensial satuan kerja Anda."}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 bg-red-950/50 border border-red-800/80 rounded-sm flex items-start gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="leading-normal">{errorMsg}</p>
              </div>
            )}

            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
              
              {isRegistering && (
                <>
                  {/* Nama Instansi */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Nama Satuan Kerja (Pengadilan)
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Misal: Pengadilan Agama Surabaya"
                        value={namaInstansi}
                        onChange={(e) => setNamaInstansi(e.target.value)}
                        className="w-full text-sm bg-slate-900 border border-slate-800 rounded-md py-2.5 pl-10 pr-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-semibold"
                      />
                    </div>
                  </div>

                  {/* Kelas Pengadilan */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Kelas Pengadilan
                    </label>
                    <div className="relative">
                      <Award className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                      <select
                        value={kelasPengadilan}
                        onChange={(e) => setKelasPengadilan(e.target.value as any)}
                        className="w-full text-sm bg-slate-900 border border-slate-800 rounded-md py-2.5 pl-10 pr-3.5 text-white focus:outline-none focus:border-blue-500 transition-colors font-semibold appearance-none"
                      >
                        <option value="IA Khusus">Kelas IA Khusus</option>
                        <option value="IA">Kelas IA</option>
                        <option value="IB">Kelas IB</option>
                        <option value="II">Kelas II</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Alamat Surat Elektronik / Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="nama@pengadilan.go.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm bg-slate-900 border border-slate-800 rounded-md py-2.5 pl-10 pr-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-semibold"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Kata Sandi / Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm bg-slate-900 border border-slate-800 rounded-md py-2.5 pl-10 pr-10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-550 hover:text-slate-300 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-550 hover:to-blue-650 text-white rounded-md text-sm font-bold flex items-center justify-center gap-2 tracking-wide cursor-pointer transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{isRegistering ? "DAFTAR SATKER baru" : "MASUK KE DASHBOARD"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Shift modes */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setErrorMsg(null);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold transition-colors underline decoration-dotted bg-transparent border-none cursor-pointer focus:outline-none"
              >
                {isRegistering ? "Sudah punya akun? Masuk disini" : "Pendaftaran Pengadilan / Satker Baru"}
              </button>
            </div>

            {/* Divider OR info */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-850" />
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-black">
                <span className="bg-slate-950 px-3 text-slate-500">ATAU LOGIN TAMU</span>
              </div>
            </div>

            {/* Guest Action Panel */}
            <button
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-md text-xs font-bold flex items-center justify-center gap-2 tracking-wide cursor-pointer transition-all"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>MASUK SEBAGAI TAMU / SIMULASI</span>
            </button>

            {/* Demo Accounts Panel */}
            <div className="mt-5 p-3.5 bg-slate-900/40 border border-slate-850/80 rounded">
              <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">AKUN UJI COBA CEPAT</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={() => useDemoAccount("admin@anjab.id")}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-blue-300 font-bold rounded cursor-pointer leading-tight transition-all active:scale-95"
                >
                  PA IA Khusus
                </button>
                <button
                  onClick={() => useDemoAccount("pekannbaru@pengadilan.go.id")}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-emerald-300 font-bold rounded cursor-pointer leading-tight transition-all active:scale-95"
                >
                  PA Pekanbaru IB
                </button>
              </div>
              <p className="text-[9px] text-slate-550 mt-1.5 leading-tight">
                Gunakan akun uji coba cepat di atas dengan kata sandi <code className="text-amber-500">admin123</code> untuk menguji lingkungan kerja rujukan langsung.
              </p>
            </div>

            {/* Database status banner */}
            <div className="mt-5 border-t border-slate-900 pt-4 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-blue-500" /> Status Database:
              </span>
              <span className="font-bold text-slate-400 capitalize flex items-center gap-1">
                {syncStatus === "synced" ? (
                  <>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Cloud Connected
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> Local Sandbox Sync
                  </>
                )}
              </span>
            </div>

          </div>
        </div>

      </main>

      {/* Footer Splash Info */}
      <footer className="border-t border-slate-800/80 bg-slate-950/50 py-4 text-center text-[10px] text-slate-550 relative z-10 font-bold uppercase tracking-wider shrink-0">
        SIM ANJAB-ABK v2.6.0 • DITJEN BADILAG • MAHKAMAH AGUNG REPUBLIK INDONESIA
      </footer>
    </div>
  );
}
