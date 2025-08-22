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
      <Button title="Gerar Relatório PDF" onPress={gerarPdf} disabled={loading || relatorio.length === 0} />
    </View>
  );
};

export default PdfGenerator;

function gerarHtml(grupos) {
  const dataAtual = new Date().toLocaleDateString();
  let html = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            font-size: 12px;
          }
          h1 {
            text-align: center;
            font-size: 20px;
            margin-bottom: 10px;
          }
          .user-info {
            margin-bottom: 20px;
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
            font-size: 11px;
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
          }
        </style>
      </head>
      <body>
        <h1>CONGREGAÇÃO  CRISTÃ  NO  BRASIL</h1>
         <h1>Relatório de Câmbios e Despesas de viagem missionária</h1>
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
      <h2 class="cabecalho">Moeda: ${grupo.moeda}</h2>
      <table>
        <tr>
          <th>DATA</th>
          <th>HISTÓRICO DAS DESPESAS</th>
          <th>Nº RECIBO</th>
          <th>IMAGENS</th>
          <th>CIDADE</th>
          <th>PAÍS</th>
          <th>VALOR</th>
        </tr>
        <tr>
          <td>${formatarData(grupo.data_padrao)}</td>
          <td><strong>Recurso para Despesas</strong></td>
          <td>${grupo.numero_recibo || '-'}</td>
          <td>-</td>
          <td>-</td>
          <td>${grupo.pais}</td>
          <td><strong>${formatarValor(grupo.valorOriginal / 100, grupo.moeda)}</strong></td>
        </tr>
    `;

let totalDescontos = 0;
let totalAcrescentado = 0;

const despesas = (grupo.despesas || []);

if (despesas.length > 0) {
despesas.forEach((d) => {
  // Verifica se é uma entrada de moeda (acréscimo)
  const isCambio = d.tipo === 'cambio';
  const dataDespesa = d.data_padrao;
  const isAcrescimo = d.moeda_destino === grupo.moeda;




const isValorInicial =
  isCambio &&
  Math.abs(parseFloat(d.total_cambiado) - grupo.valorOriginal) < 0.01 // tolerância para float
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
      <td>${formatarData(dataDespesa)}</td>
      <td>${d.descricao || '-'}</td>
      <td>${d.numero_recibo || '-'}</td>
      <td>${nomesImagens || '-'}</td>
      <td>${d.cidade || '-'}</td>
      <td>${grupo.pais}</td>
      <td>${sinal}${formatarValor((vFinal / 100), grupo.moeda)}</td>
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
    <td>${grupo.pais}</td>
    <td><strong>${formatarValor((grupo.valorOriginal + totalAcrescentado - totalDescontos ) / 100, grupo.moeda)}</strong></td>
  </tr>
</table>
`;});



html += `<h2>Imagens das Despesas</h2>`;
grupos.forEach(grupo => {
  const todasImagens = (grupo.despesas || [])
    .flatMap(d => (d.imagens || []).flatMap(img => img.fotos))
    .filter(Boolean); // remove null/undefined

  if (todasImagens.length > 0) {
    html += `<h3>Imagens do grupo ${grupo.moeda || '-'}</h3>`;
    html += `<div style="display:flex; flex-wrap:wrap; gap:10px;">`; // container flexível

    todasImagens.forEach(nomeImagem => {
      html += `
        <div style="width:200px; text-align:center; margin-bottom:15px;">
          <p style="margin-bottom:5px; font-size:10px; word-wrap:break-word;">${nomeImagem}</p>
          <img src="https://api-com-nodejs-express-mongodb-prisma.onrender.com/uploads/${nomeImagem}" 
               alt="Imagem da despesa" 
               style="max-width:100%; height:auto; display:block; margin:0 auto;" />
        </div>
      `;
    });

    html += `</div>`; // fecha o container flex
  } else {
    html += `<p>Sem imagens para este grupo.</p>`;
  }
});


  html += `</body></html>`; 
  return html;
}


// despesas.forEach((d) => {
//   (d.imagens || []).forEach(img => {
//     img.fotos.forEach(nomeArquivo => {
//       html += `<img src="/uploads/${nomeArquivo}" alt="Imagem da despesa" style="max-width:150px; margin:5px;" />`;
//     });
//   });
// });


function formatarData(data) {
  if (!data) return '-';
  return new Date(data).toLocaleDateString();
}
