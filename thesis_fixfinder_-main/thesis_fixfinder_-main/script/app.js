document.getElementById('secondFloor').style.display = 'none';

function showFloor(floor) {
    const firstFloor = document.getElementById('firstFloor');
    const secondFloor = document.getElementById('secondFloor');
    
    if (floor === 1) {
        firstFloor.style.display = 'block';
        secondFloor.style.display = 'none';
    } else if (floor === 2) {
        firstFloor.style.display = 'none';
        secondFloor.style.display = 'block';
    }
}

function addPathListeners(paths, svgId) {
    const nameLabel = document.getElementById('name');
    const slidingColumn = document.getElementById('slidingColumn');

    paths.forEach(path => {
        path.addEventListener('mouseover', () => {
            nameLabel.style.opacity = '1';
            nameLabel.querySelector('#namep').innerText = `${svgId} - ${path.id}`;
        });

        path.addEventListener('mousemove', (e) => {
            nameLabel.style.left = `${e.pageX + 10}px`;
            nameLabel.style.top = `${e.pageY - 20}px`;
        });

        path.addEventListener('mouseout', () => {
            nameLabel.style.opacity = '0';
        });

        path.addEventListener('click', () => {
            slidingColumn.classList.add('show');
            document.getElementById('pins').innerHTML = `<div class="pin">You clicked on: ${svgId} - ${path.id}</div>`;
        });
    });
}

addPathListeners(document.querySelectorAll('#firstFloor .allPaths'), 'First Floor');
addPathListeners(document.querySelectorAll('#secondFloor .allPaths'), 'Second Floor');

document.getElementById("closeButton").addEventListener("click", function () {
    document.getElementById("slidingColumn").classList.remove("show");
});

let pinPositions = [];

function savePinPositions() {
    try {
        // Store both position and image src
        const positionsWithImages = pinPositions.map(position => {
            const pinElement = document.getElementById(position.pinId);
            const img = pinElement.querySelector('img');
            return {
                ...position,
                imgSrc: img ? img.src : null // Save the image src if it exists
            };
        });
        localStorage.setItem("pinPositions", JSON.stringify(positionsWithImages));
    } catch (e) {
        console.error("Error saving pin positions to localStorage", e);
    }
}

