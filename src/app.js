document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Croissant", img: "1.jpg", price: 30000 },
      { id: 2, name: "Black Forest Cake", img: "2.jpg", price: 254000 },
      { id: 3, name: "Red Velvet", img: "3.jpg", price: 31000 },
      { id: 4, name: "Tiramisyu", img: "4.jpg", price: 28000 },
      { id: 5, name: "Ice Matcha Latte", img: "5.jpg", price: 32000 },
      { id: 6, name: "Coffee Latte", img: "6.jpg", price: 27000 },

    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // Jika belum ada / cart masi kosong

      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // Jika barang sudah ada,cek apakah barang beda atau sama dengan ada yang di cart
        this.items = this.items.map((item) => {
          // Jika barangnya beda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // Jika barang sudah ada,tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yang mau diremove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // Jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // Telusuri satu satu
        this.items = this.items.map((item) => {
          // Jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // Jika barangnya sisa satu
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});


// Form Validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function(){
  for(let i = 0; i < form.elements.length; i++){
if(form.elements[i].value.length !== 0) {
  checkoutButton.classList.remove('disabled');
  checkoutButton.classList.add('disabled');
} else {
  return false;
}
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove('disabled');
});

// Kirim data ketika tombol checkout di klik
checkoutButton.addEventListener('click', function(e){
e.preventDefault();
const formData = new FormData(form);
const data = new URLSearchParams(formData);
const objData = Object.fromEntries(data);
const message = formatMessage(objData);
window.open('http://wa.me/6285731684011?text=' + encodeURIComponent(message));
});

// Format pesan whatsapp
const formatMessage = (obj) => {
return `Data Customer
Nama: ${obj.name}
Email: ${obj.email}
No HP: ${obj.phone}
Data pesanan
${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`)}
TOTAL: ${rupiah(obj.total)}
Terima Kasih.`;  
};

//konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
