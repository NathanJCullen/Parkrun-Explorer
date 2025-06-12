import { courseData } from './data/courseData.js'
import { coordinatesByPostcode } from './data/coordinatesByPostcode.js';

function addListeners() {
    const parkrunSelect = document.querySelector('#parkrun-select');
    parkrunSelect.addEventListener('change', (event) => {
        const target = event.target;
        handleParkrunChange(target);
    });
}

function handleParkrunChange(target) {
    const name = target.options[target.selectedIndex].textContent;
    const postcode = target.value;
    populateTable(postcode);
}

function populateTable(postcode) {
    courseData.forEach(row => {
        const [ranking, name, postcode, time] = row.split(',');

        const tr = document.createElement('tr');

        [ranking, name, postcode, time].forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            tr.appendChild(td);
        });

        const tbody = document.querySelector('tbody');
        tbody.appendChild(tr);
    });
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