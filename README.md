# Test Overview

## Setup

- Clone cornerstone theme into local dir
- Determine functional node version, my current machine cannot run node 18. Use 16.19.0
- Review code base and documentation, do some initial research on key libraries Handlebars and jQuery, review API documentation

## Challenges
- API - my initial digestion of the docs was inaccurate because I overlooked the availability of temp JWT in context for 
- making api calls to the Storefront. This sent me down some incorrect pathways before going back to the docs.
- I am more experienced in functional paradigm programing than object (which was a fun challenge)

## Task 1 - CardImageSwapper class

- Use inspect to find relevant components in the codebase pertaining to the image swap on hover.
- I ultimately decided to put a conditional handlebars around the card-image-container to render the target-HTML for the image swapper code. The condition checks for the Special Product ID as the feature is only for Special Item in the prompt.
- On the target-HTML, I store the storefront_api token available in context and then target that element from the code.

### The CardImageSwapper class 
    - Instantiated in the Category class
    - selectors pull data into the class
    - fetches to gql for product images and stores them
    - implements a simple store-and-pop for toggling between Srcset

## Task 2 - AddAllToCart class / add-all-to-cart.html

- Use inspect to find relevant components in the codebase
- I ultimately decided to put a conditional handlebars inside the actionBar to check the Special Item ID for inserting the add-all-to-cart container, while storing the token on this element.
- The add-all-to-cart container stores the productID and the cartID

### AddAllToCart 
    - Instantiated in the Category class
    - Selectors pull data into the class
    - Creates cart with Special Item and removes Special item via fetch to gql
    - Performs sub-tasks without page refresh via local storage and jQuery
    - Toggles the cart Icon and disables the Add all items to provide feedback to user

#### thanks for checking out my submission - ben