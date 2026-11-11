
/*
 * DULCE ARTE - ADMINISTRACIÓN DEL CARRITO
 *
 * Archivo: js/cart.js
 * Tecnología: JavaScript nativo
 *
 * Responsabilidades:
 * - Agregar productos configurados al carrito.
 * - Mantener las configuraciones individuales.
 * - Modificar cantidades.
 * - Eliminar productos.
 * - Calcular el subtotal.
 * - Separar los productos que requieren cotización.
 * - Conservar el desglose de promociones y descuentos.
 */

window.DulceArte = window.DulceArte || {};

(function (app) {
    'use strict';

    const cartItems = [];
    let nextItemId = 1;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const createElement = (tag, className, text = '') => {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== '') {
            element.textContent = text;
        }

        return element;
    };

    const findProductOption = (product, optionId) => {
        const groups = [
            'sizes',
            'presentations',
            'combinations',
            'decorations',
            'options'
        ];

        for (const group of groups) {
            const options = product.pricing[group];

            if (!Array.isArray(options)) {
                continue;
            }

            const option = options.find((item) => {
                return item.id === optionId;
            });

            if (option) {
                return option;
            }
        }

        return null;
    };

    const getExtraNames = (product, extraIds) => {
        const extras = product.pricing.extras || [];

        return extraIds.map((extraId) => {
            const extra = extras.find((item) => {
                return item.id === extraId;
            });

            return extra ? extra.name : extraId;
        });
    };

    /*
     * Guarda el resultado completo del cálculo en el elemento
     * del carrito para conservar precios, descuentos y promociones.
     */
    const applyCalculationResult = (item, result) => {
        item.price = result.total;
        item.quoteRequired = result.quoteRequired;

        if (result.quoteRequired) {
            item.startingPrice = result.breakdown[0]
                ? null
                : item.startingPrice;

            return;
        }

        item.startingPrice = null;

        item.baseTotal = result.baseTotal;
        item.extrasTotal = result.extrasTotal;
        item.discountTotal = result.discountTotal || 0;

        item.originalPrice =
            result.baseTotal + result.extrasTotal;

        item.promotion = result.promotion || null;
        item.breakdown = result.breakdown || [];
    };

    const addToCart = (selection) => {
        if (!selection || !selection.productId) {
            return {
                success: false,
                error: 'La configuración del producto no es válida.'
            };
        }

        const product = app.products.find((item) => {
            return item.id === selection.productId;
        });

        if (!product) {
            return {
                success: false,
                error: 'No se encontró el producto seleccionado.'
            };
        }

        const savedSelection = {
            optionId: selection.optionId,
            quantity: selection.quantity,
            extraIds: Array.isArray(selection.extraIds)
                ? [...selection.extraIds]
                : [],
            flavor: selection.flavor || null
        };

        const result = app.calculateProductPrice(
            product,
            savedSelection
        );

        if (!result.valid) {
            return {
                success: false,
                error: result.error
            };
        }

        const selectedOption = findProductOption(
            product,
            savedSelection.optionId
        );

        const item = {
            id: `cart-item-${nextItemId++}`,
            product,
            selection: savedSelection,
            price: result.total,
            quoteRequired: result.quoteRequired,
            startingPrice: result.quoteRequired && selectedOption
                ? selectedOption.startingPrice
                : null
        };

        applyCalculationResult(item, result);

        cartItems.push(item);

        renderCart();

        return {
            success: true,
            itemId: item.id
        };
    };

    const updateQuantity = (itemId, newQuantity) => {
        const item = cartItems.find((cartItem) => {
            return cartItem.id === itemId;
        });

        if (!item) {
            return false;
        }

        if (!Number.isSafeInteger(newQuantity) || newQuantity < 1) {
            return false;
        }

        const updatedSelection = {
            ...item.selection,
            quantity: newQuantity
        };

        const result = app.calculateProductPrice(
            item.product,
            updatedSelection
        );

        if (!result.valid) {
            return false;
        }

        item.selection = updatedSelection;

        applyCalculationResult(item, result);

        renderCart();

        return true;
    };

    const removeFromCart = (itemId) => {
        const itemIndex = cartItems.findIndex((item) => {
            return item.id === itemId;
        });

        if (itemIndex === -1) {
            return;
        }

        cartItems.splice(itemIndex, 1);

        renderCart();
    };

    const getSubtotal = () => {
        return cartItems.reduce((subtotal, item) => {
            if (item.quoteRequired) {
                return subtotal;
            }

            return subtotal + item.price;
        }, 0);
    };

    const createCartItem = (item) => {
        const article = createElement('article', 'cart-item');
        article.dataset.cartItemId = item.id;

        const content = createElement('div', 'cart-item-content');

        const title = createElement(
            'h3',
            'cart-item-title',
            item.product.name
        );

        const selectedOption = findProductOption(
            item.product,
            item.selection.optionId
        );

        const details = createElement(
            'p',
            'cart-item-details',
            selectedOption ? selectedOption.name : ''
        );

        content.append(title, details);

        if (item.selection.flavor) {
            content.appendChild(
                createElement(
                    'p',
                    'cart-item-details',
                    `Sabor: ${item.selection.flavor}`
                )
            );
        }

        const extraNames = getExtraNames(
            item.product,
            item.selection.extraIds
        );

        if (extraNames.length > 0) {
            content.appendChild(
                createElement(
                    'p',
                    'cart-item-details',
                    `Adicionales: ${extraNames.join(', ')}`
                )
            );
        }

        const controls = createElement('div', 'cart-item-controls');

        const quantityLabel = createElement(
            'label',
            'cart-item-quantity-label',
            'Cantidad'
        );

        const quantityInput = createElement(
            'input',
            'cart-item-quantity'
        );

        quantityInput.type = 'number';
        quantityInput.min = String(
            item.product.pricing.minimumQuantity || 1
        );
        quantityInput.step = '1';
        quantityInput.value = String(item.selection.quantity);
        quantityInput.setAttribute(
            'aria-label',
            `Cantidad de ${item.product.name}`
        );

        quantityLabel.appendChild(quantityInput);

        const removeButton = createElement(
            'button',
            'cart-item-remove',
            'Eliminar'
        );

        removeButton.type = 'button';

        controls.append(quantityLabel, removeButton);

        const priceContainer = createElement(
            'div',
            'cart-item-price-container'
        );

        if (item.quoteRequired) {
            priceContainer.appendChild(
                createElement(
                    'span',
                    'cart-item-quote',
                    `Desde ${formatCurrency(item.startingPrice)}`
                )
            );

            priceContainer.appendChild(
                createElement(
                    'p',
                    'cart-item-details',
                    'Precio final por confirmar'
                )
            );
        } else {
            if (item.discountTotal > 0) {
                priceContainer.appendChild(
                    createElement(
                        'p',
                        'cart-item-original-price',
                        `Precio original: ${formatCurrency(item.originalPrice)}`
                    )
                );

                priceContainer.appendChild(
                    createElement(
                        'p',
                        'cart-item-discount',
                        `Descuento: -${formatCurrency(item.discountTotal)}`
                    )
                );

                if (item.promotion) {
                    priceContainer.appendChild(
                        createElement(
                            'span',
                            'cart-item-promotion',
                            item.promotion.name
                        )
                    );
                }
            }

            priceContainer.appendChild(
                createElement(
                    'span',
                    'cart-item-price',
                    formatCurrency(item.price)
                )
            );
        }

        article.append(content, controls, priceContainer);

        quantityInput.addEventListener('change', () => {
            const newQuantity = Number(quantityInput.value);

            const updated = updateQuantity(item.id, newQuantity);

            if (!updated) {
                quantityInput.value = String(item.selection.quantity);
            }
        });

        removeButton.addEventListener('click', () => {
            removeFromCart(item.id);
        });

        return article;
    };

    const renderCart = () => {
        const cartContainer = document.querySelector('.cart-products');
        const summaryContainer = document.querySelector('.cart-summary');

        if (!cartContainer || !summaryContainer) {
            return;
        }

        cartContainer.replaceChildren();
        summaryContainer.replaceChildren();

        if (cartItems.length === 0) {
            cartContainer.appendChild(
                createElement(
                    'p',
                    'cart-empty',
                    'Tu carrito está vacío. Explora nuestro catálogo y agrega tus productos favoritos.'
                )
            );

            summaryContainer.appendChild(
                createElement(
                    'p',
                    'cart-subtotal',
                    'Subtotal: $0'
                )
            );

            return;
        }

        const fragment = document.createDocumentFragment();

        cartItems.forEach((item) => {
            fragment.appendChild(createCartItem(item));
        });

        cartContainer.appendChild(fragment);

        const subtotal = getSubtotal();

        summaryContainer.appendChild(
            createElement(
                'p',
                'cart-subtotal',
                `Subtotal: ${formatCurrency(subtotal)}`
            )
        );

        const hasQuoteItems = cartItems.some((item) => {
            return item.quoteRequired;
        });

        if (hasQuoteItems) {
            summaryContainer.appendChild(
                createElement(
                    'p',
                    'cart-quote-note',
                    'Tienes productos que requieren cotización. Su precio final será confirmado por Dulce Arte.'
                )
            );
        }
    };

    app.addToCart = addToCart;
    app.updateCartQuantity = updateQuantity;
    app.removeFromCart = removeFromCart;
    app.getCartItems = () => [...cartItems];
    app.getCartSubtotal = getSubtotal;

    document.addEventListener('DOMContentLoaded', renderCart);

})(window.DulceArte);
