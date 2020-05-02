const STATE = {
    CHECKED: 'C',
    INDETERMINATE: 'I',
    UNCHECKED: 'U'
};

let context = null;
let mainElement = null;
let unbindWatcherForStatusStorage = null;
let settings = {
    idAsNumber: false,
    watchedElementsSelector: '',
    statusStorageSelector: ''
};

const convertElementValue = (value) => {
    return settings.idAsNumber ? Number(value) : value;
};

const getWatchedElements = () => {
    return document.querySelectorAll(settings.watchedElementsSelector);
}

const setWatcherForStatusStorage = () => {
    if(unbindWatcherForStatusStorage) unbindWatcherForStatusStorage();
    unbindWatcherForStatusStorage = context.$watch(settings.statusStorageSelector, (selected) => {
        checkAllSelected(getWatchedElements());
    });
};

const setMainElementState = (targetState) => {
    if(targetState == STATE.INDETERMINATE) {
        mainElement.indeterminate = true;
    } else {
        if(targetState == STATE.CHECKED) {
            mainElement.checked = true;
        } else {
            mainElement.checked = false;
        }
        mainElement.indeterminate = false;
    }
};

const checkAllSelected = (elementsToCheck) => {
    let allChecked = elementsToCheck.length > 0;
    let nothingChecked = true;
    elementsToCheck.forEach((element) => {
        allChecked = allChecked && element.checked; // will switch to false as soon as the first element is unchecked
        nothingChecked = nothingChecked && !element.checked; // will switch to false as soon as the first element is checked
    });
    let targetState = allChecked ? STATE.CHECKED : (nothingChecked ? STATE.UNCHECKED : STATE.INDETERMINATE);
    setMainElementState(targetState);
};

const updateStatusStorage = (watchedElements) => {
    let newStatus = [];
    let values = [];
    watchedElements.forEach((element) => {
        let value = convertElementValue(element.value)
        values.push(value);
        if(element.checked) {
            newStatus.push(value);
        }
    });
    let untouchedStatus = _.get(context, settings.statusStorageSelector).filter(value => values.indexOf(value) === -1);
    _.set(context, settings.statusStorageSelector, untouchedStatus.concat(newStatus));
};

const mainElementSelectionChanged = () => {
    const watchedElements = getWatchedElements();
    let newState = mainElement.checked;
    watchedElements.forEach((element) => {
        element.checked = newState;
    });
    updateStatusStorage(watchedElements);
};

export default {
    bind(el, binding, vnode) {
        context = vnode.context;
        mainElement = el;
        settings = {
            // use like v-check-all:number="..." if the element value is a number
            idAsNumber: !!binding.modifiers.number,
            // selector for all checkboxes that will be switched/watched by this checkbox
            // Example: v-check-all="{ watchedElementsSelector: 'input[name=id]' }"
            watchedElementsSelector: binding.value.watchedElementsSelector,
            // selector for all checkboxes that will be switched/watched by this checkbox
            // Example: v-check-all="{ statusStorageSelector: 'selected' }"
            statusStorageSelector: binding.value.statusStorageSelector,
        };
        setWatcherForStatusStorage();
        mainElement.addEventListener('change', mainElementSelectionChanged);
        checkAllSelected(getWatchedElements());
    },

    inserted(el, binding, vnode) {
        checkAllSelected(getWatchedElements());
    },

    componentUpdated(el, binding, vnode) {
        checkAllSelected(getWatchedElements());
    },

    unbind(el, binding, vnode) {
        if(unbindWatcherForStatusStorage) unbindWatcherForStatusStorage();
        mainElement.removeEventListener('change', mainElementSelectionChanged);
    }
};
