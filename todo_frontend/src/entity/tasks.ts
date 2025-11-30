export type TaskStatus = 'todo' | 'done'

/**
 * タスク
 */
export interface Task {
  id?: number
  text: string
  status?: TaskStatus
}

export function createEmptyTask(): Task {
  return {
    text: '',
    status: 'todo',
  }
}
