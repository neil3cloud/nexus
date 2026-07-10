export interface Mission {
  readonly id: string;
  readonly request: string;
  readonly objective: string;
  readonly acceptanceCriteria: readonly string[];
  readonly constraints: readonly string[];
}

export interface MissionService {
  create(request: string): Promise<Mission>;
}
