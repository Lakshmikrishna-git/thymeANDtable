package com.kitchen.model;

import java.time.LocalDateTime;

public class Review {
    private String id;
    private String recipeId;
    private String userId;
    private String userName;
    private String userRole;
    private int rating; // 1 to 5
    private String comment;
    private boolean isInfluencerEndorsement;
    private LocalDateTime createdAt;

    public Review(String id, String recipeId, String userId, String userName, String userRole, int rating, String comment) {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        this.id = id;
        this.recipeId = recipeId;
        this.userId = userId;
        this.userName = userName;
        this.userRole = userRole;
        this.rating = rating;
        this.comment = comment;
        this.isInfluencerEndorsement = "INFLUENCER".equals(userRole);
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getRecipeId() { return recipeId; }
    public String getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getUserRole() { return userRole; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public boolean isInfluencerEndorsement() { return isInfluencerEndorsement; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
