import { randomUUID } from 'node:crypto';

import type { EventBusContract } from '../common/event-bus-contract';
import { ServiceLifecycle } from '../common/service-lifecycle';
import { Evidence } from './evidence.aggregate';
import type { RegisterEvidenceRequest } from './evidence.aggregate';
import {
  DuplicateEvidenceException,
  EvidenceEventPublisherUnavailableError,
  EvidenceNotFoundException,
} from './evidence.errors';
import { EvidenceId } from './evidence-id';
import { EvidenceVersion } from './evidence-version';
import { InMemoryEvidenceRepository } from './evidence.repository';
import type { IEvidenceRepository } from './evidence.repository';

export class EvidenceService extends ServiceLifecycle {
  public constructor(
    private readonly repository: IEvidenceRepository = new InMemoryEvidenceRepository(),
    private readonly eventBus?: EventBusContract,
    private readonly createIdentity: () => string = randomUUID,
    private readonly createTimestamp: () => string = () => new Date().toISOString(),
  ) {
    super('EvidenceService');
  }

  public async registerEvidence(request: RegisterEvidenceRequest): Promise<Evidence> {
    const eventBus = this.requireEventBus();
    const evidence = Evidence.register(request);

    await this.validateEvidence(evidence);
    evidence.recordCaptured(this.createEventMetadata());
    await this.repository.register(evidence);
    await this.publishRecordedEvents(evidence, eventBus);

    return evidence;
  }

  public async validateEvidence(evidence: Evidence): Promise<void> {
    if (await this.repository.existsByIdAndVersion(evidence.id, evidence.version)) {
      throw new DuplicateEvidenceException(evidence.id.toString(), evidence.version.toNumber());
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

  public async retrieveEvidenceVersion(
    evidenceId: EvidenceId | string,
    evidenceVersion: EvidenceVersion | number,
  ): Promise<Evidence> {
    const normalizedEvidenceId =
      typeof evidenceId === 'string' ? EvidenceId.fromString(evidenceId) : evidenceId;
    const normalizedEvidenceVersion =
      typeof evidenceVersion === 'number' ? EvidenceVersion.fromNumber(evidenceVersion) : evidenceVersion;
    const evidence = await this.repository.getByIdAndVersion(
      normalizedEvidenceId,
      normalizedEvidenceVersion,
    );

    if (evidence === undefined) {
      throw new EvidenceNotFoundException(normalizedEvidenceId.toString());
    }

    return evidence;
  }

  public async enumerateEvidence(): Promise<readonly Evidence[]> {
    return this.repository.enumerate();
  }

  private createEventMetadata(): {
    readonly eventId: string;
    readonly timestamp: string;
  } {
    return {
      eventId: this.createIdentity(),
      timestamp: this.createTimestamp(),
    };
  }

  private async publishRecordedEvents(evidence: Evidence, eventBus: EventBusContract): Promise<void> {
    for (const event of evidence.pullDomainEvents()) {
      await eventBus.publish(event);
    }
  }

  private requireEventBus(): EventBusContract {
    if (this.eventBus === undefined) {
      throw new EvidenceEventPublisherUnavailableError();
    }

    return this.eventBus;
  }
}
