# Independent Aristotle/Harmonic terminal receipt

This receipt records the independent read-only replay of the complete
dimension-two characteristic-two counterexample. It is external corroboration;
the authoritative local theorem and original kernel receipt remain
`DimensionTwoCounterexample.Final.fullCounterexample` and
`KERNEL_RECEIPT.md`.

## Terminal audit identity

- Service: Harmonic Aristotle.
- Project: `97ef7042-8c3b-42cd-b52f-66cbb590a41a`.
- Terminal task: `d88c517d-a5f4-43db-93a3-c17304d3e7e6`.
- Result: `COMPLETE`, `READ-ONLY TERMINAL AUDIT: PASS`.
- Completed: 2026-07-29 UTC (2026-07-28 America/New_York).
- Verification source commit:
  `ab26ce21e3b272eec73908d5ed2f8b10117f2e38`.

The submitted working tree was an exact `git archive` of the private source
commit, so Aristotle's wrapper repository had a different Git commit identity.
Source identity was therefore established from the complete digest set rather
than from the wrapper commit. All 14 library Lean source files plus
`KernelAudit.lean`, `lean-toolchain`, and `lakefile.toml` matched the expected
values now recorded in `SOURCE_DIGESTS.sha256`.

## Environment reconciliation

- Lean: `v4.28.0`, commit
  `7e01a1bf5c70fc6167d49c345d3bf80596e9a79b`.
- Mathlib: `v4.28.0`, commit
  `8f9d9cff6bd728b17a24e163c9402775d9e6a365`.
- Aristotle normalized `lake-manifest.json` to path-package entries, changing
  its byte digest from the preserved source value
  `dd6bab0b88ca455b3324ea29599b0286a858bd910a1aacb6fa90b8af633b1265`
  to
  `3e3810c9ef7d34fe20a596f78aaad4c5f5a575d1233fe954acb6f7807b223483`.
  Read-only inspection of the resolved checkouts found the exact same package
  revisions:

| Package | Revision |
|---|---|
| `mathlib` | `8f9d9cff6bd728b17a24e163c9402775d9e6a365` |
| `plausible` | `55c8532eb21ec9f6d565d51d96b8ca50bd1fbef3` |
| `LeanSearchClient` | `c5d5b8fe6e5158def25cd28eb94e4141ad97c843` |
| `importGraph` | `85b59af46828c029a9168f2f9c35119bd0721e6e` |
| `proofwidgets` | `be3b2e63b1bbf496c478cef98b86972a37c1417d` |
| `aesop` | `f642a64c76df8ba9cb53dba3b919425a0c2aeaf1` |
| `Qq` | `b8f98e9087e02c8553945a2c5abf07cec8e798c3` |
| `batteries` | `495c008c3e3f4fb4256ff5582ddb3abf3198026f` |
| `Cli` | `4f10f47646cb7d5748d6f423f4a07f98f7bbcc9e` |

Thus the manifest difference was service setup normalization, not a dependency
revision change.

## Independent kernel commands

Run from the uploaded repository root:

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

Result: exit `0`. Aristotle reported:

```text
DimensionTwoCounterexample.Final.fullCounterexample :
  DimensionTwoCounterexample.Final.FullCounterexampleStatement
'DimensionTwoCounterexample.Final.fullCounterexample' depends on axioms:
  [propext, Classical.choice, Quot.sound]
```

## Independent statement audit

The remote audit found no declaration or proof body using `sorry`, `admit`,
custom `axiom`, `unsafe`, or `native_decide`. Textual matches occurred only in
comments explaining that those shortcuts are absent.

It separately compared the terminal statement and assembly with the archived
`source-solution.txt` at verification commit `ab26ce21…` and confirmed the
explicit characteristic-two map, origin and Jacobian identities, three-point
collision, scheme-level étaleness, algebraic independence, actual-field cubic
irreducibility, minpoly and finrank three, separability and finite separable
degree three, the literal geometric generic-fiber equivalence and cardinality
three, coprimality with two, coordinate-ring nonsurjectivity, and failure of
`IsIso`. It found no weakened, substitute, or bypass theorem.

The current `source-solution.txt` was cleaned and clarified after the
submission without changing any Lean source. Its mathematical delta and exact
theorem correspondence were reviewed separately; those editorial changes are
not represented as part of Aristotle's archived-prose comparison.

The builds emitted linter warnings only; there were no kernel errors. The
remote task made no source or documentation edits and performed no commit,
push, fetch, or pull request.

## Precursor audit attempts

Two precursor tasks in the same project terminated before compilation:

- `c15672ae-5680-4d80-9b73-e25c4c286795` rejected the Aristotle wrapper
  commit because the private source commit object was unavailable.
- `614ddc54-378c-4144-b346-da606c8a89f2` correctly found the
  service-normalized `lake-manifest.json` byte mismatch and stopped before the
  semantic dependency comparison was specified.

Neither precursor result challenged the mathematical source. The terminal task
resolved both provenance questions explicitly before running Lean.
