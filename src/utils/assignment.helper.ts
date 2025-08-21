import { Employee } from './csv.helper';

export function assignSecretSanta(employees: Employee[], previousAssignments: Employee[]): Employee[] {
  const assignments: Employee[] = [];
  const availableChildren = [...employees];

  for (const emp of employees) {
    let child: Employee | undefined;

    for (let i = 0; i < availableChildren.length; i++) {
      const candidate = availableChildren[i];
      const wasPreviousChild = previousAssignments.some(
        (prev) =>
          prev.Employee_EmailID === emp.Employee_EmailID &&
          prev.Secret_Child_EmailID === candidate.Employee_EmailID
      );

      if (candidate.Employee_EmailID !== emp.Employee_EmailID && !wasPreviousChild) {
        child = candidate;
        availableChildren.splice(i, 1);
        break;
      }
    }

    if (!child) throw new Error(`No valid assignment found for ${emp.Employee_Name}`);

    assignments.push({
      ...emp,
      Secret_Child_Name: child.Employee_Name,
      Secret_Child_EmailID: child.Employee_EmailID,
    });
  }

  return assignments;
}
