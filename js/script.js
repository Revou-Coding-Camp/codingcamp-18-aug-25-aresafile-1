// Menginisialisasi array tasks dengan data dari local storage, jika ada
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const statusInput = document.getElementById('status-input');
const taskList = document.getElementById('task-list');
const filter = document.getElementById('filter');
const clearAllBtn = document.getElementById('clear-all');
const messageDiv = document.getElementById('message');

// Validasi Formulir
function validateForm(task, date) {
  if (!task.trim()) {
    showMessage('Tugas tidak boleh kosong!');
    return false;
  }
  if (!date) {
    showMessage('Tanggal jatuh tempo harus diisi!');
    return false;
  }
  showMessage('');
  return true;
}

// Tampilkan pesan validasi
function showMessage(msg) {
  messageDiv.textContent = msg;
}

// Simpan data tasks ke Local Storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render daftar tugas
function renderTasks() {
  const filterValue = filter.value;
  let filteredTasks = tasks;

  if (filterValue !== 'all') {
    filteredTasks = tasks.filter(t => t.status === filterValue);
  }

  // Menangani pesan saat daftar kosong atau tidak ada hasil filter
  if (filteredTasks.length === 0) {
    taskList.innerHTML = `<tr><td colspan="5">${filterValue === 'all' ? 'Belum Ada Tugas' : 'Tidak ada tugas yang sesuai'}</td></tr>`;
    return;
  }
  
  taskList.innerHTML = ''; // Kosongkan daftar sebelum merender ulang

  filteredTasks.forEach((task, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${task.name}</td>
      <td>${task.dueDate}</td>
      <td class="status-${task.status}">${task.status.charAt(0).toUpperCase() + task.status.slice(1)}</td>
      <td>
        <button class="action-btn toggle-btn" data-task-id="${task.id}">Ubah Status</button>
        <button class="action-btn delete-btn" data-task-id="${task.id}">Hapus</button>
        </td>
    `;
    taskList.appendChild(tr);
  });
}

// Tambah tugas baru
taskForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = taskInput.value;
  const dueDate = dateInput.value;
  const status = statusInput.value;

  if (!validateForm(name, dueDate)) return;

  const newTask = {
    id: nextId++,
    name,
    dueDate,
    status
  };

  tasks.push(newTask);
  saveTasks(); // Simpan ke local storage
  taskInput.value = '';
  dateInput.value = '';
  statusInput.value = 'diutamakan';

  renderTasks();
});

// Hapus semua tugas
clearAllBtn.addEventListener('click', function() {
  if (confirm('Hapus semua tugas?')) {
    tasks = [];
    saveTasks(); // Simpan ke local storage
    renderTasks();
  }
});

// Filter daftar tugas
filter.addEventListener('change', renderTasks);

// Menggunakan Delegasi Event untuk Hapus & Ubah Status
taskList.addEventListener('click', function(e) {
  // Periksa apakah tombol Hapus atau Ubah Status yang diklik
  if (e.target.classList.contains('delete-btn')) {
    const taskId = parseInt(e.target.dataset.taskId);
    if (confirm('Hapus tugas ini?')) {
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasks(); // Simpan ke local storage
      renderTasks();
    }
  } else if (e.target.classList.contains('toggle-btn')) {
    const taskId = parseInt(e.target.dataset.taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = task.status === 'diutamakan' ? 'diproses' : (task.status === 'diproses' ? 'selesai' : 'diutamakan');
      saveTasks(); // Simpan ke local storage
      renderTasks();
    }
  }
});

// Inisialisasi
renderTasks();
