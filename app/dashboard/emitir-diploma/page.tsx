"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type IconProps = {
  className?: string;
};

const navigationItems = [
  { label: "Painel", icon: HomeIcon, active: false },
  { label: "Alunos", icon: UserIcon, active: false },
  { label: "Cursos", icon: GraduationCapIcon, active: false },
  { label: "Emitir Diploma", icon: DocumentPenIcon, active: true },
] as const;

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 11.5 12 4l9 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 10.75V20h11.5v-9.25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 20v-5.5h5.5V20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5.5 19c1.55-3.1 4.2-4.65 6.5-4.65S17.45 15.9 19 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GraduationCapIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m3 10.75 9-4.75 9 4.75-9 4.75-9-4.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 13.15V16c0 1.55 2.05 2.8 4.5 2.8s4.5-1.25 4.5-2.8v-2.85"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M21 10.8v4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DocumentPenIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 3.75h6.5L18.25 8.5V20.25H7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 3.75V8.5h4.75"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m10 17.5 5.9-5.9 1.6 1.6-5.9 5.9H10v-1.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 4.5c-2.5 0-4.5 2-4.5 4.5v2.1c0 .8-.25 1.57-.7 2.21L5.6 15.8h12.8l-1.2-2.48a3.9 3.9 0 0 1-.7-2.21V9c0-2.5-2-4.5-4.5-4.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10.1 19c.35.74 1.12 1.25 1.9 1.25S13.65 19.74 14 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 3.75v2.5M17 3.75v2.5M4.75 9.5h14.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="4.25"
        y="6"
        width="15.5"
        height="13.25"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m6.5 9 5.5 5.5L17.5 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="m6.5 12.5 3.3 3.3L17.5 8.1"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrowserMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-[1rem] bg-gradient-to-br from-sky-700 via-sky-500 to-amber-400 text-[0.66rem] font-extrabold tracking-[0.28em] text-white shadow-sm">
        JL
      </div>
      <div>
        <p className="text-sm font-semibold tracking-tight text-slate-900">Universidade JL</p>
        <p className="text-xs text-slate-500">Administração Acadêmica</p>
      </div>
    </div>
  );
}

function SidebarIconWrap({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 transition group-hover:text-sky-700 group-data-[active=true]:bg-sky-100 group-data-[active=true]:text-sky-800">
      {children}
    </span>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-slate-700">{children}</label>;
}

function FieldShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-400 shadow-sm transition focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-100">
      {children}
    </div>
  );
}

function TextField({ 
  placeholder, 
  id, 
  register, 
  error,
  onChange
}: { 
  placeholder?: string; 
  id?: string; 
  register?: any; 
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <FieldShell>
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          {...register}
          onChange={(e) => {
            if (onChange) onChange(e);
            if (register?.onChange) register.onChange(e);
          }}
          className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </FieldShell>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SelectField({ value }: { value: string }) {
  return (
    <FieldShell>
      <span className="flex-1 text-slate-900">{value}</span>
      <ChevronDownIcon className="h-4 w-4 text-slate-400" />
    </FieldShell>
  );
}

function DateField() {
  return (
    <FieldShell>
      <CalendarIcon className="h-5 w-5 text-slate-400" />
      <span className="flex-1 text-slate-400">Selecionar data</span>
    </FieldShell>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] lg:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function DiplomaPreview() {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-dashed border-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 p-5">
      <div className="flex min-h-[20rem] items-center justify-center rounded-[1.4rem] border border-white/70 bg-white/45 p-8">
        <svg viewBox="0 0 520 320" className="h-full w-full max-w-[34rem]" aria-hidden="true">
          <defs>
            <linearGradient id="diplomaFrame" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <linearGradient id="diplomaAccent" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
          <rect x="34" y="28" width="452" height="264" rx="28" fill="#f8fafc" stroke="url(#diplomaFrame)" strokeWidth="4" />
          <rect x="56" y="50" width="408" height="220" rx="20" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="260" cy="108" r="34" fill="url(#diplomaAccent)" opacity="0.12" />
          <circle cx="260" cy="108" r="22" fill="#fff" stroke="#1d4ed8" strokeWidth="4" />
          <path d="M260 88 267 100 281 103 271 113 273 127 260 120 247 127 249 113 239 103 253 100Z" fill="#c58d1d" />
          <path d="M118 160h284" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />
          <path d="M118 190h200" stroke="#dbe4f0" strokeWidth="10" strokeLinecap="round" />
          <path d="M118 218h240" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
          <path d="M118 246h176" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
          <path d="M157 63h206" stroke="#0f172a" strokeOpacity="0.08" strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-sky-700 via-sky-500 to-amber-400 shadow-sm">
        <div className="absolute inset-0 rounded-[1.25rem] border border-white/30" />
        <span className="relative text-sm font-extrabold tracking-[0.18em] text-white">JL</span>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-700">Universidade JL</p>
        <p className="text-sm font-semibold text-slate-900">Emitir Novo Diploma</p>
      </div>
    </div>
  );
}

const diplomaSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (use 000.000.000-00)"),
  curso: z.string().min(2, "Selecione um curso válido"),
});

type DiplomaFormData = z.infer<typeof diplomaSchema>;

