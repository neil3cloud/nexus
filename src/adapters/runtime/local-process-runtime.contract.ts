import type { ProcessRequest, ProcessRequestInput } from './process-request';
import type { ProcessResult } from './process-result';

export interface LocalProcessRuntimeContract {
  execute(input: ProcessRequest | ProcessRequestInput): Promise<ProcessResult>;
}
