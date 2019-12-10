import IPdfConfig from '../interfaces/pdfConfig.interface';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

export default class Pdf {
  doc: any;
  public titleFontSize: number;
  public textFontSize: number;

  constructor() {
    this.doc = new jsPDF();
    this.doc.setLineWidth(0.1);
    this.doc.setDrawColor(0, 0, 0);

    this.titleFontSize = 14;
    this.textFontSize = 12;
  }

  public addLabelAndValue(config: IPdfConfig) {
    this.doc.setFontSize(this.titleFontSize);
    this.doc.setFontType('bold');
    this.doc.text(config.startX, config.startY, config.label);

    this.doc.setFontSize(this.textFontSize);
    this.doc.setFontType('normal');
    this.doc.text(config.endX, config.endY, config.value);
  }

  public addDot(config: IPdfConfig, lineDash: number = 2.5) {
    this.doc.setLineDash([lineDash]);
    this.doc.line(config.startX, config.startY, config.endX, config.endY);
  }
}
