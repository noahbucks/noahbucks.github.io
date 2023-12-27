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
        { name: 'Ravioli', type: 'entree' },
        { name: 'Rice', type: 'side' },
        { name: 'Mashed Potatoes', type: 'side' },
		{ name: 'Ravioli', type: 'entree' },
		{ name: 'Mashed Potatoes', type: 'side' },
        { name: 'Beef Tips', type: 'entree' },
        { name: 'Rice', type: 'side' },
        { name: 'Beef Tips', type: 'entree' },
        { name: 'Rice', type: 'side' },
        { name: 'Mashed Potatoes', type: 'side' }
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
    button.onclick = function() { addItemToPreview(item, type); };
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
    const items = [['Rice', 'side'],['Ravioli', 'entree'], ['Beef Tips', 'entree'], ['Mashed Potatoes', 'side']]; // Modify this list as needed
    const buttonContainer = document.getElementById('buttonContainer');

        // Clear existing buttons in both containers
    document.getElementById('entreeButtonContainer').innerHTML = '';
    document.getElementById('sideButtonContainer').innerHTML = '';

    // Create buttons for each item
    items.forEach(([name, type]) => {
        createButton(name , type);
    });
}



function downloadTicket() {
    const preview = document.getElementById('ticketPreview');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
	let previousType = null; // Track the type of the previous items
	
    // Set canvas size
    canvas.width = 400; // Adjust the width as needed
    canvas.height = 600; // Increase height to accommodate more items

    // Optional: Set canvas background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initial text settings
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
	let currentHeight = 0;
	
    for (let i = 0; i < preview.childNodes.length; i++) {
        const node = preview.childNodes[i];
        const text = node.textContent;

        if (node.classList.contains('entree')) {
			if (previousType === 'side') {
                // Add the line after each entree if the previous item was a side
                ctx.fillStyle = '#000'; // Line color
                ctx.fillRect(10, currentHeight + 5, canvas.width - 20, 1); // Draw the line
                currentHeight += 10; // Adjust vertical spacing
				previousType = 'entree'; // Update the previous type
            }
			currentHeight += 12;
            ctx.font = '54px Playfair Display, serif'; // Larger font for entrees
			ctx.textAlign ='left';
			ctx.fillText(text, 2, currentHeight);
			currentHeight += 54;
        } else {
            ctx.font = '24px Playfair Display, serif'; // Smaller font for sides
			ctx.textAlign = 'right';
			ctx.fillText(text, canvas.width - 2, currentHeight);
			currentHeight += 24;
			previousType = 'side'; // Update the previous type			
		}

    }

    // Convert canvas to image and download
    canvas.toBlob(function(blob) {
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