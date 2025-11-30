import { useCallback, useEffect, useState } from 'react'

import * as api from './api/task.ts'
import type { Task } from './entity/tasks.ts'
import { NewTaskForm } from './views/newTask.tsx'
import { ListTaskView } from './views/taskList.tsx'

function App() {
  const [taskList, setTasks] = useState<Task[]>([])

  const reloadTasks = useCallback(async () => {
    const tasks = await api.loadTasks()
    setTasks(tasks)
  }, [])

  useEffect(() => {
    let ignore = false

    async function fetchInitialTasks() {
      const tasks = await api.loadTasks()
      if (!ignore) {
        setTasks(tasks)
      }
    }

    void fetchInitialTasks()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="container py-5">
      <header className="mb-4 text-center text-md-start">
        <p className="text-uppercase text-muted fw-semibold mb-2">
          Task Manager
        </p>
      </header>
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <NewTaskForm reloadTasks={reloadTasks} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-8">
          <ListTaskView taskList={taskList} reloadTasks={reloadTasks} />
        </div>
      </div>
    </div>
  )
}

export default App
