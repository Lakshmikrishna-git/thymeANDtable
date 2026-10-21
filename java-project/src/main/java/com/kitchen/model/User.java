package com.kitchen.model;

import java.time.LocalDateTime;

/**
 * Base abstract class representing a system user.
 * Demonstrates:
 * 1. Abstraction (cannot be instantiated directly)
 * 2. Encapsulation (private fields with controlled accessors)
 */
public abstract class User {
    private String id;
    private String name;
    private String email;
    private String passwordHash;
    private LocalDateTime createdAt;

    public User(String id, String name, String email, String passwordHash) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("User name cannot be empty");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Invalid email format");
        }
        this.id = id;
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = LocalDateTime.now();
    }

    public abstract String getRole();
    public abstract boolean canModerateContent();
    public abstract boolean canPublishInfluencerRecipes();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "[" + getRole() + "] " + name + " (" + email + ")";
    }
}
