import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ScripturesData from './ScripturesData';
import { URL_LINK_PREFIX } from './MapScripApi';

export default function VolumeComponent(props) {
    const params = useParams();
    const { volumes } = useContext(ScripturesData);
    const [ volume, setVolume ] = useState(typeof props.volume === "object" ? props.volume : volumes[Number(params.volume) - 1]);

    let incomingVolumeId = props.volume ? props.volume.id : params.volume;

    useEffect(() => {
        if (props.active) {
            props.setMarkers([]);
        }
    }, [props]);

    if (!volume || (incomingVolumeId && Number(incomingVolumeId) !== volume.id)) {
        setVolume(volumes[Number(incomingVolumeId) - 1]);

        return null;
    }

    return (
        <>
        <div className="volume">
            <h5 id={`v$volume.id)`}>{volume.fullName}</h5>
            <div className="books">
                {volume.books.map(book => 
                    <a
                        className="gridbutton waves-effect"
                        id={String(book.id)}
                        key={`k${book.id}`}
                        href={`${URL_LINK_PREFIX}${volume.id}/${book.id}`}
                    >
                        {book.gridName}
                    </a>
                )}
            </div>
        </div>
        </>
    )
}
