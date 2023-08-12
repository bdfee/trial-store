import 'regenerator-runtime/runtime';

class AddAllToCart {
    constructor() {
        this.entityId = null;
        this.token = null;
        this.btn = null;

        this.init();
    }

    // check for a cart existing first
    async init() {
        this.token = $('.actionBar').attr('data-storefront-token');
        this.entityId = $('.add-all-to-cart-container').attr('data-entity-id');
        this.btn = $('#add-all-to-cart-btn');

        this.bindEvents();
    }

    async createCart() {
        const variables = {
            createCartInput: {
                lineItems: [
                    {
                        quantity: 1,
                        productEntityId: +this.entityId,
                    },
                ],
            },
        };

        const gql = `
          mutation createCartSimple($createCartInput: CreateCartInput!) {
          cart {
            createCart(input: $createCartInput) {
              cart {
                entityId
                lineItems {
                  physicalItems {
                    name
                    quantity
                  }
                  digitalItems {
                    name
                    quantity
                  }
                  giftCertificates {
                    name
                  }
                  customItems {
                    name
                    quantity
                  }
                }
              }
            }
          }
        }
        `;

        fetch('/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify({
                query: gql,
                variables,
            }),
        })
            .then(response => response.json())
            .then(() => {
                $('.cart-quantity')
                    .text(1)
                    .toggleClass('countPill--positive', 1);
            })
            .catch(error => console.error(error));
    }

    bindEvents() {
        $('#add-all-to-cart-btn').on('click', async () => {
            await this.createCart();
            console.log('click');
        });
    }
}

export default AddAllToCart;
