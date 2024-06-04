const zod = require('zod');

const credentialSchema = zod.object({
    username : zod.string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username cannot exceed 20 characters" }),

    password : zod.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one digit" })
})

const leaseProductSchema = zod.object({
    // userId: zod.string(),
    productName: zod.string(),
    productPrice: zod.number().gt(0, { message: "Product price must be greater than zero" }),
    quantity: zod.number().gt(0, { message: "Quantity must be greater than or equal to one" }),
    location: zod.string(),
    // isRented: zod.boolean()
});

// const updateSchema = zod.object({
//     id : zod.string()
// })

module.exports = {
    credentialSchema : credentialSchema,
    leaseProductSchema : leaseProductSchema
    // updateSchema : updateSchema
}