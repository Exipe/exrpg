
export abstract class Component {

    public readonly id: string

    constructor(id: string) {
        this.id = id
    }

    public abstract movePx(): void

    public abstract moveTile(): void

    public abstract animate(_dt: number): void

    public abstract initialize(): void

    public abstract destroy(): void

}