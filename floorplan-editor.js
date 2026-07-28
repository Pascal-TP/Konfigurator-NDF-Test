/*
 * NDF Grundriss-Editor
 * Ausgelagert aus app.js
 * Enthält:
 * - Grundrissfenster
 * - Editor-HTML und CSS
 * - Rechteck- und Polygonzeichnung
 * - Vorlagen und Kalibrierung
 * - Türen und Verteiler
 */

function openFloorplanWindow() {
  const result = calculateTechnicalRecommendation();

  const win = window.open('', 'ndfFloorplan', 'width=1400,height=900,resizable=yes,scrollbars=yes');

  if (!win) {
    showAppModal({
      title: 'Pop-up blockiert',
      message: 'Bitte erlauben Sie Pop-ups für diese Seite, damit der Grundriss geöffnet werden kann.',
      confirmText: 'OK'
    });
    return;
  }

  const floorData = state.floors.map((floor, floorIndex) => {
    return {
      name: getFloorLabel(floor, floorIndex),
      distributor: floor.floorplanDistributor || null,

      template: {
        src: floor.floorplanTemplate?.src || '',
        fileName: floor.floorplanTemplate?.fileName || '',
        x: Number.isFinite(
          Number(floor.floorplanTemplate?.x)
        )
          ? Number(floor.floorplanTemplate.x)
          : 40,

        y: Number.isFinite(
          Number(floor.floorplanTemplate?.y)
        )
          ? Number(floor.floorplanTemplate.y)
          : 40,
        scale: Number(floor.floorplanTemplate?.scale) || 1,
        opacity:
          floor.floorplanTemplate?.opacity !== undefined
            ? Number(floor.floorplanTemplate.opacity)
            : 0.55,
        locked: Boolean(floor.floorplanTemplate?.locked),
        pixelsPerMeter:
          Number(
            floor.floorplanTemplate?.pixelsPerMeter
          ) || null,

        detectedWalls: Array.isArray(
          floor.floorplanTemplate?.detectedWalls
        )
          ? floor.floorplanTemplate.detectedWalls
          : []
      },

      rooms: floor.rooms.map((room, roomIndex) => {
        const technicalRoom = result.rooms.find(r =>
          r.floor === getFloorLabel(floor, floorIndex) &&
          r.room === getRoomLabel(room, roomIndex)
        );

        return {
          name: getRoomLabel(room, roomIndex),
          function: room.function,
          area: Number(room.area) || 0,
          spacing: room.spacing,
          circuits: technicalRoom?.circuits || 0,
          pipeLength: technicalRoom?.pipeLength || 0,
          floorplan: room.floorplan || {}
        };
      })
    };
  });

  win.document.open();
  win.document.write(`
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Grundriss - Fußbodenheizung</title>

<script>
  window.openCvReady = false;

  function onOpenCvReady() {
    window.openCvReady = true;

    const status =
      document.getElementById(
        'wallDetectionStatus'
      );

    if (status) {
      status.textContent =
        'Bilderkennung ist bereit.';
    }
  }
</script>

<script
  async
  src="https://docs.opencv.org/4.x/opencv.js"
  onload="onOpenCvReady()"
  type="text/javascript"
></script>

<style>
  body {
    margin: 0;
    font-family: "Segoe UI", sans-serif;
    background: #eef1f4;
    color: #1f2937;
  }

  header {
    background: #0b2a4a;
    color: white;
    padding: 16px 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  header h1 {
    margin: 0;
    font-size: 22px;
  }

  .toolbar {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  button {
    border: none;
    border-radius: 8px;
    padding: 10px 14px;
    font-weight: 600;
    cursor: pointer;
    background: #dbe7f1;
    color: #0b2a4a;
  }

  .tabs {
    display: flex;
    gap: 8px;
    padding: 12px 18px;
    background: white;
    border-bottom: 1px solid #d7d7d7;
  }

  .tab {
    border: 1px solid #d7d7d7;
    background: #f8fafc;
  }

  .tab.active {
    background: #0b2a4a;
    color: white;
  }

  .workspace-wrap {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 16px;
    padding: 16px;
  }

  .workspace {
    position: relative;
    height: calc(100vh - 150px);
    min-height: 620px;
    background:
      linear-gradient(#d9e2ea 1px, transparent 1px),
      linear-gradient(90deg, #d9e2ea 1px, transparent 1px);
    background-size: 20px 20px;
    border: 1px solid #c7d2dd;
    border-radius: 14px;
    overflow: auto;
  }

  .room {
    position: absolute;
    border: 4px solid #273647;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 4px;
    cursor: move;
    box-shadow: 0 8px 22px rgba(0,0,0,0.14);
    user-select: none;
    box-sizing: border-box;
  }

.room.polygon-room {
  border: none;
  background: transparent;
  box-shadow: none;
  overflow: visible;
}

.polygon-room-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
}

.polygon-room .room-label {
  position: relative;
  z-index: 5;
  color: #1f2937;
  opacity: 1;
  pointer-events: none;
}

.polygon-room .dimension-cross {
  z-index: 4;
}

.polygon-room .room-label strong {
  color: #1f2937;
  opacity: 1;
}

.polygon-room-shape {
  stroke: #273647;
  stroke-width: 4;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;

  pointer-events: all;
  cursor: move;
}

.polygon-room.heated-1 .polygon-room-shape {
  fill: rgba(236, 253, 243, 0.92);
}

.polygon-room.heated-2 .polygon-room-shape {
  fill: rgba(255, 247, 214, 0.92);
}

.polygon-room.heated-3 .polygon-room-shape {
  fill: rgba(253, 232, 232, 0.92);
}

.polygon-room.unheated .polygon-room-shape {
  fill: rgba(241, 245, 249, 0.92);
}

.room.polygon-room {
  border: none;
  background: transparent !important;
  box-shadow: none;
  overflow: visible;
  pointer-events: none;
}

.polygon-room .dimension-cross {
  z-index: 3;
  pointer-events: none;
}

.polygon-room.selected .polygon-room-shape {
  stroke: #0066cc;
  stroke-width: 5;
}

  .room.heated-1 { background: #ecfdf3; }
  .room.heated-2 { background: #fff7d6; }
  .room.heated-3 { background: #fde8e8; }
  .room.unheated { background: #f1f5f9; }

  .room-label {
    padding: 8px;
    font-size: 13px;
    line-height: 1.35;

    color: #1f2937 !important;
  opacity: 1 !important;
    font-weight: 600;
}

  .room-label strong {
    display: block;
    font-size: 15px;
    margin-bottom: 3px;

    color: #1f2937 !important;
  opacity: 1 !important;
}

  .door {
    position: absolute;
    background: #eef1f4;
    border: 2px solid #0b2a4a;
    z-index: 3;
  }

  .door.top, .door.bottom {
    height: 8px;
  }

  .door.left, .door.right {
    width: 8px;
  }

  .door.top { top: -6px; border-bottom: none; }
  .door.bottom { bottom: -6px; border-top: none; }
  .door.left { left: -6px; border-right: none; }
  .door.right { right: -6px; border-left: none; }

  .sidebar {
    background: white;
    border-radius: 14px;
    padding: 16px;
    border: 1px solid #d7d7d7;
    height: calc(100vh - 150px);
    min-height: 620px;
    overflow: auto;
  }

  .hint {
    color: #6b7280;
    line-height: 1.5;
    font-size: 14px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0;
    font-size: 14px;
  }

  .legend-color {
    width: 18px;
    height: 18px;
    border: 1px solid #999;
    border-radius: 4px;
  }

  .c1 { background: #ecfdf3; }
  .c2 { background: #fff7d6; }
  .c3 { background: #fde8e8; }
  .c4 { background: #f1f5f9; }

.mode-btn {
  background: #dbe7f1;
  color: #0b2a4a;
  border: 2px solid transparent;
  position: relative;
}

.mode-btn.active-mode {
  background: #ffffff;
  color: #0b2a4a;
  border-color: #ffffff;
  box-shadow: inset 0 -4px 0 #4ade80, 0 0 0 2px rgba(255,255,255,0.35);
}

.mode-btn.active-mode::after {
  content: "aktiv";
  margin-left: 8px;
  font-size: 11px;
  font-weight: 800;
  color: #166534;
  background: #dcfce7;
  padding: 2px 6px;
  border-radius: 999px;
}

.snap-toggle {
  background: #e5e7eb;
  color: #374151;
  border: 2px solid transparent;
}

.snap-toggle.active {
  background: #dcfce7;
  color: #166534;
  border-color: #22c55e;
}

.snap-toggle:not(.active) {
  background: #fee2e2;
  color: #991b1b;
  border-color: #f87171;
}

.workspace.draw-mode {
  cursor: crosshair;
}

/*
 * Während des Zeichnens sind alle bereits vorhandenen
 * Grundrisselemente für Mausereignisse vollständig gesperrt.
 * Klicks gelangen dadurch zum Workspace.
 */
.workspace.draw-mode .room,
.workspace.draw-mode .room *,
.workspace.draw-mode .distributor-marker,
.workspace.draw-mode .template-layer {
  pointer-events: none !important;
  cursor: crosshair !important;
}

/*
 * Auch Polygonflächen dürfen im Zeichenmodus
 * keine Klicks oder Mauszeiger übernehmen.
 */
.workspace.draw-mode .polygon-room-shape {
  pointer-events: none !important;
  cursor: crosshair !important;
}

/*
 * Die gerade aktive Wand-Zeichenebene bleibt sichtbar,
 * ihre Ereignisse werden weiterhin über den Workspace
 * verarbeitet.
 */
.workspace.draw-mode .wall-drawing-layer {
  pointer-events: none;
}

.draw-preview {
  position: absolute;
  border: 3px dashed #0066cc;
  background: rgba(0, 102, 204, 0.12);
  pointer-events: none;
  z-index: 20;
  overflow: hidden;
  box-sizing: border-box;
}

.draw-dimension-cross {
  opacity: 0.65;
}

.draw-area-live {
  position: absolute;
  left: 8px;
  top: 8px;
  background: rgba(255,255,255,0.92);
  color: #0b2a4a;
  font-size: 12px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 999px;
  z-index: 25;
  pointer-events: none;
}

.draw-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.draw-modal {
  width: min(520px, calc(100vw - 32px));
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}

.draw-modal h3 {
  margin: 0 0 14px;
  color: #0b2a4a;
}

.draw-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.draw-field {
  display: grid;
  gap: 5px;
}

.draw-field label {
  font-size: 13px;
  font-weight: 700;
}

.draw-field input,
.draw-field select {
  padding: 10px;
  border: 1px solid #d7d7d7;
  border-radius: 8px;
  font: inherit;
}

.draw-modal-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #d7d7d7;
  flex-wrap: wrap;
}

.draw-area-hint {
  background: #eef6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 10px;
  margin: 12px 0;
  font-weight: 700;
  color: #0b2a4a;
}

  @media print {
    header, .tabs, .sidebar {
      display: none;
    }

    .workspace-wrap {
      display: block;
      padding: 0;
    }

    .workspace {
      height: 100vh;
      border: none;
      border-radius: 0;
    }
  }

  .resize-handle {
  position: absolute;
  width: 13px;
  height: 13px;
  background: #0b2a4a;
  border: 2px solid white;
  border-radius: 50%;
  z-index: 5;
}

.resize-handle.nw {
  left: -8px;
  top: -8px;
  cursor: nwse-resize;
}

.resize-handle.ne {
  right: -8px;
  top: -8px;
  cursor: nesw-resize;
}

.resize-handle.sw {
  left: -8px;
  bottom: -8px;
  cursor: nesw-resize;
}

.resize-handle.se {
  right: -8px;
  bottom: -8px;
  cursor: nwse-resize;
}

.dimension-cross {
  position: absolute;
  inset: 14px;
  pointer-events: none;
  opacity: 0.8;
  z-index: 1;
}

.dim-line {
  position: absolute;
  background: #0b2a4a;
}

.dim-horizontal {
  left: 10px;
  right: 10px;
  top: 50%;
  height: 1px;
}

.dim-vertical {
  top: 10px;
  bottom: 10px;
  left: 50%;
  width: 1px;
}

.dim-text {
  position: absolute;
  background: rgba(255,255,255,0.85);
  color: #0b2a4a;
  font-size: 12px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 999px;
  white-space: nowrap;
}

.dim-width {
  left: 50%;
  top: calc(50% - 18px);
  transform: translateX(-50%);
}

.dim-height {
  left: calc(50% + 6px);
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
}

.floor-overview {
  background: #eef6ff;
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
}

.floor-overview h3 {
  margin: 0 0 10px;
  color: #0b2a4a;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.overview-value {
  background: white;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #d7d7d7;
}

.overview-value strong {
  display: block;
  font-size: 18px;
  color: #0b2a4a;
}

.room-card {
  border: 1px solid #d7d7d7;
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 10px;
  background: white;
  cursor: pointer;
  transition: 0.2s ease;
}

.room-card:hover {
  border-color: #0b2a4a;
  transform: translateY(-1px);
}

.room-card.active {
  border-color: #0b2a4a;
  box-shadow: 0 0 0 3px rgba(11, 42, 74, 0.18);
  background: #f0f7ff;
}

.room-card h4 {
  margin: 0 0 8px;
  color: #0b2a4a;
}

.room-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 10px;
  font-size: 13px;
}

.room-detail-grid span {
  color: #6b7280;
}

.room-detail-grid strong {
  color: #1f2937;
}

.room.selected {
  border-color: #0066cc;
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.25), 0 8px 22px rgba(0,0,0,0.14);
  z-index: 10;
}

.room.dimmed {
  opacity: 0.45;
}

.workspace.door-mode {
  cursor: cell;
}

.workspace.distributor-mode {
  cursor: crosshair;
}

.distributor-marker {
  position: absolute;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #0b2a4a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  z-index: 30;
  cursor: move;
}

.distributor-marker::after {
  content: "Verteiler";
  position: absolute;
  left: 48px;
  top: 9px;
  background: white;
  color: #0b2a4a;
  border: 1px solid #d7d7d7;
  border-radius: 999px;
  padding: 3px 8px;
  font-size: 12px;
  white-space: nowrap;
}

.mode-cursor-label {
  position: fixed;
  z-index: 2000;
  pointer-events: none;
  background: #0b2a4a;
  color: white;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  transform: translate(14px, 14px);
}

.distributor-ghost {
  position: fixed;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #0b2a4a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  pointer-events: none;
  z-index: 2001;
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
  transform: translate(-21px, -21px);
}

.draw-warning {
  margin: 12px 0;
  padding: 11px 13px;
  border: 1px solid #f59e0b;
  border-radius: 10px;
  background: #fff7ed;
  color: #92400e;
  font-size: 13px;
  line-height: 1.4;
}

.draw-warning strong {
  color: #78350f;
}

.template-layer {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  transform-origin: top left;
  user-select: none;
}

.template-layer.unlocked {
  cursor: grab;
  pointer-events: auto;
}

.template-layer.unlocked:active {
  cursor: grabbing;
}

.template-layer.locked {
  pointer-events: none;
}

.template-image {
  display: block;
  max-width: none;
  max-height: none;
  user-select: none;
  pointer-events: none;
}

.wall-detection-overlay {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 5;
}

.detected-wall-line {
  stroke: #2563eb;
  stroke-width: 3;
  stroke-dasharray: 10 6;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.detected-wall-line.horizontal {
  stroke: #2563eb;
}

.detected-wall-line.vertical {
  stroke: #7c3aed;
}

.wall-detection-status {
  padding: 9px 10px;
  border-radius: 9px;
  background: #eef6ff;
  border: 1px solid #bfdbfe;
  font-size: 13px;
  line-height: 1.4;
}

.wall-detection-status.warning {
  background: #fff7ed;
  border-color: #fdba74;
  color: #9a3412;
}

.wall-detection-status.success {
  background: #ecfdf3;
  border-color: #86efac;
  color: #166534;
}

.wall-detection-controls {
  display: grid;
  gap: 8px;
  padding-top: 12px;
  margin-top: 4px;
  border-top: 1px solid #d7d7d7;
}

.wall-detection-controls h4 {
  margin: 0;
  color: #0b2a4a;
}

.wall-detection-button-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.room {
  z-index: 10;
}

.draw-preview {
  z-index: 20;
}

.template-controls {
  display: grid;
  gap: 12px;
  margin-bottom: 14px;
  padding: 14px;
  border: 1px solid #d7d7d7;
  border-radius: 14px;
  background: white;
}

.template-controls h3 {
  margin: 0;
  color: #0b2a4a;
}

.template-control-row {
  display: grid;
  gap: 5px;
}

.template-control-row label {
  font-size: 13px;
  font-weight: 700;
}

.template-control-row input[type="range"] {
  width: 100%;
}

.template-value {
  font-size: 12px;
  color: #64748b;
}

.template-button-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.template-status {
  padding: 9px 10px;
  border-radius: 9px;
  background: #eef6ff;
  border: 1px solid #bfdbfe;
  font-size: 13px;
  line-height: 1.4;
}

.template-status.warning {
  background: #fff7ed;
  border-color: #fdba74;
  color: #9a3412;
}

.calibration-point {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #dc2626;
  border: 3px solid white;
  box-shadow: 0 0 0 2px #dc2626;
  transform: translate(-50%, -50%);
  z-index: 80;
  pointer-events: none;
}

.calibration-line {
  position: absolute;
  height: 3px;
  background: #dc2626;
  transform-origin: left center;
  z-index: 79;
  pointer-events: none;
}

.workspace.calibration-mode {
  cursor: crosshair;
}

.workspace.template-move-mode {
  cursor: default;
}

.wall-drawing-layer {
  position: absolute;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  overflow: visible;
}

.wall-drawing-line {
  stroke: #dc2626;
  stroke-width: 4;
  stroke-linecap: square;
  vector-effect: non-scaling-stroke;
}

.wall-preview-line {
  stroke: #2563eb;
  stroke-width: 3;
  stroke-dasharray: 8 6;
  vector-effect: non-scaling-stroke;
}

.wall-drawing-point {
  fill: #ffffff;
  stroke: #dc2626;
  stroke-width: 3;
  vector-effect: non-scaling-stroke;
}

.wall-start-point {
  fill: #22c55e;
  stroke: #166534;
  stroke-width: 3;
  vector-effect: non-scaling-stroke;
}

.wall-preview-point {
  fill: #2563eb;
  stroke: #ffffff;
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.wall-drawing-hint {
  position: absolute;
  z-index: 90;
  padding: 7px 10px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.92);
  color: white;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
}

.hidden {
  display: none !important;
}

.workspace.draw-lines-mode {
  cursor: crosshair;
}

.draw-mode-group {
  display: flex;
  gap: 6px;
  padding: 4px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
}
</style>
</head>
<body>
<header>
  <h1>Schematischer Grundriss</h1>
  <div class="toolbar">
<button id="uploadTemplateBtn" type="button">
  Vorlage hochladen
</button>
<button
  id="snapToggleBtn"
  type="button"
  onclick="toggleSnap()"
  class="snap-toggle active"
>
  Fang: EIN
</button>

<input
  id="templateFileInput"
  type="file"
  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
  hidden
>
<button id="moveModeBtn" onclick="setMode('move')" class="mode-btn active-mode">Raum verschieben</button>
<div class="draw-mode-group">
  <button
    id="drawRectModeBtn"
    onclick="setMode('draw-rect')"
    class="mode-btn"
  >
    Rechteck zeichnen
  </button>

  <button
    id="drawLinesModeBtn"
    onclick="setMode('draw-lines')"
    class="mode-btn"
  >
    Wände zeichnen
  </button>
</div>
<button id="doorModeBtn" onclick="setMode('door')" class="mode-btn">Tür setzen</button>
<button id="distributorModeBtn" onclick="setMode('distributor')" class="mode-btn">Verteiler setzen</button>
<button onclick="addFloorFromPlan()">Etage hinzufügen</button>
<button onclick="deleteAllRooms()">Alle Räume löschen</button>
<button onclick="window.print()">Drucken / PDF</button>
</div>
</header>

<div class="tabs" id="tabs"></div>

<div class="workspace-wrap">
  <div class="workspace" id="workspace"></div>

  <aside class="sidebar">
  <div id="templateControls"></div>
  <div id="floorOverview"></div>
  <div id="roomCards"></div>
</aside>
</div>

<script>
const floorData = ${JSON.stringify(floorData)};
let activeFloorIndex = 0;
let selectedRoomIndex = null;
let mode = 'move';

const SNAP_GRID_SIZE = 10;
const CLOSE_SNAP_DISTANCE = 35;

let snapEnabled = true;

let drag = null;
let resize = null;
let draw = null;
let lineDrawing = {
  points: [],
  previewLine: null,
  previewPoint: null
};
let modeCursorLabel = null;
let distributorGhost = null;
let distributorDrag = null;
let templateDrag = null;

let calibration = {
  active: false,
  points: []
};

const DEFAULT_PIXELS_PER_METER = 42;

function getRoomSize(room) {
  const area = Math.max(Number(room.area) || 8, 4);
  const ratio = 1.35;

  const widthM = Math.sqrt(area * ratio);
  const heightM = area / widthM;

  return {
    width: metersToPixels(widthM),
height: metersToPixels(heightM)
  };
}

function getRoomDimensions(room) {
  const widthPx = Number(room.floorplan?.width) || 1;
  const heightPx = Number(room.floorplan?.height) || 1;

 const widthM = pixelsToMeters(widthPx);
const heightM = pixelsToMeters(heightPx);

  return {
    widthM: widthM.toFixed(2).replace('.', ','),
    heightM: heightM.toFixed(2).replace('.', ',')
  };
}

function updateRoomDimensionText(roomEl, room) {
  const dimensions = getRoomDimensions(room);

  const widthText = roomEl.querySelector('.dim-width');
  const heightText = roomEl.querySelector('.dim-height');
  const label = roomEl.querySelector('.room-label');

  if (widthText) widthText.textContent = dimensions.widthM + ' m';
  if (heightText) heightText.textContent = dimensions.heightM + ' m';

if (label) {
  label.innerHTML = '<strong>' + room.name + '</strong>';
}
}

function initRoomPosition(room, roomIndex) {
  room.floorplan = room.floorplan || {};

  const size = getRoomSize(room);

  if (!room.floorplan.width) room.floorplan.width = size.width;
  if (!room.floorplan.height) room.floorplan.height = size.height;

  if (room.floorplan.x === null || room.floorplan.x === undefined) {
    room.floorplan.x = 40 + (roomIndex % 4) * 230;
  }

  if (room.floorplan.y === null || room.floorplan.y === undefined) {
    room.floorplan.y = 40 + Math.floor(roomIndex / 4) * 190;
  }
}

function renderTabs() {
  const tabs = document.getElementById('tabs');

  tabs.innerHTML = floorData.map((floor, index) => {
    return '<button class="tab ' + (index === activeFloorIndex ? 'active' : '') + '" onclick="setFloor(' + index + ')">' + floor.name + '</button>';
  }).join('');
}

function setMode(newMode) {
 if (mode === 'draw-lines' && newMode !== 'draw-lines') {
  cancelLineDrawing();
 }

  const template = getActiveTemplate();

  const isDrawingMode =
  newMode === 'draw-rect' ||
  newMode === 'draw-lines';

 if (
  isDrawingMode &&
  template.src &&
  !template.locked
 ) {
    alert(
      'Bitte sperren Sie die Grundrissvorlage, bevor Sie Räume darüber zeichnen.'
    );
    return;
  }

  mode = newMode;

  document.getElementById('moveModeBtn')?.classList.toggle('active-mode', mode === 'move');
  document
  .getElementById('drawRectModeBtn')
  ?.classList.toggle(
    'active-mode',
    mode === 'draw-rect'
  );

 document
  .getElementById('drawLinesModeBtn')
  ?.classList.toggle(
    'active-mode',
    mode === 'draw-lines'
  );
  document.getElementById('doorModeBtn')?.classList.toggle('active-mode', mode === 'door');
  document.getElementById('distributorModeBtn')?.classList.toggle('active-mode', mode === 'distributor');
  document
  .getElementById('workspace')
  ?.classList.toggle(
    'calibration-mode',
    mode === 'calibrate'
  );

  document
  .getElementById('workspace')
  ?.classList.toggle(
    'draw-mode',
    isDrawingMode
  );

 document
  .getElementById('workspace')
  ?.classList.toggle(
    'draw-lines-mode',
    mode === 'draw-lines'
  );
  document.getElementById('workspace')?.classList.toggle('door-mode', mode === 'door');
  document.getElementById('workspace')?.classList.toggle('distributor-mode', mode === 'distributor');

  removeModeHelpers();

  if (mode === 'door') {
    createModeCursorLabel('Tür in diesen Raum setzen');
  }

  if (mode === 'distributor') {
    createModeCursorLabel('Verteiler absetzen');
    createDistributorGhost();
  }

  if (mode === 'draw-lines') {
  createModeCursorLabel(
    'Startpunkt setzen – danach weitere Punkte anklicken – Endpunkt = Startpunkt'
  );
  }
}

function toggleSnap() {
  snapEnabled = !snapEnabled;

  const button =
    document.getElementById('snapToggleBtn');

  if (!button) return;

  button.textContent =
    snapEnabled
      ? 'Fang: EIN'
      : 'Fang: AUS';

  button.classList.toggle(
    'active',
    snapEnabled
  );
}

function snapValue(value) {
  if (!snapEnabled) {
    return Math.round(value * 10) / 10;
  }

  return (
    Math.round(value / SNAP_GRID_SIZE) *
    SNAP_GRID_SIZE
  );
}

function startCalibration() {
  const template = getActiveTemplate();

  if (!template.src) {
    alert(
      'Bitte laden Sie zuerst eine Grundrissvorlage hoch.'
    );
    return;
  }

  if (!template.locked) {
    alert(
      'Bitte sperren Sie die Vorlage zunächst, damit sie während der Kalibrierung nicht versehentlich verschoben wird.'
    );
    return;
  }

  calibration.active = true;
  calibration.points = [];

  setMode('calibrate');

  alert(
    'Klicken Sie jetzt nacheinander auf die beiden Endpunkte einer bekannten Strecke.'
  );
}

function createModeCursorLabel(text) {
  removeModeCursorLabel();

  modeCursorLabel =
    document.createElement('div');

  modeCursorLabel.className =
    'mode-cursor-label';

  modeCursorLabel.textContent = text;

  document.body.appendChild(
    modeCursorLabel
  );
}

function removeModeCursorLabel() {
  /*
   * Entfernt auch versehentlich früher erzeugte
   * Hinweisfelder, auf die die Variable nicht mehr zeigt.
   */
  document
    .querySelectorAll('.mode-cursor-label')
    .forEach((label) => label.remove());

  modeCursorLabel = null;
}

function createDistributorGhost() {
  distributorGhost = document.createElement('div');
  distributorGhost.className = 'distributor-ghost';
  distributorGhost.textContent = 'V';
  document.body.appendChild(distributorGhost);
}

function removeModeHelpers() {
  removeModeCursorLabel();

  if (distributorGhost) {
    distributorGhost.remove();
    distributorGhost = null;
  }
}

function moveModeHelpers(e) {
  if (modeCursorLabel) {
    modeCursorLabel.style.left = e.clientX + 'px';
    modeCursorLabel.style.top = e.clientY + 'px';
  }

  if (distributorGhost) {
    distributorGhost.style.left = e.clientX + 'px';
    distributorGhost.style.top = e.clientY + 'px';
  }
}

function deleteSelectedRoom() {
  if (selectedRoomIndex === null) return;

  const floor = floorData[activeFloorIndex];
  const room = floor.rooms[selectedRoomIndex];

  const ok = confirm('Möchten Sie den Raum "' + room.name + '" wirklich löschen?');
  if (!ok) return;

  const deletedInMainWindow =
    window.opener &&
    typeof window.opener.deleteRoomFromFloorplan === 'function'
      ? window.opener.deleteRoomFromFloorplan(activeFloorIndex, selectedRoomIndex)
      : false;

  if (!deletedInMainWindow) {
    alert('Der Raum konnte nicht im Haupt-Konfigurator gelöscht werden.');
    return;
  }

  floor.rooms.splice(selectedRoomIndex, 1);
  selectedRoomIndex = null;

  renderFloor();
}

function deleteAllRooms() {
  const floor = floorData[activeFloorIndex];

  if (!floor.rooms.length) {
    alert('In dieser Etage sind keine Räume vorhanden.');
    return;
  }

  const ok = confirm('Möchten Sie wirklich alle Räume der Etage "' + floor.name + '" löschen?');
  if (!ok) return;

  const deletedInMainWindow =
    window.opener &&
    typeof window.opener.deleteAllRoomsFromFloorplan === 'function'
      ? window.opener.deleteAllRoomsFromFloorplan(activeFloorIndex)
      : false;

  if (!deletedInMainWindow) {
    alert('Die Räume konnten nicht im Haupt-Konfigurator gelöscht werden.');
    return;
  }

  floor.rooms = [];
  selectedRoomIndex = null;

  renderFloor();
}

function getRoomIcon(room) {
  const name = String(room.name || '').toLowerCase();
  const fn = String(room.function || '').toLowerCase();

  if (name.includes('bad') || fn.includes('bad')) return '🚿';
  if (name.includes('wc')) return '🚽';
  if (name.includes('küche')) return '🍽';
  if (name.includes('flur') || name.includes('diele')) return '🚪';
  if (name.includes('hwr') || name.includes('hauswirtschaft')) return '🧺';
  if (name.includes('schlaf')) return '🛏';
  if (name.includes('kind')) return '👶';
  if (name.includes('büro')) return '💼';
  if (name.includes('abstell')) return '📦';
  return '🏠';
}

function getCircuitText(room) {
  return room.circuits > 0 ? room.circuits : '–';
}

function renderSidebar() {
  const floor = floorData[activeFloorIndex];
  const floorOverview = document.getElementById('floorOverview');
  const roomCards = document.getElementById('roomCards');

  const totalArea = floor.rooms.reduce((sum, room) => sum + (Number(room.area) || 0), 0);
  const totalCircuits = floor.rooms.reduce((sum, room) => sum + (Number(room.circuits) || 0), 0);
  const totalPipe = floor.rooms.reduce((sum, room) => sum + (Number(room.pipeLength) || 0), 0);

  floorOverview.innerHTML =
    '<div class="floor-overview">' +
      '<h3>' + floor.name + '</h3>' +
      '<div class="overview-grid">' +
        '<div class="overview-value"><strong>' + floor.rooms.length + '</strong><span>Räume</span></div>' +
        '<div class="overview-value"><strong>' + totalArea.toFixed(1).replace('.', ',') + ' m²</strong><span>Fläche</span></div>' +
        '<div class="overview-value"><strong>' + totalCircuits + '</strong><span>Heizkreise</span></div>' +
        '<div class="overview-value"><strong>' + Math.round(totalPipe) + ' m</strong><span>Rohr</span></div>' +
      '</div>' +
    '</div>';

if (!floor.rooms.length) {
  roomCards.innerHTML =
    '<div class="room-card">' +
      '<h4>Keine Räume vorhanden</h4>' +
      '<div class="muted">Nutzen Sie „Raum zeichnen“, um Räume auf dieser Etage anzulegen.</div>' +
    '</div>';
  return;
}

roomCards.innerHTML = floor.rooms.map((room, index) => {
    const dimensions = getRoomDimensions(room);
    const activeClass = selectedRoomIndex === index ? 'active' : '';

    return (
      '<div class="room-card ' + activeClass + '" data-room-card-index="' + index + '">' +
        '<h4>' + getRoomIcon(room) + ' ' + room.name + '</h4>' +
        '<div class="room-detail-grid">' +
          '<span>Fläche</span><strong>' + room.area + ' m²</strong>' +
          '<span>Maße</span><strong>' + dimensions.widthM + ' × ' + dimensions.heightM + ' m</strong>' +
          '<span>Verlegeabstand</span><strong>' + room.spacing + '</strong>' +
          '<span>Heizkreise</span><strong>' + getCircuitText(room) + '</strong>' +
          '<span>Rohrlänge</span><strong>ca. ' + Math.round(room.pipeLength) + ' m</strong>' +
          '<span>Funktion</span><strong>' + room.function + '</strong>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  document.querySelectorAll('.room-card').forEach((card) => {
    card.addEventListener('click', () => {
      selectRoom(Number(card.dataset.roomCardIndex));
    });
  });
}

function selectRoom(roomIndex) {
  selectedRoomIndex = roomIndex;

  document.querySelectorAll('.room').forEach((roomEl) => {
    const isSelected = Number(roomEl.dataset.roomIndex) === selectedRoomIndex;
    roomEl.classList.toggle('selected', isSelected);
    roomEl.classList.toggle('dimmed', selectedRoomIndex !== null && !isSelected);
  });

  document.querySelectorAll('.room-card').forEach((card) => {
    card.classList.toggle('active', Number(card.dataset.roomCardIndex) === selectedRoomIndex);
  });

  const activeCard = document.querySelector('.room-card.active');
  if (activeCard) {
    activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function renderTemplate() {
  const workspace = document.getElementById('workspace');
  const template = getActiveTemplate();

 if (!template.src) {
  return;
 }

  const layer = document.createElement('div');

  layer.id = 'templateLayer';
  layer.className =
    'template-layer ' +
    (template.locked ? 'locked' : 'unlocked');

  layer.style.left = template.x + 'px';
  layer.style.top = template.y + 'px';
  layer.style.opacity = String(template.opacity);
  layer.style.transform =
    'scale(' + template.scale + ')';

  const image = document.createElement('img');

  image.className = 'template-image';
  image.src = template.src;
  image.alt = template.fileName || 'Grundrissvorlage';
  image.draggable = false;

  layer.appendChild(image);

  image.addEventListener('load', () => {
  renderDetectedWallOverlay(
    layer,
    image,
    template
  );
 });

  if (!template.locked) {
    layer.addEventListener(
      'mousedown',
      startTemplateDrag
    );
  }

  workspace.appendChild(layer);
}

function renderDetectedWallOverlay(
  layer,
  image,
  template
) {
  layer
    .querySelector(
      '.wall-detection-overlay'
    )
    ?.remove();

  const walls =
    Array.isArray(template.detectedWalls)
      ? template.detectedWalls
      : [];

  if (!walls.length) {
    return;
  }

  const imageWidth =
    image.naturalWidth;

  const imageHeight =
    image.naturalHeight;

  if (
    !imageWidth ||
    !imageHeight
  ) {
    return;
  }

  const svg =
    document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );

  svg.classList.add(
    'wall-detection-overlay'
  );

  svg.setAttribute(
    'width',
    imageWidth
  );

  svg.setAttribute(
    'height',
    imageHeight
  );

  svg.setAttribute(
    'viewBox',
    '0 0 ' +
      imageWidth +
      ' ' +
      imageHeight
  );

  walls.forEach((wall) => {
    const line =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line'
      );

    line.setAttribute(
      'x1',
      wall.x1
    );

    line.setAttribute(
      'y1',
      wall.y1
    );

    line.setAttribute(
      'x2',
      wall.x2
    );

    line.setAttribute(
      'y2',
      wall.y2
    );

    line.setAttribute(
      'class',
      'detected-wall-line ' +
        wall.orientation
    );

    svg.appendChild(line);
  });

  layer.appendChild(svg);
}

function isOpenCvAvailable() {
  return Boolean(
    window.openCvReady &&
    window.cv &&
    typeof window.cv.Mat === 'function'
  );
}

function getDetectedLineLength(line) {
  return Math.hypot(
    line.x2 - line.x1,
    line.y2 - line.y1
  );
}

function normalizeDetectedLine(line) {
  if (
    line.orientation === 'horizontal' &&
    line.x1 > line.x2
  ) {
    return {
      ...line,
      x1: line.x2,
      x2: line.x1
    };
  }

  if (
    line.orientation === 'vertical' &&
    line.y1 > line.y2
  ) {
    return {
      ...line,
      y1: line.y2,
      y2: line.y1
    };
  }

  return line;
}

function mergeDetectedLines(lines) {
  const normalized =
    lines
      .map(normalizeDetectedLine)
      .sort((lineA, lineB) => {
        if (
          lineA.orientation !==
          lineB.orientation
        ) {
          return lineA.orientation.localeCompare(
            lineB.orientation
          );
        }

        if (
          lineA.orientation ===
          'horizontal'
        ) {
          return (
            lineA.y1 - lineB.y1 ||
            lineA.x1 - lineB.x1
          );
        }

        return (
          lineA.x1 - lineB.x1 ||
          lineA.y1 - lineB.y1
        );
      });

  const merged = [];

  normalized.forEach((line) => {
    const existing =
      merged.find((candidate) => {
        if (
          candidate.orientation !==
          line.orientation
        ) {
          return false;
        }

        if (
          line.orientation ===
          'horizontal'
        ) {
          const sameAxis =
            Math.abs(
              candidate.y1 - line.y1
            ) <= 8;

          const overlapping =
            line.x1 <=
              candidate.x2 + 18 &&
            line.x2 >=
              candidate.x1 - 18;

          return (
            sameAxis &&
            overlapping
          );
        }

        const sameAxis =
          Math.abs(
            candidate.x1 - line.x1
          ) <= 8;

        const overlapping =
          line.y1 <=
            candidate.y2 + 18 &&
          line.y2 >=
            candidate.y1 - 18;

        return (
          sameAxis &&
          overlapping
        );
      });

    if (!existing) {
      merged.push({
        ...line
      });

      return;
    }

    if (
      line.orientation ===
      'horizontal'
    ) {
      existing.x1 =
        Math.min(
          existing.x1,
          line.x1
        );

      existing.x2 =
        Math.max(
          existing.x2,
          line.x2
        );

      existing.y1 =
        existing.y2 =
          Math.round(
            (
              existing.y1 +
              line.y1
            ) / 2
          );
    } else {
      existing.y1 =
        Math.min(
          existing.y1,
          line.y1
        );

      existing.y2 =
        Math.max(
          existing.y2,
          line.y2
        );

      existing.x1 =
        existing.x2 =
          Math.round(
            (
              existing.x1 +
              line.x1
            ) / 2
          );
    }
  });

  return merged.filter(
    (line) =>
      getDetectedLineLength(line) >= 35
  );
}

async function detectWallsFromTemplate() {
  const template =
    getActiveTemplate();

  if (!template.src) {
    alert(
      'Bitte laden Sie zuerst eine Grundrissvorlage hoch.'
    );

    return;
  }

  if (!isOpenCvAvailable()) {
    alert(
      'Die Bilderkennung wird noch geladen. Bitte versuchen Sie es in einigen Sekunden erneut.'
    );

    return;
  }

  const button =
    document.getElementById(
      'detectWallsBtn'
    );

  const status =
    document.getElementById(
      'wallDetectionStatus'
    );

  if (button) {
    button.disabled = true;
    button.textContent =
      'Erkennung läuft …';
  }

  if (status) {
    status.className =
      'wall-detection-status';

    status.textContent =
      'Vorlage wird analysiert …';
  }

  const image =
    new Image();

  image.onload = () => {
    let src = null;
    let gray = null;
    let blurred = null;
    let edges = null;
    let lines = null;

    try {
      src =
        cv.imread(image);

      gray =
        new cv.Mat();

      blurred =
        new cv.Mat();

      edges =
        new cv.Mat();

      lines =
        new cv.Mat();

      /*
       * Bild in Graustufen umwandeln.
       */
      cv.cvtColor(
        src,
        gray,
        cv.COLOR_RGBA2GRAY
      );

      /*
       * Kleine JPEG-Artefakte und Texte etwas
       * glätten.
       */
      cv.GaussianBlur(
        gray,
        blurred,
        new cv.Size(5, 5),
        0,
        0,
        cv.BORDER_DEFAULT
      );

      /*
       * Kanten bestimmen.
       */
      cv.Canny(
        blurred,
        edges,
        60,
        160,
        3,
        false
      );

      /*
       * Gerade Liniensegmente erkennen.
       */
      cv.HoughLinesP(
        edges,
        lines,
        1,
        Math.PI / 180,
        45,
        35,
        16
      );

      const detectedLines = [];

      for (
        let index = 0;
        index < lines.rows;
        index++
      ) {
        const offset =
          index * 4;

        const x1 =
          lines.data32S[
            offset
          ];

        const y1 =
          lines.data32S[
            offset + 1
          ];

        const x2 =
          lines.data32S[
            offset + 2
          ];

        const y2 =
          lines.data32S[
            offset + 3
          ];

        const deltaX =
          Math.abs(x2 - x1);

        const deltaY =
          Math.abs(y2 - y1);

        /*
         * Nur annähernd waagerechte oder
         * senkrechte Linien übernehmen.
         */
        if (
          deltaY <=
          Math.max(4, deltaX * 0.08)
        ) {
          const y =
            Math.round(
              (y1 + y2) / 2
            );

          detectedLines.push({
            x1,
            y1: y,
            x2,
            y2: y,
            orientation:
              'horizontal'
          });

          continue;
        }

        if (
          deltaX <=
          Math.max(4, deltaY * 0.08)
        ) {
          const x =
            Math.round(
              (x1 + x2) / 2
            );

          detectedLines.push({
            x1: x,
            y1,
            x2: x,
            y2,
            orientation:
              'vertical'
          });
        }
      }

      template.detectedWalls =
        mergeDetectedLines(
          detectedLines
        );

      if (status) {
        status.className =
          'wall-detection-status success';

        status.textContent =
          template.detectedWalls.length +
          ' mögliche Wandlinien erkannt.';
      }

      renderFloor();
    } catch (error) {
      console.error(
        'Fehler bei der Wanderkennung:',
        error
      );

      alert(
        'Die Vorlage konnte nicht analysiert werden.'
      );
    } finally {
      src?.delete();
      gray?.delete();
      blurred?.delete();
      edges?.delete();
      lines?.delete();

      if (button) {
        button.disabled = false;
        button.textContent =
          'Wände erkennen';
      }
    }
  };

  image.onerror = () => {
    alert(
      'Die Grundrissvorlage konnte für die Bilderkennung nicht geladen werden.'
    );

    if (button) {
      button.disabled = false;
      button.textContent =
        'Wände erkennen';
    }
  };

  image.src =
    template.src;
}

function clearDetectedWalls() {
  const template =
    getActiveTemplate();

  template.detectedWalls = [];

  renderFloor();
}

function openTemplateFileDialog() {
  document.getElementById('templateFileInput').click();
}

function handleTemplateUpload(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  const allowedTypes = [
    'image/jpeg',
    'image/png'
  ];

  if (!allowedTypes.includes(file.type)) {
    alert(
      'Bitte laden Sie eine JPG-, JPEG- oder PNG-Datei hoch.'
    );

    event.target.value = '';
    return;
  }

  const maxFileSize = 12 * 1024 * 1024;

  if (file.size > maxFileSize) {
    alert(
      'Die Datei ist größer als 12 MB. Bitte verwenden Sie eine kleinere oder komprimierte Bilddatei.'
    );

    event.target.value = '';
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const template = getActiveTemplate();

    template.src = String(reader.result || '');
    template.fileName = file.name;
    template.x = 40;
    template.y = 40;
    template.scale = 1;
    template.opacity = 0.55;
    template.locked = false;
    template.pixelsPerMeter = null;
    template.detectedWalls = [];

    calibration.active = false;
    calibration.points = [];

    saveTemplateToMainWindow();
    renderFloor();
  };

  reader.onerror = () => {
    alert(
      'Die Grundrissvorlage konnte nicht eingelesen werden.'
    );
  };

  reader.readAsDataURL(file);

  event.target.value = '';
}

function createPolygonRoomSvg(room) {
  const floorplan = room.floorplan || {};
  const points = Array.isArray(floorplan.points)
    ? floorplan.points
    : [];

  if (points.length < 3) return null;

  const width = Math.max(
    Number(floorplan.width) || 1,
    1
  );

  const height = Math.max(
    Number(floorplan.height) || 1,
    1
  );

  const svg = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );

  svg.classList.add('polygon-room-svg');

  svg.setAttribute(
    'viewBox',
    '0 0 ' + width + ' ' + height
  );

  svg.setAttribute(
    'preserveAspectRatio',
    'none'
  );

  const polygon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polygon'
  );

  polygon.classList.add('polygon-room-shape');

  polygon.setAttribute(
    'points',
    points
      .map((point) => {
        return point.x + ',' + point.y;
      })
      .join(' ')
  );

  svg.appendChild(polygon);

  return svg;
}

function renderFloor() {
  renderTabs();

  const workspace = document.getElementById('workspace');
  const floor = floorData[activeFloorIndex];

  workspace.innerHTML = '';
  selectedRoomIndex = null;

  renderTemplate();

  floor.rooms.forEach((room, roomIndex) => {
    initRoomPosition(room, roomIndex);

    const div = document.createElement('div');

    const circuitClass =
      room.function === 'unbeheizter Raum'
        ? 'unheated'
        : room.circuits <= 1
          ? 'heated-1'
          : room.circuits === 2
            ? 'heated-2'
            : 'heated-3';

    const isPolygon =
  room.floorplan?.shapeType === 'polygon' &&
  Array.isArray(room.floorplan?.points) &&
  room.floorplan.points.length >= 3;

div.className =
  'room ' +
  circuitClass +
  (isPolygon ? ' polygon-room' : '');

div.dataset.roomIndex = roomIndex;

div.style.left =
  room.floorplan.x + 'px';

div.style.top =
  room.floorplan.y + 'px';

div.style.width =
  room.floorplan.width + 'px';

div.style.height =
  room.floorplan.height + 'px';

const dimensions =
  getRoomDimensions(room);

div.innerHTML =
  '<div class="dimension-cross">' +
    '<div class="dim-line dim-horizontal"></div>' +
    '<div class="dim-line dim-vertical"></div>' +
    '<div class="dim-text dim-width">' +
      dimensions.widthM +
      ' m</div>' +
    '<div class="dim-text dim-height">' +
      dimensions.heightM +
      ' m</div>' +
  '</div>' +

  '<div class="room-label">' +
    '<strong>' +
      room.name +
    '</strong>' +
  '</div>';

if (isPolygon) {
  const svg =
    createPolygonRoomSvg(room);

  if (svg) {
    div.insertBefore(
      svg,
      div.firstChild
    );
  }
}

  if (
  !isPolygon &&
  room.floorplan.doorEnabled
) {
  div.appendChild(createDoor(room));
}

if (!isPolygon) {
  ['nw', 'ne', 'sw', 'se'].forEach((pos) => {
    const handle =
      document.createElement('div');

    handle.className =
      'resize-handle ' + pos;

    handle.dataset.resize = pos;

    handle.addEventListener(
      'mousedown',
      startResize
    );

    div.appendChild(handle);
  });
}

 div.addEventListener('mousedown', startDrag);
 div.addEventListener('click', (e) => {
  if (
    mode === 'draw-rect' ||
    mode === 'draw-lines'
  ) {
    return;
  }

  if (
    e.target.classList.contains(
      'resize-handle'
    )
  ) {
    return;
  }

  if (mode === 'door') {
    e.stopPropagation();

    if (isPolygon) {
      alert(
        'Türen an frei gezeichneten Raumkonturen werden im nächsten Erweiterungsschritt einzelnen Wandabschnitten zugeordnet.'
      );
      return;
    }

    openDoorDialog(roomIndex);
    return;
  }

  selectRoom(roomIndex);
});

    workspace.appendChild(div);
  });

    renderDistributor();
    renderTemplateControls();
    renderSidebar();
}

function createDoor(room) {
  const door = document.createElement('div');
  const side = room.floorplan.doorSide || 'bottom';
  const pos = Number(room.floorplan.doorPosition) || 50;
  const doorWidthCm = Number(room.floorplan.doorWidth) || 90;
  const doorWidthPx = Math.max(doorWidthCm * 0.7, 42);

  door.className = 'door ' + side;

  if (side === 'top' || side === 'bottom') {
    door.style.width = doorWidthPx + 'px';
    door.style.left = 'calc(' + pos + '% - ' + (doorWidthPx / 2) + 'px)';
  } else {
    door.style.height = doorWidthPx + 'px';
    door.style.top = 'calc(' + pos + '% - ' + (doorWidthPx / 2) + 'px)';
  }

  return door;
}

function renderDistributor() {
  const workspace = document.getElementById('workspace');
  const floor = floorData[activeFloorIndex];

  if (!floor.distributor) return;

  const marker = document.createElement('div');
  marker.className = 'distributor-marker';
  marker.textContent = 'V';
  marker.style.left = floor.distributor.x + 'px';
  marker.style.top = floor.distributor.y + 'px';

  marker.addEventListener('mousedown', startDistributorDrag);

  workspace.appendChild(marker);
}

function startDistributorDrag(e) {
  if (mode !== 'move') return;

  e.preventDefault();
  e.stopPropagation();

  const floor = floorData[activeFloorIndex];

  distributorDrag = {
    marker: e.currentTarget,
    startX: e.clientX,
    startY: e.clientY,
    origX: floor.distributor.x,
    origY: floor.distributor.y
  };

  document.addEventListener('mousemove', onDistributorDrag);
  document.addEventListener('mouseup', stopDistributorDrag);
}

function onDistributorDrag(e) {
  if (!distributorDrag) return;

  const floor = floorData[activeFloorIndex];

  const dx = e.clientX - distributorDrag.startX;
  const dy = e.clientY - distributorDrag.startY;

  const grid = 10;
  const newX = Math.max(0, Math.round((distributorDrag.origX + dx) / grid) * grid);
  const newY = Math.max(0, Math.round((distributorDrag.origY + dy) / grid) * grid);

  floor.distributor.x = newX;
  floor.distributor.y = newY;

  distributorDrag.marker.style.left = newX + 'px';
  distributorDrag.marker.style.top = newY + 'px';
}

function stopDistributorDrag() {
  if (!distributorDrag) return;

  const floor = floorData[activeFloorIndex];

  const saved =
    window.opener &&
    typeof window.opener.updateDistributorFromWindow === 'function'
      ? window.opener.updateDistributorFromWindow(activeFloorIndex, floor.distributor)
      : false;

  if (!saved) {
    alert('Der Verteiler konnte nicht im Haupt-Konfigurator gespeichert werden.');
  }

  document.removeEventListener('mousemove', onDistributorDrag);
  document.removeEventListener('mouseup', stopDistributorDrag);

  distributorDrag = null;
}

function openDoorDialog(roomIndex) {
  removeModeHelpers();

  const room = floorData[activeFloorIndex].rooms[roomIndex];
  const fp = room.floorplan || {};

  const backdrop = document.createElement('div');
  backdrop.className = 'draw-modal-backdrop';

  backdrop.innerHTML =
    '<div class="draw-modal">' +
      '<h3>Tür setzen</h3>' +
      '<div class="draw-grid">' +
        '<div class="draw-field">' +
          '<label>Tür vorhanden?</label>' +
          '<select id="doorEnabled">' +
            '<option value="ja">Ja</option>' +
            '<option value="nein">Nein</option>' +
          '</select>' +
        '</div>' +
        '<div class="draw-field">' +
          '<label>Türseite</label>' +
          '<select id="doorSide">' +
            '<option value="top">oben</option>' +
            '<option value="right">rechts</option>' +
            '<option value="bottom">unten</option>' +
            '<option value="left">links</option>' +
          '</select>' +
        '</div>' +
        '<div class="draw-field">' +
          '<label>Position %</label>' +
          '<input id="doorPosition" type="number" min="5" max="95" step="5" value="' + (fp.doorPosition || 50) + '">' +
        '</div>' +
        '<div class="draw-field">' +
          '<label>Türbreite cm</label>' +
          '<input id="doorWidth" type="number" min="60" max="140" step="5" value="' + (fp.doorWidth || 90) + '">' +
        '</div>' +
      '</div>' +
      '<div class="draw-modal-actions">' +
        '<button type="button" id="cancelDoorDialog">Abbrechen</button>' +
        '<button type="button" id="saveDoorDialog">Tür übernehmen</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(backdrop);
 
  document.getElementById('doorEnabled').value = fp.doorEnabled ? 'ja' : 'nein';
  document.getElementById('doorSide').value = fp.doorSide || 'bottom';

  document.getElementById('cancelDoorDialog').addEventListener('click', () => {
    backdrop.remove();
  });

  document.getElementById('saveDoorDialog').addEventListener('click', () => {
    const newFloorplan = {
      ...room.floorplan,
      doorEnabled: document.getElementById('doorEnabled').value === 'ja',
      doorSide: document.getElementById('doorSide').value,
      doorPosition: Number(document.getElementById('doorPosition').value) || 50,
      doorWidth: Number(document.getElementById('doorWidth').value) || 90
    };

    const saved =
      window.opener &&
      typeof window.opener.updateRoomFloorplanFromWindow === 'function'
        ? window.opener.updateRoomFloorplanFromWindow(activeFloorIndex, roomIndex, newFloorplan)
        : false;

    if (!saved) {
      alert('Die Tür konnte nicht im Haupt-Konfigurator gespeichert werden.');
      return;
    }

    room.floorplan = newFloorplan;

    backdrop.remove();
    setMode('move');
    renderFloor();
    selectRoom(roomIndex);
  });
}

function setFloor(index) {
  activeFloorIndex = index;
  selectedRoomIndex = null;

  calibration.active = false;
  calibration.points = [];

  setMode('move');
  renderFloor();
}

function addFloorFromPlan() {
  const backdrop = document.createElement('div');
  backdrop.className = 'draw-modal-backdrop';

  backdrop.innerHTML =
    '<div class="draw-modal">' +
      '<h3>Etage hinzufügen</h3>' +

      '<div class="draw-field">' +
        '<label>Bezeichnung der Etage</label>' +
        '<select id="drawFloorName">' +
          '<option value="">Bitte wählen</option>' +
          '<option value="Kellergeschoss">Kellergeschoss</option>' +
          '<option value="Erdgeschoss">Erdgeschoss</option>' +
          '<option value="Obergeschoss 1">Obergeschoss 1</option>' +
          '<option value="Obergeschoss 2">Obergeschoss 2</option>' +
          '<option value="Obergeschoss 3">Obergeschoss 3</option>' +
          '<option value="Obergeschoss 4">Obergeschoss 4</option>' +
          '<option value="Dachgeschoss">Dachgeschoss</option>' +
        '</select>' +
      '</div>' +

      '<div class="draw-modal-actions">' +
        '<button type="button" id="cancelDrawFloor">Abbrechen</button>' +
        '<button type="button" id="saveDrawFloor">Etage übernehmen</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(backdrop);

  document
    .getElementById('cancelDrawFloor')
    .addEventListener('click', () => {
      backdrop.remove();
    });

  document
    .getElementById('saveDrawFloor')
    .addEventListener('click', () => {
      const floorName =
        document.getElementById('drawFloorName').value;

      if (!floorName) {
        alert('Bitte eine Etage auswählen.');
        return;
      }

      const newFloor =
        window.opener &&
        typeof window.opener.addFloorFromFloorplan === 'function'
          ? window.opener.addFloorFromFloorplan(floorName)
          : null;

      if (!newFloor) {
        alert(
          'Die Etage konnte nicht im Haupt-Konfigurator angelegt werden.'
        );
        return;
      }

      floorData.push(newFloor);
      activeFloorIndex = floorData.length - 1;
      selectedRoomIndex = null;

      backdrop.remove();

      setMode('move');
      renderFloor();
    });
}

function startDrag(e) {
  if (mode !== 'move') {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  const roomEl = e.currentTarget;
  const roomIndex = Number(roomEl.dataset.roomIndex);
  const room = floorData[activeFloorIndex].rooms[roomIndex];

  drag = {
    room,
    roomEl,
    startX: e.clientX,
    startY: e.clientY,
    origX: room.floorplan.x,
    origY: room.floorplan.y
  };

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(e) {
  if (!drag) return;

  const dx = e.clientX - drag.startX;
  const dy = e.clientY - drag.startY;

  const grid = 10;
  const newX = Math.max(0, Math.round((drag.origX + dx) / grid) * grid);
  const newY = Math.max(0, Math.round((drag.origY + dy) / grid) * grid);

  drag.room.floorplan.x = newX;
  drag.room.floorplan.y = newY;

  drag.roomEl.style.left = newX + 'px';
  drag.roomEl.style.top = newY + 'px';
}

function stopDrag() {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
  drag = null;
}

function startResize(e) {
 if (mode !== 'move') {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  
  const roomEl = e.currentTarget.closest('.room');
  const roomIndex = Number(roomEl.dataset.roomIndex);
  const room = floorData[activeFloorIndex].rooms[roomIndex];

  resize = {
    room,
    roomEl,
    handle: e.currentTarget.dataset.resize,
    startX: e.clientX,
    startY: e.clientY,
    origX: room.floorplan.x,
    origY: room.floorplan.y,
    origWidth: room.floorplan.width,
    origHeight: room.floorplan.height,
    areaPx: room.floorplan.width * room.floorplan.height
  };

  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopResize);
}

function onResize(e) {
  if (!resize) return;

  const dx = e.clientX - resize.startX;

  const minWidthM = 1.2;
  const maxWidthM = 18;

  let newWidthPx = resize.origWidth;
  let newX = resize.origX;
  let newY = resize.origY;

  if (resize.handle.includes('e')) {
    newWidthPx = resize.origWidth + dx;
  }

  if (resize.handle.includes('w')) {
    newWidthPx = resize.origWidth - dx;
    newX = resize.origX + dx;
  }

  let newWidthM = pixelsToMeters(newWidthPx);
  newWidthM = Math.max(minWidthM, Math.min(maxWidthM, newWidthM));

  const areaM2 = Math.max(Number(resize.room.area) || 1, 1);
  const newHeightM = areaM2 / newWidthM;

  newWidthPx = metersToPixels(newWidthM);
const newHeightPx = metersToPixels(newHeightM);

  if (resize.handle.includes('n')) {
    newY = resize.origY + (resize.origHeight - newHeightPx);
  }

  resize.room.floorplan.x = Math.round(newX / 10) * 10;
  resize.room.floorplan.y = Math.round(newY / 10) * 10;
  resize.room.floorplan.width = Math.round(newWidthPx);
  resize.room.floorplan.height = Math.round(newHeightPx);

  resize.roomEl.style.left = resize.room.floorplan.x + 'px';
  resize.roomEl.style.top = resize.room.floorplan.y + 'px';
  resize.roomEl.style.width = resize.room.floorplan.width + 'px';
  resize.roomEl.style.height = resize.room.floorplan.height + 'px';

  updateRoomDimensionText(resize.roomEl, resize.room);
  renderSidebar();
  selectRoom(Number(resize.roomEl.dataset.roomIndex));
}

function stopResize() {
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
  resize = null;
}

function getWorkspacePoint(e) {
  const workspace =
    document.getElementById('workspace');

  const rect =
    workspace.getBoundingClientRect();

  const rawX =
    e.clientX -
    rect.left +
    workspace.scrollLeft;

  const rawY =
    e.clientY -
    rect.top +
    workspace.scrollTop;

  return {
    x: snapValue(rawX),
    y: snapValue(rawY)
  };
}

function getOrthogonalPoint(startPoint, mousePoint) {
  const dx =
    Math.abs(mousePoint.x - startPoint.x);

  const dy =
    Math.abs(mousePoint.y - startPoint.y);

  if (dx >= dy) {
    return {
      x: mousePoint.x,
      y: startPoint.y
    };
  }

  return {
    x: startPoint.x,
    y: mousePoint.y
  };
}

function getOrthogonalClosingPoints(points) {
  if (!Array.isArray(points) || points.length < 2) {
    return [];
  }

  const firstPoint =
    points[0];

  const lastPoint =
    points[points.length - 1];

  /*
   * Start- und Endpunkt liegen bereits auf derselben
   * horizontalen oder vertikalen Achse.
   */
  if (
    firstPoint.x === lastPoint.x ||
    firstPoint.y === lastPoint.y
  ) {
    return [
      {
        x: firstPoint.x,
        y: firstPoint.y
      }
    ];
  }

  const previousPoint =
    points.length >= 2
      ? points[points.length - 2]
      : null;

  /*
   * War die letzte gezeichnete Wand waagerecht,
   * wird zunächst senkrecht weitergeführt.
   */
  const previousWasHorizontal =
    previousPoint &&
    previousPoint.y === lastPoint.y;

  const cornerPoint =
    previousWasHorizontal
      ? {
          x: lastPoint.x,
          y: firstPoint.y
        }
      : {
          x: firstPoint.x,
          y: lastPoint.y
        };

  return [
    cornerPoint,
    {
      x: firstPoint.x,
      y: firstPoint.y
    }
  ];
}

function getClosingInfo(points, mousePoint) {
  if (
    !Array.isArray(points) ||
    points.length < 3 ||
    !mousePoint
  ) {
    return null;
  }

  const firstPoint =
    points[0];

  const secondPoint =
    points[1];

  const lastPoint =
    points[points.length - 1];

    const startDistance =
  Math.hypot(
    mousePoint.x - firstPoint.x,
    mousePoint.y - firstPoint.y
  );

if (
  startDistance <=
  CLOSE_SNAP_DISTANCE
) {
  return {
    type: 'start-point',

    targetPoint: {
      x: firstPoint.x,
      y: firstPoint.y
    },

    previewPoints:
      getOrthogonalClosingPoints(
        points
      )
  };
}

  /*
   * Zuerst prüfen wir, ob die letzte Wand
   * rechtwinklig auf die erste Wand treffen kann.
   *
   * Wichtig:
   * Es wird nur der seitliche Abstand der Maus
   * zur ersten Wand geprüft. Die richtige Höhe
   * beziehungsweise Breite ergibt sich automatisch
   * aus dem letzten gesetzten Punkt.
   */

  /*
   * Erste Wand ist senkrecht.
   */
  if (
  points.length >= 4 &&
  firstPoint.x === secondPoint.x
) {
    const minY =
      Math.min(
        firstPoint.y,
        secondPoint.y
      );

    const maxY =
      Math.max(
        firstPoint.y,
        secondPoint.y
      );

    const intersectionPoint = {
      x: firstPoint.x,
      y: lastPoint.y
    };

    const intersectionIsOnWall =
      intersectionPoint.y >= minY &&
      intersectionPoint.y <= maxY;

    const distanceToFirstWall =
      Math.abs(
        mousePoint.x -
        firstPoint.x
      );

    if (
      intersectionIsOnWall &&
      distanceToFirstWall <=
        CLOSE_SNAP_DISTANCE
    ) {
      return {
        type: 'first-wall',

        targetPoint: {
          x: intersectionPoint.x,
          y: intersectionPoint.y
        },

        previewPoints: [
          {
            x: intersectionPoint.x,
            y: intersectionPoint.y
          }
        ]
      };
    }
  }

  /*
   * Erste Wand ist waagerecht.
   */
  if (
  points.length >= 4 &&
  firstPoint.y === secondPoint.y
) {
    const minX =
      Math.min(
        firstPoint.x,
        secondPoint.x
      );

    const maxX =
      Math.max(
        firstPoint.x,
        secondPoint.x
      );

    const intersectionPoint = {
      x: lastPoint.x,
      y: firstPoint.y
    };

    const intersectionIsOnWall =
      intersectionPoint.x >= minX &&
      intersectionPoint.x <= maxX;

    const distanceToFirstWall =
      Math.abs(
        mousePoint.y -
        firstPoint.y
      );

    if (
      intersectionIsOnWall &&
      distanceToFirstWall <=
        CLOSE_SNAP_DISTANCE
    ) {
      return {
        type: 'first-wall',

        targetPoint: {
          x: intersectionPoint.x,
          y: intersectionPoint.y
        },

        previewPoints: [
          {
            x: intersectionPoint.x,
            y: intersectionPoint.y
          }
        ]
      };
    }
  }

  return null;
}

function getWallDrawingLayer() {
  const workspace =
    document.getElementById('workspace');

  let svg =
    document.getElementById('wallDrawingLayer');

  if (svg) return svg;

  svg = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  );

  svg.id = 'wallDrawingLayer';
  svg.classList.add('wall-drawing-layer');

  svg.setAttribute(
    'width',
    workspace.scrollWidth
  );

  svg.setAttribute(
    'height',
    workspace.scrollHeight
  );

  svg.setAttribute(
    'viewBox',
    '0 0 ' +
      workspace.scrollWidth +
      ' ' +
      workspace.scrollHeight
  );

  workspace.appendChild(svg);

  return svg;
}

function renderLineDrawing(mousePoint = null) {
  const svg =
    getWallDrawingLayer();

  svg.innerHTML = '';

  const points =
    lineDrawing.points;

  /*
   * Bereits fest gesetzte Wände zeichnen.
   */
  for (
    let index = 0;
    index < points.length - 1;
    index++
  ) {
    const pointA =
      points[index];

    const pointB =
      points[index + 1];

    const line =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line'
      );

    line.setAttribute(
      'x1',
      pointA.x
    );

    line.setAttribute(
      'y1',
      pointA.y
    );

    line.setAttribute(
      'x2',
      pointB.x
    );

    line.setAttribute(
      'y2',
      pointB.y
    );

    line.setAttribute(
      'class',
      'wall-drawing-line'
    );

    svg.appendChild(line);
  }

  /*
   * Bereits gesetzte Eckpunkte zeichnen.
   */
  points.forEach((point, index) => {
    const circle =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle'
      );

    circle.setAttribute(
      'cx',
      point.x
    );

    circle.setAttribute(
      'cy',
      point.y
    );

    circle.setAttribute(
      'r',
      index === 0 ? 8 : 6
    );

    circle.setAttribute(
      'class',
      index === 0
        ? 'wall-start-point'
        : 'wall-drawing-point'
    );

    svg.appendChild(circle);
  });

  /*
   * Noch keine Vorschau nötig, solange kein Punkt
   * gesetzt wurde oder keine Mausposition vorhanden ist.
   */
  if (
    points.length === 0 ||
    !mousePoint
  ) {
    return;
  }

  const lastPoint =
    points[points.length - 1];
  
  const closingInfo =
  getClosingInfo(
    points,
    mousePoint
  );

const shouldPreviewClosing =
  Boolean(closingInfo);

const previewPoints =
  closingInfo
    ? closingInfo.previewPoints
    : [
        getOrthogonalPoint(
          lastPoint,
          mousePoint
        )
      ];

  let previewStart =
    lastPoint;

  /*
   * Alle Vorschauwände zeichnen.
   * Beim automatischen Abschluss sind dies
   * gegebenenfalls zwei Wände.
   */
  previewPoints.forEach(
    (previewEnd) => {
      const previewLine =
        document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        );

      previewLine.setAttribute(
        'x1',
        previewStart.x
      );

      previewLine.setAttribute(
        'y1',
        previewStart.y
      );

      previewLine.setAttribute(
        'x2',
        previewEnd.x
      );

      previewLine.setAttribute(
        'y2',
        previewEnd.y
      );

      previewLine.setAttribute(
        'class',
        'wall-preview-line'
      );

      svg.appendChild(
        previewLine
      );

      previewStart =
        previewEnd;
    }
  );

  const finalPreviewPoint =
    previewPoints[
      previewPoints.length - 1
    ];

  if (!finalPreviewPoint) {
    return;
  }

  const previewPoint =
    document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );

  previewPoint.setAttribute(
    'cx',
    finalPreviewPoint.x
  );

  previewPoint.setAttribute(
    'cy',
    finalPreviewPoint.y
  );

  previewPoint.setAttribute(
    'r',
    shouldPreviewClosing
      ? 8
      : 5
  );

  previewPoint.setAttribute(
    'class',
    shouldPreviewClosing
      ? 'wall-start-point'
      : 'wall-preview-point'
  );

  svg.appendChild(
    previewPoint
  );
}

function handleLineDrawingClick(e) {
  if (mode !== 'draw-lines') return false;

  const workspace =
    document.getElementById('workspace');

  if (!workspace.contains(e.target)) {
  return false;
  }

  e.preventDefault();
  e.stopPropagation();

  const mousePoint =
    getWorkspacePoint(e);

  if (lineDrawing.points.length === 0) {
    lineDrawing.points.push(mousePoint);

  removeModeCursorLabel();

    renderLineDrawing();

    return true;
  }

  const lastPoint =
    lineDrawing.points[
      lineDrawing.points.length - 1
    ];

  /*
 * Zuerst prüfen, ob der Raum geschlossen
 * werden soll.
 */
const closingInfo =
  getClosingInfo(
    lineDrawing.points,
    mousePoint
  );

if (closingInfo) {
  /*
   * Sonderfall:
   * Abschluss auf der ersten Wand.
   */
  if (
    closingInfo.type ===
    'first-wall'
  ) {
    lineDrawing.points[0] = {
      x: closingInfo.targetPoint.x,
      y: closingInfo.targetPoint.y
    };

    const lastStoredPoint =
      lineDrawing.points[
        lineDrawing.points.length - 1
      ];

    if (
      lastStoredPoint.x !==
        closingInfo.targetPoint.x ||
      lastStoredPoint.y !==
        closingInfo.targetPoint.y
    ) {
      lineDrawing.points.push({
        x: closingInfo.targetPoint.x,
        y: closingInfo.targetPoint.y
      });
    }
  } else {
    /*
     * Normaler Abschluss am ursprünglichen
     * Startpunkt.
     */
    closingInfo.previewPoints.forEach(
      (point) => {
        const lastStoredPoint =
          lineDrawing.points[
            lineDrawing.points.length - 1
          ];

        if (
          lastStoredPoint.x !== point.x ||
          lastStoredPoint.y !== point.y
        ) {
          lineDrawing.points.push({
            x: point.x,
            y: point.y
          });
        }
      }
    );
  }

  closeLineDrawing();
  return true;
}

/*
 * Erst wenn kein Abschluss erkannt wurde,
 * wird der nächste normale Eckpunkt berechnet.
 */
const nextPoint =
  getOrthogonalPoint(
    lastPoint,
    mousePoint
  );

if (
  nextPoint.x === lastPoint.x &&
  nextPoint.y === lastPoint.y
) {
  return true;
}

  lineDrawing.points.push(nextPoint);
  renderLineDrawing();

  return true;
}

function handleLineDrawingMove(e) {
  if (mode !== 'draw-lines') return;

  if (lineDrawing.points.length === 0) {
    return;
  }

  const mousePoint =
    getWorkspacePoint(e);

  renderLineDrawing(mousePoint);
}

function cancelLineDrawing() {
  lineDrawing.points = [];
  lineDrawing.previewLine = null;
  lineDrawing.previewPoint = null;

  document
    .getElementById('wallDrawingLayer')
    ?.remove();

  removeModeCursorLabel();
}

function removeLastLinePoint() {
  if (lineDrawing.points.length === 0) {
    return;
  }

  lineDrawing.points.pop();

  if (lineDrawing.points.length === 0) {
    cancelLineDrawing();
    return;
  }

  renderLineDrawing();
}

function calculatePolygonArea(points) {
  if (
    !Array.isArray(points) ||
    points.length < 3
  ) {
    return 0;
  }

  let areaPixels = 0;

  for (
    let index = 0;
    index < points.length;
    index++
  ) {
    const current =
      points[index];

    const next =
      points[
        (index + 1) % points.length
      ];

    areaPixels +=
      current.x * next.y -
      next.x * current.y;
  }

  areaPixels =
    Math.abs(areaPixels) / 2;

  const pixelsPerMeter =
    getPixelsPerMeter();

  if (
    !Number.isFinite(pixelsPerMeter) ||
    pixelsPerMeter <= 0
  ) {
    return 0;
  }

  return (
    areaPixels /
    (
      pixelsPerMeter *
      pixelsPerMeter
    )
  );
}

function rangesOverlap(
  startA,
  endA,
  startB,
  endB
) {
  const minA = Math.min(startA, endA);
  const maxA = Math.max(startA, endA);
  const minB = Math.min(startB, endB);
  const maxB = Math.max(startB, endB);

  return (
    Math.max(minA, minB) <=
    Math.min(maxA, maxB)
  );
}

function segmentsIntersect(
  a1,
  a2,
  b1,
  b2
) {
  const aHorizontal =
    a1.y === a2.y;

  const bHorizontal =
    b1.y === b2.y;

  /*
   * Eine horizontale und eine vertikale Linie.
   */
  if (aHorizontal !== bHorizontal) {
    const horizontalStart =
      aHorizontal ? a1 : b1;

    const horizontalEnd =
      aHorizontal ? a2 : b2;

    const verticalStart =
      aHorizontal ? b1 : a1;

    const verticalEnd =
      aHorizontal ? b2 : a2;

    return (
      verticalStart.x >=
        Math.min(
          horizontalStart.x,
          horizontalEnd.x
        ) &&

      verticalStart.x <=
        Math.max(
          horizontalStart.x,
          horizontalEnd.x
        ) &&

      horizontalStart.y >=
        Math.min(
          verticalStart.y,
          verticalEnd.y
        ) &&

      horizontalStart.y <=
        Math.max(
          verticalStart.y,
          verticalEnd.y
        )
    );
  }

  /*
   * Zwei horizontale Linien.
   */
  if (aHorizontal && bHorizontal) {
    if (a1.y !== b1.y) return false;

    return rangesOverlap(
      a1.x,
      a2.x,
      b1.x,
      b2.x
    );
  }

  /*
   * Zwei vertikale Linien.
   */
  if (a1.x !== b1.x) return false;

  return rangesOverlap(
    a1.y,
    a2.y,
    b1.y,
    b2.y
  );
}

function polygonHasSelfIntersections(points) {
  if (
    !Array.isArray(points) ||
    points.length < 4
  ) {
    return false;
  }

  const segments = [];

  for (
    let index = 0;
    index < points.length;
    index++
  ) {
    segments.push({
      start: points[index],
      end:
        points[
          (index + 1) %
          points.length
        ]
    });
  }

  for (
    let firstIndex = 0;
    firstIndex < segments.length;
    firstIndex++
  ) {
    for (
      let secondIndex =
        firstIndex + 1;
      secondIndex < segments.length;
      secondIndex++
    ) {
      const segmentsAreNeighbours =
        secondIndex === firstIndex + 1 ||
        (
          firstIndex === 0 &&
          secondIndex ===
            segments.length - 1
        );

      if (segmentsAreNeighbours) {
        continue;
      }

      const segmentA =
        segments[firstIndex];

      const segmentB =
        segments[secondIndex];

      if (
        segmentsIntersect(
          segmentA.start,
          segmentA.end,
          segmentB.start,
          segmentB.end
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

function createPolygonShape(points) {
  const xValues =
    points.map((point) => point.x);

  const yValues =
    points.map((point) => point.y);

  const minX = Math.min(...xValues);
  const minY = Math.min(...yValues);
  const maxX = Math.max(...xValues);
  const maxY = Math.max(...yValues);

  const relativePoints =
    points.map((point) => ({
      x: point.x - minX,
      y: point.y - minY
    }));

  return {
    shapeType: 'polygon',
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    points: relativePoints,
    area: calculatePolygonArea(points)
  };
}

function simplifyOrthogonalPoints(points) {
  if (
    !Array.isArray(points) ||
    points.length < 3
  ) {
    return points || [];
  }

  const cleaned = [];

  points.forEach((point) => {
    const previous =
      cleaned[cleaned.length - 1];

    if (
      previous &&
      previous.x === point.x &&
      previous.y === point.y
    ) {
      return;
    }

    cleaned.push({
      x: point.x,
      y: point.y
    });
  });

  let changed = true;

  while (
    changed &&
    cleaned.length >= 3
  ) {
    changed = false;

    for (
      let index = 0;
      index < cleaned.length;
      index++
    ) {
      const previous =
        cleaned[
          (
            index -
            1 +
            cleaned.length
          ) %
          cleaned.length
        ];

      const current =
        cleaned[index];

      const next =
        cleaned[
          (index + 1) %
          cleaned.length
        ];

      const sameHorizontal =
        previous.y === current.y &&
        current.y === next.y;

      const sameVertical =
        previous.x === current.x &&
        current.x === next.x;

      if (
        sameHorizontal ||
        sameVertical
      ) {
        cleaned.splice(index, 1);
        changed = true;
        break;
      }
    }
  }

  return cleaned;
}

function closeLineDrawing() {
  /*
   * Zunächst mit einer Kopie der tatsächlich
   * gezeichneten Punkte arbeiten.
   */
  const rawPoints =
    lineDrawing.points.map((point) => ({
      x: point.x,
      y: point.y
    }));

  if (rawPoints.length < 4) {
    alert(
      'Für einen geschlossenen Raum werden mindestens drei Eckpunkte benötigt.'
    );
    return;
  }

  const rawFirstPoint =
    rawPoints[0];

  const rawLastPoint =
    rawPoints[
      rawPoints.length - 1
    ];

  /*
   * Vor der Vereinfachung prüfen, ob die Kontur
   * wirklich geschlossen wurde.
   */
  if (
    rawFirstPoint.x !== rawLastPoint.x ||
    rawFirstPoint.y !== rawLastPoint.y
  ) {
    alert(
      'Die Raumkontur konnte nicht vollständig geschlossen werden.'
    );
    return;
  }

  /*
   * Den doppelten letzten Startpunkt entfernen.
   * SVG-Polygone und die Flächenberechnung schließen
   * die Kontur später automatisch.
   */
  rawPoints.pop();

  const points =
    simplifyOrthogonalPoints(
      rawPoints
    );

  if (points.length < 3) {
    alert(
      'Die gezeichnete Raumkontur enthält zu wenige gültige Eckpunkte.'
    );
    return;
  }

  if (
    polygonHasSelfIntersections(
      points
    )
  ) {
    alert(
      'Die gezeichnete Raumkontur überschneidet sich selbst. Bitte entfernen Sie den letzten Punkt oder zeichnen Sie die betroffene Wand neu.'
    );
    return;
  }

  const shape =
    createPolygonShape(
      points
    );

  if (
    shape.width < 30 ||
    shape.height < 30 ||
    shape.area <= 0
  ) {
    alert(
      'Der gezeichnete Raum ist zu klein oder ungültig.'
    );
    return;
  }

  cancelLineDrawing();
  openDrawRoomDialog(shape);
}

function startDraw(e) {
  if (mode !== 'draw-rect') return;
  
  const workspace =
    document.getElementById('workspace');

  if (!workspace.contains(e.target)) {
  return;
  }

  e.preventDefault();
  e.stopPropagation();

  const rect = workspace.getBoundingClientRect();

const rawStartX =
  e.clientX -
  rect.left +
  workspace.scrollLeft;

const rawStartY =
  e.clientY -
  rect.top +
  workspace.scrollTop;

const startX =
  snapValue(rawStartX);

const startY =
  snapValue(rawStartY);

  const preview = document.createElement('div');
  preview.className = 'draw-preview';
  preview.style.left = startX + 'px';
  preview.style.top = startY + 'px';
  preview.style.width = '0px';
  preview.style.height = '0px';

  preview.innerHTML =
  '<div class="dimension-cross draw-dimension-cross">' +
    '<div class="dim-line dim-horizontal"></div>' +
    '<div class="dim-line dim-vertical"></div>' +
    '<div class="dim-text dim-width">0,00 m</div>' +
    '<div class="dim-text dim-height">0,00 m</div>' +
  '</div>' +
  '<div class="draw-area-live">0,00 m²</div>';

  workspace.appendChild(preview);

  draw = {
    startX,
    startY,
    preview
  };

  document.addEventListener('mousemove', onDraw);
  document.addEventListener('mouseup', stopDraw);
}

function onDraw(e) {
  if (!draw) return;

  const workspace = document.getElementById('workspace');
  const rect = workspace.getBoundingClientRect();

  const currentX = e.clientX - rect.left + workspace.scrollLeft;
  const currentY = e.clientY - rect.top + workspace.scrollTop;

  const rawX = Math.min(draw.startX, currentX);
  const rawY = Math.min(draw.startY, currentY);
  const rawWidth = Math.abs(currentX - draw.startX);
  const rawHeight = Math.abs(currentY - draw.startY);

  const x =
  snapValue(rawX);

const y =
  snapValue(rawY);

const width =
  snapValue(rawWidth);

const height =
  snapValue(rawHeight);

  draw.preview.style.left = x + 'px';
  draw.preview.style.top = y + 'px';
  draw.preview.style.width = width + 'px';
  draw.preview.style.height = height + 'px';

  const widthM = pixelsToMeters(width);
const heightM = pixelsToMeters(height);
  const areaM2 = widthM * heightM;

  const widthText = draw.preview.querySelector('.dim-width');
  const heightText = draw.preview.querySelector('.dim-height');
  const areaText = draw.preview.querySelector('.draw-area-live');

  if (widthText) widthText.textContent = widthM.toFixed(2).replace('.', ',') + ' m';
  if (heightText) heightText.textContent = heightM.toFixed(2).replace('.', ',') + ' m';
  if (areaText) areaText.textContent = areaM2.toFixed(2).replace('.', ',') + ' m²';
}

function stopDraw() {
  if (!draw) return;

  document.removeEventListener('mousemove', onDraw);
  document.removeEventListener('mouseup', stopDraw);

  const x = Number(parseFloat(draw.preview.style.left)) || 0;
  const y = Number(parseFloat(draw.preview.style.top)) || 0;
  const width = Number(parseFloat(draw.preview.style.width)) || 0;
  const height = Number(parseFloat(draw.preview.style.height)) || 0;

  draw.preview.remove();
  draw = null;

  if (width < 60 || height < 60) return;

  openDrawRoomDialog({
  shapeType: 'rectangle',
  x,
  y,
  width,
  height,
  area: calculateDrawnArea(width, height)
});
}

function calculateDrawnArea(widthPx, heightPx) {
  const widthM = pixelsToMeters(widthPx);
  const heightM = pixelsToMeters(heightPx);

  return widthM * heightM;
}

function getPipeMeterFactor(spacing) {
  if (spacing === 'VA 100') return 8.8;
  if (spacing === 'VA 200') return 4.6;
  return 5.8;
}

function calculateDrawnTechnicalValues(room) {
  const heated = room.function === 'Wohnraum' || room.function === 'Bad';

  if (!heated) {
    room.circuits = 0;
    room.pipeLength = 0;
    return;
  }

  const area = Number(room.area) || 0;
  const pipeLength = area * getPipeMeterFactor(room.spacing);
  const maxCircuitLength = 120;

  room.pipeLength = pipeLength;
  room.circuits = Math.max(1, Math.ceil(pipeLength / maxCircuitLength));
}

function openDrawRoomDialog(shape) {
  const area =
  Number(shape.area) > 0
    ? Number(shape.area)
    : calculateDrawnArea(
        shape.width,
        shape.height
      );
  const areaText = area.toFixed(2).replace('.', ',');

  const backdrop = document.createElement('div');
  backdrop.className = 'draw-modal-backdrop';

  backdrop.innerHTML =
    '<div class="draw-modal">' +
      '<h3>Raum aus Grundriss übernehmen</h3>' +
      '<div class="draw-area-hint">Berechnete Fläche: ' + areaText + ' m²</div>' +

'<div id="drawUnheatedWarning" class="draw-warning hidden">' +
  '<strong>Achtung:</strong> Räume ab 6 m² müssen beheizt ausgeführt werden.' +
'</div>' +

'<div class="draw-grid">' +
      
      '<div class="draw-field">' +
  '<label>Raumbezeichnung</label>' +
  '<select id="drawRoomName">' +
    '<option value="">Bitte wählen</option>' +
    '<option value="Wohnzimmer">Wohnzimmer</option>' +
    '<option value="Küche">Küche</option>' +
    '<option value="Bad">Bad</option>' +
    '<option value="G-WC">G-WC</option>' +
    '<option value="Flur">Flur</option>' +
    '<option value="HWR">HWR</option>' +
    '<option value="Schlafzimmer">Schlafzimmer</option>' +
    '<option value="Kinderzimmer">Kinderzimmer</option>' +
    '<option value="Büro">Büro</option>' +
    '<option value="Abstellraum">Abstellraum</option>' +
  '</select>' +
'</div>' +

        '<div class="draw-field">' +
          '<label>Funktion</label>' +
          '<select id="drawRoomFunction">' +
            '<option value="Wohnraum">Wohnraum</option>' +
            '<option value="Bad">Bad</option>' +
            '<option value="unbeheizter Raum">unbeheizt</option>' +
          '</select>' +
        '</div>' +

        '<div class="draw-field">' +
  '<label>Rauminnentemperatur °C</label>' +
  '<input id="drawRoomTemperature" type="number" min="5" max="35" step="0.5" value="20">' +
'</div>' +

        '<div class="draw-field">' +
          '<label>Verlegeabstand</label>' +
          '<select id="drawRoomSpacing">' +
            '<option value="VA 100">VA 100</option>' +
            '<option value="VA 150" selected>VA 150</option>' +
            '<option value="VA 200">VA 200</option>' +
          '</select>' +
        '</div>' +

        '<div class="draw-field">' +
          '<label>Estrich gewünscht?</label>' +
          '<select id="drawRoomEstrich">' +
            '<option value="ja" selected>Ja</option>' +
            '<option value="nein">Nein</option>' +
          '</select>' +
        '</div>' +

        '<div class="draw-field">' +
          '<label>Bodenbelag</label>' +
          '<select id="drawRoomFloorCovering">' +
            '<option value="Fliesen">Fliesen</option>' +
            '<option value="Parkett / Laminat">Parkett / Laminat</option>' +
            '<option value="Vinyl">Vinyl</option>' +
            '<option value="Teppich">Teppich</option>' +
            '<option value="Sonstiges">Sonstiges</option>' +
          '</select>' +
        '</div>' +
      '</div>' +

      '<div class="draw-modal-actions">' +
        '<button type="button" id="cancelDrawRoom">Abbrechen</button>' +
        '<button type="button" id="saveDrawRoom">Raum übernehmen</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(backdrop);

  const drawRoomFunction =
  document.getElementById('drawRoomFunction');

const drawRoomTemperature =
  document.getElementById('drawRoomTemperature');

const drawRoomSpacing =
  document.getElementById('drawRoomSpacing');

const drawUnheatedWarning =
  document.getElementById('drawUnheatedWarning');

function updateDrawUnheatedWarning() {
  const showWarning =
    drawRoomFunction.value === 'unbeheizter Raum' &&
    area >= 6;

  drawUnheatedWarning.classList.toggle(
    'hidden',
    !showWarning
  );
}

drawRoomFunction.addEventListener('change', () => {
  if (drawRoomFunction.value === 'Bad') {
    drawRoomTemperature.value = 24;
    drawRoomSpacing.value = 'VA 100';
  } else if (drawRoomFunction.value === 'Wohnraum') {
    drawRoomTemperature.value = 20;
  }

  updateDrawUnheatedWarning();
});

updateDrawUnheatedWarning();

  document.getElementById('cancelDrawRoom').addEventListener('click', () => {
    backdrop.remove();
  });

  document.getElementById('saveDrawRoom').addEventListener('click', () => {
    const name = document.getElementById('drawRoomName').value.trim();

    if (!name) {
      alert('Bitte eine Raumbezeichnung auswählen.');
      return;
    }

    const selectedFunction =
  document.getElementById('drawRoomFunction').value;

if (
  selectedFunction === 'unbeheizter Raum' &&
  area >= 6
) {
  const confirmed = confirm(
  'Achtung: Räume ab 6 m² müssen beheizt ausgeführt werden.\\n\\n' +
  'Möchten Sie den Raum trotzdem als unbeheizten Raum übernehmen?'
);

  if (!confirmed) return;
}

    const room = {
  name,
  function: selectedFunction,
  temperature:
    Number(
      document.getElementById('drawRoomTemperature').value
    ) || (selectedFunction === 'Bad' ? 24 : 20),

  spacing: document.getElementById('drawRoomSpacing').value,
  area: area.toFixed(2),
  estrich: document.getElementById('drawRoomEstrich').value,
  floorCovering: document.getElementById('drawRoomFloorCovering').value,
  floorplan: {
     shapeType: shape.shapeType || 'rectangle',

        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,

points: Array.isArray(shape.points)
    ? shape.points
    : null,

        doorEnabled: false,
        doorSide: 'bottom',
        doorPosition: 50,
        doorWidth: 90
      }
    };

    calculateDrawnTechnicalValues(room);

    const savedInMainWindow =
      window.opener &&
      typeof window.opener.addRoomFromFloorplan === 'function'
        ? window.opener.addRoomFromFloorplan(activeFloorIndex, room)
        : false;

    if (!savedInMainWindow) {
      alert('Der Raum konnte nicht in den Haupt-Konfigurator übernommen werden.');
      backdrop.remove();
      return;
    }

    floorData[activeFloorIndex].rooms.push(room);

    backdrop.remove();
    setMode('move');
    renderFloor();
    selectRoom(floorData[activeFloorIndex].rooms.length - 1);
  });
}

function autoArrange() {
  const floor = floorData[activeFloorIndex];

  floor.rooms.forEach((room, index) => {
    room.floorplan.x = 40 + (index % 4) * 230;
    room.floorplan.y = 40 + Math.floor(index / 4) * 190;
  });

  renderFloor();
}

setMode('move');
renderFloor();

document
  .getElementById('uploadTemplateBtn')
  .addEventListener('click', openTemplateFileDialog);

document
  .getElementById('templateFileInput')
  .addEventListener('change', handleTemplateUpload);

document.getElementById('workspace').addEventListener('mousedown', startDraw);

document.addEventListener('keydown', (e) => {

  if (
  mode === 'draw-lines' &&
  e.key === 'Escape'
) {
  e.preventDefault();
  cancelLineDrawing();
  return;
}

if (
  mode === 'draw-lines' &&
  (
    e.key === 'Backspace' ||
    e.key === 'Delete' ||
    e.key === 'Entf'
  )
) {
  e.preventDefault();
  removeLastLinePoint();
  return;
}

  if (e.key !== 'Delete' && e.key !== 'Entf' && e.key !== 'Backspace') return;

  e.preventDefault();

  const activeTag = document.activeElement?.tagName?.toLowerCase();
  if (activeTag === 'input' || activeTag === 'select' || activeTag === 'textarea') return;

  deleteSelectedRoom();
});

function getActiveFloor() {
  return floorData[activeFloorIndex];
}

function getActiveTemplate() {
  const floor = getActiveFloor();

  if (!floor.template) {
    floor.template = {
      src: '',
      fileName: '',
      x: 40,
      y: 40,
      scale: 1,
      opacity: 0.55,
      locked: false,
      pixelsPerMeter: null
    };
  }

  return floor.template;
}

function getPixelsPerMeter() {
  const template = getActiveTemplate();
  return Number(template.pixelsPerMeter) || DEFAULT_PIXELS_PER_METER;
}

function pixelsToMeters(pixels) {
  return pixels / getPixelsPerMeter();
}

function metersToPixels(meters) {
  return meters * getPixelsPerMeter();
}

function saveTemplateToMainWindow() {
  const template = getActiveTemplate();

  const saved =
    window.opener &&
    typeof window.opener.updateFloorplanTemplateFromWindow === 'function'
      ? window.opener.updateFloorplanTemplateFromWindow(
          activeFloorIndex,
          structuredClone(template)
        )
      : false;

  if (!saved) {
    console.warn(
      'Die Vorlagendaten konnten nicht im Haupt-Konfigurator gespeichert werden.'
    );
  }

  return saved;
}

function resetCalibration() {
  const template = getActiveTemplate();

  template.pixelsPerMeter = null;
  calibration.active = false;
  calibration.points = [];

  saveTemplateToMainWindow();
}

function formatNumber(value, decimals = 2) {
  return Number(value)
    .toFixed(decimals)
    .replace('.', ',');
}

function startTemplateDrag(e) {
  const template = getActiveTemplate();

  if (template.locked) return;
  if (mode !== 'move') return;

  e.preventDefault();
  e.stopPropagation();

  templateDrag = {
    layer: e.currentTarget,
    startX: e.clientX,
    startY: e.clientY,
    origX: Number(template.x) || 0,
    origY: Number(template.y) || 0
  };

  document.addEventListener(
    'mousemove',
    onTemplateDrag
  );

  document.addEventListener(
    'mouseup',
    stopTemplateDrag
  );
}

function onTemplateDrag(e) {
  if (!templateDrag) return;

  const template = getActiveTemplate();

  const dx = e.clientX - templateDrag.startX;
  const dy = e.clientY - templateDrag.startY;

  template.x = Math.round(templateDrag.origX + dx);
  template.y = Math.round(templateDrag.origY + dy);

  templateDrag.layer.style.left =
    template.x + 'px';

  templateDrag.layer.style.top =
    template.y + 'px';
}

function stopTemplateDrag() {
  if (!templateDrag) return;

  document.removeEventListener(
    'mousemove',
    onTemplateDrag
  );

  document.removeEventListener(
    'mouseup',
    stopTemplateDrag
  );

  templateDrag = null;

  saveTemplateToMainWindow();
  renderTemplateControls();
}

function renderTemplateControls() {
  const container =
    document.getElementById('templateControls');

  const template = getActiveTemplate();

  if (!template.src) {
    container.innerHTML =
      '<div class="template-controls">' +
        '<h3>Grundrissvorlage</h3>' +
        '<div class="template-status">' +
          'Laden Sie eine JPG-, JPEG- oder PNG-Datei hoch.' +
        '</div>' +
      '</div>';

    return;
  }

  const scalePercent =
    Math.round(template.scale * 100);

  const opacityPercent =
    Math.round(template.opacity * 100);

  const calibrated =
    Number(template.pixelsPerMeter) > 0;

  container.innerHTML =
    '<div class="template-controls">' +
      '<h3>Grundrissvorlage</h3>' +

      '<div class="template-status ' +
        (calibrated ? '' : 'warning') +
      '">' +
        '<strong>' +
          (template.fileName || 'Vorlage') +
        '</strong><br>' +
        (
          calibrated
            ? 'Maßstab kalibriert: ' +
              formatNumber(
                template.pixelsPerMeter,
                2
              ) +
              ' Pixel pro Meter'
            : 'Der Maßstab ist noch nicht kalibriert.'
        ) +
      '</div>' +

      '<div class="template-control-row">' +
        '<label for="templateScale">' +
          'Größe: ' + scalePercent + ' %' +
        '</label>' +
        '<input ' +
          'id="templateScale" ' +
          'type="range" ' +
          'min="20" ' +
          'max="300" ' +
          'step="1" ' +
          'value="' + scalePercent + '"' +
        '>' +
      '</div>' +

      '<div class="template-control-row">' +
        '<label for="templateOpacity">' +
          'Deckkraft: ' + opacityPercent + ' %' +
        '</label>' +
        '<input ' +
          'id="templateOpacity" ' +
          'type="range" ' +
          'min="10" ' +
          'max="100" ' +
          'step="1" ' +
          'value="' + opacityPercent + '"' +
        '>' +
      '</div>' +

      '<div class="template-button-row">' +
        '<button id="toggleTemplateLock" type="button">' +
          (
            template.locked
              ? 'Vorlage entsperren'
              : 'Vorlage sperren'
          ) +
        '</button>' +

        '<button id="calibrateTemplateBtn" type="button">' +
          'Maßstab kalibrieren' +
        '</button>' +
      '</div>' +

      '<div class="template-button-row">' +
  '<button id="resetTemplatePositionBtn" type="button">' +
    'Position zurücksetzen' +
  '</button>' +

  '<button id="removeTemplateBtn" type="button">' +
    'Vorlage entfernen' +
  '</button>' +
'</div>' +

'<div class="wall-detection-controls">' +
  '<h4>Halbautomatische Erkennung</h4>' +

  '<div ' +
    'id="wallDetectionStatus" ' +
    'class="wall-detection-status' +
      (
        window.openCvReady
          ? ''
          : ' warning'
      ) +
    '"' +
  '>' +
    (
      window.openCvReady
        ? (
            Array.isArray(
              template.detectedWalls
            ) &&
            template.detectedWalls.length
              ? template.detectedWalls.length +
                ' mögliche Wandlinien vorhanden.'
              : 'Bilderkennung ist bereit.'
          )
        : 'Bilderkennung wird geladen …'
    ) +
  '</div>' +

  '<div class="wall-detection-button-row">' +
    '<button id="detectWallsBtn" type="button">' +
      'Wände erkennen' +
    '</button>' +

    '<button id="clearDetectedWallsBtn" type="button">' +
      'Vorschau löschen' +
    '</button>' +
  '</div>' +
'</div>' +

'</div>';

  document
    .getElementById('templateScale')
    .addEventListener('input', handleTemplateScale);

  document
    .getElementById('templateOpacity')
    .addEventListener('input', handleTemplateOpacity);

  document
    .getElementById('toggleTemplateLock')
    .addEventListener('click', toggleTemplateLock);

  document
    .getElementById('calibrateTemplateBtn')
    .addEventListener('click', startCalibration);

  document
    .getElementById('resetTemplatePositionBtn')
    .addEventListener(
      'click',
      resetTemplatePosition
    );

  document
    .getElementById('removeTemplateBtn')
    .addEventListener('click', removeTemplate);

    document
  .getElementById('detectWallsBtn')
  ?.addEventListener(
    'click',
    detectWallsFromTemplate
  );

document
  .getElementById(
    'clearDetectedWallsBtn'
  )
  ?.addEventListener(
    'click',
    clearDetectedWalls
  );
}

function handleTemplateScale(e) {
  const template = getActiveTemplate();

  const previousScale =
    Number(template.scale) || 1;

  const newScale =
    Number(e.target.value) / 100;

  template.scale = newScale;

  if (
    Number(template.pixelsPerMeter) > 0 &&
    previousScale > 0
  ) {
    template.pixelsPerMeter =
      template.pixelsPerMeter *
      (newScale / previousScale);
  }

  const layer =
    document.getElementById('templateLayer');

  if (layer) {
    layer.style.transform =
      'scale(' + template.scale + ')';
  }

  const label = document.querySelector(
    'label[for="templateScale"]'
  );

  if (label) {
    label.textContent =
      'Größe: ' +
      Math.round(template.scale * 100) +
      ' %';
  }

  saveTemplateToMainWindow();
}

function handleTemplateOpacity(e) {
  const template = getActiveTemplate();

  template.opacity =
    Number(e.target.value) / 100;

  const layer =
    document.getElementById('templateLayer');

  if (layer) {
    layer.style.opacity =
      String(template.opacity);
  }

  const label = document.querySelector(
  'label[for="templateOpacity"]'
);

if (label) {
  label.textContent =
    'Deckkraft: ' +
    Math.round(template.opacity * 100) +
    ' %';
}

saveTemplateToMainWindow();
}

function toggleTemplateLock() {
  const template = getActiveTemplate();

  template.locked = !template.locked;

  saveTemplateToMainWindow();
  renderFloor();
}

function resetTemplatePosition() {
  const template = getActiveTemplate();

  template.x = 40;
  template.y = 40;
  template.scale = 1;
  template.pixelsPerMeter = null;

  calibration.active = false;
  calibration.points = [];

  saveTemplateToMainWindow();
  renderFloor();
}

function removeTemplate() {
  const confirmed = confirm(
    'Möchten Sie die Grundrissvorlage dieser Etage wirklich entfernen? Die bereits gezeichneten Räume bleiben erhalten.'
  );

  if (!confirmed) return;

  const floor = getActiveFloor();

  floor.template = {
    src: '',
    fileName: '',
    x: 40,
    y: 40,
    scale: 1,
    opacity: 0.55,
    locked: false,
    pixelsPerMeter: null,
    detectedWalls: []
  };

  calibration.active = false;
  calibration.points = [];

  saveTemplateToMainWindow();
  renderFloor();
}

function handleCalibrationClick(e) {
  if (
    mode !== 'calibrate' ||
    !calibration.active
  ) {
    return false;
  }

  const workspace =
    document.getElementById('workspace');

  const rect =
    workspace.getBoundingClientRect();

  const point = {
    x:
      e.clientX -
      rect.left +
      workspace.scrollLeft,

    y:
      e.clientY -
      rect.top +
      workspace.scrollTop
  };

  calibration.points.push(point);

  renderCalibrationMarkers();

  if (calibration.points.length === 2) {
    finishCalibration();
  }

  return true;
}

function renderCalibrationMarkers() {
  const workspace =
    document.getElementById('workspace');

  workspace
    .querySelectorAll(
      '.calibration-point, .calibration-line'
    )
    .forEach((element) => element.remove());

  calibration.points.forEach((point) => {
    const marker =
      document.createElement('div');

    marker.className = 'calibration-point';
    marker.style.left = point.x + 'px';
    marker.style.top = point.y + 'px';

    workspace.appendChild(marker);
  });

  if (calibration.points.length !== 2) return;

  const [pointA, pointB] = calibration.points;

  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;

  const distance =
    Math.sqrt(dx * dx + dy * dy);

  const angle =
    Math.atan2(dy, dx) * 180 / Math.PI;

  const line =
    document.createElement('div');

  line.className = 'calibration-line';
  line.style.left = pointA.x + 'px';
  line.style.top = pointA.y + 'px';
  line.style.width = distance + 'px';
  line.style.transform =
    'rotate(' + angle + 'deg)';

  workspace.appendChild(line);
}

function finishCalibration() {
  const [pointA, pointB] = calibration.points;

  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;

  const pixelDistance =
    Math.sqrt(dx * dx + dy * dy);

  const input = prompt(
    'Wie lang ist diese Strecke tatsächlich in Metern? Beispiel: 4,25'
  );

  if (input === null) {
    cancelCalibration();
    return;
  }

  const actualMeters =
    Number(
      String(input)
        .trim()
        .replace(',', '.')
    );

  if (
    !Number.isFinite(actualMeters) ||
    actualMeters <= 0
  ) {
    alert(
      'Bitte geben Sie ein gültiges Maß größer als 0 Meter ein.'
    );

    calibration.points = [];
    renderCalibrationMarkers();
    return;
  }

  const template = getActiveTemplate();

  template.pixelsPerMeter =
    pixelDistance / actualMeters;

  calibration.active = false;

  saveTemplateToMainWindow();

  alert(
    'Der Maßstab wurde kalibriert.\\n\\n' +
    formatNumber(pixelDistance, 1) +
    ' Pixel entsprechen ' +
    formatNumber(actualMeters, 2) +
    ' Metern.\\n\\n' +
    'Ermittelter Maßstab: ' +
    formatNumber(
      template.pixelsPerMeter,
      2
    ) +
    ' Pixel pro Meter.'
  );

  calibration.points = [];

  setMode('move');
  renderFloor();
}

function cancelCalibration() {
  calibration.active = false;
  calibration.points = [];

  setMode('move');
  renderFloor();
}

setMode('move');
renderFloor();

document
  .getElementById('uploadTemplateBtn')
  .addEventListener(
    'click',
    openTemplateFileDialog
  );

document
  .getElementById('templateFileInput')
  .addEventListener(
    'change',
    handleTemplateUpload
  );

document
  .getElementById('workspace')
  .addEventListener(
    'mousedown',
    startDraw
  );

document
  .getElementById('workspace')
  .addEventListener('click', (e) => {

    if (mode === 'draw-lines') {
  handleLineDrawingClick(e);
  return;
  }

    if (mode === 'calibrate') {
      e.preventDefault();
      e.stopPropagation();

      handleCalibrationClick(e);
      return;
    }

    if (mode !== 'distributor') return;

    const workspace =
      document.getElementById('workspace');

    const rect =
      workspace.getBoundingClientRect();

    const x =
      Math.round(
        (
          e.clientX -
          rect.left +
          workspace.scrollLeft -
          21
        ) / 10
      ) * 10;

    const y =
      Math.round(
        (
          e.clientY -
          rect.top +
          workspace.scrollTop -
          21
        ) / 10
      ) * 10;

    const distributor = {
      x,
      y
    };

    const saved =
      window.opener &&
      typeof window.opener
        .updateDistributorFromWindow ===
        'function'
        ? window.opener
            .updateDistributorFromWindow(
              activeFloorIndex,
              distributor
            )
        : false;

    if (!saved) {
      alert(
        'Der Verteiler konnte nicht im Haupt-Konfigurator gespeichert werden.'
      );
      return;
    }

    floorData[
      activeFloorIndex
    ].distributor = distributor;

    setMode('move');
    renderFloor();
  });

document.addEventListener(
  'keydown',
  (e) => {
    if (
      e.key !== 'Delete' &&
      e.key !== 'Entf' &&
      e.key !== 'Backspace'
    ) {
      return;
    }

    const activeTag =
      document.activeElement
        ?.tagName
        ?.toLowerCase();

    if (
      activeTag === 'input' ||
      activeTag === 'select' ||
      activeTag === 'textarea'
    ) {
      return;
    }

    e.preventDefault();
    deleteSelectedRoom();
  }
);

document
  .getElementById('workspace')
  .addEventListener(
    'mousemove',
    handleLineDrawingMove
  );

document.addEventListener(
  'mousemove',
  moveModeHelpers
);
</script>
</body>
</html>
  `);
  win.document.close();
}