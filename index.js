import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

dotenv.config();

const url = 'https://ge.globo.com/futebol/copa-do-mundo/eliminatorias-america-do-sul/';

async function scrapeJogos() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const jogos = await page.evaluate(() => {
    const lista = [];
    const items = document.querySelectorAll('li.lista-jogos__jogo');

    items.forEach((el) => {
      const jogo = el.querySelector('meta[itemprop="name"]')?.content || 'Jogo não identificado';
      const dataHora = el.querySelector('meta[itemprop="startDate"]')?.content || 'Data não encontrada';
      const local = el.querySelector('meta[itemprop="location"]')?.content || 'Local não especificado';
      const link = el.querySelector('a.jogo__transmissao--link')?.href || 'Sem link';

      lista.push(`${jogo} - ${dataHora} - ${local}\nLink: ${link}`);
    });

    return lista;
  });

  await browser.close();
  return jogos;
}

async function sendEmail(data) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const texto = data.length ? data.join('\n\n') : 'Nenhum jogo encontrado.';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: 'Jogos da Rodada - Eliminatórias',
    text: texto,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.response);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}

async function executarScraping() {
  try {
    const dados = await scrapeJogos();
    console.log('Jogos capturados:', dados);
    await sendEmail(dados);
  } catch (error) {
    console.error('Erro:', error);
  }
}

// 🕙 Agendar tarefa diária às 10h da manhã (horário local)
cron.schedule('0 10 * * *', () => {
  console.log('Executando scraping agendado às 10h...');
  executarScraping();
});

// 👇 Executa imediatamente ao iniciar
executarScraping();
