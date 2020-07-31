
import { ConnectionHandler } from "./connection-handler";
import { Connection } from "./connection";
import { INVENTORY_SIZE } from "../item/inventory";
import { isEquipSlot } from "../item/equipment";
import { playerHandler, objDataHandler, npcHandler, commandHandler } from "../world";

/*
Handle packet spoofing.
In the future this should probably be logged
*/
function report(_: Connection, message: string) {
    console.log(message)
}

/*
REGISTER packet
*/
function onRegister(conn: Connection, data: any) {
    if(typeof data != "object") {
        report(conn, `Invalid REGISTER data ${data}`)
        return
    }

    const username = data.username
    const password = data.password

    if(typeof username != "string") {
        console.log(`Invalid REGISTER username: ${username}`)
        return
    }

    if(typeof password != "string") {
        console.log(`Invalid REGISTER password: ${password}`)
        return
    }

    playerHandler.register(username, password, conn)
}

/*
LOGIN packet
*/
function onLogin(conn: Connection, data: any) {
    if(typeof data != "object") {
        report(conn, `Invalid LOGIN data ${data}`)
        return
    }

    const username = data.username
    const password = data.password

    if(typeof username != "string") {
        console.log(`Invalid LOGIN username: ${username}`)
        return
    }

    if(typeof password != "string") {
        console.log(`Invalid LOGIN password: ${password}`)
        return
    }

    playerHandler.login(username, password, conn)
}

/*
READY packet
*/
function onReady(conn: Connection, _: any) {
    conn.player.ready()
}

/*
WALK packet
*/
function onWalk(conn: Connection, data: any) {
    if(!Array.isArray(data)) {
        report(conn, "Invalid WALK path: " + data)
        return
    }

    let player = conn.player
    player.clearSteps()

    data.forEach(step => {
        if(!Array.isArray(step) || isNaN(step[0]) || isNaN(step[1])) {
            report(conn, "Invalid WALK step: " + step)
            return
        }

        player.addSteps(step[0], step[1])
    })
}

/*
SAY packet
*/
function onSay(conn: Connection, message: any) {
    if(typeof message != "string") {
        report(conn, `Invalid SAY message: ${message}`)
        return
    }

    if(message.length == 0 || message.length > 100) {
        report(conn, `SAY message too long: ${message}`)
        return
    }

    conn.player.say(message)
}

/*
COMMAND packet
*/
function onCommand(conn: Connection, command: string) {
    if(typeof command != "string") {
        report(conn, `Invalid COMMAND command: ${command}`)
        return
    }

    if(command.length == 0) {
        return
    }

    commandHandler.execute(conn.player, command)
}

function verifySlot(slot: number) {
    return !isNaN(slot) && slot >= 0 && slot < INVENTORY_SIZE
}

/*
MOVE_ITEM packet
*/
function onMoveItem(conn: Connection, data: any) {
    const fromSlot = data.fromSlot
    const toSlot = data.toSlot

    if(!verifySlot(fromSlot) || !verifySlot(toSlot)) {
        report(conn, `Invalid MOVE_ITEM slots: ${fromSlot} -> ${toSlot}`)
        return
    }

    conn.player.inventory.swap(fromSlot, toSlot)
}

/*
USE_ITEM packet
*/
function onUseItem(conn: Connection, data: any) {
    const action = data.action
    const id = data.id
    const slot = data.slot

    if(!verifySlot(slot)) {
        report(conn, `Invalid USE_ITEM slot: ${slot}`)
        return
    }

    const player = conn.player
    const item = player.inventory.get(slot)

    if(item == null || item.id != id) {
        return
    }

    if(action == "drop") {
        player.dropItem(slot)
        return
    } else if(action == "equip") {
        if(item.equipable) {
            player.equipItem(slot)
        } else {
            report(conn, `Attempt to equip unequipable item: ${item.id}`)
        }
    }
}

/*
TAKE_ITEM packet
*/
function onTakeItem(conn: Connection, id: any) {
    if(isNaN(id)) {
        report(conn, `Invalid TAKE_ITEM ID: ${id}`)
        return
    }

    const player = conn.player
    player.goal = () => {
        player.takeItem(id)
    }
}

