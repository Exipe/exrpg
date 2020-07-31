
import { ItemData } from "./item-data";
import { itemDataHandler } from "../world";

export class Item {

    public readonly data: ItemData
    private readonly stack: number
    private _amount: number

    constructor(id: string | ItemData, amount = 1, stack = 0) {
        if(typeof id == "string") {
            id = itemDataHandler.get(id)
        }

        if(id == null) {
            throw "Must provide a valid item id"
        }

        if(amount <= 0) {
            throw "Must provide a positive amount"
        }

        this.data = id
        this._amount = amount

        if(stack < 1) {
            this.stack = id.stack
        }
    }

    public get amount() {
        return this._amount
    }

    public get id() {
        return this.data.id
    }

    public get equipable() {
        return this.data.equipable
    }

    public add(add: number) {
        if(add <= 0) {
            throw "Amount must be positive"
        }

        const holds = this.stack - this._amount
        this._amount += Math.min(add, holds)

        return add - holds
    }

    public remove(remove: number) {
        if(remove <= 0) {
            throw "Amount must be positive"
        }

        const remaining = remove - this._amount
        this._amount -= remove

        return remaining
    }

}