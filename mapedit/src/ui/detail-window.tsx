
import * as React from "react"
import { Button } from "./component"
import { useSelector } from "react-redux"
import { RootState } from "../store"

function mapSize() {

}

export function DetailWindow() {
    const currentWidth = "" + useSelector((state: RootState) => state.details.width)
    const currentHeight = "" + useSelector((state: RootState) => state.details.height)
    const onResize = useSelector((state: RootState) => state.details.onResize)

    const [width, setWidth] = React.useState(currentWidth)
    const [height, setHeight] = React.useState(currentHeight)

    const [anchorX, setAnchorX] = React.useState(0)
    const [anchorY, setAnchorY] = React.useState(0)

    const numericWidth = parseInt(width)
    const numericHeight = parseInt(height)

    const validInput = numericWidth != NaN && numericWidth > 0 && numericHeight != NaN && numericHeight > 0

    const anchorPoints: React.ReactNode[] = []

    function selectAnchor(x: number, y: number) {
        setAnchorX(x)
        setAnchorY(y)
    }

    for(var iy = 0; iy < 3; iy++) {
        for(var ix = 0; ix < 3; ix++) {
            const select = ix == anchorX && iy == anchorY

            anchorPoints.push(
                <div key={iy*3+ix} onClick={selectAnchor.bind(null, ix, iy)} className={ select ? "selected" : "" }></div>)
        }
    }

    return <div id="detailWindow">
        <div className="optionGrid">
            <div>Map name:</div>
            <input size={12} />
        </div>

        <div id="mapSize">
            <em>Map size</em>

            <div className="optionGrid">
                <div>Width:</div>
                <input value={width} onChange={ e => setWidth(e.currentTarget.value) } size={3} />

                <div>Height:</div>
                <input value={height} onChange={ e => setHeight(e.currentTarget.value) } size={3} />

                <div>Anchor:</div>
                <div id="anchorGrid">
                    {anchorPoints}
                </div>
            </div>

            <Button enabled={validInput} onClick={ () => { onResize(numericWidth, numericHeight, anchorX, anchorY) } }>Resize</Button>
        </div>
    </div>
}
