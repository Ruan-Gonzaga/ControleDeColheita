// Definição dos tipos de plantas e seus tempos base de crescimento (em dias para 100m²)
let plantas = {
  "🌽 Milho": 10,
  "🍓 Morango": 7,
  "🥕 Cenoura": 5,
  "🍅 Tomate": 8,
  "🥔 Batata": 6
};

// Variáveis para elementos da interface e controle do jogo
let selectPlanta, inputArea, botaoPlantar;
let estado = "selecao"; // estados: "selecao" (escolha), "crescendo" (plantio em andamento), "colhido" (plantio finalizado)
let plantaSelecionada = null; // guarda planta escolhida
let diasTotais = 0;           // dias totais necessários para colheita, calculados com base na área
let dataInicio = 0;           // timestamp do início do plantio (em ms)
let diasPassados = 0;         // quantos dias virtuais já se passaram
let fase = 0;                 // fase atual do crescimento da planta (0 a 3)

function setup() {
  createCanvas(600, 400);
  textFont("Arial");

  // Cria título da aplicação
  createTitle("🌱 Simulador de Plantio - 1 Minuto = 1 Dia");

  // Label e select para escolher a planta
  createLabel("Escolha a planta:", 70);
  selectPlanta = createSelect();
  selectPlanta.position(60, 100);
  selectPlanta.option("Selecione...");
  // Adiciona opções de plantas ao select
  for (let nome in plantas) {
    selectPlanta.option(nome);
  }

  // Label e input para inserir a área plantada
  createLabel("Área plantada (m²):", 150);
  inputArea = createInput();
  inputArea.position(60, 180);
  inputArea.size(120);

  // Botão para iniciar o plantio
  botaoPlantar = createButton("🌾 Plantar");
  botaoPlantar.position(60, 230);
  botaoPlantar.mousePressed(iniciarPlantio);
}

function draw() {
  background("#f0fbe0");

  // Exibe dias passados no canto superior direito
  fill("#2b9348");
  textAlign(CENTER);
  textSize(20);
  text("⏳ Dias no jogo: " + diasPassados, width - 130, 30);

  // Controle de estados da interface
  if (estado === "selecao") {
    // Tela inicial de seleção de planta e área
    drawCard("Selecione uma planta e área para plantar!", width / 2, height / 2 - 50);
  } else if (estado === "crescendo") {
    // Atualiza os dias passados e a fase do crescimento
    atualizarDiasPassados();
    atualizarFase();
    // Desenha a planta e barra de progresso
    desenharCrescimento();
  } else if (estado === "colhido") {
    // Mensagem de colheita concluída
    drawCard(`🎉 ${plantaSelecionada} colhida! Parabéns!`, width / 2, height / 2 - 50);
    desenharPlanta(3); // Desenha planta na fase final
  }
}

// Função chamada ao clicar no botão "Plantar"
function iniciarPlantio() {
  let planta = selectPlanta.value();
  let area = float(inputArea.value());

  // Validação dos dados
  if (planta === "Selecione..." || isNaN(area) || area <= 0) {
    alert("❗ Por favor, escolha uma planta e informe uma área válida.");
    return;
  }

  plantaSelecionada = planta;

  // Calcula o tempo total proporcional à área (base em 100m²)
  diasTotais = plantas[planta] * (area / 100);
  diasTotais = Math.ceil(diasTotais); // arredonda para cima

  // Registra o tempo inicial do plantio (em milissegundos)
  dataInicio = millis();
  diasPassados = 0;
  fase = 0;
  estado = "crescendo";

  // Esconde os controles para evitar mudanças durante o crescimento
  selectPlanta.hide();
  inputArea.hide();
  botaoPlantar.hide();
}

// Atualiza a quantidade de dias virtuais passados, baseando-se no tempo real
function atualizarDiasPassados() {
  let agora = millis(); // tempo atual em milissegundos
  // 1 dia virtual = 60000 ms (1 minuto)
  diasPassados = Math.floor((agora - dataInicio) / 60000);

  // Se alcançou ou ultrapassou o tempo total, encerra o plantio
  if (diasPassados >= diasTotais) {
    diasPassados = diasTotais;
    estado = "colhido"; // muda estado para colhido
    fase = 3;           // fase final
  }
}

// Atualiza a fase da planta conforme o progresso percentual do tempo total
function atualizarFase() {
  if (diasPassados >= diasTotais) {
    fase = 3; // colhido
  } else if (diasPassados >= diasTotais * 0.7) {
    fase = 2; // quase maduro
  } else if (diasPassados >= diasTotais * 0.3) {
    fase = 1; // crescimento intermediário
  } else {
    fase = 0; // fase inicial (broto)
  }
}

// Desenha a planta e barra de progresso de crescimento na tela
function desenharCrescimento() {
  textAlign(CENTER);
  fill("#1b4332");
  textSize(24);
  text(`🌿 Crescimento de ${plantaSelecionada}`, width / 2, 60);

  // Desenha representação gráfica da planta na fase atual
  desenharPlanta(fase);

  // Desenha barra branca de fundo (contorno)
  let progresso = map(diasPassados, 0, diasTotais, 0, 300); // mapeia dias para pixels
  fill(255);
  stroke(180);
  rect(width / 2 - 150, 220, 300, 25, 10);

  // Preenche a barra proporcional ao progresso com cor verde
  noStroke();
  fill("#2b9348");
  rect(width / 2 - 150, 220, progresso, 25, 10);

  // Texto mostrando dias passados e total
  fill(50);
  textSize(16);
  text(`Dias: ${diasPassados} / ${diasTotais}`, width / 2, 260);

  // Texto explicando a fase atual do crescimento
  let textosFase = [
    "🌱 Fase 1: Broto nascendo",
    "🌿 Fase 2: Crescimento acelerado",
    "🌳 Fase 3: Quase pronto para colher",
    "🎉 Colhido!"
  ];
  text(textosFase[fase], width / 2, 300);
}

// Função que desenha a planta de forma simples, de acordo com a fase
function desenharPlanta(fase) {
  push();
  translate(width / 2, 140);

  // Desenha caule
  stroke(100, 70, 20);
  strokeWeight(6);
  line(0, 0, 0, 50);

  // Folhas nas diferentes fases
  noStroke();
  fill("#2b9348");
  if (fase >= 0) {
    ellipse(-15, 15, 25, 15);
    ellipse(15, 15, 25, 15);
  }
  if (fase >= 1) {
    ellipse(-20, 0, 20, 12);
    ellipse(20, 0, 20, 12);
  }
  if (fase >= 2) {
    ellipse(0, -20, 30, 20);
  }
  if (fase >= 3) {
    fill("#ffcc00");
    ellipse(0, -40, 25, 25); // Flor/amarelo para fase colhida
  }

  pop();
}

// Funções auxiliares para criar título e labels estilizados
function createTitle(titulo) {
  let t = createP(titulo);
  t.position(40, 10);
  t.style("font-size", "28px");
  t.style("font-weight", "bold");
  t.style("color", "#2b9348");
  t.style("margin", "0");
}

function createLabel(texto, y) {
  let label = createP(texto);
  label.position(60, y);
  label.style("font-size", "16px");
  label.style("margin", "0 0 5px 0");
}

// Função para desenhar um "card" branco com texto centralizado
function drawCard(texto, x, y) {
  fill(255);
  stroke(200);
  rect(x - 130, y - 30, 260, 60, 12);
  noStroke();
  fill("#2b9348");
  textSize(18);
  textAlign(CENTER, CENTER);
  text(texto, x, y);
}