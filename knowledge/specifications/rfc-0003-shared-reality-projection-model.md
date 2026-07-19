# RFC-0003 — Shared Reality Projection Model

**Status:** Final
**Version:** 1.1
**Authority:** Normative
**Normative Language:** RFC 2119

---

# Amendment History

- v1.0 — Original specification.
- v1.1 — Adds the Reproducible Context Package Contract (Sprint Owner Ratification `NEXUS-RAT-2026-07-19-001`). Formalizes this specification's existing narrative Context Package definition (v1.0, unmodified in substance) into an exact structural contract: a fixed nine-field Semantic Payload, a required closed `PackageScope` tagged union (`MissionScoped` | `RepositoryScoped`), a fingerprinted `profilePayload` mechanism, the NCCS-1 canonical serialization protocol, content-addressed Context Package identity, the Durable Source Reference, a generic Context Package Profile contract, and a pinned-only, content-addressed Context Package Verification Result with no sequence-number or "most recent" selection authority. This amendment introduces no Corpus, Handoff, Adapter Request, or Checkpoint vocabulary and contains no normative dependency on RFC-0004, RFC-0008, or RFC-0013; every Context Package satisfying only this specification's original v1.0 narrative contract remains fully valid wherever a consumer does not explicitly require the v1.1 structural contract. No other section of this specification is modified.

---

# Purpose

This specification defines the Shared Reality domain of the Nexus Kernel.

Shared Reality is the deterministic engineering understanding computed from authoritative Evidence within the scope of an active Mission.

Shared Reality SHALL NOT become a persistent source of engineering truth.

Instead, it is a computed projection that enables all engineering participants to reason from the same engineering understanding.

This specification owns the normative definitions for:

- Shared Reality
- Context Assembly
- Projection
- Projection Version
- Projection Scope
- Projection Freshness
- Context Package (including the v1.1 Reproducible Context Package Contract, `PackageScope`, Context Package Verification Result, Durable Source Reference, Context Package Profile, and `ContextPackageReference`)

No other specification may redefine these concepts.

---

# Relationship to the Kernel Canon

This specification implements:

- Canon 1 — Shared Reality First
- Canon 2 — Evidence Before Generation
- Canon 9 — Deterministic Engineering
- Canon 10 — Explainability

Where conflicts exist, the Kernel Canon SHALL prevail.

---

# Dependencies

This specification consumes:

- RFC-0001 Mission Model
- RFC-0002 Evidence Model

This specification owns:

- Shared Reality
- Projection
- Context Assembly

---

# Design Goals

Shared Reality SHALL ensure that every engineering participant reasons from an identical engineering understanding.

Shared Reality SHALL be:

- deterministic
- explainable
- reproducible
- mission scoped
- evidence derived
- disposable

---

# Domain Ownership

RFC-0003 exclusively owns:

- Shared Reality
- Projection
- Projection Version
- Projection Scope
- Context Assembly
- Context Package

Other specifications MAY consume Shared Reality.

Other specifications SHALL NOT redefine Shared Reality semantics.

---

# Shared Reality

Shared Reality is the computed engineering understanding of a Mission.

Shared Reality SHALL:

- originate exclusively from Evidence
- remain mission scoped
- remain deterministic
- remain explainable
- remain reproducible

Shared Reality SHALL NOT become authoritative engineering truth.

---

# Projection

A Projection is the materialized representation of Shared Reality.

A Projection SHALL:

- be generated from Evidence
- preserve deterministic behavior
- identify the Evidence used
- preserve reproducibility

Multiple Projections MAY exist.

Equivalent inputs SHALL produce equivalent Projections.

---

# Projection Scope

Every Projection SHALL declare its scope.

Scope SHALL include:

- Mission
- Repository
- Branch
- Workspace
- Repository Policies
- Applicable Architecture
- Active Evidence Set

No Projection SHALL extend beyond its declared scope.

---

# Projection Version

Every Projection SHALL possess a version identifier.

A Projection version SHALL change whenever its Evidence set changes.

Projection versions SHALL remain reproducible.

---

# Context Assembly

Context Assembly is the deterministic process that computes Shared Reality.

Context Assembly SHALL:

- discover applicable Evidence
- resolve Evidence relationships
- apply Kernel policies
- compute Projection
- preserve explainability

Context Assembly SHALL NOT introduce unsupported assumptions.

---

# Context Package

A Context Package is the engineering representation delivered to execution providers.

A Context Package SHALL contain only the engineering information required for execution.

Typical contents include:

- Mission
- Applicable Architecture
- Repository Policies
- Relevant Source Code
- Active Findings
- Supporting Evidence
- Task Context

Implementations MAY optimize package size without changing semantics.

## Reproducible Context Package Contract (v1.1)

A consuming contract MAY require a Context Package to satisfy the following exact structural contract in addition to the narrative contract above. Where a consumer does not explicitly require this contract, a Context Package satisfying only the narrative contract remains fully valid; no existing package is reinterpreted, rewritten, or retroactively assigned an identity by this amendment.

A Context Package satisfying this contract is represented in three distinct byte domains, which SHALL NOT be conflated:

1. **Semantic Payload** — the immutable, fingerprinted content. Two independent constructions from identical governed inputs SHALL produce byte-identical Semantic Payload bytes.
2. **Envelope** — the stored/transmitted wrapper carrying the Semantic Payload plus its identity, fingerprint, and non-semantic construction/attribution metadata.
3. **Context Package Verification Result** — a separate, explicitly pinned, content-addressed record produced each time a package is verified. A Verification Result is never merged into or used to mutate the package it evaluates.

### Semantic Payload

The Semantic Payload SHALL be an exact fixed-schema record of exactly nine fields, in this fixed order, all of which SHALL be present unconditionally:

