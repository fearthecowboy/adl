import { schema } from '../aliases/schema';
export interface Service {
    /**
     * Returns the open api spec document.
     * @description Full open api spec in JSON format. (See https://github.com/OAI/OpenAPI-Specification/blob/master/README.md)
     * @http GET /labs/2/openapi.json
     * @tag General
     * @since 2.3
     */
    getOpenApiSpec();
    /**
     * Returns hydrated Tweet objects
     * @description Returns a variety of information about the Tweet specified by the requested ID
     * @http GET /labs/2/tweets
     * @tag Tweets
     * @since 2.3
     */
    findTweetsById(ids: Http.Query<Array<string & RegularExpression<"^[0-9]{1,19}$">> & MaximumElements<100> & MinimumElements<1>>, expansions?: Http.Query<Array<"author_id" | "referenced_tweets.id" | "in_reply_to_user_id" | "geo.place_id" | "attachments.media_keys" | "attachments.poll_ids" | "entities.mentions.username" | "referenced_tweets.id.author_id"> & MinimumElements<1> & UniqueElements>, tweet_fields?: Http.Query<Array<"id" | "created_at" | "text" | "author_id" | "in_reply_to_user_id" | "referenced_tweets" | "attachments" | "withheld" | "geo" | "entities" | "public_metrics" | "possibly_sensitive" | "source" | "lang" | "context_annotations"> & MinimumElements<1> & UniqueElements, 'tweet.fields'>, user_fields?: Http.Query<Array<"id" | "created_at" | "name" | "username" | "protected" | "verified" | "withheld" | "profile_image_url" | "location" | "url" | "description" | "entities" | "pinned_tweet_id" | "public_metrics"> & MinimumElements<1> & UniqueElements, 'user.fields'>, media_fields?: Http.Query<Array<"media_key" | "duration_ms" | "height" | "preview_image_url" | "type" | "url" | "width"> & MinimumElements<1> & UniqueElements, 'media.fields'>, place_fields?: Http.Query<Array<"id" | "name" | "country_code" | "place_type" | "full_name" | "country" | "contained_within" | "geo"> & MinimumElements<1> & UniqueElements, 'place.fields'>, poll_fields?: Http.Query<Array<"id" | "options" | "voting_status" | "end_datetime" | "duration_minutes"> & MinimumElements<1> & UniqueElements, 'poll.fields'>);
    /**
     * Returns Tweets from the last 7 days that match a search query.
     * @description Returns Tweets from the last 7 days that match a search query.
     * @http GET /labs/2/tweets/search
     * @tag Search
     * @tag Tweets
     * @since 2.3
     */
    tweetsRecentSearch(query: Http.Query<string & MaxLength<512> & MinLength<1>>, start_time?: Http.Query<dateTime>, end_time?: Http.Query<dateTime>, since_id?: Http.Query<schema>, until_id?: Http.Query<schema>, max_results?: Http.Query<int32 & Minimum<10> & Maximum<100>>, next_token?: Http.Query<string>, expansions?: Http.Query<Array<"author_id" | "referenced_tweets.id" | "in_reply_to_user_id" | "geo.place_id" | "attachments.media_keys" | "attachments.poll_ids" | "entities.mentions.username" | "referenced_tweets.id.author_id"> & MinimumElements<1> & UniqueElements>, tweet_fields?: Http.Query<Array<"id" | "created_at" | "text" | "author_id" | "in_reply_to_user_id" | "referenced_tweets" | "attachments" | "withheld" | "geo" | "entities" | "public_metrics" | "possibly_sensitive" | "source" | "lang" | "context_annotations"> & MinimumElements<1> & UniqueElements, 'tweet.fields'>, user_fields?: Http.Query<Array<"id" | "created_at" | "name" | "username" | "protected" | "verified" | "withheld" | "profile_image_url" | "location" | "url" | "description" | "entities" | "pinned_tweet_id" | "public_metrics"> & MinimumElements<1> & UniqueElements, 'user.fields'>, media_fields?: Http.Query<Array<"media_key" | "duration_ms" | "height" | "preview_image_url" | "type" | "url" | "width"> & MinimumElements<1> & UniqueElements, 'media.fields'>, place_fields?: Http.Query<Array<"id" | "name" | "country_code" | "place_type" | "full_name" | "country" | "contained_within" | "geo"> & MinimumElements<1> & UniqueElements, 'place.fields'>, poll_fields?: Http.Query<Array<"id" | "options" | "voting_status" | "end_datetime" | "duration_minutes"> & MinimumElements<1> & UniqueElements, 'poll.fields'>);
    /**
     * Returns hydrated Tweet objects
     * @description Returns a variety of information about the Tweet specified by the requested ID
     * @http GET /labs/2/tweets/{id}
     * @tag Tweets
     * @since 2.3
     */
    findTweetById(id: Http.Path<schema>, expansions?: Http.Query<Array<"author_id" | "referenced_tweets.id" | "in_reply_to_user_id" | "geo.place_id" | "attachments.media_keys" | "attachments.poll_ids" | "entities.mentions.username" | "referenced_tweets.id.author_id"> & MinimumElements<1> & UniqueElements>, tweet_fields?: Http.Query<Array<"id" | "created_at" | "text" | "author_id" | "in_reply_to_user_id" | "referenced_tweets" | "attachments" | "withheld" | "geo" | "entities" | "public_metrics" | "possibly_sensitive" | "source" | "lang" | "context_annotations"> & MinimumElements<1> & UniqueElements, 'tweet.fields'>, user_fields?: Http.Query<Array<"id" | "created_at" | "name" | "username" | "protected" | "verified" | "withheld" | "profile_image_url" | "location" | "url" | "description" | "entities" | "pinned_tweet_id" | "public_metrics"> & MinimumElements<1> & UniqueElements, 'user.fields'>, media_fields?: Http.Query<Array<"media_key" | "duration_ms" | "height" | "preview_image_url" | "type" | "url" | "width"> & MinimumElements<1> & UniqueElements, 'media.fields'>, place_fields?: Http.Query<Array<"id" | "name" | "country_code" | "place_type" | "full_name" | "country" | "contained_within" | "geo"> & MinimumElements<1> & UniqueElements, 'place.fields'>, poll_fields?: Http.Query<Array<"id" | "options" | "voting_status" | "end_datetime" | "duration_minutes"> & MinimumElements<1> & UniqueElements, 'poll.fields'>);
    /**
     * Hides a reply to an owned conversation.
     * @description Tweet ID in the path is that of the reply to hide.
     * @http PUT /labs/2/tweets/{id}/hidden
     * @tag Tweets
     * @since 2.3
     */
    hideReplyById(id: Http.Path<schema>);
    /**
     * Return details for the specified users
     * @description This endpoint returns information about users. Specify users by their ID.
     * @http GET /labs/2/users
     * @tag Users
     * @since 2.3
     */
    findUsersById(ids: Http.Query<Array<string & RegularExpression<"^[0-9]{1,19}$">> & MaximumElements<100> & MinimumElements<1>>, expansions?: Http.Query<Array<"pinned_tweet_id"> & MinimumElements<1> & UniqueElements>, tweet_fields?: Http.Query<Array<"id" | "created_at" | "text" | "author_id" | "in_reply_to_user_id" | "referenced_tweets" | "attachments" | "withheld" | "geo" | "entities" | "public_metrics" | "possibly_sensitive" | "source" | "lang" | "context_annotations"> & MinimumElements<1> & UniqueElements, 'tweet.fields'>, user_fields?: Http.Query<Array<"id" | "created_at" | "name" | "username" | "protected" | "verified" | "withheld" | "profile_image_url" | "location" | "url" | "description" | "entities" | "pinned_tweet_id" | "public_metrics"> & MinimumElements<1> & UniqueElements, 'user.fields'>, media_fields?: Http.Query<Array<"media_key" | "duration_ms" | "height" | "preview_image_url" | "type" | "url" | "width"> & MinimumElements<1> & UniqueElements, 'media.fields'>, place_fields?: Http.Query<Array<"id" | "name" | "country_code" | "place_type" | "full_name" | "country" | "contained_within" | "geo"> & MinimumElements<1> & UniqueElements, 'place.fields'>, poll_fields?: Http.Query<Array<"id" | "options" | "voting_status" | "end_datetime" | "duration_minutes"> & MinimumElements<1> & UniqueElements, 'poll.fields'>);
    /**
     * Return details for the specified users
     * @description This endpoint returns information about users. Specify users by their username.
     * @http GET /labs/2/users/by
     * @tag Users
     * @since 2.3
     */
    findUsersByUsername(usernames: Http.Query<Array<string & RegularExpression<"^[A-Za-z0-9_]{1,15}$">> & MaximumElements<100> & MinimumElements<1>>, expansions?: Http.Query<Array<"pinned_tweet_id"> & MinimumElements<1> & UniqueElements>, tweet_fields?: Http.Query<Array<"id" | "created_at" | "text" | "author_id" | "in_reply_to_user_id" | "referenced_tweets" | "attachments" | "withheld" | "geo" | "entities" | "public_metrics" | "possibly_sensitive" | "source" | "lang" | "context_annotations"> & MinimumElements<1> & UniqueElements, 'tweet.fields'>, user_fields?: Http.Query<Array<"id" | "created_at" | "name" | "username" | "protected" | "verified" | "withheld" | "profile_image_url" | "location" | "url" | "description" | "entities" | "pinned_tweet_id" | "public_metrics"> & MinimumElements<1> & UniqueElements, 'user.fields'>, media_fields?: Http.Query<Array<"media_key" | "duration_ms" | "height" | "preview_image_url" | "type" | "url" | "width"> & MinimumElements<1> & UniqueElements, 'media.fields'>, place_fields?: Http.Query<Array<"id" | "name" | "country_code" | "place_type" | "full_name" | "country" | "contained_within" | "geo"> & MinimumElements<1> & UniqueElements, 'place.fields'>, poll_fields?: Http.Query<Array<"id" | "options" | "voting_status" | "end_datetime" | "duration_minutes"> & MinimumElements<1> & UniqueElements, 'poll.fields'>);
    /**
     * Return details for the specified users
     * @description This endpoint returns information about a user. Specify user by username.
     * @http GET /labs/2/users/by/username/{username}
     * @tag Users
     * @since 2.3
     */
    findUserByUsername(username: Http.Path<schema>, expansions?: Http.Query<Array<"pinned_tweet_id"> & MinimumElements<1> & UniqueElements>, tweet_fields?: Http.Query<Array<"id" | "created_at" | "text" | "author_id" | "in_reply_to_user_id" | "referenced_tweets" | "attachments" | "withheld" | "geo" | "entities" | "public_metrics" | "possibly_sensitive" | "source" | "lang" | "context_annotations"> & MinimumElements<1> & UniqueElements, 'tweet.fields'>, user_fields?: Http.Query<Array<"id" | "created_at" | "name" | "username" | "protected" | "verified" | "withheld" | "profile_image_url" | "location" | "url" | "description" | "entities" | "pinned_tweet_id" | "public_metrics"> & MinimumElements<1> & UniqueElements, 'user.fields'>, media_fields?: Http.Query<Array<"media_key" | "duration_ms" | "height" | "preview_image_url" | "type" | "url" | "width"> & MinimumElements<1> & UniqueElements, 'media.fields'>, place_fields?: Http.Query<Array<"id" | "name" | "country_code" | "place_type" | "full_name" | "country" | "contained_within" | "geo"> & MinimumElements<1> & UniqueElements, 'place.fields'>, poll_fields?: Http.Query<Array<"id" | "options" | "voting_status" | "end_datetime" | "duration_minutes"> & MinimumElements<1> & UniqueElements, 'poll.fields'>);
    /**
     * Return details for the specified users
     * @description This endpoint returns information about a user. Specify user by ID.
     * @http GET /labs/2/users/{id}
     * @tag Users
     * @since 2.3
     */
    findUserById(id: Http.Path<schema>, expansions?: Http.Query<Array<"pinned_tweet_id"> & MinimumElements<1> & UniqueElements>, tweet_fields?: Http.Query<Array<"id" | "created_at" | "text" | "author_id" | "in_reply_to_user_id" | "referenced_tweets" | "attachments" | "withheld" | "geo" | "entities" | "public_metrics" | "possibly_sensitive" | "source" | "lang" | "context_annotations"> & MinimumElements<1> & UniqueElements, 'tweet.fields'>, user_fields?: Http.Query<Array<"id" | "created_at" | "name" | "username" | "protected" | "verified" | "withheld" | "profile_image_url" | "location" | "url" | "description" | "entities" | "pinned_tweet_id" | "public_metrics"> & MinimumElements<1> & UniqueElements, 'user.fields'>, media_fields?: Http.Query<Array<"media_key" | "duration_ms" | "height" | "preview_image_url" | "type" | "url" | "width"> & MinimumElements<1> & UniqueElements, 'media.fields'>, place_fields?: Http.Query<Array<"id" | "name" | "country_code" | "place_type" | "full_name" | "country" | "contained_within" | "geo"> & MinimumElements<1> & UniqueElements, 'place.fields'>, poll_fields?: Http.Query<Array<"id" | "options" | "voting_status" | "end_datetime" | "duration_minutes"> & MinimumElements<1> & UniqueElements, 'poll.fields'>);
}
