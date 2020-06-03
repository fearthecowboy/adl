export interface PrivateLinkResources {
    /**
     * @description Gets the private link resources supported for the key vault.
     * @http GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults/{vaultName}/privateLinkResources
     * @tag PrivateLinkResources
     * @since 2019-09-01
     */
    ListByVault(subscriptionId: Http.Path<string>, resourceGroupName: Http.Path<string>, vaultName: Http.Path<string & RegularExpression<"^[a-zA-Z0-9-]{3,24}$">>, api_version: Http.Query<string, 'api-version'>);
}