1. `contextPackageVersion` — string, fixed `"1"`.
2. `contextPackageProfileId` — string, identifying the governing Context Package Profile.
3. `contextPackageProfileVersion` — string.
4. `canonicalSerializationProtocolId` — string, fixed `"nccs"`.
5. `canonicalSerializationProtocolVersion` — string, fixed `"1"`; any other value is unsupported and SHALL fail closed.
6. `sourceManifest` — an ordered, non-empty list of Durable Source Reference (below).
7. `packageScope` — a required closed `PackageScope` tagged union (below); never omitted.
8. `profilePayload` — an ordered, uniqueness-declared list of Profile Payload Entry (below); MAY be empty.
9. `packageApplicabilityState` — string, drawn from the closed set defined by the governing Context Package Profile.

No field of this nine-field schema is ever omitted. Where content legitimately varies by state or scope, that variability SHALL live inside the contents of the list-typed `sourceManifest` and `profilePayload` fields, which MAY vary in length by design — never in whether a field itself is present. `producingComponentAttribution` (Envelope, below) is explicitly excluded from the Semantic Payload: it identifies who constructed a package, not the semantic content of governed sources, so two different components constructing a package from an identical governed source set SHALL produce an identical Semantic Payload and identical fingerprint.

#### `PackageScope`

Every Semantic Payload SHALL carry exactly one `PackageScope` value, always present, of exactly one of these two closed variants:

- **`MissionScoped`** — a two-field record, fixed order: `scopeKind` = `"MissionScoped"`; `missionId` (required, non-empty).
- **`RepositoryScoped`** — a one-field record, fixed order: `scopeKind` = `"RepositoryScoped"`.

A package that applies to no Mission SHALL use `RepositoryScoped`, never an absent `missionId`. The outer Semantic Payload's field count (nine) SHALL NOT change regardless of which variant is chosen; `packageScope` is always exactly one field whose value is a nested record. A Context Package Profile MAY further restrict which `PackageScope` variant(s) it permits; such a restriction is a profile-level constraint only and does not alter this specification's own two-variant definition.

#### Profile Payload Entry

Each `profilePayload` entry SHALL be a fixed five-field record, fixed order:

1. `entryKey` — string, the profile-defined canonical key name for this exported value.
2. `entryValueKind` — string, closed enumeration: `String`, `Identity`, `Version`, `Fingerprint`, `Status`, `Boolean`, `Digest`.
3. `entryValue` — string, the canonical string encoding of the value per `entryValueKind`'s own canonical format.
4. `embeddedOrReferenceOnly` — string, closed enumeration: `Embedded`, `ReferenceOnly`.
5. `sourceRoleCorrelation` — string, the `sourceRole` (Durable Source Reference field 9, below) this entry scalarizes, or the literal string `"none"` when the entry has no corresponding Durable Source Reference; always present, never omitted.

`entryKey` values SHALL be unique after Unicode NFC normalization; two keys that normalize to the same string, even if their raw pre-normalization bytes differ, are a duplicate and SHALL fail closed. Entries SHALL appear in strictly ascending order by the byte-wise value of each entry's canonically encoded `entryKey` string; the governing Context Package Profile is responsible for presenting entries pre-sorted, and a package presenting them out of order SHALL fail closed.

### Envelope

The Envelope is an exact fixed-field schema, not fingerprinted as a whole: `contextPackageId` (derived from the fingerprint, not an input); `contextPackageVersion` (redundant copy of Semantic Payload field 1); `packageFingerprintAlgorithm` (fixed `"sha256"`); `packageFingerprint` (the fingerprint output); `semanticPayloadCanonicalBytes` (the fingerprint input); `producingComponentAttribution` (required, explicitly excluded from semantic identity); `constructionTimestamp` (required, explicitly excluded from semantic identity); `diagnostics` (required, MAY be empty, canonically sorted per the NCCS-1 protocol, below).

### Context Package Verification Result

A Context Package Verification Result is identified solely by content-addressing over an exact Verification Payload. There is no sequence number, no "most recent" concept, and no deterministic-current-result fallback rule of any kind. A consuming contract SHALL carry an exact `pinnedVerificationResultId` and resolve precisely that record; a consuming contract with no pinned identity has no defined way to determine verification state and SHALL fail closed.