const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

export default function EmitirDiplomaPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DiplomaFormData>({
    resolver: zodResolver(diplomaSchema),
    defaultValues: {
      curso: "Engenharia de Software",
    }
  });

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCPF(e.target.value);
    setValue("cpf", maskedValue);
  };

  const onSubmit = async (data: DiplomaFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/emitir-diploma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar diploma");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      
      // Auto download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `diploma_${data.nome.replace(/\s+/g, "_")}.pdf`);
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f8fbff_0%,#eef3f9_46%,#e5ebf3_100%)] px-4 py-4 text-slate-900 sm:px-6 lg:px-8">
      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1680px] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.12)]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col">
          {/* Header */}
          <div className="border-b border-slate-200 bg-[#e8edf4] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ef5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#f6be4f]" />
                <span className="h-3 w-3 rounded-full bg-[#53c16f]" />
              </div>

              <div className="hidden h-10 items-center gap-3 rounded-[1rem] bg-white/90 px-4 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200 md:flex md:w-[18rem] lg:w-[21rem]">
                <span className="inline-flex items-center gap-2 text-slate-400">
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M16.2 16.2 20 20"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <circle cx="11" cy="11" r="5.5" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </span>
                <span className="truncate font-medium text-slate-700">Emitir Novo Diploma</span>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-[1rem] bg-white/90 px-4 py-2 text-xs text-slate-500 shadow-sm ring-1 ring-slate-200 xl:flex">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                  localhost:3000/dashboard/emitir-diploma
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 bg-[#f6f8fc] px-6 py-4 sm:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <LogoMark />

              <div className="flex items-center gap-3 self-start rounded-[1.2rem] border border-slate-200 bg-white px-3 py-2 shadow-sm xl:self-auto">
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-100"
                  aria-label="Notificações"
                >
                  <BellIcon className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-3 pl-1">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sky-600 to-sky-400 text-sm font-semibold text-white shadow-sm">
                    AS
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Admin Secretaria</p>
                    <p className="text-xs text-slate-500">Usuário autenticado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 bg-[#f7f9fc] px-4 py-5 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href="#"
                      data-active={item.active}
                      className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 data-[active=true]:bg-sky-100 data-[active=true]:text-sky-900"
                    >
                      <SidebarIconWrap>
                        <Icon className="h-5 w-5" />
                      </SidebarIconWrap>
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Fluxo Ativo</p>
                <div className="mt-3 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Alunos aptos</span>
                    <span className="font-semibold text-slate-900">148</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Diplomas pendentes</span>
                    <span className="font-semibold text-slate-900">12</span>
                  </div>
                </div>
              </div>
            </aside>

            <main className="bg-[#f4f7fb] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
              <div className="mx-auto max-w-6xl">
                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] lg:p-8">
                  <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Secretaria Acadêmica</p>
                      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Emitir Novo Diploma</h1>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        Configure os dados do egresso, revise a prévia institucional e conclua a emissão com assinatura digital.
                      </p>
                    </div>

                    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm xl:max-w-sm">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Certificado Carregado</p>
                          <p className="text-xs text-slate-500">Status: Ativo (.p12)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 lg:space-y-8">
                    <SectionCard
                      title="Seção 1: Dados do Aluno"
                      description="Identificação do estudante e vínculo acadêmico."
                    >
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <FieldLabel>Nome Completo</FieldLabel>
                          <TextField 
                            placeholder="Nome como consta no RG" 
                            id="nome"
                            register={register("nome")}
                            error={errors.nome?.message}
                          />
                        </div>
                        <div>
                          <FieldLabel>CPF</FieldLabel>
                          <TextField 
                            placeholder="000.000.000-00" 
                            id="cpf"
                            register={register("cpf")}
                            onChange={handleCPFChange}
                            error={errors.cpf?.message}
                          />
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <FieldLabel>Curso</FieldLabel>
                          <TextField 
                            placeholder="Ex: Engenharia de Software" 
                            id="curso"
                            register={register("curso")}
                            error={errors.curso?.message}
                          />
                        </div>
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Seção 2: Visualização Prévia"
                      description="Prévia gráfica aproximada do documento."
                    >
                      <DiplomaPreview />
                    </SectionCard>

                    <SectionCard
                      title="Seção 3: Assinatura Digital"
                      description="Conclusão com certificado institucional."
                    >
                      <div className="space-y-4">
                        <p className="max-w-3xl text-sm leading-6 text-slate-500">
                          Ao clicar em gerar, o sistema irá criar o PDF, aplicar o padrão PAdES de assinatura digital e disponibilizar o arquivo assinado.
                        </p>

                        <div className="grid gap-3 pt-2 sm:grid-cols-2">
                          <button
                            type="button"
                            onClick={() => reset()}
                            className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"
                          >
                            Limpar Campos
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`inline-flex h-12 items-center justify-center rounded-2xl border border-sky-700 bg-sky-700 px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(29,78,216,0.22)] transition hover:bg-sky-800 disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {isSubmitting ? "Processando e Assinando..." : "Gerar e Assinar Diploma"}
                          </button>
                        </div>
                      </div>
                    </SectionCard>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </form>
      </div>
    </div>
  );
}

