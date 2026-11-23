# CivicPulse: Full-Stack Component Breakdown & Trello User Stories Backlog

> **Project:** CivicPulse — Smart City Infrastructure Management Platform (GovTech)  
> **Tagline:** *Smarter Cities, Faster Fixes*  
> **Project Stack:** Next.js 16 (App Router, Tailwind CSS, Motion Brew animation primitives, Zod, Recharts, Leaflet / React-Leaflet) + Node.js/Express.js + MongoDB Atlas (Mongoose & 2dsphere geospatial index) + JWT (httpOnly cookies) + Multer & Cloudinary + Nominatim OpenStreetMap Geocoding.  
> **Target Scope:** Production GovTech delivery across Phase 0 (Setup) through Phase 9 (Submission).
> **UI Design Standard:** **Motion Brew Minimal Modern Design System** — Powered by `motion/react` spring physics, subtle ambient glows, micro-interactions, dark/light contrast tokens, and minimal clean borders across every view.

---

## Motion Brew Component Standards & Design Mapping

CivicPulse utilizes authentic **Motion Brew** components (and closest-matched Motion Brew animation primitives) to maintain an authoritative, minimal, and responsive GovTech user experience:

| Motion Brew Primitive | Component / Usage in CivicPulse | Key Interaction & Spring Physics |
|---|---|---|
| **`MagneticButton`** | All Primary & Secondary CTAs | Magnetic cursor pull, spring scale click (`scale: 0.96`), smooth hover lift |
| **`TabBar` / `Dock`** | Top Navbar & Floating Map Controls | Floating pill container, sliding active tab indicator (`layoutId`), glass backdrop |
| **`BlurText`** | Hero Headlines & Section Introductions | Words rise out of Gaussian blur (`blur(12px) → blur(0px)`) with staggered spring easing |
| **`RollText` / `RollingNumber`** | KPI Metrics, Counter Badges & Timers | Numerals slide vertically on change with physics-based spring dampening |
| **`MotionCard` / `SpotlightCard`** | Issue Cards, Category Selector & Stat Widgets | Ambient cursor spotlight glow, subtle 1px border illumination, hover lift |
| **`AuthCard`** | Citizen & Staff Login / Registration | Animated SVG icon handles, in-place rolling mode toggle, password strength gauge |
| **`DialogSpring` / `ModalSpring`** | Verification Modals, Map Picker, Task Dialogs | Spring scale entrance (`scale: 0.95 → 1.0`), smooth backdrop blur (`backdrop-blur-md`) |
| **`DrawerSpring`** | Mobile Navigation & Notification Feed | Smooth slide-in spring drawer with friction dampening on drag-to-dismiss |
| **`FilterPillsGroup`** | Category & Status Filter Tabs | Fluid pill highlight tracking active filter using Framer Motion `layoutId` |
| **`DataTableSpring`** | Role-Scoped Issue Management Board | Staggered row reveals, animated sort headers, clean minimal table styling |
| **`TimelineStepperSpring`** | Issue Lifecycle Audit & Activity Stream | Vertical progress line filling smoothly as milestones transition |
| **`FileDropzoneAnimated`** | Photographic Evidence & Repair Proof Upload | Spring hover scale, drag active state, instant animated thumbnail preview |
| **`InteractiveMapPinPulse`** | OpenStreetMap & Leaflet Pins | Custom SVG pin with expanding concentric pulse beacon ring (`animate-ping`) |
| **`BeforeAfterSlider`** | Public Proofs & Duplicate Comparison | Interactive draggable split-view with smooth spring handle physics |
| **`StarRatingInteractive`** | Citizen Feedback Rating | Spring-scaling star selection with hover glow and dynamic rating labels |
| **`ToastSpringNotification`** | System Alerts & Status Toasts | Bouncing spring entrance, auto-dismiss timer progress bar, gesture swipe |

---

## Trello Board Recommended Setup

### Board Columns / Workflow Stages
1. 💡 **Product Backlog** (All cards prioritized by Phase & Tier)
2. 📋 **Sprint Backlog** (Current 2-week commitment)
3. 🚧 **In Progress** (Active development)
4. 🔍 **Code Review & PR** (Backend permission audit & frontend responsiveness check)
5. 🧪 **QA & Verification** (Validation against Quality & Security Checklists)
6. ✅ **Done** (End-to-end verified and documented)

### Recommended Trello Labels & Tags
- `Phase-0: Setup` (Gray)
- `Phase-1: Auth & Roles` (Blue)
- `Phase-2: Citizen Flow` (Teal)
- `Phase-3: Management Flow` (Amber)
- `Phase-4: Teams & Tasks` (Purple)
- `Phase-5: Maps & Analytics` (Pink)
- `Phase-6: Notifications & Polish` (Orange)
- `Phase-7: Seed & QA` (Green)
- `Frontend` (Light Blue)
- `Backend` (Dark Green)
- `Database & Geo` (Dark Purple)
- `Priority: P0 (Critical)` / `Priority: P1 (High)` / `Priority: P2 (Medium)`

---

# Epic 0: Project Foundation, Tooling & Design System Setup (Phase 0)

---

### [SETUP-01] Express.js Backend Architecture, MongoDB Connection & Security Middleware
- **User Story:**
  > As a **Backend Developer**,  
  > I want to initialize a structured Express.js application with Mongoose, security middleware, and a standardized API response handler,  
  > so that all future feature controllers operate in a consistent, resilient, and secure runtime environment.

- **Backend Architecture & Structure:**
  - `backend/server.js`: HTTP server entry point with graceful shutdown (`SIGTERM`/`SIGINT`) and port binding.
  - `backend/src/app.js`: Express app instance configuring `cors({ origin, credentials: true })`, `helmet()`, `express.json({ limit: '10mb' })`, and `cookie-parser()`.
  - `backend/src/config/db.js`: Mongoose connection manager with retry logic, auto-indexing enabled for development, and connection event logs.
  - `backend/src/middleware/errorHandler.js`: Centralized error handling intercepting `CastError`, Mongoose validation errors, duplicate keys (`code 11000`), and custom `ApiError`.
  - `backend/src/utils/apiResponse.js` & `backend/src/utils/apiError.js`: Standard response payload builders:
    - Success: `{ success: true, message, data, pagination }`
    - Failure: `{ success: false, message, errors }`
  - `backend/src/utils/asyncHandler.js`: Higher-order wrapper eliminating redundant `try/catch` boilerplate.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Running `npm run dev` in `backend/` establishes connection to MongoDB Atlas without warnings.
  - [ ] Healthcheck route `GET /api/v1/health` returns status `200 OK` with timestamp and uptime.
  - [ ] Malformed JSON or unhandled exceptions return uniform JSON errors; server never crashes.
  - [ ] `.env.example` documents all required backend configuration variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `CLOUDINARY_*`).

- **Trello Metadata:**
  - **Phase:** Phase 0 | **Priority:** P0 | **Story Points:** 3 | **Dependencies:** None

---

