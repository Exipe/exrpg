
export interface Progress {
    position: {
        x: number,
        y: number,
        map: string
    }

    inventory: [string, number][]

    equipment: {
        helm: string,
        plate: string,
        legs: string,
        shield: string
    }

    attributes: [string, number][]
}