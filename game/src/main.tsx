
import { Game, initGame } from "./game/game";
import React = require("react");
import { connection } from "./connection/connection";
import { initEngine, Engine } from "exrpg";
import { UiContainer } from "./ui/ui";
import { ReadyPacket } from "./connection/packet";

function windowResize(canvas: HTMLCanvasElement, engine: Engine) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    engine.resize(canvas.width, canvas.height)
}

async function setupEngine(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const engine = await initEngine(canvas, "res")
    window.onresize = () => windowResize(canvas, engine)
    return engine
}

export function Main(props: any) {
    const [game, setGame] = React.useState(null as Game)
    const canvas = React.useRef(null as HTMLCanvasElement)

    React.useEffect(() => {
        let setup = async () => {
            const engine = await setupEngine(canvas.current);
            setGame(await initGame(engine, connection))

            connection.send(new ReadyPacket())
        }

        setup()
    }, [])

    React.useEffect(() => {
        const disableContextMenu = (e: MouseEvent) => {
            e.preventDefault()
        }

        document.addEventListener("contextmenu", disableContextMenu)

        return () => {
            document.removeEventListener("contextmenu", disableContextMenu)
        }
    }, [])

    return <>
        <canvas ref={canvas}></canvas>

        {game != null &&
            <UiContainer game={game} />
        }
    </>
}