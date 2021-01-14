
import { Connection } from "../connection/connection"
import { Packet, MovePlayerPacket, MessagePacket, OutgoingPlayer, UpdatePlayerAppearancePacket, WelcomePacket, DialoguePacket, CloseDialoguePacket, SwingItemPacket, HealthPacket, BrightnessPacket } from "../connection/outgoing-packet"
import { Character } from "../character/character"
import { playerHandler, actionHandler, npcHandler, weatherHandler } from "../world"
import { Inventory } from "../item/inventory"
import { Equipment, EquipSlot } from "../item/equipment"
import { ObjectData } from "../object/object-data"
import { Dialogue } from "./dialogue"
import { Progress } from "./progress/progress"
import { loadProgress } from "./progress/load-progress"
import { PlayerAttribHandler } from "./attrib"
import { PlayerCombatHandler } from "../combat/player-combat"
import { speedBonus } from "../formula"
import { MapId } from "../scene/map-id"
import { PlayerLevel } from "./player-level"
import { FoodHandler } from "../item/food-handler"

export function isPlayer(character: Character): character is Player {
    return character.type == "player"
}

export const SPAWN_POINT = [ "main", 18, 41 ] as [ MapId, number, number ]

export class Player extends Character {

    private readonly connection: Connection

    public readonly id: number
    public readonly name: string
    public readonly password: string

    private readonly progress: Progress

    public readonly equipment = new Equipment(this)
    public readonly inventory = new Inventory(this)
    public readonly attributes = new PlayerAttribHandler(this)

    private dialogue = null as Dialogue
    private dialogueId = -1

    public readonly level = new PlayerLevel(this)
    public readonly foodHandler = new FoodHandler(this)

    public readonly playerCombat: PlayerCombatHandler

    constructor(connection: Connection, id: number, name: string, password: string, progress = null as Progress) {
        super("player", id)
        this.combatHandler = this.playerCombat = new PlayerCombatHandler(this)
        this.level.setLevel(1, false)

        connection.player = this
        this.connection = connection
        
        this.id = id
        this.name = name
        this.password = password
        this.progress = progress

        this.attributes.onChange('speed_move', value => this.walkSpeed = speedBonus(value))
    }

    public get connectionState() {
        return this.connection.state
    }

    public openDialogue(dialogue: Dialogue) {
        this.dialogue = dialogue
        this.send(new DialoguePacket(++this.dialogueId, dialogue.name, dialogue.lines, dialogue.options))
    }

    public closeDialogue() {
        if(this.dialogue == null) {
            return
        }

        this.dialogue = null
        this.send(new CloseDialoguePacket())
    }

    public handleDialogueOption(dialogueId: number, index: number) {
        if(this.dialogueId != dialogueId || this.dialogue == null) {
            return
        }

        const next = this.dialogue.handleOption(index)
        if(next != null) {
            this.openDialogue(next)
        } else {
            this.closeDialogue()
        }
    }

    public stop() {
        super.stop()
        this.closeDialogue()
    }

    public get outgoingPlayer(): OutgoingPlayer {
        return {
            id: this.id,
            name: this.name,
            x: this.x,
            y: this.y,
            equipment: this.equipment.appearanceValues
        }
    }

    public ready() {
        this.send(new BrightnessPacket(weatherHandler.brightness))
        this.send(new WelcomePacket(this.id, this.name))
        this.send(new MessagePacket("Welcome to ExRPG."))

        if(this.progress != null) {
            loadProgress(this, this.progress)
        } else {
            this.inventory.add("beta_hat", 1)
            this.goTo(...SPAWN_POINT)
        }

        this.level.update()

        this.playerCombat.updateHealth()

        this.connection.state = "playing"
    }

    protected enterMap() {
        this.map.addPlayer(this)
    }

    protected leaveMap(): void {
        this.map.removePlayer(this)
    }

    public set goal(goal: () => void) {
        this.walking.goal = goal
    }

    public takeItem(id: number) {
        const item = this.map.getItem(id)
        
        if(item != null && item.x == this.x && item.y == this.y) {
            item.remove()
            this.inventory.addData(item.itemData, item.amount)
        }
    }

    public objectAction(obj: ObjectData, x: number, y: number, action: string) {
        if(!this.map.reachesObject(this.x, this.y, obj, x, y)) {
            return
        }

        actionHandler.objectAction(this, obj.id, action, x, y)
    }

    public npcAction(id: number, action: string) {
        this.unfollow()
        const npc = npcHandler.get(id)

        if(npc == null || !this.reaches(npc)) {
            return
        }

        actionHandler.npcAction(this, npc, action)
    }

    public walk(x: number, y: number) {
        const attrib = this.map.getAttrib(x, y)
        if(attrib != null) {
            attrib.walked(this)
            return
        } else {
            super.walk(x, y)
        }
    }

    protected onMove(animate: boolean): void {
        this.map.broadcast(new MovePlayerPacket(this.id, this.x, this.y, animate ? this.predictWalkDelay : -1))
    }

    public send(packet: Packet) {
        this.connection.send(packet)
    }

    private get updateAppearancePacket() {
        return new UpdatePlayerAppearancePacket(
            this.id,
            this.equipment.appearanceValues
        )
    }

    public equipItem(slot: number) {
        const item = this.inventory.remove(slot).data
        const unequipped = this.equipment.set(item.equipSlot, item)
        if(unequipped != null) {
            this.inventory.addData(unequipped, 1)
            this.attributes.unsetArmor(unequipped, false)
        }
        this.attributes.setArmor(item)

        playerHandler.broadcast(this.updateAppearancePacket)
    }

    public unequipItem(slot: EquipSlot) {
        if(!this.inventory.hasSpace()) {
            return
        }

        const unequipped = this.equipment.remove(slot)
        this.inventory.addData(unequipped, 1, true)
        this.attributes.unsetArmor(unequipped)

        playerHandler.broadcast(this.updateAppearancePacket)
    }

    public dropItem(slot: number) {
        const item = this.inventory.remove(slot)
        this.map.dropItem(item.data, item.amount, this.x, this.y)
    }

    public say(message: string) {
        playerHandler.broadcast(new MessagePacket(this.name + ": " + message))
    }

    public sendMessage(message: string) {
        this.send(new MessagePacket(message))
    }

    public remove() {
        playerHandler.remove(this)
        super.remove()
    }

}