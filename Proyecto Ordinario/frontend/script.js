// Datos de las armas (simulando la base de datos)
let weapons = [
    // Revólveres
    { name: 'Revólver Schofield', quantity: 1, type: 'revólver' },
    { name: 'Revólver Cattleman', quantity: 1, type: 'revólver' },
    { name: 'Revólver Double-Action', quantity: 1, type: 'revólver' },
    { name: 'Revólver LeMat', quantity: 1, type: 'revólver' },
    { name: 'Revólver Navy', quantity: 1, type: 'revólver' },
    
    // Pistolas
    { name: 'Pistola Volcanic', quantity: 1, type: 'pistola' },
    { name: 'Pistola Mauser', quantity: 1, type: 'pistola' },
    { name: 'Pistola Semi-Automática', quantity: 1, type: 'pistola' },
    { name: 'Pistola Borchardt', quantity: 1, type: 'pistola' },
    
    // Rifles
    { name: 'Rifle Lancaster', quantity: 1, type: 'rifle' },
    { name: 'Rifle Litchfield', quantity: 1, type: 'rifle' },
    { name: 'Rifle Springfield', quantity: 1, type: 'rifle' },
    { name: 'Rifle de Repetición', quantity: 1, type: 'rifle' },
    { name: 'Rifle de Caza', quantity: 1, type: 'rifle' },
    { name: 'Rifle de Cerrojo', quantity: 1, type: 'rifle' },
    
    // Escopetas
    { name: 'Escopeta de Dos Cañones', quantity: 1, type: 'escopeta' },
    { name: 'Escopeta de Báscula', quantity: 1, type: 'escopeta' },
    { name: 'Escopeta de Repetición', quantity: 1, type: 'escopeta' },
    { name: 'Escopeta de Bomba', quantity: 1, type: 'escopeta' },
    
    // Armas de Cuerpo a Cuerpo
    { name: 'Machete', quantity: 1, type: 'melee' },
    { name: 'Hacha de Guerra', quantity: 1, type: 'melee' },
    { name: 'Cuchillo de Caza', quantity: 1, type: 'melee' },
    { name: 'Machete Antiguo', quantity: 1, type: 'melee' },
    { name: 'Hacha de Caza', quantity: 1, type: 'melee' },
    { name: 'Cuchillo de Caza Mejorado', quantity: 1, type: 'melee' },
    
    // Armas Especiales
    { name: 'Ballesta', quantity: 1, type: 'especial' },
    { name: 'Lanzador de Dinamita', quantity: 1, type: 'especial' },
    { name: 'Lanzador de Cócteles Molotov', quantity: 1, type: 'especial' },
    { name: 'Lanzador de Bombas de Humo', quantity: 1, type: 'especial' },
    { name: 'Lanzador de Bombas Incendiarias', quantity: 1, type: 'especial' },
    
    // Armas de Largo Alcance
    { name: 'Rifle de Francotirador', quantity: 1, type: 'rifle' },
    { name: 'Rifle de Caza Mejorado', quantity: 1, type: 'rifle' },
    { name: 'Rifle de Repetición Mejorado', quantity: 1, type: 'rifle' }
];

