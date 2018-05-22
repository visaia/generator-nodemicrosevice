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
   limit_amount         decimal(10,2) not null default 1000 comment '组内人员，最大超支额度。',
   recharge             decimal(10,2) not null default 300 comment '默认每次充值额度。',
   createAt             datetime not null,
   updateAt             datetime not null,
   primary key (id)
);

alter table cw_group comment '用户分组表，主要是财务把用户分组而使用， 充值是根据用户组来充值的。';

/*==============================================================*/
/* Table: cw_money_record                                       */
/*==============================================================*/
create table one_card.cw_money_record
(
   id                   int(11) not null auto_increment,
   user_id              national varchar(100) not null,
   amount               decimal(10,2) not null comment '消费/退款/充值金额。',
   type                 smallint not null default 0 comment '0-充值 1-消费 2-退款c',
   operate_user_id      int(11) not null comment '操作员ID：充值人员ID， 系统ID（1），员工ID。',
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
   cw_group_id          int(11) comment '保存着些用户所属的组， 为了少查询一张表。',
   amount               decimal(10,2) not null comment '正数：可以继续余额消费，
            负数：使用预借金消费，预借金额度请查看cw_group。',
   status               int(11) not null default 0,
   is_delete            int(11) not null default 0,
   createdAt            datetime not null,
   updatedAt            datetime not null,
   primary key (id)
);

alter table one_card.cw_user_asses comment '用户资产表。余额多少。每个人只有一条，每次消费都作减或加';

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

alter table cw_user_group comment '组和用户的关系，主要是在财务充值使用。';

/*==============================================================*/
/* Table: "order"                                               */
/*==============================================================*/
create table one_card."order"
(
   id                   int(11) not null auto_increment,
   user_id              national varchar(255) not null,
   amount               decimal(10,2) not null,
   status               smallint not null default 0 comment '0-提交 1-接受订单 2-等待收货 3-订单完成 4-拒绝订单 5-取消订单',
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

alter table one_card.product comment '产品';

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
   type                 int(11) not null comment '0-新增订单 1 -订单状态更新',
   is_read              int(11) not null default 0,
   attach               national varchar(255) not null comment '额外信息。如：定单ID。',
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
   role                 varchar(150) not null comment '角色名',
   remark               varbinary(150) comment '角色备注',
   primary key (id)
);

alter table role comment '用户角色表';

/*==============================================================*/
/* Table: user                                                  */
/*==============================================================*/
create table one_card.user
(
   id                   int(11) not null auto_increment comment '以后一卡通里，所有关联ID，都使用这个ID。',
   job_mumber           national varchar(100) not null comment '工号，来自BPM',
   serial_number        national varchar(255) not null comment '扫码卡号',
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
   role_id              int(11) not null comment '关联角色表的ID',
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

