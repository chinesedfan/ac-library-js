# ac-library-js

JavaScript version of AC(AtCoder) Library, which is based on v1.4 of [atcoder/ac-library](https://github.com/atcoder/ac-library). The key purposes are fast copy-paste and high performance, so some manners are done intentionally.

For example,

- no bundle recompilation, as well as no requires/no imports & exports/no TypeScript.
- no recursion, which may cause stack overflow.
- no asserts.
- and so on...
