# Curriculum Spec v1

## Tag 列表
- 控先手
- 炸弹时机
- 农民配合
- 读牌推断
- 残局收官
- 王的处理

## 章节目标
- 每章主打 1~2 个 tags
- 比例：演示 20% / 练习 60% / 考核 20%

## 难度维度（可量化）
1. 关键点深度：primaryDecisionPly
2. PV 长度：pvLength
3. 近最优分支数量：nearOptimalCount（uniqueScore 反向）

## 自动分桶规则（Report -> Chapter）
- primaryDecisionPly <= 5 且 pvLength <= 12：演示
- primaryDecisionPly 6~10 且 uniqueScore 0.55~0.75：练习
- primaryDecisionPly > 10 或 uniqueScore > 0.75：考核

## Tag 推断特征
- 控先手：决策点前后 PASS 重置频繁 + 单对争先
- 炸弹时机：topMoves 含 BOMB/ROCKET 且 delta 高
- 农民配合：地主侧 winning move 依赖让牌式低代价出牌
- 王的处理：topMoves 含 BJ/RJ
