# Formatos MARC em Português (Brasil)

Tradução para português (Brasil) para os Formatos MARC fornecidos pela Library of Congress (https://www.loc.gov/marc/).

Portuguese (Brazil) translation for the MARC Format as provided by the Library of Congress (https://www.loc.gov/marc/).

É possível observar o progresso em: https://luizbgomide.github.io/MARC-Standards/

## Estrutura de arquivos

`/site` contém os arquivos baixados da Library of Congress e preparados para tradução.

`/docs/pt-BR/` é onde está depositada a tradução produzida pelo Crowdin.

## Procedimentos para geração dos arquivos fonte

1. Baixar os arquivos com o programa programa Cyotek WebCopy (projeto `original-site.cwp`).
2. Formatar usando formatador HTML padrão do VSCode e a extensão *Format Files* para aplicação em todos os arquivos HTML (ver `.vscode\settings.json`).
3. Executar o arquivo `limpaHTML.js` (com o Node, testado em Windows) para remover chamadas de scripts e trocar o _"Contact Us"_ pelo link de acesso ao original.
