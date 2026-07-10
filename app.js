const state = {
  currentStep: 0,
  projectReference: '',
  projectType: '',
  brand: '',
  heatSource: '',
  thermostat: '',
  thermostatEnabled: '',
  extraInsulationEnabled: '',
  distributionMode: '',
  distributionEnabled: '',
  floors: [],
  maxUnlockedStep: 0,
  services: [],
  calculatedProducts: [],
  articleCatalog: [],
  postcodeDistances: [],
  recommendation: {
    heatLoadPerM2: null,
    deltaT: 5,
    maxCircuitLength: 120,
    flowTemperature: null,
    pipeMeterVa100: 8.8,
    pipeMeterVa150: 5.8,
    pipeMeterVa200: 4.6,
    screedCoverMm: 45
  },
  selectedSystemFloorIndex: 0,
  activeSummaryFloorIndex: 0,
  activeSummaryRoomIndex: 0,
  isLocked: false
};

const totalSteps = 12;
const floorsContainer = document.getElementById('floorsContainer');
const floorTemplate = document.getElementById('floorTemplate');
const roomTemplate = document.getElementById('roomTemplate');
const brandBlock = document.getElementById('brandBlock');
const summaryProjectType = document.getElementById('summaryProjectType');
const summaryBrand = document.getElementById('summaryBrand');
const summaryBrandBox = document.getElementById('summaryBrandBox');
const summaryHeatSource = document.getElementById('summaryHeatSource');
const summaryPlz = document.getElementById('summaryPlz');
const summaryRooms = document.getElementById('summaryRooms');
const summaryCabinetMounting = document.getElementById('summaryCabinetMounting');
const summaryDistributionMode = document.getElementById('summaryDistributionMode');
const summaryRegulationVoltage = document.getElementById('summaryRegulationVoltage');
const summaryDistributionItems = document.getElementById('summaryDistributionItems');
const summaryRegulationItems = document.getElementById('summaryRegulationItems');
const finalCheck = document.getElementById('finalCheck');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const serviceCheckboxes = document.querySelectorAll('input[name="service"]');
const extraInsulationOptions = document.getElementById('extraInsulationOptions');
const distributionManualFields = document.getElementById('distributionManualFields');
const distributionTypeFields = document.querySelectorAll('.distribution-type');
const distributionQtyFields = document.querySelectorAll('.distribution-qty');
const regulationCheckboxes = document.querySelectorAll('.regulation-checkbox');
const regulationQtyFields = document.querySelectorAll('.regulation-qty');
const thermostatOptions = document.getElementById('thermostatOptions');
const summaryEstrichRange = document.getElementById('summaryEstrichRange');
const summaryEstrichAdditives = document.getElementById('summaryEstrichAdditives');
const summaryDryConstruction = document.getElementById('summaryDryConstruction');
const estrichRangeCheckboxes = document.querySelectorAll('input[name="estrichRange"]');
const estrichAdditiveCheckboxes = document.querySelectorAll('input[name="estrichAdditive"]');
const dryConstructionCheckboxes = document.querySelectorAll('input[name="dryConstruction"]');
const millingSystemCheckboxes = document.querySelectorAll('input[name="millingSystem"]');
const millingSetupCheckbox = document.getElementById('millingSetupCheckbox');
const floorSurchargeCheckbox = document.getElementById('floorSurchargeCheckbox');
const millingBlock = document.getElementById('millingBlock');
const estrichBlock = document.getElementById('estrichBlock');
const dryConstructionBlock = document.getElementById('dryConstructionBlock');
const wlgBlock = document.getElementById('wlgBlock');
const insulationThicknessBlock = document.getElementById('insulationThicknessBlock');
const pipeTypeBlock = document.getElementById('pipeTypeBlock');
const pipeSizeBlock = document.getElementById('pipeSizeBlock') || { classList: { contains: () => true, toggle: () => { } } };
const systemBlock = document.getElementById('systemBlock');
const systemSanierungBlock = document.getElementById('systemSanierungBlock');
const systemOptionFlipfix = document.getElementById('systemOptionFlipfix');
const systemOptionPipeOnly = document.getElementById('systemOptionPipeOnly');
const systemInfoTacker = document.getElementById('systemInfoTacker');
const systemInfoNoppe = document.getElementById('systemInfoNoppe');
const systemInfoKlett = document.getElementById('systemInfoKlett');
const systemInfoKlett3mm = document.getElementById('systemInfoKlett3mm');
const mainLayout = document.getElementById('mainLayout');
const resultPanel = document.getElementById('resultPanel');
const resultTableBody = document.getElementById('resultTableBody');
const resultTotalNet = document.getElementById('resultTotalNet');
const savePdfBtn = document.getElementById('savePdfBtn');
const backToConfigBtn = document.getElementById('backToConfigBtn');
const printResultBtn = document.getElementById('printResultBtn') || null;
const handoverShopBtn = document.getElementById('handoverShopBtn');
const distributionToggleChoices = document.getElementById('distributionToggleChoices');
const distributionOptions = document.getElementById('distributionOptions');
const systemFloorSelect = document.getElementById('systemFloorSelect');
const systemRoomSelect = document.getElementById('systemRoomSelect');
const assignFloorSystemBtn = document.getElementById('assignFloorSystemBtn');
const assignFloorSystemToFloorBtn = document.getElementById('assignFloorSystemToFloorBtn');
const stepHint = document.getElementById('stepHint');
const thermostatFloorSelect = document.getElementById('thermostatFloorSelect');
const thermostatRoomSelect = document.getElementById('thermostatRoomSelect');
const assignThermostatBtn = document.getElementById('assignThermostatBtn');
const assignThermostatNoneBtn = document.getElementById('assignThermostatNoneBtn');
const distributionFloorSelect = document.getElementById('distributionFloorSelect');
const distributionRoomSelect = document.getElementById('distributionRoomSelect');
const assignDistributionBtn = document.getElementById('assignDistributionBtn');
const assignDistributionNoneBtn = document.getElementById('assignDistributionNoneBtn');
const extraInsulationFloorSelect = document.getElementById('extraInsulationFloorSelect');
const extraInsulationRoomSelect = document.getElementById('extraInsulationRoomSelect');
const assignExtraInsulationBtn = document.getElementById('assignExtraInsulationBtn');
const assignExtraInsulationToFloorBtn = document.getElementById('assignExtraInsulationToFloorBtn');
const assignExtraInsulationNoneBtn = document.getElementById('assignExtraInsulationNoneBtn');
const systemPointerFloor = document.getElementById('systemPointerFloor');
const systemPointerRoom = document.getElementById('systemPointerRoom');
const thermostatPointerFloor = document.getElementById('thermostatPointerFloor');
const thermostatPointerRoom = document.getElementById('thermostatPointerRoom');
const distributionPointerFloor = document.getElementById('distributionPointerFloor');
const distributionPointerRoom = document.getElementById('distributionPointerRoom');
const extraInsulationPointerFloor = document.getElementById('extraInsulationPointerFloor');
const extraInsulationPointerRoom = document.getElementById('extraInsulationPointerRoom');
const manualDistanceBox = document.getElementById('manualDistanceBox');
const manualDistanceKmInput = document.getElementById('manualDistanceKm');
const clearAllBtn = document.getElementById('clearAllBtn');
const projectReferenceInput = document.getElementById('projectReference');
const summaryProjectReference = document.getElementById('summaryProjectReference');

const thermostatAssignmentBlock = document.getElementById('thermostatAssignmentBlock');
const distributionAssignmentBlock = document.getElementById('distributionAssignmentBlock');
const extraInsulationAssignmentBlock = document.getElementById('extraInsulationAssignmentBlock');
const regulationOptionsBlock = document.getElementById('regulationOptionsBlock');

const appModal = document.getElementById('appModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalOkBtn = document.getElementById('modalOkBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

const recHeatLoadPerM2Input = document.getElementById('recHeatLoadPerM2');
const recDeltaTInput = document.getElementById('recDeltaT');
const recMaxCircuitLengthInput = document.getElementById('recMaxCircuitLength');
const recFlowTemperatureInput = document.getElementById('recFlowTemperature');
const technicalCalculationResult = document.getElementById('technicalCalculationResult');
const recPipeMeterVa100Input = document.getElementById('recPipeMeterVa100');
const recPipeMeterVa150Input = document.getElementById('recPipeMeterVa150');
const recPipeMeterVa200Input = document.getElementById('recPipeMeterVa200');
const recScreedCoverMmInput = document.getElementById('recScreedCoverMm');
const floorCircuitSummary = document.getElementById('floorCircuitSummary');

const shopToken = new URLSearchParams(window.location.search).get('token');
// const tokenStorageKey = shopToken ? `petershop-konfigurator-token-used-${shopToken}` : '';

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // optional: 'auto' wenn du kein weiches Scrollen willst
  });
}

function scrollToElement(element) {
  if (!element) return;

  setTimeout(() => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 100);
}

function setAssignmentBlockState(block, enabled) {
  if (!block) return;

  block.classList.toggle('disabled-block', !enabled);

  block.querySelectorAll('input, select, button').forEach((el) => {
    el.disabled = !enabled;
  });
}

function hasOpenSystemAssignments() {
  return state.floors.some(floor =>
    floor.rooms.some(room => roomIsHeated(room) && !room.assignments?.system)
  );
}

function hasOpenThermostatAssignments() {
  if (state.thermostatEnabled !== 'ja') return false;

  return state.floors.some(floor =>
    floor.rooms.some(room => roomIsHeated(room) && !room.assignments?.thermostat)
  );
}

function hasOpenDistributionAssignments() {
  if (state.distributionEnabled !== 'ja') return false;

  return state.floors.some(floor =>
    floor.rooms.some(room => roomIsHeated(room) && !room.assignments?.distribution)
  );
}

function hasOpenExtraInsulationAssignments() {
  if (state.extraInsulationEnabled !== 'ja') return false;

  return state.floors.some(floor =>
    floor.rooms.some(room => roomIsHeated(room) && !room.assignments?.extraInsulation)
  );
}

function getAllAssignmentsDoneText(type) {
  const hasOpen =
    type === 'system' ? hasOpenSystemAssignments() :
      type === 'thermostat' ? hasOpenThermostatAssignments() :
        type === 'distribution' ? hasOpenDistributionAssignments() :
          type === 'extraInsulation' ? hasOpenExtraInsulationAssignments() :
            false;

  return hasOpen
    ? 'Wählen Sie den nächsten Raum. 👉'
    : 'Es wurden alle Räume zugewiesen. Sie können nun über "Weiter" zum nächsten Schritt wechseln.';
}

function scrollAfterAssignment(type) {
  const hasOpen =
    type === 'system' ? hasOpenSystemAssignments() :
      type === 'thermostat' ? hasOpenThermostatAssignments() :
        type === 'distribution' ? hasOpenDistributionAssignments() :
          type === 'extraInsulation' ? hasOpenExtraInsulationAssignments() :
            false;

  if (hasOpen) {
    scrollToTop();
  } else {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }
}

function getCheckedValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : '';
}

function getDisplayValue(name) {
  return getCheckedValue(name) || 'Keine Auswahl';
}

function setupSingleChoiceCheckboxGroup(name) {
  document.querySelectorAll(`input[name="${name}"]`).forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        document.querySelectorAll(`input[name="${name}"]`).forEach((otherCheckbox) => {
          if (otherCheckbox !== checkbox) {
            otherCheckbox.checked = false;
          }
        });
      }

      if (name === 'system') {
        syncSystemOptionsByBrand();
        syncSanierungSystemRules();
      }

      updateSummary();
    });
  });
}

function getSystemValue() {
  const selector =
    state.projectType === 'sanierung'
      ? '#systemSanierungBlock input[name="system"]:checked'
      : '#systemBlock input[name="system"]:checked';

  const checked = document.querySelector(selector);
  return checked ? checked.value : '';
}

function getSystemAddonValue() {
  const checked = document.querySelector('input[name="systemAddon"]:checked');
  return checked ? checked.value : '';
}

function getFloorLabel(floor, index) {
  return floor.name || `Etage ${index + 1}`;
}

function floorHasHeatedRooms(floor) {
  return floor.rooms.some((room) => room.function === 'Wohnraum' || room.function === 'Bad');
}

function roomIsHeated(room) {
  return room.function === 'Wohnraum' || room.function === 'Bad';
}

function getRoomLabel(room, index) {
  if (!room) return `Raum ${index + 1}`;
  return room.name || `Raum ${index + 1}`;
}

function getSelectedSystemRoom() {
  const floorIndex = Number(systemFloorSelect.value || 0);
  const roomIndex = Number(systemRoomSelect.value || 0);

  return state.floors[floorIndex]?.rooms[roomIndex] || null;
}

function getSelectedThermostatRoom() {
  const floorIndex = Number(thermostatFloorSelect.value || 0);
  const roomIndex = Number(thermostatRoomSelect.value || 0);

  return state.floors[floorIndex]?.rooms[roomIndex] || null;
}

function allHeatedRoomsHaveSystemAssignment() {
  return state.floors.every((floor) => {
    return floor.rooms.every((room) => {
      if (!roomIsHeated(room)) return true;
      return !!room.assignments?.system;
    });
  });
}

function allHeatedRoomsHaveThermostatAssignment() {
  return state.floors.every((floor) => {
    return floor.rooms.every((room) => {
      if (!roomIsHeated(room)) return true;
      return !!room.assignments?.thermostat;
    });
  });
}

function allHeatedRoomsHaveDistributionAssignment() {
  return state.floors.every((floor) => {
    return floor.rooms.every((room) => {
      if (!roomIsHeated(room)) return true;
      return !!room.assignments?.distribution;
    });
  });
}

function allHeatedRoomsHaveExtraInsulationAssignment() {
  return state.floors.every((floor) => {
    return floor.rooms.every((room) => {
      if (!roomIsHeated(room)) return true;
      return !!room.assignments?.extraInsulation;
    });
  });
}

function hasAnyThermostatAssignment() {
  return state.floors.some((floor) => {
    return floor.rooms.some((room) => {
      return roomIsHeated(room) && !!room.assignments?.thermostat;
    });
  });
}

function hasNonGroundFloorWithHeatedRooms() {
  return state.floors.some((floor) => {
    const isNotGroundFloor = floor.name !== 'Erdgeschoss';
    return isNotGroundFloor && floorHasHeatedRooms(floor);
  });
}

function getCurrentSystemSelection() {
  return {
    system: getSystemValue(),
    systemAddon: getSystemAddonValue(),
    wlg: getCheckedValue('wlg'),
    insulationThickness: getCheckedValue('insulationThickness'),
    pipeType: getCheckedValue('pipeType'),
    milling: Array.from(millingSystemCheckboxes).filter(cb => cb.checked).map(cb => cb.value),
    estrichRange: getEstrichRangeEntries(),
    estrichAdditives: getEstrichAdditiveEntries(),
    dryConstruction: getDryConstructionEntries()
  };
}

function clearSystemSelection() {
  document.querySelectorAll(
    'input[name="system"], input[name="systemAddon"], input[name="wlg"], input[name="insulationThickness"], input[name="pipeType"]'
  ).forEach((input) => {
    input.checked = false;
  });
}

function setSystemSelection(selection) {
  // Erst alle Systemfelder entsperren, damit gespeicherte Werte wieder gesetzt werden können
  document.querySelectorAll(
    'input[name="system"], input[name="systemAddon"], input[name="wlg"], input[name="insulationThickness"], input[name="pipeType"]'
  ).forEach((input) => {
    input.disabled = false;
    input.closest('.radio-option')?.classList.remove('disabled-radio-option');
  });

  clearSystemSelection();

  if (!selection) {
    syncSystemOptionsByBrand();
    syncSystemInsulationRules();
    updateAssignFloorSystemButton();
    return;
  }

  Object.entries({
    system: selection.system,
    systemAddon: selection.systemAddon,
    wlg: selection.wlg,
    insulationThickness: selection.insulationThickness,
    pipeType: selection.pipeType
  }).forEach(([name, value]) => {
    if (!value) return;

    const input = document.querySelector(`input[name="${name}"][value="${value}"]`);

    if (input) {
      input.checked = true;
    }
  });

  syncSystemOptionsByBrand();
  syncSystemInsulationRules();
  updateAssignFloorSystemButton();
}

function renderSystemFloorSelect() {
  if (!systemFloorSelect || !systemRoomSelect) return;

  systemFloorSelect.innerHTML = state.floors.map((floor, index) => {
    const label = getFloorLabel(floor, index);
    const heatedRooms = floor.rooms.filter(roomIsHeated);
    const assignedRooms = heatedRooms.filter(room => room.assignments?.system).length;
    const check = heatedRooms.length > 0 && assignedRooms === heatedRooms.length ? ' ✅' : '';

    return `<option value="${index}">${label}${check}</option>`;
  }).join('');

  if (state.selectedSystemFloorIndex >= state.floors.length) {
    state.selectedSystemFloorIndex = 0;
  }

  systemFloorSelect.value = String(state.selectedSystemFloorIndex);

  renderSystemRoomSelect();
}

function renderSystemRoomSelect() {
  const floor = state.floors[state.selectedSystemFloorIndex];

  if (!floor || !systemRoomSelect) return;

  systemRoomSelect.innerHTML = floor.rooms.map((room, index) => {
    const label = getRoomLabel(room, index);
    const functionText = room.function || 'ohne Funktion';
    const check = room.assignments?.system ? ' ✅' : '';
    const disabledText = roomIsHeated(room) ? '' : ' (unbeheizt)';

    return `<option value="${index}">${label} / ${functionText}${disabledText}${check}</option>`;
  }).join('');

  systemRoomSelect.value = '0';

  const room = getSelectedSystemRoom();
  setSystemSelection(room?.assignments?.system || null);
  syncEstrichRangeByArea();
  updateAssignFloorSystemButton();
}

function renderThermostatFloorSelect() {
  if (!thermostatFloorSelect || !thermostatRoomSelect) return;

  thermostatFloorSelect.innerHTML = state.floors.map((floor, index) => {
    const label = getFloorLabel(floor, index);
    const heatedRooms = floor.rooms.filter(roomIsHeated);
    const assignedRooms = heatedRooms.filter(room => room.assignments?.thermostat).length;
    const check = heatedRooms.length > 0 && assignedRooms === heatedRooms.length ? ' ✅' : '';

    return `<option value="${index}">${label}${check}</option>`;
  }).join('');

  const thermostatSafeFloorIndex = Number(thermostatFloorSelect.value || 0) < state.floors.length
    ? Number(thermostatFloorSelect.value || 0)
    : 0;

  thermostatFloorSelect.value = String(thermostatSafeFloorIndex);

  renderThermostatRoomSelect();
}

function renderThermostatRoomSelect() {
  if (!thermostatFloorSelect || !thermostatRoomSelect) return;

  const floorIndex = Number(thermostatFloorSelect.value || 0);
  const floor = state.floors[floorIndex];

  if (!floor) return;

  thermostatRoomSelect.innerHTML = floor.rooms.map((room, index) => {
    const label = getRoomLabel(room, index);
    const functionText = room.function || 'ohne Funktion';
    const check = room.assignments?.thermostat ? ' ✅' : '';
    const disabledText = roomIsHeated(room) ? '' : ' (unbeheizt)';

    return `<option value="${index}">${label} / ${functionText}${disabledText}${check}</option>`;
  }).join('');

  thermostatRoomSelect.value = thermostatRoomSelect.value || '0';

  setThermostatSelection(getSelectedThermostatRoom()?.assignments?.thermostat || null);
  updateAssignThermostatButton();
}

function clearThermostatSelection() {
  document.querySelectorAll('#thermostatChoices .choice-card').forEach(card => {
    card.classList.remove('active');
  });

  document.querySelectorAll('.thermostat-qty').forEach(input => {
    input.value = '';
  });

  state.thermostat = '';
}

function setThermostatSelection(selection) {
  clearThermostatSelection();

  if (!selection) return;

  if (selection.type) {
    state.thermostat = selection.type;

    document.querySelectorAll('#thermostatChoices .choice-card').forEach(card => {
      card.classList.toggle('active', card.dataset.thermostat === selection.type);
    });
  }

  const normalizedType = String(selection.type || '').toLowerCase();
  const qtyInput = document.querySelector(`.thermostat-qty[data-type="${normalizedType}"]`);
  if (qtyInput) {
    qtyInput.value = selection.quantity || '';
  }
}

function getCurrentThermostatSelection() {
  if (!state.thermostat) return null;

  const quantity = getThermostatQty(state.thermostat);

  if (quantity <= 0) return null;

  return {
    type: state.thermostat,
    quantity
  };
}

function updateAssignThermostatButton() {
  if (!assignThermostatBtn || !assignThermostatNoneBtn) return;

  const room = getSelectedThermostatRoom();

  if (state.thermostatEnabled !== 'ja') {
    assignThermostatBtn.classList.add('hidden');
    assignThermostatNoneBtn.classList.add('hidden');
    return;
  }

  assignThermostatBtn.classList.remove('hidden');
  assignThermostatNoneBtn.classList.remove('hidden');

  if (!room || !roomIsHeated(room)) {
    assignThermostatBtn.disabled = true;
    assignThermostatNoneBtn.disabled = true;
    return;
  }

  const selection = getCurrentThermostatSelection();

  assignThermostatBtn.disabled = !selection;
  assignThermostatNoneBtn.disabled = false;

  assignThermostatBtn.textContent = room.assignments?.thermostat && !room.assignments.thermostat.none
    ? 'Thermostat des Raumes aktualisieren'
    : 'Thermostat dem Raum zuweisen';

  if (room.assignments?.thermostat?.none) {
    assignThermostatNoneBtn.textContent = 'Für diesen Raum nicht gewünscht.';
    assignThermostatNoneBtn.classList.add('room-none-active');
  } else {
    assignThermostatNoneBtn.textContent = 'Nicht für diesen Raum erforderlich';
    assignThermostatNoneBtn.classList.remove('room-none-active');
  }
}

function currentSystemSelectionIsComplete() {
  const selection = getCurrentSystemSelection();

  const hasEstrich =
    getEstrichRangeEntries().length > 0 ||
    getEstrichAdditiveEntries().length > 0;

  if (state.projectType === 'sanierung') {
    return sanierungHasAnySystemSelection();
  }

  if (hasEstrich) {
    return true;
  }

  return (
    selection.system !== '' &&
    selection.wlg !== '' &&
    selection.insulationThickness !== '' &&
    selection.pipeType !== ''
  );
}

function allRelevantFloorsHaveSystemAssignment() {
  return state.floors.every((floor) => {
    if (!floorHasHeatedRooms(floor)) return true;
    return !!floor.systemAssignment;
  });
}

function updateAssignFloorSystemButton() {
  if (!assignFloorSystemBtn) return;

  const room = getSelectedSystemRoom();

  if (!room || !roomIsHeated(room)) {
    assignFloorSystemBtn.disabled = true;
    assignFloorSystemBtn.textContent = 'Raum benötigt keine Zuweisung';
    return;
  }

  assignFloorSystemBtn.disabled = !currentSystemSelectionIsComplete();

  if (assignFloorSystemToFloorBtn) {
    assignFloorSystemToFloorBtn.disabled = !currentSystemSelectionIsComplete();

    const floor =
      state.floors[state.selectedSystemFloorIndex];

    const floorAlreadyAssigned =
      floor?.rooms
        ?.filter(roomIsHeated)
        ?.every(room => room.assignments?.system);

    assignFloorSystemToFloorBtn.textContent =
      floorAlreadyAssigned
        ? 'System der Etage aktualisieren'
        : 'System der Etage zuweisen';
  }

  assignFloorSystemBtn.textContent = room.assignments?.system
    ? 'System des Raumes aktualisieren'
    : 'System dem Raum zuweisen';
}

async function assignSystemToSelectedFloor() {
  const room = getSelectedSystemRoom();

  if (!room) return;

  if (!roomIsHeated(room)) {
    await showAppModal({
      title: 'Hinweis',
      message: 'Dieser Raum ist unbeheizt und benötigt keine Systemzuweisung.',
      confirmText: 'OK'
    });
    return;
  }

  if (!currentSystemSelectionIsComplete()) {
    await showAppModal({
      title: 'Auswahl unvollständig',
      message: 'Bitte wählen Sie zuerst alle notwendigen Systemangaben für diesen Raum aus.',
      confirmText: 'OK'
    });
    return;
  }

  room.assignments.system = getCurrentSystemSelection();

  const hint = getAllAssignmentsDoneText('system');

  await showAppModal({
    title: 'Gespeichert',
    message: `Das System wurde dem Raum "${getRoomLabel(room, Number(systemRoomSelect.value))}" zugewiesen.${hint ? '\n\n' + hint : ''}`,
    confirmText: 'OK'
  });

  renderSystemFloorSelect();
  updateAssignmentPointers();
  scrollAfterAssignment('system');
  updateSummary();
}

