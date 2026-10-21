package com.kitchen.model;

import java.time.LocalDate;

public class PantryItem {
    private String id;
    private String userId;
    private String ingredientId;
    private String name;
    private double quantity;
    private String unit;
    private String category;
    private LocalDate expiryDate;

    public PantryItem(String id, String userId, String ingredientId, String name, double quantity, String unit, String category) {
        this.id = id;
        this.userId = userId;
        this.ingredientId = ingredientId;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.category = category;
    }

    public boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(LocalDate.now());
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getIngredientId() { return ingredientId; }
    public String getName() { return name; }
    public double getQuantity() { return quantity; }
    public void setQuantity(double quantity) { this.quantity = quantity; }
    public String getUnit() { return unit; }
    public String getCategory() { return category; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}
