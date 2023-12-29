function addEntree() {
    const itemInput = document.getElementById('itemInput');
    const entree = itemInput.value.trim();
    if (entree) {
        createButton(entree, 'entree');
        itemInput.value = ''; // Clear the input field
    }
}

function addSide() {
    const itemInput = document.getElementById('itemInput');
    const side = itemInput.value.trim();
    if (side) {
        createButton(side, 'side');
        itemInput.value = ''; // Clear the input field
    }
}
// Runs a series of hardcoded adds, rav - rice, mashed : rav - mashed : beef - rice : beef - rice, mashed
function autofillTicket() {
    // Define the items and their types
    const items = [
        { name: 'Lasagna', type: 'entree' },
        { name: 'Baked Sw Pot', type: 'side' },
        { name: 'Brocc', type: 'side' },
        { name: 'Mashed', type: 'entree' },
        { name: 'Cauliflower', type: 'side' },
        { name: 'Chef Special', type: 'entree' },
        { name: 'Carrots', type: 'side' },
        { name: 'Green Beans', type: 'entree' },
    ];

    // Loop through the items and add them to the preview
    items.forEach(itemInfo => {
        addItemToPreview(itemInfo.name, itemInfo.type);
    });
}


function createButton(item, type) {
    const container = type === 'entree' ? document.getElementById('entreeButtonContainer')
        : document.getElementById('sideButtonContainer');
    const button = document.createElement('button');
    button.textContent = item;
    button.onclick = function () { addItemToPreview(item, type); };
    container.appendChild(button);
}

// Function to add item to the preview board with specific styling
function addItemToPreview(item, type) {
    const preview = document.getElementById('ticketPreview');
    const p = document.createElement('p');
    p.textContent = item;

    if (type === 'entree') {
        p.classList.add('entree'); // Apply special styling for entrees
    } else if (type === 'side') {
        p.classList.add('side'); // Apply special styling for sides
        p.style.textAlign = 'right'; // Align sides to the right
        p.style.marginTop = '0';  // Reduce the margin-top for sides
        p.style.marginBottom = '0'; // Optionally, reduce the margin-bottom
    }
    preview.appendChild(p);
}

// Function to create the daily list as buttons
function createDailyList() {
    const items = [
        ['Pork', 'entree' ],
        ['Noodles', 'side' ],
        ['Mashed', 'side' ],
        ['Fried Chix', 'entree' ],
        ['Mashed', 'side' ],
        ['Chef Special', 'entree' ],
        ['Veg Du Jour', 'side' ],
        ['Green Beans','entree' ],
        ['Carrots','entree' ]
    ];
    // Clear existing buttons in both containers
    document.getElementById('entreeButtonContainer').innerHTML = '';
    document.getElementById('sideButtonContainer').innerHTML = '';

    // Create buttons for each item
    items.forEach(([name, type]) => {
        createButton(name, type);
    });
}



function downloadTicket() {

    function wrapText(text) {
        let lines = [];
        let currentLine = text.slice(0, 19);
    
        for (let i = 19; i < text.length; i += 19) {
            let segment = text.slice(i, i + 19);
            lines.push(currentLine);
            currentLine = segment;
        }
    
        // Push the last segment
        lines.push(currentLine);
    
        return lines;
    }

    const preview = document.getElementById('ticketPreview');
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let previousType = null; // Track the type of the previous items

    // Set canvas size
    canvas.width = 400; // Adjust the width as needed
    canvas.height = 1000; // Increase height to accommodate more items

    // Optional: Set canvas background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initial text settings
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
    let currentHeight = 0;

    for (let i = 0; i < preview.childNodes.length; i++) {
        const node = preview.childNodes[i];
        let text = node.textContent;

        if (node.classList.contains('entree')) {
            if (previousType != null) {
                currentHeight += 8;
                // Add the line after each entree if the previous item was a side
                ctx.fillStyle = '#000'; // Line color
                ctx.fillRect(10, currentHeight + 5, canvas.width - 20, 1); // Draw the line
                currentHeight += 10; // Adjust vertical spacing
                previousType = 'entree'; // Update the previous type
            }
            currentHeight += 12;
            ctx.font = 'bold 50px Helvetica, sans-serif'; // Larger font for entrees
            ctx.textAlign = 'left';
            ctx.fillText(text, 2, currentHeight);
            currentHeight += 84;
        } else {
            text = '\u2022 ' + text; 
            ctx.font = '40px Helvetica, sans-serif'; // Smaller font for sides
            ctx.textAlign = 'right';
            ctx.fillText(text, canvas.width - 4, currentHeight);
            currentHeight += 78;
            previousType = 'side'; // Update the previous type			
        }

        let lines = wrapText(text); // Using the wrapText function
        let timer = 0;
        for (let line of lines) {
            if (timer >= 1) {
                ctx.fillText(line, 2, currentHeight);
                currentHeight += 84; // Increment currentHeight by your line height
                timer = 0;
            }
            else {
                timer +=1;
            }
    
        }

    }

    // Adjust canvas height
    let finalHeight = Math.max(currentHeight, 500);
    if (canvas.height != finalHeight) {
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width;
        newCanvas.height = finalHeight;
        const newCtx = newCanvas.getContext('2d');

        newCtx.drawImage(canvas, 0, 0);
        canvas = newCanvas;
        ctx = newCtx;
    }


    // Convert canvas to image and download
    canvas.toBlob(function (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ticket.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }, 'image/jpeg');
}

// Call the function when the page loads
window.onload = createDailyList;
