import React, { useState, useEffect } from 'react';
import { 
  Lock, Unlock, Eye, EyeOff, Copy, Plus, Trash2, 
  Search, Server, Wifi, Camera, Globe, Box, MoreHorizontal, 
  LogOut, Save, X, LayoutDashboard, List, Activity, ShieldCheck,
  Building, MapPin, Settings, Cloud, CloudOff, Loader
} from 'lucide-react';

// --- Firebase Imports ---
import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, addDoc, deleteDoc, doc, 
  onSnapshot, query, orderBy, serverTimestamp 
} from "firebase/firestore";
// เพิ่ม Import Authentication
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

// --- ⚙️ CONFIGURATION ZONE (แก้ไขตรงนี้) ---
// 1. นำค่าที่ได้จาก Firebase Console มาแปะแทนที่ตรงนี้
const firebaseConfig = {
  apiKey: "AIzaSyAjLOFhrO-dZWNfMb2ZrEFCii788gBqkWM",
  authDomain: "itmanagervault.firebaseapp.com",
  projectId: "itmanagervault",
  storageBucket: "itmanagervault.firebasestorage.app",
  messagingSenderId: "422284074512",
  appId: "1:422284074512:web:8489d9ae70335be9fd7495",
  measurementId: "G-QBJSJC2RQQ"
};
// 2. รหัสผ่านเข้าแอป (Frontend Gate)
const APP_PASSWORD = "1234"; 

// --- Initialize Firebase ---
let db;
let auth;
let isFirebaseReady = false;

try {
  // ตรวจสอบว่า apiKey ถูกใส่ค่ามาแล้วหรือยัง (ไม่ใช่ค่า Default)
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseReady = true;
  }
} catch (err) {
  console.error("Firebase Init Error:", err);
}

// --- Categories Config ---
const DEFAULT_CATEGORIES = [
  { id: 'workspace', name: 'Google Workspace', iconKey: 'box', colorId: 'blue' },
  { id: 'website', name: 'Website', iconKey: 'globe', colorId: 'indigo' },
  { id: 'branch', name: 'Branch / สาขา', iconKey: 'building', colorId: 'teal' },
  { id: 'cctv', name: 'CCTV', iconKey: 'camera', colorId: 'red' },
  { id: 'network', name: 'Network System', iconKey: 'wifi', colorId: 'green' },
  { id: 'server', name: 'Server (Odoo)', iconKey: 'server', colorId: 'purple' },
  { id: 'etc', name: 'Etc / Asset', iconKey: 'more', colorId: 'gray' }
];

const DEFAULT_BRANCHES = ['Head Office', 'Branch 1', 'Factory'];

// --- Icon Mapping ---
const ICON_MAP = {
  box: Box, globe: Globe, camera: Camera, wifi: Wifi, 
  server: Server, more: MoreHorizontal, building: Building
};

const COLOR_OPTIONS = [
  { id: 'blue', class: 'bg-blue-100 text-blue-600' },
  { id: 'indigo', class: 'bg-indigo-100 text-indigo-600' },
  { id: 'teal', class: 'bg-teal-100 text-teal-600' },
  { id: 'red', class: 'bg-red-100 text-red-600' },
  { id: 'green', class: 'bg-green-100 text-green-600' },
  { id: 'purple', class: 'bg-purple-100 text-purple-600' },
  { id: 'gray', class: 'bg-gray-100 text-gray-600' },
];

