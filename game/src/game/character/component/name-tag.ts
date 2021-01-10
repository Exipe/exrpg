import { Entity } from "exrpg";
import { Component } from "exrpg/dist/entity/component";
import { OverlayAreaModel, TextModel, TextStyle } from "../../model/overlay-model";

export const NAME_TAG_COMPONENT = "NAME_TAG"

export class NameTagComponent extends Component {

    private nameTag = null as TextModel
    private readonly overlayArea = null as OverlayAreaModel
    private readonly entity: Entity

    constructor(entity: Entity, overlayArea: OverlayAreaModel) {
        super(NAME_TAG_COMPONENT)
        this.overlayArea = overlayArea
        this.entity = entity
    }

    public setNameTag(style: TextStyle, name: string) {
        if(this.nameTag != null) {
            this.overlayArea.removeOverlay(this.nameTag)
        }

        this.nameTag = this.overlayArea.addText(name, style, ...this.entity.centerAboveCoords)
    }

    movePx() {
        if(this.nameTag != null) {
            this.nameTag.move(...this.entity.centerAboveCoords)
        }
    }

    destroy() {
        if(this.nameTag != null) {
            this.overlayArea.removeOverlay(this.nameTag)
        }
    }

    moveTile() {}

    animate(_dt: number) {}

    initialize() {}

}