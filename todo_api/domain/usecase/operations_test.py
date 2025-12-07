from unittest import TestCase
from todo_api.domain.entity.entity import Task

from todo_api.memdb.memdb import MemDB
from .operations import OperationInteractor


class OperationTest(TestCase):
    def test_task_work(self):
        db = MemDB()
        op = OperationInteractor(db)

        tasks = op.show_tasks()

        assert len(tasks) > 0, "初期状態のリポジトリからはタスクが引けること"

        new_task = Task(
            id=None,
            text="new task",
            status="todo",
        )
        created_task = op.create_task(new_task)

        assert created_task["id"] is not None, "タスクIDが割り振られること"

    def test_start_task(self):
        db = MemDB()
        op = OperationInteractor(db)

        # Get initial tasks
        tasks = op.show_tasks()
        assert len(tasks) == 2, "初期状態で2つのタスクがあること"

        # Start the first task
        task_id = tasks[0]["id"]
        assert task_id is not None
        started_task = op.start_task(task_id)

        assert started_task["status"] == "in progress", "タスクが進行中になること"
        assert started_task["id"] == task_id, "タスクIDが変わらないこと"

        # Verify task still appears in unfinished list
        tasks_after_start = op.show_tasks()
        assert len(tasks_after_start) == 2, "進行中のタスクが未完了リストに含まれること"
