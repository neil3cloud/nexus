import { RoleId } from './role-id';
import { AssignmentPolicyId } from './assignment-policy-id';
import { InvalidAssignmentPolicyDefinitionError } from './assignment-policy.errors';
import type {
  AssignmentPolicyEvaluationInput,
  AssignmentPolicyEvaluationResult,
  AssignmentPolicyInput,
  AssignmentPolicySnapshot,
} from './assignment-policy.types';

const assignmentPolicyAllowedKeys = new Set([
  'id',
  'requiredRole',
  'adapterExecutionCapability',
  'repositoryConfiguration',
  'executionConstraints',
  'humanPreferences',
]);
const assignmentPolicyEvaluationAllowedKeys = new Set([
  'requiredRole',
  'adapterExecutionCapability',
  'repositoryConfiguration',
  'executionConstraints',
  'humanPreferences',
]);
const assignmentPolicyForbiddenKeys = new Set([
  'engineeringSession',
  'engineeringSessionId',
  'executionSession',
  'executionSessionId',
  'workflowChain',
  'workflowChainId',
  'workflowStep',
  'workflowStepId',
  'adapter',
  'adapterId',
  'dispatch',
  'reviewGate',
  'orchestration',
  'automaticWorkflowAdvancement',
]);

export class AssignmentRequiredRole {
  private constructor(private readonly roleIdValue: RoleId) {
    Object.freeze(this);
  }

  public static fromString(value: string): AssignmentRequiredRole {
    return new AssignmentRequiredRole(RoleId.fromString(value));
  }

  public equals(other: AssignmentRequiredRole): boolean {
    return this.roleIdValue.equals(other.roleIdValue);
  }

  public toString(): string {
    return this.roleIdValue.toString();
  }

  public toJSON(): string {
    return this.toString();
  }
}

export class AssignmentAdapterExecutionCapability {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  public static fromString(value: string): AssignmentAdapterExecutionCapability {
    return new AssignmentAdapterExecutionCapability(
      normalizeNonEmptyString(value, 'AssignmentPolicy adapterExecutionCapability'),
    );
  }

  public equals(other: AssignmentAdapterExecutionCapability): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  public toJSON(): string {
    return this.value;
  }
}

export class AssignmentRepositoryConfiguration {
  private constructor(private readonly values: Readonly<Record<string, string>>) {
    Object.freeze(this);
  }

  public static fromRecord(
    value: Readonly<Record<string, string>>,
  ): AssignmentRepositoryConfiguration {
    return new AssignmentRepositoryConfiguration(
      copyStringRecord(value, 'AssignmentPolicy repositoryConfiguration'),
    );
  }

  public isSatisfiedBy(candidate: AssignmentRepositoryConfiguration): boolean {
    return recordContains(candidate.values, this.values);
  }

  public equals(other: AssignmentRepositoryConfiguration): boolean {
    return recordsEqual(this.values, other.values);
  }

  public toSnapshot(): Readonly<Record<string, string>> {
    return copyStringRecord(this.values, 'AssignmentPolicy repositoryConfiguration');
  }
}

export class AssignmentExecutionConstraints {
  private constructor(private readonly values: Readonly<Record<string, string>>) {
    Object.freeze(this);
  }

  public static fromRecord(value: Readonly<Record<string, string>>): AssignmentExecutionConstraints {
    return new AssignmentExecutionConstraints(
      copyStringRecord(value, 'AssignmentPolicy executionConstraints'),
    );
  }

  public isSatisfiedBy(candidate: AssignmentExecutionConstraints): boolean {
    return recordContains(candidate.values, this.values);
  }

  public equals(other: AssignmentExecutionConstraints): boolean {
    return recordsEqual(this.values, other.values);
  }

  public toSnapshot(): Readonly<Record<string, string>> {
    return copyStringRecord(this.values, 'AssignmentPolicy executionConstraints');
  }
}

export class AssignmentHumanPreferences {
  private constructor(private readonly values: Readonly<Record<string, string>>) {
    Object.freeze(this);
  }

  public static fromRecord(value: Readonly<Record<string, string>>): AssignmentHumanPreferences {
    return new AssignmentHumanPreferences(
      copyStringRecord(value, 'AssignmentPolicy humanPreferences'),
    );
  }

  public isSatisfiedBy(candidate: AssignmentHumanPreferences): boolean {
    return recordContains(candidate.values, this.values);
  }

  public equals(other: AssignmentHumanPreferences): boolean {
    return recordsEqual(this.values, other.values);
  }

  public toSnapshot(): Readonly<Record<string, string>> {
    return copyStringRecord(this.values, 'AssignmentPolicy humanPreferences');
  }
}

export class AssignmentPolicy {
  private constructor(
    private readonly assignmentPolicyId: AssignmentPolicyId,
    private readonly requiredRoleValue: AssignmentRequiredRole,
    private readonly adapterExecutionCapabilityValue: AssignmentAdapterExecutionCapability,
    private readonly repositoryConfigurationValue: AssignmentRepositoryConfiguration,
    private readonly executionConstraintsValue: AssignmentExecutionConstraints,
    private readonly humanPreferencesValue: AssignmentHumanPreferences,
  ) {
    Object.freeze(this);
  }

