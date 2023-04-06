import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import MAPS_API_KEY from "./MapsApiKey";

function Map() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: MAPS_API_KEY
    });

    return isLoaded
        ? (<GoogleMap></GoogleMap>)
        : <article id = "map"></article >;
}

export default Map;