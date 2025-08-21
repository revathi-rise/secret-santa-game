import { Test, TestingModule } from '@nestjs/testing';
import { SecretSantaService } from './secret-santa.service';

describe('SecretSantaService', () => {
  let service: SecretSantaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecretSantaService],
    }).compile();

    service = module.get<SecretSantaService>(SecretSantaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should assign a secret child to each employee', () => {
    const employees = [
      { Employee_Name: 'Alice', Employee_EmailID: 'alice@example.com' },
      { Employee_Name: 'Bob', Employee_EmailID: 'bob@example.com' },
      { Employee_Name: 'Charlie', Employee_EmailID: 'charlie@example.com' },
    ];

    const previousAssignments: any[] = [];

    const result = service['assignSecretSanta'](employees, previousAssignments);

    // Each employee must have one child
    expect(result.length).toBe(employees.length);

    // No self-assignment
    result.forEach(r => {
      expect(r.Employee_EmailID).not.toBe(r.Secret_Child_EmailID);
    });

    // Each child is unique
    const childEmails = result.map(r => r.Secret_Child_EmailID);
    const uniqueChildEmails = new Set(childEmails);
    expect(uniqueChildEmails.size).toBe(result.length);
  });

  it('should avoid previous year assignments', () => {
    const employees = [
      { Employee_Name: 'Alice', Employee_EmailID: 'alice@example.com' },
      { Employee_Name: 'Bob', Employee_EmailID: 'bob@example.com' },
      { Employee_Name: 'Charlie', Employee_EmailID: 'charlie@example.com' },
    ];

    const previousAssignments = [
      {
        Employee_Name: 'Alice',
        Employee_EmailID: 'alice@example.com',
        Secret_Child_Name: 'Bob',
        Secret_Child_EmailID: 'bob@example.com',
      },
    ];

    const result = service['assignSecretSanta'](employees, previousAssignments);

    // Alice should not get Bob again
    result.forEach(r => {
      if (r.Employee_EmailID === 'alice@example.com') {
        expect(r.Secret_Child_EmailID).not.toBe('bob@example.com');
      }
    });

    // No self-assignment
    result.forEach(r => {
      expect(r.Employee_EmailID).not.toBe(r.Secret_Child_EmailID);
    });

    // Each child unique
    const childEmails = result.map(r => r.Secret_Child_EmailID);
    const uniqueChildEmails = new Set(childEmails);
    expect(uniqueChildEmails.size).toBe(result.length);
  });

  it('should throw error if impossible to assign', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); 

    const employees = [{ Employee_Name: 'Alice', Employee_EmailID: 'alice@example.com' }];
    const previousAssignments = [{ 
      Employee_Name: 'Alice', 
      Employee_EmailID: 'alice@example.com', 
      Secret_Child_Name: 'Alice', 
      Secret_Child_EmailID: 'alice@example.com'
    }];

    expect(() => service['assignSecretSanta'](employees, previousAssignments))
      .toThrow('Unable to generate a valid Secret Santa assignment after many attempts');
  });
});
