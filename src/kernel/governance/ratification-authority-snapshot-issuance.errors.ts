import { KernelError } from '../common/kernel-error';

export type RatificationAuthoritySnapshotIssuanceContractViolationCode =
  | 'undeclared-diagnostic'
  | 'malformed-diagnostic-payload'
  | 'internal-invariant-violation';

export class RatificationAuthoritySnapshotIssuanceContractError extends KernelError {
  public readonly contractViolationCode: RatificationAuthoritySnapshotIssuanceContractViolationCode;
  public readonly diagnosticPhase = 'ContractViolation' as const;
  public readonly diagnosticPrecedence = 9 as const;

  public constructor(
    code: RatificationAuthoritySnapshotIssuanceContractViolationCode,
    message: string,
  ) {
    super(message);
    this.name = 'RatificationAuthoritySnapshotIssuanceContractError';
    this.contractViolationCode = code;
  }
}
