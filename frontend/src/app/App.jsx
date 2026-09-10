import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom'; 
import { route } from "./app.route.jsx";
import { useAuth } from '../features/auth/hook/useAuth.js';

const App = () => {
  const { handleGetMe, isInitializing} = useAuth(); 

  useEffect(() => {
    handleGetMe();
   
  }, []);

  if (isInitializing) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        fontFamily: 'Inter, sans-serif',
      }}>
        <img src="/logo.png" alt="Brain Blitz" style={{ width: 44, height: 44, objectFit: 'contain' }} />
        <div style={{ display: 'flex', gap: '6px' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="typing-dot"
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF9F1C, #FF6B00)',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Loading your session…</p>
      </div>
    );
  }

  return (
    <RouterProvider router={route} />
  );
}

export default App;