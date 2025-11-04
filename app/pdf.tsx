// pdf.tsx
import React, { useState, useEffect } from 'react';
import { Button, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { buscarRelatorioPdf } from '../services/pdf'; // ajuste o path se necessário

const PdfGenerator = () => {
  const router = useRouter();
  const { missaoId, missao_name } = useLocalSearchParams();

  const [relatorio, setRelatorio] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await buscarRelatorioPdf(missaoId);
        setRelatorio(dados);
      } catch (error) {
        console.error('Erro ao carregar relatório:', error);
      } finally {
        setLoading(false);
      }
    };

    if (missaoId) {
      carregarDados();
    }
  }, [missaoId]);

  const gerarPdf = async () => {
    try {
      if (!relatorio || relatorio.length === 0) {
        console.warn('Nenhum dado disponível para gerar o PDF.');
        return;
      }

      const htmlContent = gerarHtml(relatorio);

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartilhar Relatório PDF',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  if (loading) return <View><Button title="Carregando..." disabled /></View>;

  return (
    <View style={{ margin: 20 }}>
      <Button title="Gerar Relatório PDFs" onPress={gerarPdf} disabled={loading || relatorio.length === 0} />
    </View>
  );
};





export default PdfGenerator;

function gerarHtml(grupos) {
  const dataAtual = new Date().toLocaleDateString();
  let html = `
    <html>
      <head>
      <meta charset="UTF-8">
        <style>
            body {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            padding: 20mm;
            font-size: 15px;
            margin: 10mm;
            color: #222;
            line-height: 1.4;
          }
          h1 {
            text-align: center;
            font-size: 20px;
            margin-bottom: 10px;
          }
          .user-info {
            margin-top: 80px;
            padding: 10px;
            border: 1px solid #000;
            background-color: #f2ebebff;
          }
          h2 {
            margin-top: 30px;
            font-size: 16px;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 6px 8px;
            text-align: left;
            font-size: 13px;
          }
          th {
            background-color: #f2f2f2;
          }
          .sem-despesas {
            font-style: italic;
            color: gray;
            margin-bottom: 20px;
          }
          .cabecalho {
            background-color: #f2f2f2;
            padding: 10px;
            font-weight: bold;
            font-size: 14px;
            margin-top:50px;
            padding-top:40px;
          }


          @page {
            size: A4;
            margin: 20mm; /* define margens consistentes no PDF */
          }

          /* Força quebra de página quando um conteúdo não couber */
          table, h1, h2, .user-info, .cabecalho {
            page-break-inside: avoid; /* evita cortar dentro da tabela ou cabeçalho */
          }

          h1, h2 {
            page-break-before: avoid;
            page-break-after: avoid;
          }
          .imagensPDF {
            page-break-before: always;
            margin:10mm;
            padding:10px;
          }

          /* Garante que grandes blocos de imagens quebrem certinho */
          div {
            page-break-inside: avoid;
          }
          body{
            margin:0;
            padding:0;
          }

          tr {
            page-break-inside: avoid; /* não quebra uma linha no meio */
            page-break-after: auto;
          }

          img {
            max-width: 100%;
            height: auto;
            page-break-inside: avoid;
          }
            .cabecalho {
              page-break-before: always;
            }
              .topic{
               margin-top:15mm;
               padding-top:10px;
              }
               .imagem-bloco {
                width: 100%;
                text-align: center;
                margin-bottom: 15px;
                page-break-inside: avoid;
                break-inside: avoid;
              }
                img.imagem-pdf {
                max-width: 400px;
                max-height: 400px;
                height: auto;
                display: block;
                margin-left: auto;
                margin-right: auto;
                page-break-inside: avoid;
                break-inside: avoid;
              }
        </style>
      </head>
      <body>
       <div class="topic">
        <h1>CONGREGAÇÃO  CRISTÃ  NO  BRASIL</h1>
         <h1>Relatório de Câmbios e Despesas de viagem missionária</h1>
       </div>
  `;
function formatarValor(valor) {
  if (!valor || isNaN(valor)) return '0,00';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valor);
}


  if (grupos.length > 0) {
    const usuario = grupos[0];
    const inicio = new Date(usuario.data_inicio_prevista);
    const fim = new Date(usuario.data_final_prevista);
    const diffEmMs = fim - inicio;
    const diasViagem = isNaN(diffEmMs) ? '-' : Math.ceil(diffEmMs / (1000 * 60 * 60 * 24)) + 1;


    html += `
      <div class="user-info">
        <p><strong>Data:</strong> ${dataAtual}</p>
        <p><strong>Nome:</strong> ${usuario.name || '-'}</p>
        <p><strong>Email:</strong> ${usuario.email || '-'}</p>
        <p><strong>Celular:</strong> ${usuario.celular || '-'}</p>
        <p><strong>Ministério/Cargo:</strong> ${usuario.cargo || '-'}</p>
        <p><strong>Comum Congregação:</strong> ${usuario.comum || '-'}</p>
        <p><strong>Destino:</strong> ${usuario.pais || '-'}</p>
        <p><strong>Partida:</strong> ${formatarData(usuario.data_inicio_prevista)} &nbsp;&nbsp;
          <strong>Retorno:</strong> ${formatarData(usuario.data_final_prevista)}</p>
        <p><strong>Quantidade de dias:</strong> ${diasViagem}</p>
      </div>
    `;
  }
grupos.forEach((grupo) => {
  html += `
  <div>
    <h2 class="cabecalho">Moeda: ${grupo.moeda}</h2>
    <table>
      <tr>
        <th style="width:40px; text-align:center;">Nº</th>
        <th>DATA</th>
        <th>HISTÓRICO DAS DESPESAS</th>
        <th>Nº RECIBO</th>
        <th>CIDADE</th>
        <th  style="text-align:right">VALOR</th>
      </tr>
      <tr>
        <td style="text-align:center;">0</td>
        <td>${formatarData(grupo.data_padrao)}</td>
        <td><strong>Recurso para Despesas</strong></td>
        <td>${grupo.numero_recibo || '-'}</td>
        <td>-</td>
        <td  style="text-align:right"><strong>${formatarValor(grupo.valorOriginal / 100, grupo.moeda)}</strong></td>
      </tr>
  `;

  let totalDescontos = 0;
  let totalAcrescentado = 0;
  let contador = 1; // começa a numerar as próximas linhas a partir de 2

  const despesas = (grupo.despesas || []);
  despesas.sort((a, b) => {
    const dataA = new Date(a.data_padrao);
    const dataB = new Date(b.data_padrao);
    return dataA - dataB;
  });

  if (despesas.length > 0) {
    despesas.forEach((d) => {
      const isCambio = d.tipo === 'cambio';
      const dataDespesa = d.data_padrao;
      const isAcrescimo = d.moeda_destino === grupo.moeda;

      const isValorInicial =
        isCambio &&
        Math.abs(parseFloat(d.total_cambiado) - grupo.valorOriginal) < 0.01 &&
        new Date(dataDespesa).toDateString() === new Date(grupo.data_cambio).toDateString();

      if (isValorInicial) return; 

      let vFinal = 0;
      if (isCambio) {
        if (isAcrescimo) {
          vFinal = parseFloat(d.total_cambiado);
        } else {
          vFinal = parseFloat(d.total_a_cambiar);
        }
      } else {
        vFinal = parseFloat(d.valor);
      }
      if (isNaN(vFinal)) vFinal = 0;

      if (isAcrescimo) {
        totalAcrescentado += vFinal;
      } else {
        totalDescontos += vFinal;
      }

      const sinal = isAcrescimo ? '+' : '-';
      const nomesImagens = (d.imagens || [])
        .flatMap(img => img.fotos)
        .join(', ');

      html += `
        <tr>
          <td style="text-align:center;">${contador++}</td>
          <td>${formatarData(dataDespesa)}</td>
          <td>${d.descricao || '-'}</td>
          <td>${d.numero_recibo || '-'}</td>
          <td>${d.cidade || '-'}</td>
          <td style="text-align:right" >${sinal}${formatarValor((vFinal / 100), grupo.moeda)}</td>
        </tr>
      `;
    });
  } else {
    html += `
      <tr>
        <td colspan="6" class="sem-despesas">Sem despesas registradas.</td>
      </tr>
    `;
  }

  html += `
    <tr>
      <td colspan="5"><strong>Saldo</strong></td>
      <td  style="text-align:right"><strong>${formatarValor((grupo.valorOriginal + totalAcrescentado - totalDescontos) / 100, grupo.moeda)}</strong></td>
    </tr>
  </table>
  </div>
  `;
});



html += `<h2></h2>`;
grupos.forEach(grupo => {
  const todasImagens = (grupo.despesas || [])
    .flatMap(d => (d.imagens || []).flatMap(img => img.fotos))
    .filter(Boolean);

  if (todasImagens.length > 0) {
    html += `<h2 class="imagensPDF">Imagens das Despesas</h2>`;
    html += `<table style="width:100%; border-collapse:collapse; page-break-inside:avoid;">`;

    // Montar 2 imagens por linha
    for (let i = 0; i < todasImagens.length; i += 2) {
      html += `<tr>`;
      for (let j = 0; j < 2; j++) {
        const nomeImagem = todasImagens[i + j];
        if (nomeImagem) {
          const numeroImagem = i + j + 1;
          html += `
            <td style="width:50%; text-align:center; padding:10px; vertical-align:top;">
              <img class="imagem-pdf"
                src="https://api-com-nodejs-express-mongodb-prisma.onrender.com/uploads/${nomeImagem}"
                alt="Imagem da despesa"
                style="max-width:100%; max-height:300px; display:block; margin:0 auto; page-break-inside:avoid; break-inside:avoid;" />
              <p style="margin-top:8px; font-size:11px; color:#333;">Imagem ${numeroImagem}</p>
            </td>
          `;
        } else {
          html += `<td style="width:50%;"></td>`;
        }
      }
      html += `</tr>`;
    }

    html += `</table>`;
  } else {
    html += `<p>Sem imagens para este grupo.</p>`;
  }
});




  html += `</body></html>`; 
  return html;
}


