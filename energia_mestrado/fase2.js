// NOVA FASE 2: Painel de Decisões

const desafios = [
  {
    elementos: { lampadas: [true, false, false], fios: ['vermelho', 'azul'], display: 2 },
    condicao: 'Se houver apenas uma lâmpada acesa, clique no botão azul.',
    botoes: [
      { texto: 'Vermelho', cor: 'vermelho' },
      { texto: 'Azul', cor: 'azul' },
      { texto: 'Verde', cor: 'verde' },
      { texto: 'Amarelo', cor: 'amarelo' }
    ],
    correta: 1,
    dica: 'Conte as lâmpadas acesas e procure o botão azul.',
    dicaInicial: 'Observe as lâmpadas no painel e leia a condição com atenção!'
  },
  {
    elementos: { lampadas: [true, true, false, false], fios: ['verde', 'amarelo', 'azul'], display: 4 },
    condicao: 'Se houver mais de duas lâmpadas acesas, clique no botão verde. Senão, clique no botão amarelo.',
    botoes: [
      { texto: 'Verde', cor: 'verde' },
      { texto: 'Amarelo', cor: 'amarelo' },
      { texto: 'Azul', cor: 'azul' },
      { texto: 'Vermelho', cor: 'vermelho' }
    ],
    correta: 0,
    dica: 'Mais de duas acesas? Verde!',
    dicaInicial: 'Conte quantas lâmpadas estão acesas para tomar a decisão.'
  },
  {
    elementos: { lampadas: [false, true, true, true], fios: ['vermelho', 'azul', 'verde'], display: 7 },
    condicao: 'Se o display mostrar um número ímpar, clique no botão vermelho. Senão, clique no botão azul.',
    botoes: [
      { texto: 'Vermelho', cor: 'vermelho' },
      { texto: 'Azul', cor: 'azul' },
      { texto: 'Verde', cor: 'verde' },
      { texto: 'Amarelo', cor: 'amarelo' }
    ],
    correta: 0,
    dica: 'Ímpar = vermelho.',
    dicaInicial: 'Verifique se o número no display é par ou ímpar.'
  },
  {
    elementos: { lampadas: [true, false, true, false, true], fios: ['amarelo', 'azul'], display: 6 },
    condicao: 'Se houver exatamente três lâmpadas acesas, clique no botão amarelo. Senão, clique no botão verde.',
    botoes: [
      { texto: 'Amarelo', cor: 'amarelo' },
      { texto: 'Verde', cor: 'verde' },
      { texto: 'Azul', cor: 'azul' },
      { texto: 'Vermelho', cor: 'vermelho' }
    ],
    correta: 0,
    dica: 'Três acesas? Amarelo!',
    dicaInicial: 'Conte exatamente quantas lâmpadas estão acesas neste painel.'
  },
  {
    elementos: { lampadas: [true, true, true, true, false], fios: ['vermelho', 'verde', 'azul', 'amarelo'], display: 8 },
    condicao: 'Se todos os fios forem de cores diferentes, clique no botão azul. Senão, clique no botão verde.',
    botoes: [
      { texto: 'Azul', cor: 'azul' },
      { texto: 'Verde', cor: 'verde' },
      { texto: 'Amarelo', cor: 'amarelo' },
      { texto: 'Vermelho', cor: 'vermelho' }
    ],
    correta: 0,
    dica: 'Todos diferentes? Azul!',
    dicaInicial: 'Examine as cores dos fios com cuidado para ver se são únicos.'
  }
];

let desafioAtual = 0;
let timerInterval = null;
let tempoRestante = 10;

let vidasGlobais = 3;

// Vidas globais compartilhadas entre as fases
if (sessionStorage.getItem("vidas")) {
  console.log("to aqui!", vidasGlobais)
  vidasGlobais = parseInt(sessionStorage.getItem("vidas"));
}

// Elemento de vidas
let vidasContainer = document.getElementById('vidas-container');

function renderVidas() {
  const vidasRaios = document.getElementById('vidas-raios');
  vidasRaios.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const raio = document.createElement('span');
    raio.className = 'raio ' + (i < vidasGlobais ? 'vida-on' : 'vida-off');
    raio.textContent = '⚡';
    vidasRaios.appendChild(raio);
  }
}

