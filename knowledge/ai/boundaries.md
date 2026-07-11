# Legacy Responsibility Matrix

| Responsibility           | Builder | Reviewer    |
| ------------------------ | ------- | ----------- |
| Generate code            | ✓       | No          |
| Refactor                 | ✓       | Review only |
| Write tests              | ✓       | Verify      |
| Update documentation     | ✓       | Verify      |
| Architecture review      | No      | ✓           |
| Security review          | No      | ✓           |
| Performance review       | Limited | ✓           |
| ADR compliance           | Limited | ✓           |
| Technical debt detection | No      | ✓           |
| Repository consistency   | Limited | ✓           |

Only one AI owns implementation.

Only one AI owns review.

Responsibilities must never overlap.
