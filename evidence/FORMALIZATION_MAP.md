# Informal proof to Lean theorem map

This file records how each part of `source-solution.txt` is represented by the
checked Lean development. It is a reader guide, not an additional proof
assumption.

## Exact objects

- The informal field \(k=\overline{\mathbb F}_2\) is
  `Final.k = AlgebraicClosure (ZMod 2)`.
- The informal source field \(k(x,y)\) is
  `Final.SourceFunctionField = FractionRing Final.SourceRing`.
- The informal target field \(k(P,Q)\) is the literal intermediate field
  `Final.TargetFunctionField = IntermediateField.adjoin k (Set.range
  Final.targetFamily)`.
- The polynomial map is represented contravariantly by
  `Final.coordinateRingHom : TargetRing →+* SourceRing` and geometrically by
  `Final.affineMap = AlgebraicGeometry.Spec.map coordinateRingHom`.

Consequently, the displayed informal equality

\[
[k(x,y):k(P,Q)]=3
\]

is represented exactly by

```lean
Module.finrank TargetFunctionField SourceFunctionField = 3
```

and its separable embedding count by

```lean
Field.finSepDegree TargetFunctionField SourceFunctionField = 3
```

## Section-by-section correspondence

| Informal section | Principal checked declarations |
|---|---|
| 1. Constant Jacobian | `Generic.pderiv_x_P`, `Generic.pderiv_y_P`, `Generic.pderiv_x_Q`, `Generic.pderiv_y_Q`, `Generic.jacobian_det`, `Final.jacobian_at_origin` |
| 2. Explicit noninjectivity | `Final.collision_01_10`, `Final.collision_01_11`, `Final.sourcePoint_01_ne_10`, `Final.sourcePoint_01_ne_11`, `Final.coordinateRingHom_not_surjective`, `Final.affineMap_not_isIso` |
| 3. Compact form | `Generic.P_compact`, `Generic.Q_compact`, together with the definitions of `Generic.q`, `Generic.u`, and `Generic.w` |
| 4. Recovery identities | `Generic.recovery_x`, `Generic.recovery_q`, all denominator theorems in `Reconstruction`, and `Reconstruction.recover_x`, `recover_q`, `recover_y` |
| 5. Cubic inverse equation | `Generic.cubic_root`, `Reconstruction.cubic_root_mapped`, `FieldExtension.cubic`, and `FieldExtension.cubic_root` |
| 6. Recovery of the source field | `FieldExtension.adjoin_hidden_eq_top`, `FieldExtension.algebraic_over_E`, and `FieldExtension.algebraic_independent_target` |
| 7. Irreducibility over the actual target field | `GenericCubic.cubicOverF_irreducible`, the explicit coefficient transport in `ActualIrreducibility`, and `ActualIrreducibility.cubic_irreducible` |
| 8. Separability and degree | `DegreeFromIrreducible.minpoly_eq_cubic`, `finrank_eq_three`, `cubic_separable`, `extension_isSeparable`, `finSepDegree_eq_three`, and `finrank_coprime_two` |
| 9. Direct elimination certificate | `Generic.elimination_cubic` and `Certificate.elimination_cubic` |
| Structural derivation | The coordinate-change, conjugation, preserved-coordinate, and fiber theorems in `DimensionTwoCounterexample/Structural.lean` |

## Étale and geometric-degree bridge

The informal assertion that the Keller map is étale is represented by the
Mathlib scheme predicate

```lean
AlgebraicGeometry.Etale affineMap
```

It is proved by `EtalePresentation.affineMap_etale` through an explicit graph
presentation.

The informal phrase “geometric degree three” is not inferred merely from the
field degree. The development defines the geometric generic fiber as the
pullback of `affineMap` along the algebraic-closure-valued generic point and
defines `GeometricGenericFiberPoint` as its sections. `GeometricBridge` then
proves both

```lean
GeometricGenericFiberPoint ≃
  (SourceFunctionField →ₐ[TargetFunctionField] GeometricClosure)
```

and

```lean
Nat.card GeometricGenericFiberPoint = 3
```

This is the separate scheme-theoretic bridge connecting the separable
function-field calculation to the literal geometric generic-fiber count.

## Terminal theorem

`Final.FullCounterexampleStatement` contains the exact conjunction of the
base-field, explicit-map, Jacobian, collision, étale, algebraic-independence,
degree, separability, geometric-fiber, coprimality, and noninvertibility
claims. `Final.fullCounterexample` proves that proposition.

The concluding description as a counterexample is the mathematical
interpretation of those checked conditions. The external literature statement
of the separable Jacobian conjecture is cited in the prose source; it is not
introduced into Lean as an additional axiom.
