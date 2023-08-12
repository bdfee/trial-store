/* eslint-disable quote-props */
import 'regenerator-runtime/runtime';

// passing entity ID, could additionally pass url
class CardImageSwapper {
    constructor(entityId) {
        this.entityId = entityId;
        this.originalSrcSet = [];
        this.wrapper = null;
        this.imgElement = null;
        this.card = null;
        this.token = null;
        this.init();
    }

    // selectors for DOM els
    async init() {
        this.wrapper = $('.card-image-swapper');
        this.imgElement = $('.card-image', this.wrapper);
        this.card = $('.card');
        this.token = $('.card-image-swapper').attr('data-storefront-token');

        this.getProductImages();
        this.bindEvents();
    }

    async getProductImages() {
        const gql = `
        query GetProductById {
          site {
            products(entityIds:[${this.entityId}]) {
              edges {
                node {
                  entityId
                  name
                  images {
                    edges {
                      node {
                        url(width: 500)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;


        fetch('/graphql', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
            body: JSON.stringify({
                query: gql,
            }),
        })
            .then(response => response.json())
            .then(result => {
                this.productImages = result;
            })
            .catch(error => console.error(error));
    }

    bindEvents() {
        $('img.card-image').on('mouseover', () => {
            this.originalSrcSet.push(this.imgElement.attr('srcset'));
            const imageUrl = this.productImages.data.site.products.edges[0].node.images.edges[1].node.url;
            this.imgElement.attr('srcset', imageUrl);
        });

        $('img.card-image').on('mouseout', () => {
            this.imgElement.attr('srcset', this.originalSrcSet.pop());
        });
    }
}

export default CardImageSwapper;

