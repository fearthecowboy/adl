import { ApiReleaseContract } from './ApiReleaseContract';
/**
 * @description Paged ApiRelease list representation.
 * @since 2019-12-01
 */
export interface ApiReleaseCollection {
    /**
     * @description Page values.
     * @since 2019-12-01
     */
    readonly value: Array<ApiReleaseContract>;
    /**
     * @description Next page link if any.
     * @since 2019-12-01
     */
    readonly nextLink: string & ;
}
