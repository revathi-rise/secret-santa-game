import { Controller, Post, UseInterceptors, UploadedFiles, Res } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SecretSantaService } from './secret-santa.service';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('secret-santa')
export class SecretSantaController {
  constructor(private readonly secretSantaService: SecretSantaService) { }

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'employees', maxCount: 1 },
      { name: 'previous', maxCount: 1 },
    ]),
  )
  async uploadCsv(
    @UploadedFiles()
    files: {
      employees?: Express.Multer.File[];
      previous?: Express.Multer.File[];
    },
    @Res() res: Response,
  ) {
    const employeesFile = files.employees?.[0];
    const previousFile = files.previous?.[0];

    if (!employeesFile || !previousFile) {
      return res
        .status(400)
        .send('Both employees.csv and previous.csv are required.');
    }

    const employeesPath = path.join(process.cwd(), 'employees-temp.xlsx');
    const previousPath = path.join(process.cwd(), 'previous-temp.xlsx');

    fs.writeFileSync(employeesPath, employeesFile.buffer);
    fs.writeFileSync(previousPath, previousFile.buffer);

    const outputPath = path.join(process.cwd(), 'assignments/secret-santa-output.csv');

    try {
      await this.secretSantaService.generateAssignments(
        employeesPath,
        previousPath
      );
      return res.status(200).json({ status: true, message: 'Assignments generated successfully', outputPath });
    } catch (err) {
      console.error('Error generating assignments:', err);
      return res.status(500).json({ status: false, message: 'Failed to generate assignments', error: err.message });
    }

  }
}
