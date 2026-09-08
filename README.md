
> It is nice to see people stepping up with new initiatives. Apart from what was referenced in the plugin history, folks like ZHYX91 have also brought forward projects around this. I am optimistic about where things are headed.
> For anything else, there are a few notes and some context over in the release logs.

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

````
</details>

- Use the `rebuildCurrent` command, if you run into problems.
    - In a merged table cell → unmerge the cell.
    - In a normal table cell → refresh the table.
    - Outside tables → refresh the active leaf.
- Switch to reading mode and refresh once (recommended) before PDF export or slide presentation.
- Do not merge the table header and body.

- 如遇任何问题，可使用插件的 rebuildCurrent 命令。
    - 用于合并单元格，将取消合并。
    - 用于普通单元格，将刷新所在表格。
    - 用于表格外，将刷新当前活动页面。
- 请切换到阅读模式并刷新一次（推荐）再导出 PDF 或开始幻灯片演示。
- 请勿合并表头和表体。

## For Developers

Private APIs of Obsidian. Dev → not recommended → not cost-effective.
