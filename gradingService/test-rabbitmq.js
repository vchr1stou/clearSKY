const rabbitMQService = require('./src/services/rabbitmqService.js');

async function testRabbitMQ() {
  try {
    console.log('🧪 Testing RabbitMQ communication...');
    
    // Test grade data
    const testGradeData = {
      student_id: 12345,
      course_id: 101,
      course_ref_id: 101,
      question_grades: {
        Q1: 8.5,
        Q2: 7.0,
        Q3: 9.0,
        Q4: 6.5,
        Q5: 8.0
      },
      exam_period: '2024-01',
      grading_status: 'closed',
      total_grade: 7.8,
      institution_id: 1
    };
    
    console.log('📤 Sending test grade data to RabbitMQ...');
    await rabbitMQService.sendGradeData(testGradeData);
    console.log('✅ Test grade data sent successfully!');
    
    // Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ RabbitMQ test completed successfully!');
    
  } catch (error) {
    console.error('❌ RabbitMQ test failed:', error.message);
  } finally {
    await rabbitMQService.close();
    process.exit(0);
  }
}

testRabbitMQ(); 