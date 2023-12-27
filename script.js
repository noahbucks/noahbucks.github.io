let items = ["Chicken pesto", "Rice", "Mustard"];

function addItem() {
    const itemInput = document.getElementById('itemInput');
    const item = itemInput.value.trim();
    if(item) {
        items.push(item);
        itemInput.value = '';
        renderItems();
    }
}

function renderItems() {
    const list = document.getElementById('itemList');
    list.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
    });
}

function downloadList() {
    const text = items.join('\n');
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'shopping_list.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Initialize
renderItems();
