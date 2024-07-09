import org.springdoc.core.customizers.OpenApiCustomiser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;

import java.util.Map;

@Configuration
public class SwaggerConfig {

    private static final Logger logger = LoggerFactory.getLogger(SwaggerConfig.class);

    @Bean
    public OpenApiCustomiser openApiCustomiser() {
        return openApi -> {
            logger.info("Starting OpenAPI customization");

            // Log the paths
            Paths paths = openApi.getPaths();
            if (paths != null) {
                for (Map.Entry<String, PathItem> entry : paths.entrySet()) {
                    logger.info("Path: {}", entry.getKey());
                }
            } else {
                logger.warn("No paths found in OpenAPI specification");
            }

            logger.info("Completed OpenAPI customization");
        };
    }
}