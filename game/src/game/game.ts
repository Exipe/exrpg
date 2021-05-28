
import { Player, initPlayers } from "./character/player";
import { Scene, Engine } from "exrpg";
import { Npc, initNpcs } from "./character/npc";
import { Connection } from "../connection/connection";
import { findPath, Goal } from "./character/path-finder";
import { WalkPacket } from "../connection/packet";
import { initInventory, InventoryModel } from "./model/inventory-model";
import { GroundItem, initGroundItems } from "./ground-item";
import { ContextMenuModel } from "./model/context-menu-model";
import { EquipmentModel, initEquipment } from "./model/equipment-model";
import { SwingItem } from "./swing-item";
import { initObjects } from "./init-objects";
import { DialogueModel } from "./model/dialogue-model";
import { ChatModel, initChat } from "./model/chat-model";
import { AttributeModel, initAttribs } from "./model/attrib-model";
import { OverlayAreaModel } from "./model/overlay-model";
import { StatusModel } from "./model/status-model";
import { bindIncomingPackets } from "../connection/incoming-packet";
import { SettingsModel } from "./model/settings-model";
import { ShopModel } from "./model/shop-model";
import { Observable } from "./model/observable";

export async function initGame(engine: Engine, connection: Connection) {
    const game = new Game(engine, connection);

    (window as any).hideLocal = () => {
        game.getLocal().destroy()
    }

    await initPlayers(game)
    initNpcs(game)
    initObjects(game)
    initGroundItems(game)
    initInventory(game)
    initEquipment(game)
    initChat(game)
    initAttribs(game)

    bindIncomingPackets(game)

    engine.onAnimate = (dt) => {
        game.animate(dt)
    }

    engine.onDraw = () => {
        game.draw()
    }

    engine.inputHandler.onTileClick = (x, y, _) => {
        game.walkTo(x, y)
    }

    engine.inputHandler.onTileContext = (x, y) => {
        game.ctxMenu.add(["Walk here", () => { 
            game.walkTo(x, y) 
        }])
    }

    engine.inputHandler.onContext = (x, y) => {
        game.ctxMenu.open(x, y)
    }

    return game
}

export type PrimaryWindow = "None" | "Shop" | "Dialogue"

export class Game {

    public readonly engine: Engine
    public readonly connection: Connection

    private players: Player[] = []
    private npcs: Npc[] = []
    private tempObjects: [string, number, number][] = []
    private groundItems: GroundItem[] = []
    private swingItems: SwingItem[] = []

    public localId = -1

    public readonly ctxMenu = new ContextMenuModel()
    public readonly dialogue: DialogueModel
    public readonly inventory: InventoryModel
    public readonly equipment: EquipmentModel
    public readonly chat: ChatModel
    public readonly overlayArea: OverlayAreaModel
    public readonly attributes = new AttributeModel()
    public readonly status = new StatusModel()
    public readonly settings: SettingsModel
    public readonly shop: ShopModel

    public readonly primaryWindow = new Observable<PrimaryWindow>("None")

    constructor(engine: Engine, connection: Connection) {
        this.engine = engine
        this.connection = connection
        this.dialogue = new DialogueModel(connection)
        this.inventory = new InventoryModel(connection)
        this.equipment = new EquipmentModel(connection)
        this.overlayArea = new OverlayAreaModel(engine.camera)
        this.chat = new ChatModel(connection)
        this.settings = new SettingsModel(engine)
        this.shop = new ShopModel(this.primaryWindow, this.connection)
    }

    private get map() {
        return this.engine.map
    }

    public walkTo(x: number, y: number) {
        if(this.map.isBlocked(x, y)) {
            return
        }

        this.walkToGoal({
            x: x, y: y, width: 1, height: 1,
            distance: 0
        })
    }

    public walkToGoal(goal: Goal) {
        const player = this.getLocal()
        const islandMap = this.map.islandMap
        const playerIsland = islandMap.get(player.tileX, player.tileY)
        const goalIsland = islandMap.get(Math.floor(goal.x), Math.floor(goal.y))

        if(playerIsland != goalIsland) {
            return
        }

        const path = findPath(this.map, player.tileX, player.tileY, goal)
        this.connection.send(new WalkPacket(path))
    }

    public animate(dt: number) {
        this.swingItems = this.swingItems.filter(i => {
            return i.animate(dt)
        })
    }

    public draw() {
        if(this.map == null) {
            return
        }

        this.swingItems.forEach(i => {
            i.draw()
        })
    }

    public enterMap(map: Scene) {
        this.engine.map = map
        this.settings.updateBoundary()

        this.players.forEach(p => {
            map.addEntity(p)
        })

        this.npcs.forEach(n => {
            map.addEntity(n)
        })

        this.tempObjects.forEach(obj => {
            map.builder.putObject(obj[1], obj[2], obj[0])
        })
        this.tempObjects = []

        this.groundItems.forEach(i => {
            map.addItem(i)
        })

        this.engine.camera.follow(this.getLocal())
    }

    public addPlayer(player: Player) {
        this.players.push(player)
        
        if(this.map != null) {
            this.map.addEntity(player)
        }
    }

    public addNpc(npc: Npc) {
        this.npcs.push(npc)
        if(this.map != null) {
            this.map.addEntity(npc)
        }
    }

    public setObject(objId: string, x: number, y: number) {
        if(this.map != null) {
            this.map.builder.putObject(x, y, objId)
        } else {
            this.tempObjects.push([objId, x, y])
        }
    }

    public addGroundItem(item: GroundItem) {
        this.groundItems.push(item)
        if(this.map != null) {
            this.map.addItem(item)
        }
    }

    public addSwingItem(swingItem: SwingItem) {
        this.swingItems.push(swingItem)
    }

    public clear() {
        if(this.engine.map != null) {
            this.engine.map.destroy()
        }

        this.engine.map = null
        this.players = []
        this.npcs = []
        this.groundItems = []
        this.swingItems = []
    }

    public removePlayer(id: number) {
        this.players = this.players.filter(p => {
            if(p.id == id) {
                p.destroy()
                return false
            } else {
                return true
            }
        })
    }

    public removeNpc(id: number) {
        this.npcs = this.npcs.filter(n => {
            if(n.id == id) {
                n.destroy()
                return false
            } else {
                return true
            }
        })
    }

    public removeGroundItem(id: number) {
        this.groundItems = this.groundItems.filter(i => {
            if(i.id == id) {
                this.map.removeItem(i)
                return false
            } else {
                return true
            }
        })
    }

    public getNpc(id: number) {
        return this.npcs.find(n => n.id == id)
    }

    public getPlayer(id: number) {
        return this.players.find(p => p.id == id)
    }

    public getLocal() {
        return this.getPlayer(this.localId)
    }

}