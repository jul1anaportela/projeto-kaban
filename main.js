// Encapsular o código em uma função autoexecutável
(function () {
    const $modal = document.getElementById('modal');
    const $descriptionInput = document.getElementById('description');
    const $priorityInput = document.getElementById('priority');
    const $deadlineInput = document.getElementById('deadline');
    const $columnInput = document.getElementById('column');
    const $idInput = document.getElementById('idInput');
  
    const $creationModeTitle = document.getElementById('creationModeTitle');
    const $editingModeTitle = document.getElementById('editingModeTitle');
    const $creationModeBtn = document.getElementById('creationModeBtn');
    const $editingModeBtn = document.getElementById('editingModeBtn');
  
    const taskListKey = "tasks";
    let taskList = JSON.parse(localStorage.getItem(taskListKey)) || [];
  
    function openModal(data_column) {
        $modal.style.display = "flex";

        $columnInput.value = data_column;
    
        $creationModeTitle.style.display = "block";
        $creationModeBtn.style.display = "block";
    
        $editingModeTitle.style.display = "none";
        $editingModeBtn.style.display = "none";    
    }
  
    function openModalToEdit(id) {
        $modal.style.display = "flex";

        $creationModeTitle.style.display = "none";
        $creationModeBtn.style.display = "none";
    
        $editingModeTitle.style.display = "block";
        $editingModeBtn.style.display = "block";
    
        const index = taskList.findIndex(function(task){
            return task.id == id;
        });
    
        const task = taskList[index];
    
        $idInput.value = task.id;
        $descriptionInput.value = task.description;
        $priorityInput.value = task.priority;
        $deadlineInput.value = task.deadline;
        $columnInput.value = task.column;
    }
  
    function closeModal() {
        $modal.style.display = "none";

        // resetar os inputs
        $idInput.value = "";
        $descriptionInput.value = "";
        $priorityInput.value = "";
        $deadlineInput.value = "";
        $columnInput.value = "";
    }
  
    function resetColumns() {
        document.querySelector(`[data-column="1"] .body .cards_list`).innerHTML='';
        document.querySelector(`[data-column="2"] .body .cards_list`).innerHTML='';
        document.querySelector(`[data-column="3"] .body .cards_list`).innerHTML='';
        document.querySelector(`[data-column="4"] .body .cards_list`).innerHTML='';
    }

    // Adicionar delegação de evento para excluir botões
    document.addEventListener('click', function (event) {
        const deleteButton = event.target.closest('.btn-delete');
        if (deleteButton) {
        const cardId = deleteButton.closest('.card').id;
        taskList = taskList.filter(task => task.id !== cardId);
        updateAndGenerate();
        }
    });
  
    function generateCards() {
        resetColumns();
    
        taskList.forEach(function (task) {
            const formattedDate = moment(task.deadline).format('DD/MM/YYYY');
    
            const columnBody = document.querySelector(`[data-column="${task.column}"] .body .cards_list`);
    
            const card = `
                <div class="card card-${task.priority}-prioridade" 
                    id="${task.id}"
                    ondblclick="openModalToEdit('${task.id}')"
                    draggable="true"
                    ondragstart="dragstart_handler(event)"
                >
                    <div class="head-card">
                        <div class="tag-tarefa">
                            <span class="tag-${task.priority}-prioridade">${task.priority}</span>
                        </div>
                        <button class="btn-delete">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
    
                    <div class="info">
                        <span class="descricao-tarefa">${task.description}</span>
                    </div>
    
                    <div class="info">
                        <span class="data-entrega"> <span class="material-icons">event</span> ${formattedDate}</span>
                    </div>
                </div>
            `;
    
            columnBody.innerHTML += card;
        });
    }
  
    function createTask() {
        const newTask = {
            // Criação do ID usando timestamp e número aleatório
            id: Date.now() + '-' + Math.floor(Math.random() * 1000),
            description: $descriptionInput.value,
            priority: $priorityInput.value,
            deadline: $deadlineInput.value,
            column: $columnInput.value,
        };
    
        taskList.push(newTask);
    
        localStorage.setItem("tasks", JSON.stringify(taskList));
    
        closeModal();
        generateCards();
    }
    
    
  
    function updateTask() {
        const task = {
            //resgatando o id criado
            id: $idInput.value,
            description: $descriptionInput.value,
            priority: $priorityInput.value,
            deadline: $deadlineInput.value,
            column: $columnInput.value,
        }
    
        const index = taskList.findIndex(function(task){
            return task.id == $idInput.value;
        });
    
        taskList[index] = task;
    
        localStorage.setItem("tasks", JSON.stringify(taskList));
    
        closeModal();
        generateCards();
    }
  
    function changeColumn(task_id, column_id) {
        if (task_id && column_id) {
            taskList = taskList.map((task)=> {
                if (task_id != task.id) return task;
        
                return {
                    ...task,
                    column: column_id,
                };
            });
        }
    
        localStorage.setItem("tasks", JSON.stringify(taskList));
    
        generateCards();
    }
  
    function dragstart_handler(ev) {
        console.log(ev);

        // Adiciona o id do elemento alvo para o objeto de transferência de dados
        ev.dataTransfer.setData("my_custom_data", ev.target.id);
        ev.dataTransfer.effectAllowed = "move";
    }
  
    function dragover_handler(ev) {
        ev.preventDefault();
        // Define o dropEffect para ser do tipo move
        ev.dataTransfer.dropEffect = "move";
    }
  
    function drop_handler(ev) {
        ev.preventDefault();
        // Pega o id do alvo e adiciona o elemento que foi movido para o DOM do alvo
        const task_id = ev.dataTransfer.getData("my_custom_data");
        const column_id = ev.target.dataset.column;
        
        changeColumn(task_id, column_id);
    }
  
    // Atualizar o localStorage e gerar cartões quando necessário
    function updateAndGenerate() {
      localStorage.setItem(taskListKey, JSON.stringify(taskList));
      generateCards();
    }
  
    // Adicionar delegação de evento para excluir botões
    document.addEventListener('click', function (event) {
      const deleteButton = event.target.closest('.btn-delete');
      if (deleteButton) {
        const cardId = deleteButton.closest('.card').id;
        taskList = taskList.filter(task => task.id !== cardId);
        updateAndGenerate();
      }
    });

    // Adicionar eventos de arrastar e soltar aos cartões
    document.addEventListener('dragstart', dragstart_handler);
    document.addEventListener('dragover', dragover_handler);
    document.addEventListener('drop', drop_handler);
  
    // Adicionar eventos de clique aos botões de modo e criar
    $creationModeBtn.addEventListener('click', createTask);
    $editingModeBtn.addEventListener('click', updateTask);

    // Adicione o ouvinte de evento para o botão "Nova Tarefa"
    const novaTarefaBtn = document.querySelector('.header .primary');
    novaTarefaBtn.addEventListener('click', function() {
        openModal(); // Chamada da função openModal quando o botão é clicado
    });

    // Adicione os ouvintes de evento para os botões "Adicionar Item" nas colunas
    const addBtnColumn1 = document.querySelector('[data-column="1"] .add_btn');
    addBtnColumn1.addEventListener('click', function() {
        openModal(1); // Chamada da função openModal quando o botão é clicado
    });

    const addBtnColumn2 = document.querySelector('[data-column="2"] .add_btn');
    addBtnColumn2.addEventListener('click', function() {
        openModal(2); // Chamada da função openModal quando o botão é clicado
    });

    const addBtnColumn3 = document.querySelector('[data-column="3"] .add_btn');
    addBtnColumn3.addEventListener('click', function() {
        openModal(3); // Chamada da função openModal quando o botão é clicado
    });

    const addBtnColumn4 = document.querySelector('[data-column="4"] .add_btn');
    addBtnColumn4.addEventListener('click', function() {
        openModal(4); // Chamada da função openModal quando o botão é clicado
    });

    // Adicione o ouvinte de evento para o botão de fechar modal
    const closeModalBtn = document.querySelector('#modal .head button');
    closeModalBtn.addEventListener('click', closeModal);

  
    // Inicializar a geração de cartões
    generateCards();
  })();
  