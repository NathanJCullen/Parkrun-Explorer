import { courseData } from './courseData.js'
import { coordinatesByPostcode } from './coordinatesByPostcode.js';
import haversine from "https://esm.sh/haversine";

const selectedParkrun = document.getElementById('selected-parkrun');
const otherParkruns = document.getElementById('other-parkruns');

let sortBy = 'distance'
let maxDistance;

function addListeners() {
    const parkrunSelect = document.getElementById('parkrun-select');
    parkrunSelect.addEventListener('change', (event) => {
        const target = event.target;
        handleParkrunChange(target);
        sortTable()
    });

    const distanceInput = document.getElementById('distance-input');
    distanceInput.addEventListener('input', (event) => {
        maxDistance = Number(event.target.value);
        updateValidTableRows();
    });

    const sortByRanking = document.getElementById('sort-ranking')
    sortByRanking.addEventListener(('click'), () => {
        sortBy = 'ranking';
        sortTable()
    })

    const sortByDistance = document.getElementById('sort-distance')
    sortByDistance.addEventListener(('click'), () => {
        sortBy = 'distance'
        sortTable()
    })
}

function handleParkrunChange(target) {
    const containers = [selectedParkrun, otherParkruns]
    const postcode = target.value;

    showTables(containers);
    clearTables(containers);
    populateSelectedParkrunTable(postcode, selectedParkrun)
    populateOtherParkrunsTable(postcode, otherParkruns);
    updateValidTableRows();

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

        if (Number.isNaN(distance) || distance === 0) {
            return
        }

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

function sortTable() {
    const tbody = otherParkruns.querySelector('tbody');

    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((rowA, rowB) => {
        const cellsA = rowA.querySelectorAll('td');
        const cellsB = rowB.querySelectorAll('td');

        if (sortBy === 'ranking') {
            return parseInt(cellsA[0].textContent) - parseInt(cellsB[0].textContent);
        } else if (sortBy === 'distance') {
            return parseFloat(cellsA[2].textContent) - parseFloat(cellsB[2].textContent);
        }

        return 0;
    });

    rows.forEach(row => tbody.appendChild(row));
}

function updateValidTableRows() {
    const rows = otherParkruns.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const distance = parseFloat(row.children[2].textContent);
        if (distance > maxDistance) {
            row.style.display = 'none';
        } else {
            row.style.display = 'table-row';
        }
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