
import { ShopPacket } from "../connection/outgoing-packet";
import { ATTRIBUTES, isAttribId } from "../player/attrib";
import { Player } from "../player/player";
import { formatStrings } from "../util/util";
import { playerHandler, itemDataHandler, commandHandler, weatherHandler, sceneHandler } from "../world";
import { CommandCallback } from "./command-handler";

function onMeTo(player: Player, args: string[]) {
    if(args.length == 0) {
        player.sendMessage("Correct usage: '/meto player_name'")
        return
    }

    const other = playerHandler.getName(args[0])
    if(other == null) {
        player.sendMessage(`Could not find player: ${args[0]}`)
        return
    }

    player.goToMap(other.map, other.x, other.y)
}

function onToMe(player: Player, args: string[]) {
    if(args.length == 0) {
        player.sendMessage("Correct usage: '/tome player_name'")
        return
    }

    const other = playerHandler.getName(args[0])
    if(other == null) {
        player.sendMessage(`Could not find player: ${args[0]}`)
        return
    }

    other.goToMap(player.map, player.x, player.y)
}

function onItem(player: Player, args: string[]) {
    if(args.length == 0) {
        player.sendMessage("Correct usage: '/item [player_name] item_id [amount]'")
        return
    }

    let toPlayer = player
    let itemArg = args[0]
    let amountArg = "1"

    if(args.length == 2) {
        amountArg = args[1]
    } else if(args.length > 2) {
        toPlayer = playerHandler.getName(args[0])
        if(toPlayer == null) {
            player.sendMessage(`Could not find player: ${args[0]}`)
            return
        }

        itemArg = args[1]
        amountArg = args[2]
    }

    const item = itemDataHandler.get(itemArg)
    if(item == null) {
        player.sendMessage(`Could not find item: ${itemArg}`)
        return
    }

    const amount = parseInt(amountArg, 10)
    if(isNaN(amount)) {
        player.sendMessage(`Amount '${amountArg}' is not a valid integer`)
        return
    }

    if(toPlayer != player) {
        player.sendMessage(`Gave ${toPlayer.name} ${amount}x ${item.name}`)
        toPlayer.sendMessage(`${player.name} gives you ${amount}x ${item.name}`)
    } else {
        player.sendMessage(`Added ${amount}x ${item.name}`)
    }

    toPlayer.inventory.addData(item, amount)
}

function onEmpty(player: Player, _: any) {
    player.inventory.empty()
    player.sendMessage("Emptied inventory")
}

function onPos(player: Player, _: string[]) {
    player.sendMessage(`Current pos: (${player.x}, ${player.y}) @ ${player.map.id}`)
}

function onSet(player: Player, args: string[]) {
    if(args.length < 2) {
        player.sendMessage("Correct usage: /set attrib_id value")
        player.sendMessage(`attrib_ids: ${formatStrings(ATTRIBUTES, "[", ", ", "]")}`)
        return
    }

    const attribId = args[0]
    const value = parseInt(args[1])

    if(!isAttribId(attribId)) {
        player.sendMessage(`attrib_id '${attribId}' is invalid`)
        player.sendMessage(`attrib_ids: ${formatStrings(ATTRIBUTES, "[", ", ", "]")}`)
        return
    }

    if(isNaN(value)) {
        player.sendMessage(`value '${value}' is not a valid integer`)
        return
    }

    player.attributes.setBase(attribId, value)
    player.sendMessage(`Set ${attribId} to ${value}`)
}

function onBrightness(player: Player, args: string[]) {
    let brightness: number

    if(args.length < 1 || isNaN(brightness = parseFloat(args[0]))) {
        player.sendMessage("Correct usage: /brightness value")
        return
    }

    player.sendMessage(`Brightness set to ${brightness}`)
    weatherHandler.brightness = brightness

    weatherHandler.enableClock = false
}

function onClock(player: Player, _: any) {
    weatherHandler.enableClock = !weatherHandler.enableClock
    player.sendMessage(`Weather clock ${weatherHandler.enableClock ? "enabled" : "disabled"}`)
}

function onTele(player: Player, args: string[]) {
    let xarg: any
    let yarg: any

    let map = player.map

    if(args.length == 2) {
        xarg = args[0]
        yarg = args[1]
    } else if(args.length == 3) {
        map = sceneHandler.get(args[0])
        if(map == null) {
            player.sendMessage(`map_id ${args[0]} does not exist`)
            return
        }

        xarg = args[1]
        yarg = args[2]
    } else {
        player.sendMessage("Correct usage: /tele [map_id] x y")
        return
    }

    const x = parseInt(xarg)
    const y = parseInt(yarg)

    let isNumber = !(isNaN(x) || isNaN(y))
    let isInRange = isNumber && x >= 0 && y >= 0 && x < map.width && y < map.height

    if(!isInRange) {
        player.sendMessage(`Invalid coords (${xarg}, ${yarg})`)
        return
    }

    player.goToMap(map, x, y)
}

export function initCommands() {
    const ch = commandHandler
    const playerCommand = (command: string, callback: CommandCallback) => {
        ch.on(command, callback, 0)
    }
    const devCommand = (command: string, callback: CommandCallback) => {
        ch.on(command, callback, 1)
    }

    playerCommand("players", p => {
        p.sendMessage(`There are ${playerHandler.count} players online`)
    })

    devCommand("item", onItem)
    devCommand("empty", onEmpty)
    devCommand("pos", onPos)
    devCommand("set", onSet)
    devCommand("meto", onMeTo)
    devCommand("tome", onToMe)
    devCommand("brightness", onBrightness)
    devCommand("clock", onClock)
    devCommand("tele", onTele)
}