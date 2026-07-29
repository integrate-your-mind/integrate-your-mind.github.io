# Terminal Lean kernel receipt

This receipt covers the exact end-to-end theorem
`DimensionTwoCounterexample.Final.fullCounterexample`.

## Provenance lock

- Verification source commit:
  `ab26ce21e3b272eec73908d5ed2f8b10117f2e38` on pushed branch
  `partial-verification-2026-07-26`. Later documentation-only reconciliation
  does not alter the Lean source digests recorded below.
- Original verification date: 2026-07-26, America/New_York.
- Host/toolchain: Apple arm64, Lean `v4.28.0`, Mathlib `v4.28.0`.
- The commands below succeeded against the then-present pinned `.lake` cache.
  That cache was safely removed after proof completion; all `.olean` hashes in
  this receipt are historical provenance, and no fresh local cache-free replay
  is currently claimed.
- `SOURCE_DIGESTS.sha256` is the machine-checkable manifest for every Lean
  source plus the pinned toolchain and Lake configuration. From the repository
  root, verify it with `shasum -a 256 -c SOURCE_DIGESTS.sha256`.
- A separate digest-locked Harmonic Aristotle replay completed the same four
  commands successfully in an independent environment. Its exact project,
  task, dependency-normalization caveat, and statement audit are preserved in
  `ARISTOTLE_RECEIPT.md`.

## Locked environment

- Lean: `v4.28.0` from `lean-toolchain`
- Mathlib: `v4.28.0` from `lakefile.toml` and `lake-manifest.json`
- Source theorem:
  `DimensionTwoCounterexample/FinalTheorem.lean`
- Root import:
  `DimensionTwoCounterexample.lean`

## Successful kernel commands

Run from the repository root:

```text
lake build +DimensionTwoCounterexample.GeometricBridge
```

Result: exit `0`, `8033/8033` jobs.

```text
lake build +DimensionTwoCounterexample.FinalTheorem
```

Result: exit `0`, `8036/8036` jobs.

```text
lake build DimensionTwoCounterexample
```

Result: exit `0`, `8040/8040` jobs.

```text
lake env lean KernelAudit.lean
```

Result: exit `0`:

```text
DimensionTwoCounterexample.Final.fullCounterexample :
  DimensionTwoCounterexample.Final.FullCounterexampleStatement
'DimensionTwoCounterexample.Final.fullCounterexample' depends on axioms:
  [propext, Classical.choice, Quot.sound]
```

These are Lean's standard foundational axioms; no project-defined axiom is in
the dependency list.

## Independent remote replay

Harmonic Aristotle project `97ef7042-8c3b-42cd-b52f-66cbb590a41a`, terminal
task `d88c517d-a5f4-43db-93a3-c17304d3e7e6`, independently matched all Lean
source digests and all resolved dependency revisions, then reproduced the
`8033/8033`, `8036/8036`, `8040/8040`, and `KernelAudit.lean` successes. Its
terminal axiom output was again
`[propext, Classical.choice, Quot.sound]`. This external receipt corroborates
but does not replace the original local kernel receipt. See
`ARISTOTLE_RECEIPT.md` for the complete boundary.

## Exact digests

| Artifact | SHA-256 |
|---|---|
| `DimensionTwoCounterexample/GeometricBridge.lean` | `6d3ed483a0d0916b00757e3e9750393f1107a8d5043bbd4abd81036fa461f7bc` |
| `GeometricBridge.olean` | `10ecd28eaa3fb7f47a9414a28c6acca0fb9a3ec8d707ad0c637f3d29c645f21b` |
| `DimensionTwoCounterexample/FinalTheorem.lean` | `ca128a032c7b715ec2c909da23035fa5446430fae4a4d0e6d447652e3ac3cbb2` |
| `FinalTheorem.olean` | `40720f14c84fd712c49ac8fdf9fde9cc66c9b0fab3dc7352093e29690aecc0bd` |
| `DimensionTwoCounterexample.lean` | `897ffd99c619046bff2603075bb608ff6a30fd1ffa87162cc0c3873557e327f4` |
| root `DimensionTwoCounterexample.olean` | `c8c15f7b11207dd959c6c03b724706ffeb3a3a2cae04917a8813fd4c634a7e32` |
| `KernelAudit.lean` | `3257426a0299331fe564d787312208efeb43363326da6531f8d6aceea9ac1bac` |

## Source audit

The terminal audit searched the complete project Lean source for declarations
or proof bodies containing `sorry`, `admit`, custom `axiom`, or `unsafe`.
It found none. `Check.lean`, which contained exploratory API checks, was
replaced by the reproducible `KernelAudit.lean`.

## Statement audit

The checked proposition is the exact characteristic-two counterexample over
`k = AlgebraicClosure (ZMod 2)`. It includes the explicit map, origin and
Jacobian identities, the three-point collision, scheme-level étaleness,
algebraic independence of `P,Q`, function-field finrank and finite separable
degree equal to three, the literal geometric generic-fiber equivalence and
cardinality three, coprimality with two, coordinate-ring nonsurjectivity, and
non-isomorphism of the affine morphism. The separate structural derivation in
the supplied proof is imported by the root library.