### [SETUP-02] Next.js App Router Scaffold, Tailwind CSS Theme & Motion Brew Setup
- **User Story:**
  > As a **Frontend Developer**,  
  > I want to scaffold the Next.js App Router workspace with Tailwind CSS mapped to CivicPulse theme variables and Motion Brew design foundations,  
  > so that all user interfaces inherit brand-compliant typography, contrast-safe buttons, and fluid spring animations.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/globals.css`: Declares root CSS variables for CivicPulse palette (`--primary: #0D9488`, `--primary-light: #CCFBF1`, `--secondary: #06B6D4`, `--background: #FFFFFF`, `--surface: #F8FAFC`, `--text: #0F172A`, `--border: #E2E8F0`) and status tokens (`--status-submitted: #64748B`, `--status-review: #F59E0B`, `--status-assigned: #3B82F6`, `--status-progress: #8B5CF6`, `--status-resolved: #10B981`, `--status-closed: #334155`).
  - `frontend/src/components/ui/MagneticButton.jsx`: **Motion Brew `MagneticButton`** primitive with spring physics, cursor pull, size variants (`sm`, `md`, `lg`), and loading state.
  - `frontend/src/components/ui/BlurText.jsx`: **Motion Brew `BlurText`** component for staggered headline reveals.
  - `frontend/src/components/ui/MotionCard.jsx`: **Motion Brew `MotionCard`** with hover lift and glowing accent border.
  - `frontend/src/components/layout/Navbar.jsx`: **Motion Brew `TabBar`** floating glass header with active indicator pill.
  - `frontend/src/components/layout/Footer.jsx`: GovTech Smart City footer with ward beacon and emergency hotlines.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Running `npm run dev` in `frontend/` compiles with zero Tailwind or Next.js layout warnings.
  - [ ] Brand colors render consistently across light surfaces without hardcoded hex strings scattered in JSX.
  - [ ] Motion Brew components install cleanly into `components/` and accept CivicPulse Tailwind class overrides.

- **Trello Metadata:**
  - **Phase:** Phase 0 | **Priority:** P0 | **Story Points:** 3 | **Dependencies:** None

---

# Epic 1: Authentication, Role-Based Access Control & Profiles (Phase 1)

---

### [AUTH-01] JWT Cookie-Based Authentication & Session Management
- **User Story:**
  > As a **Citizen or Municipal Staff Member**,  
  > I want to register for a citizen account or log in with my verified credentials,  
  > so that I receive a secure HTTP-only session cookie allowing me to access authorized features.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/(auth)/login/page.jsx`: Login view using Motion Brew split-screen minimal card.
  - `frontend/src/app/(auth)/register/page.jsx`: Registration view with client-side Zod validation.
  - `frontend/src/components/auth/AuthCard.jsx`: **Motion Brew `AuthCard`** featuring:
    - Animated SVG icon handles (`UserIcon`, `LockKeyholeIcon`, `AtSignIcon`, `EyeIcon`, `ArrowRightIcon`).
    - Rolling text mode switch (`RollText` component) transitioning between Sign In and Sign Up.
    - Password strength gauge bar with spring-fill animation.
    - Motion Brew `MagneticButton` for the form submission CTA.
  - `frontend/src/validations/auth.js`: Zod schema validating email format and password complexity.
  - `frontend/src/lib/auth-client.js`: Better Auth / JWT cookie authentication client.

- **Backend API & Logic:**
  - `POST /api/v1/auth/register`: Public registration endpoint creating `role: 'citizen'`. Hashes password with bcrypt (12 salt rounds), issues JWT in `httpOnly` secure cookie.
  - `POST /api/v1/auth/login`: Authenticates email/password, checks `isActive === true`, signs JWT with payload `{ id, role, department }`, sets cookie `token` with `httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7d`.
  - `POST /api/v1/auth/logout`: Clears authentication cookie.
  - `GET /api/v1/auth/me`: Validates cookie token and returns user profile data.
  - `backend/src/middleware/auth.js`: Extracts and verifies JWT from cookie; injects `req.user`.

- **Database Model (`backend/src/models/User.js`):**
  ```javascript
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'manager', 'staff', 'citizen'], default: 'citizen', index: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', default: null },
    phone: { type: String, trim: true },
    avatar: { url: String, publicId: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  }
  ```

- **Acceptance Criteria (Definition of Done):**
  - [ ] Passwords hashed with bcrypt; raw password string never stored or returned in any API response.
  - [ ] Successful login writes `httpOnly` cookie; subsequent requests to `/auth/me` return authenticated user payload.
  - [ ] Logging out purges cookie and resets client session.

- **Trello Metadata:**
  - **Phase:** Phase 1 | **Priority:** P0 | **Story Points:** 5 | **Dependencies:** SETUP-01, SETUP-02

---

### [AUTH-02] Role-Based Route Guards & Dashboard Redirect Engine
- **User Story:**
  > As an **Authenticated User**,  
  > I want to be automatically redirected to my role's designated dashboard upon login and blocked from accessing other role portals,  
  > so that municipal security and data segregation are strictly maintained.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/middleware.js`: Edge route guard checking role session and intercepting unauthorized paths:
    - `/dashboard` → Citizen portal
    - `/department-dashboard` → Manager portal
    - `/my-tasks` → Field staff portal
    - `/admin-dashboard` → Admin console
  - `frontend/src/app/(dashboard)/unauthorized/page.jsx`: **Motion Brew `MotionCard`** unauthorized fallback screen with spring-bounce lock icon and return button.
  - `frontend/src/lib/authHelpers.js`: Utility returning target dashboard URL by role.

- **Backend Middleware (`backend/src/middleware/roleCheck.js`):**
  - `authorize(...roles)`: Express middleware verifying `roles.includes(req.user.role)`. Rejects unauthorized access with `403 Forbidden`.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Citizens attempting to access `/admin-dashboard` or `/department-dashboard` are blocked and redirected.
  - [ ] Direct API requests from non-admin accounts to administrative endpoints return HTTP 403.
  - [ ] Unauthenticated requests to protected dashboards redirect cleanly to `/login?redirect=...`.

- **Trello Metadata:**
  - **Phase:** Phase 1 | **Priority:** P0 | **Story Points:** 3 | **Dependencies:** AUTH-01

---

