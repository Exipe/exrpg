
function currentTime() {
    return (new Date()).getTime()
}

export interface Task {
    tick: () => void,
    timer: number
}

export class TaskHandler {

    private lastExecution = -1

    private task: Task

    private timeout: NodeJS.Timeout = null

    private setTimeout(timer: number) {
        this.timeout = setTimeout(() => this.executeTask(), timer)
    }

    public setTask(task: Task) {
        if(this.task == task) {
            return
        }

        clearTimeout(this.timeout)
        this.task = task

        const timePassed = currentTime() - this.lastExecution
        if(timePassed >= task.timer) {
            this.executeTask()
        } else {
            this.setTimeout(task.timer - timePassed)
        }
    }

    public stopTask(task: Task = this.task) {
        if(this.task != task) {
            return
        }

        clearTimeout(this.timeout)
        this.task = null
    }

    private executeTask() {
        this.lastExecution = currentTime()
        this.setTimeout(this.task.timer)

        this.task.tick()
    }

}