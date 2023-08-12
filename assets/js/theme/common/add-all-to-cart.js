/* eslint-disable quote-props */
import 'regenerator-runtime/runtime';

class AddAllToCart {
    constructor() {
        this.token = null;
        this.cartEntityId = null;
        this.productEntityId = null;
        this.lineItemEntityId = null;

        this.btn = null;
        this.removeBtn = $('<button>', {
            id: 'remove-all-from-cart-btn',
            class: 'button button-primary',
            type: 'button',
            text: 'Remove all from Cart',
        });

        this.init();
    }

    async init() {
        this.token = $('.actionBar').attr('data-storefront-token');
        this.productEntityId = $('.add-all-to-cart-container').attr('data-entity-id');
        this.btn = $('#add-all-to-cart-btn');

        this.checkLocalStorageForLineItemEntityId();
        this.bindAddButton();
    }


    async checkLocalStorageForLineItemEntityId() {
        if (localStorage.getItem('lineItemEntityId')) {
            this.cartEntityId = localStorage.getItem('cartEntityId');
            this.lineItemEntityId = localStorage.getItem('lineItemEntityId');
            this.updateUIOnCartAdd();
            this.bindRemoveButton();
        }
    }

    async createCart() {
        const variables = {
            createCartInput: {
                lineItems: [
                    {
                        quantity: 1,
                        productEntityId: +this.productEntityId,
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
                      entityId
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
            .then((response) => {
                this.cartEntityId = response.data.cart.createCart.cart.entityId;

                response.data.cart.createCart.cart.lineItems.physicalItems.forEach(item => {
                    if (item.name === 'Special Item') {
                        this.lineItemEntityId = item.entityId;
                    }
                });

                localStorage.setItem('cartEntityId', this.cartEntityId);
                localStorage.setItem('lineItemEntityId', this.lineItemEntityId);

                $('.cart-quantity')
                    .text(1)
                    .toggleClass('countPill--positive', true);
                // Append the button to the specified container
                this.updateUIOnCartAdd();

                $('#remove-all-from-cart-btn').on('click', () => {
                    this.removeFromCart();
                });
            })
            .catch(error => console.error(error));
    }

    async removeFromCart() {
        const variables = {
            deleteCartLineItemInput: {
                cartEntityId: this.cartEntityId,
                lineItemEntityId: this.lineItemEntityId,
            },
        };

        console.log(variables);

        const gql = `
          mutation deleteCartLineItem($deleteCartLineItemInput: DeleteCartLineItemInput!) {
            cart {
              deleteCartLineItem(input: $deleteCartLineItemInput) {
                cart {
                  entityId
                  lineItems {
                    physicalItems {
                      name
                      quantity
                    }
                  }
                }
              }
            }
          }`;

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
                    .toggleClass('countPill--positive', false);

                $('.actionBar').find('#remove-all-from-cart-btn').remove();
                $('#add-all-to-cart-btn').prop('disabled', false);

                localStorage.removeItem('lineItemEntityId');
            })
            .catch(error => console.error(error));
    }

    updateUIOnCartAdd() {
        $('#add-all-to-cart-btn').prop('disabled', true);
        $('.add-all-to-cart-container').append(this.removeBtn);
    }

    bindRemoveButton() {
        $('#remove-all-from-cart-btn').on('click', () => {
            this.removeFromCart();
        });
    }

    bindAddButton() {
        $('#add-all-to-cart-btn').on('click', () => {
            this.createCart();
        });
    }
}

export default AddAllToCart;
