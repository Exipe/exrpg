
import { SelectBuyPacket, ShopPacket } from "../../connection/outgoing-packet";
import { itemDataHandler, playerHandler } from "../../world";
import { Player } from "../player";
import { PrimaryWindow } from "./p-window";

export class Shop implements PrimaryWindow {

    public readonly id = "Shop"

    private readonly name: string
    private readonly items: string[]

    constructor(name: string, items: string[]) {
        this.name = name
        this.items = items
    }

    public open(p: Player) {
        p.send(new ShopPacket(this.name, this.items))
    }

    public selectBuy(p: Player, slot: number) {
        if(slot >= this.items.length) {
            return
        }

        const item = itemDataHandler.get(this.items[slot])
        p.send(new SelectBuyPacket(slot, item.id, "coins", item.value))
    }

    public buy(p: Player, slot: any, amount: any) {
        if(slot >= this.items.length) {
            return
        }

        const item = itemDataHandler.get(this.items[slot])
        p.sendMessage(`Buying ${amount}x${item.name}`) 

        const inv = p.inventory
        const money = inv.count('coins')

        const affords = Math.floor(money / item.value)
        amount = Math.min(amount, affords)
        if(amount == 0) {
            p.sendMessage("You can't afford that")
            return
        }

        amount -= inv.addData(item, amount, false)
        inv.remove('coins', amount*item.value)
    }

}