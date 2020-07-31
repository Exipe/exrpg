
import React = require("react");
import { StateId } from ".";
import { initConnection, Connection } from "./connection/connection";
import { LoginPacket, RegisterPacket } from "./connection/packet";

export interface MenuProps {
    setState: (state: StateId) => void
}

const BACKGROUND = "res/menu_bg.png"

const VERSION_MAJOR = 3
const VERSION_MINOR = 0

const PROTOCOL = (window as any).protocol
const ADDRESS = (window as any).address
const PORT = (window as any).port

type ServerStatus = "Connecting" | "Online" | "Offline"

type MenuState = "main" | "register" | "login"

interface MenuStateProps {
    setMenuState: (state: MenuState) => void
    setErrorMessage: (error: string) => void
    serverStatus: ServerStatus
    connection: Connection
}

function MainMenu(properties: { props: MenuStateProps }) {
    const props = properties.props

    return <>
        <div className="menuButton"
            onClick={ () => props.setMenuState("register") }>New user</div>
        <div className="menuButton"
            onClick={ () => props.setMenuState("login") }>Existing user</div>
    </>
}

function LoginMenu(properties: { props: MenuStateProps }) {
    const props = properties.props
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")

    const login = () => {
        if(username == "") {
            props.setErrorMessage("Please provide a username.")
        }
        else if(password == "") {
            props.setErrorMessage("Please provide a password.")
        } else if(props.serverStatus != "Online") {
            props.setErrorMessage("Not connected to server.")
        } else {
            props.setErrorMessage("")
            props.connection.send(new LoginPacket(username, password))
        }
    }

    return <>
        <input className="menuInput" placeholder="Username"
            value={username} onChange={ e => setUsername(e.target.value) } />
        <input className="menuInput" type="password" placeholder="Password" autoComplete="off" 
            value={password} onChange={ e => setPassword(e.target.value) } />

        <div className="menuRow">
            <div className="menuButton"
                onClick={login}>Continue</div>
            <div className="menuButton"
                onClick={ () => props.setMenuState("main") }>Cancel</div>
        </div>
    </>
}

function RegisterMenu(properties: { props: MenuStateProps }) {
    const props = properties.props
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [repeatPassword, setRepeatPassword] = React.useState("")

    const register = () => {
        if(username == "") {
            props.setErrorMessage("Please provide a username.")
        }
        else if(password == "") {
            props.setErrorMessage("Please provide a password.")
        }
        else if(repeatPassword == "") {
            props.setErrorMessage("Please repeat your password.")
        }
        else if(password != repeatPassword) {
            props.setErrorMessage("Passwords do not match.")
        }
        else if(props.serverStatus != "Online") {
            props.setErrorMessage("Not connected to server.")
        } else {
            props.setErrorMessage("")
            props.connection.send(new RegisterPacket(username, password))
        }
    }

    return <>
        <input className="menuInput" placeholder="Username"
            value={username} onChange={ e => setUsername(e.target.value) } />
        <input className="menuInput" type="password" placeholder="Password" autoComplete="off" 
            value={password} onChange={ e => setPassword(e.target.value) } />
        <input className="menuInput" type="password" placeholder="Repeat password" autoComplete="off"  
            value={repeatPassword} onChange={ e => setRepeatPassword(e.target.value) } />

        <div className="menuRow">
            <div className="menuButton"
                onClick={register}>Register</div>
            <div className="menuButton"
                onClick={ () => props.setMenuState("main") }>Cancel</div>
        </div>
    </>
}

export function Menu(props: MenuProps) {
    const [state, setState] = React.useState("main" as MenuState)

    const [connection, setConnection] = React.useState(null as Connection)
    const [serverStatus, setServerStatus] = React.useState("Connecting" as ServerStatus)
    const [errorMessage, setErrorMessage] = React.useState("")

    React.useEffect(() => {
        const body = document.querySelector("body")
        body.style.backgroundImage = `url('${BACKGROUND}')`

        const connection = initConnection(PROTOCOL, ADDRESS, PORT)
        setConnection(connection)

        connection.onOpen(() => {
            setServerStatus("Online")
        })

        connection.onClose(() => {
            setServerStatus("Offline")
        })

        connection.on("CONNECT_RESPONSE", data => {
            if(data.message != undefined) {
                setErrorMessage(data.message)
            }

            if(data.accepted) {
                props.setState("main")
            }
        })

        return () => {
            body.style.backgroundImage = ""
            connection.onOpen(null)
            connection.onClose(null)
            connection.off("CONNECT_RESPONSE")
        }
    }, [])

    const menuStateProps: MenuStateProps = {
        setMenuState: setState,
        setErrorMessage: setErrorMessage,
        serverStatus: serverStatus,
        connection: connection
    }

    let displayState = <></>
    switch(state) {
        case "main":
            displayState = <MainMenu props={menuStateProps} />
            break
        case "login":
            displayState = <LoginMenu props={menuStateProps} />
            break
        case "register":
            displayState = <RegisterMenu props={menuStateProps} />
            break
    }

    return <div id="menu">
        <h1>ExRPG</h1>
        <p>(Demo 1.{VERSION_MAJOR}.{VERSION_MINOR})</p>
        <br />
        <p>Server status: {serverStatus}</p>

        <form id="inputContainer">
            {displayState}
        </form>

        <p>{errorMessage}</p>

        <div id="footer">
            <a target="_blank" href="https://github.com/Exipe/ExRPG">GitHub</a>
            <a target="_blank" href="#">Discord</a>
        </div>
    </div>
}