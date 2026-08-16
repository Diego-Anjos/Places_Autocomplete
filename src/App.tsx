import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { AddressAutocomplete } from './components/AddressAutocomplete';
import type { NominatimResult } from './hooks/useNominatim';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Fix classic Leaflet default-icon paths under Vite/bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER: [number, number] = [-23.55052, -46.633308]; // São Paulo
const DEFAULT_ZOOM = 12;
const SELECTED_ZOOM = 16;

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lon], SELECTED_ZOOM, { duration: 1.25 });
  }, [map, lat, lon]);

  return null;
}

function App() {
  const [selectedAddress, setSelectedAddress] = useState<NominatimResult | null>(null);

  const handleSelect = (result: NominatimResult) => {
    setSelectedAddress(result);
  };

  const hasSelection = selectedAddress !== null;
  const position: [number, number] | null = hasSelection
    ? [parseFloat(selectedAddress.lat), parseFloat(selectedAddress.lon)]
    : null;

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
          <div className="card-header-text">
            <h1 className="card-title">Places Autocomplete</h1>
            <p className="card-description">
              Conheça novos locais e se localize facilmente pelo nosso mapa interativo.
              Descubra endereços exatos em tempo real.
            </p>
          </div>
        </div>

        <AddressAutocomplete
          label="Buscar endereço"
          placeholder="Ex: Avenida Paulista, São Paulo..."
          onSelect={handleSelect}
        />

        <div className="map-section">
          <span className="map-label">Mapa</span>
          <div className="map-wrapper">
            <MapContainer
              center={position ?? DEFAULT_CENTER}
              zoom={hasSelection ? SELECTED_ZOOM : DEFAULT_ZOOM}
              scrollWheelZoom
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {position && selectedAddress && (
                <>
                  <MapUpdater lat={position[0]} lon={position[1]} />
                  <Marker position={position}>
                    <Popup>
                      <strong>{selectedAddress.display_name}</strong>
                    </Popup>
                  </Marker>
                </>
              )}
            </MapContainer>
          </div>
        </div>

        {selectedAddress && position && (
          <div className="result-card">
            <h2 className="result-title">Endereço selecionado</h2>
            <p className="result-address">{selectedAddress.display_name}</p>
            <div className="result-coords">
              <span>
                <strong>Lat:</strong> {position[0].toFixed(6)}
              </span>
              <span>
                <strong>Lon:</strong> {position[1].toFixed(6)}
              </span>
            </div>
          </div>
        )}

        <p className="tip">
          📌 Como usar: Digite ao menos 3 caracteres no campo acima para iniciar a busca.
          Ao selecionar um endereço, nosso mapa voa automaticamente até o destino.
        </p>
      </div>
    </div>
  );
}

export default App;
