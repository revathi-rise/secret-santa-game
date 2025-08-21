import { Test, TestingModule } from '@nestjs/testing';
import { SecretSantaController } from './secret-santa.controller';
import { SecretSantaService } from './secret-santa.service';
import * as path from 'path';

describe('SecretSantaController', () => {
  let controller: SecretSantaController;
  let service: SecretSantaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecretSantaController],
      providers: [
        {
          provide: SecretSantaService,
          useValue: {
            generateAssignments: jest.fn().mockResolvedValue('assignments/secret-santa-output.csv'),
          },
        },
      ],
    }).compile();

    controller = module.get<SecretSantaController>(SecretSantaController);
    service = module.get<SecretSantaService>(SecretSantaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return success JSON when files uploaded', async () => {
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const mockFiles = {
      employees: [{ buffer: Buffer.from('dummy') }],
      previous: [{ buffer: Buffer.from('dummy') }],
    };

    await controller.uploadCsv(mockFiles as any, mockRes as any);
    const outputPath = path.join(process.cwd(), 'assignments/secret-santa-output.csv');
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Assignments generated successfully',
      outputPath: outputPath,
    });
  });
});