function loadPinPositions() {
    try {
        const savedPositions = JSON.parse(localStorage.getItem("pinPositions"));
        if (savedPositions) {
            savedPositions.forEach(position => {
                const pinElement = document.createElement('div');
                pinElement.classList.add('pin');
                pinElement.style.position = 'absolute';
                pinElement.style.top = position.top;
                pinElement.style.left = position.left;
                pinElement.id = position.pinId;
                document.getElementById("mapContainer").appendChild(pinElement);

                // Create an image element for the pin and set its source
                const img = document.createElement('img');
                img.src = position.imgSrc; // Set the saved image source
                pinElement.appendChild(img);

                // Add click listener to previously loaded pins with options
                pinElement.addEventListener('click', () => {
                    showPinOptions(pinElement, position.pinId);
                });

                // Add the saved position to the current pinPositions array
                pinPositions.push(position);
            });
        }
    } catch (e) {
        console.error("Error loading pin positions from localStorage", e);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const mapContainer = document.getElementById('mapContainer');

    function makeDraggable(pin) {
        let isDragging = false;
        let offsetX, offsetY;

        function onMouseMove(e) {
            if (isDragging) {
                pin.style.position = 'absolute';
                pin.style.left = `${e.clientX - offsetX}px`;
                pin.style.top = `${e.clientY - offsetY}px`;
            }
        }

        function onMouseUp() {
            isDragging = false;

            // Ask for confirmation to fix the position
            const confirmPosition = confirm('Do you want to confirm the pin\'s position?');
            if (confirmPosition) {
                // Fix the position
                pin.style.position = 'absolute';
                const pinId = pin.id;
                pinPositions = pinPositions.filter(p => p.pinId !== pinId);
                pinPositions.push({
                    pinId: pinId,
                    top: pin.style.top,
                    left: pin.style.left
                });
                savePinPositions();

                // Remove drag event listeners to make the position fixed
                pin.removeEventListener('mousedown', onMouseDown);
                pin.removeEventListener('mousemove', onMouseMove);
                pin.removeEventListener('mouseup', onMouseUp);

                // Add the click event for options (it will remain clickable)
                pin.addEventListener('click', () => {
                    showPinOptions(pin, pinId);
                });
            } else {
                // Allow dragging again if the user cancels
                makeDraggable(pin);
            }

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        function onMouseDown(e) {
            isDragging = true;
            offsetX = e.clientX - pin.getBoundingClientRect().left;
            offsetY = e.clientY - pin.getBoundingClientRect().top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }

        pin.addEventListener('mousedown', onMouseDown);
    }

    function clonePin(pin, x, y) {
        const clone = pin.cloneNode(true);
        const pinId = `pin-${Date.now()}`;
        clone.id = pinId;
        clone.style.position = 'absolute';
        clone.style.left = `${x}px`;
        clone.style.top = `${y}px`;
        mapContainer.appendChild(clone);

        // Save the image source along with the position
        const img = clone.querySelector('img');
        const imgSrc = img ? img.src : null;

        // Add the cloned pin's details to the pinPositions array
        pinPositions.push({
            pinId: pinId,
            top: clone.style.top,
            left: clone.style.left,
            imgSrc: imgSrc // Save image source
        });

        savePinPositions();

        makeDraggable(clone);
        // Add click listener to cloned pins with options
        clone.addEventListener('click', () => {
            showPinOptions(clone, pinId);
        });
    }

    function enablePinPlacement(icon) {
        icon.addEventListener('click', function (e) {
            const mapRect = mapContainer.getBoundingClientRect();
            const x = e.clientX - mapRect.left;
            const y = e.clientY - mapRect.top;
            clonePin(icon, x, y);
        });
    }

    enablePinPlacement(cautionIcon);
    enablePinPlacement(cleaningIcon);
    enablePinPlacement(electricalIcon);
    enablePinPlacement(itIcon);
    enablePinPlacement(repairIcon);
    enablePinPlacement(requestIcon);
});

// Show modal with pin options
function showPinOptions(pinElement, pinId) {
    // Check if a modal is already open
    if (document.querySelector('.custom-modal')) {
        return; // If a modal is already present, don't create another one
    }

    // Create modal
    const modal = document.createElement('div');
    modal.classList.add('custom-modal');
    modal.style.position = 'absolute';
    modal.style.top = `${pinElement.getBoundingClientRect().top - 100}px`;
    modal.style.left = `${pinElement.getBoundingClientRect().left}px`;
    modal.style.width = '200px';
    modal.style.height = '177px';
    modal.style.backgroundColor = '#042331';
    modal.style.border = '1px solid #ccc';
    modal.style.borderRadius = '8px';
    modal.style.padding = '10px';
    modal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    
    // Create buttons
    const reportButton = document.createElement('button');
    reportButton.textContent = 'Report';
    const statusButton = document.createElement('button');
    statusButton.textContent = 'Status';
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove Pin';
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';

    modal.appendChild(reportButton);
    modal.appendChild(statusButton);
    modal.appendChild(removeButton);
    modal.appendChild(closeButton);

    // Append modal to body
    document.body.appendChild(modal);

    // Button actions
    reportButton.addEventListener('click', () => {
        openForm(); // Function to open report form (you can define the form display logic here)
        document.body.removeChild(modal);
    });

    statusButton.addEventListener('click', () => {
        window.location.href = '/pages/status.html';
        document.body.removeChild(modal);
    });

    removeButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove this pin?')) {
            const mapContainer = document.getElementById('mapContainer');
            mapContainer.removeChild(pinElement);

            // Remove pin from pinPositions and update localStorage
            pinPositions = pinPositions.filter(p => p.pinId !== pinId);
            savePinPositions();
        }
        document.body.removeChild(modal);
    });

    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Load saved pins from localStorage when the page loads
window.onload = function() {
    loadPinPositions();
};

function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

document.getElementById('reportsButton').addEventListener('click', openForm);