### [AUTH-03] User Profile Management & Password Security
- **User Story:**
  > As an **Authenticated User**,  
  > I want to update my profile contact details, upload an avatar photo, and change my password securely,  
  > so that my account credentials and contact info remain current.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/profile/page.jsx`: Settings page with **Motion Brew `TabBar`** tab switcher ("Profile Information" vs "Security & Password").
  - `frontend/src/components/profile/ProfileForm.jsx`: Minimal card form with floating label inputs and `MagneticButton` save trigger.
  - `frontend/src/components/profile/AvatarUploader.jsx`: **Motion Brew `FileDropzoneAnimated`** photo uploader with hover scale, circular crop preview, and Cloudinary upload.
  - `frontend/src/components/profile/PasswordChangeForm.jsx`: Security form with real-time password verification and `MagneticButton`.

- **Backend API & Logic:**
  - `PATCH /api/v1/users/me`: Updates current user's name, phone, bio, or avatar.
  - `PATCH /api/v1/users/me/password`: Validates existing password using `bcrypt.compare`; updates to newly hashed password.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Incorrect current password rejects password update with 400 Bad Request.
  - [ ] Profile updates propagate to client session immediately without full page reload.

- **Trello Metadata:**
  - **Phase:** Phase 1 | **Priority:** P1 | **Story Points:** 3 | **Dependencies:** AUTH-01

---

# Epic 2: Citizen Issue Reporting & Life Cycle (Phase 2)

---

### [CITIZEN-01] Citizen Issue Submission with Cloudinary Image Upload
- **User Story:**
  > As a **Citizen**,  
  > I want to report a public infrastructure issue with a title, category, description, photo evidence, and location,  
  > so that the responsible municipal department can inspect and resolve it.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/issues/new/page.jsx`: Issue reporting page with animated breadcrumbs and ambient background glow.
  - `frontend/src/components/issues/IssueReportForm.jsx`: **Motion Brew `MotionCard`** container with client-side Zod validation and `MagneticButton` dispatch CTA.
  - `frontend/src/components/issues/CategorySelector.jsx`: **Motion Brew `FilterPillsGroup` / `BentoGrid`** selection cards for the 6 primary municipal categories with micro-lift on hover.
  - `frontend/src/components/issues/ImageDropzone.jsx`: **Motion Brew `FileDropzoneAnimated`** with drag-over pulse, size validation (5MB max), and instant photo preview thumbnail.
  - `frontend/src/components/issues/LocationInput.jsx`: Location HUD with 1-click GPS detection and modal launcher.

- **Backend API & Logic:**
  - `POST /api/v1/issues`: Multipart form-data endpoint using `multer.single('image')`.
    1. Validates text fields and coordinates with Zod.
    2. Uploads image buffer to Cloudinary (with base64 dev fallback).
    3. Infers target department code (`ROAD`, `ELEC`, `WASA`, `CIVIL`, `WASTE`, `URBAN`) based on category.
    4. Creates `Issue` in `status: 'Submitted'`, setting `reporter: req.user._id`.
    5. Creates initial `IssueStatusHistory` document (`Submitted`).
    6. Logs event to `ActivityLog`.

- **Database Model (`backend/src/models/Issue.js`):**
  ```javascript
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['Road Damage', 'Streetlight', 'Drainage', 'Footpath', 'Waste Management', 'Public Infrastructure'], required: true, index: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium', index: true },
    status: { type: String, enum: ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'], default: 'Submitted', index: true },
    address: { type: String, required: true },
    location: { type: { type: String, default: 'Point' }, coordinates: { type: [Number], required: true } },
    image: { url: String, publicId: String },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isDuplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', default: null },
    createdAt: { type: Date, default: Date.now, index: true }
  }
  ```
  - **Index:** `IssueSchema.index({ location: '2dsphere' })` for distance-based queries.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Citizens can submit an issue with photo and GPS coordinates in under 3 seconds.
  - [ ] Uploaded image is stored on Cloudinary or fallback URI and returns valid URL.
  - [ ] Issue creation automatically writes initial `IssueStatusHistory` entry.

- **Trello Metadata:**
  - **Phase:** Phase 2 | **Priority:** P0 | **Story Points:** 8 | **Dependencies:** AUTH-01, SETUP-02

---

### [CITIZEN-02] Interactive Leaflet Map Location Picker & Reverse Geocoding
- **User Story:**
  > As a **Citizen**,  
  > I want to pinpoint the problem location on an interactive OpenStreetMap or use my device's GPS with automatic address resolution,  
  > so that municipal teams know the precise location of the issue.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/components/map/LocationPickerModal.jsx`: **Motion Brew `DialogSpring`** modal with smooth backdrop blur, search bar, and coordinates HUD.
  - `frontend/src/components/map/MapPicker.jsx`: **Motion Brew `InteractiveMapPinPulse`** React-Leaflet component (`ssr: false`) with custom SVG teal pulse pin and draggable marker.
  - `frontend/src/components/map/CurrentLocationButton.jsx`: **Motion Brew `MagneticButton`** requesting device GPS with pulsating loader.
  - `frontend/src/hooks/useReverseGeocode.js`: Custom hook sending debounced latitude/longitude to OpenStreetMap Nominatim API for human-readable address resolution.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Moving the pin fetches and displays readable address (Street, Ward, Area, City) within 800ms via debounced reverse geocoding.
  - [ ] Leaflet map loads without SSR `window is not defined` hydration errors.
  - [ ] Coordinates persist correctly into MongoDB format `coordinates: [longitude, latitude]`.

- **Trello Metadata:**
  - **Phase:** Phase 2 | **Priority:** P0 | **Story Points:** 5 | **Dependencies:** CITIZEN-01

---

### [CITIZEN-03] Citizen 'My Reports' Directory & Issue Timeline Tracking
- **User Story:**
  > As a **Citizen**,  
  > I want to view a list of all issues I have reported with status filters and open an issue detail page with an interactive timeline,  
  > so that I can monitor real-time repair progress and transparency.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/(citizen)/my-reports/page.jsx`: Citizen report dashboard featuring:
    - **Motion Brew `TabBar` / `FilterPillsGroup`** for status filtering (`All`, `Active`, `Under Review`, `Resolved`).
    - Staggered animated grid of issue cards.
  - `frontend/src/components/issues/IssueCard.jsx`: **Motion Brew `MotionCard` / `CardHover`** displaying:
    - Evidence photo thumbnail with subtle zoom on hover.
    - Title, category icon, relative timestamp ("2 hours ago").
    - **Motion Brew `StatusBadgePulse`** with micro-glow reflecting lifecycle state.
  - `frontend/src/app/(citizen)/issues/[id]/page.jsx`: Comprehensive issue detail view with split layout (Media & Details on left, Status Timeline on right).
  - `frontend/src/components/issues/StatusTimeline.jsx`: **Motion Brew `TimelineStepperSpring`** showing animated progress stepper (`Submitted → Under Review → Assigned → In Progress → Resolved → Closed`) with official municipal actor notes.
  - `frontend/src/components/ui/StatusBadge.jsx`: Micro-component rendering exact status tokens with subtle dark-mode glow.

- **Backend API & Logic:**
  - `GET /api/v1/issues/mine`: Retrieves issues where `reporter === req.user._id`, supporting pagination (`page`, `limit`) and status filter.
  - `GET /api/v1/issues/:id`: Fetches single issue details with populated reporter, department, and assigned staff.
  - `GET /api/v1/issues/:id/history`: Retrieves chronological audit rows from `IssueStatusHistory`.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Citizen sees only their own submitted issues on `/my-reports`.
  - [ ] Issue detail page renders complete status history timeline with actor role (e.g. "Verified by Road Maintenance Manager").
  - [ ] Empty state with **Motion Brew `MagneticButton`** CTA displays when a citizen has not reported any issues yet.

- **Trello Metadata:**
  - **Phase:** Phase 2 | **Priority:** P1 | **Story Points:** 5 | **Dependencies:** CITIZEN-01, CITIZEN-02

---

# Epic 3: Management Workflow & Verification Engine (Phase 3)

---

