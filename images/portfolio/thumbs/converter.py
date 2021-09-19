import os, sys
from PIL import Image

size = 360, 300

for infile in sys.argv[1:]:
    outfile = os.path.splitext(infile)[0] +"_1"+ ".jpg"
    if infile != outfile:
        try:
            im = Image.open(infile)
            im.thumbnail(size, Image.ANTIALIAS)
            im.save(outfile, "JPEG")
        except IOError:
            print ("cannot create thumbnail for '%s'" % infile)
