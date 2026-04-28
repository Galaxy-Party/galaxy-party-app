package com.galaxy_party.backend.controller;

import com.galaxy_party.backend.dto.auth.input.LoginRequest;
import com.galaxy_party.backend.dto.auth.input.RegisterRequest;
import com.galaxy_party.backend.dto.auth.output.AuthTokens;
import com.galaxy_party.backend.dto.user.output.UserDto;
import com.galaxy_party.backend.entity.UserEntity;
import com.galaxy_party.backend.security.AuthCookieService;
import com.galaxy_party.backend.services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthCookieService cookieService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterRequest request,
                                            HttpServletResponse response) {
        AuthTokens tokens = authService.register(request);
        writeCookies(response, tokens);
        return new ResponseEntity<>(UserEntity.toUserDto(tokens.getUser()), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@Valid @RequestBody LoginRequest request,
                                         HttpServletResponse response) {
        AuthTokens tokens = authService.login(request);
        writeCookies(response, tokens);
        return ResponseEntity.ok(UserEntity.toUserDto(tokens.getUser()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<UserDto> refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = cookieService.readRefreshToken(request).orElse(null);
        AuthTokens tokens = authService.refresh(refreshToken);
        writeCookies(response, tokens);
        return ResponseEntity.ok(UserEntity.toUserDto(tokens.getUser()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        cookieService.readRefreshToken(request).ifPresent(authService::logout);
        cookieService.clear(response);
        return ResponseEntity.noContent().build();
    }

    private void writeCookies(HttpServletResponse response, AuthTokens tokens) {
        cookieService.writeAccessCookie(response, tokens.getAccessToken());
        cookieService.writeRefreshCookie(response, tokens.getRefreshToken());
    }
}
