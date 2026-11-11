
/*
 * DULCE ARTE - MODAL DE PERSONALIZACIÓN
 *
 * Archivo: js/product-modal.js
 * Tecnología: JavaScript nativo
 *
 * Responsabilidades:
 * - Crear y mostrar el modal de personalización.
 * - Generar las opciones según cada producto.
 * - Actualizar el precio en tiempo real.
 * - Validar cantidades y opciones.
 * - Agregar la configuración seleccionada al carrito.
 */

window.DulceArte = window.DulceArte || {};

(function (app) {
    'use strict';

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

    const getOptionGroup = (pricing) => {
        const groups = [
            { key: 'sizes', label: 'Tamaño' },
            { key: 'presentations', label: 'Presentación' },
            { key: 'combinations', label: 'Combinación' },
            { key: 'decorations', label: 'Tipo de decoración' },
            { key: 'options', label: 'Tipo de caja' }
        ];

        return groups.find((group) => {
            return Array.isArray(pricing[group.key])
                && pricing[group.key].length > 0;
        }) || null;
    };

    const createField = (labelText, control) => {
        const wrapper = createElement('div', 'modal-field');
        const label = createElement('label', 'modal-label', labelText);

        if (control.id) {
            label.htmlFor = control.id;
        }

        wrapper.append(label, control);

        return wrapper;
    };

    const createSelect = (id, options) => {
        const select = createElement('select', 'modal-select');
        select.id = id;

        options.forEach((option) => {
            const optionElement = createElement(
                'option',
                '',
                option.name
            );

            optionElement.value = option.id;
            select.appendChild(optionElement);
        });

        return select;
    };

    const createModal = () => {
        const dialog = createElement('dialog', 'product-modal');
        dialog.id = 'product-modal';
        dialog.setAttribute('aria-labelledby', 'product-modal-title');

        const panel = createElement('div', 'product-modal-panel');

        const header = createElement('div', 'product-modal-header');

        const headingGroup = createElement(
            'div',
            'product-modal-heading'
        );

        const eyebrow = createElement(
            'span',
            'modal-eyebrow',
            'PERSONALIZA TU PEDIDO'
        );

        const title = createElement('h2', '', 'Personaliza tu producto');
        title.id = 'product-modal-title';

        const closeButton = createElement(
            'button',
            'modal-close',
            '×'
        );

        closeButton.type = 'button';
        closeButton.setAttribute('aria-label', 'Cerrar ventana');

        headingGroup.append(eyebrow, title);
        header.append(headingGroup, closeButton);

        const description = createElement(
            'p',
            'modal-product-description'
        );

        const form = createElement('form', 'product-modal-form');
        form.noValidate = true;

        const optionsContainer = createElement(
            'div',
            'modal-options'
        );

        const message = createElement('p', 'modal-message');
        message.setAttribute('role', 'status');
        message.setAttribute('aria-live', 'polite');

        const pricePanel = createElement('section', 'modal-price-panel');

        const priceTitle = createElement(
            'h3',
            'modal-price-title',
            'Resumen del precio'
        );

        const breakdown = createElement(
            'div',
            'modal-price-breakdown'
        );

        const total = createElement('p', 'modal-price-total');

        pricePanel.append(priceTitle, breakdown, total);

        const actions = createElement('div', 'modal-actions');

        const cancelButton = createElement(
            'button',
            'modal-cancel-button',
            'Cancelar'
        );

        cancelButton.type = 'button';

        const confirmButton = createElement(
            'button',
            'modal-confirm-button',
            'Agregar al carrito'
        );

        confirmButton.type = 'submit';

        actions.append(cancelButton, confirmButton);

        form.append(optionsContainer, message, pricePanel, actions);

        panel.append(header, description, form);
        dialog.appendChild(panel);

        document.body.appendChild(dialog);

        closeButton.addEventListener('click', () => {
            dialog.close();
        });

        cancelButton.addEventListener('click', () => {
            dialog.close();
        });

        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });

        return {
            dialog,
            title,
            description,
            form,
            optionsContainer,
            message,
            breakdown,
            total,
            confirmButton
        };
    };

    const modal = createModal();

    let currentProduct = null;
    let currentOptionGroup = null;

    const getSelectedExtras = () => {
        const selectedInputs = modal.optionsContainer.querySelectorAll(
            '[data-extra-id]:checked'
        );

        return Array.from(selectedInputs).map((input) => {
            return input.dataset.extraId;
        });
    };

    const getSelectedFlavor = () => {
        const flavorSelect = modal.optionsContainer.querySelector(
            '[data-flavor-select]'
        );

        return flavorSelect ? flavorSelect.value : null;
    };

    const getSelection = () => {
        const optionSelect = modal.optionsContainer.querySelector(
            '[data-product-option]'
        );

        const quantityInput = modal.optionsContainer.querySelector(
            '[data-product-quantity]'
        );

        return {
            optionId: optionSelect ? optionSelect.value : null,
            quantity: quantityInput
                ? Number(quantityInput.value)
                : 1,
            extraIds: getSelectedExtras(),
            flavor: getSelectedFlavor()
        };
    };

    const renderOptionField = () => {
        if (!currentOptionGroup) {
            return null;
        }

        const options = currentProduct.pricing[currentOptionGroup.key];

        const select = createSelect(
            'product-option',
            options
        );

        select.dataset.productOption = 'true';

        return createField(currentOptionGroup.label, select);
    };

    const renderFlavorField = () => {
        const flavors = currentProduct.pricing.flavors;

        if (!Array.isArray(flavors) || flavors.length === 0) {
            return null;
        }

        const select = createElement('select', 'modal-select');
        select.id = 'product-flavor';
        select.dataset.flavorSelect = 'true';

        flavors.forEach((flavor) => {
            const option = createElement('option', '', flavor);
            option.value = flavor;
            select.appendChild(option);
        });

        return createField('Sabor', select);
    };

    const renderQuantityField = () => {
        const quantity = createElement('input', 'modal-input');

        quantity.type = 'number';
        quantity.id = 'product-quantity';
        quantity.dataset.productQuantity = 'true';
        quantity.min = String(
            currentProduct.pricing.minimumQuantity || 1
        );
        quantity.step = '1';
        quantity.value = String(
            currentProduct.pricing.minimumQuantity || 1
        );

        return createField('Cantidad', quantity);
    };

    const renderExtras = () => {
        const extras = currentProduct.pricing.extras || [];

        if (extras.length === 0) {
            return null;
        }

        const section = createElement('fieldset', 'modal-extra-section');

        const legend = createElement(
            'legend',
            'modal-label',
            'Adicionales'
        );

        section.appendChild(legend);

        const isFlavorChoice = currentProduct.id === 'postre-tres-leches';

        extras.forEach((extra) => {
            const label = createElement('label', 'modal-extra-option');
            const input = createElement('input');

            input.type = isFlavorChoice ? 'radio' : 'checkbox';

            input.name = isFlavorChoice
                ? 'postre-flavor-extra'
                : `extra-${extra.id}`;

            input.dataset.extraId = extra.id;

            const extraText = extra.chargeType === 'per-unit'
                ? `${extra.name} (+${formatCurrency(extra.price)} por unidad)`
                : `${extra.name} (+${formatCurrency(extra.price)})`;

            const text = createElement(
                'span',
                'modal-extra-text',
                extraText
            );

            label.append(input, text);
            section.appendChild(label);
        });

        return section;
    };

    const renderIncludedFeatures = () => {
        const features = currentProduct.pricing.includedFeatures;

        if (!Array.isArray(features) || features.length === 0) {
            return null;
        }

        const section = createElement(
            'div',
            'modal-included-features'
        );

        features.forEach((feature) => {
            section.appendChild(
                createElement('p', '', feature)
            );
        });

        return section;
    };

    const renderOptions = () => {
        modal.optionsContainer.replaceChildren();

        const optionField = renderOptionField();
        const flavorField = renderFlavorField();
        const quantityField = renderQuantityField();
        const extrasField = renderExtras();
        const includedFeatures = renderIncludedFeatures();

        if (optionField) {
            modal.optionsContainer.appendChild(optionField);
        }

        if (flavorField) {
            modal.optionsContainer.appendChild(flavorField);
        }

        if (quantityField) {
            modal.optionsContainer.appendChild(quantityField);
        }

        if (extrasField) {
            modal.optionsContainer.appendChild(extrasField);
        }

        if (includedFeatures) {
            modal.optionsContainer.appendChild(includedFeatures);
        }
    };

    const renderPrice = () => {
        const selection = getSelection();

        const result = app.calculateProductPrice(
            currentProduct,
            selection
        );

        modal.breakdown.replaceChildren();
        modal.message.textContent = '';
        modal.message.className = 'modal-message';

        if (!result.valid) {
            modal.total.textContent = 'Precio pendiente de validar';
            modal.message.textContent = result.error;
            modal.message.classList.add('is-error');
            modal.confirmButton.disabled = true;

            return result;
        }

        modal.confirmButton.disabled = false;

        if (result.quoteRequired) {
            modal.breakdown.appendChild(
                createElement(
                    'p',
                    'modal-breakdown-note',
                    'Esta presentación requiere una cotización personalizada.'
                )
            );

            modal.total.textContent = 'Desde $75.000';

            modal.message.textContent =
                'El precio final deberá ser confirmado por WhatsApp.';

            modal.message.classList.add('is-information');

            return result;
        }

        result.breakdown.forEach((item) => {
            const row = createElement('div', 'modal-breakdown-row');

            const description = createElement(
                'span',
                '',
                item.description
            );

            const amount = createElement(
                'span',
                '',
                formatCurrency(item.amount)
            );

            row.append(description, amount);
            modal.breakdown.appendChild(row);
        });

        if (result.quantity > 1) {
            const quantityRow = createElement(
                'p',
                'modal-breakdown-note',
                `Cantidad de presentaciones: ${result.quantity}`
            );

            modal.breakdown.appendChild(quantityRow);
        }

        modal.total.textContent = formatCurrency(result.total);

        return result;
    };

    const openProductModal = (productId) => {
        const products = app.products || [];

        currentProduct = products.find((product) => {
            return product.id === productId;
        });

        if (!currentProduct || !currentProduct.pricing) {
            console.error('No se encontró el producto solicitado.');
            return;
        }

        currentOptionGroup = getOptionGroup(currentProduct.pricing);

        if (!currentOptionGroup) {
            console.error(
                'El producto no tiene opciones de precio configuradas.'
            );
            return;
        }

        modal.title.textContent = currentProduct.name;
        modal.description.textContent = currentProduct.description || '';

        modal.message.textContent = '';
        modal.message.className = 'modal-message';

        modal.confirmButton.textContent = 'Agregar al carrito';
        modal.confirmButton.disabled = false;

        renderOptions();
        renderPrice();

        modal.dialog.showModal();
    };

    modal.form.addEventListener('input', () => {
        renderPrice();
    });

    modal.form.addEventListener('change', () => {
        renderPrice();
    });

    modal.form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (typeof app.addToCart !== 'function') {
            modal.message.textContent =
                'No se pudo conectar con el carrito. Recarga la página e inténtalo nuevamente.';

            modal.message.className = 'modal-message is-error';
            return;
        }

        const selection = getSelection();

        const result = app.calculateProductPrice(
            currentProduct,
            selection
        );

        if (!result.valid) {
            modal.message.textContent = result.error;
            modal.message.className = 'modal-message is-error';
            return;
        }

        const cartResult = app.addToCart({
            productId: currentProduct.id,
            optionId: selection.optionId,
            quantity: selection.quantity,
            extraIds: selection.extraIds,
            flavor: selection.flavor
        });

        if (!cartResult.success) {
            modal.message.textContent = cartResult.error;
            modal.message.className = 'modal-message is-error';
            return;
        }

        app.pendingSelection = {
            productId: currentProduct.id,
            productName: currentProduct.name,
            optionId: selection.optionId,
            quantity: selection.quantity,
            extraIds: selection.extraIds,
            flavor: selection.flavor,
            price: result.total,
            quoteRequired: result.quoteRequired,
            startingPrice: result.quoteRequired
                ? currentProduct.pricing[currentOptionGroup.key].find(
                    (option) => option.id === selection.optionId
                ).startingPrice
                : null,
            breakdown: result.breakdown
        };

        modal.message.textContent =
            `${currentProduct.name} se agregó correctamente al carrito. Puedes cerrar esta ventana y consultar tu pedido.`;

        modal.message.className = 'modal-message is-success';

        modal.confirmButton.disabled = true;
    });

    app.openProductModal = openProductModal;

})(window.DulceArte);
