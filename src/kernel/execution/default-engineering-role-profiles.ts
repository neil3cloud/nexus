import { createDefaultKernelRoles } from './default-kernel-roles';
import { EngineeringRoleProfile } from './engineering-role-profile';
import type { EngineeringRoleProfileInput } from './engineering-role-profile';
import { InvalidEngineeringRoleProfileDefinitionError } from './engineering-role-profile.errors';

const defaultProfileInputsByRoleId = new Map<string, Omit<EngineeringRoleProfileInput, 'roleId'>>([
  [
    'builder',
    {
      workflowPresentationLabel: 'Builder Workflow',
      completionPresentationLabel: 'Builder workflow',
      includeAssignedRoleInPresentation: true,
    },
  ],
  [
    'reviewer',
    {
      workflowPresentationLabel: 'Reviewer Workflow',
      completionPresentationLabel: 'Reviewer workflow',
      includeAssignedRoleInPresentation: true,
    },
  ],
  [
    'documentation-reviewer',
    {
      workflowPresentationLabel: 'Documentation Reviewer Workflow',
      completionPresentationLabel: 'Documentation Review completed',
      includeAssignedRoleInPresentation: true,
    },
  ],
]);

export function createDefaultEngineeringRoleProfiles(): readonly EngineeringRoleProfile[] {
  return Object.freeze(
    createDefaultKernelRoles().map((role) => {
      const roleId = role.id.toString();
      const profileInput = defaultProfileInputsByRoleId.get(roleId);

      if (profileInput === undefined) {
        throw new InvalidEngineeringRoleProfileDefinitionError(
          `Default EngineeringRoleProfile metadata is not defined for ExecutionRole '${roleId}'.`,
        );
      }

      return EngineeringRoleProfile.create({
        roleId,
        ...profileInput,
      });
    }),
  );
}

