import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App(){
  const [title, setTitle] = useState('');
  const [resumes, setResumes] = useState([]);

  const fetch = async () => {
    try {
      const r = await axios.get('http://localhost:8080/api/resumes/user/1');
      setResumes(r.data);
    } catch(e){ console.error(e); }
  };

  useEffect(()=>{ fetch(); }, []);

  const create = async () => {
    try {
      await axios.post('http://localhost:8080/api/resumes', { title, templateName: 'default' });
      setTitle(''); fetch();
    } catch(e){ console.error(e); }
  };

  const exportPdf = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/resumes/${id}/export/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url; a.download = `resume-${id}.pdf`; document.body.appendChild(a); a.click(); a.remove();
    } catch(e){ console.error(e); alert('Export failed. Make sure backend is running.'); }
  };

  return (
    <div className="container">
      <h1>Online Resume Builder</h1>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Resume title" />
        <button onClick={create}>Create</button>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
        {resumes.map(r=>(
          <div key={r.id} className="card">
            <h3>{r.title}</h3>
            <p>Template: {r.templateName}</p>
            <div style={{display:'flex', gap:8}}>
              <button onClick={()=>exportPdf(r.id)}>Export PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
