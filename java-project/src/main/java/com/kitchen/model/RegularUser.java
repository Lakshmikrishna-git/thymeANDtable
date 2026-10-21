package com.kitchen.model;

public class RegularUser extends User {

    public RegularUser(String id, String name, String email, String passwordHash) {
        super(id, name, email, passwordHash);
    }

    @Override
    public String getRole() {
        return "USER";
    }

    @Override
    public boolean canModerateContent() {
        return false;
    }

    @Override
    public boolean canPublishInfluencerRecipes() {
        return false;
    }
}
