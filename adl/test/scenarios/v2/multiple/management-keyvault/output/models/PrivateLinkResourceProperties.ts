
/**
 * @description Properties of a private link resource.
 * @since 2019-09-01
 */
export interface PrivateLinkResourceProperties {
    /**
     * @description Group identifier of private link resource.
     * @since 2019-09-01
     */
    readonly groupId: string & ;
    /**
     * @description Required member names of private link resource.
     * @since 2019-09-01
     */
    readonly requiredMembers: Array<string>;
    /**
     * @description Required DNS zone names of the the private link resource.
     * @since 2019-09-01
     */
    requiredZoneNames: Array<string>;
}
