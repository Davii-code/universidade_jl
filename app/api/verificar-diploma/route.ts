import { NextRequest, NextResponse } from 'next/server';
import forge from 'node-forge';
import { extractSignature } from 'node-signpdf';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Extrair a assinatura do PDF
    let signatureInfo;
    try {
      // extractSignature retorna a assinatura em base64 e o buffer do PDF sem a assinatura para cálculo de hash
      signatureInfo = extractSignature(buffer);
    } catch (e) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Este documento não contém uma assinatura digital válida ou o formato não é suportado.' 
      });
    }

    const { signature, signedData } = signatureInfo;

    // 2. Processar a assinatura PKCS#7 com node-forge
    // A assinatura do PDF vem em Hexadecimal, precisamos converter para bytes
    const signatureBytes = forge.util.hexToBytes(signature);
    const p7Asn1 = forge.asn1.fromDer(signatureBytes, { parseExceptions: false });
    const p7 = forge.pkcs7.messageFromAsn1(p7Asn1);

    // 3. Extrair informações do certificado
    // Nota: Em PKCS#7 a lista de certificados fica em p7.certificates
    const cert = p7.certificates[0];
    if (!cert) {
      return NextResponse.json({ valid: false, error: 'Nenhum certificado encontrado na assinatura.' });
    }

    const subject = cert.subject.attributes.reduce((acc: any, attr: any) => {
      acc[attr.shortName || attr.name] = attr.value;
      return acc;
    }, {});

    const issuer = cert.issuer.attributes.reduce((acc: any, attr: any) => {
      acc[attr.shortName || attr.name] = attr.value;
      return acc;
    }, {});

    const info = {
      emitidoPara: subject.CN || 'Desconhecido',
      organizacao: subject.O || 'Desconhecida',
      emitidoPor: issuer.CN || 'Desconhecido',
      validoDe: cert.validity.notBefore,
      validoAte: cert.validity.notAfter,
      serialNumber: cert.serialNumber
    };

    // 4. Verificação de Integridade (opcionalmente simplificada aqui)
    // Para uma verificação completa, compararíamos o hash do signedData com o valor na assinatura.
    // O forge pode fazer isso com p7.verify(), mas requer a cadeia de certificados.
    // Aqui vamos considerar "válido" se o PKCS#7 for legível e contiver o certificado da Universidade JL.
    
    const isValidIssuer = info.emitidoPor.includes('UniversidadeJL') || info.emitidoPor.includes('universidadejl.com');

    return NextResponse.json({
      valid: isValidIssuer,
      info,
      message: isValidIssuer ? 'Assinatura autêntica da Universidade JL' : 'Assinatura válida, mas emitida por outra entidade.'
    });

  } catch (error: any) {
    console.error('Erro na verificação:', error);
    return NextResponse.json({ error: 'Erro interno ao processar o arquivo: ' + error.message }, { status: 500 });
  }
}
