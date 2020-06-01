import { GatewayContract } from './GatewayContract';
/**
 * @description Paged Gateway list representation.
 * @since 2019-12-01
 */
export interface GatewayCollection {
    /**
     * @description Page values.
     * @since 2019-12-01
     */
    readonly value: Array<GatewayContract>;
    /**
     * @description Next page link if any.
     * @since 2019-12-01
     */
    readonly nextLink: string & ;
}
