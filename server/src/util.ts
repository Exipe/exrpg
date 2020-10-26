
import { ObjectData } from "./object/object-data"

export function randomChance(probability: number) {
    return Math.random() < 1 / probability
}

export function randomInt(lowest: number, highest: number) {
    if(highest < lowest) {
        throw "Upper limit has to be higher than lower limit"
    }

    return lowest + Math.floor((highest - lowest + 1) * Math.random())
}

export function randomOffset(center: number, radius: number) {
    return center - radius + Math.floor((radius * 2 + 1) * Math.random())
}

export function objectDirection(objData: ObjectData, objX: number, objY: number, px: number, py: number) {
    if(px < objX) {
        return [1, 0]
    } else if(px >= objX + objData.width) {
        return [-1, 0]
    } else if(py < objY) {
        return [0, 1]
    } else if(py > objY) {
        return [0, -1]
    } else {
        return [0, 0]
    }
}

export function formatStrings(strings: string[], prefix: string, separator: string, suffix: string) {
    return prefix + strings.join(separator) + suffix
}

export function speedBonus(x: number) {
    let result = 0.0, remainder = Math.abs(x)

    if(remainder > 25) {
        result += 0.005 * (remainder - 25)
        remainder = 25
    }

    if(remainder > 5) {
        result += 0.01 * (remainder - 5)
        remainder = 5
    }

    result += 0.02 * remainder

    return Math.max(0.05, 1 + (x >= 0 ? 1 : -1) * result)
}