/*
UNEQUIP_ITEM packet
*/
function onUnequipItem(conn: Connection, data: any) {
    if(typeof data != "object") {
        report(conn, `Invalid UNEQUIP_ITEM data: ${data}`)
        return
    }

    const id = data.id
    const slot = data.slot

    if(!isEquipSlot(slot)) {
        report(conn, `Invalid UNEQUIP_ITEM slot: ${slot}`)
        return
    }

    const player = conn.player
    const item = player.equipment.get(slot)

    if(item == null || item.id != id) {
        return
    }

    player.unequipItem(slot)
}

/*
OBJECT_ACTION packet
*/
function onObjectAction(conn: Connection, data: any) {
    if(typeof data != "object") {
        report(conn, `Invalid OBJECT_ACTION data: ${data}`)
        return
    }

    const objId = data.id
    const action = data.action
    const x = data.x
    const y = data.y

    const obj = objDataHandler.get(objId);
    if(obj == null) {
        report(conn, `Invalid OBJECT_ACTION id: ${objId}`)
        return
    }

    if(obj.actions.find(a => a == action) == null) {
        report(conn, `Invalid OBJECT_ACTION action: ${action}`)
        return
    }

    if(isNaN(x) || isNaN(y)) {
        report(conn, `Invalid OBJECT_ACTION coords: ${x}, ${y}`)
        return
    }

    const player = conn.player
    player.goal = () => {
        player.objectAction(obj, x, y, action)
    }
}

/*
FOLLOW_PLAYER packet
*/
export function onFollowPlayer(conn: Connection, id: number) {
    if(isNaN(id)) {
        report(conn, `Invalid FOLLOW_PLAYER id: ${id}`)
        return
    }

    const other = playerHandler.get(id)
    const player = conn.player

    if(other == null || other.map != player.map) {
        return
    }

    player.follow(other)
}

/*
NPC_ACTION packet
*/
export function onNpcAction(conn: Connection, data: any) {
    if(typeof data != "object") {
        report(conn, `Invalid NPC_ACTION data: ${data}`)
        return
    }

    const id = data.id as number

    if(isNaN(id)) {
        report(conn, `Invalid NPC_ACTION id: ${id}`)
        return
    }

    const other = npcHandler.get(id)
    const self = conn.player

    if(other == null || other.map != self.map) {
        return
    }

    const action = data.action
    if(other.data.actions.find(a => a == action) == null) {
        report(conn, `Invalid NPC_ACTION action: ${action}`)
        return
    }

    self.follow(other)
    self.goal = () => {
        self.npcAction(id, action)
    }
}

/*
DIALOGUE_OPTION packet
*/
export function onDialogueOption(conn: Connection, data: any) {
    if(typeof data != "object") {
        report(conn, `Invalid DIALOGUE_OPTION data: ${data}`)
        return
    }

    const id = data.id
    const index = data.index

    if(isNaN(id)) {
        report(conn, `Invalid DIALOGUE_OPTION id: ${id}`)
        return
    }

    if(isNaN(index)) {
        report(conn, `Invalid DIALOGUE_OPTION index: ${index}`)
        return
    }

    conn.player.handleDialogueOption(id, index)
}

export function bindIncomingPackets(ch: ConnectionHandler) {
    ch.on("LOGIN", onLogin, "initial")
    ch.on("REGISTER", onRegister, "initial")

    ch.on("READY", onReady, "connected")

    ch.on("WALK", onWalk)
    ch.on("SAY", onSay)
    ch.on("COMMAND", onCommand)
    ch.on("MOVE_ITEM", onMoveItem)
    ch.on("USE_ITEM", onUseItem)
    ch.on("TAKE_ITEM", onTakeItem)
    ch.on("UNEQUIP_ITEM", onUnequipItem)
    ch.on("OBJECT_ACTION", onObjectAction)
    ch.on("FOLLOW_PLAYER", onFollowPlayer)
    ch.on("NPC_ACTION", onNpcAction)
    ch.on("DIALOGUE_OPTION", onDialogueOption)
}