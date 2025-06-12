import { courseData } from './data/courseData.js'
import { coordinatesByPostcode } from './data/coordinatesByPostcode.js';
import haversine from "https://esm.sh/haversine";

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

    const otherParkruns = document.getElementById('other-parkruns');
    otherParkruns.classList.remove('hidden')
}

function populateTable(selectedPostcode) {
    const selectedCoordinates = coordinatesByPostcode[selectedPostcode];
    courseData.forEach(row => {
        const [ranking, name, postcode, time] = row.split(',');
        const coordinates = coordinatesByPostcode[postcode];
        if (!selectedCoordinates || !coordinates) {
            return;
        }
        const splitStart = selectedCoordinates.split(',');
        const splitEnd = coordinates.split(',');

        const start = {
            latitude: Number(splitStart[0]), longitude: Number(splitStart[1])
        }
        const end = {
            latitude: Number(splitEnd[0]), longitude: Number(splitEnd[1])
        }
        const distance = Math.round(haversine(start, end, { unit: 'mile' }))

        const tr = document.createElement('tr');

        [ranking, name, distance, time].forEach(text => {
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