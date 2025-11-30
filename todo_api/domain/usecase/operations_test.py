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

        # Create a new task
        new_task = Task(
            id=None,
            text="test task",
            status="todo",
        )
        created_task = op.create_task(new_task)
        task_id = created_task["id"]
        assert task_id is not None

        # Start the task
        started_task = op.start_task(task_id)
        assert started_task["status"] == "in_progress", (
            "タスクが in_progress になること"
        )

        # Verify it's still in the unfinished list
        tasks = op.show_tasks()
        assert any(task["id"] == task_id for task in tasks), (
            "in_progress のタスクが未完了リストに含まれること"
        )