function perderVida() {
  vidasGlobais--;
  sessionStorage.setItem("vidas", vidasGlobais.toString());
  renderVidas();
  if (vidasGlobais <= 0) {
    setTimeout(() => {
      mostrarGameOver();
    }, 1200);
  }
}

function mostrarGameOver() {
  // Limpar timer se estiver rodando
  if (timerInterval) clearInterval(timerInterval);
  removerTimerCircular();
  
  // Ocultar feedback de erro se estiver visível
  feedbackErro.classList.add('hidden');
  
  // Mostrar modal de game over
  const modalGameOver = document.getElementById('modal-game-over');
  modalGameOver.style.display = 'flex';
}

function reiniciarFase() {
  // Resetar vidas no sessionStorage e voltar para a fase 1
  sessionStorage.setItem('vidas', '3');
  
  // Redirecionar para a fase 1
  window.location.href = 'fase1.html';
}

function voltarAoMenu() {
  // Resetar vidas no sessionStorage
  sessionStorage.setItem('vidas', '3');
  
  // Redirecionar para o menu principal
  window.location.href = 'index.html';
}

const painelElementos = document.getElementById('painel-elementos');
const painelCondicao = document.getElementById('painel-condicao');
const painelBotoes = document.getElementById('painel-botoes');
const ajudanteDica = document.getElementById('ajudante-dica');
const feedbackErro = document.getElementById('feedback-erro');
const mensagemErro = document.getElementById('mensagem-erro');
const btnTentarNovamente = document.getElementById('btn-tentar-novamente');
const somFluxo = document.getElementById('som-fluxo');
const somErro = document.getElementById('som-erro');
const modalIntro2 = document.getElementById('modal-intro2');
const fecharModal2 = document.getElementById('fechar-modal2');
const painelLampadas = document.getElementById('painel-lampadas');
const painelFios = document.getElementById('painel-fios');
const painelDisplay = document.getElementById('painel-display');
const reexibirDicaBtn = document.getElementById('reexibir-dica');

fecharModal2.onclick = () => { modalIntro2.style.display = 'none'; };

// Variável para armazenar a dica atual
let dicaAtualFase2 = '';

reexibirDicaBtn.onclick = () => {
  if (dicaAtualFase2) {
    ajudanteDica.textContent = dicaAtualFase2;
  }
};

function corNo(cor) {
  switch (cor) {
    case 'vermelho': return '#c92a2a';
    case 'verde': return '#51cf66';
    case 'azul': return '#228be6';
    case 'amarelo': return '#fff200';
    default: return '#bfc2d6';
  }
}

function renderDesafio() {
  const desafio = desafios[desafioAtual];
  // Lâmpadas (sempre 5)
  const painelLampadasDiv = document.getElementById('painel-lampadas');
  painelLampadasDiv.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const acesa = desafio.elementos.lampadas[i] || false;
    const lamp = document.createElement('div');
    lamp.className = 'painel-lampada' + (acesa ? ' acesa' : '');
    lamp.innerHTML = '<i class="fa-solid fa-lightbulb"></i>';
    painelLampadasDiv.appendChild(lamp);
  }
  // Fios: 2 à esquerda, 2 à direita
  const painelFiosEsq = document.getElementById('painel-fios-esq');
  const painelFiosDir = document.getElementById('painel-fios-dir');
  painelFiosEsq.innerHTML = '';
  painelFiosDir.innerHTML = '';
  for (let i = 0; i < 2; i++) {
    const cor = desafio.elementos.fios[i] || 'cinza';
    const fio = document.createElement('div');
    fio.className = 'painel-fio ' + cor;
    painelFiosEsq.appendChild(fio);
  }
  for (let i = 2; i < 4; i++) {
    const cor = desafio.elementos.fios[i] || 'cinza';
    const fio = document.createElement('div');
    fio.className = 'painel-fio ' + cor;
    painelFiosDir.appendChild(fio);
  }
  // Visor numérico (centro)
  painelDisplay.textContent = desafio.elementos.display;
  // Condição (centro, abaixo do visor)
  painelCondicao.textContent = desafio.condicao;
  // Timer circular
  renderTimerCircular();
  iniciarTimer();
  // Botões (embaixo, em linha)
  painelBotoes.innerHTML = '';
  desafio.botoes.forEach((botao, idx) => {
    const btn = document.createElement('button');
    btn.className = 'painel-botao ' + botao.cor;
    btn.innerHTML = '<i class="fa-solid fa-power-off"></i>';
    btn.onclick = () => escolherBotao(idx);
    painelBotoes.appendChild(btn);
  });
  // Mostrar dica inicial para cada desafio
  setTimeout(() => {
    dicaAtualFase2 = desafio.dicaInicial;
    ajudanteDica.textContent = dicaAtualFase2;
  }, 500);
  renderVidas();
}

