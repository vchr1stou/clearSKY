# MICROSERVICE

## User Management Service

## Features
- User registration
- User password update

## API Endpoints
### POST api/userManagement/createUser
JSON body:
```json
{
  "studentID": "studentID",
  "FullName": "FullName",
  "email": "email",
  "telephone": "telephone",
  "password": "password",
  "role": "role",
  "institutionID": "institutionID"
}
```

### PUT api/userManagement/updatePassword
JSON body:
```json
{
  "email": "string",
  "password": "string",
  "role": "string",
  "institutionId": "string"
}
```
