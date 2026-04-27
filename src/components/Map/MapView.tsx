import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import norteDeMinas from '../../public/norte-de-minas.png';

// Defines the default icon for all markers.
const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
  iconMapUrl: norteDeMinas,
});
// Sets the default icon for all markers.
L.Marker.prototype.options.icon = DefaultIcon;

// Represents one point shown on the map.
interface MarkerData {
  id: string;
  lat: number;
  lng: number;
  nome: string;
  descricao: string;
}

// Props accepted by the map view component.
interface MapViewProps {
  markers: MarkerData[];
}

// Limits the visible area to the local tile coordinate system.
const MAP_BOUNDS: L.LatLngBoundsLiteral = [[0, 0], [100, 100]];

function MapView({ markers }: MapViewProps) {
  useEffect(() => {
    console.log('🗺️ MapView montado!');
    console.log('📍 Marcadores recebidos:', markers.length);
  }, [markers]);

  return (
    <MapContainer
      center={[50, 50]}
      zoom={1}
      minZoom={0}
      maxZoom={4}
      crs={L.CRS.Simple}
      style={{ height: '100vh', width: '100vw' }}
      zoomControl={true}
      attributionControl={false}
    >
      <TileLayer
        url="/tiles/{z}/{x}/{y}.webp"
        bounds={MAP_BOUNDS}
        noWrap={true}
        errorTileUrl="https://via.placeholder.com/256x256/333/fff?text=Tile+não+encontrada"
      />

      {/* Static marker used to validate map positioning during development. */}
      <Marker position={[50, 50]}>
        <Popup>
          <strong>Centro do Mapa</strong>
          <p>Este é um marcador de teste</p>
        </Popup>
      </Marker>

      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]}>
          <Popup>
            <h3>{marker.nome}</h3>
            <p>{marker.descricao}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;