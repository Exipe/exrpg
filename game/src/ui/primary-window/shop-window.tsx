
import { useEffect, useState } from "react";
import React = require("react");
import { BuySelect, ShopModel } from "../../game/model/shop-model";

interface BuySelectProps {
    select: BuySelect
    onClose: () => void
    onBuy: (amount: number) => void
}

function BuySelectDialog(props: BuySelectProps) {
    const [amount, setAmount] = useState(1)

    const select = props.select
    const iconStyle = {
        backgroundImage: `url('${select.item.spritePath}')`
    } as React.CSSProperties

    function updateInput(e: React.ChangeEvent<HTMLInputElement>) {
        const numValue = parseInt(e.target.value, 10)
        setAmount(isNaN(numValue) ? 0 : numValue)
    }

    const buy = () => {
        if(amount == 0) {
            return
        }

        props.onBuy(amount)
    }

    const price = amount*select.price

    return <div id="selectDialog" onClick={e => {e.stopPropagation()}}>
        <div onClick={props.onClose} className="closeButton top-right"></div>

        <div className="selectDialogRow">
            <div className="selectDialogIcon scaleIcon" style={iconStyle}></div>
            <div>{select.item.name}</div>
        </div>

        <div className="selectDialogRow">
            <div>Amount:</div>
            <input onChange={updateInput} value={amount.toString()} type="number" min="0" max="" className="selectDialogAmount"></input>
        </div>

        <div className="selectDialogButton" onClick={buy}>
            Confirm (<img className="text-icon" src={select.currency.spritePath}/> <span>{price.toLocaleString()}</span>)
        </div>
    </div>
}

interface ShopWindowProps {
    model: ShopModel
}

export function ShopWindow(props: ShopWindowProps) {
    const shopObservable = props.model.observable
    const selectObservable = props.model.selectedBuy
    const [shop, setShop] = useState(shopObservable.value)
    const [select, setSelect] = useState(selectObservable.value)

    useEffect(() => {
        shopObservable.register(setShop)
        selectObservable.register(setSelect)
        return () => {
            shopObservable.unregister(setShop)
            selectObservable.unregister(setSelect)
        }
    }, [])

    const selectBuy = (slot: number) => {
        props.model.selectBuy(slot)
    }

    const close = () => {
        props.model.close()
    }

    const closeSelect = () => {
        props.model.selectedBuy.value = null
    }

    const buy = (amount: number) => {
        props.model.confirmBuy(amount)
    }

    const displayItems = shop.items.map((item, idx) => {
        const style = {
            backgroundImage: `url('${item.spritePath}')`
        } as React.CSSProperties

        const selectDialog = select != null && select.slot == idx ? 
            <BuySelectDialog onBuy={buy} onClose={closeSelect} select={select} /> : <></>

        const onClick = () => selectBuy(idx)
        return <div className="shopItem" key={idx} onClick={onClick} style={style}>
            {selectDialog}
        </div>
    })

    return <div className="window" id="shopWindow">
        <div className="closeButton top-right"
            onClick={close}></div>
        <p id="shopName">{shop.name}</p>
        <div className="itemContainer">
            {displayItems}
        </div>
    </div>
}
