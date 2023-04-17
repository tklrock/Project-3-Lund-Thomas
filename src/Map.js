import { GoogleMap, MarkerF, OverlayView, OverlayViewF, useJsApiLoader } from "@react-google-maps/api";
import MAPS_API_KEY from "./MapsApiKey";
import "./Map.css";
import { memo, useCallback, useEffect, useState } from "react";
import { zoomLevelForViewAltitude } from "./MapHelper";
import LoadingIndicator from "./LoadingIndicator";

const DEFAULT_MAP_TYPE = "terrain";
const DEFAULT_ZOOM_LEVEL = 8;
const JERUSALEM_POSITION = { lat: 31.777444, lng: 35.234935 };
const MAP_OPTIONS = {
    scaleControl: true
}

function Map({ markers }) {
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: MAPS_API_KEY
    });

    const [map, setMap] = useState(null);

    const showLocation = useCallback((_id, _placename, latitude, longitude, _viewLatitude, _viewLongitude, _viewTilt, _viewRoll, viewAltitude, _viewHeading) => {
        if (map) {
            map.panTo({ lat: latitude, lng: longitude});
            map.setZoom(zoomLevelForViewAltitude(viewAltitude));
        }
    }, [map]);

    if (window.showLocation !== showLocation) {
        window.showLocation = showLocation;
    }

    const onLoad = useCallback(function callback(mapInstance) {
        mapInstance.mapTypeId = DEFAULT_MAP_TYPE;
        setMap(mapInstance);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    useEffect(() => {
        const zoomMapToFitMarkers = () => {
            if (map) {
                let bounds = new google.maps.LatLngBounds();

                markers.forEach(marker => {
                    bounds.extend(marker.position);
                });

                map.panTo(bounds.getCenter());
                map.fitBounds(bounds);
            }
        };

        const zoomToMarker = marker => {
            if (map) {
                map.panTo(marker.position);
                map.setZoom(zoomLevelForViewAltitude(marker.viewAltitude));
            }
        };

        if (markers) {
            if (markers.length === 1) {
                // Zoom to the single marker
                zoomToMarker(markers[0]);
            } else if (markers.length > 1) {
                // Zoom to fit all markers
                zoomMapToFitMarkers();
            }
        }
    }, [map, markers]);

    if (loadError) {
        return (
            <aside id="map">Unable to load Google Maps at this time.</aside>
        );
    }

    const renderMap = () => {

        const views = [];
        markers.forEach(marker => {
            views.push(
                <MarkerF 
                    key={`mk${marker.id}`}
                    position={marker.position}
                    draggable={false}
                    clickable={false}
                />
            );
            views.push(
                <OverlayViewF
                    key={`lk${marker.id}`}
                    position={marker.position}
                    mapPaneName={OverlayView.OVERLAY_LAYER}
                >
                    <div className="maplabel">{marker.placename}</div>
                </OverlayViewF>
            );
        });

        return (
            <GoogleMap
                id="mapNode"
                center={JERUSALEM_POSITION}
                zoom={DEFAULT_ZOOM_LEVEL}
                mapTypeId={DEFAULT_MAP_TYPE}
                options={MAP_OPTIONS}
                onLoad={onLoad}
                onUnmount={onUnmount}
                key={"mapkey"}
            >
                {views}
            </GoogleMap>
        );
    };
        

    return (
        <aside id="map">
            {isLoaded ? renderMap() : <LoadingIndicator />}
        </aside>
    );
}

export default memo(Map);