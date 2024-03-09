import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://apn1-huge-eagle-34913.upstash.io',
  token: process.env.REDIS_KEY!,
})

// const data = await redis.set('foo', 'bar');