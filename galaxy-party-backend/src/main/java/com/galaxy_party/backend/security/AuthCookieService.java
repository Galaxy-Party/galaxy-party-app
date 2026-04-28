package com.galaxy_party.backend.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthCookieService {

    public static final String ACCESS_TOKEN_COOKIE = "access_token";
    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";

    private final JwtProperties jwtProperties;

    @Value("${app.cookie.secure:false}")
    private boolean secure;

    @Value("${app.cookie.same-site:Lax}")
    private String sameSite;

    public void writeAccessCookie(HttpServletResponse response, String token) {
        response.addHeader("Set-Cookie", buildCookie(ACCESS_TOKEN_COOKIE, token, jwtProperties.getAccessTtl()).toString());
    }

    public void writeRefreshCookie(HttpServletResponse response, String token) {
        response.addHeader("Set-Cookie", buildCookie(REFRESH_TOKEN_COOKIE, token, jwtProperties.getRefreshTtl()).toString());
    }

    public void clear(HttpServletResponse response) {
        response.addHeader("Set-Cookie", buildCookie(ACCESS_TOKEN_COOKIE, "", Duration.ZERO).toString());
        response.addHeader("Set-Cookie", buildCookie(REFRESH_TOKEN_COOKIE, "", Duration.ZERO).toString());
    }

    public Optional<String> readAccessToken(HttpServletRequest request) {
        return readCookie(request, ACCESS_TOKEN_COOKIE);
    }

    public Optional<String> readRefreshToken(HttpServletRequest request) {
        return readCookie(request, REFRESH_TOKEN_COOKIE);
    }

    private ResponseCookie buildCookie(String name, String value, Duration maxAge) {
        return ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .maxAge(maxAge)
                .build();
    }

    private Optional<String> readCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return Optional.empty();
        for (Cookie c : cookies) {
            if (name.equals(c.getName()) && c.getValue() != null && !c.getValue().isEmpty()) {
                return Optional.of(c.getValue());
            }
        }
        return Optional.empty();
    }
}
