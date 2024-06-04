const express = require('express');
const app = express();
const zod = require('zod');
// middleware
const { User } = require('../db');
const { LeaseProduct } = require('../db');
const userMiddleware = require('../middleware');

// jwt
const jwt = require('jsonwebtoken');
const JWT_SECRET = '123456';

const { credentialSchema, leaseProductSchema } = require('../types')
// authenticating data



app.post('/signup', async function(req, res){
    const createPayload = req.body;
    const parsedPayload = credentialSchema.safeParse(createPayload);

    // Check if parsing was successful
    if(!parsedPayload.success){
        // If parsing failed, extract error messages
        const errorMessages = parsedPayload.error.issues.map(issue => issue.message);

        // Send error response with error messages
        return res.status(411).json({
            error: "Invalid input",
            errors: errorMessages
        });
    }

    // Extract username and password from the parsed payload
    const { username, password } = parsedPayload.data;

    // Check if user already exists
    const exists = await User.findOne({ username: username, password: password });
    if(exists){
        return res.status(403).json({ message: "User already exists" });
    }

    // Create new user
    await User.create({ username: username, password: password });

    // Send success response
    res.json({ message: "User created" });
});









// app.post('/signup', async function(req, res){
//     const createPayload = req.body;
//     const parsedPayload = credentialSchema.safeParse(createPayload);





    
//     if(!parsedPayload.success){
//         console.log(parsedPayload.error.issues);

//         res.status(411).json({
//             // console.log(parsedPayload.error.issues);
//             error : "You sent the wrong inputs",
//             // message : message
//         })
//         return
//     }

//     // if(parsedPayload.success){
//     const username = req.body.username;
//     const password = req.body.password;
//     const exists = await User.findOne({username : username, password : password});
//     if(exists){
//         return res.status(403).json({message : "user already exists"})
//     }
//     await User.create({
//         username : username,
//         password : password
//     })
//     res.json({message : "user created"})
//     // }
//     // else{
//     //     res.json({message})
//     // }
// });

app.post('/signin', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const exists = await User.findOne({username : username, password : password});
    if(exists){
        const token = jwt.sign({username},JWT_SECRET, { expiresIn: '1h' });  // { expiresIn: '1h' }
        res.json({token , username, message : "User signed"})
        // res.json({message : "User signed"})
    } else {
        res.json({message : "Incorrect username or password"})
    }
});







const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

// app.post("/upload-image", upload.single("image"), async (req, res) => {
//   console.log(req.body);
//   const price = req.body.price;
//   const imageName = req.file.filename;

//   try {
//     await Images.create({ price: price, image: imageName });
//     res.json({ status: "ok" });
//   } catch (error) {
//     res.json({ status: error });
//   }
// });

// app.get("/get-image", async (req, res) => {
//   try {
//     Images.find({}).then((data) => {
//       res.send({ status: "ok", data: data });
//     });
//   } catch (error) {
//     res.json({ status: error });
//   }
// });






// app.post('/leaseProduct', userMiddleware, upload.single("productImage"), async(req, res) => {
//     try {
//         // Parse and validate the incoming request body against the schema
//         const leaseProductData = leaseProductSchema.safeParse(req.body);
        
//         // Extract required fields from the parsed data
//         const { userId, productName, productPrice, quantity, location, isRented } = leaseProductData;
//         const productImage = req.file ? req.file.filename : null; // Check if file is uploaded
        
//         if(!leaseProductData.success){
//             // If parsing failed, extract error messages
//             const errorMessages = leaseProductData.error.issues.map(issue => issue.message);
    
//             // Send error response with error messages
//             return res.status(411).json({
//                 error: "Invalid input",
//                 errors: errorMessages
//             });
//         }
//         // Create a new lease product instance
//         await LeaseProduct.create({
//             userId,
//             productName,
//             productImage,
//             productPrice,
//             quantity,
//             location,
//             isRented
//         });

//         res.json({ status: "ok" });
//     } catch (error) {
//         // Handle validation errors
//         // if (error instanceof zod.ZodError) {
//         //     const errorMessages = error.errors.map(err => err.message);
//         //     return res.status(400).json({ error: "Validation error", errors: errorMessages });
//         // }
        
//         // Handle other errors
//         console.error("Error creating lease product:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });


