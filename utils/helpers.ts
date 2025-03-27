import redis from "@/lib/redis";

export const addSubscribersToQueue = async (subscribers: any[], articleData: any) => {
    const queueKey = `subscribersQueue`;
    const subscriberData = subscribers.map((s) => JSON.stringify({ ...s, articleData }));
    
    if (subscriberData.length > 0) {
        await redis.rPush(queueKey, subscriberData as [string, ...string[]]);
    }
    console.log(`✅ Added ${subscribers.length} subscribers to Redis queue.`);
};


