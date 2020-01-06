# MySQL 必知必会

主键：一列（或一组列），其值能够唯一区分表中每个行

* 任意两行都不具有相同的主键值

* 每一行都必须具有一个主键（不为 NULL）

习惯：

* 不更新主键列中的值

* 不重用主键列中的值

* 不在主键列中使用可能会更改的值

```sql
SHOW DATABASES;
SHOW TABLES;
SHOW COLUMNS FROM klass; -- 返回当前选择的数据库内可用表的列表，可用 DESCRIBE klass; 代替
SHOW STATUS; -- 用于显示广泛的服务器状态信息
SHOW CREATE DATABASE; -- 显示创建特定数据库
SHOW CREATE TABLE; -- 显示创建特定表的MySQL语句
SHOW GRANTS; -- 用来显示授予用户（所有用户或特定用户）的安全权限
SHOW ERRORS; -- 错误信息
SHOW WARNINGS; -- 警告消息

HELP SHOW;
```

```sql
SELECT staff_id FROM staff;
SELECT staff_id, wage FROM staff;
SELECT * FROM staff;
SELECT DISTINCT staff_id FROM staff; -- 去重
SELECT * FROM staff LIMIT 5; -- 返回不超过 5 行
SELECT * FROM staff LIMIT 5, 5; -- 下一个 5 行，LIMIT 5 OFFSET 5
SELECT staff.staff_id FROM klass.staff;
SELECT city FROM warehouses ORDER BY city; -- city 的字母顺序
SELECT * FROM warehouses ORDER BY size, city; -- 先按 size 排序，再按 city 排序
SELECT * FROM warehouses ORDER BY size DESC, city ASC; -- DESC 降序
SELECT * FROM warehosues WHERE size <> 570;
SELECT * FROM warehosues WHERE size BETWEEN 500 AND 600;
SELECT * FROM order_form WHERE vendor_id IS NOT NULL; -- IS NULL
SELECT * FROM staff WHERE warehouse_id = 'WH2' AND wage > 1230; -- AND 与 OR 中，AND 优先级更高，是用括号避免错误
SELECT * FROM staff WHERE warehouse_id = 'WH2' OR warehouse_id = 'WH1'; -- 与使用 IN 相同
SELECT * FROM staff WHERE warehouse_id IN ('WH2', 'WH1'); -- IN 可配合 SELECT 子句
SELECT * FROM staff WHERE warehouse_id NOT IN ('WH2', 'WH1');
SELECT * FROM vendor WHERE vendor_name LIKE '_通%公司';-- “_”匹配一个，“%”匹配零到多个，通配符有性能问题，必要时使用
SELECT 'hello' REGEXP '[0-9]'; -- 可使用正则，转译用 “\\”
SELECT Concat(warehouse_id, ': ', Trim(city)) AS warehouse_title FROM warehouses; -- 拼接字段，大多数 SQL 使用 + 或 ||，MySQL 使用 Concat，AS 用作别名
SELECT prod_id, quantity, item_price, item_price * quantity AS expanded_price FROM orderitems WHERE order_num = 20005; -- 算数计算字段

-- 函数不具有可移植性，各个 SQL 的提供不一样
-- 文本处理函数、时间处理函数、数值处理函数
SELECT * FROM warehouses WHERE Lower(warehouse_id) = 'wh1';
SELECT * FROM order_form WHERE Month(`date`) = '06';
SELECT * FROM warehouses WHERE Mod(size, 100) = 0;
-- 聚集函数
SELECT AVG(wage) FROM staff;
SELECT AVG(DISTINCT wage) FROM staff; -- DISTINCT 聚集不同值

-- 分组
-- WHERE 之后 ORDER BY 之前
-- WHERE 过滤行 HAVING 过滤分组
-- WITH ROLLUP 获得每个分组以及每个分组汇总级别（针对每个分组）的值
SELECT vend_id, COUNT(*) AS prod_num FROM products WHERE prod_price >= 10 GROUP BY vend_id HAVING COUNT(*) >= 2;

-- 子查询
SELECT cust_name, cust_state, (SELECT COUNT(*) FROM orders WHERE orders.cust_id = customers.cust_id) AS orders FROM customers ORDER BY cust_name;
```

外键：外键为某个表中的一列，它包含另一个表的主键值，定义了两个表之间的关系

* 信息不重复，从而不浪费时间和空间

* 如果信息变动，可以只更新表中的单个记录，相关表中的数据不用改动

* 由于数据无重复，显然数据是一致的，这使得处理数据更简单

```sql
-- 联结性能消耗大
SELECT * FROM staff, warehouses; -- 笛卡尔积
SELECT * FROM staff, warehouses WHERE staff.warehouse_id = warehouses.warehouse_id;
SELECT * FROM staff INNER JOIN warehouses ON staff.warehouse_id = warehouses.warehouse_id; -- ANSI SQL 首选，但性能不如上一条好（忽略引擎优化）
```

假如你发现某物品(其ID为DTNTR)存在问题，因此想知道生产该物品的供应商生产的其他物品是否也存在这些问题。此查询要求首先找到 生产ID为DTNTR的物品的供应商，然后找出这个供应商生产的其他物品。 下面是解决此问题的一种方法:

