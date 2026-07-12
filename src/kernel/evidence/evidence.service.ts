import { ServiceLifecycle } from '../common/service-lifecycle';
import { Evidence } from './evidence.aggregate';
import type { RegisterEvidenceRequest } from './evidence.aggregate';
import {
  DuplicateEvidenceException,
  EvidenceNotFoundException,
} from './evidence.errors';
import { EvidenceId } from './evidence-id';
import { InMemoryEvidenceRepository } from './evidence.repository';
import type { IEvidenceRepository } from './evidence.repository';

export class EvidenceService extends ServiceLifecycle {
  public constructor(
    private readonly repository: IEvidenceRepository = new InMemoryEvidenceRepository(),
  ) {
    super('EvidenceService');
  }

  public async registerEvidence(request: RegisterEvidenceRequest): Promise<Evidence> {
    const evidence = Evidence.register(request);

    await this.validateEvidence(evidence);
    await this.repository.register(evidence);

    return evidence;
  }

  public async validateEvidence(evidence: Evidence): Promise<void> {
    if (await this.repository.exists(evidence.id)) {
      throw new DuplicateEvidenceException(evidence.id.toString());
    }
  }

  public async retrieveEvidence(evidenceId: EvidenceId | string): Promise<Evidence> {
    const normalizedEvidenceId =
      typeof evidenceId === 'string' ? EvidenceId.fromString(evidenceId) : evidenceId;
    const evidence = await this.repository.getById(normalizedEvidenceId);

    if (evidence === undefined) {
      throw new EvidenceNotFoundException(normalizedEvidenceId.toString());
    }

    return evidence;
  }

  public async enumerateEvidence(): Promise<readonly Evidence[]> {
    return this.repository.enumerate();
  }
}
