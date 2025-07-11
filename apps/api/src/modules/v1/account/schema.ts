import { Schema } from 'effect';
import { HttpApiGroup } from '@effect/platform';
import { HttpApiEndpoint } from '@effect/platform';
import { Authorization } from '@/middleware/auth';
import { Session, User } from '@/schema/models';

export const AccountGroup = HttpApiGroup.make('account')
  .add(
    HttpApiEndpoint.get('get-account', '/').addSuccess(
      Schema.Struct({
        session: Session.Model,
        user: User.Model,
      })
    )
  )
  .middleware(Authorization)
  .prefix('/account');
