const etapas = [
  {
    opcoes: [
      'Ativar o disjuntor principal',
      'Puxar a alavanca de segurança',
      'Liberar a corrente elétrica',
      'Confirmar o reinício do sistema'
    ],
    correta: 1,
    dica: 'Lembre-se: segurança vem primeiro.'
  },
  {
    opcoes: [
      'Ativar o disjuntor principal',
      'Liberar a corrente elétrica',
      'Puxar a alavanca de segurança',
      'Confirmar o reinício do sistema'
    ],
    correta: 0,
    dica: 'Nada funciona sem o disjuntor.'
  },
  {
    opcoes: [
      'Liberar a corrente elétrica',
      'Confirmar o reinício do sistema',
      'Ativar o disjuntor principal',
      'Puxar a alavanca de segurança'
    ],
    correta: 0,
    dica: 'A corrente precisa estar liberada antes do sistema reiniciar.'
  },
  {
    opcoes: [
      'Confirmar o reinício do sistema',
      'Liberar a corrente elétrica',
      'Ativar o disjuntor principal',
      'Puxar a alavanca de segurança'
    ],
    correta: 0,
    dica: 'Agora é só reiniciar o sistema!'
  }
];

let etapaAtual = 0;
let dicaAtual = etapas[0].dica;

const botoesDiv = document.getElementById('painel-botoes');
const dicaspan = document.getElementById('ajudante-dica');
const painelEtapas = [
  document.getElementById('etapa-0'),
  document.getElementById('etapa-1'),
  document.getElementById('etapa-2'),
  document.getElementById('etapa-3')
];
const painelErro = document.getElementById('painel-erro');
const painelAcerto = document.getElementById('painel-acerto');
const painelFalha = document.getElementById('painel-falha');
const reexibirDicaBtn = document.getElementById('reexibir-dica');
const algoritmoLista = document.getElementById('algoritmo-lista');
const vidasContador = document.getElementById('vidas-contador');
let vidas = 3;
let passosSelecionados = [];

// Modal de introdução
const modalIntro = document.getElementById('modal-intro');
const fecharModalBtn = document.getElementById('fechar-modal');
fecharModalBtn.onclick = () => {
  modalIntro.style.display = 'none';
};

// Ambientação animada: estação de energia no fundo (mais explosões)
const bgCanvas = document.getElementById('bg-estacao');
const bgCtx = bgCanvas.getContext('2d');
let explosoes = [];
function resizeBgCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
resizeBgCanvas();
window.addEventListener('resize', resizeBgCanvas);

function drawEstacaoEnergia() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  // Torres
  for (let i = 0; i < 3; i++) {
    let baseX = bgCanvas.width * (0.2 + i * 0.3);
    let baseY = bgCanvas.height * 0.82;
    let topY = bgCanvas.height * 0.38;
    // Estrutura da torre
    bgCtx.strokeStyle = '#bfc2d6';
    bgCtx.lineWidth = 4;
    bgCtx.beginPath();
    bgCtx.moveTo(baseX - 30, baseY);
    bgCtx.lineTo(baseX, topY);
    bgCtx.lineTo(baseX + 30, baseY);
    bgCtx.moveTo(baseX - 18, baseY - 40);
    bgCtx.lineTo(baseX, topY + 30);
    bgCtx.lineTo(baseX + 18, baseY - 40);
    bgCtx.stroke();
    // Cabos
    bgCtx.strokeStyle = '#888';
    bgCtx.lineWidth = 2.5;
    bgCtx.beginPath();
    bgCtx.moveTo(baseX, topY + 10);
    bgCtx.bezierCurveTo(baseX + 80, topY + 60, baseX + 80, baseY - 60, baseX + 30, baseY);
    bgCtx.moveTo(baseX, topY + 10);
    bgCtx.bezierCurveTo(baseX - 80, topY + 60, baseX - 80, baseY - 60, baseX - 30, baseY);
    bgCtx.stroke();
    // Faíscas animadas
    if (Math.random() < 0.18) {
      let sx = baseX + (Math.random() - 0.5) * 40;
      let sy = topY + 10 + Math.random() * 10;
      criarExplosao(sx, sy);
    }
  }
  // Transformador (retângulo grande)
  let tx = bgCanvas.width * 0.7;
  let ty = bgCanvas.height * 0.82;
  bgCtx.fillStyle = '#23243a';
  bgCtx.fillRect(tx, ty - 38, 90, 38);
  bgCtx.strokeStyle = '#bfc2d6';
  bgCtx.lineWidth = 3;
  bgCtx.strokeRect(tx, ty - 38, 90, 38);
  // Faíscas no transformador
  if (Math.random() < 0.25) {
    let sx = tx + 45 + (Math.random() - 0.5) * 40;
    let sy = ty - 38 + Math.random() * 38;
    criarExplosao(sx, sy);
  }
  // Explosões extras aleatórias
  if (Math.random() < 0.08) {
    let sx = Math.random() * bgCanvas.width;
    let sy = bgCanvas.height * (0.3 + Math.random() * 0.5);
    criarExplosao(sx, sy);
  }
  // Desenhar explosões
  explosoes = explosoes.filter(e => e.life > 0);
  explosoes.forEach(e => {
    for (let s = 0; s < e.rays; s++) {
      bgCtx.save();
      bgCtx.translate(e.x, e.y);
      bgCtx.rotate((Math.PI * 2 * s) / e.rays + e.angle);
      bgCtx.strokeStyle = e.color;
      bgCtx.globalAlpha = e.life / e.maxLife;
      bgCtx.beginPath();
      bgCtx.moveTo(0, 0);
      bgCtx.lineTo(e.size + Math.random() * 8, 0);
      bgCtx.stroke();
      bgCtx.restore();
    }
    e.life--;
    e.angle += 0.1;
  });
}
function criarExplosao(x, y) {
  explosoes.push({
    x, y,
    rays: 8 + Math.floor(Math.random() * 6),
    size: 16 + Math.random() * 18,
    color: Math.random() < 0.5 ? '#fff200' : '#ff2d2d',
    life: 16 + Math.floor(Math.random() * 10),
    maxLife: 24,
    angle: Math.random() * Math.PI * 2
  });
}
function animateBg() {
  drawEstacaoEnergia();
  requestAnimationFrame(animateBg);
}
animateBg();

