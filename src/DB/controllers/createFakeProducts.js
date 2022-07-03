import { faker } from '@faker-js/faker';

faker.setLocale('es');

const createFakeProducts = async () => {
    let products = [];
    for (let i = 0; i < 5; i++) {
        const product = {
            id: 1 + i,
            nombre: faker.commerce.product(),
            precio: faker.commerce.price(),
            foto: faker.image.food(300, 200, true),
            stock: faker.random.numeric(3),
        }
        products.push(product);
    }
    return products;
}

export { createFakeProducts };