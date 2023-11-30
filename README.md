## Setup

First thing you would need to install the packages with dependendencies. Make sure your node version matches one in `.nvmrc` and run `yarn` please.

Next, set up the runtime parameters. The sample with default values is in [`.sample.env`](./.sample.env).
You can clone it into `.env` and adjust your settings. Or you can go on with default values if your Redis allows connection for `redis://localhost:6379` URL.

To run the web server execute `yarn start` from shell.
There is a swagger interface at http://localhost:3000/api (if you've changed the port in the settings, please adjust this URL accordingly)

## Seeding tokens

Eventually I've decided to store the tokens in the Redis set. To seed those please use the `POST /access-control/seed` endpoint. I've used some random sha1 values and for that reason demanded token to be a string of 40 non-space characters, that's the only condition. You can fix this rule [here](./src/modules/access-control/dto/index.ts).

Also, this endpoint cleans up all the sets storing request counters.

## Authorization

I've implemented an elementary [AuthGuard](./src/domain/guards/auth-guard.ts) which expects Bearer token authorization header. So private endpoints would be available only in case there's a valid token specified in a header of request.

## Rate Limiting
Here's the rate limiting [guard](./src/domain/guards/rate-limit-guard.ts). First of all, it expects the AuthGuard to set `request.token` for private routes, that is why an order of guards in `@UseGuards()` decorator matters.

## Sample endpoints and endpoint weight

I've introduced a separate module which is supposed to use the authorization and rate limiting services provided by access control module. There is a couple of sample controllers which are rate limited: the [first](./src/modules/business/first.controller.ts) and the [second](./src/modules/business/second.controller.ts). The first is private and the second is public. You can see the `RateLimitWeight` decorator there, which makes it possible to specify a custom weight for an endpoint (1 is the default).

## Some disclaimers

### no microsecond collision
I am using a concatenation of integer timestamp in seconds and microseconds in fractional part of current second to identify a request within an ordered set in Redis (in fact it is even concatenated with an integer counter in the end to allow custom weights). But the point is that in theory the collision of requests taking part in the same microsecond is possible. I thought of introducing another value which would just hold a counter for a current second to concatenate that one as well, but I still think this paranoic precision is an overkill. In fact I do not even know if it is possible that two lua scripts would get executed in Redis within the same microsecond.

### `keys` not `scan`
I do acknowledge that if this was something massive I should use `scan` to erase the keys of application instead of `keys` in the [`cleanup()`](./src/modules/redis/redis.service.ts) method. However since all this seeding thing is kinda optional for the task I've saved some effort.

### naive IP detection
Frankly speaking this is the second time when I have to care about the IP of the incoming request and I am not too sophisticated about that. I just googled few cases and came up with
```ts
const ip =
  (request.headers['x-forwarded-for'] || [])[0] ||
  request.socket.remoteAddress;
```
But I am not sure this is an ideal solution and as far as I understand in fact to be absolutely sure a thirdparty service should be used.


## Longread notes during progress (not important)

### First impressions.

- never wrote custom middleware in Nest which will be applied to a certain endpoint(s). And with a global middleware I have a question - like how would I arrange that with authorization? Really tempted to do it as guards but that would be only 401 responses (maybe with custom text). If that does not work would have to do just middleware or something. well 429 response code looks like a deal breaker, have to check. (Turned out that is not a problem, can be done throwing proper exceptions)

- never used Mongo with Nest. Will check it.

- will think of a way to test it all somehow

- it seems I can not have just some counter for "every 10 minutes" or something like that because of that precision required. Maybe I would split it into something like "time series" aggregating requests for an IP/token within, say 10 minutes (storing both every request with timestamp and a cumulative counter)

- gonna start with Mongo and maybe will try to add Redis afterwards, never tried working with it directly

### notes as we go

- boilerplated the solution. Using Mongoose with Nest is also something new. @nestjs/mongoose was not the approach I've tried from the very beginning.
- introduced some seeding to put the predefined tokens into the database
- implemented poor man's authorization guard
- now implemented some RateLimitGuard with mock methods to check the number of requests in the AccessControlService. And now I realize that I am confused about what should happen first: should we validate the token first (in fact implement authorization first) or check the RateLimit first? In fact the task sounds somewhat ambiguous in that sense. Have asked Maarian for a clarification.
- Got clarification, great, moving on.

Yesterday I've spent quite a while trying to find some mongo operation capable of atomically upserting a document/pushing an embedded array element (say, for current minute) or increasing the existing one and on top of that selecting the aggregated count for the timerange we need. I do not feel like going for transaction (which would still be questionable in case of race scenario).

Decided to check what Redis has to offer. First thing that got me enthusiastic is the atomic transactions which are guaranteed not to interfere with each other. Then I pretty soon faced that fact that there's the whole lot of tutorials about rate limiting with Redis starting with the examples in the documentation.
Still I've spent some time trying to come up with some way of introducing few cumulative counters (like a counter per minute) and increasing those, but eventually decided to go for that traditional sliding window solution.

The difference in my solution compared to the ones from tutorials:
- I'm going to introduce endpoint weights which means I would be creating several set elements for a single timestamp
- Need to return the proper timestamp for the next request attempt

Also, found out that the thing I'm going to do is not that elementary in terms of Redis and thus had to find out how to approach creating that Lua "stored procedures".

Eventually bootstrapped ioredis within the project and wrote some ProofOfConcept lua routine to deal with that rate limiting.

Now it seems to me that I do not need that Mongo any more and in fact I plan to get rid of it moving the tokens to be stored within the Redis as well.

Eventually got rid of Mongo and switched to using Redis only.
