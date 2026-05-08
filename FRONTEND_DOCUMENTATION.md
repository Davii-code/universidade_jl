# 📚 Documentação do Front‑end – Emitir Diploma

## 1️⃣ Visão geral do projeto
- **Framework**: **Next.js** (versão custom – ver `node_modules/next/dist/docs/` para API exata).  
- **Linguagem**: **TypeScript (TSX)** – componentes React tipados.  
- **Toolkit UI**: **Tailwind CSS** (classes utilitárias JIT).  
- **Gerenciamento de formulários**: **react‑hook‑form** + **zod** (validação de schema via `@hookform/resolvers/zod`).

## 2️⃣ Dependências principais (listadas em `package.json`)
| Dependência | Função |
|------------|--------|
| `react` / `react-dom` | Core da UI e renderização de componentes. |
| `next` | Framework full‑stack (rotas, API routes, SSR). |
| `react-hook-form` | Gerência de estado de formulários com alta performance. |
| `zod` | Schema de validação tipado; gera tipos TypeScript. |
| `@hookform/resolvers` | Integração entre react‑hook‑form e Zod. |
| `tailwindcss` | Estilização utilitária, permite design dinâmico e responsivo. |

## 3️⃣ Estrutura de diretórios (relevante ao front‑end)
```
app/
├─ api/
│   ├─ emitir-diploma/      # endpoint que gera o PDF
│   └─ verificar-diploma/   # endpoint de verificação
├─ dashboard/
│   ├─ emitir-diploma/
│   │   └─ page.tsx          # UI principal para emissão
│   └─ verificar-diploma/
│       └─ page.tsx          # UI de verificação
├─ globals.css               # Reset + base Tailwind
├─ layout.tsx                # Layout raiz (html, body)
└─ page.tsx                  # Home (fallback)
```

## 4️⃣ Detalhamento de `app/dashboard/emitir-diploma/page.tsx`

### 4.1 Declaração do componente cliente
```tsx
"use client";
```
Marca o arquivo como **client‑side component** – só será executado no navegador (regra do Next.js).

### 4.2 Imports
| Import | Origem | O que traz |
|--------|--------|------------|
| `useState` | `react` | Estado local (`isSubmitting`, `downloadUrl`). |
| `useForm` | `react-hook-form` | Hook que devolve `register`, `handleSubmit`, `formState`, `reset`, `setValue`. |
| `zodResolver` | `@hookform/resolvers/zod` | Conecta o schema Zod ao react‑hook‑form para validação. |
| `* as z` | `zod` | Namespace para construção de schemas (`z.object`, `z.string`, …). |
| Componentes de ícone (`HomeIcon`, `UserIcon`, …) | Definidos neste arquivo | SVGs reutilizáveis usados na navegação. |
| Helpers de UI (`FieldLabel`, `FieldShell`, `TextField`, `SelectField`, `DateField`, `SectionCard`, `DiplomaPreview`, `LogoMark`) | Definidos neste arquivo | Pequenos componentes de apresentação que garantem consistência visual. |
| `diplomaSchema` | Definido posteriormente neste arquivo | Regra de validação para `nome`, `cpf` e `curso`. |
| `maskCPF` | Função local | Formata o campo CPF no padrão `999.999.999-99`. |

### 4.3 Items de navegação (sidebar)
```tsx
const navigationItems = [
  { label: "Painel", icon: HomeIcon, active: false },
  { label: "Alunos", icon: UserIcon, active: false },
  { label: "Cursos", icon: GraduationCapIcon, active: false },
  { label: "Emitir Diploma", icon: DocumentPenIcon, active: true },
] as const;
```
Lista estática que alimenta a barra lateral; o campo `active` indica a página corrente.

