import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'schools' | 'registrations'>('form');
  const [data, setData] = useState<any[]>([]);

  const fetchData = async (endpoint: string) => {
    try {
      const response = await fetch(`/api/${endpoint}`);
      const json = await response.json();
      setData(json);
      setView(endpoint === 'schools' ? 'schools' : 'registrations');
    } catch (error) {
      console.error('Chyba:', error);
    }
  };

  const RegistrationForm = () => {
  const [formData, setFormData] = useState({ schoolName: '', schoolAddress: '', schoolCity: '', schoolZip: '', schoolWeb: '', teamName: '', tournamentTermId: '1' });
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, tournamentTermId: parseInt(formData.tournamentTermId) }),
    });
    alert('Registrováno!');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
      <input name="schoolName" onChange={(e) => setFormData({...formData, schoolName: e.target.value})} placeholder="Škola" />
      <input name="teamName" onChange={(e) => setFormData({...formData, teamName: e.target.value})} placeholder="Tým" />
      <select name="tournamentTermId" onChange={(e) => setFormData({...formData, tournamentTermId: e.target.value})}>
        <option value="1">20.11.</option>
        <option value="2">21.11.</option>
        <option value="3">22.11.</option>
      </select>
      <button type="submit">Registrovat</button>
    </form>
  );
};

  return (
    <div style={{ padding: '20px' }}>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('form')}>Registrace</button>
        <button onClick={() => fetchData('schools')}>Školy</button>
        <button onClick={() => fetchData('registrations')}>Registrace (seznam)</button>
      </nav>

      {view === 'form' && <RegistrationForm />}
      {view !== 'form' && (
        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{data.length > 0 && Object.keys(data[0]).map(k => <th key={k}>{k}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>{Object.values(item).map((val: any, j) => <td key={j}>{val?.toString()}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
