# Publication receipt

Release prepared: 2026-07-29
Public record reverified: 2026-08-06
Status: published on arXiv.

- Permanent identifier: `arXiv:2608.02634` (`math.AG`; cross-listed `math.AC`)
- Abstract record: <https://arxiv.org/abs/2608.02634>
- DOI: <https://doi.org/10.48550/arXiv.2608.02634>
- Version 1 submission timestamp: `2026-07-29 22:27:52 UTC`
- Historical temporary submission number: `submit/7885243`

The official record exposes the ten-page PDF, TeX source, HTML rendering, and
the submitted Lean/Harmonic evidence as public ancillary files. The temporary
number is preserved below only to connect the final record to the original
submission receipt.

## Source identity

- Publication source: the Git commit containing this receipt.
- Kernel-verified Lean source commit:
  `ab26ce21e3b272eec73908d5ed2f8b10117f2e38`.
- Terminal declaration:
  `DimensionTwoCounterexample.Final.fullCounterexample`.
- Lean source and dependency digests: every entry in
  `SOURCE_DIGESTS.sha256` passed `shasum -a 256 -c` on 2026-07-29.

The publication source changes exposition and distribution assets only. The
digest-locked Lean theorem source is unchanged from the source identified by
the kernel and Aristotle receipts.

## Release artifacts

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `paper/main.tex` | 24,078 | `e10aab38e859b719c101f9e11610896fe2961b179f481a638d86b3fdbecf537c` |
| `paper/main.bbl` | 1,313 | `7bb856e042f956533694b7a696e7c38b2a6b8839773a7c1f2e6d5fc3f13c896b` |
| `paper/references.bib` | 2,084 | `f5ae86855cbe5d29b7fd5aef310286c192cffb0b64a4b48acd4bb43e16cffcee` |
| `paper/main.pdf` | 371,445 | `85321960fa818a00581aaac99b1b57a52a329a843c277e564a097894196f979a` |
| `paper/dimension-two-counterexample-arxiv.zip` | 50,763 | `bc8010009f178b9013ea2a8c656f12df159cc6156c1e53eaf23d0d235596f478` |

The generated PDF and ZIP are ignored in `paper/` because they are
rebuildable. The exact two release artifacts above are staged in
`site/public/` for the research-site build.

## PDF build and inspection

The final PDF build ran directly from the repository with:

- command: `paper/build-pdf.sh`
- result: exit code 0
- toolchain: pdfTeX 1.40.29, TeX Live 2026

Release checks:

- 10 letter-size pages;
- embedded Type 1 fonts only, with no Type 3 fonts;
- resolved references and citations;
- no overfull boxes in the final log;
- title and author metadata read back as expected;
- extracted text contains the theorem, formulas, proof chain, Lean boundary,
  Aristotle boundary, and bibliography;
- all ten rendered pages were visually inspected. Pages 1--9 were inspected
  after the mathematical-layout build; page 10 was re-rendered and inspected
  after the bibliography compaction that produced the final 10-page PDF.

## arXiv archive

The final source archive was created directly with
`bash paper/make-arxiv-bundle.sh` (exit code 0). It was then unpacked and
compiled from its archive root with `bash paper/verify-arxiv-bundle.sh`
(exit code 0).

The archive-root check ran two PDFLaTeX passes using the included `main.bbl`,
found no unresolved references or overfull boxes, and produced a nonempty PDF.
`unzip -t` passed for every entry. The archived `main.tex` and `main.bbl`
hashes exactly match the release files above. Rebuildable caches and generated
PDF/auxiliary files are excluded. The archive includes the digest-locked Lean
source, dependency pins, formalization map, and kernel and Aristotle receipts
under `anc/lean/`.

The local build used TeX Live 2026. arXiv currently offers TeX Live 2025 by
default and TeX Live 2023 as the previous environment, so this local build is
not claimed as arXiv-environment parity. In accordance with arXiv's current
guidance for a simple single-TeX-file submission, the archive does not include
a manually created `00README.json`; Submission System 1.5 must generate it.
The processor and top-level file shown by the upload interface must therefore
be checked rather than inferred from the local archive.

## Formal-verification boundary

`KERNEL_RECEIPT.md` records the authoritative local Lean kernel verification.
`ARISTOTLE_RECEIPT.md` records an independent Harmonic Aristotle replay of the
same digest-locked source and dependency revisions. Aristotle is corroborative;
it is not a substitute for Lean's kernel and is not human peer review.

The final publication cross-check found no mismatch between the manuscript's
main theorem, geometric generic-fiber bridge, structural provenance, and the
formal terminal declarations. The manuscript continues to label the local
Lean receipt as historical and does not claim a new cache-free Lean rebuild.

## External publication receipt

GitHub Actions did not start the workflow at preserved source commit
`d7e2ed2b9b6bd72cee9699d208558f63ce717189`: run
<https://github.com/integrate-your-mind/dimension-two-jacobian-counterexample/actions/runs/30452659894>
returned `startup_failure` before creating any jobs or logs. This is recorded
as unavailable hosted-CI evidence, not as a successful CI run and not as a
diagnosed manuscript or workflow failure. The exact direct local PDF and
archive checks above are the release evidence.

The author selected the arXiv perpetual, non-exclusive license, confirmed the
account affiliation, selected `math.AG` as the primary category, and
authorized the final title, abstract, comments, source bundle, and permanent
public ancillary Lean receipts. The temporary receipt `submit/7885243` is now
superseded by the permanent public record.

Live publication checks on 2026-08-06 established:

| Public artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| arXiv-generated PDF | 374,423 | `b6933e8dc2238cc46aac5b96727cc01ae97ee4b178d691cf65ff175dc8d6a86e` |
| arXiv source archive | 40,253 | `ae12bc3c553094f26fb739317fcec610f1a67aefbf2481769810aa8f440094fa` |

The arXiv-generated PDF is not byte-identical to the local PDF because arXiv
regenerates it; it is nevertheless ten pages and was checked against the same
source. The official source archive's `main.tex`, `main.bbl`,
`references.bib`, Lean modules, dependency pins, and evidence receipts match
the submitted local bundle file by file. ArXiv generated `00README.json`
during processing, as expected; it was not present in the submitted ZIP.

The official TeX source uses `k=\\overline{\\mathbb F}_2` in the abstract,
body, and theorem. A plain-text extraction of the generated PDF drops the
overline glyph; that extraction artifact is not a normalization mismatch.

Canonical public references:

- <https://arxiv.org/abs/2608.02634>
- <https://arxiv.org/pdf/2608.02634>
- <https://arxiv.org/src/2608.02634>
- <https://arxiv.org/html/2608.02634>
- <https://doi.org/10.48550/arXiv.2608.02634>
