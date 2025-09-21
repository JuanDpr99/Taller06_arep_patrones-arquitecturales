/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */

// === Ajusta la URL base del backend si es necesario ===
const API_BASE = 'http://localhost:8080/api/properties';

document.getElementById('apiBaseLabel').textContent = API_BASE;

const form = document.getElementById('propertyForm');
const formTitle = document.getElementById('formTitle');
const propId = document.getElementById('propId');
const address = document.getElementById('address');
const price = document.getElementById('price');
const size = document.getElementById('size');
const description = document.getElementById('description');
const formMsg = document.getElementById('formMsg');

const tableBody = document.querySelector('#propertiesTable tbody');
const detailBox = document.getElementById('detailBox');

const refreshBtn = document.getElementById('refreshBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const saveBtn = document.getElementById('saveBtn');

// =============== Utilidades UI ===============
function formatMoney(n) {
    if (n == null)
        return '';
    try {
        return new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP', maximumFractionDigits: 0}).format(n);
    } catch {
        return n;
    }
}

function setMessage(msg, type = 'muted') {
    formMsg.className = type;
    formMsg.textContent = msg || '';
}

function resetForm() {
    propId.value = '';
    form.reset();
    formTitle.textContent = 'Crear propiedad';
    cancelEditBtn.style.display = 'none';
    saveBtn.textContent = 'Guardar';
    setMessage('');
}

function fillFormForEdit(p) {
    propId.value = p.id;
    address.value = p.address;
    price.value = p.price;
    size.value = p.size;
    description.value = p.description || '';
    formTitle.textContent = `Editar propiedad #${p.id}`;
    cancelEditBtn.style.display = 'inline-block';
    saveBtn.textContent = 'Actualizar';
    setMessage('');
}

// =============== Validación cliente ===============
function validateForm() {
    // HTML5 constraints
    if (!address.value.trim() || address.value.trim().length < 5) {
        setMessage('La dirección es requerida (mínimo 5 caracteres).', 'error');
        return false;
    }
    const priceVal = parseFloat(price.value);
    if (isNaN(priceVal) || priceVal <= 0) {
        setMessage('El precio debe ser un número positivo.', 'error');
        return false;
    }
    const sizeVal = parseFloat(size.value);
    if (isNaN(sizeVal) || sizeVal <= 0) {
        setMessage('El tamaño debe ser un número positivo.', 'error');
        return false;
    }
    if (description.value && description.value.length > 1000) {
        setMessage('La descripción es demasiado larga (máx. 1000).', 'error');
        return false;
    }
    setMessage('');
    return true;
}

// =============== CRUD via Fetch ===============
async function fetchJSON(url, options = {}) {
    const res = await fetch(url, {headers: {'Content-Type': 'application/json'}, ...options});
    // Si falla, intenta leer error JSON del handler global
    if (!res.ok) {
        let errText = `HTTP ${res.status}`;
        try {
            const data = await res.json();
            errText = data.message || data.error || JSON.stringify(data);
        } catch { /* ignore */
        }
        throw new Error(errText);
    }
    // 204 No Content -> no body
    if (res.status === 204)
        return null;
    return res.json();
}

async function listProperties() {
    tableBody.innerHTML = `<tr><td colspan="5">Cargando...</td></tr>`;
    try {
        const data = await fetchJSON(API_BASE);
        renderTable(data);
    } catch (e) {
        tableBody.innerHTML = `<tr><td colspan="5" style="color:#b00020;">Error: ${e.message}</td></tr>`;
    }
}

function renderTable(list) {
    if (!list || list.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="muted">Sin propiedades</td></tr>`;
        return;
    }
    tableBody.innerHTML = list.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.address}</td>
      <td>${formatMoney(p.price)}</td>
      <td>${p.size} m²</td>
      <td class="actions">
        <button data-action="view" data-id="${p.id}">Ver</button>
        <button data-action="edit" data-id="${p.id}">Editar</button>
        <button data-action="delete" data-id="${p.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

async function viewProperty(id) {
    detailBox.textContent = 'Cargando...';
    try {
        const data = await fetchJSON(`${API_BASE}/${id}`);
        detailBox.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
        detailBox.textContent = `Error: ${e.message}`;
    }
}

async function createProperty(payload) {
    const data = await fetchJSON(API_BASE, {method: 'POST', body: JSON.stringify(payload)});
    return data;
}

async function updateProperty(id, payload) {
    const data = await fetchJSON(`${API_BASE}/${id}`, {method: 'PUT', body: JSON.stringify(payload)});
    return data;
}

async function deleteProperty(id) {
    await fetchJSON(`${API_BASE}/${id}`, {method: 'DELETE'});
}

// =============== Eventos ===============
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm())
        return;

    const payload = {
        address: address.value.trim(),
        price: Number(price.value),
        size: Number(size.value),
        description: description.value.trim()
    };

    try {
        if (propId.value) {
            await updateProperty(propId.value, payload);
            setMessage('Propiedad actualizada ✔', 'success');
        } else {
            await createProperty(payload);
            setMessage('Propiedad creada ✔', 'success');
        }
        await listProperties();
        resetForm();
    } catch (e) {
        setMessage(`Error: ${e.message}`, 'error');
    }
});

tableBody.addEventListener('click', async (e) => {
    const btn = e.target.closest('button');
    if (!btn)
        return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');

    if (action === 'view') {
        viewProperty(id);
    } else if (action === 'edit') {
        try {
            const p = await fetchJSON(`${API_BASE}/${id}`);
            fillFormForEdit(p);
            detailBox.textContent = JSON.stringify(p, null, 2);
        } catch (err) {
            setMessage(`Error: ${err.message}`, 'error');
        }
    } else if (action === 'delete') {
        const ok = confirm(`¿Eliminar propiedad #${id}?`);
        if (!ok)
            return;
        try {
            await deleteProperty(id);
            await listProperties();
            setMessage(`Propiedad #${id} eliminada ✔`, 'success');
            if (propId.value === id)
                resetForm();
        } catch (err) {
            setMessage(`Error: ${err.message}`, 'error');
        }
    }
});

refreshBtn.addEventListener('click', listProperties);
cancelEditBtn.addEventListener('click', resetForm);

// Inicial
listProperties();

