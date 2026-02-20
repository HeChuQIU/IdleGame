# 《时间裂隙》AI Studio 辅助开发指南

本文档专为使用 Google AI Studio 等 AI 辅助编程工具开发《时间裂隙》Demo 而设计，包含分阶段的实施计划和可直接使用的 Prompt 模板。

## 1. 开发实施计划 (AI 辅助编程)

本项目推荐采用分阶段迭代的方式进行开发，以便于 AI 理解和生成代码。

### 1.1 阶段划分
- **Phase 1: 核心骨架** - 搭建 Phaser 环境，实现 Chronon 增长与 5 级装置的购买逻辑。
- **Phase 2: 经济深化** - 引入指数涨价公式、全局倍率计算及基础 UI 展示。
- **Phase 3: Prestige 系统** - 实现 P1/P2 的收益计算、重置逻辑及数据隔离。
- **Phase 4: Roguelite 副本** - 开发 DungeonScene，实现 120 秒倒计时、Buff 抽取与标签组合逻辑。
- **Phase 5: 视觉与持久化** - 补充粒子特效、数值动画，接入 SaveSystem 实现本地存档与离线收益。

## 2. AI Prompt 模板库

### 2.1 Phase 1: 搭建主循环
> "请使用 Phaser 3 编写一个增量游戏的基础场景 `MainScene`。要求：
> 1. 包含一个名为 `chronon` 的资源，每秒自动增长；
> 2. 实现 5 个生产器，每个具有 `baseCost`, `costScale`, `baseProduction` 属性；
> 3. 生产器成本随购买数量呈指数增长；
> 4. 界面需显示当前 `chronon` 数量和每秒产出速率；
> 5. 逻辑需模块化，将经济计算与 UI 渲染分离。
> 6. 使用 requestAnimationFrame 下的 deltaTime 做 Tick；
> 请提供完整的 HTML 和 JS 代码。"

### 2.2 Phase 3: 加入 Prestige
> "在现有 Phaser 增量项目上增加双层 Prestige：
> P1 货币 Time Crystal，公式：floor((lifetimeChronon / 1e6)^0.5 * multiplier)。
> P2 货币 Dimension Shard，公式：floor((lifetimeCrystal / 1e4)^0.6 * multiplier)。
> 需要：
> - UI 显示“当前可获得数量”
> - 点击后执行对应重置
> - 明确保留与重置的数据边界
> - 代码写成 PrestigeSystem，避免与主场景耦合。"

### 2.3 Phase 4: 加入副本冲刺
> "为 Phaser 项目新增 DungeonScene（独立副本）：
> - 时长 120 秒；
> - 每 15 秒弹出 3选1 Buff；
> - Buff 分三类：Output/Tempo/Special，并带标签（QUANTUM/CAUSAL/ENTROPY/LOOP）；
> - 同标签达到 2/4/6 层触发额外组合效果；
> - 结束时根据 RunScore 计算 AnomalyData；
> - 返回主场景并发放奖励。
> 请输出 scene、buff 数据结构、结算逻辑与 UI 原型代码。"

### 2.4 Phase 5: 动效优化
> "为现有 Phaser 增量游戏添加科幻流畅动画：
> - 资源飞入粒子
> - 数字平滑滚动 tween
> - 里程碑脉冲
> - 倒计时最后20秒紧张特效
> 限制：
> - 保持 60fps 优先
> - 使用对象池优化粒子
> - 不改变现有经济逻辑，只新增视觉层。"

## 3. 验收标准（用于评估 AI 编程能力）

1. **可运行性**：首次生成代码可直接启动
2. **模块化**：经济、Prestige、副本、UI 解耦清晰
3. **可调参**：平衡参数集中在配置文件
4. **可扩展**：新增 Buff/生产器不改核心框架
5. **性能**：长时间运行不卡顿，不明显掉帧
6. **体验**：玩家 10 分钟内感知至少两次“强反馈时刻”