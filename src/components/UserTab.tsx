import React, { useState, useEffect } from "react";
import { User, Plus, Trash2, Edit2, Save, X, Key } from "lucide-react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType, auth } from "../lib/firebase";
import { AppSettings, UserRecord, UserRole } from "../types";
import { sendPasswordResetEmail } from "firebase/auth";

interface UserTabProps {
  settings: AppSettings;
  userRole?: "admin" | "editor" | "viewer";
}

export default function UserTab({ settings, userRole = "viewer" }: UserTabProps) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("viewer");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [deleteConfirmUid, setDeleteConfirmUid] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const path = "users";
    try {
      const usersCol = collection(db, path);
      const snapshot = await getDocs(usersCol);
      const usersData = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserRecord));
      
      // Auto-update subditpengembangan.badilag@gmail.com to editor if found in system
      const targetEmail = "subditpengembangan.badilag@gmail.com";
      const targetUserIndex = usersData.findIndex(u => u.email?.toLowerCase() === targetEmail);
      if (targetUserIndex !== -1 && usersData[targetUserIndex].role !== "editor") {
        const targetUser = usersData[targetUserIndex];
        await updateDoc(doc(db, "users", targetUser.uid), { role: "editor" as UserRole });
        usersData[targetUserIndex].role = "editor";
      }
      
      setUsers(usersData);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  };

  const saveUser = async () => {
    if (!newEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Format email tidak valid');
      return;
    }
    const path = "users";
    try {
      if (currentUser) {
        // Update
        await updateDoc(doc(db, path, currentUser.uid), { role: newRole });
      } else {
        // Add
        // Note: Password handling should be done via a proper auth service, 
        // this is a UI-only modification as requested.
        await addDoc(collection(db, path), { email: newEmail, role: newRole, password: newPassword });
      }
      fetchUsers();
      setIsFormOpen(false);
      setNewEmail("");
      setNewPassword("");
      setNewRole("viewer");
      setCurrentUser(null);
    } catch (error) {
      handleFirestoreError(error, currentUser ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const deleteUser = async (uid: string) => {
    const path = `users/${uid}`;
    try {
      await deleteDoc(doc(db, "users", uid));
      fetchUsers();
      setDeleteConfirmUid(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const handleResetPassword = async (email: string) => {
    setStatusMsg(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setStatusMsg({
        type: "success",
        text: `Email instruksi reset password berhasil dikirim ke ${email}.`
      });
      setTimeout(() => setStatusMsg(null), 8000);
    } catch (error: any) {
      console.error(error);
      setStatusMsg({
        type: "error",
        text: `Gagal mengirim email reset: ${error.message || error}`
      });
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <User className="w-5 h-5 text-blue-600" />
              Manajemen Pengguna
            </h2>
            <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Tambah Pengguna
            </button>
          </div>

          {statusMsg && (
            <div className={`mb-6 p-4 rounded-lg flex items-center justify-between text-xs font-semibold ${
              statusMsg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}>
              <span>{statusMsg.text}</span>
              <button onClick={() => setStatusMsg(null)} className="text-slate-450 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {isFormOpen && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-700">{currentUser ? "Ubah Pengguna" : "Tambah Pengguna"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Email</label>
                  <input type="email" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} disabled={!!currentUser} className="px-3 py-2 border rounded-md text-sm bg-white disabled:bg-slate-100 disabled:text-slate-500" />
                </div>
                
                <div className="flex flex-col gap-1">
                  {currentUser ? (
                    <>
                      <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Aksi Keamanan</label>
                      {userRole === "admin" ? (
                        <button
                          type="button"
                          onClick={() => handleResetPassword(currentUser.email)}
                          className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-2 border border-amber-200 hover:border-amber-300 rounded-md font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all h-[38px]"
                        >
                          <Key className="w-4 h-4 text-amber-600" /> Kirim Reset Password
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic py-2 h-[38px] flex items-center leading-tight">
                          Akses Admin Diperlukan
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Kata Sandi / Password</label>
                      <input type="password" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="px-3 py-2 border rounded-md text-sm" />
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Peran / Role</label>
                  <select value={newRole} onChange={e => setNewRole(e.target.value as UserRole)} className="px-3 py-2 border rounded-md text-sm bg-white">
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setIsFormOpen(false); setCurrentUser(null); setNewEmail(""); setNewPassword(""); setNewRole("viewer"); }} className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 font-bold text-xs uppercase cursor-pointer transition-colors flex items-center gap-1.5"><X className="w-4 h-4"/> Batal</button>
                <button onClick={saveUser} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded font-bold text-xs uppercase cursor-pointer transition-colors flex items-center gap-1.5"><Save className="w-4 h-4"/> Simpan</button>
              </div>
            </div>
          )}

          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 border-b">
              <tr><th className="p-2">Email</th><th className="p-2">Role</th><th className="p-2">Aksi</th></tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.uid} className="border-b">
                  <td className="p-2 font-medium text-slate-700">{user.email}</td>
                  <td className="p-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                      user.role === "admin" ? "bg-rose-100 text-rose-700" :
                      user.role === "editor" ? "bg-amber-100 text-amber-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>{user.role}</span>
                  </td>
                  <td className="p-2 flex gap-3 items-center">
                    {userRole === "admin" && (
                      <button 
                        onClick={() => handleResetPassword(user.email)} 
                        title="Kirim Email Atur Ulang Kata Sandi / Reset Password"
                        className="text-amber-750 bg-amber-50 hover:bg-amber-100 p-1.5 px-3 rounded border border-amber-200 hover:border-amber-300 transition-all flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-amber-600" /> Kirim Reset Password
                      </button>
                    )}
                    <button onClick={() => { setCurrentUser(user); setNewEmail(user.email); setNewRole(user.role); setIsFormOpen(true); }} className="text-blue-600 p-1.5 hover:bg-blue-50 border border-blue-100 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                    {userRole === "admin" && (
                      <button onClick={() => setDeleteConfirmUid(user.uid)} className="text-red-600 p-1.5 hover:bg-red-50 border border-red-100 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirmUid && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full shadow-xl space-y-4 animate-slideDown text-slate-900">
            <h3 className="font-sans font-bold text-base text-slate-850">
              Konfirmasi Hapus Pengguna
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Apakah Anda yakin ingin menghapus pengguna <strong className="text-slate-800 font-semibold">{users.find(u => u.uid === deleteConfirmUid)?.email}</strong> secara permanen dari sistem?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmUid(null)}
                className="px-4 py-2 border rounded-md text-slate-600 hover:bg-slate-100 font-bold text-xs uppercase cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => deleteUser(deleteConfirmUid)}
                className="px-4 py-2 bg-red-650 text-white hover:bg-red-700 border border-transparent rounded-md font-bold text-xs uppercase cursor-pointer transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