async function assignSystemToSelectedEtage() {
  const floorIndex = Number(systemFloorSelect.value || 0);
  const floor = state.floors[floorIndex];

  if (!floor) return;

  if (!currentSystemSelectionIsComplete()) {
    await showAppModal({
      title: 'Auswahl unvollständig',
      message: 'Bitte wählen Sie zuerst alle notwendigen Systemangaben aus.',
      confirmText: 'OK'
    });
    return;
  }

  const heatedRooms = floor.rooms.filter(roomIsHeated);

  if (heatedRooms.length === 0) {
    await showAppModal({
      title: 'Hinweis',
      message: 'Diese Etage enthält keine beheizten Räume und benötigt daher keine Systemzuweisung.',
      confirmText: 'OK'
    });
    return;
  }

  const confirmed = await showAppModal({
    title: 'System der Etage zuweisen?',
    message: `Möchten Sie das aktuell ausgewählte System wirklich allen beheizten Räumen der Etage "${getFloorLabel(floor, floorIndex)}" zuweisen? Bereits vorhandene Systemzuweisungen in dieser Etage werden überschrieben.`,
    confirmText: 'Ja',
    cancelText: 'Abbrechen'
  });

  if (!confirmed) return;

  const selection = getCurrentSystemSelection();

  heatedRooms.forEach((room) => {
    room.assignments = room.assignments || {};
    room.assignments.system = structuredClone(selection);
  });

  const hint = getAllAssignmentsDoneText('system');

  await showAppModal({
    title: 'Gespeichert',
    message: `Das System wurde allen beheizten Räumen der Etage "${getFloorLabel(floor, floorIndex)}" zugewiesen.${hint ? '\n\n' + hint : ''}`,
    confirmText: 'OK'
  });

  renderSystemFloorSelect();
  updateAssignmentPointers();
  scrollAfterAssignment('system');
  updateSummary();
}

function showAppModal({ title = 'Hinweis', message = '', confirmText = 'OK', cancelText = null }) {
  return new Promise((resolve) => {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalOkBtn.textContent = confirmText;

    if (cancelText) {
      modalCancelBtn.textContent = cancelText;
      modalCancelBtn.classList.remove('hidden');
    } else {
      modalCancelBtn.classList.add('hidden');
    }

    appModal.classList.remove('hidden');

    const cleanup = (result) => {
      appModal.classList.add('hidden');
      modalOkBtn.onclick = null;
      modalCancelBtn.onclick = null;
      resolve(result);
    };

    modalOkBtn.onclick = () => cleanup(true);
    modalCancelBtn.onclick = () => cleanup(false);
  });
}

function createFloor() {
  return {
    name: 'Erdgeschoss',
    systemAssignment: null,
    floorplanDistributor: null,
    rooms: []
  };
}

function createRoom() {
  return {
    name: '',
    function: 'Wohnraum',
    temperature: 20,
    spacing: 'VA 150',
    area: '',
    estrich: 'ja',
    floorCovering: 'Fliesen',

    floorplan: {
      x: null,
      y: null,
      width: null,
      height: null,
      doorEnabled: false,
      doorSide: 'bottom',
      doorPosition: 50,
      doorWidth: 90
    },

    assignments: {
      system: null,
      thermostat: null,
      distribution: null,
      extraInsulation: null
    }
  };
}

function resetFromProjectTypeForward() {
  state.heatSource = '';
  state.thermostatEnabled = '';
  state.extraInsulationEnabled = '';
  state.distributionMode = '';
  state.services = [];
  state.floors = [createFloor()];
  state.maxUnlockedStep = 1;
  state.distributionEnabled = '';

  document.querySelectorAll('input').forEach((input) => {
    if (input.type === 'checkbox') input.checked = false;
    if (input.type === 'number' || input.type === 'text') input.value = '';
  });

  document.querySelectorAll('select').forEach((select) => {
    select.selectedIndex = 0;
  });

  renderHeatSource();
  renderThermostat();
  renderThermostatToggle();
  renderExtraInsulationToggle();
  renderDistributionMode();
  renderFloors();
  updateSummary();
}

function resetFromStep5Forward() {
  state.thermostat = '';
  state.thermostatEnabled = '';
  state.extraInsulationEnabled = '';
  state.distributionMode = '';
  state.distributionEnabled = '';
  state.services = [];
  state.calculatedProducts = [];
  state.selectedSystemFloorIndex = 0;

  state.floors.forEach((floor) => {
    floor.rooms.forEach((room) => {
      room.assignments = room.assignments || {};
      room.assignments.system = null;
      room.assignments.thermostat = null;
      room.assignments.distribution = null;
      room.assignments.extraInsulation = null;
    });
  });

  document.querySelectorAll(`
    input[name="system"],
    input[name="systemAddon"],
    input[name="wlg"],
    input[name="insulationThickness"],
    input[name="pipeType"],
    input[name="pipeSize"],
    input[name="millingSystem"],
    input[name="estrichRange"],
    input[name="estrichAdditive"],
    input[name="dryConstruction"],
    input[name="cabinetMounting"],
    input[name="regulationVoltage"],
    input[name="extraInsulation"],
    input[name="extraInsulationWlg"],
    input[name="extraInsulationThickness"],
    input[name="service"],
    .regulation-checkbox
  `).forEach((input) => {
    input.checked = false;
    input.disabled = false;
  });

  document.querySelectorAll(`
    .thermostat-qty,
    .distribution-qty,
    .regulation-qty
  `).forEach((input) => {
    input.value = '';
    input.disabled = false;
  });

  document.querySelectorAll('.distribution-type').forEach((select) => {
    select.selectedIndex = 0;
    select.disabled = false;
  });

  document.querySelectorAll(`
    #thermostatToggleChoices .choice-card,
    #thermostatChoices .choice-card,
    #distributionToggleChoices .choice-card,
    #extraInsulationToggleChoices .choice-card
  `).forEach((card) => {
    card.classList.remove('active');
  });

  renderSystemFloorSelect();
  renderThermostatToggle();
  renderDistributionToggle();
  renderExtraInsulationToggle();
  renderFloors();
  updateAssignmentPointers();
  updateSummary();
}

async function returnToStep1AndResetFromStep5() {
  const confirmed = await showAppModal({
    title: 'Hinweis',
    message: 'Die Rückkehr zu Schritt 1 setzt alle Eingaben ab Schritt 5 "System" zurück. Projektart, Marke, Wärmeerzeuger, Standort sowie Etagen und Räume bleiben erhalten.',
    confirmText: 'Weiter',
    cancelText: 'Abbrechen'
  });

  if (!confirmed) return;

  resetFromStep5Forward();

  state.currentStep = 1;
  state.maxUnlockedStep = Math.max(state.maxUnlockedStep, 5);

  showStep(1);
}

function showStep(step) {
  const allowedStep = Math.max(0, Math.min(state.maxUnlockedStep, totalSteps - 1));
  state.currentStep = Math.max(0, Math.min(step, allowedStep));

  document.querySelectorAll('.step-item').forEach((item) => {
    const itemStep = Number(item.dataset.step);
    item.classList.toggle('active', itemStep === state.currentStep);
    item.classList.toggle('clickable', itemStep <= state.maxUnlockedStep);
    item.classList.toggle('locked', itemStep > state.maxUnlockedStep);
  });

  document.querySelectorAll('.step-panel').forEach((panel) => {
    panel.classList.toggle('active', Number(panel.dataset.stepPanel) === state.currentStep);
  });

  prevBtn.style.visibility = state.currentStep === 0 ? 'hidden' : 'visible';
  nextBtn.style.display = state.currentStep === totalSteps - 1 ? 'none' : 'inline-flex';

  updateNextButtonAndStepHint();

  const isRecommendationStep = state.currentStep === 5;
  const isSystemStep = state.currentStep === 6;
  const isThermostatStep = state.currentStep === 7;
  const isDistributionStep = state.currentStep === 8;
  const isExtraInsulationStep = state.currentStep === 9;

  if (isRecommendationStep) {
    initRecommendationInputs();
    renderTechnicalRecommendation();
  }

  assignFloorSystemBtn.classList.toggle('hidden', !isSystemStep);
  assignFloorSystemToFloorBtn?.classList.toggle('hidden', !isSystemStep);

  if (assignFloorSystemToFloorBtn) {
    assignFloorSystemToFloorBtn.classList.toggle('hidden', !isSystemStep);
  }

  if (state.currentStep === 5) {
    return true;
  }

  if (assignThermostatBtn) {
    assignThermostatBtn.classList.toggle('hidden', !isThermostatStep || state.thermostatEnabled !== 'ja');
  }

  if (assignThermostatNoneBtn) {
    assignThermostatNoneBtn.classList.toggle('hidden', !isThermostatStep || state.thermostatEnabled !== 'ja');
  }

  if (assignDistributionBtn) {
    assignDistributionBtn.classList.toggle('hidden', !isDistributionStep || state.distributionEnabled !== 'ja');
  }

  if (assignDistributionNoneBtn) {
    assignDistributionNoneBtn.classList.toggle('hidden', !isDistributionStep || state.distributionEnabled !== 'ja');
  }

  if (assignExtraInsulationBtn) {
    assignExtraInsulationBtn.classList.toggle('hidden', !isExtraInsulationStep || state.extraInsulationEnabled !== 'ja');
  }

  if (assignExtraInsulationToFloorBtn) {
    assignExtraInsulationToFloorBtn.classList.toggle(
      'hidden',
      !isExtraInsulationStep ||
      state.extraInsulationEnabled !== 'ja'
    );
  }

  if (assignExtraInsulationNoneBtn) {
    assignExtraInsulationNoneBtn.classList.toggle('hidden', !isExtraInsulationStep || state.extraInsulationEnabled !== 'ja');
  }

  if (isSystemStep) {
    renderSystemFloorSelect();
  }

  if (isThermostatStep) {
    renderThermostatFloorSelect();
    updateAssignThermostatButton();
  }

  if (isDistributionStep) {
    renderDistributionFloorSelect();
    updateAssignDistributionButton();
    renderFloorCircuitSummary();
  }

  if (isExtraInsulationStep) {
    renderExtraInsulationFloorSelect();
    updateAssignExtraInsulationButton();
  }

  updateAssignmentPointers();
  scrollToTop();
}

function updateNextButtonAndStepHint() {
  const canContinue = canProceedToNextStep();

  nextBtn.disabled = !canContinue;

  if (stepHint) {
    const requirementText = getNextRequirementText();
    stepHint.classList.toggle('hidden', canContinue || !requirementText);
    stepHint.textContent = requirementText;
  }
}

function canProceedToNextStep() {
  if (state.currentStep === 0) {
    return true;
  }

  if (state.currentStep === 1) {
    if (state.projectType === 'neubau') {
      return state.brand !== '';
    }
    return state.projectType !== '';
  }

  if (state.currentStep === 2) {
    return state.heatSource !== '';
  }

  if (state.currentStep === 3) {
    const plzRaw = document.getElementById('plz').value.trim();
    const manualKm = getManualDistanceKm();

    if (/^\d{5}$/.test(plzRaw)) {
      const entry = getDistanceEntryForPlz(plzRaw);

      if (entry) return true;

      return manualKm > 0;
    }

    return false;
  }

  if (state.currentStep === 4) {
    return state.floors.some((floor) =>
      floor.rooms.some((room) => {
        const area = Number(String(room.area).replace(',', '.'));
        return area > 0;
      })
    );
  }

  if (state.currentStep === 6) {
    return allHeatedRoomsHaveSystemAssignment();
  }

  if (state.currentStep === 7) {
    if (state.thermostatEnabled === 'nein') {
      return true;
    }

    if (state.thermostatEnabled === 'ja') {
      return allHeatedRoomsHaveThermostatAssignment();
    }

    return false;
  }

  if (state.currentStep === 8) {
    if (state.distributionEnabled === 'nein') {
      return true;
    }

    if (state.distributionEnabled === 'ja') {
      return allHeatedRoomsHaveDistributionAssignment();
    }

    return false;
  }

  if (state.currentStep === 9) {
    if (state.extraInsulationEnabled === 'nein') {
      return true;
    }

    if (state.extraInsulationEnabled === 'ja') {
      return allHeatedRoomsHaveExtraInsulationAssignment();
    }

    return false;
  }

  return true;
}

function syncSystemInsulationRules() {
  const system = getSystemValue();
  const wlg = getCheckedValue('wlg');
  const thickness = getCheckedValue('insulationThickness');

  const ruleMap = {
    handelsmarke: [
      { wlg: '035', thickness: '30 mm' },
      { wlg: '040', thickness: '30-2 mm' },
      { wlg: '045', thickness: '20-2 mm' },
      { wlg: '045', thickness: '30-3 mm' }
    ],
    roth: [
      { wlg: '035', thickness: '20-2 mm' },
      { wlg: '040', thickness: '20-2 mm' },
      { wlg: '040', thickness: '30-2 mm' },
      { wlg: '045', thickness: '30-3 mm' }
    ],
    uponor: [
      { wlg: '040', thickness: '20-2 mm' },
      { wlg: '040', thickness: '30-2 mm' },
      { wlg: '045', thickness: '30-3 mm' },
      { wlg: '045', thickness: '35-3 mm' }
    ]
  };

  if (state.projectType !== 'neubau' || system !== 'Tacker') {
    document.querySelectorAll('input[name="wlg"], input[name="insulationThickness"]').forEach((input) => {
      input.disabled = false;
      input.closest('.radio-option')?.classList.remove('disabled-radio-option');
    });
    return;
  }

  const rules = ruleMap[state.brand] || [];

  document.querySelectorAll('input[name="wlg"]').forEach((input) => {
    const isAllowed = !thickness || rules.some(rule =>
      rule.wlg === input.value && rule.thickness === thickness
    );

    input.disabled = !isAllowed;

    if (!isAllowed) {
      input.checked = false;
    }

    input.closest('.radio-option')?.classList.toggle('disabled-radio-option', !isAllowed);
  });

  document.querySelectorAll('input[name="insulationThickness"]').forEach((input) => {
    const isAllowed = !wlg || rules.some(rule =>
      rule.thickness === input.value && rule.wlg === wlg
    );

    input.disabled = !isAllowed;

    if (!isAllowed) {
      input.checked = false;
    }

    input.closest('.radio-option')?.classList.toggle('disabled-radio-option', !isAllowed);
  });
}

function renderProjectType() {
  document.querySelectorAll('#projectTypeChoices .choice-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.type === state.projectType);
  });

  const showBrand = state.projectType === 'neubau';
  brandBlock.classList.toggle('hidden', !showBrand);
  summaryBrandBox.classList.toggle('hidden', !showBrand);
  summaryProjectType.textContent = state.projectType ? (state.projectType === 'neubau' ? 'Neubau' : 'Sanierung') : 'Noch nicht gewählt';
  summaryBrand.textContent =
    state.brand === 'uponor' ? 'Uponor' :
      state.brand === 'roth' ? 'Roth' :
        state.brand === 'handelsmarke' ? 'Handelsmarke' :
          'Keine Auswahl';

  renderSystemBlocksByProjectType();
}

function renderSystemBlocksByProjectType() {
  const isNeubau = state.projectType === 'neubau';
  const isSanierung = state.projectType === 'sanierung';

  // System Neubau
  systemBlock.classList.toggle('hidden', !isNeubau);

  // System Sanierung
  systemSanierungBlock.classList.toggle('hidden', !isSanierung);

  // Fräsen
  millingBlock.classList.toggle('hidden', isNeubau);

  // Immer sichtbar
  estrichBlock.classList.remove('hidden');
  dryConstructionBlock.classList.toggle('hidden', !isSanierung);

  // Nur Neubau
  wlgBlock.classList.toggle('hidden', isSanierung);
  insulationThicknessBlock.classList.toggle('hidden', isSanierung);
  pipeTypeBlock.classList.toggle('hidden', isSanierung);
  pipeSizeBlock.classList.toggle('hidden', isSanierung);

  if (state.projectType === 'neubau' && pipeTypeBlock && estrichBlock) {
    pipeTypeBlock.insertAdjacentElement('afterend', estrichBlock);
  }
}

function renderBrand() {
  document.querySelectorAll('#brandChoices .choice-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.brand === state.brand);
  });

  summaryBrand.textContent =
    state.brand === 'uponor' ? 'Uponor' :
      state.brand === 'roth' ? 'Roth' :
        'Handelsmarke';

  syncSystemOptionsByBrand();
  renderPipeOptionsByBrand();
  updateSystemInfoTextsByBrand();
}

function renderPipeOptionsByBrand() {
  const isRoth = state.brand === 'roth';
  const isUponor = state.brand === 'uponor';
  const isStandard = !isRoth && !isUponor;

  document.querySelectorAll('.pipe-standard-option').forEach((option) => {
    option.classList.toggle('hidden', !isStandard);

    const input = option.querySelector('input');
    if (input) {
      input.disabled = !isStandard;
      if (!isStandard) input.checked = false;
    }
  });

  document.querySelectorAll('.pipe-roth-option').forEach((option) => {
    option.classList.toggle('hidden', !isRoth);

    const input = option.querySelector('input');
    if (input) {
      input.disabled = !isRoth;
      if (!isRoth) input.checked = false;
    }
  });

  document.querySelectorAll('.pipe-uponor-option').forEach((option) => {
    option.classList.toggle('hidden', !isUponor);

    const input = option.querySelector('input');
    if (input) {
      input.disabled = !isUponor;
      if (!isUponor) input.checked = false;
    }
  });
}

function syncSystemOptionsByBrand() {
  const neubauSystemCheckboxes = document.querySelectorAll('#systemBlock input[name="system"]');
  const sanierungSystemCheckbox = document.querySelector('#systemSanierungBlock input[name="system"]');

  const selectedSystem = getSystemValue();

  neubauSystemCheckboxes.forEach((checkbox) => {
    const optionLabel = checkbox.closest('.radio-option');

    let isAllowed = true;
    let isHidden = false;

    // Grundregel: Noppe erstmal bei allen Herstellern gesperrt
    if (checkbox.value === 'Noppe') {
      isAllowed = false;
    }

    // Handelsmarke und Roth: Klett gesperrt
    if ((state.brand === 'handelsmarke' || state.brand === 'roth') && checkbox.value === 'Klett') {
      isAllowed = false;
    }

    // Uponor: Flipfix ausblenden
    if (
      state.brand === 'uponor' &&
      checkbox.value === 'Systemplatte Flipfix (2mm Hohlkammer-Platte)'
    ) {
      isHidden = true;
      isAllowed = false;
    }

    // Wenn Tacker gewählt wurde: Klett und Noppe sperren
    if (selectedSystem === 'Tacker' && (checkbox.value === 'Klett' || checkbox.value === 'Noppe')) {
      isAllowed = false;
    }

    // Wenn Flipfix gewählt wurde: Klett sperren
    if (
      selectedSystem === 'Systemplatte Flipfix (2mm Hohlkammer-Platte)' &&
      checkbox.value === 'Klett'
    ) {
      isAllowed = false;
    }

    optionLabel?.classList.toggle('hidden', isHidden);
    checkbox.disabled = !isAllowed;
    optionLabel?.classList.toggle('disabled-radio-option', !isAllowed);

    if (!isAllowed || isHidden) {
      checkbox.checked = false;
    }
  });

  // Sanierungs-System bleibt unabhängig davon aktiv
  if (sanierungSystemCheckbox) {
    const sanierungLabel = sanierungSystemCheckbox.closest('.radio-option');
    sanierungSystemCheckbox.disabled = false;
    sanierungLabel?.classList.remove('disabled-radio-option');
  }
  const selectedAddonAfterRules = getSystemAddonValue();
  const disableInsulationFields = selectedAddonAfterRules === SYSTEM_PIPE_ONLY;

  document.querySelectorAll('input[name="wlg"], input[name="insulationThickness"]').forEach((input) => {
    input.disabled = disableInsulationFields;

    if (disableInsulationFields) {
      input.checked = false;
    }

    input.closest('.radio-option')?.classList.toggle('disabled-radio-option', disableInsulationFields);
  });
}

function updateSystemInfoTextsByBrand() {
  const texts = {
    handelsmarke: {
      Tacker: `...als Tackersystem liefern und montieren...
- Tackerplatte (diverse Wärmeleitgruppen)
- Heizrohr PE-RT 17x2 mm
- Tackernadeln für Heizrohr 14-17 mm
- PE-Randdämmstreifen 10/150 | Comfort - selbstklebend | mit Folienlasche | 50 lfm
- Klebeband extrem reißfest | 50 mm breit | Rolle = 66 m
- Klemmverschraubung 16/17x2,0 mm - einzeln
- Rohrverbinder (Kupplung) 16x16/17x17 mm, mit zwei gleichen Presshülsen
- Winkelspangen, Kunststoff schwarz, Rohrführung zum Umlenken der Heizrohre im Verteilerbereich, für Rohre 14-18 mm
- Dehnfugenschutzrohr zum Isolieren der Vor-/Rückläufe
- Dehnfugenschutzrohr geschlitzt für Rohr bis 20 mm im Bereich der Dehnfugen | ca. 300 mm lang
- Estrichnessstellenmarkierung
- nicht enthalten: Montage der Verteiler, Schränke, Klemmleisten, Stellantriebe, Raumthermostate
- Baustelleneinrichtung, Müllentsorgung, Bauleitung, Heizflächenauslegung und Abdrücken der Fußbodenheizung mit Luft sind im Preis enthalten`,
      Noppe: 'zurzeit nicht verfügbar',
      Klett: 'zurzeit nicht verfügbar'
    },
    uponor: {
      Tacker: `...als Tackersystem liefern und montieren...
- Uponor Tackerrolle (diverse Wärmeleitgruppen)
- Uponor ComfortPipe Rohr PE-Xa 16x1,8 mm
- Tackernadeln für Heizrohr 14-17 mm | Hausmarke
- PE-Randdämmstreifen 10/150 | Comfort - selbstklebend | mit Folienlasche | 50 lfm | Hausmarke
- Klebeband extrem reißfest | 50 mm breit | Rolle = 66 m | Hausmarke
- Klemmverschraubung 16x2,0 mm 3/4” PEX- einzeln | Uponor
- Rohrverbinder (Kupplung m.Ringen) 16x16 mm | Uponor
- Winkelspangen, Kunststoff schwarz, Rohrführung zum Umlenken der Heizrohre im Verteilerbereich, für Rohre 14-18 mm
- Dehnfugenschutzrohr zum Isolieren der Vor-/Rückläufe
- Dehnfugenschutzrohr geschlitzt für Rohr bis 20 mm im Bereich der Dehnfugen | ca. 300 mm lang | Hausmarke
- Estrichmessstellenmarkierung | Hausmarke
- Montageleistung Tacker-Systemrohr (nicht enthalten: Montage der Verteiler, Schränke, Klemmleisten, Stellantriebe, Raumthermostate
- Baustelleneinrichtung, Müllentsorgung, Bauleitung, Heizflächenauslegung und Abdrücken der Fußbodenheizung mit Luft sind im Preis enthalten`,
      Noppe: 'zurzeit nicht verfügbar',
      Klett: `...als Klettsystem liefern und montieren...
- Uponor Verbundrolle EPS DES WLG 040 30-2 mm
- Uponor ComfortPipe Plus PE-Xa 16x2 mm
- PE-Randdämmstreifen 10/150 | Comfort - selbstklebend | mit Folienlasche | 50 lfm | Hausmarke
- Klebeband extrem reißfest | 50 mm breit | Rolle = 66 m | Hausmarke
- Klemmverschraubung 16x2,0 mm 3/4” PEX- einzeln | Uponor
- Rohrverbinder (Kupplung m.Ringen) 16x16 mm | Uponor
- Winkelspangen, Kunststoff schwarz, Rohrführung zum Umlenken der
- Klettvlies zum Isolieren der Vor-/Rückläufe
- Dehnfugenschutzrohr geschlitzt für Rohr bis 20 mm im Bereich der Dehnfugen | ca. 300 mm lang | Hausmarke
- Estrichmessstellenmarkierung | Hausmarke
- Montageleistung Klett-Systemrohr (nicht enthalten: Montage der Verteiler, Schränke, Klemmleisten, Stellantriebe, Raumthermostate
- Baustelleneinrichtung, Müllentsorgung, Bauleitung, Heizflächenauslegung und Abdrücken der Fußbodenheizung mit Luft sind im Preis enthalten`
    },
    roth: {
      Tacker: `als Tackersystem liefern und montieren
- Roth System-Verbundfaltplatte (diverse Wärmeleitgruppen)
- Roth Heizrohr PERTEX S5 17 mm
- Tackernadeln für Heizrohr 14-17 mm | Hausmarke
- concept | Roth-Randdämmstreifen 10/160 | selbstklebend | 25 m / Rolle (4 Rollen /Sack)
- Klebeband extrem reißfest | 50 mm breit | Rolle = 66 m | Hausmarke
- Klemmverschraubung Universal 17 mm | Roth
- Kupplung PressCheck 17 mm
- Winkelspangen, Kunststoff schwarz, Rohrführung zum Umlenken der Heizrohre im Verteilerbereich, für Rohre 14-18 mm
- Dehnfugenschutzrohr zum Isolieren der Vor-/Rückläufe
- Dehnfugenschutzrohr geschlitzt für Rohr bis 20 mm im Bereich der Dehnfugen | ca. 300 mm lang | Hausmarke
- Estrichmessstellenmarkierung | Hausmarke
- Montageleistung Tacker-Systemrohr (nicht enthalten: Montage der Verteiler, Schränke, Klemmleisten, Stellantriebe, Raumthermostate
- Baustelleneinrichtung, Müllentsorgung, Bauleitung, Heizflächenauslegung und Abdrücken der Fußbodenheizung mit Luft sind im Preis enthalten`,
      Noppe: 'zurzeit nicht verfügbar',
      Klett: 'zurzeit nicht verfügbar'
    }
  };

  const brandTexts = texts[state.brand] || texts.handelsmarke;

  systemInfoTacker.textContent = brandTexts.Tacker;
  systemInfoNoppe.textContent = brandTexts.Noppe;
  systemInfoKlett.textContent = brandTexts.Klett;
  if (systemInfoKlett3mm) {
    systemInfoKlett3mm.textContent = `...als Klettsystem liefern und montieren...
- Klett-Panel 3 mm
- Klett-Heizrohr RT 17x2,0
- Estrichmessstellenmarkierung
- PE-Randdämmstreifen 10/150 | Comfort - selbstklebend | mit
- Klemmverschraubung 16/17x2,0 mm 3/4” PEX - einzeln
- Klebeband extrem reißfest | 50 mm breit | Rolle = 66 m
- Rohrverbinder (Kupplung mit Ringen)
- Winkelspangen für Heizrohre 14-18 mm | Farbe schwarz
- Dehnfugenschutzrohr geschlitzt für Rohr bis 20 mm im Bereich der Dehnfugen | ca. 300 mm lang
- Dehnfugenschutzrohr zum Isolieren der Vor-/Rückläufe
- nicht enthalten: Montage der Verteiler, Schränke, Klemmleisten, Stellantriebe, Raumthermostate
- Baustelleneinrichtung, Müllentsorgung, Bauleitung, Heizflächenauslegung und Abdrücken der Fußbodenheizung mit Luft sind im Preis enthalten`;
  }
}

