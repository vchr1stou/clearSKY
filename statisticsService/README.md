# MICROSERVICE

## Statistics Service

## Api Endpoints
### Get My Statistics List
GET api/stats/myStats
### Get Stats for a specific course
GET /api/stats/courseStats/:courseId/:institutionId/:examPeriod
(keep in mind that examPeriod should be written in format YYYY Semester, e.g. 2025 Spring (2025%20Spring in URL))
### Create Statistics for courses that have grades out but no statistics
POST /api/stats/createCourseStats/:institutionId
