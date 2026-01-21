# Guia de Deploy no Azure Static Web Apps

Como seu código já está no GitHub, a maneira mais fácil e profissional de colocar seu site no ar é usando o **Azure Static Web Apps**. Ele conecta direto com seu repositório e atualiza o site automaticamente sempre que você fizer um `git push`.

## Passo 1: Criar o Recurso no Azure

1.  Acesse o [Portal do Azure](https://portal.azure.com/).
2.  Pesquise por **"Static Web Apps"** e selecione.
3.  Clique em **+ Create** (Criar).
4.  **Aba Basics (Básico):**
    *   **Subscription:** Sua assinatura.
    *   **Resource Group:** Use o mesmo de antes (`catalogoai-rg`).
    *   **Name:** Dê um nome ao site (ex: `catalogo-ai-web`).
    *   **Plan type:** Selecione **Free** (Grátis para hobby/pessoal).
    *   **Source:** Selecione **GitHub**.
    *   Clique no botão **"Sign in with GitHub"** e autorize o Azure.
5.  **Detalhes do Repositório:**
    *   **Organization:** Seu usuário (`paulinho121`).
    *   **Repository:** `catalogo`.
    *   **Branch:** `main`.
6.  **Build Details (Detalhes da Build):**
    *   **Build Presets:** Selecione **Custom** (ou Vite se aparecer).
    *   **App location:** `/`
    *   **Api location:** (Deixe em branco)
    *   **Output location:** `dist`
7.  Clique em **Review + create** e depois em **Create**.

## Passo 2: Configurar Variáveis de Ambiente (MUITO IMPORTANTE)

O seu site precisa das chaves do banco de dados para funcionar, mas o arquivo `.env.local` não vai para o GitHub por segurança. Você precisa cadastrar essas chaves no Azure.

1.  Quando o deploy terminar, clique em **Go to resource**.
2.  No menu lateral, vá em **Settings** -> **Environment variables** (ou Configuration).
3.  Clique em **+ Add**.
4.  Adicione as mesmas variáveis que estão no seu `.env.local`:

    | Name | Value |
    |------|-------|
    | `VITE_AZURE_COSMOS_CONNECTION_STRING` | (Sua string do Cosmos DB) |
    | `VITE_AZURE_STORAGE_CONNECTION_STRING` | (Sua string do Storage) |
    | `VITE_GEMINI_API_KEY` | (Sua chave da IA, se tiver) |

5.  Clique em **Save**.

## Passo 3: Acessar seu Site

1.  Na tela de **Overview** (Visão Geral) do seu Static Web App, procure por **URL**.
2.  Clique no link e seu aplicativo estará n oar! 🌐

---
**Nota:** Pode levar alguns minutos para o GitHub Actions terminar de construir o site pela primeira vez. Você pode acompanhar o progresso na aba "Actions" do seu repositório no GitHub.
