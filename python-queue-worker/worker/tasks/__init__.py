from typing import Any, Awaitable, Callable

from bullmq import Queue

from . import example

TaskHandler = Callable[[dict[str, Any], Queue], Awaitable[None]]

TASKS: dict[str, TaskHandler] = {
    example.NAME: example.run,
}
