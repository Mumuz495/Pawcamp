# Pawcamp

## 两台电脑继续 Vibe Coding 的同步方案

这套方案把同步分成三部分：

1. 用 `git` 同步代码
2. 用 `HANDOFF.md` 同步当前进度和下一步计划
3. 用 `.env.example`、`README.md` 这类文件同步环境说明

如果你在家里做到一半，Claude 或其他 agent 的额度用完了，到公司后只要拉下最新代码，再看一眼 `HANDOFF.md`，基本就能无缝接上。

## 推荐工作流

### 家里电脑结束前

1. 更新 `HANDOFF.md`
2. 提交当前代码
3. 推送到远程仓库

```powershell
.\scripts\sync-helper.ps1 handoff
.\scripts\sync-helper.ps1 status
git add .
git commit -m "home: 完成第二步"
git push
```

### 公司电脑开始前

1. 拉取最新代码
2. 查看 `HANDOFF.md`
3. 继续开发

```powershell
git pull
Get-Content .\HANDOFF.md
```

## 建议补充的文件

- `HANDOFF.md`：记录当前进度、下一步、风险、待办
- `.env.example`：告诉另一台电脑需要哪些环境变量
- `README.md`：写清楚启动方式
- `scripts/`：放常用启动脚本

## Claude / 对话上下文怎么衔接

代码本身可以靠 `git` 同步，但聊天上下文不一定能完全跨机器自动恢复。

所以建议你每次换电脑时，把下面这些内容一起带上：

- 当前分支名
- 当前做到哪一步
- 下一步想让 Claude 做什么
- 有没有已知 bug / 卡点

你可以直接把 `HANDOFF.md` 的内容贴给 Claude。

## 当前目录里已准备好的文件

- `HANDOFF.md`
- `.gitignore`
- `scripts/sync-helper.ps1`

如果你的电脑还没装 `git`，先安装 Git for Windows，然后重新打开终端再执行上面的命令。
