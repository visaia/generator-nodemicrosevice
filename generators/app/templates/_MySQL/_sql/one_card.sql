/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2017/4/21 10:49:07                           */
/*==============================================================*/


drop table if exists cw_group;

drop index userId_index on one_card.cw_money_record;

drop table if exists one_card.cw_money_record;

drop index userId_index on one_card.cw_user_asses;

drop table if exists one_card.cw_user_asses;

drop table if exists cw_user_group;

drop index userId_index on one_card."order";

drop table if exists one_card."order";

drop index orderId_index on one_card.order_detail;

drop table if exists one_card.order_detail;

drop table if exists one_card.product;

drop table if exists one_card.product_group;

drop table if exists one_card.remind;

drop table if exists role;

drop table if exists one_card.user;

drop index userId_index on one_card.user_role;

drop table if exists one_card.user_role;

/*==============================================================*/
/* User: one_card                                               */
/*==============================================================*/
create user one_card;

/*==============================================================*/
/* Table: cw_group                                              */
/*==============================================================*/
create table cw_group
(
   id                   int not null,
   name                 varchar(150) not null,
   limit_amount         decimal(10,2) not null default 1000 comment '������Ա�����֧��ȡ�',
   recharge             decimal(10,2) not null default 300 comment 'Ĭ��ÿ�γ�ֵ��ȡ�',
   createAt             datetime not null,
   updateAt             datetime not null,
   primary key (id)
);

alter table cw_group comment '�û��������Ҫ�ǲ�����û������ʹ�ã� ��ֵ�Ǹ����û�������ֵ�ġ�';

/*==============================================================*/
/* Table: cw_money_record                                       */
/*==============================================================*/
create table one_card.cw_money_record
(
   id                   int(11) not null auto_increment,
   user_id              national varchar(100) not null,
   amount               decimal(10,2) not null comment '����/�˿�/��ֵ��',
   type                 smallint not null default 0 comment '0-��ֵ 1-���� 2-�˿�c',
   operate_user_id      int(11) not null comment '����ԱID����ֵ��ԱID�� ϵͳID��1����Ա��ID��',
   is_delete            int(11) not null default 0,
   createdAt            datetime not null,
   updatedAt            datetime not null,
   primary key (id)
);

/*==============================================================*/
/* Index: userId_index                                          */
/*==============================================================*/
create index userId_index on one_card.cw_money_record
(
   user_id
);

/*==============================================================*/
/* Table: cw_user_asses                                         */
/*==============================================================*/
create table one_card.cw_user_asses
(
   id                   int(11) not null auto_increment,
   user_id              int(11) not null,
   cw_group_id          int(11) comment '������Щ�û��������飬 Ϊ���ٲ�ѯһ�ű�',
   amount               decimal(10,2) not null comment '���������Լ���������ѣ�
            ������ʹ��Ԥ������ѣ�Ԥ�������鿴cw_group��',
   status               int(11) not null default 0,
   is_delete            int(11) not null default 0,
   createdAt            datetime not null,
   updatedAt            datetime not null,
   primary key (id)
);

alter table one_card.cw_user_asses comment '�û��ʲ��������١�ÿ����ֻ��һ����ÿ�����Ѷ��������';

/*==============================================================*/
/* Index: userId_index                                          */
/*==============================================================*/
create index userId_index on one_card.cw_user_asses
(
   user_id
);