function renderHeatSource() {
  document.querySelectorAll('#heatSourceChoices .choice-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.heatSource === state.heatSource);
    card.classList.remove('disabled-card');
  });

  summaryHeatSource.textContent = state.heatSource || 'Keine Auswahl';
}

function renderThermostat() {
  document.querySelectorAll('#thermostatChoices .choice-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.thermostat === state.thermostat);
  });
  document.getElementById('summaryThermostat').textContent = state.thermostat;
}

function renderThermostatToggle() {
  document.querySelectorAll('#thermostatToggleChoices .choice-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.thermostatToggle === state.thermostatEnabled);
  });

  const disabled = state.thermostatEnabled !== 'ja';
  setAssignmentBlockState(thermostatAssignmentBlock, !disabled);
  thermostatOptions.classList.toggle('disabled-block', disabled);

  if (disabled) {
    thermostatOptions.querySelectorAll('.choice-card').forEach((card) => {
      card.classList.remove('active');
    });
    document.getElementById('summaryThermostat').textContent =
      state.thermostatEnabled === 'nein' ? 'Kein Thermostat' : 'Keine Auswahl';
  } else {
    renderThermostat();
  }

  updateNextButtonAndStepHint();
}

function renderDistributionToggle() {
  document.querySelectorAll('#distributionToggleChoices .choice-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.distributionToggle === state.distributionEnabled);
  });

  const disabled = state.distributionEnabled !== 'ja';
  setAssignmentBlockState(distributionAssignmentBlock, !disabled);

  distributionOptions.classList.toggle('disabled-block', disabled);

  distributionOptions.querySelectorAll('input, select').forEach((el) => {
    el.disabled = disabled;
    if (disabled) {
      if (el.type === 'checkbox') el.checked = false;
      if (el.tagName === 'SELECT') el.selectedIndex = 0;
    }
  });

  if (state.distributionEnabled === 'nein') {
    summaryDistributionMode.textContent = 'Keine';
  }

  syncRegulationRules();
  updateNextButtonAndStepHint();
}

function renderExtraInsulationToggle() {
  document.querySelectorAll('#extraInsulationToggleChoices .choice-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.extraInsulationToggle === state.extraInsulationEnabled);
  });

  const disabled = state.extraInsulationEnabled !== 'ja';
  setAssignmentBlockState(extraInsulationAssignmentBlock, !disabled);
  extraInsulationOptions.classList.toggle('disabled-block', disabled);

  extraInsulationOptions.querySelectorAll('input').forEach((input) => {
    input.disabled = disabled;
    if (disabled) input.checked = false;
  });

  updateNextButtonAndStepHint();
}

function renderDistributionMode() {
  distributionManualFields.classList.remove('disabled-block');

  distributionTypeFields.forEach((field) => {
    field.disabled = state.distributionEnabled !== 'ja';
  });

  distributionQtyFields.forEach((field) => {
    field.disabled = state.distributionEnabled !== 'ja';
  });

  summaryDistributionMode.textContent =
    state.distributionEnabled === 'ja'
      ? 'Manuelle Eingabe'
      : 'Keine';
}

function getManualDistributionEntries() {
  const entries = [];

  distributionTypeFields.forEach((typeField, index) => {
    const qtyField = distributionQtyFields[index];
    const typeValue = typeField.value.trim();
    const qtyValue = qtyField.value.trim();

    if (typeValue && qtyValue && Number(qtyValue) > 0) {
      entries.push(`${typeValue} x ${qtyValue}`);
    }
  });

  return entries;
}

function getSelectedExtraInsulationRoom() {
  const floorIndex = Number(extraInsulationFloorSelect.value || 0);
  const roomIndex = Number(extraInsulationRoomSelect.value || 0);

  return state.floors[floorIndex]?.rooms[roomIndex] || null;
}

function hasAnyExtraInsulationAssignment() {
  return state.floors.some((floor) => {
    return floor.rooms.some((room) => {
      return roomIsHeated(room) && !!room.assignments?.extraInsulation;
    });
  });
}

function renderExtraInsulationFloorSelect() {
  if (!extraInsulationFloorSelect || !extraInsulationRoomSelect) return;

  extraInsulationFloorSelect.innerHTML = state.floors.map((floor, index) => {
    const label = getFloorLabel(floor, index);
    const heatedRooms = floor.rooms.filter(roomIsHeated);
    const assignedRooms = heatedRooms.filter(room => room.assignments?.extraInsulation).length;
    const check = heatedRooms.length > 0 && assignedRooms === heatedRooms.length ? ' ✅' : '';

    return `<option value="${index}">${label}${check}</option>`;
  }).join('');

  const extraSafeFloorIndex = Number(extraInsulationFloorSelect.value || 0) < state.floors.length
    ? Number(extraInsulationFloorSelect.value || 0)
    : 0;

  extraInsulationFloorSelect.value = String(extraSafeFloorIndex);

  renderExtraInsulationRoomSelect();
}

function renderExtraInsulationRoomSelect() {
  if (!extraInsulationFloorSelect || !extraInsulationRoomSelect) return;

  const floorIndex = Number(extraInsulationFloorSelect.value || 0);
  const floor = state.floors[floorIndex];

  if (!floor) return;

  extraInsulationRoomSelect.innerHTML = floor.rooms.map((room, index) => {
    const label = getRoomLabel(room, index);
    const functionText = room.function || 'ohne Funktion';
    const check = room.assignments?.extraInsulation ? ' ✅' : '';
    const disabledText = roomIsHeated(room) ? '' : ' (unbeheizt)';

    return `<option value="${index}">${label} / ${functionText}${disabledText}${check}</option>`;
  }).join('');

  extraInsulationRoomSelect.value = extraInsulationRoomSelect.value || '0';

  setExtraInsulationSelection(getSelectedExtraInsulationRoom()?.assignments?.extraInsulation || null);
  updateAssignExtraInsulationButton();
}

function clearExtraInsulationSelection() {
  document.querySelectorAll('input[name="extraInsulation"], input[name="extraInsulationWlg"], input[name="extraInsulationThickness"]').forEach((input) => {
    input.checked = false;
  });
}

function getCurrentExtraInsulationSelection() {
  const material = getCheckedValue('extraInsulation');
  const wlg = getCheckedValue('extraInsulationWlg');
  const thickness = getCheckedValue('extraInsulationThickness');

  if (!material || !wlg || !thickness) return null;

  return {
    material,
    wlg,
    thickness
  };
}

function setExtraInsulationSelection(selection) {
  clearExtraInsulationSelection();

  if (!selection) {
    updateAssignExtraInsulationButton();
    return;
  }

  if (selection.none) {
    updateAssignExtraInsulationButton();
    return;
  }

  const values = {
    extraInsulation: selection.material,
    extraInsulationWlg: selection.wlg,
    extraInsulationThickness: selection.thickness
  };

  Object.entries(values).forEach(([name, value]) => {
    const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (input) input.checked = true;
  });

  updateAssignExtraInsulationButton();
}

function updateAssignExtraInsulationButton() {
  if (!assignExtraInsulationBtn || !assignExtraInsulationNoneBtn) return;

  const room = getSelectedExtraInsulationRoom();

  const floorIndex =
    Number(extraInsulationFloorSelect?.value || 0);

  const floor = state.floors[floorIndex];

  if (state.extraInsulationEnabled !== 'ja') {
    assignExtraInsulationBtn.classList.add('hidden');
    assignExtraInsulationNoneBtn.classList.add('hidden');
    assignExtraInsulationToFloorBtn?.classList.add('hidden');
    return;
  }

  assignExtraInsulationBtn.classList.remove('hidden');
  assignExtraInsulationNoneBtn.classList.remove('hidden');
  assignExtraInsulationToFloorBtn?.classList.remove('hidden');

  if (!room || !roomIsHeated(room)) {
    assignExtraInsulationBtn.disabled = true;
    assignExtraInsulationNoneBtn.disabled = true;
    return;
  }

  const selection = getCurrentExtraInsulationSelection();

  assignExtraInsulationBtn.disabled = !selection;
  assignExtraInsulationNoneBtn.disabled = false;

  if (assignExtraInsulationToFloorBtn) {
    const heatedRooms = floor?.rooms?.filter(roomIsHeated) || [];

    assignExtraInsulationToFloorBtn.disabled =
      !selection || heatedRooms.length === 0;

    const floorAlreadyAssigned =
      heatedRooms.length > 0 &&
      heatedRooms.every(
        (floorRoom) =>
          floorRoom.assignments?.extraInsulation &&
          !floorRoom.assignments.extraInsulation.none
      );

    assignExtraInsulationToFloorBtn.textContent =
      floorAlreadyAssigned
        ? 'Zusatzdämmung der Etage aktualisieren'
        : 'Zusatzdämmung der Etage zuweisen';
  }

  assignExtraInsulationBtn.textContent = room.assignments?.extraInsulation && !room.assignments.extraInsulation.none
    ? 'Zusatzdämmung des Raumes aktualisieren'
    : 'Zusatzdämmung dem Raum zuweisen';

  if (room.assignments?.extraInsulation?.none) {
    assignExtraInsulationNoneBtn.textContent = 'Für diesen Raum nicht gewünscht.';
    assignExtraInsulationNoneBtn.classList.add('room-none-active');
  } else {
    assignExtraInsulationNoneBtn.textContent = 'Nicht für diesen Raum erforderlich';
    assignExtraInsulationNoneBtn.classList.remove('room-none-active');
  }
}

async function assignExtraInsulationToRoom() {
  const room = getSelectedExtraInsulationRoom();

  if (!room) return;

  if (!roomIsHeated(room)) {
    await showAppModal({
      title: 'Hinweis',
      message: 'Dieser Raum ist unbeheizt und benötigt keine Zusatzdämmung-Zuweisung.',
      confirmText: 'OK'
    });
    return;
  }

  const selection = getCurrentExtraInsulationSelection();

  if (!selection) {
    await showAppModal({
      title: 'Auswahl unvollständig',
      message: 'Bitte wählen Sie Material, Wärmeleitgruppe und Dicke der Zusatzdämmung aus.',
      confirmText: 'OK'
    });
    return;
  }

  room.assignments.extraInsulation = selection;

  const hint = getAllAssignmentsDoneText('extraInsulation');

  await showAppModal({
    title: 'Gespeichert',
    message: `Die Zusatzdämmung wurde dem Raum "${getRoomLabel(room, Number(extraInsulationRoomSelect.value))}" zugewiesen.${hint ? '\n\n' + hint : ''}`,
    confirmText: 'OK'
  });

  renderExtraInsulationFloorSelect();
  updateAssignmentPointers();
  scrollAfterAssignment('extraInsulation');
  updateAssignExtraInsulationButton();
  updateSummary();
}

async function assignExtraInsulationToFloor() {
  const floorIndex =
    Number(extraInsulationFloorSelect.value || 0);

  const floor = state.floors[floorIndex];

  if (!floor) return;

  const selection = getCurrentExtraInsulationSelection();

  if (!selection) {
    await showAppModal({
      title: 'Auswahl unvollständig',
      message:
        'Bitte wählen Sie Material, Wärmeleitgruppe und Dicke der Zusatzdämmung aus.',
      confirmText: 'OK'
    });

    return;
  }

  const heatedRooms = floor.rooms.filter(roomIsHeated);

  if (heatedRooms.length === 0) {
    await showAppModal({
      title: 'Hinweis',
      message:
        'Diese Etage enthält keine beheizten Räume.',
      confirmText: 'OK'
    });

    return;
  }

  const confirmed = await showAppModal({
    title: 'Zusatzdämmung der Etage zuweisen?',
    message:
      `Möchten Sie die aktuell ausgewählte Zusatzdämmung wirklich allen beheizten Räumen der Etage "${getFloorLabel(floor, floorIndex)}" zuweisen? Bereits vorhandene Zuweisungen werden überschrieben.`,
    confirmText: 'Ja',
    cancelText: 'Abbrechen'
  });

  if (!confirmed) return;

  heatedRooms.forEach((room) => {
    room.assignments = room.assignments || {};

    room.assignments.extraInsulation =
      structuredClone(selection);
  });

  await showAppModal({
    title: 'Gespeichert',
    message:
      `Die Zusatzdämmung wurde allen beheizten Räumen der Etage "${getFloorLabel(floor, floorIndex)}" zugewiesen.`,
    confirmText: 'OK'
  });

  renderExtraInsulationFloorSelect();
  updateAssignmentPointers();
  updateAssignExtraInsulationButton();
  updateSummary();
}

async function assignExtraInsulationNoneToRoom() {
  const room = getSelectedExtraInsulationRoom();
  if (!room) return;

  const wasAlreadySet = room.assignments?.extraInsulation?.none === true;

  if (wasAlreadySet) {
    room.assignments.extraInsulation = null;

    await showAppModal({
      title: 'Zurückgenommen',
      message: `Die Auswahl "Für diesen Raum nicht gewünscht" wurde für den Raum "${getRoomLabel(room, Number(extraInsulationRoomSelect.value))}" zurückgenommen.`,
      confirmText: 'OK'
    });
  } else {
    room.assignments.extraInsulation = { none: true };
    clearExtraInsulationSelection();

    const hint = getAllAssignmentsDoneText('extraInsulation');

    await showAppModal({
      title: 'Gespeichert',
      message: `Für den Raum "${getRoomLabel(room, Number(extraInsulationRoomSelect.value))}" wurde keine Zusatzdämmung hinterlegt.${hint ? '\n\n' + hint : ''}`,
      confirmText: 'OK'
    });
  }

  renderExtraInsulationFloorSelect();
  updateAssignmentPointers();
  updateAssignExtraInsulationButton();
  updateSummary();
}

function getRegulationEntries() {
  const entries = [];

  regulationCheckboxes.forEach((checkbox, index) => {
    const qtyField = regulationQtyFields[index];
    const qtyValue = qtyField.value.trim();

    if (checkbox.checked) {
      const qtyText = qtyValue && Number(qtyValue) > 0 ? ` x ${qtyValue}` : '';
      entries.push(`${checkbox.dataset.label}${qtyText}`);
    }
  });

  return entries;
}

function syncRegulationRules() {
  const voltage = getCheckedValue('regulationVoltage');
  const voltageSelected = !!voltage;

  if (regulationOptionsBlock) {
    regulationOptionsBlock.classList.toggle('disabled-block', !voltageSelected);
  }

  regulationCheckboxes.forEach((checkbox, index) => {
    const qtyField = regulationQtyFields[index];
    const row = checkbox.closest('.regulation-row');
    const itemName = checkbox.dataset.label;

    let allowed = voltageSelected;

    if (itemName === 'Regelklemmleiste bis zu 10 Zonen' && voltage !== '230V AC') {
      allowed = false;
    }

    checkbox.disabled = !allowed;

    if (!allowed) {
      checkbox.checked = false;
    }

    if (qtyField) {
      qtyField.disabled = !allowed || !checkbox.checked;

      if (!allowed || !checkbox.checked) {
        qtyField.value = '';
      }
    }

    row?.classList.toggle('disabled-option', !allowed);
  });
}

