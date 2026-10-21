package com.kitchen.model;

public class Admin extends User {

    public Admin(String id, String name, String email, String passwordHash) {
        super(id, name, email, passwordHash);
    }

    @Override
    public String getRole() {
        return "ADMIN";
    }

    @Override
    public boolean canModerateContent() {
        return true;
    }

    @Override
    public boolean canPublishInfluencerRecipes() {
        return true;
    }
}
