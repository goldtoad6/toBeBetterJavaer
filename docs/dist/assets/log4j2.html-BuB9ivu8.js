import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,o as a,e as n}from"./app-C_mUfYFF.js";const e={},l=n(`<p>Log4j 2，顾名思义，它就是 Log4j 的升级版，就好像手机里面的 Pro 版。我作为一个写文章方面的工具人，或者叫打工人，怎么能不写完这最后一篇。</p><p>Log4j、SLF4J、Logback 是一个爹——Ceki Gulcu，但 Log4j 2 却是例外，它是 Apache 基金会的产品。</p><p>SLF4J 和 Logback 作为 Log4j 的替代品，在很多方面都做了必要的改进，那为什么还需要 Log4j 2 呢？我只能说 Apache 基金会的开发人员很闲，不，很拼，要不是他们这种精益求精的精神，这个编程的世界该有多枯燥，毕竟少了很多可以用“拿来就用”的轮子啊。</p><p>上一篇也说了，老板下死命令要我把日志系统切换到 Logback，我顺利交差了，老板很开心，夸我这个打工人很敬业。为了表达对老板的这份感谢，我决定偷偷摸摸地试水一下 Log4j 2，尽管它还不是个成品，可能会会项目带来一定的隐患。但谁让咱是一个敬岗爱业的打工人呢。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-a9461265-7652-4512-9219-6b3e82392415.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_01、log4j-2-强在哪" tabindex="-1"><a class="header-anchor" href="#_01、log4j-2-强在哪"><span>01、Log4j 2 强在哪</span></a></h3><p>1）在多线程场景下，Log4j 2 的吞吐量比 Logback 高出了 10 倍，延迟降低了几个数量级。这话听起来像吹牛，反正是 Log4j 2 官方自己吹的。</p><p>Log4j 2 的异步 Logger 使用的是无锁数据结构，而 Logback 和 Log4j 的异步 Logger 使用的是 ArrayBlockingQueue。对于阻塞队列，多线程应用程序在尝试使日志事件入队时通常会遇到锁争用。</p><p>下图说明了多线程方案中无锁数据结构对吞吐量的影响。 Log4j 2 随着线程数量的扩展而更好地扩展：具有更多线程的应用程序可以记录更多的日志。其他日志记录库由于存在锁竞争的关系，在记录更多线程时，总吞吐量保持恒定或下降。这意味着使用其他日志记录库，每个单独的线程将能够减少日志记录。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-43f0b03d-5c4a-4af3-9e4c-177956246740.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>性能方面是 Log4j 2 的最大亮点，至于其他方面的一些优势，比如说下面这些，可以忽略不计，文字有多短就代表它有多不重要。</p><p>2）Log4j 2 可以减少垃圾收集器的压力。</p><p>3）支持 Lambda 表达式。</p><p>4）支持自动重载配置。</p><h3 id="_02、log4j-2-使用示例" tabindex="-1"><a class="header-anchor" href="#_02、log4j-2-使用示例"><span>02、Log4j 2 使用示例</span></a></h3><p>废话不多说，直接实操开干。理论知识有用，但不如上手实操一把，这也是我多年养成的一个“不那么良好”的编程习惯：在实操中发现问题，解决问题，寻找理论基础。</p><p><strong>第一步</strong>，在 pom.xml 文件中添加 Log4j 2 的依赖：</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;org.apache.logging.log4j&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;log4j-api&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;2.5&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;org.apache.logging.log4j&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">groupId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;log4j-core&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">artifactId</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;2.5&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">dependency</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>（这个 artifactId 还是 log4j，没有体现出来 2，而在 version 中体现，多少叫人误以为是 log4j）</p><p><strong>第二步</strong>，来个最简单的测试用例：</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> org.apache.logging.log4j.LogManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">import</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> org.apache.logging.log4j.Logger</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Demo</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> final</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Logger</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> logger </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> LogManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">getLogger</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">Demo</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">class</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> main</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">String</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">[] </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;--shiki-light-font-style:inherit;--shiki-dark-font-style:italic;">args</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        logger</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">debug</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;log4j2&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行 Demo 类，可以在控制台看到以下信息：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>ERROR StatusLogger No log4j2 configuration file found. Using default configuration: logging only errors to the console.</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Log4j 2 竟然没有在控制台打印“ log4j2”，还抱怨我们没有为它指定配置文件。在这一点上，我就觉得它没有 Logback 好，毕竟人家会输出。</p><p>这对于新手来说，很不友好，因为新手在遇到这种情况的时候，往往不知所措。日志里面虽然体现了 ERROR，但代码并没有编译出错或者运行出错，凭什么你不输出？</p><p>那作为编程老鸟来说，我得告诉你，这时候最好探究一下为什么。怎么做呢？</p><p>我们可以复制一下日志信息中的关键字，比如说：“No log4j2 configuration file found”，然后在 Intellij IDEA 中搜一下，如果你下载了源码和文档的话，不除意外，你会在 ConfigurationFactory 类中搜到这段话。</p><p>可以在方法中打个断点，然后 debug 一下，你就会看到下图中的内容。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-4ba440d9-c0b6-4ad2-b538-9d303cc99d90.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>通过源码，你可以看得到，Log4j 2 会去寻找 4 种类型的配置文件，后缀分别是 properties、yaml、json 和 xml。前缀是 log4j2-test 或者 log4j2。</p><p>得到这个提示后，就可以进行第三步了。</p><p>**第三步，**在 resource 目录下增加 log4j2-test.xml 文件（方便和 Logback 做对比），内容如下所示：</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;?</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">xml</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> version</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;1.0&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> encoding</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;UTF-8&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">?&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Configuration</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Appenders</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Console</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;Console&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> target</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;SYSTEM_OUT&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">PatternLayout</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> pattern</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">/&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        &lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Console</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Appenders</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Loggers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Root</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> level</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;DEBUG&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">            &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">AppenderRef</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> ref</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;Console&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">/&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        &lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Root</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Loggers</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">Configuration</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Log4j 2 的配置文件格式和 Logback 有点相似，基本的结构为 <code>&lt; Configuration&gt;</code> 元素，包含 0 或多个 <code>&lt; Appenders&gt;</code> 元素，其后跟 0 或多个 <code>&lt; Loggers&gt;</code> 元素，里面再跟最多只能存在一个的 <code>&lt; Root&gt;</code> 元素。</p><p><strong>1）配置 appender</strong>，也就是配置日志的输出目的地。</p><p>有 Console，典型的控制台配置信息上面你也看到了，我来简单解释一下里面 pattern 的格式：</p><ul><li><p><code>%d{HH:mm:ss.SSS}</code> 表示输出到毫秒的时间</p></li><li><p><code>%t</code> 输出当前线程名称</p></li><li><p><code>%-5level</code> 输出日志级别，-5 表示左对齐并且固定输出 5 个字符，如果不足在右边补空格</p></li><li><p><code>%logger</code> 输出 logger 名称，最多 36 个字符</p></li><li><p><code>%msg</code> 日志文本</p></li><li><p><code>%n</code> 换行</p></li></ul><p>顺带补充一下其他常用的占位符：</p><ul><li><p><code>%F</code> 输出所在的类文件名，如 Demo.java</p></li><li><p><code>%L</code> 输出行号</p></li><li><p><code>%M</code> 输出所在方法名</p></li><li><p><code>%l</code> 输出语句所在的行数, 包括类名、方法名、文件名、行数</p></li><li><p><code>%p</code> 输出日志级别</p></li><li><p><code>%c</code> 输出包名，如果后面跟有 <code>{length.}</code> 参数，比如说 <code>%c{1.}</code>，它将输出报名的第一个字符，如 <code>com.itwanger</code> 的实际报名将只输出 <code>c.i</code></p></li></ul><p>再次运行 Demo 类，就可以在控制台看到打印的日志信息了：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>10:14:04.657 [main] DEBUG com.itwanger.Demo - log4j2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p><strong>2）配置 Loggers</strong>，指定 Root 的日志级别，并且指定具体启用哪一个 Appenders。</p><p><strong>3）自动重载配置</strong>。</p><p>Logback 支持自动重载配置，Log4j 2 也支持，那想要启用这个功能也非常简单，只需要在 Configuration 元素上添加 <code>monitorInterval</code> 属性即可。</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;Configuration monitorInterval=&quot;30&quot;&gt;</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>&lt;/Configuration&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意值要设置成非零，上例中的意思是至少 30 秒后检查配置文件中的更改。最小间隔为 5 秒。</p><h3 id="_03、async-示例" tabindex="-1"><a class="header-anchor" href="#_03、async-示例"><span>03、Async 示例</span></a></h3><p>除了 Console，还有 Async，可以配合文件的方式来异步写入，典型的配置信息如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;Configuration&gt;</span></span>
<span class="line"><span>  &lt;Appenders&gt;</span></span>
<span class="line"><span>    &lt;File name=&quot;DebugFile&quot; fileName=&quot;debug.log&quot;&gt;</span></span>
<span class="line"><span>      &lt;PatternLayout&gt;</span></span>
<span class="line"><span>        &lt;Pattern&gt;%d %p %c [%t] %m%n&lt;/Pattern&gt;</span></span>
<span class="line"><span>      &lt;/PatternLayout&gt;</span></span>
<span class="line"><span>    &lt;/File&gt;</span></span>
<span class="line"><span>    &lt;Async name=&quot;Async&quot;&gt;</span></span>
<span class="line"><span>      &lt;AppenderRef ref=&quot;DebugFile&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/Async&gt;</span></span>
<span class="line"><span>  &lt;/Appenders&gt;</span></span>
<span class="line"><span>  &lt;Loggers&gt;</span></span>
<span class="line"><span>    &lt;Root level=&quot;debug&quot;&gt;</span></span>
<span class="line"><span>      &lt;AppenderRef ref=&quot;Async&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/Root&gt;</span></span>
<span class="line"><span>  &lt;/Loggers&gt;</span></span>
<span class="line"><span>&lt;/Configuration&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对比 Logback 的配置文件来看，Log4j 2 真的复杂了一些，不太好用，就这么直白地说吧！但自己约的，含着泪也得打完啊。把这个 Async 加入到 Appenders：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;Configuration&gt;</span></span>
<span class="line"><span>    &lt;Appenders&gt;</span></span>
<span class="line"><span>        &lt;Console name=&quot;Console&quot; target=&quot;SYSTEM_OUT&quot;&gt;</span></span>
<span class="line"><span>            &lt;PatternLayout pattern=&quot;%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/Console&gt;</span></span>
<span class="line"><span>        &lt;File name=&quot;DebugFile&quot; fileName=&quot;debug.log&quot;&gt;</span></span>
<span class="line"><span>            &lt;PatternLayout&gt;</span></span>
<span class="line"><span>                &lt;Pattern&gt;%d %p %c [%t] %m%n&lt;/Pattern&gt;</span></span>
<span class="line"><span>            &lt;/PatternLayout&gt;</span></span>
<span class="line"><span>        &lt;/File&gt;</span></span>
<span class="line"><span>        &lt;Async name=&quot;Async&quot;&gt;</span></span>
<span class="line"><span>            &lt;AppenderRef ref=&quot;DebugFile&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/Async&gt;</span></span>
<span class="line"><span>    &lt;/Appenders&gt;</span></span>
<span class="line"><span>    &lt;Loggers&gt;</span></span>
<span class="line"><span>        &lt;Root level=&quot;DEBUG&quot;&gt;</span></span>
<span class="line"><span>            &lt;AppenderRef ref=&quot;Console&quot;/&gt;</span></span>
<span class="line"><span>            &lt;AppenderRef ref=&quot;Async&quot;/&gt;</span></span>
<span class="line"><span>        &lt;/Root&gt;</span></span>
<span class="line"><span>    &lt;/Loggers&gt;</span></span>
<span class="line"><span>&lt;/Configuration&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再次运行 Demo 类，可以在项目根路径下看到一个 debug.log 文件，内容如下所示：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>2020-10-30 09:35:49,705 DEBUG com.itwanger.Demo [main] log4j2</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="_04、rollingfile-示例" tabindex="-1"><a class="header-anchor" href="#_04、rollingfile-示例"><span>04、RollingFile 示例</span></a></h3><p>当然了，Log4j 和 Logback 我们都配置了 RollingFile，Log4j 2 也少不了。RollingFile 会根据 Triggering（触发）策略和 Rollover（过渡）策略来进行日志文件滚动。如果没有配置 Rollover，则使用 DefaultRolloverStrategy 来作为 RollingFile 的默认配置。</p><p>触发策略包含有，基于 cron 表达式（源于希腊语，时间的意思，用来配置定期执行任务的时间格式）的 CronTriggeringPolicy；基于文件大小的 SizeBasedTriggeringPolicy；基于时间的 TimeBasedTriggeringPolicy。</p><p>过渡策略包含有，默认的过渡策略 DefaultRolloverStrategy，直接写入的 DirectWriteRolloverStrategy。一般情况下，采用默认的过渡策略即可，它已经足够强大。</p><p>来看第一个基于 SizeBasedTriggeringPolicy 和 TimeBasedTriggeringPolicy 策略，以及缺省 DefaultRolloverStrategy 策略的配置示例：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;Configuration&gt;</span></span>
<span class="line"><span>  &lt;Appenders&gt;</span></span>
<span class="line"><span>    &lt;RollingFile name=&quot;RollingFile&quot; fileName=&quot;rolling.log&quot;</span></span>
<span class="line"><span>                 filePattern=&quot;rolling-%d{yyyy-MM-dd}-%i.log&quot;&gt;</span></span>
<span class="line"><span>      &lt;PatternLayout&gt;</span></span>
<span class="line"><span>        &lt;Pattern&gt;%d %p %c{1.} [%t] %m%n&lt;/Pattern&gt;</span></span>
<span class="line"><span>      &lt;/PatternLayout&gt;</span></span>
<span class="line"><span>      &lt;Policies&gt;</span></span>
<span class="line"><span>        &lt;SizeBasedTriggeringPolicy size=&quot;1 KB&quot;/&gt;</span></span>
<span class="line"><span>      &lt;/Policies&gt;</span></span>
<span class="line"><span>    &lt;/RollingFile&gt;</span></span>
<span class="line"><span>  &lt;/Appenders&gt;</span></span>
<span class="line"><span>  &lt;Loggers&gt;</span></span>
<span class="line"><span>    &lt;Root level=&quot;debug&quot;&gt;</span></span>
<span class="line"><span>      &lt;AppenderRef ref=&quot;RollingFile&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/Root&gt;</span></span>
<span class="line"><span>  &lt;/Loggers&gt;</span></span>
<span class="line"><span>&lt;/Configuration&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>为了验证文件的滚动策略，我们调整一下 Demo 类，让它多打印点日志：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>for (int i = 1;i &lt; 20; i++) {</span></span>
<span class="line"><span>    logger.debug(&quot;微信搜索「{}」，回复关键字「{}」，有惊喜哦&quot;,&quot;沉默王二&quot;, &quot;java&quot;);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再次运行 Demo 类，可以看到根目录下多了 3 个日志文件：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-07af98ca-cf94-427e-adb6-bd935e32a8d0.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>结合日志文件名，再来看 RollingFile 的配置，就很容易理解了。</p><p>1）fileName 用来指定文件名。</p><p>2）filePattern 用来指定文件名的模式，它取决于过渡策略。</p><p>由于配置文件中没有显式指定过渡策略，因此 RollingFile 会启用默认的 DefaultRolloverStrategy。</p><p>先来看一下 DefaultRolloverStrategy 的属性：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-32b853ce-8beb-496b-b66f-31b650c257ab.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>再来看 filePattern 的值 <code>rolling-%d{yyyy-MM-dd}-%i.log</code>，其中 <code>%d{yyyy-MM-dd}</code> 很好理解，就是年月日；其中 <code>%i</code> 是什么意思呢？</p><p>第一个日志文件名为 rolling.log（最近的日志放在这个里面），第二个文件名除去日期为 rolling-1.log，第二个文件名除去日期为 rolling-2.log，根据这些信息，你能猜到其中的规律吗？</p><p>其实和 DefaultRolloverStrategy 中的 max 属性有关，目前使用的默认值，也就是 7，那就当 rolling-8.log 要生成的时候，删除 rolling-1.log。可以调整 Demo 中的日志输出量来进行验证。</p><p>3）SizeBasedTriggeringPolicy，基于日志文件大小的时间策略，大小以字节为单位，后缀可以是 KB，MB 或 GB，例如 20 MB。</p><p>再来看一个日志文件压缩的示例，来看配置：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>&lt;RollingFile name=&quot;RollingFileGZ&quot; fileName=&quot;gz/rolling.log&quot;</span></span>
<span class="line"><span>             filePattern=&quot;gz/%d{yyyy-MM-dd-HH}-%i.rolling.gz&quot;&gt;</span></span>
<span class="line"><span>    &lt;PatternLayout&gt;</span></span>
<span class="line"><span>        &lt;Pattern&gt;%d %p %c{1.} [%t] %m%n&lt;/Pattern&gt;</span></span>
<span class="line"><span>    &lt;/PatternLayout&gt;</span></span>
<span class="line"><span>    &lt;Policies&gt;</span></span>
<span class="line"><span>        &lt;SizeBasedTriggeringPolicy size=&quot;1 KB&quot;/&gt;</span></span>
<span class="line"><span>    &lt;/Policies&gt;</span></span>
<span class="line"><span>&lt;/RollingFile&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>fileName 的属性值中包含了一个目录 gz，也就是说日志文件都将放在这个目录下。</p></li><li><p>filePattern 的属性值中增加了一个 gz 的后缀，这就表明日志文件要进行压缩了，还可以是 zip 格式。</p></li></ul><p>运行 Demo 后，可以在 gz 目录下看到以下文件：</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-1b04167d-a11f-4447-9062-cb3cdd59aa73.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>到此为止，Log4j 2 的基本使用示例就已经完成了。测试环境搞定，我去问一下老板，要不要在生产环境下使用 Log4j 2。</p><figure><img src="https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>`,80),t=[l];function p(g,r){return a(),i("div",null,t)}const h=s(e,[["render",p],["__file","log4j2.html.vue"]]),c=JSON.parse('{"path":"/gongju/log4j2.html","title":"Log4j 2：Apache维护的一款高性能日志记录工具","lang":"zh-CN","frontmatter":{"title":"Log4j 2：Apache维护的一款高性能日志记录工具","category":["Java企业级开发"],"tag":["辅助工具/轮子"],"description":"Log4j 2，顾名思义，它就是 Log4j 的升级版，就好像手机里面的 Pro 版。我作为一个写文章方面的工具人，或者叫打工人，怎么能不写完这最后一篇。 Log4j、SLF4J、Logback 是一个爹——Ceki Gulcu，但 Log4j 2 却是例外，它是 Apache 基金会的产品。 SLF4J 和 Logback 作为 Log4j 的替代品...","head":[["meta",{"property":"og:url","content":"https://javabetter.cn/gongju/log4j2.html"}],["meta",{"property":"og:site_name","content":"二哥的Java进阶之路"}],["meta",{"property":"og:title","content":"Log4j 2：Apache维护的一款高性能日志记录工具"}],["meta",{"property":"og:description","content":"Log4j 2，顾名思义，它就是 Log4j 的升级版，就好像手机里面的 Pro 版。我作为一个写文章方面的工具人，或者叫打工人，怎么能不写完这最后一篇。 Log4j、SLF4J、Logback 是一个爹——Ceki Gulcu，但 Log4j 2 却是例外，它是 Apache 基金会的产品。 SLF4J 和 Logback 作为 Log4j 的替代品..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-a9461265-7652-4512-9219-6b3e82392415.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-07-25T09:46:09.000Z"}],["meta",{"property":"article:author","content":"沉默王二"}],["meta",{"property":"article:tag","content":"辅助工具/轮子"}],["meta",{"property":"article:modified_time","content":"2024-07-25T09:46:09.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Log4j 2：Apache维护的一款高性能日志记录工具\\",\\"image\\":[\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-a9461265-7652-4512-9219-6b3e82392415.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-43f0b03d-5c4a-4af3-9e4c-177956246740.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-4ba440d9-c0b6-4ad2-b538-9d303cc99d90.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-07af98ca-cf94-427e-adb6-bd935e32a8d0.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-32b853ce-8beb-496b-b66f-31b650c257ab.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongju/log4j2-1b04167d-a11f-4447-9062-cb3cdd59aa73.png\\",\\"https://cdn.tobebetterjavaer.com/tobebetterjavaer/images/gongzhonghao.png\\"],\\"dateModified\\":\\"2024-07-25T09:46:09.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"沉默王二\\",\\"url\\":\\"/about-the-author/\\"}]}"]]},"headers":[{"level":3,"title":"01、Log4j 2 强在哪","slug":"_01、log4j-2-强在哪","link":"#_01、log4j-2-强在哪","children":[]},{"level":3,"title":"02、Log4j 2 使用示例","slug":"_02、log4j-2-使用示例","link":"#_02、log4j-2-使用示例","children":[]},{"level":3,"title":"03、Async 示例","slug":"_03、async-示例","link":"#_03、async-示例","children":[]},{"level":3,"title":"04、RollingFile 示例","slug":"_04、rollingfile-示例","link":"#_04、rollingfile-示例","children":[]}],"git":{"createdTime":1647487083000,"updatedTime":1721900769000,"contributors":[{"name":"沉默王二","email":"www.qing_gee@163.com","commits":1}]},"readingTime":{"minutes":8.93,"words":2680},"filePathRelative":"gongju/log4j2.md","localizedDate":"2022年3月17日","excerpt":"<p>Log4j 2，顾名思义，它就是 Log4j 的升级版，就好像手机里面的 Pro 版。我作为一个写文章方面的工具人，或者叫打工人，怎么能不写完这最后一篇。</p>\\n<p>Log4j、SLF4J、Logback 是一个爹——Ceki Gulcu，但 Log4j 2 却是例外，它是 Apache 基金会的产品。</p>\\n<p>SLF4J 和 Logback 作为 Log4j 的替代品，在很多方面都做了必要的改进，那为什么还需要 Log4j 2 呢？我只能说 Apache 基金会的开发人员很闲，不，很拼，要不是他们这种精益求精的精神，这个编程的世界该有多枯燥，毕竟少了很多可以用“拿来就用”的轮子啊。</p>","autoDesc":true}');export{h as comp,c as data};