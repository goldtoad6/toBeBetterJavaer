---
title: Java创建的对象到底放在哪？新生代还是老年代？
shortTitle: Java创建的对象到底放在哪？
category:
  - Java核心
tag:
  - Java虚拟机
description: Java 创建的对象到底放在哪？新生代还是老年代？本篇内容我们主要介绍了 Java 创建的对象到底放在哪？新生代还是老年代？，包括对象优先在 Eden 分配、大对象直接进入老年代、长期存活的对象将进入老年代、动态年龄判断、空间分配担保等内容。
head:
  - - meta
    - name: keywords
      content: Java,JavaSE,教程,二哥的Java进阶之路,jvm,Java虚拟机,对象,堆,新生代,老年代,Eden,From Survivor,To Survivor
---


经过前面章节的学习，详细大家都知道了，Java 的对象是在堆中创建的，但堆又分为新生代和老年代，新生代又细分为 Eden、From Survivor、To Survivor。**那我们创建的对象到底在哪里**？

![](https://cdn.tobebetterjavaer.com/stutymore/gc-20231227131241.png)

其实这部分内容我们在讲[垃圾回收机制](https://javabetter.cn/jvm/gc.html)的时候提到过了，但没有细讲，这次我们就来详细讲讲。

## 对象优先在 Eden 分配

堆分为新生代和老年代，新生代用于存放使用后就要被回收的对象（朝生夕死），老年代用于存放生命周期比较长的对象。

我们创建的大部分对象，都属于生命周期较短的对象，所以会存放在新生代。新生代又细分 Eden、From Survivor、To Survivor，那我们创建的对象会优先在 Eden 区分配，见下图。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/whereis-the-object-1.png)

随着对象的不断创建，Eden 剩余地内存空间就会越来越少，随后就会触发 Minor GC，于是 JVM 会把 Eden 区存活的对象转入 From Survivor 空间。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/whereis-the-object-2.png)

Minor GC 后，又创建的新对象会继续往 Eden 区分配。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/whereis-the-object-3.png)

于是，随着新对象的创建，Eden 的剩余内存空间就会越来越少，又会触发 Minor GC，此时，JVM 会对 Eden 区和 From Survivor 区中的对象进行存活判断，对于存活的对象，会转移到 To Survivor 区。

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/whereis-the-object-4.png)

下一次 Minor GC，存活的对象又会从 To 到 From，这样就总有一个 Survivor 区是空的，而另外一个是无碎片的。

## 大对象直接进入老年代

对于上面的流程，也有例外的存在，如果一个对象很大，一直在 Survivor 空间复制来复制去，就会很浪费性能，所以这些大对象会直接进入老年代。

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/whereis-the-object-5.png)

这种策略的目的是减少[垃圾回收](https://javabetter.cn/jvm/gc.html)时的复制开销，因为大对象的复制比小对象更耗时。

可以通过 `-XX:PretenureSizeThreshold` 参数设置直接分配大对象到老年代的阈值。如果对象的大小超过这个阈值，它将直接在老年代中分配。例如，如果想将阈值设置为 1MB（1024KB），可以这样设置：

```
-XX:PretenureSizeThreshold=1048576
```


## 长期存活的对象将进入老年代

对象在每次从一个 Survivor 区转移到另外一个 Survivor 区时，它的年龄就会增加。当对象的年龄达到一定阈值（默认为 15），则它会被转移到老年代。

可以用 `-XX:PretenureSizeThreshold=10` 来设置年龄。

虚拟机为了给对象计算他到底经历了几次 Minor GC，会给每个对象定义了一个对象年龄计数器。如果对象在 Eden 中经过第一次 Minor GC 后仍然存活，移动到 Survivor 空间年龄加 1，在 Survivor 区中每经历过 Minor GC 后仍然存活年龄再加 1。年龄到了 15，就到了老年代。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/whereis-the-object-6.png)


## 动态年龄判断

除了年龄达到 MaxTenuringThreshold，还有另外一个方式进入老年代，那就是动态年龄判断：JVM 会检查每个年龄段的对象大小，并估算它们在 Survivor 空间中所占的总体积。JVM 会选择一个最小的年龄，使得该年龄及以上的对象可以填满 Survivor 空间的一部分（通常小于总空间的一半），然后将这些对象晋升到老年代。

比如 Survivor 是 100M，Hello1 和 Hello2 都是 3 岁，且总和超过了 50M，Hello3 是 4 岁，这个时候，这三个对象都将到老年代。

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/whereis-the-object-7.png)

## 空间分配担保

上面提到过，存活的对象会放入另外一个 Survivor 空间，如果这些存活的对象比 Survivor 空间还大呢？

整个流程如下：

- Minor GC 之前，JVM 会先检查老年代最大可用的连续空间是否大于新生代所有对象的总空间，如果大于，则发起 Minor GC。
- 如果小于，则看 HandlePromotionFailure 有没有设置，如果没有设置，就发起 Full GC。
- 如果设置了 HandlePromotionFailure，则看老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小，如果小于，就发起 Full GC。
- 如果大于，发起 Minor GC。Minor GC 后，看 Survivor 空间是否足够存放存活对象，如果不够，就放入老年代，如果够放，就直接存放 Survivor 空间。如果老年代都不够放存活对象，担保失败（Handle Promotion Failure），发起 Full GC。


![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/jvm/whereis-the-object-8.png)

>HandlePromotionFailure 的作用，当设置为 true 时（默认值），JVM 会尝试继续 Minor GC，即使老年代空间不足以容纳所有需要晋升的对象。JVM 会尝试清理更多的老年代空间或者采用其他措施来应对空间不足的情况。避免因为老年代空间不足而过早触发 Full GC（全堆回收）。Full GC 通常比 Minor GC 更耗时，会导致更长时间的停顿。

## 栈和方法区

Java 创建的对象几乎都在堆中，这包括通过 new 关键字创建的对象和数组。

对象的引用，通常存放在[栈](https://javabetter.cn/jvm/neicun-jiegou.html)中，比如说当你在方法中声明一个变量 `MyClass obj = new MyClass();` 时，变量 obj（一个指向堆中对象的引用）存储在栈上。

方法区用于存储已被 JVM 加载的类信息、常量、静态变量以及即时编译器编译后的代码。

Java 8 中，永久代被元空间（Metaspace）所取代。元空间使用本地内存（操作系统的内存），而非 JVM 内存。

## 小结

这篇内容我们主要讲了：

- Java 创建的对象优先在 Eden 区分配。
- 大对象直接进入老年代。
- 长期存活的对象将进入老年代。
- 动态年龄判断。
- 空间分配担保。

算是对我们之前讲过的[垃圾回收机制](https://javabetter.cn/jvm/gc.html)中对象的转移做了补充。了解这些内存区域对于理解 Java 的内存管理和优化程序性能非常重要。



----

GitHub 上标星 10000+ 的开源知识库《[二哥的 Java 进阶之路](https://github.com/itwanger/toBeBetterJavaer)》第一版 PDF 终于来了！包括Java基础语法、数组&字符串、OOP、集合框架、Java IO、异常处理、Java 新特性、网络编程、NIO、并发编程、JVM等等，共计 32 万余字，500+张手绘图，可以说是通俗易懂、风趣幽默……详情戳：[太赞了，GitHub 上标星 10000+ 的 Java 教程](https://javabetter.cn/overview/)


微信搜 **沉默王二** 或扫描下方二维码关注二哥的原创公众号沉默王二，回复 **222** 即可免费领取。

![](https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png)