function renderTimerCircular() {
  let timerCirc = document.getElementById('painel-timer-circular');
  if (!timerCirc) {
    timerCirc = document.createElement('div');
    timerCirc.id = 'painel-timer-circular';
    timerCirc.className = 'painel-timer-circular';
    document.body.appendChild(timerCirc);
  }
  timerCirc.textContent = tempoRestante;
}

function iniciarTimer() {
  tempoRestante = 10;
  atualizarTimerCircular();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    tempoRestante--;
    atualizarTimerCircular();
    if (tempoRestante <= 0) {
      clearInterval(timerInterval);
      mostrarErro('Tempo esgotado! Tente novamente.');
      dicaAtualFase2 = 'Seja mais rápido na próxima!';
      ajudanteDica.textContent = dicaAtualFase2;
      perderVida();
      removerTimerCircular();
    }
  }, 1000);
}

function atualizarTimerCircular() {
  const timerCirc = document.getElementById('painel-timer-circular');
  if (timerCirc) {
    timerCirc.textContent = tempoRestante;
  }
}

function removerTimerCircular() {
  const timerCirc = document.getElementById('painel-timer-circular');
  if (timerCirc) timerCirc.remove();
}

function escolherBotao(idx) {
  if (timerInterval) clearInterval(timerInterval);
  removerTimerCircular();
  const desafio = desafios[desafioAtual];
  if (idx === desafio.correta) {
    somFluxo.currentTime = 0;
    somFluxo.play();
    
    // Mostrar mensagem de acerto antes de ir para o próximo
    ajudanteDica.textContent = 'Excelente! Você acertou!';
    
    desafioAtual++;
    if (desafioAtual < desafios.length) {
      setTimeout(() => {
        renderDesafio();
      }, 1200);
    } else {
      painelCondicao.textContent = 'Parabéns! Você completou todos os desafios do painel!';
      painelLampadas.innerHTML = '';
      painelFios.innerHTML = '';
      painelDisplay.textContent = '';
      painelBotoes.innerHTML = '';
      ajudanteDica.textContent = 'A cidade está salva graças ao seu raciocínio!';
      removerTimerCircular();
    }
  } else {
    somErro.currentTime = 0;
    somErro.play();
    mostrarErro('Ops! Resposta errada. Tente de novo!');
    dicaAtualFase2 = desafio.dica;
    ajudanteDica.textContent = dicaAtualFase2;
    perderVida();
  }
}

function mostrarErro(msg) {
  mensagemErro.textContent = msg;
  feedbackErro.classList.remove('hidden');
}

btnTentarNovamente.onclick = () => {
  feedbackErro.classList.add('hidden');
  removerTimerCircular();
  renderDesafio();
};

// Event listeners para modal de game over
const btnTentarFaseNovamente = document.getElementById('btn-tentar-fase-novamente');
const btnVoltarMenu = document.getElementById('btn-voltar-menu');

btnTentarFaseNovamente.onclick = () => {
  reiniciarFase();
};

btnVoltarMenu.onclick = () => {
  voltarAoMenu();
};

// Inicialização
modalIntro2.style.display = 'flex';
renderDesafio();

// Mensagem de boas-vindas inicial
setTimeout(() => {
  if (desafioAtual === 0) {
    dicaAtualFase2 = 'Bem-vindo ao painel avançado! Vou te ajudar com dicas úteis.';
    ajudanteDica.textContent = dicaAtualFase2;
    setTimeout(() => {
      if (desafioAtual === 0) {
        dicaAtualFase2 = desafios[0].dicaInicial;
        ajudanteDica.textContent = dicaAtualFase2;
      }
    }, 3000);
  }
}, 1000); 