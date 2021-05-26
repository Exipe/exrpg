
import { useEffect, useState } from "react";
import React = require("react");
import { ShopModel } from "../../game/model/shop-model";

interface ShopWindowProps {
    model: ShopModel
}

export function ShopWindow(props: ShopWindowProps) {
    const shopObserver = props.model.observable
    const [shop, setShop] = useState(shopObserver.value)

    useEffect(() => {
        shopObserver.register(setShop)
        return () => shopObserver.unregister(setShop)
    }, [])

    const displayItems = shop.items.map((item, idx) => {
        const style = {
            backgroundImage: `url('${item.spritePath}')`
        } as React.CSSProperties

        return <div key={idx} style={style}></div>
    })

    return <div className="window" id="shopWindow">
        <p id="shopName">{shop.name}</p>
        <div className="itemContainer">
            {displayItems}
        </div>
    </div>
}
