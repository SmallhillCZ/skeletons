import asyncio
import logging
from typing import Any

from bullmq import Queue

NAME = "example"
RESULT = "example-done"

logger = logging.getLogger(NAME)


def process(data: dict[str, Any]) -> dict[str, Any]:
    return {"id": data.get("id"), "length": len(str(data.get("text", "")))}


async def run(data: dict[str, Any], results: Queue) -> None:
    result = await asyncio.to_thread(process, data)
    logger.info("Job %s done", result["id"])

    await results.add(
        RESULT,
        result,
        {
            "attempts": 5,
            "backoff": {"type": "exponential", "delay": 10_000},
            "removeOnComplete": True,
            "removeOnFail": 1000,
        },
    )
