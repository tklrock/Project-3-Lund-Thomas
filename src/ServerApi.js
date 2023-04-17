// /*------------------------------------------------------------------------
//  *                      CONSTANTS
//  */
// import { useContext, useEffect, useState } from "react";
// import ScripturesData from "./ScripturesData";
// import { geoplacesForHtml } from "./MapHelper";
// import { LRUCache } from "lru-cache";

// const BOOK_PROPERTIES = ["backName", "citeAbbr", "citeFull", "fullName", "gridName", "subdiv", "tocName", "webTitle"];

// // By using <svg> elements for these two icons, I can avoid using the full
// // Materialize CSS and loading icon fonts.

// const ICON_NEXT = `
//     <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 183.9 188.7">
//         <polygon points="128.3,94.3 7.3,7.3 7.3,181.3"/>
//         <rect x="150.6" y="7.3" width="26" height="174"/>
//     </svg>`;
// const ICON_PREVIOUS = `
//     <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 183.9 188.7">
//         <polygon points="55.6,94.3 176.6,181.3 176.6,7.3"/>
//         <rect x="7.3" y="7.3" transform="matrix(-1 -8.979541e-11 8.979541e-11 -1 40.6273 188.6942)" width="26" height="174"/>
//     </svg>`;

// const URL_BASE = "https://scriptures.byu.edu/";
// const URL_BOOKS = `${URL_BASE}mapscrip/model/books.php`;
// const URL_LINK_PREFIX = "/#/";
// const URL_SCRIPTURES = `${URL_BASE}mapscrip/mapgetscrip.php`;
// const URL_VOLUMES = `${URL_BASE}mapscrip/model/volumes.php`;

// /*------------------------------------------------------------------------
//  *                      PRIVATE HELPERS
//  */

// const chapterCache = new LRUCache({max: 25 });

// const encodedScriptureUrlParameters = function (bookId, chapter, verses, isJst) {
//     if (bookId !== undefined && chapter !== undefined) {
//         let options = "";

//         if (verses !== undefined) {
//             options += verses;
//         }

//         if (isJst !== undefined) {
//             options += "&jst=JST";
//         }

//         return `${URL_SCRIPTURES}?book=${bookId}&chap=${chapter}&verses${options}`;
//     }
// };

// const injectNextPrevious = function (html, nextPrevious) {
//     return html.replaceAll(
//         /(<div class="navheading">)(<div class="divtitle">[^<]*<\/div>)?(<\/div>)/g,
//         (match) => {
//             const prefix = match.slice(0, match.length - 6);
//             const suffix = match.slice(-6);

//             return `${prefix}<div class="nextprev">${nextPrevious}</div>${suffix}`;
//         }
//     );
// };

// const nextChapter = function (bookId, chapterValue, books) {
//     let book = books[bookId];
//     let chapter = Number(chapterValue);

//     if (book !== undefined) {
//         if (chapter < book.numChapters) {
//             return [
//                 `${URL_LINK_PREFIX}${book.parentBookId}/${bookId}/${chapter + 1}`,
//                 titleForBookChapter(book, chapter + 1)
//             ];
//         }

//         let nextBook = books[bookId + 1];

//         if (nextBook !== undefined) {
//             let nextChapterValue = 0;

//             if (nextBook.numChapters > 0) {
//                 nextChapterValue = 1;
//             }

//             return [
//                 `${URL_LINK_PREFIX}${nextBook.parentBookId}/${nextBook.id}/${nextChapterValue}`,
//                 titleForBookChapter(nextBook, nextChapterValue)
//             ];
//         }
//     }

//     return null;
// }

// const previousChapter = function (bookId, chapterValue, books) {
//     const book = books[bookId];
//     const chapter = Number(chapterValue);

//     if (book !== undefined) {
//         if (chapter > 1) {
//             return [
//                 `${URL_LINK_PREFIX}${book.parentBookId}/${bookId}/${chapter - 1}`,
//                 titleForBookChapter(book, chapter - 1)
//             ];
//         }

//         const previousBook = books[bookId - 1];

//         if (previousBook !== undefined) {
//             return [
//                 `${URL_LINK_PREFIX}${previousBook.parentBookId}/${previousBook.id}/${previousBook.numChapters}`,
//                 titleForBookChapter(previousBook, previousBook.numChapters)
//             ];
//         }
//     }

//     return null;
// }

