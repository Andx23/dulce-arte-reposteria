
/*
 * DULCE ARTE - RESUMEN Y ENVÍO DEL PEDIDO
 *
 * Archivo: js/order-summary.js
 * Tecnología: JavaScript nativo
 *
 * Responsabilidades:
 * - Mostrar los productos seleccionados.
 * - Mostrar los datos del cliente.
 * - Calcular y mostrar el subtotal.
 * - Informar sobre cotizaciones y domicilios.
 * - Mostrar descuentos y promociones.
 * - Preparar y enviar la solicitud por WhatsApp.
 */

window.DulceArte = window.DulceArte || {};

(function (app) {
    'use strict';

    const WHATSAPP_NUMBER = '573004567890';

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

    const getDeliveryMethodName = (method) => {
        return method === 'delivery'
            ? 'Solicitar domicilio'
            : 'Recoger en el local';
    };

    /*
     * Muestra el desglose de precios de un producto.
     * Los valores proceden del cálculo guardado en cart.js.
     */
    const renderProductPrice = (container, item) => {
        if (item.quoteRequired) {
            container.appendChild(
                createElement(
                    'strong',
                    '',
                    `Desde ${formatCurrency(item.startingPrice)}`
                )
            );

            container.appendChild(
                createElement(
                    'small',
                    '',
                    'Precio final por confirmar'
                )
            );

            return;
        }

        if (item.promotion && item.discountTotal > 0) {
            container.appendChild(
                createElement(
                    'small',
                    'summary-product-original-price',
                    `Precio original: ${formatCurrency(item.originalPrice)}`
                )
            );

            container.appendChild(
                createElement(
                    'small',
                    'summary-product-discount',
                    `Descuento: -${formatCurrency(item.discountTotal)}`
                )
            );

            container.appendChild(
                createElement(
                    'small',
                    'summary-product-promotion',
                    item.promotion.name
                )
            );
        }

        container.appendChild(
            createElement(
                'strong',
                'summary-product-final-price',
                formatCurrency(item.price)
            )
        );
    };

    const renderProducts = (container, items) => {
        container.replaceChildren();

        if (items.length === 0) {
            container.appendChild(
                createElement(
                    'p',
                    'summary-placeholder',
                    'Tu carrito está vacío. Agrega productos para continuar.'
                )
            );

            return;
        }

        items.forEach((item) => {
            const article = createElement(
                'article',
                'summary-product-item'
            );

            const information = createElement(
                'div',
                'summary-product-information'
            );

            const title = createElement(
                'h4',
                'summary-product-name',
                item.product.name
            );

            const option = findProductOption(
                item.product,
                item.selection.optionId
            );

            information.appendChild(title);

            if (option) {
                information.appendChild(
                    createElement(
                        'p',
                        'summary-product-detail',
                        option.name
                    )
                );
            }

            if (item.selection.flavor) {
                information.appendChild(
                    createElement(
                        'p',
                        'summary-product-detail',
                        `Sabor: ${item.selection.flavor}`
                    )
                );
            }

            const extraNames = getExtraNames(
                item.product,
                item.selection.extraIds
            );

            if (extraNames.length > 0) {
                information.appendChild(
                    createElement(
                        'p',
                        'summary-product-detail',
                        `Adicionales: ${extraNames.join(', ')}`
                    )
                );
            }

            information.appendChild(
                createElement(
                    'p',
                    'summary-product-quantity',
                    `Cantidad: ${item.selection.quantity}`
                )
            );

            const priceContainer = createElement(
                'div',
                'summary-product-price'
            );

            renderProductPrice(priceContainer, item);

            article.append(information, priceContainer);
            container.appendChild(article);
        });
    };

    const renderCustomer = (container, orderData) => {
        container.replaceChildren();

        if (!orderData) {
            container.appendChild(
                createElement(
                    'p',
                    'summary-placeholder',
                    'Guarda tus datos para mostrarlos en el resumen.'
                )
            );

            return;
        }

        const details = [
            ['Nombre', orderData.customerName],
            ['Teléfono', orderData.customerPhone],
            ['Entrega', getDeliveryMethodName(orderData.deliveryMethod)]
        ];

        if (orderData.deliveryMethod === 'delivery') {
            details.push(
                ['Dirección', orderData.customerAddress],
                ['Barrio', orderData.customerNeighborhood]
            );

            if (orderData.customerReference) {
                details.push(
                    ['Punto de referencia', orderData.customerReference]
                );
            }
        }

        if (orderData.orderNotes) {
            details.push(['Observaciones', orderData.orderNotes]);
        }

        details.forEach(([label, value]) => {
            const paragraph = createElement(
                'p',
                'summary-customer-detail'
            );

            const strong = createElement('strong', '', `${label}: `);
            const span = createElement('span', '', value);

            paragraph.append(strong, span);
            container.appendChild(paragraph);
        });
    };

    const renderSummary = () => {
        const productsContainer = document.querySelector(
            '#summary-products-list'
        );

        const customerContainer = document.querySelector(
            '#summary-customer-details'
        );

        const subtotalElement = document.querySelector(
            '#summary-subtotal-value'
        );

        const quoteNotice = document.querySelector(
            '#summary-quote-notice'
        );

        const deliveryNotice = document.querySelector(
            '#summary-delivery-notice'
        );

        const sendButton = document.querySelector(
            '#send-whatsapp-order'
        );

        const message = document.querySelector('#summary-message');

        if (
            !productsContainer ||
            !customerContainer ||
            !subtotalElement ||
            !quoteNotice ||
            !deliveryNotice ||
            !sendButton ||
            !message
        ) {
            return;
        }

        const items = app.getCartItems();
        const orderData = app.orderData;

        renderProducts(productsContainer, items);
        renderCustomer(customerContainer, orderData);

        subtotalElement.textContent = formatCurrency(
            app.getCartSubtotal()
        );

        const hasQuoteItems = items.some((item) => {
            return item.quoteRequired;
        });

        quoteNotice.hidden = !hasQuoteItems;

        deliveryNotice.hidden = !(
            orderData && orderData.deliveryMethod === 'delivery'
        );

        const canSend = items.length > 0 && Boolean(orderData);

        sendButton.disabled = !canSend;

        if (!items.length) {
            message.textContent =
                'Agrega al menos un producto al carrito para continuar.';
        } else if (!orderData) {
            message.textContent =
                'Completa y guarda tus datos para habilitar el envío.';
        } else {
            message.textContent =
                'Revisa tu pedido. Cuando esté listo, podrás enviarlo por WhatsApp.';
        }
    };

    const buildWhatsAppMessage = (items, orderData) => {
        const lines = [
            '¡Hola, Dulce Arte!',
            'Quiero enviar una solicitud de pedido.',
            '',
            'PRODUCTOS'
        ];

        items.forEach((item, index) => {
            const option = findProductOption(
                item.product,
                item.selection.optionId
            );

            lines.push('');
            lines.push(`${index + 1}. ${item.product.name}`);

            if (option) {
                lines.push(`Presentación: ${option.name}`);
            }

            if (item.selection.flavor) {
                lines.push(`Sabor: ${item.selection.flavor}`);
            }

            const extraNames = getExtraNames(
                item.product,
                item.selection.extraIds
            );

            if (extraNames.length > 0) {
                lines.push(`Adicionales: ${extraNames.join(', ')}`);
            }

            lines.push(`Cantidad: ${item.selection.quantity}`);

            if (item.quoteRequired) {
                lines.push(
                    `Precio: Desde ${formatCurrency(item.startingPrice)}. Cotización pendiente.`
                );
            } else {
                if (item.promotion && item.discountTotal > 0) {
                    lines.push(
                        `Precio original: ${formatCurrency(item.originalPrice)}`
                    );

                    lines.push(
                        `Promoción: ${item.promotion.name}`
                    );

                    lines.push(
                        `Descuento aplicado: -${formatCurrency(item.discountTotal)}`
                    );
                }

                lines.push(
                    `Precio final: ${formatCurrency(item.price)}`
                );
            }
        });

        lines.push('');
        lines.push(
            `SUBTOTAL: ${formatCurrency(app.getCartSubtotal())}`
        );

        if (items.some((item) => item.quoteRequired)) {
            lines.push(
                'Algunos productos requieren cotización y su precio final está pendiente.'
            );
        }

        lines.push('');
        lines.push('DATOS DEL CLIENTE');
        lines.push(`Nombre: ${orderData.customerName}`);
        lines.push(`Teléfono: ${orderData.customerPhone}`);
        lines.push(
            `Método de entrega: ${getDeliveryMethodName(orderData.deliveryMethod)}`
        );

        if (orderData.deliveryMethod === 'delivery') {
            lines.push(`Dirección: ${orderData.customerAddress}`);
            lines.push(`Barrio: ${orderData.customerNeighborhood}`);

            if (orderData.customerReference) {
                lines.push(
                    `Punto de referencia: ${orderData.customerReference}`
                );
            }

            lines.push(
                'Costo del domicilio: pendiente de confirmación.'
            );
        }

        if (orderData.orderNotes) {
            lines.push('');
            lines.push(`Observaciones: ${orderData.orderNotes}`);
        }

        lines.push('');
        lines.push(
            'Entiendo que esta es una solicitud y que Dulce Arte debe confirmar disponibilidad y precio final.'
        );

        return lines.join('\n');
    };

    const sendWhatsAppOrder = () => {
        const items = app.getCartItems();
        const orderData = app.orderData;

        renderSummary();

        if (items.length === 0 || !orderData) {
            return;
        }

        const message = buildWhatsAppMessage(items, orderData);

        const whatsappUrl =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.open(
            whatsappUrl,
            '_blank',
            'noopener,noreferrer'
        );
    };

    document.addEventListener('DOMContentLoaded', () => {
        const orderForm = document.querySelector('#order-form');

        const sendButton = document.querySelector(
            '#send-whatsapp-order'
        );

        if (!orderForm || !sendButton) {
            console.error(
                'Dulce Arte: no se encontró el formulario o el botón de WhatsApp.'
            );

            return;
        }

        orderForm.addEventListener('submit', () => {
            // order.js guarda los datos antes de este evento.
            renderSummary();
        });

        orderForm.addEventListener('input', renderSummary);
        orderForm.addEventListener('change', renderSummary);

        sendButton.addEventListener('click', sendWhatsAppOrder);

        const cartContainer = document.querySelector('.cart-products');
        const cartSummary = document.querySelector('.cart-summary');

        if (cartContainer && cartSummary) {
            const cartObserver = new MutationObserver(renderSummary);

            cartObserver.observe(cartContainer, {
                childList: true,
                subtree: true
            });

            cartObserver.observe(cartSummary, {
                childList: true,
                subtree: true
            });
        }

        renderSummary();
    });

})(window.DulceArte);
