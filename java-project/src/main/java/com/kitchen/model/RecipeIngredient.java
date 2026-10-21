package com.kitchen.model;

public class RecipeIngredient {
    private String ingredientId;
    private String ingredientName;
    private double quantity;
    private String unit;

    public RecipeIngredient(String ingredientId, String ingredientName, double quantity, String unit) {
        this.ingredientId = ingredientId;
        this.ingredientName = ingredientName;
        this.quantity = quantity;
        this.unit = unit;
    }

    public String getIngredientId() { return ingredientId; }
    public String getIngredientName() { return ingredientName; }
    public double getQuantity() { return quantity; }
    public String getUnit() { return unit; }

    @Override
    public String toString() {
        return quantity + " " + unit + " " + ingredientName;
    }
}