The Verification Payload SHALL be an exact fixed eight-field record, fixed order: `verifiedContextPackageId`; `verifiedPackageFingerprint` (64 lowercase hex); `verifierIdentity`; `verificationTimestamp` (informational only; never used for ordering or selection); `perSourceResolutionResults` (an ordered list of Per-Source Resolution Result, one per Durable Source Reference evaluated, in exactly the same order as the corresponding package's `sourceManifest`); `verificationOutcome` (enumeration: `Verified`, `Unverified`, `Failed`); `resolutionOutcome` (enumeration: `AllRequiredSourcesResolved`, `RequiredSourceUnresolved`); `diagnostics` (an order-insensitive collection of string, canonically sorted before encoding, MAY be empty).

`verificationResultId = "vr-sha256-" + lowercase-hex(SHA-256(NCCS-1 canonical bytes of the eight-field Verification Payload))`. The id is excluded from its own input by construction. Two verification attempts over the identical package, differing only in timestamp and outcome, SHALL and DO produce different `verificationResultId` values — there is no shared counter, no sequence, and nothing to keep "in order"; a consumer must be told exactly which one applies via an explicit pin. A resolution failure discovered later produces a new Verification Payload with its own new `verificationResultId`; it SHALL NOT alter any prior Verification Result or the package itself.

#### Per-Source Resolution Result

Each `perSourceResolutionResults` entry SHALL be a fixed two-field record, fixed order: `durableSourceReferenceFingerprint` (string, 64 lowercase hex — SHA-256 over the NCCS-1 canonical bytes of the exact Durable Source Reference this result evaluates) and `resolutionOutcome` (enumeration: `Resolved`, `Unresolved`). `perSourceResolutionResults` SHALL contain exactly one result per `sourceManifest` entry, in exactly the same order as `sourceManifest`. A duplicate `durableSourceReferenceFingerprint`, a `sourceManifest` entry with no corresponding result, a result not corresponding to any `sourceManifest` entry, a result out of `sourceManifest` order, or a `durableSourceReferenceFingerprint` not equal to the value independently recomputed from the Durable Source Reference it is positioned against, SHALL each fail closed; a Verification Result failing any of these conditions is not valid and SHALL be rejected before its outcome fields are consulted.

### Durable Source Reference

A Durable Source Reference SHALL be an exact fixed ten-field record, fixed order: `sourceOwningDomain`; `governedArtifactType`; `artifactIdentity` (non-empty); `artifactVersionOrRevision`; `digestAlgorithm`; `digest` (when present, exactly 64 lowercase hex characters); `resolverContractId`; `resolverContractVersion`; `sourceRole`; `requiredOrOptionalClassification`. A `Required`-classified source SHALL remain resolvable for the complete retention lifetime of every governed artifact that references the package. Loss of resolvability produces a new Verification Result (`resolutionOutcome: RequiredSourceUnresolved`); it never mutates the historical package.

### Context Package Profile

A Context Package Profile is a closed, versioned specification, identified by `contextPackageProfileId` and `contextPackageProfileVersion`. This specification defines only the generic contract; a profile SHALL specify: required/optional `sourceRole` values and their classification; permitted embedded vs. reference-only content; the closed set of legal `packageApplicabilityState` values and, for each, an exact presence-and-cardinality rule per `sourceRole` (explicitly including "forbidden" = 0); the closed set of legal `entryKey` values for `profilePayload` per applicability state, with an exact canonical representation of absence (an entry simply not present in the list — never a null or placeholder entry); a deterministic total ordering rule for `sourceManifest` and for `profilePayload`; completeness conditions; validation rules; and, where applicable, which `PackageScope` variant(s) the profile permits.

No `packageApplicabilityState` value defined by any profile may itself confer downstream governance authority or current-applicability status; such authority is always external to the Context Package. This specification defines no concrete profile, no concrete `sourceRole` or `entryKey` values, and no concrete sort key.

### `ContextPackageReference`

A `ContextPackageReference` is an exact fixed nine-field record, fixed order: `contextPackageId`; `contextPackageVersion`; `contextPackageProfileId`; `contextPackageProfileVersion`; `canonicalSerializationProtocolId`; `canonicalSerializationProtocolVersion`; `packageFingerprintAlgorithm`; `packageFingerprint`; `pinnedVerificationResultId` (required, always present — not optional; there is no unpinned fallback path). This type is owned exclusively by this specification. Any specification needing to carry a reference to a Context Package satisfying the v1.1 contract SHALL reuse this exact type by citation, never redefine or add fields to it.

### Canonical Serialization Protocol (NCCS-1)

Protocol identity `"nccs"`, version `"1"`. Any other `canonicalSerializationProtocolVersion` value is unsupported and SHALL fail closed. NCCS-1 is a fully normative, exact byte-level encoding: two independent, conformant encoders given identical governed inputs SHALL produce byte-identical canonical bytes. This subsection is the complete and exclusive definition of that encoding; no other document may add, omit, or reinterpret any framing rule below.

1. **Encoding.** UTF-8, no byte order mark. Input bytes that are not valid UTF-8 SHALL fail closed before any further processing.
2. **Unicode normalization.** Every string value is normalized to Unicode NFC before encoding.
3. **Line-ending normalization.** `CRLF` and bare `CR` normalize to `LF` before encoding.
4. **Primitives — exact byte framing:**
   - **String** — `<decimal UTF-8 byte length>:<bytes>` (for example, the 3-byte UTF-8 string `"foo"` encodes as `3:foo`).
   - **Integer** — `i<decimal digits>e` (for example, the integer `9` encodes as `i9e`).
   - **Boolean** — Integer framing (`i1e` for `true`, `i0e` for `false`).
   - **Enumeration** — String framing of the exact canonical identifier.
   - **Digest / identity / version** — String framing of the exact declared value, subject to format validation where the field's owning schema declares one: identity SHALL be non-empty; digest, when present, SHALL be exactly 64 lowercase hex characters.
5. **Ordered collections.** `l<concatenated element encodings in declared order>e`. `sourceManifest` and `profilePayload` are both ordered collections; their element order is semantic and is the responsibility of the governing Context Package Profile to make deterministic (see Context Package Profile, above) — NCCS-1 itself does not auto-sort an ordered collection.
6. **Order-insensitive collections.** `d<(key,value) pairs>e`, sorted strictly ascending by encoded-key bytes. `diagnostics` (Envelope field 8 and Verification Payload field 8) is declared an order-insensitive collection: its identity SHALL NOT depend on the order diagnostic strings were produced or supplied in. Before encoding, a `diagnostics` collection SHALL be sorted strictly ascending by the byte-wise value of each string's NCCS-1-encoded form, then encoded as an ordered collection (rule 5) of the sorted strings. A `diagnostics` collection presented pre-encoded but not in this canonical sorted order SHALL fail closed.
7. **Duplicates.** Fail closed on any uniqueness-declared collection containing two entries with equal encoded (or, per Profile Payload Entry's `entryKey` rule, NFC-normalized) keys.
8. **Records.** `r<field count as Integer><(fieldName, value) pairs in fixed declared schema order>e`. A field absent from a required schema, or present but not declared by that schema, SHALL fail closed.
9. **Fingerprint computation.** Encode the nine-field Semantic Payload record per rule 8 (field count `i9e`, fixed order); `packageFingerprint = lowercase-hex(SHA-256(those bytes))`. Recomputing this and comparing against a package's stored `packageFingerprint` is how fingerprint mismatch is detected. `contextPackageId = "ctxpkg-sha256-" + packageFingerprint`. The Verification Payload's `verificationResultId = "vr-sha256-" + lowercase-hex(SHA-256(NCCS-1 canonical bytes of the eight-field Verification Payload, encoded per rule 8))`; the id is excluded from its own input by construction.
10. **Durable Source References.** `sourceManifest` is an ordered list (rule 5) of Durable Source Reference records (rule 8, ten fields, fixed order, above). `durableSourceReferenceFingerprint = lowercase-hex(SHA-256(NCCS-1 canonical bytes of the exact ten-field Durable Source Reference record)))`.
11. **SHA-256 / hex.** FIPS 180-4 SHA-256; output exactly 64 lowercase hex characters.
12. **Fail-closed conditions.** Invalid UTF-8; unsupported protocol version; unsupported type; unknown field; missing required field; duplicate (raw-encoded or NFC-normalized) where uniqueness is required; ambiguous ordering; a `diagnostics` collection not in canonical sorted order (rule 6); malformed identity (empty); malformed digest (not exactly 64 lowercase hex); general serialization failure; fingerprint mismatch on verification; a consuming contract with no pinned `verificationResultId` and no other defined selection rule; a `packageScope` of `RepositoryScoped` where a governing Context Package Profile forbids it; and any `perSourceResolutionResults` condition enumerated above (duplicate, missing, extra, reordered, or mismatched `durableSourceReferenceFingerprint`).

### Conformance Vectors (normative)

The following vectors are real SHA-256 output from a conformant NCCS-1 reference encoder. Every positive vector's full non-truncated hex is included; a conforming implementation SHALL reproduce every value below exactly from the stated inputs, and SHALL reject every negative vector with the stated failure. These vectors use a generic, illustrative `GenericArtifactContextProfile` — not `CorpusReviewContextProfile` or any other RFC-0013 concept. The generic vectors use no RFC-0013, RFC-0006, or RFC-0011 fields, values, source roles, profile vocabulary, or normative dependencies. RFC-0013's own `CorpusReviewContextProfile` conformance vectors are governed separately, in RFC-0013's own Reproducible Context Integration section.

**Common Durable Source Reference** (used, with the one exact field difference stated in Vector 2, by Vectors 1 and 2). All ten fields, exact declared values, fixed order:

1. `sourceOwningDomain` = `"rfc-0002"`
2. `governedArtifactType` = `"Evidence"`
3. `artifactIdentity` = `"evidence-generic-example-2026-07-19-002"`
4. `artifactVersionOrRevision` = `"1"`
5. `digestAlgorithm` = `"sha256"`
6. `digest` = `"2cb39bd01bbc426029725239ae256bfe6358599ada602c73f5d7fd2040d245a6"`
7. `resolverContractId` = `"generic-artifact-resolver"`
8. `resolverContractVersion` = `"1"`
9. `sourceRole` = `"PrimaryEvidence"`
10. `requiredOrOptionalClassification` = `"Required"`

Its `durableSourceReferenceFingerprint`, independently recomputed per rule 10 by encoding these exact ten fields as a Record (rule 8) and taking SHA-256: `ea2bd9cae18e74a093800944bd822f8b229bca30f41b9b870d7b7314b82d8f68`.

#### Positive Vector 1 — generic `MissionScoped` Semantic Payload

Profile: `contextPackageProfileId = "GenericArtifactContextProfile"`, `contextPackageProfileVersion = "1"`. `sourceManifest`: exactly the Common Durable Source Reference above, all ten fields unchanged. `packageScope`: `MissionScoped` (`missionId = "mission-2026-milestone-12"`). `profilePayload`: exactly 2 entries, all five fields each, fixed order:

1. `entryKey` = `"artifactPurposeKey"`, `entryValueKind` = `"String"`, `entryValue` = `"generic-mission-scoped-example"`, `embeddedOrReferenceOnly` = `"Embedded"`, `sourceRoleCorrelation` = `"none"`.
2. `entryKey` = `"primaryEvidenceFingerprint"`, `entryValueKind` = `"Fingerprint"`, `entryValue` = `"ea2bd9cae18e74a093800944bd822f8b229bca30f41b9b870d7b7314b82d8f68"` (equal to the Common Durable Source Reference fingerprint above), `embeddedOrReferenceOnly` = `"Embedded"`, `sourceRoleCorrelation` = `"PrimaryEvidence"`.

`packageApplicabilityState = "Active"`.

9 top-level fields, 1191 bytes.

`hex: 7269396532313a636f6e746578745061636b61676556657273696f6e313a3132333a636f6e746578745061636b61676550726f66696c65496432393a47656e657269634172746966616374436f6e7465787450726f66696c6532383a636f6e746578745061636b61676550726f66696c6556657273696f6e313a3133323a63616e6f6e6963616c53657269616c697a6174696f6e50726f746f636f6c4964343a6e63637333373a63616e6f6e6963616c53657269616c697a6174696f6e50726f746f636f6c56657273696f6e313a3131343a736f757263654d616e69666573746c726931306531383a736f757263654f776e696e67446f6d61696e383a7266632d3030303232303a676f7665726e6564417274696661637454797065383a45766964656e636531363a61727469666163744964656e7469747933393a65766964656e63652d67656e657269632d6578616d706c652d323032362d30372d31392d30303232353a617274696661637456657273696f6e4f725265766973696f6e313a3131353a646967657374416c676f726974686d363a736861323536363a64696765737436343a3263623339626430316262633432363032393732353233396165323536626665363335383539396164613630326337336635643766643230343064323435613631383a7265736f6c766572436f6e7472616374496432353a67656e657269632d61727469666163742d7265736f6c76657232333a7265736f6c766572436f6e747261637456657273696f6e313a3131303a736f75726365526f6c6531353a5072696d61727945766964656e636533323a72657175697265644f724f7074696f6e616c436c617373696669636174696f6e383a5265717569726564656531323a7061636b61676553636f706572693265393a73636f70654b696e6431333a4d697373696f6e53636f706564393a6d697373696f6e496432353a6d697373696f6e2d323032362d6d696c6573746f6e652d31326531343a70726f66696c655061796c6f61646c72693565383a656e7472794b657931383a6172746966616374507572706f73654b657931343a656e74727956616c75654b696e64363a537472696e6731303a656e74727956616c756533303a67656e657269632d6d697373696f6e2d73636f7065642d6578616d706c6532333a656d6265646465644f725265666572656e63654f6e6c79383a456d62656464656432313a736f75726365526f6c65436f7272656c6174696f6e343a6e6f6e656572693565383a656e7472794b657932363a7072696d61727945766964656e636546696e6765727072696e7431343a656e74727956616c75654b696e6431313a46696e6765727072696e7431303a656e74727956616c756536343a6561326264396361653138653734613039333830303934346264383232663862323239626361333066343162396238373064376237333134623832643866363832333a656d6265646465644f725265666572656e63654f6e6c79383a456d62656464656432313a736f75726365526f6c65436f7272656c6174696f6e31353a5072696d61727945766964656e6365656532353a7061636b6167654170706c69636162696c6974795374617465363a41637469766565`

`packageFingerprint: d0404d54fd259c2b1498ee5f8bc1c4c7b022c181fa2f4334bcd795cc8dd8052c`
`contextPackageId: ctxpkg-sha256-d0404d54fd259c2b1498ee5f8bc1c4c7b022c181fa2f4334bcd795cc8dd8052c`

#### Positive Vector 2 — semantic change (`artifactVersionOrRevision` `"1"` → `"2"`), all else identical to Vector 1

`sourceManifest`'s sole Durable Source Reference field 4, `artifactVersionOrRevision`, changes from `"1"` to `"2"`; all other nine Durable Source Reference fields (`sourceOwningDomain` through `requiredOrOptionalClassification`) are byte-identical to the Common Durable Source Reference above. This revised Durable Source Reference's `durableSourceReferenceFingerprint`, independently recomputed per rule 10: `e6c5b6eb787097099b618f7d68a8f0b96c02750aa32d24f99c040851e6f67008`. `packageScope` is unchanged (`MissionScoped`, `missionId = "mission-2026-milestone-12"`). `profilePayload` is unchanged in structure from Vector 1 — both entries, all five fields each — except `primaryEvidenceFingerprint`'s `entryValue`, which is recomputed to this vector's own revised Durable Source Reference fingerprint (`e6c5b6eb...67008`) rather than Vector 1's (`ea2bd9cae1...d8f68`): this vector demonstrates the Semantic Payload's deterministic sensitivity to a single `sourceManifest` field, with `profilePayload`'s `primaryEvidenceFingerprint` correctly tracking that change, so the resulting package is itself profile-valid. `packageApplicabilityState = "Active"`, unchanged.

9 top-level fields, 1191 bytes (identical length to Vector 1 — both version strings are 1 byte, and both fingerprint values are 64 hex characters).

`hex: 7269396532313a636f6e746578745061636b61676556657273696f6e313a3132333a636f6e746578745061636b61676550726f66696c65496432393a47656e657269634172746966616374436f6e7465787450726f66696c6532383a636f6e746578745061636b61676550726f66696c6556657273696f6e313a3133323a63616e6f6e6963616c53657269616c697a6174696f6e50726f746f636f6c4964343a6e63637333373a63616e6f6e6963616c53657269616c697a6174696f6e50726f746f636f6c56657273696f6e313a3131343a736f757263654d616e69666573746c726931306531383a736f757263654f776e696e67446f6d61696e383a7266632d3030303232303a676f7665726e6564417274696661637454797065383a45766964656e636531363a61727469666163744964656e7469747933393a65766964656e63652d67656e657269632d6578616d706c652d323032362d30372d31392d30303232353a617274696661637456657273696f6e4f725265766973696f6e313a3231353a646967657374416c676f726974686d363a736861323536363a64696765737436343a3263623339626430316262633432363032393732353233396165323536626665363335383539396164613630326337336635643766643230343064323435613631383a7265736f6c766572436f6e7472616374496432353a67656e657269632d61727469666163742d7265736f6c76657232333a7265736f6c766572436f6e747261637456657273696f6e313a3131303a736f75726365526f6c6531353a5072696d61727945766964656e636533323a72657175697265644f724f7074696f6e616c436c617373696669636174696f6e383a5265717569726564656531323a7061636b61676553636f706572693265393a73636f70654b696e6431333a4d697373696f6e53636f706564393a6d697373696f6e496432353a6d697373696f6e2d323032362d6d696c6573746f6e652d31326531343a70726f66696c655061796c6f61646c72693565383a656e7472794b657931383a6172746966616374507572706f73654b657931343a656e74727956616c75654b696e64363a537472696e6731303a656e74727956616c756533303a67656e657269632d6d697373696f6e2d73636f7065642d6578616d706c6532333a656d6265646465644f725265666572656e63654f6e6c79383a456d62656464656432313a736f75726365526f6c65436f7272656c6174696f6e343a6e6f6e656572693565383a656e7472794b657932363a7072696d61727945766964656e636546696e6765727072696e7431343a656e74727956616c75654b696e6431313a46696e6765727072696e7431303a656e74727956616c756536343a6536633562366562373837303937303939623631386637643638613866306239366330323735306161333264323466393963303430383531653666363730303832333a656d6265646465644f725265666572656e63654f6e6c79383a456d62656464656432313a736f75726365526f6c65436f7272656c6174696f6e31353a5072696d61727945766964656e6365656532353a7061636b6167654170706c69636162696c6974795374617465363a41637469766565`

`packageFingerprint: 4061e1ccb59abc8a6358c6d02e69e494a10be0426624f14d5941ec6be6544896`
`contextPackageId: ctxpkg-sha256-4061e1ccb59abc8a6358c6d02e69e494a10be0426624f14d5941ec6be6544896`

Differs from Vector 1 in both `packageFingerprint` and `contextPackageId` — a new identity, not a mutation — confirming deterministic sensitivity to a single Durable Source Reference field, propagated correctly into the dependent `profilePayload` fingerprint entry.

#### Positive Vector 3 — generic, non-Corpus `RepositoryScoped` Semantic Payload

Demonstrates the generic `RepositoryScoped` `PackageScope` variant independently of any consuming profile (RFC-0003 itself forbids neither variant; a specific profile, such as RFC-0013's `CorpusReviewContextProfile`, MAY forbid one for itself). Profile: `contextPackageProfileId = "GenericArtifactContextProfile"`, `contextPackageProfileVersion = "1"`.

`sourceManifest`: one Durable Source Reference. Exactly two fields differ from the Common Durable Source Reference above: field 3, `artifactIdentity`, is `"evidence-generic-example-2026-07-19-001"` (not `"...-002"`); field 6, `digest`, is `"1803d0b6054abf8b844e994acd730df11e561f7040ce8099ca68218ee5cc167b"` (not `"2cb39bd0...245a6"`) — a different `digestAlgorithm`-consistent SHA-256 value corresponding to the different `artifactIdentity`. All eight other fields (`sourceOwningDomain`, `governedArtifactType`, `artifactVersionOrRevision`, `digestAlgorithm`, `resolverContractId`, `resolverContractVersion`, `sourceRole`, `requiredOrOptionalClassification`) are byte-identical to the Common Durable Source Reference. Its `durableSourceReferenceFingerprint`, independently recomputed per rule 10: `e3cc532f9a8d9f2dfa2b89dcceb05023d13e2ae01dfa227020e7d8ba03b8dc22`.

`packageScope`: `RepositoryScoped` (nested 1-field record — `scopeKind` only; `missionId` correctly omitted, not null or empty string, because the variant itself has exactly one field).

`profilePayload`: exactly 2 entries, all five fields each, fixed order:

1. `entryKey` = `"artifactPurposeKey"`, `entryValueKind` = `"String"`, `entryValue` = `"generic-repository-scoped-example"` (differs from Vector 1's `"generic-mission-scoped-example"`), `embeddedOrReferenceOnly` = `"Embedded"`, `sourceRoleCorrelation` = `"none"`.
2. `entryKey` = `"primaryEvidenceFingerprint"`, `entryValueKind` = `"Fingerprint"`, `entryValue` = `"e3cc532f9a8d9f2dfa2b89dcceb05023d13e2ae01dfa227020e7d8ba03b8dc22"` (equal to this vector's own Durable Source Reference fingerprint above, and differing from Vector 1's `primaryEvidenceFingerprint` value because this vector's Durable Source Reference itself differs), `embeddedOrReferenceOnly` = `"Embedded"`, `sourceRoleCorrelation` = `"PrimaryEvidence"`.

`packageApplicabilityState = "Active"`.

Independently decoded and confirmed: the outer Semantic Payload record has exactly 9 top-level fields regardless of `packageScope` containing only 1 nested field. 9 top-level fields, 1158 bytes.

`hex: 7269396532313a636f6e746578745061636b61676556657273696f6e313a3132333a636f6e746578745061636b61676550726f66696c65496432393a47656e657269634172746966616374436f6e7465787450726f66696c6532383a636f6e746578745061636b61676550726f66696c6556657273696f6e313a3133323a63616e6f6e6963616c53657269616c697a6174696f6e50726f746f636f6c4964343a6e63637333373a63616e6f6e6963616c53657269616c697a6174696f6e50726f746f636f6c56657273696f6e313a3131343a736f757263654d616e69666573746c726931306531383a736f757263654f776e696e67446f6d61696e383a7266632d3030303232303a676f7665726e6564417274696661637454797065383a45766964656e636531363a61727469666163744964656e7469747933393a65766964656e63652d67656e657269632d6578616d706c652d323032362d30372d31392d30303132353a617274696661637456657273696f6e4f725265766973696f6e313a3131353a646967657374416c676f726974686d363a736861323536363a64696765737436343a3138303364306236303534616266386238343465393934616364373330646631316535363166373034306365383039396361363832313865653563633136376231383a7265736f6c766572436f6e7472616374496432353a67656e657269632d61727469666163742d7265736f6c76657232333a7265736f6c766572436f6e747261637456657273696f6e313a3131303a736f75726365526f6c6531353a5072696d61727945766964656e636533323a72657175697265644f724f7074696f6e616c436c617373696669636174696f6e383a5265717569726564656531323a7061636b61676553636f706572693165393a73636f70654b696e6431363a5265706f7369746f727953636f7065646531343a70726f66696c655061796c6f61646c72693565383a656e7472794b657931383a6172746966616374507572706f73654b657931343a656e74727956616c75654b696e64363a537472696e6731303a656e74727956616c756533333a67656e657269632d7265706f7369746f72792d73636f7065642d6578616d706c6532333a656d6265646465644f725265666572656e63654f6e6c79383a456d62656464656432313a736f75726365526f6c65436f7272656c6174696f6e343a6e6f6e656572693565383a656e7472794b657932363a7072696d61727945766964656e636546696e6765727072696e7431343a656e74727956616c75654b696e6431313a46696e6765727072696e7431303a656e74727956616c756536343a6533636335333266396138643966326466613262383964636365623035303233643133653261653031646661323237303230653764386261303362386463323232333a656d6265646465644f725265666572656e63654f6e6c79383a456d62656464656432313a736f75726365526f6c65436f7272656c6174696f6e31353a5072696d61727945766964656e6365656532353a7061636b6167654170706c69636162696c6974795374617465363a41637469766565`

`packageFingerprint: 69b3a0d66c33cd63d8fcf6835913c8d3e6036d338f1d173e1e4aae0602e3304e`
`contextPackageId: ctxpkg-sha256-69b3a0d66c33cd63d8fcf6835913c8d3e6036d338f1d173e1e4aae0602e3304e`

#### Positive Vector 4 — Unicode NFC equivalence

`encString("Café" precomposed, U+00E9)` and `encString("Café" decomposed, U+0065 U+0301, NFC-normalized before encoding per rule 2)` both yield hex `353a436166c3a9` (7 bytes).

#### Positive Vector 5 — line-ending equivalence

`encString(normalizeLineEndings("line1\r\nline2"))` and `encString(normalizeLineEndings("line1\nline2"))` both yield hex `31313a6c696e65310a6c696e6532` (14 bytes) — both normalize to `LF` before encoding (rule 3).

#### Positive Vector 6 — `diagnostics` canonical ordering equivalence

Two diagnostics collections supplied in different original orders — `["resolution-warning: optional source unresolved", "clock-skew-detected"]` and `["clock-skew-detected", "resolution-warning: optional source unresolved"]` — both canonically sort to the same ascending encoded-string-byte order before encoding and both yield hex `6c31393a636c6f636b2d736b65772d646574656374656434363a7265736f6c7574696f6e2d7761726e696e673a206f7074696f6e616c20736f7572636520756e7265736f6c76656465` (73 bytes). MATCH: true.

#### Verification Vector 1

Verifies Positive Vector 1's package. All eight fields, exact declared values: `verifiedContextPackageId` = `"ctxpkg-sha256-d0404d54fd259c2b1498ee5f8bc1c4c7b022c181fa2f4334bcd795cc8dd8052c"`; `verifiedPackageFingerprint` = `"d0404d54fd259c2b1498ee5f8bc1c4c7b022c181fa2f4334bcd795cc8dd8052c"`; `verifierIdentity` = `"rfc-0003-reference-verifier-1"`; `verificationTimestamp` = `"2026-07-19T10:00:00Z"`; `perSourceResolutionResults` = exactly 1 entry (`durableSourceReferenceFingerprint` = `"ea2bd9cae18e74a093800944bd822f8b229bca30f41b9b870d7b7314b82d8f68"`, the Common Durable Source Reference's fingerprint, above; `resolutionOutcome` = `"Resolved"`); `verificationOutcome` = `"Verified"`; `resolutionOutcome` = `"AllRequiredSourcesResolved"`; `diagnostics` = empty list. 8 fields, 573 bytes.

`hex: 7269386532343a7665726966696564436f6e746578745061636b616765496437383a637478706b672d7368613235362d6430343034643534666432353963326231343938656535663862633163346337623032326331383166613266343333346263643739356363386464383035326332363a76657269666965645061636b61676546696e6765727072696e7436343a6430343034643534666432353963326231343938656535663862633163346337623032326331383166613266343333346263643739356363386464383035326331363a76657269666965724964656e7469747932393a7266632d303030332d7265666572656e63652d76657269666965722d3132313a766572696669636174696f6e54696d657374616d7032303a323032362d30372d31395431303a30303a30305a32363a706572536f757263655265736f6c7574696f6e526573756c74736c7269326533333a64757261626c65536f757263655265666572656e636546696e6765727072696e7436343a6561326264396361653138653734613039333830303934346264383232663862323239626361333066343162396238373064376237333134623832643866363831373a7265736f6c7574696f6e4f7574636f6d65383a5265736f6c766564656531393a766572696669636174696f6e4f7574636f6d65383a566572696669656431373a7265736f6c7574696f6e4f7574636f6d6532363a416c6c5265717569726564536f75726365735265736f6c76656431313a646961676e6f73746963736c6565`

`verificationResultId: vr-sha256-0b6addd2b89f896ab58c250749e254419df18c303f89923ec535f589a830592b`

`perSourceResolutionResults` contains exactly 1 entry (the Common Durable Source Reference's fingerprint, above), `resolutionOutcome: Resolved`.

#### Verification Vector 2

Same `verifiedContextPackageId`/`verifiedPackageFingerprint`/`verifierIdentity` as Verification Vector 1. Exactly four fields differ: `verificationTimestamp` = `"2026-07-19T15:00:00Z"` (not `"...T10:00:00Z"`); `perSourceResolutionResults` = exactly 1 entry (`durableSourceReferenceFingerprint` = `"ea2bd9cae18e74a093800944bd822f8b229bca30f41b9b870d7b7314b82d8f68"`, unchanged; `resolutionOutcome` = `"Unresolved"`, not `"Resolved"`); `verificationOutcome` = `"Failed"` (not `"Verified"`); `resolutionOutcome` = `"RequiredSourceUnresolved"` (not `"AllRequiredSourcesResolved"`) — consistent with the sole required source now being reported `Unresolved`. `diagnostics` = empty list, unchanged. 8 fields, 572 bytes.

`hex: 7269386532343a7665726966696564436f6e746578745061636b616765496437383a637478706b672d7368613235362d6430343034643534666432353963326231343938656535663862633163346337623032326331383166613266343333346263643739356363386464383035326332363a76657269666965645061636b61676546696e6765727072696e7436343a6430343034643534666432353963326231343938656535663862633163346337623032326331383166613266343333346263643739356363386464383035326331363a76657269666965724964656e7469747932393a7266632d303030332d7265666572656e63652d76657269666965722d3132313a766572696669636174696f6e54696d657374616d7032303a323032362d30372d31395431353a30303a30305a32363a706572536f757263655265736f6c7574696f6e526573756c74736c7269326533333a64757261626c65536f757263655265666572656e636546696e6765727072696e7436343a6561326264396361653138653734613039333830303934346264383232663862323239626361333066343162396238373064376237333134623832643866363831373a7265736f6c7574696f6e4f7574636f6d6531303a556e7265736f6c766564656531393a766572696669636174696f6e4f7574636f6d65363a4661696c656431373a7265736f6c7574696f6e4f7574636f6d6532343a5265717569726564536f75726365556e7265736f6c76656431313a646961676e6f73746963736c6565`

`verificationResultId: vr-sha256-206c4578df592caafcf888df32663f46effe8f93c8ada6516b0250a740796e64`

Two verification attempts over the identical package produce two different `verificationResultId` values, confirming rule 9's no-sequence, no-"most-recent" guarantee.

#### Negative Vectors

**N1 — invalid UTF-8 byte sequence.** Input: `Buffer.from([0x66,0x6f,0x6f,0xC0,0x80])` (an overlong-encoded NUL, invalid per RFC 3629). Rejection: `FAIL-CLOSED: invalid UTF-8 byte sequence in string field`.

**N2 — malformed identity.** Input: `artifactIdentity = ""`. Rejection: `FAIL-CLOSED: malformed identity (empty)`.

**N3 — malformed digest.** Input: `digest = "abc123"` (6 characters, not 64 hex). Rejection: `FAIL-CLOSED: malformed digest (not exactly 64 lowercase hex characters)`.

**N4 — unsupported protocol version.** Input: `canonicalSerializationProtocolVersion = "2"`. Rejection: `FAIL-CLOSED: unsupported canonicalSerializationProtocolVersion '2' (only "1" supported)`.

**N5 — fingerprint mismatch on verification.** Input: claimed fingerprint `ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff` against Positive Vector 1's actual recomputed fingerprint `d0404d54fd259c2b1498ee5f8bc1c4c7b022c181fa2f4334bcd795cc8dd8052c`. Rejection: `FAIL-CLOSED: fingerprint mismatch, claimed=ffff...ffff recomputed=d0404d54...52c`.

**N6 — unknown field in fixed schema.** Input: the 9 declared Semantic Payload fields plus one additional `extraField`. Rejection: `FAIL-CLOSED[SemanticPayload]: unknown field 'extraField' not in declared schema`.

**N7 — missing required field.** Input: only `contextPackageVersion` supplied, all other 8 required fields absent. Rejection: `FAIL-CLOSED[SemanticPayload]: missing required field 'contextPackageProfileId'` (the first missing field encountered in schema order).

**N8 — duplicate NFC-normalized `profilePayload` key.** Input: two `profilePayload` entries with `entryKey` values `"Café"` (precomposed, U+00E9) and `"Café"` (decomposed, U+0065 U+0301) — visually identical, byte-distinct before normalization. Rejection: `FAIL-CLOSED: duplicate normalized profilePayload entryKey 'Café' (NFC-normalized collision)`.

**N9 — `diagnostics` not canonically sorted.** Input: a `diagnostics` collection presented pre-encoded as `["resolution-warning: optional source unresolved", "clock-skew-detected"]` (original production order) without being re-sorted before encoding. Rejection: `FAIL-CLOSED: diagnostics collection not in canonical ascending encoded-byte order`.

**N10 — Per-Source Resolution Result count/order mismatch.** Input: a Verification Payload for a 1-entry `sourceManifest` whose `perSourceResolutionResults` contains 0 entries. Rejection: `FAIL-CLOSED[VerificationPayload]: sourceManifest entry at index 0 has no corresponding perSourceResolutionResults entry`.

---
# Evidence Selection

Context Assembly SHALL select Evidence according to:

- Mission scope
- Evidence Authority
- Repository Policies
- Architectural relevance
- Dependency relationships

Evidence selection SHALL remain deterministic.

---

# Evidence Resolution

When multiple Evidence instances are applicable:

Context Assembly SHALL:

- preserve conflicting Evidence
- apply Authority rules
- apply Kernel policies
- preserve explainability

Conflict resolution SHALL NOT modify Evidence.

---

# Projection Freshness

Shared Reality SHALL represent the current engineering state.

A Projection becomes stale whenever:

- new Evidence is acquired
- Mission Plans evolve
- Review Outcomes modify applicable Evidence
- Repository state changes
- Repository Policies change

Stale Projections SHOULD be recomputed before execution.

---

# Explainability

Every Projection SHALL identify:

- contributing Evidence
- applied policies
- discarded Evidence
- conflict resolutions

Every engineering participant SHALL be capable of reproducing the Projection.

---

# Engineering Participants

Engineering participants include:

- Kernel Services
- Execution Providers
- Review Providers
- Validation Engines
- Host Integrations

All participants SHALL consume Shared Reality.

No participant SHALL construct an independent engineering understanding.

---

# Shared Reality Lifetime

Shared Reality SHALL exist only for the duration required to support engineering activities.

Implementations MAY cache Projections.

Cached Projections SHALL be invalidated whenever freshness requirements are no longer satisfied.

Shared Reality SHALL remain disposable.

---

# Determinism

Equivalent:

- Mission
- Evidence
- Repository State
- Policies

SHALL produce an equivalent Shared Reality Projection.

Kernel implementations SHALL preserve deterministic computation.

---

# Security Considerations

Shared Reality SHALL preserve Evidence confidentiality.

Sensitive Evidence MAY be omitted according to applicable policies.

Omitted Evidence SHALL remain attributable.

Filtering SHALL preserve deterministic behavior.

---

# Implementation Requirements

Implementations SHALL:

- support deterministic Context Assembly
- support reproducible Projections
- support Projection versioning
- support freshness validation
- preserve explainability
- preserve Evidence attribution

Implementation details remain outside the scope of this specification.

---

# Implementation Guidance

This specification is implementation independent.

Implementations MAY realize this specification across multiple development iterations.

Partial implementations SHALL preserve all guarantees for the implemented concepts.

Implementation sequencing is governed by the Implementation Plan.

---

# Conformance

A Kernel implementation conforms to RFC-0003 only if it:

- computes Shared Reality exclusively from Evidence
- preserves deterministic behavior
- preserves explainability
- preserves Projection reproducibility
- preserves Mission scoping
- prevents Shared Reality from becoming authoritative truth
- invalidates stale Projections
- delivers deterministic Context Packages

Failure to satisfy these guarantees constitutes non-conformance with this specification.
