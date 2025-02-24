
## No escopo, regras:
- Drones saem de um ponto específico (origem) e fazem entregas
- Cada drone sai com todos os pedidos atribuídos a ele e somente os entrega
- Para entregá-lo, ele passa por cima de um local (coordenada) de entrega
- Após uma entrega, o drone imediatamente sai para a próxima entrega
- Drones fazem as entregas em paralelo

## Fora do escopo:
- Altura dos drones (terceira coordenada)
- Colisões entre drones
- Reabastecimento dos drones / coleta dos pedidos
- Tempo que o drone fica ocioso fazendo uma entrega

## Tecnologias:
Como é um teste técnico, é mais prático para o avaliador receber um projeto que não precisa de nenhum ambiente, emulador ou software externo para depurar o código.

Para executar o teste, basta ter um navegador.

Com base nisso, opta-se por um site simples (HTML + javascript).

**PS: não sou um desenvolvedor web!**

## Algoritmo:
Com N pedidos (chopps) para K drones:

- O programa supõe que os primeiros K pedidos mais próximos dos drones são os pedidos ótimos para os drones fazerem as primeiras entregas

- Acha-se a permutação ideal de drones e pedidos para maximizar o paralelismo entre os drones, minimizando a "distância máxima" dessas entregas, para isso, se utiliza o "melhor pior caso" das distâncias entre as permutações entre os K drones e K entregas mais próximas desses drones

   (se usássemos força bruta nesse algoritmo para varrer todas as permutações de cada conjunto de K entregas, o custo seria K! (fatorial de K drones), pra cada iteração)

- Após a primeira iteração de entregas, os K drones assumem a posição das K entregas realizadas

- Repete-se o processo com as próximas K entregas mais próximas das novas posições dos K drones


<br><br><br><br>
