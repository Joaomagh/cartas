// Função para calcular pontuação de uma mão
function calcularPontuacao(mao) {
  let pontuacao = 0;

  // +1 ponto para cada carta de mesmo naipe
  const naipes = {};
  mao.forEach(carta => {
    naipes[carta.naipe] = (naipes[carta.naipe] || 0) + 1;
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
  const maos = Array.from({ length: numJogadores }, () => []);

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
  console.log(`Jogador ${jogador} - Cartas:`);
  cartas.forEach(carta => console.log(`  ${carta.naipe} ${carta.valor}`));
}

// Execução do código
const baralho = criarBaralho();
embaralharBaralho(baralho);

const numJogadores = 4;
const { maos, mesa } = distribuirCartas(baralho, numJogadores);

// Exibir cartas iniciais dos jogadores
for (let i = 0; i < numJogadores; i++) {
  exibirCartas(i + 1, maos[i]);
}

// Exibir cartas na mesa
console.log('\n--- Cartas na Mesa ---');
exibirCartas('Mesa', mesa);

// Calcular e exibir pontuações dos jogadores
console.log('\n--- Pontuações dos Jogadores ---');
const pontuacoes = maos.map(mao => calcularPontuacao(mao));
pontuacoes.forEach((pontuacao, index) => {
  console.log(`Jogador ${index + 1}: ${pontuacao} ponto(s)`);
});

// Exibir rodada final
console.log('\n--- Rodada Final ---');
for (let i = 0; i < numJogadores; i++) {
  console.log(`\n--- Jogador ${i + 1} ---`);
  const { melhorTrio, melhorPontuacao } = encontrarMelhorTrio([...maos[i], ...mesa]);

  // Exibir a mão completa do jogador na rodada final
  exibirCartas(i + 1, [...maos[i], ...mesa]);

  // Exibir o melhor trio possível e sua pontuação
  console.log('\nMelhor Trio:');
  melhorTrio.forEach(cart => console.log(`  ${cart.naipe} ${cart.valor}`));
  console.log(`Pontuação do Melhor Trio: ${melhorPontuacao}\n`);
}
