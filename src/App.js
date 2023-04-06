
import './App.css';
import MainPage from './MainPage';
import ScripturesData from './ScripturesData';
import ErrorPage from './ErrorPage';
import LoadingIndicator from './LoadingIndicator';
import BookComponent from './BookComponent';
import ChapterComponent from './ChapterComponent';
import VolumeComponent from './VolumeComponent';
import VolumesList from './VolumesList';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { loadChapterData, useFetchScripturesData } from './ServerApi';
import { useMemo } from 'react';

function App() {
    const scripturesData = useFetchScripturesData();

    const router = useMemo(() => createHashRouter([
        {
            path: "/",
            element: <MainPage />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: ":volume/:book/:chapter/:animation?",
                    element: <ChapterComponent />,
                    loader: async ({ params }) => {
                        return await loadChapterData(params, scripturesData.books); 
                    }
                },
                { path: ":volume/:book", element: <BookComponent /> },
                { path: ":volume", element: <VolumeComponent /> },
                { path: "", element: <VolumesList /> }
            ]
        }
    ]), [scripturesData.books]);

    if (scripturesData.isLoading) {
        return <LoadingIndicator />;
    }
    return (
        <ScripturesData.Provider value={scripturesData}>
            <RouterProvider router={router} />
        </ScripturesData.Provider>
    );
}

export default App;
