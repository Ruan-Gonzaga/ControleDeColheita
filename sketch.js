// Definição das plantas e tempos
let plantas = {
  "🌽 Milho": 10,
  "🍓 Morango": 7,
  "🥕 Cenoura": 5,
  "🍅 Tomate": 8,
  "🥔 Batata": 6
};

// Interface e jogo
let selectPlanta, inputArea, botaoPlantar;
let estado = "selecao";
let plantaSelecionada = null;
let diasTotais = 0;
let dataInicio = 0;
let diasPassados = 0;
let fase = 0;

function setup() {
  createCanvas(800, 450); // mais largo
  textFont("Arial");

  // Painel lateral à esquerda
  let title = createP("🌱 Simulador de Plantio<br>(1 Minuto = 1 Dia)");
  title.position(20, 20);
  title.style("font-size", "20px");
  title.style("color", "#2b9348");
  title.style("font-weight", "bold");

  let labelPlanta = createP("Escolha a planta:");
  labelPlanta.position(20, 80);
  labelPlanta.style("color", "#333");

  selectPlanta = createSelect();
  selectPlanta.position(20, 110);
  selectPlanta.size(160);
  selectPlanta.option("Selecione...");
  for (let nome in plantas) selectPlanta.option(nome);

  let labelArea = createP("Área plantada (m²):");
  labelArea.position(20, 160);
  labelArea.style("color", "#333");

  inputArea = createInput();
  inputArea.position(20, 190);
  inputArea.size(160);

  botaoPlantar = createButton("🌾 Plantar");
  botaoPlantar.position(20, 230);
  botaoPlantar.size(160);
  botaoPlantar.mousePressed(iniciarPlantio);
}

function draw() {
  background("#f0fbe0");

  // Informações principais do jogo à direita
  push();
  translate(220, 0); // Desloca o "mundo" do jogo para a direita

  // Dias passados
  fill("#2b9348");
  textAlign(RIGHT);
  textSize(18);
  text(`⏳ Dias: ${diasPassados}`, width - 220 - 20, 30); // último canto à direita

  if (estado === "selecao") {
    drawCard(
      "Selecione uma planta e área para começar!",
      width / 2 - 110,
      height / 2 - 50
    );
  } else if (estado === "crescendo") {
    atualizarDiasPassados();
    atualizarFase();
    desenharCrescimento();
  } else if (estado === "colhido") {
    drawCard(
      `🎉 ${plantaSelecionada} colhida!`,
      width / 2 - 110,
      height / 2 - 50
    );
    desenharPlanta(3);
  }
  pop();
}

function iniciarPlantio() {
  let planta = selectPlanta.value();
  let area = float(inputArea.value());

  if (planta === "Selecione..." || isNaN(area) || area <= 0) {
    alert("❗ Por favor, escolha uma planta e informe uma área válida.");
    return;
  }

  plantaSelecionada = planta;
  diasTotais = Math.ceil(plantas[planta] * (area / 100));
  dataInicio = millis();
  diasPassados = 0;
  fase = 0;
  estado = "crescendo";

  selectPlanta.hide();
  inputArea.hide();
  botaoPlantar.hide();
}

// Atualizações
function atualizarDiasPassados() {
  let agora = millis();
  diasPassados = Math.floor((agora - dataInicio) / 60000); // 1min = 1 dia
  if (diasPassados >= diasTotais) {
    diasPassados = diasTotais;
    estado = "colhido";
    fase = 3;
  }
}

function atualizarFase() {
  if (diasPassados >= diasTotais) fase = 3;
  else if (diasPassados >= diasTotais * 0.7) fase = 2;
  else if (diasPassados >= diasTotais * 0.3) fase = 1;
  else fase = 0;
}

// Desenhar progresso e planta
function desenharCrescimento() {
  textAlign(CENTER);
  fill("#1b4332");
  textSize(24);
  text(`🌿 Crescimento de ${plantaSelecionada}`, width / 2 - 110, 60);

  desenharPlanta(fase);

  let progresso = map(diasPassados, 0, diasTotais, 0, 300);
  fill(255);
  stroke(180);
  rect(width / 2 - 110 - 150, 220, 300, 25, 10);
  noStroke();
  fill("#2b9348");
  rect(width / 2 - 110 - 150, 220, progresso, 25, 10);

  fill(50);
  textSize(16);
  text(`Dias: ${diasPassados} / ${diasTotais}`, width / 2 - 110, 260);

  let textosFase = [
    "🌱 Fase 1: Broto",
    "🌿 Fase 2: Crescimento",
    "🌳 Fase 3: Quase pronto",
    "🎉 Colhido!"
  ];
  text(textosFase[fase], width / 2 - 110, 300);
}

function desenharPlanta(fase) {
  push();
  translate(width / 2 - 110, 140);
  stroke(100, 70, 20);
  strokeWeight(6);
  line(0, 0, 0, 50);
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
    ellipse(0, -40, 25, 25);
  }
  pop();
}

// Card de aviso centralizado
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
