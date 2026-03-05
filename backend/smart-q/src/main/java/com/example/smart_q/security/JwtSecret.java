package com.example.smart_q.security;

public class JwtSecret {
    // ✅ HS384 requires minimum 48 characters (384 bits)
    public static final String SECRET = "your-super-secret-key-must-be-at-least-48-characters-long-for-hs384-algorithm";
    public static final long EXPIRATION = 86400000; // 24 hours
}
