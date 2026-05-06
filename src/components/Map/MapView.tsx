import { useEffect, useRef, useState } from "react";
import { ImageOverlay, MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  highlightedMunicipalityCode?: string;
}
const JPG_WIDTH = 4677;
const JPG_HEIGHT = 6622;
const MAP_BOUNDS: L.LatLngBoundsLiteral = [[0, 0], [JPG_HEIGHT, JPG_WIDTH]];

function MapView({ highlightedMunicipalityCode }: MapViewProps) {
  const [highlightOverlayUrl, setHighlightOverlayUrl] = useState<string | null>(null);
  const highlightOverlayBlobByMunicipalityCodeRef = useRef<Map<string, Blob | null>>(new Map());

  useEffect(() => {
    let isCancelled = false;
    let currentObjectUrl: string | null = null;

    async function updateHighlightOverlay() {
      const normalizedMunicipalityCode = highlightedMunicipalityCode?.trim();
      if (!normalizedMunicipalityCode) {
        setHighlightOverlayUrl(null);
        return;
      }

      try {
        let overlayBlob = highlightOverlayBlobByMunicipalityCodeRef.current.get(
          normalizedMunicipalityCode,
        );

        if (overlayBlob === undefined) {
          const highlightOverlayAssetUrl = `/highlights/${normalizedMunicipalityCode}.png`;
          const response = await fetch(highlightOverlayAssetUrl);
          if (response.status === 404) {
            highlightOverlayBlobByMunicipalityCodeRef.current.set(normalizedMunicipalityCode, null);
            if (!isCancelled) {
              setHighlightOverlayUrl(null);
            }
            return;
          }

          if (!response.ok) {
            throw new Error("Failed to fetch municipality highlight image");
          }

          overlayBlob = await response.blob();
          highlightOverlayBlobByMunicipalityCodeRef.current.set(
            normalizedMunicipalityCode,
            overlayBlob,
          );
        }

        if (!overlayBlob) {
          if (!isCancelled) {
            setHighlightOverlayUrl(null);
          }
          return;
        }

        currentObjectUrl = URL.createObjectURL(overlayBlob);
        if (!isCancelled) {
          setHighlightOverlayUrl(currentObjectUrl);
        }
      } catch (error) {
        console.error("Error loading municipality highlight overlay:", error);
        if (!isCancelled) {
          setHighlightOverlayUrl(null);
        }
      }
    }

    void updateHighlightOverlay();

    return () => {
      isCancelled = true;
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [highlightedMunicipalityCode]);

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
      {highlightOverlayUrl ? (
        <ImageOverlay url={highlightOverlayUrl} bounds={MAP_BOUNDS} opacity={1} />
      ) : null}
    </MapContainer>
  );
}

export default MapView;