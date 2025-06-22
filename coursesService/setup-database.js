const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    let connection;
    
    try {
        console.log('🔧 Setting up courses database...');
        
        // Connect to MySQL without specifying database
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
            port: process.env.DB_PORT || 3306
        });
        
        console.log('✅ Connected to MySQL');
        
        // Read and execute init.sql
        const initSql = fs.readFileSync(path.join(__dirname, 'db', 'init.sql'), 'utf8');
        const statements = initSql.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await connection.execute(statement);
                console.log('✅ Executed:', statement.substring(0, 50) + '...');
            }
        }
        
        // Check if course_ref_id column exists, if not run migration
        try {
            await connection.execute('USE coursesdb');
            const [columns] = await connection.execute('DESCRIBE grades');
            const hasGradeID = columns.some(col => col.Field === 'gradeID');
            const hasCourseID = columns.some(col => col.Field === 'courseID');
            const hasStudentID = columns.some(col => col.Field === 'studentID');
            
            if (!hasGradeID || !hasCourseID || !hasStudentID) {
                console.log('⚠️ Grades table structure mismatch, running migration...');
                const migrateSql = fs.readFileSync(path.join(__dirname, 'db', 'migrate.sql'), 'utf8');
                const migrateStatements = migrateSql.split(';').filter(stmt => stmt.trim());
                
                for (const statement of migrateStatements) {
                    if (statement.trim()) {
                        await connection.execute(statement);
                        console.log('✅ Migration executed:', statement.substring(0, 50) + '...');
                    }
                }
            } else {
                console.log('✅ Grades table structure is correct');
            }
        } catch (migrateError) {
            console.warn('⚠️ Migration failed:', migrateError.message);
        }
        
        console.log('✅ Database setup completed successfully!');
        
    } catch (error) {
        console.error('❌ Database setup failed:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run setup if this file is executed directly
if (require.main === module) {
    setupDatabase()
        .then(() => {
            console.log('🎉 Database setup completed!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Database setup failed:', error);
            process.exit(1);
        });
}

module.exports = setupDatabase; 