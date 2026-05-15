import { Injectable, CanActivate } from '@nestjs/common';
@Injectable() export class SocialRbacGuard implements CanActivate { canActivate() { return true; } }
