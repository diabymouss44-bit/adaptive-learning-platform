import Redis from "redis";

const globalForRedis = global as unknown as { redis: ReturnType<typeof Redis.createClient> };

const redisClient = globalForRedis.redis || Redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  password: process.env.REDIS_PASSWORD,
  socket: {
    reconnectStrategy: (retries: number) => Math.min(retries * 50, 500),
  },
});

if (!redisClient.isOpen) {
  redisClient.connect().catch(console.error);
}

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redisClient;
}

// Gestion des erreurs
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client Connected"));

export default redisClient;
