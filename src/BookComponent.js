import { useContext, useEffect } from 'react';
import {  useParams } from 'react-router-dom';
import ScripturesData from './ScripturesData';
import { URL_LINK_PREFIX } from './MapScripApi';

export default function BookComponent({ book, setMarkers }) {
    const { books, isLoading } = useContext(ScripturesData);
    const params = useParams();
    const bookObject = (typeof book === "object" ? book : books[params.book]);
    const volumeNumber = params.volume;
    
    useEffect(() => {
        if (typeof setMarkers === "function"){
            setMarkers([]);
        }
    }, [setMarkers]);
    
    useEffect(() => {
        if (bookObject) {
            const navPanel = document.querySelector("#nav-panel");

            if(navPanel) {
                navPanel.scrollTop = 0;
            }
        }
    }, [bookObject]);

    if (isLoading || !books) {
        return null;
    }

    // Loop through the chapters in the book to create buttons to them
    const createChapterGrid = (bookObject) => {
        let gridContent = [];
        let chapter = 1;
        console.log(bookObject);
        while (chapter <= bookObject.numChapters) {
            gridContent.push(
                <a
                    id={String(chapter)}
                    key={`c${chapter}`}
                    href={`${URL_LINK_PREFIX}${volumeNumber}/${bookObject.id}/${chapter}`}
                >
                    {chapter}
                </a>
            )
            chapter ++;
        }

        return gridContent;
    }

    // If the book only has a single chapter, skip directly to the content
    if (bookObject.numChapters <= 1) {
        window.location.hash = `#/${volumeNumber}/${bookObject.id}/${bookObject.numChapters}`;
    } else {
        return (
            <>
                <div className="scripnav">
                    <h5 id={`b${bookObject.id}`}>{bookObject.fullName}</h5>
                    <div className="books">
                        {createChapterGrid(bookObject)}
                    </div>
                </div>
            </>
        );
    }
}