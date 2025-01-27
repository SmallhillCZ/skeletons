import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Config } from "./config";

// uncomment if using SWC compiler
// import metadata from "./metadata";

export function generateOpenAPI(app: INestApplication, config: Config) {
	const builder = new DocumentBuilder()
		.setTitle(config.app.name)
		.setVersion(config.app.version)
		.addServer(config.app.baseUrl)
		.build();

	// uncomment if using SWC compiler
	// await SwaggerModule.loadPluginMetadata(metadata);

	const document = SwaggerModule.createDocument(app, builder, {
		operationIdFactory: (controllerKey: string, methodKey: string) => `${controllerKey}_${methodKey}`,
	});

	return document;
}

export function registerOpenAPI(path: string, app: INestApplication, config: Config) {
	const openapiDocument = generateOpenAPI(app, config);

	function openapiTagSorter(a: string, b: string) {
		if (a === "Root") return -1;
		if (b === "Root") return 1;
		return a.localeCompare(b);
	}

	SwaggerModule.setup(path, app, openapiDocument, {
		swaggerOptions: {
			tagsSorter: openapiTagSorter,
			operationsSorter: "alpha",
		},
	});
}
