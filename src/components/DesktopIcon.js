import React, { useState } from 'react';
import { EventEmitter } from './EventEmitter';
import Draggable from 'react-draggable';

// TODO: this should be tied to the taskbar somehow
function DesktopIcon({ ico, text, eventType }) {

    const [waitingClick, setWaitingClick] = useState(null);
    const [lastClick, setLastClick] = useState(0);
    
    const processClick = (e) => {
        if (lastClick && e.timeStamp - lastClick < 250 && waitingClick) {
            // double click
            setLastClick(0);
            clearTimeout(waitingClick);
            setWaitingClick(null);
            switch (eventType) {
                case 'terrabit':
                    window.open('https://terrabit.idealabs.network');
                    break;
                default:
                    EventEmitter.dispatch(eventType, true);
                    break;
            }
        }
        else {
            // single click
            setLastClick(e.timeStamp);
            setWaitingClick(setTimeout(() => {
                setWaitingClick(null);
            }, 251))
        }
    }

    return (
        <div>
            <Draggable
                axis="both"
                handle=".handle"
                defaultPosition={{ x: 0, y: 0 }}
                position={null}
                grid={[25, 25]}
                scale={1}
            >
                <div className="ico handle" onClick={processClick}>
                    {ico}
                    {text}
                </div>
            </Draggable>
        </div>
    );
}

export default DesktopIcon;
