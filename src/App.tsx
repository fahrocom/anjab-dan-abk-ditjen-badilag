import React, { useState, useEffect } from "react";
import { UnitKerja, Jabatan, AppSettings, UraianTugas, JenisPerkara, DataPerkara } from "./types";
import { 
  defaultSettings, 
  mockUnitKerja, 
  mockJabatan,
  mockJenisPerkara,
  mockDataPerkara
} from "./data/mockData";
import { CourtPreset } from "./data/religionCourtsPresets";

// Firebase imports
import { auth, saveUserData, getUserData } from "./lib/firebase";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";

// Tabs
import DashboardTab from "./components/DashboardTab";
import UnitKerjaTab from "./components/UnitKerjaTab";
import AnjabTab from "./components/AnjabTab";
import AbkTab from "./components/AbkTab";
import RecapTab from "./components/RecapTab";
import TemplateTab from "./components/TemplateTab";
import SettingsTab from "./components/SettingsTab";
import PerkaraTab from "./components/PerkaraTab";
import LoginFrontpage from "./components/LoginFrontpage";

// Icons
import { 
  Briefcase, 
  Building2, 
  Calculator, 
  FileCheck2, 
  SlidersHorizontal,
  Home,
  CheckCircle,
  Award,
  BookOpen,
  Scale,
  Cloud,
  CloudOff,
  RefreshCw,
  Loader2,
  LogOut
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedJabatanIdForAbk, setSelectedJabatanIdForAbk] = useState<string | undefined>(undefined);

  // Core Persistent States loads
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem("sim_anjab_abk_settings");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.namaInstansi === "Dinas Komunikasi, Informatika, dan Statistik") {
        // Clear all to force reload new Badilag MA-RI defaults
        localStorage.removeItem("sim_anjab_abk_settings");
        localStorage.removeItem("sim_anjab_abk_units");
        localStorage.removeItem("sim_anjab_abk_positions");
        localStorage.removeItem("sim_anjab_abk_case_types");
        localStorage.removeItem("sim_anjab_abk_cases");
        return defaultSettings;
      }
      return parsed;
    }
    return defaultSettings;
  });

  const [unitKerja, setUnitKerja] = useState<UnitKerja[]>(() => {
    const saved = localStorage.getItem("sim_anjab_abk_units");
    if (localStorage.getItem("sim_anjab_abk_settings") === null) {
      return mockUnitKerja;
    }
    return saved ? JSON.parse(saved) : mockUnitKerja;
  });

  const [jabatan, setJabatan] = useState<Jabatan[]>(() => {
    const saved = localStorage.getItem("sim_anjab_abk_positions");
    if (localStorage.getItem("sim_anjab_abk_settings") === null) {
      return mockJabatan;
    }
    return saved ? JSON.parse(saved) : mockJabatan;
  });

  const [jenisPerkaraList, setJenisPerkaraList] = useState<JenisPerkara[]>(() => {
    const saved = localStorage.getItem("sim_anjab_abk_case_types");
    if (localStorage.getItem("sim_anjab_abk_settings") === null) {
      return mockJenisPerkara;
    }
    return saved ? JSON.parse(saved) : mockJenisPerkara;
  });

  const [dataPerkaraList, setDataPerkaraList] = useState<DataPerkara[]>(() => {
    const saved = localStorage.getItem("sim_anjab_abk_cases");
    if (localStorage.getItem("sim_anjab_abk_settings") === null) {
      return mockDataPerkara;
    }
    return saved ? JSON.parse(saved) : mockDataPerkara;
  });

  // Firebase Auth and Cloud Sync States
  const [user, setUser] = useState<User | null>(null);
  const [cloudUserId, setCloudUserId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<"connecting" | "idle" | "syncing" | "synced" | "error">("connecting");
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  // 1. Authenticate user anonymously & pull initial cloud state
  useEffect(() => {
    // Generate or fetch fallback unique client ID so cloud sync works even without Firebase Auth enabled
    let storedLocalUid = localStorage.getItem("sim_anjab_abk_local_uid");
    if (!storedLocalUid) {
      storedLocalUid = "client-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("sim_anjab_abk_local_uid", storedLocalUid);
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setCloudUserId(currentUser.uid);
        await initCloudData(currentUser.uid);
      } else {
        signInAnonymously(auth).catch(async (err) => {
          console.warn("Firebase Auth Anonymous Sign-In failed/restricted, falling back to secure local client ID:", err);
          // Fall back gracefully to active local-uid cloud document matching
          setCloudUserId(storedLocalUid);
          await initCloudData(storedLocalUid);
        });
      }
    });

    async function initCloudData(uid: string) {
      setSyncStatus("syncing");
      try {
         const cloudData = await getUserData(uid);
         if (cloudData) {
           // Document exists! Load state variables
           if (cloudData.settings) setSettings(cloudData.settings);
           if (cloudData.unitKerja) setUnitKerja(cloudData.unitKerja);
           if (cloudData.jabatan) setJabatan(cloudData.jabatan);
           if (cloudData.jenisPerkaraList) setJenisPerkaraList(cloudData.jenisPerkaraList);
           if (cloudData.dataPerkaraList) setDataPerkaraList(cloudData.dataPerkaraList);
         } else {
           // New user document registry, save current memory representation
           await saveUserData(uid, {
             settings,
             unitKerja,
             jabatan,
             jenisPerkaraList,
             dataPerkaraList
           });
         }
         setSyncStatus("synced");
      } catch (error) {
         console.error("Failed to fetch/register cloud document:", error);
         setSyncStatus("error");
      } finally {
         setIsDataLoaded(true);
      }
    }

    return () => unsubscribe();
  }, []);

  // 2. Continuous Realtime Data Cloud Syncing
  useEffect(() => {
    if (!cloudUserId || !isDataLoaded) return;

    // Use a short debounce to avoid spamming Firestore on every keystroke
    const delayDebounceFn = setTimeout(async () => {
      setSyncStatus("syncing");
      try {
        await saveUserData(cloudUserId, {
          settings,
          unitKerja,
          jabatan,
          jenisPerkaraList,
          dataPerkaraList
        });
        setSyncStatus("synced");
      } catch (error) {
        console.error("Cloud saving failed:", error);
        setSyncStatus("error");
      }
    }, 1500); // 1.5 seconds debounce

    return () => clearTimeout(delayDebounceFn);
  }, [settings, unitKerja, jabatan, jenisPerkaraList, dataPerkaraList, cloudUserId, isDataLoaded]);

  // Sync state to local storage on changes
  useEffect(() => {
    localStorage.setItem("sim_anjab_abk_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("sim_anjab_abk_units", JSON.stringify(unitKerja));
  }, [unitKerja]);

  useEffect(() => {
    localStorage.setItem("sim_anjab_abk_positions", JSON.stringify(jabatan));
  }, [jabatan]);

  useEffect(() => {
    localStorage.setItem("sim_anjab_abk_case_types", JSON.stringify(jenisPerkaraList));
  }, [jenisPerkaraList]);

  useEffect(() => {
    localStorage.setItem("sim_anjab_abk_cases", JSON.stringify(dataPerkaraList));
  }, [dataPerkaraList]);

  // MUTATOR FUNCTIONS

  // A. Unit Kerja Mutators
  const handleAddUnit = (un: Omit<UnitKerja, "id">) => {
    const newUnit: UnitKerja = {
      ...un,
      id: `unit-${Date.now()}`
    };
    setUnitKerja([...unitKerja, newUnit]);
  };

  const handleUpdateUnit = (id: string, partial: Partial<UnitKerja>) => {
    setUnitKerja(unitKerja.map(u => u.id === id ? { ...u, ...partial } : u));
  };

  const handleDeleteUnit = (id: string) => {
    setUnitKerja(unitKerja.filter(u => u.id !== id));
    // Set associated positions' unitKerjaId reference to empty or remove?
    // Let's just remove reference to keep database intact
    setJabatan(jabatan.map(j => j.unitKerjaId === id ? { ...j, unitKerjaId: "" } : j));
  };

  // B. Jabatan Mutators
  const handleAddJabatan = (jab: Omit<Jabatan, "id">) => {
    const newJab: Jabatan = {
      ...jab,
      id: `jab-${Date.now()}`
    };
    setJabatan([...jabatan, newJab]);
  };

  const handleUpdateJabatan = (id: string, partial: Partial<Jabatan>) => {
    setJabatan(jabatan.map(j => j.id === id ? { ...j, ...partial } : j));
  };

  const handleDeleteJabatan = (id: string) => {
    setJabatan(jabatan.filter(j => j.id !== id));
    if (selectedJabatanIdForAbk === id) {
      setSelectedJabatanIdForAbk(undefined);
    }
  };

  // C. ABK Workload update Mutator
  const handleUpdateTasks = (jabatanId: string, updatedTasks: UraianTugas[]) => {
    setJabatan(jabatan.map(j => j.id === jabatanId ? { ...j, uraianTugas: updatedTasks } : j));
  };

  // D. Database Administration
  const handleResetToMock = () => {
    setSettings(defaultSettings);
    setUnitKerja(mockUnitKerja);
    setJabatan(mockJabatan);
    setJenisPerkaraList(mockJenisPerkara);
    setDataPerkaraList(mockDataPerkara);
    setActiveTab("dashboard");
  };

  const handleLoadPreset = (preset: CourtPreset) => {
    let kelasSet: "IA Khusus" | "IA" | "IB" | "II" | "Banding" | "Pusat" = "IA";
    if (preset.id === "pa-kelas-ia-khusus") kelasSet = "IA Khusus";
    else if (preset.id === "pa-kelas-ia") kelasSet = "IA";
    else if (preset.id === "pa-kelas-ib") kelasSet = "IB";
    else if (preset.id === "pa-kelas-ii") kelasSet = "II";
    else if (preset.id === "pta-bandiing") kelasSet = "Banding";
    else if (preset.id === "ditjen-badilag-pusat") kelasSet = "Pusat";

    setSettings({
      ...settings,
      namaInstansi: preset.instansiName,
      alamat: preset.alamatInstansi,
      kelasPengadilan: kelasSet
    });
    setUnitKerja(preset.unitKerjaList);
    setJabatan(preset.jabatanList);
    setActiveTab("unit");
  };

  const handleWipeData = () => {
    setUnitKerja([]);
    setJabatan([]);
    setJenisPerkaraList([]);
    setDataPerkaraList([]);
    setSelectedJabatanIdForAbk(undefined);
  };

  // E. Jenis Perkara Mutators
  const handleAddJenisPerkara = (jp: Omit<JenisPerkara, "id">) => {
    const newJp: JenisPerkara = { ...jp, id: `jp-${Date.now()}` };
    setJenisPerkaraList([...jenisPerkaraList, newJp]);
  };

  const handleUpdateJenisPerkara = (id: string, partial: Partial<JenisPerkara>) => {
    setJenisPerkaraList(jenisPerkaraList.map(j => j.id === id ? { ...j, ...partial } : j));
  };

  const handleDeleteJenisPerkara = (id: string) => {
    setJenisPerkaraList(jenisPerkaraList.filter(j => j.id !== id));
    setDataPerkaraList(dataPerkaraList.filter(d => d.jenisPerkaraId !== id));
  };

  // F. Data Perkara Mutators
  const handleAddDataPerkara = (dp: Omit<DataPerkara, "id">) => {
    const newDp: DataPerkara = { ...dp, id: `dp-${Date.now()}` };
    setDataPerkaraList([...dataPerkaraList, newDp]);
  };

  const handleUpdateDataPerkara = (id: string, partial: Partial<DataPerkara>) => {
    setDataPerkaraList(dataPerkaraList.map(d => d.id === id ? { ...d, ...partial } : d));
  };

  const handleDeleteDataPerkara = (id: string) => {
    setDataPerkaraList(dataPerkaraList.filter(d => d.id !== id));
  };

  const handleImportBackup = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings && Array.isArray(parsed.unitKerja) && Array.isArray(parsed.jabatan)) {
        setSettings(parsed.settings);
        setUnitKerja(parsed.unitKerja);
        setJabatan(parsed.jabatan);
        if (parsed.jenisPerkaraList) setJenisPerkaraList(parsed.jenisPerkaraList);
        if (parsed.dataPerkaraList) setDataPerkaraList(parsed.dataPerkaraList);
        setActiveTab("dashboard");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to parse backup string:", err);
      return false;
    }
  };

  const handleExportBackup = () => {
    const database = { settings, unitKerja, jabatan, jenisPerkaraList, dataPerkaraList };
    const blob = new Blob([JSON.stringify(database, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Backup_Database_ANJAB_ABK_${settings.namaInstansi.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard": return { title: "DASHBOARD UTAMA", sub: "Ringkasan Hasil Analisis & Kebutuhan Formasi ASN" };
      case "unit": return { title: "UNIT KERJA ORGANISASI", sub: "Daftar Satuan Kerja Mandiri & Bezetting Pegawai" };
      case "anjab": return { title: "ANALISIS JABATAN (ANJAB)", sub: "Uraian Jabatan, Syarat Jabatan & Ikhtisar Kerja" };
      case "abk": return { title: "ANALISIS BEBAN KERJA (ABK)", sub: "Kalkulasi Waktu Penyelesaian & Beban Kerja Riil" };
      case "recap": return { title: "REKAPITULASI FORMASI", sub: "Matriks Formasi Jabatan & Standar Hasil Kelompok Jabatan" };
      case "perkara": return { title: "DATABASE PERKARA SIPP", sub: "Integrasi Statistik Perkara & Klasifikasi Beban Kerja" };
      case "template": return { title: "TEMPLATE ACUAN JABATAN TEKNIS", sub: "Pedoman & Standard Butir Tugas Fungsional Berdasarkan PermenPAN-RB No. 1 Tahun 2020" };
      case "settings": return { title: "KONFIGURASI INSTANSI", sub: "Parameter Waktu Kerja Efektif (WKE) & Manajemen Database" };
      default: return { title: "SIM ANJAB-ABK", sub: "Sistem Informasi Analisis Jabatan & Analisis Beban Kerja" };
    }
  };

  const { title: activeTitle, sub: activeSubtitle } = getTabTitle();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans text-slate-900 select-none antialiased print:bg-white print:text-black">
      
      {/* DESKTOP SIDEBAR NAVIGATION SYSTEM (GEOMETRIC BALANCE Theme) */}
      <aside className="print:hidden w-64 bg-slate-900 text-slate-300 flex-col shrink-0 border-r border-slate-800 hidden lg:flex select-none">
        {/* Sidebar Header Emblem */}
        <div className="h-20 px-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-sm flex items-center justify-center font-black text-white text-base tracking-wider shadow-md">
            RI
          </div>
          <div>
            <h1 className="font-sans font-black text-sm tracking-tight text-white leading-none">
              SIM ANJAB-ABK
            </h1>
            <span className="text-[8px] text-blue-400 font-extrabold tracking-widest uppercase mt-1 block" title="SK SEKMA Nomor 415/SEK/SK/V/2019">
              SK SEKMA 415/2019
            </span>
          </div>
        </div>

        {/* Instansi Badge Panel */}
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-950/40 space-y-1.5 col-span-1">
          <div>
            <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">Instansi Terdaftar</p>
            <p className="text-white text-xs font-bold leading-tight mt-1 truncate" title={settings.namaInstansi}>
              {settings.namaInstansi}
            </p>
          </div>
          {settings.kelasPengadilan && (
            <span className="inline-flex text-[9px] font-black bg-blue-900/60 border border-blue-700 text-blue-250 px-2 py-0.5 rounded-sm uppercase tracking-wider">
              Kelas {settings.kelasPengadilan}
            </span>
          )}
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto pt-4 pb-6">
          <div className="space-y-6">
            
            {/* GROUP 1: MENU UTAMA */}
            <div className="px-4">
              <p className="px-2 text-[9px] text-slate-500 font-extrabold tracking-widest uppercase mb-2">Internal Menu</p>
              <div className="space-y-1">
                {/* 1. Dashboard */}
                <button
                  onClick={() => { setActiveTab("dashboard"); setSelectedJabatanIdForAbk(undefined); }}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold transition-all rounded-sm leading-none border-l-3 select-none text-left cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-slate-800 text-white border-blue-600"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Home className="w-4 h-4 text-blue-500 shrink-0" />
                  RINGKASAN DASBOR
                </button>

                {/* 2. Unit Kerja */}
                <button
                  onClick={() => { setActiveTab("unit"); setSelectedJabatanIdForAbk(undefined); }}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold transition-all rounded-sm leading-none border-l-3 select-none text-left cursor-pointer ${
                    activeTab === "unit"
                      ? "bg-slate-800 text-white border-blue-600"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                  UNIT KERJA
                </button>

                {/* 3. Anjab */}
                <button
                  onClick={() => { setActiveTab("anjab"); setSelectedJabatanIdForAbk(undefined); }}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold transition-all rounded-sm leading-none border-l-3 select-none text-left cursor-pointer ${
                    activeTab === "anjab"
                      ? "bg-slate-800 text-white border-blue-600"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
                  ANALISIS JABATAN
                </button>

                {/* 4. Abk */}
                <button
                  onClick={() => setActiveTab("abk")}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold transition-all rounded-sm leading-none border-l-3 select-none text-left cursor-pointer ${
                    activeTab === "abk"
                      ? "bg-slate-800 text-white border-blue-600"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Calculator className="w-4 h-4 text-blue-500 shrink-0" />
                  ANALISIS BEBAN KERJA
                </button>

                {/* 5. Data Perkara */}
                <button
                  onClick={() => { setActiveTab("perkara"); setSelectedJabatanIdForAbk(undefined); }}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold transition-all rounded-sm leading-none border-l-3 select-none text-left cursor-pointer ${
                    activeTab === "perkara"
                      ? "bg-slate-800 text-white border-blue-600"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <Scale className="w-4 h-4 text-blue-500 shrink-0" />
                  DATA PERKARA SIPP
                </button>

                {/* 6. Recap Matrix */}
                <button
                  onClick={() => { setActiveTab("recap"); setSelectedJabatanIdForAbk(undefined); }}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold transition-all rounded-sm leading-none border-l-3 select-none text-left cursor-pointer ${
                    activeTab === "recap"
                      ? "bg-slate-800 text-white border-blue-600"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 text-blue-500 shrink-0" />
                  REKAP FORMASI &amp; KELUARAN
                </button>

                {/* 6. Template Acuan */}
                <button
                  onClick={() => { setActiveTab("template"); setSelectedJabatanIdForAbk(undefined); }}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold transition-all rounded-sm leading-none border-l-3 select-none text-left cursor-pointer ${
                    activeTab === "template"
                      ? "bg-slate-800 text-white border-blue-600"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-blue-505 shrink-0" />
                  TEMPLATE PERMENPAN
                </button>
              </div>
            </div>

            {/* GROUP 2: SYSTEM ADMIN */}
            <div className="px-4">
              <p className="px-2 text-[9px] text-slate-500 font-extrabold tracking-widest uppercase mb-2">Administrasi</p>
              <div className="space-y-1">
                {/* 6. Settings */}
                <button
                  onClick={() => { setActiveTab("settings"); setSelectedJabatanIdForAbk(undefined); }}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 text-xs font-bold transition-all rounded-sm leading-none border-l-3 select-none text-left cursor-pointer ${
                    activeTab === "settings"
                      ? "bg-slate-800 text-white border-blue-600"
                      : "border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4 text-blue-550 shrink-0" />
                  PENGATURAN INSTANSI
                </button>
              </div>
            </div>

          </div>

          {/* Compliance & Standard Label */}
          <div className="px-6 space-y-2">
            <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-sm border border-slate-800 text-slate-350">
              <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-[9px] font-bold tracking-wider leading-none uppercase">
                FORMASI ASN REGULER
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP NAVIGATION BAR WITH HORIZONTAL SCROLL OVERFLOW */}
      <header className="bg-slate-900 border-b border-slate-800 text-slate-300 lg:hidden print:hidden select-none shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-sm flex items-center justify-center font-black text-white text-[11px] tracking-wider leading-none shadow-sm">
              RI
            </div>
            <div>
              <h1 className="font-sans font-black text-xs tracking-tight text-white leading-none">
                SIM ANJAB-ABK
              </h1>
              <p className="text-[9px] text-blue-400 font-extrabold mt-1 tracking-wider uppercase truncate max-w-[200px] xs:max-w-[280px] sm:max-w-[360px] leading-none" title={settings.namaInstansi}>
                {settings.namaInstansi} {settings.kelasPengadilan ? `(Kelas ${settings.kelasPengadilan})` : ""}
              </p>
            </div>
          </div>
          <span className="text-[8px] bg-blue-900/50 border border-blue-800 text-blue-300 px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider leading-none" title="SK SEKMA Nomor 415/SEK/SK/V/2019">
            SK SEKMA 415/2019
          </span>
        </div>

        {/* Horizontal scroll button bar on mobile viewport */}
        <div className="border-t border-slate-800 bg-slate-950/40 flex overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex space-x-1 p-2 w-max">
            {[
              { id: "dashboard", label: "DASHBOARD", icon: <Home className="w-3.5 h-3.5" /> },
              { id: "unit", label: "UNIT KERJA", icon: <Building2 className="w-3.5 h-3.5" /> },
              { id: "anjab", label: "ANALISIS JABATAN", icon: <Briefcase className="w-3.5 h-3.5" /> },
              { id: "abk", label: "ANALISIS BEBAN KERJA", icon: <Calculator className="w-3.5 h-3.5" /> },
              { id: "perkara", label: "DATA PERKARA", icon: <Scale className="w-3.5 h-3.5" /> },
              { id: "recap", label: "REKAP FORMASI", icon: <FileCheck2 className="w-3.5 h-3.5" /> },
              { id: "template", label: "TEMPLATE ACUAN", icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: "settings", label: "PENGATURAN", icon: <SlidersHorizontal className="w-3.5 h-3.5" /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== "abk") setSelectedJabatanIdForAbk(undefined);
                }}
                className={`flex items-center gap-1.5 py-2 px-3 text-[10px] font-bold transition-all rounded-sm border cursor-pointer select-none whitespace-nowrap leading-none ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-850/60 text-slate-400 border-slate-800 hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* RIGHT WORKSPACE ENVELOPE PANEL */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* Right Pane Header Bar with breadcrumbs */}
        <header className="h-16 border-b border-slate-200/80 bg-white flex items-center justify-between px-6 md:px-8 shrink-0 select-none print:hidden">
          <div className="space-y-0.5 max-w-lg">
            <h2 className="text-xs md:text-sm font-black font-sans text-slate-850 tracking-tight leading-none uppercase">
              {activeTitle}
            </h2>
            <p className="text-[10px] text-slate-450 truncate block leading-none font-medium">
              {activeSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Cloud Realtime Sync State Indicator */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-sm text-[10px] font-bold uppercase tracking-wider leading-none select-none transition-all duration-350 ${
              syncStatus === "connecting"
                ? "bg-amber-50 text-amber-800 border-amber-200"
                : syncStatus === "syncing"
                ? "bg-blue-50 text-blue-800 border-blue-250 animate-pulse"
                : syncStatus === "synced"
                ? "bg-emerald-50 text-emerald-850 border-emerald-200"
                : syncStatus === "error"
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : "bg-slate-50 text-slate-600 border-slate-200"
            }`}>
              {syncStatus === "connecting" && (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin shrink-0" />
                  <span className="hidden xs:inline">Menghubungkan Database</span>
                  <span className="xs:hidden">Database...</span>
                </>
              )}
              {syncStatus === "syncing" && (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin shrink-0" />
                  <span className="hidden xs:inline">Sinkronisasi Awan...</span>
                  <span className="xs:hidden">Sinkron...</span>
                </>
              )}
              {syncStatus === "synced" && (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Awan Sinkron</span>
                </>
              )}
              {syncStatus === "error" && (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Awan Offline</span>
                </>
              )}
              {syncStatus === "idle" && (
                <>
                  <Cloud className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Awan Siaga</span>
                </>
              )}
            </div>

            <span className="hidden sm:inline-flex bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-sm text-[9px] font-extrabold uppercase tracking-widest leading-none">
              E-Gov Standard
            </span>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-700 font-bold text-xs select-none">
              BK
            </div>
          </div>
        </header>

        {/* MAIN VIEWPORT SCROLL CONTAINER */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 print:p-0">
          
          {/* Render Tab Components based on routing state */}
          {activeTab === "dashboard" && (
            <DashboardTab
              unitKerja={unitKerja}
              jabatan={jabatan}
              wke={settings.wkeTahunan}
              setActiveTab={setActiveTab}
              setSelectedJabatanIdForAbk={setSelectedJabatanIdForAbk}
            />
          )}

          {activeTab === "unit" && (
            <UnitKerjaTab
              unitKerjaList={unitKerja}
              jabatanList={jabatan}
              onAddUnit={handleAddUnit}
              onUpdateUnit={handleUpdateUnit}
              onDeleteUnit={handleDeleteUnit}
              onLoadPreset={handleLoadPreset}
            />
          )}

          {activeTab === "anjab" && (
            <AnjabTab
              jabatanList={jabatan}
              unitKerjaList={unitKerja}
              onAddJabatan={handleAddJabatan}
              onUpdateJabatan={handleUpdateJabatan}
              onDeleteJabatan={handleDeleteJabatan}
            />
          )}

          {activeTab === "abk" && (
            <AbkTab
              jabatanList={jabatan}
              unitKerjaList={unitKerja}
              wkeTahunan={settings.wkeTahunan}
              onUpdateTasks={handleUpdateTasks}
              selectedJabatanIdForAbk={selectedJabatanIdForAbk}
              setSelectedJabatanIdForAbk={setSelectedJabatanIdForAbk}
            />
          )}

          {activeTab === "recap" && (
            <RecapTab
              jabatanList={jabatan}
              unitKerjaList={unitKerja}
              settings={settings}
            />
          )}

          {activeTab === "perkara" && (
            <PerkaraTab
              jenisPerkaraList={jenisPerkaraList}
              dataPerkaraList={dataPerkaraList}
              onAddJenisPerkara={handleAddJenisPerkara}
              onUpdateJenisPerkara={handleUpdateJenisPerkara}
              onDeleteJenisPerkara={handleDeleteJenisPerkara}
              onAddDataPerkara={handleAddDataPerkara}
              onUpdateDataPerkara={handleUpdateDataPerkara}
              onDeleteDataPerkara={handleDeleteDataPerkara}
            />
          )}

          {activeTab === "template" && (
            <TemplateTab
              unitKerjaList={unitKerja}
              onAddJabatan={handleAddJabatan}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              settings={settings}
              onUpdateSettings={setSettings}
              onResetToMock={handleResetToMock}
              onWipeData={handleWipeData}
              onImportBackup={handleImportBackup}
              onExportBackup={handleExportBackup}
            />
          )}
        </main>

        {/* FOOTER METRIC STAMP */}
        <footer className="bg-slate-50 text-slate-400 py-4 border-t border-slate-100 text-center text-[10px] select-none print:hidden shrink-0 font-bold uppercase tracking-wider">
          SIM ANJAB-ABK • Menpan No. 1 Tahun 2020 • BKPSDM INTEGRATION
        </footer>

      </div>

    </div>
  );
}
