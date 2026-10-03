create table products(sku text primary key,title text not null,category text not null,price numeric not null,stock int not null check(stock>=0),description text,image_url text);
create table orders(id bigserial primary key,number text unique not null,name text,email text,address text,city text,country text,payment_method text,payment_status text default 'Pending',fulfillment_status text default 'Unfulfilled',carrier text,tracking text,total numeric,archived boolean default false,created_at timestamptz default now());
create table order_items(id bigserial primary key,order_id bigint references orders(id) on delete cascade,sku text,title text,price numeric,qty int);
alter table products enable row level security;alter table orders enable row level security;alter table order_items enable row level security;
create sequence order_seq start 10001;
create function place_order(p_customer jsonb,p_items jsonb,p_payment text) returns text language plpgsql security definer as $$
declare it jsonb;p products;oid bigint;num text;sub numeric:=0;q int;
begin
 if jsonb_array_length(p_items)=0 then raise exception 'Your cart is empty.'; end if;
 num:='CP'||nextval('order_seq');
 insert into orders(number,name,email,address,city,country,payment_method,total) values(num,p_customer->>'name',p_customer->>'email',p_customer->>'address',p_customer->>'city',p_customer->>'country',p_payment,0) returning id into oid;
 for it in select * from jsonb_array_elements(p_items) loop
  q:=(it->>'qty')::int;
  if q<1 then raise exception 'Invalid quantity.'; end if;
  update products set stock=stock-q where sku=it->>'sku' and stock>=q returning * into p;
  if not found then raise exception 'Sorry, % is out of stock or does not have enough units left.',coalesce((select title from products where sku=it->>'sku'),'an item'); end if;
  insert into order_items(order_id,sku,title,price,qty) values(oid,p.sku,p.title,p.price,q);
  sub:=sub+p.price*q;
 end loop;
 update orders set total=sub+25 where id=oid;
 return num;
end $$;
create function reset_demo() returns void language sql security definer as $$
 update orders set archived=true where archived=false and id in(select order_id from order_items where sku='CP-CUE-002');
 update products set stock=1 where sku='CP-CUE-002';
$$;
revoke all on function place_order(jsonb,jsonb,text) from public,anon,authenticated;
revoke all on function reset_demo() from public,anon,authenticated;
insert into products(sku,title,category,price,stock,description,image_url) values
('CP-CUE-001','Classic Maple Pool Cue','Cues',199,35,'<ul><li>Classic maple construction</li><li>Smooth and balanced feel</li><li>Ideal for everyday play</li></ul>','https://i.ibb.co/KjJjK27d/Class-Maple-Pool-Cue-Image.png'),
('CP-CUE-002','Carbon Fiber Pro Cue','Cues',449,1,'<ul><li>Carbon fiber construction</li><li>Lightweight and durable</li><li>Designed for precision play</li></ul>','https://i.ibb.co/QFjPV962/Carbon-Fiber-Pro-Cue-Image.png'),
('CP-CUE-003','Break Cue','Cues',299,24,'<ul><li>Designed for powerful breaks</li><li>Strong and durable construction</li><li>Comfortable grip</li></ul>','https://i.ibb.co/mVYcmbmx/Break-Cue-Image.png'),
('CP-ACC-001','Premium Billiard Chalk Set','Accessories',25,120,'<ul><li>High-quality billiard chalk</li><li>Improves cue tip grip</li><li>Multiple pieces included</li></ul>','https://i.ibb.co/HpVfFWJh/Premium-Billiard-Chalk-Set-Image.png'),
('CP-ACC-002','Professional Billiard Glove','Accessories',35,75,'<ul><li>Smooth low-friction material</li><li>Comfortable flexible fit</li><li>Improves cue movement</li></ul>','https://i.ibb.co/N6Xp1Sty/Professional-Billiard-Glove-Image.png'),
('CP-ACC-003','Cue Tip Maintenance Kit','Accessories',45,50,'<ul><li>Essential cue tip tools</li><li>Helps shape and maintain tips</li><li>Compact and portable</li></ul>','https://i.ibb.co/Zpht6RPV/Cue-Tip-Maintenance-Kit-Image.png'),
('CP-ACC-004','Tournament Billiard Ball Set','Accessories',249,30,'<ul><li>Complete billiard ball set</li><li>Consistent size and weight</li><li>Designed for competitive play</li></ul>','https://i.ibb.co/w5dsgsh/Tournament-Billiard-Ball-Set-Image.png'),
('CP-EQP-001','Hard Shell Cue Case','Equipment',149,45,'<ul><li>Protective hard shell</li><li>Secure cue storage</li><li>Easy to carry</li></ul>','https://i.ibb.co/TDdmckrM/Hard-Shell-Cue-Case-Image.png'),
('CP-EQP-002','Wall-Mounted Cue Rack','Equipment',179,20,'<ul><li>Wall-mounted design</li><li>Keeps cues organized</li><li>Space-saving storage</li></ul>','https://i.ibb.co/1tzC3p4q/Wall-Mounted-Cue-Rack-Image.png'),
('CP-EQP-003','Wooden Triangle Rack','Equipment',59,60,'<ul><li>Durable wooden construction</li><li>Standard triangle design</li><li>Easy ball setup</li></ul>','https://i.ibb.co/mVnsFmqy/Wooden-Triangle-Rack-Image.png');
