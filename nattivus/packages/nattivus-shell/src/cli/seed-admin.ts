#!/usr/bin/env node
/**
 * seed-admin CLI — Cria usuário admin + workspace inicial.
 *
 * Uso:
 *   yarn ts-node src/cli/seed-admin.ts \
 *     --email admin@example.com \
 *     --password "S3cret!" \
 *     --workspace-name "Minha Empresa" \
 *     --workspace-slug "minha-empresa"
 *
 * Ref: T060
 */

import { Client } from 'pg';
import { PasswordService } from '../auth/password.service';
import { UserService } from '../auth/user.service';
import { WorkspaceService, WorkspaceMemberService } from '../workspace/workspace.service';

interface SeedArgs {
  email: string;
  password: string;
  workspaceName: string;
  workspaceSlug: string;
}

function parseArgs(): SeedArgs {
  const args = process.argv.slice(2);
  const get = (flag: string): string => {
    const idx = args.indexOf(flag);
    if (idx === -1 || !args[idx + 1]) throw new Error(`Missing arg: ${flag}`);
    return args[idx + 1];
  };

  return {
    email: get('--email'),
    password: get('--password'),
    workspaceName: get('--workspace-name'),
    workspaceSlug: get('--workspace-slug'),
  };
}

async function main() {
  const args = parseArgs();

  const dbUrl = process.env['DATABASE_URL'];
  if (!dbUrl) throw new Error('DATABASE_URL is required');

  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  try {
    const passwordService = new PasswordService();
    const userService = new UserService(client);
    const workspaceService = new WorkspaceService(client);
    const memberService = new WorkspaceMemberService(client);

    // Verificar se usuário já existe
    const existing = await userService.findByEmail(args.email);
    if (existing) {
      console.log(`⚠ User already exists: ${args.email} (id: ${existing.id})`);
      return;
    }

    // Criar usuário
    const passwordHash = await passwordService.hash(args.password);
    const user = await userService.create({ email: args.email, passwordHash });
    await userService.activate(user.id);
    console.log(`✓ User created: ${user.email} (${user.id})`);

    // Criar workspace
    const workspace = await workspaceService.create({
      slug: args.workspaceSlug,
      displayName: args.workspaceName,
      profile: 'enterprise',
    });
    console.log(`✓ Workspace created: ${workspace.displayName} (${workspace.id})`);

    // Adicionar usuário como admin do workspace
    const member = await memberService.invite({
      workspaceId: workspace.id,
      userId: user.id,
      roles: ['admin'],
    });
    await memberService.accept(workspace.id, user.id);
    console.log(`✓ Admin member created (${member.id})`);

    console.log('\n✅ Seed complete!');
    console.log(`   Email:     ${args.email}`);
    console.log(`   Workspace: ${workspace.slug} (${workspace.id})`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
