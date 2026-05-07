import { ImageOverlay, MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MAP_IMAGE_WIDTH = 4677;
const MAP_IMAGE_HEIGHT = 6622;
const MAP_BOUNDS: L.LatLngBoundsLiteral = [[0, 0], [MAP_IMAGE_HEIGHT, MAP_IMAGE_WIDTH]];

function MapView() {
  return (
    <MapContainer
      bounds={MAP_BOUNDS}
      boundsOptions={{ padding: [24, 24] }}
      minZoom={-2.7}
      maxZoom={4}
      crs={L.CRS.Simple}
      maxBounds={MAP_BOUNDS}
      maxBoundsViscosity={1}
      style={{ height: "100vh", width: "100%", backgroundColor: "#FCF4D4"}}
      zoomControl={true}
      attributionControl={false}
    >
      <ImageOverlay url="/mapa.jpg" bounds={MAP_BOUNDS} opacity={1} />
      <TileLayer
        url="/tiles/{z}/{x}/{y}.webp"
        bounds={MAP_BOUNDS}
        noWrap={true}
      />
    </MapContainer>
  );
}

export default MapView;