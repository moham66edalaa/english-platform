# User Roles & Use Cases — english-platform

> This is the source of truth for all requirements. Use the Business Analyst agent to add new roles and use cases. Do not edit manually.

---

## Role: Student

**Description:** Learners who browse courses, take placement tests, enroll in courses, watch video lessons, complete quizzes and assignments, and earn certificates.

**Permissions:** View public courses, take placement test, enroll (with payment), access enrolled course content, submit quizzes/assignments, view progress/certificates.

---

## Role: Teacher

**Description:** Instructors who manage their assigned courses, review student assignments, and conduct live sessions.

**Permissions:** Manage courses, review assignments, manage live sessions. Cannot access analytics, student management, or placement test management.

---

## Role: Owner

**Description:** Platform administrator with full access to all features including course management, student management, analytics, placement test configuration, and pricing.

**Permissions:** Full CRUD on all entities, access analytics, manage students, configure placement tests, set pricing.

---

<!-- Use cases will be added below by the Business Analyst agent -->
<!-- Format for each use case:

### UC-NNN: [Use Case Name]

- **Actor:** [Who triggers this]
- **Trigger:** [What initiates the use case]
- **Preconditions:** [What must be true before this can execute]

**Main Flow:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Alternative Flows:**
- **AF-1:** [Description of alternative path]

**Acceptance Criteria:**
- [ ] **Given** [precondition] **When** [action] **Then** [expected result]

**Business Rules:**
- BR-1: [Testable statement]

-->
