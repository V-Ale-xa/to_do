// Selezione degli elementi DOM
const taskInput = document.getElementById('taskInput');
const todoList = document.getElementById('todoList');
const doneList = document.getElementById('doneList');

// Gestione dell'inserimento di nuove task
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && this.value.trim() !== '') {
        addNewTask(this.value.trim());
        this.value = '';
    }
});

// Funzione per creare una nuova task
function addNewTask(taskText) {
    // Crea un nuovo elemento lista
    const li = document.createElement('li');
    
    // Crea il contenitore per il testo della task
    const taskContent = document.createElement('span');
    taskContent.textContent = taskText;
    taskContent.classList.add('task-content');
    
    // Crea il pulsante di eliminazione
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '×';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.title = 'Elimina task';
    
    // Aggiunge gli elementi al li
    li.appendChild(taskContent);
    li.appendChild(deleteBtn);
    
    // Aggiunge gli event listener
    taskContent.addEventListener('click', moveTask);
    deleteBtn.addEventListener('click', deleteTask);
    
    // Aggiunge la task alla lista Todo
    todoList.appendChild(li);

    // Effetto di fade-in
    li.style.opacity = '0';
    requestAnimationFrame(() => {
        li.style.transition = 'opacity 0.3s ease';
        li.style.opacity = '1';
    });
}

// Funzione per spostare le task tra le liste
function moveTask(e) {
    const task = e.target.parentElement;
    const currentList = task.parentElement;
    const targetList = currentList === todoList ? doneList : todoList;
    
    // Rimuove la task dalla lista corrente
    task.remove();
    
    // Aggiunge la task alla nuova lista con effetto di fade
    task.style.opacity = '0';
    targetList.appendChild(task);
    
    // Applica l'effetto di fade-in
    requestAnimationFrame(() => {
        task.style.opacity = '1';
    });
    
    saveTasksToLocalStorage();
}

// Funzione per eliminare una task
function deleteTask(e) {
    e.stopPropagation(); // Previene il bubble up dell'evento al genitore
    
    const task = e.target.parentElement;
    
    // Effetto di fade-out prima dell'eliminazione
    task.style.opacity = '0';
    task.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        task.remove();
        saveTasksToLocalStorage();
    }, 300);
}

// Funzione per salvare le task nel localStorage
function saveTasksToLocalStorage() {
    const todoTasks = Array.from(todoList.children).map(task => ({
        text: task.querySelector('.task-content').textContent,
        isDone: false
    }));
    
    const doneTasks = Array.from(doneList.children).map(task => ({
        text: task.querySelector('.task-content').textContent,
        isDone: true
    }));
    
    localStorage.setItem('tasks', JSON.stringify([...todoTasks, ...doneTasks]));
}

// Funzione per caricare le task dal localStorage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        
        const taskContent = document.createElement('span');
        taskContent.textContent = task.text;
        taskContent.classList.add('task-content');
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '×';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.title = 'Elimina task';
        
        li.appendChild(taskContent);
        li.appendChild(deleteBtn);
        
        taskContent.addEventListener('click', moveTask);
        deleteBtn.addEventListener('click', deleteTask);
        
        if (task.isDone) {
            doneList.appendChild(li);
        } else {
            todoList.appendChild(li);
        }
    });
}

// Carica le task al caricamento della pagina
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);