/*==============================================================*/
/* Table: cw_user_group                                         */
/*==============================================================*/
create table cw_user_group
(
   id                   int(11 not null,
   user_id              int not null,
   cw_group_id          int not null,
   createAt             datetime not null,
   updateAt             datetime not null,
   primary key (id)
);

alter table cw_user_group comment '����û��Ĺ�ϵ����Ҫ���ڲ����ֵʹ�á�';

/*==============================================================*/
/* Table: "order"                                               */
/*==============================================================*/
create table one_card."order"
(
   id                   int(11) not null auto_increment,
   user_id              national varchar(255) not null,
   amount               decimal(10,2) not null,
   status               smallint not null default 0 comment '0-�ύ 1-���ܶ��� 2-�ȴ��ջ� 3-������� 4-�ܾ����� 5-ȡ������',
   submit_time          datetime not null,
   accept_time          datetime,
   ready_time           datetime,
   finish_time          datetime,
   cancel_time          datetime,
   reject_time          datetime,
   book_time            datetime,
   remark               national varchar(100),
   reject_remark        national varchar(100),
   cancel_remark        national varchar(100),
   is_delete            int(11) not null default 0,
   createdAt            datetime not null,
   updatedAt            datetime not null,
   primary key (id)
);

/*==============================================================*/
/* Index: userId_index                                          */
/*==============================================================*/
create index userId_index on one_card."order"
(
   user_id
);

/*==============================================================*/
/* Table: order_detail                                          */
/*==============================================================*/
create table one_card.order_detail
(
   id                   int(11) not null auto_increment,
   order_id             int(11) not null,
   product_id           int(11) not null,
   price                decimal(10,2) not null,
   count                int(11) not null,
   amount               decimal(10,2) not null,
   is_delete            int(11) not null default 0,
   createdAt            datetime not null,
   updatedAt            datetime not null,
   primary key (id)
);

/*==============================================================*/
/* Index: orderId_index                                         */
/*==============================================================*/
create index orderId_index on one_card.order_detail
(
   order_id
);

/*==============================================================*/
/* Table: product                                               */
/*==============================================================*/
create table one_card.product
(
   id                   int(11) not null auto_increment,
   name                 national varchar(50) not null,
   product_group_id     int(11) default 0,
   "describe"           national varchar(100) not null,
   sort                 int(11) default 0,
   price                decimal(10,2) not null,
   img                  national varchar(255) not null,
   count                int(11) not null,
   status               int(11) not null,
   create_user_id       national varchar(100) not null,
   is_delete            int(11) not null default 0,
   createdAt            datetime not null,
   updatedAt            datetime not null,
   primary key (id)
);

alter table one_card.product comment '��Ʒ';

/*==============================================================*/
/* Table: product_group                                         */
/*==============================================================*/
create table one_card.product_group
(
   id                   int(11) not null auto_increment,
   name                 national varchar(255) not null,
   is_delete            int(11) not null default 0,
   createdAt            datetime not null,
   updatedAt            datetime not null,
   primary key (id)
);

/*==============================================================*/
/* Table: remind                                                */
/*==============================================================*/
create table one_card.remind
(
   id                   int(11) not null auto_increment,
   msg                  national varchar(255) not null,
   type                 int(11) not null comment '0-�������� 1 -����״̬����',
   is_read              int(11) not null default 0,
   attach               national varchar(255) not null comment '������Ϣ���磺����ID��',
   is_delete            int(11) not null default 0,
   createdAt            datetime not null,
   updatedAt            datetime not null,
   primary key (id)
);

/*==============================================================*/
/* Table: role                                                  */
/*==============================================================*/
create table role
(
   id                   int not null,
   role                 varchar(150) not null comment '��ɫ��',
   remark               varbinary(150) comment '��ɫ��ע',
   primary key (id)
);

alter table role comment '�û���ɫ��';

/*==============================================================*/
/* Table: user                                                  */
/*==============================================================*/
create table one_card.user
(
   id                   int(11) not null auto_increment comment '�Ժ�һ��ͨ����й���ID����ʹ�����ID��',
   job_mumber           national varchar(100) not null comment '���ţ�����BPM',
   serial_number        national varchar(255) not null comment 'ɨ�뿨��',
   createdAt            datetime not null,
   updatedAt            datetime not null,
   primary key (id)
);

/*==============================================================*/
/* Table: user_role                                             */
/*==============================================================*/
create table one_card.user_role
(
   id                   int(11) not null auto_increment,
   user_id              int(11) not null,
   role_id              int(11) not null comment '������ɫ���ID',
   is_delete            smallint not null default 0,
   createdAt            datetime not null,
   updatedAt            datetime not null,
   primary key (id)
);

/*==============================================================*/
/* Index: userId_index                                          */
/*==============================================================*/
create index userId_index on one_card.user_role
(
   user_id
);