function getEstrichRangeEntries() {
  return Array.from(estrichRangeCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function getEstrichAdditiveEntries() {
  return Array.from(estrichAdditiveCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function getDryConstructionEntries() {
  return Array.from(dryConstructionCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

function sanierungHasAnySystemSelection() {
  const hasKlett3mm = getSystemValue() === 'Klett 3mm';
  const hasMilling = Array.from(millingSystemCheckboxes).some(cb => cb.checked);
  const hasEstrich = getEstrichRangeEntries().length > 0 || getEstrichAdditiveEntries().length > 0;
  const hasDryConstruction = getDryConstructionEntries().length > 0;

  return hasKlett3mm || hasMilling || hasEstrich || hasDryConstruction;
}

function syncSanierungSystemRules() {
  if (state.projectType !== 'sanierung') {
    millingBlock.classList.remove('disabled-block');
    dryConstructionBlock.classList.remove('disabled-block');

    document.querySelectorAll('#systemSanierungBlock input, #millingBlock input, #dryConstructionBlock input')
      .forEach(input => input.disabled = false);

    return;
  }

  const hasKlett3mm = getSystemValue() === 'Klett 3mm';
  const hasMilling = Array.from(millingSystemCheckboxes).some(cb => cb.checked);
  const hasDryConstruction = getDryConstructionEntries().length > 0;

  const klettInput = document.querySelector('#systemSanierungBlock input[name="system"][value="Klett 3mm"]');
  const klettLabel = klettInput?.closest('.radio-option');

  const disableKlett = hasMilling || hasDryConstruction;
  const disableMilling = hasKlett3mm || hasDryConstruction;
  const disableDryConstruction = hasKlett3mm || hasMilling;

  if (klettInput) {
    klettInput.disabled = disableKlett;

    if (disableKlett) {
      klettInput.checked = false;
    }

    klettLabel?.classList.toggle('disabled-radio-option', disableKlett);
  }

  millingBlock.classList.toggle('disabled-block', disableMilling);
  millingBlock.querySelectorAll('input').forEach((input) => {
    input.disabled = disableMilling;

    if (disableMilling) {
      input.checked = false;
    }
  });

  dryConstructionBlock.classList.toggle('disabled-block', disableDryConstruction);
  dryConstructionBlock.querySelectorAll('input').forEach((input) => {
    input.disabled = disableDryConstruction;

    if (disableDryConstruction) {
      input.checked = false;
    }
  });
}

function syncEstrichAdditivesRules() {
  const additiveCheckboxes = Array.from(estrichAdditiveCheckboxes);

  const exclusiveCheckboxes = additiveCheckboxes.slice(1);
  const selectedExclusive = exclusiveCheckboxes.find((checkbox) => checkbox.checked);

  exclusiveCheckboxes.forEach((checkbox) => {
    if (selectedExclusive && checkbox !== selectedExclusive) {
      checkbox.disabled = true;
      checkbox.closest('.check-option')?.classList.add('disabled-option');
    } else {
      checkbox.disabled = false;
      checkbox.closest('.check-option')?.classList.remove('disabled-option');
    }
  });
}

function syncEstrichRangeRules() {
  const rangeCheckboxes = Array.from(estrichRangeCheckboxes);
  const selected = rangeCheckboxes.find((checkbox) => checkbox.checked);

  rangeCheckboxes.forEach((checkbox) => {
    if (selected && checkbox !== selected) {
      checkbox.disabled = true;
      checkbox.closest('.check-option')?.classList.add('disabled-option');
    } else {
      checkbox.disabled = false;
      checkbox.closest('.check-option')?.classList.remove('disabled-option');
    }
  });
}

function applyRoomSpacingRules(room, spacingSelect) {
  if (!room || !spacingSelect) return;

  const optionVa100 = spacingSelect.querySelector(
    'option[value="VA 100"]'
  );

  const optionVa150 = spacingSelect.querySelector(
    'option[value="VA 150"]'
  );

  const optionVa200 = spacingSelect.querySelector(
    'option[value="VA 200"]'
  );

  // Zunächst Grundzustand herstellen.
  [optionVa100, optionVa150, optionVa200].forEach((option) => {
    if (!option) return;

    option.disabled = false;
    option.classList.remove('spacing-option-muted');
    option.removeAttribute('title');
  });

  const isBathroom = room.function === 'Bad';
  const isHeatPump = state.heatSource === 'Wärmepumpe';

  /*
   * Bad:
   * VA 100 wird empfohlen und automatisch vorbelegt.
   * VA 150 und VA 200 bleiben auswählbar,
   * werden aber optisch als abweichende Auswahl dargestellt.
   */
  if (isBathroom) {
    optionVa150?.classList.add('spacing-option-muted');
    optionVa200?.classList.add('spacing-option-muted');

    if (optionVa150) {
      optionVa150.title =
        'Für Bäder wird grundsätzlich VA 100 empfohlen.';
    }

    if (optionVa200) {
      optionVa200.title =
        'Für Bäder wird grundsätzlich VA 100 empfohlen.';
    }
  }

  /*
   * Wärmepumpe:
   * VA 200 darf nicht ausgewählt werden.
   */
  if (isHeatPump && optionVa200) {
    optionVa200.disabled = true;
    optionVa200.title =
      'VA 200 ist bei einer Wärmepumpe nicht verfügbar.';

    if (room.spacing === 'VA 200') {
      room.spacing = isBathroom ? 'VA 100' : 'VA 150';
    }
  }

  spacingSelect.value = room.spacing || 'VA 150';
}

async function showUnheatedRoomAreaWarning(room) {
  if (!room) return;

  const area = Number(
    String(room.area || '').replace(',', '.')
  );

  const shouldWarn =
    room.function === 'unbeheizter Raum' &&
    Number.isFinite(area) &&
    area >= 6;

  if (!shouldWarn) return;

  await showAppModal({
    title: 'Achtung',
    message:
      'Räume ab 6 m² müssen beheizt ausgeführt werden.',
    confirmText: 'Bestätigen'
  });
}

function renderFloors() {
  floorsContainer.innerHTML = '';

  state.floors.forEach((floor, floorIndex) => {
    const floorNode = floorTemplate.content.firstElementChild.cloneNode(true);
    floorNode.querySelector('.floor-title').textContent = `Etage ${floorIndex + 1}`;

    const floorNameInput = floorNode.querySelector('.floor-name');
    const addRoomBtn = floorNode.querySelector('.add-room-btn');
    const removeFloorBtn = floorNode.querySelector('.remove-floor-btn');
    const roomsContainer = floorNode.querySelector('.rooms-container');

    floorNameInput.outerHTML = `
  <select class="floor-name">
    <option value="Kellergeschoss">Kellergeschoss</option>
    <option value="Erdgeschoss">Erdgeschoss</option>
    <option value="Obergeschoss 1">Obergeschoss 1</option>
    <option value="Obergeschoss 2">Obergeschoss 2</option>
    <option value="Obergeschoss 3">Obergeschoss 3</option>
    <option value="Obergeschoss 4">Obergeschoss 4</option>
    <option value="Dachgeschoss">Dachgeschoss</option>
  </select>
`;

    const floorNameSelect = floorNode.querySelector('.floor-name');
    floorNameSelect.value = floor.name || 'Erdgeschoss';

    floorNameSelect.addEventListener('change', (e) => {
      state.floors[floorIndex].name = e.target.value;
      syncMillingSystemRules();
      updateSummary();
    });

    addRoomBtn.addEventListener('click', () => {
      state.floors[floorIndex].rooms.push(createRoom());
      renderFloors();
      updateSummary();

      const floorCards = document.querySelectorAll('.floor-card');
      const currentFloorCard = floorCards[floorIndex];
      const roomCards = currentFloorCard?.querySelectorAll('.room-card');
      const newRoomCard = roomCards?.[roomCards.length - 1];

      scrollToElement(newRoomCard);
    });

    floor.rooms.forEach((room, roomIndex) => {
      const roomNode = roomTemplate.content.firstElementChild.cloneNode(true);
      roomNode.querySelector('.room-title').textContent = `Raum ${roomIndex + 1}`;

      const roomNameInput = roomNode.querySelector('.room-name');
      const roomFunctionSelect = roomNode.querySelector('.room-function');
      const roomTemperatureInput = roomNode.querySelector('.room-temperature');
      const roomSpacingSelect = roomNode.querySelector('.room-spacing');
      const roomAreaInput = roomNode.querySelector('.room-area');
      const roomEstrichSelect = roomNode.querySelector('.room-estrich');
      const removeRoomBtn = roomNode.querySelector('.remove-room-btn');
      const roomFloorCoveringSelect = roomNode.querySelector('.room-floor-covering');
      const roomDoorEnabledSelect = roomNode.querySelector('.room-door-enabled');
      const roomDoorSideSelect = roomNode.querySelector('.room-door-side');
      const roomDoorPositionInput = roomNode.querySelector('.room-door-position');
      const roomDoorWidthInput = roomNode.querySelector('.room-door-width');

      roomNameInput.value = room.name;
      roomFunctionSelect.value = room.function;
      roomSpacingSelect.value = room.spacing;
      applyRoomSpacingRules(room, roomSpacingSelect);
      roomTemperatureInput.value =
        Number(room.temperature) ||
        (room.function === 'Bad' ? 24 : 20);
      roomAreaInput.value = room.area;
      roomEstrichSelect.value = room.estrich || 'ja';
      roomFloorCoveringSelect.value = room.floorCovering || 'Fliesen';
      room.floorplan = room.floorplan || {
        x: null,
        y: null,
        width: null,
        height: null,
        doorEnabled: false,
        doorSide: 'bottom',
        doorPosition: 50,
        doorWidth: 90
      };

      roomDoorEnabledSelect.value = room.floorplan.doorEnabled ? 'ja' : 'nein';
      roomDoorSideSelect.value = room.floorplan.doorSide || 'bottom';
      roomDoorPositionInput.value = room.floorplan.doorPosition || 50;
      roomDoorWidthInput.value = room.floorplan.doorWidth || 90;

      roomNameInput.addEventListener('input', (e) => {
        state.floors[floorIndex].rooms[roomIndex].name = e.target.value;
        updateSummary();
      });

      roomTemperatureInput.addEventListener('input', (e) => {
        const value = Number(e.target.value);

        state.floors[floorIndex].rooms[roomIndex].temperature =
          Number.isFinite(value) ? value : 20;

        renderTechnicalRecommendation();
        updateSummary();
      });

      roomFunctionSelect.addEventListener('change', async (e) => {
        const currentRoom =
          state.floors[floorIndex].rooms[roomIndex];

        const previousFunction = currentRoom.function;
        currentRoom.function = e.target.value;

        /*
         * Temperatur automatisch vorbelegen.
         * Eine später manuell eingegebene Temperatur kann
         * weiterhin verändert werden.
         */
        if (currentRoom.function === 'Bad') {
          currentRoom.temperature = 24;
          currentRoom.spacing = 'VA 100';
        } else if (currentRoom.function === 'Wohnraum') {
          currentRoom.temperature = 20;

          if (
            currentRoom.spacing === 'VA 200' &&
            state.heatSource === 'Wärmepumpe'
          ) {
            currentRoom.spacing = 'VA 150';
          }
        } else if (
          previousFunction === 'Bad' &&
          currentRoom.function === 'unbeheizter Raum'
        ) {
          currentRoom.temperature = 20;
        }

        roomTemperatureInput.value = currentRoom.temperature;
        applyRoomSpacingRules(currentRoom, roomSpacingSelect);

        await showUnheatedRoomAreaWarning(currentRoom);

        renderTechnicalRecommendation();
        updateSummary();
        updateNextButtonAndStepHint();
      });

      roomSpacingSelect.addEventListener('change', (e) => {
        const currentRoom =
          state.floors[floorIndex].rooms[roomIndex];

        currentRoom.spacing = e.target.value;

        renderTechnicalRecommendation();
        updateSummary();
      });

      roomFloorCoveringSelect.addEventListener('change', (e) => {
        state.floors[floorIndex].rooms[roomIndex].floorCovering = e.target.value;
        renderTechnicalRecommendation();
        updateSummary();
      });

      roomAreaInput.addEventListener('input', (e) => {
        state.floors[floorIndex].rooms[roomIndex].area =
          e.target.value;

        renderTechnicalRecommendation();
        updateSummary();
      });

      roomAreaInput.addEventListener('change', async () => {
        const currentRoom =
          state.floors[floorIndex].rooms[roomIndex];

        await showUnheatedRoomAreaWarning(currentRoom);
      });

      roomDoorEnabledSelect.addEventListener('change', (e) => {
        state.floors[floorIndex].rooms[roomIndex].floorplan.doorEnabled = e.target.value === 'ja';
        updateSummary();
      });

      roomDoorSideSelect.addEventListener('change', (e) => {
        state.floors[floorIndex].rooms[roomIndex].floorplan.doorSide = e.target.value;
        updateSummary();
      });

      roomDoorPositionInput.addEventListener('input', (e) => {
        state.floors[floorIndex].rooms[roomIndex].floorplan.doorPosition = Number(e.target.value) || 50;
        updateSummary();
      });

      roomDoorWidthInput.addEventListener('input', (e) => {
        state.floors[floorIndex].rooms[roomIndex].floorplan.doorWidth = Number(e.target.value) || 90;
        updateSummary();
      });

      roomEstrichSelect.addEventListener('change', (e) => {
        const currentRoom = state.floors[floorIndex].rooms[roomIndex];
        currentRoom.estrich = e.target.value;

        if (currentRoom.estrich === 'nein' && currentRoom.assignments?.system) {
          currentRoom.assignments.system.estrichRange = [];
          currentRoom.assignments.system.estrichAdditives = [];
        }

        syncEstrichRangeByArea();
        updateSummary();
      });

      removeRoomBtn.disabled = false;
      removeRoomBtn.classList.remove('disabled-button');

      removeRoomBtn.addEventListener('click', () => {
        state.floors[floorIndex].rooms.splice(roomIndex, 1);
        renderFloors();
        renderTechnicalRecommendation();
        updateSummary();
        updateNextButtonAndStepHint();
      });

      roomsContainer.appendChild(roomNode);
    });

    floorsContainer.appendChild(floorNode);
  });
}

function syncMillingSystemRules() {
  const millingCheckbox = Array.from(millingSystemCheckboxes)
    .find(cb => cb.value === 'Fräsen');

  const isMillingSelected = millingCheckbox && millingCheckbox.checked;

  // Fräsen → Baustelleneinrichtung Pflicht
  if (millingSetupCheckbox) {
    if (isMillingSelected) {
      millingSetupCheckbox.checked = true;
      millingSetupCheckbox.disabled = true;
    } else {
      millingSetupCheckbox.checked = false;
      millingSetupCheckbox.disabled = false;
    }
  }

  // Fräsen + beheizte Fläche außerhalb Erdgeschoss → Etagenzuschuss Pflicht
  if (floorSurchargeCheckbox) {
    if (isMillingSelected && hasNonGroundFloorWithHeatedRooms()) {
      floorSurchargeCheckbox.checked = true;
      floorSurchargeCheckbox.disabled = true;
    } else {
      floorSurchargeCheckbox.checked = false;
      floorSurchargeCheckbox.disabled = false;
    }
  }
}

function updateLayerPreview() {
  const extraInsulationText =
    state.extraInsulationEnabled === 'nein'
      ? 'keine'
      : getCheckedValue('extraInsulationThickness');

  const layers = [
    ['B: Systemdämmung', getCheckedValue('insulationThickness')],
    ['C: Zusatzdämmung', extraInsulationText]
  ];

  document.getElementById('layerList').innerHTML = layers
    .map(([label, value]) => `<div class="layer-item"><span>${label}</span><strong>${value}</strong></div>`)
    .join('');
}

function parseSpacingMm(spacing) {
  const match = String(spacing || '').match(/\d+/);
  return match ? Number(match[0]) : 150;
}

function getRoomPipeLength(room) {
  const area = getHeatedAreaForRoom(room);
  const pipeLengthPerM2 = getPipeLengthPerM2(room.spacing);

  return area * pipeLengthPerM2;
}

function getRoomHeatingCircuits(room) {
  const pipeLength = getRoomPipeLength(room);

  const maxCircuitLength =
    Number(state.recommendation?.maxCircuitLength) ||
    TECHNICAL_DEFAULTS.maxCircuitLength ||
    100;

  if (pipeLength <= 0) return 0;

  return Math.max(1, Math.ceil(pipeLength / maxCircuitLength));
}

function getRoomThermostatRecommendation(room) {
  const circuits = getRoomHeatingCircuits(room);

  if (circuits <= 0) return 0;

  return Math.max(1, Math.ceil(circuits / 6));
}

function formatAssignmentText(value) {
  if (!value) return 'Noch nicht zugewiesen';
  if (value.none) return 'Nicht erforderlich';

  return '';
}

function getSystemSummaryText(room) {
  const system = room.assignments?.system;

  if (!system) return 'Noch nicht zugewiesen';

  const parts = [];

  if (system.system) parts.push(system.system);
  if (system.systemAddon) parts.push(system.systemAddon);
  if (system.wlg) parts.push(`WLG ${system.wlg}`);
  if (system.insulationThickness) parts.push(system.insulationThickness);
  if (system.pipeType) parts.push(system.pipeType);

  if (system.milling?.length) parts.push(`Fräsen: ${system.milling.join(', ')}`);
  if (system.estrichRange?.length) parts.push(`Estrich: ${system.estrichRange.join(', ')}`);
  if (system.estrichAdditives?.length) parts.push(`Zusatzmittel: ${system.estrichAdditives.join(', ')}`);
  if (system.dryConstruction?.length) parts.push(`Trockenbau: ${system.dryConstruction.join(', ')}`);

  return parts.length ? parts.join(' / ') : 'Noch nicht zugewiesen';
}

function getThermostatSummaryText(room) {
  const thermostat = room.assignments?.thermostat;

  if (!thermostat) return 'Noch nicht zugewiesen';
  if (thermostat.none) return 'Nicht erforderlich';

  return `${thermostat.type} x ${thermostat.quantity}`;
}

function getDistributionSummaryText(room) {
  const distribution = room.assignments?.distribution;

  if (!distribution) return 'Noch nicht zugewiesen';
  if (distribution.none) return 'Nicht erforderlich';

  const parts = [];

  if (distribution.cabinetMounting) {
    parts.push(distribution.cabinetMounting);
  }

  if (distribution.distributionRows?.length) {
    parts.push(
      distribution.distributionRows
        .map(row => `${row.type} x ${row.quantity}`)
        .join(', ')
    );
  }

  if (distribution.regulationVoltage) {
    parts.push(distribution.regulationVoltage);
  }

  if (distribution.regulationRows?.length) {
    parts.push(
      distribution.regulationRows
        .map(row => `${row.label} x ${row.quantity}`)
        .join(', ')
    );
  }

  return parts.length ? parts.join(' / ') : 'Noch nicht zugewiesen';
}

function getExtraInsulationSummaryText(room) {
  const extra = room.assignments?.extraInsulation;

  if (!extra) return 'Noch nicht zugewiesen';
  if (extra.none) return 'Nicht erforderlich';

  return `${extra.material} / WLG ${extra.wlg} / ${extra.thickness}`;
}

function renderRoomSummaryCards() {
  if (!state.floors.length) {
    summaryRooms.innerHTML = 'Noch keine Räume angelegt.';
    return;
  }

  if (state.activeSummaryFloorIndex >= state.floors.length) {
    state.activeSummaryFloorIndex = 0;
  }

  const activeFloor = state.floors[state.activeSummaryFloorIndex];

  if (!activeFloor || !activeFloor.rooms || activeFloor.rooms.length === 0) {
    const tabsHtml = `
    <div class="summary-floor-tabs">
      ${state.floors.map((floor, index) => {
      const floorLabel = getFloorLabel(floor, index);
      const activeClass = index === state.activeSummaryFloorIndex ? 'active' : '';

      return `
          <button type="button" class="summary-floor-tab ${activeClass}" data-summary-floor-index="${index}">
            ${floorLabel}
          </button>
        `;
    }).join('')}
    </div>
  `;

    summaryRooms.innerHTML = `
    ${tabsHtml}
    <div class="summary-floor-card">
      <div class="summary-floor-title">${getFloorLabel(activeFloor, state.activeSummaryFloorIndex)}</div>
      <div class="muted">In dieser Etage sind noch keine Räume angelegt.</div>
    </div>
  `;

    document.querySelectorAll('.summary-floor-tab').forEach((button) => {
      button.addEventListener('click', () => {
        state.activeSummaryFloorIndex = Number(button.dataset.summaryFloorIndex);
        state.activeSummaryRoomIndex = 0;
        renderRoomSummaryCards();
      });
    });

    return;
  }

  if (state.activeSummaryRoomIndex >= activeFloor.rooms.length) {
    state.activeSummaryRoomIndex = 0;
  }

  const tabsHtml = `
    <div class="summary-floor-tabs">
      ${state.floors.map((floor, index) => {
    const floorLabel = getFloorLabel(floor, index);
    const activeClass = index === state.activeSummaryFloorIndex ? 'active' : '';

    return `
          <button type="button" class="summary-floor-tab ${activeClass}" data-summary-floor-index="${index}">
            ${floorLabel}
          </button>
        `;
  }).join('')}
    </div>
  `;

  const roomTabsHtml = `
    <div class="summary-room-tabs">
      ${activeFloor.rooms.map((room, index) => {
    const roomLabel = getRoomLabel(room, index);
    const activeClass = index === state.activeSummaryRoomIndex ? 'active' : '';

    return `
          <button type="button" class="summary-room-tab ${activeClass}" data-summary-room-index="${index}">
            ${roomLabel}
          </button>
        `;
  }).join('')}
    </div>
  `;

  const room = activeFloor.rooms[state.activeSummaryRoomIndex];
  const roomLabel = getRoomLabel(room, state.activeSummaryRoomIndex);
  const floorLabel = getFloorLabel(activeFloor, state.activeSummaryFloorIndex);
  const area = Number(String(room.area).replace(',', '.')) || 0;
  const pipeLength = getRoomPipeLength(room);
  const circuits = getRoomHeatingCircuits(room);
  const thermostatReco = getRoomThermostatRecommendation(room);

  summaryRooms.innerHTML = `
    ${tabsHtml}

    <div class="summary-floor-card">
      <div class="summary-floor-title">${floorLabel}</div>

      ${roomTabsHtml}

      <div class="summary-room-card active-room-card">
        <div class="summary-room-title">${roomLabel}</div>

        <div class="summary-room-line">
  <span>Funktion</span>
  <strong>${room.function || '-'}</strong>
</div>

<div class="summary-room-line">
  <span>Raumtemperatur</span>
  <strong>${formatQuantity(Number(room.temperature) || 20)} °C</strong>
</div>

<div class="summary-room-line">
  <span>VA</span>
  <strong>${room.spacing || '-'}</strong>
</div>

<div class="summary-room-line">
  <span>Fläche</span>
  <strong>${formatQuantity(area)} m²</strong>
</div>

        <div class="summary-room-calc">
  <div class="summary-room-section-title">Empfohlen:</div>
  <div class="summary-room-line"><span>Rohrlänge</span><strong>${formatQuantity(pipeLength)} m</strong></div>
  <div class="summary-room-line"><span>Heizkreise</span><strong>${circuits}</strong></div>
  <div class="summary-room-line"><span>Raumtherm.</span><strong>${thermostatReco}</strong></div>
</div>

        <div class="summary-room-calc">
          <div class="summary-room-line"><span>System</span><strong>${getSystemSummaryText(room)}</strong></div>
          <div class="summary-room-line"><span>Thermostat</span><strong>${getThermostatSummaryText(room)}</strong></div>
          <div class="summary-room-line"><span>Verteiler</span><strong>${getDistributionSummaryText(room)}</strong></div>
          <div class="summary-room-line"><span>Zusatzdämm.</span><strong>${getExtraInsulationSummaryText(room)}</strong></div>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.summary-floor-tab').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeSummaryFloorIndex = Number(button.dataset.summaryFloorIndex);
      state.activeSummaryRoomIndex = 0;
      renderRoomSummaryCards();
    });
  });

  document.querySelectorAll('.summary-room-tab').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeSummaryRoomIndex = Number(button.dataset.summaryRoomIndex);
      renderRoomSummaryCards();
    });
  });
}

function updateSummary() {
  const enteredPlz = document.getElementById('plz').value.trim();
  const normalizedPlz = enteredPlz ? normalizePlz(enteredPlz) : '';
  const distanceEntry = normalizedPlz ? getDistanceEntryForPlz(normalizedPlz) : null;
  const manualKm = getManualDistanceKm();

  let distanceText = '';

  if (summaryProjectReference) {
    summaryProjectReference.textContent = state.projectReference || 'Keine Angabe';
  }

  if (normalizedPlz) {
    summaryPlz.innerHTML = `
    <div>PLZ: ${normalizedPlz}</div>
    ${distanceEntry
        ? `<div>Entfernung: ${formatQuantity(distanceEntry.km)} km</div>`
        : manualKm > 0
          ? `<div>Entfernung manuell: ${formatQuantity(manualKm)} km</div>`
          : ''
      }
  `;
  } else if (manualKm > 0) {
    summaryPlz.innerHTML = `
    <div>PLZ: Keine Angabe</div>
    <div>Manuelle km: ${formatQuantity(manualKm)} km</div>
  `;
  } else {
    summaryPlz.textContent = 'Keine Angabe';
  }

  document.getElementById('summaryWlg').textContent = wlgBlock.classList.contains('hidden') ? '-' : (getCheckedValue('wlg') || 'Keine Auswahl');
  document.getElementById('summaryInsulationThickness').textContent = insulationThicknessBlock.classList.contains('hidden') ? '-' : (getCheckedValue('insulationThickness') || 'Keine Auswahl');
  document.getElementById('summaryPipeType').textContent = pipeTypeBlock.classList.contains('hidden') ? '-' : (getCheckedValue('pipeType') || 'Keine Auswahl');
  document.getElementById('summaryPipeSize').textContent = pipeSizeBlock.classList.contains('hidden') ? '-' : (getCheckedValue('pipeSize') || 'Keine Auswahl');

  summaryCabinetMounting.textContent = getCheckedValue('cabinetMounting') || 'Keine Auswahl';
  summaryDistributionMode.textContent =
    state.distributionMode === 'auto'
      ? 'Automatische Ermittlung'
      : state.distributionMode === 'manual'
        ? 'Manuelle Eingabe'
        : 'Keine Auswahl';

  summaryRegulationVoltage.textContent = getCheckedValue('regulationVoltage') || 'Keine Auswahl';

  const manualDistributionEntries = getManualDistributionEntries();
  summaryDistributionItems.textContent =
    state.distributionMode === 'auto'
      ? 'Verteiler werden automatisch ermittelt.'
      : (manualDistributionEntries.length
        ? manualDistributionEntries.join(', ')
        : 'Keine manuelle Verteilerauswahl erfasst.');

  const regulationEntries = getRegulationEntries();
  summaryRegulationItems.textContent =
    regulationEntries.length
      ? regulationEntries.join(', ')
      : 'Keine Regeltechnik ausgewählt.';
  document.getElementById('summaryExtraInsulation').textContent = getCheckedValue('extraInsulation');
  document.getElementById('summaryExtraInsulationWlg').textContent = getCheckedValue('extraInsulationWlg');
  document.getElementById('summaryExtraInsulationThickness').textContent = getCheckedValue('extraInsulationThickness');

  const estrichRangeEntries = getEstrichRangeEntries();
  summaryEstrichRange.textContent =
    estrichRangeEntries.length
      ? `Estrich: ${estrichRangeEntries.join(', ')}`
      : 'Kein Estrich gewählt.';

  const estrichAdditiveEntries = getEstrichAdditiveEntries();
  summaryEstrichAdditives.textContent =
    estrichAdditiveEntries.length
      ? `Zusatzmittel: ${estrichAdditiveEntries.join(', ')}`
      : 'Keine Zusatzmittel gewählt.';

  const dryConstructionEntries = getDryConstructionEntries();
  summaryDryConstruction.textContent =
    dryConstructionEntries.length
      ? `Trockenbau: ${dryConstructionEntries.join(', ')}`
      : 'Kein Trockenbau gewählt.';

  if (state.extraInsulationEnabled === 'nein') {
    document.getElementById('summaryExtraInsulation').textContent = 'Keine';
    document.getElementById('summaryExtraInsulationWlg').textContent = '-';
    document.getElementById('summaryExtraInsulationThickness').textContent = '-';
  } else {
    document.getElementById('summaryExtraInsulation').textContent = getCheckedValue('extraInsulation') || 'Keine Auswahl';
    document.getElementById('summaryExtraInsulationWlg').textContent = getCheckedValue('extraInsulationWlg') || 'Keine Auswahl';
    document.getElementById('summaryExtraInsulationThickness').textContent = getCheckedValue('extraInsulationThickness') || 'Keine Auswahl';
  }

  syncEstrichRangeByArea();
  syncEstrichAdditivesRules();
  syncMillingSystemRules();
  syncSanierungSystemRules();
  syncRegulationRules();
  updateAssignFloorSystemButton();
  syncSystemInsulationRules();

  renderRoomSummaryCards();

  state.services = Array.from(serviceCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  updateLayerPreview();
  updateFinalCheck();
  updateNextButtonAndStepHint();
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ';' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseGermanNumber(value) {
  if (!value) return 0;

  return Number(
    String(value)
      .replace(/\./g, '')
      .replace(',', '.')
      .replace(/[^\d.-]/g, '')
  ) || 0;
}

function normalizePlz(value) {
  return String(value || '')
    .trim()
    .replace(/\D/g, '')
    .padStart(5, '0');
}

function formatEuro(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(value || 0);
}

function formatQuantity(value) {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value || 0);
}

function getUnitFromPriceUnit(priceUnit) {
  if (!priceUnit) return '';
  return String(priceUnit).replace('€/', '').replace('EUR/', '').trim();
}

async function loadArticleCatalog() {
  const response = await fetch('master.csv');

  if (!response.ok) {
    throw new Error('master.csv konnte nicht geladen werden.');
  }

  const buffer = await response.arrayBuffer();
  const csvText = new TextDecoder('windows-1252').decode(buffer);

  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const headers = parseCsvLine(lines[0]).map(header => header.toLowerCase());

  state.articleCatalog = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    return {
      articleNumber: row.artikelnummer,
      description: row.artikelbezeichnung,
      unitPrice: parseGermanNumber(row.preis),
      priceUnit: row.einheit,
      unit: getUnitFromPriceUnit(row.einheit),
      category: row.kategorie,
      brand: row.marke
    };
  });
}

async function loadPostcodeDistances() {
  const response = await fetch('german-postgeocodes.csv');

  if (!response.ok) {
    throw new Error('german-postgeocodes.csv konnte nicht geladen werden.');
  }

  const buffer = await response.arrayBuffer();
  const csvText = new TextDecoder('utf-8').decode(buffer);

  const lines = csvText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);

  const headers = parseCsvLine(lines[0]).map(header => header.toLowerCase());

  state.postcodeDistances = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    return {
      ort: row.ort || '',
      plz: normalizePlz(row.plz),
      bundesland: row.bundesland || '',
      km: parseGermanNumber(row.km)
    };
  }).filter(row => row.plz && row.km > 0);
}

async function ensurePostcodeDistancesLoaded() {
  if (!state.postcodeDistances.length) {
    await loadPostcodeDistances();
  }
}

function getDistanceEntryForPlz(plz) {
  const normalizedPlz = normalizePlz(plz);

  return state.postcodeDistances.find(entry => entry.plz === normalizedPlz) || null;
}

function getManualDistanceKm() {
  return Number(String(manualDistanceKmInput?.value || '').replace(',', '.')) || 0;
}

function updateManualDistanceVisibility() {
  if (!manualDistanceBox) return;

  const plzRaw = document.getElementById('plz').value.trim();

  // Erst bei exakt 5 Ziffern prüfen
  if (!/^\d{5}$/.test(plzRaw)) {
    manualDistanceBox.classList.add('hidden');
    return;
  }

  const entry = getDistanceEntryForPlz(plzRaw);

  if (entry) {
    manualDistanceBox.classList.add('hidden');
  } else {
    manualDistanceBox.classList.remove('hidden');
  }
}

function getDistanceArticleNumber(km, totalAreaHeatedRooms) {
  if (totalAreaHeatedRooms >= 300) return null;

  if (km <= 125) return null;
  if (km <= 200) return 'H54NO502001';
  if (km <= 300) return 'H54NO502501';

  return 'H54NO503001';
}

function findArticle(articleNumber) {
  return state.articleCatalog.find(article => article.articleNumber === articleNumber);
}

function getHeatedRoomCount() {
  return state.floors.reduce((sum, floor) => {
    return sum + floor.rooms.filter((room) =>
      room.function === 'Wohnraum' || room.function === 'Bad'
    ).length;
  }, 0);
}

function getTotalAreaAllRooms() {
  return state.floors.reduce((sum, floor) => {
    return sum + floor.rooms.reduce((roomSum, room) => {
      const area = Number(String(room.area).replace(',', '.')) || 0;
      return roomSum + area;
    }, 0);
  }, 0);
}

function getTotalEstrichArea() {
  return state.floors.reduce((sum, floor) => {
    return sum + floor.rooms.reduce((roomSum, room) => {
      if (room.estrich !== 'ja') return roomSum;

      const area = Number(String(room.area).replace(',', '.')) || 0;
      return roomSum + area;
    }, 0);
  }, 0);
}

function getAllowedEstrichRangeByArea() {
  const area = getTotalEstrichArea();

  if (area >= 10 && area <= 69) return 'Flächen von 10 bis 69 m²';
  if (area >= 70 && area <= 109) return 'Flächen von 70 bis 109 m²';
  if (area >= 110 && area <= 119) return 'Flächen von 110 bis 119 m²';
  if (area >= 120 && area <= 129) return 'Flächen von 120 bis 129 m²';
  if (area >= 130 && area <= 139) return 'Flächen von 130 bis 139 m²';
  if (area >= 140 && area <= 149) return 'Flächen von 140 bis 149 m²';
  if (area >= 150) return 'Flächen ab 150 m²';

  return '';
}

function syncEstrichRangeByArea() {
  const selectedRoom = getSelectedSystemRoom();
  const estrichAllowedForRoom = !selectedRoom || selectedRoom.estrich === 'ja';
  const allowedRange = getAllowedEstrichRangeByArea();
  const hasEstrichArea = getTotalEstrichArea() > 0;

  const estrichEnabled = estrichAllowedForRoom && hasEstrichArea && allowedRange;

  estrichBlock.classList.toggle('disabled-block', !estrichEnabled);

  estrichRangeCheckboxes.forEach((checkbox) => {
    const label = checkbox.closest('.check-option');
    const isAllowed = estrichEnabled && checkbox.value === allowedRange;

    checkbox.disabled = !isAllowed;

    if (!isAllowed) {
      checkbox.checked = false;
    }

    label?.classList.toggle('disabled-option', !isAllowed);
  });

  estrichAdditiveCheckboxes.forEach((checkbox) => {
    const label = checkbox.closest('.check-option');

    checkbox.disabled = !estrichEnabled;

    if (!estrichEnabled) {
      checkbox.checked = false;
    }

    label?.classList.toggle('disabled-option', !estrichEnabled);
  });
}

function getTotalAreaHeatedRooms() {
  return state.floors.reduce((sum, floor) => {
    return sum + floor.rooms.reduce((roomSum, room) => {
      const isHeatedRoom = room.function === 'Wohnraum' || room.function === 'Bad';
      const area = Number(String(room.area).replace(',', '.')) || 0;
      return isHeatedRoom ? roomSum + area : roomSum;
    }, 0);
  }, 0);
}

function addArticle(products, articleNumber, quantityOverride = 1) {
  const article = findArticle(articleNumber);

  if (!article) {
    console.warn(`Artikelnummer ${articleNumber} wurde in master.csv nicht gefunden.`);
    return;
  }

  const quantity = Number(quantityOverride) || 0;

  if (quantity <= 0) return;

  const existing = products.find(item => item.articleNumber === article.articleNumber);

  if (existing) {
    existing.quantity += quantity;
    existing.totalPrice = existing.quantity * existing.unitPrice;
    return;
  }

  products.push({
    selected: true,
    articleNumber: article.articleNumber,
    description: article.description,
    quantity,
    unit: article.unit,
    unitPrice: article.unitPrice,
    priceUnit: article.priceUnit,
    totalPrice: quantity * article.unitPrice
  });
}

const SYSTEM_FLIPFIX = 'Systemplatte Flipfix (2mm Hohlkammer-Platte)';
const SYSTEM_PIPE_ONLY = 'nur Rohr, Dämmung komplett bauseits';

const BASE_SYSTEM_ARTICLES = [
  {
    wlg: '045',
    insulationThickness: '20-2 mm',
    articleNumber: 'H54NO000101'
  },
  {
    wlg: '045',
    insulationThickness: '30-3 mm',
    articleNumber: 'H54NO000501'
  },
  {
    wlg: '040',
    insulationThickness: '30-2 mm',
    articleNumber: 'H54NO001001'
  },
  {
    wlg: '035',
    insulationThickness: '30 mm',
    articleNumber: 'H54NO001501'
  }
];

const BASE_ARTICLE_NUMBERS = BASE_SYSTEM_ARTICLES.map(rule => rule.articleNumber);

const ROTH_SYSTEM_ARTICLES = [
  {
    wlg: '035',
    insulationThickness: '20-2 mm',
    articleNumber: '100BHW046'
  },
  {
    wlg: '040',
    insulationThickness: '20-2 mm',
    articleNumber: '100BHW047'
  },
  {
    wlg: '040',
    insulationThickness: '30-2 mm',
    articleNumber: '100BHW048'
  },
  {
    wlg: '045',
    insulationThickness: '30-3 mm',
    articleNumber: '100BHW049'
  }
];

const UPONOR_TACKER_ARTICLES = [
  {
    wlg: '040',
    insulationThickness: '20-2 mm',
    articleNumber: '100BHW039'
  },
  {
    wlg: '040',
    insulationThickness: '30-2 mm',
    articleNumber: '100BIE040'
  },
  {
    wlg: '045',
    insulationThickness: '30-3 mm',
    articleNumber: '100BHW040'
  },
  {
    wlg: '045',
    insulationThickness: '35-3 mm',
    articleNumber: '100BIE041'
  }
];

const EXTRA_INSULATION_ARTICLES = [
  // EPS DEO / WLG 035
  { material: 'EPS DEO', wlg: '035', thickness: '20 mm', articleNumber: 'H54NO200001' },
  { material: 'EPS DEO', wlg: '035', thickness: '30 mm', articleNumber: 'H54NO200501' },
  { material: 'EPS DEO', wlg: '035', thickness: '40 mm', articleNumber: 'H54NO201001' },
  { material: 'EPS DEO', wlg: '035', thickness: '50 mm', articleNumber: 'H54NO201501' },
  { material: 'EPS DEO', wlg: '035', thickness: '60 mm', articleNumber: 'H54NO202001' },

  // EPS DEO / WLG 032
  { material: 'EPS DEO', wlg: '032', thickness: '20 mm', articleNumber: 'H54NO202501' },
  { material: 'EPS DEO', wlg: '032', thickness: '30 mm', articleNumber: 'H54NO203001' },
  { material: 'EPS DEO', wlg: '032', thickness: '40 mm', articleNumber: 'H54NO203501' },
  { material: 'EPS DEO', wlg: '032', thickness: '50 mm', articleNumber: 'H54NO204001' },
  { material: 'EPS DEO', wlg: '032', thickness: '60 mm', articleNumber: 'H54NO204501' },

  // PUR / WLG 023/024
  { material: 'PUR', wlg: '023/024', thickness: '20 mm', articleNumber: 'H54NO205001' },
  { material: 'PUR', wlg: '023/024', thickness: '30 mm', articleNumber: 'H54NO205501' },
  { material: 'PUR', wlg: '023/024', thickness: '40 mm', articleNumber: 'H54NO206001' },
  { material: 'PUR', wlg: '023/024', thickness: '50 mm', articleNumber: 'H54NO206501' },
  { material: 'PUR', wlg: '023/024', thickness: '60 mm', articleNumber: 'H54NO207001' }
];

const DRY_CONSTRUCTION_ARTICLES = [
  {
    value: 'Aufbau 50mm',
    articleNumber: '100BIE036'
  },
  {
    value: 'Aufbau 20mm + 3mm Deckschicht',
    articleNumber: '100BIE034'
  },
  {
    value: 'Aufbau 30mm + 3mm Deckschicht',
    articleNumber: '100BIE035'
  },
  {
    value: 'Aufbau 25mm (XPS)',
    articleNumber: '100BIE036'
  },
  {
    value: 'Trockenestrich als schwimmende Estrichkonstruktion',
    articleNumber: '100BIE037'
  },
  {
    value: 'XPS500-Ausgleichsplatte',
    articleNumber: '100BIE039'
  }
];

const ESTRICH_RANGE_ARTICLES = [
  { value: 'Flächen von 10 bis 69 m²', articleNumber: 'H54NO050001' },
  { value: 'Flächen von 70 bis 109 m²', articleNumber: 'H54NO050501' },
  { value: 'Flächen von 110 bis 119 m²', articleNumber: 'H54NO051001' },
  { value: 'Flächen von 120 bis 129 m²', articleNumber: 'H54NO051501' },
  { value: 'Flächen von 130 bis 139 m²', articleNumber: 'H54NO052001' },
  { value: 'Flächen von 140 bis 149 m²', articleNumber: 'H54NO052501' },
  { value: 'Flächen ab 150 m²', articleNumber: '100BIE023' }
];

const ESTRICH_ADDITIVE_ARTICLES = [
  { value: 'Einbringung Polyprophylenfasern', articleNumber: 'H54NO055501' },
  { value: 'Zulage Schnellbinder 18-20 Tage', articleNumber: 'H54NO056001' },
  { value: 'Zulage Schnellbinder 10-14 Tage', articleNumber: 'H54NO056501' },
  { value: 'Zulage Schnellbinder 5- 7 Tage', articleNumber: 'H54NO057001' },
  { value: 'Retanol XTREME 3 - 7 Tage', articleNumber: 'H54NO057501' }
];

const DISTRIBUTION_ARTICLES = {
  'HKV-D2': { base: 'H54NO100001', aufputz: 'H54NO110001', unterputz: 'H54NO120001' },
  'HKV-D3': { base: 'H54NO100501', aufputz: 'H54NO110001', unterputz: 'H54NO120001' },
  'HKV-D4': { base: 'H54NO101001', aufputz: 'H54NO110501', unterputz: 'H54NO120501' },
  'HKV-D5': { base: 'H54NO101501', aufputz: 'H54NO110501', unterputz: 'H54NO120501' },
  'HKV-D6': { base: 'H54NO102001', aufputz: 'H54NO111001', unterputz: 'H54NO121001' },
  'HKV-D7': { base: 'H54NO102501', aufputz: 'H54NO111001', unterputz: 'H54NO121001' },
  'HKV-D8': { base: 'H54NO103001', aufputz: 'H54NO111001', unterputz: 'H54NO121001' },
  'HKV-D9': { base: 'H54NO103501', aufputz: 'H54NO111501', unterputz: 'H54NO121501' },
  'HKV-D10': { base: 'H54NO104001', aufputz: 'H54NO111501', unterputz: 'H54NO121501' },
  'HKV-D11': { base: 'H54NO104501', aufputz: 'H54NO111501', unterputz: 'H54NO121501' },
  'HKV-D12': { base: 'H54NO105001', aufputz: 'H54NO112001', unterputz: 'H54NO122001' }
};

const REGULATION_ARTICLES = {
  'Regelklemmleiste bis zu 6 Zonen': '100BIE017',
  'Regelklemmleiste bis zu 10 Zonen': '100BIE018',
  'Stellantrieb Premium 24V DC': '100BIE020',
  'Stellantrieb Premium 230V AC': '100BIE019'
};

const ISLAND_POSTCODES = [
  // Hiddensee
  '18565',

  // Ostfriesische Inseln
  '26465', '26474', '26486', '26548', '26571', '26579', '26757',

  // Helgoland / Neuwerk
  '27498', '27499',

  // Nordfriesische Inseln / Halligen
  '25845', '25846', '25847', '25849', '25859', '25863', '25869',
  '25929', '25930', '25931', '25932', '25933',
  '25938', '25939', '25940', '25941', '25942',
  '25946', '25947', '25948', '25949',
  '25952', '25953', '25954', '25955',
  '25961', '25962', '25963', '25964', '25965', '25966', '25967', '25968', '25969', '25970',
  '25980',
  '25985', '25986',
  '25988', '25989', '25990',
  '25992', '25993', '25994',
  '25996', '25997', '25998', '25999'
];

function isIslandPostcode(plz) {
  return ISLAND_POSTCODES.includes(String(plz).trim());
}

function getHeatedAreaForFloor(floor) {
  return floor.rooms.reduce((sum, room) => {
    const isRelevantRoom = room.function === 'Wohnraum' || room.function === 'Bad';
    const area = Number(String(room.area).replace(',', '.')) || 0;

    return isRelevantRoom ? sum + area : sum;
  }, 0);
}

function getHeatedAreaForFloorBySpacing(floor, spacing) {
  return floor.rooms.reduce((sum, room) => {
    const isRelevantRoom = room.function === 'Wohnraum' || room.function === 'Bad';
    const hasSpacing = room.spacing === spacing;
    const area = Number(String(room.area).replace(',', '.')) || 0;

    return isRelevantRoom && hasSpacing ? sum + area : sum;
  }, 0);
}

function getHeatedAreaForRoom(room) {
  if (!roomIsHeated(room)) return 0;

  return Number(String(room.area).replace(',', '.')) || 0;
}

function roomHasSpacing(room, spacing) {
  return roomIsHeated(room) && room.spacing === spacing;
}

function getDefaultHeatLoadPerM2() {
  if (state.projectType === 'neubau') return 45;
  if (state.projectType === 'sanierung') return 65;
  return 55;
}

function getDefaultFlowTemperature() {
  const map = {
    'Wärmepumpe': 35,
    'Brennwert': 40,
    'Fernwärme': 45,
    'Hybrid': 40,
    'Keine Angabe': 40
  };

  return map[state.heatSource] || 40;
}

function initRecommendationInputs() {
  if (!recHeatLoadPerM2Input) return;

  if (!state.recommendation.heatLoadPerM2) {
    state.recommendation.heatLoadPerM2 = getDefaultHeatLoadPerM2();
  }

  if (!state.recommendation.flowTemperature) {
    state.recommendation.flowTemperature = getDefaultFlowTemperature();
  }

  recHeatLoadPerM2Input.value = state.recommendation.heatLoadPerM2;
  recDeltaTInput.value = state.recommendation.deltaT;
  recMaxCircuitLengthInput.value = state.recommendation.maxCircuitLength;
  recFlowTemperatureInput.value = state.recommendation.flowTemperature;
  if (recPipeMeterVa100Input) recPipeMeterVa100Input.value = state.recommendation.pipeMeterVa100;
  if (recPipeMeterVa150Input) recPipeMeterVa150Input.value = state.recommendation.pipeMeterVa150;
  if (recPipeMeterVa200Input) recPipeMeterVa200Input.value = state.recommendation.pipeMeterVa200;
  if (recScreedCoverMmInput) recScreedCoverMmInput.value = state.recommendation.screedCoverMm;
}

const TECHNICAL_DEFAULTS = {
  neubau: {
    heatLoadPerM2: 45,
    label: 'Neubau / moderne Bauweise'
  },
  sanierung: {
    heatLoadPerM2: 65,
    label: 'Sanierung / Bestandsgebäude'
  },
  deltaT: 5,
  maxCircuitLength: 100,
  flowTemperature: {
    'Wärmepumpe': 35,
    'Brennwert': 40,
    'Fernwärme': 45,
    'Hybrid': 40,
    'Keine Angabe': 40
  }
};

function getPipeLengthPerM2(spacing) {
  const map = {
    'VA 100': Number(state.recommendation?.pipeMeterVa100) || 8.8,
    'VA 150': Number(state.recommendation?.pipeMeterVa150) || 5.8,
    'VA 200': Number(state.recommendation?.pipeMeterVa200) || 4.6
  };

  return map[spacing] || map['VA 150'];
}

function getRecommendedDistributorSize(circuits) {
  if (circuits <= 0) return '-';

  const sizes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const matchingSize = sizes.find(size => size >= circuits);

  return matchingSize ? `${matchingSize}-fach` : `${circuits}-fach oder auf mehrere Verteiler aufteilen`;
}

function getFloorCoveringFactor(floorCovering) {
  const map = {
    'Fliesen': 1.00,
    'Linoleum': 0.95,
    'Parkett/Laminat': 0.90,
    'Teppichboden': 0.80
  };

  return map[floorCovering] || 1.00;
}

function getScreedCoverFactor() {
  const cover = Number(state.recommendation?.screedCoverMm) || 45;

  if (cover <= 45) return 1.00;
  if (cover <= 50) return 0.98;
  if (cover <= 55) return 0.96;
  if (cover <= 60) return 0.94;
  return 0.92;
}

function calculateTechnicalRecommendation() {
  const projectDefaults =
    TECHNICAL_DEFAULTS[state.projectType] || TECHNICAL_DEFAULTS.neubau;

  const heatLoadPerM2 =
    Number(state.recommendation?.heatLoadPerM2) || projectDefaults.heatLoadPerM2;

  const deltaT =
    Number(state.recommendation?.deltaT) || TECHNICAL_DEFAULTS.deltaT;

  const maxCircuitLength =
    Number(state.recommendation?.maxCircuitLength) || TECHNICAL_DEFAULTS.maxCircuitLength;

  const flowTemperature =
    Number(state.recommendation?.flowTemperature) ||
    TECHNICAL_DEFAULTS.flowTemperature[state.heatSource] ||
    TECHNICAL_DEFAULTS.flowTemperature['Keine Angabe'];

  const rooms = [];
  let totalArea = 0;
  let totalPipeLength = 0;
  let totalCircuits = 0;
  let totalHeatLoad = 0;
  let totalFlowRate = 0;

  state.floors.forEach((floor, floorIndex) => {
    floor.rooms.forEach((room, roomIndex) => {
      if (!roomIsHeated(room)) return;

      const area = getHeatedAreaForRoom(room);
      if (area <= 0) return;

      const pipeLengthPerM2 = getPipeLengthPerM2(room.spacing);
      const pipeLength = area * pipeLengthPerM2;
      const circuits = Math.max(1, Math.ceil(pipeLength / maxCircuitLength));
      const heatLoad = area * heatLoadPerM2;
      const flowRate = heatLoad / (1.163 * deltaT);
      const flowRatePerCircuit = circuits > 0 ? flowRate / circuits : 0;
      const floorCovering = room.floorCovering || 'Fliesen';
      const floorCoveringFactor = getFloorCoveringFactor(floorCovering);
      const screedCoverFactor = getScreedCoverFactor();
      const heatEmissionFactor = floorCoveringFactor * screedCoverFactor;

      totalArea += area;
      totalPipeLength += pipeLength;
      totalCircuits += circuits;
      totalHeatLoad += heatLoad;
      totalFlowRate += flowRate;

      rooms.push({
        floor: getFloorLabel(floor, floorIndex),
        room: getRoomLabel(room, roomIndex),
        area,
        spacing: room.spacing || '-',
        pipeLength,
        circuits,
        heatLoad,
        flowRate,
        flowRatePerCircuit,
        floorCovering,
        heatEmissionFactor
      });
    });
  });

  return {
    basis: {
      buildingLabel: projectDefaults.label,
      heatLoadPerM2,
      deltaT,
      maxCircuitLength,
      flowTemperature,
      heatSource: state.heatSource || 'Keine Angabe'
    },
    totals: {
      totalArea,
      totalPipeLength,
      totalCircuits,
      totalHeatLoad,
      totalFlowRate,
      distributor: getRecommendedDistributorSize(totalCircuits)
    },
    rooms
  };
}

function renderFloorCircuitSummary() {
  if (!floorCircuitSummary) return;

  const result = calculateTechnicalRecommendation();

  const floorMap = {};

  result.rooms.forEach((room) => {
    floorMap[room.floor] = (floorMap[room.floor] || 0) + room.circuits;
  });

  const entries = Object.entries(floorMap);

  if (!entries.length) {
    floorCircuitSummary.innerHTML = 'Noch keine beheizten Räume mit Heizkreisen vorhanden.';
    return;
  }

  floorCircuitSummary.innerHTML = entries
    .map(([floor, circuits]) => `
      <div class="floor-circuit-row">
        <span>${floor}</span>
        <strong>${circuits} Heizkreis${circuits === 1 ? '' : 'e'}</strong>
      </div>
    `)
    .join('');
}

function renderTechnicalRecommendation() {
  if (!technicalCalculationResult) return;

  const result = calculateTechnicalRecommendation();

  if (!result.rooms.length) {
    technicalCalculationResult.innerHTML = `
      <div class="technical-note warning">
        Es wurden noch keine beheizten Räume mit Fläche gefunden.
      </div>
    `;
    return;
  }

  technicalCalculationResult.innerHTML = `
    <div class="technical-note">
      <strong>Wichtiger Hinweis:</strong>
      Die dargestellten Werte dienen ausschließlich der überschlägigen Vorbemessung.
      Eine normgerechte Heizlastberechnung, Heizflächenauslegung und Berechnung für den hydraulischen
      Abgleich kann separat beauftragt werden.
    </div>

    <h3>Grundlagen der Empfehlung</h3>
    <div class="technical-grid">
      <div><span>Gebäudetyp</span><strong>${result.basis.buildingLabel}</strong></div>
      <div><span>Heizlastannahme</span><strong>ca. ${result.basis.heatLoadPerM2} W/m²</strong></div>
      <div><span>Spreizung</span><strong>ca. ${result.basis.deltaT} K</strong></div>
      <div><span>max. Heizkreislänge</span><strong>ca. ${result.basis.maxCircuitLength} m</strong></div>
      <div><span>Wärmeerzeuger</span><strong>${result.basis.heatSource}</strong></div>
      <div><span>empf. Vorlauf</span><strong>ca. ${result.basis.flowTemperature} °C</strong></div>
      <div><span>VA 100</span><strong>ca. ${formatQuantity(state.recommendation.pipeMeterVa100)} m/m²</strong></div>
      <div><span>VA 150</span><strong>ca. ${formatQuantity(state.recommendation.pipeMeterVa150)} m/m²</strong></div>
      <div><span>VA 200</span><strong>ca. ${formatQuantity(state.recommendation.pipeMeterVa200)} m/m²</strong></div>      
    </div>

    <h3>Gesamtempfehlung</h3>
    <div class="technical-grid">
     <div><span>beheizte Fläche</span><strong>${formatQuantity(result.totals.totalArea)} m²</strong></div>

<div>
  <span>Rohrlänge
    <span class="info-trigger">i
      <span class="info-tooltip">
        Berechnung: beheizte Fläche × Rohrmeter je m² je nach Verlegeabstand.
        Beispiel: 30 m² × 5,8 m/m² bei VA 150 = 174 m Rohr.
      </span>
    </span>
  </span>
  <strong>${formatQuantity(result.totals.totalPipeLength)} m</strong>
</div>

<div>
  <span>Heizkreise
    <span class="info-trigger">i
      <span class="info-tooltip">
        Berechnung: Rohrlänge ÷ maximal empfohlene Heizkreislänge.
        Das Ergebnis wird auf ganze Heizkreise aufgerundet.
      </span>
    </span>
  </span>
  <strong>${result.totals.totalCircuits}</strong>
</div>

<div>
  <span>Heizlast
    <span class="info-trigger">i
      <span class="info-tooltip">
        Berechnung: beheizte Fläche × Heizlastannahme W/m².
        Beispiel: 30 m² × 45 W/m² = 1.350 W = 1,35 kW.
      </span>
    </span>
  </span>
  <strong>ca. ${formatQuantity(result.totals.totalHeatLoad / 1000)} kW</strong>
</div>

<div>
  <span>Volumenstrom
    <span class="info-trigger">i
      <span class="info-tooltip">
        Berechnung: Heizlast ÷ (1,163 × Spreizung).
        Beispiel: 1.350 W ÷ (1,163 × 5 K) = ca. 232 l/h.

        (1,163 Wh/(1xK) = 1 Liter Wasser transportiert bei 1 Kelvin Temperaturunterschied ca. 1,163 Wh Wärmeenergie.)
      </span>
    </span>
  </span>
  <strong>ca. ${formatQuantity(result.totals.totalFlowRate)} l/h</strong>
</div>

<div>
  <span>Verteiler
    <span class="info-trigger">i
      <span class="info-tooltip">
        Empfehlung: Die Verteilergröße richtet sich nach der berechneten Anzahl der Heizkreise.
        Beispiel: 7 Heizkreise = 7-fach Verteiler.
      </span>
    </span>
  </span>
  <strong>${result.totals.distributor}</strong>
</div>
    </div>

    <h3>Raumweise Empfehlung</h3>
    <div class="technical-table-wrap">
      <table class="technical-table">
        <thead>
          <tr>
            <th>Etage</th>
            <th>Raum</th>
            <th>Fläche</th>
            <th>VA</th>
            <th>Rohr</th>
            <th>HK</th>
            <th>Heizlast</th>
            <th>Volumenstrom</th>
            <th>je HK</th>
            <th>Bodenbelag</th>
            <th>Faktor</th>
          </tr>
        </thead>
        <tbody>
          ${result.rooms.map(room => `
            <tr>
              <td>${room.floor}</td>
              <td>${room.room}</td>
              <td>${formatQuantity(room.area)} m²</td>
              <td>${room.spacing}</td>
              <td>${formatQuantity(room.pipeLength)} m</td>
              <td>${room.circuits}</td>
              <td>ca. ${formatQuantity(room.heatLoad)} W</td>
              <td>ca. ${formatQuantity(room.flowRate)} l/h</td>
              <td>ca. ${formatQuantity(room.flowRatePerCircuit)} l/h</td>
              <td>${room.floorCovering}</td>
              <td>${formatQuantity(room.heatEmissionFactor)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="technical-note">
  <strong>Hinweis zum hydraulischen Abgleich:</strong>
  Die angegebenen Werte „je HK“ dienen als überschlägige Einstellempfehlung am Heizkreisverteiler.
  Eine verbindliche Ventilvoreinstellung und hydraulische Berechnung unter Berücksichtigung von
  Rohrlängen, Druckverlusten, Armaturen, Pumpenkennlinie und Verteilerkomponenten kann separat
  beauftragt werden.
</div>
  `;
}

function calculateProducts() {
  const products = [];

  state.floors.forEach((floor) => {
    floor.rooms.forEach((room) => {
      if (!roomIsHeated(room)) return;

      const selection = room.assignments?.system;
      if (!selection) return;

      const addon = selection.systemAddon || '';
      const heatedArea = getHeatedAreaForRoom(room);
      const heatedAreaVa100 = roomHasSpacing(room, 'VA 100') ? heatedArea : 0;

      // Berechnung 14: Sanierung + Klett 3mm
      if (
        state.projectType === 'sanierung' &&
        selection.system === 'Klett 3mm'
      ) {
        addArticle(products, 'H54NO020001', heatedArea);
      }

      // Berechnung 15: Neubau + Uponor + Klett
      if (
        state.projectType === 'neubau' &&
        state.brand === 'uponor' &&
        selection.system === 'Klett' &&
        selection.wlg === '040' &&
        selection.insulationThickness === '30-2 mm' &&
        selection.pipeType === 'PE-Xa'
      ) {
        addArticle(products, '100BIE031', heatedArea);
      }

      if (
        state.projectType === 'neubau' &&
        state.brand === 'handelsmarke'
      ) {
        const baseRule = BASE_SYSTEM_ARTICLES.find(rule =>
          rule.wlg === selection.wlg &&
          rule.insulationThickness === selection.insulationThickness
        );

        if (selection.system === 'Tacker' && baseRule) {
          // Standard: PE-RT ist im Grundartikel enthalten.
          // Wenn ein anderes Rohr gewählt wurde, bleibt der Grundartikel trotzdem bestehen,
          // zusätzlich kommt der Rohr-Aufpreis dazu.
          if (addon === SYSTEM_FLIPFIX) {
            addArticle(products, '100BIE032', heatedArea);
          } else if (addon === SYSTEM_PIPE_ONLY) {
            addArticle(products, '100BIE033', heatedArea);
          } else {
            addArticle(products, baseRule.articleNumber, heatedArea);
          }

          if (selection.pipeType === 'PE-Xc' || selection.pipeType === 'PE-Xa') {
            addArticle(products, 'H54NO500001', heatedArea);
          }

          if (selection.pipeType === 'Alu-Verbund') {
            addArticle(products, 'H54NO500501', heatedArea);
          }

          if (heatedAreaVa100 > 0) {
            addArticle(products, 'H54NO501501', heatedAreaVa100);
          }
        }
      }

      if (
        state.projectType === 'neubau' &&
        state.brand === 'roth'
      ) {
        const rothRule = ROTH_SYSTEM_ARTICLES.find(rule =>
          rule.wlg === selection.wlg &&
          rule.insulationThickness === selection.insulationThickness
        );

        if (selection.system === 'Tacker' && rothRule) {
          if (addon === SYSTEM_FLIPFIX) {
            addArticle(products, '100BHW045', heatedArea);
          } else if (addon === SYSTEM_PIPE_ONLY) {
            addArticle(products, '100BHW050', heatedArea);
          } else {
            addArticle(products, rothRule.articleNumber, heatedArea);
          }

          if (selection.pipeType === 'X-PERT S5+') {
            addArticle(products, '100BHW051', heatedArea);
          }

          if (selection.pipeType === 'DUOPEX S5') {
            addArticle(products, '100BHW052', heatedArea);
          }

          if (heatedAreaVa100 > 0) {
            addArticle(products, '100BHW053', heatedAreaVa100);
          }
        }
      }
      if (
        state.projectType === 'neubau' &&
        state.brand === 'uponor'
      ) {
        const uponorRule = UPONOR_TACKER_ARTICLES.find(rule =>
          rule.wlg === selection.wlg &&
          rule.insulationThickness === selection.insulationThickness
        );

        if (selection.system === 'Tacker' && uponorRule) {
          if (addon === SYSTEM_PIPE_ONLY) {
            addArticle(products, '100BHW041', heatedArea);
          } else {
            addArticle(products, uponorRule.articleNumber, heatedArea);
          }

          if (selection.pipeType === 'MLCP Red Aluverbundrohr') {
            addArticle(products, '100BHW042', heatedArea);
          }

          if (selection.pipeType === 'Comfort Pipe Plus Xa-Rohr') {
            addArticle(products, '100BHW043', heatedArea);
          }

          if (heatedAreaVa100 > 0) {
            addArticle(products, '100BHW044', heatedAreaVa100);
          }
        }
      }
    });
  });

  const heatedRoomCount = getHeatedRoomCount();
  const totalAreaAllRooms = getTotalAreaAllRooms();
  const totalAreaHeatedRooms = getTotalAreaHeatedRooms();

  // Inselzuschlag
  const plz = document.getElementById('plz').value.trim();

  if (isIslandPostcode(plz)) {
    addArticle(products, '100BIE016', 1);
  }

  // Entfernungspauschale
  const distanceEntry = getDistanceEntryForPlz(plz);
  const manualDistanceKm = getManualDistanceKm();

  const distanceKm = distanceEntry
    ? distanceEntry.km
    : manualDistanceKm;

  const distanceArticleNumber = distanceKm
    ? getDistanceArticleNumber(distanceKm, totalAreaHeatedRooms)
    : null;

  if (distanceArticleNumber) {
    addArticle(products, distanceArticleNumber, 1);
  }

  // Verteilertechnik Berechnung 70–95, jetzt raumbezogen
  if (state.distributionEnabled === 'ja') {
    state.floors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        const distribution = room.assignments?.distribution;

        if (!distribution || distribution.none) return;

        const cabinetMounting = distribution.cabinetMounting;
        const voltage = distribution.regulationVoltage;

        // Verteiler + Schrank
        distribution.distributionRows?.forEach((row) => {
          const rule = DISTRIBUTION_ARTICLES[row.type];
          const qtyValue = Number(row.quantity || 0);

          if (!rule || qtyValue <= 0) return;

          addArticle(products, rule.base, qtyValue);

          if (cabinetMounting === 'Aufputz') {
            addArticle(products, rule.aufputz, qtyValue);
          }

          if (cabinetMounting === 'Unterputz') {
            addArticle(products, rule.unterputz, qtyValue);
          }
        });

        // Regeltechnik
        distribution.regulationRows?.forEach((row) => {
          const qtyValue = Number(row.quantity || 0);
          const label = row.label;

          if (qtyValue <= 0) return;

          if (label === 'Regelklemmleiste bis zu 6 Zonen') {
            addArticle(products, REGULATION_ARTICLES['Regelklemmleiste bis zu 6 Zonen'], qtyValue);
          }

          if (label === 'Regelklemmleiste bis zu 10 Zonen' && voltage === '230V AC') {
            addArticle(products, REGULATION_ARTICLES['Regelklemmleiste bis zu 10 Zonen'], qtyValue);
          }

          if (label === 'Stellantrieb Premium' && voltage === '24V DC') {
            addArticle(products, REGULATION_ARTICLES['Stellantrieb Premium 24V DC'], qtyValue);
          }

          if (label === 'Stellantrieb Premium' && voltage === '230V AC') {
            addArticle(products, REGULATION_ARTICLES['Stellantrieb Premium 230V AC'], qtyValue);
          }
        });
      });
    });
  }
  // Estrich Berechnung 58–64
  const totalEstrichArea = getTotalEstrichArea();
  const automaticEstrichRange = getAllowedEstrichRangeByArea();

  if (automaticEstrichRange && totalEstrichArea > 0) {
    const estrichRule = ESTRICH_RANGE_ARTICLES.find(rule => rule.value === automaticEstrichRange);

    if (estrichRule) {
      const isFlatRate =
        automaticEstrichRange === 'Flächen von 10 bis 69 m²' ||
        automaticEstrichRange === 'Flächen von 70 bis 109 m²';

      const quantity = isFlatRate ? 1 : totalEstrichArea;

      addArticle(products, estrichRule.articleNumber, quantity);
    }
  }

  // Estrich Zusatzmittel Berechnung 65–69
  const selectedEstrichAdditives = new Set();

  state.floors.forEach((floor) => {
    floor.rooms.forEach((room) => {
      if (room.estrich !== 'ja') return;

      const additives = room.assignments?.system?.estrichAdditives || [];
      additives.forEach(entry => selectedEstrichAdditives.add(entry));
    });
  });

  selectedEstrichAdditives.forEach((entry) => {
    const additiveRule = ESTRICH_ADDITIVE_ARTICLES.find(rule => rule.value === entry);

    if (additiveRule && totalEstrichArea > 0) {
      addArticle(products, additiveRule.articleNumber, totalEstrichArea);
    }
  });

  // Trockenbau Berechnung 52–57
  const dryConstructionEntriesForCalc = getDryConstructionEntries();

  dryConstructionEntriesForCalc.forEach((entry) => {
    const dryRule = DRY_CONSTRUCTION_ARTICLES.find(rule => rule.value === entry);

    if (dryRule) {
      addArticle(products, dryRule.articleNumber, totalAreaHeatedRooms);
    }
  });

  const millingEntries = Array.from(millingSystemCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const millingSelected = millingEntries.includes('Fräsen');
  const millingDisposalSelected = millingEntries.includes('Entsorgungspauschale');
  const millingSealingSelected = millingEntries.includes('Versiegelungspauschale');

  if (millingSelected) {
    // Fräsen nach beheizter Fläche
    addArticle(products, 'H54NO010001', totalAreaHeatedRooms);

    // Baustelleneinrichtung einmalig
    addArticle(products, 'H54NO600001', 1);

    // Etagenzuschuss einmalig, sobald eine beheizte Etage nicht Erdgeschoss ist
    if (hasNonGroundFloorWithHeatedRooms()) {
      addArticle(products, 'H54NO600501', 1);
    }

    // Entsorgungspauschale einmalig
    if (millingDisposalSelected) {
      addArticle(products, 'H54NO601001', 1);
    }

    // Versiegelungspauschale nach beheizter Fläche
    if (millingSealingSelected) {
      addArticle(products, 'H54NO601501', totalAreaHeatedRooms);
    }
  }

  // Zusatzdämmung Berechnung 36–50, jetzt raumbezogen
  if (state.extraInsulationEnabled === 'ja') {
    state.floors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        const extra = room.assignments?.extraInsulation;

        if (!extra || extra.none) return;

        const area = getHeatedAreaForRoom(room);
        if (area <= 0) return;

        const rule = EXTRA_INSULATION_ARTICLES.find(article =>
          article.material === extra.material &&
          article.wlg === extra.wlg &&
          article.thickness === extra.thickness
        );

        if (rule) {
          addArticle(products, rule.articleNumber, area);
        }
      });
    });
  }

  // Thermostate
  state.floors.forEach((floor) => {
    floor.rooms.forEach((room) => {
      const thermo = room.assignments?.thermostat;
      if (!thermo || thermo.none) return;
      const distribution = room.assignments?.distribution;
      if (!distribution || distribution.none) return;

      if (thermo.analog > 0) {
        addArticle(products, '100BIE021', thermo.analog);
      }

      if (thermo.lcd > 0) {
        addArticle(products, '100BIE022', thermo.lcd);
      }
    });
  });

  // Dienstleistungen
  if (state.services.includes('Beratungspauschale')) {
    addArticle(products, 'H54NO503501', 1);
  }

  if (state.services.includes('Schnellauslegung')) {
    addArticle(products, 'H54NO504701', totalAreaAllRooms);
  }

  if (state.services.includes('Heizflächenauslegung')) {
    addArticle(products, 'H54NO504501', totalAreaHeatedRooms);
  }

  if (state.services.includes('Heizlastberechnung')) {
    addArticle(products, 'H54NO504001', totalAreaHeatedRooms);
  }

  return products;
}

function updateResultTotal() {
  const total = state.calculatedProducts
    .filter(item => item.selected !== false)
    .reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  resultTotalNet.textContent = formatEuro(total);
}

function renderResultTable(products) {
  resultTableBody.innerHTML = products.map((item, index) => {
    const isFlatRate = item.unit && item.unit.toLowerCase().includes('pauschal');

    const quantityDisplay = isFlatRate
      ? `${formatQuantity(item.quantity)}`
      : `${formatQuantity(item.quantity)} ${item.unit}`;

    return `
      <tr>
        <td>
          <input 
            type="checkbox" 
            class="result-select-checkbox" 
            data-result-index="${index}" 
            ${item.selected !== false ? 'checked' : ''}
          />
        </td>
        <td>${item.articleNumber}</td>
        <td>${item.description}</td>
        <td>${quantityDisplay}</td>
        <td>${formatEuro(item.unitPrice)} / ${item.unit}</td> 
        <td>${formatEuro(item.totalPrice)}</td>
      </tr>
    `;
  }).join('');

  document.querySelectorAll('.result-select-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const index = Number(checkbox.dataset.resultIndex);
      state.calculatedProducts[index].selected = checkbox.checked;
      updateResultTotal();
    });
  });

  updateResultTotal();
}

