
import { ChatArea } from "./chat-box"
import { Game } from "../game/game"
import { useState } from "react"
import React = require("react")
import { ContextMenu } from "./context-menu"
import { TabArea } from "./tab-area/tab-area"
import { DialogueBox } from "./dialogue-box"
import { OverlayArea } from "./overlay-area"
import { StatusArea } from "./status-area"
import { HeldItem, HeldItemPointer } from "./tab-area/inventory"

export function UiContainer(props: { game: Game }) {
    const [heldItem, setHeldItem] = useState(null as HeldItem)

    const game = props.game

    return <div id="ui">
        <OverlayArea overlayAreaModel={game.overlayArea} />

        <ContextMenu
            setOnOpenContextMenu={ onOpenContextMenu =>
                game.ctxMenu.onOpenContextMenu = onOpenContextMenu }
        />

        {heldItem != null &&
            <HeldItemPointer item={heldItem} />
        }

        <StatusArea model={game.status} />

        <TabArea
            game={game}
            heldItem={heldItem}
            setHeldItem={ item => setHeldItem(item) }
        />

        <ChatArea 
            chat={game.chat}
        />

        <DialogueBox 
            setOnOpenDialogue={ onOpenDialogue => 
                game.dialogue.onOpenDialogue = onOpenDialogue }
            setOnCloseDialogue={ onCloseDialogue =>
                game.dialogue.onCloseDialogue = onCloseDialogue }
            clickOption={ (id, index) =>
                game.dialogue.clickOption(id, index) }
        />
    </div>
}