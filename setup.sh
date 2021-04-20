psql "postgres://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST/$POSTGRES_DB?sslmode=disable" <<-EOSQL

set datestyle = YMD;

create table stock (
	stockid PRIMARY KEY,
	stockname varchar not null unique,
	industry varchar
);

create table history (
	histid serial PRIMARY KEY,
	stockid int references stock(stockid),
	day date not null, 
	open real,
	high real,
	low real,
	close real,
	volume bigint,
	adj_close real
);

create table users (
	userid serial PRIMARY KEY,
	username varchar not null unique,
	password varchar not null,
	role varchar,
	email varchar unique
);

create table log (
	logid serial PRIMARY KEY,
	userid int references users(userid),
	stockid int references stock(stockid),
	trans_qty bigint not null,
	trans_date date not null
);

EOSQL