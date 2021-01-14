
export class StatusModel {

    private _health: number
    private _totalHealth: number

    private _level: number
    private _experience: number
    private _requiredExperience: number

    private _name: string

    public get name() {
        return this._name
    }

    public get level() {
        return this._level
    }

    public get experience() {
        return this._experience
    }

    public get requiredExperience() {
        return this._requiredExperience
    }

    public get health() {
        return this._health
    }

    public get totalHealth() {
        return this._totalHealth
    }

    public onLevelUpdate = null as (level: number, experience: number, requiredExperience: number) => void

    public onHealthUpdate = null as (health: number, totalHealth: number) => void

    public onNameChange = null as (name: string) => void

    public setHealth(health: number, totalHealth: number) {
        this._health = health
        this._totalHealth = totalHealth

        if(this.onHealthUpdate != null) {
            this.onHealthUpdate(health, totalHealth)
        }
    }

    public setLevel(level: number, experience: number, requiredExperience: number) {
        this._level = level
        this._experience = experience
        this._requiredExperience = requiredExperience

        if(this.onLevelUpdate != null) {
            this.onLevelUpdate(level, experience, requiredExperience)
        }
    }

    public set name(name: string) {
        this._name = name
        if(this.onNameChange != null) {
            this.onNameChange(name)
        }
    }

}