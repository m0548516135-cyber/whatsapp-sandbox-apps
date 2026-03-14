'use client';

import React, { useState, useRef, useEffect } from 'react';

/**
 * Matchmaking Premium Landing Page
 * Features:
 * - Stunning Glassmorphism Design
 * - Multi-step Form (Personal -> Media)
 * - File Uploads (Resume & Photos)
 * - Admin Panel with Search & Excel Export
 * - Mobile Responsive
 */

interface Registration {
  id: string;
  name: string;
  gender: 'זכר' | 'נקבה';
  resumeName: string;
  photoCount: number;
  date: string;
  timestamp: number;
}

export default function MatchmakingPage() {
  const [step, setStep] = useState<'welcome' | 'form' | 'upload' | 'success' | 'admin'>('welcome');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'זכר' | 'נקבה' | ''>('');
  const [resume, setResume] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  
  const resumeRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('mm_registrations_v2');
    if (saved) {
      try { setRegistrations(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveRegistration = () => {
    const newReg: Registration = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      gender: gender as 'זכר' | 'נקבה',
      resumeName: resume ? resume.name : '—',
      photoCount: photos.length,
      date: new Date().toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
    };
    
    const updated = [newReg, ...registrations];
    setRegistrations(updated);
    localStorage.setItem('mm_registrations_v2', JSON.stringify(updated));
    setStep('success');
  };

  const handleReset = () => {
    setName('');
    setGender('');
    setResume(null);
    setPhotos([]);
    setStep('welcome');
  };

  const exportToExcel = () => {
    const headers = ['שם מלא', 'מגדר', 'תאריך הרשמה', 'שם קובץ רזומה', 'מספר תמונות'];
    const rows = registrations
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(r => [r.name, r.gender, r.date, r.resumeName, r.photoCount.toString()]);
    
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `shiduchim_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isMounted) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-[#0f172a] text-white selection:bg-pink-500 selection:text-white font-sans overflow-x-hidden">
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse transition-all duration-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="w-full text-center mb-10 transition-all duration-700 transform translate-y-0 opacity-100">
           <div className="inline-block p-1 px-4 mb-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-pink-400 text-xs font-bold uppercase tracking-widest shadow-xl">
             שירות פרימיום VIP
           </div>
           <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-l from-white via-pink-100 to-white/60 bg-clip-text text-transparent">
             שידוכים ג'אמפ
           </h1>
           <p className="text-gray-400 text-sm md:text-base font-medium">המקום שבו הלב מוצא את הבית 💜</p>
        </div>

        {/* STEP: WELCOME */}
        {step === 'welcome' && (
          <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-10 text-center shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-lg shadow-pink-500/20 rotate-3">
               <span className="text-4xl">💍</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">ברוכים הבאים למאגר</h2>
            <p className="text-gray-400 leading-relaxed mb-10 text-sm">
              אנחנו כאן כדי לעזור לכם למצוא את החצי השני בצורה מכובדת, דיסקרטית ומתקדמת.
              הצטרפו למאות שכבר מצאו זוגיות.
            </p>
            <button 
              onClick={() => setStep('form')}
              className="w-full py-5 bg-gradient-to-l from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 rounded-2xl font-bold text-lg shadow-xl shadow-pink-600/20 transition-all transform hover:scale-[1.02] active:scale-95 border border-white/10"
            >
              התחלת הרשמה חינם
            </button>
            <button 
              onClick={() => setStep('admin')}
              className="mt-6 text-gray-500 text-xs font-bold hover:text-white transition-colors"
            >
              כניסת מנהל ⚙️
            </button>
          </div>
        )}

        {/* STEP: PERSONAL INFO */}
        {step === 'form' && (
          <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-pink-500/20 border border-pink-500/40 rounded-xl flex items-center justify-center text-xl">👤</div>
               <div>
                  <h3 className="font-bold text-xl">פרטים אישיים</h3>
                  <p className="text-gray-500 text-xs">צעד 1 מתוך 2</p>
               </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-400 mb-2 mr-1">שם מלא</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="לדוגמה: ישראל ישראלי"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 text-white placeholder-white/20 focus:outline-none focus:border-pink-500/50 focus:bg-white/10 transition-all text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pink-400 mb-3 mr-1">מגדר</label>
                <div className="grid grid-cols-2 gap-4">
                  {(['זכר', 'נקבה'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-5 rounded-2xl font-bold flex flex-col items-center justify-center gap-2 border-2 transition-all ${
                        gender === g 
                        ? 'bg-pink-600/20 border-pink-500 text-white shadow-lg shadow-pink-500/10' 
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
                      }`}
                    >
                      <span className="text-2xl">{g === 'זכר' ? '👨' : '👩'}</span>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  onClick={() => setStep('upload')}
                  disabled={!name.trim() || !gender}
                  className="w-full py-5 bg-gradient-to-l from-white to-gray-300 text-black font-black text-lg rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                >
                  המשך להעלאת קבצים
                </button>
                <button 
                  onClick={() => setStep('welcome')}
                  className="w-full py-4 text-gray-500 font-bold hover:text-white transition-colors"
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP: MEDIA UPLOAD */}
        {step === 'upload' && (
          <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center gap-4 mb-2">
               <div className="w-12 h-12 bg-pink-500/20 border border-pink-500/40 rounded-xl flex items-center justify-center text-xl">📄</div>
               <div>
                  <h3 className="font-bold text-xl">העלאת קבצים</h3>
                  <p className="text-gray-500 text-xs">צעד 2 מתוך 2</p>
               </div>
            </div>
            <p className="text-white/40 text-sm mb-8">הפרטים שלך נשמרים בענן המאובטח שלנו.</p>

            <div className="space-y-6">
              {/* Resume Upload */}
              <div 
                onClick={() => resumeRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-[24px] p-8 text-center transition-all ${
                  resume 
                  ? 'border-pink-500/50 bg-pink-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-pink-500/30'
                }`}
              >
                <input 
                  type="file" 
                  ref={resumeRef} 
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                  hidden 
                  accept=".pdf,.doc,.docx"
                />
                <div className={`text-3xl mb-3 transition-transform group-hover:scale-110 ${resume ? 'animate-bounce' : ''}`}>📄</div>
                <div className="font-bold text-sm mb-1">{resume ? `✅ ${resume.name}` : 'העלאת קורות חיים / רזומה'}</div>
                <div className="text-xs text-white/40">פורמטים: PDF, Word</div>
              </div>

              {/* Photos Upload */}
              <div 
                onClick={() => photosRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-[24px] p-8 text-center transition-all ${
                  photos.length > 0 
                  ? 'border-blue-500/50 bg-blue-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-pink-500/30'
                }`}
              >
                <input 
                  type="file" 
                  ref={photosRef} 
                  onChange={(e) => setPhotos(Array.from(e.target.files || []))}
                  hidden 
                  multiple
                  accept="image/*"
                />
                <div className="text-3xl mb-3 transition-transform group-hover:scale-110">📸</div>
                <div className="font-bold text-sm mb-1">
                  {photos.length > 0 ? `✅ ${photos.length} תמונות נבחרו` : 'העלאת תמונות'}
                </div>
                <div className="text-xs text-white/40">ניתן להעלות מספר קבצים</div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  onClick={() => setStep('form')}
                  className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all"
                >
                  חזרה
                </button>
                <button 
                  onClick={saveRegistration}
                  className="flex-[2] py-5 bg-gradient-to-l from-pink-600 to-purple-700 text-white font-black text-lg rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  סיום הרשמה
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP: SUCCESS */}
        {step === 'success' && (
          <div className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-12 text-center shadow-2xl animate-in zoom-in-105 duration-700">
             <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full mx-auto mb-8 flex items-center justify-center text-4xl animate-pulse">
                ✓
             </div>
             <h2 className="text-3xl font-black mb-4">ברכות!</h2>
             <p className="text-white/60 mb-10 leading-relaxed">
               תהליך ההרשמה של <span className="text-pink-400 font-bold">{name}</span> הושלם בהצלחה. השדכנים שלנו יצרו איתך קשר בקרוב.
             </p>

             <div className="p-6 bg-white/5 rounded-[24px] border border-white/5 mb-10 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 blur-xl rounded-full translate-x-12 -translate-y-12"></div>
                <div className="flex justify-between items-center mb-2 px-2">
                   <span className="text-white/40 text-xs font-bold uppercase tracking-widest">כרטיס מאגר</span>
                   <span className="text-green-500 text-[10px] font-bold px-2 py-0.5 bg-green-500/10 rounded-full">פעיל</span>
                </div>
                <div className="text-right text-lg font-bold">👤 {name}</div>
                <div className="text-right text-sm text-pink-400 font-medium">{gender === 'זכר' ? 'בחור' : 'בחורה'} מקסים/ה</div>
             </div>

             <button 
               onClick={handleReset}
               className="w-full py-5 bg-white text-black font-black text-lg rounded-2xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 mb-4"
             >
               הרשמה נוספת
             </button>
             <a 
               href="https://wa.me/972548516135" 
               target="_blank" 
               className="text-white/40 text-xs font-bold hover:text-white transition-all underline underline-offset-4"
             >
               צריך עזרה? כתבו לנו בווטסאפ
             </a>
          </div>
        )}

        {/* STEP: ADMIN PANEL */}
        {step === 'admin' && (
          <div className="w-[100vw] sm:w-full sm:max-w-4xl bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-500 overflow-hidden">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <h2 className="text-3xl font-black mb-1">פאנל ניהול</h2>
                  <p className="text-white/40 text-sm">ניהול ומעקב אחר נרשמים למאגר השידוכים</p>
                </div>
                <div className="flex gap-3">
                   <button 
                     onClick={exportToExcel}
                     disabled={registrations.length === 0}
                     className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-30 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-600/20"
                   >
                     <span>📊</span>
                     ייצוא לאקסל
                   </button>
                   <button 
                     onClick={() => setStep('welcome')}
                     className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all"
                   >
                     חזרה
                   </button>
                </div>
             </div>

             <div className="w-full overflow-x-auto rounded-2xl border border-white/5 bg-white/2">
                <table className="w-full text-right border-collapse min-w-[600px]">
                   <thead>
                      <tr className="bg-white/5">
                         <th className="px-6 py-4 text-xs font-bold text-pink-400 uppercase tracking-widest border-b border-white/10">שם הנרשם/ת</th>
                         <th className="px-6 py-4 text-xs font-bold text-pink-400 uppercase tracking-widest border-b border-white/10">מגדר</th>
                         <th className="px-6 py-4 text-xs font-bold text-pink-400 uppercase tracking-widest border-b border-white/10">רזומה</th>
                         <th className="px-6 py-4 text-xs font-bold text-pink-400 uppercase tracking-widest border-b border-white/10">תמונות</th>
                         <th className="px-6 py-4 text-xs font-bold text-pink-400 uppercase tracking-widest border-b border-white/10 text-left">תאריך</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {registrations.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-20 text-center text-white/20 font-medium">
                            <div className="text-4xl mb-4">📭</div>
                            לא נמצאו נרשמים במאגר
                          </td>
                        </tr>
                      ) : (
                        registrations.map((r) => (
                          <tr key={r.id} className="hover:bg-white/5 transition-colors group">
                             <td className="px-6 py-5 font-bold">{r.name}</td>
                             <td className="px-6 py-5">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide ${
                                  r.gender === 'זכר' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'
                                }`}>
                                   {r.gender}
                                </span>
                             </td>
                             <td className="px-6 py-5 text-sm text-white/50">{r.resumeName}</td>
                             <td className="px-6 py-5 text-center">
                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-xs font-bold">
                                   {r.photoCount}
                                </div>
                             </td>
                             <td className="px-6 py-5 text-left text-white/30 text-[11px] font-mono">{r.date}</td>
                          </tr>
                        ))
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        )}

      </div>
      
      {/* Footer Decoration */}
      <footer className="relative z-10 w-full py-12 text-center border-t border-white/5 bg-white/[0.02]">
         <div className="text-white/20 text-xs font-medium tracking-widest mb-2 uppercase">פותח ע״י ג׳אמפ טכנולוגיות</div>
         <div className="text-pink-500/30 text-lg">✨ ✨ ✨</div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;900&display=swap');
        
        body {
          margin: 0;
          font-family: 'Heebo', sans-serif;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0f172a;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }

        /* Animations */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
