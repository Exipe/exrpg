
import { useState, useEffect, useRef } from "react";
import React = require("react");
import { MenuEntry } from "../game/model/context-menu-model";
import { Item } from "../game/model/inventory-model";

export interface HeldItem {
    mouseX: number,
    mouseY: number,
    item: Item,
    slot: number
}

export function HeldItemPointer(props: { item: HeldItem }) {
    const item = props.item
    const pointerRef = useRef(null as HTMLDivElement)

    React.useEffect(() => {
        const mouseMove = (ev: MouseEvent) => {
            const style = pointerRef.current.style

            style.left = `${ev.clientX}px`
            style.top = `${ev.clientY}px`
        }

        document.addEventListener("mousemove", mouseMove)
        return () => {
            document.removeEventListener("mousemove", mouseMove)
        }
    }, [])

    return <div id="heldItem"
        ref={pointerRef}
        style={ {
            backgroundImage: `url('${ item.item[0].spritePath }')`,
            left: item.mouseX,
            top: item.mouseY
        } } />
}

interface InventoryProps {
    setOnInventoryUpdate: (onUpdate: (items: Item[]) => void) => void
    getItems: () => Item[]
    takeItem: (item: HeldItem) => void
    moveItem: (fromSlot: number, toSlot: number) => void
    heldItem: HeldItem,
    showCtxMenu: (entries: MenuEntry[], x: number, y: number) => void,
    useItem: (action: string, id: string, slot: number) => void
}

export function Inventory(props: InventoryProps) {
    const [items, setItems] = useState([] as Item[])

    const heldItem = props.heldItem

    useEffect(() => {
        setItems(props.getItems())

        props.setOnInventoryUpdate(items => {
            if(heldItem != null && items[heldItem.slot] != heldItem.item) {
                props.takeItem(null)
            }

            setItems(items)
        })

        return () => {
            props.setOnInventoryUpdate(null)
        }
    }, [])

    function contextItem(idx: number, mouseX: number, mouseY: number) {
        props.takeItem(null)

        const item = items[idx]
        if(item == null) {
            return
        }

        let ctxMenu = [] as MenuEntry[]

        const data = item[0]
        if(data.equipable) {
            ctxMenu.push([
                "Equip " + data.name, 
                () => { props.useItem("equip", data.id, idx) }
            ])
        }

        data.options.forEach(option => {
            ctxMenu.push([
                `${option[0]} ${data.name}`, 
                () => { props.useItem(option[1], data.id, idx) }
            ])
        })

        ctxMenu.push([
            "Drop " + data.name, 
            () => { props.useItem("drop", data.id, idx) }
        ])

        props.showCtxMenu(ctxMenu, mouseX, mouseY)
    }

    function shiftClickItem(idx: number) {
        const item = items[idx][0]
        if(item.equipable) {
            props.useItem("equip", item.id, idx)
        }
    }

    function clickItem(idx: number, mouseX: number, mouseY: number) {
        const oldItem = items[idx]

        if(heldItem != null) {
            if(heldItem.slot == idx) {
                props.takeItem(null)
                return
            }

            props.moveItem(heldItem.slot, idx)

            const copyItems = [...items]
            copyItems[heldItem.slot] = oldItem
            copyItems[idx] = heldItem.item
            setItems(copyItems)
        }

        if(oldItem == null) {
            props.takeItem(null)
            return
        }

        props.takeItem({
            mouseX: mouseX,
            mouseY: mouseY,
            item: oldItem,
            slot: heldItem != null ? heldItem.slot : idx
        })
    }

    const displayItems = items.map((item, idx) => {
        if(heldItem != null && heldItem.slot == idx) {
            item = null
        }

        let style = {} as React.CSSProperties
        if(item != null) {
            style.backgroundImage = `url('${ item[0].spritePath }')`
        }

        let onClick = (e: React.MouseEvent) => {
            if(e.shiftKey) {
                shiftClickItem(idx)
            } else {
                clickItem(idx, e.clientX, e.clientY) 
            }
        }
        let onContextMenu = (e: React.MouseEvent) => { 
            e.preventDefault()
            contextItem(idx, e.clientX, e.clientY) 
        }

        return <div key={idx} style={style} onClick={onClick} onContextMenu={onContextMenu}>
            {item != null && item[1] > 1 &&
                <div className="itemAmount">{item[1]}</div>}
        </div>
    })

    return <div id="inventory">
        {displayItems}
    </div>
}