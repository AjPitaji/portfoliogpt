import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${springdoc.paths-to-hide:}")
    private String[] pathsToHideArray;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Parse paths to hide and the methods to deny
        Map<String, List<String>> pathsToHide = parsePathsToHide(pathsToHideArray);

        http
            .csrf().disable()
            .authorizeHttpRequests(authorize -> {
                // Deny access to the specified paths and methods
                for (Map.Entry<String, List<String>> entry : pathsToHide.entrySet()) {
                    String path = entry.getKey();
                    List<String> methodsToHide = entry.getValue();

                    for (String method : methodsToHide) {
                        switch (method.toUpperCase()) {
                            case "GET":
                                authorize.requestMatchers(HttpMethod.GET, path).denyAll();
                                break;
                            case "POST":
                                authorize.requestMatchers(HttpMethod.POST, path).denyAll();
                                break;
                            case "PUT":
                                authorize.requestMatchers(HttpMethod.PUT, path).denyAll();
                                break;
                            case "DELETE":
                                authorize.requestMatchers(HttpMethod.DELETE, path).denyAll();
                                break;
                            case "PATCH":
                                authorize.requestMatchers(HttpMethod.PATCH, path).denyAll();
                                break;
                            default:
                                // Unsupported methods will not be handled
                                break;
                        }
                    }
                }

                // Allow access to other paths
                authorize.anyRequest().permitAll();
            });

        return http.build();
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
}