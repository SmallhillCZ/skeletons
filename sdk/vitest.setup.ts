import { beforeAll, vi } from "vitest";

beforeAll(async ({}) => {
  vi.mock("axios");
});