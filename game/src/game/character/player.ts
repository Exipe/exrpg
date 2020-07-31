
import { Sprite } from "exrpg"
import { Entity } from "exrpg/dist/entity/entity"
import { Game } from "../game"
import { Walking } from "./walking"
import { PlayerSprite } from "./player-sprite"
import { Goal } from "./path-finder"
import { FollowPlayerPacket } from "../../connection/packet"

export class Player extends Entity {

    public readonly id: number
    public readonly name: string
    public readonly sprite: PlayerSprite

    private walking: Walking = null

    private _onContext: (player: Player) => void

    constructor(playerSprite: PlayerSprite, id: number, name: string, x: number, y: number, onContext: (player: Player) => void) {
        super(x, y, playerSprite.width, playerSprite.height)
        
        this.id = id
        this.name = name
        this.sprite = playerSprite
        this._onContext = onContext
    }

    protected onContext(_: any) {
        this._onContext(this)
    }

    public animate(dt: number) {
        if(this.walking == null) {
            return
        }

        if(this.walking.animate(dt)) {
            this.walking = null
        }
    }

    draw() {
        this.sprite.draw(this.drawX, this.drawY)
    }

    public walkTo(x: number, y: number, animationSpeed: number) {
        this.tileX = x
        this.tileY = y
        this.walking = new Walking(this, x, y, animationSpeed)
    }

    public place(x: number, y: number) {
        this.walking = null
        this.moveTile(x, y)
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

    const getEquipData = (id: string) => {
        return id == "" ? null : engine.itemHandler.get(id).equipData
    }

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

        game.ctxMenu.add(["Follow " + player.name, () => {
            game.walkToGoal(goal)
            connection.send(new FollowPlayerPacket(player.id))
        }])
    }

    connection.on("WELCOME", (id: number) => {
        game.localId = id
    })

    connection.on("ADD_PLAYER", data => {
        data.forEach((p: any) => {
            const sprite = new PlayerSprite(engine, baseSprite, 
                getEquipData(p.legs), 
                getEquipData(p.plate), 
                getEquipData(p.helm), 
                getEquipData(p.shield)
            )
            const player = new Player(sprite, p.id, p.name, p.x, p.y, onContext)
            game.addPlayer(player)
        });
    })

    connection.on("PLAYER_APPEARANCE", data => {
        const playerSprite = game.getPlayer(data.id).sprite
        playerSprite.set("shield", getEquipData(data.shield))
        playerSprite.set("helm", getEquipData(data.helm))
        playerSprite.set("plate", getEquipData(data.plate))
        playerSprite.set("legs", getEquipData(data.legs))
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
