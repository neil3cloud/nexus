import {
  DuplicateExactContentResolverBindingException,
  MissingExactContentResolverBindingException,
} from './evidence.errors';
import type { ExactContentResolver, ResolvedSourceRepresentation } from './exact-content-resolver';
import { RepresentedContentReference } from './exact-content-reference';
import type { RepresentedContentReferenceInput } from './exact-content-reference';

export class InMemoryExactContentResolver implements ExactContentResolver {
  private readonly bindings = new Map<string, ResolvedSourceRepresentation>();

  public register(reference: RepresentedContentReferenceInput, octets: Uint8Array): void {
    const representedContentReference = RepresentedContentReference.create(reference);
    const bindingKey = representedContentReference.key();

    if (this.bindings.has(bindingKey)) {
      throw new DuplicateExactContentResolverBindingException();
    }

    this.bindings.set(bindingKey, {
      sourceOctets: new Uint8Array(octets),
      echoedReference: representedContentReference.toSnapshot(),
    });
  }

  public async resolve(
    requestedReference: RepresentedContentReferenceInput,
  ): Promise<ResolvedSourceRepresentation> {
    const representedContentReference = RepresentedContentReference.create(requestedReference);
    const binding = this.bindings.get(representedContentReference.key());

    if (binding === undefined) {
      throw new MissingExactContentResolverBindingException();
    }

    return {
      sourceOctets: new Uint8Array(binding.sourceOctets),
      echoedReference: { ...binding.echoedReference },
    };
  }
}
