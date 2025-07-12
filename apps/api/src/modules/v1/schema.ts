import { HttpApi } from '@effect/platform';
import { OpenApi } from '@effect/platform';
import { AccountGroup } from './account/schema';
import { OpenApiGroup } from './openapi/schema';

export const RepoApi = HttpApi.make('v1')
  .annotate(OpenApi.Title, 'Repo API')
  .annotate(OpenApi.Version, '1.0.0')
  .annotate(OpenApi.Transform, (spec) => ({
    ...spec,
    components: {
      ...spec.components,
      securitySchemes: {
        bearer: {
          type: 'http',
          scheme: 'bearer',
          description: 'Bearer authentication',
        },
      },
    },
    security: [
      {
        bearer: [],
      },
    ],
  }))
  .annotate(OpenApi.Servers, [
    {
      url: 'https://api.repo.com',
      description: 'Production server',
    },
    {
      url: 'http://localhost:8787',
      description: 'Development server',
    },
  ])
  .add(OpenApiGroup)
  .add(AccountGroup)
  .prefix('/v1');
