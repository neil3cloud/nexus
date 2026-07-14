import { ExecutionRole } from './execution-role';

export function createDefaultKernelRoles(): readonly ExecutionRole[] {
  return Object.freeze([
    ExecutionRole.create({
      id: 'builder',
      name: 'Builder',
      description: 'Responsible for implementing authorized engineering changes.',
      category: 'Engineering Responsibility',
      metadata: {
        attributes: {
          origin: 'KernelDefault',
          rfc: 'RFC-0004',
        },
      },
    }),
    ExecutionRole.create({
      id: 'reviewer',
      name: 'Reviewer',
      description: 'Responsible for validating engineering work against governing evidence.',
      category: 'Engineering Responsibility',
      metadata: {
        attributes: {
          origin: 'KernelDefault',
          rfc: 'RFC-0004',
        },
      },
    }),
    ExecutionRole.create({
      id: 'documentation-reviewer',
      name: 'Documentation Reviewer',
      description: 'Responsible for validating engineering documentation against governing evidence.',
      category: 'Engineering Responsibility',
      metadata: {
        attributes: {
          origin: 'KernelDefault',
          rfc: 'RFC-0004',
        },
      },
    }),
  ]);
}
