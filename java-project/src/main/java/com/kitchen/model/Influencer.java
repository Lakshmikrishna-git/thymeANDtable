package com.kitchen.model;

/**
 * Subclass representing verified culinary creators.
 * Demonstrates:
 * 1. Inheritance (extends User)
 * 2. Polymorphism (overrides abstract methods)
 */
public class Influencer extends User {
    private String handle;
    private String speciality;
    private String bio;
    private boolean isVerified;
    private int followerCount;

    public Influencer(String id, String name, String email, String passwordHash,
                      String handle, String speciality, String bio) {
        super(id, name, email, passwordHash);
        this.handle = handle;
        this.speciality = speciality;
        this.bio = bio;
        this.isVerified = true;
        this.followerCount = 0;
    }

    @Override
    public String getRole() {
        return "INFLUENCER";
    }

    @Override
    public boolean canModerateContent() {
        return false;
    }

    @Override
    public boolean canPublishInfluencerRecipes() {
        return true;
    }

    public String getHandle() { return handle; }
    public void setHandle(String handle) { this.handle = handle; }

    public String getSpeciality() { return speciality; }
    public void setSpeciality(String speciality) { this.speciality = speciality; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }

    public int getFollowerCount() { return followerCount; }
    public void setFollowerCount(int followerCount) { this.followerCount = followerCount; }
}
