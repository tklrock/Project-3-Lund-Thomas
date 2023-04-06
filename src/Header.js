import React from "react";
import "./Header.css";

function Breadcrumbs() {
    return (
        <div id="crumbs"></div>
    );
}

function Title() {
    return (
        <div id="centerhead">
            <div className="title">The Scriptures, Mapped</div>
            <div className="subtitle">By Thomas Lund</div>
        </div>
    );
}

function Header() {
    return (
        <header id="header">
            <Breadcrumbs />
            <Title />
        </header>
    );
}

export { Header };