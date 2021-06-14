
import { useEffect, useState } from "react"
import React = require("react")
import { InventoryModel } from "../../game/model/inventory-model"
import { ShopModel } from "../../game/model/shop-model"
import { ShopSelectDialog } from "../primary-window/shop-window"

interface ShopInventoryProps {
    shop: ShopModel
    inventory: InventoryModel
}

export function ShopInventory(props: ShopInventoryProps) {
    const observable = props.inventory.observable
    const selectObservable = props.shop.selectedSell
    const [inventory, setInventory] = useState(observable.value)
    const items = inventory.items
    const [select, setSelect] = useState(selectObservable.value)

    useEffect(() => {
        observable.register(setInventory)
        selectObservable.register(setSelect)
        return () => {
            observable.unregister(setInventory)
            selectObservable.unregister(setSelect)
        }
    }, [])

    const selectSell = (slot: number) => {
        if(items[slot] == null) {
            return
        }

        props.shop.selectSell(slot)
    }

    const closeSelect = () => {
        selectObservable.value = null
    }

    const sell = (amount: number) => {
        props.shop.confirmSell(amount)
    }

    const displayItems = items.map((item, idx) => {
        const style = {} as React.CSSProperties
        if(item != null) {
            style.backgroundImage = `url('${item[0].spritePath}')`
        }

        const onClick = () => selectSell(idx)
        return <div key={idx} className={item != null ? "shopItem" : ""} 
            onClick={onClick} style={style}>
            {item != null && item[1] > 1 &&
                <div className="itemAmount">{item[1]}</div>}
            {select != null && select.slot == idx &&
                <ShopSelectDialog onConfirm={sell} onClose={closeSelect} select={select} />}
        </div>
    })

    return <div className="itemContainer box-gradient secondary-window" id="inventory">
        {displayItems}
    </div>
}