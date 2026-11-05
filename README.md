# Inkloom AI — Intelligent Brand Governance Platform
**Team:** Ek Kachori Do Samosa  
- **Module A (AI & Detection Engine):** Sakshi (Python / FastAPI / GPT-4o / RAG)  
- **Module B (Main Backend, DB & Security):** Khushi (Java Spring Boot / PostgreSQL / Spring Security JWT)  
- **Module C (Frontend, Visual & Accessibility):** Purva (React / Next.js / Tailwind CSS / Recharts)

---

## Architecture Overview

```
                        ┌─────────────────────────────────────┐
                        │      React / Tailwind Frontend      │
                        │    (Creator, Manager, Reviewer)     │
                        └──────────────────┬──────────────────┘
                                           │ REST APIs + JWT
                                           ▼
                        ┌─────────────────────────────────────┐
                        │      Java Spring Boot Backend       │
                        │  - Spring Security (RBAC + JWT)     │
                        │  - Deterministic Rule Engine        │
                        │  - Review Workflow State Machine    │
                        │  - PostgreSQL / JPA Repositories    │
                        └──────────┬──────────────────────────┘
                                   │ OpenAI API (JSON Schema)
                                   ▼
                        ┌─────────────────────────────────────┐
                        │        OpenAI GPT API (GPT-4o)      │
                        │  - Tone & messaging analysis        │
                        │  - Rationale & guideline citations  │
                        │  - Intent-preserving suggestions    │
                        └─────────────────────────────────────┘
```

## System Workflow: Check → Explain → Suggest → Review → Learn

1. **Brand Knowledge Base (Admin)**: Upload and manage active brand guidelines, banned phrases, approved claims, and visual palette.
2. **Content Submission (Creator)**: Draft text, social posts, or upload flyers/banners.
3. **Hybrid Audit Engine**:
   - **Deterministic Rules Engine**: Fast, zero-hallucination regex checking for banned jargon, extreme claims, and WCAG contrast.
   - **OpenAI GPT API (`gpt-4o`)**: Grounded in active brand guidelines, evaluates nuanced tone, detects unsubstantiated claims, and produces structured JSON with exact guideline citations and suggested replacements.
4. **Interactive Remediation (Creator)**: View explainable issue cards; 1-click accept, edit, or justify dismissals.
5. **Review & Approval Hub (Manager & Authorised Reviewer)**: Side-by-side diff viewer, comment threads, sign-off status tracking (`APPROVED`, `CHANGES_REQUESTED`, `REJECTED`).
6. **Governance Insights**: Visual analytics dashboard showing repeated mistakes and pinpointing ambiguous brand rules.

---

## Detailed Documentation
- [Design System & Color Palette Specification](file:///C:/Users/LOQ/.gemini/antigravity/brain/72ea012f-ff82-497b-b9ea-b35fe8e41883/design-system-color-palette.md)
- [Enterprise Security & Threat Defense Plan](file:///C:/Users/LOQ/.gemini/antigravity/brain/72ea012f-ff82-497b-b9ea-b35fe8e41883/enterprise-security-architecture.md)
- [Full-Stack Architecture & Workflow (Spring Boot + GPT API)](file:///C:/Users/LOQ/.gemini/antigravity/brain/72ea012f-ff82-497b-b9ea-b35fe8e41883/full-stack-spring-boot-gpt-architecture.md)
- [Frontend Independent Architecture & Workflow](file:///C:/Users/LOQ/.gemini/antigravity/brain/72ea012f-ff82-497b-b9ea-b35fe8e41883/frontend-architecture-and-workflow.md)
- [Frontend Workspace Readme](file:///c:/Users/LOQ/OneDrive/Desktop/code%20nexus/frontend/README.md)
