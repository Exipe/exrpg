
import { Scene } from "exrpg"

export interface Goal {
    x: number,
    y: number,
    width: number,
    height: number,
    distance: number
}

class Point {

    parent: Point = null

    cost = 0
    heuristic = 0
    readonly x: number
    readonly y: number

    distX = 0
    distY = 0

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    updateHeuristic(goal: Goal) {
        this.distX = Math.abs(goal.x - this.x)
        this.distY = Math.abs(goal.y - this.y)
        this.heuristic = Math.max(this.distX, this.distY)
    }

    public get weight() {
        return this.cost + this.heuristic
    }

}

const sort = (a: Point, b: Point) => {
    return (b.cost + b.heuristic) - (a.cost + a.heuristic)
}

const findPoint = (point: Point, other: Point) => {
    return other.x == point.x && other.y == point.y
}

/*
if the point is already in the list, with a more expensive cost, remove it
*/
const filterStale = (point: Point, other: Point) => {
    return other.x != point.x || other.y != point.y || other.cost < point.cost
}

function calculateCost(diffX: number, diffY: number) {
    if(diffX == 0 || diffY == 0) {
        return 1
    } else {
        return 1.4
    }
}

const TIME_LIMIT = 250

export function findPath(map: Scene, startX: number, startY: number, goal: Goal) {
    const pathFinder = new PathFinder(map, startX, startY, goal)

    //const t0 = performance.now()
    const path = pathFinder.findPath()
    //const t1 = performance.now()
    //console.log("Took ", t1-t0, "ms to find path.")

    return path
}

function getTime() {
    return new Date().getTime()
}

export class PathFinder {

    private readonly goal: Goal
    private readonly xReq: number
    private readonly yReq: number

    private readonly map: Scene

    private closest: Point

    private open: Point[]

    constructor(map: Scene, startX: number, startY: number, goal: Goal) {
        this.goal = goal
        this.xReq = Math.max(this.goal.width / 2 + this.goal.distance, 1)
        this.yReq = Math.max(this.goal.height / 2 + this.goal.distance, 1)

        this.map = map
        
        this.closest = new Point(startX, startY)
        this.closest.updateHeuristic(goal)
        this.open = [this.closest]
    }

    private blocked(x: number, y: number, diffX: number, diffY: number) {
        return this.map.isBlocked(x+diffX, y+diffY) || 
               (diffX != 0 && this.map.isBlocked(x+diffX, y)) || 
               (diffY != 0 && this.map.isBlocked(x, y+diffY))
    }

    private reachedGoal(point: Point) {
        return ((point.distX < this.xReq && point.distY <= this.yReq - 1) || (point.distX <= this.xReq - 1 && point.distY < this.yReq))
    }

    private backTracePath() {
        let closest = this.closest

        let points: [number, number][] = []
        let diffX = 0
        let diffY = 0

        while(closest != null) {
            if(closest.parent == null) {
                break
            }

            let nDiffX = closest.x - closest.parent.x
            let nDiffY = closest.y - closest.parent.y

            if(nDiffX == diffX && nDiffY == diffY) {
                closest = closest.parent
                continue
            }

            diffX = nDiffX
            diffY = nDiffY
            points.unshift([closest.x, closest.y])
            closest = closest.parent
        }

        return points
    }

    private insertPoint(point: Point) {
        this.open.push(point)
        this.open.sort(sort)
    }

    public findPath() {
        let closed = []
        let point: Point = null

        const startTime = getTime()

        while(this.open.length > 0 && (getTime() - startTime < TIME_LIMIT)) {
            point = this.open.pop()

            if(point.heuristic < this.closest.heuristic) {
                this.closest = point
            }

            if(this.reachedGoal(point)) {
                this.closest = point
                break
            }

            closed.push(point)

            for(let xi = -1; xi <= 1; xi++) {
                for(let yi = -1; yi <= 1; yi++) {
                    if((xi == 0 && yi == 0) || this.blocked(point.x, point.y, xi, yi)) {
                        continue
                    }

                    const next = new Point(point.x + xi, point.y + yi)
                    next.cost = point.cost + calculateCost(xi, yi)

                    next.updateHeuristic(this.goal)
                    if(next.distX < this.goal.distance && next.distY < this.goal.distance) {
                        continue
                    }

                    this.open = this.open.filter(filterStale.bind(null, next))
                    closed = closed.filter(filterStale.bind(null, next))

                    if(this.open.find(findPoint.bind(null, next)) || closed.find(findPoint.bind(null, next))) {
                        continue
                    }

                    next.parent = point
                    this.insertPoint(next)
                }
            }
        }

        return this.backTracePath()
    }

}
