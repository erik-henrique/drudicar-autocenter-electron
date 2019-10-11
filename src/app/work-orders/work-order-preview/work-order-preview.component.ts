import { Component, OnInit } from '@angular/core';
import Pdf from 'src/shared/entities/pdf.entity';

@Component({
  selector: 'app-work-order-preview',
  templateUrl: './work-order-preview.component.html',
  styleUrls: ['./work-order-preview.component.scss']
})
export class WorkOrderPreviewComponent implements OnInit {
  services = [
    {
      name: 'Troca de óleo',
      preco: 20,
    },
    {
      name: 'Troca de motor',
      preco: 200,
    },
    {
      name: 'Troca de pneu',
      preco: 40,
    }
  ];

  products = [
    {
      name: 'Yamalube',
      preco: 20,
    },
    {
      name: 'Porca aleatória',
      preco: 3,
    }
  ];

  public canvas: any;
  constructor() { }

  ngOnInit() {
    this.canvas = document.getElementById('canvasLogo') as any;
    const context = this.canvas.getContext('2d');

    const logoImage = new Image();
    logoImage.src = 'assets/images/drudicar_logo.png';
    logoImage.onload = function () {
      context.drawImage(logoImage, 15, 5, 150, 140);
    };
  }

  public downloadWorkOrderPreview() {
    const pdfDoc = new Pdf();

    pdfDoc.addLabelAndValue({ startX: 10, startY: 10, endX: 63, endY: 10, label: 'Ordem de serviço Nº:', value: '2' });

    pdfDoc.doc.setFontSize(12);
    pdfDoc.doc.setFontType('bold');
    pdfDoc.doc.text(160, 10, 'Em Andamento');

    pdfDoc.doc.addImage(this.canvas.toDataURL(), 'PNG', 90, 10, 150, 140);

    pdfDoc.doc.setFontSize(14);
    pdfDoc.doc.setFontType('bold');
    pdfDoc.doc.text(10, 40, 'AUTO CENTER DRUDICAR');

    pdfDoc.titleFontSize = 12;
    const now = new Date();
    pdfDoc.addLabelAndValue({ startX: 160, startY: 40, endX: 175, endY: 40, label: 'DATA:', value: `${now.toLocaleDateString()}` });

    pdfDoc.addDot({ startX: 10, startY: 42, endX: 200, endY: 42 });

    pdfDoc.addLabelAndValue({ startX: 10, startY: 50, endX: 27, endY: 50, label: 'Cliente:', value: 'Ericson' });
    pdfDoc.addLabelAndValue({ startX: 10, startY: 55, endX: 22, endY: 55, label: 'CPF:', value: '469.520.628-58' });
    pdfDoc.addLabelAndValue({ startX: 75, startY: 55, endX: 90, endY: 55, label: 'E-mail:', value: 'erik.hac@outlook.com' });
    pdfDoc.addLabelAndValue({ startX: 10, startY: 60, endX: 28, endY: 60, label: 'Contato:', value: '19 99900-1945' });

    pdfDoc.doc.setLineDash([]);

    pdfDoc.doc.setFontType('bold');
    pdfDoc.doc.text(92, 75, 'Veículo');
    pdfDoc.doc.setFontType('normal');

    pdfDoc.doc.rect(10, 80, 190, 30);
    pdfDoc.doc.line(100, 80, 100, 110);

    pdfDoc.titleFontSize = 12;
    pdfDoc.textFontSize = 10;

    pdfDoc.addLabelAndValue({ startX: 15, startY: 87, endX: 30, endY: 87, label: 'Placa:', value: 'FZC-6504' });
    pdfDoc.addLabelAndValue({ startX: 105, startY: 87, endX: 115, endY: 87, label: 'Cor:', value: 'BRANCA' });

    pdfDoc.doc.line(10, 90, 200, 90);

    pdfDoc.addLabelAndValue({ startX: 15, startY: 97, endX: 35, endY: 97, label: 'Modelo:', value: 'FAZER SED 150 UBS' });
    pdfDoc.addLabelAndValue({ startX: 105, startY: 97, endX: 120, endY: 97, label: 'Marca:', value: 'YAMAHA' });

    pdfDoc.doc.line(10, 100, 200, 100);

    pdfDoc.addLabelAndValue({ startX: 15, startY: 107, endX: 30, endY: 107, label: 'Ano:', value: '2018' });
    pdfDoc.addLabelAndValue({ startX: 105, startY: 107, endX: 135, endY: 107, label: 'Ano model:', value: '2019' });

    pdfDoc.titleFontSize = 14;
    pdfDoc.textFontSize = 12;
    pdfDoc.doc.setFontSize(12);

    pdfDoc.doc.setFontType('bold');
    pdfDoc.doc.text(92, 125, 'Serviços');
    pdfDoc.doc.setFontType('normal');

    const obs = 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI, quando um impressor desconhecido pegou uma bandeja de tipos e os embaralhou para fazer um livro de modelos de tipos. Lorem Ipsum sobreviveu não só a cinco séculos, como também ao salto para a editoração eletrônica, permanecendo essencialmente inalterado';

    const services = [
      { servico: 'Troca de óleo', valor: 'R$ 10' },
      { servico: 'Troca de pneu', valor: 'R$ 20' },
      { servico: 'Troca de pneu', valor: 'R$ 50' },
      { servico: 'Troca de pneu', valor: 'R$ 20' },
      { servico: 'Troca de pneu', valor: 'R$ 50' },
      { servico: 'Troca de pneu', valor: 'R$ 20' },
      { servico: 'Troca de pneu', valor: 'R$ 50' },
      { servico: 'Troca de pneu', valor: 'R$ 20' },
      { servico: 'Troca de pneu', valor: 'R$ 50' },
      { servico: 'Troca de pneu', valor: 'R$ 20' },
      { servico: 'Troca de pneu', valor: 'R$ 50' },
      { servico: 'Troca de pneu', valor: 'R$ 20' },
      { servico: 'Troca de pneu', valor: 'R$ 50' },
      { servico: 'Troca de pneu', valor: 'R$ 20' },
      // { servico: 'Troca de pneu', valor: 'R$ 50' },
      // { servico: 'Troca de pneu', valor: 'R$ 20' },
      // { servico: 'Troca de pneu', valor: 'R$ 50' },
      // { servico: 'Troca de pneu', valor: 'R$ 20' },
      // { servico: 'Troca de pneu', valor: 'R$ 50' },
      { servico: 'Total', valor: 'R$ 80' }
    ];

    const products = [
      { produto: 'Troca de óleo', valor: 'R$ 10' },
      { produto: 'Troca de pneu', valor: 'R$ 20' },
      // { produto: 'Troca de pneu', valor: 'R$ 210' },
      // { produto: 'Troca de pneu', valor: 'R$ 210' },
      // { produto: 'Troca de pneu', valor: 'R$ 20' },
      // { produto: 'Troca de pneu', valor: 'R$ 20' },
      // { produto: 'Troca de pneu', valor: 'R$ 210' },
      // { produto: 'Troca de pneu', valor: 'R$ 20' },
      // { produto: 'Troca de pneu', valor: 'R$ 20' },
      { produto: 'Total', valor: 'R$ 50' }
    ];

    const firstPageServicos = services.splice(0, 17);

    pdfDoc.doc.autoTable({
      styles: { fontSize: 12 },
      theme: 'plain',
      margin: { top: 130, left: 30, right: 10 },
      body: firstPageServicos,
      columns: [{ header: 'Serviço', dataKey: 'servico' }, { header: 'Valor', dataKey: 'valor' }],
      didParseCell: (hookData) => {
        if (hookData.row.index === hookData.table.body.length - 1 && !services.length) {
          hookData.cell.styles.fontStyle = 'bold';
        }
      },
      didDrawPage: (hookData) => {
        if (firstPageServicos.length && services.length) {
          pdfDoc.doc.addPage();

          pdfDoc.doc.autoTable({
            styles: { fontSize: 12 },
            theme: 'plain',
            margin: { top: 10, left: 30, right: 10 },
            body: services,
            columns: [{ header: 'Serviço', dataKey: 'servico' }, { header: 'Valor', dataKey: 'valor' }],
            didParseCell: (hookData) => {
              if (hookData.row.index === hookData.table.body.length - 1) {
                hookData.cell.styles.fontStyle = 'bold';
              }
            },
            didDrawPage: (hookData) => {
              const firstPageProdutos = products.splice(0, 17 - services.length);

              pdfDoc.doc.setFontType('bold');
              pdfDoc.doc.text(92, hookData.cursor.y + 15, 'Produtos');
              pdfDoc.doc.setFontType('normal');

              pdfDoc.doc.autoTable({
                styles: { fontSize: 12 },
                theme: 'plain',
                margin: { top: hookData.cursor.y + 20, left: 30, right: 10 },
                body: firstPageProdutos.length ? firstPageProdutos : products,
                columns: [
                  { header: 'Produto', dataKey: 'produto' },
                  { header: 'Valor', dataKey: 'valor' }
                ],
                didParseCell: (hookData) => {
                  if (hookData.row.index === hookData.table.body.length - 1) {
                    hookData.cell.styles.fontStyle = 'bold';
                  }
                },
                didDrawPage: (hookData) => {
                  if (firstPageProdutos.length && products.length) {
                    pdfDoc.doc.addPage();

                    pdfDoc.doc.setFontType('bold');
                    pdfDoc.doc.text(92, hookData.cursor.y + 15, 'Produtos');
                    pdfDoc.doc.setFontType('normal');

                    pdfDoc.doc.autoTable({
                      styles: { fontSize: 12 },
                      theme: 'plain',
                      margin: { top: hookData.cursor.y + 20, left: 30, right: 10 },
                      body: products,
                      columns: [
                        { header: 'Produto', dataKey: 'produto' },
                        { header: 'Valor', dataKey: 'valor' }
                      ],
                      didParseCell: (hookData) => {
                        if (hookData.row.index === hookData.table.body.length - 1) {
                          hookData.cell.styles.fontStyle = 'bold';
                        }
                      },
                      didDrawPage: (hookData) => {
                        this.buildCommentsSection(hookData, pdfDoc, obs);
                      }
                    });
                  } else {
                    this.buildCommentsSection(hookData, pdfDoc, obs);
                  }
                }
              });
            }
          });
        } else {
          const firstPageProdutos = products.splice(0, firstPageServicos.length);

          let y = hookData.cursor.y + 15;

          y = this.breakPageAndSetStartY(((firstPageProdutos.length - 1) * 12) + hookData.cursor.y + 15, pdfDoc, y);

          pdfDoc.doc.setFontType('bold');
          pdfDoc.doc.text(92, y + 10, 'Produtos');
          pdfDoc.doc.setFontType('normal');

          pdfDoc.doc.autoTable({
            styles: { fontSize: 12 },
            theme: 'plain',
            margin: { top: y + 20, left: 30, right: 10 },
            body: firstPageProdutos.length ? firstPageProdutos : products,
            columns: [{ header: 'Produto', dataKey: 'produto' }, { header: 'Valor', dataKey: 'valor' }],
            didParseCell: (hookData) => {
              if (hookData.row.index === hookData.table.body.length - 1 && !products.length) {
                hookData.cell.styles.fontStyle = 'bold';
              }
            },
            didDrawPage: (hookData) => {
              if (firstPageProdutos.length && products.length) {
                pdfDoc.doc.addPage();

                pdfDoc.doc.autoTable({
                  styles: { fontSize: 12 },
                  theme: 'plain',
                  margin: { top: 10, left: 30, right: 10 },
                  body: products,
                  columns: [
                    { header: 'Produto', dataKey: 'produto' },
                    { header: 'Valor', dataKey: 'valor' }
                  ],
                  didParseCell: (hookData) => {
                    if (hookData.row.index === hookData.table.body.length - 1) {
                      hookData.cell.styles.fontStyle = 'bold';
                    }
                  },
                  didDrawPage: (hookData) => {
                    this.buildCommentsSection(hookData, pdfDoc, obs);
                  }
                });
              } else {
                this.buildCommentsSection(hookData, pdfDoc, obs);
              }
            }
          });
        }
      }
    });


    pdfDoc.doc.save('asdsada.pdf');
  }

  public breakPageAndSetStartY(height, pdfDoc, y: number) {
    if (height > pdfDoc.doc.internal.pageSize.getHeight()) {
      pdfDoc.doc.addPage();
      y = 10;
    }

    return y;
  }

  public buildCommentsSection(hookData, pdfDoc, obs) {
    hookData.cursor.y = hookData.cursor.y;
    pdfDoc.titleFontSize = 12;
    pdfDoc.textFontSize = 12;

    let startY = hookData.cursor.y + 15;

    const splitTitle = pdfDoc.doc.splitTextToSize(obs, 180);

    startY = this.breakPageAndSetStartY(((splitTitle.length - 1) * 12) + hookData.cursor.y, pdfDoc, startY);

    const endY = startY + 5;

    pdfDoc.addLabelAndValue({
      startX: 10,
      startY: startY,
      endX: 10,
      endY: endY,
      label: 'Observações:',
      value: splitTitle
    });
  }
}
