export const luaTry02 = `
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
    return { 0, 0 }
end

-- i thought of caching this but it does not seem to make sense
local oldestEntry = redis.call('ZRANGE', keyName, weight-1, weight-1, 'WITHSCORES')

return { 1, oldestEntry[2] + rangeSeconds + 1 }
`;