// --- Main Component ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const authSession = sessionStorage.getItem('it_vault_auth');
    if (authSession === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === APP_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('it_vault_auth', 'true');
    } else {
      setError('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('it_vault_auth');
    setPasswordInput('');
  };

  const SarabunFont = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
      body, input, button, select, textarea { font-family: 'Sarabun', sans-serif !important; }
    `}</style>
  );

  if (!isFirebaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans text-center">
        <SarabunFont />
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <CloudOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800">ยังไม่ได้เชื่อมต่อ Firebase</h2>
          <p className="text-gray-500 mt-2 text-sm">
            กรุณาแก้ไขไฟล์โค้ดเพื่อใส่ค่า <code>firebaseConfig</code> ที่ได้จาก Firebase Console ให้ถูกต้อง
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <SarabunFont />
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-6">
            <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <Lock className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">IT Support Vault</h1>
            <p className="text-gray-500 text-sm mt-2">Cloud Database Mode</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="รหัสผ่าน (1234)"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md">
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <SarabunFont />
      <Dashboard onLogout={handleLogout} />
    </>
  );
}

// --- Dashboard Component ---
function Dashboard({ onLogout }) {
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES); 
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterBranch, setFilterBranch] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null); // เก็บสถานะ Auth

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBranchMgrOpen, setIsBranchMgrOpen] = useState(false);

  // --- 1. System Auth (Anonymous Login) ---
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setFirebaseUser(user);
      } else {
        // User is signed out, try anonymous login
        signInAnonymously(auth).catch((error) => {
          console.error("Anonymous auth failed:", error);
          alert("ไม่สามารถเชื่อมต่อ Server ได้ (Auth Failed)");
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // --- 2. Real-time Data Sync (Only when Authenticated) ---
  useEffect(() => {
    if (!firebaseUser || !db) return; // รอให้ Login สำเร็จก่อนค่อยดึงข้อมูล

    // Sync Items
    const qItems = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const unsubItems = onSnapshot(qItems, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsData);
      setIsLoading(false);
    }, (err) => {
      console.error("Firestore Error:", err);
      // alert("Permission Denied: ตรวจสอบ Security Rules ใน Firebase Console");
    });

    // Sync Branches (Simple Collection)
    const qBranches = query(collection(db, "branches"), orderBy("name"));
    const unsubBranches = onSnapshot(qBranches, (snapshot) => {
      if (!snapshot.empty) {
        setBranches(snapshot.docs.map(d => d.data().name));
      } else {
        setBranches(DEFAULT_BRANCHES);
      }
    }, (err) => {
      console.log("Branch sync error (optional):", err);
    });

    return () => {
      unsubItems();
      unsubBranches();
    };
  }, [firebaseUser]); // ทำงานเมื่อ firebaseUser เปลี่ยนแปลง

  // --- Actions ---
  const handleAddItem = async (newItem) => {
    if (!firebaseUser) return alert("กรุณารอการเชื่อมต่อสักครู่...");
    try {
      await addDoc(collection(db, "items"), {
        ...newItem,
        createdAt: serverTimestamp(),
        createdBy: firebaseUser.uid // บันทึกว่าใครเป็นคนสร้าง (Optional)
      });
      setIsModalOpen(false);
      setCurrentView('list');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + error.message);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!firebaseUser) return;
    if (confirm('ยืนยันการลบข้อมูลถาวร?')) {
      try {
        await deleteDoc(doc(db, "items", id));
      } catch (error) {
        console.error("Error deleting:", error);
        alert("ลบข้อมูลไม่สำเร็จ");
      }
    }
  };

  const handleSaveBranches = async (newBranchList) => {
    // For this demo version, we update local state immediately
    // In production, you should sync this to Firestore 'branches' collection properly
    setBranches(newBranchList);
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesBranch = filterBranch === 'all' || item.branch === filterBranch;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesBranch && matchesSearch;
  });

  const recentItems = items.slice(0, 5); 

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <Cloud className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">IT System Vault</h1>
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                {firebaseUser ? (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online Mode
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    Connecting...
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
             <button onClick={() => setCurrentView('dashboard')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${currentView === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                <LayoutDashboard className="w-4 h-4" /> Overview
             </button>
             <button onClick={() => setCurrentView('list')} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${currentView === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>
                <List className="w-4 h-4" /> Passwords
             </button>
          </div>

          <button onClick={onLogout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
             <p className="text-gray-400 text-sm">กำลังเชื่อมต่อฐานข้อมูล...</p>
          </div>
        ) : currentView === 'dashboard' ? (
           <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                        <h2 className="text-lg font-semibold opacity-90">Cloud Database</h2>
                        <div className="text-4xl font-bold mt-2">{items.length}</div>
                        <p className="text-sm mt-1 opacity-75">Systems Securely Stored</p>
                      </div>
                      <Cloud className="absolute right-[-20px] bottom-[-20px] w-32 h-32 text-blue-500 opacity-50" />
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
                     <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-500" /> Recent Updates</h3>
                     <div className="space-y-3">
                        {recentItems.map(item => {
                           const cat = categories.find(c => c.id === item.category);
                           const Icon = cat ? (ICON_MAP[cat.iconKey] || MoreHorizontal) : MoreHorizontal;
                           return (
                             <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-50 transition">
                                <div className="flex items-center gap-3">
                                   <div className={`p-2 rounded-lg ${COLOR_OPTIONS.find(c=>c.id === cat?.colorId)?.class || 'bg-gray-200'}`}>
                                      <Icon className="w-4 h-4" />
                                   </div>
                                   <div>
                                      <div className="font-medium text-gray-800 text-sm">{item.title}</div>
                                      <div className="text-xs text-gray-500 flex gap-2">
                                        <span>{item.user}</span>
                                        {item.branch && <span className="bg-white px-1 rounded border flex items-center gap-0.5"><MapPin className="w-3 h-3"/> {item.branch}</span>}
                                      </div>
                                   </div>
                                </div>
                             </div>
                           )
                        })}
                        {recentItems.length === 0 && <p className="text-gray-400 text-sm">No data yet.</p>}
                     </div>
                  </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                 {categories.map(cat => {
                    const count = items.filter(i => i.category === cat.id).length;
                    const Icon = ICON_MAP[cat.iconKey] || MoreHorizontal;
                    const color = COLOR_OPTIONS.find(c => c.id === cat.colorId)?.class;
                    return (
                       <div key={cat.id} onClick={() => { setFilterCategory(cat.id); setCurrentView('list'); }} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group">
                          <div className="flex justify-between items-start mb-2">
                             <div className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform`}><Icon className="w-5 h-5" /></div>
                             <span className="text-2xl font-bold text-gray-700">{count}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-600 truncate">{cat.name}</div>
                       </div>
                    )
                 })}
              </div>
           </div>
        ) : (
          <div className="animate-fade-in">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-20 z-10">
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <div className="relative flex items-center">
                        <MapPin className="absolute left-3 text-gray-400 w-4 h-4 pointer-events-none" />
                        <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className="pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none appearance-none cursor-pointer hover:bg-gray-100">
                            <option value="all">All Branches</option>
                            {branches.map((b, idx) => <option key={idx} value={b}>{b}</option>)}
                        </select>
                        <button onClick={() => setIsBranchMgrOpen(true)} className="ml-2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Settings className="w-4 h-4" /></button>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition text-sm">
                        <Plus className="w-4 h-4" /> Add Item
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {filteredItems.map(item => (
                <PasswordCard key={item.id} item={item} categories={categories} onDelete={handleDeleteItem} />
              ))}
              {filteredItems.length === 0 && <div className="text-center py-12 text-gray-400">ไม่พบข้อมูล</div>}
            </div>
          </div>
        )}
      </main>

      {isModalOpen && <AddModal branches={branches} categories={categories} onClose={() => setIsModalOpen(false)} onSave={handleAddItem} />}
      {isBranchMgrOpen && <BranchManagerModal branches={branches} onSave={handleSaveBranches} onClose={() => setIsBranchMgrOpen(false)} />}
    </div>
  );
}

