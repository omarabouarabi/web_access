document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    const modal = document.getElementById('message-modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModal = document.querySelector('.close-modal');

    // Inicializar dados de usuários se não existirem
    if (!localStorage.getItem('users')) {
        const initialUsers = {
            'omar.arabi': {
                password: 'Brasil@2025',
                name: 'Omar Arabi',
                role: 'admin',
                createdAt: new Date().toISOString()
            }
        };
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }

    // Função para mostrar modal com mensagem
    function showModal(message, type = 'info') {
        modalMessage.innerHTML = `
            <div class="message-${type}">
                <h3>${type === 'success' ? '✅ Sucesso!' : type === 'error' ? '❌ Erro!' : 'ℹ️ Informação'}</h3>
                <p>${message}</p>
            </div>
        `;
        modal.style.display = 'block';
        
        // Adicionar estilos dinâmicos
        const messageDiv = modalMessage.querySelector(`div`);
        messageDiv.style.cssText = `
            padding: 20px;
            border-radius: 10px;
            margin: 10px 0;
            ${type === 'success' ? 'background: linear-gradient(135deg, #d4edda, #c3e6cb); color: #155724;' : ''}
            ${type === 'error' ? 'background: linear-gradient(135deg, #f8d7da, #f5c6cb); color: #721c24;' : ''}
            ${type === 'info' ? 'background: linear-gradient(135deg, #d1ecf1, #bee5eb); color: #0c5460;' : ''}
        `;
    }

    // Função para alternar entre login e registro
    function toggleForms() {
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
    }

    // Função para validar senha
    function validatePassword(password) {
        if (password.length < 6) {
            return 'A senha deve ter pelo menos 6 caracteres.';
        }
        return null;
    }

    // Função para validar usuário
    function validateUsername(username) {
        if (username.length < 2) {
            return 'O usuário deve ter pelo menos 2 caracteres.';
        }
        if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
            return 'O usuário pode conter apenas letras, números, pontos, hífens e underscores.';
        }
        return null;
    }

    // Função para fazer login
    function login(username, password) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        if (users[username] && users[username].password === password) {
            // Login bem-sucedido
            const userData = {
                username: username,
                name: users[username].name,
                role: users[username].role,
                loginTime: new Date().toISOString()
            };
            
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            showModal(`Bem-vindo, ${users[username].name}! Redirecionando...`, 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
            return true;
        } else {
            showModal('Usuário ou senha incorretos.', 'error');
            return false;
        }
    }

    // Função para registrar usuário
    function register(username, password, confirmPassword, name) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        
        // Validações
        const usernameError = validateUsername(username);
        if (usernameError) {
            showModal(usernameError, 'error');
            return false;
        }
        
        const passwordError = validatePassword(password);
        if (passwordError) {
            showModal(passwordError, 'error');
            return false;
        }
        
        if (password !== confirmPassword) {
            showModal('As senhas não coincidem.', 'error');
            return false;
        }
        
        if (!name.trim()) {
            showModal('O nome completo é obrigatório.', 'error');
            return false;
        }
        
        if (users[username]) {
            showModal('Este usuário já existe. Escolha outro nome de usuário.', 'error');
            return false;
        }
        
        // Criar novo usuário
        users[username] = {
            password: password,
            name: name.trim(),
            role: 'viewer', // Usuários registrados são visualizadores por padrão
            createdAt: new Date().toISOString()
        };
        
        localStorage.setItem('users', JSON.stringify(users));
        showModal(`Conta criada com sucesso para ${name}! Você pode fazer login agora.`, 'success');
        
        // Voltar para o formulário de login após 2 segundos
        setTimeout(() => {
            toggleForms();
            // Limpar formulário de registro
            registerForm.reset();
        }, 2000);
        
        return true;
    }

    // Event Listeners
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms();
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleForms();
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Formulário de login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            showModal('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        login(username, password);
    });

    // Formulário de registro
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const name = document.getElementById('reg-name').value.trim();
        
        if (!username || !password || !confirmPassword || !name) {
            showModal('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        register(username, password, confirmPassword, name);
    });

    // Verificar se já está logado
    const currentUser = sessionStorage.getItem('currentUser');
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        showModal(`Você já está logado como ${userData.name}. Redirecionando...`, 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    // Adicionar efeitos visuais aos inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Adicionar validação em tempo real
    document.getElementById('reg-username').addEventListener('input', (e) => {
        const username = e.target.value;
        const error = validateUsername(username);
        
        if (error && username.length > 0) {
            e.target.style.borderColor = '#e74c3c';
        } else {
            e.target.style.borderColor = username.length >= 2 ? '#27ae60' : '#e9ecef';
        }
    });

    document.getElementById('reg-password').addEventListener('input', (e) => {
        const password = e.target.value;
        const error = validatePassword(password);
        
        if (error && password.length > 0) {
            e.target.style.borderColor = '#e74c3c';
        } else {
            e.target.style.borderColor = password.length >= 6 ? '#27ae60' : '#e9ecef';
        }
    });

    document.getElementById('reg-confirm-password').addEventListener('input', (e) => {
        const confirmPassword = e.target.value;
        const password = document.getElementById('reg-password').value;
        
        if (confirmPassword.length > 0) {
            if (confirmPassword === password) {
                e.target.style.borderColor = '#27ae60';
            } else {
                e.target.style.borderColor = '#e74c3c';
            }
        } else {
            e.target.style.borderColor = '#e9ecef';
        }
    });
});

