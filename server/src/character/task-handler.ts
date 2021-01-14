
import { currentTime } from "../util"
import { Task } from "./task"

export class TaskHandler {

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

        const timePassed = currentTime() - task.lastExecution
        if(timePassed >= task.delay) {
            this.executeTask()
        } else {
            this.setTimeout(task.delay - timePassed)
        }
    }

    public stopTask(task = this.task) {
        if(this.task != task) {
            return
        }

        clearTimeout(this.timeout)
        this.task = null
    }

    private executeTask() {
        this.task.lastExecution = currentTime()
        this.setTimeout(this.task.delay)

        this.task.tick()
    }

}