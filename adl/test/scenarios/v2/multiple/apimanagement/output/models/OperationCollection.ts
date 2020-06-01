import { OperationContract } from './OperationContract';
/**
 * @description Paged Operation list representation.
 * @since 2019-12-01
 */
export interface OperationCollection {
    /**
     * @description Page values.
     * @since 2019-12-01
     */
    readonly value: Array<OperationContract>;
    /**
     * @description Next page link if any.
     * @since 2019-12-01
     */
    readonly nextLink: string & ;
}
