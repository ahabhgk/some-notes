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