const contenedor = document.getElementById("container");
const botonCarrito = document.getElementById("botonCarrito");
const carritoOculto = document.getElementById("carritoOculto");
const cerrarCarrito = document.getElementById("cerrarCarrito");
const carritoLista = document.getElementById("carritoLista");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Guardar carrito en LocalStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Mostrar productos desde JSON
async function mostrarProductos() {
  try {
    const respuesta = await fetch("data/ropa.json");
    const ropa = await respuesta.json();

    ropa.forEach((producto) => {
      const crearCard = document.createElement("section");
      crearCard.classList.add("card");
      crearCard.innerHTML = `
        <img class="img" src="${producto.img}" alt="${producto.nombre}">
        <h2>${producto.nombre}</h2>
        <p>$${producto.precio}</p>
        <button class="boton-agregar">Agregar al carrito</button>
      `;

      crearCard.querySelector(".boton-agregar").addEventListener("click", () => {
        carrito.push(producto);
        guardarCarrito();
        mostrarCarrito();
      });

      contenedor.appendChild(crearCard);
    });
  } catch (error) {
    console.error("Error cargando los productos:", error);
  }
}

// Mostrar carrito
function mostrarCarrito() {
  carritoLista.innerHTML = "";

  if (carrito.length === 0) {
    carritoLista.innerHTML = "<p>No hay productos en el carrito</p>";
    return;
  }

  let total = 0;

  carrito.forEach((producto, index) => {
    const item = document.createElement("div");
    item.classList.add("item-carrito");
    item.innerHTML = `
      <img src="${producto.img}" alt="${producto.nombre}">
      <span>${producto.nombre}</span>
      <span>$${producto.precio}</span>
      <button class="boton-eliminar">❌</button>
    `;

    // Eliminar producto individual
    item.querySelector(".boton-eliminar").addEventListener("click", () => {
      carrito.splice(index, 1);
      guardarCarrito();
      mostrarCarrito();
    });

    carritoLista.appendChild(item);
    total += producto.precio;
  });

  const totalElemento = document.createElement("p");
  totalElemento.textContent = `Total: $${total}`;
  carritoLista.appendChild(totalElemento);

  const botonVaciar = document.createElement("button");
  botonVaciar.classList.add("boton-vaciar");
  botonVaciar.textContent = "Vaciar carrito";
  botonVaciar.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    mostrarCarrito();
  });
  carritoLista.appendChild(botonVaciar);
}

// Eventos
botonCarrito.addEventListener("click", () => {
  carritoOculto.classList.add("visible");
  mostrarCarrito();
});

cerrarCarrito.addEventListener("click", () => {
    carritoOculto.classList.remove("visible");
});

// Inicializar
mostrarProductos();
mostrarCarrito();
