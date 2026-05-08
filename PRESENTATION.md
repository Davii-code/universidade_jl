# 📣 Apresentação – Emissão de Diplomas Digitais

## 1️⃣ Contexto
- **Desafio:** Gerar diplomas em PDF com assinatura digital (PAdES) de forma rápida, segura e sem processos manuais de impressão e assinatura física.
- **Objetivo da solução:** Oferecer aos usuários da **Universidade JL** uma interface web simples que coleta os dados do egresso, valida‑os e devolve o diploma assinado em poucos cliques.

## 2️⃣ Visão geral da solução
- **Tecnologia:** Next.js (React + SSR) + TypeScript.
- **UI:** Tailwind CSS – design moderno, responsivo e com micro‑animações.
- **Formulário:** react‑hook‑form + Zod garantem validação de dados antes da chamada ao backend.
- **Fluxo de assinatura:** API `/api/emitir-diploma` cria o PDF e o assina usando o certificado `certificado_universidade.p12` (PAdES), devolvendo o arquivo pronto para download.

## 3️⃣ Jornada do usuário
1. **Acessa a página** “Emitir Diploma”.
2. **Preenche os campos**:
   - Nome completo
   - CPF (máscara automática `999.999.999-99`)
   - Curso (ex.: Engenharia de Software)
3. **Validação em tempo real** – mensagens de erro aparecem próximo ao campo.
4. **Clica em “Gerar e Assinar Diploma”.**
   - O botão fica desabilitado e exibe “Processando e Assinando...” enquanto a requisição é feita.
5. **Download automático** do PDF assinado com nome `diploma_<nome>.pdf`.
6. **Opção de limpar** os campos usando o botão “Limpar Campos”.

## 4️⃣ Principais recursos de UI
- **Barra lateral (Sidebar)** com navegação entre Painel, Alunos, Cursos e Emitir Diploma – ícones SVG customizados.
- **Header** com “traffic‑light” estilo macOS, badge de URL (localhost) e ícone de notificações.
- **Seção de pré‑visualização** (`DiplomaPreview`) que mostra um mock SVG do layout do diploma.
- **Cards de seção** (`SectionCard`) com cantos arredondados, bordas suaves e sombras que dão sensação de profundidade (glassmorphism). 
- **Botões primários** em `sky‑700` com efeito hover e sombra suave para foco visual.

## 5️⃣ Destaques técnicos
- **Tipagem completa** com TypeScript – tipos inferidos a partir do schema Zod (`DiplomaFormData`).
- **Máscara de CPF** – função `maskCPF` aplicada no `onChange` para garantir formato consistente.
- **Validação declarativa** – `zodResolver` garante que somente dados válidos chegam ao backend.
- **Download automático** – Blob → `URL.createObjectURL` → `<a download>` disparado programaticamente.
- **Responsividade** – layout de duas colunas em telas maiores (`lg:grid-cols-[280px_minmax(0,1fr)]`).
- **Acessibilidade** – rótulos associados a inputs, contrastes de cor adequados, foco visível.

## 6️⃣ Segurança & Conformidade
- **Assinatura PAdES** – garante integridade e autenticidade do diploma.
- **Comunicação HTTPS** – todas as requisições são feitas por `fetch` sobre TLS (Next.js já fornece isso em produção).
- **Proteção do certificado** – `certificado_universidade.p12` fica no servidor, nunca exposto ao cliente.

## 7️⃣ Próximos passos / Melhorias
- **Feedback visual de progresso** (barra ou spinner) enquanto o PDF é gerado.
- **Seleção de templates** – permitir diferentes layouts de diploma.
- **Controle de acesso baseado em funções** – somente usuários com permissão de “Secretaria Acadêmica” podem emitir diplomas.
- **Logs de auditoria** – registrar quem gerou cada diploma para compliance.

## 8️⃣ Demonstração (para a reunião)
1. **Abrir a página** → observar o layout limpo e moderno.
2. **Preencher dados válidos** → botão “Gerar e Assinar Diploma” habilita.
3. **Clique** → aguardar curto período → download automático do PDF.
4. **Abrir o PDF** → confirmar assinatura digital (visualizador de PDFs mostra assinatura PAdES).

## 9️⃣ Conclusão
A solução entrega uma experiência premium, **rápida** e **segura** para a emissão de diplomas digitais, alinhada às diretrizes de design contemporâneas e às exigências de assinatura eletrônica. 

---
*Este arquivo deve ser salvo como `PRESENTATION.md` na raiz do repositório.*