```sql
SELECT prod_id, prod_name
FROM products
WHERE vend_id IN (SELECT vend_id
                  FROM products
                  WHERE prod_id = 'DTNTR');

SELECT p1.prod_id, p1.prod_name
FROM products AS p1, products AS p2
WHERE p1.vend_id = p2.vend_id
  AND p2.prod_id = 'DTNTR'; -- 性能好
```

join

```sql
SELECT * FROM staff CROSS JOIN warehouses; -- 笛卡尔积
SELECT * FROM staff NATURAL JOIN warehouses; -- 自然连接
SELECT * FROM staff INNER JOIN warehouses ON staff.warehouse_id = warehouses.warehouse_id;
SELECT * FROM staff, warehouses WHERE staff.warehouse_id = warehouses.warehouse_id; -- 内连接
SELECT * FROM staff LEFT OUTER JOIN warehouses ON staff.warehouse_id = warehouses.warehouse_id; -- 左外连接
```

![join](./images/join.png)

组合查询

```sql
SELECT * FROM staff WHERE warehouse_id = 'WH2' OR wage >= 1230;

SELECT * FROM staff WHERE warehouse_id = 'WH2'
UNION -- 不包含重复的列
SELECT * FROM staff WHERE wage >= 1230;

SELECT * FROM staff WHERE warehouse_id = 'WH2'
UNION ALL -- 包含重复的列
SELECT * FROM staff WHERE wage >= 1230;

SELECT * FROM staff WHERE warehouse_id = 'WH2'
UNION
SELECT * FROM staff WHERE wage >= 1230 ORDER BY wage; -- 是最后一个的组成部分，反对所有的结果都有效
```

插入

```sql
INSERT INTO customers(
  cust_name,
  cust_address,
  cust_city,
  cust_state,
  cust_country)
VALUES (
  'ahab',
  NULL,
  'hb',
  'study',
  'cn'), (
  'lj',
  NULL,
  'cd',
  'study',
  'cn'); -- 不依赖表中列的次序

INSERT INTO customers(
  cust_id,
  cust_name)
SELECT cust_id, cust_name
FROM cust_new; -- 根据列的次序进行插入
```

更新删除

```sql
UPDATE customers
SET cust_email = NULL
WHERE cust_name = 'ahab';

DELETE FROM customers
WHERE cust_id = 123;
-- 使用 WHERE，除非要更新删除每一行
```

创建

```sql
CREATE TABLE IF NOT EXISTS customers ( -- 创建新表时，表名必须不存在，IF NOT EXISTS 只检测表名不检测模式
  cust_id int NOT NULL AUTO_INCREMENT, -- 每个表只允许一个 AUTO_INCREMENT 列，且必须被索引，使用 SELECT last_insert_id() 确定最后一个 AUTO_INCREMENT 值
  cust_name char(50) NOT NULL,
  cust_address char(50) NULL DEFAULT 'cn',
  PRIMARY KEY (cust_id)) ENGINE = InnoDB; -- InnoDB 支持事务处理，MEMORY 功能同 MyISAM 但数据存在内存，速度极快，适合创建临时表，MyISAM 性能极高，支持全文本搜索，但不支持事务处理
```

更新表

```sql
ALTER TABLE customers
ADD cust_phone char(50);

ALTER TABLE customers
DROP cust_phone char(50);

ALTER TABLE customers
ADD CONSTRAINT fk_customers_school
FOREIGN KEY (cust_school_id) REFERENCES school (school_id),
ADD CONSTRAINT fk_customers_city
FOREIGN KEY (cust_city_id) REFERENCES home (city_id);
```

删除表

```sql
DROP TABLE customers;
```

重命名

```sql
RENAME TABLE
  backup_customers TO customers,
  backup_vendor TO vendor;
```

视图

* 重用SQL语句。

* 简化复杂的SQL操作。在编写查询后，可以方便地重用它而不必知道它的基本查询细节。

* 使用表的组成部分而不是整个表。

* 保护数据。可以给用户授予表的特定部分的访问权限而不是整个表的访问权限。

* 更改数据格式和表示。视图可返回与底层表的表示和格式不同的数据。

> 因为视图不包含数据，所以每次使用视图时，都 必须处理查询执行时所需的任一个检索。如果你用多个联结 和过滤创建了复杂的视图或者嵌套了视图，可能会发现性能 下降得很厉害

* ORDER BY可以用在视图中，但如果从该视图检索数据SELECT中也含有ORDER BY，那么该视图中的ORDER BY将被覆盖。

* 视图不能索引，也不能有关联的触发器或默认值。

* 视图可以和表一起使用。例如，编写一条联结表和视图的SELECT语句。

```sql
CREATE VIEW <viewname>
DROP VIEW <viewname>
CREATE OR REPLACE VIEW <viewname>

CREATE VIEW orderitemsexpanded AS
SELECT order_num,
  prod_id,
  item_price,
  quantity,
  quantity * item_price AS expanded_price
FROM orderitems;
```

> 一般，应该将视图用于检索(SELECT语句) 而不用于更新(INSERT、UPDATE和DELETE)。

存储过程