app.post('/leaseProduct', userMiddleware, upload.single("productImage"), async (req, res) => {
    try {
        // Parse and validate the incoming request body against the schema
        const result = leaseProductSchema.safeParse({
            ...req.body,
            productPrice: Number(req.body.productPrice),
            quantity: Number(req.body.quantity)
        });

        if (!result.success) {
            // If parsing failed, extract error messages
            const errorMessages = result.error.issues.map(issue => issue.message);

            // Send error response with error messages
            return res.status(411).json({
                error: "Invalid input",
                errors: errorMessages
            });
        }

        // Extract required fields from the parsed data
        console.log(result.data);
        const { productName, productPrice, quantity, location, isRented } = result.data;
        const productImage = req.file ? req.file.filename : null; // Check if file is uploaded

        // console.log(uN);
        console.log(req.user);
        console.log(productName);
        const uN = req.user.username;
        // Create a new lease product instance
        await LeaseProduct.create({
            uN,
            productName,
            productImage,
            productPrice,
            quantity,
            location,
            isRented
        });

        res.json({ status: "ok",
        fileUrl: `/uploads/${req.file.filename}`, uN: uN });
    } catch (error) {
        console.error("Error creating lease product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});







// app.post('/leaseProduct', userMiddleware, upload.single("productImage"), async(req, res)=>{
//     // const { userId, productName, productImage, quantity, location, isRented } = req.body;
//     // const userId = req.body.userId;
//     const userId = req.body.userId;
//     const productName = req.body.productName;
//     const productImage = req.file.filename;
//     const productPrice = req.body.productPrice;
//     const quantity = req.body.quantity;
//     const location = req.body.location;
//     const isRented = req.body.isRented;



//     try {
//         // await Images.create({ price: price, image: imageName });
//         // Create a new lease product instance
//         await LeaseProduct.create({
//             userId,
//             productName,
//             productImage,
//             productPrice,
//             quantity,
//             location,
//             isRented // Include isRented field
//         });
//         res.json({ status: "ok" });
//       } catch (error) {
//         res.json({ status: error });
//       }
// })








app.get('/all-lease', userMiddleware, async(req, res)=>{
    try {
    const allPro = await LeaseProduct.find({})
    // .populate('userId', 'username') // Populate the userId field with the username
    
    // .exec((err, leaseProducts) => {
    //     if (err) {
    //         console.error(err);
    //         // Handle error
    //     } else {
    //         console.log(leaseProducts);
    //         // Do something with the lease products and associated user data
    //     }
    // });
    
//   try {
//     Images.find({}).then((data) => {
//       res.send({ status: "ok", data: data });
//     });
//   } catch (error) {
//     res.json({ status: error });
//   }
    res.json({allProducts : allPro});
} catch (error) {
  res.json({ status: error });
}
})

app.get('/product/:productId', userMiddleware, async(req, res)=>{
    const productId = req.params.productId;
    try {
    const product = await LeaseProduct.findById(productId)
    // .populate('userId', 'username') // Populate the userId field with the username
    
    // .exec((err, leaseProducts) => {
    //     if (err) {
    //         console.error(err);
    //         // Handle error
    //     } else {
    //         console.log(leaseProducts);
    //         // Do something with the lease products and associated user data
    //     }
    // });
    
//   try {
//     Images.find({}).then((data) => {
//       res.send({ status: "ok", data: data });
//     });
//   } catch (error) {
//     res.json({ status: error });
//   }
    res.json({product : product});
} catch (error) {
  res.json({ status: error });
}
})

app.get('/non-rented-leased-products', async (req, res) => {
    try {
        // Fetch leased products that are not rented
        const nonRentedLeasedProducts = await LeaseProduct.find({ isRented: false });
        res.json({ nonRentedLeasedProducts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/rent/:productId', userMiddleware, async(req, res)=>{
    const productId = req.params.productId;
    // const { isRented } = req.body;

    const leaseProduct = await LeaseProduct.findById(productId);
    console.log(leaseProduct);
        if (!leaseProduct) {
            return res.status(404).json({ message: 'Lease product not found' });
        }
        // Update the isRented status
        // leaseProduct.isRented = isRented;
        // await leaseProduct.save();

        await LeaseProduct.updateOne({
            _id : productId
        } , {
            isRented : true
        })
    return res.status(200).json({ message: 'isRented status updated successfully' });
        
})
// my leased products status


// how to show if the user has rented any product from the leased products
app.get('/user-lease', async(req, res)=>{
    // straight lesedproducts matching userId
    try {
        const userId = req.query.userId; // Assuming you're passing userId as a query parameter

        // Find all rented products by the user
        const rentedProducts = await LeaseProduct.find({ userId });

        // Find all leased products
        const leasedProducts = await LeaseProduct.find({});

        // Check if any leased product has been rented by the user
        const leasedProductRentedByUser = leasedProducts.filter(leasedProduct => {
            return rentedProducts.some(rentedProduct => rentedProduct.productName === leasedProduct.productName);
        });

        // Send the result to the client
        // console.log(leasedProductRentedByUser.length);
        if(leasedProductRentedByUser.length === 0 ){
            res.json({message: "empty"});
        } else {
            res.json({ leasedProductRentedByUser });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }

})


module.exports = app;