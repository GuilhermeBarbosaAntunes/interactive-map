import { ImageOverlay, Pane } from "react-leaflet";
import L from 'leaflet'
import norteDeMinasImageUrl from "../../public/norte-de-minas.png";

const MAP_BOUNDS: L.LatLngBoundsLiteral = [
  [0, 0],
  [100, 100],
];

function BackgroundPane() {
  return (
      <Pane name="background-pane" style={{ zIndex: 50 }}>
        <ImageOverlay url={norteDeMinasImageUrl} bounds={MAP_BOUNDS} opacity={1} />
      </Pane>
  );
}

export default BackgroundPane;