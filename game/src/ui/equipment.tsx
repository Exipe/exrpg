
import React = require("react");
import { ItemData } from "exrpg";
import { EquipmentModel } from "../game/model/equipment-model";
import { AttributeModel, ATTRIBUTES } from "../game/model/attrib-model";

export interface EquipmentProps {
    equipment: EquipmentModel,
    attributes: AttributeModel
}

interface EquipmentSlotProps {
    id: string,
    item: ItemData,
    unequip: (id: string) => void
}

function EquipmentSlot(props: EquipmentSlotProps) {
    const item = props.item

    let style = {} as React.CSSProperties
    let onClick = () => {}

    if(item != null) {
        style.backgroundImage = `url('${ item.spritePath }')`
        onClick = () => { props.unequip(item.id) }
    }

    return <div
        id={props.id}
        style={style}
        onClick={onClick}
    />
}

export function Equipment(props: EquipmentProps) {
    const [equippedItems, setEquippedItems] = React.useState(props.equipment.equippedItems)
    const [attributes, setAttributes] = React.useState(props.attributes.attributes)

    React.useEffect(() => {
        props.equipment.onEquipmentUpdate = equippedItems => {
            setEquippedItems(equippedItems)
        }

        return () => {
            props.equipment.onEquipmentUpdate = null
        }
    }, [])

    React.useEffect(() => {
        props.attributes.onAttributeUpdate = attributes => {
            setAttributes(attributes)
        }

        return () => {
            props.attributes.onAttributeUpdate = null
        }
    }, [])

    const unequip = (id: string, slot: string) => props.equipment.unequipItem(id, slot)

    const attribValues = ATTRIBUTES.map(attribType => {
        const attrib = attributes.get(attribType[0])

        let suffix = ""
        if(attrib.armor > 0) {
            suffix = " (+" + attrib.armor + ")"
        } else if(attrib.armor < 0) {
            suffix = " (" + attrib.armor + ")"
        }

        let title = attribType[2]
        if(attribType[0] == "speed_move") {
            const percentage = (attributes.walkSpeed * 100).toFixed(2)
            title += ` (${percentage}%)`
        }

        return {
            name: attribType[1],
            className: attrib.armor >= 0 ? "positiveBonus" : "negativeBonus",
            title: title,
            value: (attrib.total) + suffix
        }
    })

    return <div id="equipment">
        <div id="equipmentGrid">
            <div /> 
            <EquipmentSlot id="helmSlot" item={equippedItems.helm} unequip={ id => unequip(id, "helm") } />
            <div />

            <EquipmentSlot id="swordSlot" item={equippedItems.sword} unequip={ id => unequip(id, "sword") } />
            <EquipmentSlot id="plateSlot" item={equippedItems.plate} unequip={ id => unequip(id, "plate") } />
            <EquipmentSlot id="shieldSlot" item={equippedItems.shield} unequip={ id => unequip(id, "shield") } />

            <div /> 
            <EquipmentSlot id="legsSlot" item={equippedItems.legs} unequip={ id => unequip(id, "legs") } />
            <div />
        </div>

        <ul id="attribs">
            { attribValues.map(attrib =>
                <li key={attrib.name} title={attrib.title}>
                    {attrib.name}: <span className={attrib.className}>{attrib.value}</span>
                </li>
            )}
        </ul>
    </div>
}