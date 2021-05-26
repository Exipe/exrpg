
import { useEffect, useState } from "react";
import React = require("react");
import { Game } from "../../game/game";
import { DialogueBox } from "./dialogue-box";
import { ShopWindow } from "./shop-window";

export interface PrimaryWindowProps {
    game: Game
}

export function PrimaryWindow(props: PrimaryWindowProps) {
    const game = props.game
    const pwObserver = game.primaryWindow
    const [pw, setPw] = useState(pwObserver.value)

    useEffect(() => {
        pwObserver.register(setPw)
        return () => pwObserver.unregister(setPw)
    }, [])

    switch(pw) {
        case "None":
            return <></>
        case "Dialogue":
            return <DialogueBox model={game.dialogue} />
        case "Shop":
            return <ShopWindow model={game.shop} />
    }
}
