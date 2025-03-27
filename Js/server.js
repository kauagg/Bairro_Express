const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();

// Configuração do CORS
app.use(cors());
app.use(express.json());

// Configuração do Mailtrap (substitua com suas credenciais)
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '1ad2cd96570c30', // Substitua pelo seu
    pass: 'f539f7628243a9'     // Substitua pelo seu
  }
});

// Banco de dados temporário
const users = [
  { email: 'usuario@exemplo.com', password: 'senha123' }
];
const resetTokens = {};

// Rota para solicitar redefinição
app.post('/api/request-reset', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Verifica se o usuário existe
    const user = users.find(u => u.email === email);
    
    // Sempre retorna sucesso (por segurança não revelamos se o email existe)
    if (!user) {
      return res.json({ 
        success: true,
        message: 'Se o e-mail existir em nosso sistema, você receberá um link de redefinição'
      });
    }

    // Gera token
    const token = crypto.randomBytes(20).toString('hex');
    resetTokens[token] = {
      email: user.email, // Usa o email do usuário encontrado
      expires: Date.now() + 3600000 // 1 hora
    };

    // Envia email
    const resetLink = `http://localhost:5500/nova-senha.html?token=${token}`;
    await transporter.sendMail({
      from: '"Bairro Express" <suporte@bairroexpress.com>',
      to: user.email,
      subject: 'Redefinição de Senha',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #007bff;">Redefina sua senha</h2>
          <p>Clique no link abaixo para redefinir sua senha:</p>
          <a href="${resetLink}" 
             style="display: inline-block; padding: 10px 20px; background-color: #007bff; 
                    color: white; text-decoration: none; border-radius: 5px;">
            Redefinir Senha
          </a>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            Se você não solicitou esta redefinição, por favor ignore este e-mail.
          </p>
        </div>
      `
    });

    res.json({ 
      success: true,
      message: 'Se o e-mail existir em nosso sistema, você receberá um link de redefinição'
    });

  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro ao processar sua solicitação'
    });
  }
});

// ... (mantenha as outras rotas como no exemplo anterior)

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));