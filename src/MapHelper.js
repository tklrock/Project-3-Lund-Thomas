/*========================================================================
 * FILE:    MapHelper.js
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2023
 *
 * DESCRIPTION: Module for managing Google Maps API interactions
 */
/*------------------------------------------------------------------------
 *                      CONSTANTS
 */
const INDEX_FLAG = 11;
const INDEX_ID = 1;
const INDEX_LATITUDE = 3;
const INDEX_LONGITUDE = 4;
const INDEX_PLACENAME = 2;
const INDEX_VIEW_ALTITUDE = 9;
const LAT_LON_PARSER = /.*\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\).*/;
const MAX_ZOOM_LEVEL = 18;
const MIN_ZOOM_LEVEL = 6;
const ZOOM_RATIO = 450;

/*------------------------------------------------------------------------
 *                      PRIVATE HELPERS
 */
const addGeoplace = function (geoplaces, id, placename, latitude, longitude, viewAltitude) {
    let index = geoplaceIndex(geoplaces, latitude, longitude);

    if (index >= 0) {
        mergePlacename(geoplaces, id, placename, index);
    } else {
        geoplaces.push({
            id,
            position: { lat: latitude, lng: longitude },
            placename,
            viewAltitude
        });
    }
};

const geoplaceIndex = function (geoplaces, latitude, longitude) {
    let i = geoplaces.length - 1;

    while (i >= 0) {
        const geoplace = geoplaces[i];

        // Note: here is the safe way to compare IEEE floating-point
        // numbers: compare their difference to a small number
        const latitudeDelta = Math.abs(geoplace.position.lat - latitude);
        const longitudeDelta = Math.abs(geoplace.position.lng - longitude);

        if (latitudeDelta < 0.00000001 && longitudeDelta < 0.00000001) {
            return i;
        }

        i -= 1;
    }

    return -1;
};

const mergePlacename = function (geoplaces, id, placename, index) {
    let geoplace = geoplaces[index];

    if (!geoplace.placename.includes(placename)) {
        geoplace.placename += ", " + placename;
        geoplace.id += "|" + id;
    }
};

/*------------------------------------------------------------------------
 *                      EXPORTED FUNCTIONS
 */
const geoplacesForHtml = function (html, keyPrefix) {
    const geoplaces = [];
    const links = html.match(/<a[^>]*onclick="showLocation\([^"]*">/g);

    if (links) {
        links.forEach(link => {
            const matches = LAT_LON_PARSER.exec(link);

            if (matches) {
                let id = `${keyPrefix}${matches[INDEX_ID]}`;
                let placename = matches[INDEX_PLACENAME];
                let latitude = Number(matches[INDEX_LATITUDE]);
                let longitude = Number(matches[INDEX_LONGITUDE]);
                let viewAltitude = Number(matches[INDEX_VIEW_ALTITUDE]);
                let flag = matches[INDEX_FLAG];

                if (flag !== "") {
                    placename = `${placename} ${flag}`;
                }

                addGeoplace(geoplaces, id, placename, latitude, longitude, viewAltitude);
            }
        });
    }

    return geoplaces;
};

const zoomLevelForViewAltitude = function (altitude) {
    let zoomLevel = Math.round(Number(altitude) / ZOOM_RATIO);

    if (zoomLevel < MIN_ZOOM_LEVEL) {
        zoomLevel = MIN_ZOOM_LEVEL;
    } else if (zoomLevel > MAX_ZOOM_LEVEL) {
        zoomLevel = MAX_ZOOM_LEVEL;
    }

    return zoomLevel;
};

/*------------------------------------------------------------------------
 *                      EXPORTS
 */
export { geoplacesForHtml, zoomLevelForViewAltitude };