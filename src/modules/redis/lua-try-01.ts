// local current_time = redis.call('TIME')
// local trim_time = tonumber(current_time[1]) - @window
// redis.call('ZREMRANGEBYSCORE', @key, 0, trim_time)
// local request_count = redis.call('ZCARD',@key)

// if request_count < tonumber(@max_requests) then
//     redis.call('ZADD', @key, current_time[1], current_time[1] .. current_time[2])
//     redis.call('EXPIRE', @key, @window)
//     return 0
// end
// return 1

export const luaTry01 = `
local time = redis.call('TIME');

redis.call('ZADD', 'pupidu', time[1], time[1] .. time[2] .. 'pel')
redis.call('ZADD', 'pupidu', time[1], time[1] .. time[2] .. 'du')
redis.call('ZADD', 'pupidu', time[1], time[1] .. time[2] .. 'ko')
`;
