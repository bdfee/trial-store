/* eslint-disable quote-props */
import 'regenerator-runtime/runtime';
import 'dotenv';

class CardImageSwapper {
    constructor(entityId) {
        this.entityId = entityId;
        this.graphQLUrl = 'https://trial-store-g9.mybigcommerce.com/graphql';
        this.originalSrcSet = [];
        this.wrapper = document.querySelector('.card-image-swapper');
        this.imgElement = this.wrapper.querySelector('img.card-image');
        this.card = document.querySelector('.card');
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

        const graphQLUrl = 'https://trial-store-g9.mybigcommerce.com/graphql';

        try {
            console.log('try fetch');
            const response = await fetch(graphQLUrl, {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.graphQLUrl}`,
                },
                body: JSON.stringify({ query: gql }),
            });

            if (!this.entityId) {
                throw new Error('missing entityId: number in params');
            }

            if (!response.ok) {
                throw new Error('Network response not okay');
            }

            const data = await response.json();
            this.productImages = data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    bindEvents() {
        console.log('bind events');
        $('img.card-image').on('mouseover', () => {
            this.originalSrcSet.push(this.imgElement.srcset);
            const imageUrl = this.productImages.site.products.edges[0].node.images.edges[1].node.url;
            this.imgElement.srcset = imageUrl;
        });

        $('img.card-image').on('mouseout', () => {
            this.imgElement.srcset = this.originalSrcSet.pop();
        });
    }
}

export default CardImageSwapper;
