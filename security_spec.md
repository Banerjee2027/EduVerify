# Security Specification for EduVerify

## Data Invariants
1. A user can only access their own private data.
2. Achievements must belong to a valid user.
3. Only users with the `educator` role can verify achievements.
4. Students cannot change the `status` of their achievements to 'verified' themselves.
5. All IDs and string fields must have size limits.

## The "Dirty Dozen" Payloads (Denial Expected)
1. User profile creation with `role: 'admin'` by a non-admin.
2. Achievement creation with `status: 'verified'` by a student.
3. Achievement update to `status: 'verified'` by the student owner.
4. Achievement creation with a 1MB string in `title`.
5. Achievement update by a user who does not own the document.
6. Reading another user's profile if they are not an educator.
7. Deleting a 'verified' achievement (immutable outcome).
8. Setting `userId` to a different user's UID on creation.
9. Injecting a ghost field `isSystemAdmin: true` into a profile.
10. Update achievement with `affectedKeys()` targeting `userId`.
11. Querying all achievements without a `userId` filter (as a student).
12. Creating a user profile with an invalid email format/size.

## Test Runner (Conceptual)
All tests in `firestore.rules.test.ts` will verify that these payloads result in `PERMISSION_DENIED`.