### [MGT-01] Role-Scoped Issue Management Board (Search, Filter, Pagination)
- **User Story:**
  > As a **Department Manager or Admin**,  
  > I want a comprehensive table and card view of reported issues with server-side filtering, sorting, and pagination,  
  > so that I can quickly triage and prioritize incoming public complaints.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/(manager)/issue-management/page.jsx` & `(admin)/issues/page.jsx`: Management workspace views.
  - `frontend/src/components/management/IssueDataTable.jsx`: **Motion Brew `DataTableSpring`** responsive table:
    - Staggered row reveals with subtle hover border highlight.
    - Sortable column headers with animated chevron indicator.
    - Embedded `StatusBadgePulse` and quick action trigger buttons.
  - `frontend/src/components/management/IssueFilterBar.jsx`: **Motion Brew `FilterPillsGroup`** multi-select filter controls (Category, Priority, Status, Date Range).
  - `frontend/src/components/management/DebouncedSearchInput.jsx`: Search field with animated clear icon and live query debouncing (300ms).
  - `frontend/src/components/ui/PaginationControl.jsx`: **Motion Brew `PaginationBarSpring`** with spring page switcher and items-per-page selector.

- **Backend API & Logic:**
  - `GET /api/v1/issues`:
    1. Role check: if `role === 'manager'`, force query filter `department: req.user.department`. If `role === 'admin'`, allow optional department filter.
    2. Builds dynamic MongoDB filter object (`category`, `status`, `priority`, `dateRange`).
    3. Handles text search via regex or index on `title` and `address`.
    4. Executes query with `.skip((page - 1) * limit).limit(Number(limit)).sort({ [sortBy]: sortOrder })`.
    5. Returns standard response with `pagination: { page, limit, total, pages }`.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Department Managers cannot view or filter issues belonging to other departments.
  - [ ] Admins can view and filter issues across all departments.
  - [ ] Table search and filter updates execute in under 200ms using indexed database fields.

- **Trello Metadata:**
  - **Phase:** Phase 3 | **Priority:** P0 | **Story Points:** 5 | **Dependencies:** AUTH-02, CITIZEN-01

---

### [MGT-02] Issue Verification, Priority Assignment & Department Re-routing
- **User Story:**
  > As a **Department Manager or Admin**,  
  > I want to inspect an unverified issue, set its severity priority (`low`, `medium`, `high`, `critical`), and reassign the department if miscategorized,  
  > so that the issue is routed to the correct technical maintenance team.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/components/management/VerifyIssueModal.jsx`: **Motion Brew `DialogSpring`** modal with citizen photo inspection, geocoded map preview, and verification checklist.
  - `frontend/src/components/management/PrioritySelector.jsx`: **Motion Brew `MotionCard`** radio cards with color-coded severity borders (Low: Gray, Medium: Blue, High: Amber, Critical: Rose).
  - `frontend/src/components/management/DepartmentDropdown.jsx`: Animated dropdown allowing reassignment to a different active municipal department.
  - Form actions powered by **Motion Brew `MagneticButton`**.

- **Backend API & Logic:**
  - `PATCH /api/v1/issues/:id/verify`: Sets `verifiedBy: req.user._id`, updates status from `Submitted` to `Under Review`.
  - `PATCH /api/v1/issues/:id/priority`: Updates priority level; writes to `ActivityLog`.
  - Re-routing updates the `department` field and records transition in `IssueStatusHistory`.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Only Managers (of that department) and Admins can verify issues or alter priority levels.
  - [ ] Priority changes log the initiating manager's ID and timestamp.

- **Trello Metadata:**
  - **Phase:** Phase 3 | **Priority:** P0 | **Story Points:** 3 | **Dependencies:** MGT-01

---

### [MGT-03] Deterministic Status Transition Service Engine
- **User Story:**
  > As a **System / Lead Developer**,  
  > I want all issue status transitions to pass through an authoritative, rule-enforced backend workflow service,  
  > so that illegal status jumps are rejected and every valid state change writes an immutable audit record.

- **Backend Service (`backend/src/services/issueWorkflow.js`):**
  - **Authoritative State Machine:**
    ```javascript
    const TRANSITION_RULES = {
      'Submitted': { next: ['Under Review'], allowedRoles: ['manager', 'admin'] },
      'Under Review': { next: ['Assigned'], allowedRoles: ['manager', 'admin'] },
      'Assigned': { next: ['In Progress'], allowedRoles: ['staff'] },
      'In Progress': { next: ['Resolved'], allowedRoles: ['staff'] },
      'Resolved': { next: ['Closed'], allowedRoles: ['manager', 'admin'] }
    };
    ```
  - **Transition Method:** `transitionIssueStatus(issueId, toStatus, user, note)`
    1. Loads target issue from database.
    2. Validates `toStatus` is an allowed next step.
    3. Validates `user.role` is authorized for this transition.
    4. If user is `manager`, verifies `issue.department.equals(user.department)`.
    5. If user is `staff`, verifies issue has active task assigned to `user._id`.
    6. Updates `issue.status`. Sets `resolvedAt = Date.now()` when entering `Resolved`; sets `closedAt = Date.now()` when entering `Closed`.
    7. Atomically creates `IssueStatusHistory` document.
    8. Dispatches in-app notification to the reporting citizen.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Attempting an invalid jump (e.g., `Submitted` directly to `Resolved`) throws 400 Bad Request with workflow error.
  - [ ] Non-assigned staff cannot move an issue to `In Progress` or `Resolved`.
  - [ ] `IssueStatusHistory` records are immutable (no edit/delete endpoints exist).

- **Trello Metadata:**
  - **Phase:** Phase 3 | **Priority:** P0 | **Story Points:** 5 | **Dependencies:** MGT-01

---

### [MGT-04] Proximity Duplicate Issue Detection (2dsphere Geospatial Engine)
- **User Story:**
  > As a **Department Manager**,  
  > I want the system to flag potential duplicate issues reported within 50 meters in the same category,  
  > so that my department avoids creating redundant maintenance tasks for the same broken streetlight or pothole.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/components/management/DuplicateAlertBanner.jsx`: **Motion Brew `AlertBannerBounce`** warning box with pulsing icon: *"2 similar issues found within 50m of this location"*.
  - `frontend/src/components/management/DuplicateComparisonModal.jsx`: **Motion Brew `DialogSpring`** modal with **Motion Brew `BeforeAfterSlider`** side-by-side photographic comparison of suspected duplicates.
  - Action buttons powered by **Motion Brew `MagneticButton`** ("Mark as Duplicate" vs "Dismiss Flag").

- **Backend API & Logic:**
  - `GET /api/v1/issues/nearby?lat=&lng=&radius=&category=`:
    - Executes MongoDB `$nearSphere` query on the 2dsphere index (default 50m radius).
  - `PATCH /api/v1/issues/:id/mark-duplicate`: Flags issue as duplicate, setting `isDuplicateOf: parentIssueId`, transitioning status to `Closed` with audit note.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Geospatial query evaluates in < 50ms utilizing the `location: '2dsphere'` index.
  - [ ] Marking an issue as duplicate links it to the parent issue and notifies the reporting citizen.

- **Trello Metadata:**
  - **Phase:** Phase 3 | **Priority:** P1 | **Story Points:** 5 | **Dependencies:** MGT-01, CITIZEN-01

---

# Epic 4: Departments, Teams, Tasks & Maintenance Execution (Phase 4)

---

### [TASK-01] Maintenance Task Creation & Staff Workload Assignment
- **User Story:**
  > As a **Department Manager**,  
  > I want to create a maintenance task from a verified issue and assign it to an available staff member while monitoring team workload,  
  > so that infrastructure repairs are distributed fairly and executed on time.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/components/tasks/AssignTaskModal.jsx`: **Motion Brew `DialogSpring`** modal displaying department staff roster, current active task count, and date picker for `dueDate`.
  - `frontend/src/components/teams/StaffWorkloadBadge.jsx`: **Motion Brew `StatusBadgePulse`** showing live load: `0-2 tasks` (Green - Available), `3-5 tasks` (Amber - Busy), `6+ tasks` (Rose - Overloaded).
  - `frontend/src/app/(manager)/team/page.jsx`: Department team workspace with **Motion Brew `BentoGrid`** cards displaying staff roster, contact numbers, and performance stats.

