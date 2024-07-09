import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Paths;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${springdoc.paths-to-hide}")
    private List<String> pathsToHide;

    @Bean
    public OpenApiCustomizer openApiCustomizer() {
        return openApi -> {
            Paths paths = openApi.getPaths();
            for (String path : pathsToHide) {
                paths.remove(path);
            }
        };
    }
}