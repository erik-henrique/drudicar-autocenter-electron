import { Component, OnInit, Inject } from '@angular/core';
import Pdf from '../../../shared/entities/pdf.entity';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { WorkOrderEntity } from '../../../shared/services/database/entities/work-order.entity';
import IWorkOrder from '../../../shared/interfaces/work-order.interface';
import { MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { MaskService } from 'ngx-mask';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-work-order-preview',
  templateUrl: './work-order-preview.component.html',
  styleUrls: ['./work-order-preview.component.scss'],
  providers: [MaskService, CurrencyPipe, TitleCasePipe]
})
export class WorkOrderPreviewComponent implements OnInit {
  public workOrder: IWorkOrder;
  public canvas: any;

  constructor(
    private _databaseService: DatabaseService,
    private _snackBar: MatSnackBar,
    private maskService: MaskService,
    private currencyPipe: CurrencyPipe,
    private titlecasePipe: TitleCasePipe,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  async ngOnInit() {
    this.getWorkOrder(this.data);

    this.canvas = document.getElementById('canvasLogo') as any;
    const context = this.canvas.getContext('2d');

    const logoImage = new Image();
    logoImage.src = 'assets/images/drudicar_logo.png';
    logoImage.onload = function () {
      context.drawImage(logoImage, 15, 5, 150, 140);
    };
  }

  get totalValue() {
    if (!this.workOrder.products.length && !this.workOrder.services.length) {
      return 0;
    }

    if (this.workOrder.products.length && !this.workOrder.services.length) {
      return parseFloat(this.workOrder.products.map(product => product.price * product.amount)
        .reduce((accum, curr) => accum + curr));
    }

    if (!this.workOrder.products.length && this.workOrder.services.length) {
      return parseFloat(this.workOrder.services
        .map(value => value.price ? value.price : 0)
        .reduce((accum, curr) => accum + curr));
    }

    return parseFloat(this.workOrder.products
      .map(product => product.price * product.amount)
      .reduce((accum, curr) => accum + curr) + this.workOrder.services
        .map(value => value.price)
        .reduce((accum, curr) => accum + curr));
  }

  public getTotalServicePrice() {
    if (this.workOrder.services.length) {
      return parseFloat(this.workOrder.services
        .map(value => value.price ? value.price : 0)
        .reduce((accum, curr) => accum + curr));
    }

    return 0;
  }

  public getTotalProductsPrice() {
    if (this.workOrder.products.length) {
      return parseFloat(this.workOrder.products.map(product => product.price * product.amount)
        .reduce((accum, curr) => accum + curr));
    }

    return 0;
  }

  async getWorkOrder(id: number) {
    try {
      await this._databaseService
        .connection
        .then(async () => {
          const workOrder = await WorkOrderEntity.findOne(id, { relations: ['vehicle', 'vehicle.client'] });
          workOrder.services = JSON.parse(workOrder.services).map(service => {
            return { name: this.titlecasePipe.transform(service.name), price: service.price };
          });
          workOrder.products = JSON.parse(workOrder.products);
          this.workOrder = workOrder;

          console.log(this.workOrder);
        });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Não foi possível carregar.', 'OK', {
        duration: 2000,
      });
    }
  }

  public downloadWorkOrderPreview() {
    const pdfDoc = new Pdf();

    pdfDoc.addLabelAndValue(
      {
        startX: 10, startY: 10, endX: 15, endY: 10, label: `${this.workOrder.type}`,
        value: ''
      });


    pdfDoc.addLabelAndValue(
      {
        startX: 10, startY: 15, endX: 18, endY: 15, label: 'Nº:',
        value: this.workOrder.id.toString()
      });

    pdfDoc.doc.setFontSize(12);
    pdfDoc.doc.setFontType('bold');

    pdfDoc.doc.addImage(this.canvas.toDataURL(), 'PNG', 90, 10, 150, 140);

    pdfDoc.doc.setFontSize(14);
    pdfDoc.doc.setFontType('bold');
    pdfDoc.doc.text(10, 40, 'AUTO CENTER DRUDICAR');

    pdfDoc.titleFontSize = 12;
    const now = new Date();
    pdfDoc.addLabelAndValue({ startX: 160, startY: 40, endX: 175, endY: 40, label: 'DATA:', value: `${now.toLocaleDateString()}` });

    pdfDoc.addDot({ startX: 10, startY: 42, endX: 200, endY: 42 });

    pdfDoc.addLabelAndValue({
      startX: 10, startY: 50, endX: 27, endY: 50, label: 'Cliente:',
      value: this.titlecasePipe.transform(this.workOrder.vehicle.client.name)
    });
    pdfDoc.addLabelAndValue({
      startX: 10, startY: 55, endX: 22, endY: 55, label: 'CPF:',
      value: this.maskService.applyMask(this.workOrder.vehicle.client.individualRegistration, '000.000.000-00')
    });
    pdfDoc.addLabelAndValue({ startX: 75, startY: 55, endX: 90, endY: 55, label: 'E-mail:', value: this.workOrder.vehicle.client.email });
    pdfDoc.addLabelAndValue({
      startX: 10, startY: 60, endX: 28, endY: 60, label: 'Contato:',
      value: this.maskService.applyMask(this.workOrder.vehicle.client.cellphone, '(00) 00000-0000')
    });

    pdfDoc.doc.setLineDash([]);

    pdfDoc.doc.setFontType('bold');
    pdfDoc.doc.text(92, 75, 'Veículo');
    pdfDoc.doc.setFontType('normal');

    pdfDoc.doc.rect(10, 80, 190, 30);
    pdfDoc.doc.line(100, 80, 100, 110);

    pdfDoc.titleFontSize = 12;
    pdfDoc.textFontSize = 12;

    pdfDoc.addLabelAndValue({
      startX: 15, startY: 87, endX: 30, endY: 87, label: 'Placa:',
      value: this.maskService.applyMask(this.workOrder.vehicle.carLicense.toUpperCase(), 'AAA-0000')
    });
    pdfDoc.addLabelAndValue({
      startX: 105, startY: 87, endX: 115, endY: 87, label: 'Cor:', value: this.workOrder.vehicle.color.toUpperCase()
    });

    pdfDoc.doc.line(10, 90, 200, 90);

    pdfDoc.addLabelAndValue({
      startX: 15, startY: 97, endX: 35, endY: 97, label: 'Modelo:', value: this.workOrder.vehicle.model.toUpperCase()
    });
    pdfDoc.addLabelAndValue({
      startX: 105, startY: 97, endX: 120, endY: 97, label: 'Marca:', value: this.workOrder.vehicle.brand.toUpperCase()
    });

    pdfDoc.doc.line(10, 100, 200, 100);

    pdfDoc.addLabelAndValue({
      startX: 15, startY: 107, endX: 30, endY: 107, label: 'Ano:', value: this.workOrder.vehicle.year.getFullYear().toString()
    });
    pdfDoc.addLabelAndValue({
      startX: 105, startY: 107, endX: 135, endY: 107, label: 'Ano modelo:', value: this.workOrder.vehicle.yearModel.getFullYear().toString()
    });

    pdfDoc.titleFontSize = 14;
    pdfDoc.textFontSize = 12;
    pdfDoc.doc.setFontSize(12);

    pdfDoc.doc.setFontType('bold');
    pdfDoc.doc.text(10, 125, 'Serviços');
    pdfDoc.doc.setFontType('normal');

    const services = Object.assign([], this.workOrder.services.map(service => {
      return { name: service.name, price: this.currencyPipe.transform(service.price.toString(), 'BRL') };
    }));

    const products = Object.assign([], this.workOrder.products.map(product => {
      return {
        name: product.name,
        amount: product.amount,
        price: this.currencyPipe.transform(product.price.toString(), 'BRL')
      };
    }));

    services.push({ name: 'Total', price: this.currencyPipe.transform(this.getTotalServicePrice(), 'BRL') });
    products.push({ name: 'Total', price: this.currencyPipe.transform(this.getTotalProductsPrice(), 'BRL') });

    const firstPageServicos = services.splice(0, 17);

    pdfDoc.doc.autoTable({
      styles: { fontSize: 12 },
      theme: 'plain',
      margin: { top: 130, left: 45, right: 10 },
      body: firstPageServicos,
      columns: [
        { header: 'Serviço', dataKey: 'name' },
        { header: 'Valor (R$)', dataKey: 'price' }
      ],
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
            margin: { top: 10, left: 45, right: 10 },
            body: services,
            columns: [{ header: 'Serviço', dataKey: 'name' },
            { header: 'Valor (R$)', dataKey: 'price' },
            ],
            didParseCell: (hookData) => {
              if (hookData.row.index === hookData.table.body.length - 1) {
                hookData.cell.styles.fontStyle = 'bold';
              }
            },
            didDrawPage: (hookData) => {
              const firstPageProdutos = products.splice(0, 17 - services.length);

              pdfDoc.doc.setFontType('bold');
              pdfDoc.doc.text(10, hookData.cursor.y + 15, 'Produtos');
              pdfDoc.doc.setFontType('normal');

              pdfDoc.doc.autoTable({
                styles: { fontSize: 12 },
                theme: 'plain',
                margin: { top: hookData.cursor.y + 20, left: 35, right: 10 },
                body: firstPageProdutos.length ? firstPageProdutos : products,
                columns: [
                  { header: 'Produto', dataKey: 'name' },
                  { header: 'Quantidade', dataKey: 'amount' },
                  { header: 'Valor (R$)', dataKey: 'price' },
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
                    pdfDoc.doc.text(10, hookData.cursor.y + 15, 'Produtos');
                    pdfDoc.doc.setFontType('normal');

                    pdfDoc.doc.autoTable({
                      styles: { fontSize: 12 },
                      theme: 'plain',
                      margin: { top: hookData.cursor.y + 20, left: 35, right: 10 },
                      body: products,
                      columns: [
                        { header: 'Produto', dataKey: 'name' },
                        { header: 'Quantidade', dataKey: 'amount' },
                        { header: 'Valor (R$)', dataKey: 'price' },
                      ],
                      didParseCell: (hookData) => {
                        if (hookData.row.index === hookData.table.body.length - 1) {
                          hookData.cell.styles.fontStyle = 'bold';
                        }
                      },
                      didDrawPage: (hookData) => {
                        this.buildFooterSection(hookData, pdfDoc);
                      }
                    });
                  } else {
                    this.buildFooterSection(hookData, pdfDoc);
                  }
                }
              });
            }
          });
        } else {
          const firstPageProdutos = products.splice(0, firstPageServicos.length);

          let y = hookData.cursor.y + 15;

          console.log(((products.length - 1) * 6) + hookData.cursor.y + 15, pdfDoc, y);
          y = this.breakPageAndSetStartY(((products.length - 1) * 6) + hookData.cursor.y + 15, pdfDoc, y);

          pdfDoc.doc.setFontType('bold');
          pdfDoc.doc.text(10, y + 10, 'Produtos');
          pdfDoc.doc.setFontType('normal');

          pdfDoc.doc.autoTable({
            styles: { fontSize: 12 },
            theme: 'plain',
            margin: { top: y + 20, left: 35, right: 10 },
            body: firstPageProdutos.length ? firstPageProdutos : products,
            columns: [
              { header: 'Produto', dataKey: 'name' },
              { header: 'Quantidade', dataKey: 'amount' },
              { header: 'Valor (R$)', dataKey: 'price' },

            ],
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
                  margin: { top: 10, left: 35, right: 10 },
                  body: products,
                  columns: [
                    { header: 'Produto', dataKey: 'name' },
                    { header: 'Quantidade', dataKey: 'amount' },
                    { header: 'Valor (R$)', dataKey: 'price' },
                  ],
                  didParseCell: (hookData) => {
                    if (hookData.row.index === hookData.table.body.length - 1) {
                      hookData.cell.styles.fontStyle = 'bold';
                    }
                  },
                  didDrawPage: (hookData) => {
                    this.buildFooterSection(hookData, pdfDoc);
                  }
                });
              } else {
                this.buildFooterSection(hookData, pdfDoc);
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

  public buildFooterSection(hookData, pdfDoc) {
    pdfDoc.titleFontSize = 12;
    pdfDoc.textFontSize = 12;

    let startY = hookData.cursor.y + 15;

    const splitTitle = pdfDoc.doc.splitTextToSize(this.workOrder.comments, 180);

    startY = this.breakPageAndSetStartY(((splitTitle.length - 1) * 6) + hookData.cursor.y + 30, pdfDoc, startY);

    const endY = startY + 5;

    pdfDoc.addLabelAndValue({
      startX: 10,
      startY: startY,
      endX: 10,
      endY: endY,
      label: 'Observações:',
      value: splitTitle
    });

    pdfDoc.addLabelAndValue({
      startX: 140,
      startY: ((splitTitle.length - 1) * 6) + endY + 10,
      endX: 155,
      endY: ((splitTitle.length - 1) * 6) + endY + 10,
      label: 'Total:',
      value: this.currencyPipe.transform(this.totalValue.toString(), 'BRL')
    });
  }
}
