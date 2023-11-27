## First impressions.

- never wrote custom middleware for Nest. Really tempted to do it as guards but that would be only 401 responses (maybe with custom text). If that does not work would have to do just middleware or something. well 429 response code looks like a deal breaker, have to check.

- never used Mongo with Nest. Will check it.

- will think of a way to test it all somehow

- it seems I can not have just some counter for "every 10 minutes" or something like that because of that precision required. Maybe I would split it into something like "time series" aggregating requests for an IP/token within, say 10 minutes (storing both every request with timestamp and a cumulative counter)

- gonna start with Mongo and maybe will try to add Redis afterwards, never tried working with it directly
