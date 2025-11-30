import * as api from '../api/task.ts'
import type { Task } from '../entity/tasks.ts'

interface ListTaskViewProps {
  taskList: Task[]
  reloadTasks: () => Promise<void>
}

export const ListTaskView = (props: ListTaskViewProps) => {
  if (props.taskList.length === 0) {
    return (
      <div className="text-center text-muted py-5 px-3 border border-2 border-secondary-subtle rounded-4 bg-white">
        タスクは全て完了済みです🎉
      </div>
    )
  }

  return (
    <div className="row g-3">
      {props.taskList.map(task => (
        <div className="col-12 col-md-6" key={task.id}>
          <TaskCard task={task} reloadTasks={props.reloadTasks} />
        </div>
      ))}
    </div>
  )
}

interface TaskCardProps {
  task: Task
  reloadTasks: () => Promise<void>
}

const TaskCard = (props: TaskCardProps) => {
  async function clickDone(): Promise<void> {
    await api.postTaskDone(props.task)
    await props.reloadTasks()
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column gap-2">
        <span className="badge text-bg-secondary align-self-start">
          #
          {props.task.id}
        </span>
        <p className="card-text flex-grow-1 mb-0">{props.task.text}</p>
        <button
          className="btn btn-outline-success mt-2"
          onClick={clickDone}
          type="button"
        >
          done
        </button>
      </div>
    </div>
  )
}
