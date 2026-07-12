import { Knowledge } from './knowledge.aggregate';
import { DuplicateKnowledgeError } from './knowledge.errors';
import { KnowledgeId } from './knowledge-id';
import type { KnowledgeSnapshot } from './knowledge.types';

export interface IKnowledgeRepository {
  create(knowledge: Knowledge): Promise<void>;
  save(knowledge: Knowledge): Promise<void>;
  getById(knowledgeId: KnowledgeId | string): Promise<Knowledge | undefined>;
  exists(knowledgeId: KnowledgeId | string): Promise<boolean>;
  enumerate(): Promise<readonly Knowledge[]>;
}

export class InMemoryKnowledgeRepository implements IKnowledgeRepository {
  private readonly knowledgeById = new Map<string, KnowledgeSnapshot>();
  private operationQueue: Promise<unknown> = Promise.resolve();

  public async create(knowledge: Knowledge): Promise<void> {
    await this.runExclusive(() => {
      const knowledgeId = knowledge.id.toString();

      if (this.knowledgeById.has(knowledgeId)) {
        throw new DuplicateKnowledgeError(knowledgeId);
      }

      this.knowledgeById.set(knowledgeId, knowledge.toSnapshot());
    });
  }

  public async save(knowledge: Knowledge): Promise<void> {
    await this.runExclusive(() => {
      this.knowledgeById.set(knowledge.id.toString(), knowledge.toSnapshot());
    });
  }

  public async getById(knowledgeId: KnowledgeId | string): Promise<Knowledge | undefined> {
    return this.runExclusive(() => {
      const snapshot = this.knowledgeById.get(normalizeKnowledgeId(knowledgeId).toString());

      if (snapshot === undefined) {
        return undefined;
      }

      return Knowledge.fromSnapshot(snapshot);
    });
  }

  public async exists(knowledgeId: KnowledgeId | string): Promise<boolean> {
    return this.runExclusive(() => this.knowledgeById.has(normalizeKnowledgeId(knowledgeId).toString()));
  }

  public async enumerate(): Promise<readonly Knowledge[]> {
    return this.runExclusive(() =>
      Object.freeze(
        [...this.knowledgeById.values()]
          .map((snapshot) => Knowledge.fromSnapshot(snapshot))
          .sort((left, right) => left.id.toString().localeCompare(right.id.toString())),
      ),
    );
  }

  private async runExclusive<T>(operation: () => T): Promise<T> {
    const run = this.operationQueue.then(operation, operation);
    this.operationQueue = run.then(
      () => undefined,
      () => undefined,
    );

    return run;
  }
}

function normalizeKnowledgeId(knowledgeId: KnowledgeId | string): KnowledgeId {
  return typeof knowledgeId === 'string' ? KnowledgeId.fromString(knowledgeId) : knowledgeId;
}
