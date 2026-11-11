
/*
 * DULCE ARTE - RENDERIZADO DEL CATÁLOGO
 *
 * Archivo: js/catalog.js
 * Tecnología: JavaScript nativo
 *
 * Responsabilidades:
 * - Leer los productos registrados.
 * - Crear las tarjetas del catálogo.
 * - Filtrar productos por categoría.
 * - Abrir el modal de personalización de cada producto.
 */

document.addEventListener('DOMContentLoaded', () => {
    const app = window.DulceArte;
    const products = app?.products;
    const catalogContainer = document.querySelector('.catalog-products');

    const filterButtons = document.querySelectorAll(
        '.catalog-filters [data-category]'
    );

    if (!products || !catalogContainer) {
        console.error('No se pudo cargar el catálogo de Dulce Arte.');
        return;
    }

    if (typeof app.openProductModal !== 'function') {
        console.error(
            'No se pudo conectar el modal de personalización. ' +
            'Verifica que product-modal.js esté cargado correctamente.'
        );
    }

    /**
     * Crea un elemento HTML y le asigna texto de forma segura.
     */
    const createElement = (tag, className, text = '') => {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text) {
            element.textContent = text;
        }

        return element;
    };

    /**
     * Genera la tarjeta de un producto.
     */
    const createProductCard = (product) => {
        const article = createElement('article', 'catalog-card');

        const imageContainer = createElement(
            'div',
            'catalog-card-image'
        );

        if (product.image) {
            const image = document.createElement('img');

            image.src = product.image;
            image.alt = product.name;
            image.loading = 'lazy';

            imageContainer.appendChild(image);
        } else {
            const placeholder = createElement(
                'span',
                'image-placeholder',
                'Fotografía pendiente'
            );

            imageContainer.appendChild(placeholder);
        }

        const content = createElement(
            'div',
            'catalog-card-content'
        );

        const title = createElement(
            'h3',
            'catalog-card-title',
            product.name
        );

        const description = createElement(
            'p',
            'catalog-card-description',
            product.description
        );

        const price = createElement(
            'span',
            'catalog-card-price',
            product.priceLabel
        );

        const personalizeButton = createElement(
            'button',
            'catalog-card-button',
            'Personalizar'
        );

        personalizeButton.type = 'button';
        personalizeButton.setAttribute(
            'aria-label',
            `Personalizar ${product.name}`
        );

        personalizeButton.addEventListener('click', () => {
            if (typeof app.openProductModal !== 'function') {
                console.error(
                    'La función para abrir el modal no está disponible.'
                );
                return;
            }

            app.openProductModal(product.id);
        });

        content.append(
            title,
            description,
            price,
            personalizeButton
        );

        article.append(imageContainer, content);

        return article;
    };

    /**
     * Muestra los productos recibidos en el contenedor.
     */
    const renderProducts = (productsToRender) => {
        catalogContainer.replaceChildren();

        if (productsToRender.length === 0) {
            const emptyMessage = createElement(
                'p',
                'catalog-empty',
                'No hay productos disponibles en esta categoría.'
            );

            catalogContainer.appendChild(emptyMessage);
            return;
        }

        const fragment = document.createDocumentFragment();

        productsToRender.forEach((product) => {
            fragment.appendChild(createProductCard(product));
        });

        catalogContainer.appendChild(fragment);
    };

    /**
     * Filtra los productos según la categoría seleccionada.
     */
    const filterProducts = (category) => {
        if (category === 'all') {
            renderProducts(products);
            return;
        }

        const filteredProducts = products.filter(
            (product) => product.category === category
        );

        renderProducts(filteredProducts);
    };

    /**
     * Gestiona los botones de categorías.
     */
    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedCategory = button.dataset.category;

            filterButtons.forEach((filterButton) => {
                const isSelected = filterButton === button;

                filterButton.classList.toggle(
                    'is-active',
                    isSelected
                );

                filterButton.setAttribute(
                    'aria-pressed',
                    String(isSelected)
                );
            });

            filterProducts(selectedCategory);
        });
    });

    // Estado inicial: mostrar todos los productos.
    const allButton = document.querySelector(
        '.catalog-filters [data-category="all"]'
    );

    if (allButton) {
        allButton.classList.add('is-active');
        allButton.setAttribute('aria-pressed', 'true');
    }

    renderProducts(products);
});
