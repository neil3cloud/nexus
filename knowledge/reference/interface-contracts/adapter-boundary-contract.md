# Adapter Boundary Contract

## Contract Owner

- Kernel Control Plane and Adapter Boundary

## Purpose

Define capability-declared delegation between kernel execution/review flows and adapters.

## Interface

- invokeAdapter(request)
- queryAdapterCapabilities(query)
- reportAdapterResult(response)

## Request/Response Shape

- adapterId
- adapterVersion
- role
- capability
- taskContext
- projectionVersion
- resultArtifacts
- diagnostics

## Guarantees

- Adapters remain stateless with respect to engineering truth.
- Role assignment remains kernel-owned.
- Adapter outputs are not authoritative evidence until accepted.
