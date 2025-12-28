// Script to create test analysis data for Output page preview
import { createPool } from 'mysql2/promise';
import { nanoid } from 'nanoid';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the sample output files
const part1 = fs.readFileSync(path.join(__dirname, '../sample-outputs/part1.md'), 'utf-8');
const part2 = fs.readFileSync(path.join(__dirname, '../sample-outputs/part2.md'), 'utf-8');
const part3 = fs.readFileSync(path.join(__dirname, '../sample-outputs/part3.md'), 'utf-8');
const part4 = fs.readFileSync(path.join(__dirname, '../sample-outputs/part4.md'), 'utf-8');

const problemStatement = 'How can we improve the onboarding experience for our B2B SaaS product to reduce time-to-value and increase user activation rates?';

async function main() {
  const pool = createPool({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const sessionId = 'test-apex-demo-' + nanoid(8);
  const now = new Date();

  try {
    // Create analysis session
    await pool.execute(
      `INSERT INTO analysis_sessions (sessionId, problemStatement, tier, status, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        sessionId,
        problemStatement,
        'full',
        'completed',
        now,
        now
      ]
    );

    // Create analysis result - skip fullMarkdown as it's too long
    await pool.execute(
      `INSERT INTO analysis_results (sessionId, tier, problemStatement, part1, part2, part3, part4, currentPart, progressStatus, createdAt, generatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sessionId,
        'full',
        problemStatement,
        part1,
        part2,
        part3,
        part4,
        4,
        'completed',
        now,
        now
      ]
    );

    console.log('✅ Test analysis created successfully!');
    console.log(`📎 View at: /analysis/${sessionId}`);
    console.log(`Session ID: ${sessionId}`);

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await pool.end();
  }
}

main();
