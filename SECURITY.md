# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| 0.2.x | Yes |
| 0.1.x | No (attribute injection through the `class` option, see CHANGELOG 0.2.0) |

## Reporting a vulnerability

Please report vulnerabilities privately through GitHub Security Advisories:
<https://github.com/codinglombok/LombokIcons/security/advisories/new>.
Do not open a public issue. You should receive an acknowledgement within 3 working days and a fix or mitigation plan within 30 days.

## Scope and threat model

The normative rules are in [SPEC section 5](docs/SPEC_LombokIcons_v0.2.0.md#5-keamanan-normatif): caller-supplied `class` and `title` are escaped, `size` and `color` are accepted only when they match strict CSS patterns, and path data comes only from the validated registry. Out of scope: icon markup inserted into `<script>` or `<style>` contexts.
