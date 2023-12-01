// Função para calcular pontuação de uma mão
function calcularPontuacao(mao) {
  let pontuacao = 0;

  // +1 ponto para cada carta de mesmo naipe
  const naipes = {};
  mao.forEach(cart => {
    naipes[cart.naipe] = (naipes[cart.naipe] || 0) + 1;
  });

  for (const naipe in naipes) {
    pontuacao += naipes[naipe] > 1 ? naipes[naipe] : 0;
  }

  // +2 pontos para cada carta que esteja em sequência de cartas consultivas
  const valoresConsultivos = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'valete', 'dama', 'rei', 'ás'];
  mao.sort((a, b) => valoresConsultivos.indexOf(a.valor) - valoresConsultivos.indexOf(b.valor));

  let sequenciaAtual = 1;

  for (let i = 0; i < mao.length - 1; i++) {
    if (valoresConsultivos.indexOf(mao[i + 1].valor) - valoresConsultivos.indexOf(mao[i].valor) === 1) {
      sequenciaAtual++;
    } else {
      sequenciaAtual = 1;
    }

    if (sequenciaAtual >= 3) {
      pontuacao += 2;
    }
  }

  return pontuacao;
}


// Função para encontrar o melhor trio com a maior pontuação
function encontrarMelhorTrio(cartas) {
  let melhorPontuacao = 0;
  let melhorTrio = [];

  // Gerar todas as combinações possíveis de trios
  const getCombinacoes = (lista, r) => {
    const result = [];

    const combinacaoAuxiliar = (temp, start) => {
      if (temp.length === r) {
        result.push([...temp]);
        return;
      }

      for (let i = start; i < lista.length; i++) {
        temp.push(lista[i]);
        combinacaoAuxiliar(temp, i + 1);
        temp.pop();
      }
    };

    combinacaoAuxiliar([], 0);
    return result;
  };

  const combinacoes = getCombinacoes(cartas, 3);

  for (const combinacao of combinacoes) {
    const pontuacao = calcularPontuacao(combinacao);
    if (pontuacao > melhorPontuacao) {
      melhorPontuacao = pontuacao;
      melhorTrio = combinacao;
    }
  }

  return { melhorTrio, melhorPontuacao };
}

// Função para criar um baralho padrão
function criarBaralho() {
  const naipes = ['copas', 'ouros', 'espadas', 'paus'];
  const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'valete', 'dama', 'rei', 'ás'];
  const baralho = [];

  for (const naipe of naipes) {
    for (const valor of valores) {
      baralho.push({ naipe, valor });
    }
  }

  return baralho;
}

// Função para embaralhar o baralho
function embaralharBaralho(baralho) {
  for (let i = baralho.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [baralho[i], baralho[j]] = [baralho[j], baralho[i]];
  }
}

// Função para distribuir cartas para os jogadores e cartas da mesa
function distribuirCartas(baralho, numJogadores) {
  const maos = [];
  for (let i = 0; i < numJogadores; i++) {
    maos.push([]);
  }

  // Distribuir 3 cartas para cada jogador
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < numJogadores; j++) {
      maos[j].push(baralho.pop());
    }
  }

  // Cartas na mesa (2 cartas)
  const mesa = [baralho.pop(), baralho.pop()];

  return { maos, mesa };
}

// Função para exibir cartas de cada jogador
function exibirCartas(jogador, cartas) {
  console.log(`Jogador ${jogador} - Cartas:`, cartas);
}

// Execução do código
const baralho = criarBaralho();
embaralharBaralho(baralho);

const numJogadores = 4;
const { maos, mesa } = distribuirCartas(baralho, numJogadores);

for (let i = 0; i < numJogadores; i++) {
  exibirCartas(i + 1, maos[i]);
}

console.log("\nCartas na mesa:", mesa);

// Execução do código
const pontuacoes = maos.map(mao => calcularPontuacao(mao));
console.log("\nPontuações dos Jogadores:", pontuacoes);

for (let i = 0; i < numJogadores; i++) {
  const { melhorTrio, melhorPontuacao } = encontrarMelhorTrio(maos[i]);
  console.log(`\nMelhor Trio para Jogador ${i + 1}:`, melhorTrio);
  console.log(`Pontuação do Melhor Trio para Jogador ${i + 1}:`, melhorPontuacao);
}

// Função para realizar a rodada final
function rodadaFinal(baralho, maos, mesa) {
  for (let i = 0; i < maos.length; i++) {
    // Adicionar 2 cartas à mão do jogador na rodada final
    maos[i] = maos[i].concat(mesa, [baralho.pop(), baralho.pop()]);
  }
}

// Função principal para simular o jogo
function simularJogo() {
  const baralho = criarBaralho();
  embaralharBaralho(baralho);

  const numJogadores = 4;
  const { maos, mesa } = distribuirCartas(baralho, numJogadores);

  for (let i = 0; i < numJogadores; i++) {
    console.log("\n--- Rodada Inicial ---");
    exibirCartas(i + 1, maos[i]);
  }

  rodadaFinal(baralho, maos, mesa);

  for (let i = 0; i < numJogadores; i++) {
    console.log("\n--- Rodada Final ---");
    const { melhorTrio, melhorPontuacao } = encontrarMelhorTrio(maos[i]);
    exibirCartasETrio(i + 1, maos[i], { melhorTrio, melhorPontuacao });
  }
}

// Função para exibir cartas de cada jogador
function exibirCartas(jogador, cartas) {
  console.log(`Jogador ${jogador} - Cartas:`, cartas);
}

// Função para exibir cartas e o melhor trio de um jogador
function exibirCartasETrio(jogador, cartas, { melhorTrio, melhorPontuacao }) {
  console.log(`Jogador ${jogador} - Cartas:`, cartas);
  console.log(`Melhor Trio:`, melhorTrio);
  console.log(`Pontuação do Melhor Trio:`, melhorPontuacao);
}

// Executar a simulação do jogo
simularJogo();
