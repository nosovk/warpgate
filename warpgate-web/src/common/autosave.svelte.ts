export class Autosave<T> {
    private key: string
    private _value: T = $state() as T

    constructor(key: string, initial: T) {
        this.key = `warpgate:${key}`
        this._value = JSON.parse(
            localStorage.getItem(this.key) ?? JSON.stringify(initial),
        )
    }

    get value(): T {
        return this._value
    }

    set value(newValue: T) {
        this._value = newValue
        localStorage.setItem(this.key, JSON.stringify(newValue))
    }
}

export function autosave<T>(key: string, initial: T): Autosave<T> {
    return new Autosave(key, initial)
}
