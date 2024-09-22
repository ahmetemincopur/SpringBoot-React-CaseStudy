package com.case_study.backend.repository;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String type = "Bearer";
    private String token;
    private String username;
    private List<String> roles;
    private String city;

    public JwtResponse(String accessToken, String username, List<String> roles, String city) {
        this.token = accessToken;
        this.username = username;
        this.roles = roles;
        this.city = city;
    }

    // Getters and setters
    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getType() {
        return type;
    }
}
