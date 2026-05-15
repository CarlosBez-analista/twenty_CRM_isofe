import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './opportunity.entity';
import { OpportunityService } from './opportunity.service';
import { OpportunityController } from './opportunity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity])],
  controllers: [OpportunityController],
  providers: [OpportunityService],
  exports: [OpportunityService],
})
export class OpportunityModule {}
