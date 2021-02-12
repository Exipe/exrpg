
import fetch from "node-fetch"
import { RES_PATH } from ".."

export class ObjectData {

    public readonly id: string
    public readonly width: number

    public readonly block: boolean
    public readonly actions: string[]

    constructor(id: string, width: number, block: boolean, actions: string[]) {
        this.id = id
        this.width = width
        this.block = block
        this.actions = actions
    }

}

export async function loadObjectData() {
    const objDataMap = new Map<string, ObjectData>()
    const data = await fetch(RES_PATH + "data/object.json")
    .then(res => res.json())

    data.forEach((obj: any) => {
        if(objDataMap.get(obj.id) != null) {
            throw "IMPORTANT - duplicate object ID: " + obj.id
        }

        const width = obj.width ? obj.width : 1
        const block = obj.block != undefined ? obj.block : true
        const actions = obj.options ? obj.options.map((action: string) =>
            action.toLowerCase().replace(" ", "_")) : []

        const objData = new ObjectData(obj.id, width, block, actions)
        objDataMap.set(obj.id, objData)
    })

    return new ObjectDataHandler(objDataMap)
}

export class ObjectDataHandler {
    
    private readonly objDataMap: Map<string, ObjectData>

    constructor(objDataMap: Map<string, ObjectData>) {
        this.objDataMap = objDataMap
    }

    public get(id: string) {
        return this.objDataMap.get(id)
    }
    
}
