import { Header } from "./Header";
import Map from "./Map";
import ScripturesNavigator from "./ScripturesNavigator";

export default function MainPage() {
    return (
        <div id="app">
            <Header />
            <ScripturesNavigator />
            <aside id="map" >
                <Map />
            </aside>
        </div> 
    );
}