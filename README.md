# 🎓 Universidade JL - Sistema de Diplomacia Digital

Bem-vindo ao sistema de emissão e verificação de diplomas digitais da **Universidade JL**. Este projeto é uma solução full-stack desenvolvida em **Next.js** que combina manipulação de documentos PDF com criptografia de ponta para garantir a autenticidade e integridade de títulos acadêmicos.

---

## 🚀 Visão Geral do Sistema

O sistema foi projetado para resolver o problema de falsificação de documentos acadêmicos através do padrão **PAdES (PDF Advanced Electronic Signatures)**. Ele permite que a secretaria acadêmica emita documentos já assinados digitalmente e que qualquer terceiro valide a autenticidade do documento através de um portal público.

### 🛠️ Tecnologias Utilizadas

*   **Framework**: Next.js (App Router)
*   **Linguagem**: TypeScript
*   **Manipulação de PDF**: `pdf-lib` (Geração e estruturação de documentos)
*   **Assinatura Digital**: `node-signpdf` (Injeção de assinaturas no padrão PAdES)
*   **Criptografia**: `node-forge` (Leitura de pacotes PKCS#12 e manipulação de certificados)
*   **Validação de Formulários**: `react-hook-form` + `zod`
*   **Estilização**: Tailwind CSS (UI/UX Premium)

---

## ✨ Funcionalidades Principais

### 1. Emissão de Diplomas com Assinatura Digital
Interface administrativa para geração de diplomas personalizados.
*   **Geração Automática**: Criação de PDF em tempo real com dados do aluno (Nome, CPF, Curso).
*   **Segurança PAdES**: O documento é gerado com uma tabela `xref` simplificada e um placeholder de assinatura reserva.
*   **Assinatura Privada**: Utiliza um certificado institucional (`.p12`) para aplicar uma assinatura criptográfica no padrão ICP-Brasil.

### 2. Portal de Verificação de Autenticidade
Módulo público onde usuários podem validar a integridade de qualquer diploma emitido pela instituição.
*   **Upload Inteligente**: Processamento de arquivos PDF via Drag & Drop.
*   **Extração Criptográfica**: O sistema extrai o objeto PKCS#7 embutido no PDF, identifica o certificado do emissor e verifica o hash do documento.
*   **Transparência**: Exibição detalhada dos dados do certificado (Emissor, Validade, Número de Série).

---

## 📂 Estrutura do Projeto

```text
├── app/
│   ├── api/
│   │   ├── emitir-diploma/    # API de geração e assinatura
│   │   └── verificar-diploma/ # API de validação criptográfica
│   ├── dashboard/
│   │   ├── emitir-diploma/    # UI de emissão (Secretaria)
│   │   └── verificar-diploma/ # UI de validação (Público)
│   └── page.tsx               # Redirecionamento principal
├── public/                    # Assets estáticos
├── certificado_universidade.p12 # Certificado institucional (Exemplo)
└── package.json               # Dependências do sistema
```

---

## ⚙️ Configuração e Instalação

### Pré-requisitos
*   Node.js 18+
*   OpenSSL (para gerar certificados de teste)

### Passos para Instalação

1.  **Instale as dependências**:
    ```bash
    npm install
    ```

2.  **Gerar Certificado de Teste** (Caso não possua um):
    ```bash
    # Gerar chave e certificado público
    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
    
    # Exportar para formato P12 (Senha padrão: 1234)
    openssl pkcs12 -export -out certificado_universidade.p12 -inkey key.pem -in cert.pem
    ```

3.  **Rodar o ambiente de desenvolvimento**:
    ```bash
    npm run dev
    ```

---

## 🔒 Detalhes Técnicos da Assinatura

O processo de assinatura segue os seguintes passos técnicos:
1.  **Criação**: O PDF é criado com a biblioteca `pdf-lib`.
2.  **Preparação**: Um campo de assinatura vazio é adicionado com tamanho reservado de 8192 bytes.
3.  **Hashing**: O sistema calcula o digest do documento (excluindo o campo da assinatura).
4.  **Criptografia**: O hash é assinado com a chave privada do certificado `.p12`.
5.  **Injeção**: O bloco PKCS#7 resultante é inserido no PDF em modo hexadecimal.

---

## 👨‍💻 Desenvolvedores
Projeto desenvolvido para a **Universidade JL**, focado em segurança da informação e modernização de processos acadêmicos.
