# RabbitMQ Integration for Grade Synchronization

This document describes the RabbitMQ integration between the Grading Service (microservice01) and the Courses Service (coursesService) for automatic grade synchronization.

## Overview

When grades are successfully processed in the Grading Service, they are automatically sent to the Courses Service via RabbitMQ to keep the courses database synchronized.

## Architecture

```
Grading Service (microservice01) → RabbitMQ → Courses Service (coursesService)
```

### Message Flow

1. **Grade Creation/Update**: When a grade is created or updated in the Grading Service
2. **Database Storage**: Grade is stored in the grading service database
3. **RabbitMQ Message**: Grade data is sent to RabbitMQ queue
4. **Courses Service Processing**: Courses Service receives and processes the message
5. **Database Sync**: Grade is stored/updated in the courses database

## Configuration

### Environment Variables

Both services use the following environment variable for RabbitMQ connection:

```bash
RABBITMQ_URL=amqp://localhost:5672
```

Default: `amqp://localhost:5672` (local RabbitMQ instance)

### Queue Configuration

- **Exchange**: `grade_exchange` (fanout type, durable)
- **Queue**: `grade_sync_queue` (durable)
- **Message Type**: `GRADE_SYNC`

## Message Format

```json
{
  "type": "GRADE_SYNC",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "student_id": 12345,
    "course_id": 101,
    "course_ref_id": 101,
    "question_grades": {
      "Q1": 8.5,
      "Q2": 7.0,
      "Q3": 9.0,
      "Q4": 6.5,
      "Q5": 8.0
    },
    "exam_period": "2024-01",
    "grading_status": "closed",
    "total_grade": 7.8,
    "institution_id": 1
  }
}
```

## Implementation Details

### Grading Service (Sender)

**File**: `microservice01/src/services/rabbitmqService.js`

- Connects to RabbitMQ on startup
- Sends grade data after successful database operations
- Handles connection errors gracefully
- Implements graceful shutdown

**Integration Points**:
- `POST /api/grades` - Individual grade creation
- `PUT /api/grades/:gradeId` - Grade updates
- `POST /api/grades/upload/confirm` - Bulk grade upload

### Courses Service (Consumer)

**File**: `coursesService/src/services/rabbitmqConsumer.js`

- Connects to RabbitMQ on startup
- Listens for grade sync messages
- Processes and stores grades in courses database
- Handles duplicate grades (upsert logic)
- Implements graceful shutdown

## Error Handling

### Grading Service
- RabbitMQ failures don't prevent grade storage
- Logs errors but continues processing
- Graceful degradation if RabbitMQ is unavailable

### Courses Service
- Failed messages are requeued
- Database errors are logged
- Service continues running even if individual messages fail

## Testing

### Test RabbitMQ Connection

```bash
# From microservice01 directory
node test-rabbitmq.js
```

### Manual Testing

1. Start both services
2. Create/update a grade via API
3. Check logs for RabbitMQ messages
4. Verify grade appears in courses database

## Monitoring

### Log Messages

**Grading Service**:
- `✅ Grade data sent to RabbitMQ for student {studentId}`
- `❌ Failed to send grade data to RabbitMQ for student {studentId}`

**Courses Service**:
- `✅ RabbitMQ consumer connected`
- `📨 Received grade sync message: GRADE_SYNC`
- `✅ Created new grade for student: {studentId}`
- `✅ Updated existing grade for student: {studentId}`

## Troubleshooting

### Common Issues

1. **RabbitMQ Connection Failed**
   - Ensure RabbitMQ is running
   - Check `RABBITMQ_URL` environment variable
   - Verify network connectivity

2. **Messages Not Processing**
   - Check consumer logs
   - Verify queue binding
   - Check database connectivity

3. **Duplicate Grades**
   - Check unique constraints
   - Verify upsert logic
   - Review message processing

### Debug Commands

```bash
# Check RabbitMQ status
rabbitmqctl status

# List queues
rabbitmqctl list_queues

# List exchanges
rabbitmqctl list_exchanges

# Check queue bindings
rabbitmqctl list_bindings
```

## Dependencies

### Grading Service
```json
{
  "amqplib": "^0.10.3"
}
```

### Courses Service
```json
{
  "amqplib": "^0.10.3"
}
```

## Security Considerations

- RabbitMQ should be configured with authentication
- Use SSL/TLS for production environments
- Implement proper access controls
- Monitor message queues for security

## Performance Considerations

- Messages are persistent (survive broker restarts)
- Consumer acknowledges messages after processing
- Failed messages are requeued automatically
- Consider message batching for high-volume scenarios 