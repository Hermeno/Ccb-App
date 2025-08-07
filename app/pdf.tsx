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
        </style>
      </head>
      <body>
        <h1>CONGREGAÇÃO  CRISTÃ  NO  BRASIL</h1>
         <h1>Relatório de Câmbios e Despesas de viagem missionária</h1>
  `;

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
      <h2>Moeda: ${grupo.moeda}</h2>
      <table>
        <tr>
          <th>DATA</th>
          <th>HISTÓRICO DAS DESPESAS</th>
          <th>Nº REIBO</th>
          <th>IMAGENS</th>
          <th>CIDADE</th>
          <th>PAÍS</th>
          <th>VALOR</th>
        </tr>
        <tr>
          <td>${formatarData(grupo.data_cambio)}</td>
          <td><strong>Recurso para Despesas</strong></td>
          <td>${grupo.numero_recibo || '-'}</td>
          <td>-</td>
          <td>-</td>
          <td>${grupo.pais}</td>
          <td><strong>${grupo.valorOriginal.toFixed(2)} ${grupo.moeda}</strong></td>
        </tr>
    `;

let totalDescontos = 0;
let totalAcrescentado = 0;

const despesas = (grupo.despesas || []);

if (despesas.length > 0) {
  despesas.forEach((d) => {
    const valor = parseFloat(d.valor);
    const vFinal = isNaN(valor) ? 0 : valor;

    // Verifica se é uma entrada de moeda (acréscimo)
      const isCambio = d.tipo === 'cambio';
  const dataDespesa = isCambio ? d.createdAt : d.data_padrao;
    const isAcrescimo = d.moeda_destino === grupo.moeda;
    const isDesconto = !isAcrescimo; // tudo o que não é acréscimo é desconto

    if (isAcrescimo) {
      totalAcrescentado += vFinal;
    } else {
      totalDescontos += vFinal;
    }

    const sinal = isAcrescimo ? '+' : '-';

    html += `
      <tr>
        <td>${formatarData(dataDespesa)}</td>
        <td>${d.descricao || '-'}</td>
        <td>${d.numero_recibo || '-'}</td>
        <td>abcdefgh.png</td>
        <td>${d.cidade || '-'}</td>
        <td>${grupo.pais}</td>
        <td>${sinal}${vFinal.toFixed(2)} ${grupo.moeda}</td>
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
    <td colspan="5"><strong>Total gasto em despesas</strong></td>
    <td><strong>-${totalDescontos.toFixed(2)} ${grupo.moeda}</strong></td>
  </tr>
  <tr>
    <td colspan="5"><strong>Total Acrescentado</strong></td>
    <td><strong>+${totalAcrescentado.toFixed(2)} ${grupo.moeda}</strong></td>
  </tr>
  <tr>
    <td colspan="5"><strong>Saldo</strong></td>
    <td><strong>${(grupo.valorOriginal + totalAcrescentado - totalDescontos).toFixed(2)} ${grupo.moeda}</strong></td>
  </tr>
</table>
`;});

  html += `</body></html>`; 
  return html;
}


function formatarData(data) {
  if (!data) return '-';
  return new Date(data).toLocaleDateString();
}
