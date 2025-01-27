import { LitElement, html, css } from 'https://cdn.skypack.dev/lit';

class ProductComponent extends LitElement {
  static properties = {
    productos: { type: Array },
  };

  constructor() {
    super();
    this.productos = []; // Inicializa la lista de productos
    this.loadProductos();
  }

  // Carga los productos desde un archivo externo
  async loadProductos() {
    try {
      const module = await import('../data/data.js');
      this.productos = module.productos;
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }

  // Maneja el cambio de selección de producto
  handleProductChange(event) {
    const selectedId = parseInt(event.target.value, 10);

    if (!this.productos || this.productos.length === 0) {
      console.warn('Productos no están disponibles aún.');
      return;
    }

    const producto = this.productos.find((prod) => prod.id === selectedId);

    if (producto) {
      this.renderRoot.querySelector('#productId').value = producto.id;
      this.renderRoot.querySelector('#productValue').value = producto.value.toFixed(2);
    }
  }

  // Maneja el evento de agregar al carrito
  handleSubmit(event) {
    event.preventDefault();

    const productId = this.renderRoot.querySelector('#productId').value;
    const productName = this.renderRoot.querySelector('#productName').options[
      this.renderRoot.querySelector('#productName').selectedIndex
    ].text;
    const productValue = parseFloat(this.renderRoot.querySelector('#productValue').value);
    const productQuantity = parseInt(this.renderRoot.querySelector('#productQuantity').value, 10);

    if (!productId || !productName || isNaN(productValue) || isNaN(productQuantity)) {
      alert('Por favor, seleccione un producto y asegúrese de que la cantidad sea válida.');
      return;
    }

    const total = productValue * productQuantity;

    window.dispatchEvent(
      new CustomEvent('addToCart', {
        detail: { productId, productName, productValue, productQuantity },
      })
    );

    alert(`Producto agregado:\n\n${productName}\nCantidad: ${productQuantity}\nTotal: $${total.toFixed(2)}`);

    // Resetea el formulario
    this.renderRoot.querySelector('#productForm').reset();
    this.renderRoot.querySelector('#productName').selectedIndex = 0;
  }

  render() {
    return html`
      <div class="container mt-4">
        <h2>Añadir Productos Al Carrito</h2>
        <form id="productForm">
          <div class="mb-3">
            <label for="productName" class="form-label">Seleccione un Producto</label>
            <select class="form-select" id="productName" @change="${this.handleProductChange}" required>
              <option value="" selected disabled>Elija un producto</option>
              ${this.productos.map(
                (producto) => html`<option value="${producto.id}">${producto.name}</option>`
              )}
            </select>
          </div>
          <div class="mb-3">
            <label for="productId" class="form-label">ID del Producto</label>
            <input type="text" class="form-control" id="productId" readonly />
          </div>
          <div class="mb-3">
            <label for="productValue" class="form-label">Valor del Producto</label>
            <input type="text" class="form-control" id="productValue" readonly />
          </div>
          <div class="mb-3">
            <label for="productQuantity" class="form-label">Cantidad</label>
            <input
              type="number"
              class="form-control"
              id="productQuantity"
              min="1"
              placeholder="Ingrese la cantidad"
              required
            />
          </div>
          <button type="button" class="btn btn-primary" @click="${this.handleSubmit}">Agregar al Carrito</button>
        </form>
      </div>
    `;
  }
}

customElements.define('product-component', ProductComponent);
