# Vocabulary Index

This index maps core normative vocabulary to its owning RFC and the RFCs that reference that domain through explicit dependency links.

## Source RFCs

- RFC-0001 - Mission Model
- RFC-0002 - Evidence Model
- RFC-0003 - Shared Reality Projection Model
- RFC-0004 - Execution Model
- RFC-0005 - Domain Event Model
- RFC-0006 - Engineering Assessment Model
- RFC-0007 - Knowledge Model
- RFC-0008 - Kernel Adapter Contract
- RFC-0009 - Host Contract
- RFC-0010 - Kernel Boundaries

## Index

| Term                   | Owner    | Referenced by                                                                  |
| ---------------------- | -------- | ------------------------------------------------------------------------------ |
| Mission                | RFC-0001 | RFC-0003, RFC-0004, RFC-0005, RFC-0006, RFC-0007, RFC-0009, RFC-0010           |
| Mission Plan           | RFC-0001 | RFC-0004, RFC-0005, RFC-0006, RFC-0007, RFC-0010                               |
| Task Graph             | RFC-0001 | RFC-0004                                                                       |
| Evidence               | RFC-0002 | RFC-0001, RFC-0003, RFC-0004, RFC-0005, RFC-0006, RFC-0007, RFC-0009, RFC-0010 |
| Evidence Authority     | RFC-0002 | RFC-0003, RFC-0010                                                             |
| Evidence Relationships | RFC-0002 | RFC-0003, RFC-0010                                                             |
| Shared Reality         | RFC-0003 | RFC-0004, RFC-0006, RFC-0007, RFC-0008, RFC-0009, RFC-0010                     |
| Context Assembly       | RFC-0003 | RFC-0004, RFC-0008                                                             |
| Context Package        | RFC-0003 | RFC-0004, RFC-0008                                                             |
| Execution              | RFC-0004 | RFC-0005, RFC-0006, RFC-0008, RFC-0010                                         |
| Execution Strategy     | RFC-0004 | RFC-0005, RFC-0010                                                             |
| Domain Event           | RFC-0005 | RFC-0006, RFC-0007, RFC-0009, RFC-0010                                         |
| Engineering Assessment | RFC-0006 | RFC-0007, RFC-0008, RFC-0010                                                   |
| Actionable Finding     | RFC-0006 | RFC-0007                                                                       |
| Engineering Memory     | RFC-0007 | RFC-0010                                                                       |
| Adapter Contract       | RFC-0008 | RFC-0010                                                                       |
| Adapter Capability     | RFC-0008 | RFC-0010                                                                       |
| Host Contract          | RFC-0009 | RFC-0010                                                                       |
| Host Capability        | RFC-0009 | RFC-0010                                                                       |
| Kernel Boundary        | RFC-0010 | RFC-0010                                                                       |

## Notes

- Owner indicates the RFC that normatively owns the term.
- Referenced by is derived from explicit cross-RFC dependency sections and directly stated normative usage in the suite.
- RFC-0010 references itself because it defines the constitutional boundary vocabulary it owns.
