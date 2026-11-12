# Account preview implementation

Routes: /login, /create-account, /account, /account/orders, /account/details. /register redirects to /create-account. Signed-out account routes show sign-in rather than account content.

The project has no authentication, customer, or order API configured. This implementation is a clearly labelled browser-only preview. It does not provide server-side authentication, production authorization, cross-device accounts, email verification, password recovery, or real order fulfilment. Before production, replace AccountService and OrderService persistence with authenticated server APIs and server-side ownership checks.

Preview account credentials use per-account random salts and PBKDF2 SHA-256 (150,000 iterations); plaintext passwords are not persisted. Profiles and order snapshots are stored locally; tab sessions use sessionStorage. Browser storage remains user-controlled and is not a production security boundary. UI asks shoppers to use a demo password.

Order history contains orders placed while signed in to that account. Guest receipts are not automatically attached to later logins. Profile email changes update the sign-in identifier. Name/contact/address details prefill pristine empty checkout fields. Order snapshots retain product lines and totals without checkout contact data.

Validation: account creation, duplicate/wrong credentials, profile editing and re-login, account-specific order snapshots, deduplication, guest exclusion, signed-out rendering, and existing checkout regression tests.

Shopping flow: successful login and signup return to /. Signed-in visitors to auth routes also return home. Header avatar menu links to overview, orders/reorder, settings and sign-out; outside click and Escape dismiss it. Auth screens omit shopping header, trust strip, footer and bottom navigation. Reorder resolves current catalogue IDs/titles, uses current prices and original quantities, preserves existing basket lines, reports unavailable items, and prevents repeating the same action within the view.

Built-in preview login: demo@alamin.test / AlAmin@123. The account is created locally on first login attempt, uses the normal password hash verification, and is not automatically signed in. Existing matching accounts and edited profiles are not overwritten. The login page displays these public demo credentials and offers a fill button.
