
import { ChatBox } from "./chat-box"
import { Game } from "../game/game"
import { HeldItemPointer, HeldItem } from "./inventory"
import { useState } from "react"
import React = require("react")
import { ContextMenu } from "./context-menu"
import { TabArea } from "./tab-area"
import { DialogueBox } from "./dialogue-box"

export function UiContainer(props: { game: Game }) {
    const [heldItem, setHeldItem] = useState(null as HeldItem)

    const game = props.game

    return <div id="ui">
        <ContextMenu
            setOnOpenContextMenu={ onOpenContextMenu =>
                game.ctxMenu.onOpenContextMenu = onOpenContextMenu }
        />

        {heldItem != null &&
            <HeldItemPointer item={heldItem} />
        }

        <TabArea
            game={game}
            heldItem={heldItem}
            setHeldItem={ item => setHeldItem(item) }
        />

        <ChatBox 
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