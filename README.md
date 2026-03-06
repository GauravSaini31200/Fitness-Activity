🏋️ Fitness Tracker — Microservices Application
A full-stack fitness tracking application built with Spring Boot microservices and a React frontend. Users can log fitness activities, receive AI-powered recommendations (via Google Gemini), and manage their profiles — all secured with Keycloak OAuth 2.0 authentication.

📐 Architecture Overview

┌──────────────┐       ┌──────────────────┐       ┌────────────────┐
│   React UI   │──────▶│   API Gateway    │──────▶│  User Service  │
│  (Vite/MUI)  │       │  (Spring Cloud)  │       │  (PostgreSQL)  │
│  :5173       │       │  :8080           │       │  :8083         │
└──────────────┘       └──────┬───────────┘       └────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                                       ▼
┌──────────────────┐                   ┌───────────────────┐
│ Activity Service │───── RabbitMQ ──▶│    AI Service      │
│   (MongoDB)      │     (async msg)   │ (Gemini + MongoDB) │
│   :8081          │                   │   :8082            │
└──────────────────┘                   └───────────────────┘

        ┌─────────────────┐     ┌──────────────────┐
        │  Eureka Server  │     │  Config Server   │
        │  :8761          │     │  :8888           │
        └─────────────────┘     └──────────────────┘
              ▲                        ▲
              │   Service Discovery    │  Centralized Config
              └────── all services ────┘
🧩 Services
Service	Port	Description
Config Server	8888	Centralized configuration (Spring Cloud Config, native profile)
Eureka Server	8761	Service discovery & registration
API Gateway	8080	Single entry point — routing, CORS, OAuth 2.0 JWT validation, auto user-sync from Keycloak
User Service	8083	User registration & profile management (PostgreSQL + JPA)
Activity Service	8081	CRUD for fitness activities (MongoDB), publishes events to RabbitMQ
AI Service	8082	Consumes activity events from RabbitMQ, generates AI-powered recommendations via Google Gemini, stores in MongoDB
Frontend	5173	React SPA — Vite, MUI, Redux Toolkit, react-router, OAuth 2.0 PKCE flow

🛠 Tech Stack
Backend
Java 21 / 23 — Spring Boot 3.5.x
Spring Cloud 2025.0.1 — Config, Gateway, Eureka
Spring Security — OAuth 2.0 Resource Server (JWT)
Spring Data MongoDB — Activity & Recommendation persistence
Spring Data JPA — User persistence (PostgreSQL)
Spring AMQP — RabbitMQ messaging
Spring AI 1.1.2 — Google Gemini integration (gemini-3-flash-preview)
Lombok — Boilerplate reduction

Frontend
React 19 + Vite 6
Material UI (MUI) 6 — Component library
Redux Toolkit — State management
react-router 7 — Routing
react-oauth2-code-pkce — OAuth 2.0 PKCE authentication
Axios — HTTP client
Infrastructure
Keycloak — Identity & Access Management (realm: fitness-oauth2)
RabbitMQ — Asynchronous message broker
MongoDB — NoSQL database (activities & recommendations)
PostgreSQL — Relational database (users)

📁 Project Structure
Fitness/
├── configServer/          # Spring Cloud Config Server (native)
├── eureka/                # Netflix Eureka Service Discovery
├── gateway/               # Spring Cloud Gateway + Security
├── userService/           # User management microservice
├── activityService/       # Activity tracking microservice
├── aiservice/             # AI recommendation microservice
└── fitness-app-frontend/  # React SPA

🚀 Getting Started
Prerequisites
Dependency	Version
Java (JDK)	21+
Maven	3.9+
Node.js	18+
MongoDB	7+
PostgreSQL	15+
RabbitMQ	3.12+
Keycloak	24+

1. Infrastructure Setup
MongoDB
# Start MongoDB on default port 27017
mongod
The application uses database fitness_activity for both activities and recommendations.

