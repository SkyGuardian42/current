import { postsRouter } from './posts/posts.js'
import { authRouter } from './auth/auth.js'
import { usersRouter } from './users/users.js'
import { imagesRouter } from './images/images.js'
import { followersRouter } from './followers/followers.js'


export default {
  posts: postsRouter,
  auth: authRouter,
  users: usersRouter,
  images: imagesRouter,
  followers: followersRouter
}