# Godot 4.2+ Hex-Based Block Blast Game Rules

## Board & Hex Grid

- **Board Logic**: Dictionary `board_slots: Dictionary[Vector2i, HexBlock?]` tracks game state
  - `null` = empty slot, `HexBlock` instance = occupied
  - Use `board_slots` for all logic; TileMapLayer is visual-only
- **Hex Neighbors** (flat-top): `Vector2i(1,0)`, `Vector2i(-1,0)`, `Vector2i(0,1)`, `Vector2i(0,-1)`, `Vector2i(1,-1)`, `Vector2i(-1,1)`
- **Visuals**: TileMapLayer for rendering; `world_to_map()` for coordinate conversion

## Shapes

- **Data-First Design**: Shapes defined by `cells: Array[Vector2i]` relative to origin
- **Shape Factory**: Reuse single Shape.tscn with different `cells` arrays
- **Dynamic Instantiation**: HexBlock nodes created from `cells` array, not hardcoded
- **Touch Detection**: Use CollisionPolygon2D for precise hex touch detection

## Placement & Validation

- Convert shape origin to TileMapLayer coordinates via `world_to_map()`
- Validate with `can_place(shape, origin_cell)` checking `board_slots`
- On valid placement: instantiate HexBlocks, update `board_slots`
- On invalid: return shape to start position

## Game Logic

- **Combo Detection**: BFS/neighbor iteration for clusters; detect filled lines or edge-reaching shapes (edge adjacency determines removal)
- **Removal**: `queue_free()` blocks, set `board_slots[cell] = null`
- **Refill**: Auto-fill empty slots after removal if needed; player can also place new shapes
- **Timer**: Global timer (not per-tile) tracking `time_left`; signals: `time_updated`, `time_over`; optional: `score_updated`, `combo_cleared`
- **Time Bonuses**: `GameManager.add_time(seconds)`

## Architecture & Separation

- **Board**: Slots dictionary & placement validation
- **Shape**: Drag handling & visuals
- **GameManager**: Time & score management
- **HUD**: UI updates listening to signals (score, time, highest score)
- **Animations/Particles**: Handled in HUD/Dev4 domain

## Coding Standards

- Always use `board_slots` for logic, never TileMapLayer visuals
- Generate shapes programmatically from `cells` arrays
- Keep code modular and reusable
- Use typed GDScript where possible