function exibirDica(dica) {
  dicaspan.textContent = dica;
}

function atualizarBotoes() {
  botoesDiv.innerHTML = '';
  etapas[etapaAtual].opcoes.forEach((op, idx) => {
    const btn = document.createElement('button');
    btn.className = 'painel-botao';
    btn.textContent = op;
    btn.onclick = () => escolherOpcao(idx);
    botoesDiv.appendChild(btn);
  });
}

function atualizarAlgoritmo() {
  algoritmoLista.innerHTML = '';
  passosSelecionados.forEach(passo => {
    const li = document.createElement('li');
    li.textContent = passo.texto;
    li.className = 'acerto';
    algoritmoLista.appendChild(li);
  });
}

function atualizarVidas() {
  const raios = document.querySelectorAll('.raio');
  for (let i = 0; i < raios.length; i++) {
    if (i < vidas) {
      raios[i].classList.add('vida-on');
      raios[i].classList.remove('vida-off');
    } else {
      raios[i].classList.remove('vida-on');
      raios[i].classList.add('vida-off');
    }
  }
}

function escolherOpcao(idx) {
  if (idx === etapas[etapaAtual].correta) {
    painelEtapas[etapaAtual].classList.remove('erro');
    painelEtapas[etapaAtual].classList.add('ativa');
    painelAcerto.currentTime = 0;
    painelAcerto.play();
    passosSelecionados.push({ texto: etapas[etapaAtual].opcoes[idx] });
    atualizarAlgoritmo();
    etapaAtual++;
    if (etapaAtual < etapas.length) {
      dicaAtual = etapas[etapaAtual].dica;
      setTimeout(() => {
        atualizarBotoes();
        exibirDica(dicaAtual);
      }, 700);
    } else {
      exibirDica('Parabéns! Você religou a estação!');
      botoesDiv.innerHTML = '';
      mostrarSequenciaFinal();
      sessionStorage.setItem("vidas", vidas);
      window.location.href = "fase2.html";
    }
  } else {
    painelEtapas[etapaAtual].classList.add('erro');
    painelErro.currentTime = 0;
    painelErro.play();
    vidas--;
    atualizarVidas();
    if (vidas <= 0) {
      setTimeout(() => {
        reiniciarFase();
      }, 900);
      return;
    }
    exibirDica(etapas[etapaAtual].dica);
    setTimeout(() => {
      painelEtapas[etapaAtual].classList.remove('erro');
    }, 700);
  }
}

function reiniciarFase() {
  etapaAtual = 0;
  vidas = 3;
  atualizarVidas();
  passosSelecionados = [];
  atualizarAlgoritmo();
  painelEtapas.forEach(e => { e.classList.remove('ativa', 'erro'); });
  atualizarBotoes();
  exibirDica(etapas[0].dica);
}

function mostrarSequenciaFinal() {
  setTimeout(() => {
    exibirDica('Sequência correta:');
    algoritmoLista.innerHTML = '';
    etapas.forEach((etapa, i) => {
      const li = document.createElement('li');
      li.textContent = etapa.opcoes[etapa.correta];
      li.className = 'acerto';
      algoritmoLista.appendChild(li);
    });
  }, 1200);
}

reexibirDicaBtn.onclick = () => {
  exibirDica(dicaAtual);
};

// Início
painelFalha.volume = 0.18;
painelFalha.play();
atualizarBotoes();
exibirDica(dicaAtual);
atualizarVidas();

// Modal aparece ao iniciar
modalIntro.style.display = 'flex'; 