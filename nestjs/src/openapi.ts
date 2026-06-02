import { INestApplication } from "@nestjs/common";
import { Config } from "./config";
import { generateOpenAPI, setupSwagger } from "./swagger-ui";

export function registerOpenAPI(path: string, app: INestApplication, config: Config) {
	const document = generateOpenAPI(app, {
		info: {
			title: config.app.name,
			description: config.app.description,
			version: config.app.version,
		},
		servers: [{ url: config.app.baseUrl }],
	});

	// uncomment if using SWC compiler
	// await SwaggerModule.loadPluginMetadata(metadata);

	setupSwagger(path, app, document);
}
