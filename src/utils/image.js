const resizeImage = (img, width, height) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d');

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height)

    return canvas.toDataURL()
}

module.exports = {
    resizeImage
}