# ScratchViewerOfflineMode - instrucoes

Galeria estatica para abrir os projetos Scratch da Jornada Tecnologica SKA.

## Como rodar localmente

Na pasta do projeto:

```bash
npm run dev
```

Esse comando sobe um servidor local na porta 8000 e abre automaticamente:

```text
http://localhost:8000/paginaPrincipal.html
```

No VSCode, tambem da para usar:

1. Abra a pasta `ScratchViewerOfflineMode`.
2. Pressione `Ctrl+Shift+P`.
3. Escolha `Tasks: Run Build Task`.
4. Selecione `Abrir galeria local`.

## Validar recursos

Para verificar se os arquivos locais existem e se os links remotos respondem:

```bash
npm run validate
```

O script gera `tools/validate_report.json` com o resultado das verificacoes e mostra um resumo no terminal. Projetos com `arquivo` vazio aparecem como jogos pendentes, nao como caminhos quebrados.

## Estrutura dos dados

- `paginaPrincipal.html`: home com os cards dos anos.
- `equipe/equipe.html`: pagina visual da equipe SKA Tech Hub.
- `equipe/equipe.js`: dados editaveis da equipe, incluindo nome, cargo, foto e descricao.
- `equipe/imagens`: fotos usadas na pagina da equipe.
- `2023/projetosOffline.js`: dados carregados pela pagina de 2023.
- `2023/projetos.js` e `2023/projetos23.js`: copias legadas dos dados de 2023.
- `2024/projetos24.js`: dados dos projetos de 2024.
- `2025/projetosOffline.js`: dados de 2025 usando HTMLs locais.
- `2025/projetos.js`: dados de 2025 usando links online do Scratch.

## Editar a equipe SKA Tech Hub

Edite os textos da equipe neste arquivo:

```text
equipe/equipe.js
```

Cada pessoa tem este formato:

```js
{
  nome: "Emerson",
  cargo: "Estagiario",
  foto: "imagens/Emerson.jpg",
  descricao: "Texto breve editavel."
}
```

Para adicionar ou trocar uma foto, coloque a imagem em:

```text
equipe/imagens
```

Depois atualize o campo `foto`. Se a pessoa ainda nao tiver foto, deixe `foto: ""`.

## Adicionar jogos de 2023 ou 2024

As pastas `2023/jogos` e `2024/jogos` ja estao prontas para receber os HTMLs exportados.

1. Exporte o projeto Scratch como HTML, por exemplo usando o TurboWarp Packager.
2. Salve o arquivo em `2023/jogos` ou `2024/jogos`.
3. Atualize o campo `arquivo` do projeto correspondente.

Exemplo para 2023:

```js
arquivo: "jogos/GaFer Maze.html"
```

Exemplo para 2024:

```js
arquivo: "jogos/Labirinto Estrelar.html"
```

Depois rode:

```bash
npm run validate
```

Se o projeto estiver somente no Scratch online, o campo `arquivo` tambem aceita links como:

```js
arquivo: "https://scratch.mit.edu/projects/123456789/"
```

## Observacoes

- Os projetos de 2025 possuem modo online em `2025/projetos.js` e modo offline em `2025/projetosOffline.js`.
- Projetos com `arquivo` vazio abrem normalmente e mostram uma mensagem informando que o jogo ainda nao foi incluido nesta copia offline.
