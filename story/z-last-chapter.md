## First impressions.

- never wrote custom middleware for Nest. Really tempted to do it as guards but that would be only 401 responses (maybe with custom text). If that does not work would have to do just middleware or something. well 429 response code looks like a deal breaker, have to check.

- never used Mongo with Nest. Will check it.

- will think of a way to test it all somehow

- it seems I can not have just some counter for "every 10 minutes" or something like that because of that precision required. Maybe I would split it into something like "time series" aggregating requests for an IP/token within, say 10 minutes (storing both every request with timestamp and a cumulative counter)

- gonna start with Mongo and maybe will try to add Redis afterwards, never tried working with it directly

## Where are we so far.

- boilerplated the solution. Never used Mongo and Mongoose with Nest before. @nestjs/mongoose was not the approach I've tried from the very beginning.
- introduced some seeding to put the predefined tokens into the database
- implemented poor man's authorization guard
- now implemented some RateLimitGuard with mock methods to check the number of requests in the AccessControlService. And now I realize that I am confused about what should happen first: should we validate the token first (in fact implement authorization first) or check the RateLimit first? In fact the task sounds somewhat ambiguous in that sense. Have asked Maarian for a clarification.
- Got clarification, great, moving on.

Yesterday I've spent quite a while trying to find some mongo operation capable of atomically upserting a document/pushing an embedded array element (say, for current minute) or increasing the existing one and on top of that selecting the aggregated count for the timerange we need. I do not feel like going for transaction (which would still be questionable in case of race scenario).

Decided to check what Redis has to offer. First thing that got me enthusiastic is the atomic transactions which are guaranteed not to interfere with other transactions. Then I pretty soon faced that fact that there's a whole lot of tutorials about rate limiting with Redis starting with the examples in the documentation.
Still I've spent some time trying to come up with some way of introducing few cumulative counters (like a counter per minute) and increasing those, but eventually decided to go for that traditional sliding window solution.

The difference:
- I'm going to introduce endpoint weights which means I would be creating several set elements for a single timestamp
- Need to return the proper timestamp for the next request attempt

Also, found out that the thing I'm going to do is not that elementary in terms of Redis and thus had to find out how to approach creating that Lua "stored procedures".

Eventually bootstrapped ioredis within the project and wrote some ProofOfConcept lua routine to deal with that rate limiting.

Now it seems to me that I do not need that Mongo any more and in fact I plan to get rid of it moving the tokens to be stored within the Redis as well.
