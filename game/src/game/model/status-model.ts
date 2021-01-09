
export class StatusModel {

    private _health: number
    private _totalHealth: number

    public get health() {
        return this._health
    }

    public get totalHealth() {
        return this._totalHealth
    }

    public onHealthUpdate = null as (health: number, totalHealth: number) => void

    public setHealth(health: number, totalHealth: number) {
        this._health = health
        this._totalHealth = totalHealth

        if(this.onHealthUpdate != null) {
            this.onHealthUpdate(health, totalHealth)
        }
    }

}