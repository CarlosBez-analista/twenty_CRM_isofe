import { Module } from '@nestjs/common';
import { PedidoWorkspaceEntity } from './entities/pedido.workspace-entity';
import { FocusNfeHttpService } from './services/focus-nfe-http.service';
import { EmissorFiscalWorkflowAction } from './actions/emissor-fiscal.workflow-action';

@Module({
  imports: [],
  providers: [
    PedidoWorkspaceEntity,
    FocusNfeHttpService,
    EmissorFiscalWorkflowAction
  ],
  exports: [
    PedidoWorkspaceEntity,
    EmissorFiscalWorkflowAction
  ],
})
export class ErpModule {}
