
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
        <p>(HP) {health} / {totalHealth}</p>
    </div>
}

interface ExperienceProps {
    experience: number,
    requiredExperience: number
}

function ExperienceBar(props: ExperienceProps) {
    const experience = props.experience
    const requiredExperience = props.requiredExperience

    const percentage = experience / requiredExperience * 100

    const style = {
        width: `${percentage}%`
    } as React.CSSProperties

    return <div className="statusBar" id="experienceBar">
        <div className="barFill" style={style} id="experienceFill" />
        <p>(XP) {experience} / {requiredExperience}</p>
    </div>
}

export function StatusArea(props: StatusProps) {
    const [name, setName] = React.useState(props.model.name)

    const [level, setLevel] = React.useState(props.model.level)
    const [xp, setXp] = React.useState(props.model.experience)
    const [reqXp, setReqXp] = React.useState(props.model.requiredExperience)

    React.useEffect(() => {
        props.model.onNameChange = name => {
            setName(name)
        }

        props.model.onLevelUpdate = (level, xp, reqXp) => {
            setLevel(level)
            setXp(xp)
            setReqXp(reqXp)
        }

        return () => {
            props.model.onNameChange = null
            props.model.onLevelUpdate = null
        }
    })

    return <div id="statusArea">
        <div id="nameAndLevel">
            <p>{name}</p>
            <p>Level {level}</p>
        </div>

        <HealthBar 
            health={props.model.health}
            totalHealth={props.model.totalHealth}
            setOnHealthUpdate={ (onHealthUpdate) => { 
                props.model.onHealthUpdate = onHealthUpdate } }
        />

        <ExperienceBar
            experience={xp}
            requiredExperience={reqXp}
        />
    </div>
}