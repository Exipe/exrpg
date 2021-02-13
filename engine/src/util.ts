
export type AnchorPoint = 0 | 1 | 2

export function resizeOffset(width: number, height: number, oldWidth: number, oldHeight: number, 
    anchorX: AnchorPoint, anchorY: AnchorPoint) {
        let offsetX = 0
        let offsetY = 0

        if(anchorX == 1) { // center
            offsetX = width / 2 - this.width / 2
        } else if(anchorX == 2) { // right
            offsetX = width - this.width
        }

        if(anchorY == 1) { // center
            offsetY = height / 2 - this.height / 2
        } else if(anchorY == 2) { // bottom
            offsetY = height - this.height
        }

        return [offsetX, offsetY]
}