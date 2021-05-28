
import { useEffect, useState } from "react";
import React = require("react");
import { Game } from "../../game/game";
import { HeldItem } from "../tab-area/inventory";
import { TabArea } from "../tab-area/tab-area";
import { ShopInventory } from "./shop-inventory";

export interface SecondaryWindowProps {
    game: Game,
    heldItem: HeldItem,
    setHeldItem: (item: HeldItem) => void
}

export function SecondaryWindow(props: SecondaryWindowProps) {
    const game = props.game
    const pwObserver = game.primaryWindow
    const [pw, setPw] = useState(pwObserver.value)

    useEffect(() => {
        pwObserver.register(setPw)
        return () => pwObserver.unregister(setPw)
    }, [])

    switch(pw) {
        case "Shop":
            return <ShopInventory
                inventory={game.inventory}
                shop={game.shop} />
        default:
            return <TabArea game={game} 
                heldItem={props.heldItem} 
                setHeldItem={props.setHeldItem} />
    }
}
