import { Entity } from "exrpg";
import { Component } from "exrpg/dist/entity/component";
import { NameTagModel, NameTagStyle, OverlayAreaModel } from "../../model/overlay-model";

export const NAME_TAG_COMPONENT = "NAME_TAG"

export class NameTagComponent extends Component {

    private nameTag = null as NameTagModel
    private readonly overlayArea = null as OverlayAreaModel
    private readonly entity: Entity

    constructor(entity: Entity, overlayArea: OverlayAreaModel) {
        super(NAME_TAG_COMPONENT)
        this.overlayArea = overlayArea
        this.entity = entity
    }

    public setNameTag(style: NameTagStyle, name: string) {
        if(this.nameTag != null) {
            this.overlayArea.removeOverlay(this.nameTag)
        }

        this.nameTag = this.overlayArea.addNameTag(name, style, ...this.entity.centerAboveCoords)
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

    draw() {}

    initialize() {}

}