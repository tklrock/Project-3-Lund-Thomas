/*========================================================================
 * FILE:    Breadcrumbs.js
 * AUTHOR:  Stephen W. Liddle
 * DATE:    Winter 2023
 *
 * DESCRIPTION: Module for managing breadcrumb navigation
 */
/*------------------------------------------------------------------------
 *                      IMPORTS
 */
import { useParams } from "react-router-dom";
import { useContext } from "react";
import ScripturesData from "./ScripturesData.js";

/*------------------------------------------------------------------------
 *                      CONSTANTS
 */
const TEXT_TOP_LEVEL = "The Scriptures";

/*------------------------------------------------------------------------
 *                      EXPORTED FUNCTIONS
 */

function Crumb(text, href) {
    let content = "";

    if(href){
        content = (<a href={href} key={`ak${text}`}>{text}</a>);
    } else {
        content = text;
    }

    return  (
        <li key={`ck${text}`}>{content}</li>
    );
}

const Breadcrumbs = function () {
    const {volumes, books } = useContext(ScripturesData);
    const {volume, book, chapter } = useParams();
    let crumbs = [];
    const volumeObject = volumes[volume - 1];
    const bookObject = books[book];

    if (volume === undefined) {
        crumbs.push(Crumb(TEXT_TOP_LEVEL));
    } else {
        crumbs.push(Crumb(TEXT_TOP_LEVEL, "#/"));

        if (book === undefined) {
            crumbs.push(Crumb(volumeObject.fullName));
        } else {
            crumbs.push(Crumb(volumeObject.fullName, `#/${volumeObject.id}`));

            if (chapter === undefined || chapter <= 0) {
                crumbs.push(Crumb(bookObject.tocName));
            } else {
                crumbs.push(Crumb(
                    bookObject.tocName,
                    `#/${volumeObject.id}/${bookObject.id}`
                ));
                crumbs.push(Crumb(chapter));
            }
        }
    }

    return (
        <div id="crumbs">{crumbs}</div>
    );
}

/*------------------------------------------------------------------------
 *                      EXPORTS
 */
export default Breadcrumbs;