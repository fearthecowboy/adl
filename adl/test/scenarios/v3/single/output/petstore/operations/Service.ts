export interface Service {
    /**
     * List all pets
     * @http GET /pets
     * @tag pets
     * @since 1.0.0
     */
    listPets(limit?: Http.Query<int32>);
    /**
     * Create a pet
     * @http POST /pets
     * @tag pets
     * @since 1.0.0
     */
    createPets();
    /**
     * Info for a specific pet
     * @http GET /pets/{petId}
     * @tag pets
     * @since 1.0.0
     */
    showPetById(petId: Http.Path<string>);
}
