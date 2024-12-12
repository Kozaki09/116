CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL
);

CREATE TABLE authors (
	id SERIAL PRIMARY KEY,
	auth_name TEXT NOT NULL UNIQUE
);

CREATE TABLE publishers (
	id SERIAL PRIMARY KEY,
	pub_name TEXT NOT NULL UNIQUE
);

CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	isbn TEXT NOT NULL UNIQUE,
	title TEXT NOT NULL,
	author TEXT REFERENCES authors(auth_name) ON DELETE CASCADE,
	publisher TEXT REFERENCES publishers(pub_name) ON DELETE CASCADE,
	year_publication TEXT,

	availability TEXT NOT NULL -- PUBLIC | PRIVATE | UNLISTED --
);

CREATE TABLE genres (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL UNIQUE
);

CREATE TABLE book_genres (
	book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
	genre_id INT NOT NULL REFERENCES genres(id) ON DELETE CASCADE,

	PRIMARY KEY (book_id, genre_id)
);

