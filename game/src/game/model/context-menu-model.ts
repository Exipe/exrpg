
export type MenuEntry = [string, () => void]

export class ContextMenuModel {

    private entries = [] as MenuEntry[]

    public onOpenContextMenu: (entries: MenuEntry[], x: number, y: number) => void = null

    public open(x: number, y: number) {
        if(this.onOpenContextMenu != null) {
            this.onOpenContextMenu(this.entries, x, y)
        }

        this.entries = []
    }

    public show(entries: MenuEntry[], x: number, y: number) {
        this.entries = entries
        this.open(x, y)
    }

    public add(entry: MenuEntry) {
        this.entries.push(entry)
    }

}