import type { AdapterMetadata } from './adapter-metadata';
import type { AdapterRequest } from './adapter-request';
import type { AdapterResponse } from './adapter-response';

export interface Adapter {
  readonly metadata: AdapterMetadata;
  execute(request: AdapterRequest): Promise<AdapterResponse>;
}
