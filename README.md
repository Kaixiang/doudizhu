# 斗地主残局卡牌 MVP

## 启动
```bash
pnpm install
pnpm dev
```

## 测试
```bash
pnpm test
pnpm test:verifier-golden
pnpm test:pack-regression
```

## 离线验证器
```bash
pnpm verifier --levels levels/ch1 --out reports/ch1 --seed 12345 --rollouts 200 --topK 8 --gate
```

## 关卡工厂流水线（Candidate -> Verify -> Gate -> Select -> Materialize）
```bash
pnpm level-factory:generate
```
输出目录：`reports/level_factory`、`levels/generated/ch1`

## 如何新增关卡
1. 复制 `levels/TEMPLATE.json` 到 `levels/ch1/level_xxx.json`
2. 填写 `initialState/solution/hints`
3. 在 `src/levels/index.ts` 导入新关卡
4. 运行 `pnpm test` 与 `pnpm verifier`

## 目录
- `src/engine`: 规则引擎
- `src/levels`: 关卡加载与校验
- `src/ai`: 基础机器人
- `src/ui`: React 界面
- `src/verifier`: 离线关卡验证器
- `src/levelFactory`: 关卡工厂流水线
- `docs`: 范围、规则、章节设计
