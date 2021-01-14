import { ItemData, ItemOption } from "./item-data";
import { EquipmentData, EquipmentSprite } from "./equipment-data";

export async function initItems(resPath: string) {
    const itemMap = new Map<string, ItemData>()
    const equipSpriteMap = new Map<string, EquipmentSprite>()

    const data = await fetch(resPath + "/data/item.json").then(text => text.json())
    data.forEach((itemData: any) => {
        const id = itemData.id
        const name = itemData.name
        const sprite = itemData.sprite ? itemData.sprite : "null"

        if(itemMap.has(id)) {
            throw "IMPORTANT - duplicate item ID: " + id
        }

        const options: ItemOption[] = itemData.options ? itemData.options.map((option: string) => [
            option, option.toLowerCase().replace(" ", "_")]) : []

        let equip = null as EquipmentData

        if(itemData.equip != null && itemData.equip.sprite != null) {
            const equipData = itemData.equip
            let spriteData = equipData.sprite

            if(typeof spriteData == "string") {
                spriteData = [spriteData, 0]
            }

            let sprite = equipSpriteMap.get(spriteData[0])

            if(sprite == null) {
                sprite = new EquipmentSprite(resPath + "/equip/" + spriteData[0] + ".png")
                equipSpriteMap.set(spriteData[0], sprite)
            }

            equip = new EquipmentData(sprite, spriteData[1], equipData.slot)
        } else if(itemData.equip != null) {
            equip = new EquipmentData(null, -1, itemData.equip.slot)
        }

        itemMap.set(id, new ItemData(id, name, resPath + "/item/" + sprite + ".png", equip, options))
    })

    return new ItemHandler(itemMap)
}

export class ItemHandler {

    private readonly itemMap: Map<string, ItemData>
    private readonly itemList: string[]

    constructor(itemMap: Map<string, ItemData>) {
        this.itemMap = itemMap
        this.itemList = [ ...itemMap.keys() ]
    }

    public search(prefix: string) {
        return this.itemList.filter(item => item.startsWith(prefix))
    }

    public get(id: string) {
        return this.itemMap.get(id)
    }

}
