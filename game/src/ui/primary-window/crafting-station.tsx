
import { useEffect, useState } from "react";
import React = require("react");
import { CraftingModel } from "../../game/model/crafting-model";

interface CraftingStationProps {
    model: CraftingModel
}

export function CraftingStation(props: CraftingStationProps) {
    const stationObservable = props.model.observable
    const [station, setStation] = useState(stationObservable.value)

    useEffect(() => {
        stationObservable.register(setStation)

        return () => {
            stationObservable.unregister(setStation)
        }
    }, [])

    const select = (idx: number) => {
        props.model.select(idx)
    }

    const displayItems = station.recipes.map((recipe, idx) => {
        const style = {
            backgroundImage: `url('${recipe.item.spritePath}')`
        } as React.CSSProperties

        return <div key={idx} style={style} className={recipe.unlocked ? "recipeUnlocked" : "recipeLocked"}
            onClick={() => select(idx)}></div>
    })

    return <div id="craftingWindow" className="window box-gradient">
        <p className="windowName">{station.name}</p>
        <div className="itemContainer">
            {displayItems}
        </div>
    </div>
}