import { useContext, useEffect, useState } from 'react';
import { useLoaderData, useNavigation, useParams } from 'react-router-dom';
import ScripturesData from './ScripturesData';
import LoadingIndicator from './LoadingIndicator';
// import scrollIntoView from 'scroll-into-view-if-needed';
import './ChapterComponent.css';

export default function ChapterComponent(props) {
    const { offscreenDiv, setOffscreenDiv, onscreenDiv, setOnscreenDiv, setMarkers } = props;
    const params = useParams();
    const { books, isLoading } = useContext(ScripturesData);
    const navigation = useNavigation();
    const [book, setBook] = useState(typeof props.book === "object" ? props.book : books[params.book]);
    const [chapter, setChapter] = useState(props.chapter !== undefined ? props.chapter : params.chapter);
    let incomingBookId = Number(typeof props.book === "object" ? props.book.id : params.book);
    let incomingChapter = Number(props.chapter !== undefined ? props.chapter : params.chapter);

    if(!isNaN(incomingBookId) && book.id !== incomingBookId) {
        setBook(books[incomingBookId]);
    }

    if(!isNaN(incomingChapter) && chapter !== incomingChapter) {
        setChapter(incomingChapter);
    }

    const chapterData = useLoaderData();

    useEffect(() => {
        if(chapterData) {
            const navPanel = document.querySelector("#nav-panel");

            if (navPanel) {
                navPanel.scrollTop = 0;
            }

            if (params.verses) {
                const firstMatchedVerseElement = document.querySelector(".versesblock .match");

                // if (firstMatchedVerseElement) {
                //     scrollIntoView(firstMatchedVerseElement);
                // }
            }
        }
    }, [chapterData, params.verses]);

    if (isLoading || !books || navigation.state === "loading") {
        return <LoadingIndicator />;
    }

    if (!book || (chapter && (chapter < 0 || chapter > book.numChapters))) {
        return null;
    }

    return (
        <>
            {/* <div id={offScreenDiv}> */}
                <div
                    dangerouslySetInnerHTML={{ __html: chapterData }}
                ></div>
            {/* </div> */}
            {/* <div id={onScreenDiv}></div> */}
        </>
    );
}