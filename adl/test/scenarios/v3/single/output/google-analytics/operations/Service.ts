export interface Service {
    /**
     * @description Returns Analytics report data for a view (profile).
     * @http GET /data
     * @tag data
     * @since v2.4
     */
    'analytics.data.get'(alt?: Http.Query<"atom">, fields?: Http.Query<string>, key?: Http.Query<string>, oauth_token?: Http.Query<string>, prettyPrint?: Http.Query<boolean>, quotaUser?: Http.Query<string>, userIp?: Http.Query<string>, ids: Http.Query<string>, start_date: Http.Query<string, 'start-date'>, end_date: Http.Query<string, 'end-date'>, metrics: Http.Query<string>, dimensions?: Http.Query<string>, filters?: Http.Query<string>, max_results?: Http.Query<int64, 'max-results'>, segment?: Http.Query<string>, sort?: Http.Query<string>, start_index?: Http.Query<int64 & Minimum<1>, 'start-index'>);
    /**
     * @description Lists all accounts to which the user has access.
     * @http GET /management/accounts
     * @tag management
     * @since v2.4
     */
    'analytics.management.accounts.list'(alt?: Http.Query<"atom">, fields?: Http.Query<string>, key?: Http.Query<string>, oauth_token?: Http.Query<string>, prettyPrint?: Http.Query<boolean>, quotaUser?: Http.Query<string>, userIp?: Http.Query<string>, max_results?: Http.Query<int64, 'max-results'>, start_index?: Http.Query<int64 & Minimum<1>, 'start-index'>);
    /**
     * @description Lists web properties to which the user has access.
     * @http GET /management/accounts/{accountId}/webproperties
     * @tag management
     * @since v2.4
     */
    'analytics.management.webproperties.list'(alt?: Http.Query<"atom">, fields?: Http.Query<string>, key?: Http.Query<string>, oauth_token?: Http.Query<string>, prettyPrint?: Http.Query<boolean>, quotaUser?: Http.Query<string>, userIp?: Http.Query<string>, accountId: Http.Path<string>, max_results?: Http.Query<int64, 'max-results'>, start_index?: Http.Query<int64 & Minimum<1>, 'start-index'>);
    /**
     * @description Lists views (profiles) to which the user has access.
     * @http GET /management/accounts/{accountId}/webproperties/{webPropertyId}/profiles
     * @tag management
     * @since v2.4
     */
    'analytics.management.profiles.list'(alt?: Http.Query<"atom">, fields?: Http.Query<string>, key?: Http.Query<string>, oauth_token?: Http.Query<string>, prettyPrint?: Http.Query<boolean>, quotaUser?: Http.Query<string>, userIp?: Http.Query<string>, accountId: Http.Path<string>, webPropertyId: Http.Path<string>, max_results?: Http.Query<int64, 'max-results'>, start_index?: Http.Query<int64 & Minimum<1>, 'start-index'>);
    /**
     * @description Lists goals to which the user has access.
     * @http GET /management/accounts/{accountId}/webproperties/{webPropertyId}/profiles/{profileId}/goals
     * @tag management
     * @since v2.4
     */
    'analytics.management.goals.list'(alt?: Http.Query<"atom">, fields?: Http.Query<string>, key?: Http.Query<string>, oauth_token?: Http.Query<string>, prettyPrint?: Http.Query<boolean>, quotaUser?: Http.Query<string>, userIp?: Http.Query<string>, accountId: Http.Path<string>, webPropertyId: Http.Path<string>, profileId: Http.Path<string>, max_results?: Http.Query<int64, 'max-results'>, start_index?: Http.Query<int64 & Minimum<1>, 'start-index'>);
    /**
     * @description Lists advanced segments to which the user has access.
     * @http GET /management/segments
     * @tag management
     * @since v2.4
     */
    'analytics.management.segments.list'(alt?: Http.Query<"atom">, fields?: Http.Query<string>, key?: Http.Query<string>, oauth_token?: Http.Query<string>, prettyPrint?: Http.Query<boolean>, quotaUser?: Http.Query<string>, userIp?: Http.Query<string>, max_results?: Http.Query<int64, 'max-results'>, start_index?: Http.Query<int64 & Minimum<1>, 'start-index'>);
}
