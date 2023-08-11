/* eslint-disable quote-props */
// import util from '@bigcommerce/stencil-utils';

// entityId: number

async function getProductImages(entityId) {
    const graphQLUrl = 'https://trial-store-g9.mybigcommerce.com/graphql';

    const gql = `
      query GetProductById {
        site {
          products(entityIds:[${entityId}]) {
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
        const response = await fetch(graphQLUrl, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjaWQiOjEsImNvcnMiOlsiaHR0cDovL2xvY2FsaG9zdDozMDAwIl0sImVhdCI6MjE0NzQ4MzY0NywiaWF0IjoxNjkxNzEwMTQ1LCJpc3MiOiJCQyIsInNpZCI6MTAwMjk5MzA4NCwic3ViIjoiY28waWNvd25lNXk4ZXZhZzlrNTZpZDRkcW85NWRrNyIsInN1Yl90eXBlIjoyLCJ0b2tlbl90eXBlIjoxfQ.V8V1oEQLsygLWagJ_J1Z-NaG5yGE66731hfun7iJeKBZNKKDPIGb1UP771StGkxBYSVMUGNOfo_X823PjfNyiA',
            },
            body: JSON.stringify({ query: gql }),
        });

        if (!entityId) {
            throw new Error('missing entityId: number in params');
        }

        if (!response.ok) {
            throw new Error('Network response not okay');
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

const imageSwapper = async () => {
    const wrapper = document.querySelector('.card-image-swapper');
    const imgElement = wrapper.querySelector('img.card-image');


    // this logic may need to be somewhere else
    const card = document.querySelector('.card');
    const dataEntityId = card.getAttribute('data-entity-id');

    // console.log(dataEntityId);

    if (dataEntityId === '112') {
        const productImages = await getProductImages(112);

        const originalSrcSet = [];
        // alt tags
        // title
        // others?

        const handleMouseOver = () => {
            originalSrcSet.push(imgElement.srcset);
            const imageUrl = productImages.site.products.edges[0].node.images.edges[1].node.url;
            imgElement.srcset = imageUrl;
        };

        const handleMouseOut = () => {
            imgElement.srcset = originalSrcSet.pop();
        };

        imgElement.addEventListener('mouseover', handleMouseOver);
        imgElement.addEventListener('mouseout', handleMouseOut);
    }
};

imageSwapper();
