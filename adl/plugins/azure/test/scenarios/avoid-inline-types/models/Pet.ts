/**
 * @description This represents a furry friend.
 */
export interface Pet {
  /**
   * @description The shelter location of the pet.
   */
  location: {
    city: string;
    state: string;
  };

  /**
   * @description A unique identifier for a pet.
   */
  id: string;
}
