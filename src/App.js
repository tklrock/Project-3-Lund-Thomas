
import MainPage from './MainPage';
import ScripturesData from './ScripturesData';
import ErrorPage from './ErrorPage';
import LoadingIndicator from './LoadingIndicator';
import BookComponent from './BookComponent';
import ChapterComponent from './ChapterComponent';
import VolumeComponent from './VolumeComponent';
import VolumesList from './VolumesList';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { useFetchScripturesData } from './MapScripApi';
import { useMemo, useState } from 'react';

function App() {
    const scripturesData = useFetchScripturesData();
    const [markers, setMarkers] = useState([]);

    // Routing object to determine what to show in the side bar based on url hash
    const router = useMemo(() => createHashRouter([
        {
            path: "/",
            element: <MainPage markers={markers}/>,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: ":volume/:book/:chapter/:animation?",
                    element: <ChapterComponent setMarkers={setMarkers} />,
                },
                { path: ":volume/:book", element: <BookComponent setMarkers={setMarkers} /> },
                { path: ":volume", element: <VolumeComponent setMarkers={setMarkers} /> },
                { path: "", element: <VolumesList setMarkers={setMarkers} /> }
            ]
        }
    ]), [markers, setMarkers]);

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
