import React, { useState, useEffect } from 'react';
import MapView from './components/Map/MapView';
import './App.css';

// Dados mockados (substitua pelo import do JSON depois)
import markersData from './data/markers.json';

interface Marker {
  id: string;
  lat: number;
  lng: number;
  nome: string;
  descricao: string;
  tipo: string;
  categoria: string;
}

function App() {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento assíncrono (preparado para API futura)
    const loadMarkers = async () => {
      try {
        // No futuro: const response = await fetch('/api/markers');
        // Por enquanto, usa o JSON importado
        setMarkers(markersData);
      } catch (error) {
        console.error('Erro ao carregar marcadores:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMarkers();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white'
      }}>
        Carregando mapa...
      </div>
    );
  }

  return (
    <div className="App">
      <MapView markers={markers} />
    </div>
  );
}

export default App;