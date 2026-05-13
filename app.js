const state = {
  currentStep: 0,
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
  selectedSystemFloorIndex: 0,
  activeSummaryFloorIndex: 0,
  activeSummaryRoomIndex: 0,
  isLocked: false
};

const totalSteps = 11;
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

const appModal = document.getElementById('appModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalOkBtn = document.getElementById('modalOkBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

const shopToken = new URLSearchParams(window.location.search).get('token');
const tokenStorageKey = shopToken ? `petershop-konfigurator-token-used-${shopToken}` : '';

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
    assignThermostatNoneBtn.textContent = 'Nicht erforderlich (gesetzt)';
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
    rooms: [createRoom()]
  };
}

function createRoom() {
  return {
    name: '',
    function: 'Wohnraum',
    spacing: 'VA 150',
    area: '',
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

async function confirmReturnToProjectType(targetStep) {
  if (targetStep === 1 && state.currentStep > 1) {
    const confirmed = await showAppModal({
      title: 'Hinweis',
      message: 'Die Rückkehr zu diesem Schritt bewirkt ein Zurücksetzen sämtlicher Eingaben.',
      confirmText: 'Weiter',
      cancelText: 'Abbrechen'
    });

    if (confirmed) {
      state.projectType = '';
      state.brand = '';
      resetFromProjectTypeForward();
      renderProjectType();
      updateSummary();
    }

    return confirmed;
  }

  return true;
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
  nextBtn.disabled = !canProceedToNextStep();

  if (stepHint) {
    const requirementText = getNextRequirementText();

    stepHint.classList.toggle('hidden', !requirementText);
    stepHint.textContent = requirementText;
  }

  const isSystemStep = state.currentStep === 5;
  const isThermostatStep = state.currentStep === 6;
  const isDistributionStep = state.currentStep === 7;
  const isExtraInsulationStep = state.currentStep === 8;

  assignFloorSystemBtn.classList.toggle('hidden', !isSystemStep);

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
  }

  if (isExtraInsulationStep) {
    renderExtraInsulationFloorSelect();
    updateAssignExtraInsulationButton();
  }

  updateAssignmentPointers();
  scrollToTop();
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

  if (state.currentStep === 5) {
    return allHeatedRoomsHaveSystemAssignment();
  }

  if (state.currentStep === 6) {
    if (state.thermostatEnabled === 'nein') {
      return true;
    }

    if (state.thermostatEnabled === 'ja') {
      return hasAnyThermostatAssignment();
    }

    return false;
  }

  if (state.currentStep === 7) {
    if (state.distributionEnabled === 'nein') {
      return true;
    }

    if (state.distributionEnabled === 'ja') {
      return hasAnyDistributionAssignment();
    }

    return false;
  }

  if (state.currentStep === 8) {
    if (state.extraInsulationEnabled === 'nein') {
      return true;
    }

    if (state.extraInsulationEnabled === 'ja') {
      return hasAnyExtraInsulationAssignment();
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
}

function renderDistributionToggle() {
  document.querySelectorAll('#distributionToggleChoices .choice-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.distributionToggle === state.distributionEnabled);
  });

  const disabled = state.distributionEnabled !== 'ja';

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
  } else {
    summaryDistributionMode.textContent =
      state.distributionMode === 'auto'
        ? 'Automatische Ermittlung'
        : state.distributionMode === 'manual'
          ? 'Manuelle Eingabe'
          : 'Keine Auswahl';
  }
}

function renderExtraInsulationToggle() {
  document.querySelectorAll('#extraInsulationToggleChoices .choice-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.extraInsulationToggle === state.extraInsulationEnabled);
  });

  const disabled = state.extraInsulationEnabled !== 'ja';
  extraInsulationOptions.classList.toggle('disabled-block', disabled);

  extraInsulationOptions.querySelectorAll('input').forEach((input) => {
    input.disabled = disabled;
    if (disabled) input.checked = false;
  });

  if (state.extraInsulationEnabled === 'nein') {
    document.getElementById('summaryExtraInsulation').textContent = 'Keine';
    document.getElementById('summaryExtraInsulationWlg').textContent = '-';
    document.getElementById('summaryExtraInsulationThickness').textContent = '-';
  } else {
    document.getElementById('summaryExtraInsulation').textContent = 'Keine Auswahl';
    document.getElementById('summaryExtraInsulationWlg').textContent = 'Keine Auswahl';
    document.getElementById('summaryExtraInsulationThickness').textContent = 'Keine Auswahl';
  }
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

  if (state.extraInsulationEnabled !== 'ja') {
    assignExtraInsulationBtn.classList.add('hidden');
    assignExtraInsulationNoneBtn.classList.add('hidden');
    return;
  }

  assignExtraInsulationBtn.classList.remove('hidden');
  assignExtraInsulationNoneBtn.classList.remove('hidden');

  if (!room || !roomIsHeated(room)) {
    assignExtraInsulationBtn.disabled = true;
    assignExtraInsulationNoneBtn.disabled = true;
    return;
  }

  const selection = getCurrentExtraInsulationSelection();

  assignExtraInsulationBtn.disabled = !selection;
  assignExtraInsulationNoneBtn.disabled = false;

  assignExtraInsulationBtn.textContent = room.assignments?.extraInsulation && !room.assignments.extraInsulation.none
    ? 'Zusatzdämmung des Raumes aktualisieren'
    : 'Zusatzdämmung dem Raum zuweisen';

  if (room.assignments?.extraInsulation?.none) {
    assignExtraInsulationNoneBtn.textContent = 'Nicht erforderlich (gesetzt)';
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

async function assignExtraInsulationNoneToRoom() {
  const room = getSelectedExtraInsulationRoom();

  if (!room) return;

  room.assignments.extraInsulation = { none: true };

  clearExtraInsulationSelection();

  const hint = getAllAssignmentsDoneText('extraInsulation');

  await showAppModal({
    title: 'Gespeichert',
    message: `Für den Raum "${getRoomLabel(room, Number(extraInsulationRoomSelect.value))}" wurde keine Zusatzdämmung hinterlegt.${hint ? '\n\n' + hint : ''}`,
    confirmText: 'OK'
  });

  renderExtraInsulationFloorSelect();
  updateAssignmentPointers();
  scrollAfterAssignment('extraInsulation');
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

  regulationCheckboxes.forEach((checkbox, index) => {
    const qtyField = regulationQtyFields[index];
    const label = checkbox.closest('.regulation-row');
    const itemName = checkbox.dataset.label;

    let allowed = true;

    if (itemName === 'Regelklemmleiste bis zu 10 Zonen' && voltage !== '230V AC') {
      allowed = false;
    }

    checkbox.disabled = !allowed;

    if (qtyField) {
      qtyField.disabled = !allowed || !checkbox.checked;
    }

    if (!allowed) {
      checkbox.checked = false;
      if (qtyField) qtyField.value = '';
    }

    label?.classList.toggle('disabled-option', !allowed);
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
      const roomSpacingSelect = roomNode.querySelector('.room-spacing');
      const roomAreaInput = roomNode.querySelector('.room-area');
      const removeRoomBtn = roomNode.querySelector('.remove-room-btn');

      roomNameInput.value = room.name;
      roomFunctionSelect.value = room.function;
      roomSpacingSelect.value = room.spacing;
      roomAreaInput.value = room.area;

      roomNameInput.addEventListener('input', (e) => {
        state.floors[floorIndex].rooms[roomIndex].name = e.target.value;
        updateSummary();
      });
      roomFunctionSelect.addEventListener('change', (e) => {
        state.floors[floorIndex].rooms[roomIndex].function = e.target.value;
        updateSummary();
      });
      roomSpacingSelect.addEventListener('change', (e) => {
        state.floors[floorIndex].rooms[roomIndex].spacing = e.target.value;
        updateSummary();
      });
      roomAreaInput.addEventListener('input', (e) => {
        state.floors[floorIndex].rooms[roomIndex].area = e.target.value;
        updateSummary();
      });

      const canRemoveFloor = state.floors.length > 1;

      removeFloorBtn.disabled = !canRemoveFloor;
      removeFloorBtn.classList.toggle('disabled-button', !canRemoveFloor);

      removeFloorBtn.addEventListener('click', () => {
        if (state.floors.length <= 1) return;

        state.floors.splice(floorIndex, 1);
        renderFloors();
        updateSummary();
      });

      const canRemoveRoom = state.floors[floorIndex].rooms.length > 1;

      removeRoomBtn.disabled = !canRemoveRoom;
      removeRoomBtn.classList.toggle('disabled-button', !canRemoveRoom);

      removeRoomBtn.addEventListener('click', () => {
        if (state.floors[floorIndex].rooms.length <= 1) return;

        state.floors[floorIndex].rooms.splice(roomIndex, 1);
        renderFloors();
        updateSummary();
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
  const area = Number(String(room.area).replace(',', '.')) || 0;
  const spacingMm = parseSpacingMm(room.spacing);

  if (area <= 0 || spacingMm <= 0) return 0;

  return (area / spacingMm) * 1000;
}

function getRoomHeatingCircuits(room) {
  const pipeLength = getRoomPipeLength(room);

  if (pipeLength <= 0) return 0;

  return Math.ceil(pipeLength / 120);
}

function getRoomThermostatRecommendation(room) {
  const circuits = getRoomHeatingCircuits(room);

  if (circuits <= 0) return 0;

  return Math.ceil(circuits / 6);
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

        <div class="summary-room-line"><span>Funktion</span><strong>${room.function || '-'}</strong></div>
        <div class="summary-room-line"><span>VA</span><strong>${room.spacing || '-'}</strong></div>
        <div class="summary-room-line"><span>Fläche</span><strong>${formatQuantity(area)} m²</strong></div>

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
  nextBtn.disabled = !canProceedToNextStep();
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

function getAllowedEstrichRangeByArea() {
  const area = getTotalAreaAllRooms();

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
  const allowedRange = getAllowedEstrichRangeByArea();

  estrichRangeCheckboxes.forEach((checkbox) => {
    const label = checkbox.closest('.check-option');
    const isAllowed = checkbox.value === allowedRange;

    checkbox.disabled = !isAllowed;

    if (!isAllowed) {
      checkbox.checked = false;
    }

    label?.classList.toggle('disabled-option', !isAllowed);
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
  getEstrichRangeEntries().forEach((entry) => {
    const estrichRule = ESTRICH_RANGE_ARTICLES.find(rule => rule.value === entry);

    if (estrichRule) {
      const isFlatRate =
        entry === 'Flächen von 10 bis 69 m²' ||
        entry === 'Flächen von 70 bis 109 m²';

      const quantity = isFlatRate ? 1 : totalAreaAllRooms;

      addArticle(products, estrichRule.articleNumber, quantity);
    }
  });

  // Estrich Zusatzmittel Berechnung 65–69
  getEstrichAdditiveEntries().forEach((entry) => {
    const additiveRule = ESTRICH_ADDITIVE_ARTICLES.find(rule => rule.value === entry);

    if (additiveRule) {
      addArticle(products, additiveRule.articleNumber, totalAreaAllRooms);
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
  showStep(9);

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
      Die Artikel wurden an den PeterShop übergeben. Dieser Konfigurator kann mit diesem Token nicht erneut genutzt werden.
    </p>
  `;
}

function checkTokenUsageOnLoad() {
  if (shopToken && localStorage.getItem(tokenStorageKey) === 'used') {
    mainLayout.classList.add('result-mode');
    document.querySelector('.steps').classList.add('hidden');
    document.querySelector('.btn-row').classList.add('hidden');
    document.querySelectorAll('.step-panel').forEach((panel) => panel.classList.remove('active'));

    resultPanel.classList.remove('hidden');
    resultPanel.innerHTML = `
      <h2 class="section-title">Token bereits verwendet</h2>
      <p class="section-subtitle">
        Dieser Konfigurator-Link wurde bereits genutzt. Bitte starten Sie den Konfigurator erneut aus dem PeterShop.
      </p>
    `;

    state.isLocked = true;
  }
}

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

  room.assignments.thermostat = { none: true };

  clearThermostatSelection();

  const hint = getAllAssignmentsDoneText('thermostat');

  await showAppModal({
    title: 'Gespeichert',
    message: `Für den Raum "${getRoomLabel(room, Number(thermostatRoomSelect.value))}" wurde kein Thermostat hinterlegt.${hint ? '\n\n' + hint : ''}`,
    confirmText: 'OK'
  });

  renderThermostatFloorSelect();
  updateAssignmentPointers();
  scrollAfterAssignment('thermostat');
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
    assignDistributionNoneBtn.textContent = 'Nicht erforderlich (gesetzt)';
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

  room.assignments.distribution = { none: true };

  clearDistributionSelection();

  const hint = getAllAssignmentsDoneText('distribution');

  await showAppModal({
    title: 'Gespeichert',
    message: `Für den Raum "${getRoomLabel(room, Number(distributionRoomSelect.value))}" wurde keine Verteilertechnik hinterlegt.${hint ? '\n\n' + hint : ''}`,
    confirmText: 'OK'
  });

  renderDistributionFloorSelect();
  updateAssignmentPointers();
  scrollAfterAssignment('distribution');
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
      'PETER JENSEN GmbH',
      'Borgfelder Straße 19',
      '20537 Hamburg',
      'Tel.: 040 / 25793 - 0',
      'www.peterjensen.de'
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
    state.currentStep === 5 && hasOpenSystemAssignments()
  );

  togglePointer(
    thermostatPointerFloor,
    thermostatPointerRoom,
    state.currentStep === 6 && hasOpenThermostatAssignments()
  );

  togglePointer(
    distributionPointerFloor,
    distributionPointerRoom,
    state.currentStep === 7 && hasOpenDistributionAssignments()
  );

  togglePointer(
    extraInsulationPointerFloor,
    extraInsulationPointerRoom,
    state.currentStep === 8 && hasOpenExtraInsulationAssignments()
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
    return 'Bitte geben Sie eine gültige Postleitzahl ein. Falls diese nicht gefunden wird, tragen Sie die Entfernung zu PETER JENSEN 20537 Hamburg manuell ein.';
  }

  if (state.currentStep === 4) {
    return 'Bitte legen Sie mindestens einen Raum mit einer Fläche größer 0 m² an.';
  }

  if (state.currentStep === 5) {
    return 'Bitte weisen Sie allen beheizten Räumen ein System zu.';
  }

  if (state.currentStep === 6) {
    return 'Bitte wählen Sie „Nein“ oder weisen Sie mindestens einem beheizten Raum ein Thermostat zu.';
  }

  if (state.currentStep === 7) {
    return 'Bitte wählen Sie „Nein“ oder weisen Sie mindestens einem beheizten Raum Verteilertechnik zu.';
  }

  if (state.currentStep === 8) {
    return 'Bitte wählen Sie „Nein“ oder weisen Sie mindestens einem beheizten Raum Zusatzdämmung zu.';
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

document.querySelectorAll('#projectTypeChoices .choice-card').forEach((card) => {
  card.addEventListener('click', () => {
    const newProjectType = card.dataset.type;

    if (state.projectType && state.projectType !== newProjectType) {
      resetFromProjectTypeForward();
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

    renderHeatSource();
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

      state.maxUnlockedStep = Math.max(state.maxUnlockedStep, 7);
      showStep(7);
      return;
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

      state.maxUnlockedStep = Math.max(state.maxUnlockedStep, 9);
      showStep(9);
      return;
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

      state.maxUnlockedStep = Math.max(state.maxUnlockedStep, 8);
      showStep(8);
      return;
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
    title: 'Übergabe an PeterShop',
    message: 'Mit Übergabe an PeterShop werden die Artikel an den PeterShop gesendet und in Ihrem Warenkorb gelegt. Sämtliche Eingaben werden dadurch im Konfigurator entfernt. Sind Sie sicher, jetzt an den PeterShop zu übergeben?',
    confirmText: 'Ja, übergeben',
    cancelText: 'Abbrechen'
  });

  if (!confirmed) return;

  const productsForShop = state.calculatedProducts.filter((item) => item.selected !== false);

  if (productsForShop.length === 0) {
    await showAppModal({
      title: 'Keine Artikel ausgewählt',
      message: 'Es wurde keine Position für die Übergabe an den PeterShop ausgewählt.',
      confirmText: 'OK'
    });
    return;
  }

  // Platzhalter: Hier kommt später die echte Shop-Übergabe per API/Formular/URL hin.
  resetAllInputsAfterHandover();

  await showAppModal({
    title: 'Übergabe erfolgreich',
    message: 'Ihre Artikel sind an Ihren Warenkorb übergeben worden, Sie können nun dieses Fenster schließen und zu PeterShop zurückkehren.',
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
  nextBtn.disabled = !canProceedToNextStep();

  if (stepHint) {
    const requirementText = getNextRequirementText();
    stepHint.classList.toggle('hidden', !requirementText);
    stepHint.textContent = requirementText;
  }
});

if (manualDistanceKmInput) {
  manualDistanceKmInput.addEventListener('input', () => {
    updateSummary();
    nextBtn.disabled = !canProceedToNextStep();

    if (stepHint) {
      const requirementText = getNextRequirementText();
      stepHint.classList.toggle('hidden', !requirementText);
      stepHint.textContent = requirementText;
    }
  });
}

document.querySelectorAll('.step-item').forEach((item) => {
  item.addEventListener('click', () => {
    const targetStep = Number(item.dataset.step);
    if (targetStep <= state.maxUnlockedStep) {
      if (!confirmReturnToProjectType(targetStep)) return;

      if (targetStep === 1 && state.currentStep > 1) {
        resetFromProjectTypeForward();
      }

      showStep(targetStep);
    }
  });
});

prevBtn.addEventListener('click', () => {
  const targetStep = state.currentStep - 1;

  if (!confirmReturnToProjectType(targetStep)) return;

  if (targetStep === 1 && state.currentStep > 1) {
    resetFromProjectTypeForward();
  }

  showStep(targetStep);
});

nextBtn.addEventListener('click', () => {
  if (!canProceedToNextStep()) return;

  const nextStep = state.currentStep + 1;
  if (nextStep > state.maxUnlockedStep) {
    state.maxUnlockedStep = nextStep;
  }

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
checkTokenUsageOnLoad();