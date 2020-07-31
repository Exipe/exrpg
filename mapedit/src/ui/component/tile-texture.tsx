
import * as React from "react"
import { TILE_SIZE } from "exrpg"

const ZOOM = 3

function getStyle(src: string, txtWidth: number, txtHeight: number, x: number, y: number): React.CSSProperties {
    const width = TILE_SIZE * ZOOM
    const height = TILE_SIZE * ZOOM

    const posX = -x * width
    const posY = -y * height
    const srcWidth = txtWidth * ZOOM
    const srcHeight = txtHeight * ZOOM

    return {
        borderWidth: ZOOM,

        width: width,
        height: height,

        backgroundImage: "url('" + src + "')",
        backgroundPosition: posX + "px " + posY + "px",
        backgroundSize: srcWidth + "px " + srcHeight + "px"
    }
}

interface TileTexturesProps {
    src: string,
    width: number,
    height: number,
    onClick: (x: number, y: number) => void, 
    isSelected: (x: number, y: number) => boolean
}

export function TileTextures(props: TileTexturesProps) {
    const textureGrid: React.ReactNode[] = []

    for(let ir = 0; ir < props.height / TILE_SIZE; ir++) {
        const textureRow: React.ReactNode[] = []

        for(let ic = 0; ic < props.width / TILE_SIZE; ic++) {
            textureRow.push(<div onClick={ _e => props.onClick(ic, ir) } key={ic} className={"tileTexture" + (props.isSelected(ic, ir) ? " selected" : "")}
                                 style={getStyle(props.src, props.width, props.height, ic, ir)}></div>)
        }

        textureGrid.push(<div className="tileRow" key={ir}>{textureRow}</div>)
    }

    return <>{textureGrid}</>
}