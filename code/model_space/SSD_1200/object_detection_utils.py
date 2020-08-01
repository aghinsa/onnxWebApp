# Source : https://towardsdatascience.com/playing-with-object-detection-8f116ec0ce4d

import PIL.ImageFont as ImageFont
import PIL.ImageDraw as ImageDraw
import random

FONT_NAME = "Ubuntu-R.ttf"
TEXT_COLOR = "Black"

COLORS = ["Green", "Red", "Pink", "Olive", "Brown", "Gray", "Cyan", "Orange"]


def get_suitable_font_for_text(text, img_width, font_name, img_fraction=0.12):
    """
    Calculates a suitable font for the image given the text and fraction.
    :param text: text that will be drawn
    :param img_width: width of the image
    :param font_name: name of the font
    :param img_fraction: optional desired image fraction allowed for the text 
    :return: suitable font
    """
    fontsize = 1
    font = ImageFont.truetype(FONT_NAME, fontsize)
    while font.getsize(text)[0] < 0.5 * img_fraction * img_width:
        fontsize += 1
        font = ImageFont.truetype(font_name, fontsize)
    return font


def draw_bounding_box_on_image(image, box, box_label, scale=True):
    """
    Draws the box and label on the given image.
    :param image: PIL image
    :param box: numpy array containing the bounding box information
                [top, left, bottom, right]
    :param color: bounding box color
    :param box_label: bounding box label
    """
    # im_width, im_height = image.size
    im_height, im_width = image.size

    # this order might change depending on the ouput of the network
    left, top, right, bottom = box
    if scale:
        # Normalize coordinates
        left = left * im_width
        right = right * im_width
        top = top * im_height
        bottom = bottom * im_height

    color_idx = random.randint(0, len(COLORS) - 1)
    color = COLORS[color_idx]

    # Draw the detected bounding box
    line_width = int(max(im_width, im_height) * 0.005)
    draw = ImageDraw.Draw(image)
    draw.rectangle(((left, top), (right, bottom)), width=line_width, outline=color)
    draw.rectangle(((left, top), (right, bottom)), width=line_width, outline=color)

    # Get a suitable font (in terms of size with respect to the image)
    font = get_suitable_font_for_text(box_label, im_width, FONT_NAME)
    text_width, text_height = font.getsize(box_label)

    # Draw the box label rectangle
    text_bottom = top + text_height
    text_rect = (
        (left, top),
        (left + text_width + 2 * line_width, text_bottom + 2 * line_width),
    )
    draw.rectangle(text_rect, fill=color)

    # Draw the box label text
    # right below the upper-left horizontal line of the bounding box
    text_position = (left + line_width, top + line_width)
    draw.text(text_position, box_label, fill=TEXT_COLOR, font=font)
