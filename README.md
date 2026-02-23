# 斗地主残局卡牌 MVP

## 启动
```bash
pnpm install
pnpm dev
```

## 测试
```bash
pnpm test
```

## 如何新增关卡
1. 复制 `levels/TEMPLATE.json` 到 `levels/ch1/level_xxx.json`
2. 填写 `initialState/solution/hints`
3. 在 `src/levels/index.ts` 导入新关卡
4. 运行 `pnpm test`，确保 `levels.regression` 通过

## 目录
- `src/engine`: 规则引擎
- `src/levels`: 关卡加载与校验
- `src/ai`: 基础机器人
- `src/ui`: React 界面
- `docs`: 范围、规则、章节设计
