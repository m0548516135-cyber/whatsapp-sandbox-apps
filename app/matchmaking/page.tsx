'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Registration {
  id: number;
  name: string;
  gender: 'זכר' | 'נקבה';
  resumeName: string;
  photoCount: number;
  date: string;
  age?: string;
  location?: string;
  description?: string;
}

export default function DatingMatchmakerPage() {
  const [step, setStep] = useState<'landing' | 'form' | 'upload' | 'success' | 'admin' | 'browse'>('landing');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'זכר' | 'נקבה' | ''>('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
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
      age: age || '24',
      location: location || 'ירושלים',
      resumeName: resume ? resume.name : 'לא הועלה',
      photoCount: photos.length,
      date: new Date().toLocaleString('he-IL'),
    };
    const updated = [reg, ...registrations];
    setRegistrations(updated);
    localStorage.setItem('mm_registrations', JSON.stringify(updated));
    setStep('success');
  };

  const exportCSV = () => {
    const header = '\uFEFFשם,מגדר,גיל,עיר,תאריך הרשמה,קובץ רזומה,כמות תמונות';
    const rows = registrations.map(r =>
      `"${r.name}","${r.gender}","${r.age}","${r.location}","${r.date}","${r.resumeName}","${r.photoCount}"`
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'מאגר_הכרויות_רשומים.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) return null;

  return (
    <div dir="rtl" className="min-h-screen relative overflow-hidden" style={{ 
      background: '#fff5f7', 
      fontFamily: "'Heebo', sans-serif",
      color: '#2d3436'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700;900&family=Assistant:wght@300;400;700;800&display=swap');
        
        body { margin: 0; padding: 0; }
        
        .dating-bg {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 10% 20%, rgba(255, 175, 189, 0.4) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(255, 195, 160, 0.4) 0%, transparent 40%);
          z-index: 0;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 15px 45px rgba(255, 107, 129, 0.1);
          border-radius: 40px;
        }

        .heart-float {
          animation: heartFloat 3s ease-in-out infinite;
        }

        @keyframes heartFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .btn-love {
          background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
          color: white;
          box-shadow: 0 10px 25px rgba(255, 71, 87, 0.3);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .btn-love:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 15px 35px rgba(255, 71, 87, 0.4);
        }

        .profile-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          border-radius: 30px;
        }

        .animate-in {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div className="dating-bg" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full px-8 py-5 flex justify-between items-center z-50 bg-white/40 backdrop-blur-md border-b border-white/20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStep('landing')}>
          <div className="w-10 h-10 bg-gradient-to-tr from-[#ff4757] to-[#ffa502] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl">❤️</span>
          </div>
          <span className="text-2xl font-black italic tracking-tighter text-[#ff4757]">TrueMatch</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button onClick={() => setStep('admin')} className="text-sm font-bold text-gray-400 hover:text-[#ff4757] transition-colors">ניהול</button>
          <button 
            onClick={() => setStep('form')}
            className="px-6 py-2.5 rounded-full font-black text-sm btn-love"
          >
            להצטרפות חינם
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-28 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        
        {/* Landing Page */}
        {step === 'landing' && (
          <div className="flex flex-col md:flex-row items-center gap-16 animate-in w-full text-center md:text-right">
            <div className="flex-1 space-y-8">
              <span className="inline-block px-5 py-2 rounded-full bg-[#ff4757]/10 text-[#ff4757] font-bold text-sm tracking-wider uppercase">
                ✨ גלה את האהבה האמיתית שלך
              </span>
              <h2 className="text-6xl md:text-8xl font-black text-gray-900 leading-[1.1]">
                כאן מתחילים <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4757] to-[#ffa502]">
                  סיפורי אהבה
                </span>
              </h2>
              <p className="text-xl text-gray-500 max-w-xl md:mr-0 font-medium leading-relaxed">
                הצטרפו למאגר ההכרויות הגדול והאיכותי ביותר. טכנולוגיית ההתאמה שלנו עוזרת לכם למצוא את האחד/ת באמת.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 pt-4">
                <button onClick={() => setStep('form')} className="px-12 py-5 rounded-[22px] font-black text-xl btn-love flex items-center justify-center gap-3">
                   הצטרפו עכשיו <span className="text-2xl">💍</span>
                </button>
                <button onClick={() => setStep('browse')} className="px-12 py-5 rounded-[22px] font-black text-xl bg-white border-2 border-gray-100 text-gray-700 hover:border-[#ff4757]/30 transition-all shadow-sm">
                  לצפות במאגר
                </button>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <div className="heart-float">
                <div className="relative w-80 h-[500px] md:w-[400px] md:h-[600px] bg-gray-200 rounded-[50px] shadow-2xl skew-y-3 overflow-hidden border-[12px] border-white ring-2 ring-pink-100">
                  <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale-[0.2]" alt="Portrait" />
                  <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/80 to-transparent text-white text-right">
                    <p className="text-3xl font-black italic">אתי, 26</p>
                    <p className="text-lg opacity-80 font-bold">מעצבת פנים, ירושלים</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Form */}
        {step === 'form' && (
          <div className="w-full max-w-xl glass-card p-12 animate-in">
            <h2 className="text-4xl font-black mb-2">קצת עליך... ✨</h2>
            <p className="text-gray-400 mb-10 font-bold">תספר לנו את הבסיס, אנחנו נדאג לשאר.</p>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-black text-gray-600 mb-3 mr-2">שם פרטי ומשפחה</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="ישראל ישראלי" 
                  className="w-full h-16 px-8 rounded-3xl bg-white/50 border-2 border-transparent focus:border-[#ff4757]/30 outline-none text-xl font-bold transition-all shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-gray-600 mb-3 mr-2">גיל</label>
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="24" className="w-full h-16 px-8 rounded-3xl bg-white/50 border-2 border-transparent outline-none text-xl font-bold" />
                </div>
                <div>
                  <label className="block text-sm font-black text-gray-600 mb-3 mr-2">עיר מגורים</label>
                  <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="בני ברק" className="w-full h-16 px-8 rounded-3xl bg-white/50 border-2 border-transparent outline-none text-xl font-bold" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-gray-600 mb-4 mr-2">מה המגדר שלך?</label>
                <div className="grid grid-cols-2 gap-5">
                  <button onClick={() => setGender('זכר')} className={`h-20 rounded-[28px] text-2xl font-black flex items-center justify-center gap-4 transition-all ${gender === 'זכר' ? 'bg-[#ff4757] text-white shadow-xl scale-105' : 'bg-white/60 text-gray-400'}`}>
                    <span>🤵</span> זכר
                  </button>
                  <button onClick={() => setGender('נקבה')} className={`h-20 rounded-[28px] text-2xl font-black flex items-center justify-center gap-4 transition-all ${gender === 'נקבה' ? 'bg-[#ff4757] text-white shadow-xl scale-105' : 'bg-white/60 text-gray-400'}`}>
                    <span>💃</span> נקבה
                  </button>
                </div>
              </div>

              <button disabled={!name || !gender} onClick={() => setStep('upload')} className="w-full h-20 rounded-[28px] text-2xl font-black btn-love disabled:opacity-20 transform hover:scale-[1.02]">
                בוא נמשיך! ✨
              </button>
            </div>
          </div>
        )}

        {/* Step: Upload */}
        {step === 'upload' && (
          <div className="w-full max-w-xl glass-card p-12 animate-in text-center">
            <h2 className="text-3xl font-black mb-8">כמעט שם! 📸</h2>
            <div className="space-y-6 text-right">
              <div onClick={() => resumeRef.current?.click()} className={`p-10 rounded-[35px] border-4 border-dashed cursor-pointer transition-all ${resume ? 'bg-[#ff4757]/10 border-[#ff4757]' : 'bg-white/40 border-gray-100 hover:border-[#ff4757]/30'}`}>
                <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={e => setResume(e.target.files?.[0] || null)} />
                <div className="text-5xl mb-4 text-center">📄</div>
                <p className="text-xl font-black text-center">{resume ? resume.name : 'העלאת רזומה / קורות חיים'}</p>
                <p className="text-sm text-gray-400 text-center mt-2">רצוי קובץ PDF מסודר</p>
              </div>

              <div onClick={() => photosRef.current?.click()} className={`p-10 rounded-[35px] border-4 border-dashed cursor-pointer transition-all ${photos.length ? 'bg-[#ff4757]/10 border-[#ff4757]' : 'bg-white/40 border-gray-100 hover:border-[#ff4757]/30'}`}>
                <input ref={photosRef} type="file" accept="image/*" multiple hidden onChange={e => setPhotos(Array.from(e.target.files || []))} />
                <div className="text-5xl mb-4 text-center">📸</div>
                <p className="text-xl font-black text-center">{photos.length ? `${photos.length} תמונות הועלו` : 'העלאת תמונות שלך'}</p>
                <p className="text-sm text-gray-400 text-center mt-2">תמונות מחייכות עוזרות יותר! 😁</p>
              </div>

              <div className="pt-6 flex gap-4">
                <button onClick={() => setStep('form')} className="flex-1 h-20 rounded-[28px] font-bold text-gray-400 border-2 border-gray-100">חזרה</button>
                <button onClick={saveAndAdvance} className="flex-[2] h-20 rounded-[28px] text-2xl font-black btn-love">שלח למערכת ❤️</button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="w-full max-w-xl glass-card p-16 text-center animate-in">
            <div className="w-32 h-32 bg-[#ff4757] rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
              <span className="text-6xl animate-pulse">🎁</span>
            </div>
            <h2 className="text-5xl font-black mb-6">תודה, {name}!</h2>
            <p className="text-xl text-gray-400 font-bold mb-12">הגעת למקום הנכון. השדכנים שלנו קיבלו את הפרטים ומחפשים עבורך את ההתאמה המנצחת!</p>
            <button onClick={() => setStep('landing')} className="btn-love px-16 py-6 rounded-[30px] text-2xl font-black">חזרה לדף הבית</button>
          </div>
        )}

        {/* Step: Browse */}
        {step === 'browse' && (
          <div className="w-full animate-in">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-5xl font-black italic">הפרופילים שלנו ✨</h2>
              <button onClick={() => setStep('form')} className="text-[#ff4757] font-black text-lg border-b-2 border-[#ff4757]">גם אני רוצה להצטרף ←</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {registrations.length === 0 ? (
                <p className="col-span-full text-center py-20 text-2xl text-gray-300 font-bold italic">המאגר מתעדכן כרגע... בוא להיות הראשון!</p>
              ) : (
                registrations.map(r => (
                  <div key={r.id} className="glass-card overflow-hidden group hover:-translate-y-4 transition-all duration-500">
                    <div className="p-4 relative">
                      <div className="h-80 w-full bg-pink-50 rounded-[30px] overflow-hidden">
                        <img src={`https://i.pravatar.cc/400?u=${r.id}`} className="w-full h-full object-cover grayscale-[0.2]" alt="User" />
                      </div>
                      <div className="absolute top-8 left-8">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${r.gender === 'זכר' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                          {r.gender}
                        </span>
                      </div>
                    </div>
                    <div className="px-8 pb-8 pt-2">
                       <h3 className="text-3xl font-black mb-1">{r.name}, {r.age || 24}</h3>
                       <p className="text-gray-400 font-bold mb-6 italic">{r.location || 'ירושלים'}</p>
                       <button className="w-full py-4 rounded-2xl bg-gray-50 text-gray-400 font-black hover:bg-[#ff4757] hover:text-white transition-all">הצג פרופיל מלא</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {step === 'admin' && (
          <div className="w-full max-w-6xl glass-card p-12 animate-in overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-black">לוח ניהול 🎩</h2>
                <p className="text-gray-400 font-bold">סה"כ {registrations.length} רשומים במאגר</p>
              </div>
              <div className="flex gap-4">
                 <button onClick={exportCSV} className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-black shadow-lg hover:shadow-emerald-200 transition-all flex items-center gap-2">
                   <span>📊</span> ייצוא אקסל
                 </button>
                 <button onClick={() => setStep('landing')} className="px-10 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black">יציאה</button>
              </div>
            </div>

            <div className="rounded-[35px] border-2 border-gray-50 bg-white/20 overflow-hidden">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-6 font-black text-gray-400 uppercase text-xs">שם</th>
                    <th className="px-8 py-6 font-black text-gray-400 uppercase text-xs">פרטים</th>
                    <th className="px-8 py-6 font-black text-gray-400 uppercase text-xs">תאריך הצטרפות</th>
                    <th className="px-8 py-6 font-black text-gray-400 uppercase text-xs text-center">מסמכים</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/40">
                  {registrations.map(r => (
                    <tr key={r.id}>
                      <td className="px-8 py-6 font-black text-xl">{r.name}</td>
                      <td className="px-8 py-6">
                         <span className={`px-4 py-1.5 rounded-full text-xs font-black ${r.gender === 'זכר' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                           {r.gender} | גיל {r.age || 24} | {r.location || 'ירושלים'}
                         </span>
                      </td>
                      <td className="px-8 py-6 text-gray-400 font-medium text-sm">{r.date}</td>
                      <td className="px-8 py-6 text-center flex justify-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.resumeName !== 'לא הועלה' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-300'}`}>📄</div>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.photoCount > 0 ? 'bg-amber-50 text-amber-500' : 'bg-gray-50 text-gray-300'}`}>📸</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
