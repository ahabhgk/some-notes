# Ruby

解释执行

无需声明变量

每条代码都有返回值

纯面向对象，“真一切皆为对象”

简洁的判断语句：`order.calculate_tax unless order.nil?`

鸭子类型

符号

```ruby
# :string 表示 symbol，:string.object_id == :string.object_id
def tell_the_truth(options={})
  if options[:profession] == :lawyer
    'it could be believed that this is almost certainly not false.'
  else
    true
  end
end

tell_the_truth
# => true
tell_the_truth :profession => :lawyer
# => "it could be believed that this is almost certainly not false."
a = {:profession => :lawyer, :string => 'hahha'} # 散列表
tell_the_truth a
# => "it could be believed that this is almost certainly not false."
```

代码块（匿名函数）

```ruby
animals = ['lions', 'tigers', 'bears', 'duck']
animals.each {|a| puts a}
# lions
# tigers
# bears
# duck
#  => ["lions", "tigers", "bears", "duck"]
```

yield 代码块

```ruby
class Fixnum
  def my_times
    i = self
    while i > 0
      i = i - 1
      yield
    end
  end
end

3.my_times {puts 'mangy moose'}
# mangy moose
# mangy moose
# mangy moose
#  => nil
```

&block 闭包

```ruby
def call_block(&block)
  block.call
end

def pass_block(&block)
  call_block(&block)
end

pass_block {puts 'helloo'}
# helloo
#  => nil
```

类

```ruby
4.class.superclass.superclass.superclass.superclass
# Integer Numeric Object BasicObject nil

4.class.class.superclass.superclass.superclass.superclass
# Integer Class Module Object BasicObject nil
```

```ruby

class Tree
  attr_accessor :children, :node_name

  def initialize(name, children = [])
    @children = children
    @node_name = name
  end

  def visit_all(&block)
    visit &block
    children.each {|c| c.visit_all &block}
  end

  def visit(&block)
    block.call self
  end
end

ruby_tree = Tree.new("Ruby", [Tree.new("Reia"), Tree.new("MacRuby")])
ruby_tree.visit {|node| puts node.node_name}
# Ruby
ruby_tree.visit_all {|node| puts node.node_name}
# Ruby
# Reia
# MacRuby
```

Mixin 多继承：Java 通过接口实现，Ruby 通过 Mixin，先定义类的主要部分，然后用模块添加额外功能

```ruby
module ToFile
  def to_f
    puts "mixin tofile"
  end
end

class Person
  include ToFile
  attr_accessor :name

  def initialize(name)
    @name = name
  end

  def to_s
    name
  end
end

Person.new('matz').to_f
# mixin tofile
```

可枚举（枚举模块）：让类可枚举，必须实现 each

```ruby
a = [5, 2, 4, 3, 1]
b = a.sort # [1, 2, 3, 4, 5]
a.any? {|i| i > 4} # true
a.all? {|i| i > 4} # false
c = a.collect {|i| i * 2} # [10, 4, 6, 8, 2]
d = a.select {|i| i % 2 == 0} # [2, 4]
a.member?(2) # true
a.inject(10) do |acc, cur|
  puts "acc: #{acc}, cur: #{cur}"
  acc + cur
end
#  => 25
```

可比较（比较模块）：让类可比较，必须实现 <=>

```ruby
'same' <=> 'same' # 0
```

## 元编程：写能写程序的程序

```ruby
# rails
class Department < ActiveRecord::Base
  has_many :employees
  has_one :manager
end
```

开放类：可以对类重新定义

```ruby
class NilClass
  def blank?
    true
  end
end

class String
  def blank?
    self.size == 0
  end
end

["", "person", nil].each do |e|
  puts e unless e.blank?
end
# "person"
```

method_missing：找不到默方法时调用，可以复写 method_missing 方法

```ruby
class Roman
  def self.method_missing name, *args
    roman = name.to_s
    roman.gsub("IV", "IIII")
    roman.gsub("IX", "VIIII")
    roman.gsub("XL", "XXXX")
    roman.gsub("XC", "LXXXX")

    (roman.count("I") +
     roman.count("V") * 5 +
     roman.count("X") * 10 +
     roman.count("L") * 50 +
     roman.count("C") * 100)
  end
end

puts Roman.XII # 12
```

动态的改变类：模块被另一模块包含，Ruby 就会调用该模块的 included 方法，类也是模块

## think

自由（有点像 JS 中修改原型，但平时更多是限制的）
