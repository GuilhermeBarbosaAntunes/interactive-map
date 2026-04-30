import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import { MapLocation } from '../../types/map';
import BackgroundPane from '../../assets/backgroundPane';


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
});

/**
 * Sets the default icon for all markers.
 */
L.Marker.prototype.options.icon = DefaultIcon;


/**
 * Props accepted by the map view component.
 */
interface MapViewProps {
  locations: MapLocation[];
  selectedLocation: MapLocation | null;
  onLocationSelect: (locationId: string | undefined) => void;
}

/**
 * Limits the visible area to the local tile coordinate system.
 */
const MAP_BOUNDS: L.LatLngBoundsLiteral = [[0, 0], [100, 100]];

function MapView({ locations, onLocationSelect }: MapViewProps) {

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
      <BackgroundPane />

      <TileLayer
        url="/tiles/{z}/{x}/{y}.webp"
        bounds={MAP_BOUNDS}
        noWrap={true}
      />

      <Marker position={[50, 50]}>
        <Popup>
          <strong>Map Center</strong>
          <p>This is a test marker</p>
        </Popup>
      </Marker>

      {locations.map((location) => (
        <Marker 
        key={location.id} icon={DefaultIcon}
        position={[location.lat ?? 0, location.lng ?? 0]}
        eventHandlers={{
          click: () => onLocationSelect(location.id)
        }}>
          <Popup>
            <h3>{location.name}</h3>
            <p>{location.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;