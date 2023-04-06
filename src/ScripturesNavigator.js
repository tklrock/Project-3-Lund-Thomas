import { Outlet } from "react-router-dom";

export default function ScripturesNavigator() {
    return (
        <nav id="nav-panel">
            <Outlet />
        </nav>
    );
}