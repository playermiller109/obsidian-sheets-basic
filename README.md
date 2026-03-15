# Sheets Basic

<span id="en-intro">English</span> | [中文](#zh-intro)

- Use the plugin command “rebuildCurrent” (default hotkey `F5`) if you encounter any problems.
    - Inside a merged table cell: It will unmerge the cell, reverting it to a normal cell.
    - Inside a normal table cell: It will refresh the table. Avoid placing your cursor in a signifier cell.
    - Outside tables: It will refresh the active leaf.
- Switch to reading mode before exporting a PDF. It is recommended to refresh once before the export.
    - Because Obsidian has a reading mode cache, and no method is provided to precisely clear the cache currently.
    - The same applies before starting a slide presentation.
- Do not merge up from the first row of the table body; that is, do not merge the table header and body.

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

(2026) Test in Obsidian v 1.12.4 Sandbox Vault. left: Live Preview; right: Reading Mode:

<image width="420" src="https://github.com/user-attachments/assets/1a6da7db-33ee-44c0-bd31-5f13725944d2">

[English](#en-intro) | <span id="zh-intro">中文</span>

- 如遇任何问题，可使用插件的 rebuildCurrent 命令，默认快捷键 F5。
    - 用于合并单元格，将取消合并，该单元格将变为普通单元格。
    - 用于普通单元格，将刷新所在表格。请勿将鼠标光标置于合并识别符所在单元格。
    - 用于表格外，将刷新当前活动页面。
- 请切换到阅读模式再导出 PDF。建议导出前刷新一次。
    - 因为 Obsidian 存在阅读模式缓存，并且目前没有精确清除缓存的方法。
    - 在开始幻灯片演示前也请这样做。
- 不要在表体第一行使用向上合并，即不要合并表头和表体。

## For Developers

不推荐二次开发，因为官方不赞成主要功能参涉私有接口，这样做不划算。

It is not recommended for secondary development because the official does not advocate that the main functions involve private APIs of Obsidian. It’s not cost-effective.
