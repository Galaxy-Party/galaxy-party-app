package com.galaxy_party.backend.services;

import com.galaxy_party.backend.dto.auth.input.LoginRequest;
import com.galaxy_party.backend.dto.auth.input.RegisterRequest;
import com.galaxy_party.backend.dto.auth.output.AuthTokens;
import com.galaxy_party.backend.entity.RefreshTokenEntity;
import com.galaxy_party.backend.entity.UserEntity;
import com.galaxy_party.backend.repository.RefreshTokenRepository;
import com.galaxy_party.backend.repository.UserRepository;
import com.galaxy_party.backend.security.JwtProperties;
import com.galaxy_party.backend.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthTokens register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already in use");
        }

        UserEntity user = UserEntity.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .imageName(request.getImageName())
                .build();

        userRepository.save(user);

        return issueTokens(user);
    }

    public AuthTokens login(LoginRequest request) {
        UserEntity user = userRepository
                .findByEmailOrUsername(request.getEmailOrUsername(), request.getEmailOrUsername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        return issueTokens(user);
    }

    public AuthTokens refresh(String refreshTokenPlain) {
        if (refreshTokenPlain == null || refreshTokenPlain.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing refresh token");
        }
        String hash = hash(refreshTokenPlain);
        RefreshTokenEntity stored = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        Instant now = Instant.now();
        if (!stored.isActive(now)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Expired or revoked refresh token");
        }

        // Rotation: revoke the old token, issue a new one
        stored.setRevokedAt(now);
        refreshTokenRepository.save(stored);

        return issueTokens(stored.getUser());
    }

    public void logout(String refreshTokenPlain) {
        if (refreshTokenPlain == null || refreshTokenPlain.isBlank()) {
            return;
        }
        String hash = hash(refreshTokenPlain);
        refreshTokenRepository.findByTokenHash(hash).ifPresent(token -> {
            if (token.getRevokedAt() == null) {
                token.setRevokedAt(Instant.now());
                refreshTokenRepository.save(token);
            }
        });
    }

    private AuthTokens issueTokens(UserEntity user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshTokenPlain = UUID.randomUUID().toString() + UUID.randomUUID().toString();

        Instant now = Instant.now();
        RefreshTokenEntity refreshEntity = RefreshTokenEntity.builder()
                .user(user)
                .tokenHash(hash(refreshTokenPlain))
                .expiresAt(now.plus(jwtProperties.getRefreshTtl()))
                .createdAt(now)
                .build();
        refreshTokenRepository.save(refreshEntity);

        return AuthTokens.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenPlain)
                .user(user)
                .build();
    }

    private String hash(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(bytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}