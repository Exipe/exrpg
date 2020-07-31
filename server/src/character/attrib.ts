
export type AttribId = "accuracy" | "damage" | "defence" | "speed_attack" | "speed_move"

export const ATTRIBUTES = [ "accuracy", "damage", "defence", "speed_attack", "speed_move" ] as AttribId[]

export function isAttribId(id: string): id is AttribId {
    return ATTRIBUTES.includes(id as AttribId)
}

export interface AttribHandler {
    get(attrib: AttribId): number;
}
