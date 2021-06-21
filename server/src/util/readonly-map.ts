
export class ReadOnlyMap<K, V> {

    private readonly map: Map<K, V>

    constructor(map: Map<K, V>) {
        this.map = map
    }

    public get(key: K) {
        const value = this.map.get(key)
        return value ? value : null
    }

}