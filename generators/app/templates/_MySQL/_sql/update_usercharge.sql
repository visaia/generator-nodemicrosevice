alter table user_recharge  add type_title varchar(100) not null   comment '资金变动类型实际名称' after type
alter table user_recharge  add book_meal_id int not null   comment '订餐id' after attach
alter table user_recharge  add order_id int not null   comment '订单id' after book_meal_id
alter table user_recharge  add eat_type varchar(255) not null   comment '标识是早餐午餐还是晚餐' after order_id
alter table user_recharge  add order_status int not null   comment '订单状态' after eat_type
alter table cw_shop add status int not null comment '营业状态' after name