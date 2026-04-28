package com.galaxy_party.backend.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.galaxy_party.backend.dto.auth.input.LoginRequest;
import com.galaxy_party.backend.dto.auth.input.RegisterRequest;
import com.galaxy_party.backend.security.AuthCookieService;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void register_login_refresh_logout_fullFlow() throws Exception {
        RegisterRequest register = RegisterRequest.builder()
                .username("alice")
                .email("alice@example.com")
                .password("supersecret")
                .build();

        MvcResult registerResult = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("alice"))
                .andExpect(cookie().exists(AuthCookieService.ACCESS_TOKEN_COOKIE))
                .andExpect(cookie().httpOnly(AuthCookieService.ACCESS_TOKEN_COOKIE, true))
                .andExpect(cookie().exists(AuthCookieService.REFRESH_TOKEN_COOKIE))
                .andExpect(cookie().httpOnly(AuthCookieService.REFRESH_TOKEN_COOKIE, true))
                .andReturn();

        // Login by email returns fresh cookies
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                LoginRequest.builder().emailOrUsername("alice@example.com").password("supersecret").build())))
                .andExpect(status().isOk())
                .andExpect(cookie().exists(AuthCookieService.ACCESS_TOKEN_COOKIE));

        // Login by username
        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                LoginRequest.builder().emailOrUsername("alice").password("supersecret").build())))
                .andExpect(status().isOk())
                .andReturn();

        Cookie refreshCookie = loginResult.getResponse().getCookie(AuthCookieService.REFRESH_TOKEN_COOKIE);
        assertThat(refreshCookie).isNotNull();
        String oldRefresh = refreshCookie.getValue();

        // Refresh rotates the token
        MvcResult refreshResult = mockMvc.perform(post("/auth/refresh").cookie(refreshCookie))
                .andExpect(status().isOk())
                .andExpect(cookie().exists(AuthCookieService.ACCESS_TOKEN_COOKIE))
                .andReturn();

        Cookie newRefreshCookie = refreshResult.getResponse().getCookie(AuthCookieService.REFRESH_TOKEN_COOKIE);
        assertThat(newRefreshCookie).isNotNull();
        assertThat(newRefreshCookie.getValue()).isNotEqualTo(oldRefresh);

        // Old refresh token is now revoked
        mockMvc.perform(post("/auth/refresh").cookie(refreshCookie))
                .andExpect(status().isUnauthorized());

        // Logout clears cookies
        mockMvc.perform(post("/auth/logout").cookie(newRefreshCookie))
                .andExpect(status().isNoContent())
                .andExpect(cookie().maxAge(AuthCookieService.ACCESS_TOKEN_COOKIE, 0))
                .andExpect(cookie().maxAge(AuthCookieService.REFRESH_TOKEN_COOKIE, 0));

        // Logged out token cannot refresh anymore
        mockMvc.perform(post("/auth/refresh").cookie(newRefreshCookie))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void register_duplicateEmail_returnsConflict() throws Exception {
        RegisterRequest first = RegisterRequest.builder()
                .username("bob")
                .email("bob@example.com")
                .password("supersecret")
                .build();
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(first)))
                .andExpect(status().isCreated());

        RegisterRequest duplicate = RegisterRequest.builder()
                .username("bob2")
                .email("bob@example.com")
                .password("supersecret")
                .build();
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicate)))
                .andExpect(status().isConflict());
    }

    @Test
    void login_wrongPassword_returnsUnauthorized() throws Exception {
        RegisterRequest register = RegisterRequest.builder()
                .username("charlie")
                .email("charlie@example.com")
                .password("supersecret")
                .build();
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                LoginRequest.builder().emailOrUsername("charlie@example.com").password("wrongpassword").build())))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void register_invalidPayload_returnsBadRequest() throws Exception {
        RegisterRequest invalid = RegisterRequest.builder()
                .username("a")
                .email("not-an-email")
                .password("short")
                .build();
        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void refresh_withoutCookie_returnsUnauthorized() throws Exception {
        mockMvc.perform(post("/auth/refresh"))
                .andExpect(status().isUnauthorized());
    }
}