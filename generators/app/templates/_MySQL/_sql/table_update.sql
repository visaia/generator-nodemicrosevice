/* cw_book_meal */
alter table cw_book_meal  add  breakfast_is_refund  int not null default 0 comment '早餐退款状态: 1-已经退款， 0-未退款' after breakfast_is_cost;
alter table cw_book_meal  add breakfast_deduct_amount decimal(10,2) not null default 0 comment '早餐实际扣费金额' after breakfast_is_cost;

alter table cw_book_meal  add  lunch_is_refund  int not null default 0 comment '午餐退款状态: 1-已经退款， 0-未退款' after lunch_is_cost;
alter table cw_book_meal  add lunch_deduct_amount decimal(10,2) not null default 0 comment '午餐实际扣费金额' after lunch_is_cost;

alter table cw_book_meal  add  dinner_is_refund  int not null default 0 comment '晚餐退款状态: 1-已经退款， 0-未退款' after dinner_is_cost;
alter table cw_book_meal  add dinner_deduct_amount decimal(10,2) not null default 0 comment '晚餐实际扣费金额' after dinner_is_cost;

/*user_recharge*/
alter table user_recharge  add type_title varchar(100) not null   comment '资金变动类型实际名称' after type;
alter table user_recharge  add book_meal_id int   comment '订餐id' after attach;
alter table user_recharge  add order_id int comment '订单id' after book_meal_id;
alter table user_recharge  add eat_type varchar(255)    comment '标识是早餐午餐还是晚餐' after order_id;
alter table user_recharge  add order_status int   comment '订单状态' after eat_type;
ALTER table user_recharge  MODIFY user_id integer;

/*month_report*/
alter table month_report  add order_amount decimal(10,2) not null default 0 comment '购物消费金额' after amount;
alter table month_report  add meal_amount decimal(10,2) not null default 0 comment '食堂消费金额' after amount;
ALTER table month_report  CHANGE amount total_amount decimal(10,2) not null;