- **Backend API & Logic:**
  - `POST /api/v1/tasks`: Verifies caller is department manager, creates `Task` document, transitions issue to `Assigned`, and notifies assigned staff.
  - `GET /api/v1/teams/workload`: Aggregates active task counts per maintenance staff member.

- **Database Model (`backend/src/models/Task.js`):**
  ```javascript
  {
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending', index: true },
    progressReports: [{ note: String, by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, createdAt: { type: Date, default: Date.now } }],
    completionPhotos: [{ url: String, publicId: String }],
    notes: String,
    dueDate: Date,
    completedAt: Date,
    createdAt: { type: Date, default: Date.now }
  }
  ```

- **Acceptance Criteria (Definition of Done):**
  - [ ] Managers can only assign tasks to staff members belonging to their own department.
  - [ ] Creating and assigning a task automatically moves issue status to `Assigned`.
  - [ ] Staff workload counts update accurately in real time.

- **Trello Metadata:**
  - **Phase:** Phase 4 | **Priority:** P0 | **Story Points:** 5 | **Dependencies:** MGT-03

---

### [TASK-02] Staff Mobile Task Execution, Progress Logs & Completion Proof
- **User Story:**
  > As a **Maintenance Staff Member**,  
  > I want a mobile-friendly view of my assigned tasks, the ability to start work, log progress notes, and upload photo proof of completed repairs,  
  > so that managers and citizens can verify that the problem has been physically resolved.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/(staff)/my-tasks/page.jsx`: Mobile task console with **Motion Brew `TabBar`** filter tabs (`Pending`, `In Progress`, `Completed`) and **Motion Brew `MotionCard`** task cards.
  - `frontend/src/app/(staff)/tasks/[id]/page.jsx`: Task execution dashboard with **Motion Brew `MagneticButton`** one-tap action triggers (`Start Work`, `Add Progress Note`, `Submit Resolution Proof`).
  - `frontend/src/components/tasks/ProgressNoteModal.jsx`: **Motion Brew `DrawerSpring` / `DialogSpring`** modal to submit quick on-site status updates.
  - `frontend/src/components/tasks/CompletionPhotoUploader.jsx`: **Motion Brew `FileDropzoneAnimated`** photo uploader with instant image compression and Cloudinary upload.

- **Backend API & Logic:**
  - `GET /api/v1/tasks`: Returns tasks assigned to `req.user._id`.
  - `PATCH /api/v1/tasks/:id/status`: Updates task status:
    - Moving to `In Progress` transitions parent issue to `In Progress`.
    - Moving to `Completed` requires at least one completion photo and transitions parent issue to `Resolved`.
  - `POST /api/v1/tasks/:id/progress`: Appends progress note to `task.progressReports`.
  - `POST /api/v1/tasks/:id/completion-photos`: Uploads repair photos via Multer/Cloudinary.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Staff members can only view and mutate tasks explicitly assigned to them.
  - [ ] Moving a task to `Completed` without uploading at least one photo is rejected with 400 Bad Request.
  - [ ] Transitioning task status updates parent issue status and timeline synchronously.

- **Trello Metadata:**
  - **Phase:** Phase 4 | **Priority:** P0 | **Story Points:** 8 | **Dependencies:** TASK-01, MGT-03

---

### [TASK-03] Citizen Post-Resolution Feedback & Star Rating
- **User Story:**
  > As a **Citizen**,  
  > I want to rate the quality of the repair from 1 to 5 stars and leave a comment once my issue is marked Resolved,  
  > so that municipal authorities have citizen satisfaction feedback on maintenance quality.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/components/feedback/FeedbackPromptModal.jsx`: **Motion Brew `DialogSpring`** modal automatically prompted on resolved issues.
  - `frontend/src/components/feedback/StarRatingInput.jsx`: **Motion Brew `StarRatingInteractive`** selector with spring scale hover effects and interactive feedback pill.
  - `frontend/src/components/feedback/FeedbackCard.jsx`: **Motion Brew `MotionCard`** review card displaying citizen rating and comment on the closed issue page.
  - Submit action powered by **Motion Brew `MagneticButton`**.

- **Backend API & Logic:**
  - `POST /api/v1/issues/:id/feedback`:
    1. Verifies caller is the original reporter of the issue.
    2. Verifies issue status is `Resolved` or `Closed`.
    3. Enforces single review constraint per issue.
    4. Creates `Feedback` record.

- **Database Model (`backend/src/models/Feedback.js`):**
  ```javascript
  {
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true, unique: true, index: true },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
  }
  ```

- **Acceptance Criteria (Definition of Done):**
  - [ ] Citizens cannot leave feedback on un-resolved issues.
  - [ ] Only one feedback entry allowed per issue; subsequent attempts return 409 Conflict.
  - [ ] Non-reporters are blocked from submitting feedback on someone else's issue.

- **Trello Metadata:**
  - **Phase:** Phase 4 | **Priority:** P1 | **Story Points:** 3 | **Dependencies:** TASK-02

---

