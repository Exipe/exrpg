
import { useState, useEffect } from "react";
import React = require("react");
import { MenuEntry } from "../game/model/context-menu-model";

interface ContextMenuProps {
    setOnOpenContextMenu: (onOpenContextMenu: (entries: MenuEntry[], x: number, y: number) => void) => void
}

export function ContextMenu(props: ContextMenuProps) {
    const [entries, setEntries] = useState([] as MenuEntry[])
    const [position, setPosition] = useState([0, 0] as [number, number])

    useEffect(() => {
        props.setOnOpenContextMenu((entries, x, y) => {
            setEntries(entries)
            setPosition([x-8, y-8])
        })

        return () => {
            props.setOnOpenContextMenu(null)
        }
    }, [])

    if(entries.length == 0) {
        return <></>
    }

    const close = () => {
        setEntries([])
    }

    const displayEntries = entries.map((entry, idx) => {
        const onClick = () => {
            close()
            entry[1]()
        }

        return <li key={idx} onClick={onClick}>{entry[0]}</li>
    })

    return <ul onMouseLeave={close} 
        style={{
            left: position[0],
            top: position[1]
        }} 
        id="ctxMenu">
            {displayEntries}
            <li onClick={close}>Cancel</li>
    </ul>
}