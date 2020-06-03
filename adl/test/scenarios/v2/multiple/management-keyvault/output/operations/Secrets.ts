export interface Secrets {
    /**
     * @description Gets the specified secret.  NOTE: This API is intended for internal use in ARM deployments. Users should use the data-plane REST service for interaction with vault secrets.
     * @http GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults/{vaultName}/secrets/{secretName}
     * @tag Secrets
     * @since 2019-09-01
     */
    Get(resourceGroupName: Http.Path<string>, vaultName: Http.Path<string>, secretName: Http.Path<string>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description Create or update a secret in a key vault in the specified subscription.  NOTE: This API is intended for internal use in ARM deployments. Users should use the data-plane REST service for interaction with vault secrets.
     * @http PUT /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults/{vaultName}/secrets/{secretName}
     * @tag Secrets
     * @since 2019-09-01
     */
    CreateOrUpdate(resourceGroupName: Http.Path<string>, vaultName: Http.Path<string & RegularExpression<"^[a-zA-Z0-9-]{3,24}$">>, secretName: Http.Path<string & RegularExpression<"^[a-zA-Z0-9-]{1,127}$">>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description Update a secret in the specified subscription.  NOTE: This API is intended for internal use in ARM deployments.  Users should use the data-plane REST service for interaction with vault secrets.
     * @http PATCH /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults/{vaultName}/secrets/{secretName}
     * @tag Secrets
     * @since 2019-09-01
     */
    Update(resourceGroupName: Http.Path<string>, vaultName: Http.Path<string & RegularExpression<"^[a-zA-Z0-9-]{3,24}$">>, secretName: Http.Path<string & RegularExpression<"^[a-zA-Z0-9-]{1,127}$">>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
    /**
     * @description The List operation gets information about the secrets in a vault.  NOTE: This API is intended for internal use in ARM deployments. Users should use the data-plane REST service for interaction with vault secrets.
     * @http GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults/{vaultName}/secrets
     * @tag Secrets
     * @since 2019-09-01
     */
    List(resourceGroupName: Http.Path<string>, vaultName: Http.Path<string>, __top?: Http.Query<int32, '$top'>, api_version: Http.Query<string, 'api-version'>, subscriptionId: Http.Path<string>);
}
