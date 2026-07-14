import { randomUUID } from 'node:crypto';

import { ServiceLifecycle } from '../common/service-lifecycle';
import { AssignmentPolicy } from './assignment-policy';
import type {
  AssignmentPolicyServiceContract,
  CreateAssignmentPolicyCommand,
  EvaluateAssignmentPolicyCommand,
} from './assignment-policy.contract';
import { AssignmentPolicyId } from './assignment-policy-id';
import { AssignmentPolicyNotFoundError } from './assignment-policy.errors';
import {
  InMemoryAssignmentPolicyRepository,
  type IAssignmentPolicyRepository,
} from './assignment-policy.repository';
import type {
  AssignmentPolicyEvaluationResult,
  AssignmentPolicySnapshot,
} from './assignment-policy.types';

export class AssignmentPolicyService
  extends ServiceLifecycle
  implements AssignmentPolicyServiceContract
{
  public constructor(
    private readonly repository: IAssignmentPolicyRepository = new InMemoryAssignmentPolicyRepository(),
    private readonly createIdentity: () => string = randomUUID,
  ) {
    super('AssignmentPolicyService');
  }

  public async createAssignmentPolicy(
    command: CreateAssignmentPolicyCommand,
  ): Promise<AssignmentPolicySnapshot> {
    const assignmentPolicy = AssignmentPolicy.create({
      id: command.id ?? this.createIdentity(),
      requiredRole: command.requiredRole,
      adapterExecutionCapability: command.adapterExecutionCapability,
      repositoryConfiguration: command.repositoryConfiguration,
      executionConstraints: command.executionConstraints,
      humanPreferences: command.humanPreferences,
    });

    await this.repository.create(assignmentPolicy);

    return assignmentPolicy.toSnapshot();
  }

  public async getAssignmentPolicy(assignmentPolicyId: string): Promise<AssignmentPolicySnapshot> {
    return (await this.requireAssignmentPolicy(assignmentPolicyId)).toSnapshot();
  }

  public async enumerateAssignmentPolicies(): Promise<readonly AssignmentPolicySnapshot[]> {
    return Object.freeze(
      (await this.repository.enumerate()).map((assignmentPolicy) =>
        assignmentPolicy.toSnapshot(),
      ),
    );
  }

  public async evaluateAssignmentPolicy(
    command: EvaluateAssignmentPolicyCommand,
  ): Promise<AssignmentPolicyEvaluationResult> {
    return (await this.requireAssignmentPolicy(command.assignmentPolicyId)).evaluate(command.input);
  }

  private async requireAssignmentPolicy(
    assignmentPolicyId: AssignmentPolicyId | string,
  ): Promise<AssignmentPolicy> {
    const normalizedAssignmentPolicyId =
      typeof assignmentPolicyId === 'string'
        ? AssignmentPolicyId.fromString(assignmentPolicyId)
        : assignmentPolicyId;
    const assignmentPolicy = await this.repository.getById(normalizedAssignmentPolicyId);

    if (assignmentPolicy === undefined) {
      throw new AssignmentPolicyNotFoundError(normalizedAssignmentPolicyId.toString());
    }

    return assignmentPolicy;
  }
}
