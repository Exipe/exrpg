
import { EquipmentData, Sprite } from "exrpg"
import { Game } from "../game"
import { PlayerSprite } from "./player-sprite"
import { Goal } from "./path-finder"
import { AttackPlayerPacket, FollowPlayerPacket } from "../../connection/packet"
import { Character } from "./character"

export class Player extends Character {

    public readonly id: number
    public readonly name: string
    public readonly sprite: PlayerSprite

    private _onContext: (player: Player) => void

    constructor(game: Game, playerSprite: PlayerSprite, id: number, name: string, x: number, y: number, onContext: (player: Player) => void) {
        super(game, x, y, playerSprite.width, playerSprite.height)
        this.setNameTag("playerName", name)
        this.setLight(48)

        this.id = id
        this.name = name
        this.sprite = playerSprite
        this._onContext = onContext
    }

    protected onContext(_: any) {
        this._onContext(this)
    }

    public draw() {
        this.sprite.draw(this.drawX, this.drawY)
    }

}

export async function initPlayers(game: Game) {
    const connection = game.connection
    const engine = game.engine

    const baseSprite = 
    await engine.loadTexture("char/man.png")
    .then(texture => 
        new Sprite(engine, texture)
    )

    const onContext = (player: Player) => {
        if(player.id == game.localId) {
            return
        }

        const goal: Goal = {
            x: player.tileX,
            y: player.tileY,
            width: 1,
            height: 1,
            distance: 1
        }

        game.ctxMenu.add(["Attack " + player.name, () => {
            game.walkToGoal(goal)
            connection.send(new AttackPlayerPacket(player.id))
        }])

        game.ctxMenu.add(["Follow " + player.name, () => {
            game.walkToGoal(goal)
            connection.send(new FollowPlayerPacket(player.id))
        }])
    }

    const getAppearanceValues = (equipment: string[]) => {
        const appearanceValues = [] as EquipmentData[]
        equipment.forEach(id => {
            const equipData = engine.itemHandler.get(id).equipData
            if(equipData.drawable) {
                appearanceValues.push(equipData)
            }
        })
        return appearanceValues
    }

    connection.on("WELCOME", (id: number) => {
        game.localId = id
    })

    connection.on("ADD_PLAYER", data => {
        data.forEach((p: any) => {
            const sprite = new PlayerSprite(engine, baseSprite, 
                getAppearanceValues(p.equipment)
            )
            const player = new Player(game, sprite, p.id, p.name, p.x, p.y, onContext)
            game.addPlayer(player)
        });
    })

    connection.on("PLAYER_APPEARANCE", data => {
        const playerSprite = game.getPlayer(data.id).sprite
        playerSprite.setAppearanceValues(getAppearanceValues(data.equipment))
    })

    connection.on("REMOVE_PLAYER", (id: number) => {
        game.removePlayer(id)
    })

    connection.on("MOVE_PLAYER", data => {
        const player = game.getPlayer(data.id)

        if(data.animate) {
            player.walkTo(data.x, data.y, data.animationSpeed)
        } else {
            player.place(data.x, data.y)
        }
    })
}
