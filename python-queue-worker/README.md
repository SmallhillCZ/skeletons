# Python queue worker

A background worker for jobs that do not belong in the Node backend (image processing, ML, …). It has no
database or HTTP access: it talks to the backend only through Redis + [BullMQ](https://docs.bullmq.io), which
has wire-compatible clients for Node (`bullmq`, `@nestjs/bullmq`) and Python (`bullmq` on PyPI).

## Contract

- One queue per task type, `worker-<task>` (BullMQ forbids `:` in queue names and job ids).
- The backend adds jobs; the worker runs them and adds a result job to `worker-results`, which the backend
  consumes with a BullMQ processor. Scheduling (what to run, when) stays in the backend.
- Each instance runs at most one job at a time, across all its task types.

## Configuration

| Variable       | Default                  | Meaning                                          |
| -------------- | ------------------------ | ------------------------------------------------ |
| `REDIS_URL`    | `redis://127.0.0.1:6379` | Redis shared with the backend                    |
| `WORKER_TASKS` | `*`                      | Comma-separated task names this instance handles |

Tuning constants live in `worker/config.py`. `worker/cpus.py` reads the container's CPU limit (compose
`cpus:`, cgroup v1/v2) so native libraries can size their thread pools to it.

## Adding a task

1. Create `worker/tasks/<name>.py` with `NAME` and `async def run(data, results)`; run blocking work in
   `asyncio.to_thread` so BullMQ keeps renewing the job lock.
2. Register it in `worker/tasks/__init__.py`.
3. In the backend, register the queue `worker-<name>` and handle its result job name in the
   `worker-results` processor.

## Running

```bash
python -m venv .venv && .venv/bin/pip install -r requirements.txt
REDIS_URL=redis://127.0.0.1:6379 .venv/bin/python -m worker
```

```yaml
worker:
  image: ghcr.io/<owner>/<project>-worker:latest
  environment:
    REDIS_URL: redis://redis:6379
    WORKER_TASKS: example
  cpus: 2
```
