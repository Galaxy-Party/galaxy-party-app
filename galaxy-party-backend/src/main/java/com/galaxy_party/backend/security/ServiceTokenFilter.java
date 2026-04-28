package com.galaxy_party.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class ServiceTokenFilter extends OncePerRequestFilter {

    public static final String SERVICE_TOKEN_HEADER = "X-Service-Token";
    public static final String SERVICE_ROLE = "ROLE_SERVICE";

    private final String expectedToken;

    public ServiceTokenFilter(@Value("${app.ws.service-token:}") String expectedToken) {
        this.expectedToken = expectedToken;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        String provided = request.getHeader(SERVICE_TOKEN_HEADER);
        if (provided != null && !expectedToken.isBlank() && provided.equals(expectedToken)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            ServiceAuthentication auth = new ServiceAuthentication();
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

    private static final class ServiceAuthentication extends AbstractAuthenticationToken {
        ServiceAuthentication() {
            super(List.of(new SimpleGrantedAuthority(SERVICE_ROLE)));
            setAuthenticated(true);
        }

        @Override
        public Object getCredentials() {
            return null;
        }

        @Override
        public Object getPrincipal() {
            return "ws-service";
        }
    }
}
