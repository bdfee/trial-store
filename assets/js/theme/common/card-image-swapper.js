/* eslint-disable quote-props */
import 'regenerator-runtime/runtime';
import 'dotenv';
import $ from 'jquery'; // Import jQuery

// passing entity ID, could additionally pass url
class CardImageSwapper {
    constructor(entityId) {
        this.entityId = entityId;
        this.graphQLUrl = 'https://trial-store-g9.mybigcommerce.com/graphql';
        this.originalSrcSet = [];
        this.wrapper = null;
        this.imgElement = null;
        this.card = null;

        this.init();
    }

    // selectors for DOM els
    async init() {
        this.wrapper = $('.card-image-swapper');
        this.imgElement = this.wrapper.find('img.card-image');
        this.card = $('.card');

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

        try {
            const response = await $.ajax({
                url: this.graphQLUrl,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                headers: {
                    'Authorization': `Bearer ${process.env.graphQLUrl}`,
                },
                data: JSON.stringify({ query: gql }),
            });

            if (!this.entityId) {
                throw new Error('missing entityId: number in params');
            }

            if (!response.ok) {
                throw new Error('Network response not okay');
            }

            this.productImages = response.data;
        } catch (error) {
            throw error;
        }
    }

    bindEvents() {
        $('img.card-image').on('mouseover', () => {
            this.originalSrcSet.push(this.imgElement.attr('srcset'));
            const imageUrl = this.productImages.site.products.edges[0].node.images.edges[1].node.url;
            this.imgElement.attr('srcset', imageUrl);
        });

        $('img.card-image').on('mouseout', () => {
            this.imgElement.attr('srcset', this.originalSrcSet.pop());
        });
    }
}

export default CardImageSwapper;

