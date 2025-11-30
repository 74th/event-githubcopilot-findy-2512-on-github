from typing import Literal, Optional, TypedDict


class Task(TypedDict):
    id: Optional[int]
    text: str
    status: Literal["todo", "done"]