function showResultPage() {
  state.calculatedProducts = calculateProducts();
  renderResultTable(state.calculatedProducts);

  document.querySelectorAll('.step-panel').forEach((panel) => {
    panel.classList.remove('active');
  });

  resultPanel.classList.remove('hidden');
  mainLayout.classList.add('result-mode');

  document.querySelector('.btn-row').classList.add('hidden');

  scrollToTop();
}

function returnToConfiguration() {
  // Ergebnisbereich ausblenden
  resultPanel.classList.add('hidden');

  // Schritte wieder anzeigen
  mainLayout.classList.remove('result-mode');

  // Buttons unten wieder sichtbar machen
  document.querySelector('.btn-row').classList.remove('hidden');

  // Zurück zum letzten Schritt (Berechnung)
  showStep(11);

  scrollToTop();
}

function resetAllInputsAfterHandover() {
  state.currentStep = 0;
  state.projectType = '';
  state.brand = '';
  state.heatSource = '';
  state.thermostatEnabled = '';
  state.extraInsulationEnabled = '';
  state.distributionMode = '';
  state.floors = [createFloor()];
  state.services = [];
  state.calculatedProducts = [];
  state.maxUnlockedStep = 0;
  state.isLocked = true;

  document.querySelectorAll('input').forEach((input) => {
    if (input.type === 'checkbox') input.checked = false;
    if (input.type === 'number' || input.type === 'text') input.value = '';
  });

  document.querySelectorAll('select').forEach((select) => {
    select.selectedIndex = 0;
  });

  renderProjectType();
  renderBrand();
  renderHeatSource();
  renderThermostat();
  renderThermostatToggle();
  renderExtraInsulationToggle();
  renderDistributionMode();
  renderFloors();
  updateSummary();
}

