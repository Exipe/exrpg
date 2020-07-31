
import { useState, useEffect } from "react";
import { Dialogue } from "../game/model/dialogue-model";
import React = require("react");

interface DialogueBoxProps {
    setOnOpenDialogue: (onOpenDialogue: (dialogue: Dialogue) => void) => void
    setOnCloseDialogue: (onCloseDialogue: () => void) => void
    clickOption: (id: number, index: number) => void
}

export function DialogueBox(props: DialogueBoxProps) {
    const [dialogue, setDialogue] = useState(null as Dialogue)
    
    useEffect(() => {
        props.setOnOpenDialogue(setDialogue)
        props.setOnCloseDialogue(() => setDialogue(null))

        return () => {
            props.setOnOpenDialogue(null)
            props.setOnCloseDialogue(null)
        }
    }, [])

    if(dialogue == null) {
        return <></>
    }

    const clickOption = (index: number) => {
        props.clickOption(dialogue.id, index)
    }

    const options = dialogue.options.map((option, idx) =>
        <p key={idx} onClick={ _ => { clickOption(idx) } }>{option}</p>)

    return <div id="dialogueBox">
        <p id="dialogueName">「{dialogue.name}」</p>

        {dialogue.lines.map((line, idx) => <p key={idx}>{line}</p>)}

        <div id="dialogueOptions">
            {options}
        </div>
    </div>
}