### 4.4 Componentes auxiliares (ícones e wrappers)
- **Ícones SVG** (`HomeIcon`, `UserIcon`, `GraduationCapIcon`, `DocumentPenIcon`, `BellIcon`, `CalendarIcon`, `ChevronDownIcon`, `CheckIcon`): retornam markup SVG recebendo `className` para estilização Tailwind.
- **`BrowserMark`**, **`SidebarIconWrap`**, **`FieldLabel`**, **`FieldShell`**, **`TextField`**, **`SelectField`**, **`DateField`**, **`SectionCard`**, **`DiplomaPreview`**, **`LogoMark`**: componentes pequenos que encapsulam layout e estilização, promovendo reutilização e aparência uniforme.

### 4.5 Schema do formulário (Zod)
```ts
const diplomaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (use 000.000.000-00)"),
  curso: z.string().min(2, "Selecione um curso válido"),
});
```
Regras de validação:
- **nome** ≥ 3 caracteres;
- **cpf** deve seguir o padrão brasileiro `999.999.999-99`;
- **curso** ≥ 2 caracteres.
O tipo inferido (`DiplomaFormData`) é gerado via `z.infer<typeof diplomaSchema>`.

### 4.6 Função de máscara de CPF
```ts
const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};
```
Remover caracteres não numéricos e inserir pontos e hífen de forma progressiva.

### 4.7 Componente principal (`EmitirDiplomaPage`)
```tsx
export default function EmitirDiplomaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
```
- **Estado**: controla o spinner do botão e armazena a URL do PDF gerado.

#### 4.7.1 Configuração do `useForm`
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
Integra Zod ao formulário, já deixa o campo **curso** pré‑preenchido.

#### 4.7.2 Manipulador de mudança do CPF
```tsx
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCPF(e.target.value);
    setValue("cpf", maskedValue);
  };
```
Aplica a máscara enquanto o usuário digita.

#### 4.7.3 Submissão (`onSubmit`)
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
- Envia JSON para `POST /api/emitir-diploma`.
- Converte a resposta em **Blob** → cria **Object URL**.
- Cria um `<a>` invisível, define atributo `download` com nome baseado no aluno e clica para iniciar o download.
- Tratamento de erros via `console.error` + `alert`.

#### 4.7.4 Renderização JSX
- **Container principal**: fundo radial gradient (`bg-[radial-gradient(...)]`).
- **Header**: barra com “traffic‑light” do macOS, badge `localhost:3000/dashboard/emitir-diploma` e ícone de notificações.
- **Sidebar** (`<aside>`): gera links a partir de `navigationItems`.
- **Main** (`<main>`):
  - **Seção 1 – Dados do Aluno**: campos `Nome`, `CPF` (com máscara) e `Curso` usando `TextField`.
  - **Seção 2 – Visualização Prévia**: componente `DiplomaPreview` (SVG mock do diploma). 
  - **Seção 3 – Assinatura Digital**: texto explicativo do fluxo PAdES e dois botões:
    - *Limpar Campos* → `reset()`.
    - *Gerar e Assinar Diploma* → `type="submit"`, desabilitado enquanto `isSubmitting`.
- Todos os elementos utilizam **classes Tailwind** para cores, sombras, transições e responsividade.

## 5️⃣ Considerações de design (segundo a skill `web-design-guidelines`)
- **Paleta**: azul‑celeste (`sky-700/500`) com toques de âmbar; contraste adequado para acessibilidade.
- **Tipografia**: fonte padrão do Next.js (Inter) – tamanho e peso definidos por classes `text-sm`, `font-semibold` etc.
- **Micro‑animações**: transições (`transition`) nos botões, hover effects, foco com `focus-within`.
- **Estados de foco/hover**: uso de `ring` e `shadow` para indicar interatividade.
- **Responsividade**: layout de duas colunas em telas maiores (`lg:grid-cols-[280px_minmax(0,1fr)]`).
- **Acessibilidade**: rótulos (`<label>`) associados aos inputs, cores com contraste suficiente, texto descriptivo nos `alt`/aria (`aria-hidden` nos SVGs, `aria-label` no botão de notificações).

---
*Este documento deve ser salvo como `FRONTEND_DOCUMENTATION.md` na raiz do repositório.*