function lockConfigurator() {
  state.isLocked = true;

  if (shopToken) {
    localStorage.setItem(tokenStorageKey, 'used');
  }

  document.querySelectorAll('button, input, select, .choice-card, .step-item').forEach((el) => {
    el.disabled = true;
    el.classList.add('disabled-card');
  });

  resultPanel.innerHTML = `
    <h2 class="section-title">Konfigurator abgeschlossen</h2>
    <p class="section-subtitle">
      Die Artikel wurden an NDF übermittelt.
    </p>
  `;
}

// function checkTokenUsageOnLoad() {
//  if (shopToken && localStorage.getItem(tokenStorageKey) === 'used') {
//    mainLayout.classList.add('result-mode');
//    document.querySelector('.steps').classList.add('hidden');
//    document.querySelector('.btn-row').classList.add('hidden');
//    document.querySelectorAll('.step-panel').forEach((panel) => panel.classList.remove('active'));
//
//    resultPanel.classList.remove('hidden');
//    resultPanel.innerHTML = `
//      <h2 class="section-title">Token bereits verwendet</h2>
//      <p class="section-subtitle">
//        Dieser Konfigurator-Link wurde bereits genutzt. Bitte starten Sie den Konfigurator erneut aus dem PeterShop.
//      </p>
//    `;
//
//    state.isLocked = true;
//  }
//}

function getRelevantAreaForHeatingSystem() {
  return state.floors.reduce((sum, floor) => {
    return sum + floor.rooms.reduce((roomSum, room) => {
      const isRelevantRoom =
        room.function === 'Wohnraum' || room.function === 'Bad';

      const area = Number(String(room.area).replace(',', '.')) || 0;

      return isRelevantRoom ? roomSum + area : roomSum;
    }, 0);
  }, 0);
}

function getThermostatQty(type) {
  const normalizedType = String(type || '').toLowerCase();
  const input = document.querySelector(`.thermostat-qty[data-type="${normalizedType}"]`);
  return Number(input?.value || 0);
}

async function assignThermostatToRoom() {
  const room = getSelectedThermostatRoom();

  if (!room) return;

  if (!roomIsHeated(room)) {
    await showAppModal({
      title: 'Hinweis',
      message: 'Dieser Raum ist unbeheizt und benötigt keine Thermostat-Zuweisung.',
      confirmText: 'OK'
    });
    return;
  }

  const selection = getCurrentThermostatSelection();

  if (!selection) {
    await showAppModal({
      title: 'Auswahl unvollständig',
      message: 'Bitte wählen Sie Analog oder LCD und tragen Sie eine Menge größer 0 ein.',
      confirmText: 'OK'
    });
    return;
  }

  room.assignments.thermostat = selection;

  const hint = getAllAssignmentsDoneText('thermostat');

  await showAppModal({
    title: 'Gespeichert',
    message: `Das Thermostat wurde dem Raum "${getRoomLabel(room, Number(thermostatRoomSelect.value))}" zugewiesen.${hint ? '\n\n' + hint : ''}`,
    confirmText: 'OK'
  });

  renderThermostatFloorSelect();
  updateAssignmentPointers();
  scrollAfterAssignment('thermostat');
  updateAssignThermostatButton();
  updateSummary();
}

async function assignThermostatNoneToRoom() {
  const room = getSelectedThermostatRoom();
  if (!room) return;

  const wasAlreadySet = room.assignments?.thermostat?.none === true;

  if (wasAlreadySet) {
    room.assignments.thermostat = null;

    await showAppModal({
      title: 'Zurückgenommen',
      message: `Die Auswahl "Für diesen Raum nicht gewünscht" wurde für den Raum "${getRoomLabel(room, Number(thermostatRoomSelect.value))}" zurückgenommen.`,
      confirmText: 'OK'
    });
  } else {
    room.assignments.thermostat = { none: true };
    clearThermostatSelection();

    const hint = getAllAssignmentsDoneText('thermostat');

    await showAppModal({
      title: 'Gespeichert',
      message: `Für den Raum "${getRoomLabel(room, Number(thermostatRoomSelect.value))}" wurde kein Thermostat hinterlegt.${hint ? '\n\n' + hint : ''}`,
      confirmText: 'OK'
    });
  }

  renderThermostatFloorSelect();
  updateAssignmentPointers();
  updateAssignThermostatButton();
  updateSummary();
}

function getSelectedDistributionRoom() {
  const floorIndex = Number(distributionFloorSelect.value || 0);
  const roomIndex = Number(distributionRoomSelect.value || 0);

  return state.floors[floorIndex]?.rooms[roomIndex] || null;
}

function hasAnyDistributionAssignment() {
  return state.floors.some((floor) => {
    return floor.rooms.some((room) => {
      return roomIsHeated(room) && !!room.assignments?.distribution;
    });
  });
}

function renderDistributionFloorSelect() {
  if (!distributionFloorSelect || !distributionRoomSelect) return;

  distributionFloorSelect.innerHTML = state.floors.map((floor, index) => {
    const label = getFloorLabel(floor, index);
    const heatedRooms = floor.rooms.filter(roomIsHeated);
    const assignedRooms = heatedRooms.filter(room => room.assignments?.distribution).length;
    const check = heatedRooms.length > 0 && assignedRooms === heatedRooms.length ? ' ✅' : '';

    return `<option value="${index}">${label}${check}</option>`;
  }).join('');

  const distributionSafeFloorIndex = Number(distributionFloorSelect.value || 0) < state.floors.length
    ? Number(distributionFloorSelect.value || 0)
    : 0;

  distributionFloorSelect.value = String(distributionSafeFloorIndex);

  renderDistributionRoomSelect();
}

function renderDistributionRoomSelect() {
  if (!distributionFloorSelect || !distributionRoomSelect) return;

  const floorIndex = Number(distributionFloorSelect.value || 0);
  const floor = state.floors[floorIndex];

  if (!floor) return;

  distributionRoomSelect.innerHTML = floor.rooms.map((room, index) => {
    const label = getRoomLabel(room, index);
    const functionText = room.function || 'ohne Funktion';
    const check = room.assignments?.distribution ? ' ✅' : '';
    const disabledText = roomIsHeated(room) ? '' : ' (unbeheizt)';

    return `<option value="${index}">${label} / ${functionText}${disabledText}${check}</option>`;
  }).join('');

  distributionRoomSelect.value = distributionRoomSelect.value || '0';

  setDistributionSelection(getSelectedDistributionRoom()?.assignments?.distribution || null);
  updateAssignDistributionButton();
}

function clearDistributionSelection() {
  document.querySelectorAll('input[name="cabinetMounting"], input[name="regulationVoltage"]').forEach((input) => {
    input.checked = false;
  });

  distributionTypeFields.forEach((field) => field.selectedIndex = 0);
  distributionQtyFields.forEach((field) => field.value = '');

  regulationCheckboxes.forEach((checkbox) => checkbox.checked = false);
  regulationQtyFields.forEach((field) => field.value = '');
}

function getCurrentDistributionSelection() {
  const cabinetMounting = getCheckedValue('cabinetMounting');
  const regulationVoltage = getCheckedValue('regulationVoltage');

  const distributionRows = [];

  distributionTypeFields.forEach((typeField, index) => {
    const typeValue = typeField.value;
    const qtyValue = Number(distributionQtyFields[index]?.value || 0);

    if (typeValue && qtyValue > 0) {
      distributionRows.push({
        type: typeValue,
        quantity: qtyValue
      });
    }
  });

  const regulationRows = [];

  regulationCheckboxes.forEach((checkbox, index) => {
    const qtyValue = Number(regulationQtyFields[index]?.value || 0);

    if (checkbox.checked && qtyValue > 0) {
      regulationRows.push({
        label: checkbox.dataset.label,
        quantity: qtyValue
      });
    }
  });

  if (!cabinetMounting && distributionRows.length === 0 && regulationRows.length === 0) {
    return null;
  }

  if (distributionRows.length > 0 && !cabinetMounting) {
    return null;
  }

  if (regulationRows.length > 0 && !regulationVoltage) {
    return null;
  }

  return {
    cabinetMounting,
    regulationVoltage,
    distributionRows,
    regulationRows
  };
}

function setDistributionSelection(selection) {
  clearDistributionSelection();

  if (!selection) {
    syncRegulationRules();
    updateAssignDistributionButton();
    return;
  }

  if (selection.none) {
    syncRegulationRules();
    updateAssignDistributionButton();
    return;
  }

  if (selection.cabinetMounting) {
    const input = document.querySelector(`input[name="cabinetMounting"][value="${selection.cabinetMounting}"]`);
    if (input) input.checked = true;
  }

  if (selection.regulationVoltage) {
    const input = document.querySelector(`input[name="regulationVoltage"][value="${selection.regulationVoltage}"]`);
    if (input) input.checked = true;
  }

  selection.distributionRows?.forEach((row, index) => {
    if (distributionTypeFields[index]) distributionTypeFields[index].value = row.type;
    if (distributionQtyFields[index]) distributionQtyFields[index].value = row.quantity;
  });

  selection.regulationRows?.forEach((row) => {
    const checkbox = Array.from(regulationCheckboxes).find(cb => cb.dataset.label === row.label);
    if (!checkbox) return;

    const index = Array.from(regulationCheckboxes).indexOf(checkbox);
    checkbox.checked = true;

    if (regulationQtyFields[index]) {
      regulationQtyFields[index].value = row.quantity;
    }
  });

  syncRegulationRules();
  updateAssignDistributionButton();
}

