import { useContext, useEffect } from 'react';
import { useNavigation, useParams } from 'react-router-dom';
import ScripturesData from './ScripturesData';
import LoadingIndicator from './LoadingIndicator';
import './ChapterComponent.css';
import { useFetchChapterData } from './MapScripApi';

export default function ChapterComponent({ setMarkers }) {
    const { books } = useContext(ScripturesData);
    const params = useParams();
    const navigation = useNavigation();
    const book = books[params.book];
    const chapter = params.chapter;
    const { html, markers } = useFetchChapterData(book, chapter);

    useEffect(() => {
        if (typeof setMarkers === "function") {
            setMarkers(markers);
        }
    }, [markers, setMarkers]);

    if (!books || books.length <= 0 || navigation.state === "loading") {
        return <LoadingIndicator />
    }

    if (!book || (chapter && (chapter < 0 || chapter > book.numChapters))){
        return null;
    }

    return <div 
        dangerouslySetInnerHTML ={{ __html: html }}
    />;
}