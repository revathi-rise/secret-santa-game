import * as Papa from 'papaparse';

export interface Employee {
  Employee_Name: string;
  Employee_EmailID: string;
  Secret_Child_Name?: string;
  Secret_Child_EmailID?: string;
}

export async function parseCsv(buffer: Buffer): Promise<Employee[]> {
  return new Promise((resolve, reject) => {
    const csvString = buffer.toString();
    Papa.parse<Employee>(csvString, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: (err) => reject(err),
    });
  });
}

export function generateCsv(assignments: Employee[]): string {
  return Papa.unparse(assignments);
}
