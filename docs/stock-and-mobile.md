# Stock and mobile shopping

Availability is represented by CatalogProduct.inStock. Missing values remain available, so existing catalogue entries retain their behaviour. Two beverage variants are explicitly marked out of stock as preview examples: beverage-kinnow-250ml and beverage-danedar-450g. Replace this static metadata with live inventory before launch.

The shared Add control presents alternatives instead of an Add or quantity control for unavailable products. Alternatives are in-stock products from the same department, ranked by matching brand and price proximity. A native accessible dialog is centred on desktop and becomes a bottom sheet on phones. Choosing a replacement from a stale basket preserves its quantity and removes the unavailable line. No automatic substitution occurs without a shopper choosing it.

Cart additions/increments, checkout placement, and reorders check availability. Basket checkout is blocked while unavailable lines remain. Current stock is still front-end demo metadata, not server-side inventory validation.

Below 992px the desktop navigation is hidden; a static brand heading and one bottom shopping navigation are used. Shopping modals remain mounted. Mobile filters begin collapsed; quantity controls target the visible bottom basket for the smile animation. Shared spacing, forms, cards, account, basket and checkout controls include phone/tablet adjustments and safe-area spacing.
