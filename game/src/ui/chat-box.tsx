
import React = require("react")
import { ChatModel } from "../game/model/chat-model"

export interface ChatBoxProps {
    chat: ChatModel
}

export function ChatBox(props: ChatBoxProps) {
    const chat = props.chat

    const [messages, setMessages] = React.useState(props.chat.messages)
    const [input, setInput] = React.useState("")
    const inputRef = React.useRef(null as HTMLInputElement)

    React.useEffect(() => {
        chat.onMessageUpdate = messages => setMessages(messages)

        return () => chat.onMessageUpdate = null
    }, [])

    React.useEffect(() => {
        const onEnter = (e: KeyboardEvent) => {
            if(e.key == "Enter") {
                inputRef.current.focus()
            }
        }

        document.addEventListener("keydown", onEnter)

        return () => {
            document.removeEventListener("keydown", onEnter)
        }
    })

    function enterMessage() {
        chat.sendMessage(input)
        setInput("")
    }

    return <div id="chatBox">
        <div id="chatBoxMessageArea">
            {messages.map((m, i) => <p key={i}>{m}</p>)}
        </div>

        <input id="chatBoxInput" 
               value={input} 
               ref={inputRef}
               onChange={(e) => { setInput(e.target.value) }}
               onKeyDown={(e) => { if(e.key == "Enter" && input.length > 0) enterMessage() }}
               maxLength={100}></input>
    </div>
}