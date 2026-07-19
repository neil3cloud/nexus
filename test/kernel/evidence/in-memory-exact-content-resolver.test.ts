import { describe, expect, it } from 'vitest';

import {
  DuplicateExactContentResolverBindingException,
  MissingExactContentResolverBindingException,
} from '../../../src/kernel/evidence/evidence.errors';
import { InMemoryExactContentResolver } from '../../../src/kernel/evidence/in-memory-exact-content-resolver';
import type { RepresentedContentReferenceInput } from '../../../src/kernel/evidence/exact-content-reference';

describe('InMemoryExactContentResolver', () => {
  it('performs exact six-field lookup only and rejects duplicate bindings', async () => {
    const resolver = new InMemoryExactContentResolver();
    const reference = representedContentReference();

    resolver.register(reference, new Uint8Array([1, 2, 3]));

    await expect(resolver.resolve(reference)).resolves.toMatchObject({
      echoedReference: reference,
    });
    await expect(
      resolver.resolve({
        ...reference,
        contentRevision: 'near-miss-revision',
      }),
    ).rejects.toThrow(MissingExactContentResolverBindingException);
    expect(() => resolver.register(reference, new Uint8Array([1, 2, 3]))).toThrow(
      DuplicateExactContentResolverBindingException,
    );
  });

  it('uses defensive copies for registration input and resolution output', async () => {
    const resolver = new InMemoryExactContentResolver();
    const octets = new Uint8Array([1, 2, 3]);

    resolver.register(representedContentReference(), octets);
    octets[0] = 9;

    const firstResolution = await resolver.resolve(representedContentReference());
    firstResolution.sourceOctets[1] = 8;
    const secondResolution = await resolver.resolve(representedContentReference());

    expect([...firstResolution.sourceOctets]).toEqual([1, 8, 3]);
    expect([...secondResolution.sourceOctets]).toEqual([1, 2, 3]);
  });

  it('fails closed deterministically for missing bindings', async () => {
    const resolver = new InMemoryExactContentResolver();

    await expect(resolver.resolve(representedContentReference())).rejects.toThrow(
      MissingExactContentResolverBindingException,
    );
  });
});

function representedContentReference(): RepresentedContentReferenceInput {
  return {
    contentOwner: 'repo',
    contentType: 'file',
    contentId: 'README.md',
    contentRevision: 'rev-1',
    evidenceTypeIdentity: 'ExactOctetStream',
    evidenceTypeVersion: '1',
  };
}
