import { createRef } from "react";
import { useLocation, useOutlet, useParams } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./ScripturesNavigator.css";

export default function ScripturesNavigator() {
    const location = useLocation();
    const currentOutlet = useOutlet();
    const nodeRef = createRef(null);
    const animation = "fade";

    return (
        <nav id="nav-panel">
            <TransitionGroup>
                <CSSTransition
                    key={location.pathname}
                    nodeRef={nodeRef}
                    timeout={350}
                    classNames={animation}
                >
                    {() => (
                        <div ref={nodeRef} className="nav-content">
                            {currentOutlet}
                        </div>
                    )}
                </CSSTransition>
            </TransitionGroup>
        </nav>
    );
}