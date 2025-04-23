import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  // Load Excel
  const filePath = path.resolve(__dirname, 'CMS_CONSOLIDATED.xlsx');
  const workbook = XLSX.readFile(filePath);

  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert sheet to JSON
  const data: any[] = XLSX.utils.sheet_to_json(sheet);

  for (const row of data) {
    try {
      const taskData = {
        lsa: row.__EMPTY_1?.trim(), // 'MB', 'MP', etc.
        tsp: row.__EMPTY_2?.trim() || null,
        dotAndLea: row.__EMPTY_3?.trim() || null,
        problemDescription: row.__EMPTY_4?.trim() || null,
        status: row.__EMPTY_5?.trim() || "Pending",
        solutionProvided: row.__EMPTY_6?.trim() || null,
        remarks: row.__EMPTY_7?.trim() || null,
      }
  
      // skip if required field is missing
      if (!taskData.lsa || !taskData.problemDescription) {
        console.log("Skipping row due to missing required fields:", taskData)
        continue
      }
  
      await prisma.task.create({ data: taskData })
    } catch (error) {
      console.error("Failed to create task:", row, error)
    }
  }
  

  console.log('✅ Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
