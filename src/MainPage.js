import Header from "./Header";
import Map from "./Map";
import ScripturesNavigator from "./ScripturesNavigator";
import { memo } from 'react';

function MainPage({ markers }) {
    return (
        <div id="app">
            <Header />
            <ScripturesNavigator />
            <aside id="map" >
                <Map markers={markers}/>
            </aside>
        </div> 
    );
}

export default memo(MainPage);