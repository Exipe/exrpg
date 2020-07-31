
export class BlockMap {

    private readonly width: number
    private readonly height: number

    private readonly grid: number[][] = []

    constructor(width: number, height: number) {
        this.width = width
        this.height = height

        for(let ri = 0; ri < height; ri++) {
            const row = []
            this.grid.push(row)

            for(let ci = 0; ci < width; ci++) {
                row.push(0)
            }
        }
    }

    private inBounds(x: number, y: number) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height
    }

    private get(x: number, y: number) {
        if(!this.inBounds(x, y)) {
            return 0
        }

        return this.grid[y][x]
    }

    private set(x: number, y: number, diff: number) {
        if(!this.inBounds(x, y)) {
            return
        }

        const curr = this.grid[y][x]
        this.grid[y][x] = Math.max(curr+diff, 0)
    }

    public block(x: number, y: number) {
        this.set(x, y, 1)
    }

    public unBlock(x: number, y: number) {
        this.set(x, y, -1)
    }

    public isBlocked(x: number, y: number) {
        return !this.inBounds(x, y) || this.grid[y][x] > 0
    }

    public resize(width: number, height: number, anchorX: 0 | 1 | 2, anchorY: 0 | 1 | 2) {
        const resized = new BlockMap(width, height)

        let offsetX = 0, offsetY = 0

        if(anchorX == 1) { //center
            offsetX = width / 2 - this.width / 2
        } else if(anchorX == 2) { //right
            offsetX = width - this.width
        }

        if(anchorY == 1) { //center
            offsetY = height / 2 - this.height / 2
        } else if(anchorY == 2) { //right
            offsetY = height - this.height
        }

        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.width; y++) {
                resized.set(x+offsetX, y+offsetY, this.get(x, y))
            }
        }

        return resized
    }

}