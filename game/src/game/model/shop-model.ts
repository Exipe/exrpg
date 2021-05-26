
import { ItemData } from "exrpg"
import { Observable } from "./observable"

export class Shop {

    public readonly name: string
    public readonly items: ItemData[]

    constructor(name: string, items: ItemData[]) {
        this.name = name
        this.items = items
    }

}

export class ShopModel {

    public readonly observable = new Observable<Shop>()

}