import { createManifest } from '@nattivus/sdk';

export const helloWorldManifest = createManifest({
  id: 'hello-world',
  name: 'Hello World',
  version: '0.0.0',
  sdkVersion: '^0.0.0',
  entities: [],
  routes: [
    {
      method: 'GET',
      path: '/api/hello',
    },
  ],
  permissions: ['hello-world.read'],
});
