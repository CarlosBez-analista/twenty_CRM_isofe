import { Module } from '@nestjs/common';
import { CompanyModule } from '../../modules/company/src/company.module';
import { PersonModule } from '../../modules/person/src/person.module';
import { OpportunityModule } from '../../modules/opportunity/src/opportunity.module';

@Module({
  imports: [
    CompanyModule,
    PersonModule,
    OpportunityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
