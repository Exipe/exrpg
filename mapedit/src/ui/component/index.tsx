
import { WindowDetails } from "../../store/window-store"
import React = require("react")

export function Window(props: {window: WindowDetails, onMove: (x: number, y: number) => void, onMoveForward: () => void, onClose: () => void}) {
    React.useEffect(() => {
        props.onMoveForward()
    }, [])

    function mouseDown() {
        document.onmouseup = mouseUp
        document.onmousemove = mouseMove
    }

    function mouseUp() {
        document.onmouseup = null
        document.onmousemove = null
    }

    function mouseMove(e: MouseEvent) {
        e.preventDefault()
        props.onMove(e.clientX, e.clientY)
    }

    const data = props.window

    return <div className="toolWindow" onMouseDown={props.onMoveForward} style={{ top: data.y, left: data.x, zIndex: data.z }}>
        <div onMouseDown={mouseDown} className="toolWindowTitle">
            { data.title }
            <a onClick={props.onClose} className="toolWindowClose">❌</a>
        </div>

        <div className="toolWindowBody">
            { data.body }
        </div>
    </div>
}

export function Button(props: { children: string, enabled: boolean, onClick: () => void }) {
    return <div onClick={ () => { props.onClick() } } className={ "button " + (props.enabled ? "" : "disabled") } >
        {props.children}
    </div>
}

export function ToggleButton(props: { children: string, enabled: boolean, onClick: () => void }) {
    return <div onClick={ () => { props.onClick() } } className={ "button " + (props.enabled ? "toggleOn" : "") }>
        {props.children}
    </div>
}