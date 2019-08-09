all:
	zip -0Xq book.epub mimetype
	zip -Xr9Dq book.epub *

clean:
	rm -rf book.epub

ncx:
	sed -n '/<h[2-6]/p' OEBPS/content.html | sed 's/<h[2-6] id="\(.*\)">\(.*\)<\/h[2-6]>/<navPoint id="\1" playOrder=""><navLabel><text>\2<\/text><\/navLabel><content src="content\.html#\1"\/><\/navPoint>/'
