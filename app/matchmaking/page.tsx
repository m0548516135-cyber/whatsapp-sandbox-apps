'use client';

import React, { useState, useRef } from 'react';

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
  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('mm_registrations') || '[]'); } catch { return []; }
    }
    return [];
  });
  const resumeRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<HTMLInputElement>(null);

  const saveAndAdvance = () => {
    const reg: Registration = {
      id: Date.now(),
      name,
      gender: gender as 'זכר' | 'נקבה',
      resumeName: resume ? resume.name : '—',
      photoCount: photos.length,
      date: new Date().toLocaleString('he-IL'),
    };
    const updated = [reg, ...registrations];
    setRegistrations(updated);
    if (typeof window !== 'undefined') localStorage.setItem('mm_registrations', JSON.stringify(updated));
    setStep('success');
  };

  const reset = () => {
    setName(''); setGender(''); setResume(null); setPhotos([]); setStep('form');
  };

  const exportCSV = () => {
    const header = 'שם,מגדר,תאריך,קובץ רזומה,מספר תמונות';
    const rows = registrations.map(r =>
      `"${r.name}","${r.gender}","${r.date}","${r.resumeName}","${r.photoCount}"`
    );
    const csv = '\uFEFF' + [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'shiduchim.csv';
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 50%, #e8d5f5 100%)', fontFamily: 'Heebo, Arial, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px' }}>
      
      {/* Header */}
      <div style={{ width: '100%', maxWidth: 520, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#880e4f', letterSpacing: '-0.5px' }}>
          💍 שידוכים בקליק
        </h1>
        <button onClick={() => setStep(step === 'admin' ? 'form' : 'admin')}
          style={{ background: step === 'admin' ? '#880e4f' : 'rgba(136,14,79,0.1)', color: step === 'admin' ? '#fff' : '#880e4f', border: 'none', borderRadius: 20, padding: '7px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
          {step === 'admin' ? '← חזרה' : '⚙️ ניהול'}
        </button>
      </div>

      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* STEP 1: Form */}
        {step === 'form' && (
          <div style={{ background: '#fff', borderRadius: 24, padding: '36px 32px', boxShadow: '0 8px 40px rgba(136,14,79,0.13)' }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>הרשמה למאגר השידוכים</h2>
            <p style={{ margin: '0 0 28px', color: '#888', fontSize: 14 }}>מלא פרטים בסיסיים כדי להיכלל במאגר</p>

            {/* Name */}
            <label style={labelStyle}>שם מלא</label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="ישראל ישראלי"
              style={{ ...inputStyle, marginBottom: 24 }} />

            {/* Gender */}
            <label style={labelStyle}>מגדר</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
              {(['זכר', 'נקבה'] as const).map(g => (
                <button key={g} onClick={() => setGender(g)}
                  style={{ ...genderBtnStyle, background: gender === g ? (g === 'זכר' ? '#e3f2fd' : '#fce4ec') : '#f9f9f9', border: `2px solid ${gender === g ? (g === 'זכר' ? '#1565c0' : '#c2185b') : '#e8e8e8'}`, color: gender === g ? (g === 'זכר' ? '#1565c0' : '#c2185b') : '#555' }}>
                  {g === 'זכר' ? '👨 זכר' : '👩 נקבה'}
                </button>
              ))}
            </div>

            <button onClick={() => setStep('upload')} disabled={!name.trim() || !gender}
              style={{ ...primaryBtnStyle, opacity: (!name.trim() || !gender) ? 0.5 : 1 }}>
              המשך להעלאת קבצים ←
            </button>
          </div>
        )}

        {/* STEP 2: File Upload */}
        {step === 'upload' && (
          <div style={{ background: '#fff', borderRadius: 24, padding: '36px 32px', boxShadow: '0 8px 40px rgba(136,14,79,0.13)' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>העלאת קבצים</h2>
            <p style={{ margin: '0 0 28px', color: '#888', fontSize: 14 }}>עבור: <strong style={{ color: '#880e4f' }}>{name}</strong> ({gender})</p>

            {/* Resume */}
            <div onClick={() => resumeRef.current?.click()}
              style={{ ...uploadZoneStyle, border: `2px dashed ${resume ? '#c2185b' : '#e0c0d0'}`, background: resume ? '#fdf0f5' : '#fafafa', marginBottom: 16 }}>
              <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" hidden onChange={e => setResume(e.target.files?.[0] || null)} />
              <div style={{ fontSize: 32, marginBottom: 6 }}>📄</div>
              <div style={{ fontWeight: 700, color: '#880e4f', fontSize: 15 }}>{resume ? `✅ ${resume.name}` : 'העלאת קורות חיים / רזומה'}</div>
              <div style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>PDF, Word — לחץ לבחירה</div>
            </div>

            {/* Photos */}
            <div onClick={() => photosRef.current?.click()}
              style={{ ...uploadZoneStyle, border: `2px dashed ${photos.length ? '#c2185b' : '#e0c0d0'}`, background: photos.length ? '#fdf0f5' : '#fafafa', marginBottom: 28 }}>
              <input ref={photosRef} type="file" accept="image/*" multiple hidden onChange={e => setPhotos(Array.from(e.target.files || []))} />
              <div style={{ fontSize: 32, marginBottom: 6 }}>🖼️</div>
              <div style={{ fontWeight: 700, color: '#880e4f', fontSize: 15 }}>{photos.length ? `✅ ${photos.length} תמונות נבחרו` : 'העלאת תמונות'}</div>
              <div style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>ניתן לבחור מספר תמונות — לחץ לבחירה</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
              <button onClick={() => setStep('form')} style={secondaryBtnStyle}>← חזרה</button>
              <button onClick={saveAndAdvance} style={primaryBtnStyle}>סיום הרשמה ✓</button>
            </div>
          </div>
        )}

        {/* STEP 3: Success */}
        {step === 'success' && (
          <div style={{ background: '#fff', borderRadius: 24, padding: '48px 32px', boxShadow: '0 8px 40px rgba(136,14,79,0.13)', textAlign: 'center' }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>💍</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', margin: '0 0 12px' }}>נרשמת בהצלחה!</h2>
            <p style={{ color: '#666', fontSize: 15, marginBottom: 32 }}>הפרטים שלך נשמרו וממתינים לטיפול. נחזור אליך בקרוב! 💜</p>
            <div style={{ background: '#fce4ec', borderRadius: 16, padding: '16px 24px', marginBottom: 28, textAlign: 'right' }}>
              <div style={{ color: '#880e4f', fontWeight: 700, marginBottom: 4 }}>פרטי ההרשמה:</div>
              <div style={{ color: '#555', fontSize: 14 }}>👤 {name} | {gender === 'זכר' ? '👨' : '👩'} {gender}</div>
              {resume && <div style={{ color: '#555', fontSize: 14 }}>📄 {resume.name}</div>}
              {photos.length > 0 && <div style={{ color: '#555', fontSize: 14 }}>🖼️ {photos.length} תמונות</div>}
            </div>
            <button onClick={reset} style={{ ...primaryBtnStyle, maxWidth: 200 }}>הרשמה נוספת</button>
            <div style={{ marginTop: 16 }}>
              <a href="https://whatsapp-sandbox-apps.vercel.app" target="_blank" rel="noopener noreferrer"
                style={{ color: '#c2185b', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                🔗 לאתר הראשי
              </a>
            </div>
          </div>
        )}

        {/* STEP 4: Admin */}
        {step === 'admin' && (
          <div style={{ background: '#fff', borderRadius: 24, padding: '32px 28px', boxShadow: '0 8px 40px rgba(136,14,79,0.13)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#1a1a2e' }}>ניהול נרשמים</h2>
                <p style={{ margin: 0, color: '#aaa', fontSize: 13 }}>סה״כ: {registrations.length} נרשמים</p>
              </div>
              <button onClick={exportCSV} disabled={registrations.length === 0}
                style={{ background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: registrations.length === 0 ? 0.4 : 1 }}>
                📊 ייצוא Excel
              </button>
            </div>
            {registrations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#bbb' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <div>אין נרשמים עדיין</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#fce4ec' }}>
                      {['שם', 'מגדר', 'תאריך', 'רזומה', 'תמונות'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#880e4f', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((r, i) => (
                      <tr key={r.id} style={{ background: i % 2 === 0 ? '#fff' : '#fdf8fb', borderBottom: '1px solid #f5e6ed' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>{r.name}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ background: r.gender === 'זכר' ? '#e3f2fd' : '#fce4ec', color: r.gender === 'זכר' ? '#1565c0' : '#c2185b', borderRadius: 10, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{r.gender}</span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#888', fontSize: 11 }}>{r.date}</td>
                        <td style={{ padding: '10px 12px', color: '#555', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.resumeName}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>{r.photoCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 700, color: '#444', fontSize: 14, marginBottom: 8 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '13px 16px', border: '2px solid #e8e8e8', borderRadius: 12, fontSize: 15, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' };
const genderBtnStyle: React.CSSProperties = { padding: '16px', borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 };
const primaryBtnStyle: React.CSSProperties = { width: '100%', background: 'linear-gradient(135deg, #c2185b, #880e4f)', color: '#fff', border: 'none', borderRadius: 14, padding: '15px', fontSize: 16, fontWeight: 800, cursor: 'pointer', transition: 'opacity 0.2s' };
const secondaryBtnStyle: React.CSSProperties = { background: '#f5f5f5', color: '#555', border: 'none', borderRadius: 14, padding: '15px', fontSize: 15, fontWeight: 700, cursor: 'pointer' };
const uploadZoneStyle: React.CSSProperties = { padding: '28px 20px', borderRadius: 16, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' };