function updateAssignDistributionButton() {
  if (!assignDistributionBtn || !assignDistributionNoneBtn) return;

  const room = getSelectedDistributionRoom();

  if (state.distributionEnabled !== 'ja') {
    assignDistributionBtn.classList.add('hidden');
    assignDistributionNoneBtn.classList.add('hidden');
    return;
  }

  assignDistributionBtn.classList.remove('hidden');
  assignDistributionNoneBtn.classList.remove('hidden');

  if (!room || !roomIsHeated(room)) {
    assignDistributionBtn.disabled = true;
    assignDistributionNoneBtn.disabled = true;
    return;
  }

  const selection = getCurrentDistributionSelection();

  assignDistributionBtn.disabled = !selection;
  assignDistributionNoneBtn.disabled = false;

  assignDistributionBtn.textContent = room.assignments?.distribution && !room.assignments.distribution.none
    ? 'Verteilertechnik des Raumes aktualisieren'
    : 'Verteilertechnik dem Raum zuweisen';

  if (room.assignments?.distribution?.none) {
    assignDistributionNoneBtn.textContent = 'Für diesen Raum nicht gewünscht.';
    assignDistributionNoneBtn.classList.add('room-none-active');
  } else {
    assignDistributionNoneBtn.textContent = 'Nicht für diesen Raum erforderlich';
    assignDistributionNoneBtn.classList.remove('room-none-active');
  }
}

async function assignDistributionToRoom() {
  const room = getSelectedDistributionRoom();

  if (!room) return;

  if (!roomIsHeated(room)) {
    await showAppModal({
      title: 'Hinweis',
      message: 'Dieser Raum ist unbeheizt und benötigt keine Verteilertechnik-Zuweisung.',
      confirmText: 'OK'
    });
    return;
  }

  const selection = getCurrentDistributionSelection();

  if (!selection) {
    await showAppModal({
      title: 'Auswahl unvollständig',
      message: 'Bitte wählen Sie die Verteilertechnik vollständig aus.',
      confirmText: 'OK'
    });
    return;
  }

  room.assignments.distribution = selection;

  const hint = getAllAssignmentsDoneText('distribution');

  await showAppModal({
    title: 'Gespeichert',
    message: `Die Verteilertechnik wurde dem Raum "${getRoomLabel(room, Number(distributionRoomSelect.value))}" zugewiesen.${hint ? '\n\n' + hint : ''}`,
    confirmText: 'OK'
  });

  renderDistributionFloorSelect();
  updateAssignmentPointers();
  scrollAfterAssignment('distribution');
  updateSummary();
}

async function assignDistributionNoneToRoom() {
  const room = getSelectedDistributionRoom();
  if (!room) return;

  const wasAlreadySet = room.assignments?.distribution?.none === true;

  if (wasAlreadySet) {
    room.assignments.distribution = null;

    await showAppModal({
      title: 'Zurückgenommen',
      message: `Die Auswahl "Für diesen Raum nicht gewünscht" wurde für den Raum "${getRoomLabel(room, Number(distributionRoomSelect.value))}" zurückgenommen.`,
      confirmText: 'OK'
    });
  } else {
    room.assignments.distribution = { none: true };
    clearDistributionSelection();

    const hint = getAllAssignmentsDoneText('distribution');

    await showAppModal({
      title: 'Gespeichert',
      message: `Für den Raum "${getRoomLabel(room, Number(distributionRoomSelect.value))}" wurde keine Verteilertechnik hinterlegt.${hint ? '\n\n' + hint : ''}`,
      confirmText: 'OK'
    });
  }

  renderDistributionFloorSelect();
  updateAssignmentPointers();
  updateAssignDistributionButton();
  updateSummary();
}

async function exportPdf() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');

  const fileDate = new Date().toLocaleDateString('de-DE').replaceAll('.', '-');
  const today = new Date().toLocaleDateString('de-DE');
  const logoDataUrl = await loadImageAsDataUrl('logo.png');

  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 15;
  const marginRight = 15;
  const contentWidth = pageWidth - marginLeft - marginRight;

  let y = 52;

  function addHeader() {
    if (logoDataUrl) {
      pdf.addImage(logoDataUrl, 'PNG', 155, 8, 40, 16);
    }

    pdf.setFontSize(8);
    pdf.text([
      'NDF Norddeutsche Flächenheizsysteme GmbH',
      'Raiffeisenstraße 13',
      '21641 Apensen',
      'Tel.: +49 4163 / 910 80 91',
      'www.ndf-gmbh.de'
    ], 155, 28);

    pdf.setDrawColor(220);
    pdf.line(15, 45, 195, 45);

  }

  function newPage() {
    pdf.addPage();
    addHeader();
    y = 52;
  }

  function ensureSpace(requiredHeight) {
    if (y + requiredHeight > pageHeight - 18) {
      newPage();
    }
  }

  function addText(text, x, fontSize = 10, bold = false) {
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setFontSize(fontSize);
    pdf.text(String(text), x, y);
  }

  function addWrappedText(text, x, maxWidth, fontSize = 9, bold = false) {
    pdf.setFont('helvetica', bold ? 'bold' : 'normal');
    pdf.setFontSize(fontSize);

    const lines = pdf.splitTextToSize(String(text || '-'), maxWidth);
    pdf.text(lines, x, y);
    y += lines.length * 4.2;
  }

  function addRoom(room, roomIndex) {
    const roomLabel = getRoomLabel(room, roomIndex);
    const area = Number(String(room.area).replace(',', '.')) || 0;
    const pipe = getRoomPipeLength(room);
    const circuits = getRoomHeatingCircuits(room);
    const thermo = getRoomThermostatRecommendation(room);

    ensureSpace(58);

    const startY = y;

    pdf.setDrawColor(210);
    pdf.rect(marginLeft, y, contentWidth, 52);

    y += 6;
    addText(roomLabel, marginLeft + 3, 10, true);
    y += 5;

    addWrappedText(`Funktion: ${room.function || '-'}`, marginLeft + 3, contentWidth - 6);
    addWrappedText(`VA: ${room.spacing || '-'}`, marginLeft + 3, contentWidth - 6);
    addWrappedText(`Fläche: ${formatQuantity(area)} m²`, marginLeft + 3, contentWidth - 6);

    addWrappedText('Empfohlen:', marginLeft + 3, contentWidth - 6, 9, true);
    addWrappedText(`Rohrlänge: ${formatQuantity(pipe)} m`, marginLeft + 3, contentWidth - 6);
    addWrappedText(`Heizkreise: ${circuits}`, marginLeft + 3, contentWidth - 6);
    addWrappedText(`Raumthermostat: ${thermo}`, marginLeft + 3, contentWidth - 6);

    y += 2;
    addWrappedText(`System: ${getSystemSummaryText(room)}`, marginLeft + 3, contentWidth - 6);
    addWrappedText(`Thermostat: ${getThermostatSummaryText(room)}`, marginLeft + 3, contentWidth - 6);
    addWrappedText(`Verteiler: ${getDistributionSummaryText(room)}`, marginLeft + 3, contentWidth - 6);
    addWrappedText(`Zusatzdämmung: ${getExtraInsulationSummaryText(room)}`, marginLeft + 3, contentWidth - 6);

    const endY = Math.max(y + 3, startY + 52);
    y = endY + 5;
  }

  function getPdfProducts() {
    if (state.calculatedProducts && state.calculatedProducts.length) {
      return state.calculatedProducts.filter(p => p.selected !== false);
    }

    return calculateProducts().filter(p => p.selected !== false);
  }

  addHeader();

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('Konfiguration Fußbodenheizung', marginLeft, y);
  y += 9;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Datum: ${today}`, marginLeft, y);
  y += 12;

  const projectTypeText =
    state.projectType === 'neubau' ? 'Neubau' :
      state.projectType === 'sanierung' ? 'Sanierung' :
        '-';

  const brandText =
    state.brand === 'handelsmarke' ? 'Handelsmarke' :
      state.brand === 'uponor' ? 'Uponor' :
        state.brand === 'roth' ? 'Roth' :
          '-';

  const plzValue = document.getElementById('plz').value.trim() || '-';

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('Konfiguration', marginLeft, y);
  y += 8;

  pdf.setFontSize(9);
  pdf.text(`Projekt: ${state.projectReference}`, marginLeft, y);
  y += 5;
  pdf.text(`Projektart: ${projectTypeText}`, marginLeft, y);
  pdf.text(`Marke: ${brandText}`, 105, y);
  y += 5;
  pdf.text(`Wärmeerzeuger: ${state.heatSource || '-'}`, marginLeft, y);
  const manualKm = getManualDistanceKm();
  const distanceEntry = getDistanceEntryForPlz(plzValue);

  let pdfDistanceText = `PLZ: ${plzValue}`;

  if (distanceEntry) {
    pdfDistanceText += ` / Entfernung: ${formatQuantity(distanceEntry.km)} km`;
  } else if (manualKm > 0) {
    pdfDistanceText += ` / Manuelle km: ${formatQuantity(manualKm)} km`;
  }

  pdf.text(pdfDistanceText, 105, y);
  y += 12;

  pdf.setFontSize(13);
  pdf.text('Räume', marginLeft, y);
  y += 8;

  state.floors.forEach((floor, floorIndex) => {
    ensureSpace(14);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(getFloorLabel(floor, floorIndex), marginLeft, y);
    y += 7;

    floor.rooms.forEach((room, roomIndex) => {
      addRoom(room, roomIndex);
    });
  });

  const products = getPdfProducts();
  ensureSpace(30);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('Artikel', marginLeft, y);
  y += 8;

  const colX = {
    article: marginLeft,
    description: 42,
    qty: 132,
    unitPrice: 152,
    total: 174
  };

  function addTableHeader() {
    ensureSpace(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);

    pdf.text('Artikel-Nr.', colX.article, y);
    pdf.text('Beschreibung', colX.description, y);
    pdf.text('Menge', colX.qty, y);
    pdf.text('EP', colX.unitPrice, y);
    pdf.text('Gesamt', colX.total, y);

    y += 3;
    pdf.line(marginLeft, y, 195, y);
    y += 5;
  }

  addTableHeader();

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);

  products.forEach((p) => {
    const descriptionLines = pdf.splitTextToSize(p.description || '-', 84);
    const rowHeight = Math.max(7, descriptionLines.length * 4 + 3);

    if (y + rowHeight > pageHeight - 22) {
      newPage();
      addTableHeader();
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
    }

    pdf.text(p.articleNumber || '-', colX.article, y);
    pdf.text(descriptionLines, colX.description, y);
    pdf.text(`${formatQuantity(p.quantity)} ${p.unit}`, colX.qty, y);
    pdf.text(formatEuro(p.unitPrice), colX.unitPrice, y);
    pdf.text(formatEuro(p.totalPrice), colX.total, y);

    y += rowHeight;
  });

  const total = products.reduce((sum, p) => sum + p.totalPrice, 0);

  ensureSpace(18);
  y += 4;
  pdf.line(marginLeft, y, 195, y);
  y += 7;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text(`Gesamtsumme: ${formatEuro(total)}`, marginLeft, y);
  y += 12;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text('Alle Preise sind unverbindliche Verrechnungspreise ohne Mehrwertsteuer.', marginLeft, y);

  function addTechnicalRecommendationToPdf() {
    const result = calculateTechnicalRecommendation();

    if (!result || !result.rooms || !result.rooms.length) {
      return;
    }

    ensureSpace(45);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text('Technische Empfehlung / Vorbemessung', marginLeft, y);
    y += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    const hintText = pdf.splitTextToSize(
      'Die folgenden Werte dienen ausschließlich der überschlägigen Vorbemessung. Eine normgerechte Heizlastberechnung, Heizflächenauslegung und Berechnung für den hydraulischen Abgleich kann separat beauftragt werden.',
      175
    );

    pdf.text(hintText, marginLeft, y);
    y += hintText.length * 4 + 6;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('Grundlagen der Empfehlung', marginLeft, y);
    y += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    const basisLines = [
      `Gebäudetyp: ${result.basis.buildingLabel}`,
      `Heizlastannahme: ca. ${result.basis.heatLoadPerM2} W/m²`,
      `Spreizung: ca. ${result.basis.deltaT} K`,
      `max. Heizkreislänge: ca. ${result.basis.maxCircuitLength} m`,
      `Wärmeerzeuger: ${result.basis.heatSource}`,
      `empf. Vorlauf: ca. ${result.basis.flowTemperature} °C`,
      `VA 100: ca. ${formatQuantity(state.recommendation.pipeMeterVa100)} m/m²`,
      `VA 150: ca. ${formatQuantity(state.recommendation.pipeMeterVa150)} m/m²`,
      `VA 200: ca. ${formatQuantity(state.recommendation.pipeMeterVa200)} m/m²`
    ];

    basisLines.forEach((line) => {
      ensureSpace(5);
      pdf.text(line, marginLeft, y);
      y += 4;
    });

    y += 4;

    ensureSpace(30);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('Gesamtempfehlung', marginLeft, y);
    y += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    const totalLines = [
      `beheizte Fläche: ${formatQuantity(result.totals.totalArea)} m²`,
      `Rohrlänge: ${formatQuantity(result.totals.totalPipeLength)} m`,
      `Heizkreise: ${result.totals.totalCircuits}`,
      `Heizlast: ca. ${formatQuantity(result.totals.totalHeatLoad / 1000)} kW`,
      `Volumenstrom: ca. ${formatQuantity(result.totals.totalFlowRate)} l/h`,
      `Verteiler: ${result.totals.distributor}`
    ];

    totalLines.forEach((line) => {
      ensureSpace(5);
      pdf.text(line, marginLeft, y);
      y += 4;
    });

    y += 6;

    ensureSpace(25);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text('Raumweise Empfehlung', marginLeft, y);
    y += 6;

    pdf.setFontSize(7);
    pdf.text('Etage', marginLeft, y);
    pdf.text('Raum', 42, y);
    pdf.text('Fläche', 78, y);
    pdf.text('VA', 98, y);
    pdf.text('Rohr', 113, y);
    pdf.text('HK', 132, y);
    pdf.text('Heizlast', 143, y);
    pdf.text('Volumen', 165, y);
    pdf.text('je HK', 185, y);
    y += 3;
    pdf.line(marginLeft, y, 195, y);
    y += 5;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);

    result.rooms.forEach((room) => {
      ensureSpace(7);

      pdf.text(String(room.floor || '-').slice(0, 18), marginLeft, y);
      pdf.text(String(room.room || '-').slice(0, 18), 42, y);
      pdf.text(`${formatQuantity(room.area)} m²`, 78, y);
      pdf.text(room.spacing || '-', 98, y);
      pdf.text(`${formatQuantity(room.pipeLength)} m`, 113, y);
      pdf.text(String(room.circuits), 132, y);
      pdf.text(`${formatQuantity(room.heatLoad)} W`, 143, y);
      pdf.text(`${formatQuantity(room.flowRate)} l/h`, 165, y);
      pdf.text(`${formatQuantity(room.flowRatePerCircuit || 0)} l/h`, 185, y);

      y += 5;
    });

    y += 6;

    ensureSpace(18);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);

    const hydraulicHint = pdf.splitTextToSize(
      'Hinweis zum hydraulischen Abgleich: Die Werte je HK dienen als überschlägige Einstellempfehlung am Heizkreisverteiler. Eine verbindliche Ventilvoreinstellung und hydraulische Berechnung unter Berücksichtigung von Rohrlängen, Druckverlusten, Armaturen, Pumpenkennlinie und Verteilerkomponenten kann separat beauftragt werden.',
      175
    );

    pdf.text(hydraulicHint, marginLeft, y);
    y += hydraulicHint.length * 4;
  }

  y += 12;
  addTechnicalRecommendationToPdf();

  const pageCount = pdf.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);

    // Seitenzahl unten rechts
    pdf.setFontSize(9);
    pdf.text(
      `Seite ${i} von ${pageCount}`,
      195,
      290,
      { align: 'right' }
    );
  }

  pdf.save(`Konfiguration-Fußbodenheizung ${fileDate}.pdf`);
}

function loadImageAsDataUrl(src) {
  return fetch(src)
    .then(response => response.blob())
    .then(blob => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    }))
    .catch(() => '');
}

function togglePointer(pointerA, pointerB, show) {
  pointerA?.classList.toggle('hidden', !show);
  pointerB?.classList.toggle('hidden', !show);
}

function updateAssignmentPointers() {
  togglePointer(
    systemPointerFloor,
    systemPointerRoom,
    state.currentStep === 6 && hasOpenSystemAssignments()
  );

  togglePointer(
    thermostatPointerFloor,
    thermostatPointerRoom,
    state.currentStep === 7 && hasOpenThermostatAssignments()
  );

  togglePointer(
    distributionPointerFloor,
    distributionPointerRoom,
    state.currentStep === 8 && hasOpenDistributionAssignments()
  );

  togglePointer(
    extraInsulationPointerFloor,
    extraInsulationPointerRoom,
    state.currentStep === 9 && hasOpenExtraInsulationAssignments()
  );
}

function getNextRequirementText() {
  if (canProceedToNextStep()) return '';

  if (state.currentStep === 1) {
    if (state.projectType === 'neubau' && !state.brand) {
      return 'Bitte wählen Sie eine Marke aus.';
    }
    return 'Bitte wählen Sie eine Projektart aus.';
  }

  if (state.currentStep === 2) {
    return 'Bitte wählen Sie einen Wärmeerzeuger oder „Keine Angabe“ aus.';
  }

  if (state.currentStep === 3) {
    return 'Bitte geben Sie eine gültige Postleitzahl ein. Falls diese nicht gefunden wird, tragen Sie die Entfernung zu NDF GmbH 21641 Apensen manuell ein.';
  }

  if (state.currentStep === 4) {
    return 'Bitte legen Sie mindestens einen Raum mit einer Fläche größer 0 m² an.';
  }

  if (state.currentStep === 6) {
    return 'Bitte weisen Sie allen beheizten Räumen ein System zu.';
  }

  if (state.currentStep === 7) {
    return 'Bitte wählen Sie „Nein“ oder weisen Sie allen beheizten Räumen ein Thermostat zu.';
  }

  if (state.currentStep === 8) {
    return 'Bitte wählen Sie „Nein“ oder weisen Sie allen beheizten Räumen Verteilertechnik zu.';
  }

  if (state.currentStep === 9) {
    return 'Bitte wählen Sie „Nein“ oder weisen Sie allen beheizten Räumen Zusatzdämmung zu.';
  }

  return 'Bitte vervollständigen Sie die Eingaben, bevor Sie fortfahren.';
}

function updateFinalCheck() {
  const roomsCount = state.floors.reduce((sum, floor) => sum + floor.rooms.length, 0);
  const servicesText = state.services.length ? state.services.join(', ') : 'Keine zusätzlichen Dienstleistungen gewählt';
  const manualDistributionEntries = getManualDistributionEntries();
  const regulationEntries = getRegulationEntries();
  const estrichRangeEntries = getEstrichRangeEntries();
  const estrichAdditiveEntries = getEstrichAdditiveEntries();
  const dryConstructionEntries = getDryConstructionEntries();

  finalCheck.innerHTML = `
    <div><strong>Projekt</strong>${state.projectReference || 'Keine Angabe'}</div>  
    <div><strong>Projekt:</strong> ${summaryProjectType.textContent}${state.projectType === 'neubau' ? ' / ' + summaryBrand.textContent : ''}</div>
    <div><strong>Wärmeerzeuger:</strong> ${summaryHeatSource.textContent}</div>
    <div><strong>PLZ:</strong> ${summaryPlz.textContent}</div>
    <div><strong>System:</strong> ${getSystemValue() || 'Keine Auswahl'}, ${getCheckedValue('wlg')}, ${getCheckedValue('insulationThickness')}</div>
    <div><strong>Rohr:</strong> ${getCheckedValue('pipeType')} / ${getCheckedValue('pipeSize')}</div>
    <div><strong>Estrich:</strong> ${estrichRangeEntries.length ? estrichRangeEntries.join(', ') : 'Keine Auswahl'}</div>
    <div><strong>Zusatzmittel:</strong> ${estrichAdditiveEntries.length ? estrichAdditiveEntries.join(', ') : 'Keine Auswahl'}</div>
    <div><strong>Trockenbau:</strong> ${dryConstructionEntries.length ? dryConstructionEntries.join(', ') : 'Keine Auswahl'}</div>
    <div><strong>Thermostat:</strong> ${state.thermostatEnabled === 'nein' ? 'Kein Thermostat' : state.thermostat}</div>
    <div><strong>Verteilerschrank-Art:</strong> ${getCheckedValue('cabinetMounting')}</div>
    <div><strong>Verteiler Menge & Typ:</strong> ${state.distributionMode === 'auto' ? 'Automatische Ermittlung' : (manualDistributionEntries.length ? manualDistributionEntries.join(', ') : 'Keine manuelle Eingabe')}</div>
    <div><strong>Regeltechnik:</strong> ${getCheckedValue('regulationVoltage')} / ${regulationEntries.length ? regulationEntries.join(', ') : 'Keine Zusatzkomponenten'}</div>
    <div><strong>Zusatzdämmung:</strong> ${state.extraInsulationEnabled === 'nein' ? 'Keine' : `${getCheckedValue('extraInsulation')} / ${getCheckedValue('extraInsulationWlg')} / ${getCheckedValue('extraInsulationThickness')}`}</div>
    <div><strong>Etagen / Räume:</strong> ${state.floors.length} / ${roomsCount}</div>
    <div><strong>Dienstleistungen:</strong> ${servicesText}</div>
  `;
}

function addRoomFromFloorplan(floorIndex, roomData) {
  const floor = state.floors[floorIndex];
  if (!floor) return false;

  const newRoom = createRoom();

  newRoom.name = roomData.name || '';
  newRoom.function = roomData.function || 'Wohnraum';
  newRoom.temperature =
    Number(roomData.temperature) ||
    (newRoom.function === 'Bad' ? 24 : 20);
  newRoom.spacing = roomData.spacing || 'VA 150';
  newRoom.area = roomData.area || '';
  newRoom.estrich = roomData.estrich || 'ja';
  newRoom.floorCovering = roomData.floorCovering || 'Fliesen';
  newRoom.floorplan = roomData.floorplan || newRoom.floorplan;

  floor.rooms.push(newRoom);

  renderFloors();
  renderTechnicalRecommendation();
  updateSummary();

  return true;
}

function deleteRoomFromFloorplan(floorIndex, roomIndex) {
  const floor = state.floors[floorIndex];
  if (!floor || !floor.rooms[roomIndex]) return false;

  floor.rooms.splice(roomIndex, 1);

  renderFloors();
  renderTechnicalRecommendation();
  updateSummary();
  updateNextButtonAndStepHint();

  return true;
}

function addFloorFromFloorplan(floorName) {
  const newFloor = createFloor();

  newFloor.name = floorName || `Etage ${state.floors.length + 1}`;
  newFloor.rooms = [];

  state.floors.push(newFloor);

  renderFloors();
  renderTechnicalRecommendation();
  updateSummary();

  return {
    name: newFloor.name,
    rooms: []
  };
}

function deleteAllRoomsFromFloorplan(floorIndex) {
  const floor = state.floors[floorIndex];
  if (!floor) return false;

  floor.rooms = [];

  renderFloors();
  renderTechnicalRecommendation();
  updateSummary();
  updateNextButtonAndStepHint();

  return true;
}

function updateRoomFloorplanFromWindow(floorIndex, roomIndex, floorplanData) {
  const room = state.floors[floorIndex]?.rooms[roomIndex];
  if (!room) return false;

  room.floorplan = {
    ...(room.floorplan || {}),
    ...floorplanData
  };

  renderFloors();
  renderTechnicalRecommendation();
  updateSummary();

  return true;
}

function updateDistributorFromWindow(floorIndex, distributorData) {
  const floor = state.floors[floorIndex];
  if (!floor) return false;

  floor.floorplanDistributor = distributorData;

  renderFloors();
  renderTechnicalRecommendation();
  updateSummary();

  return true;
}

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
  }

  .room.heated-1 { background: #ecfdf3; }
  .room.heated-2 { background: #fff7d6; }
  .room.heated-3 { background: #fde8e8; }
  .room.unheated { background: #f1f5f9; }

  .room-label {
    padding: 8px;
    font-size: 13px;
    line-height: 1.35;
  }

  .room-label strong {
    display: block;
    font-size: 15px;
    margin-bottom: 3px;
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

.workspace.draw-mode {
  cursor: crosshair;
}

.draw-preview {
  position: absolute;
  border: 3px dashed #0066cc;
  background: rgba(0, 102, 204, 0.12);
  pointer-events: none;
  z-index: 20;
  overflow: hidden;
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
  opacity: 0.42;
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

.hidden {
  display: none !important;
}
</style>
</head>
<body>
<header>
  <h1>Schematischer Grundriss</h1>
  <div class="toolbar">
<button id="moveModeBtn" onclick="setMode('move')" class="mode-btn active-mode">Raum verschieben</button>
<button id="drawModeBtn" onclick="setMode('draw')" class="mode-btn">Raum zeichnen</button>
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
  <div id="floorOverview"></div>
  <div id="roomCards"></div>
</aside>
</div>

<script>
const floorData = ${JSON.stringify(floorData)};
let activeFloorIndex = 0;
let selectedRoomIndex = null;
let mode = 'move';
let drag = null;
let resize = null;
let draw = null;
let modeCursorLabel = null;
let distributorGhost = null;
let distributorDrag = null;
const METER_TO_PIXEL = 42;

function getRoomSize(room) {
  const area = Math.max(Number(room.area) || 8, 4);
  const ratio = 1.35;

  const widthM = Math.sqrt(area * ratio);
  const heightM = area / widthM;

  return {
    width: widthM * METER_TO_PIXEL,
    height: heightM * METER_TO_PIXEL
  };
}

function getRoomDimensions(room) {
  const widthPx = Number(room.floorplan?.width) || 1;
  const heightPx = Number(room.floorplan?.height) || 1;

  const widthM = widthPx / METER_TO_PIXEL;
  const heightM = heightPx / METER_TO_PIXEL;

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
  mode = newMode;

  document.getElementById('moveModeBtn')?.classList.toggle('active-mode', mode === 'move');
  document.getElementById('drawModeBtn')?.classList.toggle('active-mode', mode === 'draw');
  document.getElementById('doorModeBtn')?.classList.toggle('active-mode', mode === 'door');
  document.getElementById('distributorModeBtn')?.classList.toggle('active-mode', mode === 'distributor');

  document.getElementById('workspace')?.classList.toggle('draw-mode', mode === 'draw');
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
}

function createModeCursorLabel(text) {
  modeCursorLabel = document.createElement('div');
  modeCursorLabel.className = 'mode-cursor-label';
  modeCursorLabel.textContent = text;
  document.body.appendChild(modeCursorLabel);
}

function createDistributorGhost() {
  distributorGhost = document.createElement('div');
  distributorGhost.className = 'distributor-ghost';
  distributorGhost.textContent = 'V';
  document.body.appendChild(distributorGhost);
}

function removeModeHelpers() {
  if (modeCursorLabel) {
    modeCursorLabel.remove();
    modeCursorLabel = null;
  }

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

function renderFloor() {
  renderTabs();

  const workspace = document.getElementById('workspace');
  const floor = floorData[activeFloorIndex];

  workspace.innerHTML = '';
  selectedRoomIndex = null;

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

    div.className = 'room ' + circuitClass;
    div.dataset.roomIndex = roomIndex;
    div.style.left = room.floorplan.x + 'px';
    div.style.top = room.floorplan.y + 'px';
    div.style.width = room.floorplan.width + 'px';
    div.style.height = room.floorplan.height + 'px';

    const dimensions = getRoomDimensions(room);

div.innerHTML =
  '<div class="dimension-cross">' +
    '<div class="dim-line dim-horizontal"></div>' +
    '<div class="dim-line dim-vertical"></div>' +
    '<div class="dim-text dim-width">' + dimensions.widthM + ' m</div>' +
    '<div class="dim-text dim-height">' + dimensions.heightM + ' m</div>' +
  '</div>' +
  '<div class="room-label">' +
    '<strong>' + room.name + '</strong>' +
  '</div>';

    if (room.floorplan.doorEnabled) {
  div.appendChild(createDoor(room));
}

['nw', 'ne', 'sw', 'se'].forEach((pos) => {
  const handle = document.createElement('div');
  handle.className = 'resize-handle ' + pos;
  handle.dataset.resize = pos;
  handle.addEventListener('mousedown', startResize);
  div.appendChild(handle);
});

div.addEventListener('mousedown', startDrag);
div.addEventListener('click', (e) => {
  if (e.target.classList.contains('resize-handle')) return;

  if (mode === 'door') {
    e.stopPropagation();
    openDoorDialog(roomIndex);
    return;
  }

  selectRoom(roomIndex);
});

    workspace.appendChild(div);
  });

    renderDistributor();
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

    if (
      drawRoomSpacing.value === 'VA 200' &&
      window.opener?.state?.heatSource === 'Wärmepumpe'
    ) {
      drawRoomSpacing.value = 'VA 150';
    }
  }

  updateDrawUnheatedWarning();
});

updateDrawUnheatedWarning();

  document.getElementById('cancelDrawFloor').addEventListener('click', () => {
    backdrop.remove();
  });

  document.getElementById('saveDrawFloor').addEventListener('click', () => {
    const floorName = document.getElementById('drawFloorName').value;

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
      alert('Die Etage konnte nicht im Haupt-Konfigurator angelegt werden.');
      return;
    }

    floorData.push(newFloor);
    activeFloorIndex = floorData.length - 1;
    selectedRoomIndex = null;

    backdrop.remove();
    renderFloor();
  });
}

function startDrag(e) {
if (mode !== 'move') return;
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
if (mode !== 'move') return;
  e.stopPropagation();

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

  let newWidthM = newWidthPx / METER_TO_PIXEL;
  newWidthM = Math.max(minWidthM, Math.min(maxWidthM, newWidthM));

  const areaM2 = Math.max(Number(resize.room.area) || 1, 1);
  const newHeightM = areaM2 / newWidthM;

  newWidthPx = newWidthM * METER_TO_PIXEL;
  const newHeightPx = newHeightM * METER_TO_PIXEL;

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

function startDraw(e) {
  if (mode !== 'draw') return;
  if (e.target !== document.getElementById('workspace')) return;

  const workspace = document.getElementById('workspace');
  const rect = workspace.getBoundingClientRect();

  const startX = e.clientX - rect.left + workspace.scrollLeft;
  const startY = e.clientY - rect.top + workspace.scrollTop;

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

  const x = Math.round(rawX / 10) * 10;
  const y = Math.round(rawY / 10) * 10;
  const width = Math.round(rawWidth / 10) * 10;
  const height = Math.round(rawHeight / 10) * 10;

  draw.preview.style.left = x + 'px';
  draw.preview.style.top = y + 'px';
  draw.preview.style.width = width + 'px';
  draw.preview.style.height = height + 'px';

  const widthM = width / METER_TO_PIXEL;
  const heightM = height / METER_TO_PIXEL;
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

  openDrawRoomDialog({ x, y, width, height });
}

function calculateDrawnArea(widthPx, heightPx) {
  const widthM = widthPx / METER_TO_PIXEL;
  const heightM = heightPx / METER_TO_PIXEL;
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
  const area = calculateDrawnArea(shape.width, shape.height);
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
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
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

renderFloor();
setMode('move');

document.getElementById('workspace').addEventListener('mousedown', startDraw);
document.getElementById('workspace').addEventListener('click', (e) => {
  if (mode !== 'distributor') return;

  const workspace = document.getElementById('workspace');
  const rect = workspace.getBoundingClientRect();

  const x = Math.round((e.clientX - rect.left + workspace.scrollLeft - 21) / 10) * 10;
  const y = Math.round((e.clientY - rect.top + workspace.scrollTop - 21) / 10) * 10;

  const distributor = { x, y };

  const saved =
    window.opener &&
    typeof window.opener.updateDistributorFromWindow === 'function'
      ? window.opener.updateDistributorFromWindow(activeFloorIndex, distributor)
      : false;

  if (!saved) {
    alert('Der Verteiler konnte nicht im Haupt-Konfigurator gespeichert werden.');
    return;
  }

  floorData[activeFloorIndex].distributor = distributor;

  setMode('move');
  renderFloor();
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Delete' && e.key !== 'Entf' && e.key !== 'Backspace') return;

  e.preventDefault();

  const activeTag = document.activeElement?.tagName?.toLowerCase();
  if (activeTag === 'input' || activeTag === 'select' || activeTag === 'textarea') return;

  deleteSelectedRoom();
});

document.addEventListener('mousemove', moveModeHelpers);
</script>
</body>
</html>
  `);
  win.document.close();
}

