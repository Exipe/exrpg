
import { Game } from "../game/game";

import { HeldItem, Inventory } from "./inventory";
import React = require("react");
import { Equipment } from "./equipment";

export interface TabAreaProps {
    game: Game,
    heldItem: HeldItem,
    setHeldItem: (item: HeldItem) => void
}

type TabId = "inventory" | "equipment" | "friends" | "setting"

interface TabProps {
    id: TabId,
    setTab: (tab: TabId) => void
}

function Tab(props: TabProps) {
    return <div 
        onClick={ () => props.setTab(props.id) }
        style={ { backgroundImage: `url('ui/${props.id}.png')` } }
    />
}

export function TabArea(props: TabAreaProps) {
    const [tab, setTab] = React.useState("" as TabId | "")
    const game = props.game

    let openTab = (id: TabId) => {
        if(tab != id) {
            setTab(id)
        } else {
            setTab("")
        }
    }

    let requestFullScreen = (_: any) => {
        const container = document.querySelector("#container")
        container.requestFullscreen()
    }

    let displayTab = <></>

    if(tab == "inventory") {
        displayTab = <Inventory 
            heldItem={ props.heldItem }
            getItems={ () => game.inventory.items } 
            setOnInventoryUpdate={ onInventoryUpdate => 
                game.inventory.onInventoryUpdate = onInventoryUpdate } 
            takeItem={ item => { props.setHeldItem(item) } }
            moveItem={ (from, to) => { game.inventory.moveItem(from, to) } }
            showCtxMenu={ (entries, x, y) => { game.ctxMenu.show(entries, x, y) } }
            useItem={ (action, id, slot) => { game.inventory.useItem(action, id, slot) } }
        />
    } else if(tab == "equipment") {
        displayTab = <Equipment
            equipment={game.equipment}
            attributes={game.attributes}
        />
    }

    return <div id="tabArea">
        <div id="tabs">
            <Tab id="inventory" setTab={ openTab } />
            <Tab id="equipment" setTab={ openTab } />
            <Tab id="friends" setTab={ openTab } />
            <Tab id="setting" setTab={ requestFullScreen } />
        </div>

        {displayTab}
    </div>

}