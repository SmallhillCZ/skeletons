import axios from "axios";
import { expect, MockedFunction, test } from "vitest";
import { TestSdk, TestSdkConfiguration } from "./sdk";

const configuration: TestSdkConfiguration = {
	basePath: "http://localhost:3000",
};

const api = new TestSdk(configuration);

(axios.request as MockedFunction<typeof axios.post>).mockResolvedValue(Promise.resolve({ status: 200, data: "OK" }));
test("test basic request", async () => {
	const res = await api.TestApi.test();

	expect(axios.request).toHaveBeenCalledWith({
		headers: {},
		method: "GET",
		url: "/api/test",
		baseURL: "http://localhost:3000",
	});
	expect(res.status).toBe(200);
	expect(res.data).toBe("OK");
});

test("test param in request", async () => {
	const res = await api.TestApi.testParam(10);

	expect(axios.request).toHaveBeenCalledWith({
		headers: {},
		method: "GET",
		url: "/api/test-param/10",
		baseURL: "http://localhost:3000",
	});
});

test("test query in request", async () => {
	expect(TestSdk.TestQueryTestEnumKeyEnum).toBeDefined();

	const res = await api.TestApi.testQuery({
		testEnumKey: TestSdk.TestQueryTestEnumKeyEnum.Test,
		testKey: 15,
	});

	expect(axios.request).toHaveBeenCalledWith({
		headers: {},
		method: "GET",
		url: "/api/test-query?test_key=15&test_enum_key=test",
		baseURL: "http://localhost:3000",
	});
});
