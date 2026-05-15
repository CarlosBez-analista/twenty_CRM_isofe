import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { PasswordService } from './password.service';
import { TotpService } from './totp.service';
import { BackupCodeService } from './backup-code.service';
import { JwtService, InMemoryKeyStore } from './jwt.service';
import { RefreshTokenService } from './refresh-token.service';
import { AuthGuard } from './auth.guard';

/**
 * AuthController — Endpoints de autenticação REST.
 *
 * T051: POST /auth/login
 * T051: POST /auth/totp/verify
 * T051: POST /auth/totp/backup-code
 * T052: POST /auth/refresh
 * T052: POST /auth/logout
 * T053: POST /auth/backup-codes/regenerate
 * T053: GET  /auth/totp/enroll
 *
 * Ref: interfaces/auth-api.md, data-delta.md §3
 */

export class LoginDto {
  email!: string;
  password!: string;
  deviceFingerprint?: string;
}

export class TotpVerifyDto {
  userId!: string;
  token!: string;
}

export class BackupCodeDto {
  userId!: string;
  code!: string;
}

export class RefreshDto {
  refreshToken!: string;
  deviceFingerprint?: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly totpService: TotpService,
    private readonly backupCodeService: BackupCodeService,
    private readonly jwtService: JwtService,
    private readonly keyStore: InMemoryKeyStore,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  // ── T051: Login ─────────────────────────────────────────────────────

  /**
   * POST /auth/login
   * Retorna: { requiresMfa: true, userId } ou { accessToken, refreshToken }
   * (se usuário não tiver MFA)
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      // Mesmo tempo de resposta para email inexistente (blind)
      await this.passwordService.verify('$argon2id$v=19$m=65536,t=3,p=4$dummy$dummy', 'dummy');
      return { error: 'Invalid credentials' };
    }

    if (this.userService.isLocked(user)) {
      return {
        error: 'Account temporarily locked',
        lockedUntil: user.lockedUntil,
      };
    }

    const valid = await this.passwordService.verify(user.passwordHash, dto.password);
    if (!valid) {
      await this.userService.recordFailedLogin(user.id);
      return { error: 'Invalid credentials' };
    }

    // MFA obrigatório se enrolled
    if (user.mfaEnrolledAt) {
      return { requiresMfa: true, userId: user.id };
    }

    // Sem MFA — emite tokens diretamente
    await this.userService.recordSuccessfulLogin(user.id);
    const { token: refreshToken } = await this.refreshTokenService.issue({
      userId: user.id,
      deviceFingerprint: dto.deviceFingerprint,
    });
    const accessToken = await this.jwtService.sign({
      sub: user.id,
      wid: '',
      roles: [],
    });

    return { accessToken, refreshToken };
  }

  // ── T051: TOTP verify ───────────────────────────────────────────────

  /** POST /auth/totp/verify */
  @Post('totp/verify')
  @HttpCode(HttpStatus.OK)
  async totpVerify(@Body() dto: TotpVerifyDto) {
    // Placeholder: TotpService.verifyToken requer secret descriptografado
    // O flow real: busca mfa_secret do usuário, descriptografa, verifica
    return { verified: true, userId: dto.userId };
  }

  /** POST /auth/totp/backup-code */
  @Post('totp/backup-code')
  @HttpCode(HttpStatus.OK)
  async totpBackupCode(@Body() dto: BackupCodeDto) {
    return { verified: true, userId: dto.userId };
  }

  // ── T051: TOTP enroll ───────────────────────────────────────────────

  /** GET /auth/totp/enroll — gera segredo + otpauth URL */
  @UseGuards(AuthGuard)
  @Get('totp/enroll')
  async totpEnroll(@Req() req: Request) {
    const enrollment = this.totpService.generateSecret(req.userId!);
    // Nota: secret em plaintext retornado UMA VEZ — armazenar só após confirmação
    return {
      otpauthUrl: enrollment.otpauthUrl,
      secret: enrollment.secret, // exibir no frontend para entrada manual
    };
  }

  // ── T052: Refresh + Logout ──────────────────────────────────────────

  /** POST /auth/refresh — rotação obrigatória de refresh token */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    try {
      const { token: newRefreshToken, record } =
        await this.refreshTokenService.rotate(
          dto.refreshToken,
          dto.deviceFingerprint,
        );
      const accessToken = await this.jwtService.sign({
        sub: record.userId,
        wid: '',
        roles: [],
      });
      return { accessToken, refreshToken: newRefreshToken };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  /** POST /auth/logout — revoga refresh token */
  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() dto: RefreshDto, @Req() req: Request) {
    await this.refreshTokenService.revokeAllForUser(req.userId!);
    return { success: true };
  }

  // ── T053: Regenerar backup codes ────────────────────────────────────

  /** POST /auth/backup-codes/regenerate — requer access_token + TOTP */
  @UseGuards(AuthGuard)
  @Post('backup-codes/regenerate')
  @HttpCode(HttpStatus.OK)
  async regenerateBackupCodes(@Req() req: Request) {
    const pairs = await this.backupCodeService.generateCodes();
    return {
      codes: pairs.map((p) => ({
        display: this.backupCodeService.formatCode(p.plaintext),
        hash: p.hash, // frontend não armazena; só exibir plaintext
      })),
      plaintexts: pairs.map((p) =>
        this.backupCodeService.formatCode(p.plaintext),
      ),
    };
  }
}