PostgreSQL
# Create the user database
psql -U postgres -c "CREATE DATABASE fitness_user_db;"
RabbitMQ
# Start RabbitMQ (default guest/guest on port 5672)
rabbitmq-server
Keycloak
Start Keycloak on port 8181
Create realm: fitness-oauth2
Create a public client: oauth2-pkce-client
Valid redirect URIs: http://localhost:5173/*
Web origins: http://localhost:5173
Standard flow enabled, PKCE enforced
Create users in the realm as needed

2. Environment Variables
Variable	Description
GEMINI_API_KEY	Google Gemini API key for AI recommendations
GEMINI_PROJECT_ID	Google Cloud project ID for Gemini
export GEMINI_API_KEY=your-api-key-here
export GEMINI_PROJECT_ID=your-project-id-here

4. Start Backend Services (in order)
# 1. Config Server (must start first)
cd configServer && ./mvnw spring-boot:run

# 2. Eureka Server
cd eureka && ./mvnw spring-boot:run

# 3. API Gateway
cd gateway && ./mvnw spring-boot:run

# 4. User Service
cd userService && ./mvnw spring-boot:run

# 5. Activity Service
cd activityService && ./mvnw spring-boot:run

# 6. AI Service
cd aiservice && ./mvnw spring-boot:run

4. Start Frontend
cd fitness-app-frontend
npm install
npm run dev
The app will be available at http://localhost:5173.

🔗 API Endpoints
All API calls go through the Gateway at http://localhost:8080.

User Service — /api/users
Method	Endpoint	Description
POST	/api/users/register	Register a new user
GET	/api/users/{userId}	Get user profile
GET	/api/users/{userId}/validate	Validate user exists
Activity Service — /api/activities
Method	Endpoint	Description
GET	/api/activities	Get all activities for current user (requires X-User-Id header)
GET	/api/activities/{activityId}	Get a specific activity
POST	/api/activities	Create/track a new activity (requires X-User-Id header)
AI Recommendation Service — /api/recommendations
Method	Endpoint	Description
GET	/api/recommendations/user/{userId}	Get recommendation for a user
GET	/api/recommendations/activity/{activityId}	Get recommendations for an activity
Note: All endpoints (except /actuator/**) require a valid JWT Bearer token from Keycloak. The Gateway automatically extracts the user ID from the JWT and adds an X-User-Id header to downstream requests.

📊 Activity Types
The following activity types are supported:

RUNNING
CYCLING
SWIMMING
YOGA
WEIGHTLIFTING
HIKING
WALKING
OTHER
🤖 AI Recommendations Flow
User creates a new activity via the Activity Service
Activity Service publishes the activity to RabbitMQ (fitness.exchange → activity.queue)
AI Service consumes the message asynchronously
AI Service sends a prompt to Google Gemini with activity details
Gemini returns a structured JSON response containing:
Analysis — overall assessment, pace, heart rate, calories analysis
Improvements — specific areas and recommendations
Suggested Workouts — complementary exercises
Safety Tips — relevant safety advice
The response is parsed, mapped to a Recommendation entity, and saved to MongoDB
Frontend can retrieve recommendations via the /api/recommendations endpoints
⚙️ Configuration
All service configurations are managed centrally via the Config Server at http://localhost:8888. Config files are stored in configServer/src/main/resources/config/:

File	Service
api-gateway.properties	API Gateway
user-service.properties	User Service
activity-service.properties	Activity Service
ai-service.properties	AI Service
To view a service's resolved config:

GET http://localhost:8888/{service-name}/default
🔐 Authentication Flow
Frontend initiates OAuth 2.0 Authorization Code + PKCE flow with Keycloak
User authenticates on Keycloak login page
Frontend receives JWT tokens (access + refresh)
All API requests include Authorization: Bearer <token> header
Gateway validates JWT against Keycloak's JWK endpoint
Gateway's KeycloakUserSyncFilter auto-registers new users in the User Service on first login
Gateway injects X-User-Id header (from JWT sub claim) into downstream requests
🏗 Build for Production
Backend
# Build each service (from its directory)
./mvnw clean package -DskipTests

# Run the JAR
java -jar target/<service-name>-0.0.1-SNAPSHOT.jar
Frontend
cd fitness-app-frontend
npm run build
# Output in dist/ — serve with any static file server
📝 License
This project is for educational / demo purposes.