### [DEPT-01] Department CRUD & Manager Assignment (Admin)
- **User Story:**
  > As an **Administrator**,  
  > I want to create and manage municipal departments and designate department managers,  
  > so that issues and maintenance teams are organized under official government entities.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/(admin)/departments/page.jsx`: Department directory using **Motion Brew `BentoGrid`** cards.
  - `frontend/src/components/admin/DepartmentFormModal.jsx`: **Motion Brew `DialogSpring`** modal to add/edit department name, code, and description.
  - `frontend/src/components/admin/AssignManagerModal.jsx`: **Motion Brew `DialogSpring`** user search modal to promote a user to manager of the department.
  - Action buttons powered by **Motion Brew `MagneticButton`**.

- **Backend API & Logic:**
  - `GET /api/v1/departments`: Retrieves active departments with populated manager names and issue counters.
  - `POST /api/v1/departments`: Admin-only endpoint creating new Department.
  - `PATCH /api/v1/departments/:id`: Updates name/description.
  - `PATCH /api/v1/departments/:id/manager`: Updates department manager; sets user's `role: 'manager'` and `department: departmentId`.
  - `PATCH /api/v1/departments/:id/deactivate`: Soft-deactivates department (`isActive: false`).

- **Acceptance Criteria (Definition of Done):**
  - [ ] Only users with role `admin` can create or deactivate departments.
  - [ ] Assigning a manager updates both the Department document and the target User's `role` and `department`.

- **Trello Metadata:**
  - **Phase:** Phase 4 | **Priority:** P0 | **Story Points:** 5 | **Dependencies:** AUTH-02

---

### [USER-01] Municipal User Management & Staff Provisioning (Admin)
- **User Story:**
  > As an **Administrator**,  
  > I want to provision staff and manager accounts, assign them to departments, and deactivate accounts,  
  > so that municipal personnel can be securely onboarded and managed.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/(admin)/users/page.jsx`: User management console with **Motion Brew `DataTableSpring`** and **Motion Brew `FilterPillsGroup`** role filters.
  - `frontend/src/components/admin/CreateUserModal.jsx`: **Motion Brew `DialogSpring`** modal with staff provisioning form.
  - `frontend/src/components/admin/UserStatusToggle.jsx`: Animated switch toggle with smooth spring thumb glide.
  - Submissions powered by **Motion Brew `MagneticButton`**.

- **Backend API & Logic:**
  - `GET /api/v1/users`: Paginated user list with role and department filters.
  - `POST /api/v1/users`: Admin endpoint provisioning staff or manager with pre-hashed password.
  - `PATCH /api/v1/users/:id`: Updates user role, department, or active status.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Non-admin accounts cannot access user administration endpoints.
  - [ ] Admin cannot deactivate their own account.

- **Trello Metadata:**
  - **Phase:** Phase 4 | **Priority:** P0 | **Story Points:** 5 | **Dependencies:** AUTH-02, DEPT-01

---

# Epic 5: Geospatial Interactive Map & City Analytics Engine (Phase 5)

---

### [MAP-01] Interactive Public & Management Issue Map with Category Pins & Clustering
- **User Story:**
  > As a **Citizen, Manager, or Admin**,  
  > I want to explore city infrastructure problems on an interactive map with category-specific pins, status filters, and clustering,  
  > so that I can visualize hot spots and spatial distribution of public works across the city.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/map/page.jsx`: Full-screen GIS inspection console.
  - `frontend/src/components/map/CityIssueMap.jsx`: **Motion Brew `InteractiveMapPinPulse`** React-Leaflet map with custom category pins:
    - Road Damage: 🔴 Red pulse
    - Streetlight: 🟡 Yellow pulse
    - WASA Drainage: 🔵 Blue pulse
    - Footpath / Civil: 🟣 Purple pulse
    - Waste Management: 🟢 Green pulse
    - Public Infrastructure: ⚪ Slate pulse
  - `frontend/src/components/map/IssueMarkerPopup.jsx`: **Motion Brew `MotionCard`** popup displaying thumbnail, title, status pill, and link to details.
  - `frontend/src/components/map/MapLayerFilterBar.jsx`: **Motion Brew `Dock`** floating bottom control toggling categories and status filters.

- **Backend API & Logic:**
  - `GET /api/v1/issues`: Returns lightweight geospatial array `[{ _id, title, category, status, priority, location }]` filtered by bounding box or active filters.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Pins render accurately based on GeoJSON `coordinates: [lng, lat]`.
  - [ ] Marker clustering groups dense pins cleanly without browser lag on 100+ points.
  - [ ] Clicking a popup navigates to the authorized issue detail view.

- **Trello Metadata:**
  - **Phase:** Phase 5 | **Priority:** P1 | **Story Points:** 5 | **Dependencies:** CITIZEN-02, MGT-01

---

### [METRIC-01] City-Wide Executive Analytics Dashboard (Recharts)
- **User Story:**
  > As an **Administrator or Department Manager**,  
  > I want an executive analytics dashboard displaying key infrastructure health indicators and trend graphs,  
  > so that municipal leaders can make data-driven resource allocation decisions.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/(admin)/analytics/page.jsx` & `frontend/src/app/(manager)/department-dashboard/page.jsx`.
  - `frontend/src/components/analytics/KpiMetricCard.jsx`: **Motion Brew `SpotlightCard`** displaying: Total Issues, Pending Triages, Active Repairs, Resolved Complaints, and Average Resolution Time with **Motion Brew `RollingNumber`** spring transitions.
  - `frontend/src/components/analytics/MonthlyTrendsChart.jsx`: Recharts Area/Line chart comparing monthly reported vs resolved issues with smooth ease-in curves.
  - `frontend/src/components/analytics/CategoryPieChart.jsx`: Recharts Donut chart visualizing distribution across the 6 infrastructure categories.
  - `frontend/src/components/analytics/StatusBreakdownBar.jsx`: Horizontal stacked bar chart showing volume across the 6 lifecycle stages.

- **Backend API & Logic:**
  - `GET /api/v1/analytics/overview`: Aggregates total issues, count by status, and active tasks.
  - `GET /api/v1/analytics/monthly-trends`: MongoDB aggregation grouping reports by year-month over the past 12 months.
  - `GET /api/v1/analytics/category-distribution`: Aggregates issue count grouped by `category`.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Department Managers only see analytics scoped to their assigned department.
  - [ ] Admins see complete city-wide totals and can toggle department-specific views.
  - [ ] Aggregation queries run in under 300ms using indexed MongoDB pipelines.

- **Trello Metadata:**
  - **Phase:** Phase 5 | **Priority:** P1 | **Story Points:** 5 | **Dependencies:** MGT-01, TASK-02

---

### [METRIC-02] Department Performance & Resolution Time SLA Analytics
- **User Story:**
  > As an **Administrator**,  
  > I want to compare performance metrics and average resolution hours across all municipal departments,  
  > so that slow-responding departments and bottlenecks can be identified.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/components/analytics/DepartmentPerformanceBar.jsx`: Bar chart comparing resolution percentage across departments.
  - `frontend/src/components/analytics/ResolutionTimeCard.jsx`: **Motion Brew `MotionCard`** displaying average hours from `Submitted` to `Resolved` with dynamic color thresholds.
  - `frontend/src/components/analytics/SatisfactionScoreCard.jsx`: Average citizen rating (1.0 to 5.0) per department with star progress gauge.

- **Backend API & Logic:**
  - `GET /api/v1/analytics/department-performance`: MongoDB aggregation calculating total assigned issues, resolution rate %, average resolution time, and citizen rating average.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Calculation correctly excludes open/unresolved issues from average resolution time.
  - [ ] Departments with zero resolved issues handle null values gracefully without throwing NaN.

- **Trello Metadata:**
  - **Phase:** Phase 5 | **Priority:** P1 | **Story Points:** 5 | **Dependencies:** METRIC-01, TASK-03

---

# Epic 6: Notifications, Activity Stream & System Polish (Phase 6)

---

### [NOTIF-01] In-App Notification Engine & Bell Dropdown Feed
- **User Story:**
  > As an **Authenticated User**,  
  > I want to receive in-app notifications whenever my issue status changes or a task is assigned to me,  
  > so that I am immediately aware of relevant municipal actions.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/components/notifications/NotificationBell.jsx`: Header bell icon with **Motion Brew `BeaconPulse`** unread counter badge.
  - `frontend/src/components/notifications/NotificationDropdown.jsx`: **Motion Brew `DrawerSpring` / `DialogSpring`** feed displaying recent alerts with relative time and read toggles.
  - `frontend/src/components/notifications/NotificationItem.jsx`: **Motion Brew `MotionCard`** row with smooth dismiss gesture and click routing to target issue or task.

