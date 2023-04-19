import Breadcrumbs from "./Breadcrumbs";
import Header from "./Header";
import Map from "./Map";
import ScripturesNavigator from "./ScripturesNavigator";
import { memo } from 'react';

function MainPage({ markers }) {
    return (
        <div id="app">
            <Header />
            <Breadcrumbs />
            <div id="content">
                <aside id="map" >
                    <Map markers={markers}/>
                </aside>
                <ScripturesNavigator />
            </div>
        </div> 
    );
}

export default memo(MainPage);