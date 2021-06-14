
import { useEffect, useState } from "react";
import React = require("react");
import { CraftingModel, Recipe } from "../../game/model/crafting-model";
import { Inventory, InventoryModel } from "../../game/model/inventory-model";

type RecipeFilter = "All" | "Unlocked" | "Craftable"

const filterOrder: RecipeFilter[] = ["Craftable", "Unlocked", "All"]

function nextFilter(filter: RecipeFilter) {
    const current = filterOrder.indexOf(filter)
    const next = (current+1) % filterOrder.length
    return filterOrder[next]
}

function filterRecipe(filter: RecipeFilter, inventory: Inventory, recipe: Recipe) {
    switch(filter) {
        case "All":
            return true
        case "Unlocked":
            return recipe.unlocked
        case "Craftable":
            return recipe.unlocked && recipe.materials.every(m => {
                const count = inventory.count(m[0])
                return count >= m[1]
            })
    }
}

interface CraftingStationProps {
    model: CraftingModel,
    inventory: InventoryModel
}

interface CraftSelectProps {
    recipe: Recipe
    inventory: Inventory
    onClose: () => void
    onConfirm: (amount: number) => void 
}

export function CraftSelectDialog(props: CraftSelectProps) {
    const [amount, setAmount] = useState(1)

    const recipe = props.recipe
    const iconStyle = {
        backgroundImage: `url(${recipe.item.spritePath})`
    } as React.CSSProperties

    function updateInput(e: React.ChangeEvent<HTMLInputElement>) {
        const numValue = parseInt(e.target.value, 10)
        setAmount(isNaN(numValue) ? 0 : numValue)
    }

    const materials = recipe.materials.map((value, index) => {
        const count = props.inventory.count(value[0])
        const cost = value[1] * amount
        const textClass = count >= cost ? "hasMaterial" : "lacksMaterial"
        const materialStyle = {
            backgroundImage: `url(${value[0].spritePath})`
        } as React.CSSProperties

        return <div key={index} className="selectDialogRow">
            <div title={value[0].name} style={materialStyle} className="selectDialogIcon scaleIcon" />
            <div className={textClass}>{count} / {cost}</div>
        </div>
    })

    const confirm = () => {
        if(amount == 0) {
            return
        }

        props.onConfirm(amount)
    }

    return <div className="selectDialog" onClick={e => {e.stopPropagation()}}>
        <div className="closeButton top-right"
            onClick={props.onClose}></div>

        <div className="selectDialogRow">
            <div className="selectDialogIcon scaleIcon" style={iconStyle}></div>
            <div>{recipe.item.name}</div>
        </div>

        <div className="selectDialogRow">
            <div>Amount:</div>
            <input onChange={updateInput} value={amount.toString()} type="number" min="0" max="" className="selectDialogAmount"></input>
        </div>

        {materials}

        <div className="selectDialogButton" onClick={confirm}>
            Confirm
        </div>
    </div>
}

export function CraftingStation(props: CraftingStationProps) {
    const stationObservable = props.model.observable
    const inventoryObservable = props.inventory.observable
    const [station, setStation] = useState(stationObservable.value)
    const [filter, setFilter] = useState(filterOrder[0])
    const [inventory, setInventory] = useState(inventoryObservable.value)
    const [select, setSelect] = useState(null as Recipe)

    useEffect(() => {
        stationObservable.register(setStation)
        inventoryObservable.register(setInventory)

        return () => {
            stationObservable.unregister(setStation)
            inventoryObservable.unregister(setInventory)
        }
    }, [])

    const selectCraft = (recipe: Recipe) => {
        setSelect(props.model.select(recipe))
    }

    const close = () => {
        props.model.close()
    }

    const closeSelect = () => {
        setSelect(null)
    }

    const changeFilter = () => {
        setFilter(nextFilter(filter))
    }

    const craft = (amount: number) => {
        setSelect(null)
        props.model.craft(select, amount)
    }

    let found = false
    const predicate = filterRecipe.bind(null, filter, inventory)
    const displayItems = station.recipes.filter(predicate).map((recipe, idx) => {
        const style = {
            backgroundImage: `url('${recipe.item.spritePath}')`
        } as React.CSSProperties

        if(recipe == select) {
            found = true
        }
        const selectDialog = recipe == select ?
            <CraftSelectDialog onConfirm={craft} onClose={closeSelect} 
                inventory={inventory} recipe={recipe}></CraftSelectDialog> : <></>

        return <div key={idx} style={style} className={recipe.unlocked ? "recipeUnlocked" : "recipeLocked"}
            onClick={() => selectCraft(recipe)}>
                {selectDialog}
            </div>
    })
    if(select != null && !found) {
        setSelect(null)
    }

    return <div id="craftingWindow" className="window box-gradient">
        <div style={{display: "flex"}} className="top-right">
            <div onClick={changeFilter} id="craftingFilter">
                Filter: {filter}</div>
            <div className="closeButton"
                onClick={close}></div>
        </div>

        <p className="windowName">{station.name}</p>
        
        <div className="itemContainer">
            {displayItems}
        </div>
    </div>
}