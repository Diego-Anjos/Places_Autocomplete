import { useState } from 'react';
import { AddressAutocomplete } from './components/AddressAutocomplete';
import type { NominatimResult } from './hooks/useNominatim';
import './App.css';

function App() {
  const [selectedAddress, setSelectedAddress] = useState<NominatimResult | null>(null);

  const handleSelect = (result: NominatimResult) => {
    setSelectedAddress(result);
  };

  return (
    <div className="app-container">
      <div className="card">
        <div className="card-header">
          <div className="logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <h1 className="card-title">Places Autocomplete</h1>
            <p className="card-subtitle">Powered by OpenStreetMap / Nominatim</p>
          </div>
        </div>

        <AddressAutocomplete
          label="Buscar endereço"
          placeholder="Ex: Avenida Paulista, São Paulo..."
          onSelect={handleSelect}
        />

        {selectedAddress && (
          <div className="result-card">
            <h2 className="result-title">Endereço selecionado</h2>
            <p className="result-address">{selectedAddress.display_name}</p>
            <div className="result-coords">
              <span>
                <strong>Lat:</strong> {parseFloat(selectedAddress.lat).toFixed(6)}
              </span>
              <span>
                <strong>Lon:</strong> {parseFloat(selectedAddress.lon).toFixed(6)}
              </span>
            </div>
          </div>
        )}

        <p className="tip">
          Digite ao menos 3 caracteres para iniciar a busca. A requisição é feita com debounce de 500ms.
        </p>
      </div>
    </div>
  );
}

export default App;
