# NTUA ECE SAAS 2025 PROJECT

## TEAM (14)

## Description
clearSKY is a modern Software-as-a-Service (SaaS) platform designed to streamline the academic grading workflow for educational institutions.
It enables instructors to publish course grades, handle student review requests, and finalize grade submissions efficiently and securely.

### Microservices
- AuthService: Handles user authentication and authorization.
- coursesService: Provides each user with their own courses information.
- gradingService: Processes and handles grading, provides the ability for a grade review request from students and response from teachers.
- statisticsService: Provides analytics and statistics for grades at each course.
- userManagementService: Manages user profiles and roles (only institution representatives access it).
- frontend: React-based web interface for users.


## Instructions
1. **Clone the repository**
    ```bash
    git clone https://github.com/ntua/saas25-14.git
    cd saas25-14
    ```
2. **Run docker compose**
    ```bash
    docker compose up --build
    ```