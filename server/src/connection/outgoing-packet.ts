import { AttribId } from "../character/attrib"

export interface Packet {
    id: string,
    data: any
}

export class ConnectResponse implements Packet {
    public readonly id = "CONNECT_RESPONSE"
    public readonly data: any

    constructor(accepted: boolean, message = undefined as string) {
        this.data = {
            accepted: accepted
        }

        this.data.message = message
    }
}

export class WelcomePacket implements Packet {
    public readonly id = "WELCOME"
    public readonly data: any

    constructor(id: number) {
        this.data = id
    }
}

export class LoadMapPacket implements Packet {
    public readonly id = "LOAD_MAP"
    public readonly data: any

    constructor(mapId: string) {
        this.data = mapId
    }
}

export interface OutgoingPlayer {
    id: number,
    name: string,
    x: number,
    y: number,
    shield: string,
    helm: string,
    plate: string,
    legs: string,
}

export class AddPlayerPacket implements Packet {
    public readonly id = "ADD_PLAYER"
    public readonly data: any

    constructor(players: OutgoingPlayer[]) {
        this.data = players
    }
}

export class RemovePlayerPacket implements Packet {
    public readonly id = "REMOVE_PLAYER"
    public readonly data: any

    constructor(id: number) {
        this.data = id
    }
}

export class MovePlayerPacket implements Packet {
    public readonly id = "MOVE_PLAYER"
    public readonly data: any

    constructor(id: number, x: number, y: number, animationSpeed = -1) {
        const animate = animationSpeed > 0

        this.data = {
            id: id,
            x: x,
            y: y,
            animate: animate,
            animationSpeed: animate ? animationSpeed: undefined
        }
    }
}

export class UpdatePlayerAppearancePacket implements Packet {
    public readonly id = "PLAYER_APPEARANCE"
    public readonly data: any

    constructor(id: number, shield: string, helm: string, plate: string, legs: string) {
        this.data = {
            id: id,
            shield: shield,
            helm: helm,
            plate: plate,
            legs: legs
        }
    }
}

export class AddNpcPacket implements Packet {
    public readonly id = "ADD_NPC"
    public readonly data: any

    constructor(npcs: [number, string, number, number][]) {
        this.data = npcs
    }
}

export class RemoveNpcPacket implements Packet {
    public readonly id = "REMOVE_NPC"
    public readonly data: any

    constructor(id: number) {
        this.data = id
    }
}

export class MoveNpcPacket implements Packet {
    public readonly id = "MOVE_NPC"
    public readonly data: any

    constructor(id: number, x: number, y: number, animationSpeed = -1) {
        const animate = animationSpeed > 0

        this.data = {
            id: id,
            x: x,
            y: y,
            animate: animate,
            animationSpeed: animate ? animationSpeed: undefined
        }
    }
}

export class AddGroundItemPacket implements Packet {
    public readonly id = "ADD_GROUND_ITEM"
    public readonly data: any

    constructor(items: [number, string, number, number][]) {
        this.data = items
    }
}

export class RemoveGroundItemPacket implements Packet {
    public readonly id = "REMOVE_GROUND_ITEM"
    public readonly data: any

    constructor(id: number) {
        this.data = id
    }
}

export class MessagePacket implements Packet {
    public readonly id = "MESSAGE"
    public readonly data: any

    constructor(message: string) {
        this.data = message
    }
}

export type OutgoingItem = [string, number]

export class UpdateInventoryPacket implements Packet {
    public readonly id = "INVENTORY"
    public readonly data: any

    constructor(items: OutgoingItem[]) {
        this.data = items
    }
}

export class UpdateEquipmentPacket implements Packet {
    public readonly id = "EQUIPMENT"
    public readonly data: any

    constructor(helm: string, plate: string, legs: string, shield: string, sword: string) {
        this.data = {
            helm: helm,
            plate: plate,
            legs: legs,
            shield: shield,
            sword: sword
        }
    }
}

export class SwingItemPacket implements Packet {
    public readonly id = "SWING_ITEM"
    public readonly data: any

    constructor(itemId: string, x: number, y: number, offX: number, offY: number, duration: number) {
        this.data = {
            itemId: itemId,
            x: x,
            y: y,
            offX: offX,
            offY: offY,
            duration: duration
        }
    }
}

export class SetObjectPacket implements Packet {
    public readonly id = "SET_OBJECT"
    public readonly data: any

    constructor(objects: [string, number, number][]) {
        this.data = objects
    }
}

export class DialoguePacket implements Packet {
    public readonly id = "DIALOGUE"
    public readonly data: any

    constructor(id: number, name: string, lines: string[], options: string[]) {
        this.data = {
            id: id,
            name: name,
            lines: lines,
            options: options
        }
    }
}

export class CloseDialoguePacket implements Packet {
    public readonly id = "CLOSE_DIALOGUE"
    public readonly data: any = null
}

export class UpdateAttribPacket implements Packet {
    public readonly id = "ATTRIB"
    public readonly data: [AttribId, number, number][]

    constructor(attribs: [AttribId, number, number][]) {
        this.data = attribs
    }
}
