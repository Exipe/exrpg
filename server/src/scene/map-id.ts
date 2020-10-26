
export type MapId = "main" | "cave"

export const maps = [ "main", "cave" ] as MapId[]

export function isMapId(id: string): id is MapId {
    return maps.includes(id as MapId)
}