# Smart Recipe Book & Kitchen Pantry Planning System (Java OOP)

A complete college-level software engineering and object-oriented programming project featuring:
1. **Influencer-Based Discovery**: Influencer profiles, specialties, curated recipes, and verified endorsements.
2. **Deterministic 3-Signal Recommendation Engine**: 50% pantry match + 20% user rating + 30% influencer endorsement.
3. **Pantry Inventory Tracker**: Quantities, units, expiration tracking, and low-stock alerts.
4. **Relational Database with JDBC**: SQLite persistence using PreparedStatement to prevent SQL injection.
5. **Role-Based Access Control (RBAC)**: RegularUser, Influencer, and Admin.

---

## 🏛 Object-Oriented Programming (OOP) Architecture

- **Abstraction**: `User` abstract class specifies contract (`getRole()`, `canModerateContent()`) without implementation details.
- **Inheritance**: `Influencer`, `RegularUser`, and `Admin` extend `User`, inheriting common properties while adding specialized capabilities.
- **Polymorphism**: Dynamic method dispatch for permission checks across user roles.
- **Encapsulation**: Private state in all entities (`Recipe`, `PantryItem`, `Review`) with validation in setters/constructors.
- **Design Patterns**:
  - **Singleton**: `DatabaseConnection` ensures a single shared JDBC SQLite connection.
  - **Data Access Object (DAO)**: `RecipeDAO`, `UserDAO`, `PantryDAO` separate business logic from SQL storage.
  - **Strategy Pattern**: Configurable `RecommendationService` weights formula.

---

## 🚀 How to Run the Java Project

```bash
# 1. Compile the project
mvn clean compile

# 2. Run the application
mvn exec:java -Dexec.mainClass="com.kitchen.Main"

# 3. Run unit tests
mvn test
```