// Elementos del DOM
const weaponsContainer = document.getElementById('weapons-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('weapon-modal');
const editModal = document.getElementById('edit-modal');
const closeModal = document.querySelectorAll('.close-modal');
const addWeaponBtn = document.getElementById('add-weapon-btn');
const weaponForm = document.getElementById('weapon-form');
let currentWeaponIndex = -1;

// Función para crear una tarjeta de arma
function createWeaponCard(weapon, index) {
    const card = document.createElement('div');
    card.className = 'weapon-card';
    card.innerHTML = `
        <h3>${weapon.name}</h3>
        <p>Tipo: ${weapon.type}</p>
        <p>Cantidad: ${weapon.quantity}</p>
    `;
    
    card.addEventListener('click', () => showWeaponDetails(weapon, index));
    return card;
}

// Función para mostrar los detalles del arma en el modal
function showWeaponDetails(weapon, index) {
    currentWeaponIndex = index;
    document.getElementById('modal-weapon-name').textContent = weapon.name;
    document.getElementById('modal-weapon-type').textContent = weapon.type;
    document.getElementById('modal-weapon-quantity').textContent = weapon.quantity;
    modal.style.display = 'block';
}

// Función para mostrar el formulario de edición
function showEditForm(weapon = null) {
    const formTitle = document.getElementById('form-title');
    const nameInput = document.getElementById('weapon-name');
    const typeInput = document.getElementById('weapon-type');
    const quantityInput = document.getElementById('weapon-quantity');

    if (weapon) {
        formTitle.textContent = 'Editar Arma';
        nameInput.value = weapon.name;
        typeInput.value = weapon.type;
        quantityInput.value = weapon.quantity;
    } else {
        formTitle.textContent = 'Agregar Nueva Arma';
        nameInput.value = '';
        typeInput.value = 'revólver';
        quantityInput.value = '1';
    }

    editModal.style.display = 'block';
}

// Función para filtrar las armas
function filterWeapons(type) {
    const filteredWeapons = type === 'all' 
        ? weapons 
        : weapons.filter(weapon => weapon.type === type);
    
    weaponsContainer.innerHTML = '';
    filteredWeapons.forEach((weapon, index) => {
        weaponsContainer.appendChild(createWeaponCard(weapon, index));
    });
}

// Función para guardar una arma
function saveWeapon(event) {
    event.preventDefault();
    
    const name = document.getElementById('weapon-name').value;
    const type = document.getElementById('weapon-type').value;
    const quantity = parseInt(document.getElementById('weapon-quantity').value);

    if (currentWeaponIndex >= 0) {
        // Editar arma existente
        weapons[currentWeaponIndex] = { name, type, quantity };
    } else {
        // Agregar nueva arma
        weapons.push({ name, type, quantity });
    }

    // Actualizar la vista
    const activeFilter = document.querySelector('.filter-btn.active').dataset.type;
    filterWeapons(activeFilter);
    
    // Cerrar el modal
    editModal.style.display = 'none';
    currentWeaponIndex = -1;
}

// Función para eliminar una arma
function deleteWeapon() {
    if (currentWeaponIndex >= 0) {
        weapons.splice(currentWeaponIndex, 1);
        modal.style.display = 'none';
        const activeFilter = document.querySelector('.filter-btn.active').dataset.type;
        filterWeapons(activeFilter);
        currentWeaponIndex = -1;
    }
}

// Event Listeners
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterWeapons(button.dataset.type);
    });
});

// Cerrar modales
closeModal.forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        editModal.style.display = 'none';
        currentWeaponIndex = -1;
    });
});

// Cerrar modales al hacer clic fuera
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
    if (e.target === editModal) {
        editModal.style.display = 'none';
        currentWeaponIndex = -1;
    }
});

// Botón de agregar arma
addWeaponBtn.addEventListener('click', () => {
    showEditForm();
});

// Botón de editar arma
document.getElementById('edit-weapon-btn').addEventListener('click', () => {
    if (currentWeaponIndex >= 0) {
        modal.style.display = 'none';
        showEditForm(weapons[currentWeaponIndex]);
    }
});

// Botón de eliminar arma
document.getElementById('delete-weapon-btn').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta arma?')) {
        deleteWeapon();
    }
});

// Formulario de arma
weaponForm.addEventListener('submit', saveWeapon);

// Botón de cancelar en el formulario
document.querySelector('.action-btn.cancel').addEventListener('click', () => {
    editModal.style.display = 'none';
    currentWeaponIndex = -1;
});

// Cargar todas las armas al inicio
filterWeapons('all');

// Efecto de sonido al hacer clic en los botones
const clickSound = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play();
    });
}); 