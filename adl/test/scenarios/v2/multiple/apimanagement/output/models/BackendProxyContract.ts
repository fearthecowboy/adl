
/** @since 2019-12-01 */
export interface BackendProxyContract {
    /** @since 2019-12-01 */
    url?: string & MaxLength<2000> & MinLength<1>;
    /** @since 2019-12-01 */
    username: string;
    /** @since 2019-12-01 */
    password: string;
}