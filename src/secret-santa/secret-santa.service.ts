import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { format } from '@fast-csv/format';
import * as XLSX from 'xlsx';

@Injectable()
export class SecretSantaService {
  
  private async readCSV(filePath: string): Promise<any[]> {
    try {
      return await new Promise((resolve, reject) => {
        const results: any[] = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (err) => reject(err));
      });
    } catch (err) {
      console.error('Error reading CSV file:', err);
      throw err;
    }
  }

  private readExcel(filePath: string): any[] {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      return data;
    } catch (err) {
      console.error('Error reading Excel file:', err);
      throw err;
    }
  }

  private shuffle(array: any[]) {
    try {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    } catch (err) {
      console.error('Error shuffling array:', err);
      throw err;
    }
  }

  private assignSecretSanta(employees: any[], previousAssignments: any[]) {
    try {
      const previousMap = new Map<string, string>();
      previousAssignments.forEach((p) => {
        previousMap.set(p.Employee_EmailID, p.Secret_Child_EmailID);
      });

      const maxAttempts = 5000;
      let attempts = 0;

      while (attempts < maxAttempts) {
        attempts++;
        const shuffled = this.shuffle([...employees]);
        const usedChildren = new Set<string>();
        const result: any[] = [];
        let valid = true;

        for (let i = 0; i < employees.length; i++) {
          const santa = employees[i];
          let assignedChild: any = null;

          for (const candidate of shuffled) {
            if (
              candidate.Employee_EmailID !== santa.Employee_EmailID &&
              previousMap.get(santa.Employee_EmailID) !== candidate.Employee_EmailID &&
              !usedChildren.has(candidate.Employee_EmailID)
            ) {
              assignedChild = candidate;
              break;
            }
          }

          if (!assignedChild) {
            valid = false;
            break;
          }

          usedChildren.add(assignedChild.Employee_EmailID);

          result.push({
            Employee_Name: santa.Employee_Name,
            Employee_EmailID: santa.Employee_EmailID,
            Secret_Child_Name: assignedChild.Employee_Name,
            Secret_Child_EmailID: assignedChild.Employee_EmailID,
          });
        }

        if (valid) {
          console.log('Assignment completed successfully in', attempts, 'attempts');
          return result;
        }
      }

      throw new Error('Unable to generate a valid Secret Santa assignment after many attempts.');
    } catch (err) {
      console.error('Error assigning Secret Santa:', err);
      throw err;
    }
  }

  async generateAssignments(
    employeesPath: string,
    previousPath: string,
  ): Promise<string> {
    try {
      const employees = this.readExcel(employeesPath);

      const previousAssignments = await this.readCSV(previousPath);

      const assignments = this.assignSecretSanta(employees, previousAssignments);

      const outputDir = path.join(process.cwd(), 'assignments');

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputPath = path.join(outputDir, 'secret-santa-output.csv');

      return await new Promise((resolve, reject) => {
        try {
          const ws = fs.createWriteStream(outputPath);
          const csvStream = format({ headers: true });

          csvStream.pipe(ws);

          assignments.forEach((row, i) => {
            csvStream.write(row);
          });

          csvStream.end();

          ws.on('finish', () => resolve(outputPath));
          ws.on('error', reject);
          csvStream.on('finish', () => {
            console.log('CSV streaming to client finished!');
          });
          csvStream.on('error', (err) => {
            console.error('CSV writing error:', err);
            reject(err);
          });
        } catch (err) {
          console.error('Error generating CSV:', err);
          reject(err);
        }
      });
    } catch (err) {
      console.error('Error in generateAssignments:', err);
      throw err;
    }
  }
}
