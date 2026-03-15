'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Registration {
  id: number;
  name: string;
  gender: 'זכר' | 'נקבה';
  resumeName: string;
  photoCount: number;
  date: string;
}

export default function MatchmakingPage() {
  const [step, setStep] = useState<'form' | 'upload' | 'success' | 'admin'>('form');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'זכר' | 'נקבה' | ''>('');
  const [resume, setResume] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('mm_registrations');
    if (saved) {
      try { setRegistrations(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const resumeRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<HTMLInputElement>(null);

  const saveAndAdvance = () => {
    const reg: Registration = {
      id: Date.now(),
      name,
      gender: gender as 'זכר' | 'נקבה',
      resumeName: resume ? resume.name : 'לא הועלה',
      photoCount: photos.length,
      date: new Date().toLocaleString('he-IL'),
    };
    const updated = [reg, ...registrations];
    setRegistrations(updated);
    localStorage.setItem('mm_registrations', JSON.stringify(updated));
    setStep('success');
  };

  const reset = () => {
    setName(''); setGender(''); setResume(null); setPhotos([]); setStep('form');
  };

  const exportCSV = () => {
    // Sort by name or date if needed, here we just take current order
    const header = '\uFEFFשם,מגדר,תאריך הרשמה,קובץ רזומה,כמות תמונות';
    const rows = registrations.map(r =>
      `"${r.name}","${r.gender}","${r.date}","${r.resumeName}","${r.photoCount}"`
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'מאגר_שידוכים_רשומים.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) return null;

  return (
    <div dir="rtl" className="min-h-screen" style={{ 
      background: 'radial-gradient(circle at top left, #ffafbd 0%, #ffc3a0 100%)', 
      fontFamily: 'Heebo, sans-serif',
      color: '#2d3436'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&display=swap');
        
        .glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        }

        .animate-in {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .btn-gradient {
          background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
          color: white;
          transition: all 0.3s ease;
        }

        .btn-gradient:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 20px rgba(108, 92, 231, 0.3);
        }

        .btn-gradient:active {
          transform: scale(0.98);
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 w-full glass z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl">💝</span>
          <h1 className="text-2xl font-black tracking-tighter text-[#6c5ce7]">MATCHMAKER</h1>
        </div>
        <button 
          onClick={() => setStep(step === 'admin' ? 'form' : 'admin')}
          className="px-5 py-2 rounded-full font-bold text-sm bg-white/50 hover:bg-white text-[#6c5ce7] transition-all border border-[#6c5ce7]/20"
        >
          {step === 'admin' ? 'חזרה לטופס' : 'פאנל ניהול ⚙️'}
        </button>
      </header>

      <main className="pt-32 pb-20 px-6 flex justify-center">
        <div className="w-full max-w-xl">
          
          {/* Form Step */}
          {step === 'form' && (
            <div className="glass rounded-[32px] p-10 animate-in">
              <h2 className="text-4xl font-black mb-2 text-gray-800">היי, בוא נכיר! 👋</h2>
              <p className="text-gray-500 mb-8 font-medium">כדי למצוא את האחד/ת, נתחיל בפרטים הכי חשובים.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 mr-1">איך קוראים לך?</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder="הכנס שם מלא"
                    className="w-full bg-white/50 border-2 border-white/20 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-[#6c5ce7]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-2 mr-1">מגדר</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setGender('זכר')}
                      className={`py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all ${gender === 'זכר' ? 'bg-[#0984e3] text-white shadow-xl scale-105' : 'bg-white/40 text-gray-500'}`}
                    >
                      <span className="text-2xl">🤵</span> זכר
                    </button>
                    <button 
                      onClick={() => setGender('נקבה')}
                      className={`py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all ${gender === 'נקבה' ? 'bg-[#e84393] text-white shadow-xl scale-105' : 'bg-white/40 text-gray-500'}`}
                    >
                      <span className="text-2xl">💃</span> נקבה
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={!name || !gender}
                    onClick={() => setStep('upload')}
                    className="w-full py-5 rounded-2xl font-black text-xl btn-gradient disabled:opacity-30 disabled:scale-100 disabled:shadow-none"
                  >
                    המשך להעלאה ✨
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upload Step */}
          {step === 'upload' && (
            <div className="glass rounded-[32px] p-10 animate-in">
              <h2 className="text-3xl font-black mb-2 text-gray-800">השלמת פרופיל 📁</h2>
              <p className="text-gray-500 mb-8 font-medium">עבור {name}, הבטח לנו שהרזומה והתמונות משקפים אותך!</p>
              
              <div className="space-y-6">
                <div 
                  onClick={() => resumeRef.current?.click()}
                  className={`group relative overflow-hidden border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center cursor-pointer hover:border-[#6c5ce7] hover:bg-[#6c5ce7]/5 transition-all ${resume ? 'bg-[#a29bfe]/10 border-[#6c5ce7]' : 'bg-white/20'}`}
                >
                  <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={e => setResume(e.target.files?.[0] || null)} />
                  <div className="text-4xl mb-3">{resume ? '✔️' : '📄'}</div>
                  <p className="font-bold text-lg text-gray-700">{resume ? resume.name : 'העלאת קורות חיים / רזומה'}</p>
                  <p className="text-sm text-gray-400">PDF או Word בלבד</p>
                </div>

                <div 
                  onClick={() => photosRef.current?.click()}
                  className={`group relative overflow-hidden border-2 border-dashed border-gray-300 rounded-3xl p-8 text-center cursor-pointer hover:border-[#6c5ce7] hover:bg-[#6c5ce7]/5 transition-all ${photos.length ? 'bg-[#a29bfe]/10 border-[#6c5ce7]' : 'bg-white/20'}`}
                >
                  <input ref={photosRef} type="file" accept="image/*" multiple hidden onChange={e => setPhotos(Array.from(e.target.files || []))} />
                  <div className="text-4xl mb-3">{photos.length ? '📸' : '🖼️'}</div>
                  <p className="font-bold text-lg text-gray-700">{photos.length ? `${photos.length} תמונות נבחרו` : 'העלאת תמונות שלך'}</p>
                  <p className="text-sm text-gray-400">ניתן להעלות עד 5 תמונות</p>
                </div>

                <div className="pt-4 flex gap-4">
                  <button onClick={() => setStep('form')} className="flex-1 py-5 rounded-2xl font-bold bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all">חזרה</button>
                  <button onClick={saveAndAdvance} className="flex-[2] py-5 rounded-2xl font-black text-xl btn-gradient">סיימתי! לשדר 👋</button>
                </div>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="glass rounded-[32px] p-12 text-center animate-in">
              <div className="w-24 h-24 bg-[#6c5ce7] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
                <span className="text-5xl">💝</span>
              </div>
              <h2 className="text-4xl font-black mb-4 text-gray-800">תודה {name}!</h2>
              <p className="text-gray-500 mb-10 text-lg font-medium">הפרטים שלך נקלטו במערכת. השדכנית שלנו כבר בודקת התאמות עבורך.</p>
              
              <div className="bg-white/40 border border-white/50 rounded-2xl p-6 mb-10 text-right space-y-2">
                <p className="font-bold text-[#6c5ce7]">סיכום הרשמה:</p>
                <div className="flex justify-between border-b border-white/30 pb-2">
                  <span className="text-gray-400">שם:</span> <span className="font-bold">{name}</span>
                </div>
                <div className="flex justify-between border-b border-white/30 pb-2">
                  <span className="text-gray-400">מגדר:</span> <span className="font-bold">{gender}</span>
                </div>
                <div className="flex justify-between border-b border-white/30 pb-2">
                  <span className="text-gray-400">קבצים:</span> <span className="font-bold">{resume ? '1' : '0'} רזומה, {photos.length} תמונות</span>
                </div>
              </div>

              <button onClick={reset} className="btn-gradient px-12 py-5 rounded-2xl font-black text-xl shadow-xl">הרשמה חדשה</button>
            </div>
          )}

          {/* Admin Step */}
          {step === 'admin' && (
            <div className="glass rounded-[32px] p-8 animate-in w-full max-w-4xl" style={{ marginLeft: '-100px', marginRight: '-100px', width: 'auto' }}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-800">ניהול נרשמים 📊</h2>
                  <p className="text-gray-500">סה"כ רשומים במאגר: {registrations.length}</p>
                </div>
                <button 
                  onClick={exportCSV}
                  disabled={registrations.length === 0}
                  className="px-6 py-3 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded-2xl font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-30"
                >
                  <span className="text-xl">📥</span> ייצוא ל-Excel
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl bg-white/30 border border-white/40">
                <table className="w-full text-right">
                  <thead>
                    <tr className="bg-white/40">
                      <th className="px-6 py-4 font-black">שם</th>
                      <th className="px-6 py-4 font-black">מגדר</th>
                      <th className="px-6 py-4 font-black">תאריך</th>
                      <th className="px-6 py-4 font-black text-center">מסמכים</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center text-gray-400 italic font-medium">אין נרשמים במאגר כרגע...</td>
                      </tr>
                    ) : (
                      registrations.map(r => (
                        <tr key={r.id} className="hover:bg-white/20 transition-all cursor-default">
                          <td className="px-6 py-4 font-bold">{r.name}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-black ${r.gender === 'זכר' ? 'bg-[#0984e3]/20 text-[#0984e3]' : 'bg-[#e84393]/20 text-[#e84393]'}`}>
                              {r.gender}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 font-medium">{r.date}</td>
                          <td className="px-6 py-4 text-center text-xs font-bold text-gray-400">
                            {r.resumeName !== 'לא הועלה' ? '📄' : ''} {r.photoCount > 0 ? `📸 ${r.photoCount}` : ''}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 w-full glass py-3 text-center text-[10px] font-bold text-white uppercase tracking-[0.2em]">
        MATCHMAKING DATABASE SYSTEMS v2.0 • AI POWERED
      </footer>
    </div>
  );
}
const primaryBtnStyle: React.CSSProperties = { width: '100%', background: 'linear-gradient(135deg, #c2185b, #880e4f)', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 16, fontWeight: 800, cursor: 'pointer', transition: 'opacity 0.2s' };
const secondaryBtnStyle: React.CSSProperties = { background: '#f5f5f5', color: '#555', border: 'none', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer' };
const uploadZoneStyle: React.CSSProperties = { padding: '28px 20px', borderRadius: 16, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' };

// trigger build 1773600508137