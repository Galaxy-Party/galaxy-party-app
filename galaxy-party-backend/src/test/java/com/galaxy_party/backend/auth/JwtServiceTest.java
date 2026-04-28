package com.galaxy_party.backend.auth;

import com.galaxy_party.backend.entity.UserEntity;
import com.galaxy_party.backend.security.JwtProperties;
import com.galaxy_party.backend.security.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final String SECRET =
            "dGVzdC1zZWNyZXQtdGVzdC1zZWNyZXQtdGVzdC1zZWNyZXQtdGVzdC1zZWNyZXQtdGVzdC1zZWNyZXQtdGVzdC1zZWNyZXQtdGVzdC1zZWNyZXQ=";

    private JwtService service(Duration accessTtl) {
        JwtProperties props = new JwtProperties();
        props.setSecret(SECRET);
        props.setAccessTtl(accessTtl);
        return new JwtService(props);
    }

    private UserEntity user() {
        return UserEntity.builder()
                .id(UUID.randomUUID())
                .username("alice")
                .email("alice@example.com")
                .passwordHash("hash")
                .build();
    }

    @Test
    void generateAndParse_roundTripsClaims() {
        UserEntity user = user();
        JwtService jwt = service(Duration.ofMinutes(15));

        String token = jwt.generateAccessToken(user);
        Claims claims = jwt.parse(token);

        assertThat(claims.getSubject()).isEqualTo(user.getId().toString());
        assertThat(claims.get("username", String.class)).isEqualTo("alice");
        assertThat(claims.getIssuer()).isEqualTo("galaxy-party");
        assertThat(jwt.extractUserId(token)).isEqualTo(user.getId());
    }

    @Test
    void parse_expiredToken_throws() throws InterruptedException {
        JwtService jwt = service(Duration.ofMillis(1));
        String token = jwt.generateAccessToken(user());

        Thread.sleep(50);

        assertThatThrownBy(() -> jwt.parse(token)).isInstanceOf(JwtException.class);
    }

    @Test
    void parse_tamperedToken_throws() {
        JwtService jwt = service(Duration.ofMinutes(15));
        String token = jwt.generateAccessToken(user());
        String tampered = token.substring(0, token.length() - 4) + "abcd";

        assertThatThrownBy(() -> jwt.parse(tampered)).isInstanceOf(JwtException.class);
    }
}