// const nextPreviousLink = function (nextPrev, icon) {
//     return `<a href="${nextPrev[0]}" title="${nextPrev[1]}"><div class="icon waves-effect">${icon}</div></a>`;
// }

// const nextPreviousMarkup = function (next, previous) {
//     let markup = "";

//     if (previous) {
//         markup = nextPreviousLink(previous, ICON_PREVIOUS);
//     }

//     if (next) {
//         markup += nextPreviousLink(next, ICON_NEXT);
//     }

//     return markup;
// };

// const replaceHTMLEntities = function(book) {
//     BOOK_PROPERTIES.forEach((property) => {
//         book[property] = book[property].replaceAll("&mdash;", "—");
//     });
// };

// const titleForBookChapter = function (book, chapter) {
//     if (chapter > 0) {
//         return `${book.tocName} ${chapter}`;
//     }

//     return book.tocName;
// };

// /*------------------------------------------------------------------------
//  *                      PUBLIC METHODS
//  */

// function useFetchChapterData(book, chapter) {
//     const { books } = useContext(ScripturesData);
//     const [chapterHtml, setChapterHtml] = useState("");
//     const [chapterMarkers, setChapterMarkers] = useState([]);
//     useEffect(() => {
//         if (!book) {
//             return;
//         }
//         const url = encodedScriptureUrlParameters(book.id, Number(chapter));
//         const key = `${book.id}|${chapter}`;
//         let cachedValue = chapterCache.get(key);
//         let mounted = true;
//         if (!cachedValue) {
//             fetch(url)
//                 .then(response => response.text())
//                 .then(chapterText => {
//                     if (mounted) {
//                         const html = injectNextPrevious(
//                             chapterText,
//                             nextPreviousMarkup(
//                                 nextChapter(book.id, chapter, books),
//                                 previousChapter(book.id, chapter, books)
//                             )
//                         );
//                         const markers = geoplacesForHtml(html, `${key}|`);
//                         setChapterMarkers(markers);
//                         setChapterHtml(html);
//                         chapterCache.set(key, { html, markers });
//                     }
//                 });
//         } else {
//             setChapterHtml(cachedValue.html);
//             setChapterMarkers(cachedValue.markers);
//         }
//         return () => { mounted = false; };
//     }, [book, books, chapter]);
//     return { html: chapterHtml, markers: chapterMarkers };
// }


// async function loadScripturesData() {
//     let books;
//     let volumes;

//     const cacheBooks = function ([booksJson, volumesJson]) {
//         volumesJson.forEach((volume) => {
//             let books = [];
//             let bookId = volume.minBookId;

//             while (bookId <= volume.maxBookId) {
//                 books.push(booksJson[bookId]);
//                 bookId += 1;
//             }

//             volume.books = books;
//         });

//         volumes = volumesJson;
//         books = booksJson;
//     };

//     await Promise.all([URL_BOOKS, URL_VOLUMES].map(url =>
//         fetch(url).then(response => response.json())
//     )).then(jsonResults => {
//         cacheBooks(jsonResults);
//     });

//     return { volumes, books };
// }

// function useFetchScripturesData() {
//     const [books, setBooks] = useState([]);
//     const [volumes, setVolumes] = useState({});
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const cacheBooks = function ([booksJson, volumesJson]) {
//             volumesJson.forEach((volume) => {
//                 let books = [];
//                 let bookId = volume.minBookId;

//                 while (bookId <= volume.maxBookId) 
//                 {
//                     const book = booksJson[bookId];
//                     replaceHTMLEntities(book);    
//                     books.push(book);
//                     bookId += 1;
//                 }

//                 volume.books = books;
//             });

//             setVolumes(volumesJson);
//             setBooks(booksJson);
//             setIsLoading(false);
//         };

//         let mounted = true;

//         Promise.all([URL_BOOKS, URL_VOLUMES].map(url =>
//             fetch(url).then(response => response.json())
//         )).then(jsonResults => {
//             if (mounted) {
//                 cacheBooks(jsonResults);
//             }
//         });

//         return () => { mounted = false; };
//     }, []);

//     return { volumes, books, isLoading };
// }

// /*------------------------------------------------------------------------
//  *                      EXPORTS
//  */
// export {
//     useFetchChapterData,
//     loadScripturesData,
//     useFetchScripturesData,
//     URL_LINK_PREFIX,
// };