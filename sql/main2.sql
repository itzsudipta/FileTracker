-- CREATING THE UUID EXTENSION FOR MY PROJECT

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"


-- Now checking it version , it has two version , one is verison 1 and other is version 4

select uuid_generate_v1();
select uuid_generate_v4();

--this section only for password hasing 
CREATE EXTENSION IF NOT EXISTS pgcrypto;



--Data fetching secion 

select * from org;

-- Creating organization Table 

create table org (

	org_id uuid NOT NULL,
	org_name varchar(100) NOT NULL,
	domain_name varchar(50) default '@abc.org',
	plan_id uuid ,
	created_at timestamp default current_timestamp NOT NULL,
	storage_limit  varchar(50) NOT NUll 
	
);
-- add primary key constraints for organization table

alter table org
	add primary key(org_id);

--add foreign key with the plan 

alter table subscrip 
	add foreign key (plan_id) references plan(plan_id);

--creating user table 

create table user_data(

	user_id uuid NOT NULL,
	primary key(user_id),
	org_id uuid NOT NULL,
	foreign key (org_id) references org(org_id),
	user_name text NOT NULL,
	user_emain text NOT NULL,
	u_password text NOT NULL ,
	u_role text default 'Admin' NOT NULL ,
	joined_at timestamp default  current_timestamp NOT NULL,
	login_at timestamp default  current_timestamp NOT NULL,
	is_active boolean NOT NULL default 'true'
	
);


--creating file table for storing file information 

create table file_data (

	file_id uuid NOT NULL,
	primary key (file_id),
	owner_id uuid NOT NULL,
	Foreign key (owner_id) references user_data(user_id),
	org_id uuid NOT NULL ,
	Foreign key (org_id) references org(org_id),
	filename text NOT NULL,
	storage_path text NOT NULL default 'local',
	file_type text NOT NULL ,
	file_size integer NOT NULL ,
	checksum text ,
	uploaded_at timestamp default current_timestamp NOT NULL,
	is_deleted boolean NOT NULL 
);


--creating file version table for storing file meta data

create table file_md (

	version_id uuid NOT NULL ,
	primary key(version_id),
	file_id uuid NOT NULL,
	foreign key (file_id) references file_data(file_id),
	ver_no integer NOT NULL default '1',
	storage_path text NOT NULL,
	created_at timestamp default current_timestamp,
	changelog text NOT NULL 
	

);

--creating fileacces table for store accesing data overall file system

create table fileAcces (

	acces_id uuid NOT NULL,
	primary key (acces_id),
	file_id uuid NOT NULL,
	Foreign key (file_id) references file_data(file_id),
	access_type text NOT NULL default 'public',
	shared_with uuid , 
	foreign key (shared_with) references user_data(user_id),
	expiry_date date , 
	max_download integer ,
	pwd_protect boolean NOT NULL,
	access_status text NOT NULL default 'Active'
	
);

-- creating file analytics table for analysis the data 

create table fileAnly (

	anly_id uuid NOT NULL,
	primary key (anly_id),
	file_id uuid NOT NULL,
	foreign key (file_id) references file_data(file_id),
	view_count integer NOT NULL ,
	download_count integer NOT NULL , 
	last_accesed timestamp ,
	unique_users integer 
	
	
	);

-- creating activity log table for use for file

create table actv_log (

	log_id uuid NOT NULL,
	primary key(log_id),
	user_id uuid NOT NULL,
	foreign key (user_id) references user_data(user_id),
	file_id uuid ,
	foreign key (file_id) references file_data(file_id),
	action_log text NOT NULL , 
	log_time timestamp NOT NULL ,
	ip_add text ,
	descrp text 

);

--creating meta data table for meta data extraction 

create table metadata (

meta_id uuid NOT NULL,
primary key (meta_id ),
file_id uuid NOT NULL ,
	foreign key (file_id) references file_data(file_id),
summary text ,
keywords text[] ,
lang text,
content_type text NOT NULL,
indexed_at timestamp NOT NULL

);


--creating table for embeddingIndex table 

create table embedd_index(
	embed_id uuid NOT NULL,
	primary key(embed_id),
	file_id uuid NOT NULL,
	foreign key (file_id) references file_data(file_id),
	vector_data JSON NOT NULL ,
	model_used text not null,
	created_at timestamp not null
	

);

--creating table for subscription Table

create table subscrip(

subscrip_id uuid NOT NULL,
primary key(subscrip_id),
org_id uuid NOT NULL,
	foreign key (org_id) references org(org_id),
plan_id uuid NOT NULL, -- after creating the plan table i have to add the foreign key with this 
start_date date not null,
end_date date not null ,
status text not null

);

--creating table for plan secction 

create table plan (

plan_id uuid NOT NULL,
primary key(plan_id),
plan_name text NOT NULL,
storage_limit integer NOT NULL ,
api_limit integer ,
price_per_mnth decimal NOT NULL,
ai_feature text[]
);


--creatin Notification table 

create table notification (

notification_id uuid NOT NULL,
primary key (notification_id),
User_id uuid NOT NULL,
	foreign key (user_id) references user_data(user_id),
notification_type text not null,
Notification_message text not null ,
is_read boolean not null,
create_at Timestamp not null 
);

--crating webhooks table

create table webhookstable (

	webhook_id uuid NOT NULL,
	primary key(webhook_id),
	org_id uuid not null,
	foreign key (org_id) references org(org_id),
	url text not null,
	event_type text not null,
	secret_token text not null,
	is_active boolean not null 
);


