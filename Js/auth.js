// Simulação de banco de dados de usuários
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let tokensRecuperacao = {};

// Função para exibir mensagens
function showMessage(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} mt-3`;
    alertDiv.textContent = message;
    document.querySelector('.login-container').prepend(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        const usuario = usuarios.find(u => u.email === email && u.senha === senha);
        
        if (usuario) {
            showMessage('success', 'Login realizado com sucesso!');
            // Redirecionar para a página principal após login
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage('danger', 'E-mail ou senha incorretos!');
        }
    });
}

// Cadastro
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        
        if (senha !== confirmarSenha) {
            showMessage('danger', 'As senhas não coincidem!');
            return;
        }
        
        if (usuarios.some(u => u.email === email)) {
            showMessage('danger', 'Este e-mail já está cadastrado!');
            return;
        }
        
        usuarios.push({ nome, email, senha });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        showMessage('success', 'Cadastro realizado com sucesso!');
        
        // Redirecionar para login após cadastro
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    });
}

// Esqueci a senha
if (document.getElementById('resetForm')) {
    document.getElementById('resetForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        if (!usuarios.some(u => u.email === email)) {
            showMessage('danger', 'E-mail não encontrado!');
            return;
        }
        
        // Gerar token de recuperação (simulado)
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        tokensRecuperacao[token] = email;
        localStorage.setItem('tokensRecuperacao', JSON.stringify(tokensRecuperacao));
        
        // Simular envio de e-mail
        showMessage('success', `Link de redefinição enviado para ${email} (simulado). Token: ${token}`);
        
        // Em um sistema real, você enviaria um e-mail com um link contendo o token
        console.log(`Link de redefinição: nova-senha.html?token=${token}`);
    });
}

// Nova senha
if (document.getElementById('newPasswordForm')) {
    // Verificar se há token na URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
        document.getElementById('token').value = token;
        
        document.getElementById('newPasswordForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const token = document.getElementById('token').value;
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;
            
            if (senha !== confirmarSenha) {
                showMessage('danger', 'As senhas não coincidem!');
                return;
            }
            
            tokensRecuperacao = JSON.parse(localStorage.getItem('tokensRecuperacao')) || {};
            const email = tokensRecuperacao[token];
            
            if (!email) {
                showMessage('danger', 'Token inválido ou expirado!');
                return;
            }
            
            // Atualizar senha do usuário
            const usuarioIndex = usuarios.findIndex(u => u.email === email);
            if (usuarioIndex !== -1) {
                usuarios[usuarioIndex].senha = senha;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                
                // Remover token usado
                delete tokensRecuperacao[token];
                localStorage.setItem('tokensRecuperacao', JSON.stringify(tokensRecuperacao));
                
                showMessage('success', 'Senha redefinida com sucesso!');
                
                // Redirecionar para login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }
        });
    } else {
        showMessage('danger', 'Token de redefinição não encontrado!');
    }
}