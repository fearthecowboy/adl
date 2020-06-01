import { ApiRevisionContract } from './ApiRevisionContract';
/**
 * @description Paged Api Revision list representation.
 * @since 2019-12-01
 */
export interface ApiRevisionCollection {
    /**
     * @description Page values.
     * @since 2019-12-01
     */
    readonly value: Array<ApiRevisionContract>;
    /**
     * @description Next page link if any.
     * @since 2019-12-01
     */
    readonly nextLink: string & ;
}
