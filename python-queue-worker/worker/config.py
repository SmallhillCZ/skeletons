import os

REDIS_URL = os.environ.get("REDIS_URL", "redis://127.0.0.1:6379")
WORKER_TASKS = os.environ.get("WORKER_TASKS", "*")

RESULTS_QUEUE = "worker-results"
JOB_LOCK_DURATION_MS = 60_000


def task_queue(task: str) -> str:
    return f"worker-{task}"
