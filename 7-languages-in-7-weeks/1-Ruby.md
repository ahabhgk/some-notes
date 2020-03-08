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
mixin tofile
```

