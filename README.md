# Visualizador Scratch

Galeria dos projetos da Jornada Tecnológica SKA Tech Hub, de 2023 a 2026.

## Abrir

Abra `detalhe-projeto-modelo.html` no navegador e escolha o ano e o projeto.

## Adicionar um jogo

1. Converta o projeto `.sb3` para HTML usando o **TurboWarp Packager**.
2. Salve o HTML na pasta dos jogos do ano, por exemplo `HTMLS_2026/`.
3. Na página do grupo em `pagina-jogos/`, aponte o `src` do `<iframe>` para o arquivo, usando um caminho relativo. Exemplo:

   ```html
   <iframe src="../HTML_2026/Nome_Da_Dupla.html"></iframe>
   ```

Os nomes dos arquivos precisam corresponder exatamente, incluindo espaços, acentos e maiúsculas.

## Pastas principais

- `HTML_2023/` a `HTML_2026/` e `HTMLS_2026/`: jogos exportados para HTML.
- `pagina-jogos/`: páginas individuais de cada projeto.
- `imagens/`: fotos e imagens da galeria.
- `detalhe-projeto-modelo.html` e `estilo.css`: página principal e estilos.
