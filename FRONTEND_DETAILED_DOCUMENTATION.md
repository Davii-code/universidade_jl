# 📚 Documentação Detalhada do Front‑end – Emitir Diploma

## 📖 Visão Geral do Projeto
- **Framework**: **Next.js** (versão custom – ver `node_modules/next/dist/docs/` para a API exata).  
- **Linguagem**: **TypeScript (TSX)** – React com tipagem estática.  
- **UI**: **Tailwind CSS** (JIT) – classes utilitárias para design responsivo e dinamismo.  
- **Formulário**: **react‑hook‑form** + **Zod** (validação declarativa via `@hookform/resolvers/zod`).

---

## 📦 Dependências Principais (de `package.json`)
| Dependência | Versão (exemplo) | Função / Motivo da escolha |
|-------------|------------------|----------------------------|
| `react` / `react-dom` | ^18.x | Biblioteca base para criar componentes UI. |
| `next` | ^14.x (custom) | Framework full‑stack que cuida de roteamento, SSR/SSG, API routes. A versão custom tem breaking changes – consultar `node_modules/next/dist/docs/`. |
| `react-hook-form` | ^7.x | Gerência de estado de formulários extremamente leve e sem re‑renderizações desnecessárias. |
| `zod` | ^3.x | Biblioteca de schemas de validação com suporte a inferência de tipos TypeScript. |
| `@hookform/resolvers` | ^3.x | Adaptador que permite que `react-hook-form` use o schema Zod para validação (`zodResolver`). |
| `tailwindcss` | ^3.x | Sistema de utilitários CSS que produz arquivos CSS pequenos via JIT. | 
| `postcss`, `autoprefixer` | – | Necessários para o pipeline Tailwind. |

### Por que essas libs?
- **Next.js** fornece rotas automáticas (`app/*`) e API routes (`app/api/*`) sem precisar de um servidor Express separado.  
- **React‑Hook‑Form** evita o uso de `useState` individual para cada campo, reduzindo renders.  
- **Zod** garante que a validação acontece tanto em tempo de compilação (tipo) quanto em tempo de execução (schema).  
- **Tailwind** permite aplicar design premium (gradientes, sombras, animações) diretamente no JSX sem arquivos CSS adicionais.

---

## 📂 Estrutura de Pastas (relevante ao front‑end)
```
app/
├─ api/
│   ├─ emitir-diploma/      # POST → gera PDF + assinatura PAdES
│   └─ verificar-diploma/   # GET → consulta status do diploma
├─ dashboard/
│   ├─ emitir-diploma/
│   │   └─ page.tsx          # UI principal (esta documentação detalha este arquivo)
│   └─ verificar-diploma/
│       └─ page.tsx          # UI de consulta (fora do escopo atual)
├─ globals.css               # Reset + importações Tailwind (base, components, utilities)
├─ layout.tsx                # Wrapper de página (HTML, BODY, Providers)
└─ page.tsx                  # Home fallback
```

---

## 🧩 Componentes e Funções de `app/dashboard/emitir-diploma/page.tsx`
### 1️⃣ Declaração do componente cliente
```tsx
"use client";
```
> **O que faz?** Instrui o Next.js a tratar este arquivo como *client‑side component*, logo ele será renderizado apenas no navegador. Em versões custom do Next.js isso pode afetar o bundling, por isso a regra no arquivo `AGENTS.md` recomenda conferir a documentação.

