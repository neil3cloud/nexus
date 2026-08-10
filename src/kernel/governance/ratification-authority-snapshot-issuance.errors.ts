import { KernelError } from '../common/kernel-error';

export class RatificationAuthoritySnapshotIssuanceContractError extends KernelError {
  public constructor(message: string) {
    super(message);
    this.name = 'RatificationAuthoritySnapshotIssuanceContractError';
  }
}
