"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

export default function VerificarDiplomaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setResult(null);
    }
  };

  const verifyDiploma = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/verificar-diploma", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Portal de Verificação</h1>
          <p className="mt-2 text-slate-500">Valide a autenticidade de diplomas digitais emitidos pela Universidade JL.</p>
        </header>

        <main className="space-y-6">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Selecione o arquivo PDF</h2>
            
            <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 transition hover:border-sky-400">
              <input 
                type="file" 
                accept="application/pdf"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleFileChange}
              />
              <div className="text-center">
                <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-sky-100 text-sky-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-700">
                  {file ? file.name : "Clique ou arraste o PDF para validar"}
                </p>
                <p className="mt-1 text-xs text-slate-400">Tamanho máximo: 10MB</p>
              </div>
            </div>

            <button
              onClick={verifyDiploma}
              disabled={!file || loading}
              className="mt-6 w-full rounded-xl bg-sky-700 py-4 font-semibold text-white transition hover:bg-sky-800 disabled:opacity-50"
            >
              {loading ? "Verificando integridade..." : "Verificar Autenticidade"}
            </button>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-semibold">Erro na Verificação</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className={`rounded-2xl border p-8 shadow-sm ${result.valid ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              <div className="flex items-start gap-4">
                <div className={`grid h-12 w-12 place-items-center rounded-full ${result.valid ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {result.valid ? (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${result.valid ? 'text-emerald-900' : 'text-amber-900'}`}>
                    {result.valid ? "Diploma Autêntico" : "Certificado Desconhecido"}
                  </h3>
                  <p className={`mt-1 text-sm ${result.valid ? 'text-emerald-700' : 'text-amber-700'}`}>
                    {result.message}
                  </p>

                  <div className="mt-6 grid gap-6 border-t border-black/5 pt-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Emitido por</p>
                      <p className="mt-1 font-medium text-slate-900">{result.info.emitidoPor}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Organização</p>
                      <p className="mt-1 font-medium text-slate-900">{result.info.organizacao}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Válido Até</p>
                      <p className="mt-1 font-medium text-slate-900">{new Date(result.info.validoAte).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Número de Série</p>
                      <p className="mt-1 text-sm font-mono text-slate-600">{result.info.serialNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
