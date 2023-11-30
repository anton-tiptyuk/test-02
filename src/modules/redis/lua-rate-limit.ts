export const luaRateLimit = `
local keyName = KEYS[1]
local rangeSeconds = tonumber(ARGV[1])
local maxRequests = tonumber(ARGV[2])
local weight = tonumber(ARGV[3])

local time = redis.call('TIME')
local threshold = tonumber(time[1]) - rangeSeconds
redis.call('ZREMRANGEBYSCORE', keyName, 0, threshold)
local requestCount = redis.call('ZCARD', keyName)

if requestCount + weight <= maxRequests then
    local i = weight
    while i > 0 do
      i = i - 1
      redis.call('ZADD', keyName, time[1], time[1] .. time[2] .. i)
    end
    redis.call('EXPIRE', keyName, rangeSeconds)
    return { 1, 0 }
end

local awaitedIndex = weight - maxRequests + requestCount - 1

-- i thought of caching this but it does not seem to make sense
local oldestEntry = redis.call('ZRANGE', keyName, awaitedIndex, awaitedIndex, 'WITHSCORES')

return { 0, oldestEntry[2] + rangeSeconds + 1 }
`;
