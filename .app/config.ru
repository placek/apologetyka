# encoding: UTF-8

require 'rubygems'
require 'json'
require 'roda'
require 'slim'
require 'sqlite3'

Book = Struct.new(:id, :abbr, :names, :description) do
  def initialize(id, abbr, names, description)
    super(id, abbr, JSON.parse(names), description)
  end
end

Verse = Struct.new(:id, :book, :chapter, :verse, :text, :lang, :strong, :morphology, :footnotes, :links, :story, :comment) do
  def initialize(id, book, chapter, verse, text, lang, strong, morphology, footnotes, links, story, comment)
    super(id, book, chapter, verse, text, lang, JSON.parse(strong), JSON.parse(morphology), JSON.parse(footnotes), JSON.parse(links), story, comment)
  end
end

class Bible < Roda
  plugin :render, engine: 'slim'
  db = SQLite3::Database.new('db.sqlite3')

  route do |r|
    r.root do
      @langs = %w(el la pl)
      @books = db.execute('SELECT * FROM books').map { |a| Book.new(*a) }
      @verses = db.execute("SELECT * FROM verses WHERE book = '#{r.params['q']}' AND lang IN ('#{@langs.join("','")}') ORDER BY CASE lang #{@langs.map.with_index { |l, i| " WHEN '#{l}' THEN #{i}" }.join} END").map { |a| Verse.new(*a) }.group_by(&:lang).values.flatten
      view 'index'
    end
  end
end

run Bible.freeze.app