### 2️⃣ Imports – explicação linha‑a‑linha
| Linha | Import | Origem | Por que está aqui? |
|------|--------|--------|--------------------|
| 3 | `useState` | `react` | Hook de estado simples usado para controlar `isSubmitting` (spinner) e `downloadUrl` (URL do PDF). |
| 4 | `useForm` | `react-hook-form` | Cria o controlador do formulário; devolve `register`, `handleSubmit`, `formState`, `reset`, `setValue`. |
| 5 | `zodResolver` | `@hookform/resolvers/zod` | Conecta o *schema* Zod ao `react-hook-form`, de modo que a validação ocorra automaticamente ao submeter. |
| 6 | `* as z` | `zod` | Namespace que permite chamar `z.object`, `z.string`, etc., para montar o schema. |
| 7‑15 | **Componentes SVG** (`HomeIcon`, `UserIcon`, …) | Definidos logo abaixo no mesmo arquivo | Ícones reutilizáveis para a barra lateral e cabeçalho. Cada um recebe `className` para ser estilizado com Tailwind. |
| 16‑24 | **Helpers de UI** (`FieldLabel`, `FieldShell`, `TextField`, `SelectField`, `DateField`, `SectionCard`, `DiplomaPreview`, `LogoMark`) | Definidos no próprio arquivo | Pequenos componentes que encapsulam estilos (bordas, sombras, fontes) e promovem consistência visual. |
| 25 | `diplomaSchema` | Definido mais adiante | Schema Zod que descreve a forma esperada dos dados do formulário. |
| 26 | `maskCPF` | Função local | Formata o CPF enquanto o usuário digita.

### 3️⃣ Navegação – `navigationItems`
```tsx
const navigationItems = [
  { label: "Painel", icon: HomeIcon, active: false },
  { label: "Alunos", icon: UserIcon, active: false },
  { label: "Cursos", icon: GraduationCapIcon, active: false },
  { label: "Emitir Diploma", icon: DocumentPenIcon, active: true },
] as const;
```
- **`as const`**: transforma o array em um *tuple* literal, preservando valores de `label`, `icon` e `active` como tipos estáticos. Isso permite que o TypeScript infera corretamente os tipos de cada item e evita mutações acidentais.
- Cada objeto contém:
  - `label`: texto exibido.
  - `icon`: referência ao componente SVG.
  - `active`: flag booleana que controla a classe CSS `data-[active=true]` para destaque.

### 4️⃣ Componentes auxiliares (icons & wrappers)
- **Ícones**: retornam `<svg>` com `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`. Usam classes Tailwind como `h-5 w-5` para tamanho e `text-slate-600` para cor padrão.
- **`SidebarIconWrap`**: `span` com classes de fundo, borda e transição que envolve o ícone, garantindo uma área clicável maior.
- **`FieldLabel`**: `<label>` estilizado como `text-sm font-medium text-slate-700` – garante consistência de tipografia.
- **`FieldShell`**: `div` que cria a caixa de input (borda, sombra, foco). Usa `focus-within:border-sky-300` para destacar quando o filho recebe foco.
- **`TextField`**: combina `FieldShell` e `<input>`; aceita `placeholder`, `id`, `register`, `error`, `onChange`. Propaga o `onChange` para a máscara de CPF e para o registro interno do `react-hook-form`.
- **`SelectField`** e **`DateField`**: versões simplificadas que exibem texto estático dentro de `FieldShell` (exemplo de como criar componentes de campo customizados).
- **`SectionCard`**: `section` com borda, fundo semitransparente e sombra interna (`shadow-[0_1px_0_rgba(255,255,255,0.8)_inset]`). Recebe `title`, `description` e `children`.
- **`DiplomaPreview`**: SVG estático que simula o layout do diploma; usado para dar ao usuário uma ideia visual antes da geração.
- **`LogoMark`**: bloco que exibe o logotipo “JL” em um gradiente azul‑âmbar e o nome da universidade.

### 5️⃣ Schema de validação – Zod
```ts
const diplomaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (use 000.000.000-00)"),
  curso: z.string().min(2, "Selecione um curso válido"),
});
```
- **`z.object`** cria um schema de objeto. Cada chave tem seu próprio validador.
- **`z.string().min(3, ...)`**: garante que o nome tenha no mínimo 3 caracteres, retornando a mensagem customizada em caso de falha.
- **`z.string().regex(...)`**: verifica o padrão brasileiro de CPF (`999.999.999-99`). O regex usa **escapes duplos** por causa do string literal em TypeScript.
- **`z.infer<typeof diplomaSchema>`** gera a interface TypeScript `DiplomaFormData` que descreve exatamente a forma dos dados que o formulário enviará.

