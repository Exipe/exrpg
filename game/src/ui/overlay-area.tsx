import { useRef } from "react";
import { HealthBarModel, OverlayAreaModel, OverlayModel, TextModel } from "../game/model/overlay-model";
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

interface TextProps {
    textModel: TextModel
}

function Text(props: TextProps) {
    const textModel = props.textModel
    return <Overlay overlayModel={textModel} className={textModel.textStyle}>
        {textModel.text}
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
        if(model instanceof TextModel) {
            return <Text key={model.id} textModel={model} />
        }

        else if(model instanceof HealthBarModel) {
            return <HealthBar key={model.id} healthBarModel={model} />
        }
    })

    return <div>{overlays}</div>
}
