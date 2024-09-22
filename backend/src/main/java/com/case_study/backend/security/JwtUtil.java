package com.case_study.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private final String jwtSecret = "your-256-bit-secret-your-256-bit-secret"; // En az 256 bitlik bir gizli anahtar
                                                                                // kullanın
    private final int jwtExpirationMs = 86400000; // Token geçerlilik süresi (ms cinsinden)

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateJwtToken(String username, List<String> roles) {
        String token = Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();

        logger.info("Generated JWT Token for username: {} with roles: {}", username, roles);
        return token;
    }

    public String getUsernameFromJwtToken(String token) {
        String username = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();

        logger.info("Extracted username from JWT Token: {}", username);
        return username;
    }

    public List<String> getRolesFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();

        Object rolesObject = claims.get("roles");
        List<String> roles = new ArrayList<>();

        if (rolesObject instanceof List<?>) {
            List<?> rolesList = (List<?>) rolesObject;
            roles = rolesList.stream()
                    .map(Object::toString)
                    .collect(Collectors.toList());

            logger.info("Extracted roles from JWT Token: {}", roles);
        } else {
            logger.warn("No roles found in the JWT Token");
        }

        return roles;
    }

    public boolean validateJwtToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token);
            logger.info("JWT Token is valid");
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("Invalid JWT Token: {}", e.getMessage());
        }
        return false;
    }
}
