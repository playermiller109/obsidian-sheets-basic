
<details>
<summary>Test text, click to unfold</summary>

````markdown
| head1 | <                       |
| ----- | ----------------------- |
|       | ![\|50](_test.png) [^1] |
|       | ^                       |

[^1]: footnote1

> | head2 | <      |
> | ----- | ------ |
> |       | table2 |
> |       | ^      |
>
> | head3 | <      |
> | ----- | ------ |
> |       | table3 |
> |       | ^      |

> [!quote]
> | head4 | <      |
> | ----- | ------ |
> |       | table4 |
> |       | ^      |
>
> | head5 | <      |
> | ----- | ------ |
> |       | table5 |
> |       | ^      |

```sheet
| head6 | <      |
| ----- | ------ |
|       | table6 |
|       | ^      |
```
````
</details>

(2026) Sandbox Vault test. left: Live Preview; right: Reading Mode:

<image width="420" src="https://github.com/user-attachments/assets/1a6da7db-33ee-44c0-bd31-5f13725944d2">

- Use the command “rebuildCurrent” (default hotkey `F5`) if you encounter any problems.
    - Inside a merged table cell: It will unmerge the cell, reverting it to a normal cell.
    - Inside a normal table cell: It will refresh the table. Avoid placing your cursor in a signifier cell.
    - Outside tables: It will refresh the active leaf.
- Switch to reading mode and refresh once (recommended) before PDF export or slide presentation.
- Do not merge the table header and body.

## For Developers

It is not recommended for secondary development because the official does not advocate that the main functions involve private APIs of Obsidian. It’s not cost-effective.
