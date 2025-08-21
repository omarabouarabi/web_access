document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const userData = JSON.parse(currentUser);
    
    // Atualizar interface com dados do usuário
    document.getElementById('user-name').textContent = userData.name;
    document.getElementById('user-role').textContent = userData.role === 'admin' ? 'Administrador' : 'Visualizador';
    
    // Mostrar/ocultar elementos baseado no papel do usuário
    const adminElements = document.querySelectorAll('.admin-only');
    const adminButtons = document.querySelectorAll('.admin-btn');
    
    if (userData.role === 'admin') {
        adminElements.forEach(el => el.style.display = 'block');
        adminButtons.forEach(btn => btn.style.display = 'inline-block');
        document.getElementById('user-role').classList.add('role-admin');
        document.getElementById('user-role').classList.remove('role-viewer');
    } else {
        adminElements.forEach(el => el.style.display = 'none');
        adminButtons.forEach(btn => btn.style.display = 'none');
        document.getElementById('user-role').classList.add('role-viewer');
        document.getElementById('user-role').classList.remove('role-admin');
    }

    // Dados iniciais dos clientes
    let clients = {
        '3.0 Web Plus': [
            { 
                name: 'AFPESP PERUIBE II', 
                code: '6947', 
                image: 'Gemini_Generated_Image_tfvj6ptfvj6ptfvj.png',
                createdBy: 'system',
                createdAt: new Date().toISOString()
            },
            { 
                name: 'AFPESP ITANHAEM', 
                code: '6997', 
                image: 'https://cdn.afpesp.org.br/images/site/logos/afpesp-brasao-1x.png',
                createdBy: 'system',
                createdAt: new Date().toISOString()
            },
            { 
                name: 'AFPESP MARESIAS', 
                code: '7064', 
                image: 'https://cdn.afpesp.org.br/images/site/logos/afpesp-brasao-1x.png',
                createdBy: 'system',
                createdAt: new Date().toISOString()
            },
    { 
                name: 'AFPESP CARAGUATATUBA', 
                code: '7063', 
                image: 'https://cdn.afpesp.org.br/images/site/logos/afpesp-brasao-1x.png',
                createdBy: 'system',
                createdAt: new Date().toISOString()
            },
        { 
                name: 'AFPESP BORACEIA', 
                code: '7105', 
                image: 'https://cdn.afpesp.org.br/images/site/logos/afpesp-brasao-1x.png',
                createdBy: 'system',
                createdAt: new Date().toISOString()
            },
            { 
                name: 'AFPESP CAPITAL', 
                code: '7115', 
                image: 'https://cdn.afpesp.org.br/images/site/logos/afpesp-brasao-1x.png',
                createdBy: 'system',
                createdAt: new Date().toISOString()
            },
            { 
                name: 'AFPESP PERUIBE I', 
                code: '7135', 
                image: 'https://cdn.afpesp.org.br/images/site/logos/afpesp-brasao-1x.png',
                createdBy: 'system',
                createdAt: new Date().toISOString()
            },
            { 
                name: 'AFPESP TERMAS IBIRA', 
                code: '7137', 
                image: 'https://cdn.afpesp.org.br/images/site/logos/afpesp-brasao-1x.png',
                createdBy: 'system',
                createdAt: new Date().toISOString()
            },
            { 
                name: 'AFPESP FAZENDA IBIRA', 
                code: '7138', 
                image: 'https://cdn.afpesp.org.br/images/site/logos/afpesp-brasao-1x.png',
                createdBy: 'system',
                createdAt: new Date().toISOString()
            }
        ],
        'Light Web Plus': [
            { 
                name: 'Bella Vista', 
                code: '5927', 
                image: 'Gemini_Generated_Image_tfvj6ptfvj6ptfvj.png',
                createdBy: 'system',
                createdAt: new Date().toISOString()
            }
        ]
    };

    // Carregar dados do localStorage se existirem
    const savedClients = localStorage.getItem('clientsData');
    if (savedClients) {
        clients = JSON.parse(savedClients);
    }

    // Elementos do DOM
    const webPlusList = document.getElementById('web-plus-list');
    const lightWebPlusList = document.getElementById('light-web-plus-list');
    const clientModal = document.getElementById('client-modal');
    const usersModal = document.getElementById('users-modal');
    const messageModal = document.getElementById('message-modal');
    const searchInput = document.getElementById('search-input');
    const clearSearchBtn = document.getElementById('clear-search');
    const searchResultsInfo = document.getElementById('search-results-info');

    // Variáveis de controle
    let currentEditingClient = null;
    let currentEditingType = null;
    let isEditMode = false;

    // Função para criar card de cliente
    function createClientCard(client, clientType) {
        const card = document.createElement('div');
        card.className = 'client-card';
        card.dataset.clientName = client.name.toLowerCase();
        card.dataset.clientCode = client.code.toLowerCase();
        card.dataset.clientType = clientType;

        const image = document.createElement('img');
        image.src = client.image;
        image.alt = `Logo de ${client.name}`;
        image.onerror = function() {
            this.src = 'Gemini_Generated_Image_tfvj6ptfvj6ptfvj.png';
        };

        const name = document.createElement('h3');
        name.textContent = client.name;

        const code = document.createElement('p');
        code.textContent = `Código: ${client.code}`;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'card-buttons';

        const accessLink = document.createElement('a');
        accessLink.href = `https://30wplus.desbravadorweb.com.br/acesso/${client.code}`;
        accessLink.textContent = '🔗 Acessar Sistema';
        accessLink.target = '_blank';
        accessLink.className = 'access-btn';

        buttonsContainer.appendChild(accessLink);

        // Botões de administração (apenas para admins)
        if (userData.role === 'admin') {
            const editBtn = document.createElement('button');
            editBtn.textContent = '✏️ Editar';
            editBtn.className = 'edit-btn';
            editBtn.addEventListener('click', () => openEditModal(client, clientType));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️ Remover';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Tem certeza que deseja remover ${client.name}?`)) {
                    removeClient(client);
                }
            });

            buttonsContainer.appendChild(editBtn);
            buttonsContainer.appendChild(deleteBtn);
        }

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(code);
        card.appendChild(buttonsContainer);

        return card;
    }

    // Função para renderizar clientes
    function renderClients() {
        webPlusList.innerHTML = '';
        lightWebPlusList.innerHTML = '';

        clients['3.0 Web Plus'].forEach(client => {
            webPlusList.appendChild(createClientCard(client, '3.0 Web Plus'));
        });

        clients['Light Web Plus'].forEach(client => {
            lightWebPlusList.appendChild(createClientCard(client, 'Light Web Plus'));
        });

        localStorage.setItem('clientsData', JSON.stringify(clients));
        
        if (searchInput.value.trim()) {
            filterClients(searchInput.value.trim());
        }
    }

    // Função de pesquisa
    function filterClients(searchTerm) {
        const allCards = document.querySelectorAll('.client-card');
        const searchLower = searchTerm.toLowerCase();
        let visibleCount = 0;
        let totalCount = allCards.length;

        allCards.forEach(card => {
            const clientName = card.dataset.clientName;
            const clientCode = card.dataset.clientCode;
            
            const matchesSearch = clientName.includes(searchLower) || clientCode.includes(searchLower);
            
            if (matchesSearch) {
                card.classList.remove('hidden');
                card.classList.add('highlighted');
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.classList.remove('highlighted');
            }
        });

        updateSearchResults(visibleCount, totalCount, searchTerm);
        clearSearchBtn.classList.toggle('visible', searchTerm.length > 0);
    }

    // Função para atualizar informações de resultados
    function updateSearchResults(visible, total, searchTerm) {
        if (searchTerm === '') {
            searchResultsInfo.textContent = '';
            searchResultsInfo.className = 'search-results-info';
        } else if (visible === 0) {
            searchResultsInfo.textContent = `Nenhum cliente encontrado para "${searchTerm}"`;
            searchResultsInfo.className = 'search-results-info no-results';
        } else if (visible === total) {
            searchResultsInfo.textContent = `Mostrando todos os ${total} clientes`;
            searchResultsInfo.className = 'search-results-info has-results';
        } else {
            searchResultsInfo.textContent = `Encontrados ${visible} de ${total} clientes para "${searchTerm}"`;
            searchResultsInfo.className = 'search-results-info has-results';
        }
    }

    // Função para limpar pesquisa
    function clearSearch() {
        searchInput.value = '';
        const allCards = document.querySelectorAll('.client-card');
        allCards.forEach(card => {
            card.classList.remove('hidden', 'highlighted');
        });
        clearSearchBtn.classList.remove('visible');
        updateSearchResults(allCards.length, allCards.length, '');
        searchInput.focus();
    }

    // Função para abrir modal de adição
    function openAddModal(clientType) {
        isEditMode = false;
        currentEditingClient = null;
        currentEditingType = clientType;
        
        document.getElementById('modal-title').textContent = 'Adicionar Cliente';
        document.getElementById('submit-btn').textContent = 'Adicionar Cliente';
        document.getElementById('client-type').value = clientType;
        document.getElementById('client-type-group').style.display = 'none';
        document.getElementById('current-image-preview').style.display = 'none';
        
        document.getElementById('client-form').reset();
        document.getElementById('client-type').value = clientType;
        
        clientModal.style.display = 'block';
    }

    // Função para abrir modal de edição
    function openEditModal(client, clientType) {
        isEditMode = true;
        currentEditingClient = client;
        currentEditingType = clientType;
        
        document.getElementById('modal-title').textContent = 'Editar Cliente';
        document.getElementById('submit-btn').textContent = 'Salvar Alterações';
        document.getElementById('client-type-group').style.display = 'none';
        
        document.getElementById('client-name').value = client.name;
        document.getElementById('client-code').value = client.code;
        document.getElementById('client-code').disabled = true; // Não permitir editar código
        document.getElementById('client-image').value = client.image === 'Gemini_Generated_Image_tfvj6ptfvj6ptfvj.png' ? '' : client.image;
        
        // Mostrar preview da imagem atual
        const previewContainer = document.getElementById('current-image-preview');
        const previewImg = document.getElementById('preview-image');
        previewImg.src = client.image;
        previewImg.alt = `Imagem atual de ${client.name}`;
        previewContainer.style.display = 'block';
        
        clientModal.style.display = 'block';
    }

    // Função para adicionar cliente
    function addClient(clientData) {
        const newClient = {
            name: clientData.name,
            code: clientData.code,
            image: clientData.image || 'Gemini_Generated_Image_tfvj6ptfvj6ptfvj.png',
            createdBy: userData.username,
            createdAt: new Date().toISOString()
        };

        clients[clientData.type].push(newClient);
        renderClients();
        showMessage(`Cliente ${clientData.name} adicionado com sucesso!`, 'success');
    }

    // Função para editar cliente
    function editClient(newData) {
        if (!currentEditingClient || !currentEditingType) return;

        const clientIndex = clients[currentEditingType].findIndex(client => 
            client.code === currentEditingClient.code
        );

        if (clientIndex !== -1) {
            clients[currentEditingType][clientIndex].name = newData.name;
            clients[currentEditingType][clientIndex].image = newData.image || 'Gemini_Generated_Image_tfvj6ptfvj6ptfvj.png';
            clients[currentEditingType][clientIndex].lastModifiedBy = userData.username;
            clients[currentEditingType][clientIndex].lastModifiedAt = new Date().toISOString();
            
            renderClients();
            showMessage(`Cliente ${newData.name} editado com sucesso!`, 'success');
            
            // Destacar o cliente editado
            setTimeout(() => {
                const editedCard = document.querySelector(`[data-client-code="${currentEditingClient.code}"]`);
                if (editedCard) {
                    editedCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    editedCard.classList.add('search-highlight');
                }
            }, 100);
        }
    }

    // Função para remover cliente
    function removeClient(clientToRemove) {
        for (const type in clients) {
            clients[type] = clients[type].filter(client => 
                client.code !== clientToRemove.code
            );
        }
        renderClients();
        showMessage(`Cliente ${clientToRemove.name} removido com sucesso!`, 'success');
    }

    // Função para mostrar mensagem
    function showMessage(message, type = 'info') {
        const modalMessage = document.getElementById('modal-message');
        modalMessage.innerHTML = `
            <div class="message-${type}">
                <h3>${type === 'success' ? '✅ Sucesso!' : type === 'error' ? '❌ Erro!' : 'ℹ️ Informação'}</h3>
                <p>${message}</p>
            </div>
        `;
        
        const messageDiv = modalMessage.querySelector('div');
        messageDiv.style.cssText = `
            padding: 20px;
            border-radius: 10px;
            margin: 10px 0;
            ${type === 'success' ? 'background: linear-gradient(135deg, #d4edda, #c3e6cb); color: #155724;' : ''}
            ${type === 'error' ? 'background: linear-gradient(135deg, #f8d7da, #f5c6cb); color: #721c24;' : ''}
            ${type === 'info' ? 'background: linear-gradient(135deg, #d1ecf1, #bee5eb); color: #0c5460;' : ''}
        `;
        
        messageModal.style.display = 'block';
        
        // Auto-fechar mensagens de sucesso
        if (type === 'success') {
            setTimeout(() => {
                messageModal.style.display = 'none';
            }, 3000);
        }
    }

    // Função para exportar dados
    function exportData() {
        const dataToExport = {
            clients: clients,
            exportedBy: userData.username,
            exportedAt: new Date().toISOString(),
            version: '2.0'
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `clientes_3.0web_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showMessage('Dados exportados com sucesso!', 'success');
    }

    // Função para importar dados
    function importData(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (importedData.clients) {
                    clients = importedData.clients;
                    localStorage.setItem('clientsData', JSON.stringify(clients));
                    renderClients();
                    showMessage('Dados importados com sucesso!', 'success');
                } else {
                    showMessage('Formato de arquivo inválido.', 'error');
                }
            } catch (error) {
                showMessage('Erro ao ler o arquivo. Verifique se é um arquivo JSON válido.', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Função para carregar usuários
    function loadUsers() {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const usersTable = document.getElementById('users-table');
        
        let tableHTML = `
            <table class="users-table">
                <thead>
                    <tr>
                        <th>Usuário</th>
                        <th>Nome</th>
                        <th>Papel</th>
                        <th>Criado em</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        Object.entries(users).forEach(([username, user]) => {
            const createdDate = new Date(user.createdAt).toLocaleDateString('pt-BR');
            const isCurrentUser = username === userData.username;
            
            tableHTML += `
                <tr>
                    <td><strong>${username}</strong></td>
                    <td>${user.name}</td>
                    <td><span class="role-badge role-${user.role}">${user.role === 'admin' ? 'Administrador' : 'Visualizador'}</span></td>
                    <td>${createdDate}</td>
                    <td class="user-actions-cell">
                        ${!isCurrentUser ? `
                            ${user.role === 'viewer' ? `<button class="promote-btn" onclick="promoteUser('${username}')">👑 Promover</button>` : ''}
                            ${user.role === 'admin' ? `<button class="demote-btn" onclick="demoteUser('${username}')">👤 Rebaixar</button>` : ''}
                            <button class="delete-user-btn" onclick="deleteUser('${username}')">🗑️ Excluir</button>
                        ` : '<em>Você</em>'}
                    </td>
                </tr>
            `;
        });
        
        tableHTML += '</tbody></table>';
        usersTable.innerHTML = tableHTML;
    }

    // Funções globais para gerenciamento de usuários
    window.promoteUser = function(username) {
        if (confirm(`Promover ${username} para administrador?`)) {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            if (users[username]) {
                users[username].role = 'admin';
                localStorage.setItem('users', JSON.stringify(users));
                loadUsers();
                showMessage(`${username} promovido para administrador!`, 'success');
            }
        }
    };

    window.demoteUser = function(username) {
        if (confirm(`Rebaixar ${username} para visualizador?`)) {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            if (users[username]) {
                users[username].role = 'viewer';
                localStorage.setItem('users', JSON.stringify(users));
                loadUsers();
                showMessage(`${username} rebaixado para visualizador!`, 'success');
            }
        }
    };

    window.deleteUser = function(username) {
        if (confirm(`Excluir permanentemente o usuário ${username}?`)) {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            if (users[username]) {
                delete users[username];
                localStorage.setItem('users', JSON.stringify(users));
                loadUsers();
                showMessage(`Usuário ${username} excluído!`, 'success');
            }
        }
    };

    // Event Listeners
    
    // Pesquisa
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        filterClients(searchTerm);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            clearSearch();
        }
    });

    clearSearchBtn.addEventListener('click', clearSearch);

    // Botões de adicionar cliente
    document.getElementById('add-web-plus-btn').addEventListener('click', () => {
        openAddModal('3.0 Web Plus');
    });

    document.getElementById('add-light-web-plus-btn').addEventListener('click', () => {
        openAddModal('Light Web Plus');
    });

    // Modais
    document.querySelector('.close-modal').addEventListener('click', () => {
        clientModal.style.display = 'none';
        document.getElementById('client-code').disabled = false;
    });

    document.querySelector('.close-users-modal').addEventListener('click', () => {
        usersModal.style.display = 'none';
    });

    document.querySelector('.close-message-modal').addEventListener('click', () => {
        messageModal.style.display = 'none';
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
        clientModal.style.display = 'none';
        document.getElementById('client-code').disabled = false;
    });

    // Fechar modais clicando fora
    window.addEventListener('click', (e) => {
        if (e.target === clientModal) {
            clientModal.style.display = 'none';
            document.getElementById('client-code').disabled = false;
        }
        if (e.target === usersModal) {
            usersModal.style.display = 'none';
        }
        if (e.target === messageModal) {
            messageModal.style.display = 'none';
        }
    });

    // Formulário de cliente
    document.getElementById('client-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('client-name').value.trim(),
            code: document.getElementById('client-code').value.trim(),
            type: document.getElementById('client-type').value,
            image: document.getElementById('client-image').value.trim()
        };

        // Validações
        if (!formData.name) {
            showMessage('O nome do hotel é obrigatório!', 'error');
            return;
        }

        if (!formData.code) {
            showMessage('O código do cliente é obrigatório!', 'error');
            return;
        }

        if (!isEditMode) {
            // Verificar se o código já existe (apenas para novos clientes)
            const codeExists = Object.values(clients).flat().some(client => client.code === formData.code);
            if (codeExists) {
                showMessage('Este código de cliente já existe! Por favor, use um código diferente.', 'error');
                return;
            }

            // Verificar se o nome já existe
            const nameExists = Object.values(clients).flat().some(client => 
                client.name.toLowerCase() === formData.name.toLowerCase()
            );
            if (nameExists) {
                showMessage('Já existe um cliente com este nome! Por favor, use um nome diferente.', 'error');
                return;
            }

            addClient(formData);
        } else {
            // Verificar se o nome já existe (exceto para o cliente atual)
            const nameExists = Object.values(clients).flat().some(client => 
                client.name.toLowerCase() === formData.name.toLowerCase() && 
                client.code !== currentEditingClient.code
            );
            if (nameExists) {
                showMessage('Já existe um cliente com este nome! Por favor, use um nome diferente.', 'error');
                return;
            }

            editClient(formData);
        }

        clientModal.style.display = 'none';
        document.getElementById('client-form').reset();
        document.getElementById('client-code').disabled = false;
    });

    // Botões de administração
    document.getElementById('export-data-btn').addEventListener('click', exportData);

    document.getElementById('import-data-btn').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });

    document.getElementById('import-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            importData(file);
        }
    });

    // Gerenciamento de usuários
    document.getElementById('user-management-btn').addEventListener('click', () => {
        loadUsers();
        usersModal.style.display = 'block';
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja sair?')) {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    });

    // Inicializar
    renderClients();
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        showMessage(`Bem-vindo, ${userData.name}! Portal carregado com sucesso.`, 'success');
    }, 1000);
});
