create table staff (
       id int not null AUTO_INCREMENT,
       firstName varchar(32) not null,
       lastName varchar(32) not null,
       phoneNumber varchar(16) not null,
       emailAddress varchar(128) not null,
       password varchar(64) not null,
       permissions varchar(32) not null,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       unique (emailAddress),
       unique (phoneNumber)
       );

create table studio (
       id int not null AUTO_INCREMENT,
       studioNum varchar(8) not null,
       studioName varchar(64) not null,
       phoneNumber varchar(16) not null,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       unique (studioNum)
       );

create table marketingSource (
       id int not null AUTO_INCREMENT,
       marketingName varchar(64) not null,
       currentlyActive boolean not null,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       unique (marketingName)
       );

create table clients (
       id int not null AUTO_INCREMENT,
       studioId int not null,
       firstName varchar(32) not null,
       lastName varchar(32) not null,
       phoneNumber varchar(16) not null,
       emailAddress varchar(128) not null,
       clientType varchar (32) not null,
       numVisits int not null,
       prospectSource int,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       unique (emailAddress),
       unique (phoneNumber),
       foreign key (prospectSource) references marketingSource(id) on delete set null,
       foreign key (studioId) references studio(id) on delete restrict
       );

create table referral (
       id int not null AUTO_INCREMENT,
       referredId int not null,
       referrerId int not null,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       foreign key (referredId) references clients(id) on delete cascade,
       foreign key (referrerId) references clients(id) on delete cascade,
       unique (referredId)
       );

create table worksAt (
       id int not null AUTO_INCREMENT,
       studioId int not null,
       employeeId int not null,
       jobRole varchar(32) not null,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       unique (studioId, employeeId, jobRole),
       foreign key (studioId) references studio(id) on delete cascade,
       foreign key (employeeId) references staff(id) on delete cascade
       );

create table saleItem (
       id int not null AUTO_INCREMENT,
       membershipName varchar(64) not null,
       membershipPrice int not null,
       membershipType varchar (16) not null,
       available boolean not null,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       unique (membershipName)
       );

create table hrms (
       id int not null AUTO_INCREMENT,
       hrmName varchar(32) not null,
       price int not null,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       unique (hrmName)
       );

create table sales (
       id int not null AUTO_INCREMENT,
       clientId int not null,
       fcId int not null,
       saleItemId int not null,
       hrmId int,
       saleKind varchar(32) not null,
       dateSold date not null,
       postDated boolean not null,
       postDate date,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       foreign key (clientId) references clients(id) on delete restrict,
       foreign key (fcId) references staff(id) on delete restrict,
       foreign key (saleItemId) references saleItem(id) on delete restrict,
       foreign key (hrmId) references hrms(id) on delete restrict,
       unique (clientId)
       );

create table appointments (
       id int not null AUTO_INCREMENT,
       stuioId int not null,
       clientId int not null,
       schedulerId int not null,
       apptDate datetime not null,
       fcId int,
       coachId int,
       showed boolean,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       unique (clientId, apptDate),
       foreign key (clientId) references clients(id) on delete restrict,
       foreign key (fcId) references staff(id) on delete set null,
       foreign key (schedulerId) references staff(id) on delete restrict
       );

create table visitSales (
       id int not null AUTO_INCREMENT,
       appointmentId int not null,
       saleId int not null,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       unique (appointmentId),
       unique (saleId),
       foreign key (appointmentId) references appointments(id) on delete restrict,
       foreign key (saleId) references sales(id) on delete cascade
       );

create table clientNotes (
       id int not null AUTO_INCREMENT,
       clientId int not null,
       fcId int not null,
       note mediumtext not null,
       dateNoted datetime not null,
       createdOn datetime not null,
       lastUpdated datetime not null,
       primary key (id),
       foreign key (clientId) references clients(id) on delete cascade,
       foreign key (fcId) references staff(id) on delete restrict
       );
       
create table serverLogs (
       id int not null AUTO_INCREMENT,
        staffId int not null,
        dataLog mediumtext not null,
        createdOn datetime not null,
        primary key (id),
        foreign key (staffId) references staff(id)
        );
