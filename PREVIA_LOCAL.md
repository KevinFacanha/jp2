# Pré-visualização local

Requer Node.js 18 ou mais recente e acesso à internet. Não é necessário instalar dependências nem configurar credenciais do Google.

No terminal do VS Code, na pasta do workspace que contém a subpasta `jp2`, execute:

```sh
node jp2/server.mjs
```

Se o terminal já estiver dentro da pasta que contém `index.html`, execute `node server.mjs`.

Abra **http://localhost:4174/#depoimentos**. Mantenha o terminal aberto; use `Ctrl+C` para encerrar.

Use esse servidor para testar as avaliações. Abrir o HTML diretamente, usar Live Server ou outro servidor de arquivos estáticos não disponibiliza a rota da API.

## Dados reais

O servidor local atende `/api/google-reviews` e consulta exclusivamente o endpoint público `https://imperador-do-turismo.vercel.app/api/google-reviews`. O navegador faz uma requisição para o próprio localhost; o acesso à Vercel ocorre no Node, sem depender de CORS.

A resposta é preservada, incluindo nota, quantidade total e comentários reais. Há cache local em memória de cinco minutos e compartilhamento de consultas simultâneas. Reinicie o servidor para limpar esse cache.

O endpoint publicado pode continuar retornando apenas três comentários até que a mudança do limite seja publicada. As cópias usadas nas animações são decorativas e não aumentam o total de avaliações.

Se a Vercel ou a conexão estiver indisponível, o terminal informa a falha e a seção mostra o estado de indisponibilidade. Nenhuma avaliação fictícia é criada.

## Testar o layout

- Desktop: três colunas, sentidos verticais alternados, loop contínuo e pausa ao passar o mouse.
- Mobile: use uma largura de até 760 px nas ferramentas do navegador; uma avaliação por vez, avanço a cada seis segundos, botões e gestos verticais.
- Para observar o avanço automático, mantenha a seção visível, a aba ativa e o ponteiro fora dos cards. A preferência de movimento reduzido do sistema desativa as animações e o autoplay.

## Produção

Este servidor escuta somente na interface local e recusa execução com `VERCEL` definido ou `NODE_ENV=production`. Ele não altera o frontend, a função `api/google-reviews.js`, as credenciais ou as variáveis de ambiente da Vercel. O proxy é exclusivo do servidor local.
