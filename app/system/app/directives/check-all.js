const STATE = {
    CHECKED: 'C',
    INDETERMINATE: 'I',
    UNCHECKED: 'U'
};

const storage = {};

const convertElementValue = (value, asNumber) => {
    return asNumber ? Number(value) : value;
};

const getElements = (selector) => {
    return document.querySelectorAll(selector);
};

const setElementState = (element, targetState) => {
    if(targetState == STATE.INDETERMINATE) {
        element.indeterminate = true;
    } else {
        if(targetState == STATE.CHECKED) {
            element.checked = true;
        } else {
            element.checked = false;
        }
        element.indeterminate = false;
    }
};

const checkAllSelected = (mainElement, elementsToCheck) => {
    let allChecked = elementsToCheck.length > 0;
    let nothingChecked = true;
    elementsToCheck.forEach((element) => {
        allChecked = allChecked && element.checked; // will switch to false as soon as the first element is unchecked
        nothingChecked = nothingChecked && !element.checked; // will switch to false as soon as the first element is checked
    });
    let targetState = allChecked ? STATE.CHECKED : (nothingChecked ? STATE.UNCHECKED : STATE.INDETERMINATE);
    setElementState(mainElement, targetState);
};

const setWatcherForStatusStorage = (storageId) => {
    if(storage[storageId].unbindWatcherForStatusStorage) storage[storageId].unbindWatcherForStatusStorage();
    storage[storageId].unbindWatcherForStatusStorage = storage[storageId].context.$watch(storage[storageId].settings.statusStorageSelector, (selected) => {
        checkAllSelected(storage[storageId].mainElement, getElements(storage[storageId].settings.watchedElementsSelector));
    });
};

const updateStatusStorage = (storageId, watchedElements) => {
    let newStatus = [];
    let values = [];
    watchedElements.forEach((element) => {
        let value = convertElementValue(element.value, storage[storageId].settings.idAsNumber);
        values.push(value);
        if(element.checked) {
            newStatus.push(value);
        }
    });
    let untouchedStatus = _.get(storage[storageId].context, storage[storageId].settings.statusStorageSelector).filter(value => values.indexOf(value) === -1);
    _.set(storage[storageId].context, storage[storageId].settings.statusStorageSelector, untouchedStatus.concat(newStatus));
};

const mainElementSelectionChanged = (storageId) => {
    const watchedElements = getElements(storage[storageId].settings.watchedElementsSelector);
    let newState = storage[storageId].mainElement.checked;
    watchedElements.forEach((element) => {
        element.checked = newState;
    });
    updateStatusStorage(storageId, watchedElements);
};

export default {
    bind(el, binding, vnode) {
        // use like v-check-all:<id>="..."
        const storageId = binding.arg;
        if(!storage[storageId]) {
            storage[storageId] = {
                counter: 0,
                unbindWatcherForStatusStorage: null,
                mainElementCallback: () => {
                    mainElementSelectionChanged(storageId);
                }
            };
        }
        storage[storageId].counter++;
        storage[storageId].context = vnode.context;
        storage[storageId].mainElement = el,
        storage[storageId].settings = {
            // use like v-check-all:<id>.number="..." if the element value is a number
            idAsNumber: !!binding.modifiers.number,
            // selector for all checkboxes that will be switched/watched by this checkbox
            // Example: v-check-all:<id>="{ watchedElementsSelector: 'input[name=id]' }"
            watchedElementsSelector: binding.value.watchedElementsSelector,
            // selector for all checkboxes that will be switched/watched by this checkbox
            // Example: v-check-all:<id>="{ statusStorageSelector: 'selected' }"
            statusStorageSelector: binding.value.statusStorageSelector,
        };
        setWatcherForStatusStorage(storageId);
        el.addEventListener('change', storage[storageId].mainElementCallback);
        checkAllSelected(el, getElements(storage[storageId].settings.watchedElementsSelector));
    },

    inserted(el, binding, vnode) {
        checkAllSelected(el, getElements(binding.value.watchedElementsSelector));
    },

    componentUpdated(el, binding, vnode) {
        checkAllSelected(el, getElements(binding.value.watchedElementsSelector));
    },

    unbind(el, binding, vnode) {
        const storageId = binding.arg;
        if(storage[storageId].counter == 1) {
            storage[storageId].unbindWatcherForStatusStorage();
            el.removeEventListener('change', storage[storageId].mainElementCallback);
            delete storage[storageId];
        } else {
            storage[storageId].counter--;
        }
    }
};
