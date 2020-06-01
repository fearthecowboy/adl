import { SchemaContract } from './SchemaContract';
/**
 * @description The response of the list schema operation.
 * @since 2019-12-01
 */
export interface SchemaCollection {
    /**
     * @description Api Schema Contract value.
     * @since 2019-12-01
     */
    readonly value: Array<SchemaContract>;
    /**
     * @description Next page link if any.
     * @since 2019-12-01
     */
    readonly nextLink: string & ;
}
