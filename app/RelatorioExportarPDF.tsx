import React from 'react';
import { View, Button, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const RelatorioExportarPDF = ({ dados }: { dados: any[] }) => {
  const gerarPDF = async () => {
    try {
      const html = `
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              h1 {
                text-align: center;
              }
              .card {
                border: 1px solid #ccc;
                margin-bottom: 20px;
                border-radius: 8px;
                padding: 16px;
              }
              .header {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 8px;
              }
              .info {
                margin: 4px 0;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
              }
              th, td {
                border: 1px solid #aaa;
                padding: 6px;
                text-align: left;
              }
              th {
                background-color: #f0f0f0;
              }
            </style>
          </head>
          <body>
            <h1>Relatório de Câmbios</h1>
            ${dados.map(item => `
              <div class="card">
                <div class="header">${item.moeda.toUpperCase()}</div>
                <div class="info"><strong>Descrição:</strong> ${item.descricao}</div>
                <div class="info"><strong>Data do Câmbio:</strong> ${new Date(item.data_cambio).toLocaleString()}</div>
                <div class="info"><strong>Total Cambiado:</strong> ${item.valor_cambiado} ${item.moeda}</div>
                <div class="info"><strong>Total de Despesas:</strong> ${item.total_despesas} ${item.moeda}</div>
                <div class="info"><strong>Sobra:</strong> ${item.sobra} ${item.moeda}</div>

                ${item.despesas.length > 0 ? `
                  <table>
                    <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                    </tr>
                    ${item.despesas.map((d: any) => `
                      <tr>
                        <td>${new Date(d.data_padrao).toLocaleDateString()}</td>
                        <td>${d.descricao}</td>
                        <td>${d.valor} ${item.moeda}</td>
                      </tr>
                    `).join('')}
                  </table>
                ` : '<div class="info">Sem despesas.</div>'}
              </div>
            `).join('')}
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Erro', 'Compartilhamento não está disponível neste dispositivo.');
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      Alert.alert('Erro', 'Falha ao gerar o PDF.');
    }
  };

  return (
    <View style={{ marginVertical: 20 }}>
      <Button title="Exportar Relatório em PDF" onPress={gerarPDF} />
    </View>
  );
};

export default RelatorioExportarPDF;
