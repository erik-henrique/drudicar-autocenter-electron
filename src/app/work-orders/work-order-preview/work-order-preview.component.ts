import { Component, OnInit } from '@angular/core';
import Pdf from 'src/shared/entities/pdf.entity';

@Component({
  selector: 'app-work-order-preview',
  templateUrl: './work-order-preview.component.html',
  styleUrls: ['./work-order-preview.component.scss']
})
export class WorkOrderPreviewComponent implements OnInit {
  servicos = [
    {
      nome: 'Troca de óleo',
      preco: 20,
    },
    {
      nome: 'Troca de motor',
      preco: 200,
    },
    {
      nome: 'Troca de pneu',
      preco: 40,
    }
  ];

  produtos = [
    {
      nome: 'Yamalube',
      preco: 20,
    },
    {
      nome: 'Porca aleatória',
      preco: 3,
    }
  ];
  constructor() { }

  ngOnInit() {
    const canvas = document.getElementById('canvasLogo') as any;
    const context = canvas.getContext('2d');

    const myImg = new Image();
    myImg.src = 'assets/images/drudicar_logo.png';
    myImg.onload = function () {
      context.drawImage(myImg, 15, 5, 150, 140);
    };

    setTimeout(() => {
      const pdfDoc = new Pdf();

      pdfDoc.doc.addImage(canvas.toDataURL(), 'PNG', 90, 15, 150, 140);

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

      pdfDoc.doc.rect(10, 80, 190, 20);

      pdfDoc.doc.text(15, 87, 'FZC-6504');
      pdfDoc.doc.line(100, 80, 100, 100);

      pdfDoc.doc.text(105, 87, 'BRANCA');
      pdfDoc.doc.line(10, 80, 200, 80);

      pdfDoc.doc.text(15, 97, 'FAZER SED 150 UBS');
      pdfDoc.doc.line(10, 90, 200, 90);

      pdfDoc.doc.text(105, 97, 'YAMAHA');

      pdfDoc.doc.save('asdsada.pdf');
    }, 2000);
  }
}
