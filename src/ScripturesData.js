import React from "react";

const ScripturesData = React.createContext({
    isLoading: true,
    books: {},
    volumes: []
});

export default ScripturesData;