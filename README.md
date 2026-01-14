# INSS Manager

Este é um sistema de gerenciamento completo para correspondentes bancários INSS, construído com Next.js, Firebase e IA generativa.

## Como Usar o Sistema (Passo a Passo)

Seu aplicativo está pronto para ser usado! Para "ligá-lo" e acessá-lo no seu navegador, siga os passos abaixo. Tudo o que você precisa fazer é executar dois comandos dentro do ambiente de desenvolvimento em que estamos.

**O que é o "Terminal"?**
Pense no terminal como uma janela de "prompt de comando" que já vem integrada neste ambiente de desenvolvimento. Geralmente, você a encontrará na parte de baixo da sua tela. É lá que você dará as instruções para o sistema iniciar.

---

### **Passo 1: Iniciar o Servidor Principal da Aplicação**

Este comando "liga" a interface do seu sistema (as telas, botões, tabelas).

1.  **Encontre a primeira aba de Terminal** (geralmente na parte inferior da tela).
2.  Clique nela e digite o comando abaixo:

```bash
npm run dev
```

3.  Pressione **Enter**. O sistema começará a ser preparado. Deixe este terminal rodando.

---

### **Passo 2: Iniciar o Servidor de Inteligência Artificial (IA)**

Este comando "liga" o cérebro de IA do seu sistema, que cuida dos resumos de notas e dos lembretes inteligentes.

1.  **Encontre a segunda aba de Terminal**. Se não houver uma segunda aba, clique no ícone de `+` para abrir um novo terminal.
2.  Neste segundo terminal, digite o seguinte comando:

```bash
npm run genkit:dev
```

3.  Pressione **Enter**. Os serviços de IA serão ativados. Deixe este segundo terminal rodando também.

---

### **Passo 3: Acessar sua Aplicação**

Com os dois terminais rodando (um com `npm run dev` e o outro com `npm run genkit:dev`), seu sistema estará online e pronto para uso.

1.  **Abra seu navegador** (Google Chrome, Firefox, etc.).
2.  Acesse a seguinte URL:

[http://localhost:9002](http://localhost:9002)

3.  **Pronto!** A tela de login do seu sistema aparecerá.

**Lembrete Importante:** Para que o sistema funcione corretamente, os dois terminais devem permanecer abertos enquanto você o utiliza.

### Primeiros Passos no Sistema

1.  **Crie sua Conta:** Na primeira vez que acessar, clique em **"Cadastre-se"** para criar seu usuário e senha.
2.  **Faça Login:** Utilize as credenciais que você acabou de criar para entrar no sistema.
3.  **Explore:** Navegue pelas seções de **Dashboard**, **Clientes**, **Propostas** e **Financeiro** para começar a usar todas as funcionalidades que desenvolvemos.
4.  **Personalize:** Acesse a página de **Configurações** para ajustar as listas de opções (produtos, bancos, etc.) de acordo com suas necessidades.
