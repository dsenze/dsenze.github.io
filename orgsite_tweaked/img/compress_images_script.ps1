# Script compress PNG and JPEG in folder.
# Tool to convert and compress picture = ImageMagick. Installation and instruction found  : https://www.imagemagick.org/script/index.php


<# ABOUT Gif and PNG

GIF and PNG are lossless formats, in that the compression process does not make any visual modification to the images. For still images, PNG achieves better compression ratio with better visual quality. For animated images, consider using video element instead of a GIF, to achieve better compression.

    Always convert GIF to PNG unless the original is animated or tiny (less than a few hundred bytes).
    For both GIF and PNG, remove alpha channel if all of the pixels are opaque.

For example, you can use convert binary to optimize your GIF and PNG images with the following command (parameters inside brackets are optional):

convert INPUT.gif_or_png -strip [-resize WxH] [-alpha Remove] OUTPUT.png 

#>

Get-ChildItem | where{$_.name -match ".png" -or $_.name -match ".gif"} | ForEach-Object{
    magick convert $_.name -strip $_.name
}

<# ABOUT Jpeg Compression


JPEG is a lossy format. The compression process removes visual details of the image, but the compression ratio can be 10x larger than GIF or PNG.

    Reduce quality to 85 if it was higher. With quality larger than 85, the image becomes larger quickly, while the visual improvement is little.
    Reduce Chroma sampling to 4:2:0, because human visual system is less sensitive to colors as compared to luminance.
    Use progressive format for images over 10k bytes. Progressive JPEG usually has higher compression ratio than baseline JPEG for large image, and has the benefits of progressively rendering.
    Use grayscale color space if the image is black and white.

For example, you can use convert binary to optimize your JPEG images with the following command (parameters inside brackets are optional):

convert INPUT.jpg -sampling-factor 4:2:0 -strip [-resize WxH] [-quality N] [-interlace JPEG] [-colorspace Gray/RGB] OUTPUT.jpg #>

Get-ChildItem | where{$_.name -match ".jpeg" -or $_.name -match ".jpg"} | ForEach-Object{
    magick convert $_.name -sampling-factor '4:2:0' -strip -quality 50 -interlace JPEG -colorspace RGB $_.name
}

