
import { ItemData } from "exrpg"
import { ItemHandler } from "exrpg/dist/item/item-handler"
import { Connection } from "../../connection/connection"
import { ConfirmBuyPacket, SelectBuyPacket } from "../../connection/packet"
import { Game } from "../game"
import { PrimaryWindow } from "../window"
import { Observable } from "./observable"

export class Shop {

    public readonly name: string
    public readonly items: ItemData[]

    constructor(name: string, items: ItemData[]) {
        this.name = name
        this.items = items
    }

}

export class BuySelect {

    public readonly slot: number

    public readonly item: ItemData
    public readonly currency: ItemData
    public readonly price: number

    constructor(slot: number, item: ItemData, currency: ItemData, price: number) {
        this.slot = slot
        this.item = item
        this.currency = currency
        this.price = price
    }

    public confirm(amount: number) {

    }

}

export class ShopModel {

    private readonly primaryWindow: Observable<PrimaryWindow>
    private readonly connection: Connection
    private readonly itemHandler: ItemHandler

    public readonly observable = new Observable<Shop>()
    public readonly selectedBuy = new Observable<BuySelect>()

    constructor(primaryWindow: Observable<PrimaryWindow>, connection: Connection, itemHandler: ItemHandler) {
        this.primaryWindow = primaryWindow
        this.connection = connection
        this.itemHandler = itemHandler
    }

    public open(shop: Shop) {
        this.observable.value = shop
        this.selectedBuy.value = null
        this.primaryWindow.value = "Shop"
    }

    public close() {
        this.primaryWindow.value = "None"
    }

    public selectBuy(slot: number) {
        this.connection.send(new SelectBuyPacket(slot))
    }

    public confirmBuy(amount: number) {
        const selected = this.selectedBuy.value
        this.selectedBuy.value = null
        this.connection.send(new ConfirmBuyPacket(selected.slot, amount))
    }

}