systemFloorSelect.addEventListener('change', () => {
  state.selectedSystemFloorIndex = Number(systemFloorSelect.value);
  renderSystemRoomSelect();
  updateSummary();
});

systemRoomSelect.addEventListener('change', () => {
  const room = getSelectedSystemRoom();
  setSystemSelection(room?.assignments?.system || null);
  updateAssignFloorSystemButton();
  updateSummary();
});

assignFloorSystemBtn.addEventListener('click', () => {
  assignSystemToSelectedFloor();
});

if (assignFloorSystemToFloorBtn) {
  assignFloorSystemToFloorBtn.addEventListener('click', () => {
    assignSystemToSelectedEtage();
  });
}

const openFloorplanBtn = document.getElementById('openFloorplanBtn');

if (openFloorplanBtn) {
  openFloorplanBtn.addEventListener('click', () => {
    renderTechnicalRecommendation();
    openFloorplanWindow();
  });
}

document.querySelectorAll('#projectTypeChoices .choice-card').forEach((card) => {
  card.addEventListener('click', () => {
    const newProjectType = card.dataset.type;

    if (state.projectType && state.projectType !== newProjectType) {
      resetFromStep5Forward();

      // Nach Wechsel der Projektart nur ab System neu konfigurieren
      state.maxUnlockedStep = Math.min(state.maxUnlockedStep, 6);
    }

    state.projectType = newProjectType;

    if (newProjectType === 'neubau') {
      state.brand = 'handelsmarke';
    }

    if (newProjectType === 'sanierung') {
      state.brand = '';
    }

    renderProjectType();
    renderBrand();
    updateSummary();
  });
});

document.querySelectorAll('#brandChoices .choice-card').forEach((card) => {
  card.addEventListener('click', () => {
    state.brand = card.dataset.brand;
    renderBrand();
    updateSummary();
  });
});

document.querySelectorAll('#heatSourceChoices .choice-card').forEach((card) => {
  card.addEventListener('click', () => {
    state.heatSource = card.dataset.heatSource;

    /*
     * Bereits vorhandene Räume korrigieren,
     * falls zuvor VA 200 gewählt war.
     */
    if (state.heatSource === 'Wärmepumpe') {
      state.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          if (room.spacing === 'VA 200') {
            room.spacing =
              room.function === 'Bad'
                ? 'VA 100'
                : 'VA 150';
          }
        });
      });
    }

    renderHeatSource();
    renderFloors();
    renderTechnicalRecommendation();
    updateSummary();
  });
});

document.querySelectorAll('#thermostatChoices .choice-card').forEach((card) => {
  card.addEventListener('click', () => {
    state.thermostat = card.dataset.thermostat;
    renderThermostat();
    updateAssignThermostatButton();
    updateSummary();
  });
});

document.querySelectorAll('#thermostatToggleChoices .choice-card').forEach((card) => {
  card.addEventListener('click', () => {
    state.thermostatEnabled = card.dataset.thermostatToggle;

    if (state.thermostatEnabled === 'nein') {
      state.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          room.assignments.thermostat = null;
        });
      });

      renderThermostatToggle();
      updateAssignmentPointers();
      updateSummary();

    }

    renderThermostatToggle();
    renderThermostatFloorSelect();
    updateAssignThermostatButton();
    updateAssignmentPointers();
    updateSummary();
  });
});

document.querySelectorAll('#extraInsulationToggleChoices .choice-card').forEach((card) => {
  card.addEventListener('click', () => {
    state.extraInsulationEnabled = card.dataset.extraInsulationToggle;

    if (state.extraInsulationEnabled === 'nein') {
      state.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          room.assignments.extraInsulation = null;
        });
      });

      renderExtraInsulationToggle();
      updateAssignmentPointers();
      updateSummary();

    }

    renderExtraInsulationToggle();
    renderExtraInsulationFloorSelect();
    updateAssignExtraInsulationButton();
    updateAssignmentPointers();
    updateSummary();
  });
});

document.querySelectorAll('#distributionToggleChoices .choice-card').forEach((card) => {
  card.addEventListener('click', () => {
    state.distributionEnabled = card.dataset.distributionToggle;

    if (state.distributionEnabled === 'nein') {
      state.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          room.assignments.distribution = null;
        });
      });

      renderDistributionToggle();
      updateAssignmentPointers();
      updateSummary();

    }

    renderDistributionToggle();
    renderDistributionMode();
    renderDistributionFloorSelect();
    updateAssignDistributionButton();
    updateAssignmentPointers();
    updateSummary();
  });
});

document.getElementById('startCalculationBtn').addEventListener('click', async () => {
  try {
    if (!state.articleCatalog.length) {
      await loadArticleCatalog();
    }

    if (!state.postcodeDistances.length) {
      await loadPostcodeDistances();
    }

    showResultPage();
  } catch (error) {
    console.error(error);

    await showAppModal({
      title: 'Fehler',
      message: 'Die Artikel- oder PLZ-Daten konnten nicht geladen werden. Bitte prüfen Sie, ob master.csv und german-postgeocodes.csv im Projektordner liegen.',
      confirmText: 'OK'
    });
  }
});

if (savePdfBtn) {
  savePdfBtn.addEventListener('click', exportPdf);
}

if (printResultBtn) {
  printResultBtn.addEventListener('click', () => {
    window.print();
  });
}

backToConfigBtn.addEventListener('click', () => {
  returnToConfiguration();
});

handoverShopBtn.addEventListener('click', async () => {
  const confirmed = await showAppModal({
    title: 'Übermitteln an NDF',
    message: 'Mit Übermitteln an NDF werden die Artikel an NDF gesendet und Sie erhalten in wenigen Tagen ein qualifiziertes Angebot. Sämtliche Eingaben werden dadurch im Konfigurator entfernt. Sind Sie sicher, jetzt an den NDF zu übermitteln?',
    confirmText: 'Ja, übergeben',
    cancelText: 'Abbrechen'
  });

  if (!confirmed) return;

  const productsForShop = state.calculatedProducts.filter((item) => item.selected !== false);

  if (productsForShop.length === 0) {
    await showAppModal({
      title: 'Keine Artikel ausgewählt',
      message: 'Es wurde keine Position für die Übermittlung an NDF ausgewählt.',
      confirmText: 'OK'
    });
    return;
  }

  // Platzhalter: Hier kommt später die echte Shop-Übergabe per API/Formular/URL hin.
  resetAllInputsAfterHandover();

  await showAppModal({
    title: 'Übergabe erfolgreich',
    message: 'Ihre Artikel sind an NDF übermittelt worden, Sie können nun dieses Fenster schließen.',
    confirmText: 'OK'
  });

  lockConfigurator();
});

[
  'system',
  'systemAddon',
  'wlg',
  'insulationThickness',
  'pipeType',
  'pipeSize',
  'extraInsulation',
  'extraInsulationWlg',
  'extraInsulationThickness',
  'cabinetMounting',
  'regulationVoltage'
].forEach(setupSingleChoiceCheckboxGroup);

document.querySelectorAll('input[name="system"]').forEach((checkbox) => {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      document.querySelectorAll('input[name="system"]').forEach((otherCheckbox) => {
        if (otherCheckbox !== checkbox) {
          otherCheckbox.checked = false;
        }
      });
    }

    updateSummary();
  });
});

distributionTypeFields.forEach((field) => {
  field.addEventListener('change', updateSummary);
});

distributionQtyFields.forEach((field) => {
  field.addEventListener('input', updateSummary);
});

regulationCheckboxes.forEach((field) => {
  field.addEventListener('change', () => {
    syncRegulationRules();
    updateSummary();
  });
});

regulationQtyFields.forEach((field) => {
  field.addEventListener('input', updateSummary);
});

estrichRangeCheckboxes.forEach((field) => {
  field.addEventListener('change', () => {
    syncEstrichRangeRules();
    updateSummary();
  });
});

estrichAdditiveCheckboxes.forEach((field) => {
  field.addEventListener('change', () => {
    syncEstrichAdditivesRules();
    updateSummary();
  });
});

dryConstructionCheckboxes.forEach((field) => {
  field.addEventListener('change', () => {
    syncSanierungSystemRules();
    updateSummary();
  });
});

millingSystemCheckboxes.forEach((field) => {
  field.addEventListener('change', () => {
    syncSanierungSystemRules();
    updateSummary();
  });
});

serviceCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', updateSummary);
});

document.getElementById('plz').addEventListener('input', async (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);

  if (e.target.value.length === 5) {
    try {
      await ensurePostcodeDistancesLoaded();
    } catch (error) {
      console.error('PLZ-Daten konnten nicht geladen werden:', error);
    }
  }

  updateManualDistanceVisibility();
  updateSummary();
  updateNextButtonAndStepHint();
});

if (manualDistanceKmInput) {
  manualDistanceKmInput.addEventListener('input', () => {
    updateSummary();
    updateNextButtonAndStepHint();
  });
}

if (projectReferenceInput) {
  projectReferenceInput.addEventListener('input', (e) => {
    state.projectReference = e.target.value.trim();
    updateSummary();
  });
}

document.querySelectorAll('.step-item').forEach((item) => {
  item.addEventListener('click', async () => {
    const targetStep = Number(item.dataset.step);

    if (targetStep === 0 && state.currentStep >= 3) return;
    if (targetStep > state.maxUnlockedStep) return;

    if (targetStep === 1 && state.currentStep > 1) {
      await returnToStep1AndResetFromStep5();
      return;
    }

    showStep(targetStep);
  });
});

prevBtn.addEventListener('click', async () => {
  const targetStep = state.currentStep - 1;

  if (targetStep === 1 && state.currentStep > 1) {
    await returnToStep1AndResetFromStep5();
    return;
  }

  showStep(targetStep);
});

nextBtn.addEventListener('click', async () => {
  if (!canProceedToNextStep()) return;

  const nextStep = state.currentStep + 1;

  if (state.currentStep === 5) {
    await showAppModal({
      title: 'Hinweis zur Raumzuweisung',
      message: 'Im nächsten Schritt weisen Sie jedem beheizten Raum ein System zu. Bitte wählen Sie dazu oben rechts zuerst die Etage und den Raum aus. Nach jeder Zuweisung zeigt der Pfeil 👉 an, welcher Raum als nächstes bearbeitet werden sollte.',
      confirmText: 'OK'
    });
  }

  state.maxUnlockedStep = Math.max(state.maxUnlockedStep, nextStep);
  showStep(nextStep);
});

if (thermostatFloorSelect) {
  thermostatFloorSelect.addEventListener('change', () => {
    thermostatRoomSelect.value = '0';
    renderThermostatRoomSelect();
    updateSummary();
  });
}

if (thermostatRoomSelect) {
  thermostatRoomSelect.addEventListener('change', () => {
    const room = getSelectedThermostatRoom();
    setThermostatSelection(room?.assignments?.thermostat || null);
    updateAssignThermostatButton();
    updateSummary();
  });
}

if (assignThermostatBtn) {
  assignThermostatBtn.addEventListener('click', assignThermostatToRoom);
}

document.querySelectorAll('.thermostat-qty').forEach((input) => {
  input.addEventListener('input', () => {
    updateAssignThermostatButton();
    updateSummary();
  });
});

const addFloorBtn = document.getElementById('addFloorBtn');

if (addFloorBtn) {
  addFloorBtn.onclick = () => {
    state.floors.push(createFloor());
    renderFloors();
    updateSummary();

    const floorCards = document.querySelectorAll('.floor-card');
    const newFloorCard = floorCards[floorCards.length - 1];

    scrollToElement(newFloorCard);
  };
}

if (distributionFloorSelect) {
  distributionFloorSelect.addEventListener('change', () => {
    distributionRoomSelect.value = '0';
    renderDistributionRoomSelect();
    updateSummary();
  });
}

if (distributionRoomSelect) {
  distributionRoomSelect.addEventListener('change', () => {
    const room = getSelectedDistributionRoom();
    setDistributionSelection(room?.assignments?.distribution || null);
    updateAssignDistributionButton();
    updateSummary();
  });
}

if (extraInsulationFloorSelect) {
  extraInsulationFloorSelect.addEventListener('change', () => {
    extraInsulationRoomSelect.value = '0';
    renderExtraInsulationRoomSelect();
    updateSummary();
  });
}

if (extraInsulationRoomSelect) {
  extraInsulationRoomSelect.addEventListener('change', () => {
    const room = getSelectedExtraInsulationRoom();
    setExtraInsulationSelection(room?.assignments?.extraInsulation || null);
    updateAssignExtraInsulationButton();
    updateSummary();
  });
}

if (assignExtraInsulationBtn) {
  assignExtraInsulationBtn.addEventListener('click', assignExtraInsulationToRoom);
}

if (assignExtraInsulationToFloorBtn) {
  assignExtraInsulationToFloorBtn.addEventListener(
    'click',
    assignExtraInsulationToFloor
  );
}

if (assignExtraInsulationNoneBtn) {
  assignExtraInsulationNoneBtn.addEventListener('click', assignExtraInsulationNoneToRoom);
}

document.querySelectorAll('input[name="extraInsulation"], input[name="extraInsulationWlg"], input[name="extraInsulationThickness"]').forEach((input) => {
  input.addEventListener('change', () => {
    updateAssignExtraInsulationButton();
    updateSummary();
  });
});

if (assignDistributionBtn) {
  assignDistributionBtn.addEventListener('click', assignDistributionToRoom);
}

if (assignThermostatNoneBtn) {
  assignThermostatNoneBtn.addEventListener('click', assignThermostatNoneToRoom);
}

if (assignDistributionNoneBtn) {
  assignDistributionNoneBtn.addEventListener('click', assignDistributionNoneToRoom);
}

if (clearAllBtn) {
  clearAllBtn.addEventListener('click', async () => {
    const confirmed = await showAppModal({
      title: 'Alle Eingaben löschen?',
      message: 'Möchten Sie wirklich alle Eingaben löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
      confirmText: 'Ja, löschen',
      cancelText: 'Abbrechen'
    });

    if (!confirmed) return;

    window.location.reload();
  });
}

distributionTypeFields.forEach((field) => {
  field.addEventListener('change', () => {
    updateAssignDistributionButton();
    updateSummary();
  });
});

distributionQtyFields.forEach((field) => {
  field.addEventListener('input', () => {
    updateAssignDistributionButton();
    updateSummary();
  });
});

regulationCheckboxes.forEach((field) => {
  field.addEventListener('change', () => {
    syncRegulationRules();
    updateAssignDistributionButton();
    updateSummary();
  });
});

regulationQtyFields.forEach((field) => {
  field.addEventListener('input', () => {
    updateAssignDistributionButton();
    updateSummary();
  });
});

const startCalculationBtn = document.getElementById('startCalculationBtn');

if (startCalculationBtn) {
  startCalculationBtn.addEventListener('click', () => {
    renderTechnicalRecommendation();
  });
}

[
  recHeatLoadPerM2Input,
  recDeltaTInput,
  recMaxCircuitLengthInput,
  recFlowTemperatureInput,
  recPipeMeterVa100Input,
  recPipeMeterVa150Input,
  recPipeMeterVa200Input,
  recScreedCoverMmInput
].forEach((input) => {
  if (!input) return;

  input.addEventListener('input', () => {
    state.recommendation.heatLoadPerM2 =
      Number(recHeatLoadPerM2Input.value) || getDefaultHeatLoadPerM2();

    state.recommendation.deltaT =
      Number(recDeltaTInput.value) || 5;

    state.recommendation.maxCircuitLength =
      Number(recMaxCircuitLengthInput.value) || 100;

    state.recommendation.flowTemperature =
      Number(recFlowTemperatureInput.value) || getDefaultFlowTemperature();

    state.recommendation.pipeMeterVa100 =
      Number(recPipeMeterVa100Input.value) || 8.8;

    state.recommendation.pipeMeterVa150 =
      Number(recPipeMeterVa150Input.value) || 5.8;

    state.recommendation.pipeMeterVa200 =
      Number(recPipeMeterVa200Input.value) || 4.6;

    state.recommendation.screedCoverMm =
      Number(recScreedCoverMmInput.value) || 45;

    renderTechnicalRecommendation();
    updateSummary();
    updateNextButtonAndStepHint();
  });
});

state.floors = [createFloor()];
renderProjectType();
renderSystemBlocksByProjectType();
renderBrand();
renderPipeOptionsByBrand();
updateSystemInfoTextsByBrand();
renderHeatSource();
renderThermostat();
renderThermostatToggle();
renderExtraInsulationToggle();
renderDistributionMode();
renderDistributionToggle();
renderFloors();
syncEstrichAdditivesRules();
syncEstrichRangeRules();
updateSummary();
showStep(0);