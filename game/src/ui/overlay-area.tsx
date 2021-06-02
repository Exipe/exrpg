import { useRef } from "react";
import { HealthBarModel, HitSplatModel, HitSplatStyle, NameTagModel, OverlayAreaModel, OverlayModel } from "../game/model/overlay-model";
import React = require("react")

export interface OverlayAreaProps {
    overlayAreaModel: OverlayAreaModel
}

interface OverlayProps {
    overlayModel: OverlayModel
    className: string
    children: any
}

function Overlay(props: OverlayProps) {
    const overlayModel = props.overlayModel
    const domRef = useRef(null as HTMLDivElement)

    React.useEffect(() => {
        overlayModel.onMove = (x: number, y: number) => {
            const style = domRef.current.style

            style.left = `${x}px`
            style.top = `${y}px`
        }

        return () => {
            overlayModel.onMove = null
        }
    }, [])

    return <div 
    className={"overlay " + props.className} 
    style={{ left: overlayModel.x, top: overlayModel.y }}
    ref={domRef}>
        {props.children}
    </div>
}

interface NameTagProps {
    model: NameTagModel
}

function NameTag(props: NameTagProps) {
    const model = props.model
    let content = <>{model.name}</>
    let className: string

    switch(model.style) {
        case "player":
            className = "playerName"
            break
        case "npc":
            className = "npcName"
            break
        case "dev":
            className = "playerName"
            content = <><img className="text-icon" src="ui/crown.png" /> {model.name}</>
            break
    }

    return <Overlay overlayModel={model} className={className}>
        {content}
    </Overlay>
}

interface HitSplatProps {
    model: HitSplatModel
}

function HitSplat(props: HitSplatProps) {
    const model = props.model
    let text: string
    let className: string

    switch(model.style) {
        case "hit":
            text = `-${model.hit}`
            className = "hitSplat"
            break
        case "miss":
            text = `-${model.hit}`
            className = "missSplat"
            break
        case "heal":
            text = `+${model.hit}`
            className = "healSplat"
    }

    return <Overlay overlayModel={model} className={className}>
        {text}
    </Overlay>
}

interface HealthBarProps {
    healthBarModel: HealthBarModel
}

function HealthBar(props: HealthBarProps) {
    const fillRef = useRef(null as HTMLDivElement)
    const healthBarModel = props.healthBarModel

    React.useEffect(() => {
        healthBarModel.onRatioUpdate = ratio => {
            const style = fillRef.current.style

            style.width = `${ratio * 100}%`
        }
    }, [])

    const fillStyle = {
        width: `${healthBarModel.ratio * 100}%`
    }

    return <Overlay overlayModel={healthBarModel} className={"overlayHealthBar"}>
        <div ref={fillRef} className={"overlayHealthFill"} style={fillStyle}></div>
    </Overlay>
}

export function OverlayArea(props: OverlayAreaProps) {
    const overlayAreaModel = props.overlayAreaModel

    const [overlayModels, setOverlayModels] = React.useState(overlayAreaModel.overlayModels)

    React.useEffect(() => {
        overlayAreaModel.onOverlayUpdate = overlayModels => setOverlayModels(overlayModels)

        return () => overlayAreaModel.onOverlayUpdate = null
    }, [])

    const overlays = overlayModels.map(model => {
        if(model instanceof HitSplatModel) {
            return <HitSplat key={model.id} model={model} />
        }

        if(model instanceof NameTagModel) {
            return <NameTag key={model.id} model={model} />
        }

        else if(model instanceof HealthBarModel) {
            return <HealthBar key={model.id} healthBarModel={model} />
        }
    })

    return <div>{overlays}</div>
}
