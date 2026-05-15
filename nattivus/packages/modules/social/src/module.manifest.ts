import { ModuleManifest } from '@nattivus/sdk';

export const SocialModuleManifest: ModuleManifest = {
  id: 'social',
  name: 'ERP/CRM Social',
  description: 'Módulo de funcionalidades para institutos sociais e filantrópicos',
  version: '1.0.0',
  dependencies: ['person', 'company'],
  entities: [
    'Family',
    'Program',
    'ServiceCatalog',
    'ProductCatalogSocial',
    'InventoryItemSocial',
    'StockMovementSocial',
    'DonationRecord',
    'ServiceScheduling',
    'AttendanceRecord',
    'CaseRecord',
    'DocumentChecklist',
    'VolunteerProfile',
    'ImpactIndicator'
  ]
};
