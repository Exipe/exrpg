import { CraftingPacket } from "../../connection/outgoing-packet";
import { Player } from "../player";
import { PrimaryWindow } from "./p-window";

export class Crafting implements PrimaryWindow {

    public readonly id = "Crafting";

    private readonly name: string
    private readonly items: string[]

    constructor(name: string, items: string[]) {
        this.name = name
        this.items = items
    }

    private isUnlocked(item: string) {
        return item != "shield_copper"
    }

    open(p: Player) {
        p.send(new CraftingPacket(this.name, this.items.map(i => ({
            item: i,
            unlocked: this.isUnlocked(i),
            materials: [ ['ingot_copper', 5] ]
        }))))
    }

}