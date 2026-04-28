# Miro SaaS Tech Stack Analysis

## React Libraries, Components, and Packages for Interactive Whiteboards, Mindmaps, Wireframes, Diagrams, and Flow Charts

> Research document analyzing the technologies Miro uses and the equivalent open-source libraries available for building similar interactive canvas-based applications.

---

## Table of Contents

1. [Miro's Core Architecture](#miros-core-architecture)
2. [Canvas Rendering Engine](#canvas-rendering-engine)
3. [React UI Layer](#react-ui-layer)
4. [Real-Time Collaboration Stack](#real-time-collaboration-stack)
5. [State Management](#state-management)
6. [Specific Feature Libraries](#specific-feature-libraries)
7. [Open-Source Equivalents and Alternatives](#open-source-equivalents-and-alternatives)
8. [Complete Package List](#complete-package-list)

---

## 1. Miro's Core Architecture

Miro uses a **dual-layer architecture**:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Board Canvas** | HTML5 Canvas + WebGL | Rendering all board objects (shapes, text, connectors, sticky notes, frames) |
| **UI Shell** | React + TypeScript | Toolbars, panels, menus, dialogs, property inspectors, sidebars |

The board itself is **NOT rendered with React DOM elements**. Miro built a custom high-performance canvas rendering engine that draws everything on an HTML5 `<canvas>` element with WebGL acceleration. React is used only for the surrounding UI (toolbars, menus, modals, panels).

---

## 2. Canvas Rendering Engine

### Core Rendering Technologies

| Technology | Package/API | What Miro Uses It For |
|-----------|------------|----------------------|
| **HTML5 Canvas API** | Native Browser API | Primary 2D rendering surface for all board objects |
| **WebGL / WebGL2** | Native Browser API | Hardware-accelerated rendering for large boards with thousands of objects |
| **OffscreenCanvas** | Native Browser API | Offloading canvas rendering to Web Workers for smoother performance |
| **Web Workers** | Native Browser API | Background computation: layout calculations, collision detection, pathfinding for connectors |
| **requestAnimationFrame** | Native Browser API | Smooth 60fps rendering loop |

### Canvas Rendering Libraries (Used Internally or Equivalent)

| Library | npm Package | Purpose |
|---------|------------|---------|
| **PixiJS** | `pixi.js` | High-performance 2D WebGL renderer. Miro's rendering approach is similar to PixiJS's scene graph model |
| **Konva.js** | `konva` | 2D canvas library with built-in event system, drag-and-drop, transformations |
| **react-konva** | `react-konva` | React bindings for Konva -- declarative canvas rendering |
| **Fabric.js** | `fabric` | Canvas library with object model, grouping, serialization, SVG import/export |
| **Paper.js** | `paper` | Vector graphics scripting framework on Canvas |
| **Two.js** | `two.js` | 2D drawing API with renderers for SVG, Canvas, and WebGL |

### What Miro Specifically Uses for Rendering

Based on Miro's engineering blog posts and tech talks:

```
Custom WebGL-based renderer
  |-- Scene graph (custom implementation)
  |-- Spatial indexing (R-tree / Quadtree for viewport culling)
  |-- Batched draw calls (minimizing WebGL state changes)
  |-- Text rendering (custom bitmap font / SDF text rendering)
  |-- Vector path rendering (bezier curves for connectors)
  |-- Image tiling (for large images and PDFs)
```

Key packages that replicate this:

| Package | npm Install | Purpose |
|---------|------------|---------|
| `pixi.js` | `npm install pixi.js` | WebGL 2D renderer with scene graph |
| `@pixi/graphics` | included in pixi.js | Drawing shapes, lines, curves |
| `@pixi/text` | included in pixi.js | Text rendering on canvas |
| `rbush` | `npm install rbush` | R-tree spatial index for viewport culling |
| `d3-quadtree` | `npm install d3-quadtree` | Quadtree for spatial queries |
| `flatbush` | `npm install flatbush` | Fast static spatial index |

---

## 3. React UI Layer

### Core React Stack

| Package | npm Install | What Miro Uses It For |
|---------|------------|----------------------|
| **React** | `react` | UI framework for toolbars, panels, dialogs |
| **React DOM** | `react-dom` | DOM rendering for UI components |
| **TypeScript** | `typescript` | Type-safe development across the entire frontend |

### UI Component Libraries

| Package | npm Install | Purpose in Miro |
|---------|------------|----------------|
| **Radix UI** | `@radix-ui/react-*` | Accessible, unstyled UI primitives (dropdowns, dialogs, popovers, tooltips) |
| **Headless UI** | `@headlessui/react` | Unstyled, accessible UI components |
| **React Aria** | `react-aria` | Accessibility primitives from Adobe |
| **Floating UI** | `@floating-ui/react` | Positioning for tooltips, popovers, dropdowns (successor to Popper.js) |
| **React DnD** | `react-dnd` | Drag and drop for panel items, library assets |
| **@dnd-kit/core** | `@dnd-kit/core` | Modern drag and drop toolkit |
| **React Portal** | Built into React | Rendering modals, tooltips, context menus outside DOM hierarchy |
| **React Virtual** | `@tanstack/react-virtual` | Virtualized lists for large object lists, search results |
| **Downshift** | `downshift` | Autocomplete/combobox for search functionality |

### Styling

| Package | npm Install | Purpose |
|---------|------------|---------|
| **CSS Modules** | built-in with bundler | Scoped component styles |
| **Styled Components** | `styled-components` | CSS-in-JS (Miro has used this) |
| **Emotion** | `@emotion/react` | CSS-in-JS alternative |
| **Tailwind CSS** | `tailwindcss` | Utility-first CSS |
| **PostCSS** | `postcss` | CSS processing |

### Icons and Assets

| Package | npm Install | Purpose |
|---------|------------|---------|
| **Lucide React** | `lucide-react` | Icon library |
| **React Icons** | `react-icons` | Icon collection |
| **SVG as React Components** | via bundler | Custom icon system |

---

## 4. Real-Time Collaboration Stack

This is critical for Miro's multiplayer whiteboard experience.

### WebSocket and Transport

| Package | npm Install | Purpose |
|---------|------------|---------|
| **Socket.IO** | `socket.io-client` | WebSocket abstraction with fallback transport, reconnection |
| **ws** | `ws` (server-side) | Raw WebSocket server |
| **WebSocket API** | Native Browser API | Real-time bidirectional communication |
| **protobuf.js** | `protobufjs` | Protocol Buffers for efficient binary serialization of board data |
| **msgpack** | `@msgpack/msgpack` | MessagePack binary serialization (alternative to JSON) |

### CRDT (Conflict-free Replicated Data Types) for Collaboration

Miro uses CRDT-like structures for concurrent editing without conflicts:

| Package | npm Install | Purpose |
|---------|------------|---------|
| **Yjs** | `yjs` | CRDT framework for shared data types (most popular for collaborative editing) |
| **y-websocket** | `y-websocket` | Yjs WebSocket provider |
| **y-indexeddb** | `y-indexeddb` | Yjs offline persistence |
| **Automerge** | `@automerge/automerge` | CRDT library for JSON-like data structures |
| **Liveblocks** | `@liveblocks/react` | Real-time collaboration infrastructure (used by many whiteboard apps) |
| **PartyKit** | `partykit` | Real-time multiplayer infrastructure |

### Operational Transform (OT) Alternative

| Package | npm Install | Purpose |
|---------|------------|---------|
| **ShareDB** | `sharedb` | Real-time database using OT |
| **ot.js** | `ot` | Operational transformation library |

### Cursor and Presence

| Package | npm Install | Purpose |
|---------|------------|---------|
| **@liveblocks/react** | `@liveblocks/react` | Presence, cursors, room-based collaboration |
| **y-presence** | Built into Yjs awareness | User cursors and presence indicators |

---

## 5. State Management

### Client-Side State

| Package | npm Install | What Miro Uses It For |
|---------|------------|----------------------|
| **Redux** | `redux` / `@reduxjs/toolkit` | Global application state (Miro historically used Redux) |
| **Redux Toolkit** | `@reduxjs/toolkit` | Simplified Redux with slices, thunks |
| **Zustand** | `zustand` | Lightweight state management (popular in canvas apps) |
| **Immer** | `immer` | Immutable state updates (used with Redux Toolkit) |
| **Recoil** | `recoil` | Atom-based state management from Meta |
| **Jotai** | `jotai` | Primitive atom-based state |
| **Valtio** | `valtio` | Proxy-based state management |
| **MobX** | `mobx` | Observable-based reactive state |

### Data Persistence

| Package | npm Install | Purpose |
|---------|------------|---------|
| **IndexedDB** | Native Browser API (via `idb`) | Local caching of board data for offline support |
| **idb** | `idb` | Promise-based IndexedDB wrapper |
| **localForage** | `localforage` | Unified async storage API |
| **Dexie.js** | `dexie` | IndexedDB wrapper with nice query API |

---

## 6. Specific Feature Libraries

### Mindmaps

| Package | npm Install | Purpose |
|---------|------------|---------|
| **D3.js** | `d3` | Tree/hierarchical layouts for mindmap node positioning |
| **d3-hierarchy** | `d3-hierarchy` | Tree, cluster, treemap layouts |
| **d3-force** | `d3-force` | Force-directed graph layouts |
| **dagre** | `dagre` | Directed graph layout engine |
| **elkjs** | `elkjs` | Eclipse Layout Kernel -- advanced graph layout algorithms |
| **react-flow** | `reactflow` | Flow-based node graph editor (used for mindmaps) |

### Whiteboards / Infinite Canvas

| Package | npm Install | Purpose |
|---------|------------|---------|
| **tldraw** | `tldraw` | Full whiteboard engine (open-source, closest to Miro) |
| **@tldraw/tldraw** | `@tldraw/tldraw` | Complete whiteboard SDK |
| **Excalidraw** | `@excalidraw/excalidraw` | Hand-drawn style whiteboard (open-source) |
| **react-infinite-canvas** | custom implementation | Infinite pan/zoom canvas |
| **panzoom** | `panzoom` | Pan and zoom for any DOM/SVG/Canvas element |
| **d3-zoom** | `d3-zoom` | Pan and zoom behavior |
| **react-zoom-pan-pinch** | `react-zoom-pan-pinch` | React wrapper for zoom/pan/pinch gestures |

### Wireframes

| Package | npm Install | Purpose |
|---------|------------|---------|
| **Fabric.js** | `fabric` | Object model with selection, grouping, alignment guides |
| **Konva.js** | `konva` + `react-konva` | Shapes, transformers, snapping |
| **react-resizable** | `react-resizable` | Resizable UI elements |
| **react-rnd** | `react-rnd` | Resizable and draggable elements |
| **react-grid-layout** | `react-grid-layout` | Grid-based layout system |
| **interact.js** | `interactjs` | Drag, resize, multi-touch gestures |

### Diagrams and Flow Charts

| Package | npm Install | Purpose |
|---------|------------|---------|
| **React Flow** | `reactflow` | The leading React library for node-based diagrams and flow charts |
| **@xyflow/react** | `@xyflow/react` | Next-gen React Flow (v12+) |
| **JointJS** | `jointjs` | Diagramming framework with connectors, ports, routing |
| **GoJS** | `gojs` | Enterprise diagramming library (commercial) |
| **mxGraph** | `mxgraph` | The engine behind draw.io (now open-source) |
| **dagre** | `dagre` | Automatic directed graph layout |
| **elkjs** | `elkjs` | Advanced layout algorithms for diagrams |
| **cytoscape** | `cytoscape` | Graph theory / network visualization library |
| **react-diagrams** | `@projectstorm/react-diagrams` | Diagramming engine for React |
| **Butterfly** | `butterfly-dag` | DAG/flow diagram engine |
| **Rete.js** | `rete` | Visual programming / node editor framework |

### Connectors and Paths

| Package | npm Install | Purpose |
|---------|------------|---------|
| **perfect-arrows** | `perfect-arrows` | Drawing arrows between points/boxes |
| **react-archer** | `react-archer` | Drawing arrows between React elements |
| **svg-path-commander** | `svg-path-commander` | SVG path manipulation |
| **bezier-js** | `bezier-js` | Bezier curve computation |
| **pathfinding** | `pathfinding` | A* pathfinding for orthogonal connector routing |

### Shape and Drawing Tools

| Package | npm Install | Purpose |
|---------|------------|---------|
| **Rough.js** | `roughjs` | Hand-drawn/sketchy style rendering |
| **perfect-freehand** | `perfect-freehand` | Beautiful freehand line drawing (used by tldraw) |
| **simplify-js** | `simplify-js` | Polyline simplification for smoother freehand lines |
| **clipper-lib** | `clipper-lib` | Boolean operations on polygons |
| **paper.js** | `paper` | Vector graphics with path operations |

### Rich Text Editing (for sticky notes, text boxes)

| Package | npm Install | Purpose |
|---------|------------|---------|
| **TipTap** | `@tiptap/react` | Modern rich text editor built on ProseMirror |
| **ProseMirror** | `prosemirror-*` | Toolkit for building rich text editors |
| **Slate.js** | `slate` + `slate-react` | Customizable rich text editor framework |
| **Lexical** | `@lexical/react` | Meta's extensible text editor framework |
| **Quill** | `react-quill` | Rich text editor |

### Image and Media Handling

| Package | npm Install | Purpose |
|---------|------------|---------|
| **sharp** | `sharp` (server) | Image processing and optimization |
| **Cropper.js** | `react-cropper` | Image cropping |
| **PDF.js** | `pdfjs-dist` | PDF rendering on canvas |
| **react-pdf** | `@react-pdf/renderer` | PDF generation |

---

## 7. Open-Source Equivalents and Alternatives

### Full Whiteboard Solutions (Closest to Miro)

These are complete open-source whiteboard solutions that replicate Miro's core functionality:

| Project | Package | What It Provides |
|---------|---------|-----------------|
| **tldraw** | `tldraw` | Complete whiteboard with drawing, shapes, text, images, collaboration support. **Closest to Miro** |
| **Excalidraw** | `@excalidraw/excalidraw` | Hand-drawn style whiteboard with real-time collaboration |
| **BlockSuite** | `@blocksuite/editor` | Collaborative editor framework (powers AFFiNE) |
| **AFFiNE** | Open-source Miro/Notion alternative | Full whiteboard + docs platform |
| **Ourboard** | Open-source | Real-time collaborative whiteboard |
| **Spacedrive Canvas** | Open-source | Canvas-based UI framework |

### React Flow Ecosystem (for Diagrams/Flow Charts)

```bash
npm install @xyflow/react
```

React Flow provides:
- Draggable nodes with custom React components
- Different edge types (straight, step, smoothstep, bezier)
- Mini-map, controls, background patterns
- Sub-flows and grouping
- Connection handles and validation
- Custom node and edge renderers
- Built-in keyboard shortcuts
- Touch support

### tldraw Ecosystem (for Whiteboards)

```bash
npm install tldraw
```

tldraw provides:
- Freehand drawing (perfect-freehand)
- Shape tools (rectangle, ellipse, diamond, arrow, line)
- Text tool
- Image/video embedding
- Frame tool (like Miro frames)
- Sticky notes
- Collaboration (via y-websocket)
- Infinite canvas with pan/zoom
- Undo/redo
- Export to SVG/PNG

---

## 8. Complete Package List

### Essential Packages for Building a Miro-like Application

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",

    "pixi.js": "^8.0.0",
    "konva": "^9.3.0",
    "react-konva": "^18.2.10",
    "fabric": "^6.0.0",

    "reactflow": "^11.11.0",
    "@xyflow/react": "^12.0.0",
    "dagre": "^0.8.5",
    "elkjs": "^0.9.0",

    "tldraw": "^2.4.0",
    "@excalidraw/excalidraw": "^0.17.0",

    "d3": "^7.9.0",
    "d3-hierarchy": "^3.1.2",
    "d3-force": "^3.0.0",
    "d3-zoom": "^3.0.0",

    "yjs": "^13.6.0",
    "y-websocket": "^2.0.0",
    "y-indexeddb": "^9.0.12",

    "@reduxjs/toolkit": "^2.2.0",
    "zustand": "^4.5.0",
    "immer": "^10.0.0",

    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "@radix-ui/react-popover": "^1.0.0",
    "@radix-ui/react-context-menu": "^2.0.0",
    "@floating-ui/react": "^0.26.0",

    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "react-zoom-pan-pinch": "^3.4.0",
    "panzoom": "^9.4.0",

    "perfect-freehand": "^1.2.2",
    "roughjs": "^4.6.0",
    "perfect-arrows": "^0.3.7",
    "bezier-js": "^6.1.0",
    "simplify-js": "^1.2.4",

    "@tiptap/react": "^2.3.0",
    "@tiptap/starter-kit": "^2.3.0",

    "rbush": "^3.0.1",
    "flatbush": "^4.4.0",

    "idb": "^8.0.0",
    "socket.io-client": "^4.7.0",
    "protobufjs": "^7.2.0",
    "@msgpack/msgpack": "^3.0.0",

    "pdfjs-dist": "^4.3.0",
    "react-zoom-pan-pinch": "^3.4.0",
    "lucide-react": "^0.370.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "vite": "^5.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

### Packages by Feature Category

#### Infinite Canvas and Pan/Zoom
```bash
npm install pixi.js react-konva konva d3-zoom react-zoom-pan-pinch panzoom
```

#### Shapes, Drawing, and Freehand
```bash
npm install perfect-freehand roughjs simplify-js paper bezier-js fabric
```

#### Diagrams and Flow Charts
```bash
npm install @xyflow/react dagre elkjs cytoscape
```

#### Mindmaps
```bash
npm install d3-hierarchy d3-force dagre elkjs @xyflow/react
```

#### Connectors and Arrows
```bash
npm install perfect-arrows bezier-js pathfinding
```

#### Real-Time Collaboration
```bash
npm install yjs y-websocket y-indexeddb socket.io-client
```

#### Rich Text Editing
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-collaboration
```

#### State Management
```bash
npm install zustand immer @reduxjs/toolkit
```

#### UI Components
```bash
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-tooltip @floating-ui/react @dnd-kit/core lucide-react
```

#### Spatial Indexing and Performance
```bash
npm install rbush flatbush d3-quadtree
```

---

## Architecture Diagram

```
+----------------------------------------------------------+
|                     Miro-like Application                 |
+----------------------------------------------------------+
|                                                          |
|  +------------------+    +---------------------------+   |
|  |   React UI       |    |   Canvas Rendering        |   |
|  |   Shell Layer     |    |   Engine Layer            |   |
|  |                  |    |                           |   |
|  | - Toolbars       |    | - WebGL / Canvas API     |   |
|  | - Panels         |    | - PixiJS / Konva         |   |
|  | - Modals         |    | - Scene Graph            |   |
|  | - Property       |    | - Spatial Index (rbush)  |   |
|  |   Inspector      |    | - Shape Renderers        |   |
|  | - Context Menus  |    | - Text Renderers         |   |
|  | - Search         |    | - Connector Routing      |   |
|  |                  |    | - Hit Testing            |   |
|  | Libraries:       |    | - Selection System       |   |
|  | - Radix UI       |    | - Transform Controls     |   |
|  | - Floating UI    |    |                           |   |
|  | - DnD Kit        |    | Libraries:               |   |
|  | - TipTap         |    | - pixi.js / fabric.js    |   |
|  | - Zustand/Redux  |    | - perfect-freehand       |   |
|  +------------------+    | - roughjs                |   |
|                          | - bezier-js              |   |
|                          +---------------------------+   |
|                                                          |
|  +---------------------------------------------------+   |
|  |              Collaboration Layer                    |   |
|  |                                                   |   |
|  | - Yjs (CRDT) for conflict-free concurrent edits   |   |
|  | - WebSocket transport (y-websocket / socket.io)    |   |
|  | - Presence & cursors                               |   |
|  | - Protobuf / MessagePack serialization             |   |
|  | - IndexedDB offline persistence (y-indexeddb)      |   |
|  +---------------------------------------------------+   |
|                                                          |
|  +---------------------------------------------------+   |
|  |              Layout Engine                          |   |
|  |                                                   |   |
|  | - dagre (directed graph layout)                    |   |
|  | - elkjs (advanced layout algorithms)               |   |
|  | - d3-force (force-directed layouts)                |   |
|  | - d3-hierarchy (tree/mindmap layouts)              |   |
|  | - pathfinding (connector routing)                  |   |
|  +---------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

---

## Key Takeaways

1. **Miro does NOT use React for the board itself** -- it uses a custom Canvas/WebGL engine. React is only for UI chrome (toolbars, panels, dialogs).

2. **The closest open-source alternatives** to Miro's board engine are **tldraw** and **Excalidraw**, both of which are React-based and provide complete whiteboard functionality.

3. **For flow charts and diagrams specifically**, **React Flow** (`@xyflow/react`) is the industry standard React library.

4. **For real-time collaboration**, the **Yjs** CRDT framework is the most widely adopted solution in the whiteboard/diagram space.

5. **For mindmap layouts**, the combination of **d3-hierarchy** + **d3-force** + **dagre/elkjs** provides the layout algorithms needed.

6. **Performance at scale** requires spatial indexing (**rbush/flatbush**), viewport culling, level-of-detail rendering, and Web Workers -- these are custom implementations, not off-the-shelf libraries.

---

## References

- Miro Engineering Blog: https://medium.com/miro-engineering
- tldraw source code: https://github.com/tldraw/tldraw
- Excalidraw source code: https://github.com/excalidraw/excalidraw
- React Flow documentation: https://reactflow.dev
- Yjs documentation: https://docs.yjs.dev
- PixiJS documentation: https://pixijs.com
- Konva.js documentation: https://konvajs.org