### 6️⃣ Função de máscara de CPF
```ts
const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")                // remove tudo que não seja número
    .replace(/(\d{3})(\d)/, "$1.$2") // insere ponto após os 3 primeiros
    .replace(/(\d{3})(\d)/, "$1.$2") // segundo ponto
    .replace(/(\d{3})(\d{1,2})/, "$1-$2") // hífen antes dos dois últimos
    .replace(/(-\d{2})\d+?$/, "$1"); // garante que não haja dígitos extras
};
```
- **Passo a passo**: a cada `replace` um trecho do número é formatado. O uso de **captura de grupos** (`(\d{3})`) permite inserir pontuação mantendo os dígitos.
- **Por que não usar máscara pronta?**: implementação customizada evita dependências externas, mantendo o bundle pequeno.

### 7️⃣ Hook principal – `EmitirDiplomaPage`
```tsx
export default function EmitirDiplomaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
```
- **`isSubmitting`**: enquanto a requisição está em andamento, o botão de submit recebe o atributo `disabled` e muda o texto para “Processando e Assinando…”.
- **`downloadUrl`**: armazena a URL criada via `URL.createObjectURL` para o PDF; pode ser usada para exibir preview se necessário.

#### 7.1 Configurando `useForm`
```tsx
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
  setValue,
} = useForm<DiplomaFormData>({
  resolver: zodResolver(diplomaSchema),
  defaultValues: { curso: "Engenharia de Software" },
});
```
- **`register`**: função que liga um `<input>` ao gerenciador de estado interno do `react-hook-form`. Recebe o nome do campo (ex.: `register("nome")`).
- **`handleSubmit`**: wrapper que valida o schema antes de chamar a função `onSubmit`. Se houver erros, eles são inseridos em `formState.errors`.
- **`errors`**: objeto onde cada chave corresponde ao nome do campo e contém a mensagem gerada pelo Zod.
- **`reset`**: limpa todos os campos, revertendo aos `defaultValues`.
- **`setValue`**: atualiza programaticamente o valor de um campo – usado para aplicar a máscara de CPF a cada digitação.

#### 7.2 Manipulador de mudança do CPF
```tsx
const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const maskedValue = maskCPF(e.target.value);
  setValue("cpf", maskedValue);
};
```
- **Por que não usar `onBlur`?**: a máscara é aplicada em tempo real (onChange) para melhorar a experiência do usuário.

#### 7.3 Submissão do formulário (`onSubmit`)
```tsx
const onSubmit = async (data: DiplomaFormData) => {
  setIsSubmitting(true);
  try {
    const response = await fetch("/api/emitir-diploma", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erro ao gerar diploma");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    setDownloadUrl(url);

    // Download automático
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `diploma_${data.nome.replace(/\s+/g, "_")}.pdf`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error(error);
    alert("Falha na emissão do diploma. Verifique o console.");
  } finally {
    setIsSubmitting(false);
  }
};
```
- **`fetch`**: chamada HTTP nativa do browser. Usa a rota interna `/api/emitir-diploma` que está no mesmo domínio (não há CORS). O método **POST** envia JSON contendo `nome`, `cpf` e `curso`.
- **Checagem de `response.ok`**: garante que status 2xx foi retornado. Caso contrário lança um `Error` que será capturado.
- **`response.blob()`**: converte o corpo da resposta (PDF) em um *Blob* binário.
- **`URL.createObjectURL(blob)`**: cria um URL temporário que pode ser usado como `href` de um link para download.
- **Criando `<a>` dinamicamente**: permite disparar o download sem precisar de intervenção do usuário. O atributo `download` define o nome do arquivo, substituindo espaços por underscores.
- **`finally`**: garante que o spinner seja removido mesmo em caso de erro.

#### 7.4 Renderização JSX – hierarquia de elementos
- **Elemento raiz** (`<div className="min-h-screen ...">`): background radial gradient, paddings responsivos, cor de texto `text-slate-900`.
- **Header** (`<div className="border-b ...">`): barra superior com três círculos (simulação de macOS), badge de URL e ícone de notificações.
- **Sidebar** (`<aside>`): mapeia `navigationItems` para `<a>`; cada link inclui `SidebarIconWrap` e `data-active` que controla a cor (`bg-sky-100` quando ativo).
- **Main** (`<main>`): contém três **SectionCards**:
  1. **Dados do Aluno** – campos `Nome`, `CPF`, `Curso` usando `TextField`.
  2. **Visualização Prévia** – componente `DiplomaPreview` (SVG mock).
  3. **Assinatura Digital** – texto explicativo do fluxo PAdES + botões **Limpar Campos** (`reset()`) e **Gerar e Assinar Diploma** (`type="submit"`).
