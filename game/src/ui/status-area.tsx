
import React = require("react");
import { StatusModel } from "../game/model/status-model";

export interface StatusProps {
    model: StatusModel
}

interface HealthProps {
    health: number,
    totalHealth: number,
    setOnHealthUpdate: (onHealthUpdate: (health: number, totalHealth: number) => void) => void
}

function HealthBar(props: HealthProps) {
    const [health, setHealth] = React.useState(props.health)
    const [totalHealth, setTotalHealth] = React.useState(props.totalHealth)

    React.useEffect(() => {
        props.setOnHealthUpdate((health, totalHealth) => {
            setHealth(health)
            setTotalHealth(totalHealth)
        })

        return () => {
            props.setOnHealthUpdate(null)
        }
    }, [])

    const percentage = health / totalHealth * 100

    const style = {
        width: `${percentage}%`
    } as React.CSSProperties

    return <div className="statusBar" id="healthBar">
        <div className="barFill" style={style} id="healthFill" />
        <p>{health} / {totalHealth}</p>
    </div>
}

export function StatusArea(props: StatusProps) {
    return <div id="statusArea">
        <div id="nameAndLevel">
            <p>player_name</p>
            <p>player_level</p>
        </div>

        <HealthBar 
            health={props.model.health}
            totalHealth={props.model.totalHealth}
            setOnHealthUpdate={ (onHealthUpdate) => { 
                props.model.onHealthUpdate = onHealthUpdate } }
        />

        <div className="statusBar" id="experienceBar">
            <div className="barFill" id="experienceFill" />
            <p>player_experience</p>
        </div>
    </div>
}