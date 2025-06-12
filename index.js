import { courseData } from './courseData.js'

function addListeners() {
    const parkrunSelect = document.querySelector('#parkrun-select');
    parkrunSelect.addEventListener('change', (event) => {
        const target = event.target;
        handleParkrunChange(target);
    });
}

function handleParkrunChange(target) {
    alert(target.options[target.selectedIndex].textContent);
    alert(target.value);
}

function populateParkrunDropdown() {
    const selectElement = document.getElementById('parkrun-select');

    const sortedData = courseData.sort((a, b) => {
        const nameA = a.split(',')[1].toLowerCase();
        const nameB = b.split(',')[1].toLowerCase();
        return nameA.localeCompare(nameB);
    });

    sortedData.forEach(course => {
        const option = document.createElement('option');
        const splitData = course.split(',');
        option.value = splitData[2];
        option.textContent = splitData[1];
        selectElement.appendChild(option);
    });
}

addListeners();
populateParkrunDropdown();