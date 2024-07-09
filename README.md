import org.springdoc.core.customizers.OpenApiCustomiser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Operation;
import io.swagger.v3.oas.models.PathItem;
import io.swagger.v3.oas.models.Paths;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class SwaggerConfig {

    @Value("${springdoc.paths-to-hide}")
    private String[] pathsToHideArray;

    @Bean
    public OpenApiCustomiser openApiCustomiser() {
        return openApi -> {
            Paths paths = openApi.getPaths();
            Map<String, List<String>> pathsToHide = parsePathsToHide(pathsToHideArray);

            for (Map.Entry<String, List<String>> entry : pathsToHide.entrySet()) {
                String path = entry.getKey();
                List<String> methodsToHide = entry.getValue();

                PathItem pathItem = paths.get(path);
                if (pathItem != null) {
                    methodsToHide.forEach(method -> removeOperation(pathItem, method));
                }
            }
        };
    }

    private Map<String, List<String>> parsePathsToHide(String[] pathsToHideArray) {
        Map<String, List<String>> pathsToHide = new HashMap<>();

        for (String pathToHide : pathsToHideArray) {
            String[] split = pathToHide.split("/");
            if (split.length >= 2) {
                String path = "/" + String.join("/", Arrays.copyOf(split, split.length - 1));
                String method = split[split.length - 1];

                pathsToHide.computeIfAbsent(path, k -> new java.util.ArrayList<>()).add(method);
            }
        }

        return pathsToHide;
    }

    private void removeOperation(PathItem pathItem, String method) {
        switch (method.toUpperCase()) {
            case "GET":
                pathItem.setGet(null);
                break;
            case "POST":
                pathItem.setPost(null);
                break;
            case "PUT":
                pathItem.setPut(null);
                break;
            case "DELETE":
                pathItem.setDelete(null);
                break;
            case "PATCH":
                pathItem.setPatch(null);
                break;
            default:
                break;
        }
    }
}