  public static create(input: AssignmentPolicyInput): AssignmentPolicy {
    assertAllowedKeys(input, assignmentPolicyAllowedKeys, 'AssignmentPolicy');

    return new AssignmentPolicy(
      AssignmentPolicyId.fromString(input.id),
      AssignmentRequiredRole.fromString(input.requiredRole),
      AssignmentAdapterExecutionCapability.fromString(input.adapterExecutionCapability),
      AssignmentRepositoryConfiguration.fromRecord(input.repositoryConfiguration),
      AssignmentExecutionConstraints.fromRecord(input.executionConstraints),
      AssignmentHumanPreferences.fromRecord(input.humanPreferences),
    );
  }

  public static fromSnapshot(snapshot: AssignmentPolicySnapshot): AssignmentPolicy {
    return AssignmentPolicy.create(snapshot);
  }

  public get id(): AssignmentPolicyId {
    return this.assignmentPolicyId;
  }

  public evaluate(input: AssignmentPolicyEvaluationInput): AssignmentPolicyEvaluationResult {
    assertAllowedKeys(input, assignmentPolicyEvaluationAllowedKeys, 'AssignmentPolicy evaluation');

    const requiredRole = AssignmentRequiredRole.fromString(input.requiredRole);
    const adapterExecutionCapability = AssignmentAdapterExecutionCapability.fromString(
      input.adapterExecutionCapability,
    );
    const repositoryConfiguration = AssignmentRepositoryConfiguration.fromRecord(
      input.repositoryConfiguration,
    );
    const executionConstraints = AssignmentExecutionConstraints.fromRecord(
      input.executionConstraints,
    );
    const humanPreferences = AssignmentHumanPreferences.fromRecord(input.humanPreferences);
    const requirements = Object.freeze({
      requiredRole: this.requiredRoleValue.equals(requiredRole),
      adapterExecutionCapability:
        this.adapterExecutionCapabilityValue.equals(adapterExecutionCapability),
      repositoryConfiguration:
        this.repositoryConfigurationValue.isSatisfiedBy(repositoryConfiguration),
      executionConstraints: this.executionConstraintsValue.isSatisfiedBy(executionConstraints),
      humanPreferences: this.humanPreferencesValue.isSatisfiedBy(humanPreferences),
    });

    return Object.freeze({
      assignmentPolicyId: this.assignmentPolicyId.toString(),
      satisfied: Object.values(requirements).every((requirement) => requirement),
      requirements,
    });
  }

  public equals(other: AssignmentPolicy): boolean {
    return JSON.stringify(this.toSnapshot()) === JSON.stringify(other.toSnapshot());
  }

  public toSnapshot(): AssignmentPolicySnapshot {
    return Object.freeze({
      id: this.assignmentPolicyId.toString(),
      requiredRole: this.requiredRoleValue.toString(),
      adapterExecutionCapability: this.adapterExecutionCapabilityValue.toString(),
      repositoryConfiguration: this.repositoryConfigurationValue.toSnapshot(),
      executionConstraints: this.executionConstraintsValue.toSnapshot(),
      humanPreferences: this.humanPreferencesValue.toSnapshot(),
    });
  }
}

function assertAllowedKeys(
  input: object,
  allowedKeys: ReadonlySet<string>,
  label: string,
): void {
  const keys = Object.keys(input);
  const unsupportedKeys = keys.filter((key) => !allowedKeys.has(key));
  const forbiddenKeys = unsupportedKeys.filter((key) => assignmentPolicyForbiddenKeys.has(key));

  if (forbiddenKeys.length > 0) {
    throw new InvalidAssignmentPolicyDefinitionError(
      `${label} cannot reference ${forbiddenKeys.join(', ')}.`,
    );
  }

  if (unsupportedKeys.length > 0) {
    throw new InvalidAssignmentPolicyDefinitionError(
      `${label} supports only requiredRole, adapterExecutionCapability, repositoryConfiguration, executionConstraints, and humanPreferences; unsupported field(s): ${unsupportedKeys.join(', ')}.`,
    );
  }
}

function copyStringRecord(
  record: Readonly<Record<string, string>>,
  label: string,
): Readonly<Record<string, string>> {
  const copied: Record<string, string> = {};

  for (const [key, value] of Object.entries(record).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const normalizedKey = normalizeNonEmptyString(key, `${label} key`);
    copied[normalizedKey] = normalizeNonEmptyString(value, `${label} '${normalizedKey}'`);
  }

  return Object.freeze(copied);
}

function recordContains(
  candidate: Readonly<Record<string, string>>,
  required: Readonly<Record<string, string>>,
): boolean {
  for (const [key, value] of Object.entries(required)) {
    if (candidate[key] !== value) {
      return false;
    }
  }

  return true;
}

function recordsEqual(
  left: Readonly<Record<string, string>>,
  right: Readonly<Record<string, string>>,
): boolean {
  const leftEntries = Object.entries(left);
  const rightEntries = Object.entries(right);

  if (leftEntries.length !== rightEntries.length) {
    return false;
  }

  return recordContains(left, right);
}

function normalizeNonEmptyString(value: string, label: string): string {
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new InvalidAssignmentPolicyDefinitionError(`${label} must be a non-empty string.`);
  }

  return normalized;
}
