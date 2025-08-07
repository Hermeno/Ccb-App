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
      const htmlContent = gerarHtml(relatorio);

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });

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
      <Button title="Gerar Relatório PDF" onPress={gerarPdf} />
    </View>
  );
};

export default PdfGenerator;

// 👇 função auxiliar para gerar HTML
const gerarHtml = (grupos) => {
  const formatarData = (data) => new Date(data).toLocaleDateString();

  let html = `
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { text-align: center; }
          h2 { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; color:green}
          .grupo { margin-bottom: 30px; }
          .despesa { margin: 5px 0; padding: 5px; border-bottom: 1px dashed #ccc; }
          .footer { margin-top: 10px; font-weight: bold; }
           .tabela {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                font-size: 10px;
            }

            .tabela th, .tabela td {
                border: 1px solid #999;
                padding: 5px;
                text-align: left;
            }

            .tabela th {
                background-color: #eee;
            }
            .tabela-cambios {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
                font-size: 10px;
            }

            .tabela-cambios th, .tabela-cambios td {
                border: 1px solid #999;
                padding: 5px;
                text-align: left;
                vertical-align: top;
            }

            .tabela-cambios th {
                background-color: #f2f2f2;
            }

            .grupo {
                margin-bottom: 30px;
            }
        </style>
      </head>
      <body>
        <h1>Relatório de Câmbios</h1>
  `;

        grupos.forEach((grupo) => {
        html += `
            <div class="grupo">
            <h2 >Moeda: ${grupo.moeda}</h2>

            <table class="tabela-cambios">
                <thead>
                <tr>
                    <th>Data do Câmbio</th>
                    <th>Descrição</th>
                    <th>Imagens</th>
                    <th>Nº Recibo</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>${formatarData(grupo.data_cambio)}</td>
                    <td>${grupo.descricao.replace(/\n/g, '<br>')}</td>
                    <td><!-- IMAGENS AQUI --></td>
                    <td>${grupo.numero_recibo || '-'}</td>
                </tr>
                </tbody>
            </table>

            <p><strong>Total de Câmbiado:</strong> ${grupo.valor_cambiado.toFixed(2)} ${grupo.moeda}</p>
            `;

            if (grupo.despesas.length > 0) {
            html += `
                <table class="tabela">
                <thead>
                    <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Nº Recibo</th>
                    <th>Cidade</th>
                    <th>País</th>
                    <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
            `;

        grupo.despesas.forEach((d) => {
            html += `
            <tr>
                <td>${formatarData(d.data_padrao)}</td>
                <td>${d.descricao || '-'}</td>
                <td>${d.numero_recibo || '-'}</td>
                <td>${d.cidade || '-'}</td>
                <td>${grupo.pais || '-'}</td>
                <td>${parseFloat(d.valor).toFixed(2)} ${grupo.moeda}</td>
            </tr>
            `;
        });

        html += `
            </tbody>
            </table>
            <div class="footer">
            Total Despesas: ${grupo.total_despesas.toFixed(2)} ${grupo.moeda}<br>
            Sobra: ${grupo.sobra.toFixed(2)} ${grupo.moeda}
            </div>
        `;
        }else {
      html += `<p><em>Sem despesas registradas.</em></p>`;
    }

    html += `</div>`;
  });

  html += `
      </body>
    </html>
  `;

  return html;
};
