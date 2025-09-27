import { HttpApiEndpoint, HttpApiGroup } from '@effect/platform';
import { Schema } from 'effect';
import { Authorization } from '@/middleware/auth';
import { Session, User } from '@/schema/auth';

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
