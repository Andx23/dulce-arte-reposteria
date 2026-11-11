
/*
 * DULCE ARTE - PROMOCIONES
 *
 * Archivo: js/promotions.js
 * Tecnología: JavaScript nativo
 *
 * Responsabilidades:
 * - Centralizar la información de las promociones.
 * - Comprobar las fechas de vigencia.
 * - Identificar los productos y opciones participantes.
 * - Generar las tarjetas visuales de promociones.
 */

window.DulceArte = window.DulceArte || {};

(function (app) {
    'use strict';

    const promotions = [
        {
            id: 'lanzamiento-combo-celebracion',
            name: 'Promoción de lanzamiento',
            productId: 'combo-celebracion',
            optionId: 'pequeno',
            startDate: '2026-11-9',
            endDate: '2026-12-21',
            discountPerUnit: 10000,
            decorationExtraId: 'decoracion-tematica',
            description: 'Una torta pequeña acompañada de 6 cupcakes.',
            availabilityText: 'Disponibilidad limitada. Realiza tu pedido con anticipación.'
        }
    ];

    const parseLocalDate = (dateString) => {
        const [year, month, day] = dateString.split('-').map(Number);

        return new Date(year, month - 1, day);
    };

    const isDateWithinRange = (date, startDate, endDate) => {
        const currentDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

        const start = parseLocalDate(startDate);
        const end = parseLocalDate(endDate);

        return currentDate >= start && currentDate <= end;
    };

    const getPromotionStatus = (promotion, date = new Date()) => {
        const currentDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

        const start = parseLocalDate(promotion.startDate);
        const end = parseLocalDate(promotion.endDate);

        if (currentDate < start) {
            return 'upcoming';
        }

        if (currentDate > end) {
            return 'expired';
        }

        return 'active';
    };

    const getActivePromotion = (
        product,
        selectedOption,
        date = new Date()
    ) => {
        if (!product || !selectedOption) {
            return null;
        }

        const promotion = promotions.find((item) => {
            return (
                item.productId === product.id &&
                item.optionId === selectedOption.id &&
                isDateWithinRange(
                    date,
                    item.startDate,
                    item.endDate
                )
            );
        });

        return promotion || null;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Intl.DateTimeFormat('es-CO', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(parseLocalDate(dateString));
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
        if (!product || !product.pricing) {
            return null;
        }

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

    const findPromotionExtra = (product, extraId) => {
        const extras = product.pricing.extras || [];

        return extras.find((extra) => {
            return extra.id === extraId;
        }) || null;
    };

    const createPromotionCard = (promotion) => {
        const product = app.products.find((item) => {
            return item.id === promotion.productId;
        });

        if (!product) {
            console.error(
                `Dulce Arte: no se encontró el producto de la promoción "${promotion.id}".`
            );

            return null;
        }

        const option = findProductOption(
            product,
            promotion.optionId
        );

        if (
            !option ||
            !Number.isSafeInteger(option.price) ||
            !Number.isSafeInteger(promotion.discountPerUnit) ||
            promotion.discountPerUnit < 0 ||
            promotion.discountPerUnit > option.price
        ) {
            console.error(
                `Dulce Arte: los precios de la promoción "${promotion.id}" no son válidos.`
            );

            return null;
        }

        const extra = promotion.decorationExtraId
            ? findPromotionExtra(product, promotion.decorationExtraId)
            : null;

        const promotionalPrice =
            option.price - promotion.discountPerUnit;

        const status = getPromotionStatus(promotion);

        const article = createElement(
            'article',
            'promotion-card'
        );

        article.dataset.promotionId = promotion.id;

        const visual = createElement(
            'div',
            'promotion-card-visual'
        );

        visual.appendChild(
            createElement(
                'span',
                'promotion-visual-eyebrow',
                'UNA CELEBRACIÓN ESPECIAL'
            )
        );

        visual.appendChild(
            createElement(
                'span',
                'promotion-visual-title',
                'Dulce Arte'
            )
        );

        visual.appendChild(
            createElement(
                'span',
                'promotion-visual-description',
                'Combo celebración'
            )
        );

        const content = createElement(
            'div',
            'promotion-card-content'
        );

        const statusLabels = {
            active: 'Promoción disponible',
            upcoming: 'Próximamente',
            expired: 'Promoción finalizada'
        };

        const statusBadge = createElement(
            'span',
            `promotion-status promotion-status-${status}`,
            statusLabels[status]
        );

        const title = createElement(
            'h3',
            'promotion-title',
            promotion.name
        );

        const description = createElement(
            'p',
            'promotion-description',
            promotion.description
        );

        const validity = createElement(
            'p',
            'promotion-validity',
            `Válida del ${formatDate(promotion.startDate)} al ${formatDate(promotion.endDate)}.`
        );

        const priceContainer = createElement(
            'div',
            'promotion-prices'
        );

        priceContainer.appendChild(
            createElement(
                'span',
                'promotion-original-price',
                `Precio habitual: ${formatCurrency(option.price)}`
            )
        );

        const priceRow = createElement(
            'div',
            'promotion-price-row'
        );

        priceRow.appendChild(
            createElement(
                'strong',
                'promotion-final-price',
                formatCurrency(promotionalPrice)
            )
        );

        priceRow.appendChild(
            createElement(
                'span',
                'promotion-saving',
                `Ahorras ${formatCurrency(promotion.discountPerUnit)}`
            )
        );

        priceContainer.appendChild(priceRow);

        const details = createElement(
            'div',
            'promotion-details'
        );

        details.appendChild(
            createElement(
                'p',
                'promotion-detail',
                'Incluye una torta pequeña y 6 cupcakes.'
            )
        );

        if (extra) {
            details.appendChild(
                createElement(
                    'p',
                    'promotion-detail',
                    `${extra.name}: +${formatCurrency(extra.price)} por combo.`
                )
            );

            details.appendChild(
                createElement(
                    'p',
                    'promotion-detail',
                    `Con decoración temática: ${formatCurrency(promotionalPrice + extra.price)}.`
                )
            );
        }

        details.appendChild(
            createElement(
                'p',
                'promotion-availability',
                promotion.availabilityText
            )
        );

        const action = createElement(
            'a',
            'promotion-button',
            status === 'expired'
                ? 'Ver catálogo'
                : 'Explorar combo'
        );

        action.href = '#catalogo';

        content.append(
            statusBadge,
            title,
            description,
            validity,
            priceContainer,
            details,
            action
        );

        article.append(visual, content);

        return article;
    };

    const renderPromotions = () => {
        const container = document.querySelector(
            '.promotions-container'
        );

        if (!container) {
            return;
        }

        container.replaceChildren();

        if (promotions.length === 0) {
            container.appendChild(
                createElement(
                    'p',
                    'promotions-empty',
                    'En este momento no tenemos promociones disponibles. ¡Pronto tendremos novedades!'
                )
            );

            return;
        }

        const fragment = document.createDocumentFragment();

        promotions.forEach((promotion) => {
            const card = createPromotionCard(promotion);

            if (card) {
                fragment.appendChild(card);
            }
        });

        container.appendChild(fragment);
    };

    app.promotions = promotions;
    app.getActivePromotion = getActivePromotion;
    app.getPromotionStatus = getPromotionStatus;
    app.renderPromotions = renderPromotions;

    document.addEventListener('DOMContentLoaded', renderPromotions);

})(window.DulceArte);
