import { Injectable } from "@nestjs/common";
import { config } from "dotenv";
import { readFileSync } from "fs";

config({ override: true });

@Injectable()
export class Config {
	packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));
	environment = process.env.NODE_ENV || "development";

	server = {
		port: process.env["PORT"] ? parseInt(process.env["PORT"]) : 3000,
		host: process.env["HOST"] || "127.0.0.1",
		cors: this.environment === "development",
	};

	app = {
		name: this.packageJson.name,
		version: this.packageJson.version,
		baseUrl: this.getBaseUrl(),
	};

	private getBaseUrl() {
		if (process.env.BASE_URL) return process.env.BASE_URL;

		let url = `${this.server.port === 443 ? "https" : "http"}://${this.server.host}`;

		if (this.server.port !== 80 && this.server.port !== 443) url += `:${this.server.port}`;

		return url;
	}
}
