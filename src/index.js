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
    const selectedParkrun = document.getElementById('selected-parkrun');
    const otherParkruns = document.getElementById('other-parkruns');
    const containers = [selectedParkrun, otherParkruns]
    const postcode = target.value;

    showTables(containers);
    clearTables(containers);
    populateSelectedParkrunTable(postcode, selectedParkrun)
    populateOtherParkrunsTable(postcode, otherParkruns);

}

function clearTables(containers) {
    containers.forEach((container) => {
        const table = container.querySelector('table');
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    })
}

function showTables(containers) {
    containers.forEach((div) => {
        div.classList.remove('hidden')
    })
}

function populateSelectedParkrunTable(selectedPostcode, container) {
    const data = courseData.find(item => {
        const parts = item.split(',');
        return parts[2] === selectedPostcode;
    });

    const [ranking, name, postcode, time] = data.split(',');

    const tr = document.createElement('tr');

    [ranking, name, time].forEach(text => {
        const td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
    });

    const tbody = container.querySelector('tbody');
    tbody.appendChild(tr);
}

function populateOtherParkrunsTable(selectedPostcode, container) {
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

        const tbody = container.querySelector('tbody');
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