- **Botões**: utilizam Tailwind para cores, sombras e transições (`transition`, `hover:bg-sky-800`). Quando `isSubmitting` é true, o botão recebe `disabled` e a classe `disabled:opacity-50` reduz a opacidade.

---

## 🎨 Considerações de Design (conforme `web-design-guidelines`)
- **Paleta de cores**: `sky-700` (azul‑celeste) como cor primária, `amber-400` para destaque, `slate` tons neutros para fundo e texto. Contraste garantido (WCAG AA).
- **Tipografia**: fonte padrão **Inter** (importada automaticamente pelo template Next.js). Tamanhos escaláveis: `text-sm`, `text-base`, `text-3xl`.
- **Micro‑animações**: todas as interações (hover, foco) usam a classe `transition` (0.2s) para suavizar mudanças de cor e sombra.
- **Estados de foco/hover**: `ring-1 ring-slate-200` e `focus-within:border-sky-300` dão feedback visual ao usuário de teclado.
- **Responsividade**: layout em duas colunas (`lg:grid-cols-[280px_minmax(0,1fr)]`) que colapsa em coluna única em telas menores.
- **Acessibilidade**:
  - Cada `<label>` está associado ao `<input>` via `htmlFor`/`id` (implicitamente ao usar `register`).
  - Cores com contraste ≥ 4.5:1.
  - SVGs recebem `aria-hidden="true"` porque são decorativos.
  - Botão de notificações tem `aria-label="Notificações"`.
  - Mensagens de erro são exibidas em `<p className="text-red-500">` logo abaixo do campo, facilitando leitores de tela.

---

## 🛠️ Estratégias de Performance
- **Tailwind JIT**: compila apenas as classes realmente usadas, reduzindo o tamanho do CSS.
- **React‑Hook‑Form**: evita re‑renders desnecessários: cada campo registra sua própria ref, e o formulário só re‑renderiza quando há erro ou mudança de estado relevante.
- **Lazy‑load de SVG**: os ícones são in‑line, o que elimina requisições HTTP adicionais.
- **Objetos URL temporários** são revogados automaticamente quando a página recarrega; opcionalmente poderíamos chamar `URL.revokeObjectURL(url)` após o download para liberar memória.

---

## ✅ Checklist de Qualidade (baseado em `code-review-checklist`)
- [x] **Tipagem completa** – `DiplomaFormData` inferido de Zod.
- [x] **Validação de dados** – Zod + `zodResolver`.
- [x] **Tratamento de erro** – `try/catch` com `console.error` + `alert` user‑friendly.
- [x] **Acessibilidade** – labels, contrastes, aria.
- [x] **Responsividade** – design fluido, mobile‑first.
- [x] **Código limpo** – componentes pequenos e reutilizáveis, nomes claros.
- [x] **Sem dependências desnecessárias** – máscara de CPF escrita manualmente.
- [ ] **Testes unitários** – (ainda a ser implementado).

---

## 📚 Referências e Próximos Passos
- **Documentação Next.js custom**: `node_modules/next/dist/docs/` (verifique APIs como `use client`, roteamento app directory).
- **Zod v3**: <https://github.com/colinhacks/zod>
- **React Hook Form**: <https://react-hook-form.com/>
- **Tailwind CSS**: <https://tailwindcss.com/docs>
- **PAdES** (PDF Advanced Electronic Signatures): garantir que o backend assine o PDF antes de enviá‑lo.

### Ideias de evolução
1. **Indicador de progresso** (spinner ou barra) enquanto o PDF está sendo gerado no backend.
2. **Seleção de template** – permitir ao usuário escolher layout de diploma.
3. **Controle de acesso** – usar NextAuth ou outro método para garantir que apenas usuários da secretaria possam acessar a página.
4. **Testes automatizados** – usar Jest + React Testing Library para validar fluxo de formulário e chamadas `fetch` mockadas.

---

*Este documento deve ser salvo como `FRONTEND_DETAILED_DOCUMENTATION.md` na raiz do repositório.*
