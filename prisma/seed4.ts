const { PrismaClient } = require('@prisma/client');
const xlsx = require('xlsx');
const prisma = new PrismaClient();

function excelDateToJSDate(serial:number) {
    if (typeof serial === 'number') {
      const utcDays = Math.floor(serial - 25569);
      const utcValue = utcDays * 86400; // seconds
      return new Date(utcValue * 1000); // convert to ms
    }
    return new Date(serial); // fallback in case it's already a valid date
  }
 
async function main() {
  const workbook = xlsx.readFile('./prisma/cms_consolidated_full.xlsx');
  const tasks = [];
  let i = 0;
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet); // Skip first row
    i++;
    if(i!=4)
        continue;
    for (const row of rows) {
        console.log("rows",row);
        tasks.push({
            lsa: row['LSA'] || 'None',
            tsp: row['TSP'] || 'None',
            dotAndLea: row['DoT & LEA'] || '',
            problemDescription: row['Problem Description'] || '',
            status: (row['Status'] || 'pending').toLowerCase(),
            solutionProvided: row['Solution provided'] || '',
            remarks: row['Remarks'] || '',
            createdAt: row['Date'] ? excelDateToJSDate(row['Date']) : new Date(),
          });
    }
 
  }

  for (const task of tasks) {
    const exists = await prisma.task.findFirst({
      where: {
        lsa: task.lsa,
        tsp: task.tsp,
        problemDescription: task.problemDescription,
        createdAt: task.createdAt,
      },
    });
  
    if (!exists) {
      await prisma.task.create({ data: task });
    }
  }
  
  console.log(`Seeded ${tasks.length} tasks`);

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
