import { useContext, useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import ScripturesData from './ScripturesData';
import './BookComponent.css';

export default function BookComponent({ book, setMarkers }) {
    const { books, isLoading } = useContext(ScripturesData);
    const params = useParams();
    const [bookObject, setBookObject] = useState(typeof book === "object" ? book : books[params.book]);
    let incomingBookId = book ? book.id : params.book;
    
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

    // Only set the book state variable when the incoming bookId is different
    if (!bookObject || (incomingBookId && Number(incomingBookId) !== bookObject.id)) {
        setBookObject(books[incomingBookId]);
        return null;
    }

    // If the book only has a single chapter, skip direclty to the content

    
    return <div>Book Component</div>;
}