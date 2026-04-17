import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import forge from 'node-forge';
import { SignPdf, plainAddPlaceholder } from 'node-signpdf';
const signpdf = new SignPdf();
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { nome, cpf, curso } = await req.json();

    if (!nome || !cpf || !curso) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // 1. Criar o PDF do Diploma com pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 Paisagem
    const { width, height } = page.getSize();
    
    const fontTitle = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontText = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Desenho básico do diploma
    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderColor: rgb(0.1, 0.2, 0.5),
      borderWidth: 10,
    });

    page.drawText('DIPLOMA DE CONCLUSÃO', {
      x: width / 2 - 150,
      y: height - 120,
      size: 30,
      font: fontTitle,
      color: rgb(0.1, 0.2, 0.5),
    });

    const textoBase = `Certificamos que ${nome}, portador do CPF ${cpf}, 
concluiu com êxito o curso de ${curso} 
ministrado pela Universidade JL na data de ${new Date().toLocaleDateString('pt-BR')}.`;

    page.drawText(textoBase, {
      x: 100,
      y: height / 2,
      size: 18,
      font: fontText,
      lineHeight: 25,
      color: rgb(0, 0, 0),
    });

    // 2. Preparar o PDF para assinatura (Node-signpdf precisa de um placeholder)
    // O node-signpdf insere a assinatura em uma string reservada.
    // Vamos usar o método recomendado pela lib para adicionar o campo de assinatura.
    // Nota: pdf-lib v1.x não suporta nativamente a criação de campos de assinatura PAdES complexos facilmente, 
    // então enviamos o buffer para o signpdf injetar o placeholder se necessário, 
    // ou usamos um "Signer" que lida com isso.
    
    // Convertemos para buffer - Desativamos object streams para compatibilidade com parsers simples
    let pdfBuffer = Buffer.from(await pdfDoc.save({ useObjectStreams: false }));

    // 3. Adicionar Placeholder para a Assinatura (Exigido pelo node-signpdf)
    pdfBuffer = plainAddPlaceholder({
      pdfBuffer,
      reason: 'Assinatura do Diploma - Universidade JL',
      contactInfo: 'universidadejl@contato.com',
      name: 'Universidade JL',
      location: 'São Paulo, BR',
      signatureLength: 8192, // Aumentado para suportar certificados maiores
    });

    // 4. Carregar e ler o certificado .p12
    const certPath = path.join(process.cwd(), 'certificado_universidade.p12');
    const certBuffer = fs.readFileSync(certPath);
    const p12Asn1 = forge.asn1.fromDer(certBuffer.toString('binary'));
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, '1234'); // Senha definida anteriormente

    // Extrair chave privada e certificados para o node-signpdf
    const bags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
    const keyBag = bags[forge.pki.oids.pkcs8ShroudedKeyBag];
    if (!keyBag) throw new Error('Chave privada não encontrada no .p12');
    const privateKey = keyBag[0].key;

    // node-signpdf geralmente espera o certificado p12 bruto ou a chave PEM.
    // Vamos usar a forma mais direta que o node-signpdf aceita.
    
    // 4. Assinar o PDF
    // O node-signpdf requer que o PDF tenha um placeholder de assinatura.
    // Como criamos um PDF limpo, precisamos garantir que ele tenha esse espaço.
    let signedBuffer: Buffer;
    try {
      signedBuffer = await signpdf.sign(pdfBuffer, certBuffer, { passphrase: '1234' });
    } catch (e: any) {
      console.error('Erro na assinatura:', e);
      return NextResponse.json({ error: 'Erro ao assinar o PDF: ' + e.message }, { status: 500 });
    }

    // 5. Retornar o PDF assinado
    return new NextResponse(signedBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="diploma_${nome.replace(/\s+/g, '_')}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error('Erro geral:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