// --- Sub Components ---
function PasswordCard({ item, categories, onDelete }) {
  const [showPass, setShowPass] = useState(false);
  const [copied, setCopied] = useState(false);
  const cat = categories.find(c => c.id === item.category);
  const Icon = cat ? (ICON_MAP[cat.iconKey] || MoreHorizontal) : MoreHorizontal;
  const color = COLOR_OPTIONS.find(c => c.id === cat?.colorId)?.class || 'bg-gray-100';

  const handleCopy = () => {
    navigator.clipboard.writeText(item.pass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition group relative">
      {item.branch && <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-bl-xl font-medium flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.branch}</div>}
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-2">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg flex-shrink-0 ${color}`}><Icon className="w-6 h-6" /></div>
          <div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600 border">{cat?.name}</span>
            <h3 className="text-lg font-bold text-gray-800 mt-1">{item.title}</h3>
            <div className="text-gray-500 text-sm mt-1">User: <span className="font-mono text-gray-700 bg-gray-50 px-1 rounded">{item.user}</span></div>
            {item.note && <div className="mt-2 text-xs text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-100">Note: {item.note}</div>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-gray-50 border rounded-lg px-3 py-2 w-48 justify-between">
            <span className="font-mono text-sm">{showPass ? item.pass : '••••••••'}</span>
            <button onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          </div>
          <button onClick={handleCopy} className={`p-2.5 rounded-lg border ${copied ? 'bg-green-50 text-green-600 border-green-200' : 'hover:bg-gray-50'}`}>{copied ? <ShieldCheck className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
          <button onClick={() => onDelete(item.id)} className="p-2.5 rounded-lg border border-transparent text-gray-400 hover:bg-red-50 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
        </div>
      </div>
    </div>
  );
}

function AddModal({ branches, categories, onClose, onSave }) {
  const [formData, setFormData] = useState({ category: 'workspace', branch: branches[0] || '', title: '', user: '', pass: '', note: '' });
  const handleSubmit = (e) => { e.preventDefault(); if(formData.title && formData.pass) onSave(formData); };

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center"><h3 className="font-bold text-lg">New Credential</h3><button onClick={onClose}><X className="w-5 h-5" /></button></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div><label className="block text-sm font-semibold mb-1">Category</label><select value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})} className="w-full p-2 border rounded-lg">{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
             <div><label className="block text-sm font-semibold mb-1">Branch</label><select value={formData.branch} onChange={e=>setFormData({...formData, branch:e.target.value})} className="w-full p-2 border rounded-lg"><option value="">None</option>{branches.map((b,i)=><option key={i} value={b}>{b}</option>)}</select></div>
          </div>
          <input type="text" placeholder="System Name" className="w-full p-2 border rounded-lg" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
             <input type="text" placeholder="Username" className="w-full p-2 border rounded-lg" value={formData.user} onChange={e=>setFormData({...formData, user:e.target.value})} />
             <input type="text" placeholder="Password" className="w-full p-2 border rounded-lg font-mono" value={formData.pass} onChange={e=>setFormData({...formData, pass:e.target.value})} />
          </div>
          <textarea placeholder="Note" className="w-full p-2 border rounded-lg h-20" value={formData.note} onChange={e=>setFormData({...formData, note:e.target.value})}></textarea>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Save</button>
        </form>
      </div>
    </div>
  );
}

function BranchManagerModal({ branches, onSave, onClose }) {
  const [newBranch, setNewBranch] = useState(''); const [list, setList] = useState(branches);
  const handleAdd = (e) => { e.preventDefault(); if(newBranch && !list.includes(newBranch)) { const up = [...list, newBranch]; setList(up); onSave(up); setNewBranch(''); }};
  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm p-4">
        <div className="flex justify-between mb-4"><h3 className="font-bold">Manage Branches</h3><button onClick={onClose}><X className="w-5 h-5" /></button></div>
        <form onSubmit={handleAdd} className="flex gap-2 mb-4"><input className="flex-1 p-2 border rounded-lg" value={newBranch} onChange={e=>setNewBranch(e.target.value)} /><button className="bg-blue-600 text-white p-2 rounded-lg"><Plus /></button></form>
        <div className="max-h-60 overflow-y-auto space-y-2">{list.map((b,i)=><div key={i} className="flex justify-between p-2 bg-gray-50 rounded border">{b}</div>)}</div>
      </div>
    </div>
  );
}


