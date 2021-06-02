import { ItemData } from "exrpg"
import { Game, PrimaryWindow } from "../game"
import { Observable } from "./observable"

export type CraftingMaterial = [ItemData, number]

export interface Recipe {

    item: ItemData,
    unlocked: boolean,
    materials: CraftingMaterial[]

}

export class CraftingStation {

    public readonly name: string
    public readonly recipes: Recipe[]

    constructor(name: string, recipes: Recipe[]) {
        this.name = name
        this.recipes = recipes
    }
    
}

export class CraftingModel {

    public readonly observable = new Observable<CraftingStation>()

    private readonly game: Game

    constructor(game: Game) {
        this.game = game
    }

    public select(slot: number) {
        const recipe = this.observable.value.recipes[slot]
        if(!recipe.unlocked) {
            this.game.chat.addMessage(`You have not unlocked the recipe for: ${recipe.item.name}`)
        }
    }

    public open(station: CraftingStation) {
        this.observable.value = station
        this.game.primaryWindow.value = "Crafting"
    }

    public close() {
        this.game.primaryWindow.value = "None"
    }

}