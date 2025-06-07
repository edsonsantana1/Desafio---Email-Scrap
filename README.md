# 📊 Scraper de Jogos da Rodada - Eliminatórias da Copa do Mundo

Este projeto realiza o scraping da página oficial do Globo Esporte sobre as **Eliminatórias da Copa do Mundo - América do Sul**, coletando os **jogos da rodada** e enviando as informações automaticamente por e-mail todos os dias às 10h da manhã.


## ✨ Funcionalidades

- 🔍 Coleta automática dos jogos da rodada.
- 📧 Envio de e-mail diário com os dados capturados.
- 🧠 Uso de Puppeteer para navegação em páginas dinâmicas.
- 🕒 Agendamento automático com `node-cron`.


## 🧪 Pré-requisitos

- Node.js 
- Conta de e-mail (Gmail de preferência)
- Senha de App do Gmail (caso use autenticação de 2 fatores)


## 📦 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/scraper-jogos-rodada.git
   cd scraper-jogos-rodada
