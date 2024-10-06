const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowed_formats: ["png", "jpg", "jpeg"],
    },
});