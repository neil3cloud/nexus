import type {
  RatificationAttributionValidationSnapshot,
  ValidateRatificationAttributionCommand,
} from './ratification-attribution.types';

export interface RatificationAttributionValidationServiceContract {
  validateRepositoryPolicyRatificationAttribution(
    command: ValidateRatificationAttributionCommand,
  ): Promise<RatificationAttributionValidationSnapshot>;
}

