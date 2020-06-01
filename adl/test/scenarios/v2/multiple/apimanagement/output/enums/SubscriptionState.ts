
/**
 * @description Subscription state. Possible states are * active – the subscription is active, * suspended – the subscription is blocked, and the subscriber cannot call any APIs of the product, * submitted – the subscription request has been made by the developer, but has not yet been approved or rejected, * rejected – the subscription request has been denied by an administrator, * cancelled – the subscription has been cancelled by the developer or administrator, * expired – the subscription reached its expiration date and was deactivated.
 * @todo temporary-reuse-marker
 * @todo temporary-reuse-marker
 * @since 2019-12-01
 */
export enum SubscriptionState {
    /**
     *
     */
    suspended = 'suspended',
    /**
     *
     */
    active = 'active',
    /**
     *
     */
    expired = 'expired',
    /**
     *
     */
    submitted = 'submitted',
    /**
     *
     */
    rejected = 'rejected',
    /**
     *
     */
    cancelled = 'cancelled'
}
