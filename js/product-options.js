
/*
 * DULCE ARTE - PERSONALIZACIÓN Y CÁLCULO DE PRECIOS
 *
 * Archivo: js/product-options.js
 * Tecnología: JavaScript nativo
 *
 * Responsabilidades:
 * - Validar las selecciones del cliente.
 * - Calcular precios y adicionales.
 * - Aplicar promociones vigentes.
 * - Generar el desglose del precio.
 */

window.DulceArte = window.DulceArte || {};

(function (app) {
    'use strict';

    const findOption = (options, selectedId) => {
        if (!Array.isArray(options)) {
            return null;
        }

        return options.find((option) => option.id === selectedId) || null;
    };

    const createError = (message) => ({
        valid: false,
        error: message,
        total: null,
        quoteRequired: false,
        breakdown: []
    });

    const calculateProductPrice = (product, selection = {}) => {
        if (!product || !product.pricing) {
            return createError('El producto no tiene reglas de precios.');
        }

        const pricing = product.pricing;
        const quantity = selection.quantity ?? 1;
        const extraIds = selection.extraIds ?? [];

        if (!Number.isSafeInteger(quantity) || quantity < 1) {
            return createError(
                'La cantidad debe ser un número entero mayor que cero.'
            );
        }

        if (!Array.isArray(extraIds)) {
            return createError(
                'Los adicionales seleccionados no son válidos.'
            );
        }

        const optionGroups = [
            pricing.sizes,
            pricing.presentations,
            pricing.combinations,
            pricing.decorations,
            pricing.options
        ];

        let selectedOption = null;

        for (const group of optionGroups) {
            selectedOption = findOption(group, selection.optionId);

            if (selectedOption) {
                break;
            }
        }

        if (!selectedOption) {
            return createError(
                'Debes seleccionar una opción válida del producto.'
            );
        }

        if (
            pricing.minimumQuantity &&
            quantity < pricing.minimumQuantity
        ) {
            return createError(
                `La cantidad mínima para este producto es ${pricing.minimumQuantity} unidades.`
            );
        }

        if (selectedOption.requiresQuote) {
            if (
                !Number.isSafeInteger(selectedOption.startingPrice) ||
                selectedOption.startingPrice < 0
            ) {
                return createError(
                    'El precio inicial de la cotización no es válido.'
                );
            }

            if (extraIds.length > 0) {
                return createError(
                    'Los adicionales de esta opción deben confirmarse mediante cotización.'
                );
            }

            return {
                valid: true,
                error: null,
                total: null,
                quoteRequired: true,
                quantity,
                breakdown: [
                    {
                        description: selectedOption.name,
                        amount: null,
                        note: `Precio por cotizar. Desde $${selectedOption.startingPrice.toLocaleString('es-CO')}.`
                    }
                ]
            };
        }

        if (
            !Number.isSafeInteger(selectedOption.price) ||
            selectedOption.price < 0
        ) {
            return createError(
                'La opción seleccionada no tiene un precio válido.'
            );
        }

        const isDecorationProduct =
            pricing.type === 'fixed-by-decoration';

        const unitsPerPresentation = isDecorationProduct
            ? 1
            : selectedOption.units;

        if (
            !Number.isSafeInteger(unitsPerPresentation) ||
            unitsPerPresentation < 1
        ) {
            return createError(
                'La presentación no tiene una cantidad de unidades válida.'
            );
        }

        const totalUnits = unitsPerPresentation * quantity;
        const baseTotal = selectedOption.price * quantity;

        if (!Number.isSafeInteger(baseTotal)) {
            return createError('El precio base calculado no es válido.');
        }

        const breakdown = [
            {
                description: selectedOption.name,
                amount: baseTotal
            }
        ];

        const availableExtras = pricing.extras || [];
        const selectedExtras = [];

        for (const extraId of extraIds) {
            const extra = findOption(availableExtras, extraId);

            if (!extra) {
                return createError(
                    `El adicional "${extraId}" no existe para este producto.`
                );
            }

            if (
                !Number.isSafeInteger(extra.price) ||
                extra.price < 0
            ) {
                return createError(
                    `El precio del adicional "${extra.name}" no es válido.`
                );
            }

            if (selectedExtras.some((item) => item.id === extra.id)) {
                return createError(
                    `El adicional "${extra.name}" está seleccionado más de una vez.`
                );
            }

            selectedExtras.push(extra);
        }

        let extrasTotal = 0;

        for (const extra of selectedExtras) {
            let extraAmount;

            if (extra.chargeType === 'per-unit') {
                extraAmount = extra.price * totalUnits;
            } else if (extra.chargeType === 'fixed') {
                extraAmount = extra.price * quantity;
            } else {
                return createError(
                    `El tipo de cobro del adicional "${extra.name}" no está definido.`
                );
            }

            if (!Number.isSafeInteger(extraAmount)) {
                return createError(
                    `El cálculo del adicional "${extra.name}" no es válido.`
                );
            }

            extrasTotal += extraAmount;

            breakdown.push({
                description: extra.name,
                amount: extraAmount
            });
        }

        /*
         * Aplicación de promociones
         *
         * El descuento se calcula por cada unidad del producto
         * participante. Los adicionales se suman después,
         * por lo que no reciben el descuento.
         */

        let promotion = null;
        let discountTotal = 0;

        if (typeof app.getActivePromotion === 'function') {
            promotion = app.getActivePromotion(
                product,
                selectedOption
            );
        }

        if (promotion) {
            if (
                !Number.isSafeInteger(promotion.discountPerUnit) ||
                promotion.discountPerUnit < 0
            ) {
                return createError(
                    'El descuento de la promoción no es válido.'
                );
            }

            discountTotal = promotion.discountPerUnit * quantity;

            if (
                !Number.isSafeInteger(discountTotal) ||
                discountTotal > baseTotal
            ) {
                return createError(
                    'El descuento calculado no es válido.'
                );
            }

            breakdown.push({
                description: promotion.name,
                amount: -discountTotal
            });
        }

        const total = baseTotal - discountTotal + extrasTotal;

        if (!Number.isSafeInteger(total) || total < 0) {
            return createError(
                'El resultado del cálculo no es válido.'
            );
        }

        return {
            valid: true,
            error: null,
            total,
            quoteRequired: false,
            quantity,
            unitsPerPresentation,
            totalUnits,
            baseTotal,
            discountTotal,
            extrasTotal,
            promotion: promotion
                ? {
                    id: promotion.id,
                    name: promotion.name,
                    discountPerUnit: promotion.discountPerUnit
                }
                : null,
            breakdown
        };
    };

    app.calculateProductPrice = calculateProductPrice;

})(window.DulceArte);
