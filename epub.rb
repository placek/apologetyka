require 'securerandom'
require 'yaml'
require 'erb'
require 'nokogiri'
require 'fileutils'
require 'tmpdir'

class Renderer
  def initialize(path)
    @id = SecureRandom.uuid
    @doc = Nokogiri::HTML(File.open(path, 'r'))
    @title = @doc.css('title').text
    @toc = @doc.css('h2,h3,h4,h5,h6').map { |e| [e.attributes['id'].value, e.text] }.to_h
  end

  def doc
    @doc.css('nav,footer,head *').each { |e| e.remove }
    # Nokogiri::XML::Builder.with(@doc.at('head')) do |xml|
    #   xml.link('rel' => 'stylesheet', 'type' => 'text/css', 'href' => 'stylesheet.css')
    # end
    @doc.to_s.lines[1..-1].join.gsub(/\s+\n/, "\n")
  end

  def method_missing(name)
    ERB.new(data[name.to_s]).result(binding).gsub(/\s+\n/, "\n")
  end

  private

  def data
    @data ||= YAML.load(DATA.read)
  end
end

class DirStruct
  def initialize(arg)
    @path = arg.split('/').last.split('.').first
    @renderer = Renderer.new(arg)
  end

  def call
    FileUtils.mkdir_p(["#{root}/META-INF", "#{root}/OEBPS"])
    map.each do |path, value|
      file = File.open([root, path].join('/'), 'w')
      file.write(value)
      file.close
    end
    Dir.chdir(root) {
      %x[zip -0Xq #{@path}.epub mimetype]
      %x[zip -Xr9Dq #{@path}.epub *]
    }
    puts root
  end

  private

  def map
    {
      'mimetype' => @renderer.mimetype,
      'META-INF/container.xml' => @renderer.xml,
      'OEBPS/toc.ncx' => @renderer.ncx,
      'OEBPS/content.opf' => @renderer.opf,
      'OEBPS/content.html' => @renderer.doc,
      'OEBPS/stylesheet.css' => @renderer.css
    }
  end

  def root
    @root ||= [dir, @path].join('/')
  end

  def dir
    @dir ||= Dir.tmpdir
  end
end

if ARGV[0]
  DirStruct.new(ARGV[0]).call
else
  $stderr.puts 'error: missing XHTML file path'
  exit 1
end

__END__
mimetype: 'application/epub+zip'
xml: |
  <?xml version="1.0"?>
  <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
    <rootfiles>
      <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" />
    </rootfiles>
  </container>
opf: |
  <?xml version='1.0' encoding='utf-8'?>
  <package xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" unique-identifier="bookid" version="2.0">
    <metadata>
      <dc:title><%= @title %></dc:title>
      <dc:creator><%= @creator %></dc:creator>
      <dc:identifier id="bookid">urn:uuid:<%= @id %></dc:identifier>
      <dc:language>pl-PL</dc:language>
    </metadata>
    <manifest>
      <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
      <item id="content" href="content.html" media-type="application/xhtml+xml"/>
      <item id="css" href="stylesheet.css" media-type="text/css"/>
    </manifest>
    <spine toc="ncx">
      <itemref idref="content"/>
    </spine>
  </package>
ncx: |
  <?xml version='1.0' encoding='utf-8'?>
  <!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
  <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
    <head>
      <meta name="dtb:uid" content="urn:uuid:<%= @id %>"/>
      <meta name="dtb:depth" content="1"/>
      <meta name="dtb:totalPageCount" content="0"/>
      <meta name="dtb:maxPageNumber" content="0"/>
    </head>
    <docTitle><text><%= @title %></text></docTitle>
    <navMap>
      <% @toc.each_with_index do |(id, name), index| %>
        <navPoint id="<%= id %>" playOrder="<%= index + 1 %>"><navLabel><text><%= name %></text></navLabel><content src="content.html#<%= id %>"/></navPoint>
      <% end %>
    </navMap>
  </ncx>
css: |
  body  { line-height: 1.6; }
  h1    { font-size: 2.0em; }
  h2    { font-size: 1.8em; }
  h3    { font-size: 1.6em; }
  h4    { font-size: 1.4em; }
  h5    { font-size: 1.2em; }
  h6    { font-size: 1.0em; }
  hr    { height: 0 }
  table { width: 100%; margin: 1em 0; }
  td    { border-left: .5px solid; padding: 0 .4em; }
  em    { font-style: normal; }
  nav   { display: none; }
  td:last-of-type { border-right: .5px solid; }
  h1, h2, h3, h4, h5, h6 { line-height: 1.2; }
