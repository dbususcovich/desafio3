import { log } from "console";
import { promises } from "dns";
import fs from "fs";
import { get } from "http";


class ProductManager {
    constructor() {
        this.products = [];
    }

    addProduct(product) {
        const { title, description, price, thumbnail, stock } = product;

        if (
            title == null ||
            description == null ||
            price == null ||
            thumbnail == null ||
            stock == null
        ) {
            console.log("Debe llenar todos los campos");
            return;
        }

        const newProduct = { ...product };
        newProduct.code = this.generateNewCode();

        this.products.push(newProduct);
        this.saveProductsToFile();
    }

    getProducts() {
        this.loadProductsFromFile();
        return this.products;
    }

    getProductById(id) {
        this.loadProductsFromFile();
        const product = this.products.find((product) => product.code === id);
        return product || null;
    }

    updateProduct(id, updatedFields) {
        this.loadProductsFromFile();
        const productIndex = this.products.findIndex((product) => product.code === id);

        if (productIndex === -1) {
            console.log("No se encontró el producto con el ID especificado");
            return;
        }

        this.products[productIndex] = { ...this.products[productIndex], ...updatedFields };
        this.saveProductsToFile();
    }

    deleteProduct(id) {
        this.loadProductsFromFile();
        const productIndex = this.products.findIndex((product) => product.code === id);

        if (productIndex === -1) {
            console.log("No se encontró el producto con el ID especificado");
            return;
        }

        this.products.splice(productIndex, 1);
        this.saveProductsToFile();
    }

    generateNewCode() {
        if (this.products.length === 0) {
            return 1;
        } else {
            const lastProduct = this.products[this.products.length - 1];
            return lastProduct.code + 1;
        }
    }

    saveProductsToFile() {
        const data = JSON.stringify(this.products);
        fs.writeFileSync('products.json', data);
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync('products.json', 'utf8');
            this.products = JSON.parse(data);
        } catch (err) {
            this.products = [];
        }
    }
}

const productManager = new ProductManager();

productManager.addProduct({
    title: "Termo",
    description: "Termo Stanley",
    price: 99,
    thumbnail: "www.images.termostanley.com",
    stock: 100
});

productManager.addProduct({
    title: "Termo",
    description: "Termo Luminagro",
    price: 49,
    thumbnail: "www.images.termosluminagro.com",
    stock: 100
});

productManager.addProduct({
    title: "Mate",
    description: "Mate Uruguayo",
    price: 14,
    thumbnail: "www.images.mateuru.com",
    stock: 100
});

console.log(productManager.getProductById(1));
console.log(productManager.getProductById(2));

productManager.updateProduct(2, { price: 59, stock: 50 });
console.log(productManager.getProductById(2));

productManager.deleteProduct(1);
console.log(productManager.getProductById(1));
