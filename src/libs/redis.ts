import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: 'https://apn1-relative-clam-34464.upstash.io',
  token: process.env.REDIS_KEY!,
})

// const data = await redis.set('foo', 'bar');