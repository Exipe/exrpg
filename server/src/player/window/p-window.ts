
import { Player } from "../player";

export type WindowId = "Shop" | "Dialogue" | "Crafting"

export interface PrimaryWindow {
    id: WindowId
    open(p: Player): void
}