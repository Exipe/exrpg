
import { Player } from "../player";

export type WindowId = "Shop" | "Dialogue"

export interface PrimaryWindow {
    id: WindowId
    open(p: Player): void
}