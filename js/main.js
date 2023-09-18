const columns = document.querySelectorAll('.column');
        const newColumnInput = document.getElementById('newColumn');

        columns.forEach(column => {
            column.addEventListener('dragover', dragOver);
            column.addEventListener('dragenter', dragEnter);
            column.addEventListener('dragleave', dragLeave);
            column.addEventListener('drop', dragDrop);
        });

        let draggedCard = null;

        function dragStart() {
            draggedCard = this;
            setTimeout(() => (this.style.display = 'none'), 0);
        }

        function dragEnd() {
            draggedCard.style.display = 'block';
            draggedCard = null;
        }

        function dragOver(e) {
            e.preventDefault();
        }

        function dragEnter(e) {
            e.preventDefault();
            this.style.border = '2px dashed #aaa';
        }

        function dragLeave() {
            this.style.border = 'none';
        }

        function dragDrop() {
            this.style.border = 'none';
            const column = this.closest('.column');
            column.insertBefore(draggedCard, column.querySelector('h2').nextSibling);
        }

        function addTask(inputId) {
            const taskInput = document.getElementById(inputId);
            const taskText = taskInput.value;
            if (taskText.trim() === '') return;

            const newTask = document.createElement('div');
            newTask.className = 'card';
            newTask.draggable = true;
            newTask.textContent = taskText;
            newTask.addEventListener('dragstart', dragStart);
            newTask.addEventListener('dragend', dragEnd);

            const column = taskInput.parentElement.parentElement;
            column.insertBefore(newTask, column.querySelector('h2').nextSibling);
            taskInput.value = '';
        }

        function addColumn() {
            const columnName = newColumnInput.value;
            if (columnName.trim() === '') return;

            const newColumn = document.createElement('div');
            newColumn.className = 'column';
            newColumn.innerHTML = `<div class="column-actions">
                <select onchange="performAction(this)">
                    <option value="none">Acciones</option>
                    <option value="clear">Limpiar</option>
                    <option value="delete">Borrar</option>
                    <option value="duplicate">Duplicar</option>
                </select>
            </div>
            <h2>${columnName}</h2>
            <div>
                <input type="text" id="newTask${columns.length + 1}" placeholder="Nueva tarea">
                <!-- Botón "Agregar Tarea" movido al lado derecho -->
                <button class="add-task-button" onclick="addTask('newTask${columns.length + 1}')">Agregar Tarea</button>
            </div>`;
            newColumn.addEventListener('dragover', dragOver);
            newColumn.addEventListener('dragenter', dragEnter);
            newColumn.addEventListener('dragleave', dragLeave);
            newColumn.addEventListener('drop', dragDrop);

            const board = document.querySelector('.board');
            board.insertBefore(newColumn, board.lastElementChild);

            newColumnInput.value = '';
        }

        function performAction(select) {
            const selectedOption = select.value;
            const column = select.parentElement.parentElement;
            switch (selectedOption) {
                case 'clear':
                    clearColumn(column);
                    break;
                case 'delete':
                    deleteColumn(column);
                    break;
                case 'duplicate':
                    duplicateColumn(column);
                    break;
            }
        }

        function deleteColumn(column) {
            column.remove();
        }

        function clearColumn(column) {
            const cards = column.querySelectorAll('.card');
            cards.forEach(card => {
                card.remove();
            });
        }

        function duplicateColumn(column) {
            const newColumn = column.cloneNode(true);
            const board = document.querySelector('.board');
            board.insertBefore(newColumn, column.nextElementSibling);
        }