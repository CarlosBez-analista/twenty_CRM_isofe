import { Injectable, NestMiddleware } from '@nestjs/common';
@Injectable() export class MinorsProtectionMiddleware implements NestMiddleware { use() {} }