function formatarData(data) {
  if (!data) return '-';
  return new Date(data).toLocaleDateString();
}




// import React, { useState, useEffect } from 'react';
// import { Button, View, Alert } from 'react-native';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter, useLocalSearchParams } from 'expo-router';

// const PdfGenerator = () => {
//   const { missaoId } = useLocalSearchParams();
//   const [loading, setLoading] = useState(false);

//   const baixarPdf = async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       const url = `http://192.168.43.226:3000/relatorioPdf?missao_id=${missaoId}`;
//       const fileUri = FileSystem.cacheDirectory + `relatorio_${missaoId}.pdf`;

//       const response = await FileSystem.downloadAsync(
//         url,
//         fileUri,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       await Sharing.shareAsync(response.uri, {
//         mimeType: 'application/pdf',
//         dialogTitle: 'Compartilhar Relatório PDF',
//         UTI: 'com.adobe.pdf',
//       });
//     } catch (error) {
//       Alert.alert('Erro ao baixar PDF', error?.message || String(error));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={{ margin: 20 }}>
//       <Button
//         title={loading ? "Baixando PDF..." : "Baixar Relatório PDF"}
//         onPress={baixarPdf}
//         disabled={loading}
//       />
//     </View>
//   );
// };

// export default PdfGenerator;