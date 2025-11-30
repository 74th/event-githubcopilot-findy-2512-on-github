import { useForm } from 'react-hook-form'

import * as api from '../api/task.ts'
import type { Task } from '../entity/tasks.ts'

interface Props {
  reloadTasks: () => Promise<void>
}

export const NewTaskForm = (props: Props) => {
  const { register, handleSubmit, reset } = useForm<Task>()

  const onSubmit = async (task: Task) => {
    console.log(task)
    await api.postTask(task)
    reset()
    await props.reloadTasks()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="d-grid gap-3">
      <div>
        <label className="form-label text-uppercase fw-semibold small" htmlFor="taskText">
          Task Title
        </label>
        <input
          {...register('text', { required: true })}
          id="taskText"
          type="text"
          className="form-control form-control-lg"
          placeholder="たとえば「買い物リストを作成」"
        />
      </div>
      <button className="btn btn-primary btn-lg" type="submit">
        Add
      </button>
    </form>
  )
}
