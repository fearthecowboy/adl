import { ApiContract } from './ApiContract';
/**
 * @description Paged Api list representation.
 * @since 2019-12-01
 */
export interface ApiCollection {
    /**
     * @description Page values.
     * @since 2019-12-01
     */
    readonly value: Array<ApiContract>;
    /**
     * @description Next page link if any.
     * @since 2019-12-01
     */
    readonly nextLink: string & ;
}
