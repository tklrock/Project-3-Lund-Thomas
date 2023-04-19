import { useContext, useEffect } from 'react';
import ScripturesData from './ScripturesData';
import VolumeComponent from './VolumeComponent';

export default function VolumesList(props) {
    const { active, setMarkers } = props;
    const { volumes } = useContext(ScripturesData);

    useEffect(() => {
        if(active) {
            setMarkers([]);
        }
    }, [active, setMarkers]);

    useEffect(() => {
        if(active) {
            let navPanel = document.querySelector("#nav-panel");

            if (navPanel) {
                navPanel.scrollTop = 0;
            }
        }
    }, [active]);

    return (
        <div id="volumes-list">
            {volumes.map(volume =>
                <VolumeComponent volume={volume} key={`vk${volume.id}`} {...props} />
            )}
        </div>
    );
}