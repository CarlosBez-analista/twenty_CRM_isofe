import { Injectable, Logger } from '@nestjs/common';
import { FocusNfeHttpService } from '../services/focus-nfe-http.service';

@Injectable()
export class EmissorFiscalWorkflowAction {
  private readonly logger = new Logger(EmissorFiscalWorkflowAction.name);

  constructor(private readonly focusNfeService: FocusNfeHttpService) {}

  async execute(context: any): Promise<void> {
    this.logger.log(`Iniciando Action de Emissão Fiscal com contexto: ${JSON.stringify(context)}`);
    
    const pedido = context.pedido;
    if (!pedido) {
      throw new Error('Contexto do workflow não contém dados do Pedido');
    }

    const payloadFiscal = {
      ref: pedido.codigo,
      natureza_operacao: 'Venda de mercadoria',
      data_emissao: pedido.dataEmissao || new Date().toISOString(),
      cnpj_emitente: '12345678000199', // MOCK
      valor_bruto: pedido.valorTotal
    };

    await this.focusNfeService.emitirNfe(payloadFiscal);
    this.logger.log('Action de Emissão Fiscal concluída');
  }
}
