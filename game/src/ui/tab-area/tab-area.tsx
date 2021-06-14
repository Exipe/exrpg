
import { Game } from "../../game/game";

import { HeldItem, InventoryTab } from "./inventory";
import React = require("react");
import { Equipment } from "./equipment";
import { Settings } from "./settings";

export interface TabAreaProps {
    game: Game,
    heldItem: HeldItem,
    setHeldItem: (item: HeldItem) => void
}

type TabId = "inventory" | "equipment" | "settings"

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

    let displayTab = <></>

    if(tab == "inventory") {
        displayTab = <InventoryTab 
            heldItem={ props.heldItem }
            takeItem={ item => { props.setHeldItem(item) } }
            showCtxMenu={ (entries, x, y) => { game.ctxMenu.show(entries, x, y) } }
            inventory={ game.inventory }
        />
    } else if(tab == "equipment") {
        displayTab = <Equipment
            equipment={game.equipment}
            attributes={game.attributes}
        />
    } else if(tab == "settings") {
        displayTab = <Settings 
            ctxMenu={game.ctxMenu}
            settings={game.settings}
        />
    }

    return <div id="tabArea">
        <div className="box-standard" id="tabs">
            <Tab id="inventory" setTab={ openTab } />
            <Tab id="equipment" setTab={ openTab } />
            <Tab id="settings" setTab={ openTab } />
        </div>

        {displayTab}
    </div>

}