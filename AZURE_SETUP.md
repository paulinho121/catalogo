# Configuração do Azure para o Catalogo AI

Este guia passo a passo ajudará você a obter as chaves de conexão necessárias para conectar seu aplicativo ao Microsoft Azure.

## 1. Criar e Conectar o Azure Cosmos DB (Banco de Dados)

O Cosmos DB será usado para armazenar os dados dos produtos (nome, SKU, descrição, contexto RAG).

1.  Acesse o [Portal do Azure](https://portal.azure.com/).
2.  Na barra de pesquisa, digite **"Azure Cosmos DB"** e selecione o serviço.
3.  Clique em **+ Create** (Criar).
4.  Selecione a opção **"Azure Cosmos DB for NoSQL"**.
5.  Preencha os detalhes básicos:
    *   **Subscription**: Sua assinatura do Azure.
    *   **Resource Group**: Crie um novo (ex: `CatalogoAI-RG`) ou use um existente.
    *   **Account Name**: Um nome único (ex: `catalogo-ai-db`).
    *   **Location**: Escolha a região mais próxima (ex: `Brazil South`).
    *   **Capacity Mode**: Pode deixar como "Provisioned" ou "Serverless" (Serverless é mais barato para testes).
6.  Clique em **Review + create** e depois em **Create**. (Isso pode levar alguns minutos).
7.  Após a criação, clique em **Go to resource**.
8.  No menu lateral esquerdo, procure por **Settings** -> **Keys**.
9.  Copie o valor do campo **PRIMARY CONNECTION STRING**.
10. Cole este valor no seu arquivo `.env.local` na variável:
    ```env
    VITE_AZURE_COSMOS_CONNECTION_STRING="sua_string_copiada_aqui"
    ```

## 2. Criar e Conectar o Storage Account (Imagens e Arquivos)

O Storage Account será usado para salvar as imagens dos produtos e os PDFs técnicos.

1.  Volte para a página inicial do [Portal do Azure](https://portal.azure.com/).
2.  Pesquise por **"Storage accounts"** e selecione.
3.  Clique em **+ Create**.
4.  Preencha os detalhes basicos:
    *   **Resource Group**: Use o mesmo criado anteriormente (ex: `CatalogoAI-RG`).
    *   **Storage account name**: Um nome único, tudo minúsculo (ex: `catalogoaistorage`).
    *   **Region**: Mesma do banco de dados (ex: `Brazil South`).
    *   **Redundancy**: "LRS" (Locally-redundant storage) é mais barato e suficiente.
5.  Clique em **Review + create** e depois em **Create**.
6.  Após a criação, clique em **Go to resource**.
7.  No menu lateral esquerdo, procure por **Security + networking** -> **Access keys**.
8.  Clique em **Show** ao lado da **key1**.
9.  Copie o valor do campo **Connection string**.
10. Cole este valor no seu arquivo `.env.local` na variável:
    ```env
    VITE_AZURE_STORAGE_CONNECTION_STRING="sua_string_copiada_aqui"
    ```

## 3. Configurar CORS (Importante para Web App)

Para que seu site consiga enviar arquivos direto para o Azure, você precisa liberar o acesso.

1.  Ainda no recurso de **Storage Account**.
2.  No menu lateral, vá em **Settings** -> **Resource sharing (CORS)**.
3.  Acesse a aba **Blob service**.
4.  Adicione uma nova regra:
    *   **Allowed origins**: `*` (ou `http://localhost:3000` para ser mais seguro).
    *   **Allowed methods**: Selecione todos (GET, POST, PUT, etc).
    *   **Allowed headers**: `*`
    *   **Exposed headers**: `*`
    *   **Max age**: `86400`
5.  Clique em **Save**.

---

## 4. Finalizando

Após colar as duas strings de conexão no arquivo `.env.local`, **reinicie o seu terminal** (pare o `npm run dev` e rode novamente) para que as novas variáveis sejam carregadas.

Seu app agora estará salvando dados reais na nuvem! 🚀