- **Backend API & Logic:**
  - `GET /api/v1/notifications`: Retrieves user's notifications sorted by `createdAt: -1`.
  - `PATCH /api/v1/notifications/:id/read`: Marks individual notification as `isRead: true`.
  - `PATCH /api/v1/notifications/mark-all-read`: Bulk updates all unread notifications for current user.

- **Database Model (`backend/src/models/Notification.js`):**
  ```javascript
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['status_change', 'task_assigned', 'feedback_received', 'system'], default: 'status_change' },
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
    isRead: { type: Boolean, default: false, index: true },
    createdAt: { type: Date, default: Date.now, index: true }
  }
  ```

- **Acceptance Criteria (Definition of Done):**
  - [ ] Unread notification count updates accurately on page loads.
  - [ ] Clicking a notification marks it as read and redirects to the relevant issue.

- **Trello Metadata:**
  - **Phase:** Phase 6 | **Priority:** P1 | **Story Points:** 5 | **Dependencies:** MGT-03, TASK-01

---

### [ACT-01] System-Wide Activity Log Stream
- **User Story:**
  > As an **Administrator**,  
  > I want to inspect a centralized chronological audit log of all system actions,  
  > so that administrative and operational accountability is maintained.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/app/(admin)/activity/page.jsx`: Admin activity log console with user and action type filters.
  - `frontend/src/components/admin/ActivityLogList.jsx`: **Motion Brew `TimelineStepperSpring`** feed of municipal actions with actor roles and timestamps.

- **Backend API & Logic:**
  - `GET /api/v1/activity`: Admin-only endpoint returning paginated `ActivityLog` records.
  - `logActivity(userId, action, entityType, entityId, meta)` utility invoked across all critical write operations.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Only Admins can view the activity log.
  - [ ] Logs capture user identity, action description, and timestamp.

- **Trello Metadata:**
  - **Phase:** Phase 6 | **Priority:** P2 | **Story Points:** 3 | **Dependencies:** AUTH-02

---

### [UI-01] Comprehensive Empty, Loading, Error & Responsive State Polish
- **User Story:**
  > As a **User on any device (Mobile, Tablet, Desktop)**,  
  > I want consistent loading skeletons, informative error alerts, and clean empty states across every screen,  
  > so that the platform feels reliable, professional, and responsive.

- **Frontend Architecture & Motion Brew Components:**
  - `frontend/src/components/ui/LoadingSkeleton.jsx`: Shimmering skeleton cards for tables, lists, and maps.
  - `frontend/src/components/ui/EmptyState.jsx`: **Motion Brew `MotionCard`** illustrated empty states (e.g. "No issues reported yet", "All caught up on tasks!").
  - `frontend/src/components/ui/ErrorAlert.jsx`: **Motion Brew `ToastSpringNotification`** alerts for failed API network calls.
  - Mobile responsiveness audit:
    - Tables switch to mobile card view on `< 768px` viewports.
    - Navigation transforms to accessible **Motion Brew `DrawerSpring`** mobile menu.
    - Floating action buttons optimized for touch targets ($> 44\times 44\text{px}$).

- **Acceptance Criteria (Definition of Done):**
  - [ ] Zero layout overflows or unstyled content flashes on mobile viewport tests (375px width).
  - [ ] Every page implements distinct Loading, Error, Empty, and Success states.

- **Trello Metadata:**
  - **Phase:** Phase 6 | **Priority:** P1 | **Story Points:** 5 | **Dependencies:** All previous frontend stories

---

# Epic 7: Database Seeding & Testing Data Engine (Phase 7)

---

### [SEED-01] Production-Fidelity Database Seeder with Real Chittagong Geospatial Data
- **User Story:**
  > As a **Developer / Evaluator**,  
  > I want an automated seed script that populates the database with realistic demo accounts, departments, staff, issues, and real Chittagong coordinates,  
  > so that the complete GovTech workflow can be demonstrated and tested instantly.

- **Seed Script Deliverable (`backend/src/seed/seed.js`):**
  - **4 Standard Demo Accounts:**
    - `admin@civicpulse.com` / `Password123!` (Role: Admin)
    - `manager@civicpulse.com` / `Password123!` (Role: Department Manager — Road Maintenance)
    - `staff@civicpulse.com` / `Password123!` (Role: Maintenance Staff — Road Maintenance)
    - `citizen@civicpulse.com` / `Password123!` (Role: Citizen)
  - **5+ Official Departments:**
    - Road Maintenance Department (`ROAD`)
    - Electrical & Public Lighting Division (`ELEC`)
    - Water & Sewerage Authority (`WASA`)
    - Sidewalk & Civil Works (`CIVIL`)
    - Waste & Sanitation Division (`WASTE`)
  - **20+ Maintenance Staff:** Assigned evenly across departments with realistic names.
  - **100+ Realistic Issues:** Distributed across categories and lifecycle statuses.
  - **30+ Real Chittagong Coordinate Locations:** Real-world coordinates spanning GEC Circle (`22.3587, 91.8215`), Agrabad Commercial Area (`22.3256, 91.8123`), Nasirabad, Chawkbazar, Halishahar, Bahaddarhat, and Port Access Road.
  - **Complete Relational History:** Generates associated `IssueStatusHistory`, `Task`, `Feedback`, and `Notification` documents.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Running `npm run seed` in `backend/` completely resets and seeds database in under 15 seconds.
  - [ ] Logging in with any of the 4 demo accounts grants immediate access to pre-populated role dashboards.
  - [ ] The interactive map displays realistic clusters across the Chittagong metropolitan area.

- **Trello Metadata:**
  - **Phase:** Phase 7 | **Priority:** P0 | **Story Points:** 5 | **Dependencies:** All backend models

---

# Epic 8: Bonus Capabilities & Infrastructure Deployment (Phase 8 & 9)

---

### [BONUS-01] Printable / Downloadable PDF Issue Report Generator
- **User Story:**
  > As an **Administrator or Citizen**,  
  > I want to generate a formal PDF report of an issue including photo proof, location map, status history, and resolution metrics,  
  > so that municipal records can be archived or printed for official government audits.

- **Frontend & PDF Scope:**
  - `frontend/src/components/invoice/IssueReportPDF.jsx`: Printable document layout or `@react-pdf/renderer` template featuring:
    - Official CivicPulse GovTech header with date and tracking ID.
    - Citizen complaint details and category badge.
    - Evidence photos (before and completion photos).
    - Chronological resolution audit table.
  - `frontend/src/components/ui/DownloadPdfButton.jsx`: **Motion Brew `MagneticButton`** with instant client-side download and loading progress.

- **Acceptance Criteria (Definition of Done):**
  - [ ] PDF generates cleanly within 2 seconds without layout clipping.
  - [ ] Formatted cleanly for standard A4 printing.

- **Trello Metadata:**
  - **Phase:** Phase 8 | **Priority:** P2 | **Story Points:** 5 | **Dependencies:** CITIZEN-03, TASK-02

---

### [INFRA-01] Cloud Deployment, Environment Hardening & Security Audit
- **User Story:**
  > As a **DevOps Engineer**,  
  > I want to deploy the frontend to Vercel and backend to Render/Railway with MongoDB Atlas network access and environment hardening,  
  > so that CivicPulse is publicly accessible with production-grade security and zero cross-origin cookie issues.

- **Deliverables & Verification:**
  - **Frontend Deployment:** Vercel deployment with Next.js rewrites or cross-domain `SameSite=None; Secure` cookie configurations.
  - **Backend Deployment:** Render or Railway deployment with auto-restart, health check polling, and environment variable bindings.
  - **Database Security:** MongoDB Atlas whitelist configured for cloud host IP ranges.
  - **Security Audit:** Helmet enabled, rate limiters on auth, NoSQL query sanitization, 0 plain-text passwords.

- **Acceptance Criteria (Definition of Done):**
  - [ ] Live URL is fully operational and passes end-to-end user tests across all 4 roles.
  - [ ] Authentication cookies persist reliably across page transitions and reloads on the production domain.
  - [ ] Repository contains zero hardcoded secrets or sensitive API credentials.

- **Trello Metadata:**
  - **Phase:** Phase 9 | **Priority:** P0 | **Story Points:** 5 | **Dependencies:** All previous epics

---

# Complete Master Backlog Index & Estimation Matrix

| Card ID | Card Title | Epic / Phase | Tier / Role | Priority | Story Points | Motion Brew Component Foundation |
| :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **SETUP-01** | Express.js Architecture, DB & Security | Phase 0: Setup | Backend / Infra | P0 | 3 | Centralized API envelope |
| **SETUP-02** | Next.js App Router, Tailwind & Motion Brew | Phase 0: Setup | Frontend / UI | P0 | 3 | `MagneticButton`, `TabBar`, `BlurText`, `MotionCard` |
| **AUTH-01** | JWT Cookie Authentication & Sessions | Phase 1: Auth | Full-Stack | P0 | 5 | `AuthCard` (Animated SVG icons, `RollText`) |
| **AUTH-02** | Role-Based Guards & Dashboard Redirect | Phase 1: Auth | Full-Stack | P0 | 3 | `MotionCard` unauthorized fallback screen |
| **AUTH-03** | User Profile Management & Security | Phase 1: Auth | Full-Stack | P1 | 3 | `TabBar` tabs, `FileDropzoneAnimated`, `MagneticButton` |
| **CITIZEN-01**| Citizen Issue Submission with Cloudinary | Phase 2: Citizen | Full-Stack | P0 | 8 | `FileDropzoneAnimated`, `FilterPillsGroup`, `MotionCard` |
| **CITIZEN-02**| Leaflet Map Picker & Reverse Geocoding | Phase 2: Citizen | Frontend / Map | P0 | 5 | `DialogSpring`, `InteractiveMapPinPulse`, `MagneticButton` |
| **CITIZEN-03**| Citizen 'My Reports' & Timeline Tracking | Phase 2: Citizen | Full-Stack | P1 | 5 | `CardHover`, `TimelineStepperSpring`, `StatusBadgePulse` |
| **MGT-01** | Role-Scoped Issue Management Board | Phase 3: Management| Full-Stack | P0 | 5 | `DataTableSpring`, `FilterPillsGroup`, `PaginationBarSpring` |
| **MGT-02** | Issue Verification, Priority & Routing | Phase 3: Management| Full-Stack | P0 | 3 | `DialogSpring`, `MotionCard` radio priority cards |
| **MGT-03** | Deterministic Status Transition Service | Phase 3: Management| Backend / Logic | P0 | 5 | Workflow audit & notification trigger |
| **MGT-04** | Proximity Duplicate Issue Detection | Phase 3: Management| Full-Stack / Geo | P1 | 5 | `AlertBannerBounce`, `BeforeAfterSlider` comparison modal |
| **TASK-01** | Task Creation & Workload Assignment | Phase 4: Teams | Full-Stack | P0 | 5 | `DialogSpring`, `StatusBadgePulse`, `BentoGrid` |
| **TASK-02** | Staff Task Execution & Resolution Proof | Phase 4: Teams | Full-Stack | P0 | 8 | `FileDropzoneAnimated`, `DrawerSpring`, `MagneticButton` |
| **TASK-03** | Citizen Feedback & Star Rating | Phase 4: Teams | Full-Stack | P1 | 3 | `DialogSpring`, `StarRatingInteractive`, `MotionCard` |
| **DEPT-01** | Department CRUD & Manager Assignment | Phase 4: Teams | Full-Stack | P0 | 5 | `BentoGrid`, `DialogSpring`, `MagneticButton` |
| **USER-01** | Municipal User Management & Provisioning | Phase 4: Teams | Full-Stack | P0 | 5 | `DataTableSpring`, `FilterPillsGroup`, `DialogSpring` |
| **MAP-01** | Interactive Public & Management Issue Map | Phase 5: Map/Metrics| Frontend / Map | P1 | 5 | `InteractiveMapPinPulse`, `MotionCard` popup, `Dock` |
| **METRIC-01**| Executive Analytics Dashboard (Recharts)| Phase 5: Map/Metrics| Full-Stack | P1 | 5 | `SpotlightCard`, `RollingNumber`, Recharts curves |
| **METRIC-02**| Department Performance & SLA Analytics | Phase 5: Map/Metrics| Backend / Analytics| P1 | 5 | `MotionCard` radial gauge, SLA percentage bars |
| **NOTIF-01** | In-App Notification Engine & Bell Feed | Phase 6: Polish | Full-Stack | P1 | 5 | `BeaconPulse`, `DrawerSpring`, `MotionCard` rows |
| **ACT-01** | System-Wide Activity Log Stream | Phase 6: Polish | Backend / Admin | P2 | 3 | `TimelineStepperSpring` audit log |
| **UI-01** | Empty, Loading, Error & Responsive Polish| Phase 6: Polish | Frontend / UI | P1 | 5 | `ShimmerSkeleton`, `EmptyStateSpring`, `ToastSpringNotification` |
| **SEED-01** | Production Database Seeder (Chittagong) | Phase 7: Seed | Backend / DB | P0 | 5 | Comprehensive demo accounts and real coordinates |
| **BONUS-01**| Printable / Downloadable PDF Report | Phase 8: Bonus | Full-Stack / PDF | P2 | 5 | `@react-pdf/renderer`, `MagneticButton` |
| **INFRA-01** | Cloud Deployment, Hardening & Security | Phase 9: Deploy | DevOps / Security | P0 | 5 | Vercel, Render/Railway, MongoDB Atlas whitelist |

**Total Estimated Story Points:** ~120 points (structured cleanly across agile